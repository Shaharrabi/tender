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

const QUESTIONS: GenericQuestion[] = [
  {
    id: 1,
    text: 'Please indicate the degree of happiness, all things considered, of your relationship.',
    inputType: 'likert',
    likertScale: HAPPINESS_SCALE,
  },
  {
    id: 2,
    text: 'In general, how often do you think that things between you and your partner are going well?',
    inputType: 'likert',
    likertScale: FREQUENCY_SCALE,
  },
  {
    id: 3,
    text: 'Our relationship is strong.',
    inputType: 'likert',
    likertScale: TRUTH_SCALE,
  },
  {
    id: 4,
    text: 'My relationship with my partner makes me happy.',
    inputType: 'likert',
    likertScale: TRUTH_SCALE,
  },
  {
    id: 5,
    text: 'I have a warm and comfortable relationship with my partner.',
    inputType: 'likert',
    likertScale: TRUTH_SCALE,
  },
  {
    id: 6,
    text: 'I really feel like part of a team with my partner.',
    inputType: 'likert',
    likertScale: TRUTH_SCALE,
  },
  {
    id: 7,
    text: 'How rewarding is your relationship with your partner?',
    inputType: 'likert',
    likertScale: DEGREE_SCALE,
  },
  {
    id: 8,
    text: 'How well does your partner meet your needs?',
    inputType: 'likert',
    likertScale: DEGREE_SCALE,
  },
  {
    id: 9,
    text: 'To what extent has your relationship met your original expectations?',
    inputType: 'likert',
    likertScale: DEGREE_SCALE,
  },
  {
    id: 10,
    text: 'In general, how satisfied are you with your relationship?',
    inputType: 'likert',
    likertScale: DEGREE_SCALE,
  },
  {
    id: 11,
    text: 'How good is your relationship compared to most?',
    inputType: 'likert',
    likertScale: COMPARISON_SCALE,
  },
  {
    id: 12,
    text: 'Do you enjoy your partner\'s company?',
    inputType: 'likert',
    likertScale: FREQUENCY_SCALE,
  },
  {
    id: 13,
    text: 'How often do you and your partner have fun together?',
    inputType: 'likert',
    likertScale: FREQUENCY_SCALE,
  },
  {
    id: 14,
    text: 'How many problems are there in your relationship?',
    inputType: 'likert',
    reverseScored: true,
    likertScale: PROBLEMS_SCALE,
  },
  {
    id: 15,
    text: 'I still feel a strong connection with my partner.',
    inputType: 'likert',
    likertScale: TRUTH_SCALE,
  },
  {
    id: 16,
    text: 'I cannot imagine ending my relationship with my partner.',
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
