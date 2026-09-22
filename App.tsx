import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/app/navigation/RootNavigator';
import { AuthProvider } from './src/app/providers/AuthProvider';
import { LinksProvider } from './src/app/providers/LinksProvider';
import { ThemeProvider, useTheme } from './src/app/providers/ThemeProvider';

function ThemedStatusBar() {
  const { dark } = useTheme();
  return <StatusBar style={dark ? 'light' : 'dark'} />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <LinksProvider>
            <RootNavigator />
            <ThemedStatusBar />
          </LinksProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
