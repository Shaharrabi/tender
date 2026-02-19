/**
 * Resonance Score Calculator
 *
 * Computes WEARE-based resonance between two dating profiles.
 * "Resonance" — not "match." How your constellations, values,
 * and growth directions align.
 */

import type { DatingProfile, ConstellationResult } from '@/types/dating';

/** WEARE dimensions used for resonance calculation */
const RESONANCE_DIMENSIONS = [
  'attunement',
  'coCreation',
  'transmission',
  'space',
  'change',
  'individual',
  'resistance',
] as const;

/**
 * Calculate resonance percentage between two profiles.
 *
 * Returns a number between 0 and 100 representing how
 * well two constellations align on WEARE dimensions.
 *
 * This is NOT a match score — it's a starting point for
 * curiosity about compatibility.
 */
export function calculateResonance(
  profileA: DatingProfile,
  profileB: DatingProfile,
): number {
  const constellationA = profileA.constellation;
  const constellationB = profileB.constellation;

  if (!constellationA || !constellationB) return 0;

  // 1. WEARE dimension similarity (60% weight)
  const weareSimilarity = calculateWEARESimilarity(
    constellationA.weareMapping,
    constellationB.weareMapping,
  );

  // 2. Complementary trait bonus (25% weight)
  // Some combinations enhance each other
  const complementBonus = calculateComplementBonus(
    constellationA.topTraits,
    constellationB.topTraits,
  );

  // 3. Growth direction alignment (15% weight)
  const growthAlignment = calculateGrowthAlignment(
    constellationA.allScores,
    constellationB.allScores,
  );

  const rawScore = weareSimilarity * 0.6 + complementBonus * 0.25 + growthAlignment * 0.15;

  // Clamp to 0-100 and add slight randomness for natural feel
  return Math.min(100, Math.max(0, Math.round(rawScore)));
}

/**
 * Calculate similarity between WEARE dimension profiles.
 * Uses cosine-like similarity.
 */
function calculateWEARESimilarity(
  mapA: Record<string, number>,
  mapB: Record<string, number>,
): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  RESONANCE_DIMENSIONS.forEach((dim) => {
    const a = mapA[dim] || 50; // Default to midpoint
    const b = mapB[dim] || 50;
    dotProduct += a * b;
    normA += a * a;
    normB += b * b;
  });

  if (normA === 0 || normB === 0) return 50;

  const cosineSim = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  // Convert from [0,1] to [0,100] range
  return cosineSim * 100;
}

/**
 * Bonus for complementary trait combinations.
 * Secure + any = bonus. Growth + depth = bonus.
 * Same top trait = strong resonance.
 */
function calculateComplementBonus(traitsA: string[], traitsB: string[]): number {
  let bonus = 50; // Baseline

  // Shared top trait = strong resonance
  const sharedTraits = traitsA.filter((t) => traitsB.includes(t));
  bonus += sharedTraits.length * 15;

  // Complementary pairs
  const complementaryPairs: [string, string][] = [
    ['vulnerability', 'patience'],
    ['courage', 'caution'],
    ['openness', 'depth'],
    ['intimacy', 'independence'],
    ['presence', 'growth'],
  ];

  complementaryPairs.forEach(([a, b]) => {
    if (
      (traitsA.includes(a) && traitsB.includes(b)) ||
      (traitsA.includes(b) && traitsB.includes(a))
    ) {
      bonus += 10;
    }
  });

  // Secure in either profile is always a positive signal
  if (traitsA.includes('secure') || traitsB.includes('secure')) {
    bonus += 8;
  }

  return Math.min(100, bonus);
}

/**
 * How aligned are both profiles on growth-oriented traits?
 */
function calculateGrowthAlignment(
  scoresA: Record<string, number>,
  scoresB: Record<string, number>,
): number {
  const growthTraits = ['growth', 'vulnerability', 'courage', 'openness'];
  let totalA = 0;
  let totalB = 0;

  growthTraits.forEach((trait) => {
    totalA += scoresA[trait] || 0;
    totalB += scoresB[trait] || 0;
  });

  // Both growth-oriented = high alignment
  const maxPossible = growthTraits.length * 4; // max 4 points per trait (2 scenarios max)
  const normA = totalA / maxPossible;
  const normB = totalB / maxPossible;

  // Similar growth orientation
  const diff = Math.abs(normA - normB);
  return Math.round((1 - diff) * 100);
}
