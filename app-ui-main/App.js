import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Navigation from './src/navigation';
import Purchases from 'react-native-purchases';

// TODO: Move to EXPO_PUBLIC_REVENUECAT_APPLE_KEY / EXPO_PUBLIC_REVENUECAT_GOOGLE_KEY env vars before release
const REVENUECAT_API_KEYS = {
  apple: process.env.EXPO_PUBLIC_REVENUECAT_APPLE_KEY ?? 'appl_placeholder_api_key',
  google: process.env.EXPO_PUBLIC_REVENUECAT_GOOGLE_KEY ?? 'goog_placeholder_api_key',
};

export default function App() {
  useEffect(() => {
    try {
      if (Platform.OS === 'ios') {
        Purchases.configure({ apiKey: REVENUECAT_API_KEYS.apple });
      } else if (Platform.OS === 'android') {
        Purchases.configure({ apiKey: REVENUECAT_API_KEYS.google });
      } else {
        console.warn('RevenueCat: unsupported platform', Platform.OS);
      }
    } catch (e) {
      console.error('RevenueCat SDK initialization failed', e);
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <Navigation />
    </GestureHandlerRootView>
  );
}
