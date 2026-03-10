/**
 * Daily Pattern Card Selection
 *
 * Picks today's card by finding the user's lowest-scoring portrait
 * dimensions, then rotating through them across days.
 *
 * Algorithm:
 *   1. Rank the 7 dimensions by composite score (lowest first).
 *   2. Take the bottom 3 ("growth focus" dimensions).
 *   3. Use day-of-year mod 3 to pick which dimension gets today's card.
 *   4. Within that dimension, use day-of-year mod 10 to pick which card.
 *   5. Deterministic: same portrait + same date → same card every time.
 */

import type { IndividualPortrait } from '@/types/portrait';
import {
  ALL_PATTERN_CARDS,
  getCardsByDimension,
  DIMENSION_META,
  type PatternDimension,
  type PatternCard,
} from './patternCardContent';

// ─── Types ──────────────────────────────────────────────

export interface DailyCardResult {
  card: PatternCard;
  dimensionLabel: string;
  dimensionEmoji: string;
  /** Which composite score field this dimension maps to */
  compositeKey: string;
  /** The user's actual score for this dimension (0-100) */
  score: number;
}

// ─── Dimension Score Extraction ─────────────────────────

interface DimensionScore {
  dimension: PatternDimension;
  score: number;
}

function getDimensionScores(portrait: IndividualPortrait): DimensionScore[] {
  const cs = portrait.compositeScores;
  return [
    { dimension: 'security', score: cs.attachmentSecurity ?? 50 },
    { dimension: 'regulation', score: cs.regulationScore ?? 50 },
    { dimension: 'differentiation', score: cs.differentiation ?? 50 },
    { dimension: 'eq', score: cs.emotionalIntelligence ?? 50 },
    { dimension: 'values', score: cs.valuesCongruence ?? 50 },
    { dimension: 'conflict', score: cs.conflictFlexibility ?? 50 },
    { dimension: 'awareness', score: cs.relationalAwareness ?? 50 },
  ];
}

// ─── Day-of-Year Helper ─────────────────────────────────

function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

// ─── Selection Function ─────────────────────────────────

/**
 * Select today's daily pattern card based on portrait data.
 *
 * @param portrait   The user's individual portrait
 * @param date       The date to select for (defaults to today)
 * @returns          DailyCardResult with the card and dimension metadata,
 *                   or null if no portrait / no cards available
 */
export function selectDailyCard(
  portrait: IndividualPortrait | null,
  date: Date = new Date()
): DailyCardResult | null {
  if (!portrait) return null;

  // 1. Rank dimensions by score (lowest first = most growth potential)
  const scores = getDimensionScores(portrait);
  scores.sort((a, b) => a.score - b.score);

  // 2. Take bottom 3 dimensions as "growth focus"
  const growthFocus = scores.slice(0, 3);

  // 3. Rotate through bottom 3 by day
  const doy = dayOfYear(date);
  const focusIndex = doy % growthFocus.length;
  const todaysDimension = growthFocus[focusIndex];

  // 4. Get cards for this dimension and pick by day
  const dimensionCards = getCardsByDimension(todaysDimension.dimension);
  if (dimensionCards.length === 0) return null;

  const cardIndex = doy % dimensionCards.length;
  const card = dimensionCards[cardIndex];

  const meta = DIMENSION_META[todaysDimension.dimension];

  return {
    card,
    dimensionLabel: meta.label,
    dimensionEmoji: meta.emoji,
    compositeKey: meta.compositeKey,
    score: todaysDimension.score,
  };
}

/**
 * Get all growth-focus dimensions (lowest 3) for display purposes.
 */
export function getGrowthFocusDimensions(
  portrait: IndividualPortrait
): Array<{ dimension: PatternDimension; label: string; score: number }> {
  const scores = getDimensionScores(portrait);
  scores.sort((a, b) => a.score - b.score);

  return scores.slice(0, 3).map((s) => ({
    dimension: s.dimension,
    label: DIMENSION_META[s.dimension].label,
    score: s.score,
  }));
}
