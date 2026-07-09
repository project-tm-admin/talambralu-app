/**
 * Push notification service — expo-notifications + FCM
 * Lazy-loaded: native module is only accessed at call time, never at import time.
 * Gracefully no-ops if the native module is missing (old dev builds).
 */
import { Platform } from 'react-native';

let _N = null;
function N() {
  if (!_N) {
    try {
      _N = require('expo-notifications');
      _N.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge:  true,
        }),
      });
    } catch (e) {
      console.warn('[Notif] expo-notifications unavailable in this build:', e.message);
      return null;
    }
  }
  return _N;
}

function getDevice() {
  try { return require('expo-device'); } catch { return null; }
}

export async function setupNotifications() {
  const notif = N();
  const device = getDevice();
  if (!notif) return null;

  if (device && !device.isDevice) {
    console.log('[Notif] Push notifications only work on physical devices');
    return null;
  }

  const { status: existing } = await notif.getPermissionsAsync();
  let finalStatus = existing;

  if (existing !== 'granted') {
    const { status } = await notif.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('[Notif] Permission denied');
    return null;
  }

  if (Platform.OS === 'android') {
    await notif.setNotificationChannelAsync('default', {
      name: 'Talambralu',
      importance: notif.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#8B1F2E',
    });
    await notif.setNotificationChannelAsync('messages', {
      name: 'Messages',
      importance: notif.AndroidImportance.HIGH,
      vibrationPattern: [0, 250],
      lightColor: '#8B1F2E',
      sound: 'default',
    });
    await notif.setNotificationChannelAsync('interests', {
      name: 'Interests & Matches',
      importance: notif.AndroidImportance.DEFAULT,
      lightColor: '#8B1F2E',
    });
  }

  try {
    const token = (await notif.getExpoPushTokenAsync()).data;
    return token;
  } catch (e) {
    console.warn('[Notif] Token fetch failed:', e.message);
    return null;
  }
}

export function subscribeToNotifications(onReceive, onTap) {
  const notif = N();
  if (!notif) return () => {};
  const recvSub = notif.addNotificationReceivedListener(onReceive);
  const tapSub  = notif.addNotificationResponseReceivedListener(response => {
    onTap?.(response.notification.request.content.data);
  });
  return () => { recvSub.remove(); tapSub.remove(); };
}

export async function getLastNotificationResponse() {
  const notif = N();
  return notif ? notif.getLastNotificationResponseAsync() : null;
}

export async function scheduleLocalNotification(title, body, data = {}, seconds = 1) {
  const notif = N();
  if (!notif) return;
  await notif.scheduleNotificationAsync({
    content: { title, body, data, sound: 'default' },
    trigger: { seconds },
  });
}

export async function setBadgeCount(count) {
  const notif = N();
  if (!notif) return;
  await notif.setBadgeCountAsync(count);
}
