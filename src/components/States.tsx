import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { useTheme } from '../app/providers/ThemeProvider';

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

const styles = StyleSheet.create({
  wrap: { padding: 24, alignItems: 'center' },
  text: { fontSize: 12.5, textAlign: 'center', lineHeight: 19 },
});
