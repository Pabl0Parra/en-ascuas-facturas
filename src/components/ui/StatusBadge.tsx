// src/components/ui/StatusBadge.tsx
import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { DocumentStatus } from '../../types/document';
import { SPACING, FONT_SIZE, BORDER_RADIUS, FONTS } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import type { AppColors } from '../../constants/theme';

interface StatusBadgeProps {
  status: DocumentStatus;
  size?: 'small' | 'medium';
}

interface StatusConfig {
  label: string;
  color: string;
  backgroundColor: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const STATUS_CONFIG: Record<DocumentStatus, StatusConfig> = {
  draft: {
    label: 'Draft',
    color: '#6B7280',
    backgroundColor: '#6B728015',
    icon: 'create-outline',
  },
  sent: {
    label: 'Sent',
    color: '#3B82F6',
    backgroundColor: '#3B82F615',
    icon: 'send',
  },
  viewed: {
    label: 'Viewed',
    color: '#8B5CF6',
    backgroundColor: '#8B5CF615',
    icon: 'eye',
  },
  paid: {
    label: 'Paid',
    color: '#10B981',
    backgroundColor: '#10B98115',
    icon: 'checkmark-circle',
  },
  overdue: {
    label: 'Overdue',
    color: '#EF4444',
    backgroundColor: '#EF444415',
    icon: 'alert-circle',
  },
  cancelled: {
    label: 'Cancelled',
    color: '#6B7280',
    backgroundColor: '#6B728015',
    icon: 'close-circle',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'medium',
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const config = STATUS_CONFIG[status];
  const isSmall = size === 'small';

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: config.backgroundColor },
        isSmall && styles.containerSmall,
      ]}
    >
      <Ionicons
        name={config.icon}
        size={isSmall ? 12 : 16}
        color={config.color}
      />
      <Text
        style={[
          styles.label,
          { color: config.color },
          isSmall && styles.labelSmall,
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
};

const createStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    gap: SPACING.xs,
  },
  containerSmall: {
    paddingHorizontal: SPACING.xs,
    paddingVertical: 4,
    gap: 4,
  },
  label: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.semibold,
  },
  labelSmall: {
    fontSize: 10,
    fontFamily: FONTS.semibold,
  },
});
