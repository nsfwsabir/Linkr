import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../app/navigation/RootNavigator';
import { Screen } from '../../components/Screen';
import { Icon } from '../../components/Icon';
import { useTheme } from '../../app/providers/ThemeProvider';
import { useRefScale } from '../../utils/useRefScale';
import { colors } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

function Tile({
  size,
  kind,
  circle,
  style,
  icon,
  iconColor,
}: {
  size: 'lg' | 'sm' | 'xs';
  kind: 'blue' | 'orange' | 'white';
  circle?: boolean;
  style?: object;
  icon?: 'link2' | 'image' | 'search' | 'folder';
  iconColor?: string;
}) {
  const v = useRefScale();
  const base =
    size === 'lg' ? { w: 80, h: 80, r: 25 } : size === 'sm' ? { w: 52, h: 52, r: 17 } : { w: 32, h: 32, r: 11 };
  const w = v(base.w);
  const bg = kind === 'blue' ? '#2f6fed' : kind === 'orange' ? '#f5a623' : '#fff';
  const fg = kind === 'white' ? '#50545c' : '#fff';
  return (
    <View
      style={[
        styles.tile,
        { width: w, height: v(base.h), borderRadius: circle ? w / 2 : v(base.r), backgroundColor: bg },
        style,
      ]}
    >
      {icon ? (
        <Icon
          name={icon}
          // HTML gives lg/sm tiles a 42% icon; xs tiles use the default 18px icon.
          size={size === 'xs' ? v(18) : Math.round(w * 0.42)}
          color={iconColor ?? fg}
        />
      ) : null}
    </View>
  );
}

function Page1() {
  const v = useRefScale();
  return (
    <View style={[styles.illustration, { height: v(140), marginTop: v(36) }]}>
      <Tile size="sm" kind="white" style={{ position: 'absolute', top: 0, right: v(30) }} icon="image" />
      <Tile size="xs" kind="orange" circle style={{ position: 'absolute', bottom: v(4), right: v(2) }} />
      <Tile size="lg" kind="blue" style={{ position: 'absolute', top: v(26), left: v(6) }} icon="link2" />
    </View>
  );
}

function Page2() {
  const v = useRefScale();
  return (
    <View style={[styles.illustration, { height: v(140), marginTop: v(36) }]}>
      <Tile size="sm" kind="white" style={{ position: 'absolute', top: 0, right: v(22) }} icon="search" />
      <Tile
        size="xs"
        kind="orange"
        style={{ position: 'absolute', bottom: v(8), left: v(4) }}
        icon="folder"
        iconColor="#fff"
      />
      <Tile size="lg" kind="blue" style={{ position: 'absolute', top: v(28), left: v(32) }} icon="folder" />
    </View>
  );
}

function Page3() {
  const v = useRefScale();
  const { c } = useTheme();
  return (
    <View style={[styles.illustration, { height: v(140), marginTop: v(36) }]}>
      <View style={{ width: v(200), alignSelf: 'center', height: '100%' }}>
        <View
          style={[
            styles.mockBack,
            { width: v(148), height: v(104), top: v(6), left: v(72), borderRadius: v(18), backgroundColor: c.screenBgAlt },
          ]}
        />
        <View
          style={[
            styles.mockFront,
            {
              width: v(172),
              height: v(120),
              top: v(32),
              left: v(14),
              borderRadius: v(18),
              padding: v(13),
              gap: v(9),
              backgroundColor: c.cardBg,
            },
          ]}
        >
          <LinearGradient
            colors={['#dbe6fb', '#eef1f5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.mockThumb, { height: v(26), borderRadius: v(8) }]}
          />
          <View style={[styles.mockRow, { gap: v(7) }]}>
            <View
              style={[
                styles.mockHeart,
                { width: v(20), height: v(20), borderRadius: v(7), backgroundColor: c.pinkBg },
              ]}
            >
              <Icon name="heart" size={v(11)} color={colors.pink} />
            </View>
            <Text style={[styles.mockRowText, { fontSize: v(11.5), color: c.textPrimary }]}>
              Read Later
            </Text>
          </View>
          <View style={[styles.mockLine, { height: v(6), borderRadius: v(3), backgroundColor: c.border }]} />
          <View
            style={[styles.mockLine, { height: v(6), borderRadius: v(3), width: '70%', backgroundColor: c.border }]}
          />
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
  const v = useRefScale();
  const { c } = useTheme();
  const [index, setIndex] = useState(0);
  const page = PAGES[index];
  const last = index === PAGES.length - 1;
  const btn = v(44);

  return (
    <Screen padded={false}>
      <View style={styles.inner}>
        {page.art}
        <View style={[styles.body, { paddingTop: v(22), paddingHorizontal: v(24) }]}>
          <Text
            style={[
              styles.title,
              { fontSize: v(21), lineHeight: v(27), marginBottom: v(9), color: c.textPrimary },
            ]}
          >
            {page.title}
          </Text>
          <Text style={[styles.desc, { fontSize: v(13), lineHeight: v(21), color: c.textSecondary }]}>
            {page.desc}
          </Text>
        </View>
        <View style={[styles.nextWrap, { paddingRight: v(24), marginTop: v(88), paddingBottom: v(28) }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={last ? 'Get started' : 'Next onboarding step'}
            onPress={() => (last ? navigation.replace('SignIn') : setIndex(index + 1))}
            style={[
              styles.next,
              {
                width: btn,
                height: btn,
                borderRadius: btn / 2,
                backgroundColor: c.cardBg,
              },
            ]}
          >
            <Icon name="arrowRight" size={v(19)} color={c.textPrimary} />
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  inner: { flex: 1 },
  illustration: { position: 'relative', marginHorizontal: 24 },
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#14161e',
    shadowOpacity: 0.14,
    shadowRadius: 26,
    shadowOffset: { width: 0, height: 14 },
    elevation: 6,
  },
  mockBack: { position: 'absolute' },
  mockFront: {
    position: 'absolute',
    shadowColor: '#14161e',
    shadowOpacity: 0.12,
    shadowRadius: 26,
    shadowOffset: { width: 0, height: 14 },
    elevation: 6,
  },
  mockThumb: {},
  mockRow: { flexDirection: 'row', alignItems: 'center' },
  mockHeart: { alignItems: 'center', justifyContent: 'center' },
  mockRowText: { fontWeight: '700' },
  mockLine: {},
  body: {},
  title: { fontWeight: '800', letterSpacing: -0.3 },
  desc: {},
  nextWrap: { alignItems: 'flex-end' },
  next: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#14161e',
    shadowOpacity: 0.16,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
});
