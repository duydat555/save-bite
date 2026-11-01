// Mirrors docs/02-DESIGN-TOKENS.md (Figma: Foundations + variables). Keep in sync 1-1.
export const colors = {
  brand900: '#004337', // Level 3 · focal / CTA
  brand700: '#2D7055', // secondary brand, pickup time text
  brand100: '#EDF3E7', // Level 1 · sage well
  canvas: '#FFFCF6', // Level 0 · screen background
  surfaceSubtle: '#F4EFE6', // Level 1 · inset group (search, tiles)
  surfaceElevated: '#FFFFFF', // Level 2 · entity card
  price: '#B34021', // rescue price · urgent accent
  textPrimary: '#092F29',
  textSecondary: '#606E66',
  textInverse: '#FFFFFF',
  success: '#25603C',
  successBg: '#EDF3E7',
  warning: '#9A5400',
  warningBg: '#FEF6EE',
  danger: '#B42318',
  dangerBg: '#FDECEA', // ESTIMATE from SB-075 ("Quá hạn" tag) — bg token not exposed
  borderDefault: '#E8E2D8', // var color-border-default (also literal on OfferCard / OfferListRow)
  wheatLight: '#F1D8AF', // var color/brand/wheatlight (SB-004 stage)
  dotInactive: '#D5CEC2', // figma: literal on SB-002 page dots
  heroSub: '#F2F2ED', // figma: literal on SB-005 subtitle
  onboardingEllipse: '#D7834B', // figma: SB-002 hero ellipse (16% opacity)
  borderControl: '#7B8A80', // var color-border-control (input outline)
  inputText: '#1E1E1E', // var sds-color-text-default-default
  warningBorder: '#F1DEC6', // figma: literal on SB-034 AllergenNotice
  homeIndicator: 'rgba(9,47,41,0.85)',
  black: '#000000',
  white: '#FFFFFF',
} as const;

// Liquid Glass approximation (expo-blur). Figma: Opacity 25, Frost 6, Fills-Vibrant/Tertiary #EDEDED.
export const glass = {
  fill: 'rgba(255,255,255,0.25)',
  border: 'rgba(255,255,255,0.7)',
  vibrantTertiary: '#EDEDED',
  blurIntensity: 40,
} as const;

export type ColorToken = keyof typeof colors;
