// Values observed in Figma (SB-015). sds-size-space-200 = 8, sds-size-space-300 = 12.
export const spacing = {
  2: 2,
  3: 3,
  4: 4,
  6: 6,
  8: 8,
  10: 10,
  12: 12,
  15: 15, // figma: OfferGrid2Col gap
  16: 16,
  20: 20,
  24: 24,
} as const;

export const layout = {
  screenGutter: 20,
  sectionGap: 16,
  headerHeight: 56,
  bottomNavHeight: 95,
  glassButton: 50,
  scrollBottomPadding: 104, // keeps content clear of the tab bar
} as const;
