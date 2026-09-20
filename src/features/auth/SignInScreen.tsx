import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../app/navigation/RootNavigator';
import { Screen } from '../../components/Screen';
import { OutlineButton } from '../../components/Buttons';
import { useAuth } from '../../app/providers/AuthProvider';
import { colors, typography } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

export function SignInScreen({ navigation }: Props) {
  const { signInWithGoogle, signInMock, isConfigured } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleGoogle = async () => {
    if (!isConfigured) {
      signInMock();
      return;
    }
    setBusy(true);
    setError(null);
    const { error: err } = await signInWithGoogle();
    setBusy(false);
    if (err) setError(err);
    // On success the auth-state listener flips the stack to Main.
  };

  return (
    <Screen>
      <View style={styles.center}>
        <Text style={styles.wordmark}>Linker</Text>
        <Text style={styles.tag}>Your links, always with you.</Text>
        <View style={styles.buttons}>
          <OutlineButton
            title={busy ? 'Opening Google…' : 'Continue with Google'}
            onPress={handleGoogle}
          />
          <View style={styles.gap} />
          <OutlineButton
            title="Continue with Apple"
            onPress={() =>
              setError('Apple sign-in is not enabled in this build. Use Google or Email.')
            }
          />
          <View style={styles.gap} />
          <OutlineButton
            title="Continue with Email"
            onPress={() => navigation.navigate('CreateAccount')}
          />
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
      <Text style={styles.legal}>
        By continuing, you agree to our{'\n'}Terms and Privacy Policy.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center' },
  wordmark: { ...typography.wordmark, color: colors.textPrimary, textAlign: 'center' },
  tag: { color: colors.textSecondary, textAlign: 'center', marginTop: 8, fontSize: 13.5 },
  buttons: { marginTop: 38 },
  gap: { height: 10 },
  error: { color: colors.pink, fontSize: 12, textAlign: 'center', marginTop: 12 },
  legal: {
    textAlign: 'center',
    fontSize: 10.5,
    color: colors.textTertiary,
    lineHeight: 17,
    paddingBottom: 24,
  },
});
