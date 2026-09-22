/**
 * Bottom navigation — floating liquid-glass pill (iOS style).
 * Used as the custom tabBar for MainTabs.
 */
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useRefScale } from '../utils/useRefScale';
import { Icon, IconName } from './Icon';
import { useTheme } from '../app/providers/ThemeProvider';

const TABS: { name: string; label: string; icon: IconName }[] = [
  { name: 'Home', label: 'Home', icon: 'home' },
  { name: 'Collections', label: 'Collections', icon: 'grid' },
  { name: 'Settings', label: 'Settings', icon: 'settings' },
];

export function BottomNav({ state, navigation }: BottomTabBarProps) {
  const v = useRefScale();
  const insets = useSafeAreaInsets();
  const { dark, c } = useTheme();
  const radius = v(28);

  return (
    <View
      pointerEvents="box-none"
      style={[styles.host, { left: v(44), right: v(44), bottom: insets.bottom + v(10) }]}
    >
      <BlurView
        intensity={dark ? 45 : 65}
        tint={dark ? 'dark' : 'light'}
        experimentalBlurMethod="dimezisBlurView"
        style={[
          styles.pill,
          {
            borderRadius: radius,
            paddingVertical: v(8),
            paddingHorizontal: v(6),
            backgroundColor: dark ? 'rgba(30,33,38,0.62)' : 'rgba(255,255,255,0.65)',
            borderColor: dark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.9)',
            shadowColor: '#000',
            shadowOpacity: dark ? 0.35 : 0.14,
            shadowRadius: v(16),
            shadowOffset: { width: 0, height: v(8) },
            elevation: 10,
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
              style={[styles.item, { gap: v(3), minWidth: v(56), paddingVertical: v(4) }]}
            >
              <Icon name={t.icon} size={v(21)} color={color} />
              <Text
                style={[
                  styles.label,
                  { fontSize: v(9.5), color },
                  active && styles.labelActive,
                ]}
              >
                {t.label}
              </Text>
            </Pressable>
          );
        })}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  host: { position: 'absolute' },
  pill: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  item: { alignItems: 'center', justifyContent: 'center' },
  label: { fontWeight: '500' },
  labelActive: { fontWeight: '700' },
});
