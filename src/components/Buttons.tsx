import React from 'react';
import { Text, Pressable, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { useRefScale } from '../utils/useRefScale';
import { Icon, IconName } from './Icon';
import { useTheme } from '../app/providers/ThemeProvider';

export function PrimaryButton({
  title,
  icon,
  onPress,
  style,
  accessibilityLabel,
  compact = false,
}: {
  title: string;
  icon?: IconName;
  onPress?: () => void;
  style?: ViewStyle;
  accessibilityLabel?: string;
  /** Slightly shorter/tighter variant for in-page actions. Off by default so
   *  the full-height (50) sign-in / create-account buttons are unaffected. */
  compact?: boolean;
}) {
  const v = useRefScale();
  const { c } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      onPress={onPress}
      style={[
        styles.base,
        {
          gap: v(8),
          height: v(compact ? 46 : 50),
          borderRadius: v(compact ? 13 : 14),
          marginTop: v(6),
          backgroundColor: c.inverse,
        },
        style,
      ]}
    >
      {icon ? <Icon name={icon} size={v(16)} color={c.inverseText} /> : null}
      <Text style={[styles.text, { fontSize: v(compact ? 14 : 14.5), color: c.inverseText }]}>
        {title}
      </Text>
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
  const { c } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={[
        styles.outline,
        {
          gap: v(10),
          height: v(46),
          borderRadius: v(14),
          backgroundColor: c.cardBg,
          borderColor: c.border,
        },
        style,
      ]}
    >
      {icon ? <Icon name={icon} size={v(18)} color={c.textPrimary} /> : null}
      <Text style={[styles.outlineText, { fontSize: v(13.5), color: c.textPrimary }, textStyle]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { fontWeight: '700' },
  outline: {
    flexDirection: 'row',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#14161e',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  outlineText: { fontWeight: '600' },
});
