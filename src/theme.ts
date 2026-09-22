/**
 * Design tokens — extracted verbatim from docs/linker-app-screens.html :root
 * + dimensions from Design.md §3-4. HTML is source of truth; do not drift.
 */
export const colors = {
  boardBg: '#c7ccd6',
  screenBg: '#f7f8fa',
  screenBgAlt: '#eef0f4',
  screenBgDark: '#14161a',
  textPrimary: '#14161a',
  textSecondary: '#888d96',
  textTertiary: '#b3b7bf',
  border: '#eaebee',
  borderDark: '#3a3f47',
  inputBg: '#f2f3f5',
  inputBgDark: '#1e2126',
  blue: '#2f6fed',
  blueBg: '#e3ebfd',
  pink: '#f2436a',
  pinkBg: '#fde3ea',
  orange: '#f5a623',
  orangeBg: '#fef1db',
  teal: '#14b8a6',
  tealBg: '#d9f5f1',
  dark: '#17181c',
  white: '#ffffff',
  signoutBg: '#fdeaed',
  signoutText: '#e63757',
  signoutBgDark: '#3a1a24',
  signoutTextDark: '#fda4af',
  overlay: 'rgba(10,12,20,0.5)',
} as const;

export const typography = {
  wordmark: { fontSize: 29, fontWeight: '800' as const, letterSpacing: -0.6 },
  screenTitle: { fontSize: 23, fontWeight: '800' as const, letterSpacing: -0.3 },
  sectionTitle: { fontSize: 19, fontWeight: '800' as const, letterSpacing: -0.2 },
  onboardingTitle: { fontSize: 21, fontWeight: '800' as const, letterSpacing: -0.3 },
  body: { fontSize: 13, lineHeight: 20 },
  bodySmall: { fontSize: 12.5, lineHeight: 19 },
  metadata: { fontSize: 11, color: colors.textTertiary },
  itemTitle: { fontSize: 12.8, fontWeight: '700' as const },
  navLabel: { fontSize: 9.5, fontWeight: '500' as const },
} as const;

export const spacing = {
  pageHorizontal: 22,
  pageHorizontalNarrow: 20,
  searchHeight: 42,
  inputHeight: 48,
  primaryButtonHeight: 50,
  iconButtonSmall: 32,
  roundButton: 33,
  listThumb: 42,
  collectionIcon: 44,
} as const;

export const radii = {
  phone: 38,
  card: 17,
  input: 14,
  search: 13,
  thumb: 13,
  collectionIcon: 14,
  sheetTop: 28,
  pill: 20,
  circle: 999,
} as const;

export const shadows = {
  card: {
    shadowColor: '#14161e',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  sheet: {
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: -14 },
    elevation: 8,
  },
} as const;

export const iconSizes = {
  xs: 13,
  sm: 15,
  md: 17,
  lg: 21,
  nav: 21,
} as const;

export type CollectionColorKey = 'pink' | 'blue' | 'teal' | 'orange';

export const collectionThemes: Record<
  CollectionColorKey,
  { bg: string; fg: string }
> = {
  pink: { bg: colors.pinkBg, fg: colors.pink },
  blue: { bg: colors.blueBg, fg: colors.blue },
  teal: { bg: colors.tealBg, fg: colors.teal },
  orange: { bg: colors.orangeBg, fg: colors.orange },
};

export type Palette = {
  boardBg: string;
  screenBg: string;
  screenBgAlt: string;
  cardBg: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  border: string;
  inputBg: string;
  avatarBg: string;
  blue: string;
  blueBg: string;
  pink: string;
  pinkBg: string;
  orange: string;
  orangeBg: string;
  teal: string;
  tealBg: string;
  dark: string;
  white: string;
  signoutBg: string;
  signoutText: string;
  overlay: string;
};

export const lightPalette: Palette = {
  boardBg: colors.boardBg,
  screenBg: colors.screenBg,
  screenBgAlt: colors.screenBgAlt,
  cardBg: '#ffffff',
  textPrimary: colors.textPrimary,
  textSecondary: colors.textSecondary,
  textTertiary: colors.textTertiary,
  border: colors.border,
  inputBg: colors.inputBg,
  avatarBg: '#dfe2e8',
  blue: colors.blue,
  blueBg: colors.blueBg,
  pink: colors.pink,
  pinkBg: colors.pinkBg,
  orange: colors.orange,
  orangeBg: colors.orangeBg,
  teal: colors.teal,
  tealBg: colors.tealBg,
  dark: colors.dark,
  white: colors.white,
  signoutBg: colors.signoutBg,
  signoutText: colors.signoutText,
  overlay: colors.overlay,
};

export const darkPalette: Palette = {
  boardBg: '#0e1013',
  screenBg: colors.screenBgDark,
  screenBgAlt: '#1a1d22',
  cardBg: '#1e2126',
  textPrimary: '#eef0f4',
  textSecondary: '#9aa0a8',
  textTertiary: '#71767e',
  border: colors.borderDark,
  inputBg: colors.inputBgDark,
  avatarBg: '#2a2d36',
  blue: colors.blue,
  blueBg: '#1b2a4a',
  pink: colors.pink,
  pinkBg: '#3d1a26',
  orange: colors.orange,
  orangeBg: '#3a2e1a',
  teal: colors.teal,
  tealBg: '#12332f',
  dark: '#2a2d36',
  white: colors.white,
  signoutBg: colors.signoutBgDark,
  signoutText: colors.signoutTextDark,
  overlay: colors.overlay,
};

export function getPalette(dark: boolean): Palette {
  return dark ? darkPalette : lightPalette;
}

export function themesFor(c: Palette): Record<CollectionColorKey, { bg: string; fg: string }> {
  return {
    pink: { bg: c.pinkBg, fg: c.pink },
    blue: { bg: c.blueBg, fg: c.blue },
    teal: { bg: c.tealBg, fg: c.teal },
    orange: { bg: c.orangeBg, fg: c.orange },
  };
}
