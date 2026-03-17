/**
 * Values Supplement: "Relational Tension Questions" (5 items)
 *
 * Added after the 28 base Values items (was 32 pre-migration).
 * Mixed types: choice, text, likert.
 * Scored separately — does not affect original Values scoring.
 */

import type { GenericQuestion, LikertOption } from '@/types';

const LIKERT_7: LikertOption[] = [
  { value: 1, label: 'Strongly Disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Somewhat Disagree' },
  { value: 4, label: 'Neutral' },
  { value: 5, label: 'Somewhat Agree' },
  { value: 6, label: 'Agree' },
  { value: 7, label: 'Strongly Agree' },
];

const SLIDER_RIGHT_VS_PRESENT: LikertOption[] = [
  { value: 1, label: 'Being right' },
  { value: 2, label: 'Mostly being right' },
  { value: 3, label: 'Leaning toward being right' },
  { value: 4, label: 'Balanced' },
  { value: 5, label: 'Leaning toward being present' },
  { value: 6, label: 'Mostly being present' },
  { value: 7, label: 'Being present' },
];

export const VALUES_SUPPLEMENT_QUESTIONS: GenericQuestion[] = [
  {
    id: 29,
    text: "When your values and your partner's values diverge, how do you experience it?",
    inputType: 'choice',
    subscale: 'values-divergence',
    choices: [
      { key: 'A', text: 'As a threat to the relationship', coding: 'threat' },
      { key: 'B', text: 'As a problem that needs solving', coding: 'problem-solving' },
      { key: 'C', text: 'As an invitation to grow', coding: 'growth-oriented' },
      { key: 'D', text: "As something I tolerate but don't enjoy", coding: 'tolerance' },
    ],
  },
  {
    id: 30,
    text: "Think of a value you hold that your partner doesn't share. Can you see how that difference might serve the relationship?",
    inputType: 'text',
    subscale: 'difference-as-resource',
    charLimit: 500,
    placeholder: 'Describe how this difference might serve your relationship...',
    suggestedChips: [
      'Balance', 'Perspective', 'Growth', 'Challenge', 'Expansion',
      'Depth', 'Creativity', 'Resilience', 'Patience', 'Openness',
      'Flexibility', 'Strength', 'Compassion', 'Courage', 'Curiosity',
      'Grounding', 'Spark', 'Wisdom', 'Humility', 'Independence',
    ],
  },
  {
    id: 31,
    text: 'Which matters more to you right now: being right about your values, or being present with your partner?',
    inputType: 'likert',
    subscale: 'right-vs-present',
    likertScale: SLIDER_RIGHT_VS_PRESENT,
  },
  {
    id: 32,
    text: 'Name a value you and your partner share that you couldn\u2019t fully live without each other.',
    inputType: 'text',
    subscale: 'shared-value',
    charLimit: 300,
    placeholder: 'Name the shared value...',
    suggestedChips: [
      'Honesty', 'Trust', 'Growth', 'Kindness', 'Adventure',
      'Family', 'Laughter', 'Respect', 'Loyalty', 'Freedom',
      'Compassion', 'Faith', 'Generosity', 'Curiosity', 'Patience',
      'Courage', 'Authenticity', 'Gratitude', 'Connection', 'Joy',
      'Commitment', 'Tenderness', 'Humor', 'Presence', 'Purpose',
    ],
  },
  {
    id: 33,
    text: 'I am willing to let this relationship change what I value.',
    inputType: 'likert',
    subscale: 'willingness-to-change',
    likertScale: LIKERT_7,
  },
];

export interface ValuesSupplementScores {
  valuesDivergenceResponse: string;  // 'threat' | 'problem-solving' | 'growth-oriented' | 'tolerance'
  differenceAsResource: string;       // free text
  rightVsPresent: number;            // 1-7
  sharedValue: string;               // free text
  willingnessToChange: number;       // 1-7
}

export function scoreValuesSupplement(
  responses: (number | string | string[] | null)[],
): ValuesSupplementScores {
  // V1: choice response (key like 'A', 'B', etc.)
  const v1Key = typeof responses[0] === 'string' ? responses[0] : '';
  const codingMap: Record<string, string> = { A: 'threat', B: 'problem-solving', C: 'growth-oriented', D: 'tolerance' };

  return {
    valuesDivergenceResponse: codingMap[v1Key] || v1Key,
    differenceAsResource: typeof responses[1] === 'string' ? responses[1] : '',
    rightVsPresent: typeof responses[2] === 'number' ? responses[2] : 4,
    sharedValue: typeof responses[3] === 'string' ? responses[3] : '',
    willingnessToChange: typeof responses[4] === 'number' ? responses[4] : 4,
  };
}
