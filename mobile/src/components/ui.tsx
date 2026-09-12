import { Ionicons } from '@expo/vector-icons';
import type { PropsWithChildren, ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors, fonts, radii, shadows, spacing } from '@/constants/theme';

export function PageIntro({ eyebrow, title, body }: { eyebrow?: string; title: string; body?: string }) {
  return (
    <View style={styles.intro}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <Text style={styles.pageTitle}>{title}</Text>
      {body ? <Text style={styles.pageBody}>{body}</Text> : null}
    </View>
  );
}

export function SectionTitle({ children, action }: PropsWithChildren<{ action?: ReactNode }>) {
  return (
    <View style={styles.sectionTitleRow}>
      <Text style={styles.sectionTitle}>{children}</Text>
      {action}
    </View>
  );
}

export function SearchField({
  value,
  onChangeText,
  placeholder,
}: {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
}) {
  return (
    <View style={styles.searchWrap}>
      <Ionicons name="search" size={19} color={colors.inkMuted} />
      <TextInput
        accessibilityLabel={placeholder}
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.inkMuted}
        returnKeyType="search"
        style={styles.searchInput}
        value={value}
      />
      {value ? (
        <Pressable accessibilityLabel="Clear search" accessibilityRole="button" onPress={() => onChangeText('')} hitSlop={10}>
          <Ionicons name="close-circle" size={19} color={colors.inkMuted} />
        </Pressable>
      ) : null}
    </View>
  );
}

type SegmentOption<T extends string> = { label: string; value: T };

export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: SegmentOption<T>[];
  onChange: (value: T) => void;
}) {
  return (
    <View style={styles.segmented}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected }}
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[styles.segmentButton, selected && styles.segmentButtonSelected]}
          >
            <Text style={[styles.segmentLabel, selected && styles.segmentLabelSelected]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function Surface({ children, style }: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  return <View style={[styles.surface, style]}>{children}</View>;
}

export function ListRow({
  icon,
  iconColor = colors.maroon,
  title,
  subtitle,
  meta,
  onPress,
}: {
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  title: string;
  subtitle?: string;
  meta?: string;
  onPress?: () => void;
}) {
  const content = (
    <>
      {icon ? (
        <View style={styles.rowIcon}>
          <Ionicons name={icon} size={20} color={iconColor} />
        </View>
      ) : null}
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{title}</Text>
        {subtitle ? <Text style={styles.rowSubtitle}>{subtitle}</Text> : null}
      </View>
      {meta ? <Text style={styles.rowMeta}>{meta}</Text> : null}
      {onPress ? <Ionicons name="chevron-forward" size={18} color={colors.borderStrong} /> : null}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityLabel={subtitle ? `${title}. ${subtitle}` : title}
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      >
        {content}
      </Pressable>
    );
  }

  return <View style={styles.row}>{content}</View>;
}

export function Pill({
  children,
  tone = 'neutral',
}: PropsWithChildren<{ tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'maroon' }>) {
  const tones = {
    neutral: { backgroundColor: colors.cream, color: colors.inkMuted },
    success: { backgroundColor: colors.greenSoft, color: colors.green },
    warning: { backgroundColor: colors.amberSoft, color: colors.amber },
    danger: { backgroundColor: colors.redSoft, color: colors.red },
    maroon: { backgroundColor: colors.maroonSoft, color: colors.maroon },
  };

  return <Text style={[styles.pill, tones[tone]]}>{children}</Text>;
}

export function EmptyState({ icon, title, body }: { icon: keyof typeof Ionicons.glyphMap; title: string; body: string }) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Ionicons name={icon} size={28} color={colors.maroon} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyBody}>{body}</Text>
    </View>
  );
}

export function ActionButton({
  label,
  icon,
  onPress,
  variant = 'primary',
}: {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
}) {
  const buttonStyle = variant === 'primary' ? styles.primaryButton : variant === 'danger' ? styles.dangerButton : styles.secondaryButton;
  const labelStyle = variant === 'secondary' ? styles.secondaryButtonLabel : styles.primaryButtonLabel;
  const iconColor = variant === 'secondary' ? colors.maroon : colors.white;
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.button, buttonStyle, pressed && styles.buttonPressed]}
    >
      {icon ? <Ionicons name={icon} size={18} color={iconColor} /> : null}
      <Text style={labelStyle}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  intro: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, paddingTop: spacing.xl },
  eyebrow: {
    color: colors.maroon,
    fontFamily: fonts.uiBold,
    fontSize: 11,
    letterSpacing: 1.6,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  pageTitle: { color: colors.ink, fontFamily: fonts.display, fontSize: 34, lineHeight: 36 },
  pageBody: { color: colors.inkMuted, fontFamily: fonts.ui, fontSize: 15, lineHeight: 21, marginTop: spacing.sm },
  sectionTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: { color: colors.ink, fontFamily: fonts.uiBold, fontSize: 18 },
  searchWrap: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    minHeight: 48,
    paddingHorizontal: spacing.md,
  },
  searchInput: { color: colors.ink, flex: 1, fontFamily: fonts.ui, fontSize: 16, paddingVertical: spacing.sm },
  segmented: {
    backgroundColor: '#EDE7DF',
    borderRadius: radii.md,
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    padding: 4,
  },
  segmentButton: { alignItems: 'center', borderRadius: 12, flex: 1, paddingHorizontal: spacing.sm, paddingVertical: 10 },
  segmentButtonSelected: { backgroundColor: colors.surface, ...shadows.card },
  segmentLabel: { color: colors.inkMuted, fontFamily: fonts.uiMedium, fontSize: 14 },
  segmentLabelSelected: { color: colors.maroon, fontFamily: fonts.uiBold },
  surface: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: StyleSheet.hairlineWidth,
    marginHorizontal: spacing.lg,
    overflow: 'hidden',
    ...shadows.card,
  },
  row: {
    alignItems: 'center',
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: spacing.md,
    minHeight: 70,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  rowPressed: { backgroundColor: colors.cream },
  rowIcon: {
    alignItems: 'center',
    backgroundColor: colors.maroonSoft,
    borderRadius: radii.sm,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  rowText: { flex: 1 },
  rowTitle: { color: colors.ink, fontFamily: fonts.uiBold, fontSize: 15, lineHeight: 19 },
  rowSubtitle: { color: colors.inkMuted, fontFamily: fonts.ui, fontSize: 13, lineHeight: 18, marginTop: 3 },
  rowMeta: { color: colors.inkMuted, fontFamily: fonts.uiMedium, fontSize: 12, marginLeft: spacing.sm },
  pill: {
    alignSelf: 'flex-start',
    borderRadius: radii.round,
    fontFamily: fonts.uiBold,
    fontSize: 11,
    overflow: 'hidden',
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  empty: { alignItems: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.xxxl },
  emptyIcon: {
    alignItems: 'center',
    backgroundColor: colors.maroonSoft,
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    marginBottom: spacing.md,
    width: 56,
  },
  emptyTitle: { color: colors.ink, fontFamily: fonts.uiBold, fontSize: 18 },
  emptyBody: { color: colors.inkMuted, fontFamily: fonts.ui, fontSize: 14, lineHeight: 20, marginTop: spacing.sm, textAlign: 'center' },
  button: {
    alignItems: 'center',
    borderRadius: radii.md,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: spacing.lg,
  },
  primaryButton: { backgroundColor: colors.maroon },
  dangerButton: { backgroundColor: colors.red },
  secondaryButton: { backgroundColor: colors.maroonSoft, borderColor: '#E4C7CC', borderWidth: 1 },
  primaryButtonLabel: { color: colors.white, fontFamily: fonts.uiBold, fontSize: 15 },
  secondaryButtonLabel: { color: colors.maroon, fontFamily: fonts.uiBold, fontSize: 15 },
  buttonPressed: { opacity: 0.72, transform: [{ scale: 0.98 }] },
});
