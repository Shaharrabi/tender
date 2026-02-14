/**
 * Couple Field Assessment — "What Lives Between You"
 *
 * 15 items, mixed types (text, choice, Likert), 3 sections of 5 items each.
 * Both partners answer independently; results are compared.
 * This is a COUPLE instrument — NOT part of the individual Tender Assessment.
 */

import type { AssessmentConfig, GenericQuestion, LikertOption, AssessmentSection, CoupleFieldScores } from '@/types';

const LIKERT_7: LikertOption[] = [
  { value: 1, label: 'Strongly Disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Somewhat Disagree' },
  { value: 4, label: 'Neutral' },
  { value: 5, label: 'Somewhat Agree' },
  { value: 6, label: 'Agree' },
  { value: 7, label: 'Strongly Agree' },
];

const QUESTIONS: GenericQuestion[] = [
  // ── Section 1: Our Pattern (Items 1-5) ──
  {
    id: 1,
    text: 'Describe in one sentence what happens between you when things go wrong.',
    inputType: 'text',
    subscale: 'pattern',
    charLimit: 300,
    placeholder: 'When things go wrong, what happens between you...',
  },
  {
    id: 2,
    text: 'When this pattern starts, I usually:',
    inputType: 'choice',
    subscale: 'pattern',
    choices: [
      { key: 'A', text: 'Move toward my partner', coding: 'pursue' },
      { key: 'B', text: 'Move away', coding: 'withdraw' },
      { key: 'C', text: 'Freeze', coding: 'freeze' },
      { key: 'D', text: 'Fight', coding: 'fight' },
    ],
  },
  {
    id: 3,
    text: 'When this pattern starts, I believe my partner is:',
    inputType: 'choice',
    subscale: 'pattern',
    choices: [
      { key: 'A', text: 'Pulling away', coding: 'withdrawing' },
      { key: 'B', text: 'Attacking', coding: 'attacking' },
      { key: 'C', text: 'Not caring', coding: 'indifferent' },
      { key: 'D', text: 'Trying to control', coding: 'controlling' },
    ],
  },
  {
    id: 4,
    text: 'I can see this pattern without blaming either of us.',
    inputType: 'likert',
    subscale: 'pattern',
    likertScale: LIKERT_7,
  },
  {
    id: 5,
    text: 'I believe this pattern is trying to protect us both, even though it hurts.',
    inputType: 'likert',
    subscale: 'pattern',
    likertScale: LIKERT_7,
  },

  // ── Section 2: Our Resources (Items 6-10) ──
  {
    id: 6,
    text: 'Name something that emerges between you that would not exist if you were with someone else.',
    inputType: 'text',
    subscale: 'resources',
    charLimit: 300,
    placeholder: 'Something unique that emerges between you...',
  },
  {
    id: 7,
    text: 'When you are at your best together, what word describes the quality of the space between you?',
    inputType: 'text',
    subscale: 'resources',
    charLimit: 100,
    placeholder: 'One word...',
  },
  {
    id: 8,
    text: 'We have a way of being together that we don\u2019t have with anyone else.',
    inputType: 'likert',
    subscale: 'resources',
    likertScale: LIKERT_7,
  },
  {
    id: 9,
    text: 'When we are both fully present, something good happens that neither of us planned.',
    inputType: 'likert',
    subscale: 'resources',
    likertScale: LIKERT_7,
  },
  {
    id: 10,
    text: 'What ritual or habit between you most feels like \u201Cus\u201D?',
    inputType: 'text',
    subscale: 'resources',
    charLimit: 300,
    placeholder: 'A ritual or habit that feels like "us"...',
  },

  // ── Section 3: Our Growing Edge (Items 11-15) ──
  {
    id: 11,
    text: 'Name one difference between you that sometimes causes conflict but also enriches the relationship.',
    inputType: 'text',
    subscale: 'growingEdge',
    charLimit: 300,
    placeholder: 'A difference that both challenges and enriches...',
  },
  {
    id: 12,
    text: 'I can learn something from how my partner sees the world, even when I disagree.',
    inputType: 'likert',
    subscale: 'growingEdge',
    likertScale: LIKERT_7,
  },
  {
    id: 13,
    text: 'Name something you are afraid would happen if you let go of control in this relationship.',
    inputType: 'text',
    subscale: 'growingEdge',
    charLimit: 300,
    placeholder: 'What you fear if you let go of control...',
  },
  {
    id: 14,
    text: 'I am willing to be changed by this relationship.',
    inputType: 'likert',
    subscale: 'growingEdge',
    likertScale: LIKERT_7,
  },
  {
    id: 15,
    text: 'What is one thing you are certain about regarding your partner that you might be wrong about?',
    inputType: 'text',
    subscale: 'growingEdge',
    charLimit: 300,
    placeholder: 'A certainty that might be wrong...',
  },
];

const SECTIONS: AssessmentSection[] = [
  { id: 'pattern', title: 'Our Pattern', description: 'How do you move when things get hard between you?', questionRange: [0, 4] },
  { id: 'resources', title: 'Our Resources', description: 'What is alive and strong in the space between you?', questionRange: [5, 9] },
  { id: 'growingEdge', title: 'Our Growing Edge', description: 'Where is the relationship inviting you to grow?', questionRange: [10, 14] },
];

function scoreCoupleField(
  responses: (number | string | string[] | null)[],
): CoupleFieldScores {
  // Helper for likert items (default to 4 if not numeric)
  const num = (r: any) => (typeof r === 'number' ? r : 4);
  const str = (r: any) => (typeof r === 'string' ? r : '');

  return {
    patternSection: {
      cycleDescription: str(responses[0]),
      selfMove: str(responses[1]),     // choice key
      partnerAttribution: str(responses[2]), // choice key
      cycleAwareness: num(responses[3]),
      patternProtection: num(responses[4]),
    },
    resourceSection: {
      uniqueEmergence: str(responses[5]),
      bestQualityWord: str(responses[6]),
      uniqueTogetherness: num(responses[7]),
      emergentGoodness: num(responses[8]),
      signatureRitual: str(responses[9]),
    },
    growingEdgeSection: {
      enrichingDifference: str(responses[10]),
      learningFromPartner: num(responses[11]),
      controlFear: str(responses[12]),
      willingnessToBeChanged: num(responses[13]),
      uncertainCertainty: str(responses[14]),
    },
  };
}

export const coupleFieldConfig: AssessmentConfig = {
  type: 'couple-field',
  name: 'What Lives Between You',
  shortName: 'CFA',
  description: 'Explore the patterns, resources, and growing edges that live in the space between you and your partner.',
  instructions: 'Answer these questions on your own, not with your partner present. There are no right or wrong answers. Be honest about what you see \u2014 it will help your partner understand you better.',
  estimatedMinutes: 10,
  totalQuestions: 15,
  questions: QUESTIONS,
  sections: SECTIONS,
  scoringFn: scoreCoupleField,
  progressKey: 'couple_field_progress',
};
