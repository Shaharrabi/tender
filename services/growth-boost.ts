/**
 * Growth Boost Service — Aggregates data from 4 sources for the growth-boosted
 * portrait score. All queries run in parallel for performance.
 */

import { getStepProgress } from './steps';
import { getGrowthEdgeProgress } from './growth';
import { getCompletions } from './intervention';
import { getStreakData } from './streaks';
import type { GrowthBoostInput } from '@/utils/portrait/growth-boost';
import type { GrowthStage, GrowthEdgeProgress } from '@/types/growth';

export interface GrowthBoostData extends GrowthBoostInput {
  /** Full edge progress records (for UI display beyond just stages) */
  edgeProgress: GrowthEdgeProgress[];
}

/**
 * Fetches all growth data needed for the boost calculation in one shot.
 * Four lightweight parallel queries — adds ~100-200ms to load time.
 */
export async function fetchGrowthBoostData(
  userId: string,
): Promise<GrowthBoostData> {
  const [stepProgress, edgeProgress, completions, streakData] =
    await Promise.all([
      getStepProgress(userId).catch(() => []),
      getGrowthEdgeProgress(userId).catch(() => []),
      getCompletions(userId, 500).catch(() => []),
      getStreakData(userId).catch(() => ({
        currentStreak: 0,
        longestStreak: 0,
        totalDays: 0,
        todayRecorded: false,
        streakDates: [],
        commitmentDay: 0,
        commitmentStartDate: null,
      })),
    ]);

  return {
    stepsCompleted: stepProgress.filter((s) => s.status === 'completed').length,
    growthEdgeStages: edgeProgress.map((e) => e.stage as GrowthStage),
    totalPracticeCompletions: completions.length,
    currentStreak: streakData.currentStreak,
    edgeProgress,
  };
}
