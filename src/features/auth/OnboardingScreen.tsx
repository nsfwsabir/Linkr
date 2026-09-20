import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../app/navigation/RootNavigator';
import { Screen } from '../../components/Screen';
import { colors } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const PAGES = [
  {
    title: 'Save links that matter',
    desc: 'Keep your favorite articles, videos, tools and more — all in one place.',
  },
  { title: 'Organize your way', desc: 'Use collections to keep everything in order.' },
  {
    title: 'Come back anytime',
    // Preserved verbatim from HTML source of truth (PRD §4.1).
    desc: "Uave now. Explore when you're ready.",
  },
];

export function OnboardingScreen({ navigation }: Props) {
  const [index, setIndex] = useState(0);
  const page = PAGES[index];
  const last = index === PAGES.length - 1;

  return (
    <Screen>
      <View style={styles.illustration}>
        <View style={styles.tile} />
      </View>
      <Text style={styles.title}>{page.title}</Text>
      <Text style={styles.desc}>{page.desc}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={last ? 'Get started' : 'Next onboarding step'}
        onPress={() => (last ? navigation.replace('SignIn') : setIndex(index + 1))}
        style={styles.next}
      >
        <Text style={styles.nextText}>{last ? '✓' : '→'}</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  illustration: { height: 140, marginTop: 36, alignItems: 'flex-start' },
  tile: { width: 80, height: 80, borderRadius: 25, backgroundColor: colors.blue },
  title: { fontSize: 21, fontWeight: '800', marginTop: 22, color: colors.textPrimary },
  desc: { fontSize: 13, color: colors.textSecondary, lineHeight: 21, marginTop: 9 },
  next: {
    position: 'absolute',
    right: 24,
    bottom: 28,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextText: { fontSize: 19, color: colors.textPrimary },
});
