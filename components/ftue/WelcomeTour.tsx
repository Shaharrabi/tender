/**
 * WelcomeTour — Simple 4-step welcome modal for first launch.
 *
 * Replaces the spotlight-based GuidedTour which had layout measurement
 * issues on web. This version is a centred modal-style overlay that works
 * reliably on both iOS and web. No DOM measurements, no ref registry.
 *
 * Steps walk the user through: Welcome → Assessment → Couple Portal → Ready
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Colors,
  Spacing,
  FontSizes,
  BorderRadius,
  FontFamilies,
} from '@/constants/theme';

interface Step {
  emoji: string;
  title: string;
  body: string;
  ctaLabel?: string;
  ctaRoute?: string;
}

const STEPS: Step[] = [
  {
    emoji: '🌱',
    title: 'Welcome to Tender',
    body: "You just took the bravest step — showing up. This is your space to understand yourself, grow in love, and build the relationship you deserve.",
  },
  {
    emoji: '🧬',
    title: 'Start with Your Assessment',
    body: "Six short assessments map how you attach, feel, fight, and connect. They take about 10 minutes each and unlock your personal portrait — everything else builds from there.",
  },
  {
    emoji: '💑',
    title: 'The Couple Portal',
    body: "Invite your partner and a shared space opens — your relationship portrait, conflict map, Nuance AI couple coaching, and a 12-step growth journey together.",
  },
  {
    emoji: '✨',
    title: "You're Ready",
    body: "Start your first assessment now. Your portrait unlocks as you go — every answer adds a layer of understanding.",
    ctaLabel: 'Begin My First Assessment →',
    ctaRoute: '/(app)/assessment',
  },
];

interface WelcomeTourProps {
  onComplete: () => void;
}

export const WelcomeTour: React.FC<WelcomeTourProps> = ({ onComplete }) => {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;

  useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(20);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 280, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 280, useNativeDriver: true }),
    ]).start();
  }, [stepIndex]);

  const handleNext = () => {
    if (isLast) {
      onComplete();
      if (step.ctaRoute) {
        router.push(step.ctaRoute as any);
      }
    } else {
      setStepIndex((i) => i + 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleSkip}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.card,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Progress dots */}
          <View style={styles.dotsRow}>
            {STEPS.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  i === stepIndex && styles.dotActive,
                  i < stepIndex && styles.dotDone,
                ]}
              />
            ))}
          </View>

          {/* Emoji */}
          <Text style={styles.emoji}>{step.emoji}</Text>

          {/* Title */}
          <Text style={styles.title}>{step.title}</Text>

          {/* Body */}
          <Text style={styles.body}>{step.body}</Text>

          {/* CTA button */}
          <Pressable
            style={({ pressed }) => [styles.ctaButton, pressed && styles.ctaButtonPressed]}
            onPress={handleNext}
            accessibilityRole="button"
            accessibilityLabel={step.ctaLabel ?? (isLast ? 'Finish' : 'Next')}
          >
            <Text style={styles.ctaText}>
              {step.ctaLabel ?? (isLast ? 'Begin →' : 'Next →')}
            </Text>
          </Pressable>

          {/* Skip */}
          {!isLast && (
            <Pressable onPress={handleSkip} style={styles.skipButton} accessibilityRole="button">
              <Text style={styles.skipText}>Skip tour</Text>
            </Pressable>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

const { width } = Dimensions.get('window');
const CARD_WIDTH = Math.min(width - Spacing.xl * 2, 380);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(45, 34, 38, 0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: Spacing.xs,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.border,
  },
  dotActive: {
    backgroundColor: Colors.primary,
    width: 20,
  },
  dotDone: {
    backgroundColor: Colors.primaryFaded,
  },
  emoji: {
    fontSize: 48,
    marginBottom: Spacing.xs,
  },
  title: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.headingM,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 28,
  },
  body: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  ctaButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.pill,
    marginTop: Spacing.sm,
    width: '100%',
    alignItems: 'center',
  },
  ctaButtonPressed: {
    opacity: 0.85,
  },
  ctaText: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.body,
    color: Colors.white,
    fontWeight: '600',
  },
  skipButton: {
    paddingVertical: Spacing.xs,
  },
  skipText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.textMuted,
  },
});
