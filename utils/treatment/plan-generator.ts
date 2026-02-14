/**
 * Treatment Plan Generator — V2 Attachment-Aware
 *
 * Generates a personalized treatment plan from an individual portrait.
 * Now attachment-aware: pathway ordering, milestone language, and weekly goals
 * adapt based on the user's attachment style.
 *
 * V2 Pathways:
 * - Anxious: Regulation first → capacity to be alone → values work
 * - Avoidant: Window-building first → safe openness → vulnerability
 * - Fearful-avoidant: Both sides honored, dual-nature work
 * - Secure: Deepening and maintenance focus
 */

import type { IndividualPortrait } from '@/types/portrait';
import type { AttachmentStyle } from '@/types';
import type { TreatmentPlan, TreatmentPathway } from '@/types/growth';

// ─── Exercise Mappings ──────────────────────────────────

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

// ─── Attachment-Tailored Milestones ─────────────────────

const DEFAULT_MILESTONES = [
  'Awareness: Recognize when this pattern shows up',
  'Practice: Try one new response in a low-stakes moment',
  'Integration: Consistently choose the new response under moderate stress',
  'Mastery: The new way of being feels natural, even under pressure',
];

const MILESTONES_BY_STYLE: Record<string, Record<AttachmentStyle, string[]>> = {
  regulation_capacity: {
    'anxious-preoccupied': [
      'Notice when your alarm system activates — the moment "something shifted" becomes "something is wrong"',
      'Practice grounding when the alarm fires: hand on chest, three breaths, then ask "What is actually happening right now?"',
      'Begin distinguishing between your alarm and the reality — your sensitivity stays, the automatic story loosens',
      'Your nervous system reads the field with discernment, not just alarm. You feel more, not less — but with wisdom.',
    ],
    'dismissive-avoidant': [
      'Notice when your system shuts down or goes numb — the moment feelings get "managed" instead of felt',
      'Practice staying present for 30 seconds longer than comfortable when emotions arise — a small window, not a demolished wall',
      'Allow one feeling per day to fully register before your system files it away — the window widens at your pace',
      'Your calm is alive, not empty. You feel AND remain steady. The wall has a window.',
    ],
    'fearful-avoidant': [
      'Notice the push-pull: when do you reach for closeness and when do you retreat? Both are your system trying to protect you',
      'Practice naming the conflict out loud: "Part of me wants to stay, part of me wants to go." Naming it takes away its power',
      'Begin choosing which signal to follow rather than being run by whichever is louder. Both sides are honored.',
      'You hold both the reach and the retreat without being swept by either. The oscillation becomes a rhythm, not a crisis.',
    ],
    secure: [
      'Deepen awareness of your regulation patterns — even secure systems have edges under enough stress',
      'Practice expanding your capacity: stay present with your partner during THEIR activation, not just your own',
      'Model co-regulation — your steadiness becomes a gift your partner can borrow when they need it',
      'Your regulation capacity serves not just you but the relational field itself. You are a regulating presence.',
    ],
  },
  values_gap: {
    'anxious-preoccupied': [
      'Name the gap between what you value and how anxiety has pulled you away from it',
      'Take one concrete action aligned with your values — even when your system says "but first, make sure they are not leaving"',
      'Practice values-aligned behavior even when the relational alarm is firing — your values are your compass, not your attachment fear',
      'Your values lead the way. Anxiety is a passenger, not the driver.',
    ],
    'dismissive-avoidant': [
      'Name the gap between what you value and where self-sufficiency has cost you connection',
      'Take one small values-aligned action that involves vulnerability — sharing something, asking for something, receiving something',
      'Build a consistent practice of values-aligned openness — a window that stays open by choice',
      'Your values and your independence work together. You choose closeness because it matters, not because you are compelled.',
    ],
    'fearful-avoidant': [
      'Name the gap — and notice how both the desire for closeness AND the need for safety have shaped it',
      'Take one action that honors your values without needing to resolve the push-pull first',
      'Practice living your values even when your system is conflicted — the clarity of values cuts through ambivalence',
      'Your values are the bridge between the part that reaches and the part that retreats. They are the ground both can stand on.',
    ],
    secure: [
      'Notice where life has gently drifted from your values — not dramatically, but in the small daily moments',
      'Take one action per week that brings a neglected value back to life',
      'Build routines that naturally align with what matters most — your relational foundation supports this effortlessly',
      'Your values and your life are in deep alignment. This congruence radiates into the relational field.',
    ],
  },
  differentiation_work: {
    'anxious-preoccupied': [
      'Notice when your partner\'s emotional state becomes YOUR emotional state — the moment you lose yourself in them',
      'Practice holding your own truth while acknowledging theirs: "I see how you feel AND here is what is true for me"',
      'Maintain your perspective during emotional conversations without needing your partner to validate it first',
      'You stay close AND stay yourself. Your sensitivity remains, but you are no longer swallowed by the field.',
    ],
    'dismissive-avoidant': [
      'Notice when "staying yourself" actually means disconnecting — when independence becomes a wall instead of a strength',
      'Practice letting your partner in without losing your sense of self — a window, not a surrender',
      'Allow emotional closeness AND maintain your autonomy — they are not opposites, they are both yours',
      'You are fully yourself AND fully in the relationship. Your independence is a gift, not a shield.',
    ],
    'fearful-avoidant': [
      'Notice both edges: when do you merge and when do you cut off? Both are differentiation challenges',
      'Practice holding steady in the middle — not fusing AND not fleeing — just being present with both impulses',
      'Build the capacity to choose closeness or space from groundedness rather than reactivity',
      'You navigate the territory between self and other with increasing fluidity. The push-pull becomes a dance, not a battle.',
    ],
    secure: [
      'Your differentiation is already strong. Notice where it might be tested — high-stress moments, old trigger points',
      'Practice using your differentiation as a model: can you help your partner hold their ground without doing it for them?',
      'Deepen the subtleties: being firm AND curious, being present AND maintaining your own truth',
      'Your groundedness is a resource for the relationship itself. You hold your center and the field holds you.',
    ],
  },
};

// ─── Attachment-Tailored Weekly Goals ────────────────────

const ATTACHMENT_WEEKLY_GOALS: Record<AttachmentStyle, string[]> = {
  'anxious-preoccupied': [
    'When you notice the urge to seek reassurance, pause. Put your hand on your chest. Ask: "Am I responding to now or to what I fear?"',
    'Practice one moment of intentional solitude this week — not because you are being pushed away, but because you are choosing your own company.',
    'Share something vulnerable with your partner without asking "Are we okay?" afterward. Let the sharing be enough.',
  ],
  'dismissive-avoidant': [
    'Share one small, personal thought with your partner — something you would normally keep to yourself. Not a confession. Just a window.',
    'When your partner moves toward you emotionally, try staying for 30 seconds longer than comfortable before your system retreats.',
    'Notice what happens in your body when closeness is offered. Name that sensation. That is your protective system — it is not you.',
  ],
  'fearful-avoidant': [
    'When the push-pull activates, name it out loud: "Part of me wants to be close right now, and part of me wants to pull away." Let your partner witness both.',
    'Choose one small moment of closeness this week. Then choose one small moment of healthy solitude. Practice both as choices, not reactions.',
    'When you feel the urge to either merge or flee, take three breaths and ask: "What do I actually need right now?" Trust the answer.',
  ],
  secure: [
    'Share something with your partner this week that you have never said out loud — a fear, a dream, a doubt. Not because you need to, but because the space between you can hold more.',
    'Notice one moment where your partner struggles and practice being present without fixing. Sometimes presence is the solution.',
    'Explore one edge of your comfort zone in the relationship — a conversation you have been putting off, a vulnerability you have been holding back.',
  ],
};

// ─── Primary Focus by Attachment Style ───────────────────

function getAttachmentFocusIntro(style: AttachmentStyle): string {
  switch (style) {
    case 'anxious-preoccupied':
      return 'Your growth path begins with regulation — building the capacity to feel with discernment rather than alarm. From this foundation, you will develop the ability to hold your own ground while staying connected.';
    case 'dismissive-avoidant':
      return 'Your growth path begins with window-building — creating structured, safe openings for emotional closeness that do not overwhelm your system. From this foundation, vulnerability becomes a choice, not a threat.';
    case 'fearful-avoidant':
      return 'Your growth path honors both sides — the part that reaches for connection and the part that needs to feel safe. Rather than choosing one, you will learn to hold both with awareness and intention.';
    case 'secure':
      return 'Your growth path focuses on deepening — moving from comfortable connection into the kind of vulnerability that surprises even you. Security is not a destination; it is a living practice.';
  }
}

// ─── Generator ──────────────────────────────────────────

export function generateTreatmentPlan(
  portrait: IndividualPortrait,
  attachmentStyle?: AttachmentStyle
): TreatmentPlan {
  const { growthEdges, compositeScores } = portrait;
  const hasRegulationPriority = compositeScores.regulationScore < 40;

  // Infer attachment style from portrait data if not provided
  const style = attachmentStyle || inferAttachmentStyle(portrait);

  // Build pathways from growth edges with attachment-tailored milestones
  const pathways: TreatmentPathway[] = growthEdges.map((edge) => {
    const milestones = getMilestonesForEdge(edge.id, style);
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

  // Attachment-aware pathway ordering
  reorderPathways(pathways, style, hasRegulationPriority);

  // Attachment-aware primary focus
  const attachmentIntro = getAttachmentFocusIntro(style);
  const primaryFocus = pathways.length > 0
    ? `${attachmentIntro}\n\nFirst focus: ${pathways[0].name} — ${pathways[0].description}`
    : attachmentIntro;

  // Attachment-aware weekly goals
  const weeklyGoals = generateWeeklyGoals(portrait, style);

  // Collect all recommended exercises (de-duped)
  const exerciseSet = new Set<string>();
  for (const pathway of pathways) {
    for (const exerciseId of pathway.exercises) {
      exerciseSet.add(exerciseId);
    }
  }
  const recommendedExercises = Array.from(exerciseSet);

  // Check-in frequency
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

/**
 * Infer attachment style from portrait data when ECR-R scores aren't directly available.
 * Uses negative cycle position and composite scores as proxies.
 */
function inferAttachmentStyle(portrait: IndividualPortrait): AttachmentStyle {
  const { negativeCycle, compositeScores } = portrait;

  // Use negative cycle position as primary indicator
  if (negativeCycle.position === 'pursuer') {
    return 'anxious-preoccupied';
  }
  if (negativeCycle.position === 'withdrawer') {
    return 'dismissive-avoidant';
  }
  if (negativeCycle.position === 'mixed') {
    return 'fearful-avoidant';
  }

  // Flexible = secure
  if (negativeCycle.position === 'flexible') {
    return 'secure';
  }

  // Fallback based on composite scores
  if (compositeScores.engagement < 40 && compositeScores.regulationScore > 60) {
    return 'dismissive-avoidant';
  }
  if (compositeScores.regulationScore < 40) {
    return 'anxious-preoccupied';
  }

  return 'secure';
}

function reorderPathways(
  pathways: TreatmentPathway[],
  style: AttachmentStyle,
  hasRegulationPriority: boolean
): void {
  switch (style) {
    case 'anxious-preoccupied':
      // Regulation first → differentiation → values
      prioritizePathway(pathways, 'Widening Your Window');
      break;

    case 'dismissive-avoidant':
      // Window-building (approach closeness) first → values → differentiation
      prioritizePathway(pathways, 'Approaching Closeness');
      if (!hasRegulationPriority) {
        // Don't lead with regulation for avoidant unless it's critical
        deprioritizePathway(pathways, 'Widening Your Window');
      }
      break;

    case 'fearful-avoidant':
      // Both sides: regulation AND approach together
      if (hasRegulationPriority) {
        prioritizePathway(pathways, 'Widening Your Window');
      }
      break;

    case 'secure':
      // Values and deepening first
      prioritizePathway(pathways, 'Living Your Values');
      break;
  }
}

function prioritizePathway(pathways: TreatmentPathway[], name: string): void {
  const idx = pathways.findIndex((p) => p.name === name);
  if (idx > 0) {
    const [pathway] = pathways.splice(idx, 1);
    pathways.unshift(pathway);
  }
}

function deprioritizePathway(pathways: TreatmentPathway[], name: string): void {
  const idx = pathways.findIndex((p) => p.name === name);
  if (idx >= 0 && idx < pathways.length - 1) {
    const [pathway] = pathways.splice(idx, 1);
    pathways.push(pathway);
  }
}

function getMilestonesForEdge(edgeId: string, style: AttachmentStyle): string[] {
  // Check for attachment-tailored milestones first
  for (const prefix of Object.keys(MILESTONES_BY_STYLE)) {
    if (edgeId === prefix || edgeId.startsWith(prefix)) {
      const styleMilestones = MILESTONES_BY_STYLE[prefix];
      if (styleMilestones && styleMilestones[style]) {
        return styleMilestones[style];
      }
    }
  }

  // Fallback to default milestones
  return DEFAULT_MILESTONES;
}

function getExercisesForEdge(edgeId: string): string[] {
  if (EDGE_EXERCISE_MAP[edgeId]) {
    return EDGE_EXERCISE_MAP[edgeId];
  }

  for (const prefix of Object.keys(EDGE_EXERCISE_MAP)) {
    if (edgeId.startsWith(prefix)) {
      return EDGE_EXERCISE_MAP[prefix];
    }
  }

  return ['self-compassion-break', 'parts-check-in', 'window-check'];
}

function getEstimatedWeeks(edgeId: string): number {
  if (edgeId === 'regulation_capacity') return 8;
  if (edgeId.startsWith('values_gap')) return 6;
  if (edgeId === 'differentiation_work') return 10;
  return 6;
}

function generateWeeklyGoals(
  portrait: IndividualPortrait,
  style: AttachmentStyle
): string[] {
  const goals: string[] = [];
  const { growthEdges, compositeScores } = portrait;

  // Start with attachment-tailored goals (most important)
  const attachmentGoals = ATTACHMENT_WEEKLY_GOALS[style] || [];
  goals.push(attachmentGoals[0]); // Add the primary attachment goal

  // Goal per growth edge
  for (const edge of growthEdges) {
    if (edge.practices.length > 0 && goals.length < 4) {
      goals.push(edge.practices[0]);
    }
  }

  // Add second attachment goal if there's room
  if (goals.length < 5 && attachmentGoals.length > 1) {
    goals.push(attachmentGoals[1]);
  }

  // Values congruence goal with attachment framing
  if (compositeScores.valuesCongruence < 50 && goals.length < 5) {
    goals.push(
      'Identify one small action that aligns with your core values and do it this week — not to fix anything, but because it matters.'
    );
  }

  return goals.slice(0, 5);
}
