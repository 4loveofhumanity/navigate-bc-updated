import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { type Href, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radii, shadows, spacing } from '@/constants/theme';

type FeatureCardProps = {
  title: string;
  subtitle?: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  href: Href;
  tone?: 'maroon' | 'blue';
  badge?: string;
};

export function FeatureCard({ title, subtitle, icon, href, tone = 'maroon', badge }: FeatureCardProps) {
  const router = useRouter();
  const accent = tone === 'blue' ? colors.blue : colors.maroon;
  const soft = tone === 'blue' ? colors.blueSoft : colors.maroonSoft;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={subtitle ? `${title}. ${subtitle}` : title}
      onPress={() => {
        void Haptics.selectionAsync();
        router.push(href);
      }}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
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
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    flexBasis: '31%',
    flexGrow: 0,
    justifyContent: 'flex-start',
    minHeight: 104,
    padding: spacing.sm + 2,
    position: 'relative',
    ...shadows.card,
  },
  pressed: { opacity: 0.72, transform: [{ scale: 0.97 }] },
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
