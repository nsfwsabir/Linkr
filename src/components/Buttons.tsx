import React from 'react';
import { View, Text, Pressable, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { colors, radii, spacing } from '../theme';

export function PrimaryButton({
  title,
  onPress,
  style,
  accessibilityLabel,
}: {
  title: string;
  onPress?: () => void;
  style?: ViewStyle;
  accessibilityLabel?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      onPress={onPress}
      style={[styles.base, style]}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

export function OutlineButton({
  title,
  onPress,
  style,
  textStyle,
}: {
  title: string;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={[styles.outline, style]}
    >
      <Text style={[styles.outlineText, textStyle]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: spacing.primaryButtonHeight,
    borderRadius: radii.input,
    backgroundColor: colors.dark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { color: '#fff', fontSize: 14.5, fontWeight: '700' },
  outline: {
    height: 46,
    borderRadius: radii.input,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineText: { fontSize: 13.5, fontWeight: '600', color: colors.textPrimary },
});
