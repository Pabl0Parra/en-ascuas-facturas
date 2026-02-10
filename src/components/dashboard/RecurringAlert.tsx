// src/components/dashboard/RecurringAlert.tsx
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import type { AppColors } from '../../constants/theme';
import {
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
  FONTS,
} from '../../constants/theme';

interface RecurringAlertProps {
  count: number;
}

export const RecurringAlert: React.FC<RecurringAlertProps> = ({ count }) => {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  if (count === 0) {
    return null;
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push('/recurring')}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        <Ionicons name="repeat" size={24} color={colors.primary} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Recurring Invoices Due</Text>
        <Text style={styles.description}>
          {count} recurring invoice{count > 1 ? 's' : ''} ready to be generated
        </Text>
      </View>

      <View style={styles.badge}>
        <Text style={styles.badgeText}>{count}</Text>
      </View>

      <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
    </TouchableOpacity>
  );
};

const createStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '10',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.semibold,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  description: {
    fontSize: FONT_SIZE.sm,
    color: colors.textSecondary,
  },
  badge: {
    backgroundColor: colors.primary,
    borderRadius: BORDER_RADIUS.full,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  badgeText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: colors.textInverse,
  },
});
