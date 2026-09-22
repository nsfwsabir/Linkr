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
import { useTheme } from '../app/providers/ThemeProvider';

const TABS: { name: string; label: string; icon: IconName }[] = [
  { name: 'Home', label: 'Home', icon: 'home' },
  { name: 'Collections', label: 'Collections', icon: 'grid' },
  { name: 'Search', label: 'Search', icon: 'search' },
  { name: 'Settings', label: 'Settings', icon: 'user' },
];

export function BottomNav({ state, navigation }: BottomTabBarProps) {
  const v = useRefScale();
  const insets = useSafeAreaInsets();
  const { c } = useTheme();
  return (
    <View
      style={[
        styles.bar,
        {
          paddingTop: v(10),
          paddingHorizontal: v(8),
          paddingBottom: Math.max(v(20), insets.bottom),
          borderTopColor: c.border,
          backgroundColor: c.screenBg,
        },
      ]}
    >
      {TABS.map((t) => {
        const route = state.routes.find((r) => r.name === t.name);
        const index = route ? state.routes.indexOf(route) : -1;
        const active = index === state.index;
        const color = active ? c.textPrimary : c.textTertiary;
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
            <Text
              style={[
                styles.label,
                { fontSize: v(9.5), color: active ? c.textPrimary : c.textTertiary },
                active && styles.labelActive,
              ]}
            >
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
  },
  item: { alignItems: 'center' },
  label: { fontWeight: '500' },
  labelActive: { fontWeight: '700' },
});
