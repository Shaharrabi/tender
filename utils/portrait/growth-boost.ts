/**
 * Growth Boost — Additive score bonus based on journey effort.
 *
 * The portrait "overall" score is the average of 7 assessment-based composite
 * scores (0-100). This module adds a transparent boost (0-20) on top, so
 * completing steps, growing edges, doing practices, and maintaining streaks
 * actually move the number.
 *
 * The assessment baseline is NEVER modified — the boost is layered on top.
 */

import type { GrowthStage } from '@/types/growth';

// ─── Types ────────────────────────────────────────────────

export interface GrowthBoostInput {
  stepsCompleted: number;            // 0-12
  growthEdgeStages: GrowthStage[];   // array of stage values
  totalPracticeCompletions: number;  // total exercise completion count
  currentStreak: number;             // daily engagement streak
}

export interface GrowthBoostedResult {
  baselineScore: number;   // the 7-score average (unchanged)
  growthBoost: number;     // the additive bonus (0-20)
  boostedScore: number;    // min(baseline + boost, 100)
  breakdown: {
    stepsBoost: number;     // 0-5
    edgesBoost: number;     // 0-8
    practicesBoost: number; // 0-5
    streakBoost: number;    // 0-2
  };
}

// ─── Stage points ─────────────────────────────────────────

const STAGE_POINTS: Record<GrowthStage, number> = {
  emerging: 0,
  practicing: 1,
  integrating: 2.5,
  integrated: 4,
};

// ─── Core calculation ─────────────────────────────────────

export function calculateGrowthBoost(input: GrowthBoostInput): {
  total: number;
  breakdown: GrowthBoostedResult['breakdown'];
} {
  // Steps completed: 0-12 → 0-5 points (linear)
  const stepsBoost = round1((input.stepsCompleted / 12) * 5);

  // Growth edge stages: each edge at higher stage adds points (max 8)
  const edgesBoost = Math.min(
    8,
    round1(
      input.growthEdgeStages.reduce(
        (sum, stage) => sum + (STAGE_POINTS[stage] ?? 0),
        0,
      ),
    ),
  );

  // Practice completions: logarithmic (diminishing returns), max 5
  // 0→0, 5→~2.6, 15→4, 30→5
  const practicesBoost = Math.min(
    5,
    round1(Math.log2(input.totalPracticeCompletions + 1) * 1.0),
  );

  // Streak: linear up to 14 days, max 2
  const streakBoost = Math.min(2, round1((input.currentStreak / 14) * 2));

  const total = Math.min(
    20,
    Math.round(stepsBoost + edgesBoost + practicesBoost + streakBoost),
  );

  return {
    total,
    breakdown: { stepsBoost, edgesBoost, practicesBoost, streakBoost },
  };
}

/**
 * Returns the boosted score and its breakdown, given the raw baseline
 * (average of 7 composite scores) and growth input data.
 */
export function getGrowthBoostedScore(
  baselineScore: number,
  input: GrowthBoostInput,
): GrowthBoostedResult {
  const { total, breakdown } = calculateGrowthBoost(input);
  return {
    baselineScore,
    growthBoost: total,
    boostedScore: Math.min(100, baselineScore + total),
    breakdown,
  };
}

// ─── Helpers ──────────────────────────────────────────────

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
