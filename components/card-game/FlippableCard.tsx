/**
 * FlippableCard — Core 3D flip animation component
 *
 * Y-axis perspective flip using react-native-reanimated.
 * Tap to flip between front and back faces.
 */

import React, { useCallback } from 'react';
import { View, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { Shadows } from '@/constants/theme';

const FLIP_DURATION = 400;

interface FlippableCardProps {
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  onFlip?: (isFlipped: boolean) => void;
  width?: number;
  height?: number;
  disabled?: boolean;
}

export default function FlippableCard({
  frontContent,
  backContent,
  onFlip,
  width = 300,
  height = 440,
  disabled = false,
}: FlippableCardProps) {
  const rotation = useSharedValue(0);
  const isFlipped = useSharedValue(false);

  const flip = useCallback(() => {
    if (disabled) return;
    isFlipped.value = !isFlipped.value;
    rotation.value = withTiming(isFlipped.value ? 1 : 0, {
      duration: FLIP_DURATION,
    });
    onFlip?.(isFlipped.value);

    // Haptic feedback (safe for web — will just no-op)
    try {
      const Haptics = require('expo-haptics');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // No haptics available (web)
    }
  }, [disabled, onFlip]);

  const frontStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      {
        rotateY: `${interpolate(
          rotation.value,
          [0, 1],
          [0, 180],
          Extrapolation.CLAMP
        )}deg`,
      },
    ],
    backfaceVisibility: 'hidden' as const,
    position: 'absolute' as const,
    width: '100%',
    height: '100%',
  }));

  const backStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      {
        rotateY: `${interpolate(
          rotation.value,
          [0, 1],
          [180, 360],
          Extrapolation.CLAMP
        )}deg`,
      },
    ],
    backfaceVisibility: 'hidden' as const,
    position: 'absolute' as const,
    width: '100%',
    height: '100%',
  }));

  return (
    <TouchableWithoutFeedback onPress={flip}>
      <View style={[styles.container, { width, height }]}>
        <Animated.View style={frontStyle}>{frontContent}</Animated.View>
        <Animated.View style={backStyle}>{backContent}</Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    ...Shadows.elevated,
  },
});
