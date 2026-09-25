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
import { sortByTitle } from '../../utils/sort';
import { useRefScale } from '../../utils/useRefScale';
import { openLinkDetail } from '../../utils/navigateLinkDetail';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

const MAX_QUICK_FILTERS = 3;

export function HomeScreen({ navigation }: Props) {
  const v = useRefScale();
  const { links, collections } = useLinks();
  const { c } = useTheme();
  const [query, setQuery] = useState('');
  const [filterId, setFilterId] = useState<string | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);

  const quickCollections = collections.slice(0, MAX_QUICK_FILTERS);
  const hasMoreCollections = collections.length > MAX_QUICK_FILTERS;

  useEffect(() => {
    if (filterId && !collections.some((col) => col.id === filterId)) {
      setFilterId(null);
    }
  }, [collections, filterId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matches = links.filter((l) => {
      const matchesQuery =
        !q || l.title.toLowerCase().includes(q) || l.source_domain.toLowerCase().includes(q);
      const matchesFilter = !filterId || l.collection_ids?.includes(filterId);
      return matchesQuery && matchesFilter;
    });
    return sortByTitle(matches);
  }, [query, filterId, links]);

  const emptyMessage = filterId
    ? 'No links in this collection yet. Tap + to save one.'
    : 'No links yet. Tap + to save one.';

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
        style={styles.tabsRow}
        contentContainerStyle={[
          styles.tabs,
          {
            gap: v(4),
            paddingHorizontal: v(20),
            marginBottom: v(10),
            alignItems: 'center',
          },
        ]}
      >
        <Pressable
          accessibilityRole="tab"
          accessibilityState={{ selected: filterId === null }}
          onPress={() => setFilterId(null)}
          style={[
            styles.tab,
            {
              paddingVertical: v(6),
              paddingHorizontal: v(10),
              minHeight: v(30),
              borderRadius: v(20),
              backgroundColor: filterId === null ? c.dark : c.inputBg,
            },
          ]}
        >
          <Text
            style={[
              styles.tabText,
              { fontSize: v(11), color: filterId === null ? '#fff' : c.textSecondary },
            ]}
            numberOfLines={1}
          >
            All
          </Text>
        </Pressable>
        {quickCollections.map((col) => {
          const selected = filterId === col.id;
          return (
            <Pressable
              key={col.id}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              onPress={() => setFilterId(selected ? null : col.id)}
              style={[
                styles.tab,
                {
                  paddingVertical: v(6),
                  paddingHorizontal: v(10),
                  minHeight: v(30),
                  borderRadius: v(20),
                  backgroundColor: selected ? c.dark : c.inputBg,
                },
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  { fontSize: v(11), color: selected ? '#fff' : c.textSecondary },
                ]}
                numberOfLines={1}
              >
                {col.name}
              </Text>
            </Pressable>
          );
        })}
        {hasMoreCollections ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="See all collections"
            onPress={() => navigation.navigate('Collections')}
            style={[
              styles.tab,
              {
                paddingVertical: v(6),
                paddingHorizontal: v(10),
                minHeight: v(30),
                borderRadius: v(20),
                backgroundColor: c.inputBg,
              },
            ]}
          >
            <Text style={[styles.tabText, { fontSize: v(11), color: c.textSecondary }]}>More</Text>
          </Pressable>
        ) : null}
      </ScrollView>
      <FlatList
        style={styles.list}
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[{ paddingHorizontal: v(22), paddingBottom: v(96) }]}
        ListEmptyComponent={
          <Text style={[styles.empty, { marginTop: v(32), color: c.textTertiary }]}>
            {emptyMessage}
          </Text>
        }
        renderItem={({ item }) => (
          <LinkListItem
            link={item}
            onPress={() => {
              openLinkDetail(navigation, item.id);
            }}
          />
        )}
      />
      <SaveLinkSheet visible={sheetVisible} onClose={() => setSheetVisible(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabsRow: { flexGrow: 0, flexShrink: 0, maxHeight: 48 },
  tabs: { flexGrow: 0, flexShrink: 0 },
  tab: { flexGrow: 0, flexShrink: 0, justifyContent: 'center', alignSelf: 'flex-start' },
  tabText: { fontWeight: '600', flexShrink: 0 },
  list: { flex: 1 },
  empty: { textAlign: 'center' },
});
