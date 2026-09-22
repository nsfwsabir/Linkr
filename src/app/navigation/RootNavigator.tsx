import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../providers/AuthProvider';
import { BottomNav } from '../../components/BottomNav';
import { SplashScreen } from '../../features/auth/SplashScreen';
import { OnboardingScreen } from '../../features/auth/OnboardingScreen';
import { SignInScreen } from '../../features/auth/SignInScreen';
import { CreateAccountScreen } from '../../features/auth/CreateAccountScreen';
import { HomeScreen } from '../../features/links/HomeScreen';
import { CollectionsScreen } from '../../features/collections/CollectionsScreen';
import { CollectionViewScreen } from '../../features/collections/CollectionViewScreen';
import { LinkDetailScreen } from '../../features/links/LinkDetailScreen';
import { SearchScreen } from '../../features/search/SearchScreen';
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
  Search: undefined;
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
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Settings" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const { session, loading } = useAuth();
  if (loading) {
    // Hold splash while restoring the Supabase session — avoids stack flash.
    return <View style={{ flex: 1, backgroundColor: '#eef1f5' }} />;
  }
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
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
