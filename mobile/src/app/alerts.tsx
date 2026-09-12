import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AppScaffold } from '@/components/app-scaffold';
import { ActionButton, PageIntro, Pill, SectionTitle, Surface } from '@/components/ui';
import { colors, fonts, radii, spacing } from '@/constants/theme';
import { CAMPUS_ALERTS } from '@/data/demo';
import { useSettings } from '@/context/settings-context';

const alertTone = {
  info: { icon: 'information-circle' as const, color: colors.blue, tone: 'neutral' as const },
  warning: { icon: 'warning' as const, color: colors.amber, tone: 'warning' as const },
  urgent: { icon: 'alert-circle' as const, color: colors.red, tone: 'danger' as const },
};

export default function AlertsScreen() {
  const router = useRouter();
  const { preferences } = useSettings();

  return (
    <AppScaffold>
      <PageIntro
        eyebrow="Notifications"
        title="Important updates, without the noise."
        body="Safety and service notices are separated from ordinary event reminders so students can control what reaches them."
      />

      <View style={styles.summary}>
        <View style={styles.summaryNumberWrap}>
          <Text style={styles.summaryNumber}>{CAMPUS_ALERTS.length}</Text>
        </View>
        <View style={styles.summaryCopy}>
          <Text style={styles.summaryTitle}>Active demo notices</Text>
          <Text style={styles.summaryBody}>Safety alerts are {preferences.safetyAlerts ? 'enabled' : 'disabled'} on this device.</Text>
        </View>
        <Pill tone={preferences.safetyAlerts ? 'success' : 'warning'}>{preferences.safetyAlerts ? 'On' : 'Off'}</Pill>
      </View>

      <SectionTitle>Latest</SectionTitle>
      <Surface>
        {CAMPUS_ALERTS.map((alert) => {
          const presentation = alertTone[alert.severity];
          return (
            <View key={alert.id} style={styles.alertRow}>
              <View style={[styles.alertIcon, { backgroundColor: `${presentation.color}16` }]}>
                <Ionicons color={presentation.color} name={presentation.icon} size={23} />
              </View>
              <View style={styles.alertCopy}>
                <View style={styles.alertTopline}>
                  <Text style={styles.alertTitle}>{alert.title}</Text>
                  <Text style={styles.timestamp}>{alert.timestamp}</Text>
                </View>
                <Text style={styles.alertBody}>{alert.body}</Text>
              </View>
            </View>
          );
        })}
      </Surface>

      <View style={styles.manageButton}>
        <ActionButton icon="options" label="Manage alert preferences" onPress={() => router.push('/settings')} />
      </View>
    </AppScaffold>
  );
}

const styles = StyleSheet.create({
  summary: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.lg, borderWidth: 1, flexDirection: 'row', gap: spacing.md, marginHorizontal: spacing.lg, padding: spacing.lg },
  summaryNumberWrap: { alignItems: 'center', backgroundColor: colors.maroon, borderRadius: 26, height: 52, justifyContent: 'center', width: 52 },
  summaryNumber: { color: colors.white, fontFamily: fonts.display, fontSize: 30, lineHeight: 32 },
  summaryCopy: { flex: 1 },
  summaryTitle: { color: colors.ink, fontFamily: fonts.uiBold, fontSize: 16 },
  summaryBody: { color: colors.inkMuted, fontFamily: fonts.ui, fontSize: 13, lineHeight: 17, marginTop: 3 },
  alertRow: { alignItems: 'flex-start', borderBottomColor: colors.border, borderBottomWidth: StyleSheet.hairlineWidth, flexDirection: 'row', gap: spacing.md, padding: spacing.lg },
  alertIcon: { alignItems: 'center', borderRadius: 22, height: 44, justifyContent: 'center', width: 44 },
  alertCopy: { flex: 1 },
  alertTopline: { alignItems: 'flex-start', flexDirection: 'row', gap: spacing.sm, justifyContent: 'space-between' },
  alertTitle: { color: colors.ink, flex: 1, fontFamily: fonts.uiBold, fontSize: 16, lineHeight: 20 },
  timestamp: { color: colors.inkMuted, fontFamily: fonts.uiMedium, fontSize: 11 },
  alertBody: { color: colors.inkMuted, fontFamily: fonts.ui, fontSize: 14, lineHeight: 20, marginTop: spacing.sm },
  manageButton: { marginHorizontal: spacing.lg, marginTop: spacing.xl },
});
