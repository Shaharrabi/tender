/**
 * Intervention Registry
 *
 * Central registry of all 43 exercises with lookup,
 * filtering, and recommendation functions.
 */

import type { Intervention, InterventionCategory, FourMovement } from '@/types/intervention';
import type { NervousSystemState } from '@/types/chat';
import { enrichWithMetadata } from './practice-metadata';

// ─── Original 8 Exercises ──────────────────────────────
import { grounding54321 } from './exercises/grounding-5-4-3-2-1';
import { softStartup } from './exercises/soft-startup';
import { partsCheckIn } from './exercises/parts-check-in';
import { valuesCompass } from './exercises/values-compass';
import { windowCheck } from './exercises/window-check';
import { repairAttempt } from './exercises/repair-attempt';
import { emotionalBid } from './exercises/emotional-bid';
import { selfCompassionBreak } from './exercises/self-compassion-break';

// ─── New Gottman Method Exercises ──────────────────────
import { loveMaps } from './exercises/love-maps';
import { fondnessAdmiration } from './exercises/fondness-admiration';
import { turningToward } from './exercises/turning-toward';
import { dreamsWithinConflict } from './exercises/dreams-within-conflict';
import { aftermathOfFight } from './exercises/aftermath-of-fight';

// ─── New EFT Exercises ─────────────────────────────────
import { recognizeCycle } from './exercises/recognize-cycle';
import { holdMeTight } from './exercises/hold-me-tight';

// ─── New IBCT Exercises ────────────────────────────────
import { unifiedDetachment } from './exercises/unified-detachment';
import { empathicJoining } from './exercises/empathic-joining';

// ─── New ACT Exercise ──────────────────────────────────
import { relationshipValuesCompass } from './exercises/relationship-values-compass';

// ─── New DBT-Informed Exercise ─────────────────────────
import { distressToleranceTogether } from './exercises/distress-tolerance-together';

// ─── New PACT-Informed Exercise ────────────────────────
import { coupleBubble } from './exercises/couple-bubble';

// ─── Additional DBT Exercises ─────────────────────────
import { oppositeAction } from './exercises/opposite-action';
import { radicalAcceptance } from './exercises/radical-acceptance';
import { dearMan } from './exercises/interpersonal-effectiveness';

// ─── Additional EFT Exercises ─────────────────────────
import { accessingPrimaryEmotions } from './exercises/accessing-primary-emotions';
import { bondingThroughVulnerability } from './exercises/bonding-through-vulnerability';
import { protestPolka } from './exercises/the-protest-polka';

// ─── Additional Gottman Exercises ─────────────────────
import { stressReducingConversation } from './exercises/stress-reducing-conversation';
import { fourHorsemenAntidotes } from './exercises/four-horsemen-antidotes';
import { ritualsOfConnection } from './exercises/rituals-of-connection';

// ─── Additional ACT Exercises ─────────────────────────
import { defusionFromStories } from './exercises/defusion-from-stories';
import { willingnessStance } from './exercises/willingness-stance';

// ─── Additional IFS Exercise ──────────────────────────
import { protectorDialogue } from './exercises/protector-dialogue';

// ─── Step 12 Capstone ────────────────────────────────
import { relationshipMissionStatement } from './exercises/relationship-mission-statement';

// ─── New Interactive Exercises ───────────────────────
import { emotionalInheritanceScan } from './exercises/emotional-inheritance-scan';
import { assumptionAudit } from './exercises/assumption-audit';
import { overFunctioningBrake } from './exercises/over-functioning-brake';
import { backToBackBreathe } from './exercises/back-to-back-breathe';
import { externalizingTheProblem } from './exercises/externalizing-the-problem';
import { newsReporterStance } from './exercises/news-reporter-stance';
import { littleYouPhotoShare } from './exercises/little-you-photo-share';
import { reassuranceMenu } from './exercises/reassurance-menu';
import { relationshipBullseye } from './exercises/relationship-bullseye';
import { eulogyExercise } from './exercises/eulogy-exercise';

// ─── Exercise Registry ──────────────────────────────────

// Enrich all exercises with Four Movements + vulnerability metadata
const EXERCISES: Intervention[] = [
  // Regulation (8)
  grounding54321,
  windowCheck,
  selfCompassionBreak,
  distressToleranceTogether,
  oppositeAction,
  radicalAcceptance,
  assumptionAudit,
  backToBackBreathe,

  // Communication (12)
  softStartup,
  repairAttempt,
  turningToward,
  dreamsWithinConflict,
  aftermathOfFight,
  unifiedDetachment,
  empathicJoining,
  dearMan,
  stressReducingConversation,
  fourHorsemenAntidotes,
  externalizingTheProblem,
  newsReporterStance,

  // Attachment (12)
  emotionalBid,
  loveMaps,
  fondnessAdmiration,
  recognizeCycle,
  holdMeTight,
  coupleBubble,
  accessingPrimaryEmotions,
  bondingThroughVulnerability,
  protestPolka,
  ritualsOfConnection,
  littleYouPhotoShare,
  reassuranceMenu,

  // Values (6)
  valuesCompass,
  relationshipValuesCompass,
  willingnessStance,
  relationshipMissionStatement,
  relationshipBullseye,
  eulogyExercise,

  // Differentiation (5)
  partsCheckIn,
  defusionFromStories,
  protectorDialogue,
  emotionalInheritanceScan,
  overFunctioningBrake,
].map(enrichWithMetadata);

const exerciseMap = new Map<string, Intervention>(
  EXERCISES.map((ex) => [ex.id, ex])
);

// ─── Public API ─────────────────────────────────────────

/** Returns all registered exercises. */
export function getAllExercises(): Intervention[] {
  return EXERCISES;
}

/** Looks up a single exercise by ID. Returns undefined if not found. */
export function getExerciseById(id: string): Intervention | undefined {
  return exerciseMap.get(id);
}

/** Returns exercises filtered by category. */
export function getExercisesByCategory(
  category: InterventionCategory
): Intervention[] {
  return EXERCISES.filter((ex) => ex.category === category);
}

/** Returns exercises designed for couples (mode = 'together'). */
export function getCoupleExercises(): Intervention[] {
  return EXERCISES.filter((ex) => ex.mode === 'together');
}

/** Returns exercises that can be done solo. */
export function getSoloExercises(): Intervention[] {
  return EXERCISES.filter((ex) => ex.mode === 'solo' || ex.mode === 'either');
}

/**
 * Returns recommended exercises based on detected patterns and
 * nervous system state. Scores each exercise by how many of the
 * provided patterns it matches, plus a bonus for state match.
 * Results are sorted by relevance (highest score first).
 */
export function getRecommendedExercises(
  patterns: string[],
  state: NervousSystemState,
  limit = 3
): Intervention[] {
  if (patterns.length === 0 && !state) {
    return EXERCISES.slice(0, limit);
  }

  const patternSet = new Set(patterns.map((p) => p.toLowerCase()));

  const scored = EXERCISES.map((exercise) => {
    let score = 0;

    // Score pattern matches
    for (const pattern of exercise.forPatterns) {
      if (patternSet.has(pattern.toLowerCase())) {
        score += 2;
      }
    }

    // Score state match
    if (exercise.forStates.includes(state)) {
      score += 1;
    }

    return { exercise, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.exercise);
}

/** Returns exercises that primarily cultivate a specific Four Movement. */
export function getExercisesByMovement(movement: FourMovement): Intervention[] {
  return EXERCISES.filter((ex) => ex.fourMovement === movement);
}

/** All available categories for filter UIs. */
export const CATEGORIES: { key: InterventionCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'regulation', label: 'Regulation' },
  { key: 'communication', label: 'Communication' },
  { key: 'attachment', label: 'Attachment' },
  { key: 'values', label: 'Values' },
  { key: 'differentiation', label: 'Differentiation' },
];
