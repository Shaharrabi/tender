/**
 * Micro-Course Browse Screen
 *
 * Displays all 10 micro-courses with progress, prerequisites, and lock states.
 * Users can start new courses or continue in-progress ones.
 */

import React, { useState, useCallback, useMemo } from 'react';
import QuickLinksBar from '@/components/QuickLinksBar';
import { useScrollHideBar } from '@/hooks/useScrollHideBar';
import ReAnimated from 'react-native-reanimated';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import { LightbulbIcon } from '@/assets/graphics/icons';
import { useAuth } from '@/context/AuthContext';
import { TooltipManager } from '@/components/ftue/TooltipManager';
import { WelcomeAudio } from '@/components/ftue/WelcomeAudio';
import {
  MICRO_COURSES,
  calculateCourseProgress,
  type CourseProgress,
} from '@/utils/microcourses/course-registry';
import MicroCourseCard from '@/components/microcourse/MicroCourseCard';
import { getCompletions } from '@/services/intervention';
import { supabase } from '@/services/supabase';

export default function CoursesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { handleScroll: handleScrollBar, animatedStyle: quickLinksAnimStyle, BAR_HEIGHT: barH } = useScrollHideBar();

  const [courseProgressMap, setCourseProgressMap] = useState<
    Record<string, CourseProgress>
  >({});
  const [completedCourseIds, setCompletedCourseIds] = useState<string[]>([]);
  const [completedAssessments, setCompletedAssessments] = useState<string[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  // Load data on focus
  useFocusEffect(
    useCallback(() => {
      if (!user) return;
      loadData();
    }, [user])
  );

  const loadData = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // 1. Load completed assessments (for prerequisites)
      const { data: assessments } = await supabase
        .from('assessments')
        .select('type')
        .eq('user_id', user.id);

      const doneTypes = assessments
        ? [...new Set(assessments.map((a: any) => a.type))]
        : [];
      setCompletedAssessments(doneTypes);

      // 2. Load exercise completions (micro-course lessons are saved as exercise completions)
      const completions = await getCompletions(user.id, 500);

      // 3. Calculate progress for each course
      const progressMap: Record<string, CourseProgress> = {};
      const doneCourses: string[] = [];

      for (const course of MICRO_COURSES) {
        // Count completed lessons for this course
        const courseLessons = completions.filter((c) =>
          c.exerciseId.startsWith(`${course.id}-lesson-`)
        );

        // Deduplicate by lesson number
        const uniqueLessons = new Set(
          courseLessons.map((c) => c.exerciseId)
        );

        const progress: CourseProgress = {
          courseId: course.id,
          lessonsCompleted: uniqueLessons.size,
          totalLessons: course.totalLessons,
          currentLesson:
            uniqueLessons.size < course.totalLessons
              ? uniqueLessons.size
              : course.totalLessons - 1,
        };

        progressMap[course.id] = progress;

        if (uniqueLessons.size >= course.totalLessons) {
          doneCourses.push(course.id);
        }
      }

      setCourseProgressMap(progressMap);
      setCompletedCourseIds(doneCourses);
    } catch {
      // Silent fail
    } finally {
      setLoading(false);
    }
  };

  // Check if a course's prerequisites are met
  const isCourseUnlocked = useCallback(
    (courseId: string): boolean => {
      const course = MICRO_COURSES.find((c) => c.id === courseId);
      if (!course) return false;

      return course.prerequisites.every((prereq) => {
        // Assessment prerequisites: e.g. 'ecr-r-complete' → check if 'ecr-r' is done
        if (prereq.endsWith('-complete') && !prereq.startsWith('mc-')) {
          const assessmentType = prereq.replace('-complete', '');
          return completedAssessments.includes(assessmentType);
        }
        // Course prerequisites: e.g. 'mc-attachment-101-complete'
        if (prereq.startsWith('mc-') && prereq.endsWith('-complete')) {
          const coursePrereqId = prereq.replace('-complete', '');
          return completedCourseIds.includes(coursePrereqId);
        }
        return true;
      });
    },
    [completedAssessments, completedCourseIds]
  );

  // Stats
  const stats = useMemo(() => {
    const total = MICRO_COURSES.length;
    const completed = completedCourseIds.length;
    const inProgress = MICRO_COURSES.filter((c) => {
      const p = courseProgressMap[c.id];
      return p && p.lessonsCompleted > 0 && p.lessonsCompleted < c.totalLessons;
    }).length;
    const unlocked = MICRO_COURSES.filter((c) => isCourseUnlocked(c.id)).length;
    return { total, completed, inProgress, unlocked };
  }, [courseProgressMap, completedCourseIds, isCourseUnlocked]);

  const handleCoursePress = (courseId: string) => {
    const progress = courseProgressMap[courseId];
    const nextLesson = progress
      ? Math.min(progress.lessonsCompleted + 1, 5)
      : 1;

    router.push({
      pathname: '/(app)/microcourse' as any,
      params: { courseId, lessonNumber: nextLesson.toString() },
    });
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(app)/home' as any);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} activeOpacity={0.7} accessibilityRole="button" accessibilityLabel="Courses">
          <Text style={styles.backText}>{'\u2039'} Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Courses</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: barH + 20 }]}
        showsVerticalScrollIndicator={false}
        onScroll={handleScrollBar}
        scrollEventThrottle={16}
      >
        {/* Intro section */}
        <View style={styles.introSection}>
          <Text style={styles.introTitle}>Your Learning Journey</Text>
          <Text style={styles.introSubtitle}>
            10 micro-courses that guide you from understanding your patterns to
            transforming your relationship. Each course has 5 short lessons
            (~20-30 min total).
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.completed}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: Colors.primary }]}>
              {stats.inProgress}
            </Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: Colors.calm }]}>
              {stats.unlocked}
            </Text>
            <Text style={styles.statLabel}>Available</Text>
          </View>
        </View>

        {/* Course cards */}
        <View style={styles.courseList}>
          {MICRO_COURSES.map((course) => {
            const progress = courseProgressMap[course.id] ?? {
              courseId: course.id,
              lessonsCompleted: 0,
              totalLessons: course.totalLessons,
              currentLesson: 0,
            };
            const isLocked = !isCourseUnlocked(course.id);

            return (
              <MicroCourseCard
                key={course.id}
                course={course}
                progress={progress}
                isLocked={isLocked}
                onPress={() => handleCoursePress(course.id)}
              />
            );
          })}
        </View>

        {/* Prerequisite explainer */}
        <View style={styles.infoBox}>
          <LightbulbIcon size={18} color={Colors.primary} />
          <Text style={styles.infoText}>
            Courses unlock as you complete assessments and earlier courses.
            Start with "Understanding Your Attachment Pattern" after completing
            your first assessment section.
          </Text>
        </View>

      </ScrollView>

      <ReAnimated.View style={[{ position: 'absolute', bottom: 0, left: 0, right: 0 }, quickLinksAnimStyle]}>
        <QuickLinksBar currentScreen="courses" />
      </ReAnimated.View>

      {/* FTUE Overlays */}
      <TooltipManager screen="courses" />
      <WelcomeAudio screenKey="courses" />
    </SafeAreaView>
  );
}

// ─── Styles ────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
  headerTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.headingM,
    color: Colors.text,
    fontWeight: '600',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 48,
  },

  // Scroll
  scrollContent: {
    paddingBottom: Spacing.xl,
  },

  // Intro
  introSection: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  introTitle: {
    fontSize: FontSizes.headingL,
    fontWeight: '700',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
  },
  introSubtitle: {
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    lineHeight: 24,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 4,
    ...Shadows.subtle,
  },
  statValue: {
    fontSize: FontSizes.headingL,
    fontWeight: '700',
    fontFamily: FontFamilies.heading,
    color: Colors.success,
  },
  statLabel: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    fontWeight: '500',
  },

  // Course list
  courseList: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },

  // Info box
  infoBox: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
    backgroundColor: Colors.primary + '08',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.primary + '20',
  },
  infoIcon: {
    fontSize: 18,
  },
  infoText: {
    flex: 1,
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
