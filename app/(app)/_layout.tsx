import { Stack, Redirect, usePathname } from 'expo-router';
import { ActivityIndicator, View, Text, TouchableOpacity, Modal, StyleSheet, Platform } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useGuest } from '@/context/GuestContext';
import { Colors, Spacing, FontSizes, FontFamilies, BorderRadius, Shadows } from '@/constants/theme';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import { registerAndStorePushToken } from '@/services/notifications';
import { onPartnerNotified } from '@/services/partner-activity-hooks';

// Routes guests CAN access (browse-only — no data writes)
const GUEST_ALLOWED_ROUTES = [
  'home',
  'assessment-matrix',
  'exercises',
  'exercise',
  'courses',
  'microcourse',
  'privacy',
  'terms',
];

// Routes guests CANNOT access (assessments, results, chat, growth, couple features)
const GUEST_RESTRICTED_ROUTES = [
  'assessment',
  'tender-assessment',
  'results',
  'portrait',
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
  const pushRegistered = useRef(false);

  // Register push token once after authenticated user mounts (native only)
  useEffect(() => {
    if (session?.user?.id && !isGuest && !pushRegistered.current && Platform.OS !== 'web') {
      pushRegistered.current = true;
      registerAndStorePushToken(session.user.id).catch(() => {
        // Non-critical — silently ignore; user can still use the app
      });
    }
  }, [session?.user?.id, isGuest]);

  // ─── "Partner notified" confirmation toast ──────────────
  const [showPartnerNotified, setShowPartnerNotified] = useState(false);
  const partnerToastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const unsub = onPartnerNotified(() => {
      // Clear any existing timer so rapid-fire notifications restart the toast
      if (partnerToastTimer.current) clearTimeout(partnerToastTimer.current);
      setShowPartnerNotified(true);
      partnerToastTimer.current = setTimeout(() => setShowPartnerNotified(false), 2500);
    });
    return () => {
      unsub();
      if (partnerToastTimer.current) clearTimeout(partnerToastTimer.current);
    };
  }, []);

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
      <ErrorBoundary fallbackMessage="Something went wrong. Please restart the app or try again.">
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
        <Stack.Screen name="terms" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="more" options={{ animation: 'slide_from_right' }} />
      </Stack>
      </ErrorBoundary>

      {/* "Partner notified" confirmation toast */}
      {showPartnerNotified && (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          style={notifiedStyles.wrap}
          pointerEvents="none"
        >
          <View style={notifiedStyles.pill}>
            <Text style={notifiedStyles.text}>✓ Your partner will see this</Text>
          </View>
        </Animated.View>
      )}

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
              Create a free account to take assessments and access this feature. It only takes a moment.
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

const notifiedStyles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
  },
  pill: {
    backgroundColor: Colors.surfaceElevated,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.pill,
    ...Shadows.elevated,
  },
  text: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
  },
});
