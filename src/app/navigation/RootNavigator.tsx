import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { useAuth } from '../providers/AuthProvider';
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

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  SignIn: undefined;
  CreateAccount: undefined;
  Main: undefined;
  CollectionView: { collectionId: string };
  LinkDetail: { linkId: string };
};

export type MainTabParamList = {
  Home: undefined;
  Collections: undefined;
  Search: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return <Text style={{ fontSize: 18 }}>{focused ? '●' : '○'}</Text>;
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarLabelStyle: { fontSize: 9.5 },
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBarIcon: ({ focused }) => <TabIcon label={route.name} focused={focused} />,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Collections" component={CollectionsScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const { session } = useAuth();
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {session ? (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="CollectionView" component={CollectionViewScreen} />
            <Stack.Screen name="LinkDetail" component={LinkDetailScreen} />
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
