import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '@/context/AuthContext';
import { GuestProvider } from '@/context/GuestContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <GuestProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(app)" />
        </Stack>
        <StatusBar style="dark" />
      </GuestProvider>
    </AuthProvider>
  );
}
