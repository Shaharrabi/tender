import { AssessmentConfig, GenericQuestion, LikertOption, DSIRScores } from '@/types';

const LIKERT_SCALE: LikertOption[] = [
  { value: 1, label: 'Not at all true of me' },
  { value: 2, label: 'Slightly true of me' },
  { value: 3, label: 'Somewhat true of me' },
  { value: 4, label: 'Moderately true of me' },
  { value: 5, label: 'Mostly true of me' },
  { value: 6, label: 'Very true of me' },
];

/**
 * Tender Differentiation Assessment — 20 items
 * Constructs from Bowen (1978), Skowron & Schmitt (2003). All items original to Tender.
 *
 * Reverse-scored items: IP1-IP5 (indices 5-9). Agree = HIGH differentiation,
 * so must be reversed before double-reversal in scoring.
 * ER/EC/FU items: agree = LOW differentiation, no individual reversal needed.
 *
 * instrument_version: 'tender-ip-v1'
 */
const REVERSE_ITEMS = new Set([5, 6, 7, 8, 9]);

const QUESTIONS: GenericQuestion[] = [
  // ── Emotional Reactivity (Items 1–5) ──
  // High = high reactivity = LOW differentiation
  { id: 1, text: 'When my partner says something that hurts, my body reacts before my mind can catch up — chest tight, jaw clenched, heat rising.', inputType: 'likert', subscale: 'emotionalReactivity' },
  { id: 2, text: "Small criticisms from my partner can feel enormous in the moment — like the volume is turned up way past what the situation warrants.", inputType: 'likert', subscale: 'emotionalReactivity' },
  { id: 3, text: "When we're in conflict, I sometimes say things I don't mean — the emotion speaks before I can choose my words.", inputType: 'likert', subscale: 'emotionalReactivity' },
  { id: 4, text: "After an argument, it takes me a long time to come back to baseline — I replay it, I stew, my body stays activated for hours.", inputType: 'likert', subscale: 'emotionalReactivity' },
  { id: 5, text: "I tend to feel things at full volume. There's not much middle ground between fine and flooded.", inputType: 'likert', subscale: 'emotionalReactivity' },

  // ── I-Position (Items 6–10) ──
  // High = high I-Position = HIGH differentiation → reverse-scored
  { id: 6, text: "I can hold onto what I believe even when my partner strongly disagrees — not stubbornly, but with a quiet certainty that my perspective matters too.", inputType: 'likert', subscale: 'iPosition', reverseScored: true },
  { id: 7, text: "I have a clear sense of who I am that doesn't disappear when I'm in a relationship — my values, my needs, my way of seeing things.", inputType: 'likert', subscale: 'iPosition', reverseScored: true },
  { id: 8, text: "I can say 'I see it differently' to my partner without it feeling like a threat to the relationship.", inputType: 'likert', subscale: 'iPosition', reverseScored: true },
  { id: 9, text: "I make important life decisions based on my own values and judgment, not on what will keep other people comfortable with me.", inputType: 'likert', subscale: 'iPosition', reverseScored: true },
  { id: 10, text: "When my partner wants something that conflicts with what I need, I can advocate for myself without guilt and without aggression.", inputType: 'likert', subscale: 'iPosition', reverseScored: true },

  // ── Emotional Cutoff (Items 11–15) ──
  // High = high cutoff = LOW differentiation
  { id: 11, text: "When things get emotionally intense between us, I go somewhere inside where no one can reach me — not a choice, more like a reflex.", inputType: 'likert', subscale: 'emotionalCutoff' },
  { id: 12, text: "There are parts of my emotional life that I've walled off — from my partner, and honestly, from myself.", inputType: 'likert', subscale: 'emotionalCutoff' },
  { id: 13, text: "When my partner tries to talk about something emotional, I sometimes feel a physical urge to leave the room — or the conversation — or my own body.", inputType: 'likert', subscale: 'emotionalCutoff' },
  { id: 14, text: "I've been told I'm present but unreachable — physically in the room but emotionally somewhere else entirely.", inputType: 'likert', subscale: 'emotionalCutoff' },
  { id: 15, text: "I handle difficult emotions by pushing them away until they stop bothering me — which works until it doesn't.", inputType: 'likert', subscale: 'emotionalCutoff' },

  // ── Fusion with Others (Items 16–20) ──
  // High = high fusion = LOW differentiation
  { id: 16, text: "My partner's mood becomes my mood — when they're down, something in me sinks. When they're light, I float.", inputType: 'likert', subscale: 'fusionWithOthers' },
  { id: 17, text: "I sometimes lose track of what I want because I'm so focused on what my partner wants or needs.", inputType: 'likert', subscale: 'fusionWithOthers' },
  { id: 18, text: "When my partner is upset with me, it shakes my sense of who I am — like their disapproval reaches somewhere deeper than the specific issue.", inputType: 'likert', subscale: 'fusionWithOthers' },
  { id: 19, text: "I find it hard to know what I actually feel about something until I know how my partner feels about it.", inputType: 'likert', subscale: 'fusionWithOthers' },
  { id: 20, text: "The line between where I end and my partner begins sometimes feels blurry — not in a beautiful way, but in a way that leaves me unsure where I am.", inputType: 'likert', subscale: 'fusionWithOthers' },
];

const SUBSCALE_ITEMS: Record<string, number[]> = {
  emotionalReactivity: [0, 1, 2, 3, 4],  // 5 items
  iPosition: [5, 6, 7, 8, 9],             // 5 items
  emotionalCutoff: [10, 11, 12, 13, 14],   // 5 items
  fusionWithOthers: [15, 16, 17, 18, 19],  // 5 items
};

// v2.0: Uniform keying within subscales. Reverse items changed from
// {4,6,7,8,9,11,15,17} to {5,6,7,8,9}. Old and new scores are not directly comparable.
function scoreDSIR(responses: (number | string | string[] | null)[]): DSIRScores {
  const nums = responses as number[];
  if (nums.length !== 20) throw new Error('DSI-R requires 20 responses');

  // Step 1: Reverse score items (7 - score)
  const scored = nums.map((r, i) => (REVERSE_ITEMS.has(i) ? 7 - r : r));

  // Step 2: Calculate raw subscale means
  const subscaleScores: Record<string, { sum: number; rawMean: number; reversedMean: number; normalized: number; itemCount: number }> = {};

  for (const [scale, items] of Object.entries(SUBSCALE_ITEMS)) {
    const sum = items.reduce((s, i) => s + scored[i], 0);
    const itemCount = items.length;
    const rawMean = sum / itemCount;
    // Step 3: Double-reversal so high = differentiated
    const reversedMean = 7 - rawMean;
    // Step 4: Normalize to 0-100
    const normalized = Math.round(((reversedMean - 1) / 5) * 100);

    subscaleScores[scale] = {
      sum,
      rawMean: Math.round(rawMean * 100) / 100,
      reversedMean: Math.round(reversedMean * 100) / 100,
      normalized,
      itemCount,
    };
  }

  // Step 5: Total differentiation
  const totalReversedMean =
    Object.values(subscaleScores).reduce((s, v) => s + v.reversedMean, 0) / 4;
  const totalNormalized = Math.round(((totalReversedMean - 1) / 5) * 100);

  return {
    totalMean: Math.round(totalReversedMean * 100) / 100,
    totalNormalized,
    subscaleScores,
  };
}

export const dsirConfig: AssessmentConfig = {
  type: 'dsi-r',
  name: 'Differentiation of Self',
  shortName: 'DSI-R',
  description: 'Explore how well you maintain your sense of self while staying emotionally connected in relationships.',
  instructions:
    'These are questions about your thoughts and feelings about yourself and your relationships. Please read each statement carefully and decide how much it is generally true of you.',
  estimatedMinutes: 6,
  totalQuestions: 20,
  questions: QUESTIONS,
  likertScale: LIKERT_SCALE,
  scoringFn: scoreDSIR,
  progressKey: 'dsir_progress',
};
