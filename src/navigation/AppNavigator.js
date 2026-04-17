import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { COLORS, FONTS } from '../theme';

// Auth
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// User
import UserHomeScreen from '../screens/user/UserHomeScreen';
import WeekDetailScreen from '../screens/user/WeekDetailScreen';
import RunSessionScreen from '../screens/user/RunSessionScreen';
import FeedbackScreen from '../screens/user/FeedbackScreen';

// PT
import PTDashboardScreen from '../screens/pt/PTDashboardScreen';
import ClientDetailScreen from '../screens/pt/ClientDetailScreen';

// Admin
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import ManagePTsScreen from '../screens/admin/ManagePTsScreen';
import ManageClientsScreen from '../screens/admin/ManageClientsScreen';
import AllFeedbackScreen from '../screens/admin/AllFeedbackScreen';

// Shared
import ProfileScreen from '../screens/shared/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const headerStyle = {
  backgroundColor: COLORS.white,
  shadowColor: 'transparent',
  elevation: 0,
  borderBottomWidth: 1,
  borderBottomColor: COLORS.border,
};

const headerTitleStyle = {
  fontWeight: '700',
  fontSize: FONTS.size.md,
  color: COLORS.dark,
};

// ─── User Tabs ────────────────────────────────────────────────────────────────
function UserHomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerStyle, headerTitleStyle, headerBackTitleVisible: false }}
    >
      <Stack.Screen name="UserHome" component={UserHomeScreen} options={{ title: 'My Training' }} />
      <Stack.Screen name="WeekDetail" component={WeekDetailScreen} options={({ route }) => ({ title: `Week ${route.params.week}` })} />
      <Stack.Screen name="RunSession" component={RunSessionScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Feedback" component={FeedbackScreen} options={{ title: 'Session Feedback' }} />
    </Stack.Navigator>
  );
}

function UserTabs() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: COLORS.white, borderTopColor: COLORS.border, paddingBottom: Math.max(insets.bottom, 4), height: 56 + Math.max(insets.bottom, 0) },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarLabelStyle: { fontSize: FONTS.size.xs, fontWeight: '600' },
        tabBarIcon: ({ focused, color }) => {
          const icons = { Training: focused ? '🏃' : '🏃', Profile: focused ? '👤' : '👤' };
          return <Text style={{ fontSize: 20 }}>{icons[route.name] || '●'}</Text>;
        },
      })}
    >
      <Tab.Screen name="Training" component={UserHomeStack} />
      <Tab.Screen name="Profile" component={ProfileScreen}
        options={{ headerShown: true, headerStyle, headerTitleStyle, title: 'My Profile' }} />
    </Tab.Navigator>
  );
}

// ─── PT Tabs ──────────────────────────────────────────────────────────────────
function PTStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerStyle, headerTitleStyle, headerBackTitleVisible: false }}
    >
      <Stack.Screen name="PTDashboard" component={PTDashboardScreen} options={{ title: 'My Clients' }} />
      <Stack.Screen name="ClientDetail" component={ClientDetailScreen}
        options={({ route }) => {
          return { title: 'Client Detail' };
        }}
      />
    </Stack.Navigator>
  );
}

function PTTabs() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: COLORS.white, borderTopColor: COLORS.border, paddingBottom: Math.max(insets.bottom, 4), height: 56 + Math.max(insets.bottom, 0) },
        tabBarActiveTintColor: COLORS.pt,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarLabelStyle: { fontSize: FONTS.size.xs, fontWeight: '600' },
        tabBarIcon: ({ focused }) => {
          const icons = { Clients: '👥', Profile: '👤' };
          return <Text style={{ fontSize: 20 }}>{icons[route.name] || '●'}</Text>;
        },
      })}
    >
      <Tab.Screen name="Clients" component={PTStack} />
      <Tab.Screen name="Profile" component={ProfileScreen}
        options={{ headerShown: true, headerStyle, headerTitleStyle, title: 'My Profile' }} />
    </Tab.Navigator>
  );
}

// ─── Admin Tabs ───────────────────────────────────────────────────────────────
function AdminStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerStyle, headerTitleStyle, headerBackTitleVisible: false }}
    >
      <Stack.Screen name="AdminHome" component={AdminDashboardScreen} options={{ title: 'Admin Portal' }} />
      <Stack.Screen name="ManagePTs" component={ManagePTsScreen} options={{ title: 'Personal Trainers' }} />
      <Stack.Screen name="ManageClients" component={ManageClientsScreen} options={{ title: 'Runners' }} />
      <Stack.Screen name="AllFeedback" component={AllFeedbackScreen} options={{ title: 'All Feedback' }} />
      <Stack.Screen name="ClientDetailAdmin" component={ClientDetailScreen} options={{ title: 'Runner Detail' }} />
    </Stack.Navigator>
  );
}

function AdminTabs() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: COLORS.white, borderTopColor: COLORS.border, paddingBottom: Math.max(insets.bottom, 4), height: 56 + Math.max(insets.bottom, 0) },
        tabBarActiveTintColor: COLORS.superAdmin,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarLabelStyle: { fontSize: FONTS.size.xs, fontWeight: '600' },
        tabBarIcon: () => {
          const icons = { Dashboard: '📊', Profile: '👤' };
          return <Text style={{ fontSize: 20 }}>{icons[route.name] || '●'}</Text>;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={AdminStack} />
      <Tab.Screen name="Profile" component={ProfileScreen}
        options={{ headerShown: true, headerStyle, headerTitleStyle, title: 'My Profile' }} />
    </Tab.Navigator>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function AppNavigator() {
  const { user, loading: authLoading } = useAuth();
  const { initialized } = useData();

  if (authLoading || !initialized) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingLogo}>🏃</Text>
        <Text style={styles.loadingTitle}>Gops Running</Text>
        <ActivityIndicator color={COLORS.primary} style={{ marginTop: 20 }} />
      </View>
    );
  }

  const getAppScreen = () => {
    if (!user) return (
      <>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
      </>
    );
    if (user.role === 'super_admin') return <Stack.Screen name="Admin" component={AdminTabs} options={{ headerShown: false }} />;
    if (user.role === 'pt') return <Stack.Screen name="PT" component={PTTabs} options={{ headerShown: false }} />;
    return <Stack.Screen name="User" component={UserTabs} options={{ headerShown: false }} />;
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animationEnabled: true }}>
        {getAppScreen()}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center',
  },
  loadingLogo: { fontSize: 60 },
  loadingTitle: { fontSize: 36, fontWeight: '900', color: COLORS.dark, marginTop: 8 },
});
