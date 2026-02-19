/**
 * JourneyUnlockOverlay — Celebration moment after first assessment.
 *
 * Full-screen modal shown ONCE when user returns to home after completing
 * their first assessment. Plays badge-unlock sound + haptic, shows warm
 * animated content, and offers navigation to the Healing Journey.
 *
 * AsyncStorage key: 'has_seen_journey_unlock'
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
  FadeIn,
  FadeInDown,
} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Colors,
  Spacing,
  FontFamilies,
  FontSizes,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import { SeedlingIcon, CoupleIcon, SparkleIcon } from '@/assets/graphics/icons';
import { SoundHaptics } from '@/services/SoundHapticsService';

const { width: W } = Dimensions.get('window');
const STORAGE_KEY = 'has_seen_journey_unlock';

// ─── Helpers (exported for home screen check) ──────────

export async function hasSeenJourneyUnlock(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEY);
    return value === 'true';
  } catch {
    return false;
  }
}

export async function markJourneyUnlockSeen(): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, 'true');
  } catch {
    // Safe to ignore
  }
}

// ─── Props ─────────────────────────────────────────────

interface JourneyUnlockOverlayProps {
  onDismiss: () => void;
  onExploreJourney: () => void;
}

// ─── Gentle Pulse Ring ─────────────────────────────────

function PulseRing() {
  const scale = useSharedValue(0.85);
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 2400, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.85, { duration: 2400, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: 2400, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.6, { duration: 2400, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.pulseRing, style]} />
  );
}

// ─── Component ─────────────────────────────────────────

export default function JourneyUnlockOverlay({
  onDismiss,
  onExploreJourney,
}: JourneyUnlockOverlayProps) {

  // Play celebration sound on mount
  useEffect(() => {
    SoundHaptics.playBadgeUnlock();
    markJourneyUnlockSeen();
  }, []);

  return (
    <Modal visible transparent animationType="fade">
      <View style={styles.backdrop}>
        <Animated.View
          entering={FadeIn.duration(600)}
          style={styles.container}
        >
          {/* Decorative sparkle */}
          <Animated.View
            entering={FadeInDown.delay(200).duration(500)}
            style={styles.sparkleRow}
          >
            <SparkleIcon size={18} color={Colors.primary + '80'} />
          </Animated.View>

          {/* Icon card with pulse */}
          <Animated.View
            entering={FadeInDown.delay(300).duration(600)}
            style={styles.iconSection}
          >
            <PulseRing />
            <View style={styles.iconCircle}>
              <SeedlingIcon size={40} color={Colors.primary} />
            </View>
          </Animated.View>

          {/* Title */}
          <Animated.View entering={FadeInDown.delay(500).duration(600)}>
            <Text style={styles.title}>
              Your Healing Journey{'\n'}Has Begun
            </Text>
          </Animated.View>

          {/* Subtitle */}
          <Animated.View entering={FadeInDown.delay(700).duration(600)}>
            <Text style={styles.subtitle}>
              You have taken the first step. The Twelve Steps, daily practices,
              and your growth arc are now open to explore.
            </Text>
          </Animated.View>

          {/* Couple Portal teaser */}
          <Animated.View
            entering={FadeInDown.delay(900).duration(600)}
            style={styles.coupleTeaser}
          >
            <CoupleIcon size={18} color={Colors.secondary} />
            <Text style={styles.coupleTeaserText}>
              When both partners complete their portraits, the Couple Portal
              unlocks shared insights and relational coaching.
            </Text>
          </Animated.View>

          {/* Buttons */}
          <Animated.View
            entering={FadeInDown.delay(1100).duration(600)}
            style={styles.buttonRow}
          >
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={onExploreJourney}
              activeOpacity={0.8}
            >
              <SeedlingIcon size={18} color={Colors.white} />
              <Text style={styles.primaryButtonText}>Explore Your Journey</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={onDismiss}
              activeOpacity={0.7}
            >
              <Text style={styles.secondaryButtonText}>Continue to Home</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </View>
    </Modal>
  );
}

// ─── Styles ────────────────────────────────────────────

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  container: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    ...Shadows.card,
  },
  sparkleRow: {
    marginBottom: Spacing.sm,
  },
  iconSection: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  pulseRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: Colors.primary + '40',
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: FontFamilies.accent,
    fontSize: FontSizes.headingL,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: FontSizes.headingL * 1.25,
    marginBottom: Spacing.md,
  },
  subtitle: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: FontSizes.body * 1.5,
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.sm,
  },
  coupleTeaser: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    backgroundColor: Colors.backgroundAlt || Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  coupleTeaserText: {
    flex: 1,
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    lineHeight: FontSizes.caption * 1.5,
  },
  buttonRow: {
    width: '100%',
    gap: Spacing.sm,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    ...Shadows.card,
  },
  primaryButtonText: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.body,
    fontWeight: '600',
    color: Colors.white,
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  secondaryButtonText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.textMuted,
  },
});
