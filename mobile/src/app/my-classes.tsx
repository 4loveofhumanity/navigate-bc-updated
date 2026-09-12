import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { useMemo, useRef, useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppScaffold } from '@/components/app-scaffold';
import { PageIntro, Pill, SectionTitle } from '@/components/ui';
import { colors, fonts, radii, shadows, spacing } from '@/constants/theme';

type Assignment = { title: string; due: string; status: 'Due soon' | 'Upcoming' | 'Submitted' };
type ClassRoom = {
  id: string;
  code: string;
  title: string;
  professor: string;
  email: string;
  schedule: string;
  room: string;
  accent: string;
  assignments: Assignment[];
};
type Message = { id: number; author: string; body: string; time: string; mine?: boolean };

const CLASSES: ClassRoom[] = [
  {
    id: 'cisc-3115', code: 'CISC 3115', title: 'Introduction to Modern Programming Techniques',
    professor: 'Prof. Maya Chen', email: 'maya.chen@pugliese.cuny.edu', schedule: 'Mon / Wed · 2:15 PM', room: 'Ingersoll 1127', accent: colors.maroon,
    assignments: [
      { title: 'Problem Set 3: Recursion', due: 'Due tomorrow · 11:59 PM', status: 'Due soon' },
      { title: 'Lab 4: Collections', due: 'Due Sep 28', status: 'Upcoming' },
    ],
  },
  {
    id: 'engl-1012', code: 'ENGL 1012', title: 'English Composition II',
    professor: 'Prof. Daniel Rivera', email: 'daniel.rivera@pugliese.cuny.edu', schedule: 'Tue / Thu · 10:50 AM', room: 'Boylan 2143', accent: colors.blue,
    assignments: [
      { title: 'Research proposal', due: 'Due Sep 26 · 5:00 PM', status: 'Upcoming' },
      { title: 'Reading response 2', due: 'Submitted Sep 18', status: 'Submitted' },
    ],
  },
  {
    id: 'math-1201', code: 'MATH 1201', title: 'Calculus I',
    professor: 'Prof. Aisha Patel', email: 'aisha.patel@pugliese.cuny.edu', schedule: 'Mon / Wed · 12:50 PM', room: 'James 2204', accent: colors.green,
    assignments: [{ title: 'WebWork 5: Derivatives', due: 'Due Sep 29 · 11:59 PM', status: 'Upcoming' }],
  },
];

const INITIAL_MESSAGES: Record<string, Message[]> = {
  'cisc-3115': [
    { id: 1, author: 'Jordan M.', body: 'Does anyone want to review recursion after class?', time: '10:24 AM' },
    { id: 2, author: 'You', body: 'I can meet in the library around 4.', time: '10:31 AM', mine: true },
  ],
  'engl-1012': [{ id: 1, author: 'Sam K.', body: 'I shared the citation guide from today.', time: 'Yesterday' }],
  'math-1201': [{ id: 1, author: 'Leah A.', body: 'Study group is in the library cafe at 3.', time: '9:12 AM' }],
};

export default function MyClassesScreen() {
  const [selectedId, setSelectedId] = useState(CLASSES[0].id);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [draft, setDraft] = useState('');
  const [sharedFiles, setSharedFiles] = useState<Record<string, string[]>>({});
  const nextMessageId = useRef(10);
  const selected = useMemo(() => CLASSES.find((item) => item.id === selectedId) ?? CLASSES[0], [selectedId]);

  const sendMessage = () => {
    const body = draft.trim();
    if (!body) return;
    const message: Message = { id: nextMessageId.current++, author: 'You', body, time: 'Now', mine: true };
    setMessages((current) => ({ ...current, [selected.id]: [...(current[selected.id] ?? []), message] }));
    setDraft('');
  };

  const emailProfessor = async () => {
    const subject = encodeURIComponent(`${selected.code} student question`);
    const url = `mailto:${selected.email}?subject=${subject}`;
    if (await Linking.canOpenURL(url)) await Linking.openURL(url);
    else Alert.alert('Email professor', selected.email);
  };

  const shareDocument = () => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const input = document.createElement('input');
      input.type = 'file';
      input.onchange = () => {
        const name = input.files?.[0]?.name;
        if (!name) return;
        setSharedFiles((current) => ({ ...current, [selected.id]: [...(current[selected.id] ?? []), name] }));
      };
      input.click();
      return;
    }
    Alert.alert('Share a document', 'Device file sharing will be available when the authenticated class service is connected.');
  };

  return (
    <AppScaffold>
      <PageIntro eyebrow="Student workspace" title="My Classes" body="Your classes, assigned work, classmates, and professor contact in one place. Demo class data is shown." />

      <View style={styles.classStrip}>
        {CLASSES.map((item) => {
          const active = item.id === selected.id;
          return (
            <Pressable key={item.id} onPress={() => setSelectedId(item.id)} style={[styles.classTab, active && { backgroundColor: item.accent, borderColor: item.accent }]}>
              <Text style={[styles.classCode, active && styles.classCodeActive]}>{item.code}</Text>
              <Text numberOfLines={1} style={[styles.className, active && styles.classNameActive]}>{item.title}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.heroCard}>
        <View style={[styles.accent, { backgroundColor: selected.accent }]} />
        <Text style={styles.heroCode}>{selected.code}</Text>
        <Text style={styles.heroTitle}>{selected.title}</Text>
        <View style={styles.metaRow}><Ionicons color={colors.inkMuted} name="time-outline" size={16} /><Text style={styles.meta}>{selected.schedule}</Text></View>
        <View style={styles.metaRow}><Ionicons color={colors.inkMuted} name="location-outline" size={16} /><Text style={styles.meta}>{selected.room}</Text></View>
        <Pressable onPress={emailProfessor} style={styles.professorButton}>
          <View style={styles.professorIcon}><Ionicons color={colors.maroon} name="person" size={18} /></View>
          <View style={styles.professorCopy}><Text style={styles.professorLabel}>Professor</Text><Text style={styles.professorName}>{selected.professor}</Text></View>
          <Ionicons color={colors.maroon} name="mail-outline" size={21} />
        </Pressable>
      </View>

      <SectionTitle action={<Pill tone="maroon">{selected.assignments.length} items</Pill>}>Assigned work</SectionTitle>
      <View style={styles.surface}>
        {selected.assignments.map((assignment) => (
          <View key={assignment.title} style={styles.assignment}>
            <View style={styles.assignmentIcon}><Ionicons color={colors.maroon} name={assignment.status === 'Submitted' ? 'checkmark-circle' : 'document-text-outline'} size={20} /></View>
            <View style={styles.assignmentCopy}><Text style={styles.assignmentTitle}>{assignment.title}</Text><Text style={styles.assignmentDue}>{assignment.due}</Text></View>
            <Pill tone={assignment.status === 'Submitted' ? 'success' : assignment.status === 'Due soon' ? 'warning' : 'neutral'}>{assignment.status}</Pill>
          </View>
        ))}
      </View>

      <SectionTitle action={<Pill tone="success">Class only</Pill>}>{selected.code} chat</SectionTitle>
      <View style={styles.chatCard}>
        <View style={styles.chatNotice}><Ionicons color={colors.green} name="shield-checkmark-outline" size={16} /><Text style={styles.chatNoticeText}>Dedicated space for students enrolled in this class</Text></View>
        {(messages[selected.id] ?? []).map((message) => (
          <View key={message.id} style={[styles.messageRow, message.mine && styles.messageRowMine]}>
            <View style={[styles.bubble, message.mine && styles.bubbleMine]}>
              {!message.mine ? <Text style={styles.messageAuthor}>{message.author}</Text> : null}
              <Text style={[styles.messageBody, message.mine && styles.messageBodyMine]}>{message.body}</Text>
              <Text style={[styles.messageTime, message.mine && styles.messageTimeMine]}>{message.time}</Text>
            </View>
          </View>
        ))}
        {(sharedFiles[selected.id] ?? []).map((file) => (
          <View key={file} style={styles.fileRow}><Ionicons color={colors.blue} name="document-attach-outline" size={19} /><View style={styles.fileCopy}><Text numberOfLines={1} style={styles.fileName}>{file}</Text><Text style={styles.fileMeta}>Shared by you · Just now</Text></View></View>
        ))}
        <View style={styles.composer}>
          <Pressable accessibilityLabel="Share document" onPress={shareDocument} style={styles.attachButton}><Ionicons color={colors.maroon} name="attach" size={22} /></Pressable>
          <TextInput multiline onChangeText={setDraft} onSubmitEditing={sendMessage} placeholder={`Message ${selected.code}`} placeholderTextColor={colors.inkMuted} style={styles.input} value={draft} />
          <Pressable accessibilityLabel="Send message" disabled={!draft.trim()} onPress={sendMessage} style={[styles.sendButton, !draft.trim() && styles.sendDisabled]}><Ionicons color={colors.white} name="arrow-up" size={19} /></Pressable>
        </View>
        <Text style={styles.shareHint}>Use the paperclip to share a document with this class.</Text>
      </View>
    </AppScaffold>
  );
}

const styles = StyleSheet.create({
  classStrip: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.lg },
  classTab: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.md, borderWidth: 1, flex: 1, minWidth: 0, padding: spacing.md },
  classCode: { color: colors.maroon, fontFamily: fonts.uiBold, fontSize: 13 },
  classCodeActive: { color: colors.white },
  className: { color: colors.inkMuted, fontFamily: fonts.ui, fontSize: 10, marginTop: 3 },
  classNameActive: { color: 'rgba(255,255,255,.82)' },
  heroCard: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.lg, borderWidth: 1, marginHorizontal: spacing.lg, marginTop: spacing.lg, overflow: 'hidden', padding: spacing.lg, ...shadows.card },
  accent: { height: 5, left: 0, position: 'absolute', right: 0, top: 0 },
  heroCode: { color: colors.maroon, fontFamily: fonts.uiBold, fontSize: 12, letterSpacing: 1.2, marginTop: spacing.xs },
  heroTitle: { color: colors.ink, fontFamily: fonts.display, fontSize: 25, lineHeight: 28, marginBottom: spacing.md, marginTop: spacing.xs },
  metaRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs },
  meta: { color: colors.inkMuted, fontFamily: fonts.ui, fontSize: 13 },
  professorButton: { alignItems: 'center', backgroundColor: colors.maroonSoft, borderRadius: radii.md, flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg, padding: spacing.md },
  professorIcon: { alignItems: 'center', backgroundColor: colors.white, borderRadius: 18, height: 36, justifyContent: 'center', width: 36 },
  professorCopy: { flex: 1 }, professorLabel: { color: colors.inkMuted, fontFamily: fonts.ui, fontSize: 10, textTransform: 'uppercase' }, professorName: { color: colors.ink, fontFamily: fonts.uiBold, fontSize: 14 },
  surface: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.lg, borderWidth: 1, marginHorizontal: spacing.lg, overflow: 'hidden', ...shadows.card },
  assignment: { alignItems: 'center', borderBottomColor: colors.border, borderBottomWidth: StyleSheet.hairlineWidth, flexDirection: 'row', gap: spacing.md, minHeight: 76, padding: spacing.md },
  assignmentIcon: { alignItems: 'center', backgroundColor: colors.maroonSoft, borderRadius: radii.sm, height: 38, justifyContent: 'center', width: 38 },
  assignmentCopy: { flex: 1 }, assignmentTitle: { color: colors.ink, fontFamily: fonts.uiBold, fontSize: 14, lineHeight: 18 }, assignmentDue: { color: colors.inkMuted, fontFamily: fonts.ui, fontSize: 12, marginTop: 3 },
  chatCard: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.lg, borderWidth: 1, marginHorizontal: spacing.lg, overflow: 'hidden', padding: spacing.md, ...shadows.card },
  chatNotice: { alignItems: 'center', backgroundColor: colors.greenSoft, borderRadius: radii.sm, flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg, padding: spacing.sm },
  chatNoticeText: { color: colors.green, flex: 1, fontFamily: fonts.uiMedium, fontSize: 11 },
  messageRow: { alignItems: 'flex-start', marginBottom: spacing.sm }, messageRowMine: { alignItems: 'flex-end' },
  bubble: { backgroundColor: colors.cream, borderRadius: 15, borderBottomLeftRadius: 4, maxWidth: '82%', paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  bubbleMine: { backgroundColor: colors.maroon, borderBottomLeftRadius: 15, borderBottomRightRadius: 4 },
  messageAuthor: { color: colors.maroon, fontFamily: fonts.uiBold, fontSize: 11, marginBottom: 2 }, messageBody: { color: colors.ink, fontFamily: fonts.ui, fontSize: 14, lineHeight: 19 }, messageBodyMine: { color: colors.white },
  messageTime: { color: colors.inkMuted, fontFamily: fonts.ui, fontSize: 9, marginTop: 3 }, messageTimeMine: { color: 'rgba(255,255,255,.7)', textAlign: 'right' },
  fileRow: { alignItems: 'center', backgroundColor: colors.blueSoft, borderRadius: radii.sm, flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm, padding: spacing.md }, fileCopy: { flex: 1 }, fileName: { color: colors.blue, fontFamily: fonts.uiBold, fontSize: 13 }, fileMeta: { color: colors.inkMuted, fontFamily: fonts.ui, fontSize: 10, marginTop: 2 },
  composer: { alignItems: 'flex-end', borderColor: colors.border, borderRadius: radii.md, borderWidth: 1, flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md, padding: 6 },
  attachButton: { alignItems: 'center', height: 38, justifyContent: 'center', width: 38 }, input: { color: colors.ink, flex: 1, fontFamily: fonts.ui, fontSize: 14, maxHeight: 100, minHeight: 38, paddingHorizontal: spacing.xs, paddingVertical: 8 },
  sendButton: { alignItems: 'center', backgroundColor: colors.maroon, borderRadius: 19, height: 38, justifyContent: 'center', width: 38 }, sendDisabled: { opacity: 0.35 }, shareHint: { color: colors.inkMuted, fontFamily: fonts.ui, fontSize: 10, marginTop: spacing.sm, textAlign: 'center' },
});
