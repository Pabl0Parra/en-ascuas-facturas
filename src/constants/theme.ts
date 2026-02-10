// Type for the color palette
export interface AppColors {
  // Primary
  primary: string;
  primaryDark: string;
  primaryLight: string;

  // Backgrounds
  background: string;
  surface: string;
  card: string;

  // Text
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;

  // Borders
  border: string;
  borderDark: string;
  divider: string;

  // Status
  success: string;
  error: string;
  warning: string;
  info: string;

  // Special
  black: string;
}

// Light Mode — Comfortable & Safe
export const lightColors: AppColors = {
  primary: '#5B8FCC',
  primaryDark: '#4A7AB8',
  primaryLight: '#6FA8DC',

  background: '#F8FBFE',
  surface: '#E8F1FA',
  card: '#FFFFFF',

  textPrimary: '#2C3E50',
  textSecondary: '#7A8C9E',
  textMuted: '#A0B4C8',
  textInverse: '#FFFFFF',

  border: '#D0DEE8',
  borderDark: '#B0C4D8',
  divider: '#E0EAF2',

  success: '#81C784',
  error: '#E57373',
  warning: '#FFB74D',
  info: '#6FA8DC',

  black: '#1A2332',
};

// Dark Mode — Cozy & Secure
export const darkColors: AppColors = {
  primary: '#6FA8DC',
  primaryDark: '#5B8FCC',
  primaryLight: '#7FB8E8',

  background: '#1A1F2E',
  surface: '#2A3F5F',
  card: '#232A3E',

  textPrimary: '#E8E8E8',
  textSecondary: '#A0A8B0',
  textMuted: '#6B7580',
  textInverse: '#1A1F2E',

  border: '#354560',
  borderDark: '#2A3F5F',
  divider: '#253045',

  success: '#6DB672',
  error: '#CF6679',
  warning: '#FFB74D',
  info: '#5DA3D5',

  black: '#FFFFFF',
};

// Static fallback for class components (ErrorBoundary) that can't use hooks
export const COLORS = lightColors;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export const FONT_SIZE = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 24,
  xxxl: 32,
} as const;

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
} as const;
