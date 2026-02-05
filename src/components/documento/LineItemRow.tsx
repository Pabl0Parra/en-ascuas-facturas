// src/components/documento/LineItemRow.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { IconButton } from '../ui/IconButton';
import { Card } from '../ui/Card';
import {
  COLORS,
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
} from '../../constants/theme';
import { formatCurrency } from '../../utils/formatters';
import type { LineItem } from '../../types/document';

interface LineItemRowProps {
  item: LineItem;
  onUpdate: (data: Partial<Omit<LineItem, 'id' | 'importe'>>) => void;
  onRemove: () => void;
  canRemove: boolean;
  errors?: { descripcion?: boolean; precio?: boolean; cantidad?: boolean };
}

export const LineItemRow: React.FC<LineItemRowProps> = ({
  item,
  onUpdate,
  onRemove,
  canRemove,
  errors,
}) => {
  // Local state to allow typing decimals
  const [cantidadText, setCantidadText] = useState(
    item.cantidad > 0 ? item.cantidad.toString().replace('.', ',') : '',
  );
  const [precioText, setPrecioText] = useState(
    item.precioUnitario > 0
      ? item.precioUnitario.toString().replace('.', ',')
      : '',
  );

  // Sync local state when item changes externally (e.g., reset form)
  useEffect(() => {
    setCantidadText(
      item.cantidad > 0 ? item.cantidad.toString().replace('.', ',') : '',
    );
  }, [item.id]);

  useEffect(() => {
    setPrecioText(
      item.precioUnitario > 0
        ? item.precioUnitario.toString().replace('.', ',')
        : '',
    );
  }, [item.id]);

  const handleCantidadChange = (text: string) => {
    // Allow only numbers, comma, and dot
    const cleaned = text.replace(/[^0-9.,]/g, '');
    setCantidadText(cleaned);

    // Parse and update parent
    const normalized = cleaned.replace(',', '.');
    const num = parseFloat(normalized);
    if (!isNaN(num)) {
      onUpdate({ cantidad: num });
    } else if (cleaned === '') {
      onUpdate({ cantidad: 0 });
    }
  };

  const handlePrecioChange = (text: string) => {
    // Allow only numbers, comma, and dot
    const cleaned = text.replace(/[^0-9.,]/g, '');
    setPrecioText(cleaned);

    // Parse and update parent
    const normalized = cleaned.replace(',', '.');
    const num = parseFloat(normalized);
    if (!isNaN(num)) {
      onUpdate({ precioUnitario: num });
    } else if (cleaned === '') {
      onUpdate({ precioUnitario: 0 });
    }
  };

  return (
    <Card padding="md" style={styles.container}>
      <View style={styles.row}>
        <View style={styles.descripcionContainer}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            value={item.descripcion}
            onChangeText={(text) => onUpdate({ descripcion: text })}
            placeholder="Descripción del concepto..."
            placeholderTextColor={COLORS.textMuted}
            multiline
            numberOfLines={2}
            style={[
              styles.descripcionInput,
              errors?.descripcion && { borderColor: COLORS.error },
            ]}
          />
        </View>

        {canRemove && (
          <IconButton
            icon="trash-outline"
            onPress={onRemove}
            variant="ghost"
            size="sm"
          />
        )}
      </View>

      <View style={styles.numbersRow}>
        <View style={styles.numberContainer}>
          <Text style={styles.label}>Cantidad</Text>
          <TextInput
            value={cantidadText}
            onChangeText={handleCantidadChange}
            keyboardType="decimal-pad"
            placeholder="0"
            placeholderTextColor={COLORS.textMuted}
            style={[
              styles.numberInput,
              errors?.cantidad && { borderColor: COLORS.error },
            ]}
          />
        </View>

        <View style={styles.numberContainer}>
          <Text style={styles.label}>Precio</Text>
          <TextInput
            value={precioText}
            onChangeText={handlePrecioChange}
            keyboardType="decimal-pad"
            placeholder="0,00"
            placeholderTextColor={COLORS.textMuted}
            style={[
              styles.numberInput,
              errors?.precio && { borderColor: COLORS.error },
            ]}
          />
        </View>

        <View style={styles.importeContainer}>
          <Text style={styles.label}>Importe</Text>
          <View style={styles.importeValue}>
            <Text style={styles.importeText}>
              {formatCurrency(item.importe)} €
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  descripcionContainer: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  label: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  descripcionInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.xs,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textPrimary,
    minHeight: 40,
    textAlignVertical: 'top',
  },
  numbersRow: {
    flexDirection: 'row',
    marginTop: SPACING.sm,
    gap: SPACING.sm,
  },
  numberContainer: {
    flex: 1,
  },
  numberInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.xs,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  importeContainer: {
    flex: 1,
  },
  importeValue: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.xs,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 36,
  },
  importeText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
});
