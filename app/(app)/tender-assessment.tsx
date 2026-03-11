/**
 * The Tender Assessment — unified orchestrator screen.
 *
 * Sequences the 7 assessment sections into one continuous experience
 * with field-language section names, breaks, save-and-exit, and supplement items.
 *
 * Each section is scored independently and saved to the `assessments` table
 * under its original type (e.g., 'ecr-r'), so portrait generation and
 * unlock logic work with zero changes.
 */

import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Platform,
  Animated,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/context/AuthContext';
import { WelcomeAudio } from '@/components/ftue/WelcomeAudio';
import { useGamification } from '@/context/GamificationContext';
import TenderButton from '@/components/ui/TenderButton';
import { supabase } from '@/services/supabase';
import { getAssessmentConfig } from '@/utils/assessments/registry';
import { TENDER_SECTIONS, TOTAL_QUESTIONS, TOTAL_ESTIMATED_MINUTES } from '@/utils/assessments/tender-sections';
import { getSupplementDef } from '@/utils/assessments/supplements';
import QuestionRenderer from '@/components/assessment/QuestionRenderer';
import SectionBreak from '@/components/assessment/SectionBreak';
import { Colors, Spacing, FontSizes, FontFamilies, ButtonSizes, BorderRadius, Shadows } from '@/constants/theme';
import { SparkleIcon, BookOpenIcon, RefreshIcon, HeartIcon } from '@/assets/graphics/icons';
import CelebrationDots from '@/components/ui/CelebrationDots';
import RetakeDeltaComponent, { computeRetakeDelta } from '@/components/assessment/RetakeDelta';
import type { RetakeDeltaData } from '@/components/assessment/RetakeDelta';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { AssessmentConfig, GenericQuestion, AssessmentSection } from '@/types';

// ─── Types ───────────────────────────────────────────────

interface SectionState {
  assessmentType: string;
  responses: (any | null)[];         // original questions
  supplementResponses: (any | null)[]; // supplement questions (may be empty)
  currentQuestionIndex: number;
  completed: boolean;
}

interface OrchestratorProgress {
  currentSectionIndex: number;
  sectionStates: SectionState[];
  completedSections: string[];  // assessment types
}

/** User-scoped key to prevent assessment progress leaking between users. */
function progressKey(userId?: string): string {
  return userId
    ? `tender_assessment_progress_${userId}`
    : 'tender_assessment_progress';
}
// Legacy key used before user-scoping — cleared on load for safety
const LEGACY_PROGRESS_KEY = 'tender_assessment_progress';

// ─── Helpers ─────────────────────────────────────────────

function buildInitialSectionStates(): SectionState[] {
  return TENDER_SECTIONS.map((section) => {
    const config = getAssessmentConfig(section.assessmentType);
    const supplement = section.supplementGroup
      ? getSupplementDef(section.supplementGroup)
      : undefined;
    return {
      assessmentType: section.assessmentType,
      responses: new Array(config.totalQuestions).fill(null),
      supplementResponses: supplement
        ? new Array(supplement.questions.length).fill(null)
        : [],
      currentQuestionIndex: 0,
      completed: false,
    };
  });
}

/** Count total answered questions across all sections. */
function countTotalAnswered(sectionStates: SectionState[]): number {
  return sectionStates.reduce((total, ss) => {
    const mainAnswered = ss.responses.filter(
      (r) => r !== null && r !== '' && r !== undefined,
    ).length;
    const suppAnswered = ss.supplementResponses.filter(
      (r) => r !== null && r !== '' && r !== undefined,
    ).length;
    return total + mainAnswered + suppAnswered;
  }, 0);
}

/** Get the combined question array for a section (original + supplement). */
function getCombinedQuestions(sectionIndex: number): GenericQuestion[] {
  const section = TENDER_SECTIONS[sectionIndex];
  const config = getAssessmentConfig(section.assessmentType);
  const supplement = section.supplementGroup
    ? getSupplementDef(section.supplementGroup)
    : undefined;
  return supplement
    ? [...config.questions, ...supplement.questions]
    : config.questions;
}

/** Get the combined response array for a section. */
function getCombinedResponses(ss: SectionState): (any | null)[] {
  return [...ss.responses, ...ss.supplementResponses];
}

// ─── Component ───────────────────────────────────────────

export default function TenderAssessmentScreen() {
  const { user } = useAuth();
  const { awardXP } = useGamification();
  const router = useRouter();
  const haptics = useSoundHaptics();
  const params = useLocalSearchParams<{ startSection?: string }>();

  const [showingIntro, setShowingIntro] = useState(true);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [sectionStates, setSectionStates] = useState<SectionState[]>(
    buildInitialSectionStates,
  );
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [showingSectionBreak, setShowingSectionBreak] = useState(false);
  const [submittingSection, setSubmittingSection] = useState(false);
  const [showingCompletion, setShowingCompletion] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Retake delta state — captured before retake, shown after
  const [retakeDelta, setRetakeDelta] = useState<RetakeDeltaData | null>(null);
  const [showingRetakeDelta, setShowingRetakeDelta] = useState(false);
  const previousScoresRef = useRef<any>(null);

  // When navigated with startSection param (e.g. retake from home), run as
  // a single-section flow and return to home after submission.
  const retakeMode = useRef(params.startSection != null);
  const startSectionIdx = params.startSection != null ? parseInt(params.startSection, 10) : null;

  // Ref for debounced save
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Question fade for auto-advance
  const questionOpacity = useRef(new Animated.Value(1)).current;
  const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Celebration animation for completion screen
  const celebrationScale = useRef(new Animated.Value(0.3)).current;
  const celebrationOpacity = useRef(new Animated.Value(0)).current;

  // Fire haptics + sparkle animation when completion screen shows
  useEffect(() => {
    if (showingCompletion && !showingIntro) {
      haptics.success();
      Animated.parallel([
        Animated.spring(celebrationScale, {
          toValue: 1,
          speed: 8,
          bounciness: 10,
          useNativeDriver: true,
        }),
        Animated.timing(celebrationOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Reset for next time
      celebrationScale.setValue(0.3);
      celebrationOpacity.setValue(0);
    }
  }, [showingCompletion, showingIntro]);

  // Guard against accidental back-navigation (hardware back button)
  const hasExitedRef = useRef(false);
  const navigation = useNavigation();
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      // Allow navigation when: explicitly exited, on intro/completion screens
      if (hasExitedRef.current || showingIntro || showingCompletion || showingRetakeDelta) return;
      e.preventDefault();
      Alert.alert(
        'Leave assessment?',
        'Your progress is saved. You can resume later.',
        [
          { text: 'Keep going', style: 'cancel' },
          { text: 'Save & exit', style: 'destructive', onPress: () => navigation.dispatch(e.data.action) },
        ]
      );
    });
    return unsubscribe;
  }, [navigation, showingIntro, showingCompletion, showingRetakeDelta]);

  // ── Load saved progress on mount ──
  useEffect(() => {
    loadProgress();
  }, []);

  const PROGRESS_KEY = progressKey(user?.id);

  const loadProgress = async () => {
    try {
      // Clear any legacy (un-scoped) key to prevent cross-user leakage
      await AsyncStorage.removeItem(LEGACY_PROGRESS_KEY).catch(() => {});

      const saved = await AsyncStorage.getItem(PROGRESS_KEY);
      if (saved && startSectionIdx == null) {
        const data: OrchestratorProgress = JSON.parse(saved);
        setCurrentSectionIndex(data.currentSectionIndex);
        setSectionStates(data.sectionStates);
        setCompletedSections(data.completedSections);
        // Don't skip intro — always show welcome screen
      }

      // Smart resume: check which individual assessments are already done
      if (user) {
        const { data: existing } = await supabase
          .from('assessments')
          .select('type')
          .eq('user_id', user.id);

        if (existing && existing.length > 0) {
          const doneTypes = new Set(existing.map((r: any) => r.type));

          setSectionStates((prev) => {
            const updated = [...prev];
            let changed = false;
            TENDER_SECTIONS.forEach((sec, idx) => {
              if (doneTypes.has(sec.assessmentType) && !updated[idx].completed) {
                updated[idx] = { ...updated[idx], completed: true };
                changed = true;
              }
            });
            return changed ? updated : prev;
          });

          setCompletedSections((prev) => {
            const newCompleted = [...prev];
            let changed = false;
            TENDER_SECTIONS.forEach((sec) => {
              if (doneTypes.has(sec.assessmentType) && !newCompleted.includes(sec.assessmentType)) {
                newCompleted.push(sec.assessmentType);
                changed = true;
              }
            });
            return changed ? newCompleted : prev;
          });

          // If no saved progress, find first incomplete section
          if (!saved) {
            const firstIncomplete = TENDER_SECTIONS.findIndex(
              (sec) => !doneTypes.has(sec.assessmentType),
            );
            if (firstIncomplete >= 0) {
              setCurrentSectionIndex(firstIncomplete);
            }
            // If all done, welcome screen will show the "all complete" variant
          }
        }
      }

      // Direct-start via route param (retake from home screen)
      if (startSectionIdx != null && startSectionIdx >= 0 && startSectionIdx < TENDER_SECTIONS.length) {
        // Capture previous scores for retake delta
        if (user) {
          try {
            const assessmentType = TENDER_SECTIONS[startSectionIdx].assessmentType;
            const { data: prevData } = await supabase
              .from('assessments')
              .select('scores')
              .eq('user_id', user.id)
              .eq('type', assessmentType)
              .order('completed_at', { ascending: false })
              .limit(1);
            if (prevData && prevData.length > 0) {
              previousScoresRef.current = prevData[0].scores;
            }
          } catch {
            previousScoresRef.current = null;
          }
        }

        // Reset this section's responses for a fresh retake
        setSectionStates((prev) => {
          const updated = [...prev];
          const config = getAssessmentConfig(TENDER_SECTIONS[startSectionIdx].assessmentType);
          const supplement = TENDER_SECTIONS[startSectionIdx].supplementGroup
            ? getSupplementDef(TENDER_SECTIONS[startSectionIdx].supplementGroup!)
            : undefined;
          updated[startSectionIdx] = {
            ...updated[startSectionIdx],
            responses: new Array(config.totalQuestions).fill(null),
            supplementResponses: supplement ? new Array(supplement.questions.length).fill(null) : [],
            currentQuestionIndex: 0,
            completed: false,
          };
          return updated;
        });
        setCurrentSectionIndex(startSectionIdx);
        setShowingIntro(false);
      }
    } catch {
      // Start fresh
    } finally {
      setLoaded(true);
    }
  };

  const saveProgress = useCallback(
    (
      secIndex: number,
      secStates: SectionState[],
      done: string[],
    ) => {
      // Debounce saves
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(async () => {
        try {
          const data: OrchestratorProgress = {
            currentSectionIndex: secIndex,
            sectionStates: secStates,
            completedSections: done,
          };
          await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
        } catch {
          // Silent fail
        }
      }, 300);
    },
    [],
  );

  // ── Current section data ──
  const currentSection = TENDER_SECTIONS[currentSectionIndex];
  const currentConfig = currentSection
    ? getAssessmentConfig(currentSection.assessmentType)
    : null;
  const currentSectionState = sectionStates[currentSectionIndex];
  const combinedQuestions = getCombinedQuestions(currentSectionIndex);
  const combinedResponses = getCombinedResponses(currentSectionState);
  const totalCombined = combinedQuestions.length;
  const qIndex = currentSectionState.currentQuestionIndex;
  const currentQuestion = combinedQuestions[qIndex];
  const currentAnswer = combinedResponses[qIndex];

  const hasAnswer = (() => {
    if (currentAnswer === null || currentAnswer === '' || currentAnswer === undefined)
      return false;
    if (currentQuestion?.inputType === 'ranking' && Array.isArray(currentAnswer)) {
      return currentAnswer.length >= (currentQuestion.rankCount || 5);
    }
    return true;
  })();

  const isLastQuestionInSection = qIndex === totalCombined - 1;
  const isLastSection = currentSectionIndex === TENDER_SECTIONS.length - 1;

  // ── Skip completed sections (via effect, not during render) ──
  // IMPORTANT: This useEffect MUST be before all conditional returns
  // to satisfy React's rules of hooks (same number of hooks every render).
  useEffect(() => {
    if (loaded && !showingIntro && !showingSectionBreak && !showingCompletion && currentSectionState.completed) {
      advanceToNextSection();
    }
  }, [currentSectionIndex, currentSectionState.completed, loaded, showingIntro, showingSectionBreak, showingCompletion]);

  // ── Handlers ──

  const handleSelect = (value: any) => {
    const originalCount = currentConfig!.totalQuestions;
    const isInSupplement = qIndex >= originalCount;

    setSectionStates((prev) => {
      const updated = [...prev];
      const ss = { ...updated[currentSectionIndex] };

      if (isInSupplement) {
        const suppIndex = qIndex - originalCount;
        const newSupp = [...ss.supplementResponses];
        newSupp[suppIndex] = value;
        ss.supplementResponses = newSupp;
      } else {
        const newResp = [...ss.responses];
        newResp[qIndex] = value;
        ss.responses = newResp;
      }

      updated[currentSectionIndex] = ss;
      saveProgress(currentSectionIndex, updated, completedSections);
      return updated;
    });
  };

  const handleNext = () => {
    if (qIndex < totalCombined - 1) {
      const nextIndex = qIndex + 1;

      // Check for internal section breaks in the original assessment
      if (currentConfig?.sections && nextIndex < currentConfig.totalQuestions) {
        const fromSection = currentConfig.sections.find(
          (s) => qIndex >= s.questionRange[0] && qIndex <= s.questionRange[1],
        );
        const toSection = currentConfig.sections.find(
          (s) => nextIndex >= s.questionRange[0] && nextIndex <= s.questionRange[1],
        );
        // We skip internal breaks in the unified flow — they make it too choppy.
        // The unified flow has its own section breaks between assessment types.
      }

      setSectionStates((prev) => {
        const updated = [...prev];
        updated[currentSectionIndex] = {
          ...updated[currentSectionIndex],
          currentQuestionIndex: nextIndex,
        };
        saveProgress(currentSectionIndex, updated, completedSections);
        return updated;
      });
    }
  };

  /** Auto-advance after likert/choice selection with a brief delay + fade */
  const handleAutoAdvance = useCallback(() => {
    if (isLastQuestionInSection) return;

    // Cancel any pending timer (e.g. user taps twice quickly)
    if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);

    autoAdvanceTimer.current = setTimeout(() => {
      // Fade out
      Animated.timing(questionOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start(() => {
        handleNext();
        // Fade in
        Animated.timing(questionOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    }, 350);
  }, [isLastQuestionInSection, qIndex, totalCombined]);

  const handlePrevious = () => {
    if (qIndex > 0) {
      setSectionStates((prev) => {
        const updated = [...prev];
        updated[currentSectionIndex] = {
          ...updated[currentSectionIndex],
          currentQuestionIndex: qIndex - 1,
        };
        saveProgress(currentSectionIndex, updated, completedSections);
        return updated;
      });
    }
  };

  const handleSubmitSection = async () => {
    if (!user || !currentConfig) return;

    // Validate: all questions in this section answered
    const combined = getCombinedResponses(sectionStates[currentSectionIndex]);
    const unanswered = combined.findIndex((r, i) => {
      if (r === null || r === '' || r === undefined) return true;
      const q = combinedQuestions[i];
      if (q?.inputType === 'ranking' && Array.isArray(r)) {
        return r.length < (q.rankCount || 5);
      }
      return false;
    });

    if (unanswered !== -1) {
      const msg = `Please answer all questions in this section. Question ${unanswered + 1} is unanswered.`;
      if (typeof window !== 'undefined') {
        window.alert(msg);
      } else {
        Alert.alert('Incomplete', msg);
      }
      // Navigate to the unanswered question
      setSectionStates((prev) => {
        const updated = [...prev];
        updated[currentSectionIndex] = {
          ...updated[currentSectionIndex],
          currentQuestionIndex: unanswered,
        };
        return updated;
      });
      return;
    }

    setSubmittingSection(true);

    try {
      // Score original responses
      const originalScores = currentConfig.scoringFn(
        sectionStates[currentSectionIndex].responses,
      );

      // Score supplement responses (if any)
      let supplementScores: any = undefined;
      if (currentSection.supplementGroup) {
        const suppDef = getSupplementDef(currentSection.supplementGroup);
        if (suppDef) {
          supplementScores = suppDef.scoringFn(
            sectionStates[currentSectionIndex].supplementResponses,
          );
        }
      }

      // Build combined scores object
      const scores = supplementScores
        ? { ...originalScores, supplementScores }
        : originalScores;

      // Remove any previous record for this assessment type (handles retakes
      // and avoids duplicate-key failures on the insert)
      await supabase
        .from('assessments')
        .delete()
        .eq('user_id', user.id)
        .eq('type', currentConfig.type);

      // Save to Supabase with the ORIGINAL assessment type
      const { error } = await supabase.from('assessments').insert({
        user_id: user.id,
        type: currentConfig.type,
        responses: combined,
        scores,
        completed_at: new Date().toISOString(),
      });

      if (error) {
        const msg = 'Failed to save section results. Please try again.';
        typeof window !== 'undefined' ? window.alert(msg) : Alert.alert('Error', msg);
        setSubmittingSection(false);
        return;
      }

      // Mark section complete — build updated state synchronously so
      // auto-advance (breakAfter: false) saves correct progress.
      const newCompleted = [...completedSections, currentSection.assessmentType];
      setCompletedSections(newCompleted);

      const newStates = [...sectionStates];
      newStates[currentSectionIndex] = {
        ...newStates[currentSectionIndex],
        completed: true,
      };
      setSectionStates(newStates);
      saveProgress(currentSectionIndex, newStates, newCompleted);

      // Clear individual progress key if it existed
      try {
        await AsyncStorage.removeItem(currentConfig.progressKey);
      } catch {}

      // Award XP for completing a section (non-blocking, silent to avoid double sound with completion celebration)
      if (retakeMode.current) {
        awardXP('assessment_retake', currentConfig.type, `Retook: ${currentSection.fieldName}`, { silent: true }).catch(() => {});
      } else {
        awardXP('assessment_complete', currentConfig.type, `Completed: ${currentSection.fieldName}`, { silent: true }).catch(() => {});
      }

      // What's next?
      if (retakeMode.current) {
        // Single-section retake — compute delta and show it (or go home)
        if (previousScoresRef.current) {
          const delta = computeRetakeDelta(
            currentConfig.type,
            previousScoresRef.current,
            scores,
            currentSection.fieldName,
          );
          if (delta && delta.dimensions.length > 0) {
            setRetakeDelta(delta);
            setShowingRetakeDelta(true);
            previousScoresRef.current = null;
            return;
          }
        }
        router.replace('/(app)/home');
        return;
      }
      if (isLastSection) {
        // All done!
        await AsyncStorage.removeItem(PROGRESS_KEY);
        setShowingCompletion(true);
      } else if (currentSection.breakAfter) {
        // Show section break
        setShowingSectionBreak(true);
      } else {
        // Auto-advance to next section
        advanceToNextSection(newStates, newCompleted);
      }
    } catch (e: any) {
      const msg = 'Something went wrong. Please try again.';
      typeof window !== 'undefined' ? window.alert(msg) : Alert.alert('Error', msg);
    } finally {
      setSubmittingSection(false);
    }
  };

  const advanceToNextSection = (
    updatedStates?: SectionState[],
    updatedCompleted?: string[],
  ) => {
    const states = updatedStates || sectionStates;
    const completed = updatedCompleted || completedSections;

    // Find next incomplete section
    let nextIdx = currentSectionIndex + 1;
    while (nextIdx < TENDER_SECTIONS.length && states[nextIdx]?.completed) {
      nextIdx++;
    }

    if (nextIdx >= TENDER_SECTIONS.length) {
      // All done
      AsyncStorage.removeItem(PROGRESS_KEY);
      setShowingCompletion(true);
      return;
    }

    setCurrentSectionIndex(nextIdx);
    setShowingSectionBreak(false);
    saveProgress(nextIdx, states, completed);
  };

  const handleSaveAndExit = async () => {
    saveProgress(currentSectionIndex, sectionStates, completedSections);
    // Force immediate save (bypass debounce)
    try {
      const data: OrchestratorProgress = {
        currentSectionIndex,
        sectionStates,
        completedSections,
      };
      await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
    } catch {}
    hasExitedRef.current = true;
    router.replace('/(app)/home');
  };

  // ── Welcome screen helpers ──
  // IMPORTANT: These must be defined BEFORE any conditional returns.
  // The React Compiler (enabled in app.json) may add memoization hooks
  // for these functions. If they appear after a conditional return, the
  // hook count changes between renders, causing React Error #310.

  /** Determine chapter status for a given section index. */
  const getChapterStatus = (idx: number): 'complete' | 'in_progress' | 'not_started' => {
    if (completedSections.includes(TENDER_SECTIONS[idx].assessmentType)) return 'complete';
    const ss = sectionStates[idx];
    if (ss && ss.responses.some((r) => r !== null && r !== '' && r !== undefined)) return 'in_progress';
    return 'not_started';
  };

  /** Reset a section's state and start it fresh. Captures previous scores for delta. */
  const startChapterFresh = async (idx: number) => {
    const assessmentType = TENDER_SECTIONS[idx].assessmentType;

    // Capture previous scores before clearing (for retake delta)
    if (user) {
      try {
        const { data } = await supabase
          .from('assessments')
          .select('scores')
          .eq('user_id', user.id)
          .eq('type', assessmentType)
          .order('completed_at', { ascending: false })
          .limit(1);
        if (data && data.length > 0) {
          previousScoresRef.current = data[0].scores;
        }
      } catch {
        previousScoresRef.current = null;
      }
    }

    const config = getAssessmentConfig(assessmentType);
    const supplement = TENDER_SECTIONS[idx].supplementGroup
      ? getSupplementDef(TENDER_SECTIONS[idx].supplementGroup!)
      : undefined;
    setSectionStates((prev) => {
      const updated = [...prev];
      updated[idx] = {
        ...updated[idx],
        responses: new Array(config.totalQuestions).fill(null),
        supplementResponses: supplement ? new Array(supplement.questions.length).fill(null) : [],
        currentQuestionIndex: 0,
        completed: false,
      };
      return updated;
    });
    setCompletedSections((prev) => prev.filter((t) => t !== assessmentType));
    setShowingCompletion(false);
    setCurrentSectionIndex(idx);
    setShowingIntro(false);
  };

  /** Handle tapping a chapter card. */
  const handleChapterTap = (idx: number) => {
    const status = getChapterStatus(idx);
    if (status === 'complete') {
      // Use Alert.alert on native, window.confirm on web
      if (Platform.OS === 'web' && typeof window !== 'undefined' && typeof window.confirm === 'function') {
        const confirmed = window.confirm('Retake this chapter?\n\nYour previous answers will be replaced with your new ones.');
        if (confirmed) {
          startChapterFresh(idx);
        }
      } else {
        Alert.alert(
          'Retake this chapter?',
          'Your previous answers will be replaced with your new ones.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Retake', onPress: () => startChapterFresh(idx) },
          ],
        );
      }
    } else {
      // Not started or in-progress — jump directly
      setCurrentSectionIndex(idx);
      setShowingIntro(false);
    }
  };

  /** Handle the main CTA button press. */
  const handleWelcomeCTA = () => {
    const alreadyDone = completedSections.length;
    if (alreadyDone >= TENDER_SECTIONS.length) {
      // All done — view portrait
      router.replace('/(app)/home');
      return;
    }
    // Find first incomplete section
    const firstIncomplete = TENDER_SECTIONS.findIndex(
      (sec) => !completedSections.includes(sec.assessmentType),
    );
    setCurrentSectionIndex(firstIncomplete >= 0 ? firstIncomplete : 0);
    setShowingIntro(false);
  };

  // ── Derived values for question flow (must be computed before conditional
  // returns, because the React Compiler may auto-memoize them via hidden hooks) ──
  const sectionProgress = ((qIndex + 1) / totalCombined) * 100;
  const globalAnswered = countTotalAnswered(sectionStates);
  const globalProgress = (globalAnswered / TOTAL_QUESTIONS) * 100;

  // ── Render: Loading ──
  if (!loaded) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── Render: Retake Delta (shown after completing a single-section retake) ──
  if (showingRetakeDelta && retakeDelta) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <RetakeDeltaComponent
            delta={retakeDelta}
            onContinue={() => {
              setShowingRetakeDelta(false);
              setRetakeDelta(null);
              router.replace('/(app)/home');
            }}
          />
        </View>
      </SafeAreaView>
    );
  }

  // ── Render: Completion (only after finishing last section in-flow) ──
  // If the welcome screen is still showing, skip this — the welcome screen
  // has its own "all complete" variant with retake options.
  if (showingCompletion && !showingIntro) {
    return (
      <SafeAreaView style={styles.container}>
        <CelebrationDots active />
        <View style={styles.centerContent}>
          <Animated.View style={{
            marginBottom: Spacing.sm,
            transform: [{ scale: celebrationScale }],
            opacity: celebrationOpacity,
          }}>
            <SparkleIcon size={64} color={Colors.secondary} />
          </Animated.View>
          <Text style={styles.completionTitle}>You Did Something Brave</Text>
          <Text style={styles.completionSubtitle}>
            All 7 sections are complete. You've built a full picture of how you
            connect, feel, fight, and what matters to you. Your relational
            portrait is ready.
          </Text>
          <TenderButton
            title="Explore Your Portrait"
            onPress={() => router.replace('/(app)/home')}
            variant="primary"
            size="lg"
            accessibilityLabel="Explore Your Portrait"
            style={{ marginTop: Spacing.md }}
          />
        </View>
      </SafeAreaView>
    );
  }

  // ── Render: Welcome Screen ──
  if (showingIntro) {
    const alreadyDone = completedSections.length;
    const allComplete = alreadyDone >= TENDER_SECTIONS.length;

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.welcomeContent} showsVerticalScrollIndicator={false}>
          {/* Title block */}
          <Text style={styles.welcomeTitle}>THE TENDER ASSESSMENT</Text>
          <Text style={styles.welcomeSubtitle}>Seven chapters. One portrait of you.</Text>

          {/* Ornamental divider */}
          <View style={styles.ornamentRow}>
            <View style={styles.ornamentLine} />
            <View style={styles.ornamentSymbol}>
              <SparkleIcon size={12} color={Colors.secondary} />
            </View>
            <View style={styles.ornamentLine} />
          </View>

          {/* Intro copy or completion message */}
          {allComplete ? (
            <View style={styles.welcomeTextBlock}>
              <Text style={styles.welcomeBody}>
                All seven chapters — complete.{'\n'}Your portrait is ready.
              </Text>
              <Text style={styles.welcomeBodyMuted}>
                Want to revisit a chapter? Tap any one below.
              </Text>
            </View>
          ) : (
            <View style={styles.welcomeTextBlock}>
              <Text style={styles.welcomeBody}>
                This is not a quiz. It is a way of listening to yourself — slowly, honestly, and without judgment. Across seven chapters, you will explore how you connect, how you fight, what you feel, and what you value. Together, your answers will form a relational portrait: a living reflection of how you show up in your closest relationships.
              </Text>
              <Text style={styles.welcomeEmphasis}>
                It's worth it. You're worth it.
              </Text>
            </View>
          )}

          {/* Guidelines (show only if not all complete) */}
          {!allComplete && (
            <View style={styles.guidelinesBlock}>
              <View style={styles.guidelineRow}>
                <View style={styles.guidelineIcon}><SparkleIcon size={16} color={Colors.secondary} /></View>
                <Text style={styles.guidelineText}>Go in any order</Text>
              </View>
              <View style={styles.guidelineRow}>
                <View style={styles.guidelineIcon}><BookOpenIcon size={16} color={Colors.secondary} /></View>
                <Text style={styles.guidelineText}>Save and return anytime</Text>
              </View>
              <View style={styles.guidelineRow}>
                <View style={styles.guidelineIcon}><RefreshIcon size={16} color={Colors.secondary} /></View>
                <Text style={styles.guidelineText}>Retake any chapter</Text>
              </View>
              <View style={styles.guidelineRow}>
                <View style={styles.guidelineIcon}><HeartIcon size={16} color={Colors.secondary} /></View>
                <Text style={styles.guidelineText}>No wrong answers</Text>
              </View>
            </View>
          )}

          {/* Ornamental divider */}
          <View style={styles.ornamentRow}>
            <View style={styles.ornamentLine} />
            <View style={styles.ornamentSymbol}>
              <SparkleIcon size={12} color={Colors.secondary} />
            </View>
            <View style={styles.ornamentLine} />
          </View>

          {/* Chapter cards */}
          <View style={styles.chapterList}>
            {TENDER_SECTIONS.map((sec, idx) => {
              const status = getChapterStatus(idx);
              return (
                <TouchableOpacity
                  key={sec.assessmentType}
                  style={styles.chapterCard}
                  onPress={() => handleChapterTap(idx)}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                >
                  {/* Status circle */}
                  <View style={[
                    styles.chapterStatusCircle,
                    status === 'complete' && styles.chapterStatusComplete,
                    status === 'in_progress' && styles.chapterStatusInProgress,
                  ]}>
                    {status === 'complete' && (
                      <Text style={styles.chapterStatusCheck}>{'✓'}</Text>
                    )}
                    {status === 'in_progress' && (
                      <View style={styles.chapterStatusHalf} />
                    )}
                  </View>

                  {/* Chapter info */}
                  <View style={styles.chapterInfo}>
                    <Text style={styles.chapterLabel}>CHAPTER {sec.sectionNumber}</Text>
                    <Text style={styles.chapterName}>{sec.fieldName}</Text>
                    <Text style={styles.chapterDesc} numberOfLines={2}>{sec.fieldDescription}</Text>
                    <Text style={styles.chapterTime}>~{sec.estimatedMinutes} min</Text>
                  </View>

                  {/* Chevron */}
                  <Text style={styles.chapterChevron}>{'›'}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* CTA button */}
          <TenderButton
            title={
              allComplete
                ? 'VIEW PORTRAIT'
                : alreadyDone > 0
                ? 'CONTINUE'
                : 'BEGIN CHAPTER 1'
            }
            onPress={handleWelcomeCTA}
            variant="primary"
            size="lg"
            fullWidth
            accessibilityLabel={
              allComplete
                ? 'View Portrait'
                : alreadyDone > 0
                ? 'Continue Assessment'
                : 'Begin Chapter 1'
            }
            style={{ marginTop: Spacing.lg }}
            textStyle={{ letterSpacing: 1 }}
          />

          {/* Caption below CTA */}
          {!allComplete && (
            <Text style={styles.welcomeCaption}>
              or choose your starting point above
            </Text>
          )}

          {/* Back link */}
          <TenderButton
            title="Back"
            onPress={() => router.back()}
            variant="ghost"
            size="lg"
            fullWidth
            accessibilityLabel="Back"
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Render: Section Break ──
  if (showingSectionBreak) {
    const nextIdx = currentSectionIndex + 1;
    const nextSection = nextIdx < TENDER_SECTIONS.length ? TENDER_SECTIONS[nextIdx] : null;
    const totalAnswered = countTotalAnswered(sectionStates);

    // Build a pseudo-section for the SectionBreak component
    const breakSection = nextSection
      ? {
          id: nextSection.assessmentType,
          title: `Section ${nextSection.sectionNumber}: ${nextSection.fieldName}`,
          description: nextSection.fieldDescription,
          questionRange: [0, 0] as [number, number],
        }
      : {
          id: 'done',
          title: 'Assessment Complete',
          description: 'All sections are finished.',
          questionRange: [0, 0] as [number, number],
        };

    return (
      <SectionBreak
        section={breakSection}
        totalQuestions={TOTAL_QUESTIONS}
        questionsCompleted={totalAnswered}
        onContinue={advanceToNextSection}
        onSaveAndExit={handleSaveAndExit}
        sectionName={currentSection.fieldName}
        encouragingMessage={currentSection.breakMessage}
        sectionProgress={{
          completed: completedSections.length,
          total: TENDER_SECTIONS.length,
        }}
      />
    );
  }

  // If current section is already completed, render nothing while the
  // useEffect above triggers advanceToNextSection.
  if (currentSectionState.completed) {
    return null;
  }

  // ── Render: Question Flow ──
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Top bar: section indicator + save & exit */}
        <View style={styles.topBar}>
          <View style={styles.progressSection}>
            {/* Section-level progress */}
            <Text style={styles.sectionLabel}>
              Section {currentSection.sectionNumber} of {TENDER_SECTIONS.length}: {currentSection.fieldName}
            </Text>

            {/* Segment bar */}
            <View style={styles.segmentBar}>
              {TENDER_SECTIONS.map((sec, idx) => (
                <View
                  key={sec.assessmentType}
                  style={[
                    styles.segment,
                    idx < completedSections.length && styles.segmentDone,
                    idx === currentSectionIndex && styles.segmentActive,
                  ]}
                />
              ))}
            </View>

            {/* Question-level progress */}
            <Text style={styles.progressText} accessibilityLiveRegion="polite">
              Question {qIndex + 1} of {totalCombined}
            </Text>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${sectionProgress}%` }]} />
            </View>
            <Text style={styles.percentText} accessibilityLiveRegion="polite">
              {Math.round(globalProgress)}% of total assessment
            </Text>
          </View>

          <TenderButton
            title="Save & Exit"
            onPress={handleSaveAndExit}
            variant="ghost"
            size="sm"
            accessibilityLabel="Save and Exit"
          />
        </View>

        {/* Question */}
        <ScrollView
          style={styles.questionScroll}
          contentContainerStyle={styles.questionScrollContent}
        >
          <Animated.View style={{ opacity: questionOpacity }}>
            <Text style={styles.questionText}>"{currentQuestion?.text}"</Text>

            <QuestionRenderer
              question={currentQuestion}
              currentAnswer={currentAnswer}
              onSelect={handleSelect}
              defaultLikertScale={currentConfig?.likertScale}
              onAutoAdvance={handleAutoAdvance}
            />
          </Animated.View>
        </ScrollView>

        {/* Navigation */}
        <View style={styles.navSection}>
          <TouchableOpacity
            style={[styles.navButton, qIndex === 0 && styles.navButtonDisabled]}
            onPress={handlePrevious}
            disabled={qIndex === 0}
            accessibilityRole="button"
            accessibilityState={{ disabled: qIndex === 0 }}
          >
            <Text
              style={[
                styles.navButtonText,
                qIndex === 0 && styles.navButtonTextDisabled,
              ]}
            >
              Previous
            </Text>
          </TouchableOpacity>

          {isLastQuestionInSection ? (
            <View style={{ flex: 1 }}>
              <TenderButton
                title={isLastSection ? 'Complete Assessment' : 'Complete Section'}
                onPress={handleSubmitSection}
                variant="primary"
                size="lg"
                loading={submittingSection}
                disabled={!hasAnswer}
                fullWidth
                accessibilityLabel={isLastSection ? 'Complete Assessment' : 'Complete Section'}
                style={{ backgroundColor: Colors.success }}
              />
            </View>
          ) : (currentQuestion?.inputType === 'text' || currentQuestion?.inputType === 'ranking') ? (
            <TouchableOpacity
              style={[styles.navButton, styles.navButtonPrimary]}
              onPress={handleNext}
              accessibilityRole="button"
            >
              <Text style={styles.navButtonPrimaryText}>
                {hasAnswer ? 'Next' : 'Skip'}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* FTUE Welcome Audio */}
      <WelcomeAudio screenKey="assessment" />
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1, padding: Spacing.xl, justifyContent: 'space-between' },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    gap: Spacing.lg,
  },
  loadingText: {
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
  },

  // ── Completion ──
  completionTitle: {
    fontSize: FontSizes.headingL,
    fontWeight: 'bold',
    color: Colors.text,
    fontFamily: FontFamilies.heading,
    textAlign: 'center',
  },
  completionSubtitle: {
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
  },
  completionButton: {
    backgroundColor: Colors.primary,
    height: ButtonSizes.large,
    borderRadius: BorderRadius.pill,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.md,
  },
  completionButtonText: {
    color: Colors.white,
    fontSize: FontSizes.body,
    fontWeight: '600',
  },

  // ── Welcome Screen ──
  welcomeContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xl,
  },
  welcomeTitle: {
    fontSize: FontSizes.headingL,
    fontFamily: FontFamilies.heading,
    color: Colors.text,
    textAlign: 'center',
    letterSpacing: 3,
    fontWeight: '300',
  },
  welcomeSubtitle: {
    fontSize: FontSizes.body,
    fontFamily: FontFamilies.heading,
    fontStyle: 'italic',
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },

  // Ornamental divider
  ornamentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
  },
  ornamentLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.borderLight,
  },
  ornamentSymbol: {
    marginHorizontal: Spacing.md,
  },

  // Text block
  welcomeTextBlock: {
    gap: Spacing.md,
  },
  welcomeBody: {
    fontSize: FontSizes.bodySmall,
    fontFamily: FontFamilies.body,
    color: Colors.textSecondary,
    lineHeight: 22,
    textAlign: 'center',
  },
  welcomeBodyMuted: {
    fontSize: FontSizes.bodySmall,
    fontFamily: FontFamilies.body,
    color: Colors.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  welcomeEmphasis: {
    fontSize: FontSizes.body,
    fontFamily: FontFamilies.heading,
    fontStyle: 'italic',
    color: Colors.secondary,
    textAlign: 'center',
  },

  // Guidelines
  guidelinesBlock: {
    gap: Spacing.sm,
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  guidelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  guidelineIcon: {
    width: 24,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  guidelineText: {
    fontSize: FontSizes.bodySmall,
    fontFamily: FontFamilies.body,
    color: Colors.textSecondary,
  },

  // Chapter cards
  chapterList: {
    gap: Spacing.sm,
  },
  chapterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: Spacing.md,
    ...Shadows.card,
  },
  chapterStatusCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  chapterStatusComplete: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  chapterStatusInProgress: {
    borderColor: Colors.secondary,
  },
  chapterStatusCheck: {
    color: Colors.white,
    fontSize: FontSizes.bodySmall,
    fontWeight: '700',
  },
  chapterStatusHalf: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.secondary,
    opacity: 0.5,
  },
  chapterInfo: {
    flex: 1,
  },
  chapterLabel: {
    fontSize: FontSizes.caption,
    fontFamily: FontFamilies.body,
    color: Colors.textMuted,
    letterSpacing: 1.5,
    fontWeight: '600',
    marginBottom: 2,
  },
  chapterName: {
    fontSize: FontSizes.body,
    fontFamily: FontFamilies.heading,
    color: Colors.text,
    fontWeight: '500',
  },
  chapterDesc: {
    fontSize: FontSizes.caption,
    fontFamily: FontFamilies.body,
    color: Colors.textSecondary,
    lineHeight: 16,
    marginTop: 2,
  },
  chapterTime: {
    fontSize: FontSizes.caption,
    fontFamily: FontFamilies.body,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
  chapterChevron: {
    fontSize: FontSizes.headingL,
    color: Colors.textMuted,
    marginLeft: Spacing.sm,
  },

  // CTA
  welcomeCTA: {
    backgroundColor: Colors.primary,
    height: ButtonSizes.large,
    borderRadius: BorderRadius.pill,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  welcomeCTAText: {
    color: Colors.white,
    fontSize: FontSizes.body,
    fontWeight: '600',
    letterSpacing: 1,
  },
  welcomeCaption: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.sm,
    fontStyle: 'italic',
  },
  welcomeBackButton: {
    height: ButtonSizes.large,
    borderRadius: BorderRadius.pill,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  welcomeBackText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.body,
    fontWeight: '600',
  },

  // ── Top Bar ──
  topBar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  progressSection: { flex: 1, gap: Spacing.xs },
  sectionLabel: {
    fontSize: FontSizes.bodySmall,
    color: Colors.primary,
    fontWeight: '700',
  },
  segmentBar: {
    flexDirection: 'row',
    gap: 3,
    height: 4,
  },
  segment: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 2,
  },
  segmentDone: {
    backgroundColor: Colors.success,
  },
  segmentActive: {
    backgroundColor: Colors.primary,
  },
  progressText: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginTop: Spacing.xs,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: Colors.surface,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  percentText: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
  },
  saveExitButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  saveExitText: {
    fontSize: FontSizes.caption,
    color: Colors.primary,
    fontWeight: '600',
  },

  // ── Question ──
  questionScroll: { flex: 1 },
  questionScrollContent: { paddingVertical: Spacing.lg },
  questionText: {
    fontSize: FontSizes.headingS,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 24,
    fontStyle: 'italic',
    fontFamily: FontFamilies.body,
    marginBottom: Spacing.lg,
  },

  // ── Navigation ──
  navSection: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.lg },
  navButton: {
    flex: 1,
    height: ButtonSizes.large,
    borderRadius: BorderRadius.pill,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  navButtonPrimary: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  navButtonDisabled: { opacity: 0.4 },
  navButtonText: {
    fontSize: FontSizes.body,
    color: Colors.text,
    fontWeight: '600',
  },
  navButtonTextDisabled: { color: Colors.textSecondary },
  navButtonPrimaryText: {
    fontSize: FontSizes.body,
    color: Colors.white,
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    height: ButtonSizes.large,
    borderRadius: BorderRadius.pill,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.success,
    paddingHorizontal: Spacing.sm,
  },
  submitButtonText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.white,
    fontWeight: '700',
    textAlign: 'center' as const,
  },
});
