/**
 * DUTCH Supplement: "Meta-Conflict Awareness" (1 item)
 *
 * Appended after the standard 20 DUTCH items.
 * Scored separately — does NOT feed any conflict subscale.
 * Produces a meta-conflict flag for Nuance AI coach.
 *
 * If high → couple needs process agreements before content resolution.
 */

import type { GenericQuestion, LikertOption } from '@/types';

export const DUTCH_SUPPLEMENT_LIKERT: LikertOption[] = [
  { value: 1, label: 'Not at all like me' },
  { value: 2, label: 'A little like me' },
  { value: 3, label: 'Somewhat like me' },
  { value: 4, label: 'Quite like me' },
  { value: 5, label: 'Very much like me' },
];

export const DUTCH_SUPPLEMENT_QUESTIONS: GenericQuestion[] = [
  {
    id: 21,
    text: "We sometimes end up in conflict about HOW we're having the conflict — arguing about who interrupted, who raised their voice, whether this is 'really' an argument.",
    inputType: 'likert',
    subscale: 'meta-conflict',
    likertScale: DUTCH_SUPPLEMENT_LIKERT,
  },
];

export interface DUTCHSupplementScores {
  metaConflict: number;
  metaConflictFlag: boolean; // true if score >= 4 → needs process agreements
}

export function scoreDUTCHSupplement(
  responses: (number | string | string[] | null)[],
): DUTCHSupplementScores {
  const score = typeof responses[0] === 'number' ? responses[0] : 3;

  return {
    metaConflict: score,
    metaConflictFlag: score >= 4,
  };
}
