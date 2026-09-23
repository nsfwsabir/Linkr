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
      screenOptions={{
        headerShown: false,
        // Instant switch avoids the double-exposure ghost of a JS cross-fade.
        animation: 'none',
      }}
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
          // Android: fade_from_bottom intermittently left LinkDetail mounted
          // but stuck at fromAlpha=0 (pure white) under new-arch draw-reorder.
          // `none` matches tabs — reliable paint, no blur blank, no stutter.
          // iOS keeps simple_push (animationDuration is iOS-only).
          animation: Platform.OS === 'ios' ? 'simple_push' : 'none',
          animationDuration: Platform.OS === 'ios' ? 200 : undefined,
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
