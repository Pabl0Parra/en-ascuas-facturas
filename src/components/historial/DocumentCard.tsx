import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { COLORS, SPACING, FONT_SIZE } from '../../constants/theme';
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
              color={isFactura ? COLORS.primary : COLORS.ember}
            />
            <View style={[styles.typeBadge, isFactura && styles.facturaBadge]}>
              <Text style={[styles.typeText, isFactura && styles.facturaText]}>
                {isFactura ? 'FACTURA' : 'PRESUPUESTO'}
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
                <Ionicons name="trash-outline" size={18} color={COLORS.error} />
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

const styles = StyleSheet.create({
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
    backgroundColor: COLORS.ember + '20',
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: 4,
  },
  facturaBadge: {
    backgroundColor: COLORS.primary + '20',
  },
  typeText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    color: COLORS.ember,
  },
  facturaText: {
    color: COLORS.primary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  numero: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
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
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  nifCif: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  fecha: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
  },
  total: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.primary,
  },
});
