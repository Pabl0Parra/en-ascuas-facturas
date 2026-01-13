import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS } from '../../constants/theme';

type IconButtonSize = 'sm' | 'md' | 'lg';
type IconButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface IconButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  size?: IconButtonSize;
  variant?: IconButtonVariant;
  disabled?: boolean;
  style?: ViewStyle;
}

const sizeMap: Record<IconButtonSize, { button: number; icon: number }> = {
  sm: { button: 32, icon: 18 },
  md: { button: 44, icon: 24 },
  lg: { button: 56, icon: 32 },
};

const variantStyles: Record<IconButtonVariant, { bg: string; color: string }> = {
  primary: { bg: COLORS.primary, color: COLORS.textInverse },
  secondary: { bg: COLORS.surface, color: COLORS.textPrimary },
  ghost: { bg: 'transparent', color: COLORS.textSecondary },
  danger: { bg: COLORS.error, color: COLORS.textInverse },
};

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  size = 'md',
  variant = 'ghost',
  disabled = false,
  style,
}) => {
  const { button: buttonSize, icon: iconSize } = sizeMap[size];
  const { bg, color } = variantStyles[variant];
  
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        {
          width: buttonSize,
          height: buttonSize,
          backgroundColor: bg,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
      activeOpacity={0.7}
    >
      <Ionicons name={icon} size={iconSize} color={color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
