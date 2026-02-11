import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SPACING, FONT_SIZE, FONTS } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import type { AppColors } from '../../constants/theme';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: {
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
  };
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  onBack,
  rightAction,
}) => {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.leftSection}>
        {showBack ? (
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        ) : (
          <Image
            source={isDark
              ? require('../../../assets/images/bilio-text-dark.png')
              : require('../../../assets/images/bilio-text-light.png')
            }
            style={styles.logo}
            resizeMode="contain"
          />
        )}
      </View>

      <Text style={styles.title} numberOfLines={1}>{title}</Text>

      <View style={styles.rightSection}>
        {rightAction && (
          <TouchableOpacity onPress={rightAction.onPress} style={styles.actionButton}>
            <Ionicons name={rightAction.icon} size={24} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const createStyles = (colors: AppColors) => StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  leftSection: {
    width: 60,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  logo: {
    width: 76,
    height: 24,
  },
  rightSection: {
    width: 60,
    alignItems: 'flex-end',
  },
  title: {
    flex: 1,
    fontSize: FONT_SIZE.xl,
    fontFamily: FONTS.bold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  backButton: {
    padding: SPACING.xs,
  },
  actionButton: {
    padding: SPACING.xs,
  },
});
