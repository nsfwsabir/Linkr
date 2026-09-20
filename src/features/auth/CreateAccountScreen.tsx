import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../app/navigation/RootNavigator';
import { Screen } from '../../components/Screen';
import { AppTextInput } from '../../components/Inputs';
import { PrimaryButton } from '../../components/Buttons';
import { Icon } from '../../components/Icon';
import { useAuth } from '../../app/providers/AuthProvider';
import { colors } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateAccount'>;

export function CreateAccountScreen({ navigation }: Props) {
  const { signUpWithEmail, signInWithEmail, signInMock, isConfigured } = useAuth();
  const [mode, setMode] = useState<'signup' | 'signin'>('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async () => {
    if (!isConfigured) {
      signInMock();
      return;
    }
    if (!email.trim() || password.length < 6) {
      setError('Enter a valid email and a password of at least 6 characters.');
      return;
    }
    if (mode === 'signup' && !name.trim()) {
      setError('Enter your name to create an account.');
      return;
    }
    setBusy(true);
    setError(null);
    const { error: err } =
      mode === 'signup'
        ? await signUpWithEmail(name, email, password)
        : await signInWithEmail(email, password);
    setBusy(false);
    if (err) setError(err);
    else if (mode === 'signup') {
      setError('Account created. Check your email to confirm before signing in.');
    }
  };

  return (
    <Screen padded={false}>
      <View style={styles.navHeader}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => navigation.goBack()}
          style={styles.iconBtn}
        >
          <Icon name="arrowLeft" size={17} color={colors.textPrimary} />
        </Pressable>
      </View>
      <View style={styles.form}>
        <Text style={styles.title}>
          {mode === 'signup' ? 'Create your account' : 'Welcome back'}
        </Text>
        <Text style={styles.sub}>
          {mode === 'signup' ? 'Get started with Linker' : 'Sign in to Linker'}
        </Text>
        {mode === 'signup' ? (
          <AppTextInput icon="user" placeholder="Name" value={name} onChangeText={setName} autoCapitalize="words" />
        ) : null}
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
        />
        <AppTextInput
          icon="lock"
          placeholder="Password"
          value={password}
          onChangeText={(t) => {
            setPassword(t);
            setError(null);
          }}
          secureTextEntry
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <PrimaryButton
          title={busy ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Sign in'}
          onPress={handleSubmit}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={mode === 'signup' ? 'Switch to sign in' : 'Switch to create account'}
          onPress={() => {
            setMode(mode === 'signup' ? 'signin' : 'signup');
            setError(null);
          }}
        >
          <Text style={styles.footer}>
            {mode === 'signup' ? 'Already have an account? ' : "Don't have an account? "}
            <Text style={styles.signin}>{mode === 'signup' ? 'Sign in' : 'Create one'}</Text>
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingHorizontal: 22,
    paddingBottom: 4,
  },
  iconBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  form: { paddingTop: 14, paddingHorizontal: 24, flex: 1 },
  title: { fontSize: 23, fontWeight: '800', letterSpacing: -0.3, color: colors.textPrimary, marginBottom: 6 },
  sub: { fontSize: 13.5, color: colors.textSecondary, marginBottom: 24 },
  error: { color: colors.pink, fontSize: 12, marginBottom: 8 },
  footer: { textAlign: 'center', fontSize: 12.5, color: colors.textTertiary, marginTop: 16 },
  signin: { color: colors.textPrimary, fontWeight: '700' },
});
