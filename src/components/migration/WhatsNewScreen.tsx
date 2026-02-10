import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Modal, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';
import { useTheme } from '../../hooks/useTheme';
import type { AppColors } from '../../constants/theme';
import { SPACING, FONT_SIZE, BORDER_RADIUS, FONTS } from '../../constants/theme';

interface WhatsNewScreenProps {
  visible: boolean;
  onClose: () => void;
}

export const WhatsNewScreen: React.FC<WhatsNewScreenProps> = ({ visible, onClose }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.emoji}>🎉</Text>
          <Text style={styles.title}>{t('whatsNew.title')}</Text>
          <Text style={styles.subtitle}>{t('whatsNew.subtitle')}</Text>
        </View>

        <View style={styles.features}>
          <Text style={styles.featuresTitle}>{t('whatsNew.features.multiLanguage')}</Text>
          <Text style={styles.featuresTitle}>{t('whatsNew.features.multiCurrency')}</Text>
          <Text style={styles.featuresTitle}>{t('whatsNew.features.templates')}</Text>
          <Text style={styles.featuresTitle}>{t('whatsNew.features.customization')}</Text>
        </View>

        <View style={styles.migration}>
          <Text style={styles.migrationText}>{t('whatsNew.dataPreserved')}</Text>
        </View>

        <View style={styles.footer}>
          <Button onPress={onClose} size="lg" fullWidth>
            {t('whatsNew.gotIt')}
          </Button>
        </View>
      </ScrollView>
    </Modal>
  );
};

interface FeatureItemProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, description }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.featureItem}>
      <View style={styles.featureIcon}>
        <Text style={styles.featureIconText}>{icon}</Text>
      </View>
      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </View>
  );
};

const createStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    paddingTop: SPACING.xl,
  },
  emoji: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZE.xxxl,
    fontFamily: FONTS.bold,
    color: colors.textPrimary,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONT_SIZE.lg,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: SPACING.md,
  },
  features: {
    marginBottom: SPACING.xl,
  },
  featuresTitle: {
    fontSize: FONT_SIZE.xl,
    fontFamily: FONTS.semibold,
    color: colors.textPrimary,
    marginBottom: SPACING.md,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
    backgroundColor: colors.surface,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: colors.primaryLight + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  featureIconText: {
    fontSize: FONT_SIZE.xxl,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.semibold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: FONT_SIZE.sm,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  migration: {
    backgroundColor: colors.primaryLight + '10',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    marginBottom: SPACING.xl,
  },
  migrationTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.semibold,
    color: colors.textPrimary,
    marginBottom: SPACING.xs,
  },
  migrationText: {
    fontSize: FONT_SIZE.sm,
    color: colors.textSecondary,
    marginBottom: SPACING.xs,
    lineHeight: 20,
  },
  footer: {
    marginTop: SPACING.lg,
  },
  footerText: {
    fontSize: FONT_SIZE.sm,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: SPACING.md,
  },
});
