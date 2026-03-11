import { AssessmentConfig, GenericQuestion, LikertOption, SSEITScores } from '@/types';

const LIKERT_SCALE: LikertOption[] = [
  { value: 1, label: 'Strongly Disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neither Agree nor Disagree' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly Agree' },
];

const REVERSE_ITEMS = new Set([4, 27, 32]); // 0-based indices (items 5, 28, 33)

const QUESTIONS: GenericQuestion[] = [
  { id: 1, text: 'I know when to speak about my personal problems to others.', inputType: 'likert', subscale: 'perception' },
  { id: 2, text: 'When I am faced with obstacles, I remember times I faced similar obstacles and overcame them.', inputType: 'likert', subscale: 'utilization' },
  { id: 3, text: 'I expect that I will do well on most things I try.', inputType: 'likert', subscale: 'utilization' },
  { id: 4, text: 'Other people find it easy to confide in me.', inputType: 'likert', subscale: 'managingOthers' },
  { id: 5, text: 'I find it hard to understand the non-verbal messages of other people.', inputType: 'likert', subscale: 'perception', reverseScored: true },
  { id: 6, text: 'Some of the major events of my life have led me to re-evaluate what is important and not important.', inputType: 'likert', subscale: 'perception' },
  { id: 7, text: 'When my mood changes, I see new possibilities.', inputType: 'likert', subscale: 'utilization' },
  { id: 8, text: 'Emotions are one of the things that make my life worth living.', inputType: 'likert', subscale: 'perception' },
  { id: 9, text: 'I am aware of my emotions as I experience them.', inputType: 'likert', subscale: 'perception' },
  { id: 10, text: 'I expect good things to happen.', inputType: 'likert', subscale: 'utilization' },
  { id: 11, text: 'I like to share my emotions with others.', inputType: 'likert', subscale: 'managingOwn' },
  { id: 12, text: 'When I experience a positive emotion, I know how to make it last.', inputType: 'likert', subscale: 'managingOwn' },
  { id: 13, text: 'I arrange events others enjoy.', inputType: 'likert', subscale: 'managingOthers' },
  { id: 14, text: 'I seek out activities that make me happy.', inputType: 'likert', subscale: 'managingOwn' },
  { id: 15, text: 'I am aware of the non-verbal messages I send to others.', inputType: 'likert', subscale: 'perception' },
  { id: 16, text: 'I present myself in a way that makes a good impression on others.', inputType: 'likert', subscale: 'managingOthers' },
  { id: 17, text: 'When I am in a positive mood, solving problems is easy for me.', inputType: 'likert', subscale: 'utilization' },
  { id: 18, text: 'By looking at their facial expressions, I recognize the emotions people are experiencing.', inputType: 'likert', subscale: 'perception' },
  { id: 19, text: 'I know why my emotions change.', inputType: 'likert', subscale: 'perception' },
  { id: 20, text: 'When I am in a positive mood, I am able to come up with new ideas.', inputType: 'likert', subscale: 'utilization' },
  { id: 21, text: 'I have control over my emotions.', inputType: 'likert', subscale: 'managingOwn' },
  { id: 22, text: 'I easily recognize my emotions as I experience them.', inputType: 'likert', subscale: 'perception' },
  { id: 23, text: 'I motivate myself by imagining a good outcome to tasks I take on.', inputType: 'likert', subscale: 'utilization' },
  { id: 24, text: 'I compliment others when they have done something well.', inputType: 'likert', subscale: 'managingOthers' },
  { id: 25, text: 'I am aware of the non-verbal messages other people send.', inputType: 'likert', subscale: 'perception' },
  { id: 26, text: 'When another person tells me about an important event in his or her life, I almost feel as though I experienced this event myself.', inputType: 'likert', subscale: 'perception' },
  { id: 27, text: 'When I feel a change in emotions, I tend to come up with new ideas.', inputType: 'likert', subscale: 'utilization' },
  { id: 28, text: 'When I am faced with a challenge, I give up because I believe I will fail.', inputType: 'likert', subscale: 'utilization', reverseScored: true },
  { id: 29, text: 'I know what other people are feeling just by looking at them.', inputType: 'likert', subscale: 'perception' },
  { id: 30, text: 'I help other people feel better when they are down.', inputType: 'likert', subscale: 'managingOthers' },
  { id: 31, text: 'I use good moods to help myself keep trying in the face of obstacles.', inputType: 'likert', subscale: 'utilization' },
  { id: 32, text: 'I can tell how people are feeling by listening to the tone of their voice.', inputType: 'likert', subscale: 'perception' },
  { id: 33, text: 'It is difficult for me to understand why people feel the way they do.', inputType: 'likert', subscale: 'perception', reverseScored: true },
];

const SUBSCALE_ITEMS: Record<string, number[]> = {
  perception: [0, 4, 5, 7, 8, 14, 17, 18, 21, 24, 25, 28, 31, 32],     // 14 items
  managingOwn: [10, 11, 13, 20],                                          // 4 items
  managingOthers: [3, 12, 15, 23, 29],                                    // 5 items
  utilization: [1, 2, 6, 9, 16, 19, 22, 26, 27, 30],                     // 10 items
};

function scoreSSEIT(responses: (number | string | string[] | null)[]): SSEITScores {
  const nums = responses as number[];
  if (nums.length !== 33) throw new Error('SSEIT requires 33 responses');

  // Apply reverse scoring
  const scored = nums.map((r, i) => (REVERSE_ITEMS.has(i) ? 6 - r : r));

  // Calculate subscale scores
  const subscaleScores: Record<string, { sum: number; mean: number; itemCount: number }> = {};
  const subscaleNormalized: Record<string, number> = {};

  for (const [scale, items] of Object.entries(SUBSCALE_ITEMS)) {
    const sum = items.reduce((s, i) => s + scored[i], 0);
    const itemCount = items.length;
    subscaleScores[scale] = {
      sum,
      mean: Math.round((sum / itemCount) * 100) / 100,
      itemCount,
    };
    subscaleNormalized[scale] = Math.round((sum / (5 * itemCount)) * 100);
  }

  const totalSum = scored.reduce((s, r) => s + r, 0);

  return {
    totalScore: totalSum,
    totalMean: Math.round((totalSum / 33) * 100) / 100,
    totalNormalized: Math.round((totalSum / (5 * 33)) * 100),
    subscaleScores,
    subscaleNormalized,
  };
}

export const sseitConfig: AssessmentConfig = {
  type: 'sseit',
  name: 'Emotional Intelligence',
  shortName: 'SSEIT',
  description: 'Measure your ability to perceive, manage, and use emotions effectively.',
  instructions:
    'For each statement, indicate the degree to which you agree or disagree. There are no right or wrong answers. Please give the response that best describes you.',
  estimatedMinutes: 8,
  totalQuestions: 33,
  questions: QUESTIONS,
  likertScale: LIKERT_SCALE,
  scoringFn: scoreSSEIT,
  progressKey: 'sseit_progress',
};
