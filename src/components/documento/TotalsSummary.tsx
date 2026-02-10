import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../ui/Card';
import { SPACING, FONT_SIZE } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import type { AppColors } from '../../constants/theme';
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
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

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

const createStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
    backgroundColor: colors.surface,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  label: {
    fontSize: FONT_SIZE.md,
    color: colors.textSecondary,
  },
  value: {
    fontSize: FONT_SIZE.md,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
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
    color: colors.textPrimary,
  },
  totalValue: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: colors.primary,
  },
});
