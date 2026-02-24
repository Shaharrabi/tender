/**
 * Home Screen — Wellness Journal Hub
 *
 * Designed with "one clear action" philosophy from top wellness apps.
 * Answers: "What should I do RIGHT NOW?" — not a menu, a recommendation.
 *
 * Layout (top to bottom):
 * 1. Greeting + Journey Context — name, step, progress dots
 * 2. Today's Focus — ONE clear action (practice or Nuance)
 * 3. Daily Check-In — collapsed habit tracker
 * 4. Your Journey — progress bar + next assessment integrated
 * 5. Streak — small, celebratory, not guilt-inducing
 * 6. Inspiration — rotating quote or nudge carousel
 * 7. Explore — feature grid (Portrait, Nuance, Growth, etc.)
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
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/context/AuthContext';
import { useGuest } from '@/context/GuestContext';
import { useGamification } from '@/context/GamificationContext';
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
import { getPortrait, savePortrait, fetchAllScores, extractSupplementScores } from '@/services/portrait';
import { generatePortrait } from '@/utils/portrait/portrait-generator';
import { getTodaysCheckIn, saveDailyCheckIn } from '@/services/growth';
import { getMyCouple, checkDyadicCompletion, isSelfCouple } from '@/services/couples';
import { getAllExercises, getExerciseById } from '@/utils/interventions/registry';
import { getCompletions } from '@/services/intervention';
import { calculateGrowthProgress } from '@/utils/steps/intervention-protocols';
import CheckInCard from '@/components/growth/CheckInCard';
import NudgeCarousel from '@/components/NudgeCarousel';
import HomeNotificationLayer from '@/components/notifications/HomeNotificationLayer';
import { getNudges } from '@/utils/nudges';
import { getUserConsent } from '@/services/consent';
import { recordDailyEngagement, getStreakData, type StreakData } from '@/services/streaks';
import { SoundHaptics } from '@/services/SoundHapticsService';
import { XPProgressBar } from '@/components/gamification/XPProgressBar';
import StreakBanner from '@/components/StreakBanner';
import { useFirstTime } from '@/context/FirstTimeContext';
import AdminPanel from '@/components/admin/AdminPanel';
import LockedPortraitPreview from '@/components/portrait/LockedPortraitPreview';
import { HighlightWrapper } from '@/components/ui/HighlightWrapper';
import { TooltipManager } from '@/components/ftue/TooltipManager';
import { GuidedTour } from '@/components/ftue/GuidedTour';
import { WelcomeAudio } from '@/components/ftue/WelcomeAudio';
import { TOOLTIP_CONFIGS } from '@/constants/ftue/tooltips';
import { HOME_TOUR } from '@/constants/ftue/tourSteps';
import { RefRegistry } from '@/utils/ftue/refRegistry';
import JourneyUnlockOverlay, { hasSeenJourneyUnlock } from '@/components/growth/JourneyUnlockOverlay';
import { getCurrentStepNumber } from '@/services/steps';
import { getTaglineForStep, getPracticesForStep, getStep } from '@/utils/steps/twelve-steps';
import { MICRO_COURSES, calculateCourseProgress, type CourseProgress } from '@/utils/microcourses/course-registry';
import { getCompletions as getMicroCourseCompletions } from '@/services/intervention';
import MicroCourseCard from '@/components/microcourse/MicroCourseCard';
import { TENDER_SECTIONS, TOTAL_QUESTIONS, TOTAL_ESTIMATED_MINUTES } from '@/utils/assessments/tender-sections';
import {
  Colors,
  Spacing,
  FontSizes,
  ButtonSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import {
  SunIcon,
  MoonIcon,
  SeedlingIcon,
  LeafIcon,
  SearchIcon,
  SparkleIcon,
  BookOpenIcon,
  LockIcon,
  HeartDoubleIcon,
  FireIcon,
  ChatBubbleIcon,
  TargetIcon,
  ClipboardIcon,
  HandshakeIcon,
  CoupleIcon,
  BrainIcon,
  MasksIcon,
  ScaleIcon,
  CompassIcon,
  ShieldIcon,
} from '@/assets/graphics/icons';
import type { ComponentType } from 'react';
import type { IconProps } from '@/assets/graphics/icons';
import type { AssessmentConfig, AllAssessmentScores, AssessmentType } from '@/types';
import type { IndividualPortrait } from '@/types/portrait';
import type { WEAREProfile } from '@/types/weare';
import type { DailyCheckIn } from '@/types/growth';
import type { Couple } from '@/types/couples';
import { getLatestWEAREProfile } from '@/services/weare';
import { getRelationshipModeLabel, DEMO_PARTNERS, type DemoPartnerId } from '@/constants/demoPartners';

// ─── Types ──────────────────────────────────────────────

interface CardStatus {
  state: 'not_started' | 'in_progress' | 'completed';
  progressQuestion?: number;
  totalQuestions?: number;
  completedAt?: string;
}

// ─── Helpers ────────────────────────────────────────────

function getTimeGreeting(): { greeting: string; icon: 'sun' | 'sunAfternoon' | 'moon' } {
  const hour = new Date().getHours();
  if (hour < 12) return { greeting: 'Good morning', icon: 'sun' };
  if (hour < 17) return { greeting: 'Good afternoon', icon: 'sunAfternoon' };
  return { greeting: 'Good evening', icon: 'moon' };
}

function TimeGreetingIcon({ iconName, size = 22 }: { iconName: 'sun' | 'sunAfternoon' | 'moon'; size?: number }) {
  switch (iconName) {
    case 'sun': return <SunIcon size={size} color={Colors.text} />;
    case 'sunAfternoon': return <SunIcon size={size} color={Colors.text} />;
    case 'moon': return <MoonIcon size={size} color={Colors.text} />;
  }
}

/** Renders a FeatureCard icon — now directly a ComponentType<IconProps> from FEATURE_CARDS */
function FeatureIcon({ Icon, size = 22, color = Colors.text }: { Icon: ComponentType<IconProps>; size?: number; color?: string }) {
  return <Icon size={size} color={color} />;
}

const DAILY_GREETINGS = [
  "How are you and your partner doing today?",
  "Every small step strengthens your bond.",
  "You're investing in what matters most.",
  "Welcome back to your growth journey.",
  "Today is another chance to connect.",
  "Your relationship deserves this time.",
  "Let's continue where you left off.",
  "Presence is the first practice. Everything else follows.",
  "The space between you is alive. It changes when you do.",
  "What kind of partner do you want to be today?",
  "Regulate before you reason.",
  "You keep showing up. That rhythm changes everything.",
  "Vulnerability is not weakness. It is the birthplace of connection.",
  "Small, consistent practice changes everything.",
];

// ─── Component ──────────────────────────────────────────

export default function HomeScreen() {
  const { user, signOut } = useAuth();
  const { isGuest, clearGuestData } = useGuest();
  const { awardXP: awardGamificationXP } = useGamification();
  const { state: ftueState, loading: ftueLoading, markTourCompleted, markFirstLaunchComplete, markAllTooltipsSeen } = useFirstTime();
  const router = useRouter();
  const [showTour, setShowTour] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const scrollOffset = useRef(0);

  // Assessment state
  const [statuses, setStatuses] = useState<Record<string, CardStatus>>({});
  const [completedTypes, setCompletedTypes] = useState<AssessmentType[]>([]);
  const [assessmentScores, setAssessmentScores] = useState<Record<string, any>>({});
  const [assessmentsExpanded, setAssessmentsExpanded] = useState(false);

  // Tender Assessment unified flow state
  const [tenderStatus, setTenderStatus] = useState<{
    state: 'not_started' | 'in_progress' | 'completed';
    completedSections: number;
    completedTypes: string[];          // which specific section types are done
    totalAnswered: number;
    currentSectionName?: string;
  }>({ state: 'not_started', completedSections: 0, completedTypes: [], totalAnswered: 0 });

  // Portrait state
  const [portrait, setPortrait] = useState<IndividualPortrait | null>(null);
  const [generating, setGenerating] = useState(false);

  // Exercise completion tracking for growth plan
  const [exerciseCompletionMap, setExerciseCompletionMap] = useState<Record<string, number>>({});

  // Check-in state
  const [todaysCheckIn, setTodaysCheckIn] = useState<DailyCheckIn | null>(null);

  // Couple state
  const [couple, setCouple] = useState<Couple | null>(null);
  const [dyadicAllDone, setDyadicAllDone] = useState(false);

  // Consent state
  const [consentGiven, setConsentGiven] = useState(false);

  // WEARE profile state (Phase 4)
  const [weareProfile, setWeareProfile] = useState<WEAREProfile | null>(null);

  // Unlock state
  const [unlockState, setUnlockState] = useState<UnlockState | null>(null);

  // Streak state
  const [streakData, setStreakData] = useState<StreakData | null>(null);

  // Step state
  const [currentStepNum, setCurrentStepNum] = useState<number>(1);
  const [stepTagline, setStepTagline] = useState<string>('');

  // Micro-course state
  const [activeCourse, setActiveCourse] = useState<{
    courseId: string;
    progress: CourseProgress;
  } | null>(null);

  // Display name + relationship mode from user_profiles
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [relationshipMode, setRelationshipMode] = useState<string>('solo');
  const [demoPartnerId, setDemoPartnerId] = useState<string | null>(null);
  const [onboardedAsPartner, setOnboardedAsPartner] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  // Admin mode
  const [adminMode, setAdminMode] = useState(false);
  const adminTapRef = useRef<{ count: number; lastTap: number }>({ count: 0, lastTap: 0 });

  // Journey unlock celebration
  const [showJourneyUnlock, setShowJourneyUnlock] = useState(false);

  // Loading
  const [loading, setLoading] = useState(true);

  // Locked card hint
  const [lockedHintKey, setLockedHintKey] = useState<string | null>(null);

  // Progress bar animation
  const progressAnim = useRef(new Animated.Value(0)).current;

  // ─── Load everything on focus ──────────────────────────

  const loadData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);

    try {
      // Local var to track relationship mode across loadData steps
      let userRelMode = 'solo';

      // 0a. Clear any legacy demo mode flag
      await AsyncStorage.removeItem('demo_mode').catch(() => {});

      // 0b. Load display name + relationship mode from user_profiles
      try {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('display_name, relationship_mode, demo_partner_id, relationship_status, onboarding_completed_at')
          .eq('user_id', user.id)
          .single();
        if (profile?.onboarding_completed_at) {
          setHasCompletedOnboarding(true);
        }
        if (profile?.relationship_mode) {
          userRelMode = profile.relationship_mode;
          setRelationshipMode(profile.relationship_mode);
        }
        if (profile?.demo_partner_id) {
          setDemoPartnerId(profile.demo_partner_id);
        }
        // Users who onboarded as "in-relationship" can never access Dating Well
        if (profile?.relationship_status === 'in-relationship') {
          setOnboardedAsPartner(true);
        }
        if (profile?.display_name) {
          setDisplayName(profile.display_name);
        } else {
          // Fallback: check if name was stashed during registration but never saved
          try {
            const stashedName = await AsyncStorage.getItem('pending_display_name');
            if (stashedName) {
              setDisplayName(stashedName);
              // Try to save it to user_profiles now
              await supabase
                .from('user_profiles')
                .upsert(
                  { user_id: user.id, display_name: stashedName },
                  { onConflict: 'user_id' }
                );
              await AsyncStorage.removeItem('pending_display_name').catch(() => {});
              console.log('[Home] Recovered display name from AsyncStorage:', stashedName);
            }
          } catch {
            // Non-blocking
          }
        }
      } catch {
        // Fall back to email-based name
      }

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
            // Check user-scoped key first, then fall back to legacy un-scoped key
            const scopedKey = user ? `${config.progressKey}_${user.id}` : config.progressKey;
            let saved = await AsyncStorage.getItem(scopedKey);
            if (!saved) {
              saved = await AsyncStorage.getItem(config.progressKey);
            }
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

      // Compute Tender Assessment status.
      // Supabase is the single source of truth for completed sections.
      // AsyncStorage is only used for in-progress question counts.
      const individualTypes = TENDER_SECTIONS.map((s) => s.assessmentType);
      const doneIndividual = individualTypes.filter((t) => !!completionMap[t]);
      if (doneIndividual.length === individualTypes.length) {
        setTenderStatus({
          state: 'completed',
          completedSections: individualTypes.length,
          completedTypes: doneIndividual,
          totalAnswered: TOTAL_QUESTIONS,
        });
      } else {
        // Use Supabase count as the authoritative completed-sections count.
        // Only check AsyncStorage for in-progress question detail.
        let totalAns = 0;
        let currentSecName: string | undefined;
        try {
          const tenderSaved = await AsyncStorage.getItem('tender_assessment_progress');
          if (tenderSaved) {
            const tData = JSON.parse(tenderSaved);
            if (tData.sectionStates) {
              for (const ss of tData.sectionStates) {
                totalAns += (ss.responses || []).filter(
                  (r: any) => r !== null && r !== '' && r !== undefined,
                ).length;
                totalAns += (ss.supplementResponses || []).filter(
                  (r: any) => r !== null && r !== '' && r !== undefined,
                ).length;
              }
            }
            const currentSecIdx = tData.currentSectionIndex || 0;
            currentSecName = TENDER_SECTIONS[currentSecIdx]?.fieldName;
          }
        } catch {}

        // Find the first incomplete section for the label
        if (!currentSecName && doneIndividual.length > 0) {
          const firstIncomplete = TENDER_SECTIONS.find(
            (s) => !completionMap[s.assessmentType],
          );
          currentSecName = firstIncomplete?.fieldName;
        }

        setTenderStatus({
          state: doneIndividual.length > 0 || totalAns > 0 ? 'in_progress' : 'not_started',
          completedSections: doneIndividual.length,
          completedTypes: doneIndividual,
          totalAnswered: totalAns,
          currentSectionName: currentSecName,
        });
      }

      // 2. Load portrait (and auto-regenerate if stale)
      let loadedPortrait: IndividualPortrait | null = null;
      try {
        loadedPortrait = await getPortrait(user.id);

        // Auto-regenerate portrait if assessments have been updated
        if (loadedPortrait && completedAssessmentTypes.length >= 6) {
          const latestScoresMap = await fetchAllScores(user.id);
          const currentIds = new Set(Object.values(latestScoresMap).map((r) => r.id));
          const portraitIds = new Set(loadedPortrait.assessmentIds || []);
          const isStale = [...currentIds].some((id) => !portraitIds.has(id));

          if (isStale) {
            console.log('[Home] Portrait is stale — auto-regenerating...');
            try {
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
              loadedPortrait = saved;
              console.log('[Home] Portrait auto-regenerated successfully');
            } catch (regenErr) {
              console.error('[Home] Auto-regeneration failed:', regenErr);
              // Keep the old portrait rather than showing nothing
            }
          }
        }

        // Auto-generate portrait if all assessments complete but no portrait yet
        if (!loadedPortrait && completedAssessmentTypes.length >= 6) {
          console.log('[Home] All assessments complete, no portrait — auto-generating...');
          try {
            const latestScoresMap = await fetchAllScores(user.id);
            console.log('[Home] Fetched scores for types:', Object.keys(latestScoresMap));

            // Verify all 6 types are present
            const required = ['ecr-r', 'dutch', 'sseit', 'dsi-r', 'ipip-neo-120', 'values'];
            const missing = required.filter((t) => !latestScoresMap[t]);
            if (missing.length > 0) {
              console.warn('[Home] Missing assessment scores for:', missing);
            } else {
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
              console.log('[Home] Generating portrait with', ids.length, 'assessments, supplements:', !!supplements);
              const freshPortrait = generatePortrait(user.id, ids, scores, supplements);
              console.log('[Home] Portrait generated, saving...');
              const saved = await savePortrait(freshPortrait);
              loadedPortrait = saved;
              console.log('[Home] Portrait auto-generated successfully');
            }
          } catch (genErr: any) {
            console.error('[Home] Auto-generation failed:', genErr?.message || genErr);
            console.error('[Home] Error details:', JSON.stringify(genErr, null, 2));
          }
        }

        setPortrait(loadedPortrait);
      } catch (portraitErr) {
        console.error('[Home] Portrait loading failed:', portraitErr);
        setPortrait(null);
      }

      // 3. Load couple + dyadic status
      let loadedCouple: Couple | null = null;
      try {
        loadedCouple = await getMyCouple(user.id);
        // For real_partner mode, self-couples (partner_a === partner_b) are not real couples
        if (loadedCouple && isSelfCouple(loadedCouple) && userRelMode === 'real_partner') {
          loadedCouple = null;
        }
        setCouple(loadedCouple);
        if (loadedCouple) {
          const dyadicStatus = await checkDyadicCompletion(loadedCouple.id, user.id);
          setDyadicAllDone(dyadicStatus.allDone);
        } else {
          setDyadicAllDone(false);
        }
      } catch {
        setCouple(null);
        setDyadicAllDone(false);
      }

      // 3b. Load consent status
      try {
        const consent = await getUserConsent(user.id);
        setConsentGiven(!!consent);
      } catch {
        setConsentGiven(false);
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

      // Show Journey Unlock celebration on first visit after first assessment
      if (unlock.healingJourney && completedAssessmentTypes.length >= 1) {
        const seen = await hasSeenJourneyUnlock();
        if (!seen) {
          setShowJourneyUnlock(true);
        }
      }

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

      // 8. Load WEARE profile if couple exists
      if (loadedCouple) {
        try {
          const wp = await getLatestWEAREProfile(loadedCouple.id);
          setWeareProfile(wp);
        } catch {
          setWeareProfile(null);
        }
      }

      // 9. Load micro-course progress (find active/in-progress course)
      try {
        const completions = await getMicroCourseCompletions(user.id, 200);
        const completedLessonIds = new Set(completions.map((c) => c.exerciseId));

        // Find the first course that's started but not complete, or first unlocked
        for (const course of MICRO_COURSES) {
          const courseLessons = Array.from({ length: course.totalLessons }, (_, i) =>
            `${course.id}-lesson-${i + 1}`
          );
          const lessonsCompleted = courseLessons.filter((id) => completedLessonIds.has(id)).length;

          if (lessonsCompleted > 0 && lessonsCompleted < course.totalLessons) {
            setActiveCourse({
              courseId: course.id,
              progress: {
                courseId: course.id,
                lessonsCompleted,
                totalLessons: course.totalLessons,
                currentLesson: lessonsCompleted,
              },
            });
            break;
          }
        }
      } catch {
        setActiveCourse(null);
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      loadData();
      // Also fetch exercise completions for growth plan done states
      if (user) {
        getCompletions(user.id, 500)
          .then((completions) => {
            const map: Record<string, number> = {};
            for (const c of completions) {
              map[c.exerciseId] = (map[c.exerciseId] ?? 0) + 1;
            }
            setExerciseCompletionMap(map);
          })
          .catch(() => {});
      }
    }, [loadData, user])
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

  // Show guided tour on first launch (works for both guests and auth users)
  // Must wait for BOTH home data AND FTUE state to load from AsyncStorage,
  // otherwise isFirstLaunch defaults to true and triggers for returning users.
  // Extra guard: if the user has completed ANY assessments, they are definitely
  // NOT first-time — skip the tour even if AsyncStorage lost the flag.
  // hasShownTourRef prevents re-triggers from useFocusEffect loading cycles.
  const hasShownTourRef = useRef(false);
  useEffect(() => {
    if (
      !loading &&
      !ftueLoading &&
      ftueState.isFirstLaunch &&
      !ftueState.completedTours.includes('tour_home') &&
      !hasShownTourRef.current
    ) {
      // If user already completed onboarding or any assessments, they're a
      // returning user whose FTUE flag was lost (e.g. web storage cleared).
      // Auto-complete tour AND all tooltips so they never replay.
      if (completedCount > 0 || hasCompletedOnboarding) {
        markTourCompleted('tour_home');
        markFirstLaunchComplete();
        // Mark all tooltips as seen to prevent bubbles replaying
        markAllTooltipsSeen(TOOLTIP_CONFIGS.map((t) => t.id));
        return;
      }
      // Small delay to let layout render before measuring
      hasShownTourRef.current = true;
      const timer = setTimeout(() => setShowTour(true), 800);
      return () => clearTimeout(timer);
    }
  }, [loading, ftueLoading, ftueState.isFirstLaunch, ftueState.completedTours, completedCount, hasCompletedOnboarding]);

  const handleTourComplete = useCallback(() => {
    setShowTour(false);
    markTourCompleted('tour_home');
    markFirstLaunchComplete();
  }, [markTourCompleted, markFirstLaunchComplete]);

  // Result cards — only show completed ones
  const resultCards = FEATURE_CARDS.filter(
    (card) =>
      card.category === 'result' && unlockState?.[card.key] === true
  );

  // Feature cards for the grid — ordered so tooltip targets (courses, community)
  // appear right after the fixed cards (journal, nuance) for natural top-to-bottom flow.
  const gridCardOrder = ['healingJourney', 'courses', 'community', 'practices', 'findTherapist', 'couplesPortal', 'datingWell', 'buildingBridges'];
  const gridCards = gridCardOrder
    .map((key) => FEATURE_CARDS.find((c) => c.key === key && (c.category === 'feature' || c.category === 'couple')))
    .filter((c): c is NonNullable<typeof c> => c != null)
    .filter((c) => {
      // Users who onboarded as partnered can NEVER see Dating Well, even if they
      // later change relationship mode. Single users see it when mode is 'solo'.
      if (c.key === 'datingWell' && (onboardedAsPartner || relationshipMode !== 'solo')) return false;
      if (c.key === 'couplesPortal' && relationshipMode === 'solo') return false;
      return true;
    });

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
      const supplements = extractSupplementScores(latest);
      const p = generatePortrait(user.id, ids, scores, supplements);
      const saved = await savePortrait(p);
      setPortrait(saved);
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
    try {
      const ci = await saveDailyCheckIn(
        user.id,
        mood,
        relationship,
        practiced,
        note
      );
      setTodaysCheckIn(ci);
      // Award XP for daily check-in (non-blocking)
      awardGamificationXP('daily_checkin').catch(() => {});
    } catch (err: any) {
      console.error('Check-in save failed:', err);
      Alert.alert(
        'Could not save check-in',
        'Please try again. If this keeps happening, try logging out and back in.',
      );
    }
  };

  const handleLogout = async () => {
    const configs = getAllAssessments();
    for (const config of configs) {
      // Clear both user-scoped and legacy un-scoped progress keys
      await AsyncStorage.removeItem(config.progressKey).catch(() => {});
      if (user) {
        await AsyncStorage.removeItem(`${config.progressKey}_${user.id}`).catch(() => {});
      }
    }
    // Clear tender assessment orchestrator progress (user-scoped + legacy key)
    if (user) {
      await AsyncStorage.removeItem(`tender_assessment_progress_${user.id}`).catch(() => {});
    }
    await AsyncStorage.removeItem('tender_assessment_progress').catch(() => {});
    // Clear demo mode flag
    await AsyncStorage.removeItem('demo_mode').catch(() => {});
    // Clear guest mode data so it doesn't persist across sessions
    await clearGuestData();
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

  // ─── Admin Mode ────────────────────────────────────────

  const handleTaglineTripleTap = () => {
    const now = Date.now();
    const tap = adminTapRef.current;
    if (now - tap.lastTap < 800) {
      tap.count += 1;
    } else {
      tap.count = 1;
    }
    tap.lastTap = now;

    if (tap.count >= 3) {
      tap.count = 0;
      setAdminMode((prev) => !prev);
    }
  };

  // Demo mode removed — no longer needed

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
      {/* Journey Unlock Celebration */}
      {showJourneyUnlock && (
        <JourneyUnlockOverlay
          onDismiss={() => setShowJourneyUnlock(false)}
          onExploreJourney={() => {
            setShowJourneyUnlock(false);
            router.push('/(app)/growth' as any);
          }}
        />
      )}

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        onScroll={(e) => { scrollOffset.current = e.nativeEvent.contentOffset.y; }}
        scrollEventThrottle={16}
      >
        {/* ═══ 1. GREETING + JOURNEY CONTEXT ═══════════════════ */}
        <View style={styles.heroSection}>
          <View style={styles.heroBackground}>
            {(() => {
              const { greeting, icon } = getTimeGreeting();
              const emailFallback = user?.email?.split('@')[0]?.replace(/[._-]/g, ' ')?.split(' ')[0] || '';
              const capitalFallback = emailFallback.charAt(0).toUpperCase() + emailFallback.slice(1);
              const capitalName = displayName || capitalFallback;
              return (
                <>
                  <Text style={styles.heroTagline}>
                    {greeting}, {capitalName}{' '}
                    <View style={styles.inlineIconWrapper}>
                      <TimeGreetingIcon iconName={icon} size={22} />
                    </View>
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
                  <Text
                    style={styles.heroAppTagline}
                    onPress={handleTaglineTripleTap}
                    suppressHighlighting
                  >
                    The Science of Relationships
                  </Text>
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

          {/* Demo mode removed — no longer needed */}
        </View>

        {/* ═══ ENGAGEMENT NOTIFICATIONS ═══════════════════════ */}
        <HomeNotificationLayer
          userId={user?.id}
          weareBottleneck={weareProfile?.bottleneck?.variable}
          dayNumber={Math.max(streakData?.totalDays ?? 1, 1)}
        />

        {/* ═══ XP & LEVEL PROGRESS ═══════════════════════════ */}
        {!isGuest && (
          <View
            style={{ paddingHorizontal: Spacing.lg, marginBottom: Spacing.sm }}
          >
            <XPProgressBar />
          </View>
        )}

        {/* ═══ ADMIN PANEL (hidden until triple-tap) ══════════ */}
        {adminMode && user && (
          <AdminPanel
            userId={user.id}
            onDataChanged={loadData}
            onClose={() => setAdminMode(false)}
          />
        )}

        {/* ═══ 2. TODAY'S FOCUS — removed to reduce home screen clutter ═══ */}

        {/* ═══ DEMO PARTNER CARD (shown when mode is demo_partner) ═══ */}
        {relationshipMode === 'demo_partner' && demoPartnerId && DEMO_PARTNERS[demoPartnerId as DemoPartnerId] && (
          <View style={styles.demoPartnerSection}>
            <TouchableOpacity
              style={styles.demoPartnerCard}
              onPress={() => router.push('/(app)/chat' as any)}
              activeOpacity={0.8}
            >
              <View style={styles.demoPartnerInfo}>
                <View style={[
                  styles.demoPartnerAvatar,
                  { backgroundColor: DEMO_PARTNERS[demoPartnerId as DemoPartnerId].color + '20' },
                ]}>
                  <CoupleIcon size={20} color={DEMO_PARTNERS[demoPartnerId as DemoPartnerId].color} />
                </View>
                <View style={styles.demoPartnerTextWrap}>
                  <Text style={styles.demoPartnerName}>
                    Practice with {DEMO_PARTNERS[demoPartnerId as DemoPartnerId].name}
                  </Text>
                  <Text style={styles.demoPartnerStyle}>
                    {DEMO_PARTNERS[demoPartnerId as DemoPartnerId].shortDescription}
                  </Text>
                </View>
              </View>
              <Text style={styles.demoPartnerCta}>Start {'\u2192'}</Text>
            </TouchableOpacity>
          </View>
        )}
        {relationshipMode === 'solo' && !hasPortrait && completedCount > 0 && (
          <TouchableOpacity
            style={styles.demoPartnerPrompt}
            onPress={() => router.push('/(app)/relationship-mode' as any)}
            activeOpacity={0.7}
          >
            <CoupleIcon size={16} color={Colors.primary} />
            <Text style={styles.demoPartnerPromptText}>
              Want to practice with an AI partner?
            </Text>
          </TouchableOpacity>
        )}
        {/* ═══ CONSENT BANNER (all 6 assessments done, no consent yet) ═══ */}
        {completedCount >= 6 && !consentGiven && (
          <TouchableOpacity
            style={styles.consentBanner}
            onPress={() => router.push('/(app)/consent-waiver' as any)}
            activeOpacity={0.7}
          >
            <ShieldIcon size={20} color={Colors.primary} />
            <View style={styles.consentBannerContent}>
              <Text style={styles.consentBannerTitle}>All Assessments Complete!</Text>
              <Text style={styles.consentBannerDesc}>
                Review your data choices before viewing your portrait.
              </Text>
            </View>
            <Text style={styles.realPartnerPromptArrow}>{'\u2192'}</Text>
          </TouchableOpacity>
        )}

        {/* Real partner mode — connect prompt */}
        {relationshipMode === 'real_partner' && !couple && (
          <TouchableOpacity
            style={styles.realPartnerPrompt}
            onPress={() => router.push('/(app)/partner' as any)}
            activeOpacity={0.7}
          >
            <HeartDoubleIcon size={18} color={Colors.secondary} />
            <View style={styles.realPartnerPromptContent}>
              <Text style={styles.realPartnerPromptTitle}>Connect With Your Partner</Text>
              <Text style={styles.realPartnerPromptDesc}>
                Create an invite code or enter your partner's code to begin your journey together.
              </Text>
            </View>
            <Text style={styles.realPartnerPromptArrow}>{'\u2192'}</Text>
          </TouchableOpacity>
        )}
        {/* Couple portal ready nudge */}
        {couple && dyadicAllDone && consentGiven && (
          <TouchableOpacity
            style={styles.couplePortalReadyBanner}
            onPress={() => router.push('/(app)/couple-portal' as any)}
            activeOpacity={0.7}
          >
            <SparkleIcon size={18} color={Colors.secondary} />
            <Text style={styles.couplePortalReadyText}>
              Your couple portrait is ready — enter the portal
            </Text>
            <Text style={styles.realPartnerPromptArrow}>{'\u2192'}</Text>
          </TouchableOpacity>
        )}

        {/* ═══ 3. DAILY CHECK-IN (Collapsed by default) ═══════ */}
        {hasPortrait && (
          <View style={styles.section}>
            <CheckInCard
              todaysCheckIn={todaysCheckIn}
              onSubmit={handleCheckInSubmit}
            />
          </View>
        )}

        {/* ═══ JOURNEY VALUE MAP (first-time users) ═══════════ */}
        {completedCount === 0 && !hasPortrait && (
          <View style={styles.journeyMapCard}>
            <Text style={styles.journeyMapTitle}>Your Journey Ahead</Text>
            <View style={styles.journeyStepsColumn}>
              {[
                { num: '1', name: 'Discover', desc: '6 sections exploring how you connect, feel, and fight' },
                { num: '2', name: 'Portrait', desc: 'A complete relational profile synthesizing all your results' },
                { num: '3', name: 'Growth Plan', desc: 'Personalized pathways based on your unique patterns' },
                { num: '4', name: 'Practice', desc: 'Guided exercises, micro-courses, and AI coaching' },
                { num: '5', name: 'Progress', desc: 'Track your growth with milestones and insights' },
              ].map((step) => (
                <View key={step.num} style={styles.journeyStepRow}>
                  <View style={styles.journeyStepNumber}>
                    <Text style={styles.journeyStepNumberText}>{step.num}</Text>
                  </View>
                  <View style={styles.journeyStepContent}>
                    <Text style={styles.journeyStepName}>{step.name}</Text>
                    <Text style={styles.journeyStepDesc}>{step.desc}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ═══ 4. YOUR JOURNEY — The Tender Assessment ════════ */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>YOUR JOURNEY</Text>
            <Text style={styles.progressCount}>
              {tenderStatus.completedSections} of {TENDER_SECTIONS.length} sections complete
            </Text>
          </View>

          {/* Section progress segments */}
          <View style={styles.tenderSegmentBar}>
            {TENDER_SECTIONS.map((sec) => (
              <View
                key={sec.assessmentType}
                style={[
                  styles.tenderSegment,
                  tenderStatus.completedTypes.includes(sec.assessmentType) && styles.tenderSegmentDone,
                ]}
              />
            ))}
          </View>

          {/* Tender Assessment card */}
          {tenderStatus.state !== 'completed' && (
            <HighlightWrapper highlightId="home_assessment_cta">
            <View
              ref={(r) => RefRegistry.register('home_assessmentCta', r)}
              style={styles.tenderCard}
            >
              {tenderStatus.state === 'not_started' && (
                <>
                  <Text style={styles.tenderCardTitle}>The Tender Assessment</Text>
                  <Text style={styles.tenderCardDescription}>
                    6 sections covering how you connect, feel, fight, and what matters to you.
                    Take breaks between sections and come back anytime.
                  </Text>
                  <Text style={styles.tenderCardMeta}>
                    {TOTAL_QUESTIONS} questions {'\u00B7'} ~{TOTAL_ESTIMATED_MINUTES} min {'\u00B7'} Save & exit anytime
                  </Text>
                  <TouchableOpacity
                    style={styles.tenderStartButton}
                    onPress={() => { SoundHaptics.tap(); router.push('/(app)/tender-assessment' as any); }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.tenderStartButtonText}>Start Assessment</Text>
                  </TouchableOpacity>
                </>
              )}

              {tenderStatus.state === 'in_progress' && (
                <>
                  <Text style={styles.tenderCardTitle}>The Tender Assessment</Text>
                  {tenderStatus.currentSectionName && (
                    <Text style={styles.tenderCurrentSection}>
                      Next: {tenderStatus.currentSectionName}
                    </Text>
                  )}
                  <TouchableOpacity
                    style={styles.tenderStartButton}
                    onPress={() => { SoundHaptics.tap(); router.push('/(app)/tender-assessment' as any); }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.tenderStartButtonText}>Continue</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
            </HighlightWrapper>
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

        {/* ═══ 4A2. YOUR HEALING JOURNEY (after first assessment, before portrait) */}
        {completedCount >= 1 && !hasPortrait && (
          <TouchableOpacity
            style={styles.healingJourneyCard}
            onPress={() => { SoundHaptics.tapSoft(); router.push('/(app)/growth' as any); }}
            activeOpacity={0.8}
          >
            <View style={styles.healingJourneyHeader}>
              <SeedlingIcon size={28} color={Colors.primary} />
              <View style={styles.healingJourneyNewBadge}>
                <Text style={styles.healingJourneyNewBadgeText}>NEW</Text>
              </View>
            </View>
            <Text style={styles.healingJourneyTitle}>Your Healing Journey</Text>
            <Text style={styles.healingJourneySubtitle}>
              Twelve steps, daily practices, and your growth arc are ready to explore.
            </Text>
            <View style={styles.healingJourneyCta}>
              <Text style={styles.healingJourneyCtaText}>Begin Journey {'\u2192'}</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* ═══ 4A3. RELATIONAL SCORE TEASER (after first assessment, before portrait) */}
        {completedCount >= 1 && !hasPortrait && (
          <View style={styles.relationalScoreTeaser}>
            <View style={styles.relationalScoreTeaserHeader}>
              <Text style={styles.relationalScoreTeaserEyebrow}>COMING SOON</Text>
              <Text style={styles.relationalScoreTeaserTitle}>The Space Between You</Text>
            </View>
            <Text style={styles.relationalScoreTeaserBody}>
              Your relational score measures the health and vitality of your connection.
              Complete all 6 assessment sections to unlock your individual portrait, then
              invite your partner to build your shared Couple Portal.
            </Text>

            {/* Progress indicator */}
            <View style={styles.relationalScoreTeaserProgress}>
              <View style={styles.relationalScoreTeaserProgressTrack}>
                <View style={[
                  styles.relationalScoreTeaserProgressFill,
                  { width: `${(completedCount / 6) * 100}%` },
                ]} />
              </View>
              <Text style={styles.relationalScoreTeaserProgressLabel}>
                {completedCount} of 6 sections complete
              </Text>
            </View>

            {/* Couple Portal awareness */}
            <View style={styles.couplePortalTeaser}>
              <CoupleIcon size={18} color={Colors.secondary} />
              <Text style={styles.couplePortalTeaserText}>
                When both partners complete their portraits, the Couple Portal unlocks
                shared insights, couple assessments, and relational coaching.
              </Text>
            </View>
          </View>
        )}

        {/* ═══ 4B. YOUR PORTRAIT SUMMARY (if portrait exists) ══════ */}
        {hasPortrait && portrait && (() => {
          const cs = portrait.compositeScores;
          const scores = [cs.regulationScore, cs.windowWidth, cs.accessibility, cs.responsiveness, cs.engagement, cs.selfLeadership, cs.valuesCongruence];
          const overallScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

          // Find top strength
          const scoreLabels: Record<string, string> = {
            regulationScore: 'Regulation',
            windowWidth: 'Window of Tolerance',
            accessibility: 'Accessibility',
            responsiveness: 'Responsiveness',
            engagement: 'Engagement',
            selfLeadership: 'Self-Leadership',
            valuesCongruence: 'Values Alignment',
          };
          const topKey = (Object.keys(scoreLabels) as Array<keyof typeof cs>)
            .reduce((best, key) => (cs[key] > cs[best] ? key : best));
          const topStrength = scoreLabels[topKey];

          const cyclePosition = portrait.negativeCycle?.position
            ? portrait.negativeCycle.position.charAt(0).toUpperCase() + portrait.negativeCycle.position.slice(1)
            : null;
          const growthEdge = portrait.growthEdges?.[0]?.title;
          const coreValues = portrait.fourLens?.values?.coreValues?.slice(0, 3).join(', ');

          return (
            <TouchableOpacity
              style={styles.portraitSummaryCard}
              onPress={() => { SoundHaptics.tapSoft(); router.push('/(app)/portrait' as any); }}
              activeOpacity={0.8}
            >
              <View style={styles.portraitSummaryHeader}>
                <Text style={styles.portraitSummaryEyebrow}>YOUR PORTRAIT</Text>
                <View style={styles.portraitScoreBadge}>
                  <Text style={styles.portraitScoreBadgeText}>{overallScore}</Text>
                </View>
              </View>

              <View style={styles.portraitStatsRow}>
                {cyclePosition && (
                  <View style={styles.portraitStatItem}>
                    <Text style={styles.portraitStatLabel}>Cycle Position</Text>
                    <Text style={styles.portraitStatValue}>{cyclePosition}</Text>
                  </View>
                )}
                <View style={styles.portraitStatItem}>
                  <Text style={styles.portraitStatLabel}>Top Strength</Text>
                  <Text style={styles.portraitStatValue}>{topStrength}</Text>
                </View>
                {growthEdge && (
                  <View style={styles.portraitStatItem}>
                    <Text style={styles.portraitStatLabel}>Growth Edge</Text>
                    <Text style={styles.portraitStatValue} numberOfLines={1}>{growthEdge}</Text>
                  </View>
                )}
              </View>

              {coreValues ? (
                <Text style={styles.portraitValues}>
                  Core Values: {coreValues}
                </Text>
              ) : null}

              <Text style={styles.portraitCta}>
                See Full Portrait {'\u2192'}
              </Text>
            </TouchableOpacity>
          );
        })()}

        {/* ═══ 4b. WEARE SUMMARY (The Space Between You) ═══════ */}
        {weareProfile && couple && (
          <TouchableOpacity
            style={styles.weareSummaryCard}
            onPress={() => { SoundHaptics.tapSoft(); router.push('/(app)/couple-portal' as any); }}
            activeOpacity={0.8}
          >
            <View style={styles.weareSummaryHeader}>
              <Text style={styles.weareSummaryTitle}>
                The Space Between You
              </Text>
              {weareProfile.dataMode !== 'full' && (
                <View style={styles.weareModeBadge}>
                  <Text style={styles.weareModeBadgeText}>
                    {weareProfile.dataMode === 'single-partner' ? 'Partial' : 'Preview'}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.weareSummaryBody}>
              {/* Resonance Pulse Circle */}
              <View style={[
                styles.wearePulseCircle,
                weareProfile.layers.resonancePulse >= 60
                  ? { borderColor: Colors.primary }
                  : weareProfile.layers.resonancePulse >= 40
                    ? { borderColor: Colors.secondary }
                    : { borderColor: Colors.textMuted },
              ]}>
                {weareProfile.warmSummary === 'Deeply alive'
                  ? <SparkleIcon size={20} color={Colors.primary} />
                  : weareProfile.warmSummary === 'Growing stronger'
                    ? <SeedlingIcon size={20} color={Colors.primary} />
                    : weareProfile.warmSummary === 'Finding its way'
                      ? <SearchIcon size={20} color={Colors.textSecondary} />
                      : <LeafIcon size={20} color={Colors.textSecondary} />}
              </View>

              <View style={styles.weareSummaryContent}>
                <Text style={styles.weareSummaryPhrase}>
                  {weareProfile.warmSummary}
                </Text>

                {/* Direction indicator */}
                <Text style={styles.weareSummaryDirection}>
                  {weareProfile.layers.emergenceDirection > 1 ? 'Growing'
                    : weareProfile.layers.emergenceDirection < -1 ? 'Contracting'
                    : 'Steady'}
                  {weareProfile.trend ? ` \u00B7 ${weareProfile.trend.periodLabel}` : ''}
                </Text>

                {/* Bottleneck nudge */}
                <Text style={styles.weareSummaryNudge}>
                  Where the invitation is: {weareProfile.bottleneck.label}
                </Text>
              </View>
            </View>

            <Text style={styles.weareSummaryArrow}>
              See full picture {'\u2192'}
            </Text>
          </TouchableOpacity>
        )}

        {/* ═══ 5. STREAK (Small, celebratory) ═════════════════ */}
        {streakData && streakData.currentStreak > 0 && (
          <View style={styles.streakMiniSection}>
            <View style={styles.streakMiniRow}>
              <LeafIcon size={16} color={Colors.primary} />
              <Text style={styles.streakMiniText}>
                Day {streakData.currentStreak} {'\u00B7'} Keep going!
              </Text>
            </View>
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
        {!hasPortrait && completedCount > 0 && (
          <LockedPortraitPreview
            completedCount={completedCount}
            completedTypes={completedTypes}
          />
        )}
        {!hasPortrait && <NudgeCarousel insights={nudges} />}

        {/* ═══ 6b. MICRO-COURSE (Continue Course card) ═══════ */}
        {activeCourse && (() => {
          const course = MICRO_COURSES.find((c) => c.id === activeCourse.courseId);
          if (!course) return null;
          return (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Continue Your Course</Text>
              <MicroCourseCard
                course={course}
                progress={activeCourse.progress}
                isLocked={false}
                compact
                onPress={() =>
                  router.push({
                    pathname: '/(app)/microcourse',
                    params: {
                      courseId: course.id,
                      lessonNumber: String(activeCourse.progress.lessonsCompleted + 1),
                    },
                  } as any)
                }
              />
            </View>
          );
        })()}

        {/* ═══ 7. EXPLORE (Bottom section) ════════════════════ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Explore</Text>
          <View style={styles.featureGrid}>
            {/* View Portrait — always show if exists */}
            {hasPortrait && (
              <TouchableOpacity
                ref={(r) => RefRegistry.register('home_portraitCard', r)}
                style={styles.featureCard}
                onPress={() => { SoundHaptics.tapSoft(); router.push('/(app)/portrait' as any); }}
                activeOpacity={0.8}
              >
                <View style={styles.featureCardHeader}>
                  <SparkleIcon size={22} color={Colors.text} />
                </View>
                <Text style={styles.featureCardTitle}>View Portrait</Text>
                <Text style={styles.featureCardSubtitle} numberOfLines={2}>
                  Your relational portrait
                </Text>
              </TouchableOpacity>
            )}

            {/* Explore Matrix — gated on ECR-R completion */}
            {completedTypes.includes('ecr-r') && (
              <TouchableOpacity
                style={styles.featureCard}
                onPress={() => { SoundHaptics.tapSoft(); router.push('/(app)/assessment-matrix' as any); }}
                activeOpacity={0.8}
              >
                <View style={styles.featureCardHeader}>
                  <CompassIcon size={22} color={Colors.text} />
                </View>
                <Text style={styles.featureCardTitle}>Explore Matrix</Text>
                <Text style={styles.featureCardSubtitle} numberOfLines={2}>
                  Interactive assessment map
                </Text>
              </TouchableOpacity>
            )}

            {/* Journal — always unlocked */}
            <HighlightWrapper highlightId="home_journal_card">
            <TouchableOpacity
              ref={(r) => RefRegistry.register('home_journalCard', r)}
              style={styles.featureCard}
              onPress={() => { SoundHaptics.tapSoft(); router.push('/(app)/journal' as any); }}
              activeOpacity={0.8}
            >
              <View style={styles.featureCardHeader}>
                <BookOpenIcon size={22} color={Colors.text} />
              </View>
              <Text style={styles.featureCardTitle}>Journal</Text>
              <Text style={styles.featureCardSubtitle} numberOfLines={2}>
                Your relationship timeline
              </Text>
            </TouchableOpacity>
            </HighlightWrapper>

            {/* Nuance AI */}
            <TouchableOpacity
              ref={(r: any) => RefRegistry.register('home_nuanceCard', r)}
              style={[
                styles.featureCard,
                completedCount === 0 && styles.featureCardLocked,
              ]}
              onPress={() => {
                if (completedCount > 0) {
                  router.push('/(app)/chat' as any);
                } else {
                  setLockedHintKey('nuance');
                  setTimeout(() => setLockedHintKey(null), 2500);
                }
              }}
              activeOpacity={0.8}
            >
              <View style={styles.featureCardHeader}>
                <ChatBubbleIcon size={22} color={Colors.text} />
                {completedCount === 0 && (
                  <LockIcon size={14} color={Colors.textMuted} />
                )}
              </View>
              <Text style={styles.featureCardTitle}>Nuance AI</Text>
              <Text style={styles.featureCardSubtitle} numberOfLines={2}>
                Your relationship guide
              </Text>
              {lockedHintKey === 'nuance' && completedCount === 0 && (
                <Text style={styles.featureCardHint}>
                  Complete 1 assessment to start
                </Text>
              )}
            </TouchableOpacity>

            {/* Other feature cards */}
            {gridCards.map((card) => {
              const isUnlocked = unlockState?.[card.key] === true;
              // Register refs for FTUE tooltips (courses, community)
              const refKey = card.key === 'courses' ? 'home_coursesCard'
                : card.key === 'community' ? 'home_communityCard'
                : null;
              // Highlight IDs for post-tour gold pulse
              const highlightId = card.key === 'courses' ? 'home_courses_card'
                : card.key === 'community' ? 'home_community_card'
                : null;
              const cardContent = (
                <TouchableOpacity
                  key={card.key}
                  ref={refKey ? (r: any) => RefRegistry.register(refKey, r) : undefined}
                  style={[
                    styles.featureCard,
                    !isUnlocked && styles.featureCardLocked,
                  ]}
                  onPress={() => handleFeatureCardPress(card)}
                  activeOpacity={isUnlocked ? 0.8 : 0.6}
                >
                  <View style={styles.featureCardHeader}>
                    <FeatureIcon Icon={card.icon} size={22} color={Colors.text} />
                    {!isUnlocked && (
                      <LockIcon size={14} color={Colors.textMuted} />
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
              return highlightId ? (
                <HighlightWrapper key={card.key} highlightId={highlightId}>
                  {cardContent}
                </HighlightWrapper>
              ) : (
                <React.Fragment key={card.key}>{cardContent}</React.Fragment>
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
                    <FeatureIcon Icon={card.icon} size={20} color={card.color} />
                  </View>
                  <Text style={styles.resultTitle} numberOfLines={1}>
                    {card.title}
                  </Text>
                  <Text style={styles.resultSubtitle} numberOfLines={2}>
                    {card.subtitle}
                  </Text>
                  <TouchableOpacity
                    style={styles.askNuanceButton}
                    onPress={() => {
                      SoundHaptics.tapSoft();
                      router.push({ pathname: '/(app)/chat', params: { topic: card.title } } as any);
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.askNuanceContent}>
                      <ChatBubbleIcon size={11} color={Colors.primary} />
                      <Text style={styles.askNuanceText}>
                        Ask Nuance
                      </Text>
                    </View>
                  </TouchableOpacity>
                </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Revisit chapters (collapsed, shown when any section is complete) */}
        {tenderStatus.completedTypes.length > 0 && (
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.sectionTitleRow}
              onPress={() => setAssessmentsExpanded(!assessmentsExpanded)}
              activeOpacity={0.7}
            >
              <Text style={styles.retakeSectionLabel}>Revisit a Chapter</Text>
              <Text style={styles.expandArrow}>
                {assessmentsExpanded ? '\u25B4' : '\u25BE'}
              </Text>
            </TouchableOpacity>

            {assessmentsExpanded && (
              <View style={styles.assessmentCards}>
                <Text style={styles.retakeIntroText}>
                  Re-explore any chapter. Your patterns evolve {'\u2014'} so can your answers.
                </Text>
                {TENDER_SECTIONS.map((section) => {
                  const isDone = tenderStatus.completedTypes.includes(section.assessmentType);
                  const sectionIdx = TENDER_SECTIONS.findIndex((s) => s.assessmentType === section.assessmentType);
                  return (
                    <TouchableOpacity
                      key={section.assessmentType}
                      style={[styles.retakeRow, !isDone && styles.retakeRowDisabled]}
                      onPress={() => {
                        router.push({
                          pathname: '/(app)/tender-assessment',
                          params: { startSection: String(sectionIdx) },
                        } as any);
                      }}
                      activeOpacity={0.7}
                      disabled={!isDone}
                    >
                      <View style={styles.retakeRowLeft}>
                        <Text style={[styles.retakeRowNumber, !isDone && styles.retakeRowNumberDisabled]}>
                          {section.sectionNumber}
                        </Text>
                        <Text style={[styles.retakeRowName, !isDone && styles.retakeRowNameDisabled]}>
                          {section.fieldName}
                        </Text>
                      </View>
                      <Text style={[styles.retakeRowAction, !isDone && styles.retakeRowActionDisabled]}>
                        {isDone ? 'Revisit' : 'Not yet'}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        )}

        {/* ═══ Relationship Mode ════════════════════════════════ */}
        <View style={styles.modeSection}>
          <Text style={styles.modeSectionTitle}>Relationship Mode</Text>
          <View style={styles.modeCard}>
            <View style={styles.modeCardContent}>
              <Text style={styles.modeLabel}>{getRelationshipModeLabel(relationshipMode as any)}</Text>
              {relationshipMode === 'demo_partner' && demoPartnerId && DEMO_PARTNERS[demoPartnerId as DemoPartnerId] && (
                <Text style={styles.modePartnerName}>
                  Practicing with {DEMO_PARTNERS[demoPartnerId as DemoPartnerId].name}
                </Text>
              )}
            </View>
            <TouchableOpacity
              style={styles.modeChangeButton}
              onPress={() => router.push('/(app)/relationship-mode' as any)}
              activeOpacity={0.7}
            >
              <Text style={styles.modeChangeText}>Change</Text>
            </TouchableOpacity>
          </View>
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

      {/* ═══ FTUE Overlays ═══════════════════════════════════ */}
      {showTour && (
        <GuidedTour tour={HOME_TOUR} onComplete={handleTourComplete} />
      )}
      <TooltipManager screen="home" scrollRef={scrollRef} scrollOffset={scrollOffset} />
      <WelcomeAudio screenKey="home" />
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
  heroAppTagline: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    fontStyle: 'italic',
    marginTop: Spacing.sm,
    letterSpacing: 0.5,
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

  // Demo styles removed

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
  askNuanceButton: {
    marginTop: Spacing.xs,
    alignSelf: 'flex-start',
    backgroundColor: Colors.primaryLight + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.pill,
  },
  askNuanceText: {
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

  // ── Nuance Coach Card ──
  nuanceCard: {
    backgroundColor: Colors.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Shadows.elevated,
  },
  nuanceCardLocked: {
    opacity: 0.6,
  },
  nuanceCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Spacing.md,
  },
  nuanceIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nuanceIcon: {
    fontSize: 22,
  },
  nuanceTextContainer: {
    flex: 1,
  },
  nuanceTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  nuanceCardTitle: {
    fontSize: FontSizes.body,
    fontWeight: '700',
    color: Colors.white,
    fontFamily: FontFamilies.heading,
  },
  lockIcon: {
    fontSize: 14,
  },
  nuanceCardSubtitle: {
    fontSize: FontSizes.caption,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  nuanceArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nuanceArrowText: {
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

  // ── Tender Assessment Card ──
  tenderCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    gap: Spacing.md,
    ...Shadows.subtle,
  },
  tenderCardTitle: {
    fontSize: FontSizes.headingM,
    fontWeight: '600',
    color: Colors.text,
    fontFamily: FontFamilies.heading,
  },
  tenderCardDescription: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  tenderCardMeta: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
  },
  tenderStartButton: {
    backgroundColor: Colors.primary,
    height: ButtonSizes.medium,
    borderRadius: BorderRadius.pill,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  tenderStartButtonText: {
    color: Colors.white,
    fontSize: FontSizes.body,
    fontWeight: '600',
  },
  tenderViewButton: {
    borderWidth: 1,
    borderColor: Colors.primary,
    height: ButtonSizes.medium,
    borderRadius: BorderRadius.pill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tenderViewButtonText: {
    color: Colors.primary,
    fontSize: FontSizes.body,
    fontWeight: '600',
  },
  tenderProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tenderProgressLabel: {
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    fontWeight: '600',
  },
  tenderSegmentBar: {
    flexDirection: 'row',
    gap: 3,
    height: 6,
  },
  tenderSegment: {
    flex: 1,
    backgroundColor: Colors.border,
    borderRadius: 3,
  },
  tenderSegmentDone: {
    backgroundColor: Colors.success,
  },
  tenderCurrentSection: {
    fontSize: FontSizes.caption,
    color: Colors.primary,
    fontWeight: '500',
  },
  tenderCompleteEmoji: {
    fontSize: 32,
    color: Colors.success,
    fontWeight: '700',
    textAlign: 'center',
  },
  retakeSectionLabel: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  retakeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderLight,
  },
  retakeIntroText: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 18,
    marginBottom: Spacing.xs,
  },
  retakeRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  retakeRowNumber: {
    fontSize: FontSizes.caption,
    fontWeight: '700',
    color: Colors.primary,
    width: 20,
    textAlign: 'center',
  },
  retakeRowName: {
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    flex: 1,
  },
  retakeRowAction: {
    fontSize: FontSizes.bodySmall,
    color: Colors.primary,
    fontWeight: '600',
  },
  retakeRowDisabled: {
    opacity: 0.45,
  },
  retakeRowNumberDisabled: {
    color: Colors.textMuted,
  },
  retakeRowNameDisabled: {
    color: Colors.textMuted,
  },
  retakeRowActionDisabled: {
    color: Colors.textMuted,
    fontWeight: '400',
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

  // ── Portrait Summary Card ──
  portraitSummaryCard: {
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.card,
  },
  portraitSummaryHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: Spacing.sm,
  },
  portraitSummaryEyebrow: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '700' as const,
    color: Colors.secondary,
    textTransform: 'uppercase' as const,
    letterSpacing: 1.2,
  },
  portraitScoreBadge: {
    backgroundColor: Colors.secondary,
    borderRadius: 14,
    width: 38,
    height: 28,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  portraitScoreBadgeText: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: Colors.white,
  },
  portraitStatsRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginBottom: Spacing.sm,
    gap: Spacing.xs,
  },
  portraitStatItem: {
    flex: 1,
    alignItems: 'center' as const,
    gap: 2,
  },
  portraitStatLabel: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: Colors.textMuted,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
    textAlign: 'center' as const,
    width: '100%' as any,
  },
  portraitStatValue: {
    fontSize: FontSizes.caption,
    fontWeight: '700' as const,
    color: Colors.text,
    textAlign: 'center' as const,
    width: '100%' as any,
  },
  portraitValues: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: Spacing.xs,
  },
  portraitCta: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '600' as const,
    color: Colors.secondary,
    textAlign: 'center' as const,
    paddingTop: Spacing.xs,
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
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600' as const,
    textAlign: 'center' as const,
  },
  // Growth plan phase styles removed — portrait summary card replaces them
  quickPracticeSection: {
    marginBottom: Spacing.md,
  },
  quickPracticeLabel: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: Colors.textMuted,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  quickPracticeRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: Spacing.sm,
    marginBottom: 6,
  },
  quickPracticeTitle: {
    flex: 1,
    fontSize: FontSizes.bodySmall,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  quickPracticeMeta: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600' as const,
  },
  quickPracticeRowDone: {
    backgroundColor: '#E3EFE5',
  },
  quickPracticeCheck: {
    fontSize: 13,
    color: '#4A6F50',
    fontWeight: '700' as const,
    marginRight: 8,
  },
  quickPracticeTitleDone: {
    color: '#4A6F50',
  },
  // Growth plan styles removed — replaced by portrait summary card above

  // ── WEARE Summary Card ──
  weareSummaryCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
    ...Shadows.card,
  },
  weareSummaryHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  weareSummaryTitle: {
    fontSize: FontSizes.body,
    fontWeight: '600' as const,
    fontFamily: FontFamilies.heading,
    color: Colors.text,
  },
  weareModeBadge: {
    backgroundColor: Colors.borderLight,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.xs + 2,
    paddingVertical: 2,
  },
  weareModeBadgeText: {
    fontSize: FontSizes.caption - 1,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  weareSummaryBody: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: Spacing.md,
  },
  wearePulseCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: Colors.surfaceElevated,
  },
  wearePulseText: {
    fontSize: 22,
  },
  weareSummaryContent: {
    flex: 1,
    gap: 3,
  },
  weareSummaryPhrase: {
    fontSize: FontSizes.headingM,
    fontWeight: '600' as const,
    fontFamily: FontFamilies.heading,
    color: Colors.text,
  },
  weareSummaryDirection: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
  },
  weareSummaryNudge: {
    fontSize: FontSizes.caption,
    color: Colors.secondary,
    fontStyle: 'italic' as const,
  },
  weareSummaryArrow: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '600' as const,
    color: Colors.primary,
    textAlign: 'right' as const,
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

  // ── Relationship Mode ──
  modeSection: {
    marginHorizontal: Spacing.xl,
    marginTop: Spacing.lg,
    gap: Spacing.xs,
  },
  modeSectionTitle: {
    fontSize: FontSizes.caption,
    fontFamily: FontFamilies.heading,
    fontWeight: '600',
    color: Colors.textMuted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
  },
  modeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  modeCardContent: {
    flex: 1,
    gap: 2,
  },
  modeLabel: {
    fontSize: FontSizes.body,
    fontFamily: FontFamilies.heading,
    fontWeight: '600',
    color: Colors.text,
  },
  modePartnerName: {
    fontSize: FontSizes.caption,
    fontFamily: FontFamilies.accent,
    fontStyle: 'italic',
    color: Colors.textSecondary,
  },
  modeChangeButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.primaryFaded,
    borderRadius: BorderRadius.pill,
  },
  modeChangeText: {
    fontSize: FontSizes.caption,
    fontFamily: FontFamilies.heading,
    fontWeight: '600',
    color: Colors.primary,
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

  // ── SVG Icon Helpers ──
  inlineIconWrapper: {
    marginBottom: -3,
  },
  streakMiniRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  askNuanceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  // ── Demo Partner Card ──
  demoPartnerSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  demoPartnerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.subtle,
  },
  demoPartnerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  demoPartnerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoPartnerTextWrap: {
    flex: 1,
  },
  demoPartnerName: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '700',
    color: Colors.text,
  },
  demoPartnerStyle: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  demoPartnerCta: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '600',
    color: Colors.primary,
  },
  demoPartnerPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  demoPartnerPromptText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.primary,
    fontWeight: '500',
  },

  // ── Journey Value Map ──
  journeyMapCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  journeyMapTitle: {
    fontSize: FontSizes.body,
    fontWeight: '700',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  journeyStepsColumn: {
    gap: Spacing.sm,
  },
  journeyStepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  journeyStepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  journeyStepNumberText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  journeyStepContent: {
    flex: 1,
  },
  journeyStepName: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '600',
    color: Colors.text,
  },
  journeyStepDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },

  // ── Real Partner Connect Prompt ──
  realPartnerPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    backgroundColor: Colors.secondary + '08',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.secondary + '25',
  },
  realPartnerPromptContent: {
    flex: 1,
  },
  realPartnerPromptTitle: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '700',
    color: Colors.text,
  },
  realPartnerPromptDesc: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  realPartnerPromptArrow: {
    fontSize: FontSizes.body,
    fontWeight: '600',
    color: Colors.secondary,
  },

  // ── Couple Portal Ready Banner ──
  couplePortalReadyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    backgroundColor: Colors.secondary + '12',
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.secondary + '30',
  },
  couplePortalReadyText: {
    flex: 1,
    fontSize: FontSizes.bodySmall,
    fontWeight: '600',
    color: Colors.secondary,
  },
  consentBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    backgroundColor: Colors.primary + '10',
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.primary + '25',
  },
  consentBannerContent: {
    flex: 1,
    gap: 2,
  },
  consentBannerTitle: {
    fontSize: FontSizes.body,
    fontFamily: FontFamilies.heading,
    fontWeight: '600',
    color: Colors.primary,
  },
  consentBannerDesc: {
    fontSize: FontSizes.caption,
    fontFamily: 'JosefinSans_400Regular',
    color: Colors.textSecondary,
  },

  // ── Healing Journey Card ──
  healingJourneyCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
    ...Shadows.card,
  },
  healingJourneyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  healingJourneyNewBadge: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  healingJourneyNewBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: 1,
  },
  healingJourneyTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.headingM,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  healingJourneySubtitle: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    lineHeight: FontSizes.bodySmall * 1.5,
    marginBottom: Spacing.md,
  },
  healingJourneyCta: {
    alignSelf: 'flex-start',
  },
  healingJourneyCtaText: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.body,
    fontWeight: '600',
    color: Colors.primary,
  },

  // ── Relational Score Teaser ──
  relationalScoreTeaser: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.secondary + '30',
    gap: Spacing.md,
    ...Shadows.subtle,
  },
  relationalScoreTeaserHeader: {
    gap: 4,
  },
  relationalScoreTeaserEyebrow: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: Colors.secondary,
  },
  relationalScoreTeaserTitle: {
    fontFamily: FontFamilies.accent,
    fontSize: FontSizes.headingM,
    color: Colors.text,
  },
  relationalScoreTeaserBody: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    lineHeight: FontSizes.bodySmall * 1.5,
  },
  relationalScoreTeaserProgress: {
    gap: 4,
  },
  relationalScoreTeaserProgressTrack: {
    height: 6,
    backgroundColor: Colors.textMuted + '30',
    borderRadius: 3,
    overflow: 'hidden',
  },
  relationalScoreTeaserProgressFill: {
    height: '100%',
    backgroundColor: Colors.secondary,
    borderRadius: 3,
  },
  relationalScoreTeaserProgressLabel: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  couplePortalTeaser: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  couplePortalTeaserText: {
    flex: 1,
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    lineHeight: FontSizes.caption * 1.5,
  },
});
