import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Pill } from '@/components/ui';
import { colors, fonts, radii, shadows, spacing } from '@/constants/theme';
import { DEMO_LIBRARY, DEMO_STUDENT_CARD } from '@/data/demo';
import { getLibraryResources, getStudentCard } from '@/lib/api';

// Passport-cropped student photo shown in the ID frame.
const STUDENT_PHOTO: number | null = require('../../assets/brand/student-photo.jpg');

export default function StudentIdScreen() {
  const card = useQuery({ queryKey: ['student-card'], queryFn: getStudentCard, placeholderData: DEMO_STUDENT_CARD });
  const library = useQuery({ queryKey: ['library-resources'], queryFn: getLibraryResources, placeholderData: DEMO_LIBRARY });
  const [pulse] = useState(() => new Animated.Value(0.5));

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { duration: 1400, toValue: 1, useNativeDriver: Platform.OS !== 'web' }),
        Animated.timing(pulse, { duration: 1400, toValue: 0.5, useNativeDriver: Platform.OS !== 'web' }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [pulse]);

  const router = useRouter();
  const data = card.data ?? DEMO_STUDENT_CARD;
  const libraryData = library.data ?? DEMO_LIBRARY;

  return (
    <View style={styles.screen}>
      <SafeAreaView edges={['top', 'bottom']} style={styles.safe}>
        <View style={styles.topRow}>
          <Pressable accessibilityLabel="Close" accessibilityRole="button" hitSlop={10} onPress={() => router.back()} style={styles.closeButton}>
            <Ionicons color={colors.ink} name="chevron-back" size={26} />
          </Pressable>
          <Text style={styles.topTitle}>Student ID</Text>
          <View style={styles.closeButton} />
        </View>

        <View style={styles.cardArea}>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Image source={require('../../assets/brand/seal.png')} style={styles.seal} />
          <View style={styles.brandCopy}>
            <Text style={styles.college}>{data.college}</Text>
            <Text style={styles.cuny}>THE CITY UNIVERSITY OF NEW YORK</Text>
          </View>
          <Pill tone="warning">DEMO</Pill>
        </View>

        <View style={styles.idBody}>
          <View style={styles.photoFrame}>
            {STUDENT_PHOTO ? (
              <Image resizeMode="cover" source={STUDENT_PHOTO} style={styles.photo} />
            ) : (
              <Ionicons color={colors.maroon} name="person" size={52} />
            )}
          </View>
          <View style={styles.idDetails}>
            <Text style={styles.studentName}>{data.name}</Text>
            <Text style={styles.studentRole}>{data.role}</Text>

            <Text style={styles.fieldLabel}>EMPLID</Text>
            <Text style={styles.fieldValue}>{data.emplid}</Text>

            <View style={styles.liveRow}>
              <Animated.View style={[styles.liveDot, { opacity: pulse, transform: [{ scale: pulse }] }]}>
                <LinearGradient colors={['#8FD0FF', '#1565D8']} end={{ x: 1, y: 1 }} start={{ x: 0, y: 0 }} style={styles.liveDotFill} />
              </Animated.View>
              <View>
                <Text style={styles.liveLabel}>LIVE SCREEN</Text>
                <Text style={styles.liveSub}>Demo verification signal</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.invalidBand}>
          <Ionicons color={colors.white} name="lock-closed" size={14} />
          <Text style={styles.invalidText}>NOT VALID FOR ENTRY OR IDENTIFICATION</Text>
        </View>

        <View style={styles.librarySection}>
          <View style={styles.libraryHeader}>
            <View style={styles.libraryHeaderCopy}>
              <Text style={styles.libraryLabel}>LIBRARY CARD</Text>
              <Text style={styles.libraryName}>{libraryData.name}</Text>
            </View>
            <Ionicons color={colors.maroon} name="library-outline" size={20} />
          </View>
          <SimpleBarcode value={libraryData.libraryId} />
          <Text selectable style={styles.libraryId}>{libraryData.libraryId}</Text>
        </View>
        </View>

        <Text style={styles.disclaimer}>Demo credential — not valid for campus access or identity verification.</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

function SimpleBarcode({ value }: { value: string }) {
  const bars = `101${value.split('').map((digit) => (Number(digit) || 0).toString(2).padStart(4, '0')).join('01')}101`;

  return (
    <View accessibilityLabel={`Library card barcode ${value}`} style={styles.barcode}>
      {bars.split('').map((bar, index) => (
        <View key={`${index}-${bar}`} style={[styles.barcodeBar, bar === '0' && styles.barcodeSpace]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.cream, flex: 1 },
  safe: { flex: 1 },
  topRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  closeButton: { alignItems: 'center', height: 40, justifyContent: 'center', width: 40 },
  topTitle: { color: colors.ink, fontFamily: fonts.uiBold, fontSize: 17 },
  cardArea: { flex: 1, justifyContent: 'center' },
  disclaimer: { color: colors.inkMuted, fontFamily: fonts.ui, fontSize: 12, lineHeight: 17, marginTop: spacing.xl, paddingHorizontal: spacing.xxl, textAlign: 'center' },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.maroon,
    borderRadius: radii.lg,
    borderWidth: 2,
    marginHorizontal: spacing.lg,
    overflow: 'hidden',
    padding: spacing.lg,
    ...shadows.floating,
  },
  cardHeader: { alignItems: 'center', flexDirection: 'row', gap: spacing.md },
  seal: { height: 46, width: 46 },
  brandCopy: { flex: 1 },
  college: { color: colors.maroon, fontFamily: fonts.display, fontSize: 22, letterSpacing: 0.5 },
  cuny: { color: colors.inkMuted, fontFamily: fonts.uiBold, fontSize: 8, letterSpacing: 0.7 },
  idBody: { flexDirection: 'row', gap: spacing.lg, marginTop: spacing.lg },
  photoFrame: {
    alignItems: 'center',
    backgroundColor: colors.maroonSoft,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    height: 118,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 92,
  },
  photo: { height: '100%', width: '100%' },
  idDetails: { flex: 1, justifyContent: 'center' },
  studentName: { color: colors.ink, fontFamily: fonts.uiBold, fontSize: 22 },
  studentRole: { color: colors.inkMuted, fontFamily: fonts.ui, fontSize: 14, marginTop: 2 },
  fieldLabel: { color: colors.inkMuted, fontFamily: fonts.uiBold, fontSize: 9, letterSpacing: 1.2, marginTop: spacing.md },
  fieldValue: { color: colors.ink, fontFamily: fonts.uiBold, fontSize: 17, letterSpacing: 1, marginTop: 2 },
  liveRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  liveDot: { borderRadius: 14, elevation: 3, height: 28, overflow: 'hidden', shadowColor: '#1565D8', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 6, width: 28 },
  liveDotFill: { flex: 1 },
  liveLabel: { color: colors.blue, fontFamily: fonts.uiBold, fontSize: 9, letterSpacing: 1 },
  liveSub: { color: colors.inkMuted, fontFamily: fonts.ui, fontSize: 9 },
  invalidBand: {
    alignItems: 'center',
    backgroundColor: colors.maroon,
    borderRadius: radii.sm,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    marginTop: spacing.lg,
    padding: spacing.md,
  },
  invalidText: { color: colors.white, fontFamily: fonts.uiBold, fontSize: 10, letterSpacing: 0.5 },
  librarySection: { borderTopColor: colors.border, borderTopWidth: 1, marginTop: spacing.lg, paddingTop: spacing.lg },
  libraryHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  libraryHeaderCopy: { flex: 1 },
  libraryLabel: { color: colors.maroon, fontFamily: fonts.uiBold, fontSize: 9, letterSpacing: 1.2 },
  libraryName: { color: colors.ink, fontFamily: fonts.uiBold, fontSize: 14, marginTop: 2 },
  barcode: { alignItems: 'stretch', flexDirection: 'row', height: 48, justifyContent: 'center', overflow: 'hidden', width: '100%' },
  barcodeBar: { backgroundColor: colors.ink, flex: 1, maxWidth: 4 },
  barcodeSpace: { backgroundColor: 'transparent' },
  libraryId: { color: colors.ink, fontFamily: fonts.uiBold, fontSize: 14, letterSpacing: 2, marginTop: spacing.sm, textAlign: 'center' },
});
