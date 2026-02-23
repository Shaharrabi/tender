/**
 * Journal Screen — Personal relationship timeline.
 *
 * Aggregates all user activity (check-ins, exercises, assessments,
 * chat, XP) into a beautiful online journal with:
 *   1. Cover — user name + journey stats (blue accent)
 *   2. Calendar — month view with colored activity dots
 *   3. Activity Summary — today's practices, course, check-in
 *   4. Day View — timeline of entries for the selected day
 *
 * Wes Anderson aesthetic: warm parchment, lobby blue accents.
 */

import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import HomeButton from '@/components/HomeButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/context/AuthContext';
import { useGuest } from '@/context/GuestContext';
import { supabase } from '@/services/supabase';
import {
  getJournalEntriesForDate,
  getJournalCalendarData,
  getJournalStats,
  getReflectionQuestions,
  getDailyReflection,
  saveDailyReflection,
  type JournalEntry,
  type JournalStats,
  type CalendarDayData,
  type DailyReflection,
} from '@/services/journal';
import { getTodaysCheckIn } from '@/services/growth';
import { getCompletions } from '@/services/intervention';
import { getCurrentStepNumber } from '@/services/steps';
import { getPracticesForStep } from '@/utils/steps/twelve-steps';
import { getExerciseById } from '@/utils/interventions/registry';
import { MICRO_COURSES } from '@/utils/microcourses/course-registry';
import type { DailyCheckIn } from '@/types/growth';
import type { Intervention } from '@/types/intervention';
import type { CourseProgress } from '@/utils/microcourses/course-registry';
import JournalCover from '@/components/journal/JournalCover';
import JournalCalendar from '@/components/journal/JournalCalendar';
import JournalDayView from '@/components/journal/JournalDayView';
import JournalActivitySummary from '@/components/journal/JournalActivitySummary';
import JournalReflection from '@/components/journal/JournalReflection';
import { SoundHaptics } from '@/services/SoundHapticsService';
import { TooltipManager } from '@/components/ftue/TooltipManager';
import { WelcomeAudio } from '@/components/ftue/WelcomeAudio';
import {
  Colors,
  Spacing,
  FontSizes,
  BorderRadius,
} from '@/constants/theme';

// ─── Helpers ────────────────────────────────────────────

function todayString(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function getDayOfWeek(): number {
  const day = new Date().getDay();
  return day === 0 ? 6 : day - 1; // Monday=0 based
}

// ─── Screen ─────────────────────────────────────────────

export default function JournalScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const { isGuest } = useGuest();
  const user = session?.user;

  // State
  const [displayName, setDisplayName] = useState('');
  const [stats, setStats] = useState<JournalStats | null>(null);
  const [selectedDate, setSelectedDate] = useState(todayString());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth() + 1);
  const [calendarData, setCalendarData] = useState<Map<string, CalendarDayData>>(new Map());
  const [dayEntries, setDayEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [dayLoading, setDayLoading] = useState(false);

  // Reflection state
  const [reflectionQuestions, setReflectionQuestions] = useState<string[]>(
    getReflectionQuestions()
  );
  const [dailyReflection, setDailyReflection] = useState<DailyReflection | null>(null);
  const [reflectionSaving, setReflectionSaving] = useState(false);

  // Activity summary state
  const [todaysCheckIn, setTodaysCheckIn] = useState<DailyCheckIn | null>(null);
  const [todaysPractice, setTodaysPractice] = useState<Intervention | null>(null);
  const [activeCourse, setActiveCourse] = useState<{
    course: (typeof MICRO_COURSES)[number];
    progress: CourseProgress;
  } | null>(null);

  // ─── Load data on focus ──────────────────────────────

  const loadData = useCallback(async () => {
    if (!user && !isGuest) return;

    setLoading(true);
    try {
      // Get display name
      if (user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('display_name')
          .eq('user_id', user.id)
          .maybeSingle();

        if (profile?.display_name) {
          setDisplayName(profile.display_name);
        } else {
          // Fallback to AsyncStorage
          const stashed = await AsyncStorage.getItem('pending_display_name');
          if (stashed) setDisplayName(stashed);
        }

        // Get stats
        const journalStats = await getJournalStats(user.id);
        setStats(journalStats);

        // Get calendar data for current month
        const calData = await getJournalCalendarData(user.id, calendarYear, calendarMonth);
        setCalendarData(calData);

        // Get entries for selected date
        const entries = await getJournalEntriesForDate(user.id, selectedDate);
        setDayEntries(entries);

        // Get reflection questions for selected date + load saved reflection
        setReflectionQuestions(getReflectionQuestions(selectedDate));
        try {
          const refl = await getDailyReflection(user.id, selectedDate);
          setDailyReflection(refl);
        } catch {
          setDailyReflection(null);
        }

        // ── Load activity summary data (non-blocking) ──
        loadActivityData(user.id);
      } else {
        // Guest mode — no data
        setDisplayName('Guest');
        setStats(null);
        setCalendarData(new Map());
        setDayEntries([]);
        setTodaysCheckIn(null);
        setTodaysPractice(null);
        setActiveCourse(null);
        setDailyReflection(null);
      }
    } catch (err) {
      console.warn('[Journal] Load error:', err);
    } finally {
      setLoading(false);
    }
  }, [user, isGuest, calendarYear, calendarMonth, selectedDate]);

  const loadActivityData = useCallback(async (userId: string) => {
    // Load today's check-in
    try {
      const ci = await getTodaysCheckIn(userId);
      setTodaysCheckIn(ci);
    } catch {
      setTodaysCheckIn(null);
    }

    // Load today's practice
    try {
      const stepNum = await getCurrentStepNumber(userId);
      const practiceIds = getPracticesForStep(stepNum);
      const practices = practiceIds
        .map((id) => getExerciseById(id))
        .filter((ex): ex is Intervention => ex != null);

      if (practices.length > 0) {
        // Pick today's practice from the rotation
        const todayIdx = getDayOfWeek();
        const practice = practices[todayIdx % practices.length];
        setTodaysPractice(practice);
      } else {
        setTodaysPractice(null);
      }
    } catch {
      setTodaysPractice(null);
    }

    // Load active micro-course
    try {
      const completions = await getCompletions(userId, 200);
      const completedLessonIds = new Set(completions.map((c) => c.exerciseId));

      let found = false;
      for (const course of MICRO_COURSES) {
        const courseLessons = Array.from({ length: course.totalLessons }, (_, i) =>
          `${course.id}-lesson-${i + 1}`
        );
        const lessonsCompleted = courseLessons.filter((id) => completedLessonIds.has(id)).length;

        if (lessonsCompleted > 0 && lessonsCompleted < course.totalLessons) {
          setActiveCourse({
            course,
            progress: {
              courseId: course.id,
              lessonsCompleted,
              totalLessons: course.totalLessons,
              currentLesson: lessonsCompleted,
            },
          });
          found = true;
          break;
        }
      }
      if (!found) setActiveCourse(null);
    } catch {
      setActiveCourse(null);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  // ─── Calendar navigation ─────────────────────────────

  const handlePrevMonth = useCallback(async () => {
    SoundHaptics.tapSoft();
    let newMonth = calendarMonth - 1;
    let newYear = calendarYear;
    if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    }
    setCalendarMonth(newMonth);
    setCalendarYear(newYear);

    // Fetch calendar data for new month
    if (user) {
      try {
        const calData = await getJournalCalendarData(user.id, newYear, newMonth);
        setCalendarData(calData);
      } catch { /* non-blocking */ }
    }
  }, [calendarMonth, calendarYear, user]);

  const handleNextMonth = useCallback(async () => {
    SoundHaptics.tapSoft();
    let newMonth = calendarMonth + 1;
    let newYear = calendarYear;
    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    }
    setCalendarMonth(newMonth);
    setCalendarYear(newYear);

    // Fetch calendar data for new month
    if (user) {
      try {
        const calData = await getJournalCalendarData(user.id, newYear, newMonth);
        setCalendarData(calData);
      } catch { /* non-blocking */ }
    }
  }, [calendarMonth, calendarYear, user]);

  // ─── Day selection ───────────────────────────────────

  const handleSelectDate = useCallback(async (date: string) => {
    SoundHaptics.tapSoft();
    setSelectedDate(date);
    setDayLoading(true);
    setReflectionQuestions(getReflectionQuestions(date));

    if (user) {
      try {
        const entries = await getJournalEntriesForDate(user.id, date);
        setDayEntries(entries);
      } catch (err) {
        console.warn('[Journal] Day load error:', err);
        setDayEntries([]);
      }

      // Load reflection for selected date
      try {
        const refl = await getDailyReflection(user.id, date);
        setDailyReflection(refl);
      } catch {
        setDailyReflection(null);
      }
    }
    setDayLoading(false);
  }, [user]);

  // ─── Navigation callbacks ────────────────────────────

  const handlePressPractice = useCallback(() => {
    if (todaysPractice) {
      SoundHaptics.tapSoft();
      router.push({ pathname: '/(app)/exercise', params: { id: todaysPractice.id } } as any);
    }
  }, [todaysPractice, router]);

  const handlePressCourse = useCallback(() => {
    if (activeCourse) {
      SoundHaptics.tapSoft();
      router.push({ pathname: '/(app)/microcourse', params: { courseId: activeCourse.course.id } } as any);
    }
  }, [activeCourse, router]);

  // ─── Reflection save handler ────────────────────────

  const handleSaveReflection = useCallback(
    async (partial: Partial<DailyReflection>) => {
      if (!user) return;
      setReflectionSaving(true);
      try {
        await saveDailyReflection({
          userId: user.id,
          reflectionDate: partial.reflectionDate || selectedDate,
          questionResponses: partial.questionResponses || [],
          freeText: partial.freeText || '',
          dayTags: partial.dayTags || [],
        });
        // Refresh the reflection data
        const refl = await getDailyReflection(user.id, selectedDate);
        setDailyReflection(refl);
      } catch (err) {
        console.warn('[Journal] Save reflection error:', err);
      } finally {
        setReflectionSaving(false);
      }
    },
    [user, selectedDate]
  );

  // ─── Render ──────────────────────────────────────────

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.secondary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Back button */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => { SoundHaptics.tapSoft(); router.push('/(app)/home' as any); }}
          activeOpacity={0.6}
        >
          <Text style={styles.backArrow}>{'\u2039'}</Text>
          <Text style={styles.backText}>Home</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Cover */}
        <JournalCover
          displayName={displayName}
          stats={stats}
        />

        {/* 2. Calendar */}
        <JournalCalendar
          year={calendarYear}
          month={calendarMonth}
          selectedDate={selectedDate}
          calendarData={calendarData}
          onSelectDate={handleSelectDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />

        {/* 3. Activity Summary — practices, courses, check-in */}
        <JournalActivitySummary
          todaysCheckIn={todaysCheckIn}
          todaysPractice={todaysPractice}
          activeCourse={activeCourse}
          onPressPractice={handlePressPractice}
          onPressCourse={handlePressCourse}
        />

        {/* 4. Reflection — WEARE questions, tags, free journal */}
        <JournalReflection
          date={selectedDate}
          questions={reflectionQuestions}
          reflection={dailyReflection}
          onSave={handleSaveReflection}
          saving={reflectionSaving}
          isToday={selectedDate === todayString()}
        />

        {/* 5. Day View — timeline entries for selected date */}
        <JournalDayView
          date={selectedDate}
          entries={dayEntries}
          loading={dayLoading}
        />

        {/* Bottom spacer */}
        <View style={{ height: Spacing.xxl }} />
      </ScrollView>

      {/* FTUE Overlays */}
      <TooltipManager screen="journal" />
      <WelcomeAudio screenKey="journal" />
      <HomeButton />
    </SafeAreaView>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  topBar: {
    paddingHorizontal: Spacing.md,
    paddingTop: Platform.OS === 'ios' ? Spacing.xs : Spacing.md,
    paddingBottom: Spacing.sm,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    alignSelf: 'flex-start',
    paddingVertical: Spacing.xs,
    paddingRight: Spacing.md,
  },
  backArrow: {
    fontSize: 28,
    color: Colors.text,
    lineHeight: 28,
  },
  backText: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
  },

  scrollContent: {
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xxl,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
