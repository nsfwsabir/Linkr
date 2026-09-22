import React from 'react';
import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../app/navigation/RootNavigator';
import { LinkListItem } from '../../components/ListItems';
import { Icon, CollectionIcon } from '../../components/Icon';
import { mockCollections } from '../../utils/mockData';
import { useLinks } from '../../app/providers/LinksProvider';
import { useRefScale } from '../../utils/useRefScale';
import { colors, collectionThemes } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'CollectionView'>;

export function CollectionViewScreen({ route, navigation }: Props) {
  const v = useRefScale();
  const { collectionLinks } = useLinks();
  const collection =
    mockCollections.find((c) => c.id === route.params.collectionId) ?? mockCollections[0];
  const theme = collectionThemes[collection.color_key];
  const iconBtn = v(32);

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
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
          <Icon name="arrowLeft" size={v(17)} color={colors.textPrimary} />
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
          <Text style={[styles.name, { fontSize: v(19) }]}>{collection.name}</Text>
          <Text style={[styles.count, { fontSize: v(12), marginTop: v(2) }]}>
            {collection.link_count} links
          </Text>
        </View>
      </View>
      <FlatList
        data={collectionLinks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingHorizontal: v(22) }]}
        ListEmptyComponent={
          <Text style={[styles.empty, { marginTop: v(32) }]}>This collection is empty.</Text>
        }
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
  navHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconBtn: { alignItems: 'center', justifyContent: 'center' },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  icon: { alignItems: 'center', justifyContent: 'center' },
  name: { fontWeight: '800', color: colors.textPrimary },
  count: { color: colors.textTertiary },
  list: {},
  empty: { color: colors.textTertiary, textAlign: 'center' },
});
