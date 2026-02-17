/**
 * HighlightWrapper — One-time pulse animation for first-time element discovery.
 *
 * Wraps any child element and plays a 3-second gold pulse animation
 * the first time the user sees it. After animation completes, it is
 * marked as seen and never replays.
 *
 * Flow order: Tour completes → isFirstLaunch becomes false → highlights run →
 *             highlights complete → tooltips appear (4s delay in TooltipManager)
 *
 * Usage:
 *   <HighlightWrapper highlightId="home_assessment_cta">
 *     <AssessmentCard ... />
 *   </HighlightWrapper>
 */

import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';
import { useFirstTime } from '@/context/FirstTimeContext';
import {
  FTUEColors,
  FTUELayout,
  FTUETiming,
  FTUEShadows,
} from '@/constants/ftue/theme';

interface HighlightWrapperProps {
  /** Unique ID tracked in FirstTimeContext */
  highlightId: string;
  children: React.ReactNode;
  /** Allow conditional disable */
  enabled?: boolean;
  /** Pass-through style to outer Animated.View */
  style?: ViewStyle;
}

export const HighlightWrapper: React.FC<HighlightWrapperProps> = ({
  highlightId,
  children,
  enabled = true,
  style,
}) => {
  const { state, loading, markHighlightSeen } = useFirstTime();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const hasStarted = useRef(false);

  const alreadySeen = state.seenHighlights.includes(highlightId);

  useEffect(() => {
    // Don't start highlights while tour is running (isFirstLaunch = true means tour hasn't completed)
    if (!enabled || loading || alreadySeen || hasStarted.current || state.isFirstLaunch) return;
    hasStarted.current = true;

    // Delay to let layout settle after tour dismisses
    const timer = setTimeout(() => {
      const animation = Animated.sequence([
        // Phase 1: Enter (300ms) — fade in border + glow
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1.02,
            duration: FTUETiming.highlightEnter,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: FTUETiming.highlightEnter,
            useNativeDriver: false,
          }),
        ]),

        // Phase 2: Hold (2400ms) — 3 gentle pulses
        Animated.loop(
          Animated.sequence([
            Animated.timing(scaleAnim, {
              toValue: 1.03,
              duration: FTUETiming.highlightPulseDuration / 2,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 1.02,
              duration: FTUETiming.highlightPulseDuration / 2,
              useNativeDriver: true,
            }),
          ]),
          { iterations: FTUETiming.highlightPulseCount }
        ),

        // Phase 3: Exit (300ms) — fade out border + glow
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: FTUETiming.highlightExit,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: FTUETiming.highlightExit,
            useNativeDriver: false,
          }),
        ]),
      ]);

      animation.start(() => {
        markHighlightSeen(highlightId);
      });
    }, FTUETiming.measureDelay + 200); // Extra 200ms buffer after tour dismisses

    return () => clearTimeout(timer);
  }, [enabled, loading, alreadySeen, highlightId, state.isFirstLaunch]);

  // If already seen or disabled, render children without animation wrapper
  if (alreadySeen || !enabled) {
    return <>{children}</>;
  }

  return (
    <Animated.View
      style={[
        style,
        {
          transform: [{ scale: scaleAnim }],
          borderWidth: FTUELayout.highlightBorderWidth,
          borderRadius: FTUELayout.highlightBorderRadius,
          borderColor: glowAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['transparent', FTUEColors.highlight],
          }),
          shadowColor: FTUEColors.glowShadow,
          shadowOffset: { width: 0, height: 4 },
          shadowRadius: 12,
          shadowOpacity: glowAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 0.2],
          }),
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};
