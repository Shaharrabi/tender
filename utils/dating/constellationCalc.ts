/**
 * Constellation Calculator
 *
 * Converts game answers into a dating constellation — the user's
 * pattern of energies they bring to new connections.
 *
 * Also maps constellation traits to WEARE variables for
 * resonance scoring.
 */

import type { GameAnswer, ConstellationResult, ArchetypeScores } from '@/types/dating';

/**
 * Mapping from game traits to WEARE variables.
 *
 * | Game Trait     | WEARE Variable          | Weight |
 * |----------------|-------------------------|--------|
 * | secure         | attunement, space       | High   |
 * | anxious        | attunement, resistance  | Flags  |
 * | avoidant       | space, resistance       | Flags  |
 * | fearful        | resistance, change      | Flags  |
 * | openness       | coCreation              | Direct |
 * | vulnerability  | transmission            | Direct |
 * | courage        | change                  | Direct |
 * | patience       | space                   | Direct |
 * | growth         | change                  | Direct |
 * | intimacy       | attunement              | Direct |
 * | independence   | space                   | Direct |
 * | depth          | individual              | Direct |
 * | presence       | attunement              | Direct |
 * | caution        | resistance              | Not negative |
 */
const TRAIT_TO_WEARE: Record<string, Record<string, number>> = {
  secure:        { attunement: 0.8, space: 0.6 },
  anxious:       { attunement: 0.5, resistance: 0.4 },
  avoidant:      { space: 0.6, resistance: 0.5 },
  fearful:       { resistance: 0.5, change: 0.4 },
  openness:      { coCreation: 0.8 },
  vulnerability: { transmission: 0.9 },
  courage:       { change: 0.8 },
  patience:      { space: 0.7 },
  growth:        { change: 0.8 },
  intimacy:      { attunement: 0.8 },
  independence:  { space: 0.8 },
  depth:         { individual: 0.8 },
  presence:      { attunement: 0.7 },
  caution:       { resistance: 0.3 },
};

/**
 * Calculate the full constellation from game answers.
 */
export function calculateConstellation(answers: GameAnswer[]): ConstellationResult {
  // 1. Aggregate all trait points
  const allScores: ArchetypeScores = {};
  answers.forEach((answer) => {
    Object.entries(answer.points).forEach(([trait, points]) => {
      allScores[trait] = (allScores[trait] || 0) + points;
    });
  });

  // 2. Sort by score to find top traits
  const sorted = Object.entries(allScores).sort((a, b) => b[1] - a[1]);
  const topTraits = sorted.slice(0, 3).map(([trait]) => trait);

  // 3. Map to WEARE variables
  const weareMapping: Record<string, number> = {};
  Object.entries(allScores).forEach(([trait, score]) => {
    const mapping = TRAIT_TO_WEARE[trait];
    if (mapping) {
      Object.entries(mapping).forEach(([weareVar, weight]) => {
        weareMapping[weareVar] = (weareMapping[weareVar] || 0) + score * weight;
      });
    }
  });

  // 4. Normalize WEARE values to 0-100 range
  const maxWeare = Math.max(...Object.values(weareMapping), 1);
  Object.keys(weareMapping).forEach((key) => {
    weareMapping[key] = Math.round((weareMapping[key] / maxWeare) * 100);
  });

  return {
    topTraits,
    allScores,
    weareMapping,
  };
}

/**
 * Calculate aggregate archetype scores from answers.
 * Returns the raw point totals for each trait.
 */
export function calculateArchetypeScores(answers: GameAnswer[]): ArchetypeScores {
  const scores: ArchetypeScores = {};
  answers.forEach((answer) => {
    Object.entries(answer.points).forEach(([trait, points]) => {
      scores[trait] = (scores[trait] || 0) + points;
    });
  });
  return scores;
}
