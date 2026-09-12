import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScaffold } from '@/components/app-scaffold';
import { ActionButton, PageIntro, Pill, SectionTitle, SegmentedControl, Surface } from '@/components/ui';
import { colors, fonts, radii, spacing } from '@/constants/theme';
import { CAMPUS_EVENTS, CAREER_TASK_GROUPS } from '@/data/demo';
import { openInAppBrowser } from '@/lib/in-app-browser';
import { openMapDirections } from '@/lib/map-links';

type CareerTab = 'tasks' | 'events' | 'videos';

export default function CareerScreen() {
  const [tab, setTab] = useState<CareerTab>('tasks');
  const [credits, setCredits] = useState(30);
  const [expandedGroup, setExpandedGroup] = useState(CAREER_TASK_GROUPS[0]?.id ?? '');

  return (
    <AppScaffold>
      <PageIntro eyebrow="Career readiness" title="Build a career plan one useful step at a time." body="The legacy credits slider becomes a clearer milestone path with tasks, events, and learning resources." />
      <SegmentedControl
        onChange={setTab}
        options={[
          { label: 'Tasks', value: 'tasks' },
          { label: 'Events', value: 'events' },
          { label: 'Videos', value: 'videos' },
        ]}
        value={tab}
      />

      {tab === 'tasks' ? (
        <>
          <SectionTitle>Progress by credits</SectionTitle>
          <View style={styles.progressCard}>
            <View style={styles.creditHeader}>
              <Text style={styles.creditValue}>{credits}</Text>
              <Text style={styles.creditLabel}>credits completed</Text>
            </View>
            <View style={styles.track}>
              <View style={[styles.progress, { width: `${Math.min((credits / 120) * 100, 100)}%` }]} />
            </View>
            <View style={styles.milestones}>
              {[15, 30, 60, 90, 120].map((value) => (
                <Pressable accessibilityLabel={`${value} credits`} accessibilityRole="button" key={value} onPress={() => setCredits(value)} style={[styles.milestone, credits === value && styles.milestoneActive]}>
                  <Text style={[styles.milestoneLabel, credits === value && styles.milestoneLabelActive]}>{value}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <SectionTitle>Recommended actions</SectionTitle>
          <Surface>
            {CAREER_TASK_GROUPS.map((group) => {
              const open = group.id === expandedGroup;
              return (
                <View key={group.id}>
                  <Pressable accessibilityRole="button" accessibilityState={{ expanded: open }} onPress={() => setExpandedGroup(open ? '' : group.id)} style={styles.groupHeader}>
                    <View style={styles.groupNumber}>
                      <Text style={styles.groupNumberText}>{CAREER_TASK_GROUPS.indexOf(group) + 1}</Text>
                    </View>
                    <Text style={styles.groupTitle}>{group.title}</Text>
                    <Ionicons color={colors.maroon} name={open ? 'chevron-up' : 'chevron-down'} size={19} />
                  </Pressable>
                  {open ? (
                    <View style={styles.taskList}>
                      {group.tasks.map((task) => (
                        <View key={task} style={styles.taskRow}>
                          <Ionicons color={colors.green} name="ellipse-outline" size={17} />
                          <Text style={styles.taskText}>{task}</Text>
                        </View>
                      ))}
                    </View>
                  ) : null}
                </View>
              );
            })}
          </Surface>
        </>
      ) : null}

      {tab === 'events' ? (
        <>
          <SectionTitle>Career events</SectionTitle>
          <Surface>
            {CAMPUS_EVENTS.filter((event) => event.category === 'Career').map((event) => (
              <View key={event.id} style={styles.resourceRow}>
                <View style={styles.resourceIcon}><Ionicons color={colors.maroon} name="calendar" size={21} /></View>
                <View style={styles.resourceCopy}>
                  <Text style={styles.resourceTitle}>{event.title}</Text>
                  <Text style={styles.resourceBody}>{event.time} · {event.location}</Text>
                </View>
                <Pill tone="maroon">Demo</Pill>
              </View>
            ))}
          </Surface>
        </>
      ) : null}

      {tab === 'videos' ? (
        <>
          <SectionTitle>Career learning</SectionTitle>
          <Surface>
            {[
              ['Prepare for a career appointment', 'A practical checklist before meeting a counselor.'],
              ['Find events and employers', 'Learn how to organize an internship or job search.'],
              ['Build a stronger resume', 'Turn coursework and projects into evidence of skills.'],
            ].map(([title, body]) => (
              <View key={title} style={styles.resourceRow}>
                <View style={[styles.resourceIcon, { backgroundColor: colors.blueSoft }]}><Ionicons color={colors.blue} name="play" size={21} /></View>
                <View style={styles.resourceCopy}>
                  <Text style={styles.resourceTitle}>{title}</Text>
                  <Text style={styles.resourceBody}>{body}</Text>
                </View>
              </View>
            ))}
          </Surface>
        </>
      ) : null}

      <View style={styles.actions}>
        <ActionButton icon="briefcase" label="Open career resources" onPress={() => openInAppBrowser('https://students.pugliese.edu/', 'Career Resources')} />
        <ActionButton icon="navigate" label="Get Magner directions in Maps" onPress={() => void openMapDirections({ name: 'Magner Career Center', building: 'James Hall' })} variant="secondary" />
      </View>
    </AppScaffold>
  );
}

const styles = StyleSheet.create({
  progressCard: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.lg, borderWidth: 1, marginHorizontal: spacing.lg, padding: spacing.lg },
  creditHeader: { alignItems: 'baseline', flexDirection: 'row', gap: spacing.sm },
  creditValue: { color: colors.maroon, fontFamily: fonts.display, fontSize: 38, lineHeight: 40 },
  creditLabel: { color: colors.inkMuted, fontFamily: fonts.uiMedium, fontSize: 13 },
  track: { backgroundColor: colors.border, borderRadius: 4, height: 8, marginTop: spacing.md, overflow: 'hidden' },
  progress: { backgroundColor: colors.maroon, borderRadius: 4, height: '100%' },
  milestones: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.lg },
  milestone: { alignItems: 'center', backgroundColor: colors.cream, borderRadius: 17, height: 34, justifyContent: 'center', width: 42 },
  milestoneActive: { backgroundColor: colors.maroon },
  milestoneLabel: { color: colors.inkMuted, fontFamily: fonts.uiBold, fontSize: 12 },
  milestoneLabelActive: { color: colors.white },
  groupHeader: { alignItems: 'center', borderBottomColor: colors.border, borderBottomWidth: StyleSheet.hairlineWidth, flexDirection: 'row', gap: spacing.md, minHeight: 68, padding: spacing.lg },
  groupNumber: { alignItems: 'center', backgroundColor: colors.maroonSoft, borderRadius: 17, height: 34, justifyContent: 'center', width: 34 },
  groupNumberText: { color: colors.maroon, fontFamily: fonts.uiBold, fontSize: 13 },
  groupTitle: { color: colors.ink, flex: 1, fontFamily: fonts.uiBold, fontSize: 15, lineHeight: 19 },
  taskList: { backgroundColor: colors.cream, paddingBottom: spacing.md, paddingHorizontal: spacing.lg },
  taskRow: { alignItems: 'flex-start', flexDirection: 'row', gap: spacing.sm, paddingTop: spacing.md },
  taskText: { color: colors.ink, flex: 1, fontFamily: fonts.ui, fontSize: 14, lineHeight: 19 },
  resourceRow: { alignItems: 'center', borderBottomColor: colors.border, borderBottomWidth: StyleSheet.hairlineWidth, flexDirection: 'row', gap: spacing.md, padding: spacing.lg },
  resourceIcon: { alignItems: 'center', backgroundColor: colors.maroonSoft, borderRadius: 21, height: 42, justifyContent: 'center', width: 42 },
  resourceCopy: { flex: 1 },
  resourceTitle: { color: colors.ink, fontFamily: fonts.uiBold, fontSize: 15 },
  resourceBody: { color: colors.inkMuted, fontFamily: fonts.ui, fontSize: 13, lineHeight: 17, marginTop: 3 },
  actions: { gap: spacing.sm, marginHorizontal: spacing.lg, marginTop: spacing.xl },
});
