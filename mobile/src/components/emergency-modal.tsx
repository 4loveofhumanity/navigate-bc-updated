import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Alert, Linking, Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radii, shadows, spacing } from '@/constants/theme';

type Contact = {
  id: 'safety' | '911';
  title: string;
  label: string;
  number: string;
  display: string;
  detail: string;
  icon: keyof typeof Ionicons.glyphMap;
  danger?: boolean;
};

// Brooklyn College Public Safety emergency line and national emergency number.
const CONTACTS: Contact[] = [
  {
    id: 'safety',
    title: 'Campus Public Safety',
    label: 'Campus Public Safety',
    number: '7189515511',
    display: '(718) 951-5511',
    detail: 'On-campus emergencies, medical calls, and safety escorts.',
    icon: 'shield-checkmark',
  },
  {
    id: '911',
    title: 'Call 911',
    label: '911',
    number: '911',
    display: '911',
    detail: 'Life-threatening emergencies, fire, or crimes in progress.',
    icon: 'medkit',
    danger: true,
  },
];

export function EmergencyModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [pending, setPending] = useState<Contact | null>(null);

  function close() {
    setPending(null);
    onClose();
  }

  async function placeCall(contact: Contact) {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    const url = `tel:${contact.number}`;
    try {
      // On iOS/Android this opens the dialer, which asks the user to confirm the
      // call before it is placed. canOpenURL guards devices that can't call.
      const supported = Platform.OS === 'web' ? true : await Linking.canOpenURL(url);
      if (!supported) {
        Alert.alert('Calling not available', `This device can’t place calls. Please dial ${contact.display} from a phone.`);
        return;
      }
      await Linking.openURL(url);
      close();
    } catch {
      Alert.alert('Unable to start the call', `Please dial ${contact.display} directly.`);
    }
  }

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={close}>
      <Pressable accessibilityLabel="Close emergency options" onPress={close} style={styles.scrim} />
      <View style={styles.sheet}>
        <View style={styles.handle} />

        {pending ? (
          <View>
            <View style={[styles.confirmIcon, pending.danger && styles.confirmIconDanger]}>
              <Ionicons color={pending.danger ? colors.red : colors.maroon} name={pending.icon} size={26} />
            </View>
            <Text style={styles.confirmTitle}>Call {pending.label}?</Text>
            <Text style={styles.confirmNumber}>{pending.display}</Text>
            <Text style={styles.confirmDetail}>
              Your phone will ask you to confirm before the call connects.
            </Text>

            <Pressable
              accessibilityLabel={`Call ${pending.label} at ${pending.display}`}
              accessibilityRole="button"
              onPress={() => placeCall(pending)}
              style={({ pressed }) => [styles.callButton, pending.danger && styles.callButtonDanger, pressed && styles.pressed]}
            >
              <Ionicons color={colors.white} name="call" size={19} />
              <Text style={styles.callButtonLabel}>Call now</Text>
            </Pressable>
            <Pressable accessibilityRole="button" onPress={() => setPending(null)} style={styles.secondaryButton}>
              <Text style={styles.secondaryLabel}>Back</Text>
            </Pressable>
          </View>
        ) : (
          <View>
            <Text style={styles.title}>Emergency</Text>
            <Text style={styles.subtitle}>Choose the right response for your situation.</Text>

            {CONTACTS.map((contact) => (
              <Pressable
                accessibilityLabel={`${contact.title}. ${contact.detail}`}
                accessibilityRole="button"
                key={contact.id}
                onPress={() => {
                  void Haptics.selectionAsync();
                  setPending(contact);
                }}
                style={({ pressed }) => [styles.option, contact.danger && styles.optionDanger, pressed && styles.pressed]}
              >
                <View style={[styles.optionIcon, contact.danger && styles.optionIconDanger]}>
                  <Ionicons color={contact.danger ? colors.red : colors.maroon} name={contact.icon} size={22} />
                </View>
                <View style={styles.optionCopy}>
                  <Text style={[styles.optionLabel, contact.danger && styles.optionLabelDanger]}>{contact.title}</Text>
                  <Text style={styles.optionDetail}>{contact.detail}</Text>
                </View>
                <Text style={[styles.optionNumber, contact.danger && styles.optionLabelDanger]}>{contact.display}</Text>
              </Pressable>
            ))}

            <Pressable accessibilityRole="button" onPress={close} style={styles.secondaryButton}>
              <Text style={styles.secondaryLabel}>Cancel</Text>
            </Pressable>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: { backgroundColor: 'rgba(38, 10, 15, 0.5)', flex: 1 },
  sheet: {
    backgroundColor: colors.paper,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    maxWidth: 480,
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    width: '100%',
    ...shadows.floating,
    alignSelf: 'center',
  },
  handle: {
    alignSelf: 'center',
    backgroundColor: colors.borderStrong,
    borderRadius: radii.round,
    height: 4,
    marginBottom: spacing.lg,
    width: 40,
  },
  title: { color: colors.ink, fontFamily: fonts.display, fontSize: 30, textAlign: 'center' },
  subtitle: { color: colors.inkMuted, fontFamily: fonts.ui, fontSize: 14, marginBottom: spacing.lg, marginTop: 4, textAlign: 'center' },
  option: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
    padding: spacing.lg,
  },
  optionDanger: { backgroundColor: colors.redSoft, borderColor: '#F3C9C4' },
  optionIcon: {
    alignItems: 'center',
    backgroundColor: colors.maroonSoft,
    borderRadius: radii.round,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  optionIconDanger: { backgroundColor: '#FADFDB' },
  optionCopy: { flex: 1 },
  optionLabel: { color: colors.ink, fontFamily: fonts.uiBold, fontSize: 16 },
  optionLabelDanger: { color: colors.red },
  optionDetail: { color: colors.inkMuted, fontFamily: fonts.ui, fontSize: 12, lineHeight: 16, marginTop: 3 },
  optionNumber: { color: colors.maroon, fontFamily: fonts.uiBold, fontSize: 13 },
  pressed: { opacity: 0.75, transform: [{ scale: 0.98 }] },
  secondaryButton: { alignItems: 'center', marginTop: spacing.lg, minHeight: 44, justifyContent: 'center' },
  secondaryLabel: { color: colors.inkMuted, fontFamily: fonts.uiBold, fontSize: 15 },
  confirmIcon: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: colors.maroonSoft,
    borderRadius: radii.round,
    height: 60,
    justifyContent: 'center',
    marginBottom: spacing.md,
    width: 60,
  },
  confirmIconDanger: { backgroundColor: '#FADFDB' },
  confirmTitle: { color: colors.ink, fontFamily: fonts.uiBold, fontSize: 20, textAlign: 'center' },
  confirmNumber: { color: colors.maroon, fontFamily: fonts.display, fontSize: 30, marginTop: 4, textAlign: 'center' },
  confirmDetail: { color: colors.inkMuted, fontFamily: fonts.ui, fontSize: 13, lineHeight: 18, marginTop: spacing.sm, paddingHorizontal: spacing.md, textAlign: 'center' },
  callButton: {
    alignItems: 'center',
    backgroundColor: colors.maroon,
    borderRadius: radii.md,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    marginTop: spacing.xl,
    minHeight: 54,
  },
  callButtonDanger: { backgroundColor: colors.red },
  callButtonLabel: { color: colors.white, fontFamily: fonts.uiBold, fontSize: 17 },
});
