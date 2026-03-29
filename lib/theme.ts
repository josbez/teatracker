export const colors = {
  background: '#FAF8F5',
  surface: '#F2EDE6',
  primary: '#1C2E14',
  accent: '#4A7A35',
  textPrimary: '#1A1714',
  textMuted: '#8A8178',
  border: '#DDD7CE',
  danger: '#8B2E2E',
  white: '#FFFFFF',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 4,
  input: 8,
  card: 12,
  chip: 20,
} as const;

export const font = {
  h1: { fontSize: 28, fontWeight: '700' as const, color: '#1A1714' },
  h2: { fontSize: 22, fontWeight: '600' as const, color: '#1A1714' },
  h3: { fontSize: 17, fontWeight: '600' as const, color: '#1A1714' },
  body: { fontSize: 15, fontWeight: '400' as const, color: '#1A1714' },
  bodySmall: { fontSize: 13, fontWeight: '400' as const, color: '#8A8178' },
  label: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: '#8A8178',
    textTransform: 'uppercase' as const,
    letterSpacing: 0.8,
  },
  caption: { fontSize: 12, fontWeight: '400' as const, color: '#8A8178' },
  mono: { fontVariant: ['tabular-nums'] as const },
} as const;
