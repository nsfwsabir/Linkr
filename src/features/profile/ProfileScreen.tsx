import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList, RootStackParamList } from '../../app/navigation/RootNavigator';
import { AppHeader } from '../../components/AppHeader';
import { Icon, IconName } from '../../components/Icon';
import { useAuth } from '../../app/providers/AuthProvider';
import { useTheme } from '../../app/providers/ThemeProvider';
import { mockUser } from '../../utils/mockData';
import { useRefScale } from '../../utils/useRefScale';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Settings'>,
  NativeStackScreenProps<RootStackParamList>
>;

type Row = { label: string; icon: IconName; value: string; onPress?: () => void };

export function ProfileScreen({ navigation }: Props) {
  const v = useRefScale();
  const { signOut, user } = useAuth();
  const { dark, c, toggleDark } = useTheme();
  const displayName =
    (user as { user_metadata?: { display_name?: string } })?.user_metadata?.display_name ??
    (user as { name?: string })?.name ??
    mockUser.name;
  const email = (user as { email?: string })?.email ?? mockUser.email;
  const avatar = v(50);

  const rows: Row[] = [
    {
      label: 'Settings',
      icon: 'settings',
      value: '',
      onPress: () => navigation.navigate('EditProfile'),
    },
    { label: 'Sync', icon: 'refresh', value: 'On' },
    { label: 'Help & Support', icon: 'help', value: '' },
    { label: 'About', icon: 'info', value: '' },
    {
      label: 'Dark mode',
      icon: 'settings',
      value: dark ? 'On' : 'Off',
      onPress: toggleDark,
    },
  ];

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.container, { backgroundColor: c.screenBg }]}
    >
      <AppHeader title="Settings" />
      <View
        style={[
          styles.profileRow,
          { gap: v(13), paddingTop: v(4), paddingHorizontal: v(22), paddingBottom: v(20) },
        ]}
      >
        <View
          style={[
            styles.avatar,
            { backgroundColor: c.avatarBg, width: avatar, height: avatar, borderRadius: avatar / 2 },
          ]}
          accessibilityRole="image"
          accessibilityLabel="Profile avatar"
        >
          <Icon name="user" size={v(24)} color="#9aa0a8" />
        </View>
        <View>
          <Text style={[styles.name, { fontSize: v(15.5), color: c.textPrimary }]}>
            {displayName}
          </Text>
          <Text style={[styles.email, { fontSize: v(11.5), marginTop: v(2), color: c.textSecondary }]}>
            {email}
          </Text>
        </View>
      </View>
      <View style={[styles.menu, { paddingHorizontal: v(22) }]}>
        {rows.map((r) => {
          const inner = (
            <>
              <View
                style={[
                  styles.menuIcon,
                  { width: v(29), height: v(29), borderRadius: v(9), backgroundColor: c.inputBg },
                ]}
              >
                <Icon name={r.icon} size={v(15)} color="#6a6e76" />
              </View>
              <Text style={[styles.label, { fontSize: v(13), color: c.textPrimary }]}>
                {r.label}
              </Text>
              {r.value ? (
                <Text style={[styles.value, { fontSize: v(12), marginRight: v(2), color: c.textTertiary }]}>
                  {r.value}
                </Text>
              ) : null}
              <Icon name="chevronRight" size={v(15)} color={c.textTertiary} />
            </>
          );
          const rowStyle = [
            styles.menuRow,
            { gap: v(11), paddingVertical: v(11), borderBottomColor: c.border },
          ];
          return r.onPress ? (
            <Pressable
              key={r.label}
              accessibilityRole="button"
              accessibilityLabel={r.label}
              onPress={r.onPress}
              style={rowStyle}
            >
              {inner}
            </Pressable>
          ) : (
            <View key={r.label} style={rowStyle}>
              {inner}
            </View>
          );
        })}
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Sign out"
        onPress={() => void signOut()}
        style={[
          styles.signout,
          {
            marginHorizontal: v(22),
            marginTop: v(16),
            height: v(46),
            borderRadius: v(14),
            backgroundColor: c.signoutBg,
          },
        ]}
      >
        <Text style={[styles.signoutText, { fontSize: v(13.5), color: c.signoutText }]}>
          Sign Out
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  profileRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { alignItems: 'center', justifyContent: 'center' },
  name: { fontWeight: '800' },
  email: {},
  menu: {},
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  menuIcon: { alignItems: 'center', justifyContent: 'center' },
  label: { flex: 1, fontWeight: '600' },
  value: {},
  signout: { alignItems: 'center', justifyContent: 'center' },
  signoutText: { fontWeight: '700' },
});
