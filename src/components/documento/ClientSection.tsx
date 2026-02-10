import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useClientStore } from '../../stores/clientStore';
import { SPACING, FONT_SIZE } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import type { AppColors } from '../../constants/theme';
import { STRINGS } from '../../constants/strings';
import type { Client } from '../../types/client';

interface ClientSectionProps {
  selectedClientId: string | null;
  onClientSelect: (clientId: string) => void;
  onNewClientPress: () => void;
  error?: string;
  isOptional?: boolean;
}

export const ClientSection: React.FC<ClientSectionProps> = ({
  selectedClientId,
  onClientSelect,
  onNewClientPress,
  error,
  isOptional = false,
}) => {
  const clients = useClientStore((state) => state.clients);
  const getClientById = useClientStore((state) => state.getClientById);
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const clientOptions = clients.map((client) => ({
    label: `${client.nombre} - ${client.nifCif}`,
    value: client.id,
  }));

  const selectedClient: Client | undefined = selectedClientId
    ? getClientById(selectedClientId)
    : undefined;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        {STRINGS.document.datosFacturacion}
        {isOptional && ' (Opcional)'}
      </Text>

      <View style={styles.selectContainer}>
        <Select
          label={STRINGS.actions.seleccionarCliente}
          options={clientOptions}
          value={selectedClientId}
          onChange={onClientSelect}
          placeholder="Seleccionar cliente..."
          error={error}
          searchable
        />

        <Button
          variant="outline"
          size="sm"
          onPress={onNewClientPress}
          style={styles.newClientButton}
        >
          {STRINGS.actions.nuevoCliente}
        </Button>
      </View>

      {selectedClient && (
        <Card padding="md" style={styles.clientDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Nombre:</Text>
            <Text style={styles.detailValue}>{selectedClient.nombre}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Dirección:</Text>
            <Text style={styles.detailValue}>{selectedClient.direccion}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>CP / Ciudad:</Text>
            <Text style={styles.detailValue}>
              {selectedClient.codigoPostal} {selectedClient.ciudad}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Provincia:</Text>
            <Text style={styles.detailValue}>{selectedClient.provincia}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>NIF/CIF:</Text>
            <Text style={styles.detailValue}>{selectedClient.nifCif}</Text>
          </View>
        </Card>
      )}
    </View>
  );
};

const createStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: SPACING.md,
  },
  selectContainer: {
    marginBottom: SPACING.sm,
  },
  newClientButton: {
    alignSelf: 'flex-start',
  },
  clientDetails: {
    marginTop: SPACING.md,
    backgroundColor: colors.surface,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: SPACING.xs,
  },
  detailLabel: {
    fontSize: FONT_SIZE.sm,
    color: colors.textSecondary,
    width: 90,
    fontWeight: '500',
  },
  detailValue: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    color: colors.textPrimary,
  },
});
