// src/components/documento/LineItemsList.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LineItemRow } from './LineItemRow';
import { Button } from '../ui/Button';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE } from '../../constants/theme';
import { STRINGS } from '../../constants/strings';
import type { LineItem } from '../../types/document';

interface LineItemsListProps {
  lineas: LineItem[];
  onUpdateLinea: (
    id: string,
    data: Partial<Omit<LineItem, 'id' | 'importe'>>,
  ) => void;
  onRemoveLinea: (id: string) => void;
  onAddLinea: () => void;
  error?: string;
}

export const LineItemsList: React.FC<LineItemsListProps> = ({
  lineas,
  onUpdateLinea,
  onRemoveLinea,
  onAddLinea,
  error,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>LÍNEAS DE DETALLE</Text>

      {lineas.map((linea) => (
        <LineItemRow
          key={linea.id}
          item={linea}
          onUpdate={(data) => onUpdateLinea(linea.id, data)}
          onRemove={() => onRemoveLinea(linea.id)}
          canRemove={lineas.length > 1}
        />
      ))}

      <Button
        variant="outline"
        size="sm"
        onPress={onAddLinea}
        icon={<Ionicons name="add" size={18} color={COLORS.primary} />}
        style={styles.addButton}
      >
        {STRINGS.form.añadirLinea}
      </Button>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  addButton: {
    alignSelf: 'flex-start',
    marginTop: SPACING.sm,
  },
  errorText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.error,
    marginTop: SPACING.sm,
  },
});
