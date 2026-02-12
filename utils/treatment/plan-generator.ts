/**
 * Treatment Plan Generator
 *
 * Generates a personalized treatment plan from an individual portrait.
 * Maps growth edges to treatment pathways, assigns exercises from the
 * intervention registry, and sets weekly goals.
 */

import type { IndividualPortrait } from '@/types/portrait';
import type { TreatmentPlan, TreatmentPathway } from '@/types/growth';

// ─── Exercise Mappings ──────────────────────────────────
// Maps growth edge ID prefixes to exercise IDs from the intervention registry.

const EDGE_EXERCISE_MAP: Record<string, string[]> = {
  regulation_capacity: [
    'grounding-5-4-3-2-1',
    'window-check',
    'self-compassion-break',
  ],
  values_gap: [
    'values-compass',
    'soft-startup',
    'emotional-bid',
  ],
  speak_truth: [
    'soft-startup',
    'emotional-bid',
    'repair-attempt',
  ],
  approach_closeness: [
    'emotional-bid',
    'self-compassion-break',
    'parts-check-in',
  ],
  reclaim_self: [
    'parts-check-in',
    'values-compass',
    'self-compassion-break',
  ],
  differentiation_work: [
    'parts-check-in',
    'values-compass',
    'window-check',
  ],
};

// ─── Milestone Templates ────────────────────────────────

const DEFAULT_MILESTONES = [
  'Awareness: Recognize when this pattern shows up',
  'Practice: Try one new response in a low-stakes moment',
  'Integration: Consistently choose the new response under moderate stress',
  'Mastery: The new way of being feels natural, even under pressure',
];

const REGULATION_MILESTONES = [
  'Awareness: Notice early signs of activation before flooding',
  'Practice: Use grounding techniques daily for one week',
  'Integration: Take a regulated break during a real conflict',
  'Mastery: Stay within your window during difficult conversations',
];

const VALUES_MILESTONES = [
  'Awareness: Name the gap between your value and your behavior',
  'Practice: Take one concrete action to close the gap this week',
  'Integration: Build the new behavior into a consistent routine',
  'Mastery: Your actions reflect this value naturally',
];

const DIFFERENTIATION_MILESTONES = [
  'Awareness: Notice when you lose yourself in the relationship',
  'Practice: State your own opinion before hearing your partner\'s',
  'Integration: Maintain your sense of self during disagreements',
  'Mastery: Hold closeness and autonomy at the same time',
];

// ─── Generator ──────────────────────────────────────────

export function generateTreatmentPlan(portrait: IndividualPortrait): TreatmentPlan {
  const { growthEdges, compositeScores } = portrait;
  const hasRegulationPriority = compositeScores.regulationScore < 40;

  // Build pathways from growth edges
  const pathways: TreatmentPathway[] = growthEdges.map((edge) => {
    const milestones = getMilestonesForEdge(edge.id);
    const exercises = getExercisesForEdge(edge.id);
    const estimatedWeeks = getEstimatedWeeks(edge.id);

    return {
      name: edge.title,
      description: edge.description,
      milestones,
      exercises,
      estimatedWeeks,
    };
  });

  // If regulation is a priority, ensure it is the first pathway
  if (hasRegulationPriority) {
    const regulationIndex = pathways.findIndex(
      (p) => p.name === 'Widening Your Window'
    );
    if (regulationIndex > 0) {
      const [regulationPathway] = pathways.splice(regulationIndex, 1);
      pathways.unshift(regulationPathway);
    }
  }

  // Determine primary focus
  const primaryFocus = hasRegulationPriority
    ? 'Emotional Regulation: Building the foundation for all other growth by widening your window of tolerance.'
    : pathways.length > 0
    ? `${pathways[0].name}: ${pathways[0].description}`
    : 'Continuing to build awareness and practice in your relationship.';

  // Generate weekly goals from growth edges
  const weeklyGoals = generateWeeklyGoals(portrait);

  // Collect all recommended exercises (de-duped)
  const exerciseSet = new Set<string>();
  for (const pathway of pathways) {
    for (const exerciseId of pathway.exercises) {
      exerciseSet.add(exerciseId);
    }
  }
  const recommendedExercises = Array.from(exerciseSet);

  // Check-in frequency: daily if regulation is low, otherwise weekly
  const checkInFrequency = compositeScores.regulationScore < 50 ? 'daily' : 'weekly';

  return {
    primaryFocus,
    pathways,
    weeklyGoals,
    recommendedExercises,
    checkInFrequency,
  };
}

// ─── Helpers ────────────────────────────────────────────

function getMilestonesForEdge(edgeId: string): string[] {
  if (edgeId === 'regulation_capacity') return REGULATION_MILESTONES;
  if (edgeId.startsWith('values_gap')) return VALUES_MILESTONES;
  if (edgeId === 'differentiation_work') return DIFFERENTIATION_MILESTONES;
  return DEFAULT_MILESTONES;
}

function getExercisesForEdge(edgeId: string): string[] {
  // Check for exact match first
  if (EDGE_EXERCISE_MAP[edgeId]) {
    return EDGE_EXERCISE_MAP[edgeId];
  }

  // Check for prefix match (e.g. values_gap_honesty -> values_gap)
  for (const prefix of Object.keys(EDGE_EXERCISE_MAP)) {
    if (edgeId.startsWith(prefix)) {
      return EDGE_EXERCISE_MAP[prefix];
    }
  }

  // Fallback: general exercises
  return ['self-compassion-break', 'parts-check-in', 'window-check'];
}

function getEstimatedWeeks(edgeId: string): number {
  if (edgeId === 'regulation_capacity') return 8;
  if (edgeId.startsWith('values_gap')) return 6;
  if (edgeId === 'differentiation_work') return 10;
  return 6;
}

function generateWeeklyGoals(portrait: IndividualPortrait): string[] {
  const goals: string[] = [];
  const { growthEdges, compositeScores } = portrait;

  // Regulation goal if needed
  if (compositeScores.regulationScore < 40) {
    goals.push('Practice one grounding exercise daily, even if only for 3 minutes.');
  }

  // Goal per growth edge
  for (const edge of growthEdges) {
    if (edge.practices.length > 0) {
      goals.push(edge.practices[0]);
    }
  }

  // General connection goal
  if (compositeScores.engagement < 50) {
    goals.push(
      'Initiate one moment of intentional connection with your partner this week.'
    );
  }

  // Values congruence goal
  if (compositeScores.valuesCongruence < 50) {
    goals.push(
      'Identify one small action that aligns with your core values and do it this week.'
    );
  }

  // Cap at 5 goals
  return goals.slice(0, 5);
}
