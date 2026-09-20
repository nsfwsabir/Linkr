/**
 * Design tokens — extracted verbatim from docs/linker-app-screens.html :root
 * + dimensions from Design.md §3-4. HTML is source of truth; do not drift.
 */
export const colors = {
  boardBg: '#c7ccd6',
  screenBg: '#f7f8fa',
  screenBgAlt: '#eef0f4',
  textPrimary: '#14161a',
  textSecondary: '#888d96',
  textTertiary: '#b3b7bf',
  border: '#eaebee',
  inputBg: '#f2f3f5',
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
