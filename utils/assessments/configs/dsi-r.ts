import { AssessmentConfig, GenericQuestion, LikertOption, DSIRScores } from '@/types';

const LIKERT_SCALE: LikertOption[] = [
  { value: 1, label: 'Not at all true of me' },
  { value: 2, label: 'Slightly true of me' },
  { value: 3, label: 'Somewhat true of me' },
  { value: 4, label: 'Moderately true of me' },
  { value: 5, label: 'Mostly true of me' },
  { value: 6, label: 'Very true of me' },
];

// 0-based indices of reverse-scored items (items 4, 5, 12, 15, 18, 26, 27, 32, 40, 42, 43, 45)
const REVERSE_ITEMS = new Set([3, 4, 11, 14, 17, 25, 26, 31, 39, 41, 42, 44]);

const QUESTIONS: GenericQuestion[] = [
  { id: 1, text: 'People have remarked that I\'m overly emotional.', inputType: 'likert', subscale: 'emotionalReactivity' },
  { id: 2, text: 'I have difficulty expressing my feelings to people I care for.', inputType: 'likert', subscale: 'iPosition' },
  { id: 3, text: 'I often feel like I\'m being controlled by others.', inputType: 'likert', subscale: 'emotionalCutoff' },
  { id: 4, text: 'I\'m able to calmly listen to my partner, even when I disagree.', inputType: 'likert', subscale: 'fusionWithOthers', reverseScored: true },
  { id: 5, text: 'I tend to remain pretty calm even when everyone around me is upset.', inputType: 'likert', subscale: 'emotionalCutoff', reverseScored: true },
  { id: 6, text: 'At times my feelings get the best of me and I have trouble thinking clearly.', inputType: 'likert', subscale: 'emotionalReactivity' },
  { id: 7, text: 'When I\'m with my partner, I often feel smothered.', inputType: 'likert', subscale: 'iPosition' },
  { id: 8, text: 'It\'s important for me to keep in touch with my parents regularly.', inputType: 'likert', subscale: 'emotionalCutoff' },
  { id: 9, text: 'When my partner criticizes me, it bothers me for days.', inputType: 'likert', subscale: 'emotionalReactivity' },
  { id: 10, text: 'I often agree with others just to appease them.', inputType: 'likert', subscale: 'fusionWithOthers' },
  { id: 11, text: 'I\'m likely to be drawn into other people\'s problems.', inputType: 'likert', subscale: 'emotionalCutoff' },
  { id: 12, text: 'I usually do what I believe is right regardless of what others say.', inputType: 'likert', subscale: 'iPosition', reverseScored: true },
  { id: 13, text: 'I want to live up to my parents\' expectations.', inputType: 'likert', subscale: 'emotionalCutoff' },
  { id: 14, text: 'I\'m very sensitive to being hurt by others.', inputType: 'likert', subscale: 'emotionalReactivity' },
  { id: 15, text: 'When I\'m having an argument, I can keep focused on the issues and not let things get personal.', inputType: 'likert', subscale: 'fusionWithOthers', reverseScored: true },
  { id: 16, text: 'At times, I feel as if I\'m riding an emotional roller-coaster.', inputType: 'likert', subscale: 'fusionWithOthers' },
  { id: 17, text: 'I often feel overwhelmed.', inputType: 'likert', subscale: 'emotionalReactivity' },
  { id: 18, text: 'I\'m good at knowing what I believe and stating my position clearly.', inputType: 'likert', subscale: 'iPosition', reverseScored: true },
  { id: 19, text: 'I\'m very uncomfortable when people express negative feelings toward me.', inputType: 'likert', subscale: 'emotionalCutoff' },
  { id: 20, text: 'Our relationship would be better if my partner would give me the space I need.', inputType: 'likert', subscale: 'fusionWithOthers' },
  { id: 21, text: 'I tend to react emotionally when things don\'t go as I\'ve planned.', inputType: 'likert', subscale: 'emotionalReactivity' },
  { id: 22, text: 'I tend to distance myself when people get too close to me.', inputType: 'likert', subscale: 'iPosition' },
  { id: 23, text: 'I wish I weren\'t so emotional.', inputType: 'likert', subscale: 'emotionalCutoff' },
  { id: 24, text: 'It\'s hard for me to make decisions for myself when I know others might disapprove.', inputType: 'likert', subscale: 'fusionWithOthers' },
  { id: 25, text: 'I often end up taking care of others\' needs at the expense of my own.', inputType: 'likert', subscale: 'fusionWithOthers' },
  { id: 26, text: 'I\'m fairly calm even when things get chaotic around me.', inputType: 'likert', subscale: 'emotionalReactivity', reverseScored: true },
  { id: 27, text: 'I\'m able to say "no" to others even when I feel pressured by them.', inputType: 'likert', subscale: 'iPosition', reverseScored: true },
  { id: 28, text: 'Our relationship has suffered because of my partner\'s unreasonable demands.', inputType: 'likert', subscale: 'emotionalCutoff' },
  { id: 29, text: 'When I am with others, I lose my sense of who I am.', inputType: 'likert', subscale: 'fusionWithOthers' },
  { id: 30, text: 'I often find myself making decisions based on what will make others happy.', inputType: 'likert', subscale: 'emotionalReactivity' },
  { id: 31, text: 'I often feel that my partner wants too much from me.', inputType: 'likert', subscale: 'fusionWithOthers' },
  { id: 32, text: 'I have a clear sense of who I am and what I believe.', inputType: 'likert', subscale: 'iPosition', reverseScored: true },
  { id: 33, text: 'When one of my relationships becomes very intense, I feel the urge to run away from it.', inputType: 'likert', subscale: 'emotionalCutoff' },
  { id: 34, text: 'Relationships with others are usually more trouble than they\'re worth.', inputType: 'likert', subscale: 'fusionWithOthers' },
  { id: 35, text: 'When things go wrong, talking about them usually makes it worse.', inputType: 'likert', subscale: 'emotionalReactivity' },
  { id: 36, text: 'Sometimes I feel sick after arguing with my partner.', inputType: 'likert', subscale: 'iPosition' },
  { id: 37, text: 'My self-esteem really depends on how others think of me.', inputType: 'likert', subscale: 'emotionalCutoff' },
  { id: 38, text: 'I frequently feel threatened in close relationships.', inputType: 'likert', subscale: 'fusionWithOthers' },
  { id: 39, text: 'I feel things more intensely than others do.', inputType: 'likert', subscale: 'emotionalReactivity' },
  { id: 40, text: 'I tend to feel pretty stable under stress.', inputType: 'likert', subscale: 'iPosition', reverseScored: true },
  { id: 41, text: 'I often wonder about the kind of impression I create.', inputType: 'likert', subscale: 'emotionalCutoff' },
  { id: 42, text: 'There\'s no point in getting upset about things I cannot change.', inputType: 'likert', subscale: 'fusionWithOthers', reverseScored: true },
  { id: 43, text: 'I feel comfortable when people get close to me.', inputType: 'likert', subscale: 'iPosition', reverseScored: true },
  { id: 44, text: 'I\'m likely to smooth over or settle conflicts between two people I care about.', inputType: 'likert', subscale: 'emotionalReactivity' },
  { id: 45, text: 'I usually don\'t change my behavior simply to please another person.', inputType: 'likert', subscale: 'iPosition', reverseScored: true },
  { id: 46, text: 'I\'m uncomfortable being around people I don\'t know.', inputType: 'likert', subscale: 'emotionalCutoff' },
];

const SUBSCALE_ITEMS: Record<string, number[]> = {
  emotionalReactivity: [0, 5, 8, 13, 16, 20, 25, 29, 34, 38, 43],  // 11 items
  iPosition: [1, 6, 11, 17, 21, 26, 31, 35, 39, 42, 44],            // 11 items
  emotionalCutoff: [2, 4, 7, 10, 12, 18, 22, 27, 32, 36, 40, 45],   // 12 items
  fusionWithOthers: [3, 9, 14, 15, 19, 23, 24, 28, 30, 33, 37, 41], // 12 items
};

function scoreDSIR(responses: (number | string | string[] | null)[]): DSIRScores {
  const nums = responses as number[];
  if (nums.length !== 46) throw new Error('DSI-R requires 46 responses');

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
  name: 'Differentiation of Self (DSI-R)',
  shortName: 'DSI-R',
  description: 'Explore how well you maintain your sense of self while staying emotionally connected in relationships.',
  instructions:
    'These are questions concerning your thoughts and feelings about yourself and relationships with others. Please read each statement carefully and decide how much the statement is generally true of you on a 1 (not at all) to 6 (very) scale.',
  estimatedMinutes: 12,
  totalQuestions: 46,
  questions: QUESTIONS,
  likertScale: LIKERT_SCALE,
  scoringFn: scoreDSIR,
  progressKey: 'dsir_progress',
};
