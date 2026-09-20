import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, radii, spacing, collectionThemes } from '../theme';
import type { Collection, Link } from '../types';

export function LinkListItem({
  link,
  onPress,
  showDots = false,
}: {
  link: Link;
  onPress?: () => void;
  showDots?: boolean;
}) {
  const initial = (link.title?.[0] ?? 'L').toUpperCase();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={link.title}
      onPress={onPress}
      style={styles.row}
    >
      <View style={styles.thumb}>
        <Text style={styles.thumbText}>{initial}</Text>
      </View>
      <View style={styles.textWrap}>
        <Text numberOfLines={1} style={styles.title}>
          {link.title}
        </Text>
        <Text numberOfLines={1} style={styles.meta}>
          {link.source_domain}
          {showDots ? ` · ${link.saved_at}` : ''}
        </Text>
      </View>
      <Text style={styles.time}>{showDots ? '···' : link.saved_at}</Text>
    </Pressable>
  );
}

export function CollectionCard({
  collection,
  onPress,
}: {
  collection: Collection;
  onPress?: () => void;
}) {
  const theme = collectionThemes[collection.color_key];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={collection.name}
      onPress={onPress}
      style={styles.card}
    >
      <View style={[styles.icon, { backgroundColor: theme.bg }]}>
        <Text style={{ color: theme.fg, fontWeight: '800' }}>
          {collection.name[0]}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{collection.name}</Text>
        <Text style={styles.count}>{collection.link_count ?? 0} links</Text>
      </View>
      <Text style={styles.chev}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingVertical: 9,
  },
  thumb: {
    width: spacing.listThumb,
    height: spacing.listThumb,
    borderRadius: radii.thumb,
    backgroundColor: colors.screenBgAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbText: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  textWrap: { flex: 1, minWidth: 0 },
  title: { fontSize: 12.8, fontWeight: '700', color: colors.textPrimary },
  meta: { fontSize: 11, color: colors.textTertiary, marginTop: 2 },
  time: { fontSize: 10.5, color: colors.textTertiary, marginLeft: 4 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    borderRadius: radii.card,
    padding: 10,
    paddingHorizontal: 13,
    marginBottom: 8,
  },
  icon: {
    width: spacing.collectionIcon,
    height: spacing.collectionIcon,
    borderRadius: radii.collectionIcon,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { fontSize: 13.5, fontWeight: '700', color: colors.textPrimary },
  count: { fontSize: 11, color: colors.textTertiary, marginTop: 2 },
  chev: { fontSize: 16, color: colors.textTertiary, marginLeft: 'auto' },
});
