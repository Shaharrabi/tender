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

const QUESTIONS: GenericQuestion[] = [
  // ── Stress Communication by Self (items 1-4) ──
  // Stem: "When I am stressed..."
  { id: 1, text: 'I let my partner know that I appreciate his/her practical support, advice, or help', inputType: 'likert', subscale: 'stressCommunicationBySelf' },
  { id: 2, text: 'I ask my partner to do things for me when I have too much to do', inputType: 'likert', subscale: 'stressCommunicationBySelf' },
  { id: 3, text: 'I show my partner through my behavior when I am not doing well or when I have problems', inputType: 'likert', subscale: 'stressCommunicationBySelf' },
  { id: 4, text: 'I tell my partner openly how I feel and that I would appreciate his/her support', inputType: 'likert', subscale: 'stressCommunicationBySelf' },

  // ── Stress Communication by Partner (items 5-8) ──
  // Stem: "When my partner is stressed..."
  { id: 5, text: 'My partner lets me know that he/she appreciates my practical support, advice, or help', inputType: 'likert', subscale: 'stressCommunicationByPartner' },
  { id: 6, text: 'My partner asks me to do things for him/her when he/she has too much to do', inputType: 'likert', subscale: 'stressCommunicationByPartner' },
  { id: 7, text: 'My partner shows me through his/her behavior that he/she is not doing well or has problems', inputType: 'likert', subscale: 'stressCommunicationByPartner' },
  { id: 8, text: 'My partner tells me openly how he/she feels and that he/she would appreciate my support', inputType: 'likert', subscale: 'stressCommunicationByPartner' },

  // ── Supportive Dyadic Coping by Self (items 9-13) ──
  // Stem: "When my partner is stressed..."
  { id: 9, text: 'I show empathy and understanding to my partner', inputType: 'likert', subscale: 'supportiveBySelf' },
  { id: 10, text: 'I express that I am on my partner\'s side', inputType: 'likert', subscale: 'supportiveBySelf' },
  { id: 11, text: 'I blame my partner for not coping well enough with stress', inputType: 'likert', subscale: 'negativeBySelf', reverseScored: true },
  { id: 12, text: 'I help my partner to see stressful situations in a different light', inputType: 'likert', subscale: 'supportiveBySelf' },
  { id: 13, text: 'I listen to my partner and give him/her space to communicate what really bothers him/her', inputType: 'likert', subscale: 'supportiveBySelf' },

  // ── Supportive Dyadic Coping by Partner (items 14-18) ──
  // Stem: "When I am stressed, my partner..."
  { id: 14, text: 'Shows empathy and understanding to me', inputType: 'likert', subscale: 'supportiveByPartner' },
  { id: 15, text: 'Expresses that he/she is on my side', inputType: 'likert', subscale: 'supportiveByPartner' },
  { id: 16, text: 'Blames me for not coping well enough with stress', inputType: 'likert', subscale: 'negativeByPartner', reverseScored: true },
  { id: 17, text: 'Helps me to see stressful situations in a different light', inputType: 'likert', subscale: 'supportiveByPartner' },
  { id: 18, text: 'Listens to me and gives me the opportunity to communicate what really bothers me', inputType: 'likert', subscale: 'supportiveByPartner' },

  // ── Delegated Dyadic Coping by Self (items 19-20) ──
  { id: 19, text: 'I take on things that my partner would normally do in order to help him/her out', inputType: 'likert', subscale: 'delegatedBySelf' },
  { id: 20, text: 'When my partner is stressed, I tend to withdraw', inputType: 'likert', subscale: 'negativeBySelf', reverseScored: true },

  // ── Delegated Dyadic Coping by Partner (items 21-22) ──
  { id: 21, text: 'My partner takes on things that I would normally do in order to help me out', inputType: 'likert', subscale: 'delegatedByPartner' },
  { id: 22, text: 'When I am stressed, my partner tends to withdraw', inputType: 'likert', subscale: 'negativeByPartner', reverseScored: true },

  // ── Negative Dyadic Coping by Self (items 23-26) ──
  { id: 23, text: 'I blame my partner for not coping well enough with stress', inputType: 'likert', subscale: 'negativeBySelf' },
  { id: 24, text: 'I make fun of my partner\'s stress', inputType: 'likert', subscale: 'negativeBySelf' },
  { id: 25, text: 'I don\'t take my partner\'s stress seriously', inputType: 'likert', subscale: 'negativeBySelf' },
  { id: 26, text: 'When my partner is stressed, I tend to distance myself', inputType: 'likert', subscale: 'negativeBySelf' },

  // ── Negative Dyadic Coping by Partner (items 27-30) ──
  { id: 27, text: 'My partner blames me for not coping well enough with stress', inputType: 'likert', subscale: 'negativeByPartner' },
  { id: 28, text: 'My partner makes fun of my stress', inputType: 'likert', subscale: 'negativeByPartner' },
  { id: 29, text: 'My partner doesn\'t take my stress seriously', inputType: 'likert', subscale: 'negativeByPartner' },
  { id: 30, text: 'When I am stressed, my partner tends to distance himself/herself', inputType: 'likert', subscale: 'negativeByPartner' },

  // ── Common Dyadic Coping (items 31-35) ──
  // Stem: "When we are both stressed..."
  { id: 31, text: 'We try to cope with the problem together and search for solutions', inputType: 'likert', subscale: 'commonCoping' },
  { id: 32, text: 'We engage in a serious discussion about the problem and think through what has to be done', inputType: 'likert', subscale: 'commonCoping' },
  { id: 33, text: 'We help each other put the problem in perspective and see it in a new light', inputType: 'likert', subscale: 'commonCoping' },
  { id: 34, text: 'We help each other relax with such things as massage, taking a bath together, or listening to music together', inputType: 'likert', subscale: 'commonCoping' },
  { id: 35, text: 'We are affectionate to each other, make love, and try that way to cope with stress', inputType: 'likert', subscale: 'commonCoping' },

  // ── Evaluation of Dyadic Coping (items 36-37) ──
  { id: 36, text: 'I am satisfied with the support I receive from my partner and the way we deal with stress together', inputType: 'likert', subscale: 'evaluationBySelf' },
  { id: 37, text: 'I am satisfied with the support I provide to my partner and the way we deal with stress together', inputType: 'likert', subscale: 'evaluationByPartner' },
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
  name: 'Dyadic Coping Inventory (DCI-37)',
  shortName: 'DCI',
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
