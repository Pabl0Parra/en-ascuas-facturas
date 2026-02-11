import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useRouter } from 'expo-router';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { ClientSection } from './ClientSection';
import { LineItemsList } from './LineItemsList';
import { IVAToggle } from './IVAToggle';
import { TotalsSummary } from './TotalsSummary';
import { useFormStore } from '../../stores/formStore';
import { useClientStore } from '../../stores/clientStore';
import { useDocumentStore } from '../../stores/documentStore';
import { createPDF } from '../../services/pdfGenerator';
import { savePDF, sharePDF } from '../../services/fileService';
import { generatePDFFileName } from '../../utils/idGenerator';
import {
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
  FONTS,
} from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import type { AppColors } from '../../constants/theme';
import { STRINGS } from '../../constants/strings';
import type { DocumentData, DocumentType, LineItem } from '../../types/document';

interface DocumentFormProps {
  tipo: DocumentType;
}

interface FormErrors {
  numeroDocumento?: string;
  fechaDocumento?: string;
  cliente?: string;
  lineas?: string;
  lineItemErrors?: Record<string, { descripcion?: boolean; precio?: boolean; cantidad?: boolean }>;
}

export const DocumentForm: React.FC<DocumentFormProps> = ({ tipo }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  // Form store
  const {
    numeroDocumento,
    fechaDocumento,
    selectedClientId,
    lineas,
    tipoIVA,
    comentarios,
    setNumeroDocumento,
    setFechaDocumento,
    setSelectedClient,
    addLinea,
    updateLinea,
    removeLinea,
    setTipoIVA,
    setComentarios,
    getBaseImponible,
    getImporteIVA,
    getTotal,
    resetForm,
  } = useFormStore();

  // Other stores
  const getClientById = useClientStore((state) => state.getClientById);
  const addDocument = useDocumentStore((state) => state.addDocument);

  const baseImponible = getBaseImponible();
  const importeIVA = getImporteIVA();
  const total = getTotal();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const newLineItemErrors: Record<string, { descripcion?: boolean; precio?: boolean; cantidad?: boolean }> = {};
    let hasLineItemErrors = false;

    if (tipo === 'factura' && !numeroDocumento.trim()) {
      newErrors.numeroDocumento = STRINGS.errors.campoRequerido;
    }

    if (!fechaDocumento.trim()) {
      newErrors.fechaDocumento = STRINGS.errors.campoRequerido;
    }

    // Client is only required for facturas, not for presupuestos
    if (tipo === 'factura' && !selectedClientId) {
      newErrors.cliente = STRINGS.errors.seleccionaCliente;
    }

    if (lineas.length === 0) {
      newErrors.lineas = STRINGS.errors.añadeLinea;
    } else {
      lineas.forEach((linea) => {
        const itemErrors: { descripcion?: boolean; precio?: boolean; cantidad?: boolean } = {};

        if (!linea.descripcion.trim()) {
          itemErrors.descripcion = true;
          hasLineItemErrors = true;
        }

        if (linea.cantidad <= 0) {
          itemErrors.cantidad = true;
          hasLineItemErrors = true;
        }

        if (linea.precioUnitario <= 0) {
          itemErrors.precio = true;
          hasLineItemErrors = true;
        }

        if (Object.keys(itemErrors).length > 0) {
          newLineItemErrors[linea.id] = itemErrors;
        }
      });
    }

    if (hasLineItemErrors) {
      newErrors.lineItemErrors = newLineItemErrors;
      newErrors.lineas = 'Por favor, completa los campos requeridos en las líneas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGeneratePDF = async () => {
    if (!validateForm()) {
      Alert.alert('Error', 'Por favor, completa todos los campos requeridos');
      return;
    }

    setIsLoading(true);

    try {
      const client = selectedClientId ? getClientById(selectedClientId) : null;

      // For facturas, client is required (already validated)
      if (tipo === 'factura' && !client) {
        throw new Error('Cliente no encontrado');
      }

      // Build document data
      const documentData: DocumentData = {
        tipo,
        numeroDocumento,
        fechaDocumento,
        clienteId: client?.id || '',
        clienteNombre: client?.nombre || '',
        clienteDireccion: client?.direccion || '',
        clienteCodigoPostal: client?.codigoPostal || '',
        clienteCiudad: client?.ciudad || '',
        clienteProvincia: client?.provincia || '',
        clienteNifCif: client?.nifCif || '',
        lineas: lineas.filter(
          (l) => l.descripcion.trim() && l.cantidad > 0 && l.precioUnitario > 0,
        ),
        tipoIVA,
        baseImponible,
        importeIVA,
        total,
        comentarios,
      };

      const tempUri = await createPDF(documentData);

      const fileName = generatePDFFileName(
        tipo,
        numeroDocumento,
        client?.nombre || 'Sin_Cliente',
      );
      console.log('[DocumentForm] Generated fileName:', fileName);

      const finalPath = await savePDF(tempUri, fileName);
      console.log('[DocumentForm] Final path to be saved:', finalPath);

      addDocument({
        tipo,
        numeroDocumento,
        fechaDocumento,
        clienteId: client?.id || '',
        clienteNombre: client?.nombre || 'Sin Cliente',
        clienteNifCif: client?.nifCif || '-',
        total,
        pdfFileName: finalPath,
      });

      // Share PDF
      await sharePDF(finalPath);

      // Reset and navigate
      resetForm();
      router.replace('/(tabs)/historial');

      Alert.alert('Éxito', STRINGS.success.documentoGenerado);
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert(
        'Error',
        'No se pudo generar el documento. Inténtalo de nuevo.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewClient = () => {
    router.push('/cliente/nuevo');
  };

  const handleUpdateLinea = (
    id: string,
    data: Partial<Omit<LineItem, 'id' | 'importe'>>,
  ) => {
    updateLinea(id, data);

    // Dynamic validation clearing
    if (errors.lineItemErrors?.[id]) {
      setErrors((prev) => {
        if (!prev.lineItemErrors?.[id]) return prev;

        const newLineItemErrors = { ...prev.lineItemErrors };
        const currentItemErrors = { ...newLineItemErrors[id] };

        // Clear specific errors based on what's being updated
        if ('descripcion' in data && data.descripcion?.trim()) {
          delete currentItemErrors.descripcion;
        }
        if ('cantidad' in data && (data.cantidad ?? 0) > 0) {
          delete currentItemErrors.cantidad;
        }
        if ('precioUnitario' in data && (data.precioUnitario ?? 0) > 0) {
          delete currentItemErrors.precio;
        }

        // Update or remove error object for this item
        if (Object.keys(currentItemErrors).length === 0) {
          delete newLineItemErrors[id];
        } else {
          newLineItemErrors[id] = currentItemErrors;
        }

        const hasRemainingErrors = Object.keys(newLineItemErrors).length > 0;

        return {
          ...prev,
          lineas: hasRemainingErrors ? prev.lineas : undefined,
          lineItemErrors: hasRemainingErrors ? newLineItemErrors : undefined,
        };
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        enableOnAndroid={true}
        extraScrollHeight={120}
        enableAutomaticScroll={true}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Document Info */}
        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Input
              label={STRINGS.document.numeroDocumento}
              value={numeroDocumento}
              onChangeText={setNumeroDocumento}
              placeholder="F240001"
              error={errors.numeroDocumento}
            />
          </View>
          <View style={styles.halfInput}>
            <Input
              label={STRINGS.document.fechaDocumento}
              value={fechaDocumento}
              onChangeText={setFechaDocumento}
              placeholder="dd-mm-yyyy"
              error={errors.fechaDocumento}
            />
          </View>
        </View>

        {/* Client Section */}
        <ClientSection
          selectedClientId={selectedClientId}
          onClientSelect={setSelectedClient}
          onNewClientPress={handleNewClient}
          error={errors.cliente}
          isOptional={tipo === 'presupuesto'}
        />

        {/* Line Items */}
        <LineItemsList
          lineas={lineas}
          onUpdateLinea={handleUpdateLinea}
          onRemoveLinea={removeLinea}
          onAddLinea={addLinea}
          error={errors.lineas}
          lineItemErrors={errors.lineItemErrors}
        />

        {/* IVA Toggle */}
        <IVAToggle tipoIVA={tipoIVA} onChangeTipoIVA={setTipoIVA} />

        {/* Totals */}
        <TotalsSummary
          baseImponible={baseImponible}
          tipoIVA={tipoIVA}
          importeIVA={importeIVA}
          total={total}
        />

        {/* Comments Section */}
        <View style={styles.commentsSection}>
          <Text style={styles.sectionTitle}>OBSERVACIONES</Text>
          <TextInput
            value={comentarios}
            onChangeText={setComentarios}
            placeholder="Condiciones de pago, notas adicionales, etc..."
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={4}
            style={styles.commentsInput}
            textAlignVertical="top"
          />
        </View>

        {/* Generate Button */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onPress={handleGeneratePDF}
          loading={isLoading}
          disabled={isLoading}
        >
          {STRINGS.actions.generarPDF}
        </Button>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
};

const createStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontFamily: FONTS.bold,
    color: colors.textPrimary,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  halfInput: {
    flex: 1,
  },
  commentsSection: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.bold,
    color: colors.textPrimary,
    marginBottom: SPACING.md,
  },
  commentsInput: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    fontSize: FONT_SIZE.md,
    color: colors.textPrimary,
    minHeight: 100,
    backgroundColor: colors.background,
  },
});
