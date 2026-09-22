import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchBar } from '../../components/Inputs';
import { LinkListItem } from '../../components/ListItems';
import { AppHeader } from '../../components/AppHeader';
import { useLinks } from '../../app/providers/LinksProvider';
import { useRefScale } from '../../utils/useRefScale';
import { colors } from '../../theme';

export function SearchScreen() {
  const v = useRefScale();
  const { links } = useLinks();
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return links;
    return links.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.source_domain.toLowerCase().includes(q) ||
        (l.description ?? '').toLowerCase().includes(q),
    );
  }, [query, links]);

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <AppHeader title="Search" />
      <SearchBar value={query} onChangeText={setQuery} />
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingHorizontal: v(22) }]}
        ListEmptyComponent={
          <Text style={[styles.empty, { marginTop: v(32) }]}>No results found.</Text>
        }
        renderItem={({ item }) => <LinkListItem link={item} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.screenBg },
  list: {},
  empty: { color: colors.textTertiary, textAlign: 'center' },
});
