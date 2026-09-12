import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Animated, Image, Platform, StyleSheet, Text, View } from 'react-native';

import { AppScaffold } from '@/components/app-scaffold';
import { PageIntro, Pill } from '@/components/ui';
import { colors, fonts, radii, shadows, spacing } from '@/constants/theme';
import { useSettings } from '@/context/settings-context';
import { DEMO_STUDENT_CARD } from '@/data/demo';
import { getStudentCard } from '@/lib/api';

export default function StudentIdScreen() {
  const card = useQuery({
    queryKey: ['student-card'],
    queryFn: getStudentCard,
    placeholderData: DEMO_STUDENT_CARD,
  });
  const { preferences } = useSettings();
  const [pulse] = useState(() => new Animated.Value(0.45));

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { duration: 1500, toValue: 1, useNativeDriver: Platform.OS !== 'web' }),
        Animated.timing(pulse, { duration: 1500, toValue: 0.45, useNativeDriver: Platform.OS !== 'web' }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [pulse]);

  const data = card.data ?? DEMO_STUDENT_CARD;

  return (
    <AppScaffold>
      <PageIntro
        eyebrow="Student ID"
        title="Your mobile Student ID."
        body="This is a clearly marked demo credential. It must not be used for campus access or identity verification."
      />

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Image source={require('../../assets/brand/seal.png')} style={styles.seal} />
          <View style={styles.brandCopy}>
            <Text style={styles.college}>{data.college}</Text>
            <Text style={styles.cuny}>THE CITY UNIVERSITY OF NEW YORK</Text>
          </View>
          <Pill tone="warning">DEMO</Pill>
        </View>

        <View style={styles.portrait}>
          <Ionicons color={colors.maroon} name="person" size={62} />
        </View>
        <Text style={styles.studentName}>{data.name}</Text>
        <Text style={styles.studentRole}>{data.role}</Text>

        <View style={styles.idRow}>
          <View>
            <Text style={styles.fieldLabel}>EMPLID</Text>
            <Text style={styles.fieldValue}>{preferences.privacyMode ? '••••••••' : data.emplid}</Text>
          </View>
          <View style={styles.liveRow}>
            <Animated.View style={[styles.livePulse, { opacity: pulse, transform: [{ scale: pulse }] }]} />
            <View>
              <Text style={styles.liveLabel}>LIVE SCREEN</Text>
              <Text style={styles.liveSub}>Demo verification signal</Text>
            </View>
          </View>
        </View>

        <View style={styles.invalidBand}>
          <Ionicons color={colors.white} name="lock-closed" size={15} />
          <Text style={styles.invalidText}>NOT VALID FOR ENTRY OR IDENTIFICATION</Text>
        </View>
      </View>

      <View style={styles.securityNote}>
        <Ionicons color={colors.blue} name="shield-checkmark" size={24} />
        <View style={styles.securityCopy}>
          <Text style={styles.securityTitle}>Production security requirements</Text>
          <Text style={styles.securityBody}>A real Student ID needs authenticated issuance, short-lived signed payloads, revocation, screenshot resistance, and an audited verifier.</Text>
        </View>
      </View>

      <View style={styles.hotline}>
        <Ionicons color={colors.maroon} name="heart" size={20} />
        <Text style={styles.hotlineText}>{data.hotline}</Text>
      </View>
    </AppScaffold>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderColor: colors.maroon, borderRadius: radii.lg, borderWidth: 2, marginHorizontal: spacing.lg, overflow: 'hidden', padding: spacing.lg, ...shadows.floating },
  cardHeader: { alignItems: 'center', flexDirection: 'row', gap: spacing.md },
  seal: { height: 50, width: 50 },
  brandCopy: { flex: 1 },
  college: { color: colors.maroon, fontFamily: fonts.display, fontSize: 20, letterSpacing: 1 },
  cuny: { color: colors.inkMuted, fontFamily: fonts.uiBold, fontSize: 8, letterSpacing: 0.7 },
  portrait: { alignItems: 'center', alignSelf: 'center', backgroundColor: colors.maroonSoft, borderColor: colors.border, borderRadius: 48, borderWidth: 1, height: 96, justifyContent: 'center', marginTop: spacing.xl, width: 96 },
  studentName: { color: colors.ink, fontFamily: fonts.uiBold, fontSize: 22, marginTop: spacing.md, textAlign: 'center' },
  studentRole: { color: colors.inkMuted, fontFamily: fonts.ui, fontSize: 14, marginTop: 2, textAlign: 'center' },
  idRow: { alignItems: 'center', borderTopColor: colors.border, borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xl, paddingTop: spacing.lg },
  fieldLabel: { color: colors.inkMuted, fontFamily: fonts.uiBold, fontSize: 9, letterSpacing: 1.2 },
  fieldValue: { color: colors.ink, fontFamily: fonts.uiBold, fontSize: 16, marginTop: 2 },
  liveRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  livePulse: { backgroundColor: '#1688F8', borderRadius: 10, height: 20, width: 20 },
  liveLabel: { color: colors.blue, fontFamily: fonts.uiBold, fontSize: 9, letterSpacing: 1 },
  liveSub: { color: colors.inkMuted, fontFamily: fonts.ui, fontSize: 9 },
  invalidBand: { alignItems: 'center', backgroundColor: colors.maroon, borderRadius: radii.sm, flexDirection: 'row', gap: spacing.sm, justifyContent: 'center', marginTop: spacing.lg, padding: spacing.md },
  invalidText: { color: colors.white, fontFamily: fonts.uiBold, fontSize: 10, letterSpacing: 0.5 },
  securityNote: { alignItems: 'flex-start', backgroundColor: colors.blueSoft, borderColor: '#BED9E5', borderRadius: radii.md, borderWidth: 1, flexDirection: 'row', gap: spacing.md, marginHorizontal: spacing.lg, marginTop: spacing.xl, padding: spacing.lg },
  securityCopy: { flex: 1 },
  securityTitle: { color: colors.blue, fontFamily: fonts.uiBold, fontSize: 15 },
  securityBody: { color: colors.ink, fontFamily: fonts.ui, fontSize: 13, lineHeight: 18, marginTop: 3 },
  hotline: { alignItems: 'flex-start', flexDirection: 'row', gap: spacing.md, marginHorizontal: spacing.xl, marginTop: spacing.xl },
  hotlineText: { color: colors.inkMuted, flex: 1, fontFamily: fonts.ui, fontSize: 13, lineHeight: 18 },
});
