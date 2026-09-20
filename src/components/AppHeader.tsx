import React, { ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRefScale } from '../utils/useRefScale';
import { colors } from '../theme';

export function AppHeader({
  title,
  right,
}: {
  title: string;
  right?: ReactNode;
}) {
  const v = useRefScale();
  return (
    <View
      style={[
        styles.row,
        { paddingHorizontal: v(22), paddingTop: v(12), paddingBottom: v(14) },
      ]}
      accessibilityRole="header"
    >
      <Text style={[styles.title, { fontSize: v(23), letterSpacing: v(-0.3) }]}>{title}</Text>
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
  const d = v(33);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={[styles.round, { width: d, height: d, borderRadius: d / 2 }, dark && styles.roundDark]}
      hitSlop={8}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontWeight: '800', color: colors.textPrimary },
  round: { alignItems: 'center', justifyContent: 'center', backgroundColor: colors.inputBg },
  roundDark: { backgroundColor: colors.dark },
});
