import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '../../components/AppHeader';
import { Icon, IconName } from '../../components/Icon';
import { useAuth } from '../../app/providers/AuthProvider';
import { mockUser } from '../../utils/mockData';
import { useRefScale } from '../../utils/useRefScale';
import { colors } from '../../theme';

const ROWS: { label: string; icon: IconName; value: string }[] = [
  { label: 'Settings', icon: 'settings', value: '' },
  { label: 'Sync', icon: 'refresh', value: 'On' },
  { label: 'Help & Support', icon: 'help', value: '' },
  { label: 'About', icon: 'info', value: '' },
];

export function ProfileScreen() {
  const v = useRefScale();
  const { signOut, user } = useAuth();
  const displayName =
    (user as { user_metadata?: { display_name?: string } })?.user_metadata?.display_name ??
    mockUser.name;
  const email = (user as { email?: string })?.email ?? mockUser.email;
  const avatar = v(50);

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <AppHeader title="Profile" />
      <View
        style={[
          styles.profileRow,
          { gap: v(13), paddingTop: v(4), paddingHorizontal: v(22), paddingBottom: v(20) },
        ]}
      >
        <View
          style={[styles.avatar, { width: avatar, height: avatar, borderRadius: avatar / 2 }]}
          accessibilityRole="image"
          accessibilityLabel="Profile avatar"
        >
          <Icon name="user" size={v(24)} color="#9aa0a8" />
        </View>
        <View>
          <Text style={[styles.name, { fontSize: v(15.5) }]}>{displayName}</Text>
          <Text style={[styles.email, { fontSize: v(11.5), marginTop: v(2) }]}>{email}</Text>
        </View>
      </View>
      <View style={[styles.menu, { paddingHorizontal: v(22) }]}>
        {ROWS.map((r) => (
          <View key={r.label} style={[styles.menuRow, { gap: v(11), paddingVertical: v(11) }]}>
            <View style={[styles.menuIcon, { width: v(29), height: v(29), borderRadius: v(9) }]}>
              <Icon name={r.icon} size={v(15)} color="#6a6e76" />
            </View>
            <Text style={[styles.label, { fontSize: v(13) }]}>{r.label}</Text>
            {r.value ? (
              <Text style={[styles.value, { fontSize: v(12), marginRight: v(2) }]}>{r.value}</Text>
            ) : null}
            <Icon name="chevronRight" size={v(15)} color={colors.textTertiary} />
          </View>
        ))}
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
          },
        ]}
      >
        <Text style={[styles.signoutText, { fontSize: v(13.5) }]}>Sign Out</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.screenBg },
  profileRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { backgroundColor: '#dfe2e8', alignItems: 'center', justifyContent: 'center' },
  name: { fontWeight: '800', color: colors.textPrimary },
  email: { color: colors.textTertiary },
  menu: {},
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuIcon: { backgroundColor: colors.inputBg, alignItems: 'center', justifyContent: 'center' },
  label: { flex: 1, fontWeight: '600', color: colors.textPrimary },
  value: { color: colors.textTertiary },
  signout: { backgroundColor: colors.signoutBg, alignItems: 'center', justifyContent: 'center' },
  signoutText: { color: colors.signoutText, fontWeight: '700' },
});
