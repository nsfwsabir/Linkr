import React from 'react';
import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../app/navigation/RootNavigator';
import { LinkListItem } from '../../components/ListItems';
import { Icon, CollectionIcon } from '../../components/Icon';
import { mockCollections, mockCollectionLinks } from '../../utils/mockData';
import { colors, collectionThemes } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'CollectionView'>;

export function CollectionViewScreen({ route, navigation }: Props) {
  const collection =
    mockCollections.find((c) => c.id === route.params.collectionId) ?? mockCollections[0];
  const theme = collectionThemes[collection.color_key];

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <View style={styles.navHeader}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => navigation.goBack()}
          style={styles.iconBtn}
        >
          <Icon name="arrowLeft" size={17} color={colors.textPrimary} />
        </Pressable>
      </View>
      <View style={styles.titleRow}>
        <View style={[styles.icon, { backgroundColor: theme.bg }]}>
          <CollectionIcon iconKey={collection.icon_key} size={18} color={theme.fg} />
        </View>
        <View>
          <Text style={styles.name}>{collection.name}</Text>
          <Text style={styles.count}>{collection.link_count} links</Text>
        </View>
      </View>
      <FlatList
        data={mockCollectionLinks}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.screenBg },
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingHorizontal: 22,
    paddingBottom: 4,
  },
  iconBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 6,
    paddingHorizontal: 22,
    paddingBottom: 16,
  },
  icon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 19, fontWeight: '800', color: colors.textPrimary },
  count: { fontSize: 12, color: colors.textTertiary, marginTop: 2 },
  list: { paddingHorizontal: 22 },
  empty: { color: colors.textTertiary, textAlign: 'center', marginTop: 32 },
});
