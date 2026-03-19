import {
  AssessmentConfig,
  GenericQuestion,
  LikertOption,
  AssessmentSection,
} from '@/types';
import { DCIScores } from '@/types/couples';

// ─── Likert Scale ──────────────────────────────────────────

const LIKERT_SCALE: LikertOption[] = [
  { value: 1, label: 'Very Rarely' },
  { value: 2, label: 'Rarely' },
  { value: 3, label: 'Sometimes' },
  { value: 4, label: 'Often' },
  { value: 5, label: 'Very Often' },
];

// ─── Sections ──────────────────────────────────────────────

const SECTIONS: AssessmentSection[] = [
  {
    id: 'stress_communication_self',
    title: 'Your Stress Communication',
    description: 'How you communicate your stress to your partner.',
    questionRange: [0, 3],
  },
  {
    id: 'stress_communication_partner',
    title: "Your Partner's Stress Communication",
    description: 'How your partner communicates their stress to you.',
    questionRange: [4, 7],
  },
  {
    id: 'supportive_coping_self',
    title: 'Your Supportive Coping',
    description: 'How you support your partner when they are stressed.',
    questionRange: [8, 12],
  },
  {
    id: 'supportive_coping_partner',
    title: "Your Partner's Supportive Coping",
    description: 'How your partner supports you when you are stressed.',
    questionRange: [13, 17],
  },
  {
    id: 'delegated_coping_self',
    title: 'Your Delegated Coping',
    description: 'How you take over tasks to help your partner.',
    questionRange: [18, 19],
  },
  {
    id: 'delegated_coping_partner',
    title: "Your Partner's Delegated Coping",
    description: 'How your partner takes over tasks to help you.',
    questionRange: [20, 21],
  },
  {
    id: 'negative_coping_self',
    title: 'Your Negative Coping',
    description: 'Unhelpful ways you may respond to your partner\'s stress.',
    questionRange: [22, 25],
  },
  {
    id: 'negative_coping_partner',
    title: "Your Partner's Negative Coping",
    description: 'Unhelpful ways your partner may respond to your stress.',
    questionRange: [26, 29],
  },
  {
    id: 'common_coping',
    title: 'Common Dyadic Coping',
    description: 'How you cope with stress together as a couple.',
    questionRange: [30, 34],
  },
  {
    id: 'evaluation',
    title: 'Evaluation of Dyadic Coping',
    description: 'Your overall satisfaction with how you cope together.',
    questionRange: [35, 36],
  },
];

// ─── Questions ─────────────────────────────────────────────

/**
 * Tender Dyadic Coping Assessment — 37 items
 * Constructs from Bodenmann (2005). All item wording original to Tender.
 * instrument_version: 'tender-ip-v1'
 */
const QUESTIONS: GenericQuestion[] = [
  // ── Stress Communication by Self (items 1-4) ──
  { id: 1, text: 'When I\'m stressed, I let my partner know what\'s bothering me — I share what\'s happening rather than carrying it alone.', inputType: 'likert', subscale: 'stressCommunicationBySelf' },
  { id: 2, text: 'I show my partner through my behavior that something is wrong — my body language, my withdrawal, my short answers — even when I don\'t use words.', inputType: 'likert', subscale: 'stressCommunicationBySelf' },
  { id: 3, text: 'I express my stress in ways my partner can actually respond to — clearly enough that they know what I need.', inputType: 'likert', subscale: 'stressCommunicationBySelf' },
  { id: 4, text: 'When something is weighing on me, I tell my partner directly what I feel and that I would appreciate their support.', inputType: 'likert', subscale: 'stressCommunicationBySelf' },

  // ── Stress Communication by Partner (items 5-8) ──
  { id: 5, text: 'My partner tells me directly when they\'re stressed — what\'s happening, what it\'s about, how it feels.', inputType: 'likert', subscale: 'stressCommunicationByPartner' },
  { id: 6, text: 'My partner shows through their behavior that something is wrong — even when they don\'t say it in words, I can tell.', inputType: 'likert', subscale: 'stressCommunicationByPartner' },
  { id: 7, text: 'My partner communicates their stress in ways I can understand and respond to.', inputType: 'likert', subscale: 'stressCommunicationByPartner' },
  { id: 8, text: 'When something is bothering my partner, they come to me openly — sharing what they feel and what they need.', inputType: 'likert', subscale: 'stressCommunicationByPartner' },

  // ── Supportive Dyadic Coping by Self (items 9-13) ──
  { id: 9, text: 'When my partner is stressed, I show them I understand — I listen, I validate, I let them know their feelings make sense.', inputType: 'likert', subscale: 'supportiveBySelf' },
  { id: 10, text: 'I express that I am on my partner\'s side — not neutral, but clearly theirs, especially when they\'re struggling.', inputType: 'likert', subscale: 'supportiveBySelf' },
  { id: 11, text: 'When my partner is struggling, I sometimes blame them for not handling their stress well enough.', inputType: 'likert', subscale: 'negativeBySelf', reverseScored: true },
  { id: 12, text: 'I help my partner see their stress from a different angle — not dismissing it, but offering a perspective that might help.', inputType: 'likert', subscale: 'supportiveBySelf' },
  { id: 13, text: 'I listen to my partner and give them space to share what\'s really bothering them — without rushing to fix it or change the subject.', inputType: 'likert', subscale: 'supportiveBySelf' },

  // ── Supportive Dyadic Coping by Partner (items 14-18) ──
  { id: 14, text: 'When I\'m stressed, my partner shows me they understand — they listen without jumping to fix, they validate what I\'m feeling.', inputType: 'likert', subscale: 'supportiveByPartner' },
  { id: 15, text: 'My partner stands clearly on my side — not neutral, but visibly in my corner, especially when I\'m struggling.', inputType: 'likert', subscale: 'supportiveByPartner' },
  { id: 16, text: 'My partner sometimes blames me for not handling my stress well enough.', inputType: 'likert', subscale: 'negativeByPartner', reverseScored: true },
  { id: 17, text: 'My partner helps me see my stress differently — gently offering perspective without dismissing what I\'m going through.', inputType: 'likert', subscale: 'supportiveByPartner' },
  { id: 18, text: 'My partner listens to me and gives me space to share what\'s really bothering me — without rushing to fix it.', inputType: 'likert', subscale: 'supportiveByPartner' },

  // ── Delegated Dyadic Coping by Self (items 19-20) ──
  { id: 19, text: 'I take over practical tasks when my partner is overwhelmed — handling things they normally do so they have room to breathe.', inputType: 'likert', subscale: 'delegatedBySelf' },
  { id: 20, text: 'When my partner is stressed, I tend to withdraw — pulling back rather than leaning in.', inputType: 'likert', subscale: 'negativeBySelf', reverseScored: true },

  // ── Delegated Dyadic Coping by Partner (items 21-22) ──
  { id: 21, text: 'My partner takes things off my plate when I\'m overwhelmed — handling logistics, managing details, giving me space.', inputType: 'likert', subscale: 'delegatedByPartner' },
  { id: 22, text: 'When I\'m stressed, my partner tends to withdraw — pulling back rather than leaning in.', inputType: 'likert', subscale: 'negativeByPartner', reverseScored: true },

  // ── Negative Dyadic Coping by Self (items 23-26) ──
  { id: 23, text: 'When my partner shares their stress, I sometimes dismiss it — \'it\'s not that bad\' or \'you\'re overreacting.\'', inputType: 'likert', subscale: 'negativeBySelf' },
  { id: 24, text: 'I sometimes respond to my partner\'s stress with visible annoyance — like their struggle is an inconvenience to me.', inputType: 'likert', subscale: 'negativeBySelf' },
  { id: 25, text: 'I sometimes help my partner with their stress but do it with visible reluctance — sighing, rushing, making it clear I\'d rather not be doing this.', inputType: 'likert', subscale: 'negativeBySelf' },
  { id: 26, text: 'When my partner is stressed, I sometimes turn it into a conversation about MY stress — redirecting rather than holding space.', inputType: 'likert', subscale: 'negativeBySelf' },

  // ── Negative Dyadic Coping by Partner (items 27-30) ──
  { id: 27, text: 'When I share my stress, my partner sometimes minimizes it — making me feel like I\'m making a big deal out of nothing.', inputType: 'likert', subscale: 'negativeByPartner' },
  { id: 28, text: 'My partner sometimes responds to my stress with annoyance or impatience, as if my struggle is a burden to them.', inputType: 'likert', subscale: 'negativeByPartner' },
  { id: 29, text: 'My partner helps with my stress but I can feel the resentment underneath — they\'re doing it, but they don\'t want to be.', inputType: 'likert', subscale: 'negativeByPartner' },
  { id: 30, text: 'When I try to talk about my stress, my partner sometimes redirects the conversation to their own problems.', inputType: 'likert', subscale: 'negativeByPartner' },

  // ── Common Dyadic Coping (items 31-35) ──
  { id: 31, text: 'When we\'re both stressed, we try to deal with it together — pooling our energy rather than retreating into separate corners.', inputType: 'likert', subscale: 'commonCoping' },
  { id: 32, text: 'We support each other during stressful times — taking turns being the strong one, the soft one, the steady one.', inputType: 'likert', subscale: 'commonCoping' },
  { id: 33, text: 'When a problem affects us both, we sit down and work through it as a team — shared ownership of the challenge.', inputType: 'likert', subscale: 'commonCoping' },
  { id: 34, text: 'We have our own ways of getting through hard times together — rituals, routines, or signals that are uniquely ours — and they actually work.', inputType: 'likert', subscale: 'commonCoping' },
  { id: 35, text: 'We share tender moments during stressful periods — small gestures that say \'we\'re in this together\' even when things are hard.', inputType: 'likert', subscale: 'commonCoping' },

  // ── Evaluation of Dyadic Coping (items 36-37) ──
  { id: 36, text: 'Overall, how satisfied are you with the way your partner supports you when you\'re going through a difficult time?', inputType: 'likert', subscale: 'evaluationBySelf' },
  { id: 37, text: 'Overall, how satisfied are you with how you and your partner handle stress together — as a couple, as a team?', inputType: 'likert', subscale: 'evaluationByPartner' },
];

// ─── Scoring ───────────────────────────────────────────────

// 0-based indices for each scoring subscale
// Positive subscale item indices (for positive items only)
const STRESS_COMM_SELF_ITEMS = [0, 1, 2, 3];         // items 1-4
const STRESS_COMM_PARTNER_ITEMS = [4, 5, 6, 7];       // items 5-8
const SUPPORTIVE_SELF_ITEMS = [8, 9, 11, 12];          // items 9,10,12,13 (excludes 11)
const SUPPORTIVE_PARTNER_ITEMS = [13, 14, 16, 17];     // items 14,15,17,18 (excludes 16)
const DELEGATED_SELF_ITEMS = [18];                       // item 19 (excludes 20)
const DELEGATED_PARTNER_ITEMS = [20];                    // item 21 (excludes 22)
const COMMON_COPING_ITEMS = [30, 31, 32, 33, 34];      // items 31-35
const EVAL_SELF_ITEMS = [35];                            // item 36
const EVAL_PARTNER_ITEMS = [36];                         // item 37

// Negative subscale item indices
// Negative by Self: items 11, 20, 23, 24, 25, 26
const NEGATIVE_SELF_ITEMS = [10, 19, 22, 23, 24, 25];
// Negative by Partner: items 16, 22, 27, 28, 29, 30
const NEGATIVE_PARTNER_ITEMS = [15, 21, 26, 27, 28, 29];

function sumItems(responses: number[], indices: number[]): number {
  return indices.reduce((sum, i) => sum + responses[i], 0);
}

function getCopingQuality(totalPositive: number): DCIScores['copingQuality'] {
  // Total positive is sum of all positive subscale sums.
  // Max possible: stressCommSelf(20) + stressCommPartner(20) + supportiveSelf(20) +
  //   supportivePartner(20) + delegatedSelf(5) + delegatedPartner(5) +
  //   commonCoping(25) + evalSelf(5) + evalPartner(5) = 125
  // Min possible: 4+4+4+4+1+1+5+1+1 = 25
  // Tertile boundaries: range = 100, third ~33.3
  const min = 25;
  const range = 125 - min; // 100
  const third = range / 3;

  if (totalPositive >= min + 2 * third) return 'strong';
  if (totalPositive >= min + third) return 'adequate';
  return 'weak';
}

function scoreDCI(
  responses: (number | string | string[] | null)[],
): DCIScores {
  const nums = responses as number[];
  if (nums.length !== 37) throw new Error('DCI requires 37 responses');

  const stressCommunicationBySelf = sumItems(nums, STRESS_COMM_SELF_ITEMS);
  const stressCommunicationByPartner = sumItems(nums, STRESS_COMM_PARTNER_ITEMS);
  const supportiveBySelf = sumItems(nums, SUPPORTIVE_SELF_ITEMS);
  const supportiveByPartner = sumItems(nums, SUPPORTIVE_PARTNER_ITEMS);
  const delegatedBySelf = sumItems(nums, DELEGATED_SELF_ITEMS);
  const delegatedByPartner = sumItems(nums, DELEGATED_PARTNER_ITEMS);
  const negativeBySelf = sumItems(nums, NEGATIVE_SELF_ITEMS);
  const negativeByPartner = sumItems(nums, NEGATIVE_PARTNER_ITEMS);
  const commonCoping = sumItems(nums, COMMON_COPING_ITEMS);
  const evaluationBySelf = sumItems(nums, EVAL_SELF_ITEMS);
  const evaluationByPartner = sumItems(nums, EVAL_PARTNER_ITEMS);

  const totalPositive =
    stressCommunicationBySelf +
    stressCommunicationByPartner +
    supportiveBySelf +
    supportiveByPartner +
    delegatedBySelf +
    delegatedByPartner +
    commonCoping +
    evaluationBySelf +
    evaluationByPartner;

  return {
    totalPositive,
    stressCommunicationBySelf,
    stressCommunicationByPartner,
    supportiveBySelf,
    supportiveByPartner,
    delegatedBySelf,
    delegatedByPartner,
    negativeBySelf,
    negativeByPartner,
    commonCoping,
    evaluationBySelf,
    evaluationByPartner,
    copingQuality: getCopingQuality(totalPositive),
  };
}

// ─── Config Export ─────────────────────────────────────────

export const dciConfig: AssessmentConfig = {
  type: 'dci' as any,
  name: 'How You Cope Together',
  shortName: 'Stress & Coping',
  description:
    'Assess how you and your partner communicate about stress and support each other through difficult times.',
  instructions:
    'The following statements describe how you and your partner cope with stress. Please indicate how often each statement applies to you and your relationship using the scale from Very Rarely to Very Often.',
  estimatedMinutes: 10,
  totalQuestions: 37,
  questions: QUESTIONS,
  likertScale: LIKERT_SCALE,
  sections: SECTIONS,
  scoringFn: scoreDCI,
  progressKey: 'dci_progress',
};
