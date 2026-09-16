import { Platform } from 'react-native';

export type ColorScheme = 'light' | 'dark';
export type ThemePreference = 'light' | 'dark' | 'system';

type Palette = {
  maroon: string;
  maroonDark: string;
  maroonDeep: string;
  maroonSoft: string;
  cream: string;
  paper: string;
  surface: string;
  ink: string;
  inkMuted: string;
  border: string;
  borderStrong: string;
  blue: string;
  blueSoft: string;
  green: string;
  greenSoft: string;
  amber: string;
  amberSoft: string;
  red: string;
  redSoft: string;
  white: string;
  black: string;
  shadow: string;
};

const LIGHT: Palette = {
  maroon: '#862633',
  maroonDark: '#651C28',
  maroonDeep: '#46131B',
  maroonSoft: '#F5E9EB',
  cream: '#F7F3EA',
  paper: '#FFFEFB',
  surface: '#FFFFFF',
  ink: '#1C1B1A',
  inkMuted: '#68635E',
  border: '#E4DDD4',
  borderStrong: '#CFC5BA',
  blue: '#165D83',
  blueSoft: '#E6F1F6',
  green: '#217A52',
  greenSoft: '#E5F4EC',
  amber: '#A36212',
  amberSoft: '#FFF2D8',
  red: '#B42318',
  redSoft: '#FDECEA',
  white: '#FFFFFF',
  black: '#000000',
  shadow: '#37151B',
};

const DARK: Palette = {
  maroon: '#B0485A',
  maroonDark: '#933B4B',
  maroonDeep: '#6E2C3A',
  maroonSoft: '#3A2028',
  cream: '#141210',
  paper: '#1C1915',
  surface: '#24201A',
  ink: '#F3EFE8',
  inkMuted: '#A69E93',
  border: '#352E26',
  borderStrong: '#4C4238',
  blue: '#5EA6D6',
  blueSoft: '#16303D',
  green: '#57B98E',
  greenSoft: '#16302A',
  amber: '#D79B4C',
  amberSoft: '#33291A',
  red: '#E6796F',
  redSoft: '#341D1D',
  white: '#FFFFFF',
  black: '#000000',
  shadow: '#000000',
};

const THEME_KEY = 'pugliese-navigate.theme';
const g = globalThis as unknown as {
  localStorage?: { getItem(k: string): string | null; setItem(k: string, v: string): void };
  matchMedia?: (q: string) => { matches: boolean };
  location?: { reload(): void };
};

function systemScheme(): ColorScheme {
  try {
    if (g.matchMedia) return g.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    // ignore
  }
  return 'light';
}

function storedPreference(): ThemePreference {
  try {
    const value = g.localStorage?.getItem(THEME_KEY);
    if (value === 'light' || value === 'dark' || value === 'system') return value;
  } catch {
    // ignore
  }
  return 'system';
}

// Resolve the active scheme once at load. Screens build their styles from
// `colors` at import time, so switching persists the choice and reloads.
const preference = storedPreference();
export const activeScheme: ColorScheme = preference === 'system' ? systemScheme() : preference;
export const colors: Palette = activeScheme === 'dark' ? DARK : LIGHT;

export function getThemePreference(): ThemePreference {
  return storedPreference();
}

export function setThemePreference(preference: ThemePreference): void {
  try {
    g.localStorage?.setItem(THEME_KEY, preference);
  } catch {
    // ignore
  }
  try {
    if (Platform.OS === 'web') g.location?.reload();
  } catch {
    // ignore
  }
}

export const fonts = {
  ui: 'SourceSans3_400Regular',
  uiMedium: 'SourceSans3_600SemiBold',
  uiBold: 'SourceSans3_700Bold',
  display: 'CormorantGaramond_600SemiBold',
  displayItalic: 'CormorantGaramond_600SemiBold_Italic',
  typewriter: Platform.select({
    ios: 'Courier New',
    android: 'monospace',
    web: "'Courier New', ui-monospace, monospace",
    default: 'monospace',
  }) as string,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radii = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 30,
  round: 999,
} as const;

export const shadows = {
  card: Platform.select({
    ios: { shadowColor: colors.shadow, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.09, shadowRadius: 18 },
    android: { elevation: 3 },
    default: { boxShadow: `0 8px 24px ${activeScheme === 'dark' ? 'rgba(0, 0, 0, 0.35)' : 'rgba(55, 21, 27, 0.09)'}` },
  }),
  floating: Platform.select({
    ios: { shadowColor: colors.black, shadowOffset: { width: 0, height: 8 }, shadowOpacity: activeScheme === 'dark' ? 0.4 : 0.18, shadowRadius: 18 },
    android: { elevation: 8 },
    default: { boxShadow: `0 10px 30px ${activeScheme === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.16)'}` },
  }),
} as const;

export const layout = {
  contentMaxWidth: 760,
  railHeight: 72,
} as const;
