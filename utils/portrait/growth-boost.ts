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
import type { CompositeScores } from '@/types/portrait';

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

// ─── Per-Score Practice Boost ─────────────────────────────
//
// Maps individual practices (by ID or category) to the composite score
// they are most likely to improve. Used to show "+N" indicators on
// specific score rows in the Scores tab and to fire boost toasts.
//
// Assessment baselines are NEVER changed — this is a visual boost layer.

/** Max cumulative boost any single composite score can receive. */
export const MAX_PER_SCORE_BOOST = 15;

/** Points awarded per practice completion for a mapped score. */
export const BOOST_PER_PRACTICE = 2;

/**
 * Maps specific practice/exercise IDs to the composite score they boost.
 * These IDs correspond to entries in the intervention registry.
 */
export const PRACTICE_SCORE_MAP: Partial<Record<string, keyof CompositeScores>> = {
  // Regulation exercises
  'grounding-478': 'regulationScore',
  'window-widening': 'regulationScore',
  'nervous-system-reset': 'regulationScore',
  'window-of-tolerance-expansion': 'windowWidth',
  // Attachment exercises
  'attachment-awareness': 'attachmentSecurity',
  'secure-base-visualization': 'attachmentSecurity',
  'accessibility-check-in': 'accessibility',
  'responsiveness-practice': 'responsiveness',
  'engagement-deepener': 'engagement',
  // Conflict exercises
  'conflict-repair': 'conflictFlexibility',
  'rupture-repair': 'conflictFlexibility',
  'de-escalation-moves': 'conflictFlexibility',
  // Emotional intelligence exercises
  'emotional-check-in': 'emotionalIntelligence',
  'emotion-naming': 'emotionalIntelligence',
  'empathy-deepener': 'emotionalIntelligence',
  // Values exercises
  'values-alignment': 'valuesCongruence',
  'values-inventory': 'valuesCongruence',
  'values-gap-reflection': 'valuesCongruence',
  // Differentiation exercises
  'differentiation-exercise': 'differentiation',
  'self-leadership-practice': 'selfLeadership',
  'reclaim-self': 'selfLeadership',
  // Relational awareness
  'relational-awareness': 'relationalAwareness',
  'partner-lens': 'relationalAwareness',
};

/**
 * Maps exercise categories to the composite score they boost.
 * Used as a fallback when the exercise ID has no specific mapping.
 */
export const CATEGORY_BOOST: Record<string, keyof CompositeScores> = {
  regulation: 'regulationScore',
  attachment: 'attachmentSecurity',
  conflict: 'conflictFlexibility',
  values: 'valuesCongruence',
  differentiation: 'differentiation',
  communication: 'relationalAwareness',
};

/**
 * Human-readable label for each boosted composite score.
 * Used in the boost toast message.
 */
export const SCORE_DISPLAY_NAMES: Partial<Record<keyof CompositeScores, string>> = {
  regulationScore: 'Regulation Score',
  windowWidth: 'Window of Tolerance',
  accessibility: 'Accessibility',
  responsiveness: 'Responsiveness',
  engagement: 'Engagement',
  selfLeadership: 'Self-Leadership',
  valuesCongruence: 'Values Congruence',
  attachmentSecurity: 'Attachment Security',
  emotionalIntelligence: 'Emotional Intelligence',
  differentiation: 'Differentiation',
  conflictFlexibility: 'Conflict Flexibility',
  relationalAwareness: 'Relational Awareness',
};

/**
 * Determines which composite score a practice boosts, checking the
 * specific practice ID first, then the exercise category as a fallback.
 */
export function getScoreKeyForPractice(
  practiceId: string,
  category?: string,
): keyof CompositeScores | null {
  if (PRACTICE_SCORE_MAP[practiceId]) return PRACTICE_SCORE_MAP[practiceId]!;
  if (category && CATEGORY_BOOST[category]) return CATEGORY_BOOST[category];
  return null;
}

/**
 * Calculates per-score boosts from a list of practice completion records.
 * Returns a map of scoreKey → total boost points (capped at MAX_PER_SCORE_BOOST).
 *
 * @param completions - Array of { practiceId, category? } objects
 */
export function calculatePerScoreBoosts(
  completions: Array<{ practiceId: string; category?: string }>,
): Partial<Record<keyof CompositeScores, number>> {
  const boosts: Partial<Record<keyof CompositeScores, number>> = {};

  for (const c of completions) {
    const scoreKey = getScoreKeyForPractice(c.practiceId, c.category);
    if (!scoreKey) continue;

    const current = boosts[scoreKey] ?? 0;
    boosts[scoreKey] = Math.min(MAX_PER_SCORE_BOOST, current + BOOST_PER_PRACTICE);
  }

  return boosts;
}
