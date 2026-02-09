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
import { COLORS, SPACING, FONT_SIZE } from '../../src/constants/theme';

const APP_VERSION = '2.0.0';
const BUILD_NUMBER = '2024020800';

export default function AboutScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const handleSupport = () => {
    // Open support email
    Linking.openURL('mailto:frontend?subject=App Support');
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
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appName}> Bilio</Text>
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

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              {t('settings.about.buildNumber')}
            </Text>
            <Text style={styles.infoValue}>{BUILD_NUMBER}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phase</Text>
            <Text style={styles.infoValue}>3.1 - Settings UI</Text>
          </View>
        </Card>

        {/* Features */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>

          <View style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
            <Text style={styles.featureText}>Multi-language support (5 languages)</Text>
          </View>

          <View style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
            <Text style={styles.featureText}>Multi-currency support (8 currencies)</Text>
          </View>

          <View style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
            <Text style={styles.featureText}>Professional PDF templates (3 styles)</Text>
          </View>

          <View style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
            <Text style={styles.featureText}>Document templates</Text>
          </View>

          <View style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
            <Text style={styles.featureText}>Recurring invoices</Text>
          </View>

          <View style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
            <Text style={styles.featureText}>Flexible tax configuration</Text>
          </View>

          <View style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
            <Text style={styles.featureText}>Completely offline (no cloud sync)</Text>
          </View>
        </Card>

        {/* Privacy Notice */}
        <Card style={styles.section}>
          <View style={styles.privacyHeader}>
            <Ionicons name="shield-checkmark" size={32} color={COLORS.success} />
            <Text style={styles.privacyTitle}>{t('settings.about.privacy')}</Text>
          </View>

          <Text style={styles.privacyText}>
            {t('about.privacyMessage')}
          </Text>

          <View style={styles.featureRow}>
            <Ionicons name="lock-closed" size={20} color={COLORS.success} />
            <Text style={styles.featureText}>{t('about.feature1')}</Text>
          </View>

          <View style={styles.featureRow}>
            <Ionicons name="phone-portrait" size={20} color={COLORS.success} />
            <Text style={styles.featureText}>{t('about.feature2')}</Text>
          </View>

          <View style={styles.featureRow}>
            <Ionicons name="cloud-offline" size={20} color={COLORS.success} />
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
            <Ionicons name="mail" size={24} color={COLORS.primary} />
            <Text style={styles.linkText}>{t('settings.about.support')}</Text>
            <Ionicons name="open-outline" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </Card>

        {/* Credits */}
        <Text style={styles.credits}>
          Made by Pabl0Parra with ❤️ using React Native + Expo{'\n'}
        </Text>
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
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  logoSection: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: SPACING.md,
  },
  appName: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '900',
    color: COLORS.black,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: FONT_SIZE.md,
    color: COLORS.ember,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  section: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  infoLabel: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
  },
  infoValue: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  featureText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
    marginLeft: SPACING.md,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  linkText: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginLeft: SPACING.md,
  },
  credits: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
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
    color: COLORS.textPrimary,
    marginLeft: SPACING.md,
  },
  privacyText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },
});
