/**
 * Streak & Commitment Service
 * Tracks daily engagement and calculates streaks.
 */

import { supabase } from '@/services/supabase';

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
  todayRecorded: boolean;
  streakDates: string[]; // YYYY-MM-DD format, last 30 days
  commitmentDay: number; // which day of 30-day commitment (0 = not started)
  commitmentStartDate: string | null;
}

/**
 * Record today's engagement. Idempotent — safe to call multiple times.
 */
export async function recordDailyEngagement(userId: string): Promise<void> {
  const today = new Date().toISOString().split('T')[0];

  const { error } = await supabase
    .from('engagement_streaks')
    .upsert(
      { user_id: userId, date: today, activity_type: 'app_open' },
      { onConflict: 'user_id,date,activity_type' }
    );

  if (error && __DEV__) {
    console.error('[Streaks] Failed to record engagement:', error);
  }
}

/**
 * Get streak data for the user.
 */
export async function getStreakData(userId: string): Promise<StreakData> {
  // Fetch all engagement dates, sorted descending
  const { data, error } = await supabase
    .from('engagement_streaks')
    .select('date')
    .eq('user_id', userId)
    .eq('activity_type', 'app_open')
    .order('date', { ascending: false })
    .limit(365);

  if (error || !data || data.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalDays: 0,
      todayRecorded: false,
      streakDates: [],
      commitmentDay: 0,
      commitmentStartDate: null,
    };
  }

  const today = new Date().toISOString().split('T')[0];
  const dates = data.map((r: any) => r.date as string);
  const todayRecorded = dates[0] === today;

  // Calculate current streak
  let currentStreak = 0;

  // Check if we should start from today or yesterday
  if (todayRecorded || dates[0] === yesterday()) {
    let checkDate = todayRecorded ? today : yesterday();
    for (let i = 0; i < dates.length; i++) {
      if (dates[i] === checkDate) {
        currentStreak++;
        checkDate = getPreviousDay(checkDate);
      } else if (dates[i] < checkDate) {
        break;
      }
    }
  }

  // Calculate longest streak
  let longestStreak = 0;
  let tempStreak = 1;
  const sortedAsc = [...dates].reverse();
  for (let i = 1; i < sortedAsc.length; i++) {
    const prev = new Date(sortedAsc[i - 1]);
    const curr = new Date(sortedAsc[i]);
    const diffDays = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays === 1) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);

  // Last 30 days of streak dates
  const last30 = dates.filter((d: string) => {
    const diff = (new Date(today).getTime() - new Date(d).getTime()) / (1000 * 60 * 60 * 24);
    return diff < 30;
  });

  // Commitment tracking — first 30 consecutive days
  // The commitment starts on the first recorded date
  const firstDate = sortedAsc[0];
  const commitmentStartDate = firstDate;
  const daysSinceStart = Math.floor(
    (new Date(today).getTime() - new Date(firstDate).getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;
  const commitmentDay = Math.min(daysSinceStart, 30);

  return {
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak),
    totalDays: dates.length,
    todayRecorded,
    streakDates: last30,
    commitmentDay: dates.length > 0 ? commitmentDay : 0,
    commitmentStartDate: dates.length > 0 ? commitmentStartDate : null,
  };
}

function yesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

function getPreviousDay(dateStr: string): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}
