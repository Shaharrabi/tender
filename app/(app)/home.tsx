/**
 * Home Screen — Wellness Journal Hub
 *
 * Designed with "one clear action" philosophy from top wellness apps.
 * Answers: "What should I do RIGHT NOW?" — not a menu, a recommendation.
 *
 * Layout (top to bottom):
 * 1. Greeting + Journey Context — name, step, progress dots
 * 2. Today's Focus — ONE clear action (practice or Sage)
 * 3. Daily Check-In — collapsed habit tracker
 * 4. Your Journey — progress bar + next assessment integrated
 * 5. Streak — small, celebratory, not guilt-inducing
 * 6. Inspiration — rotating quote or nudge carousel
 * 7. Explore — feature grid (Portrait, Sage, Growth, etc.)
 * 8. Results — completed assessment scores
 * 9. Individual Assessments — collapsible list
 * 10. Logout
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Animated,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/context/AuthContext';
import {
  getUnlockState,
  getNextAssessment,
  getProgressMessage,
  FEATURE_CARDS,
  ASSESSMENT_DISPLAY_NAMES,
  FEATURE_KEY_TO_ASSESSMENT_TYPE,
  type FeatureCard,
  type UnlockState,
} from '@/utils/unlockLogic';
import {
  getIndividualAssessments,
  getDyadicAssessments,
  getAllAssessments,
  getAssessmentConfig,
} from '@/utils/assessments/registry';
import { supabase } from '@/services/supabase';
import { getPortrait, savePortrait, fetchAllScores } from '@/services/portrait';
import { generatePortrait } from '@/utils/portrait/portrait-generator';
import { getTodaysCheckIn, saveDailyCheckIn } from '@/services/growth';
import { getMyCouple } from '@/services/couples';
import { getAllExercises, getExerciseById } from '@/utils/interventions/registry';
import CheckInCard from '@/components/growth/CheckInCard';
import NudgeCarousel from '@/components/NudgeCarousel';
import { getNudges } from '@/utils/nudges';
import { getUserConsent } from '@/services/consent';
import { recordDailyEngagement, getStreakData, type StreakData } from '@/services/streaks';
import StreakBanner from '@/components/StreakBanner';
import { getCurrentStepNumber } from '@/services/steps';
import { getTaglineForStep, getPracticesForStep, getStep } from '@/utils/steps/twelve-steps';
import {
  Colors,
  Spacing,
  FontSizes,
  ButtonSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import type { AssessmentConfig, AllAssessmentScores, AssessmentType } from '@/types';
import type { IndividualPortrait } from '@/types/portrait';
import type { DailyCheckIn } from '@/types/growth';
import type { Couple } from '@/types/couples';
import {
  seedDemoAssessments,
  clearDemoAssessments,
  DEMO_ECRR,
  DEMO_DUTCH,
  DEMO_SSEIT,
  DEMO_DSIR,
  DEMO_IPIP,
  DEMO_VALUES,
} from '@/utils/demo-data';

// ─── Types ──────────────────────────────────────────────

interface CardStatus {
  state: 'not_started' | 'in_progress' | 'completed';
  progressQuestion?: number;
  totalQuestions?: number;
  completedAt?: string;
}

// ─── Helpers ────────────────────────────────────────────

function getTimeGreeting(): { greeting: string; emoji: string } {
  const hour = new Date().getHours();
  if (hour < 12) return { greeting: 'Good morning', emoji: '\u2600\uFE0F' };
  if (hour < 17) return { greeting: 'Good afternoon', emoji: '\uD83C\uDF24\uFE0F' };
  return { greeting: 'Good evening', emoji: '\uD83C\uDF19' };
}

const DAILY_GREETINGS = [
  "How are you and your partner doing today?",
  "Every small step strengthens your bond.",
  "You're investing in what matters most.",
  "Welcome back to your growth journey.",
  "Today is another chance to connect.",
  "Your relationship deserves this time.",
  "Let's continue where you left off.",
];

// ─── Component ──────────────────────────────────────────

export default function HomeScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  // Assessment state
  const [statuses, setStatuses] = useState<Record<string, CardStatus>>({});
  const [completedTypes, setCompletedTypes] = useState<AssessmentType[]>([]);
  const [assessmentScores, setAssessmentScores] = useState<Record<string, any>>({});
  const [assessmentsExpanded, setAssessmentsExpanded] = useState(true);

  // Portrait state
  const [portrait, setPortrait] = useState<IndividualPortrait | null>(null);
  const [generating, setGenerating] = useState(false);

  // Check-in state
  const [todaysCheckIn, setTodaysCheckIn] = useState<DailyCheckIn | null>(null);

  // Couple state
  const [couple, setCouple] = useState<Couple | null>(null);

  // Unlock state
  const [unlockState, setUnlockState] = useState<UnlockState | null>(null);

  // Streak state
  const [streakData, setStreakData] = useState<StreakData | null>(null);

  // Step state
  const [currentStepNum, setCurrentStepNum] = useState<number>(1);
  const [stepTagline, setStepTagline] = useState<string>('');

  // Loading
  const [loading, setLoading] = useState(true);

  // Locked card hint
  const [lockedHintKey, setLockedHintKey] = useState<string | null>(null);

  // Progress bar animation
  const progressAnim = useRef(new Animated.Value(0)).current;

  // ─── Load everything on focus ──────────────────────────

  const loadData = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    try {
      // 1. Load completed assessment types from supabase
      const newStatuses: Record<string, CardStatus> = {};
      const { data: completed } = await supabase
        .from('assessments')
        .select('type, completed_at, scores')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      const completionMap: Record<string, string> = {};
      const scoresMap: Record<string, any> = {};
      if (completed) {
        for (const row of completed) {
          if (!completionMap[row.type]) {
            completionMap[row.type] = row.completed_at;
            scoresMap[row.type] = row.scores;
          }
        }
      }
      setAssessmentScores(scoresMap);

      const allConfigs = getAllAssessments();
      for (const config of allConfigs) {
        if (completionMap[config.type]) {
          newStatuses[config.type] = {
            state: 'completed',
            completedAt: completionMap[config.type],
          };
        } else {
          try {
            const saved = await AsyncStorage.getItem(config.progressKey);
            if (saved) {
              const data = JSON.parse(saved);
              const answered = data.responses.filter(
                (r: any) => r !== null && r !== '' && r !== undefined
              ).length;
              newStatuses[config.type] =
                answered > 0
                  ? {
                      state: 'in_progress',
                      progressQuestion: answered,
                      totalQuestions: config.totalQuestions,
                    }
                  : { state: 'not_started' };
            } else {
              newStatuses[config.type] = { state: 'not_started' };
            }
          } catch {
            newStatuses[config.type] = { state: 'not_started' };
          }
        }
      }
      setStatuses(newStatuses);

      // Compute completed assessment types
      const completedAssessmentTypes = Object.keys(completionMap) as AssessmentType[];
      setCompletedTypes(completedAssessmentTypes);

      // 2. Load portrait
      let loadedPortrait: IndividualPortrait | null = null;
      try {
        loadedPortrait = await getPortrait(user.id);
        setPortrait(loadedPortrait);
      } catch {
        setPortrait(null);
      }

      // 3. Load couple
      let loadedCouple: Couple | null = null;
      try {
        loadedCouple = await getMyCouple(user.id);
        setCouple(loadedCouple);
      } catch {
        setCouple(null);
      }

      // 4. Compute unlock state
      const hasPortrait = loadedPortrait !== null;
      const hasCoupleLinked =
        loadedCouple !== null && loadedCouple.status === 'active';
      const unlock = getUnlockState(
        completedAssessmentTypes,
        hasPortrait,
        hasCoupleLinked
      );
      setUnlockState(unlock);

      // Animate progress bar
      Animated.timing(progressAnim, {
        toValue: unlock.progressPercent / 100,
        duration: 800,
        useNativeDriver: false,
      }).start();

      // Auto-collapse assessments if all individual done
      const individualConfigs = getIndividualAssessments();
      const individualDone =
        individualConfigs.length > 0 &&
        individualConfigs.every(
          (c) => newStatuses[c.type]?.state === 'completed'
        );
      if (individualDone) {
        setAssessmentsExpanded(false);
      }

      // 5. Load today's check-in
      try {
        const ci = await getTodaysCheckIn(user.id);
        setTodaysCheckIn(ci);
      } catch {
        setTodaysCheckIn(null);
      }

      // 6. Record daily engagement & load streak
      try {
        await recordDailyEngagement(user.id);
        const sd = await getStreakData(user.id);
        setStreakData(sd);
      } catch {
        setStreakData(null);
      }

      // 7. Load current step and tagline
      try {
        const stepNum = await getCurrentStepNumber(user.id);
        setCurrentStepNum(stepNum);
        setStepTagline(getTaglineForStep(stepNum));
      } catch {
        setStepTagline(getTaglineForStep(1));
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  // ─── Derived state ────────────────────────────────────

  const individualConfigs = getIndividualAssessments();
  const allConfigs = getAllAssessments();
  const hasPortrait = portrait !== null;
  const hasCoupleLinked = couple !== null && couple.status === 'active';
  const completedCount = unlockState?.completedCount ?? 0;

  // Next recommended assessment
  const nextAssessmentType = getNextAssessment(completedTypes);
  const nextAssessmentConfig = nextAssessmentType
    ? (() => {
        try {
          return getAssessmentConfig(nextAssessmentType);
        } catch {
          return null;
        }
      })()
    : null;

  // Result cards — only show completed ones
  const resultCards = FEATURE_CARDS.filter(
    (card) =>
      card.category === 'result' && unlockState?.[card.key] === true
  );

  // Feature cards for the grid
  const featureGridCards = FEATURE_CARDS.filter(
    (card) =>
      card.category === 'feature' &&
      ['treatmentPlan', 'findTherapist', 'practices', 'couplesPortal'].includes(
        card.key
      )
  );
  // Also add couple portal
  const couplePortalCard = FEATURE_CARDS.find(
    (card) => card.key === 'couplesPortal'
  );
  const gridCards = [
    ...featureGridCards,
    ...(couplePortalCard && !featureGridCards.find((c) => c.key === 'couplesPortal')
      ? [couplePortalCard]
      : []),
  ];

  // Recommended exercise — prioritize exercises from current Step
  const allExercises = getAllExercises();
  const stepPracticeIds = getPracticesForStep(currentStepNum);
  const stepExercises = stepPracticeIds
    .map((id) => getExerciseById(id))
    .filter((e): e is NonNullable<typeof e> => e != null);
  const exercisePool = stepExercises.length > 0 ? stepExercises : allExercises;
  const todaysExercise =
    exercisePool.length > 0
      ? exercisePool[Math.floor(Date.now() / 86400000) % exercisePool.length]
      : null;

  // Compute days since last assessment for nudges
  const daysSinceLastAssessment = (() => {
    const completedEntries = Object.values(statuses).filter(
      (s) => s.state === 'completed' && s.completedAt
    );
    if (completedEntries.length === 0) return 999;
    const latest = completedEntries.reduce((a, b) =>
      (a.completedAt! > b.completedAt!) ? a : b
    );
    const diff = Date.now() - new Date(latest.completedAt!).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  })();

  // Nudges for the carousel
  const nudges = getNudges(
    completedCount,
    hasPortrait,
    todaysCheckIn !== null,
    daysSinceLastAssessment,
  );

  // ─── Handlers ──────────────────────────────────────────

  const handleStart = async (config: AssessmentConfig) => {
    await AsyncStorage.removeItem(config.progressKey);
    router.push({
      pathname: '/(app)/assessment',
      params: { type: config.type },
    } as any);
  };

  const handleResume = (config: AssessmentConfig) => {
    router.push({
      pathname: '/(app)/assessment',
      params: { type: config.type },
    } as any);
  };

  const handleGeneratePortrait = async () => {
    if (!user || generating) return;

    // Check if user has signed consent waiver
    const consent = await getUserConsent(user.id);
    if (!consent) {
      router.push('/(app)/consent-waiver' as any);
      return;
    }

    setGenerating(true);
    try {
      const latest = await fetchAllScores(user.id);
      const ids = Object.values(latest).map((r) => r.id);
      const scores: AllAssessmentScores = {
        ecrr: latest['ecr-r'].scores,
        dutch: latest['dutch'].scores,
        sseit: latest['sseit'].scores,
        dsir: latest['dsi-r'].scores,
        ipip: latest['ipip-neo-120'].scores,
        values: latest['values'].scores,
      };
      const p = generatePortrait(user.id, ids, scores);
      await savePortrait(p);
      setPortrait(p as IndividualPortrait);
      router.push('/(app)/portrait' as any);
    } catch (e) {
      console.error('Portrait generation failed:', e);
    } finally {
      setGenerating(false);
    }
  };

  const handleCheckInSubmit = async (
    mood: number,
    relationship: number,
    practiced: boolean,
    note?: string
  ) => {
    if (!user) return;
    const ci = await saveDailyCheckIn(
      user.id,
      mood,
      relationship,
      practiced,
      note
    );
    setTodaysCheckIn(ci);
  };

  const handleLogout = async () => {
    const configs = getAllAssessments();
    for (const config of configs) {
      await AsyncStorage.removeItem(config.progressKey);
    }
    await signOut();
    router.replace('/(auth)/login');
  };

  const handleLockedCardTap = (card: FeatureCard) => {
    setLockedHintKey(card.key);
    setTimeout(() => setLockedHintKey(null), 2500);
  };

  const handleFeatureCardPress = (card: FeatureCard) => {
    const isUnlocked = unlockState?.[card.key] === true;
    if (isUnlocked) {
      router.push(card.route as any);
    } else {
      handleLockedCardTap(card);
    }
  };

  // ─── Demo Mode ─────────────────────────────────────────

  const handleSkipToDemo = async () => {
    if (!user || generating) return;
    setGenerating(true);
    try {
      // 1. Seed all 6 assessment records with realistic scores
      const assessmentIds = await seedDemoAssessments(user.id);

      // 2. Generate a real portrait from the demo scores
      const scores: AllAssessmentScores = {
        ecrr: DEMO_ECRR,
        dutch: DEMO_DUTCH,
        sseit: DEMO_SSEIT,
        dsir: DEMO_DSIR,
        ipip: DEMO_IPIP,
        values: DEMO_VALUES,
      };
      const demoPortrait = generatePortrait(user.id, assessmentIds, scores);
      await savePortrait(demoPortrait);
      await AsyncStorage.setItem('demo_mode', 'true');
      setPortrait(demoPortrait as IndividualPortrait);
      setIsDemo(true);
      router.push('/(app)/portrait' as any);
    } catch (e) {
      console.error('Demo portrait failed:', e);
    } finally {
      setGenerating(false);
    }
  };

  const [isDemo, setIsDemo] = useState(false);

  // Check demo mode from AsyncStorage on portrait change
  useEffect(() => {
    AsyncStorage.getItem('demo_mode').then((val) => setIsDemo(val === 'true'));
  }, [portrait]);

  const handleExitDemo = async () => {
    if (!user) return;
    try {
      await supabase.from('portraits').delete().eq('user_id', user.id);
      await clearDemoAssessments(user.id);
      await AsyncStorage.removeItem('demo_mode');
      setPortrait(null);
      setIsDemo(false);
      loadData(); // Refresh to reflect cleared state
    } catch (e) {
      console.error('Failed to exit demo:', e);
      setPortrait(null);
    }
  };

  // ─── Render ────────────────────────────────────────────

  if (loading && !unlockState) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={Colors.primary} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  const progressMessage = getProgressMessage(completedCount);
  const individualCompleted = individualConfigs.every(
    (c) => statuses[c.type]?.state === 'completed'
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ═══ 1. GREETING + JOURNEY CONTEXT ═══════════════════ */}
        <View style={styles.heroSection}>
          <View style={styles.heroBackground}>
            {(() => {
              const { greeting, emoji } = getTimeGreeting();
              const firstName = user?.email?.split('@')[0]?.replace(/[._-]/g, ' ')?.split(' ')[0] || '';
              const capitalName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
              return (
                <>
                  <Text style={styles.heroTagline}>
                    {greeting}, {capitalName} {emoji}
                  </Text>
                  {hasPortrait ? (
                    <Text style={styles.heroSubtitle}>
                      Step {currentStepNum}: {getStep(currentStepNum)?.title ?? ''}
                    </Text>
                  ) : (
                    <Text style={styles.heroSubtitle}>
                      {(() => {
                        const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
                        return DAILY_GREETINGS[dayOfYear % DAILY_GREETINGS.length];
                      })()}
                    </Text>
                  )}
                </>
              );
            })()}
          </View>

          {/* Step progress dots — 12 dots showing journey progress */}
          {hasPortrait && (
            <View style={styles.stepDotsRow}>
              {Array.from({ length: 12 }, (_, i) => (
                <View
                  key={i}
                  style={[
                    styles.stepDot,
                    i < currentStepNum
                      ? styles.stepDotCompleted
                      : i === currentStepNum
                        ? styles.stepDotActive
                        : styles.stepDotPending,
                  ]}
                />
              ))}
            </View>
          )}

          {/* Demo mode banner */}
          {hasPortrait && isDemo && (
            <View style={styles.demoBanner}>
              <Text style={styles.demoBannerText}>
                You are viewing a demo portrait
              </Text>
              <TouchableOpacity
                style={styles.exitDemoButton}
                onPress={handleExitDemo}
                activeOpacity={0.7}
              >
                <Text style={styles.exitDemoText}>
                  Exit Demo — Start Assessments
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Skip to demo */}
          {!hasPortrait && (
            <TouchableOpacity
              style={styles.skipDemoButton}
              onPress={handleSkipToDemo}
              disabled={generating}
              activeOpacity={0.7}
            >
              {generating ? (
                <ActivityIndicator color={Colors.calm} size="small" />
              ) : (
                <Text style={styles.skipDemoText}>Skip to Demo</Text>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* ═══ 2. TODAY'S FOCUS (ONE THING) ═══════════════════ */}
        {todaysExercise ? (
          <View style={styles.todaysFocusSection}>
            <TouchableOpacity
              style={styles.todaysFocusCard}
              onPress={() =>
                router.push({
                  pathname: '/(app)/exercise' as any,
                  params: { id: todaysExercise.id },
                })
              }
              activeOpacity={0.8}
            >
              <Text style={styles.todaysFocusEyebrow}>TODAY'S PRACTICE</Text>
              <Text style={styles.todaysFocusTitle}>
                {todaysExercise.title}
              </Text>
              <Text style={styles.todaysFocusMeta}>
                {todaysExercise.duration} min {'\u00B7'}{' '}
                {todaysExercise.mode} {'\u00B7'}{' '}
                {stepExercises.length > 0 ? `Step ${currentStepNum}` : todaysExercise.category}
              </Text>
              <View style={styles.todaysFocusButton}>
                <Text style={styles.todaysFocusButtonText}>
                  Start Practice {'\u2192'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : completedCount > 0 ? (
          <View style={styles.todaysFocusSection}>
            <TouchableOpacity
              style={styles.todaysFocusCard}
              onPress={() => {
                if (completedCount > 0) {
                  router.push('/(app)/chat' as any);
                }
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.todaysFocusEyebrow}>TODAY'S FOCUS</Text>
              <Text style={styles.todaysFocusTitle}>
                Talk to Sage about your journey
              </Text>
              <Text style={styles.todaysFocusMeta}>
                Your relationship guide {'\u00B7'} Always here
              </Text>
              <View style={styles.todaysFocusButton}>
                <Text style={styles.todaysFocusButtonText}>
                  Open Sage {'\u2192'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* ═══ 3. DAILY CHECK-IN (Collapsed by default) ═══════ */}
        {hasPortrait && (
          <View style={styles.section}>
            <CheckInCard
              todaysCheckIn={todaysCheckIn}
              onSubmit={handleCheckInSubmit}
            />
          </View>
        )}

        {/* ═══ 4. YOUR JOURNEY ════════════════════════════════ */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>YOUR JOURNEY</Text>
            <Text style={styles.progressCount}>
              {completedCount} of 6 assessments complete
            </Text>
          </View>
          <View style={styles.progressBarTrack}>
            <Animated.View
              style={[
                styles.progressBarFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>

          {/* Next assessment integrated into journey section */}
          {nextAssessmentConfig && !isDemo && (
            <TouchableOpacity
              style={styles.nextAssessmentCard}
              onPress={() => {
                const status = statuses[nextAssessmentConfig.type];
                if (status?.state === 'in_progress') {
                  handleResume(nextAssessmentConfig);
                } else {
                  handleStart(nextAssessmentConfig);
                }
              }}
              activeOpacity={0.8}
            >
              <View style={styles.nextAssessmentContent}>
                <View style={styles.nextAssessmentBadge}>
                  <Text style={styles.nextAssessmentBadgeText}>
                    Up Next
                  </Text>
                </View>
                <Text style={styles.nextAssessmentTitle}>
                  {nextAssessmentConfig.name}
                </Text>
                <Text style={styles.nextAssessmentMeta}>
                  {nextAssessmentConfig.totalQuestions} questions{' '}
                  {'\u00B7'} ~{nextAssessmentConfig.estimatedMinutes} min
                </Text>
              </View>
              <View style={styles.nextAssessmentArrow}>
                <Text style={styles.nextAssessmentArrowText}>
                  Start {'\u2192'}
                </Text>
              </View>
            </TouchableOpacity>
          )}

          {/* Portrait generation prompt — part of journey */}
          {individualCompleted && !hasPortrait && (
            <TouchableOpacity
              style={styles.portraitGenerateCard}
              onPress={handleGeneratePortrait}
              disabled={generating}
              activeOpacity={0.8}
            >
              {generating ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <>
                  <Text style={styles.portraitGenerateTitle}>
                    Your Portrait is Ready
                  </Text>
                  <Text style={styles.portraitGenerateSubtitle}>
                    All assessments complete — generate your relational portrait
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* ═══ 4B. YOUR GROWTH PLAN (if portrait exists) ══════ */}
        {hasPortrait && portrait && (() => {
          // Import inline to avoid breaking non-portrait flow
          const { synthesizeAssessments } = require('@/utils/portrait/assessment-synthesis');
          try {
            const synthesis = synthesizeAssessments(portrait);
            const { journeyMap, movements } = synthesis;
            return (
              <View style={styles.growthPlanSection}>
                <Text style={styles.growthPlanTitle}>
                  Your Growth Plan
                </Text>
                <Text style={styles.growthPlanHeadline}>
                  {journeyMap.headline}
                </Text>
                <Text style={styles.growthPlanRationale}>
                  {journeyMap.whyThisPath.length > 150
                    ? journeyMap.whyThisPath.slice(0, 147) + '...'
                    : journeyMap.whyThisPath}
                </Text>

                {/* Four Movements mini-viz */}
                <View style={styles.movementsRow}>
                  {(['recognition', 'release', 'resonance', 'embodiment'] as const).map((key) => {
                    const m = movements[key];
                    return (
                      <View key={key} style={styles.movementItem}>
                        <View style={styles.movementBarTrack}>
                          <View
                            style={[
                              styles.movementBarFill,
                              { height: `${Math.max(m.readiness, 8)}%` },
                            ]}
                          />
                        </View>
                        <Text style={styles.movementLabel}>
                          {m.name.slice(0, 5)}
                        </Text>
                      </View>
                    );
                  })}
                </View>

                {/* Phases preview */}
                <View style={styles.growthPlanPhases}>
                  {journeyMap.phases.slice(0, 3).map((phase: { name: string; weeks: string; whatToDo: string; practiceCount: number }, i: number) => (
                    <View key={i} style={styles.growthPlanPhaseRow}>
                      <View style={[
                        styles.growthPlanPhaseDot,
                        i === 0 && styles.growthPlanPhaseDotActive,
                      ]} />
                      <View style={styles.growthPlanPhaseContent}>
                        <Text style={styles.growthPlanPhaseName}>
                          {phase.name}
                        </Text>
                        <Text style={styles.growthPlanPhaseWeeks}>
                          {phase.weeks}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  style={styles.growthPlanCta}
                  onPress={() => router.push('/(app)/portrait' as any)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.growthPlanCtaText}>
                    See Full Plan {'\u2192'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          } catch {
            return null;
          }
        })()}

        {/* ═══ 5. STREAK (Small, celebratory) ═════════════════ */}
        {streakData && streakData.currentStreak > 0 && (
          <View style={styles.streakMiniSection}>
            <Text style={styles.streakMiniText}>
              {'\u{1F33F}'} Day {streakData.currentStreak} {'\u00B7'} Keep going!
            </Text>
          </View>
        )}

        {/* ═══ 6. INSPIRATION (Rotating nudge) ════════════════ */}
        {stepTagline && hasPortrait && (
          <View style={styles.inspirationSection}>
            <Text style={styles.inspirationText}>
              {'\u201C'}{stepTagline}{'\u201D'}
            </Text>
          </View>
        )}
        {!hasPortrait && <NudgeCarousel nudges={nudges} />}

        {/* ═══ 7. EXPLORE (Bottom section) ════════════════════ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Explore</Text>
          <View style={styles.featureGrid}>
            {/* View Portrait — always show if exists */}
            {hasPortrait && (
              <TouchableOpacity
                style={styles.featureCard}
                onPress={() => router.push('/(app)/portrait' as any)}
                activeOpacity={0.8}
              >
                <View style={styles.featureCardHeader}>
                  <Text style={styles.featureCardIcon}>{'\u{2728}'}</Text>
                </View>
                <Text style={styles.featureCardTitle}>View Portrait</Text>
                <Text style={styles.featureCardSubtitle} numberOfLines={2}>
                  Your relational portrait
                </Text>
              </TouchableOpacity>
            )}

            {/* Sage Coach */}
            <TouchableOpacity
              style={[
                styles.featureCard,
                completedCount === 0 && styles.featureCardLocked,
              ]}
              onPress={() => {
                if (completedCount > 0) {
                  router.push('/(app)/chat' as any);
                } else {
                  setLockedHintKey('sage');
                  setTimeout(() => setLockedHintKey(null), 2500);
                }
              }}
              activeOpacity={0.8}
            >
              <View style={styles.featureCardHeader}>
                <Text style={styles.featureCardIcon}>{'\u{1F33F}'}</Text>
                {completedCount === 0 && (
                  <Text style={styles.featureCardLockIcon}>
                    {'\u{1F512}'}
                  </Text>
                )}
              </View>
              <Text style={styles.featureCardTitle}>Talk to Sage</Text>
              <Text style={styles.featureCardSubtitle} numberOfLines={2}>
                Your relationship guide
              </Text>
              {lockedHintKey === 'sage' && completedCount === 0 && (
                <Text style={styles.featureCardHint}>
                  Complete 1 assessment to start
                </Text>
              )}
            </TouchableOpacity>

            {/* Other feature cards */}
            {gridCards.map((card) => {
              const isUnlocked = unlockState?.[card.key] === true;
              return (
                <TouchableOpacity
                  key={card.key}
                  style={[
                    styles.featureCard,
                    !isUnlocked && styles.featureCardLocked,
                  ]}
                  onPress={() => handleFeatureCardPress(card)}
                  activeOpacity={isUnlocked ? 0.8 : 0.6}
                >
                  <View style={styles.featureCardHeader}>
                    <Text style={styles.featureCardIcon}>{card.icon}</Text>
                    {!isUnlocked && (
                      <Text style={styles.featureCardLockIcon}>
                        {'\u{1F512}'}
                      </Text>
                    )}
                  </View>
                  <Text style={styles.featureCardTitle}>{card.title}</Text>
                  <Text style={styles.featureCardSubtitle} numberOfLines={2}>
                    {card.subtitle}
                  </Text>
                  {lockedHintKey === card.key && !isUnlocked && (
                    <Text style={styles.featureCardHint}>
                      {card.unlockHint}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ═══ Unlocked Results ════════════════════════════════ */}
        {resultCards.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Results</Text>
            <View style={styles.resultsGrid}>
              {resultCards.map((card) => {
                const assessmentType = FEATURE_KEY_TO_ASSESSMENT_TYPE[card.key];
                const scores = assessmentType ? assessmentScores[assessmentType] : undefined;
                return (
                <TouchableOpacity
                  key={card.key}
                  style={styles.resultCard}
                  onPress={() => router.push({
                    pathname: '/(app)/results',
                    params: {
                      type: assessmentType,
                      scores: JSON.stringify(scores),
                    },
                  } as any)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.resultIconCircle,
                      { backgroundColor: card.color + '20' },
                    ]}
                  >
                    <Text style={styles.resultIcon}>{card.icon}</Text>
                  </View>
                  <Text style={styles.resultTitle} numberOfLines={1}>
                    {card.title}
                  </Text>
                  <Text style={styles.resultSubtitle} numberOfLines={2}>
                    {card.subtitle}
                  </Text>
                  <TouchableOpacity
                    style={styles.askSageButton}
                    onPress={() => router.push('/(app)/chat' as any)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.askSageText}>
                      {'\u{1F33F}'} Ask Sage
                    </Text>
                  </TouchableOpacity>
                </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* ═══ Individual Assessments (Collapsible) ═══════════ */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionTitleRow}
            onPress={() => setAssessmentsExpanded(!assessmentsExpanded)}
            activeOpacity={0.7}
          >
            <Text style={styles.sectionTitle}>Individual Assessments</Text>
            <Text style={styles.expandArrow}>
              {assessmentsExpanded ? '\u25B4' : '\u25BE'}
            </Text>
          </TouchableOpacity>

          {!assessmentsExpanded && (
            <Text style={styles.assessmentSummary}>
              {completedCount} of {individualConfigs.length} completed
            </Text>
          )}

          {assessmentsExpanded && (
            <View style={styles.assessmentCards}>
              {individualConfigs.map((config) => {
                const status = statuses[config.type] || {
                  state: 'not_started',
                };
                return (
                  <View key={config.type} style={styles.assessmentCard}>
                    <View style={styles.assessmentCardHeader}>
                      <View style={styles.assessmentTitleRow}>
                        <Text style={styles.assessmentShortName}>
                          {config.shortName}
                        </Text>
                        <AssessmentBadge status={status} />
                      </View>
                      <Text style={styles.assessmentName}>{config.name}</Text>
                      <Text style={styles.assessmentDescription}>
                        {config.description}
                      </Text>
                      <Text style={styles.assessmentMeta}>
                        {config.totalQuestions} questions {'\u00B7'} ~
                        {config.estimatedMinutes} min
                      </Text>
                    </View>

                    <View style={styles.assessmentActions}>
                      {status.state === 'not_started' && (
                        <TouchableOpacity
                          style={styles.assessmentButton}
                          onPress={() => handleStart(config)}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.assessmentButtonText}>
                            Start
                          </Text>
                        </TouchableOpacity>
                      )}
                      {status.state === 'in_progress' && (
                        <>
                          <Text style={styles.progressNote}>
                            {status.progressQuestion} of{' '}
                            {status.totalQuestions} answered
                          </Text>
                          <TouchableOpacity
                            style={styles.assessmentButton}
                            onPress={() => handleResume(config)}
                            activeOpacity={0.7}
                          >
                            <Text style={styles.assessmentButtonText}>
                              Continue
                            </Text>
                          </TouchableOpacity>
                        </>
                      )}
                      {status.state === 'completed' && (
                        <TouchableOpacity
                          style={styles.assessmentButtonOutline}
                          onPress={() => handleStart(config)}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.assessmentButtonOutlineText}>
                            Retake
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* ═══ Logout ═════════════════════════════════════════ */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Assessment Badge ───────────────────────────────────

function AssessmentBadge({ status }: { status: CardStatus }) {
  if (status.state === 'completed') {
    return (
      <View style={[styles.badge, styles.badgeCompleted]}>
        <Text style={styles.badgeCompletedText}>Completed</Text>
      </View>
    );
  }
  if (status.state === 'in_progress') {
    return (
      <View style={[styles.badge, styles.badgeInProgress]}>
        <Text style={styles.badgeInProgressText}>In Progress</Text>
      </View>
    );
  }
  return null;
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: Spacing.xxxl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ── Hero Section ──
  heroSection: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  heroBackground: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  heroTagline: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
    lineHeight: 34,
  },
  heroSubtitle: {
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    lineHeight: 22,
  },

  // ── Step Tagline ──
  stepTaglineBanner: {
    marginTop: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.secondary,
    gap: 4,
  },
  stepTaglineText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  stepTaglineStep: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    fontWeight: '600',
  },

  // ── Demo Banner ──
  demoBanner: {
    marginTop: Spacing.md,
    backgroundColor: '#FFF8E7',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: '#F0E0B8',
  },
  demoBannerText: {
    fontSize: FontSizes.bodySmall,
    color: '#8B6914',
    fontWeight: '600',
    textAlign: 'center',
  },
  exitDemoButton: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.pill,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  exitDemoText: {
    fontSize: FontSizes.caption,
    color: Colors.primary,
    fontWeight: '700',
  },
  skipDemoButton: {
    marginTop: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.calm,
    borderRadius: BorderRadius.pill,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    alignSelf: 'center',
    borderStyle: 'dashed' as any,
  },
  skipDemoText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.calm,
    fontWeight: '600',
  },

  // ── Progress Bar ──
  progressSection: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  progressLabel: {
    fontSize: FontSizes.caption,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  progressCount: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: Colors.borderLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },

  // ── Nudge Card ──
  nudgeCard: {
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.subtle,
  },
  nudgeIcon: {
    fontSize: 24,
  },
  nudgeText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    flex: 1,
    lineHeight: 20,
  },

  // ── Sections ──
  section: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.headingM,
    fontWeight: '600',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  expandArrow: {
    fontSize: FontSizes.body,
    color: Colors.textMuted,
  },

  // ── Results Grid ──
  resultsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  resultCard: {
    width: '48.5%' as any,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.xs,
    ...Shadows.card,
  },
  resultIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  resultIcon: {
    fontSize: 20,
  },
  resultTitle: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '700',
    color: Colors.text,
  },
  resultSubtitle: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  askSageButton: {
    marginTop: Spacing.xs,
    alignSelf: 'flex-start',
    backgroundColor: Colors.primaryLight + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.pill,
  },
  askSageText: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '600',
  },

  // ── Portrait Generation ──
  portraitGenerateCard: {
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.xs,
    ...Shadows.elevated,
  },
  portraitGenerateTitle: {
    fontSize: FontSizes.headingM,
    fontWeight: '700',
    fontFamily: FontFamilies.heading,
    color: Colors.white,
  },
  portraitGenerateSubtitle: {
    fontSize: FontSizes.bodySmall,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
  },

  // ── Portrait View ──
  portraitViewCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.md,
    ...Shadows.card,
  },
  portraitViewContent: {
    gap: 2,
  },
  portraitViewTitle: {
    fontSize: FontSizes.body,
    fontWeight: '700',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
  },
  portraitViewSubtitle: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
  },
  portraitScoresPreview: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  previewScore: {
    alignItems: 'center',
    gap: 2,
  },
  previewScoreValue: {
    fontSize: FontSizes.headingM,
    fontWeight: '700',
    color: Colors.primary,
  },
  previewScoreLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  previewScoreDivider: {
    width: 1,
    height: 28,
    backgroundColor: Colors.borderLight,
  },
  regenerateRow: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  regenerateText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.primary,
    fontWeight: '600',
  },

  // ── Next Assessment ──
  nextAssessmentCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.primaryLight + '40',
    ...Shadows.card,
  },
  nextAssessmentContent: {
    gap: Spacing.xs,
  },
  nextAssessmentBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.pill,
    marginBottom: Spacing.xs,
  },
  nextAssessmentBadgeText: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  nextAssessmentTitle: {
    fontSize: FontSizes.body,
    fontWeight: '700',
    color: Colors.text,
    fontFamily: FontFamilies.heading,
  },
  nextAssessmentDescription: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  nextAssessmentMeta: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  nextAssessmentArrow: {
    marginTop: Spacing.md,
    alignSelf: 'flex-end',
  },
  nextAssessmentArrowText: {
    fontSize: FontSizes.body,
    color: Colors.primary,
    fontWeight: '700',
  },

  // ── Sage Coach Card ──
  sageCard: {
    backgroundColor: Colors.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Shadows.elevated,
  },
  sageCardLocked: {
    opacity: 0.6,
  },
  sageCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Spacing.md,
  },
  sageIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sageIcon: {
    fontSize: 22,
  },
  sageTextContainer: {
    flex: 1,
  },
  sageTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  sageCardTitle: {
    fontSize: FontSizes.body,
    fontWeight: '700',
    color: Colors.white,
    fontFamily: FontFamilies.heading,
  },
  lockIcon: {
    fontSize: 14,
  },
  sageCardSubtitle: {
    fontSize: FontSizes.caption,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  sageArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sageArrowText: {
    fontSize: 18,
    color: Colors.white,
    fontWeight: '600',
  },
  lockedHint: {
    fontSize: FontSizes.caption,
    color: Colors.warning,
    fontWeight: '500',
    marginTop: Spacing.xs,
    textAlign: 'center',
  },

  // ── Today's Practice ──
  practiceCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.secondary,
    ...Shadows.card,
  },
  practiceCardContent: {
    gap: Spacing.xs,
  },
  practiceCategoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.secondary + '15',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.pill,
  },
  practiceCategoryText: {
    fontSize: 11,
    color: Colors.secondary,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  practiceTitle: {
    fontSize: FontSizes.body,
    fontWeight: '700',
    color: Colors.text,
    fontFamily: FontFamilies.heading,
  },
  practiceDescription: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  practiceMeta: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    textTransform: 'capitalize',
  },

  // ── Feature Cards Grid ──
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  featureCard: {
    width: '48.5%' as any,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.xs,
    minHeight: 130,
    ...Shadows.card,
  },
  featureCardLocked: {
    opacity: 0.6,
  },
  featureCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featureCardIcon: {
    fontSize: 24,
  },
  featureCardLockIcon: {
    fontSize: 14,
  },
  featureCardTitle: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '700',
    color: Colors.text,
    marginTop: Spacing.xs,
  },
  featureCardSubtitle: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  featureCardHint: {
    fontSize: 10,
    color: Colors.warning,
    fontWeight: '600',
    marginTop: Spacing.xs,
  },

  // ── Assessments ──
  assessmentSummary: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  assessmentCards: {
    gap: Spacing.sm,
  },
  assessmentCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
    ...Shadows.subtle,
  },
  assessmentCardHeader: {
    gap: 4,
  },
  assessmentTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  assessmentShortName: {
    fontSize: FontSizes.caption,
    color: Colors.primary,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  assessmentName: {
    fontSize: FontSizes.body,
    fontWeight: '600',
    color: Colors.text,
  },
  assessmentDescription: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  assessmentMeta: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  assessmentActions: {
    gap: Spacing.xs,
  },
  progressNote: {
    fontSize: FontSizes.caption,
    color: Colors.warning,
    fontWeight: '600',
  },
  assessmentButton: {
    backgroundColor: Colors.primary,
    height: ButtonSizes.small,
    borderRadius: BorderRadius.pill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  assessmentButtonText: {
    color: Colors.white,
    fontSize: FontSizes.caption,
    fontWeight: '600',
  },
  assessmentButtonOutline: {
    borderWidth: 1,
    borderColor: Colors.primary,
    height: ButtonSizes.small,
    borderRadius: BorderRadius.pill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  assessmentButtonOutlineText: {
    color: Colors.primary,
    fontSize: FontSizes.caption,
    fontWeight: '600',
  },

  // ── Badges ──
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.pill,
  },
  badgeCompleted: {
    backgroundColor: '#DFF0E0',
  },
  badgeCompletedText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#2D5F34',
  },
  badgeInProgress: {
    backgroundColor: '#FDF3E0',
  },
  badgeInProgressText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#8B6914',
  },

  // ── Step Progress Dots ──
  stepDotsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  stepDotCompleted: {
    backgroundColor: Colors.primary,
  },
  stepDotActive: {
    backgroundColor: Colors.secondary,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  stepDotPending: {
    backgroundColor: Colors.border,
  },

  // ── Today's Focus ──
  todaysFocusSection: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  todaysFocusCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
    ...Shadows.card,
  },
  todaysFocusEyebrow: {
    fontSize: FontSizes.caption,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
  },
  todaysFocusTitle: {
    fontSize: FontSizes.headingM,
    fontWeight: '700',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
    marginBottom: Spacing.xs,
    lineHeight: 26,
  },
  todaysFocusMeta: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  todaysFocusButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.pill,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.lg,
    alignSelf: 'flex-start',
  },
  todaysFocusButtonText: {
    color: Colors.white,
    fontSize: FontSizes.bodySmall,
    fontWeight: '700',
  },

  // ── Growth Plan Section ──
  growthPlanSection: {
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.card,
  },
  growthPlanTitle: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '700' as const,
    color: Colors.secondary,
    textTransform: 'uppercase' as const,
    letterSpacing: 1.2,
    marginBottom: Spacing.xs,
  },
  growthPlanHeadline: {
    fontSize: FontSizes.headingM,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: Spacing.sm,
    lineHeight: 26,
  },
  growthPlanRationale: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  movementsRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-around' as const,
    alignItems: 'flex-end' as const,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.sm,
    height: 60,
  },
  movementItem: {
    alignItems: 'center' as const,
    flex: 1,
  },
  movementBarTrack: {
    width: 16,
    height: 40,
    backgroundColor: Colors.border,
    borderRadius: 8,
    overflow: 'hidden' as const,
    justifyContent: 'flex-end' as const,
    marginBottom: 4,
  },
  movementBarFill: {
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    width: '100%' as any,
  },
  movementLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '600' as const,
  },
  growthPlanPhases: {
    marginBottom: Spacing.md,
  },
  growthPlanPhaseRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: Spacing.sm,
  },
  growthPlanPhaseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.border,
    marginRight: Spacing.sm,
  },
  growthPlanPhaseDotActive: {
    backgroundColor: Colors.secondary,
  },
  growthPlanPhaseContent: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    flex: 1,
  },
  growthPlanPhaseName: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  growthPlanPhaseWeeks: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
  },
  growthPlanCta: {
    alignItems: 'center' as const,
    paddingVertical: Spacing.sm,
  },
  growthPlanCtaText: {
    fontSize: FontSizes.body,
    fontWeight: '600' as const,
    color: Colors.secondary,
  },

  // ── Streak Mini ──
  streakMiniSection: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
  },
  streakMiniText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
  },

  // ── Inspiration ──
  inspirationSection: {
    paddingHorizontal: Spacing.xl + Spacing.sm,
    marginBottom: Spacing.lg,
  },
  inspirationText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 22,
  },

  // ── Logout ──
  logoutButton: {
    marginHorizontal: Spacing.xl,
    alignItems: 'center',
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.pill,
    height: ButtonSizes.medium,
    justifyContent: 'center',
    marginTop: Spacing.sm,
  },
  logoutText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.bodySmall,
    fontWeight: '600',
  },
});
