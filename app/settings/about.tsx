import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Header } from '../../src/components/ui/Header';
import { Card } from '../../src/components/ui/Card';
import { useTheme } from '../../src/hooks/useTheme';
import type { AppColors } from '../../src/constants/theme';
import { SPACING, FONT_SIZE } from '../../src/constants/theme';

const APP_VERSION = '2.0.0';


export default function AboutScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const handleSupport = () => {
    // Open support email
    Linking.openURL('mailto:frontend.bcn.dev@gmail.com?subject=Bilio App Support');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        title={t('settings.about.title')}
        showBack
        onBack={() => router.back()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* App Info */}
        <View style={styles.logoSection}>
          <Image
            source={isDark
              ? require('../../assets/images/bilio-text-dark.png')
              : require('../../assets/images/bilio-text-light.png')
            }
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.tagline}>Invoicing & Quotes</Text>
        </View>

        {/* Version Info */}
        <Card style={styles.section}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              {t('settings.about.version')}
            </Text>
            <Text style={styles.infoValue}>{APP_VERSION}</Text>
          </View>
        </Card>

        {/* Features */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>

          <View style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
            <Text style={styles.featureText}>Multi-language support (5 languages)</Text>
          </View>

          <View style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
            <Text style={styles.featureText}>Multi-currency support (8 currencies)</Text>
          </View>

          <View style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
            <Text style={styles.featureText}>Professional PDF templates (3 styles)</Text>
          </View>

          <View style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
            <Text style={styles.featureText}>Document templates</Text>
          </View>

          <View style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
            <Text style={styles.featureText}>Recurring invoices</Text>
          </View>

          <View style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
            <Text style={styles.featureText}>Flexible tax configuration</Text>
          </View>

          <View style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
            <Text style={styles.featureText}>Completely offline (no cloud sync)</Text>
          </View>
        </Card>

        {/* Privacy Notice */}
        <Card style={styles.section}>
          <View style={styles.privacyHeader}>
            <Ionicons name="shield-checkmark" size={32} color={colors.success} />
            <Text style={styles.privacyTitle}>{t('settings.about.privacy')}</Text>
          </View>

          <Text style={styles.privacyText}>
            {t('about.privacyMessage')}
          </Text>

          <View style={styles.featureRow}>
            <Ionicons name="lock-closed" size={20} color={colors.success} />
            <Text style={styles.featureText}>{t('about.feature1')}</Text>
          </View>

          <View style={styles.featureRow}>
            <Ionicons name="phone-portrait" size={20} color={colors.success} />
            <Text style={styles.featureText}>{t('about.feature2')}</Text>
          </View>

          <View style={styles.featureRow}>
            <Ionicons name="cloud-offline" size={20} color={colors.success} />
            <Text style={styles.featureText}>{t('about.feature3')}</Text>
          </View>
        </Card>

        {/* Support */}
        <Card style={styles.section}>
          <TouchableOpacity
            style={styles.linkRow}
            onPress={handleSupport}
            activeOpacity={0.7}
          >
            <Ionicons name="mail" size={24} color={colors.primary} />
            <Text style={styles.linkText}>{t('settings.about.support')}</Text>
            <Ionicons name="open-outline" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </Card>
       
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  logoSection: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  logo: {
    width: 200,
    height: 100,
  },
  
  tagline: {
    fontSize: FONT_SIZE.md,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  section: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: SPACING.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  infoLabel: {
    fontSize: FONT_SIZE.md,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  featureText: {
    fontSize: FONT_SIZE.md,
    color: colors.textPrimary,
    marginLeft: SPACING.md,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  linkText: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: SPACING.md,
  },
  credits: {
    fontSize: FONT_SIZE.sm,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: SPACING.lg,
  },
  privacyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  privacyTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginLeft: SPACING.md,
  },
  privacyText: {
    fontSize: FONT_SIZE.md,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },
});
