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
import { mockLinks } from '../../utils/mockData';
import { colors } from '../../theme';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

const TABS = ['All', 'Read Later', 'Work', 'Personal'];

export function HomeScreen({ navigation }: Props) {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('All');
  const [sheetVisible, setSheetVisible] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return mockLinks.filter((l) => {
      const matchesQuery =
        !q || l.title.toLowerCase().includes(q) || l.source_domain.toLowerCase().includes(q);
      const matchesTab = tab === 'All' || l.collection_ids?.includes(tabToCollectionId(tab));
      return matchesQuery && matchesTab;
    });
  }, [query, tab]);

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <AppHeader
        title="Linker"
        right={
          <RoundIconButton label="Save a link" onPress={() => setSheetVisible(true)}>
            <Icon name="plus" size={15} color="#fff" />
          </RoundIconButton>
        }
      />
      <SearchBar value={query} onChangeText={setQuery} />
      <View style={styles.tabs}>
        {TABS.map((t) => (
          <Pressable
            key={t}
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === t }}
            onPress={() => setTab(t)}
            style={[styles.tab, tab === t && styles.tabActive]}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t}</Text>
          </Pressable>
        ))}
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No links yet. Tap + to save one.</Text>}
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
  container: { flex: 1, backgroundColor: colors.screenBg },
  tabs: { flexDirection: 'row', gap: 4, marginHorizontal: 20, marginBottom: 10 },
  tab: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 20,
    backgroundColor: colors.inputBg,
  },
  tabActive: { backgroundColor: colors.dark },
  tabText: { fontSize: 10, color: colors.textSecondary, fontWeight: '600' },
  tabTextActive: { color: '#fff' },
  list: { paddingHorizontal: 22, paddingBottom: 16 },
  empty: { color: colors.textTertiary, textAlign: 'center', marginTop: 32 },
});
