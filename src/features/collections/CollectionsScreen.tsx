import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList, RootStackParamList } from '../../app/navigation/RootNavigator';
import { AppHeader, RoundIconButton } from '../../components/AppHeader';
import { Icon } from '../../components/Icon';
import { CollectionCard } from '../../components/ListItems';
import { mockCollections } from '../../utils/mockData';
import { useTheme } from '../../app/providers/ThemeProvider';
import { useRefScale } from '../../utils/useRefScale';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Collections'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function CollectionsScreen({ navigation }: Props) {
  const v = useRefScale();
  const { c } = useTheme();
  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: c.screenBg }]}>
      <AppHeader
        title="Collections"
        right={
          <RoundIconButton label="Create collection">
            <Icon name="plus" size={v(15)} color="#fff" />
          </RoundIconButton>
        }
      />
      <FlatList
        data={mockCollections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingHorizontal: v(20), paddingBottom: v(96) }]}
        renderItem={({ item }) => (
          <CollectionCard
            collection={item}
            onPress={() => navigation.navigate('CollectionView', { collectionId: item.id })}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: {},
});
