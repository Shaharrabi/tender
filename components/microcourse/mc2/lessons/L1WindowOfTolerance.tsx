/**
 * L1: Window of Tolerance — Draggable 3-Zone Vertical Slider
 *
 * User physically drags a marker through 3 nervous system zones:
 * Hyperarousal (top), Window of Tolerance (middle), Hypoarousal (bottom).
 *
 * When they lock in their current position, zone info + insight is shown.
 * Returns StepResponseEntry[] to the orchestrator.
 */

import React, { useState, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  PanResponder,
  Animated,
} from 'react-native';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import { MC2_PALETTE } from '@/constants/mc2Theme';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

const SLIDER_HEIGHT = 360;
const ZONE_HEIGHT = SLIDER_HEIGHT / 3;
const MARKER_SIZE = 32;

type Zone = 'hyperarousal' | 'window' | 'hypoarousal';

interface ZoneInfo {
  title: string;
  color: string;
  description: string;
  signs: string[];
}

const ZONE_DATA: Record<Zone, ZoneInfo> = {
  hyperarousal: {
    title: 'HYPERAROUSAL',
    color: MC2_PALETTE.warmCoral,
    description: 'Your system is activated. Heart races, muscles tense, thoughts spiral.',
    signs: ['Racing heart', 'Tight chest', 'Fast talking', "Can't sit still", 'Tunnel vision'],
  },
  window: {
    title: 'WINDOW OF TOLERANCE',
    color: MC2_PALETTE.windowGreen,
    description: 'You can think clearly, feel your feelings, and choose how to respond.',
    signs: ['Steady breathing', 'Clear thinking', 'Can hear partner', 'Flexible responses', 'Present'],
  },
  hypoarousal: {
    title: 'HYPOAROUSAL',
    color: MC2_PALETTE.coolBlue,
    description: 'Your system has shut down. Numb, foggy, flat, disconnected.',
    signs: ['Heavy limbs', 'Brain fog', "Can't find words", 'Feeling far away', '"I don\'t care"'],
  },
};

interface L1WindowOfToleranceProps {
  content: ResolvedLessonContent;
  attachmentStyle?: AttachmentStyle;
  onComplete: (responses: StepResponseEntry[]) => void;
}

export function L1WindowOfTolerance({
  content,
  attachmentStyle,
  onComplete,
}: L1WindowOfToleranceProps) {
  const haptics = useSoundHaptics();

  const [currentZone, setCurrentZone] = useState<Zone>('window');
  const [zonesVisited, setZonesVisited] = useState<Set<Zone>>(new Set(['window']));
  const [locked, setLocked] = useState(false);
  const [showContinue, setShowContinue] = useState(false);

  // Marker position (animated for smooth drag)
  const markerY = useRef(new Animated.Value(SLIDER_HEIGHT / 2 - MARKER_SIZE / 2)).current;

  // Refs for PanResponder (avoid stale closures)
  const stateRef = useRef({
    locked: false,
    currentZone: 'window' as Zone,
    zonesVisited: new Set(['window']),
  });
  stateRef.current = { locked, currentZone, zonesVisited };

  const startYRef = useRef(0);
  const startMarkerRef = useRef(SLIDER_HEIGHT / 2 - MARKER_SIZE / 2);

  const getZoneFromY = (y: number): Zone => {
    if (y < ZONE_HEIGHT - MARKER_SIZE / 2) return 'hyperarousal';
    if (y < ZONE_HEIGHT * 2 - MARKER_SIZE / 2) return 'window';
    return 'hypoarousal';
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !stateRef.current.locked,
        onMoveShouldSetPanResponder: (_, gs) =>
          !stateRef.current.locked && Math.abs(gs.dy) > 2,
        onPanResponderGrant: (_, gs) => {
          startMarkerRef.current = (markerY as any)._value || SLIDER_HEIGHT / 2 - MARKER_SIZE / 2;
        },
        onPanResponderMove: (_, gs) => {
          const newY = Math.max(
            4,
            Math.min(SLIDER_HEIGHT - MARKER_SIZE - 4, startMarkerRef.current + gs.dy)
          );
          markerY.setValue(newY);

          const zone = getZoneFromY(newY);
          if (zone !== stateRef.current.currentZone) {
            haptics.playMoodSelect();
            setCurrentZone(zone);
            setZonesVisited((prev) => new Set([...prev, zone]));
          }
        },
        onPanResponderRelease: () => {
          haptics.tapSoft();
        },
      }),
    []
  );

  const handleLock = useCallback(() => {
    setLocked(true);
    haptics.success();

    // Show continue button after brief delay
    setTimeout(() => setShowContinue(true), 1500);
  }, [haptics]);

  const handleContinue = useCallback(() => {
    haptics.tap();
    const responses: StepResponseEntry[] = [
      {
        step: 1,
        prompt: 'Window of Tolerance position',
        response: `Right now I am: ${currentZone}`,
        type: 'zone-slider',
      },
      {
        step: 2,
        prompt: 'Zones explored',
        response: `Explored ${zonesVisited.size} of 3 zones: ${Array.from(zonesVisited).join(', ')}`,
        type: 'exploration',
      },
    ];
    onComplete(responses);
  }, [haptics, currentZone, zonesVisited, onComplete]);

  const zoneInfo = ZONE_DATA[currentZone];

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>YOUR WINDOW</Text>
      <Text style={styles.subtitle}>
        Drag the marker. Where are you right now?
      </Text>

      {/* 3-Zone Slider */}
      <View style={styles.sliderContainer}>
        {/* Zone backgrounds */}
        <View style={[styles.zone, { backgroundColor: MC2_PALETTE.warmCoral + '25' }]}>
          <Text style={styles.zoneEmoji}>{'⚡'}</Text>
          <Text style={styles.zoneLabel}>HYPER</Text>
        </View>
        <View style={[styles.zone, { backgroundColor: MC2_PALETTE.windowGreen + '25' }]}>
          <Text style={styles.zoneEmoji}>{'🌿'}</Text>
          <Text style={styles.zoneLabel}>WINDOW</Text>
        </View>
        <View style={[styles.zone, { backgroundColor: MC2_PALETTE.coolBlue + '25' }]}>
          <Text style={styles.zoneEmoji}>{'🌊'}</Text>
          <Text style={styles.zoneLabel}>HYPO</Text>
        </View>

        {/* Draggable marker */}
        <Animated.View
          style={[
            styles.marker,
            {
              top: markerY,
              backgroundColor: zoneInfo.color,
            },
          ]}
          {...(locked ? {} : panResponder.panHandlers)}
        >
          <View style={styles.markerInner} />
        </Animated.View>
      </View>

      {/* Zone Info Card */}
      <View style={[styles.infoCard, { borderLeftColor: zoneInfo.color }]}>
        <Text style={[styles.infoTitle, { color: zoneInfo.color }]}>
          {zoneInfo.title}
        </Text>
        <Text style={styles.infoDesc}>{zoneInfo.description}</Text>
        <View style={styles.signsList}>
          {zoneInfo.signs.map((sign, i) => (
            <View key={i} style={styles.signRow}>
              <View style={[styles.signDot, { backgroundColor: zoneInfo.color }]} />
              <Text style={styles.signItem}>{sign}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Lock button */}
      {!locked && (
        <TouchableOpacity
          style={styles.lockButton}
          onPress={handleLock}
          activeOpacity={0.7}
        >
          <Text style={styles.lockButtonText}>THIS IS WHERE I AM</Text>
        </TouchableOpacity>
      )}

      {/* Locked insight */}
      {locked && (
        <View style={styles.insightCard}>
          <Text style={styles.insightText}>
            Knowing where you are is the first step to staying in your window.
          </Text>
        </View>
      )}

      {/* Continue button */}
      {showContinue && (
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.7}
        >
          <Text style={styles.continueButtonText}>Continue to Reflection</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
    alignItems: 'center',
  },
  title: {
    fontSize: FontSizes.headingM,
    fontFamily: FontFamilies.heading,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: 1.5,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },

  // ─── Slider ─────────────────────────
  sliderContainer: {
    width: 110,
    height: SLIDER_HEIGHT,
    borderRadius: 55,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 2,
    borderColor: Colors.borderLight,
    marginBottom: Spacing.lg,
  },
  zone: {
    height: ZONE_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  zoneEmoji: {
    fontSize: 16,
  },
  zoneLabel: {
    fontSize: 9,
    fontFamily: FontFamilies.heading,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1.5,
  },
  marker: {
    position: 'absolute',
    width: MARKER_SIZE,
    height: MARKER_SIZE,
    borderRadius: MARKER_SIZE / 2,
    left: (110 - MARKER_SIZE) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  markerInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
  },

  // ─── Info Card ──────────────────────
  infoCard: {
    backgroundColor: Colors.surfaceElevated,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderLeftWidth: 4,
    width: '100%',
    ...Shadows.subtle,
    gap: Spacing.sm,
  },
  infoTitle: {
    fontSize: FontSizes.caption,
    fontFamily: FontFamilies.heading,
    fontWeight: '800',
    letterSpacing: 2,
  },
  infoDesc: {
    fontSize: FontSizes.bodySmall,
    fontFamily: FontFamilies.body,
    lineHeight: 22,
    color: Colors.textSecondary,
  },
  signsList: {
    gap: 4,
  },
  signRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  signDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  signItem: {
    fontSize: FontSizes.caption,
    fontFamily: FontFamilies.body,
    color: Colors.textMuted,
  },

  // ─── Buttons ────────────────────────
  lockButton: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.text,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    ...Shadows.subtle,
  },
  lockButtonText: {
    color: Colors.background,
    fontFamily: FontFamilies.heading,
    fontWeight: '700',
    fontSize: FontSizes.bodySmall,
    letterSpacing: 2,
    textAlign: 'center',
  },
  insightCard: {
    marginTop: Spacing.lg,
    backgroundColor: MC2_PALETTE.sage + '15',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderLeftWidth: 3,
    borderLeftColor: MC2_PALETTE.sage,
    width: '100%',
  },
  insightText: {
    fontSize: FontSizes.bodySmall,
    fontFamily: FontFamilies.body,
    color: MC2_PALETTE.sage,
    fontStyle: 'italic',
    lineHeight: 22,
    textAlign: 'center',
  },
  continueButton: {
    marginTop: Spacing.xl,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 24,
    ...Shadows.subtle,
  },
  continueButtonText: {
    color: Colors.textOnPrimary,
    fontWeight: '600',
    fontSize: FontSizes.body,
  },
});
