import React from 'react';
import { Text, Pressable, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { Icon, IconName } from './Icon';
import { colors, radii, spacing } from '../theme';

export function PrimaryButton({
  title,
  icon,
  onPress,
  style,
  accessibilityLabel,
}: {
  title: string;
  icon?: IconName;
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
      {icon ? <Icon name={icon} size={16} color="#fff" /> : null}
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

export function OutlineButton({
  title,
  icon,
  onPress,
  style,
  textStyle,
}: {
  title: string;
  icon?: IconName;
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
      {icon ? <Icon name={icon} size={18} color={colors.textPrimary} /> : null}
      <Text style={[styles.outlineText, textStyle]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    gap: 8,
    height: spacing.primaryButtonHeight,
    borderRadius: radii.input,
    backgroundColor: colors.dark,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  text: { color: '#fff', fontSize: 14.5, fontWeight: '700' },
  outline: {
    flexDirection: 'row',
    gap: 10,
    height: 46,
    borderRadius: radii.input,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#14161e',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  outlineText: { fontSize: 13.5, fontWeight: '600', color: colors.textPrimary },
});
