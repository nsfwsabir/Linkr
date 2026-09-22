import React, { ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRefScale } from '../utils/useRefScale';
import { useTheme } from '../app/providers/ThemeProvider';

export function AppHeader({
  title,
  right,
}: {
  title: string;
  right?: ReactNode;
}) {
  const v = useRefScale();
  const { c } = useTheme();
  return (
    <View
      style={[
        styles.row,
        { paddingHorizontal: v(22), paddingTop: v(12), paddingBottom: v(14) },
      ]}
      accessibilityRole="header"
    >
      <Text
        style={[styles.title, { fontSize: v(23), letterSpacing: v(-0.3), color: c.textPrimary }]}
      >
        {title}
      </Text>
      {right}
    </View>
  );
}

export function RoundIconButton({
  label,
  onPress,
  children,
  dark = true,
}: {
  label: string;
  onPress?: () => void;
  children: ReactNode;
  dark?: boolean;
}) {
  const v = useRefScale();
  const { c } = useTheme();
  const d = v(33);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={[
        styles.round,
        { width: d, height: d, borderRadius: d / 2, backgroundColor: dark ? c.dark : c.inputBg },
      ]}
      hitSlop={8}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontWeight: '800' },
  round: { alignItems: 'center', justifyContent: 'center' },
});
