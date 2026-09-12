import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Switch, StyleSheet, Text, View } from 'react-native';

import { AppScaffold } from '@/components/app-scaffold';
import { colors, fonts, radii, spacing } from '@/constants/theme';

type CircleMember = {
  initials: string;
  name: string;
  location: string;
  duration: string;
  accent: string;
};

const circleMembers: CircleMember[] = [
  { initials: 'MR', name: 'Maya R.', location: 'Chemistry Lab · H 1141', duration: '14h 20m', accent: '#5E82B7' },
  { initials: 'JT', name: 'Jordan T.', location: 'Library · 3rd Floor', duration: '9h 5m', accent: '#5E82B7' },
  { initials: 'PS', name: 'Priya S.', location: 'Student Center', duration: '6h 40m', accent: '#5E82B7' },
  { initials: 'AK', name: 'Ari K.', location: 'West Quad Building', duration: '3h 15m', accent: '#5E82B7' },
  { initials: 'DM', name: 'Devon M.', location: 'Campus Library', duration: '1h 55m', accent: '#5E82B7' },
];

export default function PuglieseCircleScreen() {
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [presenceEnabled, setPresenceEnabled] = useState(true);

  return (
    <AppScaffold contentContainerStyle={styles.content}>
      <View style={styles.controlCard}>
        <CircleControl
          icon="location"
          label="Location Services"
          detail={locationEnabled ? 'On · West Quad Building' : 'Off · Turn on to share your location'}
          value={locationEnabled}
          onValueChange={setLocationEnabled}
        />
        <CircleControl
          icon="radio"
          label="Share My Presence"
          detail={presenceEnabled ? 'Discover people you spend time with' : 'Off · Your presence is hidden'}
          value={presenceEnabled}
          onValueChange={setPresenceEnabled}
        />
      </View>

      {presenceEnabled ? (
        <>
          <Text style={styles.sectionLabel}>YOUR PUG</Text>
          <View style={styles.memberList}>
            {circleMembers.map((member) => <CircleMemberRow member={member} key={member.initials} />)}
          </View>
        </>
      ) : (
        <View style={styles.disabledState}>
          <View style={styles.disabledIcon}><Ionicons color={colors.maroon} name="eye-off-outline" size={28} /></View>
          <Text style={styles.disabledTitle}>Presence sharing is off</Text>
          <Text style={styles.disabledBody}>Turn on Share My Presence to see your PUG and the places you spend time together.</Text>
        </View>
      )}
    </AppScaffold>
  );
}

function CircleControl({
  icon,
  label,
  detail,
  value,
  onValueChange,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  detail: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.controlRow}>
      <View style={styles.controlIcon}><Ionicons color={colors.white} name={icon} size={19} /></View>
      <View style={styles.controlCopy}>
        <Text style={styles.controlLabel}>{label}</Text>
        <Text style={styles.controlDetail}>{detail}</Text>
      </View>
      <Switch
        accessibilityLabel={label}
        onValueChange={onValueChange}
        thumbColor={colors.white}
        trackColor={{ false: colors.borderStrong, true: '#2DC463' }}
        value={value}
      />
    </View>
  );
}

function CircleMemberRow({ member }: { member: CircleMember }) {
  return (
    <View style={styles.memberRow}>
      <View style={[styles.avatar, { backgroundColor: member.accent }]}> 
        <Text style={styles.avatarText}>{member.initials}</Text>
        <View style={styles.onlineDot} />
      </View>
      <View style={styles.memberCopy}>
        <View style={styles.nameLine}>
          <Text style={styles.memberName}>{member.name}</Text>
          <Text style={styles.nearby}> · nearby</Text>
        </View>
        <Text style={styles.memberLocation}>Most at {member.location}</Text>
      </View>
      <View style={styles.durationCopy}>
        <Text style={styles.duration}>{member.duration}</Text>
        <Text style={styles.together}>together now</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { backgroundColor: '#F4F5FA', paddingBottom: spacing.xxl },
  controlCard: { backgroundColor: '#F4F5FA', gap: spacing.sm, paddingHorizontal: spacing.sm, paddingTop: spacing.sm },
  controlRow: { alignItems: 'center', backgroundColor: colors.surface, borderRadius: radii.md, flexDirection: 'row', minHeight: 60, paddingHorizontal: spacing.md, ...{ boxShadow: '0 2px 7px rgba(31, 44, 75, 0.08)' } },
  controlIcon: { alignItems: 'center', backgroundColor: '#A42C43', borderRadius: 10, height: 34, justifyContent: 'center', width: 34 },
  controlCopy: { flex: 1, marginLeft: spacing.md },
  controlLabel: { color: '#101A2B', fontFamily: fonts.uiBold, fontSize: 15 },
  controlDetail: { color: '#68728A', fontFamily: fonts.ui, fontSize: 12, marginTop: 1 },
  mapSection: { alignItems: 'center', paddingTop: spacing.lg },
  presenceMap: { height: 286, position: 'relative', width: 286 },
  mapGlow: { backgroundColor: 'rgba(109, 183, 255, .25)', borderRadius: 90, height: 120, position: 'absolute', right: 23, top: 18, transform: [{ rotate: '45deg' }], width: 58 },
  mapRing: { borderColor: '#CCD7E5', borderWidth: 1, borderRadius: 999, position: 'absolute' },
  outerRing: { height: 272, left: 7, top: 7, width: 272 },
  middleRing: { height: 192, left: 47, top: 47, width: 192 },
  innerRing: { height: 112, left: 87, top: 87, width: 112 },
  mapLineOne: { backgroundColor: '#CBD6E4', height: 1, left: 38, position: 'absolute', top: 139, transform: [{ rotate: '28deg' }], width: 215 },
  mapLineTwo: { backgroundColor: '#CBD6E4', height: 1, left: 37, position: 'absolute', top: 139, transform: [{ rotate: '-33deg' }], width: 215 },
  mapLineThree: { backgroundColor: '#CBD6E4', height: 1, left: 79, position: 'absolute', top: 139, transform: [{ rotate: '72deg' }], width: 130 },
  mapLineFour: { backgroundColor: '#CBD6E4', height: 1, left: 79, position: 'absolute', top: 139, transform: [{ rotate: '-72deg' }], width: 130 },
  youNode: { alignItems: 'center', backgroundColor: colors.maroon, borderRadius: 18, height: 36, justifyContent: 'center', left: 125, position: 'absolute', top: 125, width: 36 },
  youText: { color: colors.white, fontFamily: fonts.uiBold, fontSize: 12 },
  presenceNode: { alignItems: 'center', backgroundColor: '#5D80B5', borderRadius: 15, height: 30, justifyContent: 'center', position: 'absolute', width: 30 },
  presenceNodeActive: { backgroundColor: '#1685F8' },
  nodeText: { color: colors.white, fontFamily: fonts.uiBold, fontSize: 11 },
  nodeSo: { left: 30, top: 74 },
  nodeMr: { left: 118, top: 37 },
  nodeJt: { right: 51, top: 46 },
  nodePs: { right: 43, top: 131 },
  nodeAk: { left: 38, top: 164 },
  nodeDm: { left: 123, top: 211 },
  mapLegend: { color: '#68728A', fontFamily: fonts.ui, fontSize: 12, marginTop: spacing.xs },
  mapLegendAccent: { color: colors.red, fontFamily: fonts.uiBold },
  sectionLabel: { color: '#68728A', fontFamily: fonts.uiMedium, fontSize: 13, marginBottom: spacing.sm, marginHorizontal: spacing.md, marginTop: spacing.lg },
  memberList: { gap: spacing.sm, paddingHorizontal: spacing.sm },
  memberRow: { alignItems: 'center', backgroundColor: colors.surface, borderRadius: radii.md, flexDirection: 'row', minHeight: 68, paddingHorizontal: spacing.md, ...{ boxShadow: '0 2px 7px rgba(31, 44, 75, 0.08)' } },
  avatar: { alignItems: 'center', borderRadius: 22, height: 44, justifyContent: 'center', position: 'relative', width: 44 },
  avatarText: { color: colors.white, fontFamily: fonts.uiBold, fontSize: 14 },
  onlineDot: { backgroundColor: '#2DC463', borderColor: colors.white, borderRadius: 6, borderWidth: 2, bottom: -1, height: 12, position: 'absolute', right: -1, width: 12 },
  memberCopy: { flex: 1, marginLeft: spacing.md },
  nameLine: { alignItems: 'baseline', flexDirection: 'row' },
  memberName: { color: '#182133', fontFamily: fonts.uiBold, fontSize: 15 },
  nearby: { color: '#68728A', fontFamily: fonts.ui, fontSize: 11 },
  memberLocation: { color: '#68728A', fontFamily: fonts.ui, fontSize: 12, marginTop: 2 },
  durationCopy: { alignItems: 'flex-end' },
  duration: { color: '#182133', fontFamily: fonts.uiBold, fontSize: 15 },
  together: { color: '#68728A', fontFamily: fonts.ui, fontSize: 10, marginTop: 1 },
  disabledState: { alignItems: 'center', paddingHorizontal: spacing.xxl, paddingTop: spacing.xxxl },
  disabledIcon: { alignItems: 'center', backgroundColor: colors.maroonSoft, borderRadius: 30, height: 60, justifyContent: 'center', width: 60 },
  disabledTitle: { color: colors.ink, fontFamily: fonts.uiBold, fontSize: 18, marginTop: spacing.lg },
  disabledBody: { color: colors.inkMuted, fontFamily: fonts.ui, fontSize: 14, lineHeight: 20, marginTop: spacing.sm, textAlign: 'center' },
});
