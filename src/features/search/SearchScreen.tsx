import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchBar } from '../../components/Inputs';
import { LinkListItem } from '../../components/ListItems';
import { AppHeader } from '../../components/AppHeader';
import { mockLinks } from '../../utils/mockData';
import { colors } from '../../theme';

export function SearchScreen() {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return mockLinks;
    return mockLinks.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.source_domain.toLowerCase().includes(q) ||
        (l.description ?? '').toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <AppHeader title="Search" />
      <SearchBar value={query} onChangeText={setQuery} />
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No results found.</Text>}
        renderItem={({ item }) => <LinkListItem link={item} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.screenBg },
  list: { paddingHorizontal: 22 },
  empty: { color: colors.textTertiary, textAlign: 'center', marginTop: 32 },
});
