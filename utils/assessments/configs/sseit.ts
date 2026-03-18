import { AssessmentConfig, GenericQuestion, LikertOption, SSEITScores } from '@/types';

const LIKERT_SCALE: LikertOption[] = [
  { value: 1, label: 'Rarely true of me' },
  { value: 2, label: 'Occasionally true of me' },
  { value: 3, label: 'Sometimes true of me' },
  { value: 4, label: 'Often true of me' },
  { value: 5, label: 'Almost always true of me' },
];

/**
 * Tender EQ + Empathy Assessment — 25 items (expanded from 16)
 * Constructs from Wong & Law (2002), Salovey & Mayer (1990), Davis (1980, 1983).
 * All item wording original to Tender.
 *
 * 6 subscales: Perception (4), Managing Own (4), Managing Others (4),
 *              Utilization (4), Perspective Taking (4), Empathic Resonance (5)
 *
 * Reverse-scored items (0-based): P3r=2, MO2r=5, MA2r=9, U3r=14, PT2r=18, ER2r=22
 *
 * instrument_version: 'tender-ip-v2' (expanded from 16→25 items, 2 new subscales)
 */

// 0-based indices of reverse-scored items
const REVERSE_ITEMS = new Set([2, 5, 9, 14, 18, 22]);

const QUESTIONS: GenericQuestion[] = [
  // ── Perception (Items 1–4) ──
  { id: 1, text: "I can usually tell what my partner is feeling before they say anything — from their posture, their breathing, the way they move through a room.", inputType: 'likert', subscale: 'perception' },
  { id: 2, text: "I notice shifts in the emotional atmosphere between me and my partner — a cooling, a warming, a tightening — even when neither of us has said a word.", inputType: 'likert', subscale: 'perception' },
  { id: 3, text: "I sometimes miss emotional signals from my partner that seem obvious to me in hindsight — their sadness, their reaching, their withdrawal.", inputType: 'likert', subscale: 'perception', reverseScored: true },
  { id: 4, text: "I know my own emotional state clearly — I can name what I'm feeling and distinguish between feelings that seem similar but aren't.", inputType: 'likert', subscale: 'perception' },

  // ── Managing Own Emotions (Items 5–8) ──
  { id: 5, text: "When a difficult emotion arrives during a disagreement with my partner, I can usually hold it without being consumed by it.", inputType: 'likert', subscale: 'managingOwn' },
  { id: 6, text: "When a strong emotion hits me during a conflict with my partner, it tends to take over — I react before I can choose my response.", inputType: 'likert', subscale: 'managingOwn', reverseScored: true },
  { id: 7, text: "When I'm flooded — heart racing, thoughts spinning — I have ways to bring myself back to center without needing my partner to fix it.", inputType: 'likert', subscale: 'managingOwn' },
  { id: 8, text: "I can sit with uncomfortable emotions — sadness, anger, fear — without immediately needing to discharge them through action, speech, or withdrawal.", inputType: 'likert', subscale: 'managingOwn' },

  // ── Managing Others' Emotions (Items 9–12) ──
  { id: 9, text: "When my partner is overwhelmed, I can usually help them settle — through my presence, my words, or just the way I hold the space between us.", inputType: 'likert', subscale: 'managingOthers' },
  { id: 10, text: "When my partner is upset, I sometimes make it worse without meaning to — saying the wrong thing, or offering solutions when they just need to be heard.", inputType: 'likert', subscale: 'managingOthers', reverseScored: true },
  { id: 11, text: "I can usually find the right thing to say when someone I care about is hurting — not to fix it, but to let them know they're not alone in it.", inputType: 'likert', subscale: 'managingOthers' },
  { id: 12, text: "When tension rises between me and my partner, I can usually de-escalate without dismissing what either of us is feeling.", inputType: 'likert', subscale: 'managingOthers' },

  // ── Utilization (Items 13–16) ──
  { id: 13, text: "I use what I sense about my partner's emotional state to choose the right moment for important conversations — timing matters as much as content.", inputType: 'likert', subscale: 'utilization' },
  { id: 14, text: "Strong emotions — even difficult ones — give me information I can work with in my relationship, rather than just overwhelming me.", inputType: 'likert', subscale: 'utilization' },
  { id: 15, text: "I tend to bring up difficult topics at the wrong time — when my partner is already stressed, tired, or not in a space to receive it.", inputType: 'likert', subscale: 'utilization', reverseScored: true },
  { id: 16, text: "I can channel frustration or hurt into something productive — a real conversation, a change in behavior, a decision — rather than letting it fester or explode.", inputType: 'likert', subscale: 'utilization' },

  // ── Perspective Taking (Items 17–20) — NEW SUBSCALE ──
  { id: 17, text: "When my partner and I disagree, I can genuinely step into their perspective and understand why they see it the way they do — even if I still see it differently.", inputType: 'likert', subscale: 'perspectiveTaking' },
  { id: 18, text: "I can hold my partner's experience as real and valid even when it contradicts my own experience of the same situation.", inputType: 'likert', subscale: 'perspectiveTaking' },
  { id: 19, text: "I sometimes catch myself assuming I know why my partner did something — without actually asking them or considering that their reasons might be different from what I imagine.", inputType: 'likert', subscale: 'perspectiveTaking', reverseScored: true },
  { id: 20, text: "When my partner tells me how something I did affected them, I can hear it as their experience rather than an accusation I need to defend against.", inputType: 'likert', subscale: 'perspectiveTaking' },

  // ── Empathic Resonance (Items 21–25) — NEW SUBSCALE ──
  { id: 21, text: "When my partner is sad, I feel their sadness in my own body — not as a concept, but as a physical weight.", inputType: 'likert', subscale: 'empathicResonance' },
  { id: 22, text: "Watching my partner struggle or suffer is genuinely painful for me — I feel it, not just witness it.", inputType: 'likert', subscale: 'empathicResonance' },
  { id: 23, text: "I sometimes feel disconnected from what my partner is going through — like I can see they're struggling but I can't quite feel it with them.", inputType: 'likert', subscale: 'empathicResonance', reverseScored: true },
  { id: 24, text: "After spending time with someone who is emotionally distressed, I often need time to separate their feelings from mine before I know what I actually feel.", inputType: 'likert', subscale: 'empathicResonance' },
  { id: 25, text: "I can feel what my partner is going through — deeply, in my body — and still hold onto my own center. Their pain touches me without swallowing me.", inputType: 'likert', subscale: 'empathicResonance' },
];

// Original 4 subscales (used for backward-compatible totalNormalized)
const ORIGINAL_SUBSCALE_ITEMS: Record<string, number[]> = {
  perception: [0, 1, 2, 3],       // 4 items
  managingOwn: [4, 5, 6, 7],      // 4 items
  managingOthers: [8, 9, 10, 11], // 4 items
  utilization: [12, 13, 14, 15],  // 4 items
};

// New subscales (Phase 3 additions)
const NEW_SUBSCALE_ITEMS: Record<string, number[]> = {
  perspectiveTaking: [16, 17, 18, 19],  // 4 items
  empathicResonance: [20, 21, 22, 23, 24], // 5 items
};

// All 6 subscales combined
const ALL_SUBSCALE_ITEMS: Record<string, number[]> = {
  ...ORIGINAL_SUBSCALE_ITEMS,
  ...NEW_SUBSCALE_ITEMS,
};

// v2.0: Expanded from 16→25 items. 2 new subscales: perspectiveTaking, empathicResonance.
// ⚠️ CRITICAL: totalNormalized MUST remain computed from original 4 subscales only.
// New 6-subscale total goes in totalNormalized_v2. See CODAX review notes.
function scoreSSEIT(responses: (number | string | string[] | null)[]): SSEITScores {
  const nums = responses as number[];
  if (nums.length !== 25) throw new Error('SSEIT requires 25 responses');

  // Apply reverse scoring: score = (6 - response) for reverse items
  const scored = nums.map((r, i) => (REVERSE_ITEMS.has(i) ? 6 - r : r));

  // Calculate ALL 6 subscale scores
  const subscaleScores: Record<string, { sum: number; mean: number; itemCount: number }> = {};
  const subscaleNormalized: Record<string, number> = {};

  for (const [scale, items] of Object.entries(ALL_SUBSCALE_ITEMS)) {
    const sum = items.reduce((s, i) => s + scored[i], 0);
    const itemCount = items.length;
    subscaleScores[scale] = {
      sum,
      mean: Math.round((sum / itemCount) * 100) / 100,
      itemCount,
    };
    // Normalize: ((sum - min) / range) * 100, where min=itemCount (all 1s), range=4*itemCount
    subscaleNormalized[scale] = Math.round(((sum - itemCount) / (4 * itemCount)) * 100);
  }

  // ⚠️ totalNormalized: BACKWARD COMPATIBLE — computed from original 4 subscales ONLY (16 items)
  // This is what couple-challenges.ts, weare-engine.ts, composite-scores.ts, helpers.ts read.
  const original4Sum = Object.keys(ORIGINAL_SUBSCALE_ITEMS)
    .flatMap(k => ORIGINAL_SUBSCALE_ITEMS[k])
    .reduce((s, i) => s + scored[i], 0);
  const original4Count = 16; // always 16 items in original 4 subscales

  // totalNormalized_v2: NEW — computed from ALL 25 items across all 6 subscales
  const allItemsSum = scored.reduce((s, r) => s + r, 0);

  return {
    totalScore: allItemsSum,
    totalMean: Math.round((allItemsSum / 25) * 100) / 100,
    // ⚠️ BACKWARD COMPAT: 4-subscale total, same formula as before
    totalNormalized: Math.round(((original4Sum - original4Count) / (4 * original4Count)) * 100),
    // NEW: 6-subscale total for opt-in consumers
    totalNormalized_v2: Math.round(((allItemsSum - 25) / (4 * 25)) * 100),
    subscaleScores,
    subscaleNormalized,
  };
}

export const sseitConfig: AssessmentConfig = {
  type: 'sseit',
  name: 'Emotional Intelligence',
  shortName: 'SSEIT',
  description: 'Explore how you sense, navigate, and use emotions in your relationships.',
  instructions:
    'For each statement, indicate how true it is of you in your relationships. There are no right or wrong answers — just be honest about how you typically experience things.',
  estimatedMinutes: 6,
  totalQuestions: 25,
  questions: QUESTIONS,
  likertScale: LIKERT_SCALE,
  scoringFn: scoreSSEIT,
  progressKey: 'sseit_progress',
};
