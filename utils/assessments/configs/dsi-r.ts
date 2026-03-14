import { AssessmentConfig, GenericQuestion, LikertOption, DSIRScores } from '@/types';

const LIKERT_SCALE: LikertOption[] = [
  { value: 1, label: 'Not at all true of me' },
  { value: 2, label: 'Slightly true of me' },
  { value: 3, label: 'Somewhat true of me' },
  { value: 4, label: 'Moderately true of me' },
  { value: 5, label: 'Mostly true of me' },
  { value: 6, label: 'Very true of me' },
];

// 0-based indices of reverse-scored items in the trimmed 20-item version
// idx 4=item5(R:"calm in chaos"), 6=item7(R:"do what I believe"), 7=item8(R:"stating position"),
// 8=item9(R:"say no"), 9=item10(R:"clear sense"), 11=item12(R:"remain calm"),
// 15=item16(R:"calmly listen"), 17=item18(R:"keep focused")
const REVERSE_ITEMS = new Set([4, 6, 7, 8, 9, 11, 15, 17]);

const QUESTIONS: GenericQuestion[] = [
  // ── Emotional Reactivity (Items 1–5) ──
  // Original items: 1, 6, 9, 17, 26(R)
  { id: 1, text: 'People have remarked that I\'m overly emotional.', inputType: 'likert', subscale: 'emotionalReactivity' },
  { id: 2, text: 'At times my feelings get the best of me and I have trouble thinking clearly.', inputType: 'likert', subscale: 'emotionalReactivity' },
  { id: 3, text: 'When my partner criticizes me, it bothers me for days.', inputType: 'likert', subscale: 'emotionalReactivity' },
  { id: 4, text: 'I often feel overwhelmed.', inputType: 'likert', subscale: 'emotionalReactivity' },
  { id: 5, text: 'I\'m fairly calm even when things get chaotic around me.', inputType: 'likert', subscale: 'emotionalReactivity', reverseScored: true },

  // ── I-Position (Items 6–10) ──
  // Original items: 2, 12(R), 18(R), 27(R), 32(R)
  { id: 6, text: 'I have difficulty expressing my feelings to people I care for.', inputType: 'likert', subscale: 'iPosition' },
  { id: 7, text: 'I usually do what I believe is right regardless of what others say.', inputType: 'likert', subscale: 'iPosition', reverseScored: true },
  { id: 8, text: 'I\'m good at knowing what I believe and stating my position clearly.', inputType: 'likert', subscale: 'iPosition', reverseScored: true },
  { id: 9, text: 'I\'m able to say "no" to others even when I feel pressured by them.', inputType: 'likert', subscale: 'iPosition', reverseScored: true },
  { id: 10, text: 'I have a clear sense of who I am and what I believe.', inputType: 'likert', subscale: 'iPosition', reverseScored: true },

  // ── Emotional Cutoff (Items 11–15) ──
  // Original items: 3, 5(R), 19, 33, 46
  { id: 11, text: 'I often feel like I\'m being controlled by others.', inputType: 'likert', subscale: 'emotionalCutoff' },
  { id: 12, text: 'I tend to remain pretty calm even when everyone around me is upset.', inputType: 'likert', subscale: 'emotionalCutoff', reverseScored: true },
  { id: 13, text: 'I\'m very uncomfortable when people express negative feelings toward me.', inputType: 'likert', subscale: 'emotionalCutoff' },
  { id: 14, text: 'When one of my relationships becomes very intense, I feel the urge to run away from it.', inputType: 'likert', subscale: 'emotionalCutoff' },
  { id: 15, text: 'I\'m uncomfortable being around people I don\'t know.', inputType: 'likert', subscale: 'emotionalCutoff' },

  // ── Fusion with Others (Items 16–20) ──
  // Original items: 4(R), 10, 15(R), 24, 29
  { id: 16, text: 'I\'m able to calmly listen to my partner, even when I disagree.', inputType: 'likert', subscale: 'fusionWithOthers', reverseScored: true },
  { id: 17, text: 'I often agree with others just to appease them.', inputType: 'likert', subscale: 'fusionWithOthers' },
  { id: 18, text: 'When I\'m having an argument, I can keep focused on the issues and not let things get personal.', inputType: 'likert', subscale: 'fusionWithOthers', reverseScored: true },
  { id: 19, text: 'It\'s hard for me to make decisions for myself when I know others might disapprove.', inputType: 'likert', subscale: 'fusionWithOthers' },
  { id: 20, text: 'When I am with others, I lose my sense of who I am.', inputType: 'likert', subscale: 'fusionWithOthers' },
];

const SUBSCALE_ITEMS: Record<string, number[]> = {
  emotionalReactivity: [0, 1, 2, 3, 4],  // 5 items
  iPosition: [5, 6, 7, 8, 9],             // 5 items
  emotionalCutoff: [10, 11, 12, 13, 14],   // 5 items
  fusionWithOthers: [15, 16, 17, 18, 19],  // 5 items
};

function scoreDSIR(responses: (number | string | string[] | null)[]): DSIRScores {
  const nums = responses as number[];
  if (nums.length !== 20) throw new Error('DSI-R requires 20 responses');

  // Step 1: Reverse score items (7 - score)
  const scored = nums.map((r, i) => (REVERSE_ITEMS.has(i) ? 7 - r : r));

  // Step 2: Calculate raw subscale means
  const subscaleScores: Record<string, { sum: number; rawMean: number; reversedMean: number; normalized: number; itemCount: number }> = {};

  for (const [scale, items] of Object.entries(SUBSCALE_ITEMS)) {
    const sum = items.reduce((s, i) => s + scored[i], 0);
    const itemCount = items.length;
    const rawMean = sum / itemCount;
    // Step 3: Double-reversal so high = differentiated
    const reversedMean = 7 - rawMean;
    // Step 4: Normalize to 0-100
    const normalized = Math.round(((reversedMean - 1) / 5) * 100);

    subscaleScores[scale] = {
      sum,
      rawMean: Math.round(rawMean * 100) / 100,
      reversedMean: Math.round(reversedMean * 100) / 100,
      normalized,
      itemCount,
    };
  }

  // Step 5: Total differentiation
  const totalReversedMean =
    Object.values(subscaleScores).reduce((s, v) => s + v.reversedMean, 0) / 4;
  const totalNormalized = Math.round(((totalReversedMean - 1) / 5) * 100);

  return {
    totalMean: Math.round(totalReversedMean * 100) / 100,
    totalNormalized,
    subscaleScores,
  };
}

export const dsirConfig: AssessmentConfig = {
  type: 'dsi-r',
  name: 'Differentiation of Self',
  shortName: 'DSI-R',
  description: 'Explore how well you maintain your sense of self while staying emotionally connected in relationships.',
  instructions:
    'These are questions about your thoughts and feelings about yourself and your relationships. Please read each statement carefully and decide how much it is generally true of you.',
  estimatedMinutes: 6,
  totalQuestions: 20,
  questions: QUESTIONS,
  likertScale: LIKERT_SCALE,
  scoringFn: scoreDSIR,
  progressKey: 'dsir_progress',
};
