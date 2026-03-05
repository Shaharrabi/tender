/**
 * L1: Boundary Spectrum — Interactive 3-zone slider
 *
 * Users explore where their boundary style falls on a spectrum:
 * Too Rigid <-> Flexible <-> Too Porous.
 * Tap a zone to see examples, then lock in your style.
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated,
} from 'react-native';
import {
  Colors, Spacing, FontSizes, FontFamilies, BorderRadius, Shadows,
} from '@/constants/theme';
import { MC4_PALETTE } from '@/constants/mc4Theme';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

type Phase = 'intro' | 'spectrum' | 'complete';
type ZoneKey = 'rigid' | 'flexible' | 'porous';

interface ZoneData { key: ZoneKey; label: string; color: string; examples: string[] }

const ZONES: ZoneData[] = [
  { key: 'rigid', label: 'Too Rigid', color: MC4_PALETTE.rigidBlue, examples: [
    'I never compromise on plans',
    'I avoid asking for help, even when struggling',
    'I keep emotions private to stay in control',
  ]},
  { key: 'flexible', label: 'Flexible', color: MC4_PALETTE.warmAmber, examples: [
    'I can say no without guilt, and yes with genuine willingness',
    'I share feelings while respecting my partner\u2019s pace',
    'I adjust plans without losing my sense of self',
  ]},
  { key: 'porous', label: 'Too Porous', color: MC4_PALETTE.porousRose, examples: [
    'I say yes when I mean no to avoid conflict',
    'I absorb my partner\u2019s moods as my own',
    'I lose track of what I actually want',
  ]},
];

interface L1BoundarySpectrumProps {
  content: ResolvedLessonContent;
  attachmentStyle?: AttachmentStyle;
  onComplete: (responses: StepResponseEntry[]) => void;
}

export function L1BoundarySpectrum({ content, attachmentStyle, onComplete }: L1BoundarySpectrumProps) {
  const haptics = useSoundHaptics();
  const [phase, setPhase] = useState<Phase>('intro');
  const [selectedZone, setSelectedZone] = useState<ZoneKey | null>(null);

  const introFade = useRef(new Animated.Value(1)).current;
  const spectrumFade = useRef(new Animated.Value(0)).current;
  const exampleAnims = useRef([0, 1, 2].map(() => new Animated.Value(0))).current;

  const animateExamplesIn = useCallback(() => {
    exampleAnims.forEach((a) => a.setValue(0));
    Animated.stagger(120, exampleAnims.map((anim) =>
      Animated.timing(anim, { toValue: 1, duration: 300, useNativeDriver: true }),
    )).start();
  }, [exampleAnims]);

  const handleExplore = useCallback(() => {
    haptics.tap();
    Animated.timing(introFade, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => {
      setPhase('spectrum');
      Animated.timing(spectrumFade, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    });
  }, [haptics, introFade, spectrumFade]);

  const handleZoneSelect = useCallback((zone: ZoneKey) => {
    haptics.tap();
    setSelectedZone(zone);
    animateExamplesIn();
  }, [haptics, animateExamplesIn]);

  const handleLockIn = useCallback(() => {
    if (!selectedZone) return;
    haptics.playConfetti();
    const zoneData = ZONES.find((z) => z.key === selectedZone)!;
    const responses: StepResponseEntry[] = [{
      step: 1,
      prompt: 'Boundary Spectrum',
      response: JSON.stringify({ zone: selectedZone, zoneName: zoneData.label }),
      type: 'interactive',
    }];
    setPhase('complete');
    onComplete(responses);
  }, [selectedZone, haptics, onComplete]);

  const activeZone = ZONES.find((z) => z.key === selectedZone);

  // ─── Intro Phase ──────────────────────────────
  if (phase === 'intro') {
    return (
      <Animated.View style={[s.container, { opacity: introFade }]}>
        <View style={s.introContent}>
          <Text style={s.title}>THE BOUNDARY SPECTRUM</Text>
          <Text style={s.description}>
            Boundaries aren{'\u2019'}t walls or open doors {'\u2014'} they live on a spectrum.
            Explore where your style tends to fall, and discover what each
            zone looks like in practice.
          </Text>
          <TouchableOpacity style={s.pillButton} onPress={handleExplore} activeOpacity={0.7}>
            <Text style={s.pillButtonText}>EXPLORE</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }

  // ─── Spectrum Phase ───────────────────────────
  return (
    <Animated.View style={[s.container, { opacity: spectrumFade }]}>
      <ScrollView contentContainerStyle={s.spectrumContent} showsVerticalScrollIndicator={false}>
        <Text style={s.sectionTitle}>WHERE DO YOU FALL?</Text>

        {/* Zone Buttons */}
        <View style={s.zoneRow}>
          {ZONES.map((zone) => {
            const active = selectedZone === zone.key;
            return (
              <TouchableOpacity
                key={zone.key}
                style={[s.zoneBtn, active && { backgroundColor: zone.color, borderColor: zone.color }]}
                onPress={() => handleZoneSelect(zone.key)}
                activeOpacity={0.7}
              >
                <Text style={[s.zoneBtnText, active && s.zoneBtnTextActive]}>{zone.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Spectrum Bar */}
        <View style={s.bar}>
          {ZONES.map((zone) => (
            <View
              key={zone.key}
              style={[s.barSegment, { backgroundColor: selectedZone === zone.key ? zone.color : Colors.borderLight }]}
            />
          ))}
        </View>

        {/* Example Cards */}
        {activeZone && (
          <View style={s.examples}>
            <Text style={[s.exLabel, { color: activeZone.color }]}>
              {activeZone.label.toUpperCase()} SOUNDS LIKE
            </Text>
            {activeZone.examples.map((example, i) => (
              <Animated.View
                key={`${activeZone.key}-${i}`}
                style={[
                  s.exCard, { borderLeftColor: activeZone.color },
                  { opacity: exampleAnims[i], transform: [{
                    translateY: exampleAnims[i].interpolate({ inputRange: [0, 1], outputRange: [16, 0] }),
                  }]},
                ]}
              >
                <Text style={s.exText}>{'\u201C'}{example}{'\u201D'}</Text>
              </Animated.View>
            ))}
          </View>
        )}

        {/* Lock In */}
        {selectedZone && (
          <TouchableOpacity style={s.pillButton} onPress={handleLockIn} activeOpacity={0.7}>
            <Text style={s.pillButtonText}>LOCK IN MY STYLE</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </Animated.View>
  );
}

// ─── Styles ─────────────────────────────────────
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  // Intro
  introContent: {
    flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.xl,
  },
  title: {
    fontSize: FontSizes.headingL, fontFamily: FontFamilies.heading, fontWeight: '800',
    color: Colors.text, letterSpacing: 3, textAlign: 'center',
  },
  description: {
    fontSize: FontSizes.body, color: Colors.textSecondary, textAlign: 'center',
    lineHeight: 24, marginTop: Spacing.md, paddingHorizontal: Spacing.md,
  },

  // Spectrum
  spectrumContent: {
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl,
    paddingBottom: Spacing.scrollPadBottom, alignItems: 'center',
  },
  sectionTitle: {
    fontSize: FontSizes.headingM, fontFamily: FontFamilies.heading, fontWeight: '800',
    color: Colors.text, letterSpacing: 2, textAlign: 'center', marginBottom: Spacing.lg,
  },

  // Zone buttons
  zoneRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md, width: '100%', justifyContent: 'center' },
  zoneBtn: {
    flex: 1, paddingVertical: 12, borderRadius: BorderRadius.pill,
    borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.surface,
    alignItems: 'center',
  },
  zoneBtnText: { fontSize: FontSizes.caption, fontWeight: '600', letterSpacing: 0.5, color: Colors.textSecondary },
  zoneBtnTextActive: { color: '#FFF' },

  // Spectrum bar
  bar: {
    flexDirection: 'row', width: '100%', height: 8,
    borderRadius: 4, overflow: 'hidden', gap: 3, marginBottom: Spacing.lg,
  },
  barSegment: { flex: 1, borderRadius: 4 },

  // Examples
  examples: { width: '100%', marginBottom: Spacing.lg },
  exLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 2, marginBottom: Spacing.md },
  exCard: {
    backgroundColor: Colors.surface, borderRadius: BorderRadius.md,
    padding: Spacing.md, marginBottom: Spacing.sm, borderLeftWidth: 4, ...Shadows.subtle,
  },
  exText: { fontSize: FontSizes.body, color: Colors.text, lineHeight: 22, fontStyle: 'italic' },

  // Shared pill button
  pillButton: {
    backgroundColor: Colors.text, paddingVertical: 16, paddingHorizontal: 44,
    borderRadius: BorderRadius.pill, alignItems: 'center', marginTop: Spacing.xl,
  },
  pillButtonText: { color: '#FFF', fontSize: FontSizes.body, fontWeight: '600', letterSpacing: 2 },
});
