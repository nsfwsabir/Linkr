import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../app/navigation/RootNavigator';
import { Screen } from '../../components/Screen';
import { OutlineButton } from '../../components/Buttons';
import { useAuth } from '../../app/providers/AuthProvider';
import { useRefScale } from '../../utils/useRefScale';
import { colors } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

export function SignInScreen({ navigation }: Props) {
  const v = useRefScale();
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
  };

  return (
    <Screen padded={false}>
      <View style={[styles.content, { gap: v(38), paddingHorizontal: v(24) }]}>
        <View style={styles.top}>
          <Text style={[styles.wordmark, { fontSize: v(29), letterSpacing: v(-0.6) }]}>Linker</Text>
          <Text style={[styles.tag, { marginTop: v(8), fontSize: v(13.5), lineHeight: v(20) }]}>
            Your links, always with you.
          </Text>
        </View>
        <View style={styles.buttons}>
          <OutlineButton
            icon="google"
            title={busy ? 'Opening Google…' : 'Continue with Google'}
            onPress={handleGoogle}
          />
          <View style={{ height: v(10) }} />
          <OutlineButton
            icon="apple"
            title="Continue with Apple"
            onPress={() =>
              setError('Apple sign-in is not enabled in this build. Use Google or Email.')
            }
          />
          <View style={{ height: v(10) }} />
          <OutlineButton
            icon="mail"
            title="Continue with Email"
            onPress={() => navigation.navigate('CreateAccount')}
          />
        </View>
        {error ? <Text style={[styles.error, { fontSize: v(12) }]}>{error}</Text> : null}
      </View>
      <Text
        style={[
          styles.legal,
          { fontSize: v(10.5), lineHeight: v(17), paddingHorizontal: v(20), paddingBottom: v(24) },
        ]}
      >
        By continuing, you agree to our{'\n'}Terms and Privacy Policy.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, justifyContent: 'center' },
  top: { alignItems: 'center' },
  wordmark: { fontWeight: '800', color: colors.textPrimary, textAlign: 'center' },
  tag: { color: colors.textSecondary, textAlign: 'center' },
  buttons: {},
  error: { color: colors.pink, textAlign: 'center' },
  legal: { textAlign: 'center', color: colors.textTertiary },
});
