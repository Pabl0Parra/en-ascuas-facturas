import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../../src/components/ui/Header';
import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { useBusinessProfileStore } from '../../src/stores/businessProfileStore';
import { changeLanguage, LANGUAGES } from '../../src/i18n';
import { getSupportedCurrencies, getCurrencyConfig } from '../../src/config/currencyConfig';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../src/constants/theme';

type LanguageCode = keyof typeof LANGUAGES;

export default function LanguageRegionScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { profile, updateProfile } = useBusinessProfileStore();

  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>('en');
  const [selectedCurrency, setSelectedCurrency] = useState('EUR');

  useEffect(() => {
    setSelectedLanguage(i18n.language as LanguageCode);
    if (profile) {
      setSelectedCurrency(profile.currency || 'EUR');
    }
  }, [i18n.language, profile]);

  const handleLanguageChange = async (languageCode: LanguageCode) => {
    setSelectedLanguage(languageCode);
    await changeLanguage(languageCode);
    Alert.alert(
      t('success.guardado'),
      'Language changed successfully'
    );
  };

  const handleCurrencyChange = (currencyCode: string) => {
    setSelectedCurrency(currencyCode);
    updateProfile({ currency: currencyCode });
    Alert.alert(
      t('success.guardado'),
      'Currency changed successfully'
    );
  };

  const handleSave = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        title={t('settings.languageRegion.title')}
        showBack
        onBack={handleSave}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* App Language */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('settings.languageRegion.appLanguage')}
          </Text>

          {Object.entries(LANGUAGES).map(([code, lang]) => (
            <TouchableOpacity
              key={code}
              style={[
                styles.optionCard,
                selectedLanguage === code && styles.optionCardSelected,
              ]}
              onPress={() => handleLanguageChange(code as LanguageCode)}
              activeOpacity={0.7}
            >
              <Text style={styles.optionFlag}>{lang.flag}</Text>
              <Text style={styles.optionName}>{lang.name}</Text>
              {selectedLanguage === code && (
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={COLORS.primary}
                />
              )}
            </TouchableOpacity>
          ))}
        </Card>

        {/* Currency */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('settings.languageRegion.currency')}
          </Text>

          <View style={styles.currencyGrid}>
            {getSupportedCurrencies().map((code) => {
              const config = getCurrencyConfig(code);
              return (
                <TouchableOpacity
                  key={code}
                  style={[
                    styles.currencyCard,
                    selectedCurrency === code && styles.currencyCardSelected,
                  ]}
                  onPress={() => handleCurrencyChange(code)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.currencySymbol}>{config.symbol}</Text>
                  <Text style={styles.currencyCode}>{code}</Text>
                  {selectedCurrency === code && (
                    <View style={styles.currencyBadge}>
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color={COLORS.primary}
                      />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

        {/* Locale Info */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('settings.languageRegion.locale')}
          </Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              {t('settings.languageRegion.dateFormat')}:
            </Text>
            <Text style={styles.infoValue}>
              {new Date().toLocaleDateString(profile?.locale || 'en-US')}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              {t('settings.languageRegion.numberFormat')}:
            </Text>
            <Text style={styles.infoValue}>
              {(1234.56).toLocaleString(profile?.locale || 'en-US')}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Locale Code:</Text>
            <Text style={styles.infoValue}>{profile?.locale || 'en-US'}</Text>
          </View>
        </Card>

        <Text style={styles.hint}>
          Date and number formats are determined by your locale setting configured during onboarding
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
  section: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.surface,
  },
  optionCardSelected: {
    backgroundColor: COLORS.primary + '15',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  optionFlag: {
    fontSize: FONT_SIZE.xxl,
    marginRight: SPACING.md,
  },
  optionName: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  currencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  currencyCard: {
    width: '31%',
    aspectRatio: 1.2,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  currencyCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  currencySymbol: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  currencyCode: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  currencyBadge: {
    position: 'absolute',
    top: SPACING.xs,
    right: SPACING.xs,
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
  hint: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
