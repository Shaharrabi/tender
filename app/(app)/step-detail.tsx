/**
 * Step Detail Screen — Immersive view for each Healing Step.
 *
 * Shows audio intro, rich text, mini-game entry, practices,
 * and step quote. The heart of the enriched 12-step experience.
 *
 * Route: /(app)/step-detail?step=5
 */

import React, { useCallback, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '@/context/AuthContext';
import { useGamification } from '@/context/GamificationContext';
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
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import QuickLinksBar from '@/components/QuickLinksBar';
import CheckmarkIcon from '@/assets/graphics/icons/CheckmarkIcon';
import {
  TWELVE_STEPS,
  STEP_AUDIO_MAP,
  getPhaseForStep,
  getTaglineForStep,
  getPracticesForStep,
} from '@/utils/steps/twelve-steps';
import { getExerciseById } from '@/utils/interventions/registry';
import { getCourseById } from '@/utils/microcourses/course-registry';
import { getMiniGameOutput } from '@/services/minigames';
import {
  getPracticeCompletions,
  ensureStepProgress,
  toggleStepCriteria,
  completeStep,
  saveReflection,
  savePartnerRoundResponse,
  getPartnerStepResponse,
  savePartnerExchangeFollowUp,
} from '@/services/steps';
import { getMyCouple, isSelfCouple } from '@/services/couples';
import { getPortrait } from '@/services/portrait';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import { getStepTeaching } from '@/utils/steps/step-teachings';
import { getStepBridge } from '@/utils/steps/step-bridges';
import { getPartnerExchange, getExchangePhase } from '@/utils/steps/partner-exchanges';
import type { IndividualPortrait } from '@/types/portrait';
import type { MiniGameOutput, StepProgress } from '@/types/growth';

function StepDetailScreenInner() {
  const { user } = useAuth();
  const router = useRouter();
  const haptics = useSoundHaptics();
  const { awardXP } = useGamification();
  const params = useLocalSearchParams<{ step: string }>();
  const stepNumber = parseInt(params.step ?? '1', 10);

  const [loading, setLoading] = useState(true);
  const [miniGameOutput, setMiniGameOutput] = useState<MiniGameOutput | null>(null);
  const [showMiniGame, setShowMiniGame] = useState(false);
  const [practiceCount, setPracticeCount] = useState(0);
  const [checkedCriteria, setCheckedCriteria] = useState<number[]>([]);
  const [stepProgress, setStepProgress] = useState<StepProgress[]>([]);
  const [currentStepNumber, setCurrentStepNumber] = useState(1);

  // Sprint B — Couple state
  const [isCoupled, setIsCoupled] = useState(false);
  const [partnerUserId, setPartnerUserId] = useState<string | null>(null);
  const [coupleId, setCoupleId] = useState<string | null>(null);

  // Sprint B — Reflection state
  const [reflectionTexts, setReflectionTexts] = useState<Record<number, string>>({});
  const reflectionSavedRef = useRef<Set<number>>(new Set());

  // Sprint B — Partner Round state
  const [partnerResponse, setPartnerResponse] = useState('');
  const [partnerRoundSaved, setPartnerRoundSaved] = useState(false);
  const [partnerStepResponse, setPartnerStepResponse] = useState<string | null>(null);

  // Sprint B2 — Portrait + Exchange state
  const [portrait, setPortrait] = useState<IndividualPortrait | null>(null);
  const [exchangeFollowUp, setExchangeFollowUp] = useState('');
  const [exchangeFollowUpSaved, setExchangeFollowUpSaved] = useState(false);

  const step = TWELVE_STEPS.find((s) => s.stepNumber === stepNumber);
  const phase = getPhaseForStep(stepNumber);
  const tagline = getTaglineForStep(stepNumber);
  const audioSource = STEP_AUDIO_MAP[stepNumber];
  const nextStep = TWELVE_STEPS.find((s) => s.stepNumber === stepNumber + 1);

  // Sprint B2 — Derived content
  const teaching = getStepTeaching(stepNumber);
  const bridge = getStepBridge(stepNumber, portrait);
  const exchangeConfig = getPartnerExchange(stepNumber);
  const exchangePhase = exchangeConfig
    ? getExchangePhase(
        partnerRoundSaved ? partnerResponse : null,
        partnerStepResponse,
        exchangeFollowUpSaved ? exchangeFollowUp : null
      )
    : null;

  // Determine if this step's checklist is interactive
  const thisStepProgress = stepProgress.find((sp) => sp.stepNumber === stepNumber);
  const isCurrentStep = stepNumber === currentStepNumber;
  const isCompletedStep = thisStepProgress?.status === 'completed';
  const canToggleCriteria = isCurrentStep || isCompletedStep;

  const loadData = useCallback(async () => {
    if (!user) return;
    try {
      const [mgOutput, completions, spData, couple, userPortrait] = await Promise.all([
        getMiniGameOutput(user.id, stepNumber),
        getPracticeCompletions(user.id, stepNumber, 100),
        ensureStepProgress(user.id),
        getMyCouple(user.id),
        getPortrait(user.id).catch(() => null),
      ]);
      setMiniGameOutput(mgOutput);
      setPracticeCount(completions.length);
      setStepProgress(spData);
      setPortrait(userPortrait);

      // Find current active step
      const activeStep = spData.find((sp) => sp.status === 'active');
      setCurrentStepNumber(activeStep?.stepNumber ?? 1);

      // Extract checked criteria + reflections from reflectionNotes
      const thisStep = spData.find((sp) => sp.stepNumber === stepNumber);
      const notes = thisStep?.reflectionNotes as Record<string, any> | undefined;
      setCheckedCriteria(notes?.completedCriteria ?? []);
      setReflectionTexts(notes?.reflections ?? {});
      setPartnerResponse(notes?.partnerRoundResponse ?? '');
      setPartnerRoundSaved(!!notes?.partnerRoundResponse);
      setExchangeFollowUp(notes?.partnerExchangeFollowUp ?? '');
      setExchangeFollowUpSaved(!!notes?.partnerExchangeFollowUp);
      if (notes?.reflections) {
        reflectionSavedRef.current = new Set(
          Object.keys(notes.reflections)
            .filter((k) => notes.reflections[k]?.trim())
            .map(Number)
        );
      }

      // Couple detection
      const coupled = couple && !isSelfCouple(couple);
      setIsCoupled(!!coupled);
      if (coupled && couple) {
        const pid = couple.partner_a_id === user.id
          ? couple.partner_b_id
          : couple.partner_a_id;
        setPartnerUserId(pid);
        setCoupleId(couple.id);
        // Load partner's response for this step
        try {
          const pResponse = await getPartnerStepResponse(couple.id, pid, stepNumber);
          setPartnerStepResponse(pResponse);
        } catch {
          // RLS may block — partner response just won't show
          setPartnerStepResponse(null);
        }
      }
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

  const handleCriteriaToggle = async (criteriaIndex: number, checked: boolean) => {
    if (!user || !canToggleCriteria) return;
    haptics.tap();
    try {
      // Optimistic update
      setCheckedCriteria((prev) => {
        return checked
          ? [...prev, criteriaIndex]
          : prev.filter((i) => i !== criteriaIndex);
      });

      // Persist to DB
      const updatedCriteria = await toggleStepCriteria(user.id, stepNumber, criteriaIndex, checked);

      // Check if all criteria for this step are now completed
      if (step && updatedCriteria.length >= step.completionCriteria.length) {
        // All criteria checked — complete this step and unlock next
        await completeStep(user.id, stepNumber);
        haptics.success();
        // Reload data to reflect new step states
        await loadData();
      }
    } catch (err) {
      console.error('[StepDetail] Failed to toggle criteria:', err);
      // Revert optimistic update on error
      await loadData();
    }
  };

  // Check if the next step is navigable (active or completed)
  const nextStepProgress = stepProgress.find((sp) => sp.stepNumber === stepNumber + 1);
  const canNavigateNext =
    nextStepProgress?.status === 'active' || nextStepProgress?.status === 'completed';

  const handleNextStep = () => {
    if (nextStep && canNavigateNext) {
      haptics.tap();
      router.replace({
        pathname: '/(app)/step-detail' as any,
        params: { step: String(nextStep.stepNumber) },
      });
    }
  };

  // Sprint B — Reflection auto-save on blur
  const handleReflectionBlur = useCallback(
    async (promptIndex: number, text: string) => {
      if (!user || !text.trim()) return;
      try {
        await saveReflection(user.id, stepNumber, promptIndex, text.trim());
        // Award XP only on first save of each prompt
        if (!reflectionSavedRef.current.has(promptIndex)) {
          reflectionSavedRef.current.add(promptIndex);
          awardXP('reflection', `step-${stepNumber}-reflection-${promptIndex}`, 'Step reflection');
        }
      } catch (err) {
        console.warn('[StepDetail] Failed to save reflection:', err);
      }
    },
    [user, stepNumber, awardXP]
  );

  // Sprint B — Partner Round save
  const handleSavePartnerResponse = useCallback(async () => {
    if (!user || !partnerResponse.trim()) return;
    try {
      await savePartnerRoundResponse(user.id, stepNumber, partnerResponse.trim());
      setPartnerRoundSaved(true);
      awardXP('partner_exercise', `step-${stepNumber}-partner-round`, 'Partner round response');
      haptics.success();
    } catch (err) {
      console.warn('[StepDetail] Failed to save partner response:', err);
    }
  }, [user, stepNumber, partnerResponse, awardXP, haptics]);

  // Sprint B2 — Partner Exchange follow-up save
  const handleSaveFollowUp = useCallback(async () => {
    if (!user || !exchangeFollowUp.trim()) return;
    try {
      await savePartnerExchangeFollowUp(user.id, stepNumber, exchangeFollowUp.trim());
      setExchangeFollowUpSaved(true);
      awardXP('reflection', `step-${stepNumber}-exchange-followup`, 'Partner exchange reflection');
      haptics.success();
    } catch (err) {
      console.warn('[StepDetail] Failed to save exchange follow-up:', err);
    }
  }, [user, stepNumber, exchangeFollowUp, awardXP, haptics]);

  // Sprint B — Course navigation
  const handleCoursePress = useCallback(
    (courseId: string) => {
      haptics.tap();
      router.push({
        pathname: '/(app)/microcourse' as any,
        params: { courseId },
      });
    },
    [haptics, router]
  );

  const handleBackToJourney = () => {
    haptics.tap();
    router.push('/(app)/growth' as any);
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
          <ActivityIndicator size="large" color={phase.color} accessibilityLabel="Loading" />
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
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} accessibilityRole="button" accessibilityLabel="Go back">
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

        {/* Step Teaching — Original therapeutic content */}
        {teaching && (
          <Animated.View entering={FadeIn.delay(450).duration(600)} style={styles.teachingSection}>
            {teaching.teaching.map((paragraph, i) => (
              <Text key={i} style={styles.teachingParagraph}>{paragraph}</Text>
            ))}
            {teaching.whyAfterPrevious && (
              <View style={[styles.teachingConnectionCard, { borderLeftColor: phase.color }]}>
                <Text style={styles.teachingConnectionLabel}>WHY THIS STEP COMES NOW</Text>
                <Text style={styles.teachingConnectionText}>{teaching.whyAfterPrevious}</Text>
              </View>
            )}
            {teaching.courseConnection && (
              <View style={[styles.teachingConnectionCard, { borderLeftColor: Colors.secondary }]}>
                <Text style={styles.teachingConnectionLabel}>HOW THE COURSE DEEPENS THIS</Text>
                <Text style={styles.teachingConnectionText}>{teaching.courseConnection}</Text>
              </View>
            )}
          </Animated.View>
        )}

        {/* Portrait Bridge — Personalized "What This Means For You" */}
        {bridge && (
          <Animated.View entering={FadeIn.delay(470).duration(600)}>
            <View style={[styles.bridgeCard, { borderLeftColor: phase.color }]}>
              <Text style={styles.bridgeLabel}>WHAT THIS MEANS FOR YOU</Text>
              <Text style={styles.bridgeText}>{bridge.text}</Text>
              {bridge.insightLabel && (
                <Text style={styles.bridgeInsight}>{bridge.insightLabel}</Text>
              )}
            </View>
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
                  accessibilityRole="button"
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
              accessibilityRole="button"
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

        {/* Course Gateway — moved up from below */}
        {step.courseGatewayIds && step.courseGatewayIds.length > 0 && stepNumber !== 12 && (
          <Animated.View entering={FadeIn.delay(750).duration(500)} style={styles.courseGatewaySection}>
            <Text style={styles.sectionTitle}>Deepen Your Understanding</Text>
            {step.courseGatewayIds.map((courseId) => {
              const course = getCourseById(courseId);
              if (!course) return null;
              return (
                <TouchableOpacity
                  key={courseId}
                  style={styles.courseGatewayCard}
                  onPress={() => handleCoursePress(courseId)}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                >
                  <View style={[styles.courseAccent, { backgroundColor: phase.color }]} />
                  <View style={styles.courseCardContent}>
                    <Text style={styles.courseGatewayLabel}>MICRO-COURSE</Text>
                    <Text style={styles.courseGatewayTitle}>{course.title}</Text>
                    <Text style={styles.courseGatewaySubtitle}>{course.subtitle}</Text>
                    <Text style={styles.courseGatewayMeta}>
                      {course.totalLessons} lessons · ~{course.estimatedMinutes} min
                    </Text>
                  </View>
                  <Text style={[styles.practiceArrow, { color: phase.color }]}>
                    {'\u203A'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </Animated.View>
        )}

        {/* Completion Criteria — Interactive Checklist */}
        <Animated.View entering={FadeIn.delay(800).duration(500)} style={styles.goalsCard}>
          <Text style={styles.goalsTitle}>Step {step.stepNumber} Goals</Text>
          <Text style={styles.goalsSubtitle}>
            {checkedCriteria.length} of {step.completionCriteria.length} goals completed
            {' \u00B7 '}
            {practiceCount} practice{practiceCount !== 1 ? 's' : ''} done
          </Text>
          {step.completionCriteria.map((criteria, i) => {
            const isChecked = checkedCriteria.includes(i);
            return (
              <TouchableOpacity
                key={i}
                style={styles.goalRow}
                activeOpacity={canToggleCriteria ? 0.6 : 1}
                disabled={!canToggleCriteria}
                onPress={() => handleCriteriaToggle(i, !isChecked)}
                accessibilityRole="button"
                accessibilityState={{ disabled: !canToggleCriteria }}
              >
                <View style={styles.criteriaCheckbox}>
                  <View
                    style={[
                      styles.criteriaSquare,
                      { borderColor: phase.color },
                      isChecked && [styles.criteriaSquareChecked, { backgroundColor: phase.color, borderColor: phase.color }],
                    ]}
                  >
                    {isChecked && (
                      <CheckmarkIcon size={10} color={Colors.white} />
                    )}
                  </View>
                </View>
                <Text
                  style={[
                    styles.goalText,
                    isChecked && styles.goalTextChecked,
                  ]}
                >
                  {criteria}
                </Text>
              </TouchableOpacity>
            );
          })}
          {!canToggleCriteria && (
            <Text style={styles.criteriaHint}>
              These goals become active when you reach this step
            </Text>
          )}
          {isCompletedStep && (
            <View style={[styles.completedBadge, { backgroundColor: phase.color + '18' }]}>
              <Text style={[styles.completedBadgeText, { color: phase.color }]}>
                Step Complete
              </Text>
            </View>
          )}
        </Animated.View>

        {/* Practices — Enhanced with registry metadata */}
        <Animated.View entering={FadeIn.delay(900).duration(500)} style={styles.practicesSection}>
          <Text style={styles.practicesTitle}>Solo Practices</Text>
          {step.practices.map((practiceId) => {
            const exercise = getExerciseById(practiceId);
            const label = exercise?.title ?? practiceId
              .replace(/-/g, ' ')
              .replace(/\b\w/g, (c: string) => c.toUpperCase());
            const duration = exercise?.duration;
            const mode = exercise?.mode;
            return (
              <TouchableOpacity
                key={practiceId}
                style={styles.practiceCard}
                onPress={() => handlePracticePress(practiceId)}
                activeOpacity={0.7}
                accessibilityRole="button"
              >
                <View style={styles.practiceInfo}>
                  <Text style={styles.practiceLabel}>{label}</Text>
                  <View style={styles.practiceMetaRow}>
                    {duration != null && (
                      <Text style={styles.practiceDuration}>{duration} min</Text>
                    )}
                    {mode && (
                      <View style={[styles.practiceModeBadge, { backgroundColor: phase.color + '18' }]}>
                        <Text style={[styles.practiceModeBadgeText, { color: phase.color }]}>
                          {mode === 'together' ? 'Couple' : mode === 'solo' ? 'Solo' : 'Either'}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
                <Text style={[styles.practiceArrow, { color: phase.color }]}>
                  {'\u203A'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </Animated.View>

        {/* Reflection Prompts */}
        {step.reflectionPrompts && step.reflectionPrompts.length > 0 && (
          <Animated.View entering={FadeIn.delay(1000).duration(500)} style={styles.reflectionSection}>
            <Text style={styles.sectionTitle}>Reflection</Text>
            <Text style={styles.sectionHint}>
              Take a moment to write what comes up. Your words are saved automatically.
            </Text>
            {step.reflectionPrompts.map((prompt, i) => (
              <View key={i} style={styles.reflectionCard}>
                <Text style={styles.reflectionPromptText}>{prompt}</Text>
                <TextInput
                  style={styles.reflectionInput}
                  multiline
                  placeholder="Write your reflection..."
                  placeholderTextColor={Colors.textMuted}
                  value={reflectionTexts[i] ?? ''}
                  onChangeText={(text) =>
                    setReflectionTexts((prev) => ({ ...prev, [i]: text }))
                  }
                  onBlur={() => handleReflectionBlur(i, reflectionTexts[i] ?? '')}
                  textAlignVertical="top"
                />
              </View>
            ))}
          </Animated.View>
        )}

        {/* Partner Exchange — Enhanced couple dialogue (Steps 1-10) */}
        {isCoupled && exchangeConfig && exchangePhase && (
          <Animated.View entering={FadeIn.delay(1100).duration(500)} style={styles.partnerRoundSection}>
            <Text style={styles.sectionTitle}>Partner Exchange</Text>
            <Text style={styles.sectionHint}>
              A genuine dialogue — you write, they write, then you see each other's answers.
            </Text>
            <View style={styles.partnerRoundCard}>
              {/* Phase: PROMPT — haven't written yet */}
              {exchangePhase === 'prompt' && (
                <>
                  <Text style={styles.partnerRoundPromptText}>
                    {exchangeConfig.prompt}
                  </Text>
                  <TextInput
                    style={styles.partnerResponseInput}
                    multiline
                    placeholder={exchangeConfig.reflectionHint}
                    placeholderTextColor={Colors.textMuted}
                    value={partnerResponse}
                    onChangeText={setPartnerResponse}
                    textAlignVertical="top"
                  />
                  <TouchableOpacity
                    style={[
                      styles.partnerSaveButton,
                      { backgroundColor: phase.color },
                      !partnerResponse.trim() && styles.partnerSaveButtonDisabled,
                    ]}
                    onPress={handleSavePartnerResponse}
                    disabled={!partnerResponse.trim()}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                  >
                    <Text style={styles.partnerSaveButtonText}>Share</Text>
                  </TouchableOpacity>
                </>
              )}

              {/* Phase: WAITING — wrote mine, partner hasn't */}
              {exchangePhase === 'waiting' && (
                <>
                  <View style={styles.partnerResponseSaved}>
                    <Text style={styles.partnerResponseSavedLabel}>YOUR RESPONSE</Text>
                    <Text style={styles.partnerResponseSavedText}>{partnerResponse}</Text>
                  </View>
                  <Text style={styles.partnerWaitingText}>
                    Your partner hasn't shared yet — you'll see their response once they do.
                  </Text>
                </>
              )}

              {/* Phase: REVEAL — both submitted, follow-up not answered */}
              {exchangePhase === 'reveal' && (
                <>
                  <View style={styles.exchangeRevealRow}>
                    <View style={styles.exchangeRevealCard}>
                      <Text style={styles.partnerResponseSavedLabel}>YOU SHARED</Text>
                      <Text style={styles.partnerResponseSavedText}>{partnerResponse}</Text>
                    </View>
                    <View style={[styles.exchangeRevealCard, { borderColor: phase.color + '40' }]}>
                      <Text style={[styles.partnerRevealedLabel]}>YOUR PARTNER SHARED</Text>
                      <Text style={styles.partnerRevealedText}>{partnerStepResponse}</Text>
                    </View>
                  </View>
                  <View style={styles.exchangeFollowUpSection}>
                    <Text style={styles.exchangeFollowUpPrompt}>{exchangeConfig.followUp}</Text>
                    <TextInput
                      style={styles.partnerResponseInput}
                      multiline
                      placeholder={exchangeConfig.reflectionHint}
                      placeholderTextColor={Colors.textMuted}
                      value={exchangeFollowUp}
                      onChangeText={setExchangeFollowUp}
                      textAlignVertical="top"
                    />
                    <TouchableOpacity
                      style={[
                        styles.partnerSaveButton,
                        { backgroundColor: phase.color },
                        !exchangeFollowUp.trim() && styles.partnerSaveButtonDisabled,
                      ]}
                      onPress={handleSaveFollowUp}
                      disabled={!exchangeFollowUp.trim()}
                      activeOpacity={0.7}
                      accessibilityRole="button"
                    >
                      <Text style={styles.partnerSaveButtonText}>Save Reflection</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}

              {/* Phase: COMPLETE — full exchange summary */}
              {exchangePhase === 'complete' && (
                <>
                  <View style={styles.exchangeRevealRow}>
                    <View style={styles.exchangeRevealCard}>
                      <Text style={styles.partnerResponseSavedLabel}>YOU SHARED</Text>
                      <Text style={styles.partnerResponseSavedText}>{partnerResponse}</Text>
                    </View>
                    <View style={[styles.exchangeRevealCard, { borderColor: phase.color + '40' }]}>
                      <Text style={styles.partnerRevealedLabel}>YOUR PARTNER SHARED</Text>
                      <Text style={styles.partnerRevealedText}>{partnerStepResponse}</Text>
                    </View>
                  </View>
                  <View style={styles.exchangeFollowUpComplete}>
                    <Text style={styles.exchangeFollowUpLabel}>YOUR REFLECTION</Text>
                    <Text style={styles.partnerResponseSavedText}>{exchangeFollowUp}</Text>
                  </View>
                </>
              )}
            </View>
          </Animated.View>
        )}

        {/* Partner Round — fallback for steps 11-12 (couple-only) */}
        {isCoupled && !exchangeConfig && step.partnerRoundPrompt && (
          <Animated.View entering={FadeIn.delay(1100).duration(500)} style={styles.partnerRoundSection}>
            <Text style={styles.sectionTitle}>Partner Round</Text>
            <Text style={styles.sectionHint}>
              An async exchange — you write first, then see your partner's response.
            </Text>
            <View style={styles.partnerRoundCard}>
              <Text style={styles.partnerRoundPromptText}>
                {step.partnerRoundPrompt}
              </Text>
              {partnerRoundSaved ? (
                <View style={styles.partnerResponseSaved}>
                  <Text style={styles.partnerResponseSavedLabel}>YOUR RESPONSE</Text>
                  <Text style={styles.partnerResponseSavedText}>{partnerResponse}</Text>
                </View>
              ) : (
                <>
                  <TextInput
                    style={styles.partnerResponseInput}
                    multiline
                    placeholder="Share your response..."
                    placeholderTextColor={Colors.textMuted}
                    value={partnerResponse}
                    onChangeText={setPartnerResponse}
                    textAlignVertical="top"
                  />
                  <TouchableOpacity
                    style={[
                      styles.partnerSaveButton,
                      { backgroundColor: phase.color },
                      !partnerResponse.trim() && styles.partnerSaveButtonDisabled,
                    ]}
                    onPress={handleSavePartnerResponse}
                    disabled={!partnerResponse.trim()}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                  >
                    <Text style={styles.partnerSaveButtonText}>Save Response</Text>
                  </TouchableOpacity>
                </>
              )}
              {partnerRoundSaved && partnerStepResponse && (
                <View style={[styles.partnerResponseRevealed, { borderColor: phase.color + '40' }]}>
                  <Text style={styles.partnerRevealedLabel}>YOUR PARTNER SHARED</Text>
                  <Text style={styles.partnerRevealedText}>{partnerStepResponse}</Text>
                </View>
              )}
              {partnerRoundSaved && !partnerStepResponse && (
                <Text style={styles.partnerWaitingText}>
                  Your partner hasn't shared yet — you'll see their response once they do.
                </Text>
              )}
            </View>
          </Animated.View>
        )}

        {/* Together Practices — couple-only */}
        {isCoupled && step.togetherPractices && step.togetherPractices.length > 0 && (
          <Animated.View entering={FadeIn.delay(1200).duration(500)} style={styles.practicesSection}>
            <Text style={styles.sectionTitle}>Together Practices</Text>
            <Text style={styles.sectionHint}>
              Practices designed to do with your partner.
            </Text>
            {step.togetherPractices.map((practiceId) => {
              const exercise = getExerciseById(practiceId);
              const label = exercise?.title ?? practiceId
                .replace(/-/g, ' ')
                .replace(/\b\w/g, (c: string) => c.toUpperCase());
              const duration = exercise?.duration;
              return (
                <TouchableOpacity
                  key={practiceId}
                  style={styles.practiceCard}
                  onPress={() => handlePracticePress(practiceId)}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                >
                  <View style={styles.practiceInfo}>
                    <Text style={styles.practiceLabel}>{label}</Text>
                    <View style={styles.practiceMetaRow}>
                      {duration != null && (
                        <Text style={styles.practiceDuration}>{duration} min</Text>
                      )}
                      <View style={[styles.practiceModeBadge, { backgroundColor: Colors.secondary + '18' }]}>
                        <Text style={[styles.practiceModeBadgeText, { color: Colors.secondary }]}>
                          Together
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Text style={[styles.practiceArrow, { color: phase.color }]}>
                    {'\u203A'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </Animated.View>
        )}

        {/* Step 12 — All courses available */}
        {stepNumber === 12 && (
          <Animated.View entering={FadeIn.delay(1300).duration(500)} style={styles.courseGatewaySection}>
            <Text style={styles.sectionTitle}>All Courses Available</Text>
            <Text style={styles.sectionHint}>
              Every micro-course is now open to you. Revisit, deepen, explore.
            </Text>
            <TouchableOpacity
              style={[styles.allCoursesButton, { borderColor: phase.color }]}
              onPress={() => {
                haptics.tap();
                router.push('/(app)/courses' as any);
              }}
              activeOpacity={0.7}
              accessibilityRole="button"
            >
              <Text style={[styles.allCoursesButtonText, { color: phase.color }]}>
                Browse All 14 Courses
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Coming Next — tappable only when the next step is unlocked */}
        {nextStep && (
          <TouchableOpacity
            style={[styles.nextSection, !canNavigateNext && styles.nextSectionLocked]}
            onPress={handleNextStep}
            activeOpacity={canNavigateNext ? 0.7 : 1}
            disabled={!canNavigateNext}
            accessibilityRole="button"
            accessibilityState={{ disabled: !canNavigateNext }}
          >
            <Text style={styles.nextLabel}>
              {canNavigateNext
                ? 'NEXT STEP'
                : 'COMING NEXT'}
              : Step {nextStep.stepNumber}
            </Text>
            <Text style={styles.nextTitle}>
              &ldquo;{nextStep.title}&rdquo;
            </Text>
            <Text style={styles.nextHint}>
              {canNavigateNext
                ? 'Tap to explore this step'
                : `Complete all Step ${step.stepNumber} goals to unlock`}
            </Text>
            {canNavigateNext && (
              <Text style={[styles.nextArrow, { color: phase.color }]}>
                {'\u203A'}
              </Text>
            )}
          </TouchableOpacity>
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

        {/* Back to Your Journey */}
        <TouchableOpacity
          style={styles.backToJourneyButton}
          onPress={handleBackToJourney}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backToJourneyText}>
            {'\u2039'} Back to Your Journey
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <QuickLinksBar />
    </SafeAreaView>
  );
}

/** Wrapped export with ErrorBoundary */
export default function StepDetailScreen() {
  return (
    <ErrorBoundary fallbackMessage="Something went wrong loading this step.">
      <StepDetailScreenInner />
    </ErrorBoundary>
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
    paddingBottom: Spacing.scrollPadBottom,
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

  // Goals / Checklist
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
    paddingVertical: 4,
  },
  goalText: {
    flex: 1,
    ...Typography.bodySmall,
    color: Colors.text,
    lineHeight: 22,
  },
  goalTextChecked: {
    color: Colors.textSecondary,
    textDecorationLine: 'line-through' as const,
  },
  criteriaCheckbox: {
    width: 22,
    height: 22,
    marginTop: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  criteriaSquare: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  criteriaSquareChecked: {
    // backgroundColor and borderColor set dynamically via phase.color
  },
  criteriaHint: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontStyle: 'italic',
    marginTop: Spacing.xs,
  },
  completedBadge: {
    borderRadius: BorderRadius.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    alignSelf: 'center',
    marginTop: Spacing.xs,
  },
  completedBadgeText: {
    fontSize: FontSizes.caption,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Shared section styles
  sectionTitle: {
    ...Typography.headingS,
    color: Colors.text,
    marginBottom: 2,
  },
  sectionHint: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontStyle: 'italic',
    marginBottom: Spacing.sm,
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
  practiceMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: 2,
  },
  practiceDuration: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  practiceModeBadge: {
    borderRadius: BorderRadius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 1,
  },
  practiceModeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
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

  // Coming next — tappable
  nextSection: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    position: 'relative',
  },
  nextSectionLocked: {
    opacity: 0.55,
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
    paddingRight: Spacing.xl,
  },
  nextHint: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  nextArrow: {
    position: 'absolute',
    right: Spacing.md,
    top: 20,
    fontSize: FontSizes.headingL,
    fontWeight: '300',
  },

  // Back to journey
  backToJourneyButton: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    marginTop: Spacing.sm,
  },
  backToJourneyText: {
    fontSize: FontSizes.body,
    fontWeight: '600',
    color: Colors.primary,
  },

  // Closing
  closingSection: {
    marginTop: Spacing.md,
  },

  // Reflection section
  reflectionSection: {
    gap: Spacing.sm,
  },
  reflectionCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
    ...Shadows.subtle,
  },
  reflectionPromptText: {
    ...Typography.bodySmall,
    color: Colors.text,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  reflectionInput: {
    ...Typography.body,
    color: Colors.text,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    minHeight: 80,
    textAlignVertical: 'top' as const,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },

  // Partner Round section
  partnerRoundSection: {
    gap: Spacing.sm,
  },
  partnerRoundCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
    ...Shadows.subtle,
  },
  partnerRoundPromptText: {
    ...Typography.bodyMedium,
    color: Colors.text,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  partnerResponseInput: {
    ...Typography.body,
    color: Colors.text,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    minHeight: 100,
    textAlignVertical: 'top' as const,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  partnerSaveButton: {
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.sm + 2,
    alignItems: 'center',
  },
  partnerSaveButtonDisabled: {
    opacity: 0.4,
  },
  partnerSaveButtonText: {
    ...Typography.button,
    color: Colors.white,
  },
  partnerResponseSaved: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: 4,
  },
  partnerResponseSavedLabel: {
    ...Typography.label,
    color: Colors.textMuted,
    letterSpacing: 1,
    fontSize: 10,
  },
  partnerResponseSavedText: {
    ...Typography.bodySmall,
    color: Colors.text,
    lineHeight: 22,
  },
  partnerResponseRevealed: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: 4,
    borderWidth: 1,
    marginTop: Spacing.xs,
  },
  partnerRevealedLabel: {
    ...Typography.label,
    color: Colors.secondary,
    letterSpacing: 1,
    fontSize: 10,
  },
  partnerRevealedText: {
    ...Typography.bodySmall,
    color: Colors.text,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  partnerWaitingText: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: Spacing.xs,
  },

  // Teaching section
  teachingSection: {
    gap: Spacing.md,
  },
  teachingParagraph: {
    ...Typography.body,
    color: Colors.text,
    lineHeight: 28,
  },
  teachingConnectionCard: {
    borderLeftWidth: 3,
    paddingLeft: Spacing.md,
    paddingVertical: Spacing.sm,
    marginTop: Spacing.xs,
  },
  teachingConnectionLabel: {
    ...Typography.label,
    color: Colors.textMuted,
    letterSpacing: 1.5,
    fontSize: 9,
    marginBottom: 4,
  },
  teachingConnectionText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 22,
    fontStyle: 'italic',
  },

  // Portrait Bridge
  bridgeCard: {
    borderLeftWidth: 4,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.sm,
    ...Shadows.subtle,
  },
  bridgeLabel: {
    ...Typography.label,
    color: Colors.textMuted,
    letterSpacing: 2,
    fontSize: 9,
  },
  bridgeText: {
    ...Typography.body,
    color: Colors.text,
    lineHeight: 26,
  },
  bridgeInsight: {
    ...Typography.caption,
    color: Colors.secondary,
    fontStyle: 'italic',
    marginTop: Spacing.xs,
  },

  // Exchange enhanced styles
  exchangeRevealRow: {
    gap: Spacing.sm,
  },
  exchangeRevealCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  exchangeFollowUpSection: {
    gap: Spacing.sm,
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  exchangeFollowUpPrompt: {
    ...Typography.bodyMedium,
    color: Colors.text,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  exchangeFollowUpComplete: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: 4,
  },
  exchangeFollowUpLabel: {
    ...Typography.label,
    color: Colors.textMuted,
    letterSpacing: 1,
    fontSize: 10,
  },

  // Course Gateway section
  courseGatewaySection: {
    gap: Spacing.sm,
  },
  courseGatewayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.card,
  },
  courseAccent: {
    width: 4,
    alignSelf: 'stretch',
  },
  courseCardContent: {
    flex: 1,
    padding: Spacing.md,
    gap: 2,
  },
  courseGatewayLabel: {
    ...Typography.label,
    color: Colors.textMuted,
    letterSpacing: 1.5,
    fontSize: 9,
  },
  courseGatewayTitle: {
    ...Typography.bodyMedium,
    color: Colors.text,
  },
  courseGatewaySubtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  courseGatewayMeta: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  allCoursesButton: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  allCoursesButtonText: {
    ...Typography.button,
    letterSpacing: 0.5,
  },
});
