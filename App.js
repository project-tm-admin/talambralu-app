/**
 * App.js — entry point
 * - Hides native splash screen once Firebase auth resolves
 * - Wraps everything in AppProvider
 * - Sets up notification listeners for navigation
 */
import 'expo-dev-client'; // comment out if not using dev client
import React, { useEffect, useCallback, useRef } from 'react';
import { LogBox } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppProvider, useApp } from './src/store/AppContext';
import Navigation from './src/navigation';
import { subscribeToNotifications, getLastNotificationResponse } from './src/services/notifications';
import { initializePurchases } from './src/services/purchases';

// Keep splash visible while auth resolves
SplashScreen.preventAutoHideAsync();

// Suppress known harmless warnings
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'AsyncStorage has been extracted',
  '[Agora]',
]);

function AppInner() {
  const { authLoading, firebaseUser, isAuthenticated } = useApp();
  const navigationRef = useRef(null);

  const onReady = useCallback(async () => {
    if (!authLoading) {
      await SplashScreen.hideAsync();
    }
  }, [authLoading]);

  useEffect(() => {
    if (!authLoading) {
      SplashScreen.hideAsync();
    }
  }, [authLoading]);

  // Init RevenueCat once user is known
  useEffect(() => {
    if (firebaseUser) {
      initializePurchases(firebaseUser.uid).catch(() => {});
    }
  }, [firebaseUser?.uid]);

  // Handle notification taps → navigate to relevant screen
  useEffect(() => {
    const unsub = subscribeToNotifications(
      () => {}, // foreground — handled by system
      (data) => {
        if (!navigationRef.current) return;
        if (data?.type === 'message' && data.conversationId) {
          navigationRef.current.navigate('Chat', { conversationId: data.conversationId });
        } else if (data?.type === 'interest') {
          navigationRef.current.navigate('MainTabs', { screen: 'Inbox' });
        } else if (data?.type === 'match') {
          navigationRef.current.navigate('MainTabs', { screen: 'Matches' });
        }
      }
    );

    // Handle cold-start notification tap
    getLastNotificationResponse().then(response => {
      if (!response || !navigationRef.current) return;
      const data = response.notification.request.content.data;
      if (data?.type === 'message' && data.conversationId) {
        setTimeout(() => {
          navigationRef.current?.navigate('Chat', { conversationId: data.conversationId });
        }, 1000);
      }
    });

    return unsub;
  }, []);

  return (
    <Navigation navigationRef={navigationRef} onReady={onReady} />
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <AppInner />
      </AppProvider>
    </GestureHandlerRootView>
  );
}
