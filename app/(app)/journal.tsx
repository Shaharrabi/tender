/**
 * Journal Screen — Personal relationship timeline.
 *
 * Aggregates all user activity (check-ins, exercises, assessments,
 * chat, XP) into a beautiful book-like journal with:
 *   1. Cover — user name + journey stats
 *   2. Calendar — month view with colored activity dots
 *   3. Day View — timeline of entries for the selected day
 *
 * Wes Anderson aesthetic: warm parchment, serif accents, dusty rose.
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/context/AuthContext';
import { useGuest } from '@/context/GuestContext';
import { supabase } from '@/services/supabase';
import {
  getJournalEntriesForDate,
  getJournalCalendarData,
  getJournalStats,
  type JournalEntry,
  type JournalStats,
  type CalendarDayData,
} from '@/services/journal';
import JournalCover from '@/components/journal/JournalCover';
import JournalCalendar from '@/components/journal/JournalCalendar';
import JournalDayView from '@/components/journal/JournalDayView';
import { SoundHaptics } from '@/services/SoundHapticsService';
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
      } else {
        // Guest mode — no data
        setDisplayName('Guest');
        setStats(null);
        setCalendarData(new Map());
        setDayEntries([]);
      }
    } catch (err) {
      console.warn('[Journal] Load error:', err);
    } finally {
      setLoading(false);
    }
  }, [user, isGuest, calendarYear, calendarMonth, selectedDate]);

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

    if (user) {
      try {
        const entries = await getJournalEntriesForDate(user.id, date);
        setDayEntries(entries);
      } catch (err) {
        console.warn('[Journal] Day load error:', err);
        setDayEntries([]);
      }
    }
    setDayLoading(false);
  }, [user]);

  // ─── Render ──────────────────────────────────────────

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
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
          onPress={() => { SoundHaptics.tapSoft(); router.back(); }}
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

        {/* 3. Day View */}
        <JournalDayView
          date={selectedDate}
          entries={dayEntries}
          loading={dayLoading}
        />

        {/* Bottom spacer */}
        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
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
