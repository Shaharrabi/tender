/**
 * Step Detail Screen — Immersive view for each Relational Step.
 *
 * Shows teaching content (always open), portrait bridge, mini-game,
 * quote, then collapsible sections for courses, goals, practices,
 * reflections, and partner exchange. The heart of the 12-step experience.
 *
 * Accordion pattern: Teaching always visible, everything else collapsed
 * by default — tap headers to expand. Keeps the page spacious.
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
  LayoutAnimation,
  Platform,
  UIManager,
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
import { CollapsibleHeader } from '@/components/ui/CollapsibleSection';
import QuickLinksBar from '@/components/QuickLinksBar';
import CheckmarkIcon from '@/assets/graphics/icons/CheckmarkIcon';
import {
  TWELVE_STEPS,
  STEP_AUDIO_MAP,
  getPhaseForStep,
  getTaglineForStep,
  getPracticesForStep,
  getStepAssessmentNudge,
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
import { getPortrait, savePortrait, extractSupplementScores } from '@/services/portrait';
import { generatePortrait, isPortraitStale } from '@/utils/portrait/portrait-generator';
import { supabase } from '@/services/supabase';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import { getStepTeaching } from '@/utils/steps/step-teachings';
import { getStepBridge } from '@/utils/steps/step-bridges';
import { getEarlyInsight } from '@/utils/steps/early-insights';
import { getPartnerExchange, getExchangePhase } from '@/utils/steps/partner-exchanges';
import { getStepCallback } from '@/utils/steps/step-callbacks';
import { getCouplePlay } from '@/utils/steps/couple-play';
import { getGrowthPulse } from '@/utils/steps/growth-pulse';
import { loadStepContext, getEnhancedCallback } from '@/utils/steps/step-context';
import type { StepContext } from '@/utils/steps/step-context';
import AssessmentNudgeCard from '@/components/growth/AssessmentNudgeCard';
import CommunityNudgeCard from '@/components/growth/CommunityNudgeCard';
import StepAssessmentInsight from '@/components/growth/StepAssessmentInsight';
import GrowthPulseCard from '@/components/growth/GrowthPulseCard';
import CouplePlayCard from '@/components/growth/CouplePlayCard';
import GrowthPlanContent from '@/components/growth/GrowthPlanContent';
import { fetchAllScores } from '@/services/portrait';
import type { IndividualPortrait, AllAssessmentScores } from '@/types/portrait';
import type { MiniGameOutput, StepProgress } from '@/types/growth';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

/** Section IDs for collapsible accordion */
type SectionId = 'course' | 'goals' | 'practices' | 'reflection' | 'partnerExchange' | 'partnerRound' | 'togetherPractices' | 'allCourses' | 'couplePlay' | 'growthPlan';

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

  // Assessment nudge + early insight state
  const [completedAssessmentIds, setCompletedAssessmentIds] = useState<string[]>([]);
  const [assessmentScores, setAssessmentScores] = useState<Record<string, { id: string; scores: any }> | null>(null);

  // Step context — previous answers feeding forward
  const [stepContext, setStepContext] = useState<StepContext | null>(null);

  // Couple play state
  const [couplePlayResponse, setCouplePlayResponse] = useState<string | null>(null);
  const [couplePlayPartnerResponse, setCouplePlayPartnerResponse] = useState<string | null>(null);
  const [couplePlayFollowUp, setCouplePlayFollowUp] = useState<string | null>(null);

  // Collapsible sections — all OPEN by default so the step feels like a room, not a filing cabinet
  const [expandedSections, setExpandedSections] = useState<Set<SectionId>>(
    new Set(['course', 'goals', 'practices', 'reflection', 'partnerExchange',
             'partnerRound', 'togetherPractices', 'allCourses', 'couplePlay', 'growthPlan'])
  );

  const toggleSection = useCallback((sectionId: SectionId) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  }, []);

  const step = TWELVE_STEPS.find((s) => s.stepNumber === stepNumber);
  const phase = getPhaseForStep(stepNumber);
  const tagline = getTaglineForStep(stepNumber);
  const audioSource = STEP_AUDIO_MAP[stepNumber];
  const nextStep = TWELVE_STEPS.find((s) => s.stepNumber === stepNumber + 1);

  // Sprint B2 — Derived content
  const teaching = getStepTeaching(stepNumber);
  const bridge = getStepBridge(stepNumber, portrait);
  const assessmentNudge = getStepAssessmentNudge(stepNumber);
  const earlyInsight = !bridge ? getEarlyInsight(stepNumber, assessmentScores) : null;
  const exchangeConfig = getPartnerExchange(stepNumber);
  const exchangePhase = exchangeConfig
    ? getExchangePhase(
        partnerRoundSaved ? partnerResponse : null,
        partnerStepResponse,
        exchangeFollowUpSaved ? exchangeFollowUp : null
      )
    : null;

  // Thickening: callback, couple play, growth pulse, transitions
  const genericCallback = getStepCallback(stepNumber);
  const enhancedCallback = stepContext ? getEnhancedCallback(stepNumber, stepContext) : null;
  const callbackText = enhancedCallback ?? genericCallback;
  const couplePlayActivity = getCouplePlay(stepNumber);
  const growthPulse = getGrowthPulse(stepNumber, portrait, practiceCount);
  const transitions = teaching?.transitions ?? null;

  // Determine if this step's checklist is interactive
  const thisStepProgress = stepProgress.find((sp) => sp.stepNumber === stepNumber);
  const isCurrentStep = stepNumber === currentStepNumber;
  const isCompletedStep = thisStepProgress?.status === 'completed';
  const canToggleCriteria = isCurrentStep || isCompletedStep;

  const loadData = useCallback(async () => {
    if (!user) return;
    try {
      const [mgOutput, completions, spData, couple, userPortrait, assessmentRows] = await Promise.all([
        getMiniGameOutput(user.id, stepNumber),
        getPracticeCompletions(user.id, stepNumber, 100),
        ensureStepProgress(user.id),
        getMyCouple(user.id),
        getPortrait(user.id).catch(() => null),
        supabase
          .from('assessments')
          .select('type')
          .eq('user_id', user.id)
          .then((res) => res.data ?? []),
      ]);
      setMiniGameOutput(mgOutput);
      setPracticeCount(completions.length);
      setStepProgress(spData);
      setPortrait(userPortrait);
      const uniqueAssessmentTypes = [...new Set(assessmentRows.map((r: any) => r.type))];
      setCompletedAssessmentIds(uniqueAssessmentTypes);

      // Auto-regenerate portrait if assessments changed or code version is newer
      if (userPortrait && uniqueAssessmentTypes.length >= 6) {
        try {
          const latestScoresMap = await fetchAllScores(user.id);
          const currentIds = new Set(Object.values(latestScoresMap).map((r) => r.id));
          const portraitIds = new Set(userPortrait.assessmentIds || []);
          const idsChanged = [...currentIds].some((id) => !portraitIds.has(id));
          const versionStale = isPortraitStale(userPortrait.version);

          if (idsChanged || versionStale) {
            console.log(`[StepDetail] Portrait stale — regenerating (ids=${idsChanged}, version=${versionStale})`);
            const scores: AllAssessmentScores = {
              ecrr: latestScoresMap['ecr-r'].scores,
              dutch: latestScoresMap['dutch'].scores,
              sseit: latestScoresMap['sseit'].scores,
              dsir: latestScoresMap['dsi-r'].scores,
              ipip: latestScoresMap['ipip-neo-120'].scores,
              values: latestScoresMap['values'].scores,
            };
            const supplements = extractSupplementScores(latestScoresMap);
            const ids = Object.values(latestScoresMap).map((r) => r.id);
            const freshPortrait = generatePortrait(user.id, ids, scores, supplements);
            const saved = await savePortrait(freshPortrait);
            setPortrait(saved);
            console.log('[StepDetail] Portrait auto-regenerated successfully');
          }
        } catch (regenErr) {
          console.warn('[StepDetail] Portrait regen failed, keeping existing:', regenErr);
          // Keep old portrait — don't block step loading
        }
      }

      // Load step context (previous answers feeding forward)
      try {
        const ctx = await loadStepContext(user.id, stepNumber);
        setStepContext(ctx);
      } catch {
        setStepContext(null);
      }

      // Fetch raw scores for early insights (only when no portrait)
      if (!userPortrait && assessmentRows.length > 0) {
        try {
          const scores = await fetchAllScores(user.id);
          setAssessmentScores(scores);
        } catch {
          setAssessmentScores(null);
        }
      } else {
        setAssessmentScores(null);
      }

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
        // Load couple play state from reflection_notes
        const cpNotes = notes as Record<string, any> | undefined;
        setCouplePlayResponse(cpNotes?.couplePlayResponse ?? null);
        setCouplePlayFollowUp(cpNotes?.couplePlayFollowUp ?? null);
        setCouplePlayPartnerResponse(null); // TODO: load from partner's step_progress
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
      params: {
        id: practiceId,
        stepNumber: String(stepNumber),
        ...(coupleId ? { coupleId } : {}),
      },
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

  // Couple Play save handlers
  const handleCouplePlayResponse = useCallback(async (text: string) => {
    if (!user) return;
    try {
      // Save to reflection_notes under couplePlayResponse key
      const { data: current } = await supabase
        .from('step_progress')
        .select('reflection_notes')
        .eq('user_id', user.id)
        .eq('step_number', stepNumber)
        .single();
      const notes = (current?.reflection_notes as Record<string, any>) ?? {};
      notes.couplePlayResponse = text;
      await supabase
        .from('step_progress')
        .update({ reflection_notes: notes })
        .eq('user_id', user.id)
        .eq('step_number', stepNumber);
      setCouplePlayResponse(text);
      haptics.success();
    } catch (err) {
      console.warn('[StepDetail] Failed to save couple play response:', err);
    }
  }, [user, stepNumber, haptics]);

  const handleCouplePlayFollowUp = useCallback(async (text: string) => {
    if (!user) return;
    try {
      const { data: current } = await supabase
        .from('step_progress')
        .select('reflection_notes')
        .eq('user_id', user.id)
        .eq('step_number', stepNumber)
        .single();
      const notes = (current?.reflection_notes as Record<string, any>) ?? {};
      notes.couplePlayFollowUp = text;
      await supabase
        .from('step_progress')
        .update({ reflection_notes: notes })
        .eq('user_id', user.id)
        .eq('step_number', stepNumber);
      setCouplePlayFollowUp(text);
      haptics.success();
    } catch (err) {
      console.warn('[StepDetail] Failed to save couple play follow-up:', err);
    }
  }, [user, stepNumber, haptics]);

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

        {/* ═══ 2 — TEACHING ═══ */}

        {/* Step Teaching — Original therapeutic content */}
        {teaching && (
          <Animated.View entering={FadeIn.delay(450).duration(600)} style={styles.teachingSection}>
            {teaching.teaching.map((paragraph, i) => (
              <Text key={i} style={styles.teachingParagraph}>{paragraph}</Text>
            ))}
          </Animated.View>
        )}

        {/* Step Callback — Reference to previous step's work (Steps 2-12) */}
        {callbackText && stepNumber >= 2 && (
          <Animated.View entering={FadeIn.delay(460).duration(600)}>
            <View style={[styles.callbackCard, { borderLeftColor: phase.color }]}>
              <Text style={styles.callbackText}>{callbackText}</Text>
            </View>
          </Animated.View>
        )}

        {/* ═══ 3 — CONTEXT ═══ */}

        {/* Why This Step Comes Now */}
        {teaching?.whyAfterPrevious && (
          <Animated.View entering={FadeIn.delay(462).duration(600)}>
            <View style={[styles.teachingConnectionCard, { borderLeftColor: phase.color }]}>
              <Text style={styles.teachingConnectionLabel}>WHY THIS STEP COMES NOW</Text>
              <Text style={styles.teachingConnectionText}>{teaching.whyAfterPrevious}</Text>
            </View>
          </Animated.View>
        )}

        {/* How The Course Deepens This */}
        {teaching?.courseConnection && (
          <Animated.View entering={FadeIn.delay(465).duration(600)}>
            <View style={[styles.teachingConnectionCard, { borderLeftColor: Colors.secondary }]}>
              <Text style={styles.teachingConnectionLabel}>HOW THE COURSE DEEPENS THIS</Text>
              <Text style={styles.teachingConnectionText}>{teaching.courseConnection}</Text>
            </View>
          </Animated.View>
        )}

        {/* Portrait Bridge — Personalized "What This Means For You" (full portrait) */}
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

        {/* Early Insight — personalized from assessment scores, no full portrait yet */}
        {!bridge && earlyInsight && (
          <Animated.View entering={FadeIn.delay(470).duration(600)}>
            <StepAssessmentInsight insight={earlyInsight} phaseColor={phase.color} />
          </Animated.View>
        )}

        {/* Assessment Nudge — invitation to deepen this step (assessment not done) */}
        {assessmentNudge && !earlyInsight && (
          <Animated.View entering={FadeIn.delay(bridge ? 530 : 470).duration(600)}>
            <AssessmentNudgeCard
              nudge={assessmentNudge}
              phaseColor={phase.color}
              completedAssessmentIds={completedAssessmentIds}
              isSolo={!isCoupled}
            />
          </Animated.View>
        )}

        {/* Community Nudge — Step 9: repair deepens when witnessed */}
        {stepNumber === 9 && (
          <Animated.View entering={FadeIn.delay(bridge ? 590 : 530).duration(600)}>
            <CommunityNudgeCard phaseColor={phase.color} />
          </Animated.View>
        )}

        {/* Growth Pulse — Visible portrait evolution at milestone steps */}
        {growthPulse && (
          <GrowthPulseCard
            pulse={growthPulse}
            phaseColor={phase.color}
            hasPortrait={!!portrait}
          />
        )}

        {/* Portrait Link — connects step to personal portrait (Steps 4+) */}
        {portrait && stepNumber >= 4 && (
          <Animated.View entering={FadeIn.delay(550).duration(500)}>
            <TouchableOpacity
              style={[styles.portraitLinkCard, { borderLeftColor: phase.color }]}
              onPress={() => router.push('/(app)/portrait' as any)}
              activeOpacity={0.7}
              accessibilityRole="link"
            >
              <Text style={styles.bridgeLabel}>YOUR PERSONAL PORTRAIT</Text>
              <Text style={styles.bridgeText}>
                Your portrait reflects everything you have shared. Visit it to see how your patterns connect to this step.
              </Text>
              <Text style={[styles.portraitLinkCta, { color: phase.color }]}>
                Open Portrait {'\u203A'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Completion Criteria — Collapsible Interactive Checklist */}
        <Animated.View entering={FadeIn.delay(600).duration(500)} style={styles.goalsCard}>
          <CollapsibleHeader
            title={`Step ${step.stepNumber} Goals`}
            subtitle={`${checkedCriteria.length} of ${step.completionCriteria.length} completed`}
            isExpanded={expandedSections.has('goals')}
            onToggle={() => toggleSection('goals')}
            phaseColor={phase.color}
          />
          {expandedSections.has('goals') && (
            <>
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
            </>
          )}
        </Animated.View>

        {/* ── Divider: context → learning guide ── */}
        <View style={styles.sectionDivider} />

        {/* Transition: after teaching/context → learning guide */}
        {transitions?.afterTeaching && (
          <Text style={styles.transitionText}>{transitions.afterTeaching}</Text>
        )}

        {/* ═══ 4 — STEP LEARNING GUIDE ═══ */}
        <View style={styles.sectionHeaderRow}>
          <View style={[styles.sectionHeaderLine, { backgroundColor: phase.color }]} />
          <Text style={styles.sectionHeaderLabel}>STEP LEARNING GUIDE</Text>
          <View style={[styles.sectionHeaderLine, { backgroundColor: phase.color }]} />
        </View>

        {/* Intro Text — moved here from before teaching */}
        {step.introText && (
          <Animated.View entering={FadeIn.delay(620).duration(600)} style={styles.introTextCard}>
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

        {/* Course Gateway — collapsible */}
        {step.courseGatewayIds && step.courseGatewayIds.length > 0 && stepNumber !== 12 && (
          <Animated.View entering={FadeIn.delay(750).duration(500)} style={styles.courseGatewaySection}>
            <CollapsibleHeader
              title="Deepen Your Understanding"
              subtitle={`${step.courseGatewayIds.length} micro-course${step.courseGatewayIds.length > 1 ? 's' : ''}`}
              isExpanded={expandedSections.has('course')}
              onToggle={() => toggleSection('course')}
              phaseColor={phase.color}
            />
            {expandedSections.has('course') && step.courseGatewayIds.map((courseId) => {
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

        {/* Transition: after course → practices */}
        {transitions?.afterCourse && (
          <Text style={styles.transitionText}>{transitions.afterCourse}</Text>
        )}

        {/* Practices — Collapsible */}
        <Animated.View entering={FadeIn.delay(900).duration(500)} style={styles.practicesSection}>
          <CollapsibleHeader
            title="Solo Practices"
            subtitle={`${step.practices.length} practice${step.practices.length > 1 ? 's' : ''}`}
            isExpanded={expandedSections.has('practices')}
            onToggle={() => toggleSection('practices')}
            phaseColor={phase.color}
          />
          {expandedSections.has('practices') && step.practices.map((practiceId) => {
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

        {/* Together Practices — Collapsible, couple-only */}
        {isCoupled && step.togetherPractices && step.togetherPractices.length > 0 && (
          <Animated.View entering={FadeIn.delay(950).duration(500)} style={styles.practicesSection}>
            <CollapsibleHeader
              title="Together Practices"
              subtitle={`${step.togetherPractices.length} practice${step.togetherPractices.length > 1 ? 's' : ''} with your partner`}
              isExpanded={expandedSections.has('togetherPractices')}
              onToggle={() => toggleSection('togetherPractices')}
              phaseColor={phase.color}
            />
            {expandedSections.has('togetherPractices') && <>
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
            </>}
          </Animated.View>
        )}

        {/* Couple Play — Interactive step-specific micro-activity (couple-only) */}
        {isCoupled && couplePlayActivity && (
          <Animated.View entering={FadeIn.delay(1000).duration(500)} style={styles.couplePlaySection}>
            <CouplePlayCard
              activity={couplePlayActivity}
              phaseColor={phase.color}
              isExpanded={expandedSections.has('couplePlay')}
              onToggle={() => toggleSection('couplePlay')}
              savedResponse={couplePlayResponse}
              partnerResponse={couplePlayPartnerResponse}
              savedFollowUp={couplePlayFollowUp}
              onSaveResponse={handleCouplePlayResponse}
              onSaveFollowUp={handleCouplePlayFollowUp}
            />
          </Animated.View>
        )}

        {/* ── Divider: learning guide → reflect & share ── */}
        <View style={styles.sectionDivider} />

        {/* Transition: after practices → reflect & share */}
        {transitions?.afterPractices && (
          <Text style={styles.transitionText}>{transitions.afterPractices}</Text>
        )}

        {/* ═══ 5 — REFLECT & SHARE ═══ */}
        <View style={styles.sectionHeaderRow}>
          <View style={[styles.sectionHeaderLine, { backgroundColor: phase.color }]} />
          <Text style={styles.sectionHeaderLabel}>REFLECT & SHARE</Text>
          <View style={[styles.sectionHeaderLine, { backgroundColor: phase.color }]} />
        </View>

        {/* Partner Exchange — Collapsible enhanced couple dialogue (Steps 1-10) */}
        {isCoupled && exchangeConfig && exchangePhase && (
          <Animated.View entering={FadeIn.delay(1100).duration(500)} style={styles.partnerRoundSection}>
            <CollapsibleHeader
              title="Partner Exchange"
              subtitle={exchangePhase === 'complete' ? 'Complete' : exchangePhase === 'waiting' ? 'Waiting for partner' : 'Share your response'}
              isExpanded={expandedSections.has('partnerExchange')}
              onToggle={() => toggleSection('partnerExchange')}
              phaseColor={phase.color}
            />
            {expandedSections.has('partnerExchange') && <>
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
            </>}
          </Animated.View>
        )}

        {/* Partner Round — Collapsible fallback for steps 11-12 (couple-only) */}
        {isCoupled && !exchangeConfig && step.partnerRoundPrompt && (
          <Animated.View entering={FadeIn.delay(1100).duration(500)} style={styles.partnerRoundSection}>
            <CollapsibleHeader
              title="Partner Round"
              subtitle={partnerRoundSaved ? 'Response shared' : 'Share your response'}
              isExpanded={expandedSections.has('partnerRound')}
              onToggle={() => toggleSection('partnerRound')}
              phaseColor={phase.color}
            />
            {expandedSections.has('partnerRound') && <>
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
            </>}
          </Animated.View>
        )}

        {/* Reflection Prompts — Collapsible (after exchange) */}
        {step.reflectionPrompts && step.reflectionPrompts.length > 0 && (
          <Animated.View entering={FadeIn.delay(1150).duration(500)} style={styles.reflectionSection}>
            <CollapsibleHeader
              title="Reflection"
              subtitle={`${step.reflectionPrompts.length} prompt${step.reflectionPrompts.length > 1 ? 's' : ''}`}
              isExpanded={expandedSections.has('reflection')}
              onToggle={() => toggleSection('reflection')}
              phaseColor={phase.color}
            />
            {expandedSections.has('reflection') && (
              <>
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
              </>
            )}
          </Animated.View>
        )}

        {/* Story So Far — Step 12 synthesis of the user's journey */}
        {stepNumber === 12 && stepContext?.storySoFar && (
          <Animated.View entering={FadeIn.delay(1175).duration(600)}>
            <View style={[styles.bridgeCard, { borderLeftColor: phase.color }]}>
              <Text style={styles.bridgeLabel}>YOUR STORY</Text>
              <Text style={styles.bridgeText}>{stepContext.storySoFar}</Text>
            </View>
          </Animated.View>
        )}

        {/* ── Divider: reflect & share → closing ── */}
        <View style={styles.sectionDivider} />

        {/* Transition: after exchange */}
        {transitions?.afterExchange && isCoupled && (exchangeConfig || step.partnerRoundPrompt) && (
          <Text style={styles.transitionText}>{transitions.afterExchange}</Text>
        )}

        {/* ═══ 6 — NEXT STEP + CLOSE ═══ */}

        {/* Growth Plan — Personalized protocol from portrait (Steps 9+) */}
        {portrait && stepNumber >= 9 && (
          <Animated.View entering={FadeIn.delay(1250).duration(500)} style={styles.growthPlanSection}>
            <CollapsibleHeader
              title="Your Growth Plan"
              subtitle="Personalized pathway from your portrait"
              isExpanded={expandedSections.has('growthPlan')}
              onToggle={() => toggleSection('growthPlan')}
              phaseColor={phase.color}
            />
            {expandedSections.has('growthPlan') && (
              <View style={{ paddingTop: Spacing.sm }}>
                <GrowthPlanContent portrait={portrait} router={router} />
              </View>
            )}
          </Animated.View>
        )}

        {/* Step 12 — All courses available, Collapsible */}
        {stepNumber === 12 && (
          <Animated.View entering={FadeIn.delay(1300).duration(500)} style={styles.courseGatewaySection}>
            <CollapsibleHeader
              title="All Courses Available"
              subtitle="14 micro-courses to explore"
              isExpanded={expandedSections.has('allCourses')}
              onToggle={() => toggleSection('allCourses')}
              phaseColor={phase.color}
            />
            {expandedSections.has('allCourses') && (
              <>
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
              </>
            )}
          </Animated.View>
        )}

        {/* Coming Next — tappable only when the next step is unlocked */}
        {nextStep && (() => {
          const nextPhase = getPhaseForStep(nextStep.stepNumber) ?? phase;
          return (
            <TouchableOpacity
              style={[styles.nextSection, { borderColor: nextPhase.color + '40' }, !canNavigateNext && styles.nextSectionLocked]}
              onPress={handleNextStep}
              activeOpacity={canNavigateNext ? 0.7 : 1}
              disabled={!canNavigateNext}
              accessibilityRole="button"
              accessibilityState={{ disabled: !canNavigateNext }}
            >
              <Text style={[styles.nextLabel, { color: nextPhase.color }]}>
                {canNavigateNext ? 'NEXT STEP' : 'COMING NEXT'}
              </Text>
              <Text style={styles.nextTitle}>
                Step {nextStep.stepNumber}: {nextStep.title}
              </Text>
              <Text style={styles.nextHint}>
                {canNavigateNext
                  ? 'Tap to explore this step'
                  : `Complete all Step ${step.stepNumber} goals to unlock`}
              </Text>
              {canNavigateNext && (
                <Text style={[styles.nextArrow, { color: nextPhase.color }]}>
                  {'\u203A'}
                </Text>
              )}
            </TouchableOpacity>
          );
        })()}

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
    gap: Spacing.md,
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

  // Teaching section — open text on the warm background, no card
  teachingSection: {
    gap: Spacing.lg,
  },
  teachingParagraph: {
    ...Typography.body,
    color: Colors.text,
    lineHeight: 32,
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

  // Step Callback card (between teaching and bridge)
  callbackCard: {
    borderLeftWidth: 3,
    paddingLeft: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  callbackText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 22,
    fontStyle: 'italic',
  },

  // Visual breathing divider between major sections
  sectionDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.lg,
    marginHorizontal: Spacing.xxl,
    opacity: 0.5,
  },

  // Section transition text — pullquote style
  transitionText: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 17,
    color: Colors.textSecondary,
    fontStyle: 'italic' as const,
    textAlign: 'center' as const,
    lineHeight: 26,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },

  // Couple Play section
  couplePlaySection: {
    gap: Spacing.sm,
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

  // Portrait link card (Steps 4+)
  portraitLinkCard: {
    borderLeftWidth: 4,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.sm,
    ...Shadows.subtle,
  },
  portraitLinkCta: {
    ...Typography.caption,
    fontWeight: '600',
  },

  // Growth Plan collapsible section (Steps 9+)
  growthPlanSection: {
    gap: Spacing.sm,
  },

  // Section headers with horizontal accent lines
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  sectionHeaderLine: {
    flex: 1,
    height: 1,
    opacity: 0.3,
  },
  sectionHeaderLabel: {
    ...Typography.label,
    letterSpacing: 3,
    fontSize: 10,
    color: Colors.textMuted,
  },
});
