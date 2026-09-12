import { useQuery } from '@tanstack/react-query';
import { useDeferredValue, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { AppScaffold } from '@/components/app-scaffold';
import { ListRow, PageIntro, Pill, SearchField, SectionTitle, SegmentedControl, Surface } from '@/components/ui';
import { colors, fonts, radii, spacing } from '@/constants/theme';
import { DEMO_CATALOG } from '@/data/demo';
import { getCatalog } from '@/lib/api';
import type { Course } from '@/types/domain';

const terms = ['Fall 2026', 'Spring 2027', 'Summer 2027'] as const;
type Term = (typeof terms)[number];

function openCourse(course: Course) {
  const detail = course.detailData;
  Alert.alert(
    `${course.no} · ${course.ti}`,
    detail
      ? `${detail.credits} credits · Section ${detail.section}\n${detail.meet.times}\n${detail.meet.room}\n\n${detail.desc}`
      : `${course.mode ?? 'Section mode pending'} · ${course.seats ?? 'Seat count pending'} seats available.`,
  );
}

export default function CoursesScreen() {
  const catalog = useQuery({ queryKey: ['catalog'], queryFn: getCatalog, placeholderData: DEMO_CATALOG });
  const [query, setQuery] = useState('');
  const [term, setTerm] = useState<Term>('Fall 2026');
  const [onlineOnly, setOnlineOnly] = useState(false);
  const deferredQuery = useDeferredValue(query.toLowerCase().trim());
  const courses = (catalog.data?.courses ?? []).filter((course) => {
    const matchesQuery = `${course.no} ${course.ti}`.toLowerCase().includes(deferredQuery);
    const matchesMode = !onlineOnly || course.mode === 'Online';
    return matchesQuery && matchesMode;
  });

  return (
    <AppScaffold>
      <PageIntro
        eyebrow="Academic planning"
        title="Search the course catalog."
        body="Filter by term and delivery mode, then open a course for section details. Live schedule data can replace the typed demo adapter."
      />
      <SearchField onChangeText={setQuery} placeholder="Search course number or title" value={query} />

      <SectionTitle>Term</SectionTitle>
      <SegmentedControl
        onChange={setTerm}
        options={terms.map((value) => ({ label: value.replace('20', '’'), value }))}
        value={term}
      />

      <View style={styles.filterCard}>
        <View style={styles.filterCopy}>
          <Text style={styles.filterTitle}>Show online sections only</Text>
          <Text style={styles.filterBody}>Hide in-person and hybrid classes</Text>
        </View>
        <Switch
          accessibilityLabel="Show online sections only"
          ios_backgroundColor={colors.borderStrong}
          onValueChange={setOnlineOnly}
          thumbColor={colors.white}
          trackColor={{ false: colors.borderStrong, true: colors.maroon }}
          value={onlineOnly}
        />
      </View>

      <SectionTitle
        action={
          <View style={styles.resultMeta}>
            <Pill tone="maroon">{term}</Pill>
            <Text style={styles.count}>{courses.length} found</Text>
          </View>
        }
      >
        {catalog.data?.dept ?? 'Courses'}
      </SectionTitle>
      <Surface>
        {courses.map((course) => (
          <ListRow
            icon={course.mode === 'Online' ? 'laptop' : 'school'}
            key={course.no}
            meta={course.seats === undefined ? undefined : `${course.seats} seats`}
            onPress={() => openCourse(course)}
            subtitle={`${course.ti}${course.mode ? ` · ${course.mode}` : ''}`}
            title={course.no}
          />
        ))}
      </Surface>
      {courses.length === 0 ? <Text style={styles.empty}>No courses match these filters.</Text> : null}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.departmentStrip} contentContainerStyle={styles.departmentContent}>
        {['BIOL', 'ACCT', 'CISC', 'ENGL', 'MATH', 'PSYC'].map((department) => (
          <View key={department} style={[styles.departmentChip, department === 'BIOL' && styles.departmentChipActive]}>
            <Text style={[styles.departmentLabel, department === 'BIOL' && styles.departmentLabelActive]}>{department}</Text>
          </View>
        ))}
      </ScrollView>
    </AppScaffold>
  );
}

const styles = StyleSheet.create({
  filterCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    padding: spacing.lg,
  },
  filterCopy: { flex: 1 },
  filterTitle: { color: colors.ink, fontFamily: fonts.uiBold, fontSize: 15 },
  filterBody: { color: colors.inkMuted, fontFamily: fonts.ui, fontSize: 13, marginTop: 2 },
  resultMeta: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  count: { color: colors.inkMuted, fontFamily: fonts.uiMedium, fontSize: 12 },
  empty: { color: colors.inkMuted, fontFamily: fonts.ui, padding: spacing.xl, textAlign: 'center' },
  departmentStrip: { marginTop: spacing.xl },
  departmentContent: { gap: spacing.sm, paddingHorizontal: spacing.lg },
  departmentChip: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.round, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 8 },
  departmentChipActive: { backgroundColor: colors.maroon, borderColor: colors.maroon },
  departmentLabel: { color: colors.inkMuted, fontFamily: fonts.uiBold, fontSize: 12 },
  departmentLabelActive: { color: colors.white },
});
