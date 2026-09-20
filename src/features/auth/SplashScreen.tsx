import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function SplashScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.wordmark}>Linker</Text>
      <Text style={styles.tag}>Save today. Explore tomorrow.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#eef1f5' },
  wordmark: { fontSize: 29, fontWeight: '800' },
  tag: { color: '#888d96', marginTop: 8 },
});
