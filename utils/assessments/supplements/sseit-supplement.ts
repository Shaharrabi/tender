/**
 * SSEIT Supplement: "Field Sensitivity" (3 items)
 *
 * Added after the standard 33 SSEIT items.
 * Scored separately — does not affect original SSEIT scoring.
 */

import type { GenericQuestion, LikertOption } from '@/types';

export const SSEIT_SUPPLEMENT_LIKERT: LikertOption[] = [
  { value: 1, label: 'Strongly Disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Somewhat Disagree' },
  { value: 4, label: 'Neutral' },
  { value: 5, label: 'Somewhat Agree' },
  { value: 6, label: 'Agree' },
  { value: 7, label: 'Strongly Agree' },
];

export const SSEIT_SUPPLEMENT_QUESTIONS: GenericQuestion[] = [
  {
    id: 34,
    text: 'I can sense the emotional atmosphere in a room without anyone telling me what they are feeling.',
    inputType: 'likert',
    subscale: 'field-sensitivity',
    likertScale: SSEIT_SUPPLEMENT_LIKERT,
  },
  {
    id: 35,
    text: 'I notice when the space between me and my partner shifts \u2014 even when neither of us has said anything.',
    inputType: 'likert',
    subscale: 'field-sensitivity',
    likertScale: SSEIT_SUPPLEMENT_LIKERT,
  },
  {
    id: 36,
    text: 'I can distinguish between my own emotions and the emotions that belong to the space between us.',
    inputType: 'likert',
    subscale: 'field-sensitivity',
    likertScale: SSEIT_SUPPLEMENT_LIKERT,
  },
];

export interface SSEITSupplementScores {
  roomSensing: number;
  relationalShiftAwareness: number;
  emotionDifferentiation: number;
  fieldSensitivityMean: number;
}

export function scoreSSEITSupplement(
  responses: (number | string | string[] | null)[],
): SSEITSupplementScores {
  const nums = responses.map((r) => (typeof r === 'number' ? r : 4));

  return {
    roomSensing: nums[0],
    relationalShiftAwareness: nums[1],
    emotionDifferentiation: nums[2],
    fieldSensitivityMean: nums.reduce((a, b) => a + b, 0) / nums.length,
  };
}
