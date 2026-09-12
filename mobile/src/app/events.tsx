import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDeferredValue, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScaffold } from '@/components/app-scaffold';
import { EmptyState, PageIntro, Pill, SearchField, SectionTitle, Surface } from '@/components/ui';
import { colors, fonts, radii, spacing } from '@/constants/theme';
import { CAMPUS_EVENTS } from '@/data/demo';

const EVENT_CHOICES_KEY = 'pugliese-navigate.event-choices.v1';

type EventChoices = {
  registered: string[];
  reminders: string[];
};

function dateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function shiftDate(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export default function EventsScreen() {
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [query, setQuery] = useState('');
  const [choices, setChoices] = useState<EventChoices>({ registered: [], reminders: [] });
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  useEffect(() => {
    AsyncStorage.getItem(EVENT_CHOICES_KEY)
      .then((stored) => {
        if (stored) setChoices(JSON.parse(stored) as EventChoices);
      })
      .catch(() => undefined);
  }, []);

  function toggleChoice(kind: keyof EventChoices, eventId: string) {
    setChoices((current) => {
      const selected = current[kind].includes(eventId);
      const next = {
        ...current,
        [kind]: selected ? current[kind].filter((id) => id !== eventId) : [...current[kind], eventId],
      };
      void AsyncStorage.setItem(EVENT_CHOICES_KEY, JSON.stringify(next));
      return next;
    });
  }
  const events = CAMPUS_EVENTS.filter((event) => {
    const sameDay = event.date === dateKey(selectedDate);
    const matches = `${event.title} ${event.location} ${event.category}`.toLowerCase().includes(deferredQuery);
    return sameDay && matches;
  });

  const dateLabel = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(selectedDate);

  return (
    <AppScaffold>
      <PageIntro
        eyebrow="Campus calendar"
        title="Plan a day at Pugliese College."
        body="Browse the daily schedule, sign up for events, and set reminders for the ones you choose."
      />
      <View style={styles.dateNavigator}>
        <Pressable accessibilityLabel="Previous day" accessibilityRole="button" onPress={() => setSelectedDate(shiftDate(selectedDate, -1))} style={styles.dateButton}>
          <Ionicons color={colors.maroon} name="chevron-back" size={23} />
        </Pressable>
        <View style={styles.dateCopy}>
          <Text style={styles.dateLabel}>{dateLabel}</Text>
          <Text style={styles.eventCount}>{events.length} {events.length === 1 ? 'event' : 'events'}</Text>
        </View>
        <Pressable accessibilityLabel="Next day" accessibilityRole="button" onPress={() => setSelectedDate(shiftDate(selectedDate, 1))} style={styles.dateButton}>
          <Ionicons color={colors.maroon} name="chevron-forward" size={23} />
        </Pressable>
      </View>
      <View style={styles.searchGap} />
      <SearchField onChangeText={setQuery} placeholder="Search this day" value={query} />

      <SectionTitle>Schedule</SectionTitle>
      {events.length ? (
        <Surface>
          {events.map((event) => (
            <View key={event.id} style={styles.eventRow}>
              <View style={styles.timeline}>
                <View style={styles.timelineDot} />
                <View style={styles.timelineLine} />
              </View>
              <View style={styles.eventBody}>
                <View style={styles.eventTopline}>
                  <Pill tone="maroon">{event.category}</Pill>
                  <Text style={styles.eventTime}>{event.time}</Text>
                </View>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <View style={styles.locationRow}>
                  <Ionicons color={colors.inkMuted} name="location-outline" size={15} />
                  <Text style={styles.location}>{event.location}</Text>
                </View>
                <Text style={styles.description}>{event.description}</Text>
                <View style={styles.eventActions}>
                  <EventAction
                    active={choices.registered.includes(event.id)}
                    activeLabel="Signed up"
                    icon="checkmark-circle-outline"
                    label="Sign up"
                    onPress={() => toggleChoice('registered', event.id)}
                  />
                  <EventAction
                    active={choices.reminders.includes(event.id)}
                    activeLabel="Reminder set"
                    icon="notifications-outline"
                    label="Set reminder"
                    onPress={() => toggleChoice('reminders', event.id)}
                  />
                </View>
              </View>
            </View>
          ))}
        </Surface>
      ) : (
        <Surface>
          <EmptyState icon="calendar-outline" title="Nothing scheduled" body="Try another date or clear the search field." />
        </Surface>
      )}
    </AppScaffold>
  );
}

function EventAction({ active, activeLabel, icon, label, onPress }: { active: boolean; activeLabel: string; icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ pressed }) => [styles.eventAction, active && styles.eventActionActive, pressed && styles.eventActionPressed]}
    >
      <Ionicons color={active ? colors.white : colors.maroon} name={active ? 'checkmark' : icon} size={17} />
      <Text style={[styles.eventActionText, active && styles.eventActionTextActive]}>{active ? activeLabel : label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  dateNavigator: {
    alignItems: 'center',
    backgroundColor: colors.maroon,
    borderRadius: radii.lg,
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    padding: spacing.md,
  },
  dateButton: { alignItems: 'center', backgroundColor: colors.white, borderRadius: 22, height: 44, justifyContent: 'center', width: 44 },
  dateCopy: { alignItems: 'center', flex: 1, paddingHorizontal: spacing.sm },
  dateLabel: { color: colors.white, fontFamily: fonts.uiBold, fontSize: 17, textAlign: 'center' },
  eventCount: { color: 'rgba(255,255,255,.78)', fontFamily: fonts.ui, fontSize: 12, marginTop: 2 },
  searchGap: { height: spacing.md },
  eventRow: { flexDirection: 'row', paddingRight: spacing.lg, paddingTop: spacing.lg },
  timeline: { alignItems: 'center', width: 36 },
  timelineDot: { backgroundColor: colors.maroon, borderRadius: 6, height: 11, marginTop: 5, width: 11 },
  timelineLine: { backgroundColor: colors.border, flex: 1, marginTop: 4, width: 1 },
  eventBody: { borderBottomColor: colors.border, borderBottomWidth: StyleSheet.hairlineWidth, flex: 1, paddingBottom: spacing.lg },
  eventTopline: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  eventTime: { color: colors.inkMuted, fontFamily: fonts.uiMedium, fontSize: 12 },
  eventTitle: { color: colors.ink, fontFamily: fonts.uiBold, fontSize: 18, lineHeight: 22, marginTop: spacing.md },
  locationRow: { alignItems: 'center', flexDirection: 'row', gap: 3, marginTop: spacing.xs },
  location: { color: colors.inkMuted, fontFamily: fonts.uiMedium, fontSize: 13 },
  description: { color: colors.inkMuted, fontFamily: fonts.ui, fontSize: 14, lineHeight: 20, marginTop: spacing.sm },
  eventActions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md },
  eventAction: { alignItems: 'center', borderColor: colors.maroon, borderRadius: 18, borderWidth: 1, flexDirection: 'row', gap: 5, minHeight: 36, paddingHorizontal: spacing.md },
  eventActionActive: { backgroundColor: colors.maroon },
  eventActionPressed: { opacity: 0.72 },
  eventActionText: { color: colors.maroon, fontFamily: fonts.uiBold, fontSize: 12 },
  eventActionTextActive: { color: colors.white },
});
