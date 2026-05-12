export const darkTheme = {
  background: '#111827',
  surface: '#1F2937',
  card: '#374151',
  foreground: '#F9FAFB',
  secondary: '#9CA3AF',
  main: '#7C3AED',
  purple: '#7C3AED',
  orange: '#EF4444',
  green: '#10B981',
  border: 'rgba(255,255,255,0.08)',
  // Legacy compat
  viewColor: '#1F2937',
  subViewColor: '#374151',
  buttonColor: '#7C3AED',
  buttonTextColor: '#FFFFFF',
};

export const lightTheme = {
  background: '#F9FAFB',
  surface: '#FFFFFF',
  card: '#F3F4F6',
  foreground: '#111827',
  secondary: '#6B7280',
  purple: '#7C3AED',
  main: '#7C3AED',
  orange: '#EF4444',
  green: '#10B981',
  border: 'rgba(0,0,0,0.08)',
  // Legacy compat
  viewColor: '#FFFFFF',
  subViewColor: '#F3F4F6',
  buttonColor: '#7C3AED',
  buttonTextColor: '#FFFFFF',
};

export type AppTheme = typeof darkTheme;
