/**
 * CelebrationDots — Subtle animated celebration visual.
 *
 * 6 small colored dots that float upward with staggered delays.
 * Pure Animated.View — no external dependencies.
 * Warm and gentle, not overwhelming.
 */

import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';

const DOT_COLORS = [
  Colors.primary,
  Colors.secondary,
  Colors.calm,
  Colors.zoneRegulated,
  '#D4A574',   // shifting phase color
  '#E8C87A',   // sustaining phase color
];

const DOT_COUNT = 6;

interface CelebrationDotsProps {
  /** Whether dots are currently animating */
  active?: boolean;
}

export default function CelebrationDots({ active = true }: CelebrationDotsProps) {
  const animations = useRef(
    Array.from({ length: DOT_COUNT }, () => ({
      translateY: new Animated.Value(0),
      opacity: new Animated.Value(0),
      scale: new Animated.Value(0.3),
    }))
  ).current;

  useEffect(() => {
    if (!active) return;

    const animationSequences = animations.map((anim, index) => {
      const delay = index * 150;

      return Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(anim.opacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.spring(anim.scale, {
            toValue: 1,
            speed: 12,
            bounciness: 8,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(anim.translateY, {
            toValue: -60 - Math.random() * 40,
            duration: 1200 + Math.random() * 400,
            useNativeDriver: true,
          }),
          Animated.timing(anim.opacity, {
            toValue: 0,
            duration: 800,
            delay: 600,
            useNativeDriver: true,
          }),
        ]),
      ]);
    });

    Animated.parallel(animationSequences).start();
  }, [active]);

  return (
    <View style={styles.container} pointerEvents="none">
      {animations.map((anim, index) => (
        <Animated.View
          key={index}
          style={[
            styles.dot,
            {
              backgroundColor: DOT_COLORS[index % DOT_COLORS.length],
              left: `${15 + index * 13}%`,
              transform: [
                { translateY: anim.translateY },
                { scale: anim.scale },
              ],
              opacity: anim.opacity,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    overflow: 'hidden',
  },
  dot: {
    position: 'absolute',
    bottom: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
