import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Platform,
  TextInput,
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
  COLORS,
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
} from '../../constants/theme';
import { STRINGS } from '../../constants/strings';
import type { DocumentData, DocumentType } from '../../types/document';

interface DocumentFormProps {
  tipo: DocumentType;
}

interface FormErrors {
  numeroDocumento?: string;
  fechaDocumento?: string;
  cliente?: string;
  lineas?: string;
}

export const DocumentForm: React.FC<DocumentFormProps> = ({ tipo }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

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

    if (!numeroDocumento.trim()) {
      newErrors.numeroDocumento = STRINGS.errors.campoRequerido;
    }

    if (!fechaDocumento.trim()) {
      newErrors.fechaDocumento = STRINGS.errors.campoRequerido;
    }

    // Client is only required for facturas, not for presupuestos
    if (tipo === 'factura' && !selectedClientId) {
      newErrors.cliente = STRINGS.errors.seleccionaCliente;
    }

    const validLineas = lineas.filter(
      (l) => l.descripcion.trim() && l.cantidad > 0 && l.precioUnitario > 0,
    );

    if (validLineas.length === 0) {
      newErrors.lineas = STRINGS.errors.añadeLinea;
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

      // Generate PDF
      const tempUri = await createPDF(documentData);

      // Generate filename and save permanently
      const fileName = generatePDFFileName(
        tipo,
        numeroDocumento,
        client?.nombre || 'Sin_Cliente',
      );
      const finalPath = await savePDF(tempUri, fileName);

      // Save metadata with full path
      addDocument({
        tipo,
        numeroDocumento,
        fechaDocumento,
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

  const docTitle =
    tipo === 'factura'
      ? STRINGS.navigation.nuevaFactura
      : STRINGS.navigation.nuevoPresupuesto;

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      enableOnAndroid={true}
      extraScrollHeight={20}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>{docTitle}</Text>

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
        onUpdateLinea={updateLinea}
        onRemoveLinea={removeLinea}
        onAddLinea={addLinea}
        error={errors.lineas}
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
          placeholderTextColor={COLORS.textMuted}
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
    fontWeight: '700',
    color: COLORS.textPrimary,
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
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  commentsInput: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
    minHeight: 100,
    backgroundColor: COLORS.background,
  },
});
