// src/components/settings/AboutSection.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Constants from 'expo-constants';
import {
  COLORS,
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
} from '../../constants/theme';

export const AboutSection: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const appVersion = Constants.expoConfig?.version || '2.0.0';

  const handlePrivacyPress = () => {
    router.push('/privacy' as any);
  };

  const handleSupportPress = () => {
    // Open support email or link
    Linking.openURL('mailto:support@invoiceforge.app?subject=InvoiceForge Support');
  };

  const handleRatePress = () => {
    // Open app store rating (will need to be updated with actual store links)
    const storeUrl = Constants.platform?.ios
      ? 'https://apps.apple.com/app/invoiceforge'
      : 'https://play.google.com/store/apps/details?id=com.invoiceforge.app';
    Linking.openURL(storeUrl);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="document-text" size={40} color={COLORS.primary} />
        </View>
        <Text style={styles.appName}>InvoiceForge</Text>
        <Text style={styles.version}>
          {t('about.version', 'Version')} {appVersion}
        </Text>
        <Text style={styles.tagline}>
          {t('about.tagline', 'Professional invoicing made simple')}
        </Text>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.listItem} onPress={handlePrivacyPress}>
          <Ionicons name="shield-checkmark" size={24} color={COLORS.primary} />
          <Text style={styles.listItemText}>
            {t('about.privacyPolicy', 'Privacy Policy')}
          </Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.listItem} onPress={handleSupportPress}>
          <Ionicons name="mail" size={24} color={COLORS.primary} />
          <Text style={styles.listItemText}>
            {t('about.support', 'Contact Support')}
          </Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.listItem} onPress={handleRatePress}>
          <Ionicons name="star" size={24} color={COLORS.primary} />
          <Text style={styles.listItemText}>
            {t('about.rate', 'Rate InvoiceForge')}
          </Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
        </TouchableOpacity>
      </View>

      <View style={styles.features}>
        <Text style={styles.featuresTitle}>
          {t('about.featuresTitle', 'Key Features')}
        </Text>
        <View style={styles.featureItem}>
          <Ionicons name="shield-checkmark" size={20} color="#10B981" />
          <Text style={styles.featureText}>
            {t('about.feature1', '100% Private - Data never leaves your device')}
          </Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="cloud-offline" size={20} color="#10B981" />
          <Text style={styles.featureText}>
            {t('about.feature2', 'Offline-First - No internet required')}
          </Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="language" size={20} color="#10B981" />
          <Text style={styles.featureText}>
            {t('about.feature3', 'Multi-Language - English, Spanish, & more')}
          </Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="cash" size={20} color="#10B981" />
          <Text style={styles.featureText}>
            {t('about.feature4', 'Multi-Currency - Support for EUR, USD, GBP, & more')}
          </Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="repeat" size={20} color="#10B981" />
          <Text style={styles.featureText}>
            {t('about.feature5', 'Recurring Invoices - Automate regular billing')}
          </Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="color-palette" size={20} color="#10B981" />
          <Text style={styles.featureText}>
            {t('about.feature6', 'Custom Branding - Add your logo and colors')}
          </Text>
        </View>
      </View>

      <Text style={styles.copyright}>
        © 2026 InvoiceForge. {t('about.rights', 'All rights reserved.')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    backgroundColor: COLORS.surface,
    marginBottom: SPACING.md,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  appName: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  version: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
    marginBottom: SPACING.xs,
  },
  tagline: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  section: {
    backgroundColor: COLORS.surface,
    marginBottom: SPACING.md,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  listItemText: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
    marginLeft: SPACING.md,
  },
  features: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  featuresTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  featureText: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
  },
  copyright: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    textAlign: 'center',
    paddingVertical: SPACING.lg,
  },
});
