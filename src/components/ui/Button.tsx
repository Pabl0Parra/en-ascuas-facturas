import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZE } from '../../constants/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

const getButtonStyles = (variant: ButtonVariant, size: ButtonSize, disabled: boolean): ViewStyle => {
  const baseStyle: ViewStyle = {
    borderRadius: BORDER_RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  };
  
  // Size styles
  const sizeStyles: Record<ButtonSize, ViewStyle> = {
    sm: { paddingVertical: SPACING.xs, paddingHorizontal: SPACING.sm },
    md: { paddingVertical: SPACING.sm, paddingHorizontal: SPACING.md },
    lg: { paddingVertical: SPACING.md, paddingHorizontal: SPACING.lg },
  };
  
  // Variant styles
  const variantStyles: Record<ButtonVariant, ViewStyle> = {
    primary: { backgroundColor: COLORS.primary },
    secondary: { backgroundColor: COLORS.surface },
    outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: COLORS.primary },
    ghost: { backgroundColor: 'transparent' },
  };
  
  return {
    ...baseStyle,
    ...sizeStyles[size],
    ...variantStyles[variant],
    opacity: disabled ? 0.5 : 1,
  };
};

const getTextStyles = (variant: ButtonVariant, size: ButtonSize): TextStyle => {
  const baseFontSize: Record<ButtonSize, number> = {
    sm: FONT_SIZE.sm,
    md: FONT_SIZE.md,
    lg: FONT_SIZE.lg,
  };
  
  const baseStyle: TextStyle = {
    fontWeight: '600',
    fontSize: baseFontSize[size],
  };
  
  const variantTextColors: Record<ButtonVariant, string> = {
    primary: COLORS.textInverse,
    secondary: COLORS.textPrimary,
    outline: COLORS.primary,
    ghost: COLORS.primary,
  };
  
  return {
    ...baseStyle,
    color: variantTextColors[variant],
  };
};

export const Button: React.FC<ButtonProps> = ({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  style,
}) => {
  const buttonStyle = getButtonStyles(variant, size, disabled || loading);
  const textStyle = getTextStyles(variant, size);
  
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        buttonStyle,
        fullWidth && styles.fullWidth,
        style,
      ]}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? COLORS.textInverse : COLORS.primary}
          size="small"
        />
      ) : (
        <>
          {icon && <Text style={styles.iconWrapper}>{icon}</Text>}
          <Text style={textStyle}>{children}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fullWidth: {
    width: '100%',
  },
  iconWrapper: {
    marginRight: SPACING.xs,
  },
});
