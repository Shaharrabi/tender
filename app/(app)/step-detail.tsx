/**
 * Step Detail Screen — Immersive view for each Healing Step.
 *
 * Shows audio intro, rich text, mini-game entry, practices,
 * and step quote. The heart of the enriched 12-step experience.
 *
 * Route: /(app)/step-detail?step=5
 */

import React, { useCallback, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '@/context/AuthContext';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
  Typography,
} from '@/constants/theme';
import StepAudioPlayer from '@/components/growth/StepAudioPlayer';
import StepMiniGame from '@/components/growth/StepMiniGame';
import {
  TWELVE_STEPS,
  STEP_AUDIO_MAP,
  getPhaseForStep,
  getTaglineForStep,
  getPracticesForStep,
} from '@/utils/steps/twelve-steps';
import { getMiniGameOutput } from '@/services/minigames';
import { getPracticeCompletions } from '@/services/steps';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { MiniGameOutput } from '@/types/growth';

export default function StepDetailScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const haptics = useSoundHaptics();
  const params = useLocalSearchParams<{ step: string }>();
  const stepNumber = parseInt(params.step ?? '1', 10);

  const [loading, setLoading] = useState(true);
  const [miniGameOutput, setMiniGameOutput] = useState<MiniGameOutput | null>(null);
  const [showMiniGame, setShowMiniGame] = useState(false);
  const [practiceCount, setPracticeCount] = useState(0);

  const step = TWELVE_STEPS.find((s) => s.stepNumber === stepNumber);
  const phase = getPhaseForStep(stepNumber);
  const tagline = getTaglineForStep(stepNumber);
  const audioSource = STEP_AUDIO_MAP[stepNumber];
  const nextStep = TWELVE_STEPS.find((s) => s.stepNumber === stepNumber + 1);

  const loadData = useCallback(async () => {
    if (!user) return;
    try {
      const [mgOutput, completions] = await Promise.all([
        getMiniGameOutput(user.id, stepNumber),
        getPracticeCompletions(user.id, stepNumber, 100),
      ]);
      setMiniGameOutput(mgOutput);
      setPracticeCount(completions.length);
    } catch (err) {
      console.warn('[StepDetail] Load error:', err);
    } finally {
      setLoading(false);
    }
  }, [user, stepNumber]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleMiniGameComplete = (output: MiniGameOutput) => {
    setMiniGameOutput(output);
    setShowMiniGame(false);
    haptics.success();
  };

  const handlePracticePress = (practiceId: string) => {
    haptics.tap();
    router.push({
      pathname: '/(app)/exercise' as any,
      params: { id: practiceId },
    });
  };

  if (!step || !phase) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Step not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={phase.color} />
        </View>
      </SafeAreaView>
    );
  }

  // Mini-game fullscreen mode
  if (showMiniGame) {
    return (
      <SafeAreaView style={styles.container}>
        <StepMiniGame
          stepNumber={stepNumber}
          onComplete={handleMiniGameComplete}
          onSkip={() => setShowMiniGame(false)}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Text style={styles.backText}>{'\u2039'} Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerPhase, { color: phase.color }]}>
          {phase.name.toUpperCase()}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Phase color accent line */}
        <View style={[styles.phaseAccent, { backgroundColor: phase.color }]} />

        {/* Step Title */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <Text style={styles.stepLabel}>STEP {step.stepNumber}</Text>
          <Text style={styles.stepTitle}>{step.title}</Text>
          {step.subtitle && (
            <Text style={styles.stepSubtitle}>{step.subtitle}</Text>
          )}
        </Animated.View>

        {/* Audio Player */}
        {audioSource && (
          <Animated.View entering={FadeIn.delay(300).duration(500)}>
            <StepAudioPlayer
              audioSource={audioSource}
              title="LISTEN TO INTRODUCTION"
              phaseColor={phase.color}
            />
          </Animated.View>
        )}

        {/* Intro Text */}
        {step.introText && (
          <Animated.View entering={FadeIn.delay(400).duration(600)} style={styles.introTextCard}>
            <Text style={styles.introText}>{step.introText}</Text>
          </Animated.View>
        )}

        {/* Tagline */}
        <Animated.View entering={FadeIn.delay(500).duration(500)} style={styles.taglineCard}>
          <Text style={styles.taglineText}>{tagline}</Text>
        </Animated.View>

        {/* Mini-Game Prompt */}
        <Animated.View entering={FadeInUp.delay(600).duration(500)}>
          {miniGameOutput ? (
            // Completed — show result card
            <View style={styles.miniGameResultCard}>
              <View style={styles.miniGameResultHeader}>
                <Text style={styles.miniGameResultLabel}>YOUR INSIGHT</Text>
                <TouchableOpacity
                  onPress={() => setShowMiniGame(true)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.replayText, { color: phase.color }]}>
                    Play again
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.miniGameResultTitle}>
                {miniGameOutput.title}
              </Text>
              {miniGameOutput.insights.slice(0, 3).map((insight, i) => (
                <Text key={i} style={styles.miniGameInsightText}>
                  {'\u2022'} {insight}
                </Text>
              ))}
            </View>
          ) : (
            // Not yet completed — show prompt
            <TouchableOpacity
              style={[styles.miniGamePrompt, { borderColor: phase.color }]}
              onPress={() => {
                haptics.tap();
                setShowMiniGame(true);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.miniGamePromptLabel}>
                BEFORE WE DIVE IN...
              </Text>
              <Text style={styles.miniGamePromptTitle}>
                Try a quick exercise
              </Text>
              <Text style={styles.miniGamePromptHint}>
                A playful {step.miniGameId === 'pattern-spotter' ? '3 min' :
                  step.miniGameId === 'bid-or-miss' ? '2 min' :
                  step.miniGameId === 'my-horseman' ? '3 min' :
                  step.miniGameId === 'pattern-check-in' ? '2 min' : '3-4 min'} activity to set the stage
              </Text>
              <View style={[styles.miniGameStartButton, { backgroundColor: phase.color }]}>
                <Text style={styles.miniGameStartText}>BEGIN</Text>
              </View>
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* Step Quote */}
        <Animated.View entering={FadeIn.delay(700).duration(500)} style={styles.quoteCard}>
          <View style={[styles.quoteLine, { backgroundColor: phase.color }]} />
          <Text style={styles.quoteText}>
            &ldquo;{step.quote}&rdquo;
          </Text>
        </Animated.View>

        {/* Completion Criteria */}
        <Animated.View entering={FadeIn.delay(800).duration(500)} style={styles.goalsCard}>
          <Text style={styles.goalsTitle}>Step {step.stepNumber} Goals</Text>
          <Text style={styles.goalsSubtitle}>
            {practiceCount} practice{practiceCount !== 1 ? 's' : ''} completed
          </Text>
          {step.completionCriteria.map((criteria, i) => (
            <View key={i} style={styles.goalRow}>
              <View style={[styles.goalDot, { borderColor: phase.color }]} />
              <Text style={styles.goalText}>{criteria}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Practices */}
        <Animated.View entering={FadeIn.delay(900).duration(500)} style={styles.practicesSection}>
          <Text style={styles.practicesTitle}>Practices</Text>
          {step.practices.map((practiceId) => {
            const label = practiceId
              .replace(/-/g, ' ')
              .replace(/\b\w/g, (c) => c.toUpperCase());
            return (
              <TouchableOpacity
                key={practiceId}
                style={styles.practiceCard}
                onPress={() => handlePracticePress(practiceId)}
                activeOpacity={0.7}
              >
                <View style={styles.practiceInfo}>
                  <Text style={styles.practiceLabel}>{label}</Text>
                  <Text style={styles.practiceStep}>
                    Step {step.stepNumber} Practice
                  </Text>
                </View>
                <Text style={[styles.practiceArrow, { color: phase.color }]}>
                  {'\u203A'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </Animated.View>

        {/* Coming Next */}
        {nextStep && (
          <View style={styles.nextSection}>
            <Text style={styles.nextLabel}>
              COMING NEXT: Step {nextStep.stepNumber}
            </Text>
            <Text style={styles.nextTitle}>
              &ldquo;{nextStep.title}&rdquo;
            </Text>
            <Text style={styles.nextHint}>
              Unlocks after completing Step {step.stepNumber} goals
            </Text>
          </View>
        )}

        {/* Closing track available after step 12 */}
        {stepNumber === 12 && STEP_AUDIO_MAP[13] && (
          <View style={styles.closingSection}>
            <StepAudioPlayer
              audioSource={STEP_AUDIO_MAP[13]}
              title="THE CLOSING"
              phaseColor={phase.color}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: FontSizes.body,
    color: Colors.textMuted,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backText: {
    fontSize: FontSizes.body,
    color: Colors.primary,
    fontWeight: '600',
  },
  headerPhase: {
    ...Typography.label,
    letterSpacing: 2,
  },
  headerSpacer: {
    width: 48,
  },

  // Scroll content
  scrollContent: {
    padding: Spacing.xl,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.lg,
  },

  // Phase accent
  phaseAccent: {
    height: 3,
    borderRadius: 2,
    marginBottom: Spacing.xs,
  },

  // Step title area
  stepLabel: {
    ...Typography.label,
    color: Colors.textMuted,
    letterSpacing: 2,
    marginBottom: 4,
  },
  stepTitle: {
    ...Typography.headingXL,
    color: Colors.text,
  },
  stepSubtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 4,
    lineHeight: 22,
  },

  // Intro text
  introTextCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.subtle,
  },
  introText: {
    ...Typography.body,
    color: Colors.text,
    lineHeight: 26,
  },

  // Tagline
  taglineCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    alignItems: 'center',
  },
  taglineText: {
    ...Typography.serifItalic,
    fontSize: 15,
    color: Colors.secondary,
    textAlign: 'center',
  },

  // Mini-game prompt
  miniGamePrompt: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.sm,
    ...Shadows.card,
  },
  miniGamePromptLabel: {
    ...Typography.label,
    color: Colors.textMuted,
    letterSpacing: 2,
  },
  miniGamePromptTitle: {
    ...Typography.headingS,
    color: Colors.text,
  },
  miniGamePromptHint: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  miniGameStartButton: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.sm,
  },
  miniGameStartText: {
    ...Typography.button,
    color: Colors.white,
  },

  // Mini-game result card
  miniGameResultCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.sm,
    ...Shadows.card,
  },
  miniGameResultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  miniGameResultLabel: {
    ...Typography.label,
    color: Colors.textMuted,
    letterSpacing: 1.5,
  },
  replayText: {
    fontSize: FontSizes.caption,
    fontWeight: '600',
  },
  miniGameResultTitle: {
    ...Typography.headingS,
    color: Colors.text,
  },
  miniGameInsightText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 22,
  },

  // Quote
  quoteCard: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  quoteLine: {
    width: 3,
    borderRadius: 2,
  },
  quoteText: {
    flex: 1,
    ...Typography.serifItalic,
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 26,
  },

  // Goals
  goalsCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.sm,
    ...Shadows.subtle,
  },
  goalsTitle: {
    ...Typography.headingS,
    color: Colors.text,
  },
  goalsSubtitle: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  goalDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    marginTop: 5,
  },
  goalText: {
    flex: 1,
    ...Typography.bodySmall,
    color: Colors.text,
    lineHeight: 22,
  },

  // Practices
  practicesSection: {
    gap: Spacing.sm,
  },
  practicesTitle: {
    ...Typography.headingS,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  practiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    ...Shadows.subtle,
  },
  practiceInfo: {
    flex: 1,
    gap: 2,
  },
  practiceLabel: {
    ...Typography.bodyMedium,
    color: Colors.text,
  },
  practiceStep: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  practiceArrow: {
    fontSize: FontSizes.headingL,
    fontWeight: '300',
    marginLeft: Spacing.sm,
  },

  // Coming next
  nextSection: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderStyle: 'dashed',
  },
  nextLabel: {
    ...Typography.label,
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  nextTitle: {
    ...Typography.headingS,
    color: Colors.text,
    fontStyle: 'italic',
  },
  nextHint: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },

  // Closing
  closingSection: {
    marginTop: Spacing.md,
  },
});
