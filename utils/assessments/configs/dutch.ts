import { AssessmentConfig, GenericQuestion, LikertOption, DUTCHScores } from '@/types';

const LIKERT_SCALE: LikertOption[] = [
  { value: 1, label: 'Never' },
  { value: 2, label: 'Rarely' },
  { value: 3, label: 'Sometimes' },
  { value: 4, label: 'Often' },
  { value: 5, label: 'Always' },
];

const STEM = 'When I have a conflict or disagreement with my partner, I typically...';

const QUESTIONS: GenericQuestion[] = [
  { id: 1, text: 'Give in to the wishes of my partner.', inputType: 'likert', subscale: 'yielding' },
  { id: 2, text: 'Try to realize a middle-of-the-road solution.', inputType: 'likert', subscale: 'compromising' },
  { id: 3, text: 'Push my own point of view.', inputType: 'likert', subscale: 'forcing' },
  { id: 4, text: 'Examine issues until I find a solution that really satisfies me and my partner.', inputType: 'likert', subscale: 'problemSolving' },
  { id: 5, text: 'Avoid a confrontation about our differences.', inputType: 'likert', subscale: 'avoiding' },
  { id: 6, text: 'Concur with my partner.', inputType: 'likert', subscale: 'yielding' },
  { id: 7, text: 'Emphasize that we have to find a compromise solution.', inputType: 'likert', subscale: 'compromising' },
  { id: 8, text: 'Search for gains.', inputType: 'likert', subscale: 'forcing' },
  { id: 9, text: 'Stand for my own and the other\'s goals and interests.', inputType: 'likert', subscale: 'problemSolving' },
  { id: 10, text: 'Avoid differences of opinion as much as possible.', inputType: 'likert', subscale: 'avoiding' },
  { id: 11, text: 'Try to accommodate my partner.', inputType: 'likert', subscale: 'yielding' },
  { id: 12, text: 'Insist we both give in a little.', inputType: 'likert', subscale: 'compromising' },
  { id: 13, text: 'Fight for a good outcome for myself.', inputType: 'likert', subscale: 'forcing' },
  { id: 14, text: 'Examine ideas from both sides to find a mutually optimal solution.', inputType: 'likert', subscale: 'problemSolving' },
  { id: 15, text: 'Try to make differences seem less severe.', inputType: 'likert', subscale: 'avoiding' },
  { id: 16, text: 'Adapt to my partner\'s goals and interests.', inputType: 'likert', subscale: 'yielding' },
  { id: 17, text: 'Strive whenever possible towards a fifty-fifty compromise.', inputType: 'likert', subscale: 'compromising' },
  { id: 18, text: 'Do everything to win.', inputType: 'likert', subscale: 'forcing' },
  { id: 19, text: 'Work out a solution that serves my own as well as my partner\'s interests as well as possible.', inputType: 'likert', subscale: 'problemSolving' },
  { id: 20, text: 'Try to avoid a confrontation with my partner.', inputType: 'likert', subscale: 'avoiding' },
];

const SUBSCALE_ITEMS: Record<string, number[]> = {
  yielding: [0, 5, 10, 15],
  compromising: [1, 6, 11, 16],
  forcing: [2, 7, 12, 17],
  problemSolving: [3, 8, 13, 18],
  avoiding: [4, 9, 14, 19],
};

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
  description: 'Discover how you handle disagreements and conflicts in your relationship.',
  instructions: `${STEM}\n\nThe following statements describe different ways people handle disagreements and conflicts. Please respond thinking specifically about conflicts or disagreements with your romantic partner — not conflicts at work or with friends/family.`,
  estimatedMinutes: 6,
  totalQuestions: 20,
  questions: QUESTIONS,
  likertScale: LIKERT_SCALE,
  scoringFn: scoreDUTCH,
  progressKey: 'dutch_progress',
};
