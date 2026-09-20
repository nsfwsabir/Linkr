import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../app/navigation/RootNavigator';
import { Screen } from '../../components/Screen';
import { OutlineButton } from '../../components/Buttons';
import { useAuth } from '../../app/providers/AuthProvider';
import { colors, typography } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

export function SignInScreen({ navigation }: Props) {
  const { signIn } = useAuth();
  return (
    <Screen>
      <View style={styles.center}>
        <Text style={styles.wordmark}>Linker</Text>
        <Text style={styles.tag}>Your links, always with you.</Text>
        <View style={styles.buttons}>
          <OutlineButton title="Continue with Google" onPress={signIn} />
          <View style={styles.gap} />
          <OutlineButton title="Continue with Apple" onPress={signIn} />
          <View style={styles.gap} />
          <OutlineButton
            title="Continue with Email"
            onPress={() => navigation.navigate('CreateAccount')}
          />
        </View>
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
  legal: {
    textAlign: 'center',
    fontSize: 10.5,
    color: colors.textTertiary,
    lineHeight: 17,
    paddingBottom: 24,
  },
});
