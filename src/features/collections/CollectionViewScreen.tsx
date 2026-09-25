import React, { useMemo } from 'react';
import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../app/navigation/RootNavigator';
import { LinkListItem } from '../../components/ListItems';
import { Icon, CollectionIcon } from '../../components/Icon';
import { useLinks } from '../../app/providers/LinksProvider';
import { useTheme } from '../../app/providers/ThemeProvider';
import { useRefScale } from '../../utils/useRefScale';
import { sortByTitle } from '../../utils/sort';
import { themesFor } from '../../theme';
import { openLinkDetail } from '../../utils/navigateLinkDetail';

type Props = NativeStackScreenProps<RootStackParamList, 'CollectionView'>;

export function CollectionViewScreen({ route, navigation }: Props) {
  const v = useRefScale();
  const { links, collections, collectionCounts } = useLinks();
  const { c } = useTheme();

  const collection = collections.find((col) => col.id === route.params.collectionId);

  const collectionLinks = useMemo(
    () =>
      collection
        ? sortByTitle(links.filter((l) => l.collection_ids?.includes(collection.id)))
        : [],
    [links, collection],
  );

  if (!collection) {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={[styles.container, { backgroundColor: c.screenBg }]}>
        <View
          style={[
            styles.navHeader,
            { paddingTop: v(10), paddingHorizontal: v(22), paddingBottom: v(4) },
          ]}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => navigation.goBack()}
            style={[styles.iconBtn, { width: v(32), height: v(32) }]}
          >
            <Icon name="arrowLeft" size={v(17)} color={c.textPrimary} />
          </Pressable>
        </View>
        <Text style={[styles.empty, { marginTop: v(32), color: c.textTertiary }]}>
          Collection not found.
        </Text>
      </SafeAreaView>
    );
  }

  const theme = themesFor(c)[collection.color_key];
  const iconBtn = v(32);
  const count = collectionCounts[collection.id] ?? 0;

  return (
    <SafeAreaView edges={['top', 'bottom']} style={[styles.container, { backgroundColor: c.screenBg }]}>
      <View
        style={[
          styles.navHeader,
          { paddingTop: v(10), paddingHorizontal: v(22), paddingBottom: v(4) },
        ]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => navigation.goBack()}
          style={[styles.iconBtn, { width: iconBtn, height: iconBtn }]}
        >
          <Icon name="arrowLeft" size={v(17)} color={c.textPrimary} />
        </Pressable>
      </View>
      <View
        style={[
          styles.titleRow,
          { gap: v(12), paddingTop: v(6), paddingHorizontal: v(22), paddingBottom: v(16) },
        ]}
      >
        <View style={[styles.icon, { backgroundColor: theme.bg, width: v(38), height: v(38), borderRadius: v(12) }]}>
          <CollectionIcon iconKey={collection.icon_key} size={v(18)} color={theme.fg} />
        </View>
        <View>
          <Text style={[styles.name, { fontSize: v(19), color: c.textPrimary }]}>{collection.name}</Text>
          <Text style={[styles.count, { fontSize: v(12), marginTop: v(2), color: c.textTertiary }]}>
            {count} links
          </Text>
        </View>
      </View>
      <FlatList
        data={collectionLinks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingHorizontal: v(22) }]}
        ListEmptyComponent={
          <Text style={[styles.empty, { marginTop: v(32), color: c.textTertiary }]}>
            This collection is empty.
          </Text>
        }
        renderItem={({ item }) => (
          <LinkListItem
            link={item}
            showDots
            onPress={() => {
              openLinkDetail(navigation, item.id);
            }}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  navHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconBtn: { alignItems: 'center', justifyContent: 'center' },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  icon: { alignItems: 'center', justifyContent: 'center' },
  name: { fontWeight: '800' },
  count: {},
  list: {},
  empty: { textAlign: 'center' },
});
