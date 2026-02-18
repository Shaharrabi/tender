/**
 * DimensionSlider — Horizontal score bar with optional interactive drag.
 *
 * Read-only mode: Shows score position as a thumb on a filled bar.
 * Interactive mode: Thumb becomes draggable via PanResponder, calls onValueChange.
 *
 * Uses RN PanResponder (no extra gesture deps needed for web compat).
 */

import React, { useRef, useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  LayoutChangeEvent,
  Animated,
} from 'react-native';
import { Colors, Spacing, FontSizes, FontFamilies, BorderRadius } from '@/constants/theme';

interface DimensionSliderProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  color?: string;
  /** When true, thumb becomes draggable */
  interactive?: boolean;
  onValueChange?: (value: number) => void;
  /** Show score number */
  showValue?: boolean;
}

export function DimensionSlider({
  label,
  value,
  min = 1,
  max = 7,
  color = Colors.primary,
  interactive = false,
  onValueChange,
  showValue = true,
}: DimensionSliderProps) {
  const [trackWidth, setTrackWidth] = useState(0);
  const percent = ((value - min) / (max - min)) * 100;
  const thumbScale = useRef(new Animated.Value(1)).current;

  const clamp = useCallback(
    (v: number) => Math.round(Math.max(min, Math.min(max, v)) * 10) / 10,
    [min, max]
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => interactive,
      onMoveShouldSetPanResponder: () => interactive,
      onPanResponderGrant: () => {
        Animated.spring(thumbScale, {
          toValue: 1.3,
          friction: 5,
          useNativeDriver: true,
        }).start();
      },
      onPanResponderMove: (_evt, gestureState) => {
        if (!trackWidth || !onValueChange) return;
        // Calculate value from horizontal offset relative to track
        const currentPercent = ((value - min) / (max - min));
        const currentX = currentPercent * trackWidth;
        const newX = currentX + gestureState.dx;
        const newPercent = newX / trackWidth;
        const newValue = clamp(min + newPercent * (max - min));
        onValueChange(newValue);
      },
      onPanResponderRelease: () => {
        Animated.spring(thumbScale, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  const handleTrackLayout = (e: LayoutChangeEvent) => {
    setTrackWidth(e.nativeEvent.layout.width);
  };

  // For interactive: handle tap on track to jump to position
  const handleTrackPress = useCallback(
    (e: any) => {
      if (!interactive || !onValueChange || !trackWidth) return;
      const locationX = e.nativeEvent.locationX;
      const newPercent = locationX / trackWidth;
      const newValue = clamp(min + newPercent * (max - min));
      onValueChange(newValue);
    },
    [interactive, onValueChange, trackWidth, min, max, clamp]
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        {showValue && (
          <Text style={[styles.value, { color }]}>{value.toFixed(1)}</Text>
        )}
      </View>

      <View
        style={styles.track}
        onLayout={handleTrackLayout}
        onStartShouldSetResponder={() => interactive}
        onResponderRelease={handleTrackPress}
      >
        {/* Filled portion */}
        <View
          style={[
            styles.fill,
            {
              width: `${percent}%`,
              backgroundColor: color + '30',
            },
          ]}
        />

        {/* Thumb */}
        <Animated.View
          style={[
            styles.thumb,
            {
              left: `${percent}%`,
              backgroundColor: color,
              transform: [{ scale: thumbScale }],
            },
          ]}
          {...(interactive ? panResponder.panHandlers : {})}
        >
          {interactive && <View style={[styles.thumbRing, { borderColor: color }]} />}
        </Animated.View>

        {/* Min/Max labels */}
        <Text style={[styles.rangeLabel, styles.rangeLabelLeft]}>{min}</Text>
        <Text style={[styles.rangeLabel, styles.rangeLabelRight]}>{max}</Text>
      </View>
    </View>
  );
}

const THUMB_SIZE = 18;

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xs,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: FontSizes.bodySmall,
    fontFamily: FontFamilies.heading,
    fontWeight: '500',
    color: Colors.text,
  },
  value: {
    fontSize: FontSizes.bodySmall,
    fontFamily: FontFamilies.accent,
    fontWeight: '600',
  },
  track: {
    height: 28,
    backgroundColor: Colors.progressTrack,
    borderRadius: BorderRadius.pill,
    justifyContent: 'center',
    position: 'relative',
    overflow: 'visible',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: BorderRadius.pill,
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    marginLeft: -(THUMB_SIZE / 2),
    top: (28 - THUMB_SIZE) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  thumbRing: {
    width: THUMB_SIZE + 8,
    height: THUMB_SIZE + 8,
    borderRadius: (THUMB_SIZE + 8) / 2,
    borderWidth: 2,
    position: 'absolute',
    opacity: 0.3,
  },
  rangeLabel: {
    position: 'absolute',
    bottom: -14,
    fontSize: 9,
    color: Colors.textMuted,
    fontFamily: FontFamilies.body,
  },
  rangeLabelLeft: {
    left: 4,
  },
  rangeLabelRight: {
    right: 4,
  },
});
