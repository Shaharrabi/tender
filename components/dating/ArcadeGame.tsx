/**
 * The Field — 80s Arcade Self-Discovery Game
 *
 * Instead of filling out a form, you play a tiny game.
 * Your choices build your dating constellation — the pattern
 * of energies you bring to new connections.
 *
 * 8 scenarios. No wrong answers. Your choices reveal who you are.
 *
 * Phases: intro → 8 scenario cards → constellation reveal
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '@/constants/theme';
import { GAME_SCENARIOS, ARCHETYPE_NAMES } from '@/constants/dating/gameScenarios';
import { calculateConstellation, calculateArchetypeScores } from '@/utils/dating/constellationCalc';
import type { GameAnswer, ConstellationResult, ArchetypeScores } from '@/types/dating';

// ─── Arcade color palette ────────────────────────────────────
const ARCADE = {
  bg: '#1a0a2e',
  bgGlow: '#2d1b4e',
  neon: '#FF6EC7',
  cyan: '#00FFFF',
  lime: '#39FF14',
  purple: '#BF40BF',
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ArcadeGameProps {
  onComplete: (
    answers: GameAnswer[],
    constellation: ConstellationResult,
    archetypeScores: ArchetypeScores,
  ) => void;
}

// ─── Starfield Background ────────────────────────────────────
// Replaces canvas with animated React Native Views

function Starfield() {
  const stars = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2.5 + 1,
        delay: Math.random() * 2000,
      })),
    [],
  );

  return (
    <View style={styles.starfield} pointerEvents="none">
      {/* Grid lines */}
      {Array.from({ length: 12 }, (_, i) => (
        <View
          key={`grid-${i}`}
          style={[
            styles.gridLine,
            { top: `${(i + 1) * 8}%` },
          ]}
        />
      ))}
      {/* Stars */}
      {stars.map((star) => (
        <Star key={star.id} {...star} />
      ))}
    </View>
  );
}

function Star({ x, y, size, delay }: { x: number; y: number; size: number; delay: number }) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.9, { duration: 1000 + delay }),
        withTiming(0.3, { duration: 1000 + delay }),
      ),
      -1,
      true,
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.star,
        animStyle,
        {
          left: `${x}%`,
          top: `${y}%`,
          width: size,
          height: size,
        },
      ]}
    />
  );
}

// ─── Progress Dots ───────────────────────────────────────────

function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <View style={styles.progressContainer}>
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={[
            styles.progressDot,
            i < current && styles.progressDotComplete,
            i === current && styles.progressDotActive,
          ]}
        />
      ))}
    </View>
  );
}

// ─── Main Component ──────────────────────────────────────────

export default function ArcadeGame({ onComplete }: ArcadeGameProps) {
  const [step, setStep] = useState(-1); // -1 = intro
  const [answers, setAnswers] = useState<GameAnswer[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);

  const handleChoice = useCallback(
    (optionIndex: number) => {
      if (selectedOption !== null) return; // Prevent double-tap

      const scenario = GAME_SCENARIOS[step];
      const option = scenario.options[optionIndex];

      setSelectedOption(optionIndex);
      setFlash(true);

      setTimeout(() => {
        setFlash(false);
        const newAnswer: GameAnswer = {
          scenarioId: scenario.id,
          choiceIndex: optionIndex,
          trait: option.trait,
          points: option.points,
        };
        const newAnswers = [...answers, newAnswer];
        setAnswers(newAnswers);
        setSelectedOption(null);

        if (step < GAME_SCENARIOS.length - 1) {
          setStep(step + 1);
        } else {
          setShowResult(true);
        }
      }, 600);
    },
    [step, answers, selectedOption],
  );

  const handleComplete = useCallback(() => {
    const constellation = calculateConstellation(answers);
    const archetypeScores = calculateArchetypeScores(answers);
    onComplete(answers, constellation, archetypeScores);
  }, [answers, onComplete]);

  // ─── Result Screen ───
  if (showResult) {
    const constellation = calculateConstellation(answers);
    const topTraits = constellation.topTraits;

    return (
      <View style={styles.arcadeContainer}>
        <Starfield />
        <View style={styles.contentOverlay}>
          <Animated.View entering={FadeInDown.duration(500)} style={styles.resultContent}>
            <Text style={styles.monoBadge}>Field Analysis Complete</Text>
            <Text style={styles.resultTitle}>Your Dating Constellation</Text>

            <View style={styles.traitCardsRow}>
              {topTraits.map((trait, i) => (
                <Animated.View
                  key={trait}
                  entering={FadeInUp.delay(200 + i * 200).duration(500)}
                  style={[
                    styles.traitCard,
                    i === 0 && styles.traitCardPrimary,
                  ]}
                >
                  <Text style={styles.traitRank}>
                    {i === 0 ? 'Primary' : i === 1 ? 'Secondary' : 'Tertiary'}
                  </Text>
                  <Text style={styles.traitName}>
                    {ARCHETYPE_NAMES[trait] || trait}
                  </Text>
                </Animated.View>
              ))}
            </View>

            <Text style={styles.resultDescription}>
              These aren't labels — they're the energies you bring to connection.
              They'll shape who you resonate with in the rooms ahead.
            </Text>

            <TouchableOpacity style={styles.enterLobbyButton} onPress={handleComplete}>
              <Text style={styles.enterLobbyText}>Enter The Lobby →</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    );
  }

  // ─── Intro Screen ───
  if (step === -1) {
    return (
      <View style={styles.arcadeContainer}>
        <Starfield />
        <View style={styles.contentOverlay}>
          <Animated.View entering={FadeIn.duration(600)} style={styles.introContent}>
            <Text style={styles.introEmoji}>🕹️</Text>
            <Text style={styles.introTitle}>THE FIELD</Text>
            <Text style={styles.introSubtitle}>
              A game about how you show up for connection
            </Text>

            <View style={styles.howItWorks}>
              <Text style={styles.howItWorksLabel}>HOW IT WORKS</Text>
              <Text style={styles.howItWorksText}>
                8 scenarios. No wrong answers. Your choices reveal your dating
                constellation — the pattern of energies you bring to new
                connections. This becomes the heart of your profile.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.startButton}
              onPress={() => setStep(0)}
            >
              <Text style={styles.startButtonText}>▶ START</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    );
  }

  // ─── Game Screen ───
  const scenario = GAME_SCENARIOS[step];

  return (
    <View style={[styles.arcadeContainer, flash && styles.arcadeFlash]}>
      <Starfield />
      <View style={styles.contentOverlay}>
        <ProgressDots current={step} total={GAME_SCENARIOS.length} />

        <Animated.View
          key={`scenario-${step}`}
          entering={FadeIn.duration(400)}
          style={styles.scenarioContent}
        >
          <Text style={styles.scenarioEmoji}>{scenario.emoji}</Text>
          <Text style={styles.scenarioBadge}>
            Scenario {step + 1} of {GAME_SCENARIOS.length}
          </Text>
          <Text style={styles.scenarioText}>{scenario.scene}</Text>

          <View style={styles.optionsContainer}>
            {scenario.options.map((opt, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.optionButton,
                  selectedOption === i && styles.optionButtonSelected,
                ]}
                onPress={() => handleChoice(i)}
                disabled={selectedOption !== null}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedOption === i && styles.optionTextSelected,
                  ]}
                >
                  {opt.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────

const styles = StyleSheet.create({
  arcadeContainer: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    minHeight: 440,
    backgroundColor: ARCADE.bg,
    position: 'relative',
  },
  arcadeFlash: {
    shadowColor: ARCADE.neon,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 10,
  },
  starfield: {
    ...StyleSheet.absoluteFillObject,
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: `${ARCADE.purple}14`,
  },
  star: {
    position: 'absolute',
    backgroundColor: ARCADE.neon,
    borderRadius: 1,
  },
  contentOverlay: {
    flex: 1,
    padding: Spacing.lg,
    zIndex: 1,
  },

  // Progress
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginBottom: Spacing.lg,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: `${ARCADE.purple}44`,
  },
  progressDotComplete: {
    backgroundColor: ARCADE.neon,
  },
  progressDotActive: {
    width: 24,
    backgroundColor: ARCADE.cyan,
    shadowColor: ARCADE.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },

  // Intro
  introContent: {
    alignItems: 'center',
    paddingTop: Spacing.xl,
  },
  introEmoji: {
    fontSize: 40,
    marginBottom: Spacing.sm,
  },
  introTitle: {
    fontFamily: 'Jost_500Medium',
    fontSize: 22,
    color: ARCADE.cyan,
    letterSpacing: 4,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  introSubtitle: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 15,
    color: 'rgba(255,255,255,0.6)',
    fontStyle: 'italic',
    marginBottom: Spacing.xl,
    textAlign: 'center',
  },
  howItWorks: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    maxWidth: 340,
    borderWidth: 1,
    borderColor: `${ARCADE.purple}33`,
    marginBottom: Spacing.lg,
  },
  howItWorksLabel: {
    fontFamily: 'Jost_500Medium',
    fontSize: 11,
    color: ARCADE.lime,
    letterSpacing: 2,
    marginBottom: Spacing.sm,
  },
  howItWorksText: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 20,
  },
  startButton: {
    borderWidth: 2,
    borderColor: ARCADE.neon,
    borderRadius: BorderRadius.sm,
    paddingVertical: 14,
    paddingHorizontal: 40,
  },
  startButtonText: {
    fontFamily: 'Jost_500Medium',
    fontSize: 14,
    fontWeight: '700',
    color: ARCADE.neon,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },

  // Scenario
  scenarioContent: {
    alignItems: 'center',
  },
  scenarioEmoji: {
    fontSize: 40,
    marginBottom: Spacing.md,
  },
  scenarioBadge: {
    fontFamily: 'Jost_500Medium',
    fontSize: 10,
    color: ARCADE.neon,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  scenarioText: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 19,
    color: '#fff',
    lineHeight: 30,
    maxWidth: 380,
    textAlign: 'center',
    fontWeight: '300',
    marginBottom: Spacing.lg,
  },
  optionsContainer: {
    width: '100%',
    maxWidth: 380,
    gap: 10,
  },
  optionButton: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: `${ARCADE.purple}44`,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  optionButtonSelected: {
    borderWidth: 2,
    borderColor: ARCADE.neon,
    backgroundColor: `${ARCADE.neon}22`,
    shadowColor: ARCADE.neon,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  optionText: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: 14,
    lineHeight: 21,
    color: 'rgba(255,255,255,0.8)',
  },
  optionTextSelected: {
    color: ARCADE.neon,
  },

  // Result
  resultContent: {
    alignItems: 'center',
    paddingTop: Spacing.xl,
  },
  monoBadge: {
    fontFamily: 'Jost_500Medium',
    fontSize: 11,
    color: ARCADE.neon,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  resultTitle: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 28,
    color: '#fff',
    fontWeight: '300',
    letterSpacing: 2,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  traitCardsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  traitCard: {
    backgroundColor: `${ARCADE.neon}11`,
    borderWidth: 1,
    borderColor: `${ARCADE.purple}66`,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    minWidth: 130,
    alignItems: 'center',
  },
  traitCardPrimary: {
    borderColor: ARCADE.neon,
    backgroundColor: `${ARCADE.neon}15`,
    shadowColor: ARCADE.neon,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  traitRank: {
    fontFamily: 'Jost_500Medium',
    fontSize: 10,
    color: ARCADE.cyan,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  traitName: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  resultDescription: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 22,
    maxWidth: 400,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  enterLobbyButton: {
    backgroundColor: ARCADE.neon,
    borderRadius: BorderRadius.sm,
    paddingVertical: 14,
    paddingHorizontal: 32,
    shadowColor: ARCADE.neon,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  enterLobbyText: {
    fontFamily: 'Jost_500Medium',
    fontSize: 13,
    fontWeight: '700',
    color: ARCADE.bg,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});
