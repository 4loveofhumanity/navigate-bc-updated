import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppScaffold } from '@/components/app-scaffold';
import { EmptyState } from '@/components/ui';
import { colors, fonts, radii, spacing } from '@/constants/theme';
import { useSocial, type Message } from '@/context/social-context';

function timeLabel(ts: number) {
  return new Date(ts).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export default function MessagesScreen() {
  const params = useLocalSearchParams<{ friend?: string }>();
  const { friends, conversations, sendMessage } = useSocial();
  const [active, setActive] = useState<string | null>(params.friend ?? null);
  const [draft, setDraft] = useState('');

  // Open the thread named by the `friend` route param, and re-sync when it
  // changes (e.g. navigating from Connect to a specific classmate).
  const [seenParam, setSeenParam] = useState(params.friend);
  if (params.friend !== seenParam) {
    setSeenParam(params.friend);
    if (params.friend) setActive(params.friend);
  }

  const activeFriend = friends.find((f) => f.id === active) ?? null;

  if (activeFriend) {
    const thread = conversations[activeFriend.id] ?? [];
    return (
      <AppScaffold beforeRail={<Composer onSend={(text) => sendMessage(activeFriend.id, text)} value={draft} onChange={setDraft} />}>
        <View style={styles.chatHeader}>
          <Pressable accessibilityLabel="Back to conversations" accessibilityRole="button" hitSlop={10} onPress={() => setActive(null)} style={styles.backButton}>
            <Ionicons color={colors.maroon} name="chevron-back" size={24} />
          </Pressable>
          <View style={[styles.headerAvatar, { backgroundColor: activeFriend.accent }]}>
            <Text style={styles.headerAvatarText}>{activeFriend.name.charAt(0)}</Text>
          </View>
          <View style={styles.headerCopy}>
            <Text style={styles.headerName}>{activeFriend.name}</Text>
            <Text style={styles.headerCode}>{activeFriend.code} · on campus</Text>
          </View>
        </View>

        <View style={styles.thread}>
          {thread.length === 0 ? (
            <Text style={styles.threadEmpty}>Say hi to {activeFriend.name} 👋</Text>
          ) : (
            thread.map((message) => <Bubble key={message.id} message={message} />)
          )}
        </View>
      </AppScaffold>
    );
  }

  return (
    <AppScaffold>
      <View style={styles.listIntro}>
        <Text style={styles.listTitle}>Messages</Text>
        <Text style={styles.listSubtitle}>Text classmates you&apos;ve added.</Text>
      </View>

      {friends.length === 0 ? (
        <EmptyState body="Add classmates from Connect, then message them here." icon="chatbubbles-outline" title="No conversations yet" />
      ) : (
        <View style={styles.list}>
          {friends.map((friend) => {
            const thread = conversations[friend.id] ?? [];
            const last = thread[thread.length - 1];
            return (
              <Pressable
                accessibilityLabel={`Open chat with ${friend.name}`}
                accessibilityRole="button"
                key={friend.id}
                onPress={() => setActive(friend.id)}
                style={({ pressed }) => [styles.listRow, pressed && styles.listRowPressed]}
              >
                <View style={[styles.listAvatar, { backgroundColor: friend.accent }]}>
                  <Text style={styles.listAvatarText}>{friend.name.charAt(0)}</Text>
                </View>
                <View style={styles.listCopy}>
                  <Text style={styles.listName}>{friend.name}</Text>
                  <Text numberOfLines={1} style={styles.listPreview}>
                    {last ? `${last.fromMe ? 'You: ' : ''}${last.text}` : 'Tap to start chatting'}
                  </Text>
                </View>
                {last ? <Text style={styles.listTime}>{timeLabel(last.ts)}</Text> : null}
              </Pressable>
            );
          })}
        </View>
      )}
    </AppScaffold>
  );
}

function Bubble({ message }: { message: Message }) {
  return (
    <View style={[styles.bubbleRow, message.fromMe ? styles.bubbleRowMe : styles.bubbleRowThem]}>
      <View style={[styles.bubble, message.fromMe ? styles.bubbleMe : styles.bubbleThem]}>
        <Text style={[styles.bubbleText, message.fromMe && styles.bubbleTextMe]}>{message.text}</Text>
        <Text style={[styles.bubbleTime, message.fromMe && styles.bubbleTimeMe]}>{timeLabel(message.ts)}</Text>
      </View>
    </View>
  );
}

function Composer({ value, onChange, onSend }: { value: string; onChange: (v: string) => void; onSend: (text: string) => void }) {
  function submit() {
    if (!value.trim()) return;
    onSend(value);
    onChange('');
  }
  return (
    <View style={styles.composer}>
      <TextInput
        accessibilityLabel="Message"
        multiline
        onChangeText={onChange}
        placeholder="Message…"
        placeholderTextColor={colors.inkMuted}
        style={styles.composerInput}
        value={value}
        onSubmitEditing={submit}
        returnKeyType="send"
      />
      <Pressable
        accessibilityLabel="Send message"
        accessibilityRole="button"
        disabled={!value.trim()}
        onPress={submit}
        style={({ pressed }) => [styles.sendButton, !value.trim() && styles.sendButtonDisabled, pressed && styles.sendButtonPressed]}
      >
        <Ionicons color={colors.white} name="arrow-up" size={20} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  listIntro: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md, paddingTop: spacing.xl },
  listTitle: { color: colors.ink, fontFamily: fonts.display, fontSize: 32 },
  listSubtitle: { color: colors.inkMuted, fontFamily: fonts.ui, fontSize: 14, marginTop: 2 },
  list: { paddingHorizontal: spacing.sm },
  listRow: { alignItems: 'center', borderRadius: radii.md, flexDirection: 'row', gap: spacing.md, paddingHorizontal: spacing.md, paddingVertical: spacing.md },
  listRowPressed: { backgroundColor: colors.cream },
  listAvatar: { alignItems: 'center', borderRadius: 24, height: 48, justifyContent: 'center', width: 48 },
  listAvatarText: { color: colors.white, fontFamily: fonts.uiBold, fontSize: 19 },
  listCopy: { flex: 1 },
  listName: { color: colors.ink, fontFamily: fonts.uiBold, fontSize: 16 },
  listPreview: { color: colors.inkMuted, fontFamily: fonts.ui, fontSize: 13, marginTop: 2 },
  listTime: { color: colors.inkMuted, fontFamily: fonts.ui, fontSize: 11 },
  chatHeader: {
    alignItems: 'center',
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  backButton: { alignItems: 'center', height: 36, justifyContent: 'center', width: 30 },
  headerAvatar: { alignItems: 'center', borderRadius: 20, height: 40, justifyContent: 'center', width: 40 },
  headerAvatarText: { color: colors.white, fontFamily: fonts.uiBold, fontSize: 16 },
  headerCopy: { flex: 1 },
  headerName: { color: colors.ink, fontFamily: fonts.uiBold, fontSize: 16 },
  headerCode: { color: colors.inkMuted, fontFamily: fonts.ui, fontSize: 12, marginTop: 1 },
  thread: { gap: spacing.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.lg },
  threadEmpty: { color: colors.inkMuted, fontFamily: fonts.ui, fontSize: 14, paddingVertical: spacing.xl, textAlign: 'center' },
  bubbleRow: { flexDirection: 'row', maxWidth: '100%' },
  bubbleRowMe: { justifyContent: 'flex-end' },
  bubbleRowThem: { justifyContent: 'flex-start' },
  bubble: { borderRadius: radii.lg, maxWidth: '78%', paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  bubbleMe: { backgroundColor: colors.maroon, borderBottomRightRadius: 6 },
  bubbleThem: { backgroundColor: colors.surface, borderBottomLeftRadius: 6, borderColor: colors.border, borderWidth: StyleSheet.hairlineWidth },
  bubbleText: { color: colors.ink, fontFamily: fonts.ui, fontSize: 15, lineHeight: 20 },
  bubbleTextMe: { color: colors.white },
  bubbleTime: { color: colors.inkMuted, fontFamily: fonts.ui, fontSize: 10, marginTop: 3, textAlign: 'right' },
  bubbleTimeMe: { color: 'rgba(255,255,255,.7)' },
  composer: {
    alignItems: 'flex-end',
    backgroundColor: colors.paper,
    borderTopColor: colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  composerInput: {
    backgroundColor: colors.cream,
    borderRadius: radii.lg,
    color: colors.ink,
    flex: 1,
    fontFamily: fonts.ui,
    fontSize: 15,
    maxHeight: 110,
    minHeight: 42,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  sendButton: { alignItems: 'center', backgroundColor: colors.maroon, borderRadius: 21, height: 42, justifyContent: 'center', width: 42 },
  sendButtonDisabled: { backgroundColor: colors.borderStrong },
  sendButtonPressed: { opacity: 0.8 },
});
