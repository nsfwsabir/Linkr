import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../app/navigation/RootNavigator';
import { Screen } from '../../components/Screen';
import { Icon } from '../../components/Icon';
import { colors } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

function Tile({
  size,
  kind,
  radius,
  circle,
  style,
  icon,
  iconColor,
}: {
  size: 'lg' | 'sm' | 'xs';
  kind: 'blue' | 'orange' | 'white';
  radius?: number;
  circle?: boolean;
  style?: object;
  icon?: 'link2' | 'image' | 'search' | 'folder';
  iconColor?: string;
}) {
  const dims =
    size === 'lg'
      ? { w: 80, h: 80, r: 25 }
      : size === 'sm'
        ? { w: 52, h: 52, r: 17 }
        : { w: 32, h: 32, r: 11 };
  const bg = kind === 'blue' ? '#2f6fed' : kind === 'orange' ? '#f5a623' : '#fff';
  const fg = kind === 'white' ? '#50545c' : '#fff';
  return (
    <View
      style={[
        styles.tile,
        {
          width: dims.w,
          height: dims.h,
          borderRadius: circle ? dims.w / 2 : (radius ?? dims.r),
          backgroundColor: bg,
        },
        style,
      ]}
    >
      {icon ? <Icon name={icon} size={dims.w * 0.42} color={iconColor ?? fg} /> : null}
    </View>
  );
}

function Page1() {
  return (
    <View style={styles.illustration}>
      <Tile size="sm" kind="white" style={{ position: 'absolute', top: 0, right: 30 }} icon="image" />
      <Tile
        size="xs"
        kind="orange"
        circle
        style={{ position: 'absolute', bottom: 4, right: 2 }}
      />
      <Tile
        size="lg"
        kind="blue"
        style={{ position: 'absolute', top: 26, left: 6 }}
        icon="link2"
      />
    </View>
  );
}

function Page2() {
  return (
    <View style={styles.illustration}>
      <Tile size="sm" kind="white" style={{ position: 'absolute', top: 0, right: 22 }} icon="search" />
      <Tile
        size="xs"
        kind="orange"
        style={{ position: 'absolute', bottom: 8, left: 4 }}
        icon="folder"
        iconColor="#fff"
      />
      <Tile
        size="lg"
        kind="blue"
        style={{ position: 'absolute', top: 28, left: 32 }}
        icon="folder"
      />
    </View>
  );
}

function Page3() {
  return (
    <View style={styles.illustration}>
      <View style={styles.centerBox}>
        <View style={styles.mockBack} />
        <View style={styles.mockFront}>
          <LinearGradient
            colors={['#dbe6fb', '#eef1f5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.mockThumb}
          />
          <View style={styles.mockRow}>
            <View style={styles.mockHeart}>
              <Icon name="heart" size={11} color={colors.pink} />
            </View>
            <Text style={styles.mockRowText}>Read Later</Text>
          </View>
          <View style={styles.mockLine} />
          <View style={[styles.mockLine, { width: '70%' }]} />
        </View>
      </View>
    </View>
  );
}

const PAGES = [
  {
    title: 'Save links that matter',
    desc: 'Keep your favorite articles, videos, tools and more — all in one place.',
    art: <Page1 />,
  },
  {
    title: 'Organize your way',
    desc: 'Use collections to keep everything in order.',
    art: <Page2 />,
  },
  {
    title: 'Come back anytime',
    // Preserved verbatim from HTML source of truth (PRD §4.1).
    desc: "Uave now. Explore when you're ready.",
    art: <Page3 />,
  },
];

export function OnboardingScreen({ navigation }: Props) {
  const [index, setIndex] = useState(0);
  const page = PAGES[index];
  const last = index === PAGES.length - 1;

  return (
    <Screen padded={false}>
      <View style={styles.inner}>
        {page.art}
        <View style={styles.body}>
          <Text style={styles.title}>{page.title}</Text>
          <Text style={styles.desc}>{page.desc}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={last ? 'Get started' : 'Next onboarding step'}
          onPress={() => (last ? navigation.replace('SignIn') : setIndex(index + 1))}
          style={styles.next}
        >
          <Icon name="arrowRight" size={19} color={colors.textPrimary} />
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  inner: { flex: 1 },
  illustration: { position: 'relative', height: 140, marginTop: 36, marginHorizontal: 24 },
  centerBox: { flex: 1, alignItems: 'center' },
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#14161e',
    shadowOpacity: 0.14,
    shadowRadius: 26,
    shadowOffset: { width: 0, height: 14 },
    elevation: 6,
  },
  mockBack: {
    position: 'absolute',
    width: 148,
    height: 104,
    top: 6,
    borderRadius: 18,
    backgroundColor: '#e3e6eb',
  },
  mockFront: {
    position: 'absolute',
    width: 172,
    height: 120,
    top: 32,
    borderRadius: 18,
    backgroundColor: '#fff',
    padding: 13,
    gap: 9,
    shadowColor: '#14161e',
    shadowOpacity: 0.12,
    shadowRadius: 26,
    shadowOffset: { width: 0, height: 14 },
    elevation: 6,
  },
  mockThumb: { height: 26, borderRadius: 8 },
  mockRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  mockHeart: {
    width: 20,
    height: 20,
    borderRadius: 7,
    backgroundColor: colors.pinkBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mockRowText: { fontSize: 11.5, fontWeight: '700', color: colors.textPrimary },
  mockLine: { height: 6, borderRadius: 3, backgroundColor: '#eef0f3' },
  body: { paddingTop: 22, paddingHorizontal: 24 },
  title: {
    fontSize: 21,
    fontWeight: '800',
    lineHeight: 27,
    marginBottom: 9,
    letterSpacing: -0.3,
    color: colors.textPrimary,
  },
  desc: { fontSize: 13, color: colors.textSecondary, lineHeight: 21 },
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
    shadowColor: '#14161e',
    shadowOpacity: 0.16,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
});
