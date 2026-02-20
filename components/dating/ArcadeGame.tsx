/**
 * The Field — Self-Discovery Game
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
import { Colors, Spacing, BorderRadius, Typography, Shadows, FontFamilies, FontSizes } from '@/constants/theme';
import { TargetIcon } from '@/assets/graphics/icons';
import { GAME_SCENARIOS, ARCHETYPE_NAMES } from '@/constants/dating/gameScenarios';
import { calculateConstellation, calculateArchetypeScores } from '@/utils/dating/constellationCalc';
import type { GameAnswer, ConstellationResult, ArchetypeScores } from '@/types/dating';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ArcadeGameProps {
  onComplete: (
    answers: GameAnswer[],
    constellation: ConstellationResult,
    archetypeScores: ArchetypeScores,
  ) => void;
}

// ─── Decorative Dots Background ─────────────────────────────
// Subtle floating dots on warm linen background

function DotField() {
  const dots = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 2000,
      })),
    [],
  );

  return (
    <View style={styles.dotField} pointerEvents="none">
      {/* Subtle grid lines */}
      {Array.from({ length: 8 }, (_, i) => (
        <View
          key={`grid-${i}`}
          style={[
            styles.gridLine,
            { top: `${(i + 1) * 12}%` },
          ]}
        />
      ))}
      {/* Dots */}
      {dots.map((dot) => (
        <Dot key={dot.id} {...dot} />
      ))}
    </View>
  );
}

function Dot({ x, y, size, delay }: { x: number; y: number; size: number; delay: number }) {
  const opacity = useSharedValue(0.15);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.4, { duration: 1200 + delay }),
        withTiming(0.15, { duration: 1200 + delay }),
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
        styles.dot,
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
      <View style={styles.gameContainer}>
        <DotField />
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
              <Text style={styles.enterLobbyText}>Enter The Lobby</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    );
  }

  // ─── Intro Screen ───
  if (step === -1) {
    return (
      <View style={styles.gameContainer}>
        <DotField />
        <View style={styles.contentOverlay}>
          <Animated.View entering={FadeIn.duration(600)} style={styles.introContent}>
            <TargetIcon size={36} color={Colors.primary} />
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
              <Text style={styles.startButtonText}>BEGIN</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    );
  }

  // ─── Game Screen ───
  const scenario = GAME_SCENARIOS[step];
  const ScenarioIcon = scenario.icon;

  return (
    <View style={[styles.gameContainer, flash && styles.gameFlash]}>
      <DotField />
      <View style={styles.contentOverlay}>
        <ProgressDots current={step} total={GAME_SCENARIOS.length} />

        <Animated.View
          key={`scenario-${step}`}
          entering={FadeIn.duration(400)}
          style={styles.scenarioContent}
        >
          <ScenarioIcon size={32} color={Colors.primary} />
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
  gameContainer: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    minHeight: 440,
    backgroundColor: Colors.backgroundAlt || Colors.background,
    position: 'relative',
    ...Shadows.card,
  },
  gameFlash: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  dotField: {
    ...StyleSheet.absoluteFillObject,
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: Colors.borderLight || `${Colors.border}22`,
  },
  dot: {
    position: 'absolute',
    backgroundColor: Colors.primaryFaded || `${Colors.primary}30`,
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
    backgroundColor: Colors.primaryLight || `${Colors.primary}30`,
  },
  progressDotComplete: {
    backgroundColor: Colors.primary,
  },
  progressDotActive: {
    width: 24,
    backgroundColor: Colors.secondary,
  },

  // Intro
  introContent: {
    alignItems: 'center',
    paddingTop: Spacing.xl,
  },
  introTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.headingL,
    color: Colors.text,
    letterSpacing: 4,
    textTransform: 'uppercase',
    marginTop: Spacing.sm,
    marginBottom: 4,
  },
  introSubtitle: {
    fontFamily: FontFamilies.accent,
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: Spacing.xl,
    textAlign: 'center',
  },
  howItWorks: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    maxWidth: 340,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },
  howItWorksLabel: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.caption,
    color: Colors.success,
    letterSpacing: 2,
    marginBottom: Spacing.sm,
  },
  howItWorksText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  startButton: {
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.pill,
    paddingVertical: 14,
    paddingHorizontal: 40,
  },
  startButtonText: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.bodySmall,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },

  // Scenario
  scenarioContent: {
    alignItems: 'center',
  },
  scenarioBadge: {
    fontFamily: FontFamilies.heading,
    fontSize: 10,
    color: Colors.primary,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  scenarioText: {
    fontFamily: FontFamilies.accent,
    fontSize: 19,
    color: Colors.text,
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
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceElevated,
  },
  optionButtonSelected: {
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryFaded || `${Colors.primary}15`,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  optionText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    lineHeight: 21,
    color: Colors.textSecondary,
  },
  optionTextSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },

  // Result
  resultContent: {
    alignItems: 'center',
    paddingTop: Spacing.xl,
  },
  monoBadge: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.caption,
    color: Colors.primary,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  resultTitle: {
    fontFamily: FontFamilies.accent,
    fontSize: FontSizes.headingL,
    color: Colors.text,
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
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    minWidth: 130,
    alignItems: 'center',
    ...Shadows.card,
  },
  traitCardPrimary: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryFaded || `${Colors.primary}10`,
  },
  traitRank: {
    fontFamily: FontFamilies.heading,
    fontSize: 10,
    color: Colors.secondary,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  traitName: {
    fontFamily: FontFamilies.accent,
    fontSize: FontSizes.body,
    color: Colors.text,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  resultDescription: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 22,
    maxWidth: 400,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  enterLobbyButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.pill,
    paddingVertical: 14,
    paddingHorizontal: 32,
    ...Shadows.card,
  },
  enterLobbyText: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.bodySmall,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});
