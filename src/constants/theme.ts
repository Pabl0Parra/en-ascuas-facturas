export const COLORS = {
  // Primarios (acentos fuego)
  primary: '#FF4500',        // Orange Red - acento principal
  primaryDark: '#CC3700',    // Pressed states
  primaryLight: '#FF6A33',   // Highlights
  
  // Neutros
  background: '#FFFFFF',     // Fondo principal
  surface: '#F5F5F5',        // Superficies elevadas
  card: '#FAFAFA',           // Cards
  
  // Texto
  textPrimary: '#1A1A1A',    // Texto principal (casi negro)
  textSecondary: '#666666',  // Texto secundario
  textMuted: '#999999',      // Texto deshabilitado
  textInverse: '#FFFFFF',    // Texto sobre fondos oscuros
  
  // Bordes
  border: '#E0E0E0',
  borderDark: '#CCCCCC',
  divider: '#EEEEEE',
  
  // Estados
  success: '#28A745',
  error: '#DC3545',
  warning: '#FFC107',
  
  // Especiales
  black: '#000000',          // Logo, headers importantes
  ember: '#E25822',          // Variante brasa
} as const;

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
