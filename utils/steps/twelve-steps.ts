/**
 * Twelve Steps of Relational Healing — Master Data
 *
 * Contains the full step definitions, practice-to-step mapping,
 * phase definitions, and Sage behavior contexts.
 *
 * The Twelve Steps are the TRANSFORMATIONAL ARC of Tender.
 * Steps live inside Healing Phases. Practices live inside Steps.
 */

import type { HealingStep, HealingPhase } from '@/types/growth';

// ─── Practice-to-Step Mapping ───────────────────────────
// Maps exercise IDs from the intervention registry to their primary step.
// Some practices appear in multiple steps (e.g., window-check in Steps 1 & 10).

export const PRACTICE_STEP_MAP: Record<string, number[]> = {
  // Step 1: Acknowledge the Strain
  'window-check': [1, 10],
  'parts-check-in': [1, 10],
  'recognize-cycle': [1],
  'protest-polka': [1],

  // Step 2: Trust the Relational Field
  'couple-bubble': [2],
  'stress-reducing-conversation': [2],
  'turning-toward': [2],
  'emotional-bid': [2], // "Turning Toward Bids" maps to emotional-bid

  // Step 3: Release Certainty
  'defusion-from-stories': [3],
  'love-maps': [3],
  'radical-acceptance': [3],

  // Step 4: Examine Our Part
  'accessing-primary-emotions': [4],
  'protector-dialogue': [4],
  'four-horsemen-antidotes': [4],
  'values-compass': [4],

  // Step 5: Share Our Truths
  'bonding-through-vulnerability': [5],
  'hold-me-tight': [5],
  'self-compassion-break': [5],

  // Step 6: Release the Enemy Story
  'unified-detachment': [6],
  'empathic-joining': [6],
  'fondness-admiration': [6],

  // Step 7: Commit to Relational Practices
  'rituals-of-connection': [7],
  'relationship-values-compass': [7],
  'willingness-stance': [7],
  'grounding-5-4-3-2-1': [7],

  // Step 8: Prepare to Repair Harm
  'aftermath-of-fight': [8], // maps to "Processing a Regrettable Incident"
  'distress-tolerance-together': [8], // maps to "TIPP Skills"

  // Step 9: Act to Rebuild Trust
  'repair-attempt': [9],
  'soft-startup': [9],
  'dear-man': [9],

  // Step 10: Maintain Ongoing Awareness
  // window-check and parts-check-in (revisited, already mapped above)

  // Step 11: Seek Shared Insight
  'dreams-within-conflict': [11],

  // Step 12: Carry the Message
  'relationship-mission-statement': [12],
  'opposite-action': [12],
};

/** Get the primary step for a practice (first assigned step). */
export function getPrimaryStep(practiceId: string): number | undefined {
  return PRACTICE_STEP_MAP[practiceId]?.[0];
}

/** Get all practices assigned to a specific step. */
export function getPracticesForStep(stepNumber: number): string[] {
  return Object.entries(PRACTICE_STEP_MAP)
    .filter(([, steps]) => steps.includes(stepNumber))
    .map(([id]) => id);
}

// ─── The 12 Steps ──────────────────────────────────────

export const TWELVE_STEPS: HealingStep[] = [
  {
    stepNumber: 1,
    title: 'Acknowledge the Strain',
    quote:
      'We admit that patterns of disconnection have taken hold in our relationship \u2014 patterns we didn\u2019t choose but now must face together.',
    therapeuticGoal:
      'Create shared awareness of disconnection without blame. Move from "you\'re the problem" to "we have a pattern."',
    phase: 'seeing',
    fourMovementsEmphasis: 'Recognition',
    sageBehavior: {
      tone: 'curious, gentle, normalizing',
      focus: 'seeing patterns without blame',
      avoids: ['pushing for change too fast', 'assigning blame', 'rushing past acknowledgment'],
    },
    completionCriteria: [
      'Both partners complete Window of Tolerance Check (3x each)',
      'Both partners complete Parts Check-In (2x each)',
      'Couple completes Recognizing Your Negative Cycle together',
      'Couple can name their cycle without blaming',
    ],
    practices: ['window-check', 'parts-check-in', 'recognize-cycle', 'protest-polka'],
  },
  {
    stepNumber: 2,
    title: 'Trust the Relational Field',
    quote:
      'We come to believe that something wiser than either of us emerges when we meet with openness \u2014 a \u201Cwe\u201D that can heal what \u201CI\u201D cannot.',
    therapeuticGoal:
      'Shift from adversarial orientation to collaborative orientation. Build faith in the relationship itself as an entity worth tending.',
    phase: 'seeing',
    fourMovementsEmphasis: 'Recognition \u2192 Resonance',
    sageBehavior: {
      tone: 'warm, inviting, hopeful',
      focus: 'building faith in the "we"',
      avoids: ['cynicism', 'skepticism about repair', 'focusing only on individual growth'],
    },
    completionCriteria: [
      'Couple Bubble exercise completed',
      '7-day streak of Stress-Reducing Conversations',
      'Both partners can identify 3+ types of bids they make',
      'At least one "repair after missing a bid" moment acknowledged',
    ],
    practices: ['couple-bubble', 'stress-reducing-conversation', 'turning-toward', 'emotional-bid'],
  },
  {
    stepNumber: 3,
    title: 'Release Certainty',
    quote:
      'We let go of our fixed stories about each other and our relationship. We choose presence over prediction.',
    therapeuticGoal:
      'Soften rigid narratives. Create space for partner to be more than the story you\'ve told yourself about them.',
    phase: 'feeling',
    fourMovementsEmphasis: 'Release',
    sageBehavior: {
      tone: 'gentle, curious, destabilizing (in a safe way)',
      focus: 'loosening grip on certainty',
      avoids: ['reinforcing fixed stories', 'agreeing with black-and-white thinking'],
    },
    completionCriteria: [
      'Both partners complete Defusion from Relationship Stories',
      'Love Maps exercise completed with at least 15 new learnings noted',
      'Each partner identifies one "story I\'ve held that may not be the whole truth"',
    ],
    practices: ['defusion-from-stories', 'love-maps', 'radical-acceptance'],
  },
  {
    stepNumber: 4,
    title: 'Examine Our Part',
    quote:
      'We look honestly at how our own patterns contribute to disconnection \u2014 not to blame ourselves, but to reclaim our power to change.',
    therapeuticGoal:
      'Move from victim to agent. Own contribution to the cycle without collapsing into shame.',
    phase: 'feeling',
    fourMovementsEmphasis: 'Release',
    sageBehavior: {
      tone: 'honest, compassionate, direct',
      focus: 'owning without shaming',
      avoids: ['enabling blame of partner', 'collapsing into shame', 'bypassing accountability'],
    },
    completionCriteria: [
      'Both partners complete Accessing Primary Emotions',
      'Both partners complete Dialogue with a Protector',
      'Four Horsemen Antidotes completed \u2014 each partner identifies their primary horseman',
      'Both partners can articulate their top 3 relationship values',
    ],
    practices: ['accessing-primary-emotions', 'protector-dialogue', 'four-horsemen-antidotes', 'values-compass'],
  },
  {
    stepNumber: 5,
    title: 'Share Our Truths',
    quote:
      'We speak what has been hidden \u2014 our fears, our longings, our disappointments \u2014 trusting that truth told with care strengthens the bond.',
    therapeuticGoal:
      'Practice vulnerable disclosure. Build trust through witnessing and being witnessed.',
    phase: 'shifting',
    fourMovementsEmphasis: 'Resonance',
    sageBehavior: {
      tone: 'tender, reverent, holding',
      focus: 'creating safety for disclosure',
      avoids: ['rushing', 'intellectualizing', 'minimizing vulnerability'],
    },
    completionCriteria: [
      'Bonding Through Vulnerability completed at least once',
      'Hold Me Tight Conversation completed',
      'Both partners can name one fear they hadn\'t shared before this step',
    ],
    practices: ['bonding-through-vulnerability', 'hold-me-tight', 'self-compassion-break'],
  },
  {
    stepNumber: 6,
    title: 'Release the Enemy Story',
    quote:
      'We let go of seeing each other as adversaries. We recognize that the walls between us came from protection, not malice.',
    therapeuticGoal:
      'Soften contempt. See partner\'s behavior through attachment lens rather than character lens.',
    phase: 'shifting',
    fourMovementsEmphasis: 'Release \u2192 Resonance',
    sageBehavior: {
      tone: 'compassionate, reframing, curious about partner',
      focus: 'dissolving the enemy image',
      avoids: ['enabling contempt', 'agreeing with demonization'],
    },
    completionCriteria: [
      'Unified Detachment completed \u2014 both can describe cycle in "we" language',
      'Fondness & Admiration completed \u2014 21-day appreciation practice',
      'Each partner can articulate one way their partner\'s "difficult" behavior makes sense given their history',
    ],
    practices: ['unified-detachment', 'empathic-joining', 'fondness-admiration'],
  },
  {
    stepNumber: 7,
    title: 'Commit to Relational Practices',
    quote:
      'We ask for the humility and courage to approach each encounter with curiosity and kindness, making our relationship a daily practice.',
    therapeuticGoal:
      'Move from insight to consistent action. Build sustainable rituals.',
    phase: 'shifting',
    fourMovementsEmphasis: 'Embodiment',
    sageBehavior: {
      tone: 'practical, encouraging, coach-like',
      focus: 'building sustainable habits',
      avoids: ['perfectionism', 'overwhelming with too many practices'],
    },
    completionCriteria: [
      'At least 3 Rituals of Connection established and practiced for 2+ weeks',
      'Relationship Values Compass completed \u2014 shared values articulated',
      'Both partners can name their "willingness edges"',
    ],
    practices: ['rituals-of-connection', 'relationship-values-compass', 'willingness-stance', 'grounding-5-4-3-2-1'],
  },
  {
    stepNumber: 8,
    title: 'Prepare to Repair Harm',
    quote:
      'We bring our attention to the ruptures \u2014 the moments of betrayal, withdrawal, or harm \u2014 and prepare to face them together.',
    therapeuticGoal:
      'Surface unresolved wounds without re-traumatizing. Create readiness for repair.',
    phase: 'shifting',
    fourMovementsEmphasis: 'Recognition',
    sageBehavior: {
      tone: 'grounded, careful, boundaried',
      focus: 'preparing safely for difficult repair work',
      avoids: ['forcing repair before readiness', 're-traumatizing', 'minimizing harm'],
    },
    completionCriteria: [
      'TIPP Skills practiced together at least twice',
      'At least one Regrettable Incident processed',
      'Both partners identify 1-2 "repair-worthy" moments not yet addressed',
    ],
    practices: ['aftermath-of-fight', 'distress-tolerance-together'],
  },
  {
    stepNumber: 9,
    title: 'Act to Rebuild Trust',
    quote:
      'We move from intention to action \u2014 listening where we once dismissed, reaching where we once retreated, showing up where we once stayed silent.',
    therapeuticGoal:
      'Take concrete repair actions. Demonstrate change through behavior, not just words.',
    phase: 'integrating',
    fourMovementsEmphasis: 'Embodiment',
    sageBehavior: {
      tone: 'action-oriented, accountable, celebrating effort',
      focus: 'supporting follow-through',
      avoids: ['accepting words without action', 'enabling empty apologies'],
    },
    completionCriteria: [
      'Repair Conversation Guide used for at least 2 past ruptures',
      'Soft Startup practiced in at least 3 real conversations',
      'DEAR MAN used by each partner at least once',
      'Both partners can name one concrete behavioral change they\'ve made',
    ],
    practices: ['repair-attempt', 'soft-startup', 'dear-man'],
  },
  {
    stepNumber: 10,
    title: 'Maintain Ongoing Awareness',
    quote:
      'We recognize that old patterns will resurface. When they do, we meet them with honesty and gentle recalibration, not shame.',
    therapeuticGoal:
      'Normalize setbacks. Build sustainable maintenance practices. Prevent relapse into old cycles.',
    phase: 'integrating',
    fourMovementsEmphasis: 'Recognition \u2192 Embodiment',
    sageBehavior: {
      tone: 'steady, normalizing, non-judgmental',
      focus: 'supporting ongoing awareness without perfectionism',
      avoids: ['shame about setbacks', 'complacency', 'all-or-nothing thinking'],
    },
    completionCriteria: [
      '30-day maintenance tracking established',
      'At least one "we caught ourselves in the old pattern" moment processed',
      'Both partners have a personal regulation practice they do 3x/week',
    ],
    practices: ['window-check', 'parts-check-in'],
  },
  {
    stepNumber: 11,
    title: 'Seek Shared Insight',
    quote:
      'We create spaces for the relationship itself to speak \u2014 through reflection, dialogue, and quiet presence together.',
    therapeuticGoal:
      'Develop couple\'s capacity for metacognition. Learn to "check in" with the relationship as an entity.',
    phase: 'sustaining',
    fourMovementsEmphasis: 'Resonance',
    sageBehavior: {
      tone: 'spacious, reflective, attuned to something larger',
      focus: 'listening to the relationship itself',
      avoids: ['rushing to solutions', 'staying on surface level'],
    },
    completionCriteria: [
      'Dreams Within Conflict completed for at least one persistent disagreement',
      'Couple has established a regular "relationship check-in" ritual',
      'Both partners can describe what they sense the relationship "needs" right now',
    ],
    practices: ['dreams-within-conflict'],
  },
  {
    stepNumber: 12,
    title: 'Carry the Message of Connection',
    quote:
      'Having experienced how openness and presence transform us, we embody these values in all our relationships \u2014 not by demanding others change, but by living as examples.',
    therapeuticGoal:
      'Integration and expansion. The couple becomes a source of relational health in their community.',
    phase: 'sustaining',
    fourMovementsEmphasis: 'Embodiment \u2192 Transmission',
    sageBehavior: {
      tone: 'celebratory, humble, looking outward',
      focus: 'integration and service',
      avoids: ['false completion', 'ignoring ongoing work'],
    },
    completionCriteria: [
      'Relationship review completed \u2014 couple reflects on full journey',
      'Each partner identifies how the journey has changed other relationships',
      'Couple creates a "relationship mission statement" or commitment',
    ],
    practices: [],
  },
];

// ─── Healing Phases ─────────────────────────────────────

export interface PhaseDefinition {
  id: HealingPhase;
  name: string;
  subtitle: string;
  weekRange: [number, number | null];
  icon: string;
  color: string;
  stepRange: [number, number];
  stepFocus: string;
}

export const HEALING_PHASES: PhaseDefinition[] = [
  {
    id: 'seeing',
    name: 'Seeing',
    subtitle: 'Understanding what\u2019s here',
    weekRange: [1, 2],
    icon: '\uD83D\uDC41\uFE0F',
    color: '#8B9E7E',
    stepRange: [1, 2],
    stepFocus: 'Acknowledge the Strain + Trust the Relational Field',
  },
  {
    id: 'feeling',
    name: 'Feeling',
    subtitle: 'Making contact with what\u2019s underneath',
    weekRange: [3, 4],
    icon: '\u2764\uFE0F',
    color: '#C4785B',
    stepRange: [3, 4],
    stepFocus: 'Release Certainty + Examine Our Part',
  },
  {
    id: 'shifting',
    name: 'Shifting',
    subtitle: 'Trying new moves',
    weekRange: [5, 8],
    icon: '\uD83D\uDD04',
    color: '#D4A574',
    stepRange: [5, 9],
    stepFocus: 'Share Truths \u2192 Release Enemy Story \u2192 Commit \u2192 Prepare \u2192 Act',
  },
  {
    id: 'integrating',
    name: 'Integrating',
    subtitle: 'Making it stick',
    weekRange: [9, 12],
    icon: '\uD83D\uDCDA',
    color: '#9B8EC4',
    stepRange: [9, 11],
    stepFocus: 'Maintain Awareness + Seek Shared Insight',
  },
  {
    id: 'sustaining',
    name: 'Sustaining',
    subtitle: 'Living it',
    weekRange: [13, null],
    icon: '\u2600\uFE0F',
    color: '#E8C87A',
    stepRange: [11, 12],
    stepFocus: 'Carry the Message of Connection',
  },
];

/** Get the phase that contains a given step number. */
export function getPhaseForStep(stepNumber: number): PhaseDefinition | undefined {
  return HEALING_PHASES.find(
    (phase) => stepNumber >= phase.stepRange[0] && stepNumber <= phase.stepRange[1]
  );
}

/** Get a step by its number. */
export function getStep(stepNumber: number): HealingStep | undefined {
  return TWELVE_STEPS.find((s) => s.stepNumber === stepNumber);
}

// ─── Taglines by Step ───────────────────────────────────

export const TAGLINES_BY_STEP: Record<number, string[]> = {
  1: [
    'The pattern is not the person.',
    'Your cycle makes sense. It just costs too much.',
    'The dance between you is not either person\u2019s fault.',
  ],
  2: [
    'Something wiser than either of you emerges when you meet with openness.',
    'The \u201Cwe\u201D can heal what \u201CI\u201D cannot.',
    'Safety is not the absence of danger. It is the presence of connection.',
  ],
  3: [
    'What if you are wrong about why they do that?',
    'Your story about them might not be the whole truth.',
    'Presence over prediction.',
  ],
  4: [
    'What you are feeling underneath is the real conversation.',
    'Every protector has a good reason.',
    'Owning your part is not blame. It is power.',
  ],
  5: [
    'Vulnerability is not weakness. It is the birthplace of connection.',
    'The strongest relationships are built by people willing to be seen.',
    'Truth told with care strengthens the bond.',
  ],
  6: [
    'The walls between you came from protection, not malice.',
    'Can you see the scared child underneath their difficult behavior?',
    'Contempt dissolves when you see your partner\u2019s wound.',
  ],
  7: [
    'Small, consistent practice changes everything.',
    'Your relationship is a daily practice, not a fixed state.',
    'Rituals of connection are how love lives.',
  ],
  8: [
    'Rupture is inevitable. Repair is a choice.',
    'Old wounds need acknowledgment before healing.',
    'Preparing to repair is an act of courage.',
  ],
  9: [
    'Coming back is braver than never leaving.',
    'Real repair is behavior change, not just words.',
    'Trust is rebuilt in small, consistent actions.',
  ],
  10: [
    'Old patterns will resurface. Meet them with gentleness.',
    'Catching yourself in the cycle is the practice.',
    'Setbacks are not failures. They are data.',
  ],
  11: [
    'What does your relationship want to tell you?',
    'The deeper meaning is underneath the conflict.',
    'Listen to the \u201Cwe\u201D \u2014 it has wisdom.',
  ],
  12: [
    'You are already brave enough to be here.',
    'Your healing ripples outward.',
    'Living this way IS the message.',
  ],
};

/** Get a random tagline for a step number. */
export function getTaglineForStep(stepNumber: number): string {
  const taglines = TAGLINES_BY_STEP[stepNumber] ?? TAGLINES_BY_STEP[1];
  return taglines[Math.floor(Math.random() * taglines.length)];
}

// ─── Step-Specific Sage Opening Prompts ──────────────────
// These replace the generic conversation starters when the user
// has an active step. They guide the conversation toward the step's focus.

export const SAGE_OPENING_PROMPTS: Record<number, string[]> = {
  1: [
    'Help me see the pattern between us',
    'I noticed something keeps happening in our arguments',
    'Why do we keep falling into the same fight?',
  ],
  2: [
    'I want to believe things can get better',
    'What does it mean to trust the relationship itself?',
    'Help me see what\'s good between us',
  ],
  3: [
    'I might be wrong about why my partner does that',
    'I have a story about my partner I want to examine',
    'Help me see my partner with fresh eyes',
  ],
  4: [
    'I want to understand my part in our cycle',
    'What am I bringing to this pattern?',
    'Help me see what I\'m protecting underneath',
  ],
  5: [
    'There\'s something I haven\'t told my partner',
    'I want to be more vulnerable but I\'m scared',
    'Help me find the words for what I\'m feeling',
  ],
  6: [
    'I\'m struggling to see my partner\'s side',
    'I want to stop seeing them as the enemy',
    'Help me understand why they do what they do',
  ],
  7: [
    'I want to build a daily practice for our relationship',
    'What rituals of connection could work for us?',
    'Help me turn my insights into habits',
  ],
  8: [
    'There\'s something between us that needs repair',
    'I hurt my partner and I want to make it right',
    'How do I prepare for a difficult conversation?',
  ],
  9: [
    'I want to show up differently this time',
    'Help me practice a soft startup',
    'I need to repair what happened yesterday',
  ],
  10: [
    'I caught myself falling into the old pattern',
    'How do I stay aware without being hyper-vigilant?',
    'The old cycle came back — help me process it',
  ],
  11: [
    'What does our relationship need right now?',
    'We have a conflict that keeps coming back',
    'Help us explore what\'s underneath this disagreement',
  ],
  12: [
    'I want to reflect on how far we\'ve come',
    'How has this journey changed my other relationships?',
    'Help us create our relationship mission statement',
  ],
};

/** Get opening prompts for Sage based on current step. */
export function getSageOpeningPrompts(stepNumber: number): string[] {
  return SAGE_OPENING_PROMPTS[stepNumber] ?? SAGE_OPENING_PROMPTS[1];
}
