/**
 * L2: Horseman Matcher — Select antidote + tap horseman matching game
 *
 * Four Horseman cards and four Antidote chips. User selects an antidote
 * chip, then taps the matching horseman. Wrong = shake, Correct = glow.
 * After all matched, user identifies their own horseman.
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
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
import { MC3_PALETTE } from '@/constants/mc3Theme';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

type Phase = 'intro' | 'matching' | 'identify';

interface L2HorsemanMatcherProps {
  content: ResolvedLessonContent;
  attachmentStyle?: AttachmentStyle;
  onComplete: (responses: StepResponseEntry[]) => void;
}

const HORSEMEN_DATA = [
  {
    id: 'criticism',
    horseman: 'Criticism',
    description: "Attacking your partner's character.",
    example: '\u201CYou never think about anyone but yourself.\u201D',
    antidoteId: 'gentle_startup',
    antidote: 'Gentle Startup',
    antidoteDescription: 'Complain about the behavior without blaming the person.',
    antidoteExample: "\u201CI felt forgotten when you didn't call. I need to know I'm on your mind.\u201D",
    color: MC3_PALETTE.warmCoral,
  },
  {
    id: 'contempt',
    horseman: 'Contempt',
    description: 'Criticism plus disgust \u2014 eye-rolling, mockery, name-calling.',
    example: 'The single greatest predictor of divorce.',
    antidoteId: 'appreciation',
    antidote: 'Culture of Appreciation',
    antidoteDescription: 'Express appreciation and respect more than frustration.',
    antidoteExample: 'The magic ratio: 5 positive interactions for every 1 negative.',
    color: MC3_PALETTE.warningRed,
  },
  {
    id: 'defensiveness',
    horseman: 'Defensiveness',
    description: "Self-protection: \u201CIt's not my fault. You're the one who...\u201D",
    example: 'Refusing to accept any responsibility.',
    antidoteId: 'responsibility',
    antidote: 'Taking Responsibility',
    antidoteDescription: 'Accept some responsibility for your part, even a small part.',
    antidoteExample: "\u201CYou're right, I should have called. I got caught up and I'm sorry.\u201D",
    color: MC3_PALETTE.amber,
  },
  {
    id: 'stonewalling',
    horseman: 'Stonewalling',
    description: 'Shutting down \u2014 going blank, walking away, refusing to engage.',
    example: 'Usually happens when flooding (outside your window of tolerance).',
    antidoteId: 'self_soothe',
    antidote: 'Self-Soothing + Re-engagement',
    antidoteDescription: 'Recognize flooding, take a 20-minute break, then come back.',
    antidoteExample: "\u201CI need a break. I'll be back in 20 minutes and we can continue.\u201D",
    color: MC3_PALETTE.coolSlate,
  },
];

export function L2HorsemanMatcher({ content, attachmentStyle, onComplete }: L2HorsemanMatcherProps) {
  const haptics = useSoundHaptics();

  const [phase, setPhase] = useState<Phase>('intro');
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [totalMistakes, setTotalMistakes] = useState(0);
  const [selectedAntidote, setSelectedAntidote] = useState<string | null>(null);
  const [myHorseman, setMyHorseman] = useState('');
  const [partnerHorseman, setPartnerHorseman] = useState('');

  // Shake animations for wrong matches (one per horseman)
  const shakeAnims = useRef(
    HORSEMEN_DATA.reduce((acc, h) => {
      acc[h.id] = new Animated.Value(0);
      return acc;
    }, {} as Record<string, Animated.Value>)
  ).current;

  // Shuffled antidotes
  const [shuffledAntidotes] = useState(() =>
    [...HORSEMEN_DATA]
      .sort(() => Math.random() - 0.5)
      .map(h => ({
        id: h.antidoteId,
        label: h.antidote,
        matchesHorseman: h.id,
      }))
  );

  // Fade for phases
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const shakeCard = useCallback((horsemanId: string) => {
    const anim = shakeAnims[horsemanId];
    Animated.sequence([
      Animated.timing(anim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(anim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 8, duration: 50, useNativeDriver: true }),
      Animated.timing(anim, { toValue: -8, duration: 50, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  }, [shakeAnims]);

  const tryMatch = useCallback((horsemanId: string) => {
    if (!selectedAntidote || matchedPairs.has(horsemanId)) return;

    const antidote = shuffledAntidotes.find(a => a.id === selectedAntidote);
    if (!antidote) return;

    const isCorrect = antidote.matchesHorseman === horsemanId;

    if (isCorrect) {
      haptics.playConfetti();
      const newMatched = new Set(matchedPairs);
      newMatched.add(horsemanId);
      setMatchedPairs(newMatched);
      setSelectedAntidote(null);

      // Check if all matched
      if (newMatched.size === HORSEMEN_DATA.length) {
        setTimeout(() => {
          setPhase('identify');
          fadeAnim.setValue(0);
          Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
        }, 800);
      }
    } else {
      // Wrong — shake + haptic
      haptics.tap();
      shakeCard(horsemanId);
      setTotalMistakes(prev => prev + 1);
      setSelectedAntidote(null);
    }
  }, [selectedAntidote, matchedPairs, shuffledAntidotes, haptics, shakeCard, fadeAnim]);

  const handleFinish = useCallback(() => {
    haptics.playConfetti();
    const responses: StepResponseEntry[] = [
      {
        step: 1,
        prompt: 'Horseman Matcher',
        response: JSON.stringify({
          allMatchedCorrectly: true,
          noMistakes: totalMistakes === 0,
          totalMistakes,
        }),
        type: 'interactive',
      },
      {
        step: 2,
        prompt: 'Horseman identification',
        response: JSON.stringify({
          myHorseman,
          partnerHorseman,
        }),
        type: 'identification',
      },
    ];
    onComplete(responses);
  }, [totalMistakes, myHorseman, partnerHorseman, haptics, onComplete]);

  // ─── Intro Phase ───────────────────────────────

  if (phase === 'intro') {
    return (
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.introContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>THE FOUR HORSEMEN</Text>
        <Text style={styles.subtitle}>
          Gottman identified four behaviors that predict relationship failure
          with over 90% accuracy. Each has a specific, learnable antidote.
        </Text>
        <Text style={styles.body}>
          Match each Horseman with its antidote by selecting an antidote below,
          then tapping the horseman it counteracts.
        </Text>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            haptics.tap();
            setPhase('matching');
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.actionButtonText}>START MATCHING</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // ─── Identify Phase ────────────────────────────

  if (phase === 'identify') {
    return (
      <Animated.View style={[styles.identifyContainer, { opacity: fadeAnim }]}>
        <ScrollView
          contentContainerStyle={styles.identifyContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>WHICH ONE IS YOURS?</Text>
          <Text style={styles.body}>
            Be honest, and be compassionate. These are patterns, not character defects.
          </Text>

          <Text style={styles.inputLabel}>My most frequent horseman:</Text>
          <View style={styles.selectionGrid}>
            {HORSEMEN_DATA.map(h => (
              <TouchableOpacity
                key={h.id}
                style={[
                  styles.selectionChip,
                  { borderColor: h.color },
                  myHorseman === h.id && { backgroundColor: h.color },
                ]}
                onPress={() => {
                  haptics.tap();
                  setMyHorseman(h.id);
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.selectionChipText,
                    myHorseman === h.id && { color: '#FFF' },
                  ]}
                >
                  {h.horseman}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.inputLabel}>My partner tends to use:</Text>
          <View style={styles.selectionGrid}>
            {HORSEMEN_DATA.map(h => (
              <TouchableOpacity
                key={h.id}
                style={[
                  styles.selectionChip,
                  { borderColor: h.color },
                  partnerHorseman === h.id && { backgroundColor: h.color },
                ]}
                onPress={() => {
                  haptics.tap();
                  setPartnerHorseman(h.id);
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.selectionChipText,
                    partnerHorseman === h.id && { color: '#FFF' },
                  ]}
                >
                  {h.horseman}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[
              styles.actionButton,
              (!myHorseman || !partnerHorseman) && styles.actionButtonDisabled,
            ]}
            onPress={handleFinish}
            disabled={!myHorseman || !partnerHorseman}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonText}>CONTINUE</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    );
  }

  // ─── Matching Phase ────────────────────────────

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.matchingContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.matchingTitle}>MATCH THE ANTIDOTES</Text>
      <Text style={styles.matchingHint}>
        Select an antidote, then tap its horseman
      </Text>

      {/* Horsemen Column */}
      <Text style={styles.sectionLabel}>THE HORSEMEN</Text>
      {HORSEMEN_DATA.map(h => {
        const isMatched = matchedPairs.has(h.id);
        return (
          <Animated.View
            key={h.id}
            style={{ transform: [{ translateX: shakeAnims[h.id] }] }}
          >
            <TouchableOpacity
              style={[
                styles.horsemanCard,
                { borderLeftColor: h.color },
                isMatched && styles.horsemanCardMatched,
              ]}
              onPress={() => tryMatch(h.id)}
              disabled={isMatched || !selectedAntidote}
              activeOpacity={0.7}
            >
              <Text style={styles.horsemanName}>{h.horseman}</Text>
              <Text style={styles.horsemanDesc}>{h.description}</Text>
              {isMatched && (
                <View style={styles.matchedBadge}>
                  <Text style={styles.matchedBadgeText}>
                    {'\u2713'} {h.antidote}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>
        );
      })}

      {/* Antidotes Row */}
      <Text style={[styles.sectionLabel, { marginTop: Spacing.lg }]}>
        ANTIDOTES {matchedPairs.size > 0 && `(${4 - matchedPairs.size} remaining)`}
      </Text>
      <View style={styles.antidotesGrid}>
        {shuffledAntidotes
          .filter(a => !matchedPairs.has(a.matchesHorseman))
          .map(antidote => (
            <TouchableOpacity
              key={antidote.id}
              style={[
                styles.antidoteChip,
                selectedAntidote === antidote.id && styles.antidoteChipSelected,
              ]}
              onPress={() => {
                haptics.tap();
                setSelectedAntidote(
                  selectedAntidote === antidote.id ? null : antidote.id
                );
              }}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.antidoteChipText,
                  selectedAntidote === antidote.id && styles.antidoteChipTextSelected,
                ]}
              >
                {antidote.label}
              </Text>
            </TouchableOpacity>
          ))}
      </View>

      {/* Hint text */}
      {selectedAntidote && (
        <Text style={styles.hintText}>
          Now tap the horseman that {'\u201C'}{shuffledAntidotes.find(a => a.id === selectedAntidote)?.label}{'\u201D'} counteracts
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  introContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.scrollPadBottom,
    alignItems: 'center',
  },
  title: {
    fontSize: FontSizes.headingM,
    fontFamily: FontFamilies.heading,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: 3,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
    lineHeight: 20,
  },
  body: {
    fontSize: FontSizes.body,
    color: Colors.text,
    textAlign: 'center',
    marginTop: Spacing.md,
    lineHeight: 22,
  },
  actionButton: {
    backgroundColor: Colors.text,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: BorderRadius.pill,
    marginTop: Spacing.lg,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: FontSizes.body,
    fontWeight: '600',
    letterSpacing: 1,
  },
  actionButtonDisabled: {
    opacity: 0.4,
  },

  // ─── Matching ──────────────────────
  matchingContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: 100,
  },
  matchingTitle: {
    fontSize: FontSizes.headingS,
    fontFamily: FontFamilies.heading,
    fontWeight: '800',
    letterSpacing: 3,
    color: Colors.text,
    textAlign: 'center',
  },
  matchingHint: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xs,
    fontStyle: 'italic',
    marginBottom: Spacing.lg,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  horsemanCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderLeftWidth: 4,
    ...Shadows.subtle,
  },
  horsemanCardMatched: {
    backgroundColor: MC3_PALETTE.repairGreen + '15',
    borderLeftColor: MC3_PALETTE.repairGreen,
  },
  horsemanName: {
    fontSize: FontSizes.body,
    fontWeight: '700',
    color: Colors.text,
  },
  horsemanDesc: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  matchedBadge: {
    marginTop: Spacing.sm,
    backgroundColor: MC3_PALETTE.repairGreen,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  matchedBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
  },
  antidotesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  antidoteChip: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.pill,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: MC3_PALETTE.amber,
  },
  antidoteChipSelected: {
    backgroundColor: MC3_PALETTE.amber,
  },
  antidoteChipText: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '600',
    color: MC3_PALETTE.amber,
  },
  antidoteChipTextSelected: {
    color: '#FFF',
  },
  hintText: {
    fontSize: FontSizes.bodySmall,
    color: MC3_PALETTE.amber,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: Spacing.md,
  },

  // ─── Identify ──────────────────────
  identifyContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  identifyContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.scrollPadBottom,
  },
  inputLabel: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  selectionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  selectionChip: {
    borderRadius: BorderRadius.pill,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 2,
    backgroundColor: Colors.surfaceElevated,
  },
  selectionChipText: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '600',
    color: Colors.text,
  },
});
