// src/components/dashboard/OverdueAlert.tsx
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

interface OverdueAlertProps {
  count: number;
}

export const OverdueAlert: React.FC<OverdueAlertProps> = ({ count }) => {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  if (count === 0) {
    return null;
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push('/(tabs)/historial')}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        <Ionicons name="alert-circle" size={24} color="#EF4444" />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Overdue Invoices</Text>
        <Text style={styles.description}>
          {count} invoice{count > 1 ? 's' : ''} past due date
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
    backgroundColor: '#EF444410',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#EF444430',
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
    backgroundColor: '#EF4444',
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
