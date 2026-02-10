import React, { useMemo } from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import type { AppColors } from '../../constants/theme';

type PaddingSize = 'none' | 'sm' | 'md' | 'lg';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  padding?: PaddingSize;
}

const paddingMap: Record<PaddingSize, number> = {
  none: 0,
  sm: SPACING.sm,
  md: SPACING.md,
  lg: SPACING.lg,
};

export const Card: React.FC<CardProps> = ({
  children,
  style,
  padding = 'md',
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View
      style={[
        styles.card,
        { padding: paddingMap[padding] },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const createStyles = (colors: AppColors) => StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.sm,
  },
});
