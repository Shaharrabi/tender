import { AssessmentConfig, GenericQuestion, LikertOption, DUTCHScores } from '@/types';

const LIKERT_SCALE: LikertOption[] = [
  { value: 1, label: 'Not at all like me' },
  { value: 2, label: 'A little like me' },
  { value: 3, label: 'Somewhat like me' },
  { value: 4, label: 'Quite like me' },
  { value: 5, label: 'Very much like me' },
];

const QUESTIONS: GenericQuestion[] = [
  // ── Yielding (Items 1–3) ──
  { id: 1, text: 'When my partner and I disagree, I usually let go of what I want so things can be calm between us.', inputType: 'likert', subscale: 'yielding' },
  { id: 2, text: 'I tend to go along with my partner\'s preferences even when I have a different opinion.', inputType: 'likert', subscale: 'yielding' },
  { id: 3, text: 'Keeping the peace matters more to me than getting my way.', inputType: 'likert', subscale: 'yielding' },

  // ── Compromising (Items 4–6) ──
  { id: 4, text: 'When we disagree, I look for something we can both live with — even if neither of us gets exactly what we want.', inputType: 'likert', subscale: 'compromising' },
  { id: 5, text: 'I\'m willing to give up some of what I want if my partner does the same.', inputType: 'likert', subscale: 'compromising' },
  { id: 6, text: 'I\'d rather we each bend a little than keep fighting for the perfect outcome.', inputType: 'likert', subscale: 'compromising' },

  // ── Forcing (Items 7–9) ──
  { id: 7, text: 'When I feel strongly about something, I press my point until my partner understands where I stand.', inputType: 'likert', subscale: 'forcing' },
  { id: 8, text: 'In a disagreement, I tend to hold my position firmly — I don\'t give ground easily.', inputType: 'likert', subscale: 'forcing' },
  { id: 9, text: 'If something really matters to me, I\'d rather have a hard conversation than let it slide.', inputType: 'likert', subscale: 'forcing' },

  // ── Problem-Solving (Items 10–12) ──
  { id: 10, text: 'When we disagree, I try to understand what my partner actually needs underneath what they\'re asking for.', inputType: 'likert', subscale: 'problemSolving' },
  { id: 11, text: 'I believe most disagreements have a solution that works for both of us — it just takes more conversation to find it.', inputType: 'likert', subscale: 'problemSolving' },
  { id: 12, text: 'During a conflict, I\'d rather slow down and figure out what\'s really going on than settle for a quick fix.', inputType: 'likert', subscale: 'problemSolving' },

  // ── Avoiding (Items 13–15) ──
  { id: 13, text: 'When a tense topic comes up, I tend to steer the conversation somewhere easier.', inputType: 'likert', subscale: 'avoiding' },
  { id: 14, text: 'I usually wait for disagreements to blow over on their own rather than addressing them directly.', inputType: 'likert', subscale: 'avoiding' },
  { id: 15, text: 'If things get heated between us, my instinct is to create some space rather than keep talking.', inputType: 'likert', subscale: 'avoiding' },
];

const SUBSCALE_ITEMS: Record<string, number[]> = {
  yielding: [0, 1, 2],
  compromising: [3, 4, 5],
  forcing: [6, 7, 8],
  problemSolving: [9, 10, 11],
  avoiding: [12, 13, 14],
};

function scoreDUTCH(responses: (number | string | string[] | null)[]): DUTCHScores {
  const nums = responses as number[];
  if (nums.length !== 15) throw new Error('DUTCH requires 15 responses');

  const subscaleScores: Record<string, { sum: number; mean: number }> = {};

  for (const [scale, items] of Object.entries(SUBSCALE_ITEMS)) {
    const sum = items.reduce((s, i) => s + nums[i], 0);
    subscaleScores[scale] = {
      sum,
      mean: Math.round((sum / 3) * 100) / 100,
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
  estimatedMinutes: 4,
  totalQuestions: 15,
  questions: QUESTIONS,
  likertScale: LIKERT_SCALE,
  scoringFn: scoreDUTCH,
  progressKey: 'dutch_progress',
};
