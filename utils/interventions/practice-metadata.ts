/**
 * Practice Metadata — Four Movements, Vulnerability, Entry States,
 * WEARE Variables, Field Insights, and Healing Phases
 *
 * Centralized metadata for all 32 exercises, mapping each practice to:
 *   - fourMovement: which of the Four Movements it primarily cultivates
 *   - vulnerabilityLevel: how emotionally exposed the practice is
 *   - bestEntryStates: ideal nervous-system states to begin
 *   - weareVariable: which WEARE variable this exercise targets
 *   - fieldInsight: one-line V2 field-language insight shown on card
 *   - healingPhase: which healing journey phase
 *   - bottleneckTarget: which WEARE bottleneck this exercise addresses
 *
 * These are applied at registry time so every Intervention object
 * carries its full metadata without modifying individual exercise files.
 */

import type { FourMovement, VulnerabilityLevel } from '@/types/intervention';
import type { NervousSystemState } from '@/types/chat';
import type { HealingPhase } from '@/types/growth';
import type { WEAREVariableName } from '@/types/weare';

export interface PracticeMetadataEntry {
  fourMovement: FourMovement;
  vulnerabilityLevel: VulnerabilityLevel;
  bestEntryStates: NervousSystemState[];
  /** Which WEARE variable this exercise primarily targets */
  weareVariable: WEAREVariableName;
  /** One-line V2 field-language insight for card display */
  fieldInsight: string;
  /** Which healing journey phase this practice belongs to */
  healingPhase: HealingPhase;
  /** Which WEARE bottleneck this exercise addresses */
  bottleneckTarget: string;
}

/**
 * Metadata keyed by exercise ID.
 *
 * Four Movements:
 *   recognition  — seeing patterns, naming what's happening
 *   release      — letting go of fixed stories, defusing
 *   resonance    — attuning, connecting, co-regulating
 *   embodiment   — turning insight into sustained action
 *
 * Vulnerability:
 *   low      — cognitive, observational, no emotional exposure
 *   moderate — some emotional exposure, manageable risk
 *   high     — deep emotional sharing, attachment vulnerability
 */
export const PRACTICE_METADATA: Record<string, PracticeMetadataEntry> = {
  // ─── Regulation (6) ─────────────────────────────────────
  'grounding-5-4-3-2-1': {
    fourMovement: 'recognition',
    vulnerabilityLevel: 'low',
    bestEntryStates: ['ACTIVATED', 'MIXED'],
    weareVariable: 'individual',
    fieldInsight: 'When your body is anchored, the space between you steadies too.',
    healingPhase: 'feeling',
    bottleneckTarget: 'dysregulation',
  },
  'window-of-tolerance-check': {
    fourMovement: 'recognition',
    vulnerabilityLevel: 'low',
    bestEntryStates: ['ACTIVATED', 'IN_WINDOW', 'SHUTDOWN', 'MIXED'],
    weareVariable: 'individual',
    fieldInsight: 'Knowing where you are is the first step to choosing where to go.',
    healingPhase: 'seeing',
    bottleneckTarget: 'awareness',
  },
  'self-compassion-break': {
    fourMovement: 'release',
    vulnerabilityLevel: 'moderate',
    bestEntryStates: ['IN_WINDOW', 'ACTIVATED'],
    weareVariable: 'individual',
    fieldInsight: 'The kindness you give yourself softens the field for both of you.',
    healingPhase: 'feeling',
    bottleneckTarget: 'self-criticism',
  },
  'distress-tolerance-together': {
    fourMovement: 'embodiment',
    vulnerabilityLevel: 'moderate',
    bestEntryStates: ['ACTIVATED', 'MIXED'],
    weareVariable: 'attunement',
    fieldInsight: 'Sitting with discomfort together builds the couple bubble.',
    healingPhase: 'feeling',
    bottleneckTarget: 'co-regulation',
  },
  'opposite-action': {
    fourMovement: 'embodiment',
    vulnerabilityLevel: 'moderate',
    bestEntryStates: ['IN_WINDOW', 'ACTIVATED'],
    weareVariable: 'change',
    fieldInsight: 'Doing the opposite of your pattern is how new neural pathways form.',
    healingPhase: 'shifting',
    bottleneckTarget: 'behavioral-rigidity',
  },
  'radical-acceptance': {
    fourMovement: 'release',
    vulnerabilityLevel: 'moderate',
    bestEntryStates: ['IN_WINDOW', 'MIXED'],
    weareVariable: 'resistance',
    fieldInsight: 'Accepting what is frees energy to create what could be.',
    healingPhase: 'feeling',
    bottleneckTarget: 'resistance',
  },

  // ─── Communication (10) ─────────────────────────────────
  'soft-startup': {
    fourMovement: 'embodiment',
    vulnerabilityLevel: 'moderate',
    bestEntryStates: ['IN_WINDOW'],
    weareVariable: 'attunement',
    fieldInsight: 'How you begin a conversation shapes the entire field between you.',
    healingPhase: 'shifting',
    bottleneckTarget: 'conflict-escalation',
  },
  'repair-attempt': {
    fourMovement: 'resonance',
    vulnerabilityLevel: 'high',
    bestEntryStates: ['IN_WINDOW'],
    weareVariable: 'attunement',
    fieldInsight: 'Repair is not about being right. It is about staying connected.',
    healingPhase: 'shifting',
    bottleneckTarget: 'rupture-without-repair',
  },
  'turning-toward': {
    fourMovement: 'resonance',
    vulnerabilityLevel: 'moderate',
    bestEntryStates: ['IN_WINDOW', 'MIXED'],
    weareVariable: 'attunement',
    fieldInsight: 'Every bid you catch strengthens the invisible thread between you.',
    healingPhase: 'feeling',
    bottleneckTarget: 'missed-bids',
  },
  'dreams-within-conflict': {
    fourMovement: 'resonance',
    vulnerabilityLevel: 'high',
    bestEntryStates: ['IN_WINDOW'],
    weareVariable: 'coCreation',
    fieldInsight: 'Behind every position is a dream. Hear the dream, not the demand.',
    healingPhase: 'shifting',
    bottleneckTarget: 'gridlock',
  },
  'aftermath-of-fight': {
    fourMovement: 'recognition',
    vulnerabilityLevel: 'high',
    bestEntryStates: ['IN_WINDOW'],
    weareVariable: 'attunement',
    fieldInsight: 'Processing what happened teaches the field how to hold future storms.',
    healingPhase: 'shifting',
    bottleneckTarget: 'unprocessed-conflict',
  },
  'unified-detachment': {
    fourMovement: 'recognition',
    vulnerabilityLevel: 'moderate',
    bestEntryStates: ['IN_WINDOW', 'MIXED'],
    weareVariable: 'space',
    fieldInsight: 'Stepping back from the problem lets you see the pattern, not the person.',
    healingPhase: 'seeing',
    bottleneckTarget: 'blame-cycle',
  },
  'empathic-joining': {
    fourMovement: 'resonance',
    vulnerabilityLevel: 'high',
    bestEntryStates: ['IN_WINDOW'],
    weareVariable: 'attunement',
    fieldInsight: 'When you feel what they feel, the wall between you dissolves.',
    healingPhase: 'shifting',
    bottleneckTarget: 'empathy-deficit',
  },
  'dear-man': {
    fourMovement: 'embodiment',
    vulnerabilityLevel: 'moderate',
    bestEntryStates: ['IN_WINDOW'],
    weareVariable: 'transmission',
    fieldInsight: 'Asking for what you need clearly is an act of love, not demand.',
    healingPhase: 'shifting',
    bottleneckTarget: 'unmet-needs',
  },
  'stress-reducing-conversation': {
    fourMovement: 'resonance',
    vulnerabilityLevel: 'low',
    bestEntryStates: ['IN_WINDOW', 'MIXED'],
    weareVariable: 'coCreation',
    fieldInsight: 'Talking about the world outside strengthens the world between you.',
    healingPhase: 'integrating',
    bottleneckTarget: 'disconnection',
  },
  'four-horsemen-antidotes': {
    fourMovement: 'recognition',
    vulnerabilityLevel: 'moderate',
    bestEntryStates: ['IN_WINDOW'],
    weareVariable: 'resistance',
    fieldInsight: 'Name the horseman. Choose the antidote. The field shifts immediately.',
    healingPhase: 'seeing',
    bottleneckTarget: 'destructive-patterns',
  },

  // ─── Attachment (10) ────────────────────────────────────
  'emotional-bid': {
    fourMovement: 'resonance',
    vulnerabilityLevel: 'moderate',
    bestEntryStates: ['IN_WINDOW', 'MIXED'],
    weareVariable: 'attunement',
    fieldInsight: 'A bid is a hand reaching across the space. Catch it.',
    healingPhase: 'feeling',
    bottleneckTarget: 'missed-bids',
  },
  'love-maps': {
    fourMovement: 'recognition',
    vulnerabilityLevel: 'low',
    bestEntryStates: ['IN_WINDOW', 'MIXED'],
    weareVariable: 'coCreation',
    fieldInsight: 'Knowing your partner\'s inner world is the foundation of attunement.',
    healingPhase: 'seeing',
    bottleneckTarget: 'lack-of-knowing',
  },
  'fondness-admiration': {
    fourMovement: 'resonance',
    vulnerabilityLevel: 'moderate',
    bestEntryStates: ['IN_WINDOW'],
    weareVariable: 'coCreation',
    fieldInsight: 'What you appreciate in your partner grows when you name it aloud.',
    healingPhase: 'integrating',
    bottleneckTarget: 'negativity-override',
  },
  'recognize-cycle': {
    fourMovement: 'recognition',
    vulnerabilityLevel: 'moderate',
    bestEntryStates: ['IN_WINDOW', 'MIXED'],
    weareVariable: 'resistance',
    fieldInsight: 'The cycle is the enemy. You and your partner are on the same team.',
    healingPhase: 'seeing',
    bottleneckTarget: 'cycle-blindness',
  },
  'hold-me-tight': {
    fourMovement: 'resonance',
    vulnerabilityLevel: 'high',
    bestEntryStates: ['IN_WINDOW'],
    weareVariable: 'attunement',
    fieldInsight: 'Underneath the anger is fear. Underneath the fear is need. Reach for the need.',
    healingPhase: 'shifting',
    bottleneckTarget: 'attachment-injury',
  },
  'couple-bubble': {
    fourMovement: 'embodiment',
    vulnerabilityLevel: 'moderate',
    bestEntryStates: ['IN_WINDOW'],
    weareVariable: 'transmission',
    fieldInsight: 'The bubble is not a metaphor. It is a nervous system reality you build together.',
    healingPhase: 'integrating',
    bottleneckTarget: 'safety-deficit',
  },
  'accessing-primary-emotions': {
    fourMovement: 'release',
    vulnerabilityLevel: 'high',
    bestEntryStates: ['IN_WINDOW'],
    weareVariable: 'individual',
    fieldInsight: 'The first emotion you feel is often a protector. The real one is underneath.',
    healingPhase: 'feeling',
    bottleneckTarget: 'emotional-avoidance',
  },
  'bonding-through-vulnerability': {
    fourMovement: 'resonance',
    vulnerabilityLevel: 'high',
    bestEntryStates: ['IN_WINDOW'],
    weareVariable: 'attunement',
    fieldInsight: 'Vulnerability is not weakness. It is the birthplace of connection.',
    healingPhase: 'shifting',
    bottleneckTarget: 'vulnerability-avoidance',
  },
  'protest-polka': {
    fourMovement: 'recognition',
    vulnerabilityLevel: 'moderate',
    bestEntryStates: ['IN_WINDOW', 'MIXED'],
    weareVariable: 'resistance',
    fieldInsight: 'Your dance has a name. Naming it is the first step to changing it.',
    healingPhase: 'seeing',
    bottleneckTarget: 'pursue-withdraw',
  },
  'rituals-of-connection': {
    fourMovement: 'embodiment',
    vulnerabilityLevel: 'low',
    bestEntryStates: ['IN_WINDOW', 'MIXED'],
    weareVariable: 'time',
    fieldInsight: 'Rituals are the rhythms that keep the relational field alive.',
    healingPhase: 'integrating',
    bottleneckTarget: 'inconsistency',
  },

  // ─── Values (4) ─────────────────────────────────────────
  'values-compass': {
    fourMovement: 'recognition',
    vulnerabilityLevel: 'moderate',
    bestEntryStates: ['IN_WINDOW'],
    weareVariable: 'individual',
    fieldInsight: 'Knowing what you value tells you which direction to walk.',
    healingPhase: 'seeing',
    bottleneckTarget: 'values-confusion',
  },
  'relationship-values-compass': {
    fourMovement: 'embodiment',
    vulnerabilityLevel: 'moderate',
    bestEntryStates: ['IN_WINDOW'],
    weareVariable: 'coCreation',
    fieldInsight: 'Shared values are the compass you navigate by together.',
    healingPhase: 'shifting',
    bottleneckTarget: 'values-misalignment',
  },
  'willingness-stance': {
    fourMovement: 'release',
    vulnerabilityLevel: 'moderate',
    bestEntryStates: ['IN_WINDOW', 'MIXED'],
    weareVariable: 'change',
    fieldInsight: 'Willingness is choosing to feel discomfort because something matters more.',
    healingPhase: 'shifting',
    bottleneckTarget: 'experiential-avoidance',
  },
  'relationship-mission-statement': {
    fourMovement: 'embodiment',
    vulnerabilityLevel: 'high',
    bestEntryStates: ['IN_WINDOW'],
    weareVariable: 'coCreation',
    fieldInsight: 'A shared vision gives you something to build toward, together.',
    healingPhase: 'integrating',
    bottleneckTarget: 'purposelessness',
  },

  // ─── Differentiation (3) ────────────────────────────────
  'parts-check-in': {
    fourMovement: 'recognition',
    vulnerabilityLevel: 'moderate',
    bestEntryStates: ['IN_WINDOW', 'ACTIVATED', 'MIXED'],
    weareVariable: 'individual',
    fieldInsight: 'Every part of you is trying to help. Ask what it needs.',
    healingPhase: 'feeling',
    bottleneckTarget: 'internal-conflict',
  },
  'defusion-from-stories': {
    fourMovement: 'release',
    vulnerabilityLevel: 'moderate',
    bestEntryStates: ['IN_WINDOW', 'MIXED'],
    weareVariable: 'resistance',
    fieldInsight: 'The story about your partner is not your partner. Hold it lightly.',
    healingPhase: 'feeling',
    bottleneckTarget: 'story-fusion',
  },
  'protector-dialogue': {
    fourMovement: 'release',
    vulnerabilityLevel: 'high',
    bestEntryStates: ['IN_WINDOW'],
    weareVariable: 'space',
    fieldInsight: 'Your protector kept you safe. Now thank it and try a different way.',
    healingPhase: 'shifting',
    bottleneckTarget: 'protective-rigidity',
  },

  // ─── New Interactive Exercises (10) ─────────────────────

  'emotional-inheritance-scan': {
    fourMovement: 'recognition',
    vulnerabilityLevel: 'moderate',
    bestEntryStates: ['IN_WINDOW', 'MIXED'],
    weareVariable: 'individual',
    fieldInsight: 'The patterns you inherited are not your destiny — they are your starting point.',
    healingPhase: 'seeing',
    bottleneckTarget: 'multigenerational-transmission',
  },
  'assumption-audit': {
    fourMovement: 'recognition',
    vulnerabilityLevel: 'low',
    bestEntryStates: ['ACTIVATED', 'IN_WINDOW', 'MIXED'],
    weareVariable: 'individual',
    fieldInsight: 'The story you told yourself is not the story that happened.',
    healingPhase: 'seeing',
    bottleneckTarget: 'mind-reading',
  },
  'over-functioning-brake': {
    fourMovement: 'release',
    vulnerabilityLevel: 'moderate',
    bestEntryStates: ['IN_WINDOW', 'MIXED'],
    weareVariable: 'individual',
    fieldInsight: 'Doing less for your partner is sometimes the most loving thing you can do.',
    healingPhase: 'shifting',
    bottleneckTarget: 'over-functioning',
  },
  'back-to-back-breathe': {
    fourMovement: 'resonance',
    vulnerabilityLevel: 'moderate',
    bestEntryStates: ['ACTIVATED', 'IN_WINDOW', 'MIXED'],
    weareVariable: 'attunement',
    fieldInsight: 'Two nervous systems breathing together settle faster than either one alone.',
    healingPhase: 'feeling',
    bottleneckTarget: 'co-regulation-deficit',
  },
  'externalizing-the-problem': {
    fourMovement: 'recognition',
    vulnerabilityLevel: 'low',
    bestEntryStates: ['IN_WINDOW', 'MIXED'],
    weareVariable: 'coCreation',
    fieldInsight: 'The person is not the problem. The problem is the problem.',
    healingPhase: 'seeing',
    bottleneckTarget: 'blame-cycles',
  },
  'news-reporter-stance': {
    fourMovement: 'embodiment',
    vulnerabilityLevel: 'low',
    bestEntryStates: ['IN_WINDOW', 'ACTIVATED'],
    weareVariable: 'individual',
    fieldInsight: 'When you describe what happened like a reporter, your partner hears facts instead of accusations.',
    healingPhase: 'shifting',
    bottleneckTarget: 'mind-reading',
  },
  'little-you-photo-share': {
    fourMovement: 'resonance',
    vulnerabilityLevel: 'high',
    bestEntryStates: ['IN_WINDOW'],
    weareVariable: 'attunement',
    fieldInsight: 'When your partner speaks to the child in you, the adult attachment softens.',
    healingPhase: 'shifting',
    bottleneckTarget: 'attachment-injury',
  },
  'reassurance-menu': {
    fourMovement: 'embodiment',
    vulnerabilityLevel: 'moderate',
    bestEntryStates: ['IN_WINDOW'],
    weareVariable: 'attunement',
    fieldInsight: 'Knowing what calms your partner — and offering it without being asked — is secure attachment in action.',
    healingPhase: 'integrating',
    bottleneckTarget: 'unmet-attachment-needs',
  },
  'relationship-bullseye': {
    fourMovement: 'recognition',
    vulnerabilityLevel: 'moderate',
    bestEntryStates: ['IN_WINDOW'],
    weareVariable: 'coCreation',
    fieldInsight: 'Knowing the gap between your values and your actions is where all growth starts.',
    healingPhase: 'seeing',
    bottleneckTarget: 'values-action-gap',
  },
  'eulogy-exercise': {
    fourMovement: 'embodiment',
    vulnerabilityLevel: 'high',
    bestEntryStates: ['IN_WINDOW'],
    weareVariable: 'coCreation',
    fieldInsight: "When you know the legacy you want to leave, today's argument finds its proper size.",
    healingPhase: 'integrating',
    bottleneckTarget: 'perspective-deficit',
  },
};

/**
 * Enriches an Intervention with metadata from PRACTICE_METADATA.
 * Returns the same object with added fields (mutates in place for perf).
 */
export function enrichWithMetadata<T extends { id: string }>(exercise: T): T {
  const meta = PRACTICE_METADATA[exercise.id];
  if (meta) {
    Object.assign(exercise, {
      fourMovement: meta.fourMovement,
      vulnerabilityLevel: meta.vulnerabilityLevel,
      bestEntryStates: meta.bestEntryStates,
      fieldInsight: meta.fieldInsight,
    });
  }
  return exercise;
}

/**
 * Get all exercises targeting a specific WEARE variable.
 */
export function getExercisesForVariable(variable: WEAREVariableName): string[] {
  return Object.entries(PRACTICE_METADATA)
    .filter(([_, meta]) => meta.weareVariable === variable)
    .map(([id]) => id);
}

/**
 * Get exercises for a specific healing phase.
 */
export function getExercisesForPhase(phase: HealingPhase): string[] {
  return Object.entries(PRACTICE_METADATA)
    .filter(([_, meta]) => meta.healingPhase === phase)
    .map(([id]) => id);
}
