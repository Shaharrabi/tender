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

const QUESTIONS: GenericQuestion[] = [
  // Anxiety Subscale (Items 1-18)
  { id: 1, text: "I'm afraid that I will lose my partner's love.", inputType: 'likert', subscale: 'anxiety' },
  { id: 2, text: "I often worry that my partner will not want to stay with me.", inputType: 'likert', subscale: 'anxiety' },
  { id: 3, text: "I worry that my partner doesn't care about me as much as I care about them.", inputType: 'likert', subscale: 'anxiety' },
  { id: 4, text: "I worry a fair amount about losing my partner.", inputType: 'likert', subscale: 'anxiety' },
  { id: 5, text: "My desire to be very close sometimes scares people away.", inputType: 'likert', subscale: 'anxiety' },
  { id: 6, text: "I'm afraid that once my partner gets to know me, he or she won't like who I really am.", inputType: 'likert', subscale: 'anxiety' },
  { id: 7, text: "I worry that my partner won't care about me as much as I care about him or her.", inputType: 'likert', subscale: 'anxiety' },
  { id: 8, text: "I often wish that my partner's feelings were as deep as mine.", inputType: 'likert', subscale: 'anxiety' },
  { id: 9, text: "I worry that I won't measure up to other people my partner knows.", inputType: 'likert', subscale: 'anxiety' },
  { id: 10, text: "My partner only seems to want to be close to me when I initiate it.", inputType: 'likert', subscale: 'anxiety' },
  { id: 11, text: "I find that my partner(s) don't want to get as close as I would like.", inputType: 'likert', subscale: 'anxiety' },
  { id: 12, text: "Sometimes I feel that I force my partner to show more feeling, more commitment.", inputType: 'likert', subscale: 'anxiety' },
  { id: 13, text: "I tell my partner that I love him or her too often or more than he or she says it to me.", inputType: 'likert', subscale: 'anxiety' },
  { id: 14, text: "I find myself needing reassurance from my partner that we're okay.", inputType: 'likert', subscale: 'anxiety' },
  { id: 15, text: "I need a lot of reassurance that I am loved and valued in my relationship.", inputType: 'likert', subscale: 'anxiety' },
  { id: 16, text: "I worry about being abandoned.", inputType: 'likert', subscale: 'anxiety' },
  { id: 17, text: "I get upset when my partner is unavailable or seems uninterested in me.", inputType: 'likert', subscale: 'anxiety' },
  { id: 18, text: "My jealousy or anger sometimes makes it difficult for my partner to stay close to me.", inputType: 'likert', subscale: 'anxiety' },
  // Avoidance Subscale (Items 19-36)
  { id: 19, text: "I prefer not to show a partner how I feel deep down.", inputType: 'likert', subscale: 'avoidance' },
  { id: 20, text: "I feel comfortable opening up to my partner and talking about my fears.", inputType: 'likert', subscale: 'avoidance', reverseScored: true },
  { id: 21, text: "It helps to turn to my romantic partner in times of need.", inputType: 'likert', subscale: 'avoidance', reverseScored: true },
  { id: 22, text: "I prefer not to be too close to romantic partners.", inputType: 'likert', subscale: 'avoidance' },
  { id: 23, text: "I get uncomfortable when a romantic partner wants to be very close.", inputType: 'likert', subscale: 'avoidance' },
  { id: 24, text: "I prefer not to depend on a romantic partner.", inputType: 'likert', subscale: 'avoidance' },
  { id: 25, text: "I don't feel comfortable depending on romantic partners.", inputType: 'likert', subscale: 'avoidance' },
  { id: 26, text: "I'm uncomfortable when romantic partners want to be too emotionally close.", inputType: 'likert', subscale: 'avoidance' },
  { id: 27, text: "I want to get close to my partner, but I keep pulling back.", inputType: 'likert', subscale: 'avoidance' },
  { id: 28, text: "I am nervous when partners get too close, and I want them to back off.", inputType: 'likert', subscale: 'avoidance' },
  { id: 29, text: "I feel that it does not make a difference whether I'm with a partner or alone.", inputType: 'likert', subscale: 'avoidance' },
  { id: 30, text: "My partner really understands me and my needs.", inputType: 'likert', subscale: 'avoidance', reverseScored: true },
  { id: 31, text: "I think it is important to maintain some emotional distance in relationships.", inputType: 'likert', subscale: 'avoidance' },
  { id: 32, text: "I find it difficult to allow myself to depend completely on romantic partners.", inputType: 'likert', subscale: 'avoidance' },
  { id: 33, text: "I am very comfortable being close to romantic partners.", inputType: 'likert', subscale: 'avoidance', reverseScored: true },
  { id: 34, text: "I don't mind asking intimate partners for comfort or help.", inputType: 'likert', subscale: 'avoidance', reverseScored: true },
  { id: 35, text: "It's easy for me to be affectionate with my partner.", inputType: 'likert', subscale: 'avoidance', reverseScored: true },
  { id: 36, text: "My partner makes me doubt myself.", inputType: 'likert', subscale: 'avoidance' },
];

// Reverse-scored item indices (0-based): items 20,21,30,33,34,35 → 19,20,29,32,33,34
const REVERSE_ITEMS = [19, 20, 29, 32, 33, 34];

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
