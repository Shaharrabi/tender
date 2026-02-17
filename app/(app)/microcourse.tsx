/**
 * Micro-Course Lesson Viewer
 *
 * 3-step flow per lesson: Read → Exercise → Reflection.
 * Saves reflection to exercise_completions on completion.
 * Selects attachment variant for MC1 based on user portrait.
 *
 * Route params:
 *   courseId: string (e.g. 'mc-attachment-101')
 *   lessonNumber: string (e.g. '1')
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  ButtonSizes,
  Shadows,
} from '@/constants/theme';
import {
  BookOpenIcon,
  TargetIcon,
  PenIcon,
  CheckmarkIcon,
} from '@/assets/graphics/icons';
import { useAuth } from '@/context/AuthContext';
import { useGamification } from '@/context/GamificationContext';
import { saveCompletion } from '@/services/intervention';
import { incrementPracticeCount, addInsight, upsertGrowthEdge } from '@/services/growth';
import { getPortrait } from '@/services/portrait';
import { getCourseById } from '@/utils/microcourses/course-registry';
import {
  getLesson,
  getLessonContent,
  getLessonsForCourse,
  type ResolvedLessonContent,
} from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Map course categories to growth edge IDs
const COURSE_TO_EDGE: Record<string, string[]> = {
  'mc-attachment-101': ['approach_closeness'],
  'mc-regulation': ['regulation_capacity'],
  'mc-conflict-repair': ['speak_truth'],
  'mc-boundaries': ['differentiation_work', 'reclaim_self'],
  'mc-act-defusion': ['differentiation_work'],
  'mc-values-alignment': ['values_gap'],
};

// ─── Lesson Step (within a single lesson) ───────────────

type LessonStep = 'read' | 'exercise' | 'reflection';
const STEPS: LessonStep[] = ['read', 'exercise', 'reflection'];

export default function MicroCourseScreen() {
  const router = useRouter();
  const { courseId, lessonNumber } = useLocalSearchParams<{
    courseId: string;
    lessonNumber: string;
  }>();
  const { user } = useAuth();
  const { awardXP } = useGamification();

  const [currentStep, setCurrentStep] = useState<LessonStep>('read');
  const [reflectionText, setReflectionText] = useState('');
  const [attachmentStyle, setAttachmentStyle] = useState<AttachmentStyle | undefined>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Animations
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const checkScale = useRef(new Animated.Value(0)).current;
  const checkOpacity = useRef(new Animated.Value(0)).current;

  // Completion state
  const [completed, setCompleted] = useState(false);

  // Parse lesson
  const lessonNum = lessonNumber ? parseInt(lessonNumber, 10) : 1;
  const course = courseId ? getCourseById(courseId) : undefined;
  const lesson = courseId ? getLesson(courseId, lessonNum) : undefined;
  const totalLessons = course?.totalLessons ?? 5;

  // Load attachment style from portrait for variant selection
  useEffect(() => {
    async function loadAttachmentStyle() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const portrait = await getPortrait(user.id);
        if (portrait?.negativeCycle?.position) {
          const pos = portrait.negativeCycle.position;
          if (pos === 'pursuer') setAttachmentStyle('anxious-preoccupied');
          else if (pos === 'withdrawer') setAttachmentStyle('dismissive-avoidant');
          else if (pos === 'mixed') setAttachmentStyle('fearful-avoidant');
          else setAttachmentStyle('secure');
        }
      } catch {
        // Portrait not available — use universal content
      }
      setLoading(false);
    }
    loadAttachmentStyle();
  }, [user]);

  // Resolve content for current attachment style
  const content: ResolvedLessonContent | null = lesson
    ? getLessonContent(lesson, attachmentStyle)
    : null;

  // Step index for progress
  const stepIndex = STEPS.indexOf(currentStep);
  const isLastStep = currentStep === 'reflection';

  // ─── Animations ──────────────────────────────

  const animateTransition = useCallback(
    (direction: 'forward' | 'back', cb: () => void) => {
      const exitValue = direction === 'forward' ? -SCREEN_WIDTH * 0.3 : SCREEN_WIDTH * 0.3;
      const enterValue = direction === 'forward' ? SCREEN_WIDTH * 0.3 : -SCREEN_WIDTH * 0.3;

      Animated.parallel([
        Animated.timing(slideAnim, { toValue: exitValue, duration: 200, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start(() => {
        cb();
        slideAnim.setValue(enterValue);
        Animated.parallel([
          Animated.timing(slideAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
          Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
        ]).start();
      });
    },
    [slideAnim, fadeAnim]
  );

  const showCompletionAnimation = useCallback(() => {
    Animated.parallel([
      Animated.spring(checkScale, { toValue: 1, friction: 4, tension: 60, useNativeDriver: true }),
      Animated.timing(checkOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, [checkScale, checkOpacity]);

  // ─── Handlers ────────────────────────────────

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      const nextIdx = stepIndex + 1;
      animateTransition('forward', () => setCurrentStep(STEPS[nextIdx]));
    }
  };

  const handleBack = () => {
    if (stepIndex > 0) {
      const prevIdx = stepIndex - 1;
      animateTransition('back', () => setCurrentStep(STEPS[prevIdx]));
    }
  };

  const handleComplete = async () => {
    if (!lesson || !user || saving) return;
    setSaving(true);

    try {
      // Save lesson completion
      await saveCompletion(
        user.id,
        lesson.id,
        reflectionText.trim() || undefined,
        undefined
      );

      // Update growth tracking
      const edgeIds = COURSE_TO_EDGE[lesson.courseId] ?? [];
      for (const edgeId of edgeIds) {
        try {
          await upsertGrowthEdge(user.id, edgeId, {});
          await incrementPracticeCount(user.id, edgeId);
          if (reflectionText.trim()) {
            await addInsight(user.id, edgeId, reflectionText.trim());
          }
        } catch {
          // Growth tracking is best-effort
        }
      }
    } catch (err) {
      console.error('Failed to save lesson completion:', err);
    }

    // Award XP for lesson completion (non-blocking)
    if (lesson) {
      awardXP('lesson_complete', lesson.id, `Completed lesson: ${lesson.title}`).catch(() => {});
    }

    setSaving(false);
    setCompleted(true);
    showCompletionAnimation();
  };

  const handleNextLesson = () => {
    if (courseId && lessonNum < totalLessons) {
      // Navigate to next lesson
      router.replace({
        pathname: '/(app)/microcourse',
        params: { courseId, lessonNumber: String(lessonNum + 1) },
      } as any);
    } else {
      // Course complete — go home
      handleExit();
    }
  };

  const handleExit = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(app)/home' as any);
    }
  };

  // ─── Loading / Error ─────────────────────────

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!lesson || !content || !course) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.errorTitle}>Lesson Not Found</Text>
          <Text style={styles.errorText}>
            Could not load lesson {lessonNumber} of course "{courseId}".
          </Text>
          <TouchableOpacity style={styles.exitButton} onPress={handleExit}>
            <Text style={styles.exitButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ─── Completion Screen ───────────────────────

  if (completed) {
    const hasNext = lessonNum < totalLessons;
    const isCourseComplete = lessonNum >= totalLessons;

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.completionScroll}>
          {/* Animated check */}
          <Animated.View
            style={[
              styles.checkCircle,
              {
                opacity: checkOpacity,
                transform: [{ scale: checkScale }],
              },
            ]}
          >
            <CheckmarkIcon size={48} color={Colors.textOnPrimary} />
          </Animated.View>

          <Text style={styles.completionTitle}>
            {isCourseComplete ? 'Course Complete!' : 'Lesson Complete!'}
          </Text>
          <Text style={styles.completionSubtitle}>
            {isCourseComplete
              ? `You finished "${course.title}". The insights from your reflections are now part of your journey.`
              : `Lesson ${lessonNum} of ${totalLessons} complete. Your reflection has been saved.`}
          </Text>

          {/* Next lesson or finish */}
          {hasNext ? (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleNextLesson}
              activeOpacity={0.7}
            >
              <Text style={styles.primaryButtonText}>
                Next Lesson \u203A
              </Text>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleExit}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryButtonText}>
              {isCourseComplete ? 'Return Home' : 'Save & Exit'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ─── Lesson Step Screen ──────────────────────

  return (
    <SafeAreaView style={styles.container}>
      {/* Progress header */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>
            Lesson {lessonNum} of {totalLessons}
          </Text>
          <Text style={styles.courseTitle}>{course.title}</Text>
        </View>

        {/* Lesson progress dots */}
        <View style={styles.dotsRow}>
          {STEPS.map((s, i) => (
            <View
              key={s}
              style={[
                styles.dot,
                i <= stepIndex && styles.dotActive,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Animated content */}
      <Animated.View
        style={[
          styles.contentContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {currentStep === 'read' && (
            <ReadStep
              title={lesson.title}
              content={content.readContent}
            />
          )}

          {currentStep === 'exercise' && (
            <ExerciseStep content={content.exerciseContent} />
          )}

          {currentStep === 'reflection' && (
            <ReflectionStep
              prompt={content.reflectionPrompt}
              commitmentTemplate={content.commitmentTemplate}
              value={reflectionText}
              onChangeText={setReflectionText}
            />
          )}
        </ScrollView>
      </Animated.View>

      {/* Navigation */}
      <View style={styles.navigation}>
        {stepIndex > 0 ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>{'\u2039'} Back</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleExit}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>{'\u2715'} Exit</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.nextButton, saving && styles.disabledButton]}
          onPress={handleNext}
          activeOpacity={0.7}
          disabled={saving}
        >
          <Text style={styles.nextButtonText}>
            {saving
              ? 'Saving...'
              : isLastStep
                ? 'Complete \u2713'
                : 'Continue \u203A'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ═══════════════════════════════════════════════════════════
//  Step Sub-Components
// ═══════════════════════════════════════════════════════════

function ReadStep({ title, content }: { title: string; content: string }) {
  return (
    <View style={stepStyles.readCard}>
      <View style={stepStyles.iconCircle}>
        <BookOpenIcon size={22} color={Colors.primary} />
      </View>
      <Text style={stepStyles.readTitle}>{title}</Text>
      <Text style={stepStyles.readContent}>{content}</Text>
    </View>
  );
}

function ExerciseStep({ content }: { content: string }) {
  return (
    <View style={stepStyles.exerciseCard}>
      <View style={stepStyles.exerciseHeader}>
        <TargetIcon size={22} color={Colors.calm} />
        <Text style={stepStyles.exerciseLabel}>Your Practice</Text>
      </View>
      <Text style={stepStyles.exerciseContent}>{content}</Text>
    </View>
  );
}

function ReflectionStep({
  prompt,
  commitmentTemplate,
  value,
  onChangeText,
}: {
  prompt: string;
  commitmentTemplate?: string;
  value: string;
  onChangeText: (text: string) => void;
}) {
  return (
    <View style={stepStyles.reflectionCard}>
      <View style={stepStyles.reflectionHeader}>
        <PenIcon size={22} color={Colors.secondary} />
        <Text style={stepStyles.reflectionLabel}>Your Reflection</Text>
      </View>

      {commitmentTemplate && (
        <View style={stepStyles.templateBox}>
          <Text style={stepStyles.templateText}>{commitmentTemplate}</Text>
        </View>
      )}

      <Text style={stepStyles.promptText}>{prompt}</Text>

      <View style={stepStyles.inputWrapper}>
        <TextInput
          style={stepStyles.input}
          placeholder="Take a moment and write what comes up..."
          placeholderTextColor={Colors.textMuted}
          value={value}
          onChangeText={onChangeText}
          multiline
          textAlignVertical="top"
        />
      </View>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════
//  Step Styles
// ═══════════════════════════════════════════════════════════

const stepStyles = StyleSheet.create({
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  icon: {
    fontSize: 22,
  },

  // ─── Read ─────────────────────────────
  readCard: {
    backgroundColor: '#FBF7F2',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.subtle,
  },
  readTitle: {
    fontSize: FontSizes.headingM,
    fontWeight: '600',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  readContent: {
    fontSize: FontSizes.body,
    color: Colors.text,
    lineHeight: 26,
  },

  // ─── Exercise ─────────────────────────
  exerciseCard: {
    backgroundColor: Colors.calm + '10',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.calm + '30',
    ...Shadows.subtle,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  exerciseLabel: {
    fontSize: FontSizes.body,
    fontWeight: '600',
    fontFamily: FontFamilies.heading,
    color: Colors.calm,
  },
  exerciseContent: {
    fontSize: FontSizes.body,
    color: Colors.text,
    lineHeight: 26,
  },

  // ─── Reflection ───────────────────────
  reflectionCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.subtle,
    gap: Spacing.md,
  },
  reflectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  reflectionLabel: {
    fontSize: FontSizes.body,
    fontWeight: '600',
    fontFamily: FontFamilies.heading,
    color: Colors.secondary,
  },
  templateBox: {
    backgroundColor: Colors.accent + '15',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accent,
  },
  templateText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  promptText: {
    fontSize: FontSizes.body,
    fontWeight: '500',
    color: Colors.text,
    lineHeight: 24,
  },
  inputWrapper: {
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.accent + '60',
    backgroundColor: '#FFFCF7',
    overflow: 'hidden',
  },
  input: {
    padding: Spacing.md,
    fontSize: FontSizes.body,
    color: Colors.text,
    minHeight: 140,
    lineHeight: 24,
  },
});

// ═══════════════════════════════════════════════════════════
//  Main Styles
// ═══════════════════════════════════════════════════════════

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    gap: Spacing.md,
  },

  // ─── Error ──────────────────────────────
  errorTitle: {
    fontSize: FontSizes.headingM,
    fontFamily: FontFamilies.heading,
    fontWeight: '600',
    color: Colors.text,
  },
  errorText: {
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  exitButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.pill,
    marginTop: Spacing.md,
  },
  exitButtonText: {
    color: Colors.textOnPrimary,
    fontWeight: '600',
  },

  // ─── Progress ───────────────────────────
  progressSection: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.surfaceElevated,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    ...Shadows.subtle,
    gap: Spacing.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '600',
    color: Colors.primary,
  },
  courseTitle: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    fontFamily: FontFamilies.heading,
    fontWeight: '500',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  dot: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.borderLight,
    borderRadius: 2,
  },
  dotActive: {
    backgroundColor: Colors.primary,
  },

  // ─── Content ────────────────────────────
  contentContainer: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },

  // ─── Navigation ─────────────────────────
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    backgroundColor: Colors.surfaceElevated,
    gap: Spacing.sm,
  },
  backButton: {
    height: ButtonSizes.medium,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.pill,
    borderWidth: 1.5,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  backButtonText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  nextButton: {
    flex: 1,
    height: ButtonSizes.medium,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.pill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: FontSizes.body,
    color: Colors.textOnPrimary,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },

  // ─── Completion ─────────────────────────
  completionScroll: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxl * 2,
    paddingBottom: Spacing.xxxl,
    alignItems: 'center',
    gap: Spacing.md,
  },
  checkCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    ...Shadows.elevated,
  },
  checkMark: {
    fontSize: 48,
    color: Colors.textOnPrimary,
    fontWeight: '300',
  },
  completionTitle: {
    fontSize: FontSizes.headingL,
    fontWeight: '700',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
  },
  completionSubtitle: {
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.lg,
  },
  primaryButton: {
    width: '100%',
    height: ButtonSizes.large,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.pill,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.subtle,
  },
  primaryButtonText: {
    color: Colors.textOnPrimary,
    fontSize: FontSizes.body,
    fontWeight: '700',
  },
  secondaryButton: {
    height: ButtonSizes.medium,
    borderRadius: BorderRadius.pill,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  secondaryButtonText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.bodySmall,
    fontWeight: '500',
  },
});
