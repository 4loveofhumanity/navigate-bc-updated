import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppScaffold } from '@/components/app-scaffold';
import { ActionButton, PageIntro, Pill, SectionTitle, Surface } from '@/components/ui';
import { colors, fonts, radii, spacing } from '@/constants/theme';
import { SERVICE_STATUSES } from '@/data/demo';
import { openInAppBrowser } from '@/lib/in-app-browser';

const statusPresentation = {
  operational: { icon: 'checkmark-circle' as const, color: colors.green, tone: 'success' as const, label: 'Operational' },
  degraded: { icon: 'alert-circle' as const, color: colors.amber, tone: 'warning' as const, label: 'Degraded' },
  outage: { icon: 'close-circle' as const, color: colors.red, tone: 'danger' as const, label: 'Outage' },
};

export default function ItStatusScreen() {
  const [updatedAt, setUpdatedAt] = useState(() => new Date());
  const incidents = SERVICE_STATUSES.filter((service) => service.status !== 'operational').length;

  return (
    <AppScaffold>
      <PageIntro
        eyebrow="Service health"
        title="Know before you connect."
        body="A clear status board for campus technology. The source adapter is ready to swap from demo rows to official health feeds."
      />

      <View style={styles.summary}>
        <View style={styles.summaryIcon}>
          <Ionicons color={incidents ? colors.amber : colors.green} name={incidents ? 'warning' : 'checkmark'} size={28} />
        </View>
        <View style={styles.summaryCopy}>
          <Text style={styles.summaryTitle}>{incidents ? `${incidents} service note` : 'All systems operational'}</Text>
          <Text style={styles.summaryBody}>Last refreshed {updatedAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</Text>
        </View>
        <ActionButton icon="refresh" label="Refresh" onPress={() => setUpdatedAt(new Date())} variant="secondary" />
      </View>

      <SectionTitle>Campus services</SectionTitle>
      <Surface>
        {SERVICE_STATUSES.map((service) => {
          const presentation = statusPresentation[service.status];
          return (
            <View key={service.id} style={styles.serviceRow}>
              <Ionicons color={presentation.color} name={presentation.icon} size={31} />
              <View style={styles.serviceCopy}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceMessage}>{service.message}</Text>
              </View>
              <Pill tone={presentation.tone}>{presentation.label}</Pill>
            </View>
          );
        })}
      </Surface>

      <View style={styles.actions}>
        <ActionButton
          icon="desktop-outline"
          label="Find a Pugliese computer lab"
          onPress={() => openInAppBrowser('https://students.pugliese.edu/', 'Student Resources')}
          variant="secondary"
        />
        <ActionButton
          icon="bug-outline"
          label="Report a problem"
          onPress={() => openInAppBrowser('https://students.pugliese.edu/portal/', 'Student Portal')}
        />
      </View>

      <View style={styles.demoNote}>
        <Ionicons color={colors.blue} name="information-circle" size={18} />
        <Text style={styles.demoText}>Status values are realistic demo data and are not an official indication of current service availability.</Text>
      </View>
    </AppScaffold>
  );
}

const styles = StyleSheet.create({
  summary: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
  },
  summaryIcon: { alignItems: 'center', backgroundColor: colors.amberSoft, borderRadius: 25, height: 50, justifyContent: 'center', width: 50 },
  summaryCopy: { flex: 1 },
  summaryTitle: { color: colors.ink, fontFamily: fonts.uiBold, fontSize: 17 },
  summaryBody: { color: colors.inkMuted, fontFamily: fonts.ui, fontSize: 12, marginTop: 3 },
  serviceRow: { alignItems: 'center', borderBottomColor: colors.border, borderBottomWidth: StyleSheet.hairlineWidth, flexDirection: 'row', gap: spacing.md, minHeight: 78, padding: spacing.lg },
  serviceCopy: { flex: 1 },
  serviceName: { color: colors.ink, fontFamily: fonts.uiBold, fontSize: 15 },
  serviceMessage: { color: colors.inkMuted, fontFamily: fonts.ui, fontSize: 13, lineHeight: 17, marginTop: 3 },
  actions: { gap: spacing.sm, marginHorizontal: spacing.lg, marginTop: spacing.xl },
  demoNote: { alignItems: 'flex-start', flexDirection: 'row', gap: spacing.sm, marginHorizontal: spacing.xl, marginTop: spacing.xl },
  demoText: { color: colors.inkMuted, flex: 1, fontFamily: fonts.ui, fontSize: 12, lineHeight: 17 },
});
