import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppScaffold } from '@/components/app-scaffold';
import { ActionButton, PageIntro, Pill, SectionTitle, SegmentedControl, Surface } from '@/components/ui';
import { colors, fonts, radii, spacing } from '@/constants/theme';
import { OFFICIAL_ACADEMIC_CALENDAR } from '@/data/academic-calendar';
import { getAcademicCalendar } from '@/lib/api';
import { openInAppBrowser } from '@/lib/in-app-browser';
import type { AcademicEntry, AcademicEntryKind } from '@/types/domain';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const KIND_META: Record<AcademicEntryKind, { label: string; tone: 'neutral' | 'success' | 'warning' | 'danger' | 'maroon' }> = {
  classes: { label: 'Classes', tone: 'maroon' },
  deadline: { label: 'Deadline', tone: 'warning' },
  closed: { label: 'No Classes', tone: 'neutral' },
  exams: { label: 'Exams', tone: 'danger' },
  registration: { label: 'Registration', tone: 'success' },
};

function parseDay(iso: string) {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function daysBetween(from: Date, to: Date) {
  return Math.round((to.getTime() - from.getTime()) / 86_400_000);
}

function chipLabel(entry: AcademicEntry) {
  const start = parseDay(entry.date);
  const startText = `${MONTHS[start.getMonth()]} ${start.getDate()}`;
  if (!entry.endDate) return startText;
  const end = parseDay(entry.endDate);
  if (end.getMonth() === start.getMonth()) return `${startText}\u2013${end.getDate()}`;
  return `${startText} \u2013 ${MONTHS[end.getMonth()]} ${end.getDate()}`;
}

function countdownLabel(days: number) {
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  return `in ${days} days`;
}

function verifiedLabel(iso: string) {
  return parseDay(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function AcademicCalendarScreen() {
  const calendarQuery = useQuery({
    queryKey: ['academic-calendar'],
    queryFn: getAcademicCalendar,
    placeholderData: OFFICIAL_ACADEMIC_CALENDAR,
  });
  const calendar = calendarQuery.data ?? OFFICIAL_ACADEMIC_CALENDAR;
  const terms = calendar.terms.length ? calendar.terms : OFFICIAL_ACADEMIC_CALENDAR.terms;
  const today = useMemo(() => startOfToday(), []);

  const nextUp = useMemo(() => {
    let best: { entry: AcademicEntry; termName: string; termId: string; days: number } | null = null;
    for (const term of terms) {
      for (const entry of term.entries) {
        const end = parseDay(entry.endDate ?? entry.date);
        if (daysBetween(today, end) < 0) continue;
        const days = Math.max(0, daysBetween(today, parseDay(entry.date)));
        if (!best || days < best.days) best = { entry, termName: term.name, termId: term.id, days };
      }
    }
    return best;
  }, [terms, today]);

  const [chosenTermId, setChosenTermId] = useState<string | null>(null);
  const termId = chosenTermId && terms.some((item) => item.id === chosenTermId)
    ? chosenTermId
    : (nextUp?.termId ?? terms[0].id);
  const term = terms.find((item) => item.id === termId) ?? terms[0];
  const options = terms.map((item) => ({
    label: item.name.replace(' 20', " '"),
    value: item.id,
  }));

  return (
    <AppScaffold>
      <PageIntro
        eyebrow="Registrar"
        title="Academic calendar."
        body="Official registration, refund, add/drop, closure, and examination dates synchronized from the Brooklyn College Registrar."
      />

      {nextUp ? (
        <View style={styles.banner}>
          <View style={styles.bannerIcon}>
            <Ionicons color={colors.white} name="calendar-clear-outline" size={22} />
          </View>
          <View style={styles.bannerBody}>
            <Text style={styles.bannerEyebrow}>Next up {'\u2022'} {nextUp.termName}</Text>
            <Text style={styles.bannerTitle}>{nextUp.entry.label}</Text>
            <Text style={styles.bannerMeta}>
              {nextUp.entry.priority === 'high' ? 'Priority deadline \u2022 ' : ''}
              {chipLabel(nextUp.entry)} {'\u2022'} {countdownLabel(nextUp.days)}
            </Text>
          </View>
        </View>
      ) : null}

      <View style={styles.segmentGap} />
      <SegmentedControl onChange={setChosenTermId} options={options} value={termId} />

      <SectionTitle action={<Text style={styles.termSpan}>{term.span}</Text>}>
        {term.name}
      </SectionTitle>

      <Surface>
        {term.entries.map((entry) => {
          const end = parseDay(entry.endDate ?? entry.date);
          const past = daysBetween(today, end) < 0;
          const isNext = nextUp?.entry.id === entry.id;
          const meta = KIND_META[entry.kind];
          return (
            <View key={entry.id} style={[styles.row, isNext && styles.rowActive]}>
              <View style={[styles.chip, past && styles.chipPast]}>
                <Text style={[styles.chipText, past && styles.chipTextPast]}>{chipLabel(entry)}</Text>
              </View>
              <View style={styles.rowBody}>
                <Text style={[styles.rowLabel, past && styles.rowLabelPast]}>{entry.label}</Text>
                <View style={styles.rowMetaLine}>
                  {entry.priority === 'high' ? <Pill tone="danger">Priority</Pill> : null}
                  <Pill tone={meta.tone}>{meta.label}</Pill>
                  {isNext ? <Text style={styles.nextTag}>Next</Text> : null}
                </View>
              </View>
            </View>
          );
        })}
      </Surface>

      <View style={styles.sourceNote}>
        <Ionicons color={colors.green} name="shield-checkmark" size={19} />
        <View style={styles.sourceCopy}>
          <Text style={styles.sourceTitle}>{calendar.source.name}</Text>
          <Text style={styles.sourceBody}>
            Verified {verifiedLabel(calendar.source.verifiedOn)}. {calendar.source.notice}
          </Text>
        </View>
      </View>

      <View style={styles.sourceAction}>
        <ActionButton
          icon="open-outline"
          label="Open official calendar"
          onPress={() => openInAppBrowser(calendar.source.url, 'Academic Calendar Source')}
          variant="secondary"
        />
      </View>
    </AppScaffold>
  );
}

const styles = StyleSheet.create({
  banner: {
    alignItems: 'center',
    backgroundColor: colors.maroon,
    borderRadius: radii.lg,
    flexDirection: 'row',
    gap: spacing.md,
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
  },
  bannerIcon: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,.16)',
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  bannerBody: { flex: 1 },
  bannerEyebrow: { color: 'rgba(255,255,255,.82)', fontFamily: fonts.uiBold, fontSize: 11, letterSpacing: 0.8, textTransform: 'uppercase' },
  bannerTitle: { color: colors.white, fontFamily: fonts.uiBold, fontSize: 17, lineHeight: 21, marginTop: 3 },
  bannerMeta: { color: 'rgba(255,255,255,.88)', fontFamily: fonts.uiMedium, fontSize: 13, marginTop: 4 },
  segmentGap: { height: spacing.lg },
  termSpan: { color: colors.inkMuted, fontFamily: fonts.uiMedium, fontSize: 12 },
  row: {
    alignItems: 'center',
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  rowActive: { backgroundColor: colors.maroonSoft },
  chip: {
    alignItems: 'center',
    backgroundColor: colors.maroonSoft,
    borderRadius: radii.sm,
    justifyContent: 'center',
    minWidth: 72,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  chipPast: { backgroundColor: colors.cream },
  chipText: { color: colors.maroon, fontFamily: fonts.uiBold, fontSize: 13, textAlign: 'center' },
  chipTextPast: { color: colors.borderStrong },
  rowBody: { flex: 1 },
  rowLabel: { color: colors.ink, fontFamily: fonts.uiMedium, fontSize: 15, lineHeight: 20 },
  rowLabelPast: { color: colors.inkMuted },
  rowMetaLine: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  nextTag: { color: colors.maroon, fontFamily: fonts.uiBold, fontSize: 11, letterSpacing: 0.6, textTransform: 'uppercase' },
  sourceNote: {
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
  sourceCopy: { flex: 1 },
  sourceTitle: { color: colors.ink, fontFamily: fonts.uiBold, fontSize: 13 },
  sourceBody: { color: colors.inkMuted, fontFamily: fonts.ui, fontSize: 12, lineHeight: 17, marginTop: 2 },
  sourceAction: { marginHorizontal: spacing.lg, marginTop: spacing.md },
});
