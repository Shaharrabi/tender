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
import {
  SeedlingIcon,
  MirrorIcon,
  HeartDoubleIcon,
  CompassIcon,
} from '@/assets/graphics/icons';
import type { IconProps } from '@/assets/graphics/icons';

interface Step {
  Icon: React.ComponentType<IconProps>;
  iconColor: string;
  title: string;
  body: string;
  /** If true, the last step shows multiple choice buttons instead of a single CTA */
  isChoiceStep?: boolean;
}

const STEPS: Step[] = [
  {
    Icon: SeedlingIcon,
    iconColor: Colors.success,
    title: 'Welcome to Tender',
    body: "You just took the bravest step \u2014 showing up. This is your space to understand yourself, grow in love, and build the relationship you deserve.",
  },
  {
    Icon: MirrorIcon,
    iconColor: Colors.primary,
    title: 'Discover Your Portrait',
    body: "Seven short chapters map how you attach, feel, fight, and connect. About 30 minutes total \u2014 and they unlock your personal portrait. Everything else builds from there.",
  },
  {
    Icon: HeartDoubleIcon,
    iconColor: Colors.accent,
    title: 'The Couple Portal',
    body: "Invite your partner and a shared space opens \u2014 your relationship portrait, conflict map, Nuance AI couple coaching, and a 12-step growth journey together.",
  },
  {
    Icon: CompassIcon,
    iconColor: Colors.secondary,
    title: "Where would you like to start?",
    body: "Your portrait unlocks as you go \u2014 every answer adds a layer of understanding.",
    isChoiceStep: true,
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
    } else {
      setStepIndex((i) => i + 1);
    }
  };

  const handleChoice = (route: string) => {
    onComplete();
    router.push(route as any);
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

          {/* Icon */}
          <View style={styles.iconWrap}>
            <step.Icon size={40} color={step.iconColor} />
          </View>

          {/* Title */}
          <Text style={styles.title}>{step.title}</Text>

          {/* Body */}
          <Text style={styles.body}>{step.body}</Text>

          {/* Choice buttons on last step */}
          {step.isChoiceStep ? (
            <View style={styles.choiceGroup}>
              <Pressable
                style={({ pressed }) => [styles.ctaButton, pressed && styles.ctaButtonPressed]}
                onPress={() => handleChoice('/(app)/tender-assessment')}
                accessibilityRole="button"
                accessibilityLabel="Begin My Assessment"
              >
                <Text style={styles.ctaText}>Begin My Assessment</Text>
              </Pressable>
              <Pressable
                style={styles.skipButton}
                onPress={handleSkip}
                accessibilityRole="button"
                accessibilityLabel="Explore the home page"
              >
                <Text style={styles.skipText}>Explore the home page</Text>
              </Pressable>
            </View>
          ) : (
            <>
              {/* CTA button */}
              <Pressable
                style={({ pressed }) => [styles.ctaButton, pressed && styles.ctaButtonPressed]}
                onPress={handleNext}
                accessibilityRole="button"
                accessibilityLabel="Next"
              >
                <Text style={styles.ctaText}>{'Next \u2192'}</Text>
              </Pressable>

              {/* Skip */}
              <Pressable onPress={handleSkip} style={styles.skipButton} accessibilityRole="button">
                <Text style={styles.skipText}>Skip tour</Text>
              </Pressable>
            </>
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
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
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
  choiceGroup: {
    width: '100%',
    gap: Spacing.sm,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.pill,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  secondaryText: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.body,
    color: Colors.primary,
    fontWeight: '600',
  },
  skipButton: {
    paddingVertical: Spacing.xs,
    alignItems: 'center',
  },
  skipText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.textMuted,
  },
});
