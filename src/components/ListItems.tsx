import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon, CollectionIcon } from './Icon';
import { colors, radii, spacing, collectionThemes } from '../theme';
import type { Collection, Link, ThumbSpec } from '../types';

function Thumb({ spec }: { spec?: ThumbSpec }) {
  const inner = spec?.icon ? (
    <Icon name={spec.icon} size={18} color={spec.iconColor ?? '#fff'} />
  ) : spec?.label ? (
    <Text
      style={[
        styles.thumbText,
        { color: spec.labelColor ?? '#fff' },
        spec.serif && { fontFamily: 'serif' },
      ]}
    >
      {spec.label}
    </Text>
  ) : null;

  if (spec?.gradient) {
    return (
      <LinearGradient
        colors={[spec.gradient[0], spec.gradient[1]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.thumb}
      >
        {inner}
      </LinearGradient>
    );
  }
  return (
    <View style={[styles.thumb, spec?.bg ? { backgroundColor: spec.bg } : null]}>
      {inner}
    </View>
  );
}

export function LinkListItem({
  link,
  onPress,
  showDots = false,
}: {
  link: Link;
  onPress?: () => void;
  showDots?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={link.title}
      onPress={onPress}
      style={styles.row}
    >
      <Thumb spec={link.thumb} />
      <View style={styles.textWrap}>
        <Text numberOfLines={1} style={styles.title}>
          {link.title}
        </Text>
        <Text numberOfLines={1} style={styles.meta}>
          {link.source_domain}
          {showDots ? ` · ${link.saved_at}` : ''}
        </Text>
      </View>
      {showDots ? (
        <View style={styles.dots}>
          <Icon name="dots" size={16} color={colors.textTertiary} />
        </View>
      ) : (
        <Text style={styles.time}>{link.saved_at}</Text>
      )}
    </Pressable>
  );
}

export function CollectionCard({
  collection,
  iconSize = 44,
  onPress,
}: {
  collection: Collection;
  iconSize?: 44 | 38;
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
      <View
        style={[
          styles.icon,
          { backgroundColor: theme.bg },
          iconSize === 38 && { width: 38, height: 38, borderRadius: 12 },
        ]}
      >
        <CollectionIcon
          iconKey={collection.icon_key}
          size={iconSize === 38 ? 18 : 21}
          color={theme.fg}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{collection.name}</Text>
        <Text style={styles.count}>{collection.link_count ?? 0} links</Text>
      </View>
      <Icon name="chevronRight" size={16} color={colors.textTertiary} />
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
    overflow: 'hidden',
  },
  thumbText: { fontSize: 14, fontWeight: '800' },
  textWrap: { flex: 1, minWidth: 0 },
  title: { fontSize: 12.8, fontWeight: '700', color: colors.textPrimary },
  meta: { fontSize: 11, color: colors.textTertiary, marginTop: 2 },
  time: { fontSize: 10.5, color: colors.textTertiary, marginLeft: 4 },
  dots: { marginLeft: 4 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    borderRadius: radii.card,
    padding: 10,
    paddingHorizontal: 13,
    marginBottom: 8,
    shadowColor: '#14161e',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
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
});
