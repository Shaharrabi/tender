import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
  Animated,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/context/AuthContext';
import { getAssessmentConfig, isDyadicAssessment } from '@/utils/assessments/registry';
import { saveDyadicAssessment } from '@/services/couples';
import { supabase } from '@/services/supabase';
import { Colors, Spacing, FontSizes, ButtonSizes, FontFamilies, BorderRadius } from '@/constants/theme';
import QuickLinksBar from '@/components/QuickLinksBar';
import TenderButton from '@/components/ui/TenderButton';
import SectionBreak from '@/components/assessment/SectionBreak';
import QuestionRenderer from '@/components/assessment/QuestionRenderer';
import type { AssessmentConfig, AssessmentSection, GenericQuestion, DyadicAssessmentType } from '@/types';

export default function AssessmentScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams<{ type: string; coupleId?: string }>();
  const assessmentType = params.type || 'ecr-r';
  const coupleId = params.coupleId;

  let config: AssessmentConfig;
  try {
    config = getAssessmentConfig(assessmentType as any);
  } catch {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.questionText}>Unknown assessment type: {assessmentType}</Text>
          <TouchableOpacity style={styles.navButton} onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Go Back">
            <Text style={styles.navButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // User-scoped progress key to prevent cross-user data leakage
  const PROGRESS_KEY = user?.id
    ? `${config.progressKey}_${user.id}`
    : config.progressKey;
  const LEGACY_KEY = config.progressKey; // un-scoped key to clean up

  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<(any | null)[]>(
    new Array(config.totalQuestions).fill(null)
  );
  const [submitting, setSubmitting] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [sectionBreak, setSectionBreak] = useState<AssessmentSection | null>(null);
  const questionOpacity = useRef(new Animated.Value(1)).current;
  const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      // Clear legacy un-scoped key to prevent cross-user leakage
      await AsyncStorage.removeItem(LEGACY_KEY).catch(() => {});

      const saved = await AsyncStorage.getItem(PROGRESS_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        setResponses(data.responses);
        setCurrentIndex(data.currentIndex);
        setShowInstructions(false);
      }
    } catch {
      // Start fresh
    }
  };

  const saveProgress = async (newResponses: (any | null)[], newIndex: number) => {
    try {
      await AsyncStorage.setItem(
        PROGRESS_KEY,
        JSON.stringify({ responses: newResponses, currentIndex: newIndex })
      );
    } catch {
      // Silent fail
    }
  };

  const handleSelect = (value: any) => {
    const newResponses = [...responses];
    newResponses[currentIndex] = value;
    setResponses(newResponses);
    saveProgress(newResponses, currentIndex);
  };

  /** Auto-advance after likert/choice selection with a brief delay + fade */
  const handleAutoAdvance = useCallback(() => {
    const isLast = currentIndex >= config.totalQuestions - 1;
    if (isLast) return;

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
  }, [currentIndex, config.totalQuestions]);

  const findNextSection = (fromIndex: number, toIndex: number): AssessmentSection | null => {
    if (!config.sections) return null;
    const fromSection = config.sections.find(
      (s) => fromIndex >= s.questionRange[0] && fromIndex <= s.questionRange[1]
    );
    const toSection = config.sections.find(
      (s) => toIndex >= s.questionRange[0] && toIndex <= s.questionRange[1]
    );
    if (fromSection && toSection && fromSection.id !== toSection.id) {
      return toSection;
    }
    return null;
  };

  const handleNext = () => {
    if (currentIndex < config.totalQuestions - 1) {
      const nextIndex = currentIndex + 1;
      const nextSection = findNextSection(currentIndex, nextIndex);
      if (nextSection) {
        setSectionBreak(nextSection);
        saveProgress(responses, nextIndex);
        return;
      }
      setCurrentIndex(nextIndex);
      saveProgress(responses, nextIndex);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      saveProgress(responses, prevIndex);
    }
  };

  const handleSectionContinue = () => {
    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    setSectionBreak(null);
  };

  const handleSaveAndExit = () => {
    setSectionBreak(null);
    // Navigate to couple portal for dyadic assessments, home for individual
    if (isDyadicAssessment(config.type as any)) {
      router.replace('/(app)/couple-portal');
    } else {
      router.replace('/(app)/home');
    }
  };

  const handleSubmit = async () => {
    const unanswered = responses.findIndex((r, i) => {
      if (r === null || r === '' || r === undefined) return true;
      // Ranking questions need enough selections
      const q = config.questions[i];
      if (q?.inputType === 'ranking' && Array.isArray(r)) {
        return r.length < (q.rankCount || 5);
      }
      return false;
    });
    if (unanswered !== -1) {
      Alert.alert(
        'Incomplete',
        `Please answer all questions. Question ${unanswered + 1} is unanswered.`,
        [{ text: 'Go to question', onPress: () => setCurrentIndex(unanswered) }]
      );
      return;
    }

    setSubmitting(true);
    try {
      const scores = config.scoringFn(responses);

      // Always save to assessments table (backward compat + individual record)
      const { error } = await supabase.from('assessments').insert({
        user_id: user!.id,
        type: config.type,
        responses,
        scores,
        completed_at: new Date().toISOString(),
      });

      if (error) {
        Alert.alert('Error', 'Failed to save results. Please try again.');
        setSubmitting(false);
        return;
      }

      // For dyadic assessments, ALSO save to dyadic_assessments table (couple-keyed)
      // This is what checkDyadicCompletion() and getLatestDyadicScores() read from
      if (isDyadicAssessment(config.type as any) && coupleId) {
        try {
          await saveDyadicAssessment(
            user!.id,
            coupleId,
            config.type as DyadicAssessmentType,
            responses,
            scores,
          );
          console.log('[Assessment] Dyadic record saved successfully for', config.type);
        } catch (dyadicErr: any) {
          console.error('[Assessment] Dyadic save FAILED:', dyadicErr);
          Alert.alert(
            'Couple Record Issue',
            `Your answers were saved, but the couple record failed: ${dyadicErr?.message || 'Unknown error'}. The partner screen may still show "Not started". Please try retaking the assessment.`,
          );
        }
      }

      await AsyncStorage.removeItem(PROGRESS_KEY);
      await AsyncStorage.removeItem(LEGACY_KEY).catch(() => {});

      router.replace({
        pathname: '/(app)/results',
        params: {
          type: config.type,
          scores: JSON.stringify(scores),
        },
      });
    } catch (e) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  // Section break interstitial
  if (sectionBreak) {
    const completed = responses.filter((r) => r !== null && r !== '' && r !== undefined).length;
    return (
      <SectionBreak
        section={sectionBreak}
        totalQuestions={config.totalQuestions}
        questionsCompleted={completed}
        onContinue={handleSectionContinue}
        onSaveAndExit={handleSaveAndExit}
      />
    );
  }

  // Instructions screen
  if (showInstructions) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.instructionsContent}>
          <Text style={styles.instructionsTitle}>{config.name}</Text>
          <Text style={styles.instructionsSubtitle}>
            {config.totalQuestions} questions · ~{config.estimatedMinutes} minutes
          </Text>
          <View style={styles.instructionsBox}>
            <Text style={styles.instructionsText}>{config.instructions}</Text>
          </View>
          <TenderButton
            title="Begin"
            onPress={() => setShowInstructions(false)}
            variant="primary"
            size="lg"
            fullWidth
            accessibilityLabel="Begin"
          />
          <TenderButton
            title="Cancel"
            onPress={() => router.back()}
            variant="ghost"
            size="lg"
            fullWidth
            accessibilityLabel="Cancel"
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  const question = config.questions[currentIndex];
  const progress = ((currentIndex + 1) / config.totalQuestions) * 100;
  const isLastQuestion = currentIndex === config.totalQuestions - 1;
  const currentAnswer = responses[currentIndex];
  const hasAnswer = (() => {
    if (currentAnswer === null || currentAnswer === '' || currentAnswer === undefined) return false;
    // Ranking questions require exactly rankCount selections
    if (question.inputType === 'ranking' && Array.isArray(currentAnswer)) {
      return currentAnswer.length >= (question.rankCount || 5);
    }
    return true;
  })();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Top bar: progress + save & exit */}
        <View style={styles.topBar}>
          <View style={styles.progressSection}>
            <Text style={styles.progressText} accessibilityLiveRegion="polite" accessibilityLabel={`Question ${currentIndex + 1} of ${config.totalQuestions}`}>
              Question {currentIndex + 1} of {config.totalQuestions}
            </Text>
            <View style={styles.progressBarBg} accessibilityRole="progressbar" accessibilityLabel={`${Math.round(progress)}% complete`}>
              <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.percentText} accessibilityLiveRegion="polite">{Math.round(progress)}% complete</Text>
          </View>
          <TouchableOpacity
            style={styles.saveExitButton}
            onPress={handleSaveAndExit}
            accessibilityRole="button"
            accessibilityLabel="Save & Exit"
          >
            <Text style={styles.saveExitText}>Save & Exit</Text>
          </TouchableOpacity>
        </View>

        {/* Question */}
        <ScrollView
          style={styles.questionScroll}
          contentContainerStyle={styles.questionScrollContent}
        >
          <Animated.View style={{ opacity: questionOpacity }}>
            <Text style={styles.questionText}>"{question.text}"</Text>

            {/* Input based on type — delegated to shared QuestionRenderer */}
            <QuestionRenderer
              question={question}
              currentAnswer={currentAnswer}
              onSelect={handleSelect}
              defaultLikertScale={config.likertScale}
              onAutoAdvance={handleAutoAdvance}
            />
          </Animated.View>
        </ScrollView>

        {/* Navigation */}
        <View style={styles.navSection}>
          <TouchableOpacity
            style={[styles.navButton, currentIndex === 0 && styles.navButtonDisabled]}
            onPress={handlePrevious}
            disabled={currentIndex === 0}
            accessibilityRole="button"
            accessibilityState={{ disabled: currentIndex === 0 }}
          >
            <Text
              style={[
                styles.navButtonText,
                currentIndex === 0 && styles.navButtonTextDisabled,
              ]}
            >
              Previous
            </Text>
          </TouchableOpacity>

          {isLastQuestion ? (
            <TenderButton
              title={submitting ? 'Submitting...' : 'See Results'}
              onPress={handleSubmit}
              disabled={!hasAnswer}
              loading={submitting}
              variant="primary"
              size="lg"
              style={{ flex: 1 }}
              accessibilityLabel={submitting ? 'Submitting assessment' : 'See Results'}
            />
          ) : (question.inputType === 'text' || question.inputType === 'ranking') ? (
            <TouchableOpacity
              style={[
                styles.navButton,
                styles.navButtonPrimary,
              ]}
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
      <QuickLinksBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1, padding: Spacing.xl, justifyContent: 'space-between' },

  // Instructions
  instructionsContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: Spacing.lg,
  },
  instructionsTitle: {
    fontSize: FontSizes.headingL,
    fontWeight: 'bold',
    color: Colors.text,
    fontFamily: FontFamilies.heading,
    textAlign: 'center',
  },
  instructionsSubtitle: {
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  instructionsBox: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  instructionsText: {
    fontSize: FontSizes.body,
    color: Colors.text,
    lineHeight: 24,
  },

  // Top bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
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

  // Progress
  progressSection: { flex: 1, gap: Spacing.xs },
  progressText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    fontWeight: '600',
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
  percentText: { fontSize: FontSizes.caption, color: Colors.textSecondary },

  // Question
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

  // Navigation
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
  navButtonText: { fontSize: FontSizes.body, color: Colors.text, fontWeight: '600' },
  navButtonTextDisabled: { color: Colors.textSecondary },
  navButtonPrimaryText: {
    fontSize: FontSizes.body,
    color: Colors.white,
    fontWeight: '600',
  },
});
