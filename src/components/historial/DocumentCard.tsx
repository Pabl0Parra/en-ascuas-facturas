import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Card } from '../ui/Card';
import { useTheme } from '../../hooks/useTheme';
import type { AppColors } from '../../constants/theme';
import { SPACING, FONT_SIZE, FONTS } from '../../constants/theme';
import { formatDate, formatCurrency } from '../../utils/formatters';
import type { DocumentMetadata } from '../../types/document';

interface DocumentCardProps {
  document: DocumentMetadata;
  onPress: () => void;
  onDelete?: () => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onPress,
  onDelete,
}) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const isFactura = document.tipo === 'factura';

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card padding="md" style={styles.container}>
        {/* Header Row */}
        <View style={styles.header}>
          <View style={styles.typeContainer}>
            <Ionicons
              name={isFactura ? 'document-text' : 'clipboard'}
              size={20}
              color={isFactura ? colors.primary : colors.primary}
            />
            <View style={[styles.typeBadge, isFactura && styles.facturaBadge]}>
              <Text style={[styles.typeText, isFactura && styles.facturaText]}>
                {isFactura ? t('document.factura') : t('document.presupuesto')}
              </Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            <Text style={styles.numero} numberOfLines={1}>
              {document.numeroDocumento}
            </Text>

            {onDelete && (
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                style={styles.deleteButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="trash-outline" size={18} color={colors.error} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Client Info */}
        <View style={styles.info}>
          <Text style={styles.cliente} numberOfLines={1}>
            {document.clienteNombre}
          </Text>
          <Text style={styles.nifCif}>{document.clienteNifCif}</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.fecha}>
            {formatDate(document.fechaDocumento)}
          </Text>
          <Text style={styles.total}>{formatCurrency(document.total)} €</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const createStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    marginBottom: SPACING.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    flexShrink: 1,
  },
  typeBadge: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: 4,
  },
  facturaBadge: {
    backgroundColor: colors.primary + '20',
  },
  typeText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.semibold,
    color: colors.primary,
  },
  facturaText: {
    color: colors.primary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  numero: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.bold,
    color: colors.textPrimary,
    maxWidth: 120,
  },
  deleteButton: {
    padding: SPACING.xs,
  },
  info: {
    marginBottom: SPACING.sm,
  },
  cliente: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.medium,
    color: colors.textPrimary,
  },
  nifCif: {
    fontSize: FONT_SIZE.sm,
    color: colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  fecha: {
    fontSize: FONT_SIZE.sm,
    color: colors.textMuted,
  },
  total: {
    fontSize: FONT_SIZE.xl,
    fontFamily: FONTS.bold,
    color: colors.primary,
  },
});
