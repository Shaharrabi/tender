/**
 * L3: Leaves on a Stream — Classic ACT Defusion Exercise
 *
 * Phase 0: Intro with description of the exercise.
 * Phase 1: Animated stream with floating leaves. User types thoughts,
 *   places them on leaves that float across. After 3+ thoughts,
 *   option to enter a 2-minute meditation.
 * Phase 2: Optional meditation with countdown timer and pulsing circle.
 * Phase 3: Complete -> onComplete.
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import { MC5_PALETTE } from '@/constants/mc5Theme';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type LessonPhase = 'intro' | 'stream' | 'meditation' | 'complete';

interface FloatingLeaf {
  id: number;
  text: string;
  translateX: Animated.Value;
  translateY: Animated.Value;
  yOffset: number;
}

interface L3LeavesOnStreamProps {
  content: ResolvedLessonContent;
  attachmentStyle?: AttachmentStyle;
  onComplete: (responses: StepResponseEntry[]) => void;
}

export function L3LeavesOnStream({
  content,
  attachmentStyle,
  onComplete,
}: L3LeavesOnStreamProps) {
  const haptics = useSoundHaptics();

  const [phase, setPhase] = useState<LessonPhase>('intro');
  const [thoughtText, setThoughtText] = useState('');
  const [thoughts, setThoughts] = useState<string[]>([]);
  const [leaves, setLeaves] = useState<FloatingLeaf[]>([]);
  const [meditationTime, setMeditationTime] = useState(120);
  const [meditationDone, setMeditationDone] = useState(false);

  const leafIdRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;

  // ─── Water dots for stream ─────────────────────────────
  const waterDots = useRef(
    Array.from({ length: 6 }, (_, i) => ({
      anim: new Animated.Value(-20 + i * (SCREEN_WIDTH / 6)),
      y: 30 + Math.random() * 60,
      size: 4 + Math.random() * 4,
    }))
  ).current;

  // Start water animation when in stream phase
  useEffect(() => {
    if (phase !== 'stream') return;
    const animations = waterDots.map((dot) => {
      const duration = 8000 + Math.random() * 4000;
      const loop = () => {
        dot.anim.setValue(-20);
        Animated.timing(dot.anim, {
          toValue: SCREEN_WIDTH + 20,
          duration,
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (finished) loop();
        });
      };
      loop();
    });
  }, [phase]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // ─── Intro fade ────────────────────────────────────────
  useEffect(() => {
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // ─── Helpers ───────────────────────────────────────────
  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const handleBegin = useCallback(() => {
    haptics.tap();
    setPhase('stream');
  }, [haptics]);

  const placeLeaf = useCallback(() => {
    const trimmed = thoughtText.trim();
    if (!trimmed) return;

    haptics.tapSoft();
    setThoughts((prev) => [...prev, trimmed]);
    setThoughtText('');

    const id = leafIdRef.current++;
    const yOffset = 10 + Math.random() * 70;
    const translateX = new Animated.Value(SCREEN_WIDTH);
    const translateY = new Animated.Value(0);

    const leaf: FloatingLeaf = { id, text: trimmed, translateX, translateY, yOffset };

    setLeaves((prev) => {
      const next = [...prev, leaf];
      return next.length > 5 ? next.slice(-5) : next;
    });

    // Float across
    Animated.timing(translateX, {
      toValue: -200,
      duration: 15000,
      useNativeDriver: true,
    }).start();

    // Gentle bobbing
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -8,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 8,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [thoughtText, haptics]);

  const startMeditation = useCallback(() => {
    haptics.playReflectionDing();
    setPhase('meditation');
    setMeditationTime(120);

    // Pulsing circle
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1.0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Countdown
    timerRef.current = setInterval(() => {
      setMeditationTime((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setMeditationDone(true);
          // Bell at end
          haptics.playReflectionDing();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [haptics, pulseAnim]);

  const handleComplete = useCallback((didMeditate: boolean) => {
    haptics.tap();
    const responses: StepResponseEntry[] = [
      {
        step: 1,
        prompt: 'Leaves on a Stream',
        response: JSON.stringify({
          thoughts,
          thoughtCount: thoughts.length,
          meditationCompleted: didMeditate,
        }),
        type: 'interactive',
      },
    ];
    onComplete(responses);
  }, [haptics, thoughts, onComplete]);

  // ─── PHASE 0: INTRO ───────────────────────────────────
  if (phase === 'intro') {
    return (
      <Animated.View style={[styles.container, { opacity: fadeIn }]}>
        <ScrollView
          contentContainerStyle={styles.introContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>LEAVES ON A STREAM</Text>

          <View style={styles.introCard}>
            <Text style={styles.introText}>
              Imagine sitting beside a gently flowing stream. Leaves drift by on
              the surface of the water, carried along by the current.
            </Text>
            <Text style={styles.introText}>
              Each time a thought arises {'\u2014'} a worry, a judgment, a memory {'\u2014'}{' '}
              you'll place it on a leaf and let the stream carry it away.
            </Text>
            <Text style={styles.introHint}>
              You don't need to change the thought. Just notice it and let it float.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.beginButton}
            onPress={handleBegin}
            activeOpacity={0.7}
          >
            <Text style={styles.beginButtonText}>BEGIN</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    );
  }

  // ─── PHASE 1: STREAM + THOUGHTS ───────────────────────
  if (phase === 'stream') {
    return (
      <View style={styles.container}>
        {/* Stream */}
        <View style={styles.stream}>
          {/* Water dots */}
          {waterDots.map((dot, i) => (
            <Animated.View
              key={i}
              style={[
                styles.waterDot,
                {
                  width: dot.size,
                  height: dot.size,
                  borderRadius: dot.size / 2,
                  top: dot.y,
                  transform: [{ translateX: dot.anim }],
                },
              ]}
            />
          ))}

          {/* Floating leaves */}
          {leaves.map((leaf) => (
            <Animated.View
              key={leaf.id}
              style={[
                styles.leaf,
                {
                  top: leaf.yOffset,
                  transform: [
                    { translateX: leaf.translateX },
                    { translateY: leaf.translateY },
                  ],
                },
              ]}
            >
              <Text style={styles.leafText} numberOfLines={2}>
                {leaf.text}
              </Text>
            </Animated.View>
          ))}
        </View>

        {/* Counter */}
        <Text style={styles.counter}>
          {thoughts.length} thought{thoughts.length !== 1 ? 's' : ''} released
        </Text>

        {/* Input */}
        <View style={styles.inputSection}>
          <TextInput
            style={styles.thoughtInput}
            placeholder="Notice a thought..."
            placeholderTextColor={Colors.textMuted}
            value={thoughtText}
            onChangeText={setThoughtText}
            onSubmitEditing={placeLeaf}
            returnKeyType="done"
          />
          <TouchableOpacity
            style={[styles.placeButton, !thoughtText.trim() && styles.placeButtonDisabled]}
            onPress={placeLeaf}
            activeOpacity={0.7}
            disabled={!thoughtText.trim()}
          >
            <Text style={styles.placeButtonText}>Place on a Leaf</Text>
          </TouchableOpacity>
        </View>

        {/* Meditation prompt after 3+ thoughts */}
        {thoughts.length >= 3 && (
          <View style={styles.meditationPrompt}>
            <TouchableOpacity
              style={styles.meditateButton}
              onPress={startMeditation}
              activeOpacity={0.7}
            >
              <Text style={styles.meditateButtonText}>Ready for meditation?</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleComplete(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.skipText}>Skip to finish</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  // ─── PHASE 2: MEDITATION ──────────────────────────────
  if (phase === 'meditation') {
    return (
      <View style={styles.meditationContainer}>
        <Animated.View
          style={[
            styles.pulseCircle,
            { transform: [{ scale: pulseAnim }] },
          ]}
        />

        <Text style={styles.timerText}>{formatTime(meditationTime)}</Text>

        {!meditationDone && (
          <Text style={styles.meditationHint}>
            Let thoughts come and go...
          </Text>
        )}

        {meditationDone && (
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => handleComplete(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.continueButtonText}>CONTINUE</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // ─── Fallback ──────────────────────────────────────────
  return null;
}

// ─── Styles ──────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  introContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.scrollPadBottom,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  title: {
    fontSize: FontSizes.headingM,
    fontFamily: FontFamilies.heading,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: 1.5,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  introCard: {
    backgroundColor: MC5_PALETTE.paleCloud,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: MC5_PALETTE.softLilac,
    gap: Spacing.md,
    width: '100%',
  },
  introText: {
    fontSize: FontSizes.body,
    fontFamily: FontFamilies.body,
    lineHeight: 24,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  introHint: {
    fontSize: FontSizes.bodySmall,
    fontFamily: FontFamilies.body,
    color: MC5_PALETTE.deepLavender,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 22,
  },
  beginButton: {
    marginTop: Spacing.xl,
    backgroundColor: MC5_PALETTE.lavender,
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: 30,
    ...Shadows.subtle,
  },
  beginButtonText: {
    color: '#FFFFFF',
    fontFamily: FontFamilies.heading,
    fontWeight: '700',
    fontSize: FontSizes.body,
    letterSpacing: 2,
  },

  // ─── Stream ──────────────────────────────────────────
  stream: {
    height: 120,
    backgroundColor: MC5_PALETTE.mistBlue,
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.lg,
    borderWidth: 1,
    borderColor: MC5_PALETTE.mistBlue + '80',
    overflow: 'hidden',
    position: 'relative',
  },
  waterDot: {
    position: 'absolute',
    backgroundColor: '#FFFFFF40',
  },
  leaf: {
    position: 'absolute',
    backgroundColor: MC5_PALETTE.leafGreen,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    maxWidth: 160,
    ...Shadows.subtle,
  },
  leafText: {
    fontSize: FontSizes.caption,
    fontFamily: FontFamilies.body,
    color: '#FFFFFF',
    textAlign: 'center',
  },

  // ─── Input ───────────────────────────────────────────
  counter: {
    fontSize: FontSizes.bodySmall,
    fontFamily: FontFamilies.body,
    color: MC5_PALETTE.deepLavender,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
  inputSection: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    gap: Spacing.sm,
  },
  thoughtInput: {
    backgroundColor: MC5_PALETTE.paleCloud,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: MC5_PALETTE.softLilac,
    padding: Spacing.md,
    fontSize: FontSizes.body,
    fontFamily: FontFamilies.body,
    color: Colors.text,
  },
  placeButton: {
    backgroundColor: MC5_PALETTE.leafGreen,
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    ...Shadows.subtle,
  },
  placeButtonDisabled: {
    opacity: 0.5,
  },
  placeButtonText: {
    color: '#FFFFFF',
    fontFamily: FontFamilies.heading,
    fontWeight: '600',
    fontSize: FontSizes.body,
  },

  // ─── Meditation prompt ───────────────────────────────
  meditationPrompt: {
    alignItems: 'center',
    marginTop: Spacing.xl,
    gap: Spacing.sm,
  },
  meditateButton: {
    backgroundColor: MC5_PALETTE.lavender,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 24,
    ...Shadows.subtle,
  },
  meditateButtonText: {
    color: '#FFFFFF',
    fontFamily: FontFamilies.heading,
    fontWeight: '600',
    fontSize: FontSizes.body,
  },
  skipText: {
    fontSize: FontSizes.bodySmall,
    fontFamily: FontFamilies.body,
    color: Colors.textMuted,
    textDecorationLine: 'underline',
    marginTop: Spacing.xs,
  },

  // ─── Meditation ──────────────────────────────────────
  meditationContainer: {
    flex: 1,
    backgroundColor: MC5_PALETTE.paleCloud,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  pulseCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: MC5_PALETTE.softLilac,
    borderWidth: 2,
    borderColor: MC5_PALETTE.lavender,
    marginBottom: Spacing.xxxl,
  },
  timerText: {
    fontSize: 56,
    fontWeight: '200',
    color: MC5_PALETTE.deepLavender,
    fontVariant: ['tabular-nums'],
    fontFamily: FontFamilies.accent,
  },
  meditationHint: {
    fontSize: FontSizes.bodySmall,
    fontFamily: FontFamilies.body,
    color: MC5_PALETTE.deepLavender,
    fontStyle: 'italic',
    marginTop: Spacing.lg,
  },
  continueButton: {
    marginTop: Spacing.xl,
    backgroundColor: MC5_PALETTE.lavender,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    ...Shadows.subtle,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontFamily: FontFamilies.heading,
    fontWeight: '700',
    fontSize: FontSizes.body,
    letterSpacing: 2,
  },
});
