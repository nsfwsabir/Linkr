import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../app/navigation/RootNavigator';
import { Screen } from '../../components/Screen';
import { AppTextInput } from '../../components/Inputs';
import { PrimaryButton } from '../../components/Buttons';
import { Icon } from '../../components/Icon';
import { useAuth } from '../../app/providers/AuthProvider';
import { useTheme } from '../../app/providers/ThemeProvider';
import { mockUser } from '../../utils/mockData';
import { useRefScale } from '../../utils/useRefScale';
import { colors } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'EditProfile'>;

export function EditProfileScreen({ navigation }: Props) {
  const v = useRefScale();
  const { user, updateProfile } = useAuth();
  const { c } = useTheme();
  const initialName =
    (user as { user_metadata?: { display_name?: string } })?.user_metadata?.display_name ??
    (user as { name?: string })?.name ??
    mockUser.name;
  const initialEmail = (user as { email?: string })?.email ?? mockUser.email;
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const avatar = v(64);
  const iconBtn = v(32);

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Enter your name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Enter a valid email address.');
      return;
    }
    setBusy(true);
    setError(null);
    const { error: err } = await updateProfile(name, email);
    setBusy(false);
    if (err) setError(err);
    else navigation.goBack();
  };

  return (
    <Screen padded={false}>
      <View
        style={[
          styles.navHeader,
          { paddingTop: v(10), paddingHorizontal: v(22), paddingBottom: v(4) },
        ]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => navigation.goBack()}
          style={[styles.iconBtn, { width: iconBtn, height: iconBtn }]}
        >
          <Icon name="arrowLeft" size={v(17)} color={c.textPrimary} />
        </Pressable>
      </View>
      <View style={[styles.form, { paddingTop: v(8), paddingHorizontal: v(24) }]}>
        <Text
          style={[
            styles.title,
            { fontSize: v(23), letterSpacing: v(-0.3), marginBottom: v(6), color: c.textPrimary },
          ]}
        >
          Edit Profile
        </Text>
        <Text style={[styles.sub, { fontSize: v(13.5), marginBottom: v(24), color: c.textSecondary }]}>
          Update your name and email
        </Text>
        <View style={styles.avatarWrap}>
          <View
            style={[
              styles.avatar,
              { backgroundColor: c.avatarBg, width: avatar, height: avatar, borderRadius: avatar / 2 },
            ]}
            accessibilityRole="image"
            accessibilityLabel="Profile avatar"
          >
            <Icon name="user" size={v(28)} color="#9aa0a8" />
          </View>
        </View>
        <AppTextInput
          icon="user"
          placeholder="Name"
          value={name}
          onChangeText={(t) => {
            setName(t);
            setError(null);
          }}
          autoCapitalize="words"
          accessibilityLabel="Display name"
        />
        <AppTextInput
          icon="mail"
          placeholder="Email"
          value={email}
          onChangeText={(t) => {
            setEmail(t);
            setError(null);
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          accessibilityLabel="Email address"
        />
        {error ? (
          <Text style={[styles.error, { fontSize: v(12), marginBottom: v(8) }]}>{error}</Text>
        ) : null}
        <PrimaryButton
          title={busy ? 'Saving…' : 'Save Changes'}
          onPress={() => void handleSave()}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  navHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconBtn: { alignItems: 'center', justifyContent: 'center' },
  form: { flex: 1 },
  title: { fontWeight: '800' },
  sub: {},
  avatarWrap: { alignItems: 'center', marginBottom: 24 },
  avatar: { alignItems: 'center', justifyContent: 'center' },
  error: { color: colors.pink },
});
