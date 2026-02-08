import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useRouter } from 'expo-router';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Header } from '../ui/Header';
import { useClientStore } from '../../stores/clientStore';
import { COLORS, SPACING } from '../../constants/theme';
import { STRINGS } from '../../constants/strings';
import {
  isNotEmpty,
  isValidPostalCode,
  isValidEmail,
  isValidNIF,
} from '../../utils/validators';
import type { Client, ClientFormData } from '../../types/client';

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

  const [formData, setFormData] = useState<ClientFormData>({
    nombre: client?.nombre || '',
    direccion: client?.direccion || '',
    codigoPostal: client?.codigoPostal || '',
    ciudad: client?.ciudad || '',
    provincia: client?.provincia || '',
    nifCif: client?.nifCif || '',
    email: client?.email || '',
    telefono: client?.telefono || '',
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

      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={20}
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
    </View>
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
});
