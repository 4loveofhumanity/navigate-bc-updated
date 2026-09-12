import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { usePathname, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmergencyModal } from '@/components/emergency-modal';
import { colors, fonts, layout, spacing } from '@/constants/theme';

type RailAction = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route?: '/' | '/pugliese-circle' | '/help' | '/settings';
  emergency?: boolean;
  home?: boolean;
};

const actions: RailAction[] = [
  { label: 'Emergency', icon: 'call', emergency: true },
  { label: 'Friends', icon: 'chatbubbles', route: '/pugliese-circle' },
  { label: 'Home', icon: 'home', route: '/', home: true },
  { label: 'Help', icon: 'help-circle', route: '/help' },
  { label: 'Settings', icon: 'settings', route: '/settings' },
];

export function BottomActionRail() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const [emergencyOpen, setEmergencyOpen] = useState(false);

  return (
    <View style={[styles.safeArea, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
      <View style={styles.rail} accessibilityRole="toolbar">
        {actions.map((action) => {
          const selected = action.route === pathname;
          return (
            <Pressable
              key={action.label}
              accessibilityRole="button"
              accessibilityLabel={action.label}
              accessibilityState={{ selected }}
              onPress={() => {
                void Haptics.selectionAsync();
                if (action.emergency) setEmergencyOpen(true);
                if (action.route && action.route !== pathname) {
                  if (action.home) router.replace('/');
                  else router.push(action.route);
                }
              }}
              style={({ pressed }) => [styles.action, pressed && styles.pressed]}
            >
              <View style={[styles.iconWrap, selected && styles.iconWrapSelected]}>
                <Ionicons name={action.icon} size={20} color={selected ? colors.white : colors.maroon} />
              </View>
              <Text style={[styles.label, selected && styles.labelSelected]}>{action.label}</Text>
            </Pressable>
          );
        })}
      </View>
      <EmergencyModal visible={emergencyOpen} onClose={() => setEmergencyOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.paper,
    borderTopColor: colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    minHeight: layout.railHeight,
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
  },
  rail: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  action: {
    alignItems: 'center',
    flex: 1,
    gap: 3,
    minHeight: 52,
  },
  pressed: { opacity: 0.55, transform: [{ scale: 0.97 }] },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: colors.maroonSoft,
    borderRadius: 18,
    height: 32,
    justifyContent: 'center',
    width: 42,
  },
  iconWrapSelected: { backgroundColor: colors.maroon },
  label: {
    color: colors.inkMuted,
    fontFamily: fonts.uiMedium,
    fontSize: 11,
  },
  labelSelected: { color: colors.maroon },
});
