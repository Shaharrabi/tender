/**
 * AnimatedPressable — premium microinteraction wrapper.
 *
 * On touch: barely perceptible scale (1.008) + light haptic.
 * On release: smooth return. No lift, no shadow animation,
 * no visual conflict with auto-advance transitions.
 *
 * Design intent: you can't SEE it, but you can FEEL it.
 * The haptic + micro-scale makes the tap feel crisp and premium
 * without adding any visual clunkiness.
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
  /** Tiny scale on press — felt more than seen */
  pressScale: 1.008,
  /** Spring speed — fast so it doesn't interfere with auto-advance */
  springSpeed: 60,
  /** Spring bounciness — zero bounce */
  springBounce: 0,
} as const;

// ─── Props ──────────────────────────────────────────────

export interface AnimatedPressableProps extends Omit<PressableProps, 'style'> {
  style?: StyleProp<ViewStyle>;
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

  if (noAnimation) {
    return (
      <Pressable style={style} disabled={disabled} onPressIn={onPressIn} onPressOut={onPressOut} {...rest}>
        {children}
      </Pressable>
    );
  }

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
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
