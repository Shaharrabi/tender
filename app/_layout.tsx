import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
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
import { SoundHaptics } from '@/services/SoundHapticsService';
import { registerAllAppSounds } from '@/services/sounds';
import { registerAndStorePushToken, refreshNotificationContent } from '@/services/notifications';

// Keep splash screen visible while loading fonts
SplashScreen.preventAutoHideAsync();

/** Registers push token + schedules local notifications once authed. */
function NotificationSetup() {
  const { session } = useAuth();
  const userId = session?.user?.id;

  useEffect(() => {
    if (!userId) return;
    // Non-blocking: register token & refresh notification content with fresh prompts
    registerAndStorePushToken(userId).catch(() => {});
    refreshNotificationContent(9, 0, 9, 0).catch(() => {});
  }, [userId]);

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
