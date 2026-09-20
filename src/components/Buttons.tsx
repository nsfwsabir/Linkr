import React from 'react';
import { Text, Pressable, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { useRefScale } from '../utils/useRefScale';
import { Icon, IconName } from './Icon';
import { colors } from '../theme';

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
  const v = useRefScale();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      onPress={onPress}
      style={[styles.base, { gap: v(8), height: v(50), borderRadius: v(14), marginTop: v(6) }, style]}
    >
      {icon ? <Icon name={icon} size={v(16)} color="#fff" /> : null}
      <Text style={[styles.text, { fontSize: v(14.5) }]}>{title}</Text>
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
  const v = useRefScale();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={[styles.outline, { gap: v(10), height: v(46), borderRadius: v(14) }, style]}
    >
      {icon ? <Icon name={icon} size={v(18)} color={colors.textPrimary} /> : null}
      <Text style={[styles.outlineText, { fontSize: v(13.5) }, textStyle]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    backgroundColor: colors.dark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { color: '#fff', fontWeight: '700' },
  outline: {
    flexDirection: 'row',
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
  outlineText: { fontWeight: '600', color: colors.textPrimary },
});
