import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../ui/Card';
import { COLORS, SPACING, FONT_SIZE } from '../../constants/theme';
import { STRINGS } from '../../constants/strings';
import { formatCurrency } from '../../utils/formatters';
import type { IVARate } from '../../types/document';

interface TotalsSummaryProps {
  baseImponible: number;
  tipoIVA: IVARate;
  importeIVA: number;
  total: number;
}

export const TotalsSummary: React.FC<TotalsSummaryProps> = ({
  baseImponible,
  tipoIVA,
  importeIVA,
  total,
}) => {
  return (
    <Card padding="md" style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>{STRINGS.totals.base}</Text>
        <Text style={styles.value}>{formatCurrency(baseImponible)} €</Text>
      </View>
      
      <View style={styles.row}>
        <Text style={styles.label}>{STRINGS.totals.iva} ({tipoIVA}%)</Text>
        <Text style={styles.value}>{formatCurrency(importeIVA)} €</Text>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>{STRINGS.totals.total}</Text>
        <Text style={styles.totalValue}>{formatCurrency(total)} €</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.surface,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  label: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
  },
  value: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.sm,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  totalValue: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.primary,
  },
});
