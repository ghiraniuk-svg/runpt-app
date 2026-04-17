import 'react-native-gesture-handler';
import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { DataProvider } from './src/context/DataContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  const inner = (
    <SafeAreaProvider>
      <DataProvider>
        <AuthProvider>
          <StatusBar style="dark" />
          <AppNavigator />
        </AuthProvider>
      </DataProvider>
    </SafeAreaProvider>
  );

  // On web: centre the app in a max-width phone-shaped container
  if (Platform.OS === 'web') {
    return (
      <View style={styles.webShell}>
        <View style={styles.webApp}>{inner}</View>
      </View>
    );
  }

  return inner;
}

const styles = StyleSheet.create({
  webShell: {
    flex: 1,
    backgroundColor: '#d0d0d0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  webApp: {
    flex: 1,
    width: '100%',
    maxWidth: 430,
    backgroundColor: '#F5F6FA',
    overflow: 'hidden',
    // subtle shadow to look like a phone on desktop
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
});
