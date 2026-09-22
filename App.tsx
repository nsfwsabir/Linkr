import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/app/navigation/RootNavigator';
import { AuthProvider } from './src/app/providers/AuthProvider';
import { LinksProvider } from './src/app/providers/LinksProvider';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <LinksProvider>
          <RootNavigator />
          <StatusBar style="dark" />
        </LinksProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
