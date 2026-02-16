import { Stack } from 'expo-router';
import { OnboardingProvider } from '@/context/OnboardingContext';

export default function OnboardingLayout() {
  return (
    <OnboardingProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        <Stack.Screen name="welcome" />
        <Stack.Screen name="status" />
        <Stack.Screen name="duration" />
        <Stack.Screen name="goals" />
        <Stack.Screen name="time" />
        <Stack.Screen name="ready" />
      </Stack>
    </OnboardingProvider>
  );
}
