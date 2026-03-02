import { Stack, Redirect, usePathname } from 'expo-router';
import { ActivityIndicator, View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useGuest } from '@/context/GuestContext';
import { Colors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';

// Routes guests CAN access
const GUEST_ALLOWED_ROUTES = [
  'home',
  'assessment',
  'tender-assessment',
  'results',
  'portrait',
  'assessment-matrix',
  'exercises',
  'exercise',
  'courses',
  'microcourse',
  'privacy',
];

// Routes guests CANNOT access (chat, growth writes, couple features, settings)
const GUEST_RESTRICTED_ROUTES = [
  'chat',
  'growth',
  'step-detail',
  'treatment-plan',
  'partner',
  'couple-portal',
  'journal',
  'sharing-settings',
  'notification-settings',
  'notification-feed',
  'consent-waiver',
  'relationship-mode',
  'building-bridges',
  'support-groups',
  'community',
  'dating-well',
  'find-therapist',
];

export default function AppLayout() {
  const { session, loading } = useAuth();
  const { isGuest } = useGuest();
  const pathname = usePathname();
  const router = useRouter();
  const [showGuestModal, setShowGuestModal] = useState(false);

  // Check if current route is restricted for guests
  useEffect(() => {
    if (isGuest && !session) {
      const currentRoute = pathname.split('/').pop() || '';
      if (GUEST_RESTRICTED_ROUTES.includes(currentRoute)) {
        setShowGuestModal(true);
      }
    }
  }, [pathname, isGuest, session]);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} accessibilityLabel="Loading" />;
  }

  if (!session && !isGuest) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <>
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
        <Stack.Screen name="assessment" options={{ gestureEnabled: false }} />
        <Stack.Screen name="tender-assessment" options={{ gestureEnabled: false }} />
        <Stack.Screen name="results" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="portrait" options={{ animation: 'fade_from_bottom' }} />
        <Stack.Screen name="chat" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="exercises" />
        <Stack.Screen name="courses" />
        <Stack.Screen name="microcourse" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="exercise" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="journal" options={{ animation: 'fade_from_bottom' }} />
        <Stack.Screen name="growth" />
        <Stack.Screen name="step-detail" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="treatment-plan" />
        <Stack.Screen name="partner" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="couple-portal" options={{ animation: 'fade_from_bottom' }} />
        <Stack.Screen name="find-therapist" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="community" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="privacy" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="consent-waiver" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="sharing-settings" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="notification-settings" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="assessment-matrix" options={{ animation: 'fade_from_bottom' }} />
        <Stack.Screen name="relationship-mode" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="dating-well" options={{ animation: 'fade_from_bottom' }} />
        <Stack.Screen name="building-bridges" options={{ animation: 'fade_from_bottom' }} />
        <Stack.Screen name="support-groups" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="notification-feed" options={{ animation: 'slide_from_bottom' }} />
      </Stack>

      {/* Guest restriction modal */}
      <Modal
        visible={showGuestModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowGuestModal(false)}
      >
        <View style={guestStyles.overlay}>
          <View style={guestStyles.modal}>
            <Text style={guestStyles.title}>Account Required</Text>
            <Text style={guestStyles.message}>
              Create an account to access this feature. Your assessment data will be saved.
            </Text>
            <TouchableOpacity
              style={guestStyles.signUpButton}
              onPress={() => {
                setShowGuestModal(false);
                router.replace('/(auth)/register');
              }}
              accessibilityRole="button"
              accessibilityLabel="Sign up"
            >
              <Text style={guestStyles.signUpText}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={guestStyles.continueButton}
              onPress={() => {
                setShowGuestModal(false);
                router.back();
              }}
              accessibilityRole="button"
              accessibilityLabel="Continue as guest"
            >
              <Text style={guestStyles.continueText}>Continue as Guest</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const guestStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(45, 34, 38, 0.5)',
  },
  modal: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginHorizontal: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.md,
    maxWidth: 340,
    width: '100%',
  },
  title: {
    fontSize: FontSizes.headingM,
    fontWeight: '600',
    color: Colors.text,
  },
  message: {
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  signUpButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.pill,
    width: '100%',
    alignItems: 'center',
  },
  signUpText: {
    color: Colors.white,
    fontSize: FontSizes.body,
    fontWeight: '600',
  },
  continueButton: {
    paddingVertical: Spacing.sm,
  },
  continueText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.bodySmall,
  },
});
