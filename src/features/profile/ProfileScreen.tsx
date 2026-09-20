import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { AppHeader } from '../../components/AppHeader';
import { useAuth } from '../../app/providers/AuthProvider';
import { mockUser } from '../../utils/mockData';
import { colors, radii } from '../../theme';

const ROWS = [
  { label: 'Settings', value: '' },
  { label: 'Sync', value: 'On' },
  { label: 'Help & Support', value: '' },
  { label: 'About', value: '' },
];

export function ProfileScreen() {
  const { signOut, user } = useAuth();
  const displayName =
    (user as { user_metadata?: { display_name?: string } })?.user_metadata?.display_name ??
    mockUser.name;
  const email = (user as { email?: string })?.email ?? mockUser.email;
  return (
    <View style={styles.container}>
      <AppHeader title="Profile" />
      <View style={styles.profileRow}>
        <View style={styles.avatar} accessibilityRole="image" accessibilityLabel="Profile avatar" />
        <View>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>
      </View>
      <View style={styles.menu}>
        {ROWS.map((r) => (
          <View key={r.label} style={styles.menuRow}>
            <View style={styles.menuIcon} />
            <Text style={styles.label}>{r.label}</Text>
            {r.value ? <Text style={styles.value}>{r.value}</Text> : null}
            <Text style={styles.chev}>›</Text>
          </View>
        ))}
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Sign out"
        onPress={() => void signOut()}
        style={styles.signout}
      >
        <Text style={styles.signoutText}>Sign Out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.screenBg },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingHorizontal: 22, paddingBottom: 20 },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#dfe2e8' },
  name: { fontSize: 15.5, fontWeight: '800', color: colors.textPrimary },
  email: { fontSize: 11.5, color: colors.textTertiary, marginTop: 2 },
  menu: { paddingHorizontal: 22 },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuIcon: { width: 29, height: 29, borderRadius: 9, backgroundColor: colors.inputBg },
  label: { flex: 1, fontSize: 13, fontWeight: '600', color: colors.textPrimary },
  value: { fontSize: 12, color: colors.textTertiary, marginRight: 2 },
  chev: { color: colors.textTertiary, fontSize: 15 },
  signout: {
    marginHorizontal: 22,
    marginTop: 16,
    height: 46,
    borderRadius: radii.input,
    backgroundColor: colors.signoutBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signoutText: { color: colors.signoutText, fontSize: 13.5, fontWeight: '700' },
});
