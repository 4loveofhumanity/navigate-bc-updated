import { useDeferredValue, useState } from 'react';
import { Alert, Linking, StyleSheet, Text, View, type AlertButton } from 'react-native';

import { AppScaffold } from '@/components/app-scaffold';
import { ListRow, PageIntro, SearchField, SectionTitle, SegmentedControl, Surface } from '@/components/ui';
import { colors, fonts, spacing } from '@/constants/theme';
import { DEPARTMENTS, EMPLOYEES } from '@/data/demo';

type DirectoryTab = 'departments' | 'employees';

function showContact(title: string, detail: string, phone?: string, email?: string) {
  const actions: AlertButton[] = [{ text: 'Close', style: 'cancel' }];
  if (email) actions.push({ text: 'Email', style: 'default', onPress: () => void Linking.openURL(`mailto:${email}`) });
  if (phone) actions.push({ text: 'Call', style: 'default', onPress: () => void Linking.openURL(`tel:${phone.replace(/\D/g, '')}`) });
  Alert.alert(title, detail, actions);
}

export default function DirectoryScreen() {
  const [tab, setTab] = useState<DirectoryTab>('departments');
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const departments = DEPARTMENTS.filter((item) => `${item.name} ${item.room}`.toLowerCase().includes(deferredQuery));
  const employees = EMPLOYEES.filter((item) => `${item.name} ${item.title} ${item.department}`.toLowerCase().includes(deferredQuery));
  const resultCount = tab === 'departments' ? departments.length : employees.length;

  return (
    <AppScaffold>
      <PageIntro
        eyebrow="Campus directory"
        title="Find the right person or office."
        body="Search by name, department, title, building, or room. Directory data is seeded for the production integration layer."
      />
      <SegmentedControl
        onChange={(value) => {
          setTab(value);
          setQuery('');
        }}
        options={[
          { label: 'Departments', value: 'departments' },
          { label: 'Employees', value: 'employees' },
        ]}
        value={tab}
      />
      <View style={styles.searchGap} />
      <SearchField
        onChangeText={setQuery}
        placeholder={tab === 'departments' ? 'Search departments or rooms' : 'Search people or titles'}
        value={query}
      />

      <SectionTitle action={<Text style={styles.count}>{resultCount} results</Text>}>
        {tab === 'departments' ? 'Campus offices' : 'People'}
      </SectionTitle>
      <Surface>
        {tab === 'departments'
          ? departments.map((department) => (
              <ListRow
                icon="business"
                key={department.id}
                onPress={() => showContact(department.name, department.room, department.phone)}
                subtitle={department.room}
                title={department.name}
              />
            ))
          : employees.map((employee) => (
              <ListRow
                icon="person"
                iconColor={colors.blue}
                key={employee.id}
                onPress={() => showContact(employee.name, `${employee.title}\n${employee.department}`, employee.phone, employee.email)}
                subtitle={`${employee.title} · ${employee.department}`}
                title={employee.name}
              />
            ))}
      </Surface>
      {resultCount === 0 ? <Text style={styles.noResults}>No directory entries match “{query}”.</Text> : null}
    </AppScaffold>
  );
}

const styles = StyleSheet.create({
  searchGap: { height: spacing.md },
  count: { color: colors.inkMuted, fontFamily: fonts.uiMedium, fontSize: 12 },
  noResults: { color: colors.inkMuted, fontFamily: fonts.ui, fontSize: 14, padding: spacing.xl, textAlign: 'center' },
});
