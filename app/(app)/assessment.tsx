import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput as RNTextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/context/AuthContext';
import { getAssessmentConfig } from '@/utils/assessments/registry';
import { supabase } from '@/services/supabase';
import { Colors, Spacing, FontSizes, ButtonSizes, FontFamilies, BorderRadius } from '@/constants/theme';
import SectionBreak from '@/components/assessment/SectionBreak';
import type { AssessmentConfig, AssessmentSection, GenericQuestion } from '@/types';

export default function AssessmentScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams<{ type: string }>();
  const assessmentType = params.type || 'ecr-r';

  let config: AssessmentConfig;
  try {
    config = getAssessmentConfig(assessmentType as any);
  } catch {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.questionText}>Unknown assessment type: {assessmentType}</Text>
          <TouchableOpacity style={styles.navButton} onPress={() => router.back()}>
            <Text style={styles.navButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<(any | null)[]>(
    new Array(config.totalQuestions).fill(null)
  );
  const [submitting, setSubmitting] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [sectionBreak, setSectionBreak] = useState<AssessmentSection | null>(null);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const saved = await AsyncStorage.getItem(config.progressKey);
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
        config.progressKey,
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
    router.replace('/(app)/home');
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

      await AsyncStorage.removeItem(config.progressKey);

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
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => setShowInstructions(false)}
          >
            <Text style={styles.startButtonText}>Begin</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
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
            <Text style={styles.progressText}>
              Question {currentIndex + 1} of {config.totalQuestions}
            </Text>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.percentText}>{Math.round(progress)}% complete</Text>
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
          <Text style={styles.questionText}>"{question.text}"</Text>

          {/* Input based on type */}
          {question.inputType === 'likert' && (question.likertScale || config.likertScale) && (
            <View style={styles.likertSection}>
              {(question.likertScale || config.likertScale!).map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.likertOption,
                    currentAnswer === item.value && styles.likertOptionSelected,
                  ]}
                  onPress={() => handleSelect(item.value)}
                >
                  <View
                    style={[
                      styles.radio,
                      currentAnswer === item.value && styles.radioSelected,
                    ]}
                  >
                    {currentAnswer === item.value && <View style={styles.radioInner} />}
                  </View>
                  <Text
                    style={[
                      styles.likertLabel,
                      currentAnswer === item.value && styles.likertLabelSelected,
                    ]}
                  >
                    {item.value} — {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {question.inputType === 'text' && (
            <View style={styles.textInputSection}>
              <RNTextInput
                style={styles.textInput}
                placeholder={question.placeholder || 'Type your response...'}
                placeholderTextColor={Colors.textSecondary}
                value={currentAnswer || ''}
                onChangeText={handleSelect}
                multiline
                maxLength={question.charLimit || 500}
                textAlignVertical="top"
              />
              <Text style={styles.charCount}>
                {(currentAnswer || '').length}/{question.charLimit || 500}
              </Text>
            </View>
          )}

          {question.inputType === 'choice' && question.choices && (
            <View style={styles.choiceSection}>
              {question.choices.map((choice) => (
                <TouchableOpacity
                  key={choice.key}
                  style={[
                    styles.choiceOption,
                    currentAnswer === choice.key && styles.choiceOptionSelected,
                  ]}
                  onPress={() => handleSelect(choice.key)}
                >
                  <View style={styles.choiceKeyBadge}>
                    <Text
                      style={[
                        styles.choiceKey,
                        currentAnswer === choice.key && styles.choiceKeySelected,
                      ]}
                    >
                      {choice.key}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.choiceText,
                      currentAnswer === choice.key && styles.choiceTextSelected,
                    ]}
                  >
                    {choice.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {question.inputType === 'ranking' && question.rankingItems && (
            <View style={styles.rankingSection}>
              <Text style={styles.rankingHint}>
                Tap items in order of importance (1st, 2nd, 3rd...). Tap again to remove.
              </Text>
              {question.rankingItems.map((item) => {
                const ranked = (currentAnswer as string[]) || [];
                const position = ranked.indexOf(item.id);
                const isSelected = position !== -1;
                const isFull = ranked.length >= (question.rankCount || 5);
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.rankingItem,
                      isSelected && styles.rankingItemSelected,
                      !isSelected && isFull && styles.rankingItemDisabled,
                    ]}
                    disabled={!isSelected && isFull}
                    onPress={() => {
                      if (isSelected) {
                        handleSelect(ranked.filter((id: string) => id !== item.id));
                      } else {
                        handleSelect([...ranked, item.id]);
                      }
                    }}
                  >
                    <View
                      style={[
                        styles.rankBadge,
                        isSelected && styles.rankBadgeSelected,
                      ]}
                    >
                      <Text style={[styles.rankNumber, isSelected && styles.rankNumberSelected]}>
                        {isSelected ? position + 1 : '—'}
                      </Text>
                    </View>
                    <View style={styles.rankingItemContent}>
                      <Text style={styles.rankingItemLabel}>{item.label}</Text>
                      {item.description ? (
                        <Text style={styles.rankingItemDesc}>{item.description}</Text>
                      ) : null}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </ScrollView>

        {/* Navigation */}
        <View style={styles.navSection}>
          <TouchableOpacity
            style={[styles.navButton, currentIndex === 0 && styles.navButtonDisabled]}
            onPress={handlePrevious}
            disabled={currentIndex === 0}
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
            <TouchableOpacity
              style={[
                styles.submitButton,
                (!hasAnswer || submitting) && styles.navButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!hasAnswer || submitting}
            >
              <Text style={styles.submitButtonText}>
                {submitting ? 'Submitting...' : 'See Results'}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.navButton,
                styles.navButtonPrimary,
              ]}
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
  startButton: {
    backgroundColor: Colors.primary,
    height: ButtonSizes.large,
    borderRadius: BorderRadius.pill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButtonText: {
    color: Colors.white,
    fontSize: FontSizes.body,
    fontWeight: '600',
  },
  cancelButton: {
    height: ButtonSizes.large,
    borderRadius: BorderRadius.pill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.body,
    fontWeight: '600',
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

  // Likert
  likertSection: { gap: Spacing.sm },
  likertOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: Spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  likertOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#EEF2FF',
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  radioSelected: { borderColor: Colors.primary },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  likertLabel: { fontSize: FontSizes.bodySmall, color: Colors.text },
  likertLabelSelected: { color: Colors.primary, fontWeight: '600' },

  // Text input
  textInputSection: { gap: Spacing.xs },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: Spacing.md,
    fontSize: FontSizes.body,
    color: Colors.text,
    minHeight: 120,
    backgroundColor: Colors.white,
  },
  charCount: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    textAlign: 'right',
  },

  // Choice
  choiceSection: { gap: Spacing.sm },
  choiceOption: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  choiceOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#EEF2FF',
  },
  choiceKeyBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  choiceKey: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  choiceKeySelected: { color: Colors.primary },
  choiceText: {
    flex: 1,
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    lineHeight: 20,
  },
  choiceTextSelected: { color: Colors.primary },

  // Ranking
  rankingSection: { gap: Spacing.sm },
  rankingHint: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  rankingItemSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#EEF2FF',
  },
  rankingItemDisabled: { opacity: 0.4 },
  rankBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankBadgeSelected: { backgroundColor: Colors.primary },
  rankNumber: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  rankNumberSelected: { color: Colors.white },
  rankingItemContent: { flex: 1 },
  rankingItemLabel: {
    fontSize: FontSizes.body,
    color: Colors.text,
    fontWeight: '500',
  },
  rankingItemDesc: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    marginTop: 2,
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
