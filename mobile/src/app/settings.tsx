import { Ionicons } from '@expo/vector-icons';
import { Alert, StyleSheet, Switch, Text, View } from 'react-native';

import { AppScaffold } from '@/components/app-scaffold';
import { ActionButton, PageIntro, SectionTitle, SegmentedControl, Surface } from '@/components/ui';
import { colors, fonts, getThemePreference, setThemePreference, spacing, type ThemePreference } from '@/constants/theme';
import { useSettings } from '@/context/settings-context';
import type { UserPreferences } from '@/types/domain';

type BooleanPreferenceKey = {
  [K in keyof UserPreferences]-?: UserPreferences[K] extends boolean ? K : never;
}[keyof UserPreferences];

function SettingRow({
  title,
  body,
  value,
  onChange,
  caution,
}: {
  title: string;
  body: string;
  value: boolean;
  onChange: (value: boolean) => void;
  caution?: boolean;
}) {
  return (
    <View style={styles.settingRow}>
      <View style={[styles.settingIcon, caution && styles.settingIconCaution]}>
        <Ionicons color={caution ? colors.amber : colors.maroon} name={caution ? 'warning' : 'checkmark'} size={17} />
      </View>
      <View style={styles.settingCopy}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingBody}>{body}</Text>
      </View>
      <Switch
        accessibilityLabel={title}
        ios_backgroundColor={colors.borderStrong}
        onValueChange={onChange}
        thumbColor={colors.white}
        trackColor={{ false: colors.borderStrong, true: colors.maroon }}
        value={value}
      />
    </View>
  );
}

function ComingSoonRow({
  icon,
  title,
  body,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  body: string;
}) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingIcon}>
        <Ionicons color={colors.maroon} name={icon} size={17} />
      </View>
      <View style={styles.settingCopy}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingBody}>{body}</Text>
      </View>
      <Text style={styles.comingSoon}>Coming soon</Text>
    </View>
  );
}

export default function SettingsScreen() {
  const { hydrated, preferences, resetPreferences, updatePreference } = useSettings();

  function toggle(key: BooleanPreferenceKey) {
    return (value: boolean) => updatePreference(key, value);
  }

  return (
    <AppScaffold>
      <PageIntro
        eyebrow="Device preferences"
        title="Your information, on your terms."
        body="Privacy defaults are conservative. Preferences are stored locally on this device and can be reset at any time."
      />

      <SectionTitle>Preferred experience</SectionTitle>
      <SegmentedControl
        onChange={(value) => updatePreference('userType', value)}
        options={[
          { label: 'Student', value: 'student' },
          { label: 'Employee', value: 'employee' },
        ]}
        value={preferences.userType}
      />

      <SectionTitle>Appearance</SectionTitle>
      <SegmentedControl
        onChange={(value: ThemePreference) => setThemePreference(value)}
        options={[
          { label: 'System', value: 'system' },
          { label: 'Light', value: 'light' },
          { label: 'Dark', value: 'dark' },
        ]}
        value={getThemePreference()}
      />

      <SectionTitle>Privacy and access</SectionTitle>
      <Surface>
        <SettingRow
          body="Masks student identifiers and account details in public spaces."
          onChange={toggle('privacyMode')}
          title="Privacy mode"
          value={preferences.privacyMode}
        />
        <SettingRow
          body="Reserved for a future secure SSO session. No password is stored by this demo."
          caution
          onChange={toggle('autoLogin')}
          title="Automatic sign-in"
          value={preferences.autoLogin}
        />
        <ComingSoonRow
          body="Sign in with Face ID or Touch ID on iPhone, or fingerprint / face unlock on Android. Planned for the production app — not enabled in this demo."
          icon="finger-print"
          title="Biometric sign-in"
        />
      </Surface>

      <SectionTitle>My Pugliese Info sections</SectionTitle>
      <Surface>
        <SettingRow body="Show registered course shortcuts." onChange={toggle('showCourses')} title="My courses" value={preferences.showCourses} />
        <SettingRow body="Show recent account activity." onChange={toggle('showTransactions')} title="Transactions" value={preferences.showTransactions} />
        <SettingRow body="Show upcoming advising and service visits." onChange={toggle('showAppointments')} title="Appointments" value={preferences.showAppointments} />
        <SettingRow body="Show administrative holds and stops." onChange={toggle('showHolds')} title="Holds and stops" value={preferences.showHolds} />
        <SettingRow body="Show career-readiness progress." onChange={toggle('showCareer')} title="My career" value={preferences.showCareer} />
        <SettingRow body="Employee-only payroll shortcuts." onChange={toggle('showTimeAndPayroll')} title="Time and payroll" value={preferences.showTimeAndPayroll} />
      </Surface>

      <SectionTitle>Notifications</SectionTitle>
      <Surface>
        <SettingRow body="Urgent campus and safety notices." onChange={toggle('safetyAlerts')} title="Safety alerts" value={preferences.safetyAlerts} />
        <SettingRow body="Reminders for events you choose to follow." onChange={toggle('eventReminders')} title="Event reminders" value={preferences.eventReminders} />
      </Surface>

      <View style={styles.resetArea}>
        <ActionButton
          icon="refresh"
          label="Restore default settings"
          onPress={() =>
              Alert.alert('Restore defaults?', 'This resets all N° Navigate preferences on this device.', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Restore', style: 'destructive', onPress: resetPreferences },
            ])
          }
          variant="secondary"
        />
        <Text style={styles.storageNote}>{hydrated ? 'Preferences saved on this device.' : 'Loading device preferences…'}</Text>
      </View>
    </AppScaffold>
  );
}

const styles = StyleSheet.create({
  settingRow: { alignItems: 'center', borderBottomColor: colors.border, borderBottomWidth: StyleSheet.hairlineWidth, flexDirection: 'row', gap: spacing.md, minHeight: 82, padding: spacing.lg },
  settingIcon: { alignItems: 'center', backgroundColor: colors.maroonSoft, borderRadius: 16, height: 32, justifyContent: 'center', width: 32 },
  settingIconCaution: { backgroundColor: colors.amberSoft },
  settingCopy: { flex: 1 },
  settingTitle: { color: colors.ink, fontFamily: fonts.uiBold, fontSize: 15 },
  settingBody: { color: colors.inkMuted, fontFamily: fonts.ui, fontSize: 12, lineHeight: 16, marginTop: 3 },
  comingSoon: {
    backgroundColor: colors.cream,
    borderRadius: 999,
    color: colors.inkMuted,
    fontFamily: fonts.uiBold,
    fontSize: 10,
    overflow: 'hidden',
    paddingHorizontal: 9,
    paddingVertical: 4,
    textTransform: 'uppercase',
  },
  resetArea: { gap: spacing.md, marginHorizontal: spacing.lg, marginTop: spacing.xl },
  storageNote: { color: colors.inkMuted, fontFamily: fonts.ui, fontSize: 12, textAlign: 'center' },
});
