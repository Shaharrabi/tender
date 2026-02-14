/**
 * DSI-R Supplement: "Boundary Awareness" (4 items)
 *
 * Added after the standard 46 DSI-R items.
 * Scored separately — does not affect original DSI-R scoring.
 */

import type { GenericQuestion, LikertOption } from '@/types';

export const DSI_R_SUPPLEMENT_LIKERT: LikertOption[] = [
  { value: 1, label: 'Strongly Disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Somewhat Disagree' },
  { value: 4, label: 'Neutral' },
  { value: 5, label: 'Somewhat Agree' },
  { value: 6, label: 'Agree' },
  { value: 7, label: 'Strongly Agree' },
];

export const DSI_R_SUPPLEMENT_QUESTIONS: GenericQuestion[] = [
  {
    id: 47,
    text: 'I can be close to my partner without losing my sense of who I am.',
    inputType: 'likert',
    subscale: 'boundary-awareness',
    likertScale: DSI_R_SUPPLEMENT_LIKERT,
  },
  {
    id: 48,
    text: 'I can disagree with my partner and still feel connected to them.',
    inputType: 'likert',
    subscale: 'boundary-awareness',
    likertScale: DSI_R_SUPPLEMENT_LIKERT,
  },
  {
    id: 49,
    text: 'I know where I end and my partner begins \u2014 emotionally, not just physically.',
    inputType: 'likert',
    subscale: 'boundary-awareness',
    likertScale: DSI_R_SUPPLEMENT_LIKERT,
  },
  {
    id: 50,
    text: 'I can hold a boundary with my partner without feeling guilty or cruel.',
    inputType: 'likert',
    subscale: 'boundary-awareness',
    likertScale: DSI_R_SUPPLEMENT_LIKERT,
  },
];

export interface DSIRSupplementScores {
  closenessWithIdentity: number;
  disagreementWithConnection: number;
  emotionalBoundaryClarity: number;
  boundaryWithoutGuilt: number;
  boundaryAwarenessMean: number;
}

export function scoreDSIRSupplement(
  responses: (number | string | string[] | null)[],
): DSIRSupplementScores {
  const nums = responses.map((r) => (typeof r === 'number' ? r : 4));

  return {
    closenessWithIdentity: nums[0],
    disagreementWithConnection: nums[1],
    emotionalBoundaryClarity: nums[2],
    boundaryWithoutGuilt: nums[3],
    boundaryAwarenessMean: nums.reduce((a, b) => a + b, 0) / nums.length,
  };
}
