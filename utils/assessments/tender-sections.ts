/**
 * The Tender Assessment — section map.
 *
 * Defines the 7-section unified assessment sequence with field-language names,
 * break points, and supplement assignments.
 *
 * Section 7 "The Space Between" uses the Relational Field Awareness Scale (RFAS).
 */

import type { TenderSection } from '@/types';

export const TENDER_SECTIONS: TenderSection[] = [
  {
    sectionNumber: 1,
    fieldName: 'How You Connect',
    fieldDescription: 'Understanding your attachment patterns and how you reach for closeness or create distance.',
    assessmentType: 'ecr-r',
    supplementGroup: 'ecr-r-supplement',
    estimatedMinutes: 12,
    breakAfter: true,
    breakMessage: 'Nice work. You are building a clearer picture of how you move in relationships.',
  },
  {
    sectionNumber: 2,
    fieldName: 'Who You Are',
    fieldDescription: 'Your personality and how it shapes the way you show up in your relationship.',
    assessmentType: 'ipip-neo-120',
    estimatedMinutes: 20,
    breakAfter: true,
    breakMessage: 'Great work. Take a stretch. You are building something important.',
  },
  {
    sectionNumber: 3,
    fieldName: 'How You Feel',
    fieldDescription: 'Your emotional world \u2014 how you sense, name, and navigate what you feel.',
    assessmentType: 'sseit',
    supplementGroup: 'sseit-supplement',
    estimatedMinutes: 10,
    breakAfter: true,
    breakMessage: 'Well done. You are learning to see the emotional currents beneath the surface.',
  },
  {
    sectionNumber: 4,
    fieldName: 'How You Hold Your Ground',
    fieldDescription: 'Your boundaries, autonomy, and ability to stay yourself while staying close.',
    assessmentType: 'dsi-r',
    supplementGroup: 'dsi-r-supplement',
    estimatedMinutes: 15,
    breakAfter: true,
    breakMessage: 'You are more than halfway through. The depth you are bringing matters.',
  },
  {
    sectionNumber: 5,
    fieldName: 'How You Fight',
    fieldDescription: 'Your approach to conflict and disagreement \u2014 what you do when things get hard.',
    assessmentType: 'dutch',
    estimatedMinutes: 5,
    breakAfter: true,
    breakMessage: 'Conflict takes courage to face. You are doing the work.',
  },
  {
    sectionNumber: 6,
    fieldName: 'What Matters to You',
    fieldDescription: 'Your values and what you want to move toward together.',
    assessmentType: 'values',
    supplementGroup: 'values-supplement',
    estimatedMinutes: 8,
    breakAfter: true,
    breakMessage: 'Almost there. One more section \u2014 the most relational one of all.',
  },
  {
    sectionNumber: 7,
    fieldName: 'The Space Between',
    fieldDescription: 'How you sense, hold, and co-create the relational field \u2014 the living space between you and your partner.',
    assessmentType: 'relational-field',
    estimatedMinutes: 8,
    breakAfter: false, // Last section — ends with completion screen
  },
];

/** Total estimated time across all sections. */
export const TOTAL_ESTIMATED_MINUTES = TENDER_SECTIONS.reduce(
  (sum, s) => sum + s.estimatedMinutes,
  0,
);

/** Total question count including supplements: 287 original + 20 RFAS + 17 supplement = 324. */
export const TOTAL_QUESTIONS = 324;

/** Get section by assessment type. */
export function getSectionByType(assessmentType: string): TenderSection | undefined {
  return TENDER_SECTIONS.find((s) => s.assessmentType === assessmentType);
}
