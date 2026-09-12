import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useDeferredValue, useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppScaffold } from '@/components/app-scaffold';
import { ActionButton, ListRow, PageIntro, SearchField, SectionTitle, Surface } from '@/components/ui';
import { colors, fonts, radii, spacing } from '@/constants/theme';
import { HELP_ARTICLES, IMPORTANT_CONTACTS } from '@/data/demo';
import { openInAppBrowser } from '@/lib/in-app-browser';

export default function HelpScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState<string | null>(HELP_ARTICLES[0]?.id ?? null);
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const articles = HELP_ARTICLES.filter((article) =>
    `${article.question} ${article.answer} ${article.tags.join(' ')}`.toLowerCase().includes(deferredQuery),
  );

  return (
    <AppScaffold>
      <PageIntro
        eyebrow="Knowledge and contacts"
        title="Start with an answer. Reach a person when you need one."
        body="Search common questions or use a verified campus contact."
      />
      <SearchField onChangeText={setQuery} placeholder="How do I…?" value={query} />

      <SectionTitle>Common questions</SectionTitle>
      <Surface>
        {articles.map((article) => {
          const isExpanded = expanded === article.id;
          return (
            <Pressable
              accessibilityLabel={article.question}
              accessibilityRole="button"
              accessibilityState={{ expanded: isExpanded }}
              key={article.id}
              onPress={() => setExpanded(isExpanded ? null : article.id)}
              style={({ pressed }) => [styles.article, pressed && styles.articlePressed]}
            >
              <View style={styles.questionRow}>
                <Text style={styles.question}>{article.question}</Text>
                <Ionicons color={colors.maroon} name={isExpanded ? 'remove' : 'add'} size={21} />
              </View>
              {isExpanded ? <Text style={styles.answer}>{article.answer}</Text> : null}
            </Pressable>
          );
        })}
      </Surface>

      <SectionTitle>Important contacts</SectionTitle>
      <Surface>
        {IMPORTANT_CONTACTS.map((contact) => (
          <ListRow
            icon={contact.phone ? 'call' : 'open-outline'}
            key={contact.id}
            onPress={() => {
              if (contact.phone) void Linking.openURL(`tel:${contact.phone}`);
              if (contact.url) openInAppBrowser(contact.url, contact.name);
            }}
            subtitle={contact.detail}
            title={contact.name}
          />
        ))}
      </Surface>

      <SectionTitle>Systems and services</SectionTitle>
      <Surface>
        <ListRow
          icon="pulse"
          onPress={() => router.push('/it-status')}
          subtitle="Check campus systems and service health"
          title="IT Status"
        />
      </Surface>

      <View style={styles.portalCard}>
        <View style={styles.portalIcon}>
          <Ionicons color={colors.white} name="school" size={24} />
        </View>
        <View style={styles.portalCopy}>
          <Text style={styles.portalTitle}>Pugliese Knowledge</Text>
          <Text style={styles.portalBody}>Browse the official Pugliese College student portal for current policies and service instructions.</Text>
        </View>
        <ActionButton label="Open Portal" onPress={() => openInAppBrowser('https://students.pugliese.edu/portal/', 'Student Portal')} variant="secondary" />
      </View>
    </AppScaffold>
  );
}

const styles = StyleSheet.create({
  article: { borderBottomColor: colors.border, borderBottomWidth: StyleSheet.hairlineWidth, padding: spacing.lg },
  articlePressed: { backgroundColor: colors.cream },
  questionRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.md },
  question: { color: colors.ink, flex: 1, fontFamily: fonts.uiBold, fontSize: 15, lineHeight: 20 },
  answer: { color: colors.inkMuted, fontFamily: fonts.ui, fontSize: 14, lineHeight: 20, paddingRight: spacing.xl, paddingTop: spacing.md },
  portalCard: { alignItems: 'center', backgroundColor: colors.maroon, borderRadius: radii.lg, flexDirection: 'row', gap: spacing.md, marginHorizontal: spacing.lg, marginTop: spacing.xl, padding: spacing.lg },
  portalIcon: { alignItems: 'center', backgroundColor: 'rgba(255,255,255,.15)', borderRadius: 22, height: 44, justifyContent: 'center', width: 44 },
  portalCopy: { flex: 1 },
  portalTitle: { color: colors.white, fontFamily: fonts.uiBold, fontSize: 16 },
  portalBody: { color: 'rgba(255,255,255,.78)', fontFamily: fonts.ui, fontSize: 12, lineHeight: 16, marginTop: 3 },
});
