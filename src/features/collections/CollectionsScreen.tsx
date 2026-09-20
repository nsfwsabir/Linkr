import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList, RootStackParamList } from '../../app/navigation/RootNavigator';
import { AppHeader, RoundIconButton } from '../../components/AppHeader';
import { CollectionCard } from '../../components/ListItems';
import { mockCollections } from '../../utils/mockData';
import { colors } from '../../theme';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Collections'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function CollectionsScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <AppHeader
        title="Collections"
        right={
          <RoundIconButton label="Create collection">
            <Text style={styles.plus}>+</Text>
          </RoundIconButton>
        }
      />
      <FlatList
        data={mockCollections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <CollectionCard
            collection={item}
            onPress={() => navigation.navigate('CollectionView', { collectionId: item.id })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.screenBg },
  plus: { color: '#fff', fontSize: 18 },
  list: { paddingHorizontal: 20, paddingBottom: 16 },
});
