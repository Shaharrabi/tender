/**
 * AnimatedPressable — premium microinteraction wrapper.
 *
 * On touch:
 *   - gentle lift upward (-2px translateY)
 *   - tiny scale increase (1.015)
 *   - shadow deepens slightly
 *   - light haptic feedback
 *
 * On release: smoothly returns to rest.
 *
 * Design intent: the element feels gently aware of touch.
 * Not animated — just alive. Premium, calm, emotionally warm.
 */

import React, { useRef, useCallback } from 'react';
import {
  Pressable,
  Animated,
  ViewStyle,
  StyleProp,
  PressableProps,
  Platform,
} from 'react-native';

// Graceful haptic import
let Haptics: any = null;
try {
  Haptics = require('expo-haptics');
} catch {}

// ─── Motion Tokens ──────────────────────────────────────
// Shared across the app for consistent interaction feel.

export const Motion = {
  // Hover / press-in
  liftY: -2,              // subtle upward lift (px)
  liftScale: 1.015,       // barely perceptible scale-up
  // Timing
  springSpeed: 40,        // calm, not snappy
  springBounce: 2,        // almost no bounce — just ease
  // Shadow (pressed state)
  pressedShadow: {
    shadowColor: '#2D2226',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
  } as ViewStyle,
  // Rest shadow (default — matches Shadows.subtle from theme)
  restShadow: {
    shadowColor: '#2D2226',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  } as ViewStyle,
} as const;

// ─── Props ──────────────────────────────────────────────

export interface AnimatedPressableProps extends Omit<PressableProps, 'style'> {
  /** Static styles. Applied to the Pressable so layout is preserved. */
  style?: StyleProp<ViewStyle>;
  /** Disable all animation (still renders Pressable for consistency) */
  noAnimation?: boolean;
  /** Fire a light haptic on press-in. Default: true */
  haptic?: boolean;
  children: React.ReactNode;
}

// ─── Component ──────────────────────────────────────────

export default function AnimatedPressable({
  style,
  noAnimation = false,
  haptic = true,
  children,
  onPressIn,
  onPressOut,
  disabled,
  ...rest
}: AnimatedPressableProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const liftAnim = useRef(new Animated.Value(0)).current;
  const shadowOpacity = useRef(new Animated.Value(Motion.restShadow.shadowOpacity as number)).current;
  const shadowRadius = useRef(new Animated.Value(Motion.restShadow.shadowRadius as number)).current;

  const handlePressIn = useCallback(
    (e: any) => {
      if (!noAnimation) {
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: Motion.liftScale,
            useNativeDriver: true,
            speed: Motion.springSpeed,
            bounciness: Motion.springBounce,
          }),
          Animated.spring(liftAnim, {
            toValue: Motion.liftY,
            useNativeDriver: true,
            speed: Motion.springSpeed,
            bounciness: Motion.springBounce,
          }),
          // Shadow changes can't use native driver
          Animated.timing(shadowOpacity, {
            toValue: Motion.pressedShadow.shadowOpacity as number,
            duration: 150,
            useNativeDriver: false,
          }),
          Animated.timing(shadowRadius, {
            toValue: Motion.pressedShadow.shadowRadius as number,
            duration: 150,
            useNativeDriver: false,
          }),
        ]).start();
      }
      if (haptic) {
        Haptics?.impactAsync?.(Haptics.ImpactFeedbackStyle.Light);
      }
      onPressIn?.(e);
    },
    [noAnimation, haptic, onPressIn, scaleAnim, liftAnim, shadowOpacity, shadowRadius],
  );

  const handlePressOut = useCallback(
    (e: any) => {
      if (!noAnimation) {
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            speed: Motion.springSpeed,
            bounciness: Motion.springBounce,
          }),
          Animated.spring(liftAnim, {
            toValue: 0,
            useNativeDriver: true,
            speed: Motion.springSpeed,
            bounciness: Motion.springBounce,
          }),
          Animated.timing(shadowOpacity, {
            toValue: Motion.restShadow.shadowOpacity as number,
            duration: 200,
            useNativeDriver: false,
          }),
          Animated.timing(shadowRadius, {
            toValue: Motion.restShadow.shadowRadius as number,
            duration: 200,
            useNativeDriver: false,
          }),
        ]).start();
      }
      onPressOut?.(e);
    },
    [noAnimation, onPressOut, scaleAnim, liftAnim, shadowOpacity, shadowRadius],
  );

  if (noAnimation) {
    return (
      <Pressable
        style={style}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={disabled}
        {...rest}
      >
        {children}
      </Pressable>
    );
  }

  // Outer Animated.View: transform (scale + lift) — uses native driver.
  // Inner Animated.View: shadow animation — uses JS driver (can't animate shadow natively).
  // Pressable: layout styles + press handlers.
  return (
    <Animated.View
      style={{
        transform: [
          { scale: scaleAnim },
          { translateY: liftAnim },
        ],
      }}
    >
      <Animated.View
        style={
          Platform.OS !== 'web'
            ? {
                shadowColor: Motion.restShadow.shadowColor,
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: shadowOpacity,
                shadowRadius: shadowRadius,
              }
            : undefined
        }
      >
        <Pressable
          style={style}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled}
          accessibilityRole={rest.accessibilityRole}
          accessibilityLabel={rest.accessibilityLabel}
          accessibilityState={rest.accessibilityState}
          {...rest}
        >
          {children}
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}
