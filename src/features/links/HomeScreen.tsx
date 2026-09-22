import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList, RootStackParamList } from '../../app/navigation/RootNavigator';
import { AppHeader, RoundIconButton } from '../../components/AppHeader';
import { Icon } from '../../components/Icon';
import { SearchBar } from '../../components/Inputs';
import { LinkListItem } from '../../components/ListItems';
import { SaveLinkSheet } from '../links/SaveLinkSheet';
import { useLinks } from '../../app/providers/LinksProvider';
import { useTheme } from '../../app/providers/ThemeProvider';
import { useRefScale } from '../../utils/useRefScale';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

const ALL = 'all';
const QUICK_COLLECTION_LIMIT = 3;

export function HomeScreen({ navigation }: Props) {
  const v = useRefScale();
  const { links, collections } = useLinks();
  const { c } = useTheme();
  const [query, setQuery] = useState('');
  const [filterId, setFilterId] = useState<string>(ALL);
  const [sheetVisible, setSheetVisible] = useState(false);

  const quickCollections = useMemo(() => collections.slice(0, QUICK_COLLECTION_LIMIT), [collections]);
  const hasMoreCollections = collections.length > QUICK_COLLECTION_LIMIT;

  // Reset an invalid filter if the collection was deleted or reshaped.
  useEffect(() => {
    if (filterId !== ALL && !collections.some((col) => col.id === filterId)) {
      setFilterId(ALL);
    }
  }, [collections, filterId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return links.filter((l) => {
      const matchesQuery =
        !q || l.title.toLowerCase().includes(q) || l.source_domain.toLowerCase().includes(q);
      const matchesFilter = filterId === ALL || l.collection_ids?.includes(filterId);
      return matchesQuery && matchesFilter;
    });
  }, [query, filterId, links]);

  const emptyMessage = useMemo(() => {
    if (query.trim()) return 'No links match your search.';
    if (filterId !== ALL) {
      const col = collections.find((x) => x.id === filterId);
      return col ? `No links in ${col.name} yet.` : 'No links yet. Tap + to save one.';
    }
    return 'No links yet. Tap + to save one.';
  }, [query, filterId, collections]);

  const renderPill = (key: string, label: string, onPress: () => void) => {
    const selected = filterId === key;
    return (
      <Pressable
        key={key}
        accessibilityRole="tab"
        accessibilityState={{ selected }}
        onPress={onPress}
        style={[
          styles.tab,
          {
            paddingVertical: v(5),
            paddingHorizontal: v(8),
            borderRadius: v(20),
            backgroundColor: selected ? c.dark : c.inputBg,
          },
        ]}
      >
        <Text
          style={[
            styles.tabText,
            { fontSize: v(10), color: selected ? '#fff' : c.textSecondary },
          ]}
        >
          {label}
        </Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: c.screenBg }]}>
      <AppHeader
        title="Linker"
        right={
          <RoundIconButton label="Save a link" onPress={() => setSheetVisible(true)}>
            <Icon name="plus" size={v(15)} color="#fff" />
          </RoundIconButton>
        }
      />
      <SearchBar value={query} onChangeText={setQuery} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.tabs, { gap: v(4), marginHorizontal: v(20), marginBottom: v(10) }]}
      >
        {renderPill(ALL, 'All', () => setFilterId(ALL))}
        {quickCollections.map((col) => renderPill(col.id, col.name, () => setFilterId(col.id)))}
        {hasMoreCollections
          ? renderPill('more', 'More', () => navigation.navigate('Collections'))
          : null}
      </ScrollView>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingHorizontal: v(22), paddingBottom: v(96) }]}
        ListEmptyComponent={
          <Text style={[styles.empty, { marginTop: v(32), color: c.textTertiary }]}>
            {emptyMessage}
          </Text>
        }
        renderItem={({ item }) => (
          <LinkListItem link={item} onPress={() => navigation.navigate('LinkDetail', { linkId: item.id })} />
        )}
      />
      <SaveLinkSheet visible={sheetVisible} onClose={() => setSheetVisible(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabs: { flexDirection: 'row', alignItems: 'center' },
  tab: {},
  tabText: { fontWeight: '600' },
  list: {},
  empty: { textAlign: 'center' },
});
