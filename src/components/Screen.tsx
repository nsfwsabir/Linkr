import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRefScale } from '../utils/useRefScale';
import { useTheme } from '../app/providers/ThemeProvider';

export function Screen({
  children,
  style,
  padded = true,
}: {
  children: ReactNode;
  style?: ViewStyle;
  padded?: boolean;
}) {
  const v = useRefScale();
  const { c } = useTheme();
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.screenBg }]} edges={['top', 'bottom']}>
      <View
        style={[
          styles.base,
          { backgroundColor: c.screenBg },
          padded && { paddingHorizontal: v(22) },
          style,
        ]}
      >
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  base: { flex: 1 },
});
