import React from 'react';
import { View, Text, Pressable, StyleSheet, Linking, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../app/navigation/RootNavigator';
import { mockLinks, mockCollections } from '../../utils/mockData';
import { PrimaryButton } from '../../components/Buttons';
import { colors } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'LinkDetail'>;

export function LinkDetailScreen({ route }: Props) {
  const link = mockLinks.find((l) => l.id === route.params.linkId) ?? mockLinks[4];
  const collection = mockCollections[0];

  const openLink = async () => {
    try {
      const supported = await Linking.canOpenURL(link.original_url);
      if (supported) await Linking.openURL(link.original_url);
      else Alert.alert('Cannot open link', link.original_url);
    } catch {
      Alert.alert('Cannot open link', link.original_url);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Pressable style={styles.fab} accessibilityRole="button" accessibilityLabel="Go back">
          <Text>←</Text>
        </Pressable>
        <Pressable style={styles.fab} accessibilityRole="button" accessibilityLabel="More actions">
          <Text>···</Text>
        </Pressable>
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>{link.title}</Text>
        <Text style={styles.source}>● {link.source_domain}</Text>
        <Text style={styles.desc}>{link.description}</Text>
        <PrimaryButton title="Open Link" onPress={openLink} />
        <View style={styles.row}>
          <Text style={styles.rowText}>Add to collection</Text>
          <Text style={styles.chev}>›</Text>
        </View>
        <View style={styles.row}>
          <View>
            <Text style={styles.rowText}>Saved</Text>
            <Text style={styles.sub}>
              {link.saved_at} · {collection.name}
            </Text>
          </View>
          <Text style={styles.chev}>›</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.screenBg },
  hero: {
    height: 156,
    backgroundColor: '#152a44',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 18,
    paddingTop: 52,
  },
  fab: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.88)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { padding: 22, flex: 1 },
  title: { fontSize: 19, fontWeight: '800', color: colors.textPrimary, lineHeight: 24 },
  source: { fontSize: 11.5, color: colors.textTertiary, marginVertical: 9 },
  desc: { fontSize: 12.5, lineHeight: 19, color: colors.textSecondary, marginBottom: 12 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 4,
  },
  rowText: { fontSize: 12.8, fontWeight: '600', color: colors.textPrimary },
  sub: { fontSize: 11, color: colors.textTertiary, marginTop: 2 },
  chev: { color: colors.textTertiary, fontSize: 15 },
});
