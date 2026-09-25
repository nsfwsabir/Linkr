import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors } from '../theme';
import { useTheme } from '../app/providers/ThemeProvider';
import { useRefScale } from '../utils/useRefScale';
import { Icon } from './Icon';

/** Shared empty/loading/error states in the same muted visual language (Design §11). */
export function EmptyState({ message }: { message: string }) {
  const { c } = useTheme();
  return (
    <View style={styles.wrap}>
      <Text style={[styles.text, { color: c.textTertiary }]}>{message}</Text>
    </View>
  );
}

export function ErrorState({ message }: { message: string }) {
  const { c } = useTheme();
  return (
    <View style={styles.wrap} accessibilityRole="alert">
      <Text style={[styles.text, { color: colors.pink }]}>{message}</Text>
    </View>
  );
}

/**
 * Persistent, dismissible notice for sync/database failures. Anchored above the
 * tab bar so a failed save is visible rather than silently dropped.
 */
export function SyncErrorBanner({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss: () => void;
}) {
  const v = useRefScale();
  const { c } = useTheme();
  return (
    <View style={styles.bannerWrap} pointerEvents="box-none">
      <View
        style={[
          styles.banner,
          {
            marginHorizontal: v(16),
            paddingVertical: v(10),
            paddingLeft: v(12),
            paddingRight: v(6),
            borderRadius: v(14),
            backgroundColor: c.signoutBg,
          },
        ]}
        accessibilityRole="alert"
      >
        <Icon name="info" size={v(15)} color={c.signoutText} />
        <Text
          style={[
            styles.bannerText,
            { fontSize: v(12), lineHeight: v(17), color: c.signoutText },
          ]}
        >
          {message}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Dismiss sync error"
          onPress={onDismiss}
          hitSlop={10}
          style={styles.bannerClose}
        >
          <Icon name="close" size={v(14)} color={c.signoutText} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 24, alignItems: 'center' },
  text: { fontSize: 12.5, textAlign: 'center', lineHeight: 19 },
  bannerWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingBottom: 96,
  },
  banner: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  bannerText: { flex: 1, fontWeight: '600' },
  bannerClose: { padding: 4 },
});
