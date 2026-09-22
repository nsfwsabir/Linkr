import React from 'react';
import { Platform, View } from 'react-native';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../providers/AuthProvider';
import { useTheme } from '../providers/ThemeProvider';
import { BottomNav } from '../../components/BottomNav';
import { SplashScreen } from '../../features/auth/SplashScreen';
import { OnboardingScreen } from '../../features/auth/OnboardingScreen';
import { SignInScreen } from '../../features/auth/SignInScreen';
import { CreateAccountScreen } from '../../features/auth/CreateAccountScreen';
import { HomeScreen } from '../../features/links/HomeScreen';
import { CollectionsScreen } from '../../features/collections/CollectionsScreen';
import { CollectionViewScreen } from '../../features/collections/CollectionViewScreen';
import { LinkDetailScreen } from '../../features/links/LinkDetailScreen';
import { ProfileScreen } from '../../features/profile/ProfileScreen';
import { EditProfileScreen } from '../../features/profile/EditProfileScreen';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  SignIn: undefined;
  CreateAccount: undefined;
  Main: undefined;
  CollectionView: { collectionId: string };
  LinkDetail: { linkId: string };
  EditProfile: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Collections: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      // eslint-disable-next-line react/no-unstable-nested-components
      tabBar={(props) => <BottomNav {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Collections" component={CollectionsScreen} />
      <Tab.Screen name="Settings" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const { session, loading } = useAuth();
  const { dark, c } = useTheme();
  const navTheme = {
    ...(dark ? DarkTheme : DefaultTheme),
    colors: {
      ...(dark ? DarkTheme.colors : DefaultTheme.colors),
      background: c.screenBg,
      card: c.screenBg,
      text: c.textPrimary,
      border: c.border,
    },
  };
  if (loading) {
    // Hold splash while restoring the Supabase session — avoids stack flash.
    return <View style={{ flex: 1, backgroundColor: c.screenBg }} />;
  }
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          // Match screen bg so the native window never flashes white mid-push.
          contentStyle: { backgroundColor: c.screenBg },
          // Fade avoids Android default-slide jank while heavy detail mounts.
          // simple_push is iOS-only and maps to DEFAULT on Android (jittery).
          animation: Platform.OS === 'ios' ? 'simple_push' : 'fade',
          autoHideHomeIndicator: true,
        }}
      >
        {session ? (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="CollectionView" component={CollectionViewScreen} />
            <Stack.Screen name="LinkDetail" component={LinkDetailScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
