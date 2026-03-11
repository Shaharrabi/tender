/**
 * Push Notifications Service — Skeleton (Local-First)
 *
 * Phase 1: Local notifications only (no server infrastructure needed).
 *   - Register for push permissions
 *   - Get Expo push token and store in Supabase
 *   - Schedule local notifications for weekly check-in reminders
 *
 * Phase 2 (future): Server-side push via Supabase edge functions.
 */

import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { supabase } from './supabase';

// ─── Configuration ──────────────────────────────────────

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// ─── Permission & Token Registration ────────────────────

/**
 * Request notification permissions and return the Expo push token.
 * Returns null if permissions are denied or the device doesn't support push.
 */
export async function registerForPushNotifications(): Promise<string | null> {
  // Push tokens only work on physical devices
  if (!Device.isDevice) {
    if (__DEV__) console.log('[Notifications] Skipping — not a physical device');
    return null;
  }

  // Check existing permissions
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // Request if not already granted
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    if (__DEV__) console.log('[Notifications] Permission not granted');
    return null;
  }

  // Android needs a notification channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Tender',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#6B7B9B',
    });
  }

  try {
    const tokenData = await Notifications.getExpoPushTokenAsync();
    return tokenData.data;
  } catch (err) {
    if (__DEV__) console.error('[Notifications] Failed to get push token:', err);
    return null;
  }
}

/**
 * Store the push token in Supabase for later server-side push.
 * Upserts on (user_id, token) to avoid duplicates.
 */
export async function savePushToken(userId: string, token: string): Promise<void> {
  const platform = Platform.OS === 'ios' ? 'ios' : Platform.OS === 'android' ? 'android' : 'web';

  const { error } = await supabase
    .from('push_tokens')
    .upsert(
      {
        user_id: userId,
        token,
        platform,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,token' },
    );

  if (error) {
    if (__DEV__) console.error('[Notifications] Failed to save push token:', error);
  }
}

/**
 * Full registration flow: request permissions → get token → store in DB.
 * Call this on app launch after the user is authenticated.
 */
export async function registerAndStorePushToken(userId: string): Promise<void> {
  const token = await registerForPushNotifications();
  if (token) {
    await savePushToken(userId, token);
    if (__DEV__) console.log('[Notifications] Token registered:', token.slice(0, 20) + '...');
  }
}

// ─── Local Notifications (Phase 1) ──────────────────────

/**
 * Schedule a weekly check-in reminder as a local notification.
 * Runs every Monday at the user's preferred time (default 9 AM).
 */
export async function scheduleWeeklyCheckIn(
  hour: number = 9,
  minute: number = 0,
): Promise<void> {
  // Cancel existing weekly check-in first
  await cancelWeeklyCheckIn();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Weekly Check-In',
      body: 'How are you and your relationship doing this week? Take a moment to reflect.',
      data: { type: 'weekly_checkin' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
      weekday: 2, // Monday (1=Sunday, 2=Monday, ...)
      hour,
      minute,
    },
  });

  if (__DEV__) console.log(`[Notifications] Weekly check-in scheduled for Monday at ${hour}:${String(minute).padStart(2, '0')}`);
}

/**
 * Schedule a daily practice reminder as a local notification.
 */
export async function scheduleDailyReminder(
  hour: number = 9,
  minute: number = 0,
): Promise<void> {
  // Cancel existing daily reminder first
  await cancelDailyReminder();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Your Daily Practice',
      body: 'A small moment of awareness can shift your whole day. Your practice is waiting.',
      data: { type: 'daily_reminder' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });

  if (__DEV__) console.log(`[Notifications] Daily reminder scheduled at ${hour}:${String(minute).padStart(2, '0')}`);
}

/**
 * Cancel all scheduled weekly check-in notifications.
 */
export async function cancelWeeklyCheckIn(): Promise<void> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const notif of scheduled) {
    if (notif.content.data?.type === 'weekly_checkin') {
      await Notifications.cancelScheduledNotificationAsync(notif.identifier);
    }
  }
}

/**
 * Cancel all scheduled daily reminder notifications.
 */
export async function cancelDailyReminder(): Promise<void> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const notif of scheduled) {
    if (notif.content.data?.type === 'daily_reminder') {
      await Notifications.cancelScheduledNotificationAsync(notif.identifier);
    }
  }
}

/**
 * Cancel all scheduled notifications.
 */
export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
