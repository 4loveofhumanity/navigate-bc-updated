import { Platform } from 'react-native';

export const colors = {
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
} as const;

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
    ios: {
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.09,
      shadowRadius: 18,
    },
    android: { elevation: 3 },
    default: { boxShadow: '0 8px 24px rgba(55, 21, 27, 0.09)' },
  }),
  floating: Platform.select({
    ios: {
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.18,
      shadowRadius: 18,
    },
    android: { elevation: 8 },
    default: { boxShadow: '0 10px 30px rgba(0, 0, 0, 0.16)' },
  }),
} as const;

export const layout = {
  contentMaxWidth: 760,
  railHeight: 72,
} as const;
