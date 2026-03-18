import { AssessmentConfig, GenericQuestion, LikertOption, DUTCHScores } from '@/types';

const LIKERT_SCALE: LikertOption[] = [
  { value: 1, label: 'Not at all like me' },
  { value: 2, label: 'A little like me' },
  { value: 3, label: 'Somewhat like me' },
  { value: 4, label: 'Quite like me' },
  { value: 5, label: 'Very much like me' },
];

/**
 * Tender Conflict Style Assessment — 20 items (4 per subscale)
 * Constructs from De Dreu et al. (2001), dual-concern model. All items original to Tender.
 * instrument_version: 'tender-ip-v2' (expanded from 15→20 items)
 */
const QUESTIONS: GenericQuestion[] = [
  // ── Yielding (Items 1–4) ──
  { id: 1, text: "When my partner and I disagree, I usually give in to keep the peace — even when I have a clear preference of my own.", inputType: 'likert', subscale: 'yielding' },
  { id: 2, text: "I tend to go along with what my partner wants because their happiness feels more important than getting my way.", inputType: 'likert', subscale: 'yielding' },
  { id: 3, text: "When I sense my partner feels strongly about something, I tend to give them what they want rather than push for what I'd prefer.", inputType: 'likert', subscale: 'yielding' },
  { id: 4, text: "I sometimes agree to things I don't actually want, and only realize it later — after the moment has passed and the resentment has settled in.", inputType: 'likert', subscale: 'yielding' },

  // ── Compromising (Items 5–8) ──
  { id: 5, text: "I look for the middle ground — a solution where we both give a little and both get something that matters.", inputType: 'likert', subscale: 'compromising' },
  { id: 6, text: "I'm willing to meet my partner halfway, even if it means neither of us gets exactly what we wanted.", inputType: 'likert', subscale: 'compromising' },
  { id: 7, text: "When we're stuck, I try to find a trade: 'You get this one, I get the next one' — something that feels fair to both of us.", inputType: 'likert', subscale: 'compromising' },
  { id: 8, text: "I'd rather find a workable solution quickly than hold out for the perfect one — good enough is good enough if we're both okay with it.", inputType: 'likert', subscale: 'compromising' },

  // ── Forcing (Items 9–12) ──
  { id: 9, text: "When I know I'm right about something in our relationship, I push for my position until it's heard.", inputType: 'likert', subscale: 'forcing' },
  { id: 10, text: "In a disagreement, I tend to hold my ground firmly — I don't back down easily, and I make my case clearly.", inputType: 'likert', subscale: 'forcing' },
  { id: 11, text: "I sometimes realize I've been arguing to WIN rather than to understand — and by the time I notice, the damage is already done.", inputType: 'likert', subscale: 'forcing' },
  { id: 12, text: "When something matters deeply to me, I'd rather have a difficult argument than let it go unaddressed.", inputType: 'likert', subscale: 'forcing' },

  // ── Problem-Solving (Items 13–16) ──
  { id: 13, text: "When we disagree, I try to understand what my partner actually needs underneath their position — not just what they're asking for on the surface.", inputType: 'likert', subscale: 'problemSolving' },
  { id: 14, text: "I look for solutions where neither of us has to sacrifice what really matters — even if it takes longer to find them.", inputType: 'likert', subscale: 'problemSolving' },
  { id: 15, text: "I bring problems to my partner as things we can figure out together, not as complaints or accusations.", inputType: 'likert', subscale: 'problemSolving' },
  { id: 16, text: "I sometimes jump to solving before I've fully listened to what my partner is feeling — I reach for the fix before I've sat with the problem.", inputType: 'likert', subscale: 'problemSolving' },

  // ── Avoiding (Items 17–20) ──
  { id: 17, text: "I'd rather let a disagreement fade on its own than bring it up and risk making things worse between us.", inputType: 'likert', subscale: 'avoiding' },
  { id: 18, text: "When tension rises between us, my instinct is to change the subject, make a joke, or find a reason to leave the room.", inputType: 'likert', subscale: 'avoiding' },
  { id: 19, text: "There are things between us that I know we need to talk about, but I keep putting it off — waiting for the 'right moment' that never quite arrives.", inputType: 'likert', subscale: 'avoiding' },
  { id: 20, text: "I tell myself that not bringing things up is protecting the relationship — but part of me knows it's protecting me from the discomfort of the conversation.", inputType: 'likert', subscale: 'avoiding' },
];

const SUBSCALE_ITEMS: Record<string, number[]> = {
  yielding: [0, 1, 2, 3],
  compromising: [4, 5, 6, 7],
  forcing: [8, 9, 10, 11],
  problemSolving: [12, 13, 14, 15],
  avoiding: [16, 17, 18, 19],
};

// v2.0: Expanded from 15→20 items (3→4 per subscale). Denominator changed from 3 to 4.
function scoreDUTCH(responses: (number | string | string[] | null)[]): DUTCHScores {
  const nums = responses as number[];
  if (nums.length !== 20) throw new Error('DUTCH requires 20 responses');

  const subscaleScores: Record<string, { sum: number; mean: number }> = {};

  for (const [scale, items] of Object.entries(SUBSCALE_ITEMS)) {
    const sum = items.reduce((s, i) => s + nums[i], 0);
    subscaleScores[scale] = {
      sum,
      mean: Math.round((sum / 4) * 100) / 100,
    };
  }

  const sorted = Object.entries(subscaleScores).sort(
    (a, b) => b[1].mean - a[1].mean
  );

  return {
    subscaleScores,
    primaryStyle: sorted[0][0],
    secondaryStyle: sorted[1][0],
  };
}

export const dutchConfig: AssessmentConfig = {
  type: 'dutch',
  name: 'Conflict Style',
  shortName: 'DUTCH',
  description: 'Discover how you navigate disagreements and conflicts in your relationship.',
  instructions:
    'The following statements describe different ways people handle disagreements in their relationships. For each one, indicate how much it sounds like you. There are no right or wrong answers — every approach has its place.',
  estimatedMinutes: 5,
  totalQuestions: 20,
  questions: QUESTIONS,
  likertScale: LIKERT_SCALE,
  scoringFn: scoreDUTCH,
  progressKey: 'dutch_progress',
};
