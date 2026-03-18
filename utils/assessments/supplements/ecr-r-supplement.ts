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

/**
 * Tender ECR-R Supplement — 5 items
 * All item wording original to Tender.
 */
export const ECR_R_SUPPLEMENT_QUESTIONS: GenericQuestion[] = [
  {
    id: 37,
    text: "I can sense what my partner is feeling before they tell me — their body language, their silence, the weight of a room we're both in.",
    inputType: 'likert',
    subscale: 'somatic-awareness',
    likertScale: ECR_R_SUPPLEMENT_LIKERT,
  },
  {
    id: 38,
    text: "I sometimes hold onto a version of my partner that no longer matches who they actually are.",
    inputType: 'likert',
    subscale: 'fixed-story',
    reverseScored: true,
    likertScale: ECR_R_SUPPLEMENT_LIKERT,
  },
  {
    id: 39,
    text: "I can see the pattern we fall into during conflict — the predictable steps we both take — even when I can't stop it.",
    inputType: 'likert',
    subscale: 'cycle-awareness',
    likertScale: ECR_R_SUPPLEMENT_LIKERT,
  },
  {
    id: 40,
    text: "When my partner gives me feedback about something I do, my first instinct is to defend rather than listen.",
    inputType: 'likert',
    subscale: 'certainty-vs-curiosity',
    reverseScored: true,
    likertScale: ECR_R_SUPPLEMENT_LIKERT,
  },
  {
    id: 41,
    text: "Over the course of this relationship, I've become more comfortable with closeness than I used to be.",
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
