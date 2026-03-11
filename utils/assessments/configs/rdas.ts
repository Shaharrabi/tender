import {
  AssessmentConfig,
  GenericQuestion,
  LikertOption,
} from '@/types';
import { RDASScores } from '@/types/couples';

// ─── Likert Scales ──────────────────────────────────────

/** Consensus items (1-6): 0 = Always Disagree ... 5 = Always Agree */
const CONSENSUS_SCALE: LikertOption[] = [
  { value: 0, label: 'Always Disagree' },
  { value: 1, label: 'Almost Always Disagree' },
  { value: 2, label: 'Occasionally Disagree' },
  { value: 3, label: 'Occasionally Agree' },
  { value: 4, label: 'Almost Always Agree' },
  { value: 5, label: 'Always Agree' },
];

/** Satisfaction items 7-8: 0 = All the time ... 5 = Never (higher = better) */
const SATISFACTION_REVERSE_SCALE: LikertOption[] = [
  { value: 0, label: 'All the Time' },
  { value: 1, label: 'Most of the Time' },
  { value: 2, label: 'More Often Than Not' },
  { value: 3, label: 'Occasionally' },
  { value: 4, label: 'Rarely' },
  { value: 5, label: 'Never' },
];

/** Satisfaction items 9-10: 0 = Never ... 5 = All the time */
const SATISFACTION_FORWARD_SCALE: LikertOption[] = [
  { value: 0, label: 'Never' },
  { value: 1, label: 'Rarely' },
  { value: 2, label: 'Occasionally' },
  { value: 3, label: 'More Often Than Not' },
  { value: 4, label: 'Most of the Time' },
  { value: 5, label: 'All the Time' },
];

/** Cohesion items (12-14): 0 = Never ... 5 = More often than once a day */
const COHESION_SCALE: LikertOption[] = [
  { value: 0, label: 'Never' },
  { value: 1, label: 'Less Than Once a Month' },
  { value: 2, label: 'Once or Twice a Month' },
  { value: 3, label: 'Once or Twice a Week' },
  { value: 4, label: 'Once a Day' },
  { value: 5, label: 'More Often' },
];

/** Cohesion item 11 only: 0 = Never ... 4 = Every day (published RDAS uses 0-4 for this item) */
const COHESION_SCALE_11: LikertOption[] = [
  { value: 0, label: 'Never' },
  { value: 1, label: 'Less Than Once a Month' },
  { value: 2, label: 'Once or Twice a Month' },
  { value: 3, label: 'Once or Twice a Week' },
  { value: 4, label: 'Once a Day' },
];

// ─── Questions ──────────────────────────────────────────

const QUESTIONS: GenericQuestion[] = [
  // Consensus Subscale (Items 1-6)
  {
    id: 1,
    text: 'Religious matters',
    inputType: 'likert',
    subscale: 'consensus',
    likertScale: CONSENSUS_SCALE,
  },
  {
    id: 2,
    text: 'Demonstrations of affection',
    inputType: 'likert',
    subscale: 'consensus',
    likertScale: CONSENSUS_SCALE,
  },
  {
    id: 3,
    text: 'Making major decisions',
    inputType: 'likert',
    subscale: 'consensus',
    likertScale: CONSENSUS_SCALE,
  },
  {
    id: 4,
    text: 'Sex relations',
    inputType: 'likert',
    subscale: 'consensus',
    likertScale: CONSENSUS_SCALE,
  },
  {
    id: 5,
    text: 'Conventionality (correct or proper behavior)',
    inputType: 'likert',
    subscale: 'consensus',
    likertScale: CONSENSUS_SCALE,
  },
  {
    id: 6,
    text: 'Career decisions',
    inputType: 'likert',
    subscale: 'consensus',
    likertScale: CONSENSUS_SCALE,
  },

  // Satisfaction Subscale (Items 7-10)
  {
    id: 7,
    text: 'How often do you discuss or have you considered divorce, separation, or terminating your relationship?',
    inputType: 'likert',
    subscale: 'satisfaction',
    likertScale: SATISFACTION_REVERSE_SCALE,
  },
  {
    id: 8,
    text: 'How often do you or your partner leave the house after a fight?',
    inputType: 'likert',
    subscale: 'satisfaction',
    likertScale: SATISFACTION_REVERSE_SCALE,
  },
  {
    id: 9,
    text: 'In general, how often do you think that things between you and your partner are going well?',
    inputType: 'likert',
    subscale: 'satisfaction',
    likertScale: SATISFACTION_FORWARD_SCALE,
  },
  {
    id: 10,
    text: 'Do you confide in your partner?',
    inputType: 'likert',
    subscale: 'satisfaction',
    likertScale: SATISFACTION_FORWARD_SCALE,
  },

  // Cohesion Subscale (Items 11-14)
  {
    id: 11,
    text: 'Have a stimulating exchange of ideas?',
    inputType: 'likert',
    subscale: 'cohesion',
    likertScale: COHESION_SCALE_11,
  },
  {
    id: 12,
    text: 'Laugh together?',
    inputType: 'likert',
    subscale: 'cohesion',
    likertScale: COHESION_SCALE,
  },
  {
    id: 13,
    text: 'Calmly discuss something?',
    inputType: 'likert',
    subscale: 'cohesion',
    likertScale: COHESION_SCALE,
  },
  {
    id: 14,
    text: 'Work together on a project?',
    inputType: 'likert',
    subscale: 'cohesion',
    likertScale: COHESION_SCALE,
  },
];

// ─── Scoring ────────────────────────────────────────────

function getDistressLevel(
  total: number,
): RDASScores['distressLevel'] {
  if (total >= 48) return 'non-distressed';
  if (total >= 40) return 'mild';
  if (total >= 30) return 'moderate';
  return 'severe';
}

function scoreRDAS(
  responses: (number | string | string[] | null)[],
): RDASScores {
  const nums = responses as number[];
  if (nums.length !== 14) throw new Error('RDAS requires 14 responses');

  const consensus = nums.slice(0, 6).reduce((s, v) => s + v, 0);
  const satisfaction = nums.slice(6, 10).reduce((s, v) => s + v, 0);
  const cohesion = nums.slice(10, 14).reduce((s, v) => s + v, 0);
  const total = consensus + satisfaction + cohesion;

  return {
    total,
    consensus,
    satisfaction,
    cohesion,
    distressLevel: getDistressLevel(total),
  };
}

// ─── Config Export ──────────────────────────────────────

export const rdasConfig: AssessmentConfig = {
  type: 'rdas' as any,
  name: 'Relationship Adjustment',
  shortName: 'RDAS',
  description:
    'Measure dyadic consensus, satisfaction, and cohesion in your relationship.',
  instructions:
    'Most persons have disagreements in their relationships. Please indicate below the approximate extent of agreement or disagreement between you and your partner for each item on the following list.',
  estimatedMinutes: 5,
  totalQuestions: 14,
  questions: QUESTIONS,
  scoringFn: scoreRDAS,
  progressKey: 'rdas_progress',
};
