import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { type Href, Redirect, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Animated, Image, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppScaffold } from '@/components/app-scaffold';
import { FeatureCard } from '@/components/feature-card';
import { PugalieseIntroModal } from '@/components/pugliese-intro-modal';
import { colors, fonts, radii, shadows, spacing } from '@/constants/theme';
import { useSettings } from '@/context/settings-context';
import { CAMPUS_ALERTS, CAMPUS_EVENTS } from '@/data/demo';

function useAlertCount() {
  return useMemo(() => {
    const todayIso = new Date().toISOString().slice(0, 10);
    const todaysEvents = CAMPUS_EVENTS.filter((event) => event.date === todayIso).length;
    return CAMPUS_ALERTS.length + todaysEvents;
  }, []);
}

function AlertToast({ hasAlerts, onPress }: { hasAlerts: boolean; onPress: () => void }) {
  const [mounted, setMounted] = useState(hasAlerts);
  const [anim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (!hasAlerts) return;
    Animated.spring(anim, { toValue: 1, useNativeDriver: true, friction: 7, tension: 60 }).start();
    const timer = setTimeout(() => {
      Animated.timing(anim, { toValue: 0, duration: 380, useNativeDriver: true }).start(({ finished }) => {
        if (finished) setMounted(false);
      });
    }, 3600);
    return () => clearTimeout(timer);
  }, [hasAlerts, anim]);

  if (!mounted || !hasAlerts) return null;

  return (
    <Animated.View
      style={[
        styles.toast,
        { opacity: anim, transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-14, 0] }) }] },
      ]}
    >
      <Pressable accessibilityLabel="New alerts, open alerts" accessibilityRole="button" onPress={onPress} style={styles.toastInner}>
        <Ionicons color={colors.white} name="notifications" size={16} />
        <Text style={styles.toastText}>New alerts</Text>
      </Pressable>
    </Animated.View>
  );
}

type Feature = {
  title: string;
  subtitle: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  href: Href;
  tone?: 'maroon' | 'blue';
  badge?: string;
};

const features: Feature[] = [
  { title: 'My Classes', subtitle: 'Assignments, class chat, and files', icon: 'google-classroom', href: '/my-classes', badge: '3 active' },
  { title: 'Academic Calendar', subtitle: 'Registrar dates and deadlines', icon: 'calendar-star', href: '/academic-calendar' },
  { title: 'Events', subtitle: 'What is happening on campus', icon: 'calendar-month-outline', href: '/events' },
  { title: 'Dining & Orders', subtitle: 'BK Campus Eats menus and online ordering', icon: 'silverware-fork-knife', href: '/cafeteria', badge: 'Order ahead' },
  { title: 'My Career', subtitle: 'Career-readiness guide', icon: 'briefcase-variant-outline', href: '/career', tone: 'blue' },
  { title: 'Courses', subtitle: 'Catalog and sections', icon: 'book-open-page-variant-outline', href: '/courses' },
  { title: 'Campus Map', subtitle: 'Buildings and directions', icon: 'map-marker-radius-outline', href: '/map', tone: 'blue' },
  { title: 'Directory', subtitle: 'Offices and employees', icon: 'account-group-outline', href: '/directory', tone: 'blue' },
  { title: 'Student Info', subtitle: 'Student profile and holds', icon: 'account-school-outline', href: '/info' },
  { title: 'Library', subtitle: 'Research, books, and study support', icon: 'bookshelf', href: '/library' },
  { title: 'Help', subtitle: 'Answers and contacts', icon: 'help-circle-outline', href: '/help' },
  { title: 'PUG', subtitle: 'Campus community', icon: 'account-group-outline', href: '/pugliese-circle', tone: 'blue' },
  { title: 'Fix-it', subtitle: 'Report a campus issue', icon: 'wrench-outline', href: '/fix-it' },
];

const COLLAPSED_TOOL_COUNT = 6;

export default function HomeScreen() {
  const router = useRouter();
  const { hydrated, preferences, updatePreference } = useSettings();
  const [showAllTools, setShowAllTools] = useState(false);
  const alertCount = useAlertCount();

  if (!hydrated) return <View style={styles.loading}><ActivityIndicator color={colors.maroon} /></View>;
  if (!preferences.loginComplete) return <Redirect href="/onboarding" />;

  const visibleFeatures = showAllTools ? features : features.slice(0, COLLAPSED_TOOL_COUNT);
  const hiddenCount = features.length - COLLAPSED_TOOL_COUNT;
  const hasAlerts = alertCount > 0;

  return (
    <>
    <AppScaffold contentContainerStyle={styles.content}>
      <ImageBackground
        accessibilityLabel="Pugliese College Lily Pond in bloom"
        imageStyle={styles.heroImage}
        resizeMode="cover"
        source={require('../../assets/brand/lily-pond.jpg')}
        style={styles.hero}
      >
        <LinearGradient
          colors={['rgba(38, 10, 15, 0.22)', 'rgba(45, 11, 17, 0.12)', 'rgba(54, 13, 21, 0.84)']}
          locations={[0, 0.46, 1]}
          style={StyleSheet.absoluteFill}
        />
        <SafeAreaView edges={['top']} style={styles.heroSafeArea}>
          <View style={styles.topbar}>
            <View style={styles.appIdentity}>
              <Image source={require('../../assets/brand/seal.png')} style={styles.topbarSeal} />
              <Text style={styles.appName}>Pugliese Navigate</Text>
            </View>
            <Pressable
              accessibilityLabel={hasAlerts ? 'Open alerts, unread notices available' : 'Open alerts'}
              accessibilityRole="button"
              onPress={() => router.push('/alerts')}
              style={styles.topAction}
            >
              <Ionicons color={colors.white} name="notifications-outline" size={22} />
              {hasAlerts && <View style={styles.notificationBadge} />}
            </Pressable>
          </View>

          <AlertToast hasAlerts={hasAlerts} onPress={() => router.push('/alerts')} />

          <DashboardSnapshot />

          <View style={styles.heroCopy}>
            <Image source={require('../../assets/brand/seal.png')} style={styles.heroSeal} />
            <Text style={styles.collegeName}>PUGLIESE COLLEGE</Text>
            <Text style={styles.campusAddress}>2900 Bedford Avenue, Pugliese, NY 11210</Text>
          </View>
        </SafeAreaView>
      </ImageBackground>

      <View style={styles.indexIntro}>
        <Text style={styles.indexEyebrow}>Pugliese Navigator</Text>
        <Text style={styles.indexTitle}>NIL SINE MAGNO LABORE</Text>
        <Text style={styles.indexTranslation}>Nothing without great effort</Text>
      </View>

      <View style={styles.quickAccess}>
        <Text style={styles.quickAccessLabel}>Quick access</Text>
        <View style={styles.quickAccessGrid}>
          <QuickAccessCard
            icon="account-group-outline"
            onPress={() => router.push('/pugliese-circle')}
            subtitle="Campus community"
            title="PUG"
          />
          {/* Student ID intentionally remains the fixed top-right Quick Access action. */}
          <QuickAccessCard
            icon="card-account-details-outline"
            onPress={() => router.push('/student-id')}
            subtitle="Demo student credential"
            title="Student ID"
          />
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Campus tools</Text>
        <Text style={styles.sectionMeta}>{showAllTools ? 'All services' : 'Featured services'}</Text>
      </View>

      <View style={styles.featureGrid}>
        {visibleFeatures.map((feature) => <FeatureCard key={feature.title} {...feature} />)}
      </View>

      {hiddenCount > 0 && (
        <Pressable
          accessibilityLabel={showAllTools ? 'Show fewer campus tools' : `Show ${hiddenCount} more campus tools`}
          accessibilityRole="button"
          hitSlop={10}
          onPress={() => setShowAllTools((prev) => !prev)}
          style={({ pressed }) => [styles.showMore, pressed && styles.showMorePressed]}
        >
          <Ionicons color={colors.maroon} name={showAllTools ? 'chevron-up' : 'chevron-down'} size={26} />
        </Pressable>
      )}

      <View style={styles.footerNote}>
        <Ionicons color={colors.green} name="shield-checkmark" size={17} />
        <Text style={styles.footerText}>Demo data is clearly labeled until official authenticated services are connected.</Text>
      </View>
    </AppScaffold>
    <PugalieseIntroModal
      visible={!preferences.puglieseIntroSeen}
      onDismiss={() => updatePreference('puglieseIntroSeen', true)}
    />
    </>
  );
}

function DashboardSnapshot() {
  const weather = useQuery({
    queryKey: ['pugliese-weather'],
    queryFn: async () => {
      const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=40.65&longitude=-73.95&current=temperature_2m,apparent_temperature,weather_code&temperature_unit=fahrenheit');
      if (!response.ok) throw new Error('Weather unavailable');
      return response.json() as Promise<{ current: { temperature_2m: number; apparent_temperature: number; weather_code: number } }>;
    },
    staleTime: 15 * 60_000,
  });
  const code = weather.data?.current.weather_code;
  const condition = code === undefined ? 'Loading current conditions' : code === 0 ? 'Clear' : code <= 3 ? 'Partly cloudy' : code <= 67 ? 'Rain' : code <= 77 ? 'Snow' : 'Showers';

  return (
    <View style={styles.snapshotRow}>
      <View style={styles.snapshotCard}>
        <Text style={styles.snapshotEyebrow}>Pugliese weather</Text>
        <Text style={styles.snapshotValue}>{weather.data ? `${Math.round(weather.data.current.temperature_2m)}°F` : '--°'}</Text>
        <Text style={styles.snapshotDetail}>{weather.isError ? 'Weather temporarily unavailable' : condition}</Text>
      </View>
    </View>
  );
}

function QuickAccessCard({
  icon,
  onPress,
  subtitle,
  title,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  onPress: () => void;
  subtitle: string;
  title: string;
}) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.quickCard, pressed && styles.quickCardPressed]}>
      <View style={styles.quickIcon}><MaterialCommunityIcons color={colors.maroon} name={icon} size={21} /></View>
      <View style={styles.quickCopy}>
        <Text numberOfLines={1} style={styles.quickTitle}>{title}</Text>
        <Text numberOfLines={2} style={styles.quickSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons color={colors.maroon} name="chevron-forward" size={17} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  loading: { alignItems: 'center', backgroundColor: colors.cream, flex: 1, justifyContent: 'center' },
  content: { paddingBottom: spacing.lg },
  hero: { minHeight: 300, overflow: 'hidden' },
  heroImage: { borderBottomLeftRadius: radii.xl, borderBottomRightRadius: radii.xl },
  heroSafeArea: { flex: 1, justifyContent: 'space-between' },
  topbar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
  },
  appIdentity: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  topbarSeal: { backgroundColor: colors.white, borderRadius: 15, height: 34, width: 34 },
  appName: { color: colors.white, fontFamily: fonts.uiBold, fontSize: 16 },
  topAction: {
    alignItems: 'center',
    backgroundColor: 'rgba(32, 7, 12, 0.32)',
    borderColor: 'rgba(255,255,255,.35)',
    borderRadius: 22,
    borderWidth: 1,
    height: 42,
    justifyContent: 'center',
    position: 'relative',
    width: 42,
  },
  toast: {
    alignSelf: 'center',
    position: 'absolute',
    top: 52,
    zIndex: 10,
    ...shadows.floating,
  },
  toastInner: {
    alignItems: 'center',
    backgroundColor: 'rgba(56, 189, 248, 0.82)',
    borderColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: radii.round,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  toastText: {
    color: colors.white,
    fontFamily: fonts.uiBold,
    fontSize: 13,
    letterSpacing: 0.2,
  },
  notificationBadge: {
    backgroundColor: '#FFD34E',
    borderColor: colors.maroonDeep,
    borderRadius: 5,
    borderWidth: 1.5,
    height: 10,
    position: 'absolute',
    right: 2,
    top: 2,
    width: 10,
  },
  heroCopy: { alignItems: 'center', paddingBottom: 46, paddingHorizontal: spacing.xl },
  heroSeal: { backgroundColor: 'rgba(255,255,255,.96)', borderRadius: 16, height: 64, marginBottom: spacing.sm, width: 64, ...shadows.floating },
  collegeName: {
    color: colors.white,
    fontFamily: fonts.display,
    fontSize: 31,
    letterSpacing: 2.4,
    lineHeight: 34,
    textAlign: 'center',
  },
  campusAddress: {
    color: 'rgba(255,255,255,.88)',
    fontFamily: fonts.uiMedium,
    fontSize: 12,
    letterSpacing: 0.35,
    lineHeight: 16,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  indexIntro: { alignItems: 'center', paddingHorizontal: spacing.lg, paddingBottom: spacing.md, paddingTop: spacing.sm },
  indexEyebrow: { color: colors.maroon, fontFamily: fonts.uiBold, fontSize: 10, letterSpacing: 2, marginBottom: spacing.xs, textTransform: 'uppercase' },
  indexTitle: { color: colors.ink, fontFamily: fonts.typewriter, fontSize: 17, letterSpacing: 1.2, lineHeight: 24, textAlign: 'center' },
  indexTranslation: { color: colors.maroon, fontFamily: fonts.uiMedium, fontSize: 11, letterSpacing: 0.5, lineHeight: 16, marginTop: 1, textAlign: 'center' },
  quickAccess: { marginTop: spacing.sm },
  snapshotRow: { alignSelf: 'flex-start', marginLeft: spacing.lg, marginTop: spacing.sm },
  snapshotCard: { width: 132 },
  snapshotEyebrow: { color: 'rgba(255,255,255,.78)', fontFamily: fonts.uiBold, fontSize: 9, letterSpacing: 0.4, textTransform: 'uppercase' },
  snapshotValue: { color: colors.white, fontFamily: fonts.display, fontSize: 23, lineHeight: 25, marginTop: 1 },
  snapshotDetail: { color: 'rgba(255,255,255,.82)', fontFamily: fonts.ui, fontSize: 10, lineHeight: 12, marginTop: 1 },
  quickAccessLabel: { color: colors.inkMuted, fontFamily: fonts.uiBold, fontSize: 12, letterSpacing: 0.8, marginBottom: spacing.sm, paddingHorizontal: spacing.lg, textTransform: 'uppercase' },
  quickAccessGrid: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.lg },
  quickCard: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.md, borderWidth: StyleSheet.hairlineWidth, flex: 1, flexDirection: 'row', gap: spacing.sm, minHeight: 72, paddingHorizontal: spacing.sm, ...shadows.card },
  quickCardPressed: { backgroundColor: colors.maroonSoft, opacity: 0.8 },
  quickIcon: { alignItems: 'center', backgroundColor: colors.maroonSoft, borderRadius: radii.sm, height: 36, justifyContent: 'center', width: 36 },
  quickCopy: { flex: 1 },
  quickTitle: { color: colors.ink, fontFamily: fonts.uiBold, fontSize: 13, lineHeight: 16 },
  quickSubtitle: { color: colors.inkMuted, fontFamily: fonts.ui, fontSize: 10, lineHeight: 13, marginTop: 2 },
  sectionHeader: { alignItems: 'flex-end', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingBottom: spacing.sm, paddingTop: spacing.lg },
  sectionTitle: { color: colors.ink, fontFamily: fonts.uiBold, fontSize: 20 },
  sectionMeta: { color: colors.inkMuted, fontFamily: fonts.uiMedium, fontSize: 12 },
  featureGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: spacing.sm, paddingHorizontal: spacing.lg },
  showMore: { alignItems: 'center', alignSelf: 'center', borderRadius: radii.md, height: 34, justifyContent: 'center', marginTop: spacing.sm, width: 52 },
  showMorePressed: { backgroundColor: colors.maroonSoft, opacity: 0.85 },
  footerNote: { alignItems: 'flex-start', flexDirection: 'row', gap: spacing.sm, marginHorizontal: spacing.xl, marginTop: spacing.xl },
  footerText: { color: colors.inkMuted, flex: 1, fontFamily: fonts.ui, fontSize: 12, lineHeight: 17 },
});
