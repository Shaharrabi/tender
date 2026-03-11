import {
  AssessmentConfig,
  GenericQuestion,
  LikertOption,
  AttachmentStyle,
  ECRRScores,
} from '@/types';

const LIKERT_SCALE: LikertOption[] = [
  { value: 1, label: 'Strongly Disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Somewhat Disagree' },
  { value: 4, label: 'Neutral' },
  { value: 5, label: 'Somewhat Agree' },
  { value: 6, label: 'Agree' },
  { value: 7, label: 'Strongly Agree' },
];

/**
 * Canonical ECR-R items from Fraley, Waller, & Brennan (2000).
 * Items 1-18 = Anxiety subscale, Items 19-36 = Avoidance subscale.
 *
 * Reverse-scored items (1-based): 9, 11, 20, 22, 26, 27, 28, 29, 30, 31, 33, 34, 35, 36
 */
const QUESTIONS: GenericQuestion[] = [
  // ── Anxiety Subscale (Items 1-18) ────────────────────
  { id: 1,  text: "I'm afraid that I will lose my partner's love.", inputType: 'likert', subscale: 'anxiety' },
  { id: 2,  text: "I often worry that my partner will not want to stay with me.", inputType: 'likert', subscale: 'anxiety' },
  { id: 3,  text: "I often worry that my partner doesn't really love me.", inputType: 'likert', subscale: 'anxiety' },
  { id: 4,  text: "I worry that romantic partners won't care about me as much as I care about them.", inputType: 'likert', subscale: 'anxiety' },
  { id: 5,  text: "I often wish that my partner's feelings for me were as strong as my feelings for him or her.", inputType: 'likert', subscale: 'anxiety' },
  { id: 6,  text: "I worry a lot about my relationships.", inputType: 'likert', subscale: 'anxiety' },
  { id: 7,  text: "When my partner is out of sight, I worry that he or she might become interested in someone else.", inputType: 'likert', subscale: 'anxiety' },
  { id: 8,  text: "When I show my feelings for romantic partners, I'm afraid they will not feel the same about me.", inputType: 'likert', subscale: 'anxiety' },
  { id: 9,  text: "I rarely worry about my partner leaving me.", inputType: 'likert', subscale: 'anxiety', reverseScored: true },
  { id: 10, text: "My romantic partner makes me doubt myself.", inputType: 'likert', subscale: 'anxiety' },
  { id: 11, text: "I do not often worry about being abandoned.", inputType: 'likert', subscale: 'anxiety', reverseScored: true },
  { id: 12, text: "I find that my partner(s) don't want to get as close as I would like.", inputType: 'likert', subscale: 'anxiety' },
  { id: 13, text: "Sometimes romantic partners change their feelings about me for no apparent reason.", inputType: 'likert', subscale: 'anxiety' },
  { id: 14, text: "My desire to be very close sometimes scares people away.", inputType: 'likert', subscale: 'anxiety' },
  { id: 15, text: "I'm afraid that once a romantic partner gets to know me, he or she won't like who I really am.", inputType: 'likert', subscale: 'anxiety' },
  { id: 16, text: "It makes me mad that I don't get the affection and support I need from my partner.", inputType: 'likert', subscale: 'anxiety' },
  { id: 17, text: "I worry that I won't measure up to other people.", inputType: 'likert', subscale: 'anxiety' },
  { id: 18, text: "My partner only seems to notice me when I'm angry.", inputType: 'likert', subscale: 'anxiety' },

  // ── Avoidance Subscale (Items 19-36) ─────────────────
  { id: 19, text: "I prefer not to show a partner how I feel deep down.", inputType: 'likert', subscale: 'avoidance' },
  { id: 20, text: "I feel comfortable sharing my private thoughts and feelings with my partner.", inputType: 'likert', subscale: 'avoidance', reverseScored: true },
  { id: 21, text: "I find it difficult to allow myself to depend on romantic partners.", inputType: 'likert', subscale: 'avoidance' },
  { id: 22, text: "I am very comfortable being close to romantic partners.", inputType: 'likert', subscale: 'avoidance', reverseScored: true },
  { id: 23, text: "I don't feel comfortable opening up to romantic partners.", inputType: 'likert', subscale: 'avoidance' },
  { id: 24, text: "I prefer not to be too close to romantic partners.", inputType: 'likert', subscale: 'avoidance' },
  { id: 25, text: "I get uncomfortable when a romantic partner wants to be very close.", inputType: 'likert', subscale: 'avoidance' },
  { id: 26, text: "I find it relatively easy to get close to my partner.", inputType: 'likert', subscale: 'avoidance', reverseScored: true },
  { id: 27, text: "It's not difficult for me to get close to my partner.", inputType: 'likert', subscale: 'avoidance', reverseScored: true },
  { id: 28, text: "I usually discuss my problems and concerns with my partner.", inputType: 'likert', subscale: 'avoidance', reverseScored: true },
  { id: 29, text: "It helps to turn to my romantic partner in times of need.", inputType: 'likert', subscale: 'avoidance', reverseScored: true },
  { id: 30, text: "I tell my partner just about everything.", inputType: 'likert', subscale: 'avoidance', reverseScored: true },
  { id: 31, text: "I talk things over with my partner.", inputType: 'likert', subscale: 'avoidance', reverseScored: true },
  { id: 32, text: "I am nervous when partners get too close to me.", inputType: 'likert', subscale: 'avoidance' },
  { id: 33, text: "I feel comfortable depending on romantic partners.", inputType: 'likert', subscale: 'avoidance', reverseScored: true },
  { id: 34, text: "I find it easy to depend on romantic partners.", inputType: 'likert', subscale: 'avoidance', reverseScored: true },
  { id: 35, text: "It's easy for me to be affectionate with my partner.", inputType: 'likert', subscale: 'avoidance', reverseScored: true },
  { id: 36, text: "My partner really understands me and my needs.", inputType: 'likert', subscale: 'avoidance', reverseScored: true },
];

/**
 * Reverse-scored item indices (0-based).
 *
 * Anxiety reverse:   items 9, 11       → indices 8, 10
 * Avoidance reverse: items 20, 22, 26, 27, 28, 29, 30, 31, 33, 34, 35, 36
 *                    → indices 19, 21, 25, 26, 27, 28, 29, 30, 32, 33, 34, 35
 *
 * Reverse formula: 8 − response  (scale 1-7)
 */
const REVERSE_ITEMS = [8, 10, 19, 21, 25, 26, 27, 28, 29, 30, 32, 33, 34, 35];

function getAttachmentStyle(anxiety: number, avoidance: number): AttachmentStyle {
  const anxietyHigh = anxiety >= 4.0;
  const avoidanceHigh = avoidance >= 4.0;
  if (!anxietyHigh && !avoidanceHigh) return 'secure';
  if (anxietyHigh && !avoidanceHigh) return 'anxious-preoccupied';
  if (!anxietyHigh && avoidanceHigh) return 'dismissive-avoidant';
  return 'fearful-avoidant';
}

function scoreECRR(responses: (number | string | string[] | null)[]): ECRRScores {
  const nums = responses as number[];
  if (nums.length !== 36) throw new Error('ECR-R requires 36 responses');

  const adjusted = [...nums];
  for (const idx of REVERSE_ITEMS) {
    adjusted[idx] = 8 - adjusted[idx];
  }

  const anxietySum = adjusted.slice(0, 18).reduce((s, v) => s + v, 0);
  const avoidanceSum = adjusted.slice(18, 36).reduce((s, v) => s + v, 0);
  const anxietyScore = parseFloat((anxietySum / 18).toFixed(2));
  const avoidanceScore = parseFloat((avoidanceSum / 18).toFixed(2));
  const attachmentStyle = getAttachmentStyle(anxietyScore, avoidanceScore);

  return { anxietyScore, avoidanceScore, attachmentStyle };
}

export const ecrRConfig: AssessmentConfig = {
  type: 'ecr-r',
  name: 'Attachment Style (ECR-R)',
  shortName: 'ECR-R',
  description: 'Understand your attachment patterns in close relationships.',
  instructions:
    'The following statements concern how you feel in emotionally intimate relationships. We are interested in how you generally experience relationships, not just in what is happening in a current relationship. Respond to each statement by indicating how much you agree or disagree with it.',
  estimatedMinutes: 10,
  totalQuestions: 36,
  questions: QUESTIONS,
  likertScale: LIKERT_SCALE,
  scoringFn: scoreECRR,
  progressKey: 'ecr_r_progress',
};
