import React, { ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../theme';

export function AppHeader({
  title,
  right,
}: {
  title: string;
  right?: ReactNode;
}) {
  return (
    <View style={styles.row} accessibilityRole="header">
      <Text style={styles.title}>{title}</Text>
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
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={[styles.round, dark && styles.roundDark]}
      hitSlop={8}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.pageHorizontal,
    paddingTop: 12,
    paddingBottom: 14,
  },
  title: { ...typography.screenTitle, color: colors.textPrimary },
  round: {
    width: spacing.roundButton,
    height: spacing.roundButton,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.inputBg,
  },
  roundDark: { backgroundColor: colors.dark },
});
