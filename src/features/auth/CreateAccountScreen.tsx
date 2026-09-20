import React, { useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../app/navigation/RootNavigator';
import { Screen } from '../../components/Screen';
import { AppTextInput } from '../../components/Inputs';
import { PrimaryButton } from '../../components/Buttons';
import { useAuth } from '../../app/providers/AuthProvider';
import { colors } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateAccount'>;

export function CreateAccountScreen({ navigation }: Props) {
  const { signIn } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Screen>
      <Text style={styles.title}>Create your account</Text>
      <Text style={styles.sub}>Get started with Linker</Text>
      <AppTextInput placeholder="Name" value={name} onChangeText={setName} autoCapitalize="words" />
      <AppTextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <AppTextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <PrimaryButton title="Create account" onPress={signIn} />
      <Text style={styles.footer} onPress={() => navigation.goBack()}>
        Already have an account? <Text style={styles.signin}>Sign in</Text>
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 23, fontWeight: '800', color: colors.textPrimary, marginTop: 14 },
  sub: { fontSize: 13.5, color: colors.textSecondary, marginBottom: 24, marginTop: 6 },
  footer: { textAlign: 'center', fontSize: 12.5, color: colors.textTertiary, marginTop: 16 },
  signin: { color: colors.textPrimary, fontWeight: '700' },
});
