import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../app/navigation/RootNavigator';
import { colors, typography } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export function SplashScreen({ navigation }: Props) {
  useEffect(() => {
    const t = setTimeout(() => navigation.replace('Onboarding'), 1200);
    return () => clearTimeout(t);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.orb} accessibilityRole="image" accessibilityLabel="Linker orb" />
      <Text style={styles.wordmark}>Linker</Text>
      <Text style={styles.tag}>Save today.{'\n'}Explore tomorrow.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    backgroundColor: '#eef1f5',
  },
  orb: {
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: '#9dbdf2',
  },
  wordmark: { ...typography.wordmark, color: colors.textPrimary },
  tag: { color: colors.textSecondary, fontSize: 13.5, lineHeight: 20, textAlign: 'center' },
});
