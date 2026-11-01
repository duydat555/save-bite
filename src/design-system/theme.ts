import { colors, glass, layout, radius, shadows, spacing, typography } from './tokens';

export const theme = { colors, glass, layout, radius, shadows, spacing, typography } as const;
export type Theme = typeof theme;
