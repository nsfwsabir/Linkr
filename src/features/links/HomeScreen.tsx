import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
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

const TABS = ['All', 'Read Later', 'Work', 'Personal'];

export function HomeScreen({ navigation }: Props) {
  const v = useRefScale();
  const { links } = useLinks();
  const { c } = useTheme();
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('All');
  const [sheetVisible, setSheetVisible] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return links.filter((l) => {
      const matchesQuery =
        !q || l.title.toLowerCase().includes(q) || l.source_domain.toLowerCase().includes(q);
      const matchesTab = tab === 'All' || l.collection_ids?.includes(tabToCollectionId(tab));
      return matchesQuery && matchesTab;
    });
  }, [query, tab, links]);

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
      <View style={[styles.tabs, { gap: v(4), marginHorizontal: v(20), marginBottom: v(10) }]}>
        {TABS.map((t) => (
          <Pressable
            key={t}
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === t }}
            onPress={() => setTab(t)}
            style={[
              styles.tab,
              {
                paddingVertical: v(5),
                paddingHorizontal: v(8),
                borderRadius: v(20),
                backgroundColor: tab === t ? c.dark : c.inputBg,
              },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                { fontSize: v(10), color: tab === t ? '#fff' : c.textSecondary },
              ]}
            >
              {t}
            </Text>
          </Pressable>
        ))}
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingHorizontal: v(22), paddingBottom: v(96) }]}
        ListEmptyComponent={
          <Text style={[styles.empty, { marginTop: v(32), color: c.textTertiary }]}>
            No links yet. Tap + to save one.
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

function tabToCollectionId(tab: string): string {
  switch (tab) {
    case 'Read Later':
      return 'c-read-later';
    case 'Work':
      return 'c-work';
    case 'Personal':
      return 'c-personal';
    default:
      return '';
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabs: { flexDirection: 'row' },
  tab: {},
  tabText: { fontWeight: '600' },
  list: {},
  empty: { textAlign: 'center' },
});
