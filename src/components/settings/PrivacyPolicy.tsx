// src/components/settings/PrivacyPolicy.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  COLORS,
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
} from '../../constants/theme';

export const PrivacyPolicy: React.FC = () => {
  const { t } = useTranslation();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>{t('privacy.title', 'Privacy Policy')}</Text>
      <Text style={styles.lastUpdated}>
        {t('privacy.lastUpdated', 'Last Updated')}: February 8, 2026
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {t('privacy.dataCollection', 'Data Collection')}
        </Text>
        <Text style={styles.paragraph}>
          {t(
            'privacy.dataCollectionText',
            'InvoiceForge is designed with your privacy in mind. We do NOT collect, transmit, or store any of your personal or business data on external servers.',
          )}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {t('privacy.offlineFirst', 'Offline-First Architecture')}
        </Text>
        <Text style={styles.paragraph}>
          {t(
            'privacy.offlineFirstText',
            'All data you create (business profiles, clients, invoices, quotes) is stored exclusively on your device using secure local storage. Your data never leaves your device unless you explicitly choose to export or share it.',
          )}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {t('privacy.dataStorage', 'Data Storage')}
        </Text>
        <Text style={styles.paragraph}>
          {t(
            'privacy.dataStorageText',
            'We use AsyncStorage (on-device storage) to persist your business information, client records, and documents. This data is stored in encrypted format on your device and is only accessible by the InvoiceForge app.',
          )}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {t('privacy.permissions', 'App Permissions')}
        </Text>
        <Text style={styles.paragraph}>
          {t('privacy.permissionsIntro', 'InvoiceForge requests the following permissions:')}
        </Text>
        <View style={styles.bulletList}>
          <Text style={styles.bullet}>
            • <Text style={styles.bulletBold}>Camera & Photo Library:</Text>{' '}
            {t(
              'privacy.cameraPermission',
              'To upload your business logo or client images',
            )}
          </Text>
          <Text style={styles.bullet}>
            • <Text style={styles.bulletBold}>File System:</Text>{' '}
            {t(
              'privacy.filePermission',
              'To save and share PDF invoices and quotes',
            )}
          </Text>
        </View>
        <Text style={styles.paragraph}>
          {t(
            'privacy.permissionsNote',
            'These permissions are only used for their stated purposes and never for data collection.',
          )}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {t('privacy.dataSharing', 'Data Sharing')}
        </Text>
        <Text style={styles.paragraph}>
          {t(
            'privacy.dataSharingText',
            'We do not share, sell, or transmit your data to any third parties. When you share an invoice or export your data, you control exactly what is shared and with whom.',
          )}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {t('privacy.analytics', 'Analytics & Tracking')}
        </Text>
        <Text style={styles.paragraph}>
          {t(
            'privacy.analyticsText',
            'InvoiceForge does NOT use any analytics, tracking, or telemetry services. We have no way to monitor your usage or access your data.',
          )}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {t('privacy.security', 'Security')}
        </Text>
        <Text style={styles.paragraph}>
          {t(
            'privacy.securityText',
            'Your data security is enhanced by our offline-first approach. Since data never leaves your device (except when you explicitly export it), there is no risk of data breaches or unauthorized server access.',
          )}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {t('privacy.dataRetention', 'Data Retention & Deletion')}
        </Text>
        <Text style={styles.paragraph}>
          {t(
            'privacy.dataRetentionText',
            'You have complete control over your data. You can export all your data at any time from the Settings screen. To delete all data, simply uninstall the app or use the "Clear All Data" option in Settings.',
          )}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {t('privacy.children', "Children's Privacy")}
        </Text>
        <Text style={styles.paragraph}>
          {t(
            'privacy.childrenText',
            'InvoiceForge is intended for business use by adults. We do not knowingly collect data from children under 13.',
          )}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {t('privacy.changes', 'Changes to Privacy Policy')}
        </Text>
        <Text style={styles.paragraph}>
          {t(
            'privacy.changesText',
            'We may update this privacy policy from time to time. Any changes will be reflected in the app with an updated "Last Updated" date.',
          )}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {t('privacy.contact', 'Contact')}
        </Text>
        <Text style={styles.paragraph}>
          {t(
            'privacy.contactText',
            'If you have questions about this privacy policy, please contact us through the app store listing.',
          )}
        </Text>
      </View>

      <View style={styles.highlight}>
        <Text style={styles.highlightText}>
          {t(
            'privacy.summary',
            'Bottom Line: InvoiceForge is 100% private. Your data never leaves your device. No accounts, no servers, no tracking.',
          )}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
  },
  heading: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  lastUpdated: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
    marginBottom: SPACING.xl,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  paragraph: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    lineHeight: FONT_SIZE.md * 1.5,
    marginBottom: SPACING.sm,
  },
  bulletList: {
    marginLeft: SPACING.md,
    marginBottom: SPACING.sm,
  },
  bullet: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    lineHeight: FONT_SIZE.md * 1.5,
    marginBottom: SPACING.xs,
  },
  bulletBold: {
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  highlight: {
    backgroundColor: COLORS.primary + '15',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
    marginTop: SPACING.md,
  },
  highlightText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.primary,
    textAlign: 'center',
    lineHeight: FONT_SIZE.md * 1.4,
  },
});
