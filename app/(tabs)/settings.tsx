import React, { useMemo } from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Header } from '../../src/components/ui/Header';
import { Card } from '../../src/components/ui/Card';
import { useTheme } from '../../src/hooks/useTheme';
import type { AppColors } from '../../src/constants/theme';
import { SPACING, FONT_SIZE, BORDER_RADIUS } from '../../src/constants/theme';
import { SwipeableTabScreen } from '../../src/components/ui/SwipeableTabScreen';

type SettingsSection = {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  titleKey: string;
  route?: string;
  onPress?: () => void;
};

export default function SettingsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const sections: SettingsSection[] = [
    {
      id: 'businessProfile',
      icon: 'business',
      titleKey: 'settings.sections.businessProfile',
      route: '/settings/business-profile',
    },
    {
      id: 'branding',
      icon: 'color-palette',
      titleKey: 'settings.sections.branding',
      route: '/settings/branding',
    },
    {
      id: 'taxConfiguration',
      icon: 'calculator',
      titleKey: 'settings.sections.taxConfiguration',
      route: '/settings/tax-configuration',
    },
    {
      id: 'languageRegion',
      icon: 'language',
      titleKey: 'settings.sections.languageRegion',
      route: '/settings/language-region',
    },
    {
      id: 'dataManagement',
      icon: 'download',
      titleKey: 'settings.sections.dataManagement',
      route: '/settings/data-management',
    },
    {
      id: 'about',
      icon: 'information-circle',
      titleKey: 'settings.sections.about',
      route: '/settings/about',
    },
  ];

  const handleSectionPress = (section: SettingsSection) => {
    if (section.onPress) {
      section.onPress();
    } else if (section.route) {
      // All screens are now implemented
      router.push(section.route as any);
    }
  };

  return (
    <SwipeableTabScreen>
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title={t('settings.title')} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionsContainer}>
          {sections.map((section, index) => (
            <TouchableOpacity
              key={section.id}
              onPress={() => handleSectionPress(section)}
              activeOpacity={0.7}
            >
              <Card style={styles.sectionCard}>
                <View style={styles.sectionContent}>
                  <View style={styles.iconContainer}>
                    <Ionicons
                      name={section.icon}
                      size={24}
                      color={colors.primary}
                    />
                  </View>
                  <Text style={styles.sectionTitle}>
                    {t(section.titleKey)}
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={colors.textSecondary}
                  />
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>
            {t('settings.about.version')} 2.0.0
          </Text>
          <Text style={styles.versionText}>
            Phase 3.1 - Settings UI
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
    </SwipeableTabScreen>
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
    paddingBottom: SPACING.xl,
  },
  sectionsContainer: {
    gap: SPACING.sm,
  },
  sectionCard: {
    marginBottom: 0,
  },
  sectionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  sectionTitle: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  versionContainer: {
    marginTop: SPACING.xl,
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  versionText: {
    fontSize: FONT_SIZE.sm,
    color: colors.textMuted,
    marginBottom: SPACING.xs,
  },
});
