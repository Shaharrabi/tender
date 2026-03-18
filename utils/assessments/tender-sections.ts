/**
 * The Tender Assessment — section map.
 *
 * Defines the 7-section unified assessment sequence with field-language names,
 * break points, and supplement assignments.
 *
 * Section 7 "The Space Between" uses the Relational Field Awareness Scale (RFAS).
 *
 * Post-migration item counts:
 *   ECR-R: 36 (unchanged) | IPIP: 60 (was 120) | SSEIT: 16 (was 33)
 *   DSI-R: 20 (was 46) | DUTCH: 20 (expanded from 15) | VALUES: 28 (was 32)
 *   RFAS: 20 (unchanged) | Supplements: 18 (added DUTCH MC1)
 */

import type { TenderSection } from '@/types';

export const TENDER_SECTIONS: TenderSection[] = [
  {
    sectionNumber: 1,
    fieldName: 'How You Seek Closeness',
    fieldDescription: 'Understanding your attachment patterns and how you reach for closeness or create distance.',
    assessmentType: 'ecr-r',
    supplementGroup: 'ecr-r-supplement',
    estimatedMinutes: 6,
    breakAfter: true,
    breakMessage: 'Nice work. You are building a clearer picture of how you move in relationships.',
  },
  {
    sectionNumber: 2,
    fieldName: 'Who You Are in Love',
    fieldDescription: 'Your personality and how it shapes the way you show up in your relationship.',
    assessmentType: 'tender-personality-60',
    estimatedMinutes: 12,
    breakAfter: true,
    breakMessage: 'Great work. Take a stretch. You are building something important.',
  },
  {
    sectionNumber: 3,
    fieldName: 'How You Read the Room',
    fieldDescription: 'Your emotional world — how you sense, name, and navigate what you feel.',
    assessmentType: 'sseit',
    supplementGroup: 'sseit-supplement',
    estimatedMinutes: 3,
    breakAfter: true,
    breakMessage: 'Well done. You are learning to see the emotional currents beneath the surface.',
  },
  {
    sectionNumber: 4,
    fieldName: 'How You Hold Your Ground',
    fieldDescription: 'Your boundaries, autonomy, and ability to stay yourself while staying close.',
    assessmentType: 'dsi-r',
    supplementGroup: 'dsi-r-supplement',
    estimatedMinutes: 3,
    breakAfter: true,
    breakMessage: 'You are more than halfway through. The depth you are bringing matters.',
  },
  {
    sectionNumber: 5,
    fieldName: 'How You Navigate Conflict',
    fieldDescription: 'Your approach to conflict and disagreement — what you do when things get hard.',
    assessmentType: 'dutch',
    supplementGroup: 'dutch-supplement',
    estimatedMinutes: 4,
    breakAfter: true,
    breakMessage: 'Conflict takes courage to face. You are doing the work.',
  },
  {
    sectionNumber: 6,
    fieldName: 'What Matters Most',
    fieldDescription: 'Your values and what you want to move toward together.',
    assessmentType: 'values',
    supplementGroup: 'values-supplement',
    estimatedMinutes: 4,
    breakAfter: true,
    breakMessage: 'Almost there. One more section — the most relational one of all.',
  },
  {
    sectionNumber: 7,
    fieldName: 'The Space Between',
    fieldDescription: 'How you sense, hold, and co-create the relational field — the living space between you and your partner.',
    assessmentType: 'relational-field',
    estimatedMinutes: 4,
    breakAfter: false, // Last section — ends with completion screen
    optional: true,   // Relational/couple section — enhances experience, not required for portrait
  },
];

/** Required sections only (excludes optional sections like RFAS). Used for completion tracking. */
export const REQUIRED_TENDER_SECTIONS = TENDER_SECTIONS.filter((s) => !s.optional);

/** Total estimated time across all sections. */
export const TOTAL_ESTIMATED_MINUTES = TENDER_SECTIONS.reduce(
  (sum, s) => sum + s.estimatedMinutes,
  0,
);

/**
 * Total question count including supplements.
 * Base: 36 + 62 + 25 + 20 + 20 + 28 + 20 = 211  (Personality 60→62 incl. validity)
 * Supplements: 5 (ECR-R) + 3 (SSEIT) + 4 (DSI-R) + 5 (Values) + 1 (DUTCH) = 18
 * Total: 229
 */
export const TOTAL_QUESTIONS = 229;

/** Get section by assessment type. */
export function getSectionByType(assessmentType: string): TenderSection | undefined {
  return TENDER_SECTIONS.find((s) => s.assessmentType === assessmentType);
}
