import { useEffect, useRef } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppState } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import {
  Jost_300Light,
  Jost_400Regular,
  Jost_500Medium,
  Jost_600SemiBold,
  Jost_700Bold,
} from '@expo-google-fonts/jost';
import {
  JosefinSans_300Light,
  JosefinSans_400Regular,
  JosefinSans_500Medium,
  JosefinSans_600SemiBold,
} from '@expo-google-fonts/josefin-sans';
import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_400Regular_Italic,
  PlayfairDisplay_600SemiBold,
  PlayfairDisplay_700Bold,
} from '@expo-google-fonts/playfair-display';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/services/query-client';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { GuestProvider } from '@/context/GuestContext';
import { GamificationProvider } from '@/context/GamificationContext';
import { FirstTimeProvider } from '@/context/FirstTimeContext';
import { NetworkProvider } from '@/context/NetworkContext';
import OfflineBanner from '@/components/ui/OfflineBanner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SoundHaptics } from '@/services/SoundHapticsService';
import { registerAllAppSounds } from '@/services/sounds';
import {
  registerAndStorePushToken,
  scheduleWeeklyCheckIn,
  scheduleDailyReminder,
  cancelWeeklyCheckIn,
  cancelDailyReminder,
} from '@/services/notifications';
import { startSession, endSession } from '@/services/session-time';

// Keep splash screen visible while loading fonts
SplashScreen.preventAutoHideAsync();

/** Registers push token + schedules local notifications once authed.
 *  Respects user notification preferences from AsyncStorage. */
function NotificationSetup() {
  const { session } = useAuth();
  const userId = session?.user?.id;

  useEffect(() => {
    if (!userId) return;
    // Non-blocking: register push token
    registerAndStorePushToken(userId).catch(() => {});
    // Schedule notifications only if user has them enabled
    (async () => {
      try {
        const stored = await AsyncStorage.getItem('tender_notification_prefs');
        const prefs = stored ? JSON.parse(stored) : null;
        const timeHour = prefs?.reminderTime === 'afternoon' ? 13
          : prefs?.reminderTime === 'evening' ? 19
          : 8; // morning default

        // Weekly check-in (dailyCheckInReminder controls the weekly check-in)
        if (prefs?.dailyCheckInReminder === false) {
          await cancelWeeklyCheckIn();
        } else {
          await scheduleWeeklyCheckIn(timeHour, 0);
        }

        // Daily practice reminder
        if (prefs?.practiceReminders === false) {
          await cancelDailyReminder();
        } else {
          await scheduleDailyReminder(timeHour, 0);
        }
      } catch {
        // If we can't read prefs, don't schedule anything — safe default
      }
    })();
  }, [userId]);

  return null;
}

/** Tracks time spent in the app via AppState foreground/background transitions. */
function SessionTracker() {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    // Start session on mount
    startSession();

    const sub = AppState.addEventListener('change', (nextState) => {
      if (appState.current.match(/inactive|background/) && nextState === 'active') {
        startSession();
      } else if (appState.current === 'active' && nextState.match(/inactive|background/)) {
        endSession();
      }
      appState.current = nextState;
    });

    return () => {
      endSession();
      sub.remove();
    };
  }, []);

  return null;
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    // Jost — Display & Headings (Futura-inspired)
    Jost_300Light,
    Jost_400Regular,
    Jost_500Medium,
    Jost_600SemiBold,
    Jost_700Bold,
    // Josefin Sans — Body & UI Text
    JosefinSans_300Light,
    JosefinSans_400Regular,
    JosefinSans_500Medium,
    JosefinSans_600SemiBold,
    // Playfair Display — Accent Serif (scores, quotes, special moments)
    PlayfairDisplay_400Regular,
    PlayfairDisplay_400Regular_Italic,
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Initialize sound & haptics system + register all sound files
  useEffect(() => {
    SoundHaptics.init();
    registerAllAppSounds();
    return () => {
      SoundHaptics.cleanup();
    };
  }, []);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <NetworkProvider>
        <AuthProvider>
          <NotificationSetup />
          <SessionTracker />
          <GamificationProvider>
            <GuestProvider>
              <FirstTimeProvider>
                <OfflineBanner />
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="index" />
                  <Stack.Screen name="(auth)" />
                  <Stack.Screen name="(onboarding)" />
                  <Stack.Screen name="(app)" />
                </Stack>
                <StatusBar style="dark" />
              </FirstTimeProvider>
            </GuestProvider>
          </GamificationProvider>
        </AuthProvider>
      </NetworkProvider>
    </QueryClientProvider>
  );
}
