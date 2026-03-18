/**
 * DSI-R Supplement: "Boundary Awareness" (4 items)
 *
 * Added after the 20 base DSI-R items (was 46 pre-migration).
 * Scored separately — does not affect original DSI-R scoring.
 *
 * IMPORTANT: Uses 6-point Likert scale to match the original DSI-R
 * (Skowron & Schmitt, 2003). The original DSI-R deliberately uses
 * 6 points with NO neutral midpoint — this is a theoretical choice
 * aligned with Bowen's model of differentiation. The labels are
 * self-descriptive ("true of me") rather than opinion-based
 * ("agree/disagree"). Do NOT change this to a 7-point scale or
 * add a neutral option.
 */

import type { GenericQuestion, LikertOption } from '@/types';

export const DSI_R_SUPPLEMENT_LIKERT: LikertOption[] = [
  { value: 1, label: 'Not at all true of me' },
  { value: 2, label: 'Slightly true of me' },
  { value: 3, label: 'Somewhat true of me' },
  { value: 4, label: 'Moderately true of me' },
  { value: 5, label: 'Mostly true of me' },
  { value: 6, label: 'Very true of me' },
];

/**
 * Tender DSI-R Supplement — 4 items
 * All item wording original to Tender.
 */
export const DSI_R_SUPPLEMENT_QUESTIONS: GenericQuestion[] = [
  {
    id: 21,
    text: "I can be deeply connected to my partner AND hold my own center at the same time — closeness doesn't require me to disappear.",
    inputType: 'likert',
    subscale: 'boundary-awareness',
    likertScale: DSI_R_SUPPLEMENT_LIKERT,
  },
  {
    id: 22,
    text: "When I look at how I handle emotions in this relationship compared to five years ago, I can see meaningful change.",
    inputType: 'likert',
    subscale: 'boundary-awareness',
    likertScale: DSI_R_SUPPLEMENT_LIKERT,
  },
  {
    id: 23,
    text: "I can tolerate the discomfort of not resolving something immediately — sitting with tension between us without needing to fix it, flee from it, or pretend it isn't there.",
    inputType: 'likert',
    subscale: 'boundary-awareness',
    likertScale: DSI_R_SUPPLEMENT_LIKERT,
  },
  {
    id: 24,
    text: "There are people in my family of origin whose emotional patterns I can see clearly in myself — and I'm actively working to update those patterns in how I show up in this relationship.",
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
  // Default to 3 (approximate midpoint of 6-point scale) if response is missing
  const nums = responses.map((r) => (typeof r === 'number' ? r : 3));

  return {
    closenessWithIdentity: nums[0],
    disagreementWithConnection: nums[1],
    emotionalBoundaryClarity: nums[2],
    boundaryWithoutGuilt: nums[3],
    boundaryAwarenessMean: nums.reduce((a, b) => a + b, 0) / nums.length,
  };
}
