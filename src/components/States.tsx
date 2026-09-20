import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

/** Shared empty/loading/error states in the same muted visual language (Design §11). */
export function EmptyState({ message }: { message: string }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <View style={styles.wrap} accessibilityRole="alert">
      <Text style={[styles.text, styles.error]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 24, alignItems: 'center' },
  text: { color: colors.textTertiary, fontSize: 12.5, textAlign: 'center', lineHeight: 19 },
  error: { color: colors.pink },
});
