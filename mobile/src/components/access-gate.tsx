import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState, type PropsWithChildren } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, fonts, radii, shadows, spacing } from '@/constants/theme';

const DURATION_MS = 33 * 60 * 1000; // 33 minutes
const EXPIRY_KEY = 'pugliese-navigate.access.expiry';
const LOCKED_KEY = 'pugliese-navigate.access.locked';

type Phase = 'loading' | 'consent' | 'active' | 'locked';

function formatRemaining(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function AccessGate({ children }: PropsWithChildren) {
  const [phase, setPhase] = useState<Phase>('loading');
  const [remaining, setRemaining] = useState(DURATION_MS);
  const [agreedChecked, setAgreedChecked] = useState(false);
  const expiryRef = useRef<number | null>(null);

  // Resolve the current access state from the cache on launch.
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [locked, expiryStr] = await Promise.all([AsyncStorage.getItem(LOCKED_KEY), AsyncStorage.getItem(EXPIRY_KEY)]);
        if (!active) return;
        if (locked === '1') {
          setPhase('locked');
          return;
        }
        const expiry = expiryStr ? Number(expiryStr) : NaN;
        if (Number.isFinite(expiry)) {
          if (Date.now() >= expiry) {
            await AsyncStorage.setItem(LOCKED_KEY, '1');
            setPhase('locked');
            return;
          }
          expiryRef.current = expiry;
          setRemaining(expiry - Date.now());
          setPhase('active');
          return;
        }
        setPhase('consent');
      } catch {
        if (active) setPhase('consent');
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Tick the countdown while active; lock out when it hits zero.
  useEffect(() => {
    if (phase !== 'active') return;
    const timer = setInterval(() => {
      const expiry = expiryRef.current;
      if (expiry == null) return;
      const left = expiry - Date.now();
      if (left <= 0) {
        setRemaining(0);
        clearInterval(timer);
        void AsyncStorage.setItem(LOCKED_KEY, '1');
        setPhase('locked');
      } else {
        setRemaining(left);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [phase]);

  async function startSession() {
    const expiry = Date.now() + DURATION_MS;
    expiryRef.current = expiry;
    setRemaining(DURATION_MS);
    try {
      await AsyncStorage.setItem(EXPIRY_KEY, String(expiry));
    } catch {
      // ignore — session still runs for this load
    }
    setPhase('active');
  }

  if (phase === 'loading') {
    return <View style={styles.loading} />;
  }

  if (phase === 'consent') {
    return (
      <SafeAreaView style={styles.fullScreen}>
        <View style={styles.centerCard}>
          <View style={styles.iconCircle}>
            <Ionicons color={colors.maroon} name="hourglass-outline" size={34} />
          </View>
          <Text style={styles.title}>Timed preview access</Text>
          <Text style={styles.body}>
            You&apos;ll only have access to the app for a limited amount of time — <Text style={styles.bodyStrong}>33 minutes</Text> — and
            it will lock out for you afterwards.
          </Text>
          <Text style={styles.subtle}>Your session starts when you continue and is tracked on this device.</Text>

          <Pressable
            accessibilityLabel="I understand and agree"
            accessibilityRole="checkbox"
            accessibilityState={{ checked: agreedChecked }}
            onPress={() => setAgreedChecked((prev) => !prev)}
            style={styles.agreeRow}
          >
            <View style={[styles.checkbox, agreedChecked && styles.checkboxOn]}>
              {agreedChecked ? <Ionicons color={colors.white} name="checkmark" size={16} /> : null}
            </View>
            <Text style={styles.agreeText}>I understand and agree to the 33-minute limit.</Text>
          </Pressable>

          <Pressable
            accessibilityLabel="Continue"
            accessibilityRole="button"
            disabled={!agreedChecked}
            onPress={startSession}
            style={({ pressed }) => [styles.button, !agreedChecked && styles.buttonDisabled, pressed && styles.buttonPressed]}
          >
            <Text style={styles.buttonLabel}>Start my 33 minutes</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (phase === 'locked') {
    return (
      <SafeAreaView style={styles.fullScreen}>
        <View style={styles.centerCard}>
          <View style={[styles.iconCircle, styles.iconCircleLocked]}>
            <Ionicons color={colors.maroon} name="lock-closed" size={34} />
          </View>
          <Text style={styles.title}>Your time is up</Text>
          <Text style={styles.body}>Your 33-minute preview has ended and is now locked on this device.</Text>
          <Text style={styles.subtle}>Thanks for taking a look.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.root}>
      {children}
      <CountdownBadge remaining={remaining} />
    </View>
  );
}

function CountdownBadge({ remaining }: { remaining: number }) {
  const warn = remaining <= 120_000;
  const urgent = remaining <= 60_000;
  return (
    <View pointerEvents="none" style={styles.badgeWrap}>
      <View style={[styles.badge, warn && styles.badgeWarn, urgent && styles.badgeUrgent]}>
        <Ionicons color={colors.white} name="time-outline" size={13} />
        <Text style={styles.badgeText}>{formatRemaining(remaining)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  loading: { backgroundColor: colors.cream, flex: 1 },
  fullScreen: { alignItems: 'center', backgroundColor: colors.cream, flex: 1, justifyContent: 'center', padding: spacing.xl },
  centerCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.xl,
    borderWidth: StyleSheet.hairlineWidth,
    maxWidth: 420,
    padding: spacing.xxl,
    width: '100%',
    ...shadows.floating,
  },
  iconCircle: {
    alignItems: 'center',
    backgroundColor: colors.maroonSoft,
    borderRadius: 40,
    height: 74,
    justifyContent: 'center',
    marginBottom: spacing.lg,
    width: 74,
  },
  iconCircleLocked: { backgroundColor: colors.maroonSoft },
  title: { color: colors.ink, fontFamily: fonts.display, fontSize: 30, textAlign: 'center' },
  body: { color: colors.inkMuted, fontFamily: fonts.ui, fontSize: 15, lineHeight: 22, marginTop: spacing.md, textAlign: 'center' },
  bodyStrong: { color: colors.maroon, fontFamily: fonts.uiBold },
  subtle: { color: colors.inkMuted, fontFamily: fonts.ui, fontSize: 12, lineHeight: 17, marginTop: spacing.md, textAlign: 'center' },
  agreeRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xl },
  checkbox: {
    alignItems: 'center',
    borderColor: colors.borderStrong,
    borderRadius: 6,
    borderWidth: 2,
    height: 26,
    justifyContent: 'center',
    width: 26,
  },
  checkboxOn: { backgroundColor: colors.maroon, borderColor: colors.maroon },
  agreeText: { color: colors.ink, flex: 1, fontFamily: fonts.uiMedium, fontSize: 14 },
  button: {
    alignItems: 'center',
    backgroundColor: colors.maroon,
    borderRadius: radii.md,
    justifyContent: 'center',
    marginTop: spacing.xl,
    minHeight: 52,
    width: '100%',
  },
  buttonDisabled: { backgroundColor: colors.borderStrong },
  buttonPressed: { opacity: 0.85 },
  buttonLabel: { color: colors.white, fontFamily: fonts.uiBold, fontSize: 16 },
  badgeWrap: { bottom: 86, position: 'absolute', right: spacing.md, zIndex: 9999 },
  badge: {
    alignItems: 'center',
    backgroundColor: colors.maroon,
    borderRadius: radii.round,
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    ...shadows.floating,
  },
  badgeWarn: { backgroundColor: colors.amber },
  badgeUrgent: { backgroundColor: colors.red },
  badgeText: { color: colors.white, fontFamily: fonts.uiBold, fontSize: 13, letterSpacing: 0.5 },
});
