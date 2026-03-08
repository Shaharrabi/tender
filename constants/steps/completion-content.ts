/**
 * Step Completion Content — Per-step reflective questions, affirmations,
 * and per-phase completion messages for the StepCompletionRitual overlay.
 *
 * Content is therapist-voiced: warm, specific, non-generic.
 * Draws from each step's therapeutic goal and reflection prompts.
 */

// ─── Per-Step Completion ────────────────────────────────

export interface StepCompletionContent {
  /** Reflective question shown after completion */
  reflectionQuestion: string;
  /** Warm affirmation in therapist voice */
  affirmation: string;
}

export const STEP_COMPLETION_CONTENT: Record<number, StepCompletionContent> = {
  1: {
    reflectionQuestion: 'What pattern did you see between you?',
    affirmation: 'You named the dance. That\u2019s where change begins.',
  },
  2: {
    reflectionQuestion: 'When did the space between you feel most alive?',
    affirmation: 'Something wiser than either of you is already at work.',
  },
  3: {
    reflectionQuestion: 'What story did you hold a little more loosely?',
    affirmation: 'Letting go of certainty is one of the bravest things you can do.',
  },
  4: {
    reflectionQuestion: 'What did you find underneath your protective moves?',
    affirmation: 'Looking inward takes courage. You just reclaimed your power to change.',
  },
  5: {
    reflectionQuestion: 'What truth did you finally let yourself share?',
    affirmation: 'Vulnerability is not weakness. It\u2019s the foundation of real intimacy.',
  },
  6: {
    reflectionQuestion: 'When did you see your partner differently this week?',
    affirmation: 'The walls between you came from protection, not malice. You see that now.',
  },
  7: {
    reflectionQuestion: 'What small ritual do you want to keep forever?',
    affirmation: 'Understanding becomes change when it becomes practice. You\u2019re living it.',
  },
  8: {
    reflectionQuestion: 'What wound did you finally turn toward?',
    affirmation: 'Tending to what\u2019s been hurt is an act of love. For both of you.',
  },
  9: {
    reflectionQuestion: 'What did you do differently that mattered?',
    affirmation: 'Trust is rebuilt through action, not promises. You showed up.',
  },
  10: {
    reflectionQuestion: 'When did you catch the old pattern and choose differently?',
    affirmation: 'Catching yourself is not failure \u2014 it\u2019s awareness. That\u2019s everything.',
  },
  11: {
    reflectionQuestion: 'What is your relationship trying to tell you right now?',
    affirmation: 'You\u2019re learning to listen to something larger than either of you.',
  },
  12: {
    reflectionQuestion: 'What do you want to carry forward from this journey?',
    affirmation: 'You showed up. Again and again. That is everything.',
  },
};

// ─── Per-Phase Completion ───────────────────────────────

export interface PhaseCompletionContent {
  phaseId: string;
  /** e.g. "You've completed the Seeing phase" */
  message: string;
  /** What this phase was about */
  summary: string;
}

/** Phase-ending steps: the last step in each phase */
export const PHASE_ENDING_STEPS: Record<number, string> = {
  2: 'seeing',
  4: 'feeling',
  7: 'shifting',
  10: 'integrating',
  12: 'sustaining',
};

export const PHASE_COMPLETION_CONTENT: Record<string, PhaseCompletionContent> = {
  seeing: {
    phaseId: 'seeing',
    message: 'You\u2019ve completed the Seeing phase',
    summary: 'You learned to see your patterns \u2014 not as personal failure, but as the dance between you.',
  },
  feeling: {
    phaseId: 'feeling',
    message: 'You\u2019ve completed the Feeling phase',
    summary: 'You made contact with what\u2019s underneath \u2014 the fears, the longings, the parts you protect.',
  },
  shifting: {
    phaseId: 'shifting',
    message: 'You\u2019ve completed the Shifting phase',
    summary: 'You tried new moves \u2014 sharing truths, releasing old stories, building daily practices.',
  },
  integrating: {
    phaseId: 'integrating',
    message: 'You\u2019ve completed the Integrating phase',
    summary: 'You turned insight into action \u2014 repairing what was broken and rebuilding trust.',
  },
  sustaining: {
    phaseId: 'sustaining',
    message: 'You\u2019ve completed the Sustaining phase',
    summary: 'You learned to listen to the relationship itself and carry connection forward.',
  },
};

// ─── Journey Completion (Step 12) ───────────────────────

export const JOURNEY_COMPLETE_MESSAGE =
  'You\u2019ve walked all twelve steps. The seeing. The softening. The rebuilding. The practicing. This isn\u2019t an ending \u2014 it\u2019s who you\u2019re becoming.';

// ─── Helpers ────────────────────────────────────────────

export function getStepCompletionContent(stepNumber: number): StepCompletionContent {
  return STEP_COMPLETION_CONTENT[stepNumber] ?? {
    reflectionQuestion: 'What did you notice?',
    affirmation: 'Every step forward matters.',
  };
}

export function isPhaseEndingStep(stepNumber: number): boolean {
  return stepNumber in PHASE_ENDING_STEPS;
}

export function getPhaseCompletionContent(stepNumber: number): PhaseCompletionContent | null {
  const phaseId = PHASE_ENDING_STEPS[stepNumber];
  if (!phaseId) return null;
  return PHASE_COMPLETION_CONTENT[phaseId] ?? null;
}

export function isJourneyComplete(stepNumber: number): boolean {
  return stepNumber === 12;
}
