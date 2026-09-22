import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRefScale } from '../utils/useRefScale';
import { Icon, CollectionIcon } from './Icon';
import { themesFor } from '../theme';
import { useTheme } from '../app/providers/ThemeProvider';
import type { Collection, Link, ThumbSpec } from '../types';

function Thumb({ spec }: { spec?: ThumbSpec }) {
  const v = useRefScale();
  const { c } = useTheme();
  const d = v(42);
  const inner = spec?.icon ? (
    <Icon name={spec.icon} size={v(18)} color={spec.iconColor ?? '#fff'} />
  ) : spec?.label ? (
    <Text
      style={[
        styles.thumbText,
        { fontSize: v(14), color: spec.labelColor ?? '#fff' },
        spec.serif && { fontFamily: 'serif' },
      ]}
    >
      {spec.label}
    </Text>
  ) : null;

  const box = { width: d, height: d, borderRadius: v(13) };
  if (spec?.gradient) {
    return (
      <LinearGradient
        colors={[spec.gradient[0], spec.gradient[1]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.thumb, box]}
      >
        {inner}
      </LinearGradient>
    );
  }
  return (
    <View
      style={[styles.thumb, box, { backgroundColor: spec?.bg ?? c.screenBgAlt }]}
    >
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
  const v = useRefScale();
  const { c } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={link.title}
      onPress={onPress}
      hitSlop={6}
      style={[styles.row, { gap: v(11), paddingVertical: v(9) }]}
    >
      <Thumb spec={link.thumb} />
      <View style={styles.textWrap}>
        <Text numberOfLines={1} style={[styles.title, { fontSize: v(12.8), color: c.textPrimary }]}>
          {link.title}
        </Text>
        <Text numberOfLines={1} style={[styles.meta, { fontSize: v(11), marginTop: v(2), color: c.textTertiary }]}>
          {link.source_domain}
          {showDots ? ` · ${link.saved_at}` : ''}
        </Text>
      </View>
      {showDots ? (
        <View style={[styles.dots, { marginLeft: v(4) }]} pointerEvents="none">
          <Icon name="dots" size={v(16)} color={c.textTertiary} />
        </View>
      ) : (
        <Text
          style={[styles.time, { fontSize: v(10.5), marginLeft: v(4), color: c.textTertiary }]}
        >
          {link.saved_at}
        </Text>
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
  const v = useRefScale();
  const { c } = useTheme();
  const theme = themesFor(c)[collection.color_key];
  const box = iconSize === 38 ? v(38) : v(44);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={collection.name}
      onPress={onPress}
      style={[
        styles.card,
        {
          gap: v(12),
          borderRadius: v(17),
          padding: v(10),
          paddingHorizontal: v(13),
          marginBottom: v(8),
          backgroundColor: c.cardBg,
        },
      ]}
    >
      <View
        style={[
          styles.icon,
          { backgroundColor: theme.bg, width: box, height: box, borderRadius: iconSize === 38 ? v(12) : v(14) },
        ]}
      >
        <CollectionIcon
          iconKey={collection.icon_key}
          size={iconSize === 38 ? v(18) : v(21)}
          color={theme.fg}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.name, { fontSize: v(13.5), color: c.textPrimary }]}>{collection.name}</Text>
        <Text style={[styles.count, { fontSize: v(11), marginTop: v(2), color: c.textTertiary }]}>
          {collection.link_count ?? 0} links
        </Text>
      </View>
      <Icon name="chevronRight" size={v(16)} color={c.textTertiary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', alignSelf: 'stretch' },
  thumb: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  thumbText: { fontWeight: '800' },
  textWrap: { flex: 1, minWidth: 0 },
  title: { fontWeight: '700' },
  meta: {},
  time: {},
  dots: {},
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#14161e',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  icon: { alignItems: 'center', justifyContent: 'center' },
  name: { fontWeight: '700' },
  count: {},
});
