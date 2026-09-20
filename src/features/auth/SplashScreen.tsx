import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../app/navigation/RootNavigator';
import { useRefScale } from '../../utils/useRefScale';
import { colors } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export function SplashScreen({ navigation }: Props) {
  const v = useRefScale();
  const orb = v(108);
  useEffect(() => {
    const t = setTimeout(() => navigation.replace('Onboarding'), 1400);
    return () => clearTimeout(t);
  }, [navigation]);

  return (
    <LinearGradient colors={['#eef1f5', '#e6e9ef']} style={styles.container}>
      <SafeAreaView edges={['top', 'bottom']} style={styles.safe}>
      <View style={[styles.content, { gap: v(20), marginTop: v(-26) }]}>
        <View style={[styles.orbWrap, { width: orb, height: orb }]}>
          <LinearGradient
            colors={['#fef8ec', '#cfe1fb', '#9dbdf2', '#e2a06e', '#d98a55']}
            locations={[0, 0.32, 0.52, 0.82, 1]}
            start={{ x: 0.32, y: 0.28 }}
            end={{ x: 0.9, y: 1 }}
            style={[styles.orb, { width: orb, height: orb, borderRadius: orb / 2 }]}
          />
          <View
            style={[
              styles.orbHighlight,
              { top: v(16), left: v(20), width: v(28), height: v(18), borderRadius: v(9) },
            ]}
          />
        </View>
        <Text style={[styles.wordmark, { fontSize: v(29), letterSpacing: v(-0.6) }]}>Linker</Text>
        <Text style={[styles.tag, { fontSize: v(13.5), lineHeight: v(20) }]}>
          Save today.{'\n'}Explore tomorrow.
        </Text>
      </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  orbWrap: {
    shadowColor: '#4664be',
    shadowOpacity: 0.3,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 22 },
    elevation: 12,
  },
  orb: {},
  orbHighlight: { position: 'absolute', backgroundColor: 'rgba(255,255,255,0.6)' },
  wordmark: { fontWeight: '800', color: colors.textPrimary, textAlign: 'center' },
  tag: { color: colors.textSecondary, textAlign: 'center' },
});
