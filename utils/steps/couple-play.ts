/**
 * Couple Play Activities — Step-specific interactive micro-activities
 * designed for two people on two phones.
 *
 * Lighter and more playful than Partner Exchanges. Uses the same
 * write→wait→reveal pattern (saved to `partner_exchanges` table
 * with type='couple_play') but with a different visual treatment.
 *
 * Steps 1–10 each have a unique activity.
 * Steps 11–12 focus on sustaining and integration — no specific play.
 */

// ─── Types ──────────────────────────────────────────────

export interface CouplePlayActivity {
  stepNumber: number;
  /** Fun, memorable activity name */
  name: string;
  /** Brief description of the activity (shown before starting) */
  instructions: string;
  /** The prompt each partner responds to */
  prompt: string;
  /** Follow-up question after both responses are revealed */
  followUp: string;
  /** Estimated time, e.g. "3 min" */
  duration: string;
}

// ─── Activity Data ──────────────────────────────────────

export const COUPLE_PLAY: Record<number, CouplePlayActivity> = {

  1: {
    stepNumber: 1,
    name: 'Name It Together',
    instructions: 'Both of you simultaneously write what you think the core pattern between you is. Then reveal to each other and compare.',
    prompt: 'In one or two sentences, what is the pattern between you and your partner?',
    followUp: 'How similar or different were your answers? What surprised you?',
    duration: '3 min',
  },

  2: {
    stepNumber: 2,
    name: 'Bid Catch',
    instructions: 'A 24-hour challenge: each of you notices 3 bids for connection from your partner. Log them here. Compare at the end of the day.',
    prompt: 'Describe one bid for connection you noticed from your partner today (a look, a question, a touch, a comment).',
    followUp: 'Were you surprised by what your partner noticed? What does this tell you about the bids you each send?',
    duration: '2 min',
  },

  3: {
    stepNumber: 3,
    name: 'Story Swap',
    instructions: 'Each of you writes the story you tell yourself about WHY your partner does the thing that frustrates you most. Then read your partner\'s story aloud to them. No defending — just listen.',
    prompt: 'The story I tell about why you do the thing that frustrates me most is...',
    followUp: 'What did it feel like to hear your partner\'s story about you? What grain of truth was in it — and what was the story missing?',
    duration: '5 min',
  },

  4: {
    stepNumber: 4,
    name: 'Dance Map',
    instructions: 'Each of you maps your 3-step sequence in conflict: what triggers you → the move you make → what happens next. Then share your maps.',
    prompt: 'My conflict sequence: When [trigger], I [move], which leads to [result].',
    followUp: 'Looking at both maps together — how do your moves fit together? Where does one person\'s move trigger the other\'s?',
    duration: '4 min',
  },

  5: {
    stepNumber: 5,
    name: 'The Unsaid',
    instructions: 'Each of you writes one thing you\'ve been wanting to say but haven\'t found the words or the moment for. Both responses stay sealed until both are submitted.',
    prompt: 'Something I\'ve been wanting to tell you but haven\'t said yet is...',
    followUp: 'Now that this has been said — what do you want your partner to know about how it felt to share this?',
    duration: '5 min',
  },

  6: {
    stepNumber: 6,
    name: 'Behind the Wall',
    instructions: 'Each of you writes what you think your partner\'s "enemy story" about you sounds like. Then reveal — see how well you know each other\'s frustration.',
    prompt: 'I think my partner\'s "enemy story" about me sounds like: "[Your partner probably thinks...]"',
    followUp: 'How close was your partner to your actual inner narrative? What did they get right — and what did they miss?',
    duration: '4 min',
  },

  7: {
    stepNumber: 7,
    name: 'Love Language Lab',
    instructions: 'Each of you writes 5 small, specific things that make you feel loved and connected. Exchange lists. Try one from your partner\'s list today.',
    prompt: '5 small things that make me feel loved:\n1.\n2.\n3.\n4.\n5.',
    followUp: 'Which item from your partner\'s list surprised you? Which one will you try first?',
    duration: '4 min',
  },

  8: {
    stepNumber: 8,
    name: 'New Move Trial',
    instructions: 'Pick one new pattern you want to try this week. Each of you rates your confidence (1-10) in pulling it off. Practice it. Rate again after.',
    prompt: 'The new move I want to practice is: [describe]. My confidence level right now (1-10): ',
    followUp: 'After trying the new move — what was harder than expected? What was easier? What\'s your confidence level now?',
    duration: '3 min',
  },

  9: {
    stepNumber: 9,
    name: 'Repair Replay',
    instructions: 'Think of a recent rupture (small or big). Each of you writes your ideal repair script — what you wish had been said in that moment.',
    prompt: 'A recent moment that needed repair: [brief description]. What I wish I had said or done: ',
    followUp: 'Compare your repair scripts. What overlaps? What would it look like to combine both scripts into one real repair?',
    duration: '5 min',
  },

  10: {
    stepNumber: 10,
    name: 'Ritual Design',
    instructions: 'Each of you proposes one daily ritual and one weekly ritual that would help you stay connected. Then negotiate your final set together.',
    prompt: 'My proposed daily ritual: [description]. My proposed weekly ritual: [description].',
    followUp: 'Which rituals made it into your final set? What made those ones feel right for both of you?',
    duration: '5 min',
  },
};

// ─── API ─────────────────────────────────────────────────

/** Get the couple play activity for a step, or null if not defined. */
export function getCouplePlay(stepNumber: number): CouplePlayActivity | null {
  return COUPLE_PLAY[stepNumber] ?? null;
}
