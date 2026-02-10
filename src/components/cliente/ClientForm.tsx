import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useRouter } from 'expo-router';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Header } from '../ui/Header';
import { useClientStore } from '../../stores/clientStore';
import { useTheme } from '../../hooks/useTheme';
import type { AppColors } from '../../constants/theme';
import { SPACING, FONT_SIZE, FONTS } from '../../constants/theme';
import { STRINGS } from '../../constants/strings';
import {
  isNotEmpty,
  isValidPostalCode,
  isValidEmail,
  isValidNIF,
} from '../../utils/validators';
import type { Client, ClientFormData, ClientTag } from '../../types/client';

interface ClientFormProps {
  client?: Client;
  isEditing?: boolean;
}

interface FormErrors {
  nombre?: string;
  direccion?: string;
  codigoPostal?: string;
  ciudad?: string;
  provincia?: string;
  nifCif?: string;
  email?: string;
}

export const ClientForm: React.FC<ClientFormProps> = ({
  client,
  isEditing = false,
}) => {
  const router = useRouter();
  const addClient = useClientStore((state) => state.addClient);
  const updateClient = useClientStore((state) => state.updateClient);
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const TAG_LABELS: Record<ClientTag, { label: string; color: string }> = {
    regular: { label: 'Regular', color: colors.primary },
    vip: { label: 'VIP', color: '#8B5CF6' },
    new: { label: 'Nuevo', color: '#10B981' },
    inactive: { label: 'Inactivo', color: '#6B7280' },
    international: { label: 'Internacional', color: '#3B82F6' },
    domestic: { label: 'Nacional', color: '#F59E0B' },
  };

  const [formData, setFormData] = useState<ClientFormData>({
    nombre: client?.nombre || '',
    direccion: client?.direccion || '',
    codigoPostal: client?.codigoPostal || '',
    ciudad: client?.ciudad || '',
    provincia: client?.provincia || '',
    nifCif: client?.nifCif || '',
    email: client?.email || '',
    telefono: client?.telefono || '',
    tags: client?.tags || [],
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const updateField = <K extends keyof ClientFormData>(
    field: K,
    value: ClientFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const toggleTag = (tag: ClientTag) => {
    setFormData((prev) => {
      const currentTags = prev.tags || [];
      const newTags = currentTags.includes(tag)
        ? currentTags.filter((t) => t !== tag)
        : [...currentTags, tag];
      return { ...prev, tags: newTags };
    });
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!isNotEmpty(formData.nombre)) {
      newErrors.nombre = STRINGS.errors.campoRequerido;
    }

    if (!isNotEmpty(formData.direccion)) {
      newErrors.direccion = STRINGS.errors.campoRequerido;
    }

    if (!isValidPostalCode(formData.codigoPostal)) {
      newErrors.codigoPostal = 'Código postal debe tener 5 dígitos';
    }

    if (!isNotEmpty(formData.ciudad)) {
      newErrors.ciudad = STRINGS.errors.campoRequerido;
    }

    if (!isNotEmpty(formData.provincia)) {
      newErrors.provincia = STRINGS.errors.campoRequerido;
    }

    if (!isNotEmpty(formData.nifCif)) {
      newErrors.nifCif = STRINGS.errors.campoRequerido;
    } else if (!isValidNIF(formData.nifCif)) {
      newErrors.nifCif = 'NIF/CIF no válido';
    }

    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = 'Email no válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (isEditing && client) {
        updateClient(client.id, formData);
        Alert.alert('Éxito', 'Cliente actualizado correctamente');
      } else {
        addClient(formData);
        Alert.alert('Éxito', STRINGS.success.clienteGuardado);
      }

      router.back();
    } catch (error) {
      console.error('Error saving client:', error);
      Alert.alert('Error', 'No se pudo guardar el cliente');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title={isEditing ? 'Editar Cliente' : STRINGS.actions.nuevoCliente}
        showBack
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <KeyboardAwareScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid={true}
          enableAutomaticScroll={true}
          extraScrollHeight={150}
        >
        <Input
          label={STRINGS.client.nombre}
          value={formData.nombre}
          onChangeText={(text) => updateField('nombre', text)}
          placeholder="Nombre o razón social"
          error={errors.nombre}
        />

        <Input
          label={STRINGS.client.nifCif}
          value={formData.nifCif}
          onChangeText={(text) => updateField('nifCif', text.toUpperCase())}
          placeholder="12345678A"
          error={errors.nifCif}
        />

        <Input
          label={STRINGS.client.direccion}
          value={formData.direccion}
          onChangeText={(text) => updateField('direccion', text)}
          placeholder="Calle, número, piso..."
          multiline
          numberOfLines={2}
          error={errors.direccion}
        />

        <View style={styles.row}>
          <View style={styles.smallInput}>
            <Input
              label={STRINGS.client.codigoPostal}
              value={formData.codigoPostal}
              onChangeText={(text) => updateField('codigoPostal', text)}
              placeholder="12345"
              keyboardType="numeric"
              error={errors.codigoPostal}
            />
          </View>
          <View style={styles.largeInput}>
            <Input
              label={STRINGS.client.ciudad}
              value={formData.ciudad}
              onChangeText={(text) => updateField('ciudad', text)}
              placeholder="Ciudad"
              error={errors.ciudad}
            />
          </View>
        </View>

        <Input
          label={STRINGS.client.provincia}
          value={formData.provincia}
          onChangeText={(text) => updateField('provincia', text)}
          placeholder="Provincia"
          error={errors.provincia}
        />

        <Input
          label={STRINGS.client.email}
          value={formData.email || ''}
          onChangeText={(text) => updateField('email', text)}
          placeholder="email@ejemplo.com"
          keyboardType="email-address"
          error={errors.email}
        />

        <Input
          label={STRINGS.client.telefono}
          value={formData.telefono || ''}
          onChangeText={(text) => updateField('telefono', text)}
          placeholder="612 345 678"
          keyboardType="phone-pad"
        />

        {/* Tags Section */}
        <View style={styles.tagsSection}>
          <Text style={styles.tagsLabel}>Etiquetas</Text>
          <Text style={styles.tagsSubtitle}>
            Selecciona las etiquetas que mejor describan a este cliente
          </Text>
          <View style={styles.tagsContainer}>
            {(Object.entries(TAG_LABELS) as Array<[ClientTag, typeof TAG_LABELS[ClientTag]]>).map(
              ([tag, { label, color }]) => {
                const isSelected = formData.tags?.includes(tag) || false;
                return (
                  <TouchableOpacity
                    key={tag}
                    style={[
                      styles.tagChip,
                      isSelected && { backgroundColor: color },
                    ]}
                    onPress={() => toggleTag(tag)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.tagChipText,
                        isSelected && styles.tagChipTextSelected,
                      ]}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              }
            )}
          </View>
        </View>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleSubmit}
            loading={isLoading}
            disabled={isLoading}
            style={styles.submitButton}
          >
            {STRINGS.actions.guardar}
          </Button>
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const createStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SPACING.md,
    paddingBottom: Platform.OS === 'ios' ? 180 : 150,
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  smallInput: {
    width: 120,
  },
  largeInput: {
    flex: 1,
  },
  submitButton: {
    marginTop: SPACING.lg,
  },
  tagsSection: {
    marginTop: SPACING.md,
  },
  tagsLabel: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.semibold,
    color: colors.textPrimary,
    marginBottom: SPACING.xs,
  },
  tagsSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: colors.textSecondary,
    marginBottom: SPACING.sm,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  tagChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tagChipText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.medium,
    color: colors.textSecondary,
  },
  tagChipTextSelected: {
    color: colors.textInverse,
  },
});
