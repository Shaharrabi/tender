/**
 * GuidedTour — Multi-step spotlight walkthrough for first launch.
 *
 * Shows a dark overlay with a spotlight cutout on the current target,
 * a card with title/body, progress dots, and next/skip/done actions.
 * Uses RefRegistry for target measurement.
 * Scrolls to off-screen targets before measuring them.
 *
 * Usage (in home screen):
 *   <GuidedTour
 *     tour={HOME_TOUR}
 *     onComplete={() => markFirstLaunchComplete()}
 *     scrollRef={scrollRef}
 *     scrollOffset={scrollOffset}
 *   />
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  Platform,
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
  scrollRef?: React.RefObject<ScrollView | null>;
  /** Current scroll offset ref */
  scrollOffset?: React.RefObject<number>;
}

export const GuidedTour: React.FC<GuidedTourProps> = ({
  tour,
  onComplete,
  scrollRef,
  scrollOffset,
}) => {
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetLayout, setTargetLayout] = useState<TargetMeasurement | null>(
    null
  );
  const [visible, setVisible] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const cardFadeAnim = useRef(new Animated.Value(0)).current;
  const pendingRouteRef = useRef<string | null>(null);

  const currentStep = tour.steps[currentStepIndex];
  const isLastStep = currentStepIndex === tour.steps.length - 1;
  const isFirstStep = currentStepIndex === 0;
  const isCenterStep = currentStep.targetRef === 'none';
  const hasCta = !!currentStep.ctaLabel;

  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const isWeb = Platform.OS === 'web';
  // useNativeDriver is not supported on web — force false to prevent silent failures
  const useNative = !isWeb;

  /**
   * Scroll the target element into view, wait for scroll to settle,
   * then re-measure in window coordinates.
   *
   * Uses the same approach as TooltipManager:
   * 1. Try measureInWindow — works if element is on-screen
   * 2. If on-screen but poorly positioned, scroll to better position
   * 3. If off-screen, use measureLayout + scrollOffset to find content position
   */
  const scrollToAndMeasure = useCallback(async (targetRef: string): Promise<TargetMeasurement | null> => {
    const currentOffset = scrollOffset?.current ?? 0;
    const desiredScreenY = screenHeight * 0.25; // Place element at ~25% from top

    // First try measureInWindow — works for on-screen elements
    let layout = await RefRegistry.measure(targetRef);

    if (layout) {
      const targetBottom = layout.y + layout.height;
      const comfortTop = screenHeight * 0.08;
      const comfortBottom = screenHeight * 0.50;

      if (layout.y >= comfortTop && targetBottom <= comfortBottom) {
        // Already visible and well-positioned
        return layout;
      }

      // On-screen but poorly positioned — scroll to better spot
      if (scrollRef?.current) {
        const scrollDelta = layout.y - desiredScreenY;
        const newOffset = Math.max(0, currentOffset + scrollDelta);
        scrollRef.current.scrollTo({ y: newOffset, animated: true });
        await new Promise((resolve) => setTimeout(resolve, 450));
        layout = await RefRegistry.measure(targetRef);
        return layout;
      }

      return layout;
    }

    // Element is off-screen (measureInWindow returned null).
    // Use measureLayout which works for off-screen elements in ScrollViews.
    if (scrollRef?.current) {
      const absLayout = await RefRegistry.measureLayout(targetRef);
      if (absLayout) {
        // ref.measure() pageY = contentY - scrollOffset
        // So contentY = pageY + scrollOffset
        const contentY = absLayout.y + currentOffset;
        const newOffset = Math.max(0, contentY - desiredScreenY);
        scrollRef.current.scrollTo({ y: newOffset, animated: true });
        await new Promise((resolve) => setTimeout(resolve, 500));
        // Re-measure now that it's scrolled into view
        layout = await RefRegistry.measure(targetRef);
      }
    }

    return layout;
  }, [scrollRef, scrollOffset, screenHeight]);

  // Measure target and animate in.
  // Uses setValue(0) for instant hide instead of Animated.timing().start(callback)
  // because on web the animation callback can silently fail to fire when the
  // animated value is already at the target, freezing the tour.
  useEffect(() => {
    let cancelled = false;

    // Step 1: Instantly hide the card (no animation callback needed)
    cardFadeAnim.setValue(0);

    // Step 2: Measure target, then fade in
    const doMeasure = async () => {
      try {
        if (!isCenterStep) {
          const layout = await scrollToAndMeasure(currentStep.targetRef);
          if (!cancelled) setTargetLayout(layout);
        } else {
          if (!cancelled) setTargetLayout(null);
        }
      } catch {
        if (!cancelled) setTargetLayout(null);
      }

      if (cancelled) return;

      // Step 3: Fade in — always runs even if measurement failed
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: FTUETiming.tourTransition,
          useNativeDriver: useNative,
        }),
        Animated.timing(cardFadeAnim, {
          toValue: 1,
          duration: FTUETiming.tourTransition,
          useNativeDriver: useNative,
        }),
      ]).start();
    };

    doMeasure();

    return () => { cancelled = true; };
  }, [currentStepIndex, isCenterStep, currentStep.targetRef, scrollToAndMeasure]);

  /** Animate out the modal, then call onComplete and navigate if needed. */
  const dismissTour = useCallback((ctaRoute?: string) => {
    if (ctaRoute) {
      pendingRouteRef.current = ctaRoute;
    }
    const duration = 200;
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration,
        useNativeDriver: useNative,
      }),
      Animated.timing(cardFadeAnim, {
        toValue: 0,
        duration,
        useNativeDriver: useNative,
      }),
    ]).start();
    // Use timeout as fallback — animation callback can fail on web
    setTimeout(() => setVisible(false), duration + 50);
  }, [fadeAnim, cardFadeAnim]);

  /** Called when Modal's visible transitions to false — safe to clean up. */
  const handleModalDismiss = useCallback(() => {
    onComplete();
    if (pendingRouteRef.current) {
      const route = pendingRouteRef.current;
      pendingRouteRef.current = null;
      // Small delay to let Modal fully close before navigating
      setTimeout(() => router.push(route as any), 100);
    }
  }, [onComplete, router]);

  const handleNext = useCallback(() => {
    if (isLastStep) {
      dismissTour(currentStep.ctaRoute);
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  }, [isLastStep, dismissTour, currentStep.ctaRoute]);

  const handleSkip = useCallback(() => {
    dismissTour();
  }, [dismissTour]);

  // Calculate card position — centered on wide screens, edge-to-edge on narrow
  const getCardStyle = () => {
    const margin = FTUELayout.tourCardMarginH;
    const maxCardW = 440;
    const availableW = screenWidth - margin * 2;
    // On wide screens, center the card; on narrow, use margin
    const horizontalPad = availableW > maxCardW
      ? (screenWidth - maxCardW) / 2
      : margin;

    if (isCenterStep || !targetLayout) {
      return {
        top: screenHeight * 0.32,
        left: horizontalPad,
        right: horizontalPad,
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
        left: horizontalPad,
        right: horizontalPad,
      };
    } else {
      return {
        top: Math.max(targetLayout.y - cardHeight - spacing, 60),
        left: horizontalPad,
        right: horizontalPad,
      };
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onDismiss={handleModalDismiss}
      onRequestClose={handleSkip}
    >
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
