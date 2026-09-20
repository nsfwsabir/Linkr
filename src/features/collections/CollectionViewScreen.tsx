import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../app/navigation/RootNavigator';
import { LinkListItem } from '../../components/ListItems';
import { mockCollections, mockLinks } from '../../utils/mockData';
import { colors, collectionThemes } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'CollectionView'>;

export function CollectionViewScreen({ route, navigation }: Props) {
  const collection = mockCollections.find((c) => c.id === route.params.collectionId) ?? mockCollections[0];
  const theme = collectionThemes[collection.color_key];
  const links = mockLinks.filter((l) => l.collection_ids?.includes(collection.id));

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <View style={[styles.icon, { backgroundColor: theme.bg }]}>
          <Text style={{ color: theme.fg, fontWeight: '800' }}>{collection.name[0]}</Text>
        </View>
        <View>
          <Text style={styles.name}>{collection.name}</Text>
          <Text style={styles.count}>{collection.link_count} links</Text>
        </View>
      </View>
      <FlatList
        data={links.length > 0 ? links : mockLinks.slice(0, 4)}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>This collection is empty.</Text>}
        renderItem={({ item }) => (
          <LinkListItem
            link={item}
            showDots
            onPress={() => navigation.navigate('LinkDetail', { linkId: item.id })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.screenBg, paddingTop: 12 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 22, paddingBottom: 16 },
  icon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 19, fontWeight: '800', color: colors.textPrimary },
  count: { fontSize: 12, color: colors.textTertiary, marginTop: 2 },
  list: { paddingHorizontal: 22 },
  empty: { color: colors.textTertiary, textAlign: 'center', marginTop: 32 },
});
