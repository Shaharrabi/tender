/**
 * L3: Compass Builder — Shared Values Direction
 *
 * Users select their top 3 shared values to create a "relationship compass"
 * and name the direction they are headed together. The compass needle
 * spins theatrically before settling. Warm gold/blue Wes Anderson tones.
 */

import React, { useState, useRef, useCallback, useMemo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Animated,
  Easing,
} from 'react-native';
import {
  Colors, Spacing, FontSizes, FontFamilies, BorderRadius, Shadows,
} from '@/constants/theme';
import { MC6_PALETTE } from '@/constants/mc6Theme';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

interface L3CompassBuilderProps {
  content: ResolvedLessonContent;
  attachmentStyle?: AttachmentStyle;
  onComplete: (responses: StepResponseEntry[]) => void;
  l1SortData?: string;
}

type Phase = 'intro' | 'select' | 'compass' | 'name';

const SUGGESTIONS = ['Gentle Growth', 'Steady Love', 'Brave Together', 'Open Hearts', 'Deep Roots'];
const FALLBACK_VALUES = ['Trust', 'Honesty', 'Growth', 'Kindness', 'Respect', 'Intimacy'];
const COMPASS_SIZE = 220;
const R = COMPASS_SIZE / 2 - 20;
const CENTER = COMPASS_SIZE / 2;
const CHIP_W = 80;
const CHIP_H = 28;

const VALUE_POSITIONS = [
  { x: CENTER + R * Math.sin(0), y: CENTER - R * Math.cos(0) },
  { x: CENTER + R * Math.sin((2 * Math.PI) / 3), y: CENTER - R * Math.cos((2 * Math.PI) / 3) },
  { x: CENTER + R * Math.sin((4 * Math.PI) / 3), y: CENTER - R * Math.cos((4 * Math.PI) / 3) },
];

// ─── Component ──────────────────────────────────────────

export function L3CompassBuilder({ content, attachmentStyle, onComplete, l1SortData }: L3CompassBuilderProps) {
  const haptics = useSoundHaptics();
  const [phase, setPhase] = useState<Phase>('intro');
  const [selected, setSelected] = useState<string[]>([]);
  const [directionText, setDirectionText] = useState('');
  const [needleSettled, setNeedleSettled] = useState(false);
  const needleRotation = useRef(new Animated.Value(0)).current;

  const sharedValues = useMemo(() => {
    if (l1SortData) {
      try {
        const parsed = JSON.parse(l1SortData);
        return parsed.overlap?.sharedEssential || FALLBACK_VALUES;
      } catch { return FALLBACK_VALUES; }
    }
    return FALLBACK_VALUES;
  }, [l1SortData]);

  const toggleValue = useCallback((val: string) => {
    haptics.tap();
    setSelected(prev => {
      if (prev.includes(val)) return prev.filter(v => v !== val);
      if (prev.length >= 3) return prev;
      return [...prev, val];
    });
  }, [haptics]);

  const beginCompass = useCallback(() => {
    haptics.tap();
    setPhase('compass');
    Animated.timing(needleRotation, {
      toValue: 900,
      duration: 2000,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start(() => setNeedleSettled(true));
  }, [haptics, needleRotation]);

  const handleComplete = useCallback(() => {
    haptics.playConfetti();
    onComplete([{
      step: 1,
      prompt: 'Compass Builder',
      response: JSON.stringify({ compassValues: selected, directionName: directionText }),
      type: 'interactive',
    }]);
  }, [haptics, onComplete, selected, directionText]);

  const spin = needleRotation.interpolate({
    inputRange: [0, 900],
    outputRange: ['0deg', '900deg'],
  });

  // ── Phase: Intro ──────────────────────────────────────

  if (phase === 'intro') {
    return (
      <ScrollView style={s.container} contentContainerStyle={s.center}>
        <Text style={s.titleLarge}>YOUR RELATIONSHIP COMPASS</Text>
        <Text style={s.desc}>
          From everything you and your partner value, choose the three that will guide
          your relationship forward. These become the points on your shared compass.
        </Text>
        <TouchableOpacity style={s.btn} onPress={() => { haptics.tap(); setPhase('select'); }}>
          <Text style={s.btnText}>BEGIN</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // ── Phase: Select Top 3 ───────────────────────────────

  if (phase === 'select') {
    return (
      <ScrollView style={s.container} contentContainerStyle={s.center}>
        <Text style={s.titleMed}>Choose your top 3 shared values</Text>
        <Text style={s.counter}>{selected.length} of 3 selected</Text>
        <View style={s.chipGrid}>
          {sharedValues.map((val: string) => {
            const on = selected.includes(val);
            return (
              <TouchableOpacity key={val} style={[s.chip, on && s.chipOn]} onPress={() => toggleValue(val)}>
                <Text style={[s.chipTxt, on && s.chipTxtOn]}>{val}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {selected.length === 3 && (
          <TouchableOpacity style={s.btn} onPress={beginCompass}>
            <Text style={s.btnText}>Build Compass  &#8594;</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    );
  }

  // ── Phase: Compass Display ────────────────────────────

  if (phase === 'compass') {
    return (
      <ScrollView style={s.container} contentContainerStyle={s.center}>
        <Text style={s.titleMed}>Your Compass</Text>
        <View style={s.compassWrap}>
          <View style={s.circle}>
            {selected.map((val, i) => (
              <View key={val} style={[s.pill, { left: VALUE_POSITIONS[i].x - CHIP_W / 2, top: VALUE_POSITIONS[i].y - CHIP_H / 2 }]}>
                <Text style={s.pillTxt}>{val}</Text>
              </View>
            ))}
            <View style={s.dot} />
            <Animated.View style={[s.needle, { transform: [{ rotate: spin }] }]} />
          </View>
        </View>
        {needleSettled && (
          <>
            <Text style={s.nameLabel}>Name Your Direction</Text>
            <TouchableOpacity style={s.btn} onPress={() => { haptics.tap(); setPhase('name'); }}>
              <Text style={s.btnText}>Continue</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    );
  }

  // ── Phase: Name Direction ─────────────────────────────

  return (
    <ScrollView style={s.container} contentContainerStyle={s.center}>
      <Text style={s.titleMed}>Name Your Direction</Text>
      <Text style={s.desc}>What will you call the direction you're headed together?</Text>
      <TextInput
        style={s.input}
        value={directionText}
        onChangeText={setDirectionText}
        placeholder="e.g. Brave Together"
        placeholderTextColor={Colors.textMuted}
        maxLength={60}
      />
      <View style={s.sugRow}>
        {SUGGESTIONS.map(sug => (
          <TouchableOpacity
            key={sug}
            style={[s.sug, directionText === sug && s.sugOn]}
            onPress={() => { haptics.tap(); setDirectionText(sug); }}
          >
            <Text style={[s.sugTxt, directionText === sug && s.sugTxtOn]}>{sug}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {directionText.trim().length > 0 && (
        <TouchableOpacity style={s.btn} onPress={handleComplete}>
          <Text style={s.btnText}>COMPLETE</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

// ─── Styles ─────────────────────────────────────────────

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: MC6_PALETTE.paper },
  center: { alignItems: 'center', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.xl },

  titleLarge: {
    fontFamily: FontFamilies.heading, fontSize: FontSizes.xl, color: MC6_PALETTE.deepGold,
    letterSpacing: 2, textAlign: 'center', marginBottom: Spacing.md,
  },
  titleMed: {
    fontFamily: FontFamilies.heading, fontSize: FontSizes.lg, color: MC6_PALETTE.ink,
    textAlign: 'center', marginBottom: Spacing.sm,
  },
  desc: {
    fontFamily: FontFamilies.body, fontSize: FontSizes.md, color: Colors.textSecondary,
    textAlign: 'center', lineHeight: 22, marginBottom: Spacing.lg, maxWidth: 300,
  },
  counter: {
    fontFamily: FontFamilies.body, fontSize: FontSizes.sm, color: Colors.textMuted,
    marginBottom: Spacing.md,
  },

  // Value chips
  chipGrid: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center',
    gap: Spacing.sm, marginBottom: Spacing.lg, maxWidth: 340,
  },
  chip: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.round,
    borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.surface,
  },
  chipOn: { backgroundColor: MC6_PALETTE.overlapGreen, borderColor: MC6_PALETTE.overlapGreen },
  chipTxt: { fontFamily: FontFamilies.body, fontSize: FontSizes.sm, color: Colors.text },
  chipTxtOn: { color: '#FFFFFF', fontWeight: '600' },

  // Compass
  compassWrap: { marginVertical: Spacing.lg, alignItems: 'center' },
  circle: {
    width: COMPASS_SIZE, height: COMPASS_SIZE, borderRadius: COMPASS_SIZE / 2,
    borderWidth: 3, borderColor: MC6_PALETTE.compassBlue, backgroundColor: MC6_PALETTE.softGold,
    position: 'relative',
  },
  pill: {
    position: 'absolute', width: CHIP_W, height: CHIP_H, borderRadius: CHIP_H / 2,
    backgroundColor: MC6_PALETTE.overlapGreen, alignItems: 'center', justifyContent: 'center',
  },
  pillTxt: { fontFamily: FontFamilies.body, fontSize: 11, color: '#FFFFFF', fontWeight: '600' },
  dot: {
    position: 'absolute', width: 16, height: 16, borderRadius: 8,
    backgroundColor: MC6_PALETTE.deepGold, left: CENTER - 8, top: CENTER - 8,
  },
  needle: {
    position: 'absolute', width: 2, height: 40, backgroundColor: MC6_PALETTE.deepGold,
    left: CENTER - 1, top: CENTER - 40, borderRadius: 1,
  },
  nameLabel: {
    fontFamily: FontFamilies.heading, fontSize: FontSizes.md, color: MC6_PALETTE.deepGold,
    marginTop: Spacing.md, marginBottom: Spacing.md,
  },

  // Name direction
  input: {
    width: '100%', maxWidth: 300, borderWidth: 1.5, borderColor: MC6_PALETTE.warmAmber,
    borderRadius: BorderRadius.md, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    fontFamily: FontFamilies.body, fontSize: FontSizes.md, color: Colors.text,
    backgroundColor: Colors.surface, marginBottom: Spacing.md, textAlign: 'center',
  },
  sugRow: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center',
    gap: Spacing.xs, marginBottom: Spacing.lg, maxWidth: 340,
  },
  sug: {
    paddingHorizontal: Spacing.md, paddingVertical: 6, borderRadius: BorderRadius.round,
    borderWidth: 1.5, borderColor: MC6_PALETTE.warmAmber, backgroundColor: 'transparent',
  },
  sugOn: { backgroundColor: MC6_PALETTE.warmAmber },
  sugTxt: { fontFamily: FontFamilies.body, fontSize: FontSizes.xs, color: MC6_PALETTE.warmAmber },
  sugTxtOn: { color: '#FFFFFF' },

  // Buttons
  btn: {
    backgroundColor: MC6_PALETTE.deepGold, paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md, borderRadius: BorderRadius.round, marginTop: Spacing.sm,
    ...Shadows.sm,
  },
  btnText: {
    fontFamily: FontFamilies.heading, fontSize: FontSizes.md, color: '#FFFFFF', letterSpacing: 1,
  },
});
