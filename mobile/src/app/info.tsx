import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { Linking, StyleSheet, Text, View } from 'react-native';

import { AppScaffold } from '@/components/app-scaffold';
import { ActionButton, ListRow, PageIntro, Pill, SectionTitle, Surface } from '@/components/ui';
import { colors, fonts, radii, spacing } from '@/constants/theme';
import { useSettings } from '@/context/settings-context';
import { DEMO_PROFILE } from '@/data/demo';
import { getProfile } from '@/lib/api';
import { openInAppBrowser } from '@/lib/in-app-browser';

function mask(value: string, privacyMode: boolean) {
  if (!privacyMode) return value;
  if (value.includes('@')) {
    const [, domain] = value.split('@');
    return `••••@${domain ?? 'pugliese.cuny.edu'}`;
  }
  return '••••••••';
}

export default function InfoScreen() {
  const profile = useQuery({ queryKey: ['profile'], queryFn: getProfile, placeholderData: DEMO_PROFILE });
  const { preferences } = useSettings();
  const data = profile.data;

  return (
    <AppScaffold>
      <PageIntro eyebrow="Student center" title="Your Pugliese information at a glance." body="This screen uses the existing typed profile service with a safe demo fallback." />

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Ionicons color={colors.white} name="person" size={30} />
        </View>
        <View style={styles.profileCopy}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{data?.name ?? 'Loading profile…'}</Text>
            <Pill tone="warning">Demo</Pill>
          </View>
          <Text style={styles.role}>{data?.role ?? 'Student'}</Text>
          <Text style={styles.emplid}>EMPLID {mask(data?.emplid ?? '1234XXXX', preferences.privacyMode)}</Text>
        </View>
      </View>

      <View style={styles.stats}>
        {[
          { label: 'Appointments', value: data?.appointments ?? 0, icon: 'calendar' as const },
          { label: 'Transactions', value: data?.transactions ?? 0, icon: 'receipt' as const },
          { label: 'Holds', value: data?.holds ?? 0, icon: 'alert-circle' as const },
        ].map((stat) => (
          <View key={stat.label} style={styles.statCard}>
            <Ionicons color={stat.label === 'Holds' && stat.value ? colors.amber : colors.maroon} name={stat.icon} size={21} />
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {preferences.showHolds && data?.holds ? (
        <View style={styles.holdCard}>
          <Ionicons color={colors.amber} name="warning" size={22} />
          <View style={styles.holdCopy}>
            <Text style={styles.holdTitle}>Action needed</Text>
            <Text style={styles.holdBody}>{data.holdsNote}</Text>
          </View>
        </View>
      ) : null}

      <SectionTitle>Account</SectionTitle>
      <Surface>
        <ListRow icon="person-circle" subtitle={mask(data?.webcentralId ?? '', preferences.privacyMode)} title="Pugliese Portal ID" />
        <ListRow
          icon="mail"
          onPress={() => data?.email && void Linking.openURL(`mailto:${data.email}`)}
          subtitle={mask(data?.email ?? '', preferences.privacyMode)}
          title="Student email"
        />
        <ListRow icon="wifi" subtitle={mask(data?.wifiUser ?? '', preferences.privacyMode)} title="Wi-Fi username" />
        <ListRow icon="card" subtitle={preferences.privacyMode ? 'Hidden in privacy mode' : data?.balanceDue} title="Account balance" />
      </Surface>

      <View style={styles.actions}>
        <ActionButton icon="open-outline" label="Open official student portal" onPress={() => openInAppBrowser('https://students.pugliese.edu/portal/', 'Student Portal')} />
        <ActionButton icon="call" label="Contact student support" onPress={() => void Linking.openURL(`tel:${(data?.helpPhone ?? '7189515787').replace(/\D/g, '')}`)} variant="secondary" />
      </View>
    </AppScaffold>
  );
}

const styles = StyleSheet.create({
  profileCard: { alignItems: 'center', backgroundColor: colors.maroon, borderRadius: radii.lg, flexDirection: 'row', gap: spacing.lg, marginHorizontal: spacing.lg, padding: spacing.lg },
  avatar: { alignItems: 'center', backgroundColor: 'rgba(255,255,255,.17)', borderRadius: 30, height: 60, justifyContent: 'center', width: 60 },
  profileCopy: { flex: 1 },
  nameRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  name: { color: colors.white, flexShrink: 1, fontFamily: fonts.uiBold, fontSize: 18 },
  role: { color: 'rgba(255,255,255,.8)', fontFamily: fonts.ui, fontSize: 14, marginTop: 3 },
  emplid: { color: 'rgba(255,255,255,.65)', fontFamily: fonts.uiMedium, fontSize: 11, letterSpacing: 0.8, marginTop: spacing.sm },
  stats: { flexDirection: 'row', gap: spacing.sm, marginHorizontal: spacing.lg, marginTop: spacing.md },
  statCard: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.md, borderWidth: 1, flex: 1, padding: spacing.md },
  statValue: { color: colors.ink, fontFamily: fonts.display, fontSize: 28, lineHeight: 29, marginTop: spacing.xs },
  statLabel: { color: colors.inkMuted, fontFamily: fonts.uiMedium, fontSize: 11 },
  holdCard: { alignItems: 'flex-start', backgroundColor: colors.amberSoft, borderColor: '#F0D08C', borderRadius: radii.md, borderWidth: 1, flexDirection: 'row', gap: spacing.md, marginHorizontal: spacing.lg, marginTop: spacing.md, padding: spacing.lg },
  holdCopy: { flex: 1 },
  holdTitle: { color: colors.amber, fontFamily: fonts.uiBold, fontSize: 15 },
  holdBody: { color: colors.ink, fontFamily: fonts.ui, fontSize: 13, lineHeight: 18, marginTop: 3 },
  actions: { gap: spacing.sm, marginHorizontal: spacing.lg, marginTop: spacing.xl },
});
