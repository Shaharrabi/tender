import { Stack, Redirect } from 'expo-router';
import { ActivityIndicator } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useGuest } from '@/context/GuestContext';

export default function AppLayout() {
  const { session, loading } = useAuth();
  const { isGuest } = useGuest();

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  if (!session && !isGuest) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 250,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      <Stack.Screen name="home" options={{ animation: 'fade' }} />
      <Stack.Screen name="assessment" />
      <Stack.Screen name="tender-assessment" />
      <Stack.Screen name="results" options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="portrait" options={{ animation: 'fade_from_bottom' }} />
      <Stack.Screen name="chat" options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="exercises" />
      <Stack.Screen name="courses" />
      <Stack.Screen name="microcourse" options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="exercise" options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="journal" options={{ animation: 'fade_from_bottom' }} />
      <Stack.Screen name="growth" />
      <Stack.Screen name="treatment-plan" />
      <Stack.Screen name="partner" options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="couple-portal" options={{ animation: 'fade_from_bottom' }} />
      <Stack.Screen name="find-therapist" options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="community" options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="privacy" options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="consent-waiver" options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="sharing-settings" options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="notification-settings" options={{ animation: 'slide_from_bottom' }} />
    </Stack>
  );
}
