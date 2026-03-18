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
 * Tender Attachment Assessment — 36 items
 * Constructs from Brennan, Clark & Shaver (1998). All item wording original to Tender.
 * Items 1-18 = Anxiety subscale, Items 19-36 = Avoidance subscale.
 *
 * Reverse-scored items (1-based): 9, 13, 28, 29, 30, 31, 32
 * instrument_version: 'tender-ip-v1'
 */
const QUESTIONS: GenericQuestion[] = [
  // ── Anxiety Subscale (Items 1-18) ────────────────────
  { id: 1,  text: "There's a part of me that worries my partner's feelings for me could change without warning.", inputType: 'likert', subscale: 'anxiety' },
  { id: 2,  text: "I sometimes sense an imbalance — like I care more about this relationship than my partner does.", inputType: 'likert', subscale: 'anxiety' },
  { id: 3,  text: "When my partner is away or out of reach, I notice a low hum of worry that something could be wrong between us.", inputType: 'likert', subscale: 'anxiety' },
  { id: 4,  text: "If I sense my partner pulling away — even slightly — it can consume my thoughts for hours.", inputType: 'likert', subscale: 'anxiety' },
  { id: 5,  text: "I need more reassurance than most people that my partner truly loves me.", inputType: 'likert', subscale: 'anxiety' },
  { id: 6,  text: "When something feels off between us, I have trouble focusing on anything else until it's resolved.", inputType: 'likert', subscale: 'anxiety' },
  { id: 7,  text: "I worry that once my partner really sees who I am, they might not want to stay.", inputType: 'likert', subscale: 'anxiety' },
  { id: 8,  text: "I find myself testing whether my partner truly cares — bringing things up, watching for reactions, looking for proof.", inputType: 'likert', subscale: 'anxiety' },
  { id: 9,  text: "I feel fundamentally secure in my partner's love — even when we're disconnected or in conflict, I don't question whether they still want to be here.", inputType: 'likert', subscale: 'anxiety', reverseScored: true },
  { id: 10, text: "I'm afraid that if I show how much I need this relationship, it will push my partner away.", inputType: 'likert', subscale: 'anxiety' },
  { id: 11, text: "When my partner doesn't respond the way I expect, I tend to assume the worst about what it means.", inputType: 'likert', subscale: 'anxiety' },
  { id: 12, text: "I sometimes feel like I'd fall apart if this relationship ended.", inputType: 'likert', subscale: 'anxiety' },
  { id: 13, text: "When things are going well between us, I can relax into the good without scanning for the next threat.", inputType: 'likert', subscale: 'anxiety', reverseScored: true },
  { id: 14, text: "I get frustrated when my partner doesn't respond to my emotional needs as quickly as I need them to.", inputType: 'likert', subscale: 'anxiety' },
  { id: 15, text: "When we argue, part of me fears it means the relationship is in danger — not just the issue, but us.", inputType: 'likert', subscale: 'anxiety' },
  { id: 16, text: "I wish I could stop seeking reassurance from my partner, but I can't seem to help it.", inputType: 'likert', subscale: 'anxiety' },
  { id: 17, text: "My desire for closeness sometimes feels like more than my partner can comfortably give.", inputType: 'likert', subscale: 'anxiety' },
  { id: 18, text: "I worry that I'm not enough for my partner — not interesting enough, not attractive enough, not something enough.", inputType: 'likert', subscale: 'anxiety' },

  // ── Avoidance Subscale (Items 19-36) ─────────────────
  { id: 19, text: "I prefer not to let my partner see the parts of me that feel most vulnerable.", inputType: 'likert', subscale: 'avoidance' },
  { id: 20, text: "When things get emotionally intense between us, my instinct is to create some distance.", inputType: 'likert', subscale: 'avoidance' },
  { id: 21, text: "I feel most at ease in my relationship when we each have our own space and independence.", inputType: 'likert', subscale: 'avoidance' },
  { id: 22, text: "There are layers of what I feel that I keep to myself, even from my partner, even when things are good.", inputType: 'likert', subscale: 'avoidance' },
  { id: 23, text: "I'm uncomfortable when my partner wants to talk about deep feelings or 'where we stand.'", inputType: 'likert', subscale: 'avoidance' },
  { id: 24, text: "My partner sometimes tells me I'm hard to read or emotionally distant.", inputType: 'likert', subscale: 'avoidance' },
  { id: 25, text: "I handle emotional pain better on my own than by sharing it with my partner.", inputType: 'likert', subscale: 'avoidance' },
  { id: 26, text: "When my partner reaches for closeness, I sometimes feel an urge to pull back — not because I don't care, but because something tightens.", inputType: 'likert', subscale: 'avoidance' },
  { id: 27, text: "I don't feel the need to share every part of my inner life with my partner.", inputType: 'likert', subscale: 'avoidance' },
  { id: 28, text: "My partner knows the parts of me that most people never see.", inputType: 'likert', subscale: 'avoidance', reverseScored: true },
  { id: 29, text: "I feel comfortable depending on my partner when I need support.", inputType: 'likert', subscale: 'avoidance', reverseScored: true },
  { id: 30, text: "I find it relatively easy to get emotionally close to my partner.", inputType: 'likert', subscale: 'avoidance', reverseScored: true },
  { id: 31, text: "When I'm stressed or hurting, turning to my partner for comfort feels natural.", inputType: 'likert', subscale: 'avoidance', reverseScored: true },
  { id: 32, text: "It's important to me that my partner and I can share our deepest thoughts and feelings.", inputType: 'likert', subscale: 'avoidance', reverseScored: true },
  { id: 33, text: "When my partner needs emotional support, I find it uncomfortable to be the one they lean on.", inputType: 'likert', subscale: 'avoidance' },
  { id: 34, text: "I sometimes shut down in the middle of an emotional conversation — not intentionally, but like a circuit breaker tripping.", inputType: 'likert', subscale: 'avoidance' },
  { id: 35, text: "I wonder whether truly letting someone in is worth the risk of what they might see.", inputType: 'likert', subscale: 'avoidance' },
  { id: 36, text: "In past relationships, I've been told I'm caring but emotionally unavailable — and part of me knows they were right.", inputType: 'likert', subscale: 'avoidance' },
];

/**
 * Reverse-scored item indices (0-based).
 *
 * Anxiety reverse:   AX9r, AX13r       → indices 8, 12
 * Avoidance reverse: AV10, AV11, AV12, AV13, AV14 → indices 27, 28, 29, 30, 31
 *
 * Reverse formula: 8 − response  (scale 1-7)
 */
const REVERSE_ITEMS = [8, 12, 27, 28, 29, 30, 31];

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
  name: 'Attachment Style',
  shortName: 'ECR-R',
  description: 'Understand how you seek closeness and navigate vulnerability in your relationship.',
  instructions:
    'The following statements are about how you experience closeness, vulnerability, and emotional connection in your relationship. There are no right or wrong answers — just respond honestly based on how you generally feel.',
  estimatedMinutes: 10,
  totalQuestions: 36,
  questions: QUESTIONS,
  likertScale: LIKERT_SCALE,
  scoringFn: scoreECRR,
  progressKey: 'ecr_r_progress',
};
