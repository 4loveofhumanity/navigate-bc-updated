import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, fonts, shadows, spacing } from '@/constants/theme';
import { useSettings } from '@/context/settings-context';

const TEST_USERNAME = 'student';
const TEST_PASSWORD = 'password';

export default function OnboardingScreen() {
  const router = useRouter();
  const { completeOnboarding } = useSettings();
  const [webcentralId, setWebcentralId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [saveUserId, setSaveUserId] = useState(false);
  const [savePassword, setSavePassword] = useState(false);

  function login() {
    if (!webcentralId.trim()) {
      setWebcentralId(TEST_USERNAME);
      setPassword(TEST_PASSWORD);
    }

    completeOnboarding({
      politicalParty: 'not-interested',
      selectedSports: ['login-complete'],
      identity: undefined,
    });
    router.replace('/');
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safe}>
      <View style={styles.screen}>
        <View style={styles.topBar}>
          <Pressable accessibilityLabel="Back" accessibilityRole="button" hitSlop={12} style={styles.iconButton}>
            <Ionicons color={colors.white} name="arrow-back" size={31} />
          </Pressable>
          <Text style={styles.headerTitle}>Login</Text>
          <Pressable accessibilityLabel="More options" accessibilityRole="button" hitSlop={12} style={styles.iconButton}>
            <Ionicons color={colors.white} name="ellipsis-vertical" size={28} />
          </Pressable>
        </View>

        <View style={styles.content}>
          <View style={styles.brandWrap}>
            <Text style={styles.brandTop}>Brooklyn</Text>
            <Text style={styles.brandBottom}>College</Text>
          </View>

          <Text style={styles.instructions}>
            Use your Brooklyn College WebCentral ID to gain access to your personal information.
          </Text>
          <Text style={styles.link}>Forgot your Password?</Text>
          <Text style={styles.helpText}>
            Don&apos;t have a WebCentral account?{'\n'}
            Call ITS Portal support at <Text style={styles.linkInline}>718-951-4357</Text> (HELP),{'\n'}
            or visit <Text style={styles.linkInline}>https://portal.brooklyn.edu</Text>.
          </Text>

          <View style={styles.formBox}>
            <Text style={styles.fieldLabel}>BC WebCentral ID:</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={setWebcentralId}
              placeholder={TEST_USERNAME}
              placeholderTextColor="#7E7E7E"
              returnKeyType="next"
              style={styles.input}
              value={webcentralId}
            />

            <Text style={styles.fieldLabel}>Password:</Text>
            <TextInput
              onChangeText={setPassword}
              placeholder={TEST_PASSWORD}
              placeholderTextColor="#7E7E7E"
              secureTextEntry={!showPassword}
              style={styles.input}
              value={password}
            />

            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: showPassword }}
              onPress={() => setShowPassword((current) => !current)}
              style={styles.showPasswordRow}
            >
              <Checkbox checked={showPassword} />
              <Text style={styles.checkText}>Show Password?</Text>
            </Pressable>
          </View>

          <View style={styles.options}>
            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: saveUserId }}
              onPress={() => setSaveUserId((current) => !current)}
              style={styles.optionRow}
            >
              <Checkbox checked={saveUserId} />
              <Text style={styles.optionText}>Save User ID?</Text>
            </Pressable>

            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: savePassword }}
              onPress={() => setSavePassword((current) => !current)}
              style={styles.optionRow}
            >
              <Checkbox checked={savePassword} />
              <Text style={styles.optionText}>Save Password to Device?</Text>
            </Pressable>
          </View>

        </View>

        <View style={styles.actions}>
          <Pressable accessibilityRole="button" onPress={() => router.replace('/')} style={styles.actionButton}>
            <Text style={styles.actionText}>Cancel</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={login} style={styles.actionButton}>
            <Text style={styles.actionText}>Login</Text>
          </Pressable>
        </View>

        <View style={styles.bottomBar}>
          <Text style={styles.emergencyText}>EMERGENCY CALL</Text>
          <Ionicons color={colors.white} name="notifications" size={32} />
          <Ionicons color={colors.white} name="help" size={35} />
          <Ionicons color={colors.white} name="settings" size={35} />
        </View>
      </View>
    </SafeAreaView>
  );
}

function Checkbox({ checked }: { checked: boolean }) {
  return (
    <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
      {checked ? <Ionicons color={colors.white} name="checkmark" size={19} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { backgroundColor: colors.maroon, flex: 1 },
  screen: { backgroundColor: colors.white, flex: 1 },
  topBar: {
    alignItems: 'center',
    backgroundColor: colors.maroon,
    flexDirection: 'row',
    height: 74,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
  },
  iconButton: { alignItems: 'center', height: 42, justifyContent: 'center', width: 42 },
  headerTitle: { color: colors.white, flex: 1, fontFamily: fonts.uiBold, fontSize: 32, marginLeft: spacing.xl },
  content: { flex: 1, paddingHorizontal: 28, paddingTop: spacing.sm },
  brandWrap: { alignItems: 'center', marginBottom: spacing.md },
  brandTop: { color: colors.maroon, fontFamily: fonts.display, fontSize: 58, lineHeight: 54 },
  brandBottom: { color: colors.maroon, fontFamily: fonts.display, fontSize: 58, lineHeight: 48, marginLeft: 118 },
  instructions: {
    color: colors.ink,
    fontFamily: fonts.uiBold,
    fontSize: 20,
    lineHeight: 24,
    marginHorizontal: spacing.md,
    textAlign: 'center',
  },
  link: { color: '#064FAE', fontFamily: fonts.uiBold, fontSize: 20, lineHeight: 23, textAlign: 'center', textDecorationLine: 'underline' },
  helpText: { color: colors.ink, fontFamily: fonts.uiBold, fontSize: 19, lineHeight: 24, textAlign: 'center' },
  linkInline: { color: '#064FAE', textDecorationLine: 'underline' },
  formBox: {
    borderColor: colors.maroon,
    borderWidth: 1.5,
    marginTop: 60,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  fieldLabel: { color: colors.ink, fontFamily: fonts.uiBold, fontSize: 20, marginBottom: spacing.xs },
  input: {
    borderBottomColor: colors.black,
    borderBottomWidth: 2,
    color: colors.ink,
    fontFamily: fonts.ui,
    fontSize: 21,
    height: 45,
    marginBottom: spacing.sm,
    padding: 0,
  },
  showPasswordRow: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    flexDirection: 'row',
    gap: spacing.xl,
    marginTop: spacing.sm,
    paddingVertical: spacing.sm,
  },
  checkbox: {
    alignItems: 'center',
    borderColor: '#6F6F6F',
    borderRadius: 3,
    borderWidth: 3,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  checkboxChecked: { backgroundColor: colors.maroon, borderColor: colors.maroon },
  checkText: { color: colors.black, fontFamily: fonts.uiBold, fontSize: 20 },
  options: { gap: spacing.lg, marginLeft: 34, marginTop: spacing.xl },
  optionRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.xl },
  optionText: { color: colors.black, fontFamily: fonts.uiBold, fontSize: 20 },
  actions: { flexDirection: 'row', gap: spacing.md, paddingBottom: spacing.sm, paddingHorizontal: 28 },
  actionButton: {
    alignItems: 'center',
    backgroundColor: colors.maroon,
    borderRadius: 2,
    flex: 1,
    height: 97,
    justifyContent: 'center',
    ...shadows.card,
  },
  actionText: { color: colors.white, fontFamily: fonts.uiBold, fontSize: 27 },
  bottomBar: {
    alignItems: 'center',
    backgroundColor: colors.maroon,
    flexDirection: 'row',
    height: 82,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
  },
  emergencyText: { color: colors.white, fontFamily: fonts.uiBold, fontSize: 22 },
});
