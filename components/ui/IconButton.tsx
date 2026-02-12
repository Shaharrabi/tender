/**
 * IconButton — Circular icon button for toolbars and headers
 *
 * Renders a circular pressable with an emoji icon, press animation,
 * and optional haptic feedback. Intended for compact toolbar actions.
 */

import React, { useRef, useCallback } from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  Animated,
  ViewStyle,
} from 'react-native';
import { Colors, Spacing, Shadows } from '@/constants/theme';

// Graceful haptic import — degrades silently if expo-haptics is not installed
let Haptics: any = null;
try {
  Haptics = require('expo-haptics');
} catch {}

// ─── Types ──────────────────────────────────────────────

interface IconButtonProps {
  icon: string;
  onPress: () => void;
  size?: number;
  color?: string;
  disabled?: boolean;
  style?: ViewStyle;
}

// ─── Component ──────────────────────────────────────────

export default function IconButton({
  icon,
  onPress,
  size = 40,
  color = Colors.text,
  disabled = false,
  style,
}: IconButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // ── Press animations ─────────────────────────────────

  const handlePressIn = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  }, [scaleAnim]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  }, [scaleAnim]);

  // ── Haptic + onPress ─────────────────────────────────

  const handlePress = useCallback(() => {
    if (disabled) return;
    Haptics?.impactAsync?.(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }, [disabled, onPress]);

  // ── Computed styles ──────────────────────────────────

  const iconFontSize = size * 0.45;

  const containerStyle: ViewStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  return (
    <Animated.View
      style={[
        { transform: [{ scale: scaleAnim }] },
        disabled && { opacity: 0.5 },
      ]}
    >
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={({ pressed }) => [
          styles.base,
          containerStyle,
          pressed && styles.pressed,
          style,
        ]}
        accessibilityRole="button"
        accessibilityLabel={icon}
        accessibilityState={{ disabled }}
      >
        <Text style={[styles.icon, { fontSize: iconFontSize, color }]}>
          {icon}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

// ─── Base Styles ────────────────────────────────────────

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    ...Shadows.subtle,
  },
  pressed: {
    opacity: 0.85,
    backgroundColor: Colors.borderLight,
  },
  icon: {
    textAlign: 'center',
  },
});
