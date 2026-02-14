/**
 * Bottleneck Detection + Movement Phase Identification
 *
 * Finds the lowest WEARE variable (with sufficient confidence),
 * maps it to a warm label + narrative + recommended practices,
 * and determines which movement phase the couple is in.
 */

import type {
  WEAREVariables,
  WEAREVariableName,
  WEAREBottleneck,
  WEARELayers,
  WEAREMovementPhase,
} from '@/types';

// ─── Bottleneck Detection ───────────────────────────────

export function detectBottleneck(vars: WEAREVariables): WEAREBottleneck {
  const entries = Object.entries(vars) as [WEAREVariableName, { raw: number; confidence: number }][];

  // Find lowest variable with confidence > 0.3
  const eligible = entries.filter(([, v]) => v.confidence > 0.3);

  // If nothing has enough confidence, use all variables
  const pool = eligible.length > 0 ? eligible : entries;

  // Sort ascending by raw value
  pool.sort((a, b) => a[1].raw - b[1].raw);

  // Special case: resistance is inverted — HIGH resistance is the bottleneck
  // Check if resistance is the highest and more impactful
  const resistanceEntry = entries.find(([k]) => k === 'resistance');
  const lowestNonR = pool.find(([k]) => k !== 'resistance');

  let bottleneckVar: WEAREVariableName;
  let bottleneckValue: number;

  if (
    resistanceEntry &&
    resistanceEntry[1].raw >= 7 &&
    resistanceEntry[1].confidence > 0.3
  ) {
    // High resistance is itself the bottleneck
    bottleneckVar = 'resistance';
    bottleneckValue = resistanceEntry[1].raw;
  } else if (lowestNonR) {
    bottleneckVar = lowestNonR[0];
    bottleneckValue = lowestNonR[1].raw;
  } else {
    bottleneckVar = pool[0][0];
    bottleneckValue = pool[0][1].raw;
  }

  const meta = BOTTLENECK_META[bottleneckVar];

  return {
    variable: bottleneckVar,
    label: meta.label,
    value: bottleneckValue,
    description: meta.getDescription(bottleneckValue),
    recommendedPractices: meta.practices,
  };
}

// ─── Movement Phase Identification ──────────────────────

export function identifyMovementPhase(
  vars: WEAREVariables,
  layers: WEARELayers,
): WEAREMovementPhase {
  const { resonancePulse, emergenceDirection, overall } = layers;
  const attunement = vars.attunement.raw;
  const transmission = vars.transmission.raw;
  const resistance = vars.resistance.raw;

  // Embodiment: high overall + positive direction + strong core
  if (overall >= 65 && emergenceDirection >= 2 && attunement >= 7 && transmission >= 6) {
    return 'embodiment';
  }

  // Resonance: moderate-high pulse + positive direction
  if (resonancePulse >= 55 && emergenceDirection >= 1 && overall >= 45) {
    return 'resonance';
  }

  // Release: emerging momentum, starting to let go of resistance
  if (emergenceDirection >= 0 && resistance < 7 && overall >= 25) {
    return 'release';
  }

  // Recognition: still seeing the patterns, high resistance, or low overall
  return 'recognition';
}

// ─── Movement Phase Narrative ───────────────────────────

export function getMovementNarrative(
  phase: WEAREMovementPhase,
  bottleneck: WEAREBottleneck,
  layers: WEARELayers,
): string {
  const baseNarrative = PHASE_NARRATIVES[phase];
  const bottleneckNudge = ` The place where growth is most available right now is ${bottleneck.label.toLowerCase()}.`;
  return baseNarrative + bottleneckNudge;
}

const PHASE_NARRATIVES: Record<WEAREMovementPhase, string> = {
  recognition:
    'You are in a phase of seeing \u2014 beginning to notice the patterns that live between you. ' +
    'This is the essential first step. Nothing can change until it is seen clearly.',
  release:
    'You are beginning to let go of old protective patterns. This takes courage \u2014 ' +
    'the nervous system sometimes resists even when the mind is ready. Be patient with the process.',
  resonance:
    'Something is coming alive in the space between you. You are learning to ' +
    'attune to each other in new ways, and the relationship is beginning to show you what it needs.',
  embodiment:
    'The changes you have been making are becoming part of who you are as a couple. ' +
    'This is not a destination but a rhythm \u2014 a way of being together that sustains itself.',
};

// ─── Bottleneck Metadata ────────────────────────────────

interface BottleneckMeta {
  label: string;
  getDescription: (value: number) => string;
  practices: string[];
}

const BOTTLENECK_META: Record<WEAREVariableName, BottleneckMeta> = {
  attunement: {
    label: 'Feeling Each Other',
    getDescription: (v) =>
      v <= 3
        ? 'You may be missing each other\'s emotional signals right now. ' +
          'The invitation is to slow down and notice what your partner is actually feeling, ' +
          'not what you assume they are feeling.'
        : 'Your attunement could deepen. Small moments of pausing to check in \u2014 ' +
          'to really look at each other \u2014 can shift the quality of your connection.',
    practices: ['window-check', 'grounding-5-4-3-2-1', 'turning-toward', 'emotional-bid'],
  },

  coCreation: {
    label: 'Building Together',
    getDescription: (v) =>
      v <= 3
        ? 'You may be operating in parallel rather than creating together. ' +
          'The relationship has unique resources that only emerge when you both show up \u2014 ' +
          'finding those moments is the invitation.'
        : 'There is room to build more together. Your differences are not just friction \u2014 ' +
          'they are raw material for something neither of you could create alone.',
    practices: ['dreams-within-conflict', 'love-maps', 'relationship-values-compass', 'fondness-admiration'],
  },

  transmission: {
    label: 'Showing Up',
    getDescription: (v) =>
      v <= 3
        ? 'The gap between what you want for the relationship and what you are doing ' +
          'is significant right now. Even small, consistent actions can begin to close this gap.'
        : 'You are showing up, but there is room for more consistent follow-through. ' +
          'The relationship responds to what you do, not just what you intend.',
    practices: ['soft-startup', 'repair-attempt', 'rituals-of-connection', 'willingness-stance'],
  },

  space: {
    label: 'Healthy Separateness',
    getDescription: (v) =>
      v <= 3
        ? 'The boundaries between you may be too blurred or too rigid right now. ' +
          'Healthy separateness \u2014 knowing where you end and your partner begins \u2014 ' +
          'actually makes closeness safer.'
        : 'Your sense of self within the relationship could be strengthened. ' +
          'When each of you has a solid sense of who you are, the space between becomes richer.',
    practices: ['couple-bubble', 'parts-check-in', 'defusion-from-stories', 'protector-dialogue'],
  },

  time: {
    label: 'Consistency',
    getDescription: (v) =>
      v <= 3
        ? 'Consistent engagement has been low. Relationships need regular nourishment \u2014 ' +
          'even brief daily moments of connection matter more than occasional grand gestures.'
        : 'Your consistency is building but could be strengthened. ' +
          'Small daily practices compound over time into something powerful.',
    practices: ['rituals-of-connection', 'stress-reducing-conversation', 'turning-toward', 'love-maps'],
  },

  individual: {
    label: 'Inner Resources',
    getDescription: (v) =>
      v <= 3
        ? 'One or both of you may be running low on inner resources right now. ' +
          'Taking care of yourself is not selfish \u2014 it is how you bring your best self to the relationship.'
        : 'Your individual capacity is moderate. Strengthening your emotional regulation ' +
          'and self-awareness will directly benefit the space between you.',
    practices: ['self-compassion-break', 'window-check', 'opposite-action', 'values-compass'],
  },

  context: {
    label: 'Life Pressures',
    getDescription: (v) =>
      v <= 3
        ? 'Life is putting significant pressure on your relationship right now. ' +
          'This is not about what is wrong between you \u2014 it is about what is happening around you. ' +
          'Name the pressures together so they do not become invisible forces pulling you apart.'
        : 'External factors are creating some strain. Acknowledging these pressures \u2014 ' +
          'rather than absorbing them silently \u2014 helps protect the space between you.',
    practices: ['stress-reducing-conversation', 'radical-acceptance', 'distress-tolerance-together', 'couple-bubble'],
  },

  change: {
    label: 'Growth Momentum',
    getDescription: (v) =>
      v <= 3
        ? 'Growth momentum is low. This might mean you are stuck in familiar patterns ' +
          'or that the system is resisting change. The invitation is to take one small step ' +
          'in a new direction \u2014 small enough to feel safe, big enough to be real.'
        : 'You are moving, but slowly. Momentum builds on itself \u2014 ' +
          'each small change makes the next one easier.',
    practices: ['recognize-cycle', 'willingness-stance', 'relationship-mission-statement', 'aftermath-of-fight'],
  },

  resistance: {
    label: 'Letting Go',
    getDescription: (v) =>
      v >= 7
        ? 'There is significant rigidity in the system right now. Fixed stories about your partner, ' +
          'certainty about motives, or difficulty tolerating change may be holding the relationship ' +
          'in place. The invitation is not to force change but to soften the grip on certainty.'
        : 'Some resistance to change is present. This is normal \u2014 the protective system ' +
          'needs to feel safe before it can let go. Small experiments with flexibility help.',
    practices: ['defusion-from-stories', 'radical-acceptance', 'unified-detachment', 'accessing-primary-emotions'],
  },
};
