import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { usePathname, useRouter } from 'expo-router';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmergencyModal } from '@/components/emergency-modal';
import { activeScheme, colors, fonts, radii, shadows, spacing } from '@/constants/theme';

type SideAction = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route?: '/pugliese-circle' | '/help' | '/settings';
  emergency?: boolean;
};

const SIDE_ACTIONS: SideAction[] = [
  { label: 'Emergency', icon: 'call-outline', emergency: true },
  { label: 'Friends', icon: 'chatbubbles-outline', route: '/pugliese-circle' },
  { label: 'Help', icon: 'help-circle-outline', route: '/help' },
  { label: 'Settings', icon: 'settings-outline', route: '/settings' },
];

const GLASS_BG = activeScheme === 'dark' ? 'rgba(30,26,22,0.55)' : 'rgba(255,255,255,0.6)';
const GLASS_BORDER = activeScheme === 'dark' ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.7)';
const glassWeb: ViewStyle | undefined = Platform.OS === 'web'
  ? ({ backdropFilter: 'blur(22px)', WebkitBackdropFilter: 'blur(22px)' } as unknown as ViewStyle)
  : undefined;

export function BottomActionRail() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const [emergencyOpen, setEmergencyOpen] = useState(false);

  function pressSide(action: SideAction) {
    void Haptics.selectionAsync();
    if (action.emergency) setEmergencyOpen(true);
    if (action.route && action.route !== pathname) router.push(action.route);
  }

  const left = SIDE_ACTIONS.slice(0, 2);
  const right = SIDE_ACTIONS.slice(2);
  const homeActive = pathname === '/';

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
      <View style={[styles.bar, { backgroundColor: GLASS_BG, borderColor: GLASS_BORDER }, glassWeb]}>
        <View style={styles.rail} accessibilityRole="toolbar">
          {left.map((action) => (
            <RailItem action={action} key={action.label} selected={action.route === pathname} onPress={() => pressSide(action)} />
          ))}
          <View style={styles.centerSlot} />
          {right.map((action) => (
            <RailItem action={action} key={action.label} selected={action.route === pathname} onPress={() => pressSide(action)} />
          ))}
        </View>
      </View>

      <View pointerEvents="box-none" style={styles.homeWrap}>
        <Pressable
          accessibilityLabel="Home"
          accessibilityRole="button"
          accessibilityState={{ selected: homeActive }}
          onPress={() => {
            void Haptics.selectionAsync();
            if (!homeActive) router.replace('/');
          }}
          style={({ pressed }) => [styles.homeButton, glassWeb, pressed && styles.homePressed]}
        >
          <Ionicons color={colors.ink} name="home-outline" size={27} />
        </Pressable>
      </View>

      <EmergencyModal visible={emergencyOpen} onClose={() => setEmergencyOpen(false)} />
    </View>
  );
}

function RailItem({ action, selected, onPress }: { action: SideAction; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityLabel={action.label}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [styles.action, pressed && styles.actionPressed]}
    >
      <Ionicons color={selected ? colors.maroon : colors.inkMuted} name={action.icon} size={23} />
      <Text style={[styles.label, selected && styles.labelSelected]}>{action.label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: spacing.md, paddingTop: 26, position: 'relative' },
  bar: {
    borderRadius: radii.xl,
    borderWidth: 1,
    overflow: 'hidden',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    ...shadows.floating,
  },
  rail: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-around' },
  centerSlot: { flex: 1 },
  action: { alignItems: 'center', flex: 1, gap: 3, justifyContent: 'center', minHeight: 48 },
  actionPressed: { opacity: 0.55, transform: [{ scale: 0.96 }] },
  label: { color: colors.inkMuted, fontFamily: fonts.uiMedium, fontSize: 11 },
  labelSelected: { color: colors.maroon },
  homeWrap: { alignItems: 'center', left: 0, position: 'absolute', right: 0, top: 0 },
  homeButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.ink,
    borderRadius: 31,
    borderWidth: 2,
    height: 62,
    justifyContent: 'center',
    width: 62,
    ...shadows.floating,
  },
  homePressed: { opacity: 0.85, transform: [{ scale: 0.95 }] },
});
