/**
 * Home Screen — Wellness Journal Hub
 *
 * Designed with "one clear action" philosophy from top wellness apps.
 * Answers: "What should I do RIGHT NOW?" — not a menu, a recommendation.
 *
 * Layout (top to bottom):
 * 1. Greeting + Journey Context — name, step, progress dots, gear icon
 * 2. Daily Rhythm — check-in, today's practice, journal prompt
 * 3. Portrait summary (when generated)
 * 4. WEARE summary (when available)
 * 5. Micro-course card (when active)
 * 6. Streak — small, celebratory, not guilt-inducing
 * 7. Inspiration — rotating quote or nudge carousel
 * 8. Gateway Cards — Journey, Portrait, Relationship, More
 * 9. Quick Links — Nuance, Courses, Practices, Journal
 * 10. Individual Assessments — collapsible list
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
  type UnlockState,
} from '@/utils/unlockLogic';
import {
  getIndividualAssessments,
  getDyadicAssessments,
  getAllAssessments,
  getAssessmentConfig,
} from '@/utils/assessments/registry';
import { supabase } from '@/services/supabase';
import { fetchGrowthBoostData } from '@/services/growth-boost';
import { getGrowthBoostedScore, type GrowthBoostedResult } from '@/utils/portrait/growth-boost';
import { getPortrait, savePortrait, fetchAllScores, extractSupplementScores } from '@/services/portrait';
import { generatePortrait, isPortraitStale } from '@/utils/portrait/portrait-generator';
import { getTodaysCheckIn, saveDailyCheckIn, getRecentCheckIns } from '@/services/growth';
import { getMyCouple, checkDyadicCompletion, isSelfCouple, getDeepCouplePortrait } from '@/services/couples';
import { generateOverviewSnapshot } from '@/utils/portrait/overview-snapshot';
import { getAllExercises, getExerciseById } from '@/utils/interventions/registry';
import { getCompletions } from '@/services/intervention';
import { calculateGrowthProgress } from '@/utils/steps/intervention-protocols';
import CheckInCard from '@/components/growth/CheckInCard';
import DailyRhythmSection from '@/components/home/DailyRhythmSection';
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
import TenderButton from '@/components/ui/TenderButton';
import QuickLinksBar from '@/components/QuickLinksBar';
import LockedPortraitPreview from '@/components/portrait/LockedPortraitPreview';
import { HighlightWrapper } from '@/components/ui/HighlightWrapper';
import { TooltipManager } from '@/components/ftue/TooltipManager';
import { GuidedTour } from '@/components/ftue/GuidedTour';
import { WelcomeAudio } from '@/components/ftue/WelcomeAudio';
import { TOOLTIP_CONFIGS } from '@/constants/ftue/tooltips';
import { HOME_TOUR } from '@/constants/ftue/tourSteps';
import { RefRegistry } from '@/utils/ftue/refRegistry';
import JourneyUnlockOverlay, { hasSeenJourneyUnlock } from '@/components/growth/JourneyUnlockOverlay';
import JourneySpiral from '@/components/growth/JourneySpiral';
import { getCurrentStepNumber } from '@/services/steps';
import { getTaglineForStep, getPracticesForStep, getStep, getJournalPromptForStep, getPhaseForStep } from '@/utils/steps/twelve-steps';
import { MICRO_COURSES, calculateCourseProgress, type CourseProgress } from '@/utils/microcourses/course-registry';
import { getCompletions as getMicroCourseCompletions } from '@/services/intervention';
import MicroCourseCard from '@/components/microcourse/MicroCourseCard';
import DailyPatternCard from '@/components/today/DailyPatternCard';
import PatternReset from '@/components/emergency/PatternReset';
import MicroRitualCard from '@/components/couples/MicroRitualCard';
import TenderText from '@/components/ui/TenderText';
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
  HeartPulseIcon,
  ChatBubbleIcon,
  TargetIcon,
  CoupleIcon,
  ShieldIcon,
  SettingsIcon,
  PenIcon,
  MenuIcon,
  CheckmarkIcon,
  RefreshIcon,
  RainbowIcon,
  ScaleIcon,
} from '@/assets/graphics/icons';
import type { AssessmentConfig, AllAssessmentScores, AssessmentType } from '@/types';
import type { IndividualPortrait } from '@/types/portrait';
import type { WEAREProfile } from '@/types/weare';
import type { DailyCheckIn } from '@/types/growth';
import type { Couple, CycleDynamic } from '@/types/couples';
import { getLatestWEAREProfile } from '@/services/weare';
import { DEMO_PARTNERS, type DemoPartnerId } from '@/constants/demoPartners';

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
  const { user } = useAuth();
  const { isGuest } = useGuest();
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
  const [growthBoostResult, setGrowthBoostResult] = useState<GrowthBoostedResult | null>(null);

  // Exercise completion tracking for growth plan
  const [exerciseCompletionMap, setExerciseCompletionMap] = useState<Record<string, number>>({});

  // Check-in state
  const [todaysCheckIn, setTodaysCheckIn] = useState<DailyCheckIn | null>(null);
  const [weekDots, setWeekDots] = useState<boolean[]>([false, false, false, false, false, false, false]);

  // Couple state
  const [couple, setCouple] = useState<Couple | null>(null);
  const [dyadicAllDone, setDyadicAllDone] = useState(false);

  // Consent state
  const [consentGiven, setConsentGiven] = useState(false);

  // WEARE profile state (Phase 4)
  const [weareProfile, setWeareProfile] = useState<WEAREProfile | null>(null);

  // Couple portal preview — cached narrative snapshot
  const [coupleNarrativeSnapshot, setCoupleNarrativeSnapshot] = useState<string | null>(null);
  const [cycleDynamic, setCycleDynamic] = useState<CycleDynamic | null>(null);

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
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  // Admin mode
  const [adminMode, setAdminMode] = useState(false);
  const adminTapRef = useRef<{ count: number; lastTap: number }>({ count: 0, lastTap: 0 });

  // Journey unlock celebration
  const [showJourneyUnlock, setShowJourneyUnlock] = useState(false);

  // Loading
  const [loading, setLoading] = useState(true);

  // Locked card hint

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

        // Auto-regenerate portrait if assessments have been updated OR code version is newer
        if (loadedPortrait && completedAssessmentTypes.length >= 6) {
          const latestScoresMap = await fetchAllScores(user.id);
          const currentIds = new Set(Object.values(latestScoresMap).map((r) => r.id));
          const portraitIds = new Set(loadedPortrait.assessmentIds || []);
          const idsChanged = [...currentIds].some((id) => !portraitIds.has(id));
          const versionStale = isPortraitStale(loadedPortrait.version);
          const isStale = idsChanged || versionStale;

          if (isStale) {
            console.log(`[Home] Portrait stale reason: ${idsChanged ? 'IDs changed' : ''}${versionStale ? ' version outdated (' + loadedPortrait.version + ')' : ''}`);

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
          let step = 'init';
          let localError = '';
          try {
            step = 'fetchScores';
            const latestScoresMap = await fetchAllScores(user.id);
            const fetchedTypes = Object.keys(latestScoresMap);

            step = 'checkRequired';
            const required = ['ecr-r', 'dutch', 'sseit', 'dsi-r', 'ipip-neo-120', 'values'];
            const missing = required.filter((t) => !latestScoresMap[t]);
            if (missing.length > 0) {
              localError = `MISSING: ${missing.join(',')}, fetched: ${fetchedTypes.join(',')}`;
              console.error('[Home]', localError);
            } else {
              step = 'buildScores';
              for (const t of required) {
                if (!latestScoresMap[t].scores) {
                  localError = `NULL_SCORES: ${t} has no .scores`;
                  console.error('[Home]', localError);
                  throw new Error(localError);
                }
              }
              const scores: AllAssessmentScores = {
                ecrr: latestScoresMap['ecr-r'].scores,
                dutch: latestScoresMap['dutch'].scores,
                sseit: latestScoresMap['sseit'].scores,
                dsir: latestScoresMap['dsi-r'].scores,
                ipip: latestScoresMap['ipip-neo-120'].scores,
                values: latestScoresMap['values'].scores,
              };

              step = 'validateScoreShape';
              const shapeErrors: string[] = [];
              if (!scores.ecrr?.avoidanceScore && scores.ecrr?.avoidanceScore !== 0) shapeErrors.push('ecrr.avoidanceScore');
              if (!scores.ecrr?.anxietyScore && scores.ecrr?.anxietyScore !== 0) shapeErrors.push('ecrr.anxietyScore');
              if (!scores.ecrr?.attachmentStyle) shapeErrors.push('ecrr.attachmentStyle');
              if (!scores.ipip?.domainPercentiles) shapeErrors.push('ipip.domainPercentiles');
              if (!scores.sseit?.subscaleNormalized) shapeErrors.push('sseit.subscaleNormalized');
              if (!scores.dsir?.subscaleScores) shapeErrors.push('dsir.subscaleScores');
              if (!scores.dutch?.subscaleScores) shapeErrors.push('dutch.subscaleScores');
              if (!scores.values?.domainScores) shapeErrors.push('values.domainScores');
              if (shapeErrors.length > 0) {
                localError = `SHAPE: missing ${shapeErrors.join(', ')}`;
                console.error('[Home]', localError);
                throw new Error(localError);
              }

              step = 'extractSupplements';
              const supplements = extractSupplementScores(latestScoresMap);
              const ids = Object.values(latestScoresMap).map((r) => r.id);

              step = 'generatePortrait';
              const freshPortrait = generatePortrait(user.id, ids, scores, supplements);

              step = 'savePortrait';
              const saved = await savePortrait(freshPortrait);
              loadedPortrait = saved;
              console.log('[Home] Portrait auto-generated successfully');
            }
          } catch (genErr: any) {
            const errMsg = genErr?.message || String(genErr);
            console.error(`[Home] Portrait failed at step=${step}:`, errMsg);
            if (!localError) {
              console.error(`[Home] Portrait STEP=${step}: ${errMsg}`);
            }
          }
        }

        setPortrait(loadedPortrait);

        // Fetch growth boost data to apply to portrait score
        if (loadedPortrait) {
          try {
            const boostData = await fetchGrowthBoostData(user.id);
            const cs = loadedPortrait.compositeScores;
            const scores = [cs.regulationScore, cs.windowWidth, cs.accessibility, cs.responsiveness, cs.engagement, cs.selfLeadership, cs.valuesCongruence];
            const baseline = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
            const result = getGrowthBoostedScore(baseline, boostData);
            setGrowthBoostResult(result);
          } catch (e) {
            console.warn('[Home] Growth boost data failed:', e);
          }
        }
      } catch (portraitErr: any) {
        console.error('[Home] Portrait loading failed:', portraitErr);
        console.error(`[Home] Portrait LOAD: ${portraitErr?.message || String(portraitErr)}`);
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
      // 5. Load today's check-in + weekly rhythm dots
      try {
        const ci = await getTodaysCheckIn(user.id);
        setTodaysCheckIn(ci);

        // Compute 7-day rhythm dots (index 0 = 6 days ago, index 6 = today)
        const recentCheckins = await getRecentCheckIns(user.id, 7);
        const checkinDates = new Set(recentCheckins.map((c) => c.checkinDate));
        const dots: boolean[] = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(d.getDate() - i);
          const dateStr = d.toISOString().split('T')[0];
          dots.push(checkinDates.has(dateStr));
        }
        setWeekDots(dots);
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

        // 8b. Load cached deep couple portrait for home preview + cycle dynamic
        try {
          const dp = await getDeepCouplePortrait(loadedCouple.id);
          if (dp) {
            const snapshot = generateOverviewSnapshot(dp);
            setCoupleNarrativeSnapshot(snapshot);
            setCycleDynamic(dp.patternInterlock?.combinedCycle?.dynamic ?? null);
          } else {
            setCoupleNarrativeSnapshot(null);
            setCycleDynamic(null);
          }
        } catch {
          setCoupleNarrativeSnapshot(null);
          setCycleDynamic(null);
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

  // Result cards + grid cards removed — results moved to portrait, grid replaced by gateway cards

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
          <ActivityIndicator color={Colors.primary} size="large" accessibilityLabel="Loading" />
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
                  <View style={styles.heroTopRow}>
                    <Text style={styles.heroTagline}>
                      {greeting}, {capitalName}{' '}
                      <View style={styles.inlineIconWrapper}>
                        <TimeGreetingIcon iconName={icon} size={22} />
                      </View>
                    </Text>
                    <TouchableOpacity
                      style={styles.gearButton}
                      onPress={() => { SoundHaptics.tapSoft(); router.push('/(app)/more' as any); }}
                      activeOpacity={0.7}
                      accessibilityRole="button"
                      accessibilityLabel="Settings and more"
                    >
                      <SettingsIcon size={22} color={Colors.textSecondary} />
                    </TouchableOpacity>
                  </View>
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

          {/* Step progress dots removed — JourneySpiral replaces them */}

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

        {/* ═══ PARTNER SECTION — demo partner, connect prompt, or solo nudge ═══ */}
        <View ref={(r) => RefRegistry.register('home_partnerSection', r)}>
        {relationshipMode === 'demo_partner' && demoPartnerId && DEMO_PARTNERS[demoPartnerId as DemoPartnerId] && (() => {
          const partner = DEMO_PARTNERS[demoPartnerId as DemoPartnerId];
          return (
            <View style={styles.demoPartnerSection}>
              {/* Practice conversation */}
              <TouchableOpacity
                style={styles.demoPartnerCard}
                onPress={() => router.push({
                  pathname: '/(app)/chat' as any,
                  params: { practiceWith: partner.name },
                })}
                activeOpacity={0.8}
                accessibilityRole="button"
              >
                <View style={styles.demoPartnerInfo}>
                  <View style={[
                    styles.demoPartnerAvatar,
                    { backgroundColor: partner.color + '20' },
                  ]}>
                    <CoupleIcon size={20} color={partner.color} />
                  </View>
                  <View style={styles.demoPartnerTextWrap}>
                    <Text style={styles.demoPartnerName}>
                      Practice with {partner.name}
                    </Text>
                    <Text style={styles.demoPartnerStyle}>
                      {partner.shortDescription}
                    </Text>
                  </View>
                </View>
                <Text style={styles.demoPartnerCta}>Chat {'\u2192'}</Text>
              </TouchableOpacity>

              {/* Quick actions row — Couple Portal + Couple Assessments */}
              <View style={styles.demoPartnerActions}>
                <TouchableOpacity
                  style={[styles.demoPartnerActionBtn, { borderColor: Colors.secondary + '30' }]}
                  onPress={() => {
                    SoundHaptics.tapSoft();
                    router.push('/(app)/couple-portal' as any);
                  }}
                  activeOpacity={0.8}
                >
                  <HeartPulseIcon size={16} color={Colors.secondary} />
                  <Text style={styles.demoPartnerActionText}>Couple Portal</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.demoPartnerActionBtn, { borderColor: Colors.calm + '30' }]}
                  onPress={() => {
                    SoundHaptics.tapSoft();
                    router.push('/(app)/couple-assessment' as any);
                  }}
                  activeOpacity={0.8}
                >
                  <ScaleIcon size={16} color={Colors.calm} />
                  <Text style={styles.demoPartnerActionText}>Couple Check-in</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })()}
        {relationshipMode === 'solo' && !hasPortrait && completedCount > 0 && (
          <TouchableOpacity
            style={styles.demoPartnerPrompt}
            onPress={() => router.push('/(app)/relationship-mode' as any)}
            activeOpacity={0.7}
            accessibilityRole="button"
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
            accessibilityRole="button"
            accessibilityLabel="All Assessments Complete!"
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
            accessibilityRole="button"
            accessibilityLabel="Connect With Your Partner"
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
        </View>

        {/* ═══ PATTERN RESET — always visible ══════════════ */}
        {hasCompletedOnboarding && (
          <View style={styles.section}>
            <PatternReset portrait={portrait} />
          </View>
        )}

        {/* ═══ YOUR PORTRAIT SUMMARY (if portrait exists) ══════ */}
        {hasPortrait && portrait && (() => {
          const cs = portrait.compositeScores;
          const scores = [cs.regulationScore, cs.windowWidth, cs.accessibility, cs.responsiveness, cs.engagement, cs.selfLeadership, cs.valuesCongruence];
          const rawScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
          const overallScore = growthBoostResult?.boostedScore ?? rawScore;

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
            .reduce((best, key) => ((cs[key] ?? 0) > (cs[best] ?? 0) ? key : best));
          const topStrength = scoreLabels[topKey];

          const cyclePosition = portrait.negativeCycle?.position
            ? portrait.negativeCycle.position.charAt(0).toUpperCase() + portrait.negativeCycle.position.slice(1)
            : null;
          const growthEdge = portrait.growthEdges?.[0]?.title;
          const coreValues = portrait.fourLens?.values?.coreValues?.slice(0, 3).join(', ');

          return (
            <TouchableOpacity
              ref={(r) => RefRegistry.register('home_portraitSummary', r)}
              style={styles.portraitSummaryCard}
              onPress={() => { SoundHaptics.tapSoft(); router.push('/(app)/portrait' as any); }}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="YOUR PORTRAIT"
            >
              <View style={styles.portraitSummaryHeader}>
                <Text style={styles.portraitSummaryEyebrow}>YOUR PORTRAIT</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <View style={styles.portraitScoreBadge}>
                    <Text style={styles.portraitScoreBadgeText}>{overallScore}</Text>
                  </View>
                  {growthBoostResult && growthBoostResult.growthBoost > 0 && (
                    <Text style={{ fontSize: 11, color: Colors.success, fontWeight: '600' }}>
                      +{growthBoostResult.growthBoost} growth
                    </Text>
                  )}
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

              <View style={styles.portraitActionsRow}>
                <Text style={styles.portraitCta}>
                  See Full Portrait {'\u2192'}
                </Text>
              </View>

              {/* Retake / View Results links */}
              <View style={styles.portraitQuickLinks}>
                <TouchableOpacity
                  style={styles.portraitQuickLink}
                  onPress={(e) => {
                    e.stopPropagation();
                    SoundHaptics.tapSoft();
                    router.push('/(app)/tender-assessment' as any);
                  }}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel="Retake Assessment"
                >
                  <Text style={styles.portraitQuickLinkText}>Retake Assessment</Text>
                </TouchableOpacity>
                <View style={styles.portraitQuickLinkDivider} />
                <TouchableOpacity
                  style={styles.portraitQuickLink}
                  onPress={(e) => {
                    e.stopPropagation();
                    SoundHaptics.tapSoft();
                    router.push('/(app)/portrait' as any);
                  }}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel="View Results"
                >
                  <Text style={styles.portraitQuickLinkText}>View Results</Text>
                </TouchableOpacity>
                <View style={styles.portraitQuickLinkDivider} />
                <TouchableOpacity
                  style={styles.portraitQuickLink}
                  onPress={(e) => {
                    e.stopPropagation();
                    SoundHaptics.tapSoft();
                    router.push({ pathname: '/(app)/portrait' as any, params: { tab: 'matrix' } });
                  }}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel="Matrix"
                >
                  <Text style={styles.portraitQuickLinkText}>Matrix</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        })()}

        {/* ═══ WEARE SUMMARY (The Space Between You) ═══════ */}
        {weareProfile && couple && (
          <TouchableOpacity
            style={styles.weareSummaryCard}
            onPress={() => { SoundHaptics.tapSoft(); router.push('/(app)/couple-portal' as any); }}
            activeOpacity={0.8}
            accessibilityRole="button"
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

        {/* ═══ JOURNEY MILESTONE MAP (pre-portrait — progressive) ═══ */}
        {!hasPortrait && (() => {
          const discoverDone = tenderStatus.state === 'completed';
          const milestones = [
            {
              name: 'Discover',
              desc: '7 assessment sections about how you connect, feel, and fight',
              done: discoverDone,
              inProgress: tenderStatus.state === 'in_progress',
              progressDetail: tenderStatus.state === 'in_progress'
                ? `${tenderStatus.completedSections} of ${TENDER_SECTIONS.length}`
                : undefined,
            },
            {
              name: 'Portrait',
              desc: 'A complete relational profile from your results',
              done: false,
              inProgress: discoverDone,
            },
            {
              name: 'Journey',
              desc: '12 steps with practices, courses, and growth pathways',
              done: false,
              inProgress: false,
            },
            {
              name: 'Practice',
              desc: 'Exercises, micro-courses, and AI coaching',
              done: false,
              inProgress: false,
            },
            {
              name: 'Progress',
              desc: 'Track milestones and personal growth',
              done: false,
              inProgress: false,
            },
          ];

          return (
            <View style={styles.journeyMapCard}>
              <Text style={styles.journeyMapTitle}>Your Journey Ahead</Text>
              <View style={styles.journeyStepsColumn}>
                {milestones.map((m, index) => (
                  <View key={m.name} style={styles.journeyStepRow}>
                    <View style={[
                      styles.journeyStepNumber,
                      m.done && styles.journeyStepNumberDone,
                      m.inProgress && styles.journeyStepNumberActive,
                    ]}>
                      {m.done ? (
                        <CheckmarkIcon size={12} color={Colors.successDark} />
                      ) : (
                        <Text style={[
                          styles.journeyStepNumberText,
                          m.inProgress && styles.journeyStepNumberTextActive,
                        ]}>{index + 1}</Text>
                      )}
                    </View>
                    <View style={styles.journeyStepContent}>
                      <Text style={[
                        styles.journeyStepName,
                        m.done && styles.journeyStepNameDone,
                      ]}>
                        {m.name}
                        {m.progressDetail ? ` (${m.progressDetail})` : ''}
                      </Text>
                      {!m.done && (
                        <Text style={styles.journeyStepDesc}>{m.desc}</Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          );
        })()}

        {/* ═══ 4. STEP JOURNEY (portrait) or ASSESSMENT (pre-portrait) ═══ */}
        {hasPortrait ? (
          /* ── Journey Spiral — circular 12-step visualization ── */
          <View ref={(r) => RefRegistry.register('home_journeyCard', r)}>
            <View style={styles.fieldHeader}>
              <Text style={styles.fieldTitle}>THE FIELD</Text>
              <Text style={styles.fieldSubtitle}>Your 12-step healing journey</Text>
            </View>
            <JourneySpiral
              currentStep={currentStepNum}
              onStepPress={(stepNum) => {
                SoundHaptics.tapSoft();
                router.push(`/(app)/step-detail?step=${stepNum}` as any);
              }}
            />

            {/* ═══ COUPLE PORTAL PREVIEW ═══════════════════════ */}
            {hasCoupleLinked && (
              <TouchableOpacity
                style={styles.couplePreviewCard}
                onPress={() => {
                  SoundHaptics.tapSoft();
                  router.push('/(app)/couple-portal' as any);
                }}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="View Couple Portal"
              >
                <View style={styles.couplePreviewHeader}>
                  <HeartPulseIcon size={18} color={Colors.secondary} />
                  <TenderText variant="headingS" color={Colors.text}>The Space Between You</TenderText>
                </View>

                {weareProfile ? (
                  <View style={styles.couplePreviewBody}>
                    <View style={[
                      styles.couplePreviewPulse,
                      {
                        borderColor: weareProfile.layers.resonancePulse >= 60
                          ? Colors.primary
                          : weareProfile.layers.resonancePulse >= 40
                            ? Colors.secondary
                            : Colors.textMuted,
                      },
                    ]}>
                      {weareProfile.warmSummary === 'Deeply alive'
                        ? <SparkleIcon size={16} color={Colors.primary} />
                        : weareProfile.warmSummary === 'Growing stronger'
                          ? <SeedlingIcon size={16} color={Colors.primary} />
                          : weareProfile.warmSummary === 'Finding its way'
                            ? <SearchIcon size={16} color={Colors.textSecondary} />
                            : <LeafIcon size={16} color={Colors.textSecondary} />}
                    </View>
                    <View style={styles.couplePreviewContent}>
                      <TenderText variant="bodyMedium" color={Colors.text}>
                        {weareProfile.warmSummary}
                      </TenderText>
                      <TenderText variant="body" color={Colors.textSecondary} style={{ marginTop: 2 }}>
                        {weareProfile.layers.emergenceDirection > 1
                          ? 'Growing'
                          : weareProfile.layers.emergenceDirection < -1
                            ? 'Contracting'
                            : 'Steady'}
                        {weareProfile.bottleneck
                          ? ` \u00B7 ${weareProfile.bottleneck.label}`
                          : ''}
                      </TenderText>
                    </View>
                  </View>
                ) : (
                  <TenderText variant="body" color={Colors.textSecondary}>
                    Your shared relational portrait awaits
                  </TenderText>
                )}

                {coupleNarrativeSnapshot && (
                  <TenderText variant="body" color={Colors.textSecondary} style={{ lineHeight: 22 }} numberOfLines={3}>
                    {coupleNarrativeSnapshot}
                  </TenderText>
                )}

                <TenderText variant="bodyMedium" color={Colors.primary} style={{ marginTop: 2 }}>
                  View Couple Portal {'\u2192'}
                </TenderText>
              </TouchableOpacity>
            )}

            {/* Couple Portal teaser strip — shows when not yet coupled */}
            {!hasCoupleLinked && (
              <TouchableOpacity
                style={styles.couplePortalStrip}
                onPress={() => {
                  SoundHaptics.tapSoft();
                  router.push('/(app)/couple-portal' as any);
                }}
                activeOpacity={0.8}
                accessibilityRole="button"
              >
                <View style={styles.couplePortalStripLeft}>
                  <CoupleIcon size={20} color={Colors.secondary} />
                </View>
                <View style={styles.couplePortalStripContent}>
                  <TenderText variant="bodyMedium" color={Colors.text}>
                    {demoPartnerId ? 'Practice Couple Portal' : 'Couple Portal'}
                  </TenderText>
                  <TenderText variant="body" color={Colors.textSecondary} numberOfLines={2}>
                    {demoPartnerId
                      ? 'Explore shared insights with your practice partner'
                      : 'Invite your partner to unlock shared portraits and couple assessments'}
                  </TenderText>
                </View>
                <TenderText variant="bodyMedium" color={Colors.primary}>{'\u2192'}</TenderText>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          /* ── Consolidated Assessment Section (pre-portrait) ── */
          <View style={styles.assessmentSection}>
            {/* Tender Assessment card with embedded progress */}
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
                        7 sections covering how you connect, feel, fight, and what matters to you.
                        Take breaks between sections and come back anytime.
                      </Text>
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
                      <Text style={styles.tenderCardMeta}>
                        {TOTAL_QUESTIONS} questions {'\u00B7'} ~{TOTAL_ESTIMATED_MINUTES} min {'\u00B7'} Save & exit anytime
                      </Text>
                      <TenderButton
                        title="Start Assessment"
                        onPress={() => { SoundHaptics.tap(); router.push('/(app)/tender-assessment' as any); }}
                        variant="primary"
                        size="md"
                        fullWidth
                        style={{ marginTop: Spacing.xs }}
                        accessibilityLabel="Start Assessment"
                      />
                    </>
                  )}

                  {tenderStatus.state === 'in_progress' && (
                    <>
                      <Text style={styles.tenderCardTitle}>The Tender Assessment</Text>
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
                      <Text style={styles.tenderCardMeta}>
                        {tenderStatus.completedSections} of {TENDER_SECTIONS.length} sections complete
                      </Text>
                      {tenderStatus.currentSectionName && (
                        <Text style={styles.tenderCurrentSection}>
                          Next: {tenderStatus.currentSectionName}
                        </Text>
                      )}
                      <TenderButton
                        title="Continue"
                        onPress={() => { SoundHaptics.tap(); router.push('/(app)/tender-assessment' as any); }}
                        variant="primary"
                        size="md"
                        fullWidth
                        style={{ marginTop: Spacing.xs }}
                        accessibilityLabel="Continue Assessment"
                      />
                    </>
                  )}
                </View>
              </HighlightWrapper>
            )}

            {/* Assessment complete achievement */}
            {tenderStatus.state === 'completed' && (
              <View style={styles.assessmentCompleteCard}>
                <View style={styles.assessmentCompleteHeader}>
                  <CheckmarkIcon size={16} color={Colors.calm} />
                  <Text style={styles.assessmentCompleteTitle}>
                    All {TENDER_SECTIONS.length} Sections Complete
                  </Text>
                </View>
                <Text style={styles.assessmentCompleteDesc}>
                  Your portrait captures how you connect, feel, fight, and what matters to you.
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    SoundHaptics.tapSoft();
                    router.push('/(app)/tender-assessment' as any);
                  }}
                  style={styles.retakeLink}
                  accessibilityLabel="Retake any section"
                >
                  <RefreshIcon size={14} color={Colors.primary} />
                  <Text style={styles.retakeLinkText}>
                    Retake any section to see how you've grown
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Portrait generation prompt */}
            {individualCompleted && !hasPortrait && (
              <View style={[styles.portraitGenerateCard, { marginHorizontal: 0 }]}>
                <Text style={styles.portraitGenerateTitle}>
                  Your Portrait is Ready
                </Text>
                <Text style={styles.portraitGenerateSubtitle}>
                  All assessments complete — generate your relational portrait
                </Text>
                <TenderButton
                  title="Generate Portrait"
                  onPress={handleGeneratePortrait}
                  variant="secondary"
                  size="lg"
                  fullWidth
                  loading={generating}
                  disabled={generating}
                  style={{ marginTop: Spacing.sm }}
                  accessibilityLabel="Generate your relational portrait"
                />
              </View>
            )}
          </View>
        )}

        {/* ═══ 4A2. YOUR HEALING JOURNEY (after first assessment, before portrait) */}
        {completedCount >= 1 && !hasPortrait && (
          <TouchableOpacity
            style={styles.healingJourneyCard}
            onPress={() => { SoundHaptics.tapSoft(); router.push('/(app)/growth' as any); }}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="NEW"
          >
            <View style={styles.healingJourneyHeader}>
              <SeedlingIcon size={28} color={Colors.primary} />
              <View style={styles.healingJourneyNewBadge}>
                <Text style={styles.healingJourneyNewBadgeText}>NEW</Text>
              </View>
            </View>
            <Text style={styles.healingJourneyTitle}>Your Relational Journey</Text>
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

        {/* ═══ MICRO-COURSE (Continue Course card) ═══════════ */}
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

        {!hasPortrait && completedCount > 0 && (
          <LockedPortraitPreview
            completedCount={completedCount}
            completedTypes={completedTypes}
          />
        )}
        {!hasPortrait && <NudgeCarousel insights={nudges} />}

        {/* ═══ DAILY RHYTHM (collapsible section) ═════════ */}
        {hasCompletedOnboarding && (
          <View ref={(r) => RefRegistry.register('home_dailyRhythm', r)} style={styles.section}>
            <DailyRhythmSection
              todaysCheckIn={todaysCheckIn}
              onCheckInSubmit={handleCheckInSubmit}
              hasPortrait={hasPortrait}
              currentStepNum={currentStepNum}
              isSolo={relationshipMode === 'solo'}
              weekDots={weekDots}
              journalPrompt={getJournalPromptForStep(currentStepNum, relationshipMode === 'solo')}
            />
          </View>
        )}

        {/* ═══ DAILY PATTERN CARD ════════════════════════ */}
        {hasPortrait && portrait && (
          <View style={styles.section}>
            <DailyPatternCard
              portrait={portrait}
              onAwardXP={awardGamificationXP}
            />
          </View>
        )}

        {/* ═══ COUPLE MICRO-RITUAL — daily 30-second ritual ═══ */}
        {hasCoupleLinked && (
          <View style={styles.section}>
            <MicroRitualCard
              cycleDynamic={cycleDynamic}
              onAwardXP={awardGamificationXP}
            />
          </View>
        )}

        {/* ═══ EXPLORE — 4 Gateway Cards ══════════════════ */}
        <View ref={(r) => RefRegistry.register('home_exploreSection', r)} style={styles.gatewaySection}>
          <Text style={styles.gatewaySectionLabel}>EXPLORE</Text>

          {/* YOUR JOURNEY */}
          <TouchableOpacity
            style={styles.gatewayCard}
            onPress={() => { SoundHaptics.tapSoft(); router.push('/(app)/growth' as any); }}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Your Journey"
          >
            <View style={styles.gatewayCardIconWrap}>
              <SeedlingIcon size={22} color={Colors.primary} />
            </View>
            <View style={styles.gatewayCardContent}>
              <Text style={styles.gatewayCardTitle}>Your Journey</Text>
              <Text style={styles.gatewayCardSubtitle} numberOfLines={1}>
                {hasPortrait
                  ? `Step ${currentStepNum} of 12 \u00B7 ${getStep(currentStepNum)?.phase ?? ''}`
                  : 'Twelve steps to relational health'}
              </Text>
            </View>
            <Text style={styles.gatewayCardArrow}>{'\u2192'}</Text>
          </TouchableOpacity>

          {/* YOUR PORTRAIT */}
          <TouchableOpacity
            ref={(r) => RefRegistry.register('home_portraitCard', r)}
            style={styles.gatewayCard}
            onPress={() => { SoundHaptics.tapSoft(); router.push('/(app)/portrait' as any); }}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Your Portrait"
          >
            <View style={styles.gatewayCardIconWrap}>
              <SparkleIcon size={22} color={Colors.primary} />
            </View>
            <View style={styles.gatewayCardContent}>
              <Text style={styles.gatewayCardTitle}>Your Portrait</Text>
              <Text style={styles.gatewayCardSubtitle} numberOfLines={1}>
                {hasPortrait && portrait
                  ? `${portrait.negativeCycle?.position ? portrait.negativeCycle.position.charAt(0).toUpperCase() + portrait.negativeCycle.position.slice(1) : 'Your'} \u00B7 ${portrait.growthEdges?.[0]?.title ?? 'Growth insights'}`
                  : 'Complete assessments to unlock'}
              </Text>
            </View>
            <Text style={styles.gatewayCardArrow}>{'\u2192'}</Text>
          </TouchableOpacity>

          {/* YOUR RELATIONSHIP (only when coupled) */}
          {hasCoupleLinked && (
            <TouchableOpacity
              style={styles.gatewayCard}
              onPress={() => { SoundHaptics.tapSoft(); router.push('/(app)/couple-portal' as any); }}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Your Relationship"
            >
              <View style={styles.gatewayCardIconWrap}>
                <HeartDoubleIcon size={22} color={Colors.primary} />
              </View>
              <View style={styles.gatewayCardContent}>
                <Text style={styles.gatewayCardTitle}>Your Relationship</Text>
                <Text style={styles.gatewayCardSubtitle} numberOfLines={1}>
                  {weareProfile
                    ? `${weareProfile.warmSummary} \u00B7 ${weareProfile.bottleneck?.label ?? ''}`
                    : 'Couple portrait and shared growth'}
                </Text>
              </View>
              <Text style={styles.gatewayCardArrow}>{'\u2192'}</Text>
            </TouchableOpacity>
          )}

          {/* BUILDING BRIDGES */}
          {hasCoupleLinked && (
            <TouchableOpacity
              style={styles.gatewayCard}
              onPress={() => { SoundHaptics.tapSoft(); router.push('/(app)/building-bridges' as any); }}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Building Bridges"
            >
              <View style={styles.gatewayCardIconWrap}>
                <RainbowIcon size={22} color={Colors.accent} />
              </View>
              <View style={styles.gatewayCardContent}>
                <Text style={styles.gatewayCardTitle}>Building Bridges</Text>
                <Text style={styles.gatewayCardSubtitle} numberOfLines={1}>
                  Card game for deeper connection
                </Text>
              </View>
              <Text style={styles.gatewayCardArrow}>{'\u2192'}</Text>
            </TouchableOpacity>
          )}

          {/* MORE */}
          <TouchableOpacity
            style={styles.gatewayCard}
            onPress={() => { SoundHaptics.tapSoft(); router.push('/(app)/more' as any); }}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="More"
          >
            <View style={styles.gatewayCardIconWrap}>
              <MenuIcon size={22} color={Colors.primary} />
            </View>
            <View style={styles.gatewayCardContent}>
              <Text style={styles.gatewayCardTitle}>More</Text>
              <Text style={styles.gatewayCardSubtitle} numberOfLines={1}>
                Community, support, settings
              </Text>
            </View>
            <Text style={styles.gatewayCardArrow}>{'\u2192'}</Text>
          </TouchableOpacity>
        </View>

        {/* Old Daily Rhythm moved above gateway cards as collapsible DailyRhythmSection */}

        {/* ═══ QUICK LINKS (bottom row) ════════════════════════ */}
        <View ref={(r) => RefRegistry.register('home_quickLinks', r)}>
          <QuickLinksBar showHome={false} currentScreen="home" />
        </View>
      </ScrollView>

      {/* ═══ FTUE Overlays ═══════════════════════════════════ */}
      {showTour && (
        <GuidedTour tour={HOME_TOUR} onComplete={handleTourComplete} scrollRef={scrollRef} scrollOffset={scrollOffset} />
      )}
      <TooltipManager screen="home" scrollRef={scrollRef} scrollOffset={scrollOffset} />
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
    paddingBottom: Spacing.scrollPadBottom,
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

  // ── Assessment Complete Achievement ──
  assessmentCompleteCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.sm,
    ...Shadows.subtle,
  },
  assessmentCompleteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  assessmentCompleteTitle: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '700',
    color: Colors.calm,
    fontFamily: FontFamilies.heading,
  },
  assessmentCompleteDesc: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  retakeLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  retakeLinkText: {
    fontSize: FontSizes.caption,
    color: Colors.primary,
    fontWeight: '600',
  },

  // ── Badges ──
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.pill,
  },
  badgeCompleted: {
    backgroundColor: Colors.successFaded,
  },
  badgeCompletedText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.successDarkText,
  },
  badgeInProgress: {
    backgroundColor: Colors.accentGoldLight,
  },
  badgeInProgressText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.warningDark,
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
  portraitActionsRow: {
    alignItems: 'center' as const,
  },
  portraitQuickLinks: {
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingTop: Spacing.sm,
    marginTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  portraitQuickLink: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
  },
  portraitQuickLinkText: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
  },
  portraitQuickLinkDivider: {
    width: 1,
    height: 14,
    backgroundColor: Colors.borderLight,
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
    backgroundColor: Colors.successLight,
  },
  quickPracticeCheck: {
    fontSize: 13,
    color: Colors.successDark,
    fontWeight: '700' as const,
    marginRight: 8,
  },
  quickPracticeTitleDone: {
    color: Colors.successDark,
  },
  // Growth plan styles removed — replaced by portrait summary card above

  // ── WEARE Summary Card ──
  weareSummaryCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
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
  demoPartnerActions: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  demoPartnerActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  demoPartnerActionText: {
    fontSize: FontSizes.caption,
    fontWeight: '500',
    color: Colors.text,
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
  journeyStepNumberDone: {
    backgroundColor: Colors.successLight,
  },
  journeyStepNumberActive: {
    backgroundColor: Colors.primary + '25',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  journeyStepNumberTextActive: {
    color: Colors.primary,
  },
  journeyStepNameDone: {
    color: Colors.textMuted,
    textDecorationLine: 'line-through' as const,
  },

  // ── Assessment Section (pre-portrait consolidated) ──
  assessmentSection: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },

  // ── The Field header ──
  fieldHeader: {
    alignItems: 'center' as const,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xs,
  },
  fieldTitle: {
    fontSize: FontSizes.caption,
    fontWeight: '700' as const,
    color: Colors.primary,
    letterSpacing: 2.5,
    textTransform: 'uppercase' as const,
  },
  fieldSubtitle: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  // ── Couple Portal Preview Card ──
  couplePreviewCard: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
    ...Shadows.card,
  },
  couplePreviewHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: Spacing.sm,
  },
  couplePreviewBody: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: Spacing.md,
  },
  couplePreviewPulse: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2.5,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: Colors.surfaceElevated,
  },
  couplePreviewContent: {
    flex: 1,
  },

  // ── Step Journey Card (portrait users) ──
  stepJourneyCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    ...Shadows.card,
  },
  stepJourneyHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: Spacing.sm,
  },
  stepJourneyLabel: {
    fontSize: FontSizes.caption,
    fontWeight: '700' as const,
    color: Colors.primary,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
  },
  stepJourneyProgress: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
  },
  stepJourneyBody: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  stepJourneyPhaseIndicator: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  stepJourneyContent: {
    flex: 1,
  },
  stepJourneyStepTitle: {
    fontSize: FontSizes.body,
    fontWeight: '700' as const,
    fontFamily: FontFamilies.heading,
    color: Colors.text,
  },
  stepJourneyPhaseRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 6,
    marginTop: 2,
  },
  stepJourneyPhaseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stepJourneyPhaseName: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
  },
  stepJourneyArrow: {
    fontSize: 20,
    color: Colors.textMuted,
  },
  stepJourneySegmentBar: {
    flexDirection: 'row' as const,
    gap: 3,
  },
  stepJourneySegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
  },
  stepJourneySegmentDone: {
    backgroundColor: Colors.primary + '60',
  },
  stepJourneySegmentActive: {
    backgroundColor: Colors.primary,
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
  couplePortalStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginTop: Spacing.md,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.secondary + '25',
  },
  couplePortalStripLeft: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.secondary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  couplePortalStripContent: {
    flex: 1,
    gap: 2,
  },

  // ── Hero Top Row (greeting + gear) ──
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  gearButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },

  // ── Gateway Cards ──
  gatewaySection: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  gatewaySectionLabel: {
    fontSize: FontSizes.caption,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
  },
  gatewayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.md,
    ...Shadows.card,
  },
  gatewayCardIconWrap: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gatewayCardStickerWrap: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gatewayCardContent: {
    flex: 1,
    gap: 2,
  },
  gatewayCardTitle: {
    fontSize: FontSizes.body,
    fontWeight: '700',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
  },
  gatewayCardSubtitle: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
  },
  gatewayCardArrow: {
    fontSize: FontSizes.body,
    fontWeight: '600',
    color: Colors.textMuted,
  },
});
