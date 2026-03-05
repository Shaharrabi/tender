/**
 * Partner Exchange Prompts — Data + logic for interactive partner exchange flow.
 *
 * Each step has a structured exchange:
 *   PROMPT → WRITE → WAIT → REVEAL → FOLLOW-UP → COMPLETE
 *
 * Both partners must submit before either can see the other's response.
 * After reveal, a follow-up question deepens the dialogue.
 *
 * Steps 1-10 have full exchange configs.
 * Steps 11-12 fall back to the existing simple partner round in step-detail.
 */

// ─── Types ──────────────────────────────────────────────

export interface PartnerExchangeConfig {
  stepNumber: number;
  /** The initial prompt shown to both partners */
  prompt: string;
  /** The follow-up prompt shown after both responses are revealed */
  followUp: string;
  /** Placeholder hint text for the reflection input */
  reflectionHint: string;
}

/**
 * Exchange phases — determines what the UI renders.
 *
 * prompt    → Haven't written yet
 * waiting   → Wrote mine, partner hasn't submitted
 * reveal    → Both submitted — can see partner's response, follow-up not yet answered
 * complete  → Follow-up answered — exchange complete
 */
export type ExchangePhase =
  | 'prompt'
  | 'waiting'
  | 'reveal'
  | 'complete';

// ─── Exchange Data ──────────────────────────────────────

export const PARTNER_EXCHANGES: Record<number, PartnerExchangeConfig> = {
  1: {
    stepNumber: 1,
    prompt: 'What made you decide to try this?',
    followUp: 'What do you notice about the difference between your answers?',
    reflectionHint: 'Take a moment to sit with what you just read.',
  },
  2: {
    stepNumber: 2,
    prompt: 'When does the space between us feel warm? When does it feel cold?',
    followUp: 'Did your partner name something you hadn\'t noticed?',
    reflectionHint: 'What surprised you about your partner\'s answer?',
  },
  3: {
    stepNumber: 3,
    prompt: 'What\'s a story I tell about you that might not be the whole picture?',
    followUp: 'How does it feel to read what your partner wrote?',
    reflectionHint: 'Sit with whatever came up for you.',
  },
  4: {
    stepNumber: 4,
    prompt: 'What\'s one move I make in our conflicts that I know doesn\'t help?',
    followUp: 'What do you want to say to your partner about what they shared?',
    reflectionHint: 'What feels true about what they named?',
  },
  5: {
    stepNumber: 5,
    prompt: 'What\'s something true that I\'ve been afraid to tell you?',
    followUp: 'What do you want your partner to know about how their truth landed?',
    reflectionHint: 'Let yourself feel whatever is here.',
  },
  6: {
    stepNumber: 6,
    prompt: 'What\'s the enemy story I tell about you? And what do I think is underneath it?',
    followUp: 'Can you see the pattern now \u2014 not the person, but the dance?',
    reflectionHint: 'What shifted in how you see the pattern between you?',
  },
  7: {
    stepNumber: 7,
    prompt: 'What\'s one small thing I do that makes you feel loved?',
    followUp: 'This week, try doing the thing your partner named. Report back.',
    reflectionHint: 'What would it mean to do this more often?',
  },
  8: {
    stepNumber: 8,
    prompt: 'What\'s one new move I\'m trying to make? How can you support it?',
    followUp: 'How did it go? What did you notice?',
    reflectionHint: 'What was different about trying a new move?',
  },
  9: {
    stepNumber: 9,
    prompt: 'What\'s the repair gesture from me that works best for you?',
    followUp: 'Try it this week. What happened?',
    reflectionHint: 'What did you learn about repair?',
  },
  10: {
    stepNumber: 10,
    prompt: 'What small ritual do you want us to never lose?',
    followUp: 'Design one new ritual together.',
    reflectionHint: 'What makes this ritual matter to both of you?',
  },
};

// ─── Helpers ────────────────────────────────────────────

/** Get the exchange config for a step, or null if no exchange exists. */
export function getPartnerExchange(
  stepNumber: number
): PartnerExchangeConfig | null {
  return PARTNER_EXCHANGES[stepNumber] ?? null;
}

/**
 * Determine the current phase of the exchange flow.
 *
 * @param myResponse     — User's initial response (null if not submitted)
 * @param partnerResponse — Partner's initial response (null if not submitted)
 * @param myFollowUp     — User's follow-up response (null if not submitted)
 */
export function getExchangePhase(
  myResponse: string | null,
  partnerResponse: string | null,
  myFollowUp: string | null,
): ExchangePhase {
  if (!myResponse) return 'prompt';
  if (!partnerResponse) return 'waiting';
  if (!myFollowUp) return 'reveal';
  return 'complete';
}
