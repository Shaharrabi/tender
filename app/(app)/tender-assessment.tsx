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
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/services/supabase';
import { getAssessmentConfig } from '@/utils/assessments/registry';
import { TENDER_SECTIONS, TOTAL_QUESTIONS, TOTAL_ESTIMATED_MINUTES } from '@/utils/assessments/tender-sections';
import { getSupplementDef } from '@/utils/assessments/supplements';
import QuestionRenderer from '@/components/assessment/QuestionRenderer';
import SectionBreak from '@/components/assessment/SectionBreak';
import { Colors, Spacing, FontSizes, FontFamilies, ButtonSizes, BorderRadius } from '@/constants/theme';
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

const PROGRESS_KEY = 'tender_assessment_progress';

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
  const router = useRouter();

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

  // Ref for debounced save
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Load saved progress on mount ──
  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const saved = await AsyncStorage.getItem(PROGRESS_KEY);
      if (saved) {
        const data: OrchestratorProgress = JSON.parse(saved);
        setCurrentSectionIndex(data.currentSectionIndex);
        setSectionStates(data.sectionStates);
        setCompletedSections(data.completedSections);
        setShowingIntro(false);
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

          // If resuming and no saved progress, find first incomplete section
          if (!saved) {
            const firstIncomplete = TENDER_SECTIONS.findIndex(
              (sec) => !doneTypes.has(sec.assessmentType),
            );
            if (firstIncomplete >= 0) {
              setCurrentSectionIndex(firstIncomplete);
            } else {
              // All done
              setShowingCompletion(true);
            }
          }
        }
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
      Alert.alert(
        'Incomplete',
        `Please answer all questions in this section. Question ${unanswered + 1} is unanswered.`,
        [{
          text: 'Go to question',
          onPress: () => {
            setSectionStates((prev) => {
              const updated = [...prev];
              updated[currentSectionIndex] = {
                ...updated[currentSectionIndex],
                currentQuestionIndex: unanswered,
              };
              return updated;
            });
          },
        }],
      );
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

      // Save to Supabase with the ORIGINAL assessment type
      const { error } = await supabase.from('assessments').insert({
        user_id: user.id,
        type: currentConfig.type,
        responses: combined,
        scores,
        completed_at: new Date().toISOString(),
      });

      if (error) {
        Alert.alert('Error', 'Failed to save section results. Please try again.');
        setSubmittingSection(false);
        return;
      }

      // Mark section complete
      const newCompleted = [...completedSections, currentSection.assessmentType];
      setCompletedSections(newCompleted);

      setSectionStates((prev) => {
        const updated = [...prev];
        updated[currentSectionIndex] = {
          ...updated[currentSectionIndex],
          completed: true,
        };
        saveProgress(currentSectionIndex, updated, newCompleted);
        return updated;
      });

      // Clear individual progress key if it existed
      try {
        await AsyncStorage.removeItem(currentConfig.progressKey);
      } catch {}

      // What's next?
      if (isLastSection) {
        // All done!
        await AsyncStorage.removeItem(PROGRESS_KEY);
        setShowingCompletion(true);
      } else if (currentSection.breakAfter) {
        // Show section break
        setShowingSectionBreak(true);
      } else {
        // Auto-advance to next section
        advanceToNextSection();
      }
    } catch (e: any) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setSubmittingSection(false);
    }
  };

  const advanceToNextSection = () => {
    // Find next incomplete section
    let nextIdx = currentSectionIndex + 1;
    while (nextIdx < TENDER_SECTIONS.length && sectionStates[nextIdx]?.completed) {
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
    saveProgress(nextIdx, sectionStates, completedSections);
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
    router.replace('/(app)/home');
  };

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

  // ── Render: Completion ──
  if (showingCompletion) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.completionEmoji}>{'\u2728'}</Text>
          <Text style={styles.completionTitle}>Assessment Complete</Text>
          <Text style={styles.completionSubtitle}>
            You have completed all 7 sections of The Tender Assessment.
            Your relational portrait is ready to be explored.
          </Text>
          <TouchableOpacity
            style={styles.completionButton}
            onPress={() => router.replace('/(app)/home')}
          >
            <Text style={styles.completionButtonText}>View Your Results</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Render: Intro ──
  if (showingIntro) {
    const alreadyDone = completedSections.length;
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.introContent}>
          <Text style={styles.introTitle}>The Tender Assessment</Text>
          <Text style={styles.introSubtitle}>
            {TOTAL_QUESTIONS} questions across {TENDER_SECTIONS.length} sections {'\u00B7'} ~{TOTAL_ESTIMATED_MINUTES} minutes
          </Text>

          {alreadyDone > 0 && (
            <View style={styles.resumeBanner}>
              <Text style={styles.resumeText}>
                {alreadyDone} of {TENDER_SECTIONS.length} sections already completed. You will pick up where you left off.
              </Text>
            </View>
          )}

          <View style={styles.introSections}>
            {TENDER_SECTIONS.map((sec, idx) => {
              const isDone = completedSections.includes(sec.assessmentType);
              return (
                <View key={sec.assessmentType} style={styles.introSectionRow}>
                  <View style={[styles.introSectionBadge, isDone && styles.introSectionBadgeDone]}>
                    <Text style={[styles.introSectionNumber, isDone && styles.introSectionNumberDone]}>
                      {isDone ? '\u2713' : sec.sectionNumber}
                    </Text>
                  </View>
                  <View style={styles.introSectionInfo}>
                    <Text style={[styles.introSectionName, isDone && styles.introSectionNameDone]}>
                      {sec.fieldName}
                    </Text>
                    <Text style={styles.introSectionMeta}>
                      ~{sec.estimatedMinutes} min
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>

          <View style={styles.introNote}>
            <Text style={styles.introNoteText}>
              You can save and exit at any section break and come back later.
              Your answers help build your complete relational portrait.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.introStartButton}
            onPress={() => setShowingIntro(false)}
          >
            <Text style={styles.introStartButtonText}>
              {alreadyDone > 0 ? 'Continue' : 'Begin'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.introCancelButton}
            onPress={() => router.back()}
          >
            <Text style={styles.introCancelButtonText}>Cancel</Text>
          </TouchableOpacity>
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

  // ── Render: Skip completed sections ──
  if (currentSectionState.completed) {
    advanceToNextSection();
    return null;
  }

  // ── Render: Question Flow ──
  const sectionProgress = ((qIndex + 1) / totalCombined) * 100;
  const globalAnswered = countTotalAnswered(sectionStates);
  const globalProgress = (globalAnswered / TOTAL_QUESTIONS) * 100;

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
            <Text style={styles.progressText}>
              Question {qIndex + 1} of {totalCombined}
            </Text>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${sectionProgress}%` }]} />
            </View>
            <Text style={styles.percentText}>
              {Math.round(globalProgress)}% of total assessment
            </Text>
          </View>

          <TouchableOpacity
            style={styles.saveExitButton}
            onPress={handleSaveAndExit}
          >
            <Text style={styles.saveExitText}>Save & Exit</Text>
          </TouchableOpacity>
        </View>

        {/* Question */}
        <ScrollView
          style={styles.questionScroll}
          contentContainerStyle={styles.questionScrollContent}
        >
          <Text style={styles.questionText}>"{currentQuestion?.text}"</Text>

          <QuestionRenderer
            question={currentQuestion}
            currentAnswer={currentAnswer}
            onSelect={handleSelect}
            defaultLikertScale={currentConfig?.likertScale}
          />
        </ScrollView>

        {/* Navigation */}
        <View style={styles.navSection}>
          <TouchableOpacity
            style={[styles.navButton, qIndex === 0 && styles.navButtonDisabled]}
            onPress={handlePrevious}
            disabled={qIndex === 0}
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
            <TouchableOpacity
              style={[
                styles.submitButton,
                (!hasAnswer || submittingSection) && styles.navButtonDisabled,
              ]}
              onPress={handleSubmitSection}
              disabled={!hasAnswer || submittingSection}
            >
              <Text style={styles.submitButtonText}>
                {submittingSection
                  ? 'Saving...'
                  : isLastSection
                  ? 'Complete Assessment'
                  : 'Complete Section'}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.navButton, styles.navButtonPrimary]}
              onPress={handleNext}
            >
              <Text style={styles.navButtonPrimaryText}>
                {hasAnswer ? 'Next' : 'Skip'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
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
  completionEmoji: { fontSize: 64 },
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

  // ── Intro ──
  introContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: Spacing.lg,
  },
  introTitle: {
    fontSize: FontSizes.headingL,
    fontWeight: 'bold',
    color: Colors.text,
    fontFamily: FontFamilies.heading,
    textAlign: 'center',
  },
  introSubtitle: {
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  resumeBanner: {
    backgroundColor: '#EEF2FF',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  resumeText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.primary,
    textAlign: 'center',
    fontWeight: '500',
  },
  introSections: {
    gap: Spacing.sm,
    marginVertical: Spacing.md,
  },
  introSectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  introSectionBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  introSectionBadgeDone: {
    backgroundColor: Colors.success,
  },
  introSectionNumber: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  introSectionNumberDone: {
    color: Colors.white,
  },
  introSectionInfo: { flex: 1 },
  introSectionName: {
    fontSize: FontSizes.body,
    fontWeight: '500',
    color: Colors.text,
  },
  introSectionNameDone: {
    color: Colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  introSectionMeta: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
  },
  introNote: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  introNoteText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
    textAlign: 'center',
  },
  introStartButton: {
    backgroundColor: Colors.primary,
    height: ButtonSizes.large,
    borderRadius: BorderRadius.pill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  introStartButtonText: {
    color: Colors.white,
    fontSize: FontSizes.body,
    fontWeight: '600',
  },
  introCancelButton: {
    height: ButtonSizes.large,
    borderRadius: BorderRadius.pill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  introCancelButtonText: {
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
    fontSize: FontSizes.headingM,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 28,
    fontStyle: 'italic',
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
  },
  submitButtonText: {
    fontSize: FontSizes.body,
    color: Colors.white,
    fontWeight: '600',
  },
});
