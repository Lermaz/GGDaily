export const theme = {
  colors: {
    background: '#F8FAFC',
    surface: '#FFFFFF',
    primary: '#2563EB',
    primaryPressed: '#1D4ED8',
    text: '#0F172A',
    textSecondary: '#475569',
    border: '#CBD5E1',
    error: '#DC2626',
    errorBackground: '#FEF2F2',
    success: '#16A34A',
    successBackground: '#F0FDF4',
    white: '#FFFFFF',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
  },
  typography: {
    title: 28,
    subtitle: 16,
    body: 16,
    label: 14,
    caption: 13,
  },
  touchTarget: 44,
} as const;

export type Theme = typeof theme;
