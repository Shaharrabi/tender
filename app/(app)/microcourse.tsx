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
import QuickLinksBar from '@/components/QuickLinksBar';
import { useScrollHideBar } from '@/hooks/useScrollHideBar';
import Reanimated from 'react-native-reanimated';
import { useAuth } from '@/context/AuthContext';
import { useGamification } from '@/context/GamificationContext';
import { saveCompletion, getCompletionByExerciseId } from '@/services/intervention';
import { incrementPracticeCount, addInsight, upsertGrowthEdge } from '@/services/growth';
import { getPortrait } from '@/services/portrait';
import { getCourseById } from '@/utils/microcourses/course-registry';
import { MC1CourseFlow } from '@/components/microcourse/mc1/MC1CourseFlow';
import { MC2CourseFlow } from '@/components/microcourse/mc2/MC2CourseFlow';
import { MC3CourseFlow } from '@/components/microcourse/mc3/MC3CourseFlow';
import { MC4CourseFlow } from '@/components/microcourse/mc4/MC4CourseFlow';
import { MC5CourseFlow } from '@/components/microcourse/mc5/MC5CourseFlow';
import { MC6CourseFlow } from '@/components/microcourse/mc6/MC6CourseFlow';
import { MC7CourseFlow } from '@/components/microcourse/mc7/MC7CourseFlow';
import { MC8CourseFlow } from '@/components/microcourse/mc8/MC8CourseFlow';
import { MC9CourseFlow } from '@/components/microcourse/mc9/MC9CourseFlow';
import { MC10CourseFlow } from '@/components/microcourse/mc10/MC10CourseFlow';
import { MC11CourseFlow } from '@/components/microcourse/mc11/MC11CourseFlow';
import { MC12CourseFlow } from '@/components/microcourse/mc12/MC12CourseFlow';
import { MC13CourseFlow } from '@/components/microcourse/mc13/MC13CourseFlow';
import { MC14CourseFlow } from '@/components/microcourse/mc14/MC14CourseFlow';
import {
  getLesson,
  getLessonContent,
  getLessonsForCourse,
  type ResolvedLessonContent,
} from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Map course categories to growth edge IDs
const COURSE_TO_EDGE: Record<string, string[]> = {
  'mc-attachment-101': ['approach_closeness'],
  'mc-regulation': ['regulation_capacity'],
  'mc-conflict-repair': ['speak_truth'],
  'mc-boundaries': ['differentiation_work', 'reclaim_self'],
  'mc-act-defusion': ['differentiation_work'],
  'mc-values-alignment': ['values_gap'],
  'mc-text-between-us': ['approach_closeness'],
  'mc-boundaries-deep': ['differentiation_work', 'reclaim_self'],
  'mc-lightness-lab': ['approach_closeness'],
  'mc-seen': ['approach_closeness'],
  'mc-orientation-pleasure': ['regulation_capacity'],
  'mc-bids-connection': ['approach_closeness'],
  'mc-fondness-gratitude': ['approach_closeness'],
  'mc-trust-repair': ['speak_truth'],
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
  const { handleScroll, animatedStyle: quickLinksAnimStyle, BAR_HEIGHT } = useScrollHideBar();

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

  // Previous lesson data for cascading (MC5 L2 reads L1's story, MC6 L2/L3 reads L1's sort)
  const [previousLessonData, setPreviousLessonData] = useState<string | undefined>();

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

  // Fetch previous lesson data for cascading (MC5 L2, MC6 L2/L3)
  useEffect(() => {
    async function loadPreviousLessonData() {
      if (!user || !courseId) return;

      // MC5 L2 needs L1's story text
      if (courseId === 'mc-act-defusion' && lessonNum === 2) {
        try {
          const l1 = await getCompletionByExerciseId(user.id, 'mc-act-defusion-lesson-1');
          if (l1?.stepResponses) {
            const interactiveStep = l1.stepResponses.find((s: StepResponseEntry) => s.type === 'interactive');
            if (interactiveStep) {
              const parsed = JSON.parse(interactiveStep.response);
              setPreviousLessonData(JSON.stringify({ storyText: parsed.storyText }));
            }
          }
        } catch {
          // Graceful fallback — L2 has fallback TextInput
        }
      }

      // MC6 L2/L3 need L1's sort data
      if (courseId === 'mc-values-alignment' && (lessonNum === 2 || lessonNum === 3)) {
        try {
          const l1 = await getCompletionByExerciseId(user.id, 'mc-values-alignment-lesson-1');
          if (l1?.stepResponses) {
            const interactiveStep = l1.stepResponses.find((s: StepResponseEntry) => s.type === 'interactive');
            if (interactiveStep) {
              setPreviousLessonData(interactiveStep.response);
            }
          }
        } catch {
          // Graceful fallback — L2/L3 have fallback data
        }
      }
    }
    loadPreviousLessonData();
  }, [user, courseId, lessonNum]);

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

  const handleComplete = async (stepResponses?: StepResponseEntry[]) => {
    if (!lesson || !user || saving) return;
    setSaving(true);

    // If stepResponses provided (from MC1), extract reflection from them
    const reflection = stepResponses
      ? stepResponses.find(s => s.type === 'reflection')?.response || reflectionText.trim()
      : reflectionText.trim();

    try {
      // Save lesson completion
      await saveCompletion(
        user.id,
        lesson.id,
        reflection || undefined,
        undefined,
        stepResponses,
        lesson.title
      );

      // Update growth tracking
      const edgeIds = COURSE_TO_EDGE[lesson.courseId] ?? [];
      for (const edgeId of edgeIds) {
        try {
          await upsertGrowthEdge(user.id, edgeId, {});
          await incrementPracticeCount(user.id, edgeId);
          if (reflection) {
            await addInsight(user.id, edgeId, reflection);
          }
        } catch {
          // Growth tracking is best-effort
        }
      }
    } catch (err) {
      console.error('Failed to save lesson completion:', err);
    }

    // Award XP for lesson completion (non-blocking, silent to avoid sound on home)
    if (lesson) {
      awardXP('lesson_complete', lesson.id, `Completed lesson: ${lesson.title}`, { silent: true }).catch(() => {});
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

  const handlePreviousLesson = () => {
    if (courseId && lessonNum > 1) {
      router.replace({
        pathname: '/(app)/microcourse',
        params: { courseId, lessonNumber: String(lessonNum - 1) },
      } as any);
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
          <ActivityIndicator color={Colors.primary} accessibilityLabel="Loading" />
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
          <TouchableOpacity style={styles.exitButton} onPress={handleExit} accessibilityRole="button" accessibilityLabel="Go Back">
            <Text style={styles.exitButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ─── MC1 Interactive Flow ────────────────────

  if (courseId === 'mc-attachment-101' && !completed) {
    return (
      <MC1CourseFlow
        lessonNumber={lessonNum}
        totalLessons={totalLessons}
        attachmentStyle={attachmentStyle}
        content={content}
        lesson={lesson}
        course={course}
        onComplete={handleComplete}
        onExit={handleExit}
        onPreviousLesson={lessonNum > 1 ? handlePreviousLesson : undefined}
        saving={saving}
      />
    );
  }

  // ─── MC2 Interactive Flow ────────────────────

  if (courseId === 'mc-regulation' && !completed) {
    return (
      <MC2CourseFlow
        lessonNumber={lessonNum}
        totalLessons={totalLessons}
        attachmentStyle={attachmentStyle}
        content={content}
        lesson={lesson}
        course={course}
        onComplete={handleComplete}
        onExit={handleExit}
        onPreviousLesson={lessonNum > 1 ? handlePreviousLesson : undefined}
        saving={saving}
      />
    );
  }

  // ─── MC3 Interactive Flow ────────────────────

  if (courseId === 'mc-conflict-repair' && !completed) {
    return (
      <MC3CourseFlow
        lessonNumber={lessonNum}
        totalLessons={totalLessons}
        attachmentStyle={attachmentStyle}
        content={content}
        lesson={lesson}
        course={course}
        onComplete={handleComplete}
        onExit={handleExit}
        onPreviousLesson={lessonNum > 1 ? handlePreviousLesson : undefined}
        saving={saving}
      />
    );
  }

  // ─── MC4 Interactive Flow ────────────────────

  if (courseId === 'mc-boundaries' && !completed) {
    return (
      <MC4CourseFlow
        lessonNumber={lessonNum}
        totalLessons={totalLessons}
        attachmentStyle={attachmentStyle}
        content={content}
        lesson={lesson}
        course={course}
        onComplete={handleComplete}
        onExit={handleExit}
        onPreviousLesson={lessonNum > 1 ? handlePreviousLesson : undefined}
        saving={saving}
      />
    );
  }

  // ─── MC5 Interactive Flow ────────────────────

  if (courseId === 'mc-act-defusion' && !completed) {
    return (
      <MC5CourseFlow
        lessonNumber={lessonNum}
        totalLessons={totalLessons}
        attachmentStyle={attachmentStyle}
        content={content}
        lesson={lesson}
        course={course}
        onComplete={handleComplete}
        onExit={handleExit}
        onPreviousLesson={lessonNum > 1 ? handlePreviousLesson : undefined}
        saving={saving}
        previousLessonData={previousLessonData}
      />
    );
  }

  // ─── MC6 Interactive Flow ────────────────────

  if (courseId === 'mc-values-alignment' && !completed) {
    return (
      <MC6CourseFlow
        lessonNumber={lessonNum}
        totalLessons={totalLessons}
        attachmentStyle={attachmentStyle}
        content={content}
        lesson={lesson}
        course={course}
        onComplete={handleComplete}
        onExit={handleExit}
        onPreviousLesson={lessonNum > 1 ? handlePreviousLesson : undefined}
        saving={saving}
        previousLessonData={previousLessonData}
      />
    );
  }

  // ─── MC7 Interactive Flow ────────────────────

  if (courseId === 'mc-text-between-us' && !completed) {
    return (
      <MC7CourseFlow
        lessonNumber={lessonNum}
        totalLessons={totalLessons}
        attachmentStyle={attachmentStyle}
        content={content}
        lesson={lesson}
        course={course}
        onComplete={handleComplete}
        onExit={handleExit}
        onPreviousLesson={lessonNum > 1 ? handlePreviousLesson : undefined}
        saving={saving}
      />
    );
  }

  // ─── MC8 Interactive Flow ────────────────────

  if (courseId === 'mc-boundaries-deep' && !completed) {
    return (
      <MC8CourseFlow
        lessonNumber={lessonNum}
        totalLessons={totalLessons}
        attachmentStyle={attachmentStyle}
        content={content}
        lesson={lesson}
        course={course}
        onComplete={handleComplete}
        onExit={handleExit}
        onPreviousLesson={lessonNum > 1 ? handlePreviousLesson : undefined}
        saving={saving}
      />
    );
  }

  // ─── MC9 Interactive Flow ────────────────────

  if (courseId === 'mc-lightness-lab' && !completed) {
    return (
      <MC9CourseFlow
        lessonNumber={lessonNum}
        totalLessons={totalLessons}
        attachmentStyle={attachmentStyle}
        content={content}
        lesson={lesson}
        course={course}
        onComplete={handleComplete}
        onExit={handleExit}
        onPreviousLesson={lessonNum > 1 ? handlePreviousLesson : undefined}
        saving={saving}
      />
    );
  }

  // ─── MC10 Interactive Flow ────────────────────

  if (courseId === 'mc-seen' && !completed) {
    return (
      <MC10CourseFlow
        lessonNumber={lessonNum}
        totalLessons={totalLessons}
        attachmentStyle={attachmentStyle}
        content={content}
        lesson={lesson}
        course={course}
        onComplete={handleComplete}
        onExit={handleExit}
        onPreviousLesson={lessonNum > 1 ? handlePreviousLesson : undefined}
        saving={saving}
      />
    );
  }

  // ─── MC11 Interactive Flow ────────────────────

  if (courseId === 'mc-orientation-pleasure' && !completed) {
    return (
      <MC11CourseFlow
        lessonNumber={lessonNum}
        totalLessons={totalLessons}
        attachmentStyle={attachmentStyle}
        content={content}
        lesson={lesson}
        course={course}
        onComplete={handleComplete}
        onExit={handleExit}
        onPreviousLesson={lessonNum > 1 ? handlePreviousLesson : undefined}
        saving={saving}
      />
    );
  }

  // ─── MC12 Interactive Flow ────────────────────

  if (courseId === 'mc-bids-connection' && !completed) {
    return (
      <MC12CourseFlow
        lessonNumber={lessonNum}
        totalLessons={totalLessons}
        attachmentStyle={attachmentStyle}
        content={content}
        lesson={lesson}
        course={course}
        onComplete={handleComplete}
        onExit={handleExit}
        onPreviousLesson={lessonNum > 1 ? handlePreviousLesson : undefined}
        saving={saving}
      />
    );
  }

  // ─── MC13 Interactive Flow ────────────────────

  if (courseId === 'mc-fondness-gratitude' && !completed) {
    return (
      <MC13CourseFlow
        lessonNumber={lessonNum}
        totalLessons={totalLessons}
        attachmentStyle={attachmentStyle}
        content={content}
        lesson={lesson}
        course={course}
        onComplete={handleComplete}
        onExit={handleExit}
        onPreviousLesson={lessonNum > 1 ? handlePreviousLesson : undefined}
        saving={saving}
      />
    );
  }

  // ─── MC14 Interactive Flow ────────────────────

  if (courseId === 'mc-trust-repair' && !completed) {
    return (
      <MC14CourseFlow
        lessonNumber={lessonNum}
        totalLessons={totalLessons}
        attachmentStyle={attachmentStyle}
        content={content}
        lesson={lesson}
        course={course}
        onComplete={handleComplete}
        onExit={handleExit}
        onPreviousLesson={lessonNum > 1 ? handlePreviousLesson : undefined}
        saving={saving}
      />
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
              accessibilityRole="button"
            >
              <Text style={styles.primaryButtonText}>
                Next Lesson {'\u203A'}
              </Text>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleExit}
            activeOpacity={0.7}
            accessibilityRole="button"
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
          contentContainerStyle={[styles.scrollContent, { paddingBottom: BAR_HEIGHT + 20 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onScroll={handleScroll}
          scrollEventThrottle={16}
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
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.backButtonText}>{'\u2039'} Back</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleExit}
            activeOpacity={0.7}
            accessibilityRole="button"
          >
            <Text style={styles.backButtonText}>{'\u2715'} Exit</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.nextButton, saving && styles.disabledButton]}
          onPress={handleNext}
          activeOpacity={0.7}
          disabled={saving}
          accessibilityRole="button"
          accessibilityState={{ disabled: saving }}
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
      <Reanimated.View style={[styles.quickLinksWrapper, quickLinksAnimStyle]}>
        <QuickLinksBar />
      </Reanimated.View>
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
        accessibilityRole="text"
            accessibilityLabel="Take a moment and write what comes up..."
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
    backgroundColor: Colors.backgroundAlt,
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
    backgroundColor: Colors.surfaceElevated,
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
  quickLinksWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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
    paddingBottom: Spacing.scrollPadBottom,
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
    paddingBottom: Spacing.scrollPadBottom,
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
