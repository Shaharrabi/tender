/**
 * Step Context — Previous answers feeding forward into later steps.
 *
 * Loads reflection notes, partner exchange responses, and mini-game
 * insights from completed previous steps. Uses this data to:
 *   1. Enhance callback cards with the user's own words
 *   2. Generate a "Story So Far" synthesis for Step 12
 *   3. Provide contextual references throughout the step experience
 *
 * All data comes from existing tables — NO new tables needed.
 *   - step_progress.reflection_notes (JSONB)
 *   - mini_game_outputs
 *
 * Privacy: Only loads the CURRENT user's own reflections.
 * Partner responses are only referenced if the partner exchange
 * was already revealed (both partners submitted).
 */

import { supabase } from '@/services/supabase';
import { TWELVE_STEPS } from '@/utils/steps/twelve-steps';

// ─── Types ──────────────────────────────────────────────

export interface StepContext {
  /** What the user wrote in previous reflections that's relevant to THIS step */
  relevantReflections: Array<{
    fromStep: number;
    stepTitle: string;
    promptIndex: number;
    text: string;
  }>;
  /** Partner exchange responses from previous steps */
  partnerRevelations: Array<{
    fromStep: number;
    myResponse: string;
    partnerResponse: string | null;
  }>;
  /** The pattern the user named (from Step 1, if available) */
  namedPattern: string | null;
  /** A synthesized "story so far" for Step 12 */
  storySoFar: string | null;
}

// ─── Step Context Mapping ───────────────────────────────
// Defines which previous step's data each step cares about most

const STEP_CONTEXT_MAPPING: Record<number, {
  /** Which previous step's reflection to pull */
  reflectionStep: number;
  /** Which prompt index (0-based) within that step's reflections */
  reflectionPromptIndex: number;
  /** Template for enhanced callback using user's words (use {words} placeholder) */
  enhancedCallback: string;
}> = {
  2: {
    reflectionStep: 1,
    reflectionPromptIndex: 0,
    enhancedCallback: 'You named the strain as \u201C{words}\u201D. Now you\u2019re learning where that strain lives \u2014 in the space between.',
  },
  3: {
    reflectionStep: 2,
    reflectionPromptIndex: 0,
    enhancedCallback: 'You noticed the field feels \u201C{words}\u201D. The story you tell about WHY it feels that way is what this step examines.',
  },
  4: {
    reflectionStep: 3,
    reflectionPromptIndex: 0,
    enhancedCallback: 'You examined a story you carry: \u201C{words}\u201D. Now look at what drives YOUR side of that story.',
  },
  5: {
    reflectionStep: 4,
    reflectionPromptIndex: 0,
    enhancedCallback: 'You identified your move: \u201C{words}\u201D. Now comes the harder question \u2014 can you show your partner what that move is protecting?',
  },
  6: {
    reflectionStep: 5,
    reflectionPromptIndex: 0,
    enhancedCallback: 'You shared a truth. Now notice: is there still a part of you that sees your partner as the problem?',
  },
  7: {
    reflectionStep: 6,
    reflectionPromptIndex: 0,
    enhancedCallback: 'You caught the enemy story: \u201C{words}\u201D. Now that you see it, what do you want to INVITE instead?',
  },
  8: {
    reflectionStep: 7,
    reflectionPromptIndex: 0,
    enhancedCallback: 'You invited your partner closer. The new patterns you build should include more of what works between you.',
  },
  9: {
    reflectionStep: 8,
    reflectionPromptIndex: 0,
    enhancedCallback: 'You tried \u201C{words}\u201D. Some of it worked. Some didn\u2019t. The ones that didn\u2019t \u2014 that\u2019s your repair material.',
  },
  10: {
    reflectionStep: 9,
    reflectionPromptIndex: 0,
    enhancedCallback: 'You practiced repair. Build a ritual around what worked \u2014 knowing that repair is your safety net when rituals get disrupted.',
  },
  11: {
    reflectionStep: 10,
    reflectionPromptIndex: 0,
    enhancedCallback: 'You chose rituals that matter: \u201C{words}\u201D. Sustaining means protecting those choices even when life gets loud.',
  },
  12: {
    reflectionStep: 11,
    reflectionPromptIndex: 0,
    enhancedCallback: 'Everything before this was preparation. Now you live it.',
  },
};

// ─── Main API ───────────────────────────────────────────

/**
 * Load context from previous steps for use in the current step.
 * Only loads steps 1 through (currentStep - 1).
 */
export async function loadStepContext(
  userId: string,
  currentStepNumber: number,
): Promise<StepContext> {
  const emptyContext: StepContext = {
    relevantReflections: [],
    partnerRevelations: [],
    namedPattern: null,
    storySoFar: null,
  };

  if (currentStepNumber <= 1) return emptyContext;

  try {
    // Load all completed previous step progress rows
    const { data: previousSteps } = await supabase
      .from('step_progress')
      .select('step_number, reflection_notes, status')
      .eq('user_id', userId)
      .lt('step_number', currentStepNumber)
      .in('status', ['completed', 'active'])
      .order('step_number', { ascending: true });

    if (!previousSteps || previousSteps.length === 0) return emptyContext;

    const context: StepContext = {
      relevantReflections: [],
      partnerRevelations: [],
      namedPattern: null,
      storySoFar: null,
    };

    // Extract reflections and partner responses from each step
    for (const step of previousSteps) {
      const notes = step.reflection_notes as Record<string, any> | null;
      if (!notes) continue;

      const stepMeta = TWELVE_STEPS.find((s) => s.stepNumber === step.step_number);
      const stepTitle = stepMeta?.title ?? `Step ${step.step_number}`;

      // Extract reflections
      const reflections = notes.reflections as Record<string, string> | undefined;
      if (reflections) {
        Object.entries(reflections).forEach(([idx, text]) => {
          if (text?.trim()) {
            context.relevantReflections.push({
              fromStep: step.step_number,
              stepTitle,
              promptIndex: parseInt(idx, 10),
              text: text.trim(),
            });
          }
        });
      }

      // Extract partner exchange response
      const myResponse = notes.partnerRoundResponse as string | undefined;
      if (myResponse?.trim()) {
        context.partnerRevelations.push({
          fromStep: step.step_number,
          myResponse: myResponse.trim(),
          partnerResponse: null, // Not loading partner's data for privacy
        });
      }

      // Step 1 first reflection = the named pattern
      if (step.step_number === 1 && reflections?.['0']?.trim()) {
        context.namedPattern = reflections['0'].trim();
      }
    }

    // Step 12: Generate story so far
    if (currentStepNumber === 12) {
      context.storySoFar = generateStorySoFar(context);
    }

    return context;
  } catch (err) {
    console.warn('[StepContext] Failed to load:', err);
    return emptyContext;
  }
}

// ─── Enhanced Callback ──────────────────────────────────

/**
 * Get an enhanced callback that uses the user's own words.
 * Falls back to null if no relevant data exists.
 */
export function getEnhancedCallback(
  stepNumber: number,
  context: StepContext,
): string | null {
  const mapping = STEP_CONTEXT_MAPPING[stepNumber];
  if (!mapping) return null;

  // Find the relevant reflection from the previous step
  const relevantReflection = context.relevantReflections.find(
    (r) => r.fromStep === mapping.reflectionStep && r.promptIndex === mapping.reflectionPromptIndex,
  );

  if (!relevantReflection?.text) return null;

  // Truncate long reflections to ~60 chars for the callback card
  const truncated = relevantReflection.text.length > 60
    ? relevantReflection.text.substring(0, 57) + '...'
    : relevantReflection.text;

  return mapping.enhancedCallback.replace('{words}', truncated);
}

// ─── Story So Far (Step 12) ─────────────────────────────

function generateStorySoFar(context: StepContext): string | null {
  const parts: string[] = [];

  // Helper: find first reflection from a step
  const reflectionFrom = (step: number): string | null => {
    const r = context.relevantReflections.find((r) => r.fromStep === step && r.promptIndex === 0);
    return r?.text ? (r.text.length > 50 ? r.text.substring(0, 47) + '...' : r.text) : null;
  };

  // Helper: find partner response from a step
  const exchangeFrom = (step: number): string | null => {
    const e = context.partnerRevelations.find((p) => p.fromStep === step);
    return e?.myResponse ? (e.myResponse.length > 50 ? e.myResponse.substring(0, 47) + '...' : e.myResponse) : null;
  };

  const step1 = reflectionFrom(1);
  if (step1) parts.push(`When you started, you named the strain as \u201C${step1}\u201D.`);

  const step2 = reflectionFrom(2);
  if (step2) parts.push(`You discovered the space between you could feel \u201C${step2}\u201D.`);

  const step3 = exchangeFrom(3) ?? reflectionFrom(3);
  if (step3) parts.push(`You examined the story \u201C${step3}\u201D.`);

  const step4 = reflectionFrom(4);
  if (step4) parts.push(`You looked at your own part \u2014 \u201C${step4}\u201D.`);

  const step5 = exchangeFrom(5) ?? reflectionFrom(5);
  if (step5) parts.push(`You shared the truth that \u201C${step5}\u201D.`);

  if (reflectionFrom(6)) parts.push('You saw the enemy story dissolve.');

  const step7 = exchangeFrom(7);
  if (step7) parts.push(`You invited your partner with \u201C${step7}\u201D.`);

  if (reflectionFrom(8)) parts.push('You tried new moves.');
  if (reflectionFrom(9)) parts.push('You practiced repair.');
  if (reflectionFrom(10)) parts.push('You built rituals that matter.');
  if (reflectionFrom(11)) parts.push('You committed to sustaining what you\u2019ve built.');

  if (parts.length < 3) return null; // Not enough data for a meaningful synthesis

  parts.push('');
  parts.push('That\u2019s not a curriculum. That\u2019s YOUR story.');

  return parts.join(' ');
}
