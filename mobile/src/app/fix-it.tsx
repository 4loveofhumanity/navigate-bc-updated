import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppScaffold } from '@/components/app-scaffold';
import { ActionButton, PageIntro, SectionTitle } from '@/components/ui';
import { colors, fonts, radii, spacing } from '@/constants/theme';

const categories = [
  { id: 'technology', label: 'Technology', icon: 'desktop' as const },
  { id: 'facility', label: 'Facility', icon: 'business' as const },
  { id: 'accessibility', label: 'Accessibility', icon: 'accessibility' as const },
  { id: 'other', label: 'Other', icon: 'ellipsis-horizontal' as const },
];

export default function FixItScreen() {
  const [category, setCategory] = useState('technology');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [reference, setReference] = useState<string | null>(null);

  function submitDemoReport() {
    if (!location.trim() || description.trim().length < 10) {
      Alert.alert('Add more detail', 'Enter a campus location and a description of at least 10 characters.');
      return;
    }

    const id = `DEMO-${String(Date.now()).slice(-6)}`;
    setReference(id);
    setLocation('');
    setDescription('');
  }

  return (
    <AppScaffold>
      <PageIntro eyebrow="Issue intake" title="Report the problem once, with the details teams need." body="This functional form validates input locally. It does not transmit reports until an approved ticketing API is connected." />

      {reference ? (
        <View style={styles.success}>
          <Ionicons color={colors.green} name="checkmark-circle" size={28} />
          <View style={styles.successCopy}>
            <Text style={styles.successTitle}>Demo report prepared</Text>
            <Text style={styles.successBody}>Reference {reference}. Nothing was sent outside this device.</Text>
          </View>
          <Pressable accessibilityLabel="Dismiss confirmation" accessibilityRole="button" onPress={() => setReference(null)}>
            <Ionicons color={colors.inkMuted} name="close" size={20} />
          </Pressable>
        </View>
      ) : null}

      <SectionTitle>Issue type</SectionTitle>
      <View style={styles.categoryGrid}>
        {categories.map((item) => {
          const active = category === item.id;
          return (
            <Pressable accessibilityRole="button" accessibilityState={{ selected: active }} key={item.id} onPress={() => setCategory(item.id)} style={[styles.category, active && styles.categoryActive]}>
              <Ionicons color={active ? colors.white : colors.maroon} name={item.icon} size={22} />
              <Text style={[styles.categoryLabel, active && styles.categoryLabelActive]}>{item.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <SectionTitle>Location</SectionTitle>
      <TextInput
        onChangeText={setLocation}
        placeholder="Building and room, for example 1303 James Hall"
        placeholderTextColor={colors.inkMuted}
        style={styles.input}
        value={location}
      />

      <SectionTitle>What happened?</SectionTitle>
      <TextInput
        multiline
        onChangeText={setDescription}
        placeholder="Describe the issue, when it started, and how it affects you. Do not include passwords or private student data."
        placeholderTextColor={colors.inkMuted}
        style={[styles.input, styles.textArea]}
        textAlignVertical="top"
        value={description}
      />

      <View style={styles.submitArea}>
        <ActionButton icon="paper-plane" label="Prepare demo report" onPress={submitDemoReport} />
        <View style={styles.safetyNote}>
          <Ionicons color={colors.red} name="warning" size={17} />
          <Text style={styles.safetyText}>Do not use this form for emergencies. Use the Emergency action below or call 911.</Text>
        </View>
      </View>
    </AppScaffold>
  );
}

const styles = StyleSheet.create({
  success: { alignItems: 'flex-start', backgroundColor: colors.greenSoft, borderColor: '#B8DEC9', borderRadius: radii.md, borderWidth: 1, flexDirection: 'row', gap: spacing.md, marginHorizontal: spacing.lg, padding: spacing.lg },
  successCopy: { flex: 1 },
  successTitle: { color: colors.green, fontFamily: fonts.uiBold, fontSize: 15 },
  successBody: { color: colors.ink, fontFamily: fonts.ui, fontSize: 13, lineHeight: 18, marginTop: 3 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, paddingHorizontal: spacing.lg },
  category: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.md, borderWidth: 1, flexBasis: '47%', flexDirection: 'row', flexGrow: 1, gap: spacing.sm, minHeight: 54, paddingHorizontal: spacing.md },
  categoryActive: { backgroundColor: colors.maroon, borderColor: colors.maroon },
  categoryLabel: { color: colors.ink, fontFamily: fonts.uiBold, fontSize: 14 },
  categoryLabelActive: { color: colors.white },
  input: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.md, borderWidth: 1, color: colors.ink, fontFamily: fonts.ui, fontSize: 15, marginHorizontal: spacing.lg, minHeight: 50, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  textArea: { minHeight: 150 },
  submitArea: { gap: spacing.lg, marginHorizontal: spacing.lg, marginTop: spacing.xl },
  safetyNote: { alignItems: 'flex-start', flexDirection: 'row', gap: spacing.sm },
  safetyText: { color: colors.inkMuted, flex: 1, fontFamily: fonts.ui, fontSize: 12, lineHeight: 17 },
});
