/**
 * SSEIT Supplement: "Field Sensitivity" (3 items)
 *
 * Added after the standard 33 SSEIT items.
 * Scored separately — does not affect original SSEIT scoring.
 *
 * IMPORTANT: Uses 5-point Likert scale to match the original SSEIT
 * (Schutte et al., 1998). The original SSEIT uses:
 *   1 = Strongly Disagree → 5 = Strongly Agree
 * Do NOT change this to a 7-point scale.
 */

import type { GenericQuestion, LikertOption } from '@/types';

export const SSEIT_SUPPLEMENT_LIKERT: LikertOption[] = [
  { value: 1, label: 'Strongly Disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neither Agree nor Disagree' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly Agree' },
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
    text: 'I notice when the space between me and my partner shifts — even when neither of us has said anything.',
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
  // Default to 3 (midpoint of 5-point scale) if response is missing
  const nums = responses.map((r) => (typeof r === 'number' ? r : 3));

  return {
    roomSensing: nums[0],
    relationalShiftAwareness: nums[1],
    emotionDifferentiation: nums[2],
    fieldSensitivityMean: nums.reduce((a, b) => a + b, 0) / nums.length,
  };
}
