import React, { useMemo } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import type { AppColors } from '../../constants/theme';

interface LoadingProps {
  size?: 'small' | 'large';
  color?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'large',
  color,
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const indicatorColor = color ?? colors.primary;

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={indicatorColor} />
    </View>
  );
};

const createStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
