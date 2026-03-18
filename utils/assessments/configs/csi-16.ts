import {
  AssessmentConfig,
  GenericQuestion,
  LikertOption,
} from '@/types';
import { CSI16Scores } from '@/types/couples';

// ─── Likert Scales ──────────────────────────────────────

/** Item 1: 7-point happiness scale (0-6) */
const HAPPINESS_SCALE: LikertOption[] = [
  { value: 0, label: 'Extremely Unhappy' },
  { value: 1, label: 'Fairly Unhappy' },
  { value: 2, label: 'A Little Unhappy' },
  { value: 3, label: 'Happy' },
  { value: 4, label: 'Very Happy' },
  { value: 5, label: 'Extremely Happy' },
  { value: 6, label: 'Perfect' },
];

/** Items 2, 12, 13: Frequency scale (0-5) */
const FREQUENCY_SCALE: LikertOption[] = [
  { value: 0, label: 'Never' },
  { value: 1, label: 'Rarely' },
  { value: 2, label: 'Occasionally' },
  { value: 3, label: 'More often than not' },
  { value: 4, label: 'Most of the time' },
  { value: 5, label: 'All the time' },
];

/** Items 3-6, 15, 16: Agreement/truth scale (0-5) */
const TRUTH_SCALE: LikertOption[] = [
  { value: 0, label: 'Not at all true' },
  { value: 1, label: 'A little true' },
  { value: 2, label: 'Somewhat true' },
  { value: 3, label: 'Mostly true' },
  { value: 4, label: 'Almost completely true' },
  { value: 5, label: 'Completely true' },
];

/** Items 7-10: Degree/extent scale (0-5) */
const DEGREE_SCALE: LikertOption[] = [
  { value: 0, label: 'Not at all' },
  { value: 1, label: 'A little' },
  { value: 2, label: 'Somewhat' },
  { value: 3, label: 'Mostly' },
  { value: 4, label: 'Almost completely' },
  { value: 5, label: 'Completely' },
];

/** Item 11: Quality comparison scale (0-5) */
const COMPARISON_SCALE: LikertOption[] = [
  { value: 0, label: 'Very poor' },
  { value: 1, label: 'Poor' },
  { value: 2, label: 'Average' },
  { value: 3, label: 'Above average' },
  { value: 4, label: 'Good' },
  { value: 5, label: 'Excellent' },
];

/** Item 14: Problem quantity scale (0-5), reverse scored */
const PROBLEMS_SCALE: LikertOption[] = [
  { value: 0, label: 'Very many' },
  { value: 1, label: 'Many' },
  { value: 2, label: 'Some' },
  { value: 3, label: 'Very few' },
  { value: 4, label: 'Almost none' },
  { value: 5, label: 'None' },
];

// ─── Questions ──────────────────────────────────────────

/**
 * Tender Couple Satisfaction Assessment — 16 items
 * Constructs from Funk & Rogge (2007). All item wording original to Tender.
 * CRITICAL: Variable response scales — different items use different point scales. Preserve exactly.
 * instrument_version: 'tender-ip-v1'
 */
const QUESTIONS: GenericQuestion[] = [
  {
    id: 1,
    text: 'Taking everything into account — the good, the hard, the ordinary — how would you describe your happiness in this relationship right now?',
    inputType: 'likert',
    likertScale: HAPPINESS_SCALE,
  },
  {
    id: 2,
    text: 'How often do you feel that things between you and your partner are going well — that whatever the challenges, you\'re moving in the right direction?',
    inputType: 'likert',
    likertScale: FREQUENCY_SCALE,
  },
  {
    id: 3,
    text: 'My partner and I have a relationship that satisfies me deeply — not just on the surface, but in the places that matter most.',
    inputType: 'likert',
    likertScale: TRUTH_SCALE,
  },
  {
    id: 4,
    text: 'My relationship with my partner makes me genuinely happy — not the performance of happiness, but the real thing.',
    inputType: 'likert',
    likertScale: TRUTH_SCALE,
  },
  {
    id: 5,
    text: 'I have a warm and comfortable relationship with my partner — a place where I can land at the end of a day.',
    inputType: 'likert',
    likertScale: TRUTH_SCALE,
  },
  {
    id: 6,
    text: 'I feel like part of a team with my partner — we face what comes together, even when what comes is difficult.',
    inputType: 'likert',
    likertScale: TRUTH_SCALE,
  },
  {
    id: 7,
    text: 'How rewarding is your relationship? Not \'is it working?\' but \'does it give you something you couldn\'t find alone?\'',
    inputType: 'likert',
    likertScale: DEGREE_SCALE,
  },
  {
    id: 8,
    text: 'How close do you feel to your partner right now — emotionally, not just physically?',
    inputType: 'likert',
    likertScale: DEGREE_SCALE,
  },
  {
    id: 9,
    text: 'To what extent has your relationship become what you hoped it could be — not perfect, but genuinely nourishing?',
    inputType: 'likert',
    likertScale: DEGREE_SCALE,
  },
  {
    id: 10,
    text: 'How much do you enjoy your partner\'s company — not out of obligation, but because being with them genuinely makes your day better?',
    inputType: 'likert',
    likertScale: DEGREE_SCALE,
  },
  {
    id: 11,
    text: 'Overall, how good is your relationship compared to most relationships you\'ve observed in the world around you?',
    inputType: 'likert',
    likertScale: COMPARISON_SCALE,
  },
  {
    id: 12,
    text: 'How often do you think about how fortunate you are to have this person in your life — not because you should feel grateful, but because it genuinely strikes you?',
    inputType: 'likert',
    likertScale: FREQUENCY_SCALE,
  },
  {
    id: 13,
    text: 'How often do you and your partner share moments that remind you why you chose each other — laughter, connection, genuine delight?',
    inputType: 'likert',
    likertScale: FREQUENCY_SCALE,
  },
  {
    id: 14,
    text: 'How many areas of difficulty or unresolved tension exist between you and your partner right now?',
    inputType: 'likert',
    reverseScored: true,
    likertScale: PROBLEMS_SCALE,
  },
  {
    id: 15,
    text: 'My relationship with my partner is strong — not because it\'s never tested, but because it has been tested and held.',
    inputType: 'likert',
    likertScale: TRUTH_SCALE,
  },
  {
    id: 16,
    text: 'The connection between me and my partner is alive — not just maintained, but genuinely nourishing.',
    inputType: 'likert',
    likertScale: TRUTH_SCALE,
  },
];

// ─── Scoring ────────────────────────────────────────────

function getSatisfactionLevel(
  total: number,
): CSI16Scores['satisfactionLevel'] {
  if (total >= 67) return 'high';
  if (total >= 52) return 'moderate';
  if (total >= 34) return 'low';
  return 'crisis';
}

function scoreCSI16(
  responses: (number | string | string[] | null)[],
): CSI16Scores {
  const nums = responses as number[];
  if (nums.length !== 16) throw new Error('CSI-16 requires 16 responses');

  // All items are summed directly (item 14 scale is already oriented
  // so that higher values = fewer problems = higher satisfaction)
  const total = nums.reduce((s, v) => s + v, 0);

  return {
    total,
    satisfactionLevel: getSatisfactionLevel(total),
    distressed: total < 51.5,
  };
}

// ─── Config Export ──────────────────────────────────────

export const csi16Config: AssessmentConfig = {
  type: 'csi-16' as any,
  name: 'Couple Satisfaction',
  shortName: 'CSI-16',
  description:
    'Measure your overall relationship satisfaction using one of the most precise and sensitive instruments available.',
  instructions:
    'The following questions ask about your feelings and perceptions about your relationship. Please answer each item as honestly as possible to reflect your true experience.',
  estimatedMinutes: 5,
  totalQuestions: 16,
  questions: QUESTIONS,
  scoringFn: scoreCSI16,
  progressKey: 'csi16_progress',
};
