import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { StyleSheet, Text, View } from 'react-native';

import { AppScaffold } from '@/components/app-scaffold';
import { ActionButton, ListRow, PageIntro, SectionTitle, Surface } from '@/components/ui';
import { colors, fonts, radii, spacing } from '@/constants/theme';
import { DEMO_LIBRARY } from '@/data/demo';
import { getLibraryResources } from '@/lib/api';
import { openInAppBrowser } from '@/lib/in-app-browser';
import type { LibraryResource } from '@/types/domain';

const resourceIcons: Record<LibraryResource['icon'], keyof typeof Ionicons.glyphMap> = {
  search: 'search',
  database: 'library-outline',
  guides: 'book-outline',
  help: 'chatbubbles-outline',
  hours: 'time-outline',
};

export default function LibraryScreen() {
  const library = useQuery({
    queryKey: ['library-resources'],
    queryFn: getLibraryResources,
    placeholderData: DEMO_LIBRARY,
  });
  const data = library.data ?? DEMO_LIBRARY;

  return (
    <AppScaffold>
      <PageIntro
        eyebrow="Pugliese College Library"
        title="Find sources, spaces, and research support."
        body="Search the catalog, explore databases and guides, check library hours, or connect with a librarian."
      />

      <View style={styles.heroCard}>
        <View style={styles.heroIcon}>
          <Ionicons color={colors.white} name="library" size={28} />
        </View>
        <View style={styles.heroCopy}>
          <Text style={styles.heroTitle}>{data.name}</Text>
          <View style={styles.locationRow}>
            <Ionicons color="rgba(255,255,255,.78)" name="location-outline" size={14} />
            <Text style={styles.heroLocation}>{data.location}</Text>
          </View>
        </View>
        <ActionButton
          icon="open-outline"
          label="Open site"
          onPress={() => openInAppBrowser(data.website, data.name)}
          variant="secondary"
        />
      </View>

      <View style={styles.libraryCard}>
        <View style={styles.libraryCardHeader}>
          <Text style={styles.libraryCardLabel}>LIBRARY ID</Text>
          <Ionicons color={colors.maroon} name="barcode-outline" size={22} />
        </View>
        <SimpleBarcode value={data.libraryId} />
        <Text selectable style={styles.libraryId}>{data.libraryId}</Text>
      </View>

      <SectionTitle>Library resources</SectionTitle>
      <Surface>
        {data.resources.map((resource) => (
          <ListRow
            icon={resourceIcons[resource.icon]}
            key={resource.id}
            onPress={() => openInAppBrowser(resource.url, resource.title)}
            subtitle={resource.description}
            title={resource.title}
          />
        ))}
      </Surface>

      <View style={styles.officialNote}>
        <Ionicons color={colors.green} name="shield-checkmark" size={19} />
        <Text style={styles.officialText}>
          These links open official Pugliese College and CUNY library services.
        </Text>
      </View>
    </AppScaffold>
  );
}

function SimpleBarcode({ value }: { value: string }) {
  const bars = `101${value.split('').map((digit) => Number(digit).toString(2).padStart(4, '0')).join('01')}101`;

  return (
    <View accessibilityLabel={`Library ID barcode ${value}`} style={styles.barcode}>
      {bars.split('').map((bar, index) => (
        <View key={`${index}-${bar}`} style={[styles.barcodeBar, bar === '0' && styles.barcodeSpace]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    alignItems: 'center',
    backgroundColor: colors.maroon,
    borderRadius: radii.lg,
    flexDirection: 'row',
    gap: spacing.md,
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
  },
  heroIcon: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,.15)',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    width: 50,
  },
  heroCopy: { flex: 1 },
  heroTitle: { color: colors.white, fontFamily: fonts.uiBold, fontSize: 17 },
  locationRow: { alignItems: 'center', flexDirection: 'row', gap: 4, marginTop: 4 },
  heroLocation: { color: 'rgba(255,255,255,.78)', flex: 1, fontFamily: fonts.ui, fontSize: 12 },
  libraryCard: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.lg, borderWidth: 1, marginHorizontal: spacing.lg, marginTop: spacing.lg, padding: spacing.lg },
  libraryCardHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md },
  libraryCardLabel: { color: colors.maroon, fontFamily: fonts.uiBold, fontSize: 12, letterSpacing: 1.4 },
  barcode: { alignItems: 'stretch', flexDirection: 'row', height: 72, justifyContent: 'center', overflow: 'hidden', width: '100%' },
  barcodeBar: { backgroundColor: colors.ink, flex: 1, maxWidth: 4 },
  barcodeSpace: { backgroundColor: 'transparent' },
  libraryId: { color: colors.ink, fontFamily: fonts.uiBold, fontSize: 16, letterSpacing: 2.2, marginTop: spacing.sm, textAlign: 'center' },
  officialNote: {
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    padding: spacing.md,
  },
  officialText: { color: colors.inkMuted, flex: 1, fontFamily: fonts.ui, fontSize: 12, lineHeight: 17 },
});
