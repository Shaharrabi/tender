/**
 * GuidedTour — Multi-step spotlight walkthrough for first launch.
 *
 * Shows a dark overlay with a spotlight cutout on the current target,
 * a card with title/body, progress dots, and next/skip/done actions.
 * Uses RefRegistry for target measurement.
 *
 * Usage (in home screen):
 *   <GuidedTour
 *     tour={HOME_TOUR}
 *     onComplete={() => markFirstLaunchComplete()}
 *   />
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { RefRegistry, TargetMeasurement } from '@/utils/ftue/refRegistry';
import { Tour, TourStep } from '@/constants/ftue/tourSteps';
import {
  FTUEColors,
  FTUELayout,
  FTUETiming,
  FTUEShadows,
} from '@/constants/ftue/theme';
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
} from '@/constants/theme';

interface GuidedTourProps {
  /** Tour definition */
  tour: Tour;
  /** Called when tour is completed or skipped */
  onComplete: () => void;
  /** Optional scroll view ref for scrolling to off-screen targets */
  scrollRef?: React.RefObject<ScrollView>;
}

export const GuidedTour: React.FC<GuidedTourProps> = ({
  tour,
  onComplete,
  scrollRef,
}) => {
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetLayout, setTargetLayout] = useState<TargetMeasurement | null>(
    null
  );
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const cardFadeAnim = useRef(new Animated.Value(0)).current;

  const currentStep = tour.steps[currentStepIndex];
  const isLastStep = currentStepIndex === tour.steps.length - 1;
  const isFirstStep = currentStepIndex === 0;
  const isCenterStep = currentStep.targetRef === 'none';
  const hasCta = !!currentStep.ctaLabel;

  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  // Measure target and animate in
  useEffect(() => {
    const measureAndShow = async () => {
      // Fade out card
      Animated.timing(cardFadeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start(async () => {
        // Measure target
        if (!isCenterStep) {
          const layout = await RefRegistry.measure(currentStep.targetRef);
          setTargetLayout(layout);
        } else {
          setTargetLayout(null);
        }

        // Fade in everything
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: FTUETiming.tourTransition,
            useNativeDriver: true,
          }),
          Animated.timing(cardFadeAnim, {
            toValue: 1,
            duration: FTUETiming.tourTransition,
            useNativeDriver: true,
          }),
        ]).start();
      });
    };

    measureAndShow();
  }, [currentStepIndex]);

  const handleNext = useCallback(() => {
    if (isLastStep) {
      onComplete();
      // Navigate to CTA route if provided
      if (currentStep.ctaRoute) {
        router.push(currentStep.ctaRoute as any);
      }
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  }, [isLastStep, onComplete, currentStep.ctaRoute, router]);

  const handleSkip = useCallback(() => {
    onComplete();
  }, [onComplete]);

  // Calculate card position
  const getCardStyle = () => {
    if (isCenterStep || !targetLayout) {
      return {
        top: screenHeight * 0.32,
        left: FTUELayout.tourCardMarginH,
        right: FTUELayout.tourCardMarginH,
      };
    }

    const cardHeight = 220; // approximate card height
    const spacing = 20;

    if (currentStep.position === 'bottom') {
      return {
        top: Math.min(
          targetLayout.y + targetLayout.height + spacing,
          screenHeight - cardHeight - 40
        ),
        left: FTUELayout.tourCardMarginH,
        right: FTUELayout.tourCardMarginH,
      };
    } else {
      return {
        top: Math.max(targetLayout.y - cardHeight - spacing, 60),
        left: FTUELayout.tourCardMarginH,
        right: FTUELayout.tourCardMarginH,
      };
    }
  };

  return (
    <Modal transparent visible animationType="none">
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
        {/* Spotlight cutout around target */}
        {!isCenterStep && targetLayout && (
          <View
            style={[
              styles.spotlight,
              {
                top: targetLayout.y - 8,
                left: targetLayout.x - 8,
                width: targetLayout.width + 16,
                height: targetLayout.height + 16,
              },
            ]}
          />
        )}
      </Animated.View>

      {/* Tour card */}
      <Animated.View
        style={[
          styles.tourCard,
          getCardStyle(),
          {
            opacity: cardFadeAnim,
            transform: [
              {
                scale: cardFadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.95, 1],
                }),
              },
            ],
          },
        ]}
        accessibilityRole="alert"
        accessibilityLabel={`Step ${currentStepIndex + 1} of ${tour.steps.length}. ${currentStep.title}. ${currentStep.body}`}
      >
        {/* Progress dots (hide for single-step tours) */}
        {tour.steps.length > 1 && (
          <View style={styles.progressDots}>
            {tour.steps.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentStepIndex && styles.dotActive,
                  index < currentStepIndex && styles.dotComplete,
                ]}
              />
            ))}
          </View>
        )}

        {/* Content */}
        <Text style={styles.title}>{currentStep.title}</Text>
        <Text style={styles.body}>{currentStep.body}</Text>

        {/* Actions */}
        <View style={tour.steps.length === 1 ? styles.actionsCentered : styles.actions}>
          {!isFirstStep && tour.steps.length > 1 ? (
            <Pressable
              style={styles.skipButton}
              onPress={handleSkip}
              accessibilityLabel="Skip tour"
              accessibilityRole="button"
            >
              <Text style={styles.skipText}>Skip tour</Text>
            </Pressable>
          ) : tour.steps.length > 1 ? (
            <View />
          ) : null}

          <Pressable
            style={[styles.nextButton, hasCta && styles.ctaButton]}
            onPress={handleNext}
            accessibilityLabel={hasCta ? currentStep.ctaLabel : isLastStep ? 'Get started' : 'Next step'}
            accessibilityRole="button"
          >
            <Text style={[styles.nextText, hasCta && styles.ctaText]}>
              {hasCta ? currentStep.ctaLabel : isLastStep ? 'Get started' : 'Next'}
            </Text>
          </Pressable>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(45, 34, 38, 0.7)',
  },
  spotlight: {
    position: 'absolute',
    backgroundColor: 'transparent',
    borderRadius: BorderRadius.lg,
    borderWidth: 3,
    borderColor: FTUEColors.spotlightBorder,
    // The spotlight creates a visible border around the target
    // For a true cutout effect, use react-native-hole-view or SVG mask
  },
  tourCard: {
    position: 'absolute',
    backgroundColor: FTUEColors.cardBg,
    borderRadius: FTUELayout.tourCardBorderRadius,
    padding: FTUELayout.tourCardPadding,
    ...FTUEShadows.tourCard,
  },
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.borderLight,
  },
  dotActive: {
    backgroundColor: FTUEColors.highlight,
    width: 24,
  },
  dotComplete: {
    backgroundColor: Colors.textMuted,
  },
  title: {
    ...Typography.headingM,
    color: FTUEColors.title,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  body: {
    ...Typography.body,
    color: FTUEColors.body,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionsCentered: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  skipText: {
    ...Typography.bodySmall,
    color: FTUEColors.muted,
  },
  nextButton: {
    backgroundColor: FTUEColors.ctaBg,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: BorderRadius.lg,
  },
  nextText: {
    ...Typography.button,
    color: FTUEColors.ctaText,
    fontSize: 15,
  },
  ctaButton: {
    paddingVertical: 16,
    paddingHorizontal: 28,
    flex: 1,
    alignItems: 'center' as const,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  stepCounter: {
    ...Typography.caption,
    color: FTUEColors.muted,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
});
