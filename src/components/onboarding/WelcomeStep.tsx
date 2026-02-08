import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';
import { LANGUAGES, changeLanguage, type SupportedLanguage } from '../../i18n';

interface WelcomeStepProps {
  onNext: (language: string) => void;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext }) => {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(
    (i18n.language || 'es') as SupportedLanguage
  );

  const handleLanguageSelect = async (language: SupportedLanguage) => {
    setSelectedLanguage(language);
    await changeLanguage(language);
  };

  const handleContinue = () => {
    onNext(selectedLanguage);
  };

  const languageEntries = Object.entries(LANGUAGES) as [SupportedLanguage, typeof LANGUAGES[keyof typeof LANGUAGES]][];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t('onboarding.welcome.title')}</Text>
          <Text style={styles.subtitle}>{t('onboarding.welcome.subtitle')}</Text>
        </View>

        {/* Language Selection */}
        <View style={styles.languageSection}>
          <Text style={styles.sectionTitle}>{t('onboarding.welcome.selectLanguage')}</Text>
          <View style={styles.languageGrid}>
            {languageEntries.map(([code, lang]) => (
              <LanguageOption
                key={code}
                languageCode={lang.code}
                name={lang.name}
                selected={selectedLanguage === code}
                onSelect={() => handleLanguageSelect(code)}
              />
            ))}
          </View>
        </View>

        {/* Footer Button */}
        <View style={styles.footer}>
          <Button onPress={handleContinue} size="lg" fullWidth>
            {t('onboarding.welcome.getStarted')}
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

interface LanguageOptionProps {
  languageCode: string;
  name: string;
  selected: boolean;
  onSelect: () => void;
}

const LanguageOption: React.FC<LanguageOptionProps> = ({
  languageCode,
  name,
  selected,
  onSelect,
}) => (
  <Button
    onPress={onSelect}
    variant={selected ? 'primary' : 'outline'}
    style={styles.languageButton}
  >
    <View style={styles.languageCodeBadge}>
      <Text style={styles.languageCode}>{languageCode}</Text>
    </View>
    <Text style={selected ? styles.languageNameSelected : styles.languageName}>
      {name}
    </Text>
  </Button>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    paddingTop: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: SPACING.md,
  },
  languageSection: {
    flex: 1,
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  languageGrid: {
    gap: SPACING.sm,
  },
  languageButton: {
    marginBottom: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: SPACING.md,
  },
  languageCodeBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.sm,
    marginRight: SPACING.md,
    minWidth: 44,
    alignItems: 'center',
  },
  languageCode: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    color: COLORS.primary,
  },
  languageName: {
    fontSize: FONT_SIZE.md,
    color: COLORS.primary,
  },
  languageNameSelected: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textInverse,
  },
  footer: {
    paddingBottom: SPACING.md,
  },
});
