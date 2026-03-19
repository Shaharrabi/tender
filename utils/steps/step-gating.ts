/**
 * Step Gating — Progressive Assessment Unlock System
 *
 * Controls which 12-step steps are available based on completed assessments.
 * Steps unlock progressively as users complete more assessments, creating
 * a personalized journey that deepens with each new data point.
 *
 * Gating tiers:
 *   Steps 1-2:  ECR-R only (attachment — 1 assessment)
 *   Steps 3-4:  ECR-R + Personality + EQ (3 assessments)
 *   Steps 5-7:  All 6 individual assessments (full portrait)
 *   Steps 8-12: All individual + at least 1 couple assessment
 *
 * Philosophy: Never show a "locked" barrier. Show an invitation
 * that explains WHY the assessment matters and WHAT it unlocks.
 */

import type { IndividualAssessmentType, DyadicAssessmentType } from '@/types';

// ─── Gate Definitions ────────────────────────────────────

export interface StepGate {
  /** Steps this gate controls */
  steps: number[];
  /** Individual assessments required */
  requiredIndividual: IndividualAssessmentType[];
  /** Minimum couple assessments required (0 = none needed) */
  minCoupleAssessments: number;
  /** Human-readable tier name */
  tierName: string;
  /** What insight this tier provides */
  tierInsight: string;
}

export const STEP_GATES: StepGate[] = [
  {
    steps: [1, 2],
    requiredIndividual: ['ecr-r'],
    minCoupleAssessments: 0,
    tierName: 'Foundation',
    tierInsight: 'Your attachment style — how you reach for and respond to connection',
  },
  {
    steps: [3, 4],
    requiredIndividual: ['ecr-r', 'tender-personality-60', 'sseit'],
    minCoupleAssessments: 0,
    tierName: 'Inner Landscape',
    tierInsight: 'Your personality, emotional intelligence, and how they shape your relationship',
  },
  {
    steps: [5, 6, 7],
    requiredIndividual: ['ecr-r', 'tender-personality-60', 'sseit', 'dsi-r', 'dutch', 'values'],
    minCoupleAssessments: 0,
    tierName: 'Full Portrait',
    tierInsight: 'Your complete relational portrait — all dimensions mapped and integrated',
  },
  {
    steps: [8, 9, 10, 11, 12],
    requiredIndividual: ['ecr-r', 'tender-personality-60', 'sseit', 'dsi-r', 'dutch', 'values'],
    minCoupleAssessments: 1,
    tierName: 'Couple Integration',
    tierInsight: 'How your patterns interact with your partner\'s — the couple dynamic revealed',
  },
];

// ─── Assessment Display Names ────────────────────────────

const ASSESSMENT_DISPLAY_NAMES: Record<string, string> = {
  'ecr-r': 'How You Connect',
  'tender-personality-60': 'Who You Are in Love',
  'sseit': 'How You Feel',
  'dsi-r': 'How You Hold Ground',
  'dutch': 'How You Navigate Conflict',
  'values': 'What Matters Most',
  'rdas': 'Relationship Quality',
  'dci': 'Stress & Coping',
  'csi-16': 'Relationship Closeness',
};

const ASSESSMENT_UNLOCK_DESCRIPTIONS: Record<string, string> = {
  'ecr-r': 'Your attachment assessment reveals how you reach for connection — and what happens when distance appears. This is the foundation everything else builds on.',
  'tender-personality-60': 'Your personality assessment maps who you are in love — how your general personality shifts in the intimacy zone. Steps 3-4 use this to show you which version of yourself appears under stress.',
  'sseit': 'Your emotional intelligence assessment reveals how you read emotions — yours and your partner\'s. That understanding shapes everything in Steps 3-4.',
  'dsi-r': 'Your differentiation assessment shows how you hold your ground in closeness — where you merge, where you cut off, where you stand firm.',
  'dutch': 'Your conflict assessment reveals your natural moves when disagreement arrives — yielding, forcing, avoiding, problem-solving, or compromising.',
  'values': 'Your values assessment maps what matters most to you — and where your actions don\'t yet match your heart.',
  'rdas': 'This couple assessment explores how aligned you and your partner are — consensus, satisfaction, and cohesion in your relationship.',
  'dci': 'This couple assessment reveals how you and your partner support each other through stress — your coping partnership.',
  'csi-16': 'This couple assessment measures how close and satisfied you feel — the emotional temperature of your relationship right now.',
};

// ─── Gating Logic ────────────────────────────────────────

export interface StepAccessResult {
  /** Whether the step is accessible */
  isAccessible: boolean;
  /** The gate tier this step belongs to */
  gate: StepGate;
  /** Which individual assessments are still needed */
  missingIndividual: IndividualAssessmentType[];
  /** Whether couple assessments are needed */
  needsCoupleAssessment: boolean;
  /** The NEXT assessment to take (most impactful for unlocking) */
  nextAssessment: string | null;
  /** Display name of the next assessment */
  nextAssessmentName: string | null;
  /** Description of what the next assessment unlocks */
  nextAssessmentDescription: string | null;
  /** Steps that will unlock when the next assessment is completed */
  stepsUnlocked: number[];
}

/**
 * Check whether a specific step is accessible given the user's completed assessments.
 */
export function getStepAccess(
  stepNumber: number,
  completedIndividual: string[],
  completedCouple: string[],
): StepAccessResult {
  // Find the gate for this step
  const gate = STEP_GATES.find((g) => g.steps.includes(stepNumber));
  if (!gate) {
    // Steps not in any gate are always accessible
    return {
      isAccessible: true,
      gate: STEP_GATES[0],
      missingIndividual: [],
      needsCoupleAssessment: false,
      nextAssessment: null,
      nextAssessmentName: null,
      nextAssessmentDescription: null,
      stepsUnlocked: [],
    };
  }

  const completedSet = new Set(completedIndividual);
  const missingIndividual = gate.requiredIndividual.filter(
    (a) => !completedSet.has(a),
  ) as IndividualAssessmentType[];

  const coupleCount = completedCouple.length;
  const needsCoupleAssessment = gate.minCoupleAssessments > 0 && coupleCount < gate.minCoupleAssessments;

  const isAccessible = missingIndividual.length === 0 && !needsCoupleAssessment;

  // Determine the next assessment to recommend
  let nextAssessment: string | null = null;
  let stepsUnlocked: number[] = [];

  if (!isAccessible) {
    if (missingIndividual.length > 0) {
      // Recommend the first missing individual assessment
      nextAssessment = missingIndividual[0];
    } else if (needsCoupleAssessment) {
      // Recommend the first couple assessment
      nextAssessment = 'rdas'; // Default recommendation
    }

    // Calculate which steps will unlock when the next gate is satisfied
    if (nextAssessment) {
      // Find the current gate tier and determine which steps unlock next
      const currentGateIndex = STEP_GATES.indexOf(gate);
      stepsUnlocked = gate.steps;
    }
  }

  return {
    isAccessible,
    gate,
    missingIndividual,
    needsCoupleAssessment,
    nextAssessment,
    nextAssessmentName: nextAssessment ? ASSESSMENT_DISPLAY_NAMES[nextAssessment] ?? nextAssessment : null,
    nextAssessmentDescription: nextAssessment ? ASSESSMENT_UNLOCK_DESCRIPTIONS[nextAssessment] ?? null : null,
    stepsUnlocked,
  };
}

/**
 * Get unlock status for ALL 12 steps at once.
 * Returns a map of step number → access result.
 */
export function getAllStepAccess(
  completedIndividual: string[],
  completedCouple: string[],
): Record<number, StepAccessResult> {
  const result: Record<number, StepAccessResult> = {};
  for (let step = 1; step <= 12; step++) {
    result[step] = getStepAccess(step, completedIndividual, completedCouple);
  }
  return result;
}

/**
 * Get the highest accessible step number.
 */
export function getHighestAccessibleStep(
  completedIndividual: string[],
  completedCouple: string[],
): number {
  for (let step = 12; step >= 1; step--) {
    const access = getStepAccess(step, completedIndividual, completedCouple);
    if (access.isAccessible) return step;
  }
  return 0; // No steps accessible (no assessments completed)
}

/**
 * Get the next unlock opportunity — what assessment to take and what it unlocks.
 */
export function getNextUnlockOpportunity(
  completedIndividual: string[],
  completedCouple: string[],
): {
  assessmentType: string;
  assessmentName: string;
  assessmentDescription: string;
  stepsUnlocked: number[];
  tierName: string;
  message: string;
} | null {
  const completedSet = new Set(completedIndividual);

  for (const gate of STEP_GATES) {
    const missing = gate.requiredIndividual.filter((a) => !completedSet.has(a));
    const needsCouple = gate.minCoupleAssessments > 0 && completedCouple.length < gate.minCoupleAssessments;

    if (missing.length > 0) {
      const next = missing[0];
      return {
        assessmentType: next,
        assessmentName: ASSESSMENT_DISPLAY_NAMES[next] ?? next,
        assessmentDescription: ASSESSMENT_UNLOCK_DESCRIPTIONS[next] ?? '',
        stepsUnlocked: gate.steps,
        tierName: gate.tierName,
        message: `Complete "${ASSESSMENT_DISPLAY_NAMES[next]}" to unlock Steps ${gate.steps[0]}-${gate.steps[gate.steps.length - 1]}.`,
      };
    }

    if (needsCouple) {
      return {
        assessmentType: 'rdas',
        assessmentName: ASSESSMENT_DISPLAY_NAMES['rdas'],
        assessmentDescription: ASSESSMENT_UNLOCK_DESCRIPTIONS['rdas'],
        stepsUnlocked: gate.steps,
        tierName: gate.tierName,
        message: `Complete a couple assessment with your partner to unlock Steps ${gate.steps[0]}-${gate.steps[gate.steps.length - 1]}.`,
      };
    }
  }

  return null; // All steps unlocked
}

// ─── Celebration Messages ────────────────────────────────

/**
 * Generate a celebration message when an assessment is completed
 * and new steps are unlocked.
 */
export function getUnlockCelebration(
  assessmentType: string,
  completedIndividual: string[],
  completedCouple: string[],
): {
  title: string;
  message: string;
  stepsUnlocked: number[];
  dataHighlight: string;
} | null {
  // Check if any new gate was just satisfied
  for (const gate of STEP_GATES) {
    const completedSet = new Set(completedIndividual);
    const allIndividualMet = gate.requiredIndividual.every((a) => completedSet.has(a));
    const coupleMet = gate.minCoupleAssessments === 0 || completedCouple.length >= gate.minCoupleAssessments;

    if (allIndividualMet && coupleMet) {
      // Check if this gate was JUST satisfied (the assessment we just completed was the last missing one)
      const withoutCurrent = new Set(completedIndividual.filter((a) => a !== assessmentType));
      const wasMetBefore = gate.requiredIndividual.every((a) => withoutCurrent.has(a));

      if (!wasMetBefore) {
        const assessmentName = ASSESSMENT_DISPLAY_NAMES[assessmentType] ?? assessmentType;
        const dataHighlights: Record<string, string> = {
          'ecr-r': 'your attachment style and how you reach for connection',
          'tender-personality-60': 'who you are in love — your personality in the intimacy zone',
          'sseit': 'how you read and manage emotions in relationships',
          'dsi-r': 'how you hold your ground while staying close',
          'dutch': 'your natural moves when conflict arrives',
          'values': 'what matters most to you and where your actions align',
          'rdas': 'how aligned you and your partner are',
          'dci': 'how you cope with stress together',
          'csi-16': 'how close and satisfied you feel right now',
        };

        return {
          title: `Steps ${gate.steps[0]}-${gate.steps[gate.steps.length - 1]} are yours`,
          message: `Your "${assessmentName}" results are in. These steps just became personalized with ${dataHighlights[assessmentType] ?? 'your new insights'}. Go see what we built for you.`,
          stepsUnlocked: gate.steps,
          dataHighlight: dataHighlights[assessmentType] ?? 'your latest assessment data',
        };
      }
    }
  }

  return null;
}
