import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, Pressable, Share, StyleSheet, Text, View } from 'react-native';

import { AppScaffold } from '@/components/app-scaffold';
import { PageIntro, SectionTitle, Surface } from '@/components/ui';
import { colors, fonts, radii, spacing } from '@/constants/theme';
import { useSocial } from '@/context/social-context';
import { getPairingTransport, type PairingHandle, type PairingMethod, type PairingUpdate } from '@/lib/pairing';

const METHOD_COPY: Record<PairingMethod, { label: string; searching: string }> = {
  nfc: { label: 'Tap to pair', searching: 'Hold your phones together…' },
  nearby: { label: 'Find nearby', searching: 'Looking for nearby classmates…' },
};

// Proximity time accumulated with a friend.
function formatTogether(minutes: number): string {
  if (minutes <= 0) return 'no time yet';
  return `${formatDuration(minutes)} together`;
}

// Compact duration for the community row's right column.
function formatDuration(minutes: number): string {
  if (minutes <= 0) return 'New';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export default function CampusCommunityScreen() {
  const router = useRouter();
  const { me, friends, inviteLink, addPeer } = useSocial();
  const totalMinutes = friends.reduce((sum, friend) => sum + friend.minutesTogether, 0);
  const [activeMethod, setActiveMethod] = useState<PairingMethod | null>(null);
  const [update, setUpdate] = useState<PairingUpdate | null>(null);
  const [addedName, setAddedName] = useState<string | null>(null);
  const handleRef = useRef<PairingHandle | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    return () => {
      mounted.current = false;
      handleRef.current?.cancel();
    };
  }, []);

  function startPairing(method: PairingMethod) {
    void Haptics.selectionAsync();
    setAddedName(null);
    setActiveMethod(method);
    setUpdate({ phase: 'searching' });
    const transport = getPairingTransport(method);
    handleRef.current = transport.start({ name: me.name, code: me.code, accent: colors.maroon }, (next) => {
      if (!mounted.current) return;
      setUpdate(next);
      if (next.phase === 'connected' && next.peer) {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        const result = addPeer(next.peer, method);
        setAddedName(result.isNew ? result.friend.name : `${result.friend.name} (already connected)`);
        setActiveMethod(null);
      } else if (next.phase === 'cancelled' || next.phase === 'error' || next.phase === 'unavailable') {
        setActiveMethod(null);
      }
    });
  }

  function cancelPairing() {
    handleRef.current?.cancel();
    setActiveMethod(null);
    setUpdate(null);
  }

  async function shareInvite() {
    void Haptics.selectionAsync();
    const message = `Add me on the Brooklyn College app — my code is ${me.code}\n${inviteLink}`;
    try {
      await Share.share({ message, title: 'Add me on campus' });
    } catch {
      Alert.alert('Your invite', message);
    }
  }

  const searching = activeMethod !== null;

  return (
    <AppScaffold>
      <PageIntro
        eyebrow="Campus community"
        title="Connect with classmates around you."
        body="Tap phones together or discover who's nearby to add each other — that pairing is how you build your campus community. Then keep in touch in Messages."
      />

      {searching ? (
        <View style={styles.pairingCard}>
          <View style={styles.pulse}>
            <MaterialCommunityIcons color={colors.maroon} name={activeMethod === 'nfc' ? 'nfc-tap' : 'access-point'} size={30} />
          </View>
          <Text style={styles.pairingTitle}>{update?.peer ? `Found ${update.peer.name}` : METHOD_COPY[activeMethod].label}</Text>
          <Text style={styles.pairingDetail}>{update?.detail ?? (update?.phase === 'found' ? 'Connecting…' : METHOD_COPY[activeMethod].searching)}</Text>
          <Pressable accessibilityRole="button" onPress={cancelPairing} style={styles.cancelButton}>
            <Text style={styles.cancelLabel}>Cancel</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.methods}>
          <PairMethod
            icon="nfc-tap"
            title="Tap to pair"
            detail="Hold two phones together"
            onPress={() => startPairing('nfc')}
          />
          <PairMethod
            icon="access-point"
            title="Find nearby"
            detail="See who's nearby"
            onPress={() => startPairing('nearby')}
          />
        </View>
      )}

      {addedName && !searching ? (
        <View style={styles.addedBanner}>
          <Ionicons color={colors.green} name="checkmark-circle" size={20} />
          <Text style={styles.addedText}>Connected with {addedName}.</Text>
        </View>
      ) : null}

      <Pressable accessibilityRole="button" onPress={shareInvite} style={styles.shareRow}>
        <Ionicons color={colors.maroon} name="share-outline" size={17} />
        <Text style={styles.shareText}>Or share your invite (AirDrop, Messages…) · {me.code}</Text>
      </Pressable>

      <SectionTitle action={<Text style={styles.totalTime}>{formatTogether(totalMinutes)} total</Text>}>
        Your community ({friends.length})
      </SectionTitle>
      <Surface>
        {friends.map((friend, index) => (
          <Pressable
            accessibilityLabel={`Message ${friend.name}. ${formatTogether(friend.minutesTogether)}`}
            accessibilityRole="button"
            key={friend.id}
            onPress={() => router.push({ pathname: '/messages', params: { friend: friend.id } })}
            style={({ pressed }) => [styles.memberRow, index === friends.length - 1 && styles.memberRowLast, pressed && styles.memberRowPressed]}
          >
            <View style={[styles.avatar, { backgroundColor: friend.accent }]}>
              <Text style={styles.avatarText}>{friend.name.charAt(0)}</Text>
              <View style={styles.onlineDot} />
            </View>
            <View style={styles.memberCopy}>
              <Text style={styles.memberName}>{friend.name}</Text>
              <View style={styles.locationRow}>
                <Ionicons color={colors.inkMuted} name="location-outline" size={12} />
                <Text numberOfLines={1} style={styles.locationText}>{friend.location}</Text>
              </View>
            </View>
            <View style={styles.durationCol}>
              <Text style={styles.durationValue}>{formatDuration(friend.minutesTogether)}</Text>
              <Text style={styles.durationLabel}>together</Text>
            </View>
            <Ionicons color={colors.maroon} name="chatbubble-ellipses-outline" size={19} style={styles.rowChat} />
          </Pressable>
        ))}
      </Surface>

    </AppScaffold>
  );
}

function PairMethod({ icon, title, detail, onPress }: { icon: keyof typeof MaterialCommunityIcons.glyphMap; title: string; detail: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityLabel={`${title}. ${detail}`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.method, pressed && styles.methodPressed]}
    >
      <View style={styles.methodIcon}>
        <MaterialCommunityIcons color={colors.white} name={icon} size={26} />
      </View>
      <Text style={styles.methodTitle}>{title}</Text>
      <Text style={styles.methodDetail}>{detail}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  methods: { flexDirection: 'row', gap: spacing.md, marginHorizontal: spacing.lg },
  method: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  methodPressed: { opacity: 0.75, transform: [{ scale: 0.98 }] },
  methodIcon: { alignItems: 'center', backgroundColor: colors.maroon, borderRadius: 27, height: 54, justifyContent: 'center', marginBottom: spacing.sm, width: 54 },
  methodTitle: { color: colors.ink, fontFamily: fonts.uiBold, fontSize: 15 },
  methodDetail: { color: colors.inkMuted, fontFamily: fonts.ui, fontSize: 12, lineHeight: 16, marginTop: 3, textAlign: 'center' },
  pairingCard: {
    alignItems: 'center',
    backgroundColor: colors.maroonSoft,
    borderRadius: radii.lg,
    marginHorizontal: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  pulse: { alignItems: 'center', backgroundColor: colors.surface, borderRadius: 34, height: 68, justifyContent: 'center', marginBottom: spacing.md, width: 68 },
  pairingTitle: { color: colors.ink, fontFamily: fonts.uiBold, fontSize: 18 },
  pairingDetail: { color: colors.inkMuted, fontFamily: fonts.ui, fontSize: 13, marginTop: 4, textAlign: 'center' },
  cancelButton: { marginTop: spacing.lg, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  cancelLabel: { color: colors.maroon, fontFamily: fonts.uiBold, fontSize: 15 },
  addedBanner: {
    alignItems: 'center',
    backgroundColor: colors.greenSoft,
    borderRadius: radii.md,
    flexDirection: 'row',
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  addedText: { color: colors.green, fontFamily: fonts.uiMedium, fontSize: 13 },
  shareRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm, justifyContent: 'center', marginTop: spacing.lg, marginBottom: spacing.sm, paddingHorizontal: spacing.lg },
  shareText: { color: colors.maroon, fontFamily: fonts.uiMedium, fontSize: 13 },
  memberRow: {
    alignItems: 'center',
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  memberRowLast: { borderBottomWidth: 0 },
  memberRowPressed: { backgroundColor: colors.cream },
  avatar: { alignItems: 'center', borderRadius: 21, height: 42, justifyContent: 'center', position: 'relative', width: 42 },
  avatarText: { color: colors.white, fontFamily: fonts.uiBold, fontSize: 17 },
  onlineDot: { backgroundColor: colors.green, borderColor: colors.surface, borderRadius: 6, borderWidth: 2, bottom: -1, height: 12, position: 'absolute', right: -1, width: 12 },
  memberCopy: { flex: 1 },
  memberName: { color: colors.ink, fontFamily: fonts.uiBold, fontSize: 15 },
  locationRow: { alignItems: 'center', flexDirection: 'row', gap: 3, marginTop: 3 },
  locationText: { color: colors.inkMuted, flex: 1, fontFamily: fonts.ui, fontSize: 12 },
  durationCol: { alignItems: 'flex-end' },
  durationValue: { color: colors.ink, fontFamily: fonts.uiBold, fontSize: 13 },
  durationLabel: { color: colors.inkMuted, fontFamily: fonts.ui, fontSize: 10, marginTop: 1 },
  rowChat: { marginLeft: spacing.sm },
  totalTime: { color: colors.maroon, fontFamily: fonts.uiBold, fontSize: 12 },
});
