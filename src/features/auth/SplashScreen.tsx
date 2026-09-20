import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../app/navigation/RootNavigator';
import { colors, typography } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export function SplashScreen({ navigation }: Props) {
  useEffect(() => {
    const t = setTimeout(() => navigation.replace('Onboarding'), 1400);
    return () => clearTimeout(t);
  }, [navigation]);

  return (
    <LinearGradient colors={['#eef1f5', '#e6e9ef']} style={styles.container}>
      <SafeAreaView edges={['top', 'bottom']} style={styles.safe}>
      <View style={styles.content}>
        <View style={styles.orbWrap}>
          <LinearGradient
            colors={['#fef8ec', '#cfe1fb', '#9dbdf2', '#e2a06e', '#d98a55']}
            locations={[0, 0.32, 0.52, 0.82, 1]}
            start={{ x: 0.32, y: 0.28 }}
            end={{ x: 0.9, y: 1 }}
            style={styles.orb}
          />
          <View style={styles.orbHighlight} />
        </View>
        <Text style={styles.wordmark}>Linker</Text>
        <Text style={styles.tag}>Save today.{'\n'}Explore tomorrow.</Text>
      </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginTop: -26,
  },
  orbWrap: {
    width: 108,
    height: 108,
    shadowColor: '#4664be',
    shadowOpacity: 0.3,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 22 },
    elevation: 12,
  },
  orb: { width: 108, height: 108, borderRadius: 54 },
  orbHighlight: {
    position: 'absolute',
    top: 16,
    left: 20,
    width: 28,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  wordmark: { ...typography.wordmark, color: colors.textPrimary, textAlign: 'center' },
  tag: {
    color: colors.textSecondary,
    fontSize: 13.5,
    lineHeight: 20,
    textAlign: 'center',
  },
});
