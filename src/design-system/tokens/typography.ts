import type { TextStyle } from 'react-native';

// Loaded in app/_layout.tsx. Body = Be Vietnam Pro; display headings (onboarding) = Fraunces Bold.
export const fontFamily = {
  regular: 'BeVietnamPro_400Regular',
  medium: 'BeVietnamPro_500Medium',
  semiBold: 'BeVietnamPro_600SemiBold',
  bold: 'BeVietnamPro_700Bold',
  extraBold: 'BeVietnamPro_800ExtraBold',
  mono: 'JetBrainsMono_700Bold', // pickup code (SB-056)
  display: 'Fraunces_700Bold', // figma: "SOFT" 0 / "WONK" 1 axes are not available in the static font
} as const;

// lineHeight omitted where Figma says "normal". Extend per screen as Figma is read.
export const typography = {
  // — Display / brand —
  displayHero: {
    fontFamily: fontFamily.display,
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: -0.45,
  },
  splashTitle: { fontFamily: fontFamily.bold, fontSize: 44, lineHeight: 54, letterSpacing: -0.66 },
  splashTagline: { fontFamily: fontFamily.regular, fontSize: 15, lineHeight: 22 },
  splashCaption: { fontFamily: fontFamily.medium, fontSize: 13, lineHeight: 18 },
  wordmarkSm: { fontFamily: fontFamily.bold, fontSize: 18, lineHeight: 22, letterSpacing: -0.27 },
  wordmarkLg: { fontFamily: fontFamily.bold, fontSize: 36, lineHeight: 44, letterSpacing: -0.54 },
  welcomeTitle: { fontFamily: fontFamily.bold, fontSize: 29, lineHeight: 36 },
  welcomeSub: { fontFamily: fontFamily.medium, fontSize: 14 },
  brandTitle: { fontFamily: fontFamily.extraBold, fontSize: 20 },
  heroTitle: { fontFamily: fontFamily.bold, fontSize: 22, lineHeight: 26 },
  heroSub: { fontFamily: fontFamily.medium, fontSize: 12, lineHeight: 18 },
  // — Body / meta —
  bodyLg: { fontFamily: fontFamily.regular, fontSize: 15 }, // type/body/default 15/22 (lh normal on SB-003/004)
  body: { fontFamily: fontFamily.regular, fontSize: 14, lineHeight: 21 },
  bodyMedium: { fontFamily: fontFamily.medium, fontSize: 15, lineHeight: 22 }, // type/body/medium
  captionMeta: { fontFamily: fontFamily.medium, fontSize: 13, lineHeight: 18 }, // type/caption/meta
  eyebrow: { fontFamily: fontFamily.semiBold, fontSize: 12 },
  eyebrowPill: { fontFamily: fontFamily.bold, fontSize: 11 },
  helper: { fontFamily: fontFamily.regular, fontSize: 12 },
  helperRelaxed: { fontFamily: fontFamily.regular, fontSize: 12, lineHeight: 18 },
  meta: { fontFamily: fontFamily.medium, fontSize: 12 },
  caption: { fontFamily: fontFamily.medium, fontSize: 11 },
  // — Commerce —
  sectionTitle: { fontFamily: fontFamily.bold, fontSize: 16 },
  link: { fontFamily: fontFamily.semiBold, fontSize: 13 },
  price: { fontFamily: fontFamily.bold, fontSize: 18 },
  priceRow: { fontFamily: fontFamily.bold, fontSize: 16 },
  itemTitleCard: { fontFamily: fontFamily.semiBold, fontSize: 15, lineHeight: 20 },
  itemTitleRow: { fontFamily: fontFamily.semiBold, fontSize: 15 },
  tileLabel: { fontFamily: fontFamily.semiBold, fontSize: 12, lineHeight: 16 },
  pinTitleBold: { fontFamily: fontFamily.bold, fontSize: 14, lineHeight: 20 },
  pinTitleSemi: { fontFamily: fontFamily.semiBold, fontSize: 14, lineHeight: 20 },
  pinMeta: { fontFamily: fontFamily.medium, fontSize: 12, lineHeight: 16 },
  searchPlaceholder: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: -0.43,
  },
  // — Auth / forms (SB-006/007/008) —
  displayEditorial: {
    fontFamily: fontFamily.display,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.42,
  },
  authTitle: { fontFamily: fontFamily.bold, fontSize: 24 },
  authSub: { fontFamily: fontFamily.regular, fontSize: 14 },
  appBarTitle: { fontFamily: fontFamily.semiBold, fontSize: 17 },
  fieldLabel: { fontFamily: fontFamily.semiBold, fontSize: 14 }, // estimated from screenshot
  fieldValue: { fontFamily: fontFamily.regular, fontSize: 16 }, // estimated from screenshot
  linkMedium13: { fontFamily: fontFamily.medium, fontSize: 13 },
  linkMedium14: { fontFamily: fontFamily.medium, fontSize: 14 },
  // — Offer detail (SB-034) —
  detailTag: { fontFamily: fontFamily.semiBold, fontSize: 11 },
  detailTitle: { fontFamily: fontFamily.bold, fontSize: 21 },
  detailPrice: { fontFamily: fontFamily.bold, fontSize: 22 },
  detailBody: { fontFamily: fontFamily.regular, fontSize: 14, lineHeight: 20 },
  rowTitle: { fontFamily: fontFamily.semiBold, fontSize: 15 },
  rowSub: { fontFamily: fontFamily.regular, fontSize: 13 },
  rowSubMedium: { fontFamily: fontFamily.medium, fontSize: 13 },
  noticeTitle: { fontFamily: fontFamily.semiBold, fontSize: 12 },
  noticeBody: { fontFamily: fontFamily.regular, fontSize: 12, lineHeight: 17 },
  dockLabel: { fontFamily: fontFamily.medium, fontSize: 12 },
  // — Reserve / receipt / pass (SB-051/053/056) —
  bold12: { fontFamily: fontFamily.bold, fontSize: 12 },
  bold13: { fontFamily: fontFamily.bold, fontSize: 13 },
  bold14: { fontFamily: fontFamily.bold, fontSize: 14 },
  bold15: { fontFamily: fontFamily.bold, fontSize: 15 },
  note13: { fontFamily: fontFamily.regular, fontSize: 13, lineHeight: 20 },
  disclosure: { fontFamily: fontFamily.semiBold, fontSize: 13, lineHeight: 20 },
  hint11: { fontFamily: fontFamily.regular, fontSize: 11 },
  passCode: { fontFamily: fontFamily.mono, fontSize: 22, letterSpacing: 2 }, // estimated
  // — Orders / account (SB-060/062/063/091) —
  largeTitle: { fontFamily: fontFamily.bold, fontSize: 26 },
  segActive: { fontFamily: fontFamily.semiBold, fontSize: 14 },
  segInactive: { fontFamily: fontFamily.medium, fontSize: 14 },
  semi16: { fontFamily: fontFamily.semiBold, fontSize: 16 },
  semi14: { fontFamily: fontFamily.semiBold, fontSize: 14 },
  impactLabel: { fontFamily: fontFamily.bold, fontSize: 12, lineHeight: 16, letterSpacing: 0.24 },
  // — Search / results (SB-019…022) —
  title20: { fontFamily: fontFamily.bold, fontSize: 20, lineHeight: 26 },
  action17: { fontFamily: fontFamily.medium, fontSize: 17 },
  suggestRow: { fontFamily: fontFamily.medium, fontSize: 16 },
  alt17: { fontFamily: fontFamily.semiBold, fontSize: 17, lineHeight: 22 },
  alt14: { fontFamily: fontFamily.medium, fontSize: 14, lineHeight: 18 },
  // — Pantry (SB-074…090) —
  pantryTitle: { fontFamily: fontFamily.bold, fontSize: 30, lineHeight: 38 },
  rowName: { fontFamily: fontFamily.medium, fontSize: 14, lineHeight: 21 },
  statusTag: { fontFamily: fontFamily.semiBold, fontSize: 11, lineHeight: 16 },
  rowAction: { fontFamily: fontFamily.semiBold, fontSize: 12, lineHeight: 16 },
  dateCaption: { fontFamily: fontFamily.medium, fontSize: 12, lineHeight: 18 },
  formLabel: { fontFamily: fontFamily.semiBold, fontSize: 14 },
  heroPantry: { fontFamily: fontFamily.display, fontSize: 22, lineHeight: 28 },
  // — Controls (SDS Button, size Medium) — size/weight estimated from screenshots: not exposed (Code Connect).
  buttonLabel: { fontFamily: fontFamily.semiBold, fontSize: 16 },
  buttonSubtle: { fontFamily: fontFamily.regular, fontSize: 15 },
} satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;
