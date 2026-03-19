/**
 * Relational Field Awareness Scale — "The Space Between Us"
 *
 * 20 items, 7-point Likert, 4 subscales of 5 items each.
 * Administered individually; scores compared across partners.
 * This is a COUPLE instrument — NOT part of the individual Tender Assessment.
 */

import type { AssessmentConfig, GenericQuestion, LikertOption, AssessmentSection, RelationalFieldScores } from '@/types';

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
  // ── Subscale 1: Field Recognition (Items 1-5) ──
  { id: 1, text: 'When my partner and I are truly connected, something emerges between us that feels larger than either of us alone.', inputType: 'likert', subscale: 'fieldRecognition' },
  { id: 2, text: 'I can sense when the space between us shifts \u2014 when it feels warm or when it feels cold.', inputType: 'likert', subscale: 'fieldRecognition' },
  { id: 3, text: 'Our relationship has a quality or atmosphere that changes depending on how present we both are.', inputType: 'likert', subscale: 'fieldRecognition' },
  { id: 4, text: 'I sometimes notice that my partner and I create something together (a mood, an energy, a feeling) that neither of us could create on our own.', inputType: 'likert', subscale: 'fieldRecognition' },
  { id: 5, text: 'There are moments when I feel the relationship itself is communicating what it needs.', inputType: 'likert', subscale: 'fieldRecognition' },

  // ── Subscale 2: Holding Creative Tension (Items 6-10) ──
  { id: 6, text: 'When my partner and I disagree, I can hold both perspectives without needing to resolve the tension immediately.', inputType: 'likert', subscale: 'creativeTension' },
  { id: 7, text: 'I believe our differences can generate something new rather than just creating conflict.', inputType: 'likert', subscale: 'creativeTension' },
  { id: 8, text: "I can tolerate not knowing whether my partner is 'right' or 'wrong' during a disagreement.", inputType: 'likert', subscale: 'creativeTension' },
  { id: 9, text: 'I find that sitting with unresolved tension between us sometimes leads to unexpected understanding.', inputType: 'likert', subscale: 'creativeTension' },
  { id: 10, text: 'I see our personality differences as resources for the relationship, not just sources of friction.', inputType: 'likert', subscale: 'creativeTension' },

  // ── Subscale 3: Presence and Attunement (Items 11-15) ──
  { id: 11, text: 'I regularly pause to notice what is happening between my partner and me before reacting.', inputType: 'likert', subscale: 'presenceAttunement' },
  { id: 12, text: 'When I am with my partner, I am usually fully present rather than preoccupied with other things.', inputType: 'likert', subscale: 'presenceAttunement' },
  { id: 13, text: 'I can sense when my partner needs something from me even before they say it.', inputType: 'likert', subscale: 'presenceAttunement' },
  { id: 14, text: 'I find it easy to slow down and really listen when my partner is speaking, even if I disagree.', inputType: 'likert', subscale: 'presenceAttunement' },
  { id: 15, text: 'I notice patterns in how we interact \u2014 certain rhythms or cycles that repeat.', inputType: 'likert', subscale: 'presenceAttunement' },

  // ── Subscale 4: Emergent Orientation (Items 16-20) ──
  { id: 16, text: 'I believe that when both my partner and I are truly present, wisdom about our relationship naturally emerges.', inputType: 'likert', subscale: 'emergentOrientation' },
  { id: 17, text: 'I trust that our relationship can heal itself if we both show up honestly.', inputType: 'likert', subscale: 'emergentOrientation' },
  { id: 18, text: 'I am willing to let go of my plan for how a conversation should go and follow what actually unfolds.', inputType: 'likert', subscale: 'emergentOrientation' },
  { id: 19, text: 'I believe the relationship knows things that neither of us individually knows.', inputType: 'likert', subscale: 'emergentOrientation' },
  { id: 20, text: 'I am open to being changed by what emerges between us.', inputType: 'likert', subscale: 'emergentOrientation' },
];

const SECTIONS: AssessmentSection[] = [
  { id: 'fieldRecognition', title: 'Field Recognition', description: 'How well you sense the relational space between you.', questionRange: [0, 4] },
  { id: 'creativeTension', title: 'Holding Creative Tension', description: 'Your ability to hold differences without forcing resolution.', questionRange: [5, 9] },
  { id: 'presenceAttunement', title: 'Presence & Attunement', description: 'How present and attuned you are with your partner.', questionRange: [10, 14] },
  { id: 'emergentOrientation', title: 'Emergent Orientation', description: 'Your openness to what the relationship is becoming.', questionRange: [15, 19] },
];

function scoreRelationalField(
  responses: (number | string | string[] | null)[],
): RelationalFieldScores {
  const nums = responses.map((r) => (typeof r === 'number' ? r : 4));

  const subscaleSlice = (start: number, end: number) => {
    const slice = nums.slice(start, end + 1);
    const sum = slice.reduce((a, b) => a + b, 0);
    return { sum, mean: sum / slice.length };
  };

  const fr = subscaleSlice(0, 4);
  const ct = subscaleSlice(5, 9);
  const pa = subscaleSlice(10, 14);
  const eo = subscaleSlice(15, 19);
  const totalSum = fr.sum + ct.sum + pa.sum + eo.sum;

  return {
    totalScore: totalSum,
    totalMean: totalSum / 20,
    fieldRecognition: fr,
    creativeTension: ct,
    presenceAttunement: pa,
    emergentOrientation: eo,
  };
}

export const relationalFieldConfig: AssessmentConfig = {
  type: 'relational-field',
  name: 'The Space Between Us',
  shortName: 'The Space Between',
  description: 'Explore your awareness of the relational field \u2014 the living space between you and your partner.',
  instructions: 'The following questions explore how you experience the space between you and your partner. There are no right or wrong answers. Respond based on how you generally feel, not how you think you should feel.',
  estimatedMinutes: 8,
  totalQuestions: 20,
  questions: QUESTIONS,
  likertScale: LIKERT_SCALE,
  sections: SECTIONS,
  scoringFn: scoreRelationalField,
  progressKey: 'relational_field_progress',
};
