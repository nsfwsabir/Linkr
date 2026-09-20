import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme';

export function Screen({
  children,
  style,
  padded = true,
}: {
  children: ReactNode;
  style?: ViewStyle;
  padded?: boolean;
}) {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={[styles.base, padded && styles.padded, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.screenBg },
  base: { flex: 1, backgroundColor: colors.screenBg },
  padded: { paddingHorizontal: spacing.pageHorizontal },
});
