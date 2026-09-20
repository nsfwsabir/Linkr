/**
 * Bottom navigation — exact replica of .bottom-nav from the HTML source.
 * Used as the custom tabBar for MainTabs.
 */
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useRefScale } from '../utils/useRefScale';
import { Icon, IconName } from './Icon';
import { colors } from '../theme';

const TABS: { name: string; label: string; icon: IconName }[] = [
  { name: 'Home', label: 'Home', icon: 'home' },
  { name: 'Collections', label: 'Collections', icon: 'grid' },
  { name: 'Search', label: 'Search', icon: 'search' },
  { name: 'Profile', label: 'Profile', icon: 'user' },
];

export function BottomNav({ state, navigation }: BottomTabBarProps) {
  const v = useRefScale();
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.bar,
        { paddingTop: v(10), paddingHorizontal: v(8), paddingBottom: Math.max(v(20), insets.bottom) },
      ]}
    >
      {TABS.map((t) => {
        const route = state.routes.find((r) => r.name === t.name);
        const index = route ? state.routes.indexOf(route) : -1;
        const active = index === state.index;
        const color = active ? colors.textPrimary : colors.textTertiary;
        return (
          <Pressable
            key={t.name}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={t.label}
            onPress={() => {
              if (route) navigation.navigate(route.name);
            }}
            style={[styles.item, { gap: v(4), minWidth: v(56) }]}
          >
            <Icon name={t.icon} size={v(21)} color={color} />
            <Text style={[styles.label, { fontSize: v(9.5) }, active && styles.labelActive]}>
              {t.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.screenBg,
  },
  item: { alignItems: 'center' },
  label: { fontWeight: '500', color: colors.textTertiary },
  labelActive: { color: colors.textPrimary, fontWeight: '700' },
});
