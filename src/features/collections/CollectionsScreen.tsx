import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList, RootStackParamList } from '../../app/navigation/RootNavigator';
import { AppHeader, RoundIconButton } from '../../components/AppHeader';
import { Icon, IconName } from '../../components/Icon';
import { CollectionCard } from '../../components/ListItems';
import { BottomSheet } from '../../components/BottomSheet';
import { AppTextInput } from '../../components/Inputs';
import { PrimaryButton } from '../../components/Buttons';
import { useLinks } from '../../app/providers/LinksProvider';
import { useTheme } from '../../app/providers/ThemeProvider';
import { useRefScale } from '../../utils/useRefScale';
import { themesFor } from '../../theme';
import type { Collection, CollectionColorKey } from '../../types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Collections'>,
  NativeStackScreenProps<RootStackParamList>
>;

const COLOR_OPTIONS: { key: CollectionColorKey; label: string }[] = [
  { key: 'blue', label: 'Blue' },
  { key: 'pink', label: 'Pink' },
  { key: 'teal', label: 'Teal' },
  { key: 'orange', label: 'Orange' },
];

const ICON_OPTIONS: IconName[] = ['folder', 'heart', 'briefcase', 'user', 'sparkles', 'box'];

export function CollectionsScreen({ navigation }: Props) {
  const v = useRefScale();
  const { c } = useTheme();
  const { collections, collectionCounts, addCollection } = useLinks();
  const [sheetVisible, setSheetVisible] = useState(false);
  const [name, setName] = useState('');
  const [colorKey, setColorKey] = useState<CollectionColorKey>('blue');
  const [iconKey, setIconKey] = useState<IconName>('folder');
  const [error, setError] = useState<string | null>(null);
  const theme = themesFor(c);

  const withCounts: Collection[] = collections.map((col) => ({
    ...col,
    link_count: collectionCounts[col.id] ?? 0,
  }));

  const resetForm = () => {
    setName('');
    setColorKey('blue');
    setIconKey('folder');
    setError(null);
  };

  const closeSheet = () => {
    setSheetVisible(false);
    resetForm();
  };

  const handleCreate = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Enter a collection name.');
      return;
    }
    addCollection({ name: trimmed, colorKey, iconKey });
    closeSheet();
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: c.screenBg }]}>
      <AppHeader
        title="Collections"
        right={
          <RoundIconButton label="Create collection" onPress={() => setSheetVisible(true)}>
            <Icon name="plus" size={v(15)} color="#fff" />
          </RoundIconButton>
        }
      />
      <FlatList
        data={withCounts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingHorizontal: v(20), paddingBottom: v(96) }]}
        renderItem={({ item }) => (
          <CollectionCard
            collection={item}
            onPress={() => navigation.navigate('CollectionView', { collectionId: item.id })}
          />
        )}
      />
      <BottomSheet visible={sheetVisible} title="New collection" onClose={closeSheet}>
        <AppTextInput
          icon="folder"
          placeholder="Collection name"
          value={name}
          onChangeText={(t) => {
            setName(t);
            setError(null);
          }}
          autoCapitalize="words"
          accessibilityLabel="Collection name"
          returnKeyType="done"
          onSubmitEditing={handleCreate}
        />
        <Text style={[styles.pickerLabel, { fontSize: v(12), marginBottom: v(8), color: c.textSecondary }]}>Color</Text>
        <View style={[styles.chipRow, { gap: v(8), marginBottom: v(14) }]}>
          {COLOR_OPTIONS.map((opt) => {
            const selected = colorKey === opt.key;
            const t = theme[opt.key];
            return (
              <Pressable
                key={opt.key}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={`Color ${opt.label}`}
                onPress={() => setColorKey(opt.key)}
                style={[
                  styles.chip,
                  {
                    gap: v(6),
                    paddingVertical: v(6),
                    paddingHorizontal: v(10),
                    borderRadius: v(20),
                    backgroundColor: selected ? t.bg : c.inputBg,
                    borderColor: selected ? t.fg : 'transparent',
                  },
                ]}
              >
                <View style={[styles.swatch, { backgroundColor: t.fg, width: v(10), height: v(10), borderRadius: v(5) }]} />
                <Text style={[styles.chipText, { fontSize: v(11), color: selected ? t.fg : c.textSecondary }]}>
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={[styles.pickerLabel, { fontSize: v(12), marginBottom: v(8), color: c.textSecondary }]}>Icon</Text>
        <View style={[styles.chipRow, { gap: v(8), marginBottom: v(8) }]}>
          {ICON_OPTIONS.map((nameOpt) => {
            const selected = iconKey === nameOpt;
            return (
              <Pressable
                key={nameOpt}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={`Icon ${nameOpt}`}
                onPress={() => setIconKey(nameOpt)}
                style={[
                  styles.iconChip,
                  {
                    width: v(36),
                    height: v(36),
                    borderRadius: v(12),
                    backgroundColor: selected ? theme[colorKey].bg : c.inputBg,
                  },
                ]}
              >
                <Icon
                  name={nameOpt}
                  size={v(16)}
                  color={selected ? theme[colorKey].fg : c.textSecondary}
                />
              </Pressable>
            );
          })}
        </View>
        {error ? (
          <Text style={[styles.error, { fontSize: v(12), marginBottom: v(8) }]}>{error}</Text>
        ) : null}
        <PrimaryButton title="Create" onPress={handleCreate} />
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: {},
  pickerLabel: { fontWeight: '700' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: { flexDirection: 'row', alignItems: 'center', borderWidth: 1 },
  swatch: {},
  chipText: { fontWeight: '600' },
  iconChip: { alignItems: 'center', justifyContent: 'center' },
  error: { color: '#f2436a', fontWeight: '600' },
});
