/**
 * ScaleSliderStep — Draggable slider with labeled zones.
 *
 * Renders a horizontal slider with zone labels. As the user drags,
 * the zone highlight and content updates dynamically. Supports
 * low/mid/high labels and optional zone content reveals.
 *
 * Response captured as JSON: { value: 65, zone: "Opening to acceptance" }
 *
 * Usage inside ExerciseFlow's StepRenderer:
 *   case 'scale_slider':
 *     return (
 *       <>
 *         {previousResponses.length > 0 && <PreviousResponses ... />}
 *         <ScaleSliderStep step={step} value={value} onChangeText={onChangeText} />
 *       </>
 *     );
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  LayoutChangeEvent,
} from 'react-native';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import type { ExerciseStep } from '@/types/intervention';
import type { ScaleSliderConfig } from '@/types/interactive-step-types';

// ─── Haptics ────────────────────────────────────────────
let triggerHaptic: (style?: string) => void = () => {};
try {
  const Haptics = require('expo-haptics');
  triggerHaptic = (style = 'Light') => {
    Haptics.impactAsync(
      Haptics.ImpactFeedbackStyle[style] ?? Haptics.ImpactFeedbackStyle.Light
    );
  };
} catch {}

interface ScaleSliderStepProps {
  step: ExerciseStep;
  value?: string;
  onChangeText?: (text: string) => void;
}

export default function ScaleSliderStep({
  step,
  value,
  onChangeText,
}: ScaleSliderStepProps) {
  const config = step.interactiveConfig as ScaleSliderConfig | undefined;
  const labels = config?.labels ?? { low: '0', high: '10' };
  const zones = config?.zones ?? [];
  const initialValue = config?.initialValue ?? 50;

  const [sliderValue, setSliderValue] = useState(initialValue);
  const [trackWidth, setTrackWidth] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);
  const lastZoneRef = useRef<string>('');

  const pan = useRef(new Animated.Value(0)).current;

  // Restore from saved value
  useEffect(() => {
    if (value) {
      try {
        const parsed = JSON.parse(value);
        if (typeof parsed.value === 'number') {
          setSliderValue(parsed.value);
          setHasMoved(true);
        }
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getActiveZone = useCallback(
    (val: number) => {
      return zones.find((z) => val >= z.range[0] && val <= z.range[1]);
    },
    [zones]
  );

  const serialize = useCallback(
    (val: number) => {
      const zone = getActiveZone(val);
      return JSON.stringify({
        value: Math.round(val),
        zone: zone?.label ?? '',
      });
    },
    [getActiveZone]
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setHasMoved(true);
      },
      onPanResponderMove: (_, gestureState) => {
        if (trackWidth === 0) return;
        const rawX = gestureState.moveX;
        // This is approximate — will be refined in onLayout
        const newValue = Math.max(0, Math.min(100, (rawX / trackWidth) * 100));
        setSliderValue(newValue);

        // Zone-crossing haptic
        const zone = getActiveZone(newValue);
        if (zone && zone.label !== lastZoneRef.current) {
          lastZoneRef.current = zone.label;
          triggerHaptic('Light');
        }
      },
      onPanResponderRelease: () => {
        onChangeText?.(serialize(sliderValue));
      },
    })
  ).current;

  // Update pan position when value changes
  useEffect(() => {
    if (trackWidth > 0) {
      const position = (sliderValue / 100) * trackWidth;
      pan.setValue(position);
    }
  }, [sliderValue, trackWidth, pan]);

  const handleTrackLayout = (e: LayoutChangeEvent) => {
    setTrackWidth(e.nativeEvent.layout.width);
  };

  const handleTrackPress = (e: any) => {
    const x = e.nativeEvent.locationX;
    if (trackWidth === 0) return;
    const newValue = Math.max(0, Math.min(100, (x / trackWidth) * 100));
    setHasMoved(true);
    setSliderValue(newValue);
    onChangeText?.(serialize(newValue));
    triggerHaptic('Medium');
  };

  const activeZone = getActiveZone(sliderValue);
  const thumbPosition = trackWidth > 0 ? (sliderValue / 100) * trackWidth : 0;

  // Color interpolation based on value
  const fillColor =
    sliderValue < 33
      ? Colors.calm // calm teal
      : sliderValue < 66
        ? Colors.accentGold // warm amber
        : Colors.primary; // rose

  if (!config) {
    return (
      <View>
        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.content}>{step.content}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={[styles.iconCircle, { backgroundColor: fillColor + '20' }]}>
          <Text style={[styles.iconText, { color: fillColor }]}>◈</Text>
        </View>
        <Text style={styles.title}>{step.title}</Text>
      </View>

      {step.content ? (
        <Text style={styles.content}>{step.content}</Text>
      ) : null}

      {/* Slider */}
      <View style={styles.sliderContainer}>
        {/* Labels */}
        <View style={styles.labelsRow}>
          <Text style={styles.labelText}>{labels.low}</Text>
          {labels.mid && (
            <Text style={[styles.labelText, styles.labelMid]}>
              {labels.mid}
            </Text>
          )}
          <Text style={[styles.labelText, { textAlign: 'right' }]}>
            {labels.high}
          </Text>
        </View>

        {/* Track */}
        <View
          style={styles.track}
          onLayout={handleTrackLayout}
          onStartShouldSetResponder={() => true}
          onResponderRelease={handleTrackPress}
        >
          {/* Fill */}
          <View
            style={[
              styles.trackFill,
              {
                width: `${sliderValue}%`,
                backgroundColor: fillColor,
              },
            ]}
          />

          {/* Zone markers */}
          {zones.map((zone, i) => (
            <View
              key={i}
              style={[
                styles.zoneMarker,
                {
                  left: `${zone.range[0]}%`,
                  width: `${zone.range[1] - zone.range[0]}%`,
                },
                activeZone?.label === zone.label && {
                  backgroundColor: fillColor + '15',
                },
              ]}
            />
          ))}

          {/* Thumb */}
          {trackWidth > 0 && (
            <View
              {...panResponder.panHandlers}
              style={[
                styles.thumb,
                {
                  left: thumbPosition - 16,
                  backgroundColor: fillColor,
                },
              ]}
            >
              <Text style={styles.thumbValue}>
                {Math.round(sliderValue)}
              </Text>
            </View>
          )}
        </View>

        {/* Value display */}
        {hasMoved && (
          <Text style={[styles.valueDisplay, { color: fillColor }]}>
            {Math.round(sliderValue)}
          </Text>
        )}
      </View>

      {/* Active zone content */}
      {hasMoved && activeZone && (
        <View style={[styles.zoneCard, { borderLeftColor: fillColor }]}>
          <Text style={[styles.zoneLabel, { color: fillColor }]}>
            {activeZone.label}
          </Text>
          <Text style={styles.zoneContent}>{activeZone.content}</Text>
        </View>
      )}

      {!hasMoved && (
        <Text style={styles.hint}>Drag the slider or tap the track</Text>
      )}
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },

  // Header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: 2,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 18,
  },
  title: {
    fontSize: FontSizes.headingM,
    fontWeight: '600',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
  },
  content: {
    fontSize: FontSizes.body,
    color: Colors.text,
    lineHeight: 26,
  },

  // Slider
  sliderContainer: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.md,
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  labelText: {
    fontSize: 12,
    fontFamily: 'JosefinSans_300Light',
    color: Colors.textMuted,
    flex: 1,
    letterSpacing: 0.3,
  },
  labelMid: {
    textAlign: 'center',
  },

  // Track
  track: {
    height: 8,
    backgroundColor: Colors.borderLight,
    borderRadius: 4,
    position: 'relative',
    justifyContent: 'center',
  },
  trackFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 4,
    opacity: 0.6,
  },
  zoneMarker: {
    position: 'absolute',
    top: -4,
    bottom: -4,
    borderRadius: 4,
  },

  // Thumb
  thumb: {
    position: 'absolute',
    top: -12,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.card,
  },
  thumbValue: {
    fontSize: 11,
    fontFamily: 'Jost_600SemiBold',
    color: Colors.textOnPrimary,
    letterSpacing: 0,
  },

  // Value display
  valueDisplay: {
    fontSize: 36,
    fontFamily: 'PlayfairDisplay_700Bold',
    textAlign: 'center',
    marginTop: Spacing.md,
    letterSpacing: -1,
  },

  // Zone card
  zoneCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderLeftWidth: 4,
  },
  zoneLabel: {
    fontSize: 13,
    fontFamily: 'Jost_600SemiBold',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  zoneContent: {
    fontSize: FontSizes.body,
    fontFamily: 'JosefinSans_400Regular',
    color: Colors.text,
    lineHeight: 24,
  },

  // Hint
  hint: {
    fontSize: FontSizes.caption,
    fontFamily: 'JosefinSans_300Light',
    color: Colors.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
