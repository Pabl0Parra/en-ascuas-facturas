import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { StatCard } from '../../src/components/dashboard/StatCard';
import { RecentDocuments } from '../../src/components/dashboard/RecentDocuments';
import { RecurringAlert } from '../../src/components/dashboard/RecurringAlert';
import { OverdueAlert } from '../../src/components/dashboard/OverdueAlert';
import { calculateDashboardStats } from '../../src/services/dashboardService';
import { formatCurrencyByCode } from '../../src/utils/currencyFormatter';
import { useBusinessProfileStore } from '../../src/stores/businessProfileStore';
import {
  COLORS,
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
} from '../../src/constants/theme';

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const businessProfile = useBusinessProfileStore((state) => state.profile);
  const currency = businessProfile?.currency || 'EUR';

  // Calculate dashboard statistics
  const stats = useMemo(() => calculateDashboardStats(), []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require('../../assets/images/icon.png')}
            style={styles.icon}
            resizeMode="contain"
          />
          <Text style={styles.greeting}>{t('dashboard.welcomeBack')}</Text>
          <Text style={styles.subtitle}>
            {businessProfile?.companyName || t('dashboard.yourBusiness')}
          </Text>
        </View>

        {/* Hero Actions - Primary CTA Buttons */}
        <View style={styles.heroActions}>
          <TouchableOpacity
            style={[styles.heroButton, styles.invoiceButton]}
            onPress={() => router.push('/documento/nuevo?tipo=factura')}
            activeOpacity={0.8}
          >
            <View style={styles.heroButtonContent}>
              <Ionicons name="document-text" size={32} color={COLORS.textInverse} />
              <Text style={styles.heroButtonTitle}>{t('dashboard.newInvoice')}</Text>
            </View>
            <Ionicons name="arrow-forward" size={24} color={COLORS.textInverse} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.heroButton, styles.quoteButton]}
            onPress={() => router.push('/documento/nuevo?tipo=presupuesto')}
            activeOpacity={0.8}
          >
            <View style={styles.heroButtonContent}>
              <Ionicons name="document-outline" size={32} color={COLORS.textInverse} />
              <Text style={styles.heroButtonTitle}>{t('dashboard.newQuote')}</Text>
            </View>
            <Ionicons name="arrow-forward" size={24} color={COLORS.textInverse} />
          </TouchableOpacity>
        </View>

        {/* Recurring Alert */}
        {stats.pendingRecurringInvoices > 0 && (
          <RecurringAlert count={stats.pendingRecurringInvoices} />
        )}

        {/* Overdue Alert */}
        {stats.overdueInvoices > 0 && (
          <OverdueAlert count={stats.overdueInvoices} />
        )}

        {/* Quick Stats - This Month */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('dashboard.thisMonth')}</Text>
          <View style={styles.statsGrid}>
            <StatCard
              title={t('dashboard.invoices')}
              value={stats.invoicesThisMonth}
              icon="document-text"
              color={COLORS.primary}
            />
            <StatCard
              title={t('dashboard.revenue')}
              value={formatCurrencyByCode(stats.revenueThisMonth, currency)}
              icon="trending-up"
              color="#10B981"
            />
            <StatCard
              title={t('dashboard.quotes')}
              value={stats.quotesThisMonth}
              icon="document-outline"
              color="#8B5CF6"
            />
          </View>
        </View>

        {/* Secondary Quick Actions */}
        <View style={styles.secondaryActions}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push('/(tabs)/clientes')}
            activeOpacity={0.7}
          >
            <Ionicons name="people" size={20} color={COLORS.primary} />
            <Text style={styles.secondaryButtonText}>{t('dashboard.clients')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push('/(tabs)/historial')}
            activeOpacity={0.7}
          >
            <Ionicons name="time" size={20} color={COLORS.primary} />
            <Text style={styles.secondaryButtonText}>{t('dashboard.history')}</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Documents */}
        <View style={styles.section}>
          <RecentDocuments
            documents={stats.recentDocuments}
            onViewAll={() => router.push('/(tabs)/historial')}
          />
        </View>

        {/* All-Time Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('dashboard.allTime')}</Text>
          <View style={styles.statsGrid}>
            <StatCard
              title={t('dashboard.totalInvoices')}
              value={stats.totalInvoices}
              subtitle={formatCurrencyByCode(stats.totalRevenue, currency)}
              icon="receipt"
              color="#F59E0B"
            />
            <StatCard
              title={t('dashboard.totalQuotes')}
              value={stats.totalQuotes}
              icon="newspaper"
              color="#6B7280"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
  },
  header: {
    marginBottom: SPACING.lg,
  },
  icon: {
    width: 60,
    height: 60,
    marginBottom: SPACING.sm,
  },
  greeting: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
  },
  heroActions: {
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    minHeight: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  invoiceButton: {
    backgroundColor: COLORS.primary,
  },
  quoteButton: {
    backgroundColor: '#10B981',
  },
  heroButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  heroButtonTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.textInverse,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  secondaryButtonText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.primary,
  },
  section: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.xs,
  },
  statsGrid: {
    gap: SPACING.sm,
  },
});
