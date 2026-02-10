// src/components/dashboard/QuickActions.tsx
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import type { AppColors } from '../../constants/theme';
import {
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
  FONTS,
} from '../../constants/theme';

interface QuickActionButton {
  id: string;
  titleKey: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
}

export const QuickActions: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const actions: QuickActionButton[] = [
    {
      id: 'new-invoice',
      titleKey: 'dashboard.newInvoice',
      icon: 'document-text',
      color: colors.primary,
      onPress: () => router.push('/documento/nuevo?tipo=factura'),
    },
    {
      id: 'new-quote',
      titleKey: 'dashboard.newQuote',
      icon: 'document-outline',
      color: '#10B981',
      onPress: () => router.push('/documento/nuevo?tipo=presupuesto'),
    },
    {
      id: 'clients',
      titleKey: 'dashboard.clients',
      icon: 'people',
      color: '#8B5CF6',
      onPress: () => router.push('/(tabs)/clientes'),
    },
    {
      id: 'history',
      titleKey: 'dashboard.history',
      icon: 'time',
      color: '#F59E0B',
      onPress: () => router.push('/(tabs)/historial'),
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('dashboard.quickActions')}</Text>
      <View style={styles.grid}>
        {actions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={styles.actionButton}
            onPress={action.onPress}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.actionIcon,
                { backgroundColor: action.color + '15' },
              ]}
            >
              <Ionicons name={action.icon} size={24} color={action.color} />
            </View>
            <Text style={styles.actionTitle}>{t(action.titleKey)}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const createStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.bold,
    color: colors.textPrimary,
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.xs,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  actionButton: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: colors.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 1.5,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  actionTitle: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.semibold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
});
