/**
 * AnimatedPressable — subtle microinteraction wrapper.
 *
 * Drop-in replacement for TouchableOpacity that adds:
 *   - gentle scale compression on press (0.975)
 *   - optional haptic feedback
 *   - smooth spring animation
 *
 * Design intent: "micro-somatics for the interface" —
 * the element should feel aware of touch, not animated.
 *
 * Usage:
 *   <AnimatedPressable onPress={fn} style={styles.card}>
 *     <Text>Option A</Text>
 *   </AnimatedPressable>
 */

import React, { useRef, useCallback } from 'react';
import {
  Pressable,
  Animated,
  ViewStyle,
  StyleProp,
  PressableProps,
} from 'react-native';

// Graceful haptic import
let Haptics: any = null;
try {
  Haptics = require('expo-haptics');
} catch {}

// ─── Motion Tokens ──────────────────────────────────────

export const Motion = {
  /** Scale when finger is down */
  pressScale: 0.975,
  /** Spring speed — higher = snappier */
  springSpeed: 50,
  /** Spring bounciness — lower = calmer */
  springBounce: 3,
} as const;

// ─── Props ──────────────────────────────────────────────

export interface AnimatedPressableProps extends Omit<PressableProps, 'style'> {
  /** Static styles (ViewStyle or array). Applied to the Pressable so layout is preserved. */
  style?: StyleProp<ViewStyle>;
  /** Disable the scale animation (still renders Pressable for consistency) */
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

  const handlePressIn = useCallback(
    (e: any) => {
      if (!noAnimation) {
        Animated.spring(scaleAnim, {
          toValue: Motion.pressScale,
          useNativeDriver: true,
          speed: Motion.springSpeed,
          bounciness: Motion.springBounce,
        }).start();
      }
      if (haptic) {
        Haptics?.impactAsync?.(Haptics.ImpactFeedbackStyle.Light);
      }
      onPressIn?.(e);
    },
    [noAnimation, haptic, onPressIn, scaleAnim],
  );

  const handlePressOut = useCallback(
    (e: any) => {
      if (!noAnimation) {
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          speed: Motion.springSpeed,
          bounciness: Motion.springBounce,
        }).start();
      }
      onPressOut?.(e);
    },
    [noAnimation, onPressOut, scaleAnim],
  );

  // Transform-only wrapper — no layout styles here.
  // All visual/layout styles go on the Pressable so flexDirection, padding,
  // border etc. apply to the same element that receives the children.
  return (
    <Animated.View
      style={!noAnimation ? { transform: [{ scale: scaleAnim }] } : undefined}
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
  );
}
