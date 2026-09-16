import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { type Href, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radii, spacing } from '@/constants/theme';

type FeatureCardProps = {
  title: string;
  subtitle?: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  href: Href;
  tone?: 'maroon' | 'blue';
  badge?: string;
};

// Slightly irregular, hand-drawn card shapes (uneven corners + a tiny tilt),
// picked per card so the grid reads as sketched rather than uniform.
const SKETCH_SHAPES = [
  { borderTopLeftRadius: 15, borderTopRightRadius: 9, borderBottomRightRadius: 17, borderBottomLeftRadius: 12, transform: [{ rotate: '-0.5deg' }] },
  { borderTopLeftRadius: 10, borderTopRightRadius: 17, borderBottomRightRadius: 11, borderBottomLeftRadius: 16, transform: [{ rotate: '0.45deg' }] },
  { borderTopLeftRadius: 17, borderTopRightRadius: 13, borderBottomRightRadius: 15, borderBottomLeftRadius: 19, transform: [{ rotate: '0.25deg' }] },
  { borderTopLeftRadius: 12, borderTopRightRadius: 16, borderBottomRightRadius: 19, borderBottomLeftRadius: 10, transform: [{ rotate: '-0.3deg' }] },
] as const;

function sketchShape(seed: string) {
  let sum = 0;
  for (let i = 0; i < seed.length; i += 1) sum += seed.charCodeAt(i);
  return SKETCH_SHAPES[sum % SKETCH_SHAPES.length];
}

export function FeatureCard({ title, subtitle, icon, href, tone = 'maroon', badge }: FeatureCardProps) {
  const router = useRouter();
  const accent = tone === 'blue' ? colors.blue : colors.maroon;
  const soft = tone === 'blue' ? colors.blueSoft : colors.maroonSoft;
  const shape = sketchShape(title);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={subtitle ? `${title}. ${subtitle}` : title}
      onPress={() => {
        void Haptics.selectionAsync();
        router.push(href);
      }}
      style={({ pressed }) => [styles.card, shape, pressed && styles.pressed]}
    >
      <View style={[styles.icon, { backgroundColor: soft }]}>
        <MaterialCommunityIcons name={icon} size={23} color={accent} />
      </View>
      {badge ? <Text style={styles.badge}>{badge}</Text> : null}
      <Text numberOfLines={2} style={styles.title}>
        {title}
      </Text>
      {subtitle ? (
        <Text numberOfLines={3} style={styles.subtitle}>
          {subtitle}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.ink,
    borderWidth: 1.5,
    flexBasis: '31%',
    flexGrow: 0,
    justifyContent: 'flex-start',
    minHeight: 104,
    padding: spacing.sm + 2,
    position: 'relative',
  },
  pressed: { opacity: 0.6 },
  icon: {
    alignItems: 'center',
    borderRadius: radii.sm,
    height: 38,
    justifyContent: 'center',
    marginBottom: spacing.sm,
    width: 38,
  },
  badge: {
    backgroundColor: colors.amberSoft,
    borderRadius: radii.round,
    color: colors.amber,
    fontFamily: fonts.uiBold,
    fontSize: 9,
    paddingHorizontal: 7,
    paddingVertical: 3,
    position: 'absolute',
    right: spacing.sm,
    textTransform: 'uppercase',
    top: spacing.sm,
  },
  title: { color: colors.ink, fontFamily: fonts.uiBold, fontSize: 14, lineHeight: 17, textAlign: 'center' },
  subtitle: {
    color: colors.inkMuted,
    fontFamily: fonts.ui,
    fontSize: 11,
    lineHeight: 14,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});
