import { useThemeStore } from '../stores/themeStore';
import { lightColors, darkColors } from '../constants/theme';
import type { AppColors } from '../constants/theme';

export function useTheme() {
  const mode = useThemeStore((state) => state.mode);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const colors: AppColors = mode === 'dark' ? darkColors : lightColors;
  const isDark = mode === 'dark';
  return { colors, isDark, toggleTheme };
}
