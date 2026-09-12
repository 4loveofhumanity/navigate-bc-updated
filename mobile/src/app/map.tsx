import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScaffold } from '@/components/app-scaffold';
import { ActionButton, PageIntro, Pill, SectionTitle, Surface } from '@/components/ui';
import { colors, fonts, radii, shadows, spacing } from '@/constants/theme';
import { DEMO_LOCATION } from '@/data/demo';
import { getCampusLocation } from '@/lib/api';
import { openInAppBrowser } from '@/lib/in-app-browser';
import { openMapDirections } from '@/lib/map-links';

const destinations = [
  { id: 'financial-aid', name: 'Financial Aid', room: '308', building: 'West Quad Center', floor: '3rd Floor' },
  { id: 'advisement', name: 'Academic Advisement', room: '3207', building: 'Boylan Hall', floor: '3rd Floor' },
  { id: 'career', name: 'Magner Career Center', room: '1303', building: 'James Hall', floor: '3rd Floor' },
  { id: 'library', name: 'Brooklyn College Library', room: 'Main entrance', building: 'Library', floor: 'Cafe Level' },
];

export default function MapScreen() {
  const serviceLocation = useQuery({ queryKey: ['campus-location'], queryFn: getCampusLocation, placeholderData: DEMO_LOCATION });
  const [selectedId, setSelectedId] = useState('financial-aid');
  const selected = destinations.find((destination) => destination.id === selectedId) ?? destinations[0];
  const current = selected.id === 'financial-aid' && serviceLocation.data
    ? { ...selected, building: serviceLocation.data.building, floor: serviceLocation.data.floor, room: serviceLocation.data.room }
    : selected;

  return (
    <AppScaffold>
      <PageIntro eyebrow="Wayfinding" title="Get oriented before you start walking." body="Choose a destination, confirm the building and floor, then open walking directions in Apple Maps on iPhone or Google Maps on Android." />

      <ImageBackground source={require('../../assets/brand/lily-pond.jpg')} style={styles.mapHero} imageStyle={styles.mapHeroImage}>
        <View style={styles.mapOverlay} />
        <View style={styles.pin}>
          <Ionicons color={colors.white} name="location" size={25} />
        </View>
        <View style={styles.locationCard}>
          <Pill tone="maroon">Selected destination</Pill>
          <Text style={styles.locationName}>{current.name}</Text>
          <Text style={styles.locationDetail}>{current.room} {current.building} · {current.floor}</Text>
        </View>
      </ImageBackground>

      <SectionTitle>Campus destinations</SectionTitle>
      <Surface>
        {destinations.map((destination) => {
          const active = destination.id === selectedId;
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              key={destination.id}
              onPress={() => setSelectedId(destination.id)}
              style={[styles.destinationRow, active && styles.destinationRowActive]}
            >
              <View style={[styles.destinationIcon, active && styles.destinationIconActive]}>
                <Ionicons color={active ? colors.white : colors.maroon} name="business" size={20} />
              </View>
              <View style={styles.destinationCopy}>
                <Text style={styles.destinationName}>{destination.name}</Text>
                <Text style={styles.destinationDetail}>{destination.room} {destination.building}</Text>
              </View>
              {active ? <Ionicons color={colors.maroon} name="checkmark-circle" size={21} /> : null}
            </Pressable>
          );
        })}
      </Surface>

      <View style={styles.actions}>
        <ActionButton
          icon="navigate"
          label="Get directions in Maps"
          onPress={() => void openMapDirections(current)}
        />
        <ActionButton
          icon="map-outline"
          label="Open Brooklyn College visit resources"
          onPress={() => openInAppBrowser('https://www.brooklyn.edu/visit/', 'Visit Brooklyn College')}
          variant="secondary"
        />
      </View>

      <Text style={styles.note}>Directions open Apple Maps on iPhone and Google Maps on Android. Indoor floor-by-floor navigation requires official building geometry and accessibility-route data before production release.</Text>
    </AppScaffold>
  );
}

const styles = StyleSheet.create({
  mapHero: { height: 260, justifyContent: 'flex-end', marginHorizontal: spacing.lg, overflow: 'hidden', borderRadius: radii.lg, ...shadows.card },
  mapHeroImage: { borderRadius: radii.lg },
  mapOverlay: { backgroundColor: 'rgba(28, 10, 14, 0.28)', bottom: 0, left: 0, position: 'absolute', right: 0, top: 0 },
  pin: { alignItems: 'center', alignSelf: 'center', backgroundColor: colors.maroon, borderColor: colors.white, borderRadius: 27, borderWidth: 4, height: 54, justifyContent: 'center', position: 'absolute', top: 68, width: 54, ...shadows.floating },
  locationCard: { backgroundColor: 'rgba(255,254,251,.96)', borderRadius: radii.md, margin: spacing.md, padding: spacing.lg },
  locationName: { color: colors.ink, fontFamily: fonts.display, fontSize: 25, marginTop: spacing.sm },
  locationDetail: { color: colors.inkMuted, fontFamily: fonts.uiMedium, fontSize: 13, marginTop: 2 },
  destinationRow: { alignItems: 'center', borderBottomColor: colors.border, borderBottomWidth: StyleSheet.hairlineWidth, flexDirection: 'row', gap: spacing.md, minHeight: 72, padding: spacing.lg },
  destinationRowActive: { backgroundColor: colors.maroonSoft },
  destinationIcon: { alignItems: 'center', backgroundColor: colors.maroonSoft, borderRadius: 19, height: 38, justifyContent: 'center', width: 38 },
  destinationIconActive: { backgroundColor: colors.maroon },
  destinationCopy: { flex: 1 },
  destinationName: { color: colors.ink, fontFamily: fonts.uiBold, fontSize: 15 },
  destinationDetail: { color: colors.inkMuted, fontFamily: fonts.ui, fontSize: 13, marginTop: 2 },
  actions: { gap: spacing.sm, marginHorizontal: spacing.lg, marginTop: spacing.xl },
  note: { color: colors.inkMuted, fontFamily: fonts.ui, fontSize: 12, lineHeight: 17, marginHorizontal: spacing.xl, marginTop: spacing.xl, textAlign: 'center' },
});
