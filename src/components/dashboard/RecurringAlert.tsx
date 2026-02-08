// src/components/dashboard/RecurringAlert.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  COLORS,
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
} from '../../constants/theme';

interface RecurringAlertProps {
  count: number;
}

export const RecurringAlert: React.FC<RecurringAlertProps> = ({ count }) => {
  const router = useRouter();

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
        <Ionicons name="repeat" size={24} color={COLORS.primary} />
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

      <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '10',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  description: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  badge: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.full,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  badgeText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    color: COLORS.textInverse,
  },
});
