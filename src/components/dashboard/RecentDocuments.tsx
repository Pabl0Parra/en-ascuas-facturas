// src/components/dashboard/RecentDocuments.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import type { DocumentMetadata } from '../../types/document';
import { formatCurrencyByCode } from '../../utils/currencyFormatter';
import { useBusinessProfileStore } from '../../stores/businessProfileStore';
import { StatusBadge } from '../ui/StatusBadge';
import {
  COLORS,
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
} from '../../constants/theme';

interface RecentDocumentsProps {
  documents: DocumentMetadata[];
  onViewAll: () => void;
}

export const RecentDocuments: React.FC<RecentDocumentsProps> = ({
  documents,
  onViewAll,
}) => {
  const router = useRouter();
  const { t } = useTranslation();
  const businessProfile = useBusinessProfileStore((state) => state.profile);
  const currency = businessProfile?.currency || 'EUR';

  if (documents.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('dashboard.recentDocuments')}</Text>
        </View>
        <View style={styles.emptyState}>
          <Ionicons
            name="document-text-outline"
            size={48}
            color={COLORS.textMuted}
          />
          <Text style={styles.emptyText}>{t('dashboard.noDocumentsYet')}</Text>
          <Text style={styles.emptySubtext}>
            {t('dashboard.createFirstDocument')}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('dashboard.recentDocuments')}</Text>
        <TouchableOpacity onPress={onViewAll}>
          <Text style={styles.viewAllText}>{t('dashboard.viewAll')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.list}>
        {documents.map((doc) => (
          <TouchableOpacity
            key={doc.id}
            style={styles.documentItem}
            onPress={() => {
              // Navigate to document detail (future feature)
              router.push('/(tabs)/historial');
            }}
          >
            <View
              style={[
                styles.iconContainer,
                doc.tipo === 'factura'
                  ? styles.invoiceIcon
                  : styles.quoteIcon,
              ]}
            >
              <Ionicons
                name={
                  doc.tipo === 'factura'
                    ? 'document-text'
                    : 'document-outline'
                }
                size={20}
                color={COLORS.surface}
              />
            </View>

            <View style={styles.documentContent}>
              <View style={styles.documentHeader}>
                <Text style={styles.documentNumber}>{doc.numeroDocumento}</Text>
                {doc.status && (
                  <StatusBadge status={doc.status} size="small" />
                )}
              </View>
              <Text style={styles.documentClient} numberOfLines={1}>
                {doc.clienteNombre}
              </Text>
              <Text style={styles.documentDate}>{doc.fechaDocumento}</Text>
            </View>

            <View style={styles.documentRight}>
              <Text style={styles.documentTotal}>
                {formatCurrencyByCode(doc.total, currency)}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={COLORS.textMuted}
              />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  viewAllText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
  list: {
    gap: SPACING.xs,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  invoiceIcon: {
    backgroundColor: COLORS.primary,
  },
  quoteIcon: {
    backgroundColor: COLORS.textSecondary,
  },
  documentContent: {
    flex: 1,
  },
  documentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: 2,
  },
  documentNumber: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  documentClient: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  documentDate: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
  },
  documentRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  documentTotal: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  emptyText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
  },
  emptySubtext: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
});
