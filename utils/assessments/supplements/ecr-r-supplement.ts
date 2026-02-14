/**
 * ECR-R Supplement: "Relational Pattern Awareness" (5 items)
 *
 * Appended after the standard 36 ECR-R items.
 * Scored separately — does not affect original ECR-R scoring.
 */

import type { GenericQuestion, LikertOption } from '@/types';

export const ECR_R_SUPPLEMENT_LIKERT: LikertOption[] = [
  { value: 1, label: 'Strongly Disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Somewhat Disagree' },
  { value: 4, label: 'Neutral' },
  { value: 5, label: 'Somewhat Agree' },
  { value: 6, label: 'Agree' },
  { value: 7, label: 'Strongly Agree' },
];

export const ECR_R_SUPPLEMENT_QUESTIONS: GenericQuestion[] = [
  {
    id: 37,
    text: 'When I feel disconnected from my partner, I notice it in my body before I notice it in my thoughts.',
    inputType: 'likert',
    subscale: 'somatic-awareness',
    likertScale: ECR_R_SUPPLEMENT_LIKERT,
  },
  {
    id: 38,
    text: "I have a fixed story about what my partner 'always' or 'never' does, and it's hard to see past it.",
    inputType: 'likert',
    subscale: 'fixed-story',
    reverseScored: true,
    likertScale: ECR_R_SUPPLEMENT_LIKERT,
  },
  {
    id: 39,
    text: "When we argue, I can sometimes step back and see the pattern we're caught in rather than just my partner's behavior.",
    inputType: 'likert',
    subscale: 'cycle-awareness',
    likertScale: ECR_R_SUPPLEMENT_LIKERT,
  },
  {
    id: 40,
    text: "I find it easier to be certain about my partner's motives than to stay curious about them.",
    inputType: 'likert',
    subscale: 'certainty-vs-curiosity',
    reverseScored: true,
    likertScale: ECR_R_SUPPLEMENT_LIKERT,
  },
  {
    id: 41,
    text: 'I believe that my need for closeness (or space) is information about what the relationship needs, not a personal flaw.',
    inputType: 'likert',
    subscale: 'needs-as-information',
    likertScale: ECR_R_SUPPLEMENT_LIKERT,
  },
];

export interface ECRRSupplementScores {
  somaticAwareness: number;
  fixedStory: number;       // reverse-scored
  cycleAwareness: number;
  certaintyVsCuriosity: number; // reverse-scored
  needsAsInformation: number;
  patternAwarenessMean: number;
}

export function scoreECRRSupplement(
  responses: (number | string | string[] | null)[],
): ECRRSupplementScores {
  const nums = responses.map((r) => (typeof r === 'number' ? r : 4)); // default to neutral

  // Reverse-score items 38 and 40 (indices 1 and 3)
  const adjusted = [...nums];
  adjusted[1] = 8 - adjusted[1]; // fixedStory
  adjusted[3] = 8 - adjusted[3]; // certaintyVsCuriosity

  return {
    somaticAwareness: nums[0],
    fixedStory: adjusted[1],
    cycleAwareness: nums[2],
    certaintyVsCuriosity: adjusted[3],
    needsAsInformation: nums[4],
    patternAwarenessMean: adjusted.reduce((a, b) => a + b, 0) / adjusted.length,
  };
}
