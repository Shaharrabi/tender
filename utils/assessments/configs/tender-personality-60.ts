/**
 * Tender Personality Assessment — 62 items (60 core + 2 validity)
 * "Who You Are in Love"
 *
 * 5 domains (OCEAN), 12 items each:
 *   - 8–9 backbone items (general personality, IPIP public domain grounded)
 *   - 3–4 relational items (relationship-contextualized, Tender IP)
 *   - Includes reverse-scored items for acquiescence control
 *
 * Scoring: Backbone 75% weight + Relational 25% weight per domain
 * A4_Cooperation extracted from items A4 + A10 for backward compat
 * Validity flag from V1 + V2 (not scored in any domain)
 *
 * IP: Tier 1 (IPIP public domain) + Tier 3 (relational items = Tender IP)
 * Cite: Goldberg, L. R. et al. (2006). The International Personality Item Pool.
 *
 * instrument_version: 'tender-personality-v1'
 */

import {
  AssessmentConfig,
  GenericQuestion,
  LikertOption,
  AssessmentSection,
} from '@/types';

// Type will be added in Phase 4b. For now, define inline.
interface TenderPersonality60Scores {
  domainScores: Record<string, { sum: number; mean: number }>;
  domainPercentiles: Record<string, number>;
  facetPercentiles: Record<string, number>;
  relationalPersonality: Record<string, number>;
  validityFlag: 'VALID' | 'POSSIBLE_BIAS';
}

const LIKERT_SCALE: LikertOption[] = [
  { value: 1, label: 'Strongly Disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neither Agree Nor Disagree' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly Agree' },
];

// ─── Reverse-scored items (0-based indices) ──────────────────
// Backbone reverse items + relational reverse items (E11r, A12r, C11r, O12r)
const REVERSE_ITEMS = new Set([
  // Extraversion: E5, E6, E7, E9
  16, 17, 18, 20,
  // Extraversion relational: E11r
  22,
  // Agreeableness: A6, A7, A8, A9
  29, 30, 31, 32,
  // Agreeableness relational: A12r
  35,
  // Conscientiousness: C6, C7, C8, C9
  41, 42, 43, 44,
  // Conscientiousness relational: C11r
  46,
  // Neuroticism: N6, N7, N8, N9 (agree = LOW neuroticism)
  5, 6, 7, 8,
  // Openness: O6, O7, O8
  53, 54, 55,
  // Openness relational: O12r
  59,
]);

// ─── Questions (62 total: 60 core + 2 validity) ────────────────

const QUESTIONS: GenericQuestion[] = [
  // ══════════════════════════════════════════════
  // NEUROTICISM (12 items: ids 1-12, indices 0-11)
  // ══════════════════════════════════════════════
  // Backbone (9 items: 5 forward + 4 reverse)
  { id: 1,  text: "I often feel anxious or worried about things.", inputType: 'likert', subscale: 'neuroticism' },
  { id: 2,  text: "My mood changes frequently throughout the day.", inputType: 'likert', subscale: 'neuroticism' },
  { id: 3,  text: "I get upset easily, even over small things.", inputType: 'likert', subscale: 'neuroticism' },
  { id: 4,  text: "I sometimes feel sad or down without a clear reason.", inputType: 'likert', subscale: 'neuroticism' },
  { id: 5,  text: "I often feel tense or wound up.", inputType: 'likert', subscale: 'neuroticism' },
  { id: 6,  text: "I tend to stay calm under pressure.", inputType: 'likert', subscale: 'neuroticism', reverseScored: true },
  { id: 7,  text: "I recover quickly from stressful experiences.", inputType: 'likert', subscale: 'neuroticism', reverseScored: true },
  { id: 8,  text: "It takes a lot to knock me off my emotional center — I don't get rattled easily.", inputType: 'likert', subscale: 'neuroticism', reverseScored: true },
  { id: 9,  text: "I rarely feel overwhelmed by my emotions.", inputType: 'likert', subscale: 'neuroticism', reverseScored: true },
  // Relational (3 items: all forward — see Master Bank note on N relational keying)
  { id: 10, text: "Small disagreements with my partner can spiral into something much bigger in my mind, even when they don't mean to.", inputType: 'likert', subscale: 'neuroticism' },
  { id: 11, text: "My mood in the relationship shifts quickly depending on how I think things are going between us.", inputType: 'likert', subscale: 'neuroticism' },
  { id: 12, text: "When my partner seems distant or quiet, I tend to assume something is wrong between us.", inputType: 'likert', subscale: 'neuroticism' },

  // ══════════════════════════════════════════════
  // EXTRAVERSION (12 items: ids 13-24, indices 12-23)
  // ══════════════════════════════════════════════
  // Backbone (9 items: 5 forward + 4 reverse)
  { id: 13, text: "I feel comfortable around people — including my partner's friends and family — even in new or unfamiliar social situations.", inputType: 'likert', subscale: 'extraversion' },
  { id: 14, text: "I tend to start conversations rather than waiting for others to come to me.", inputType: 'likert', subscale: 'extraversion' },
  { id: 15, text: "I would describe myself as someone who is full of energy.", inputType: 'likert', subscale: 'extraversion' },
  { id: 16, text: "I enjoy being the center of attention in social settings — telling stories, making people laugh, holding the room.", inputType: 'likert', subscale: 'extraversion' },
  { id: 17, text: "I tend to be quiet in social situations.", inputType: 'likert', subscale: 'extraversion', reverseScored: true },
  { id: 18, text: "I often feel uncomfortable in large groups of people.", inputType: 'likert', subscale: 'extraversion', reverseScored: true },
  { id: 19, text: "I keep to myself more than most people.", inputType: 'likert', subscale: 'extraversion', reverseScored: true },
  { id: 20, text: "I talk to many different people at social events.", inputType: 'likert', subscale: 'extraversion' },
  { id: 21, text: "I prefer working alone rather than in a group.", inputType: 'likert', subscale: 'extraversion', reverseScored: true },
  // Relational (3 items: 2 forward + 1 reverse)
  { id: 22, text: "In my relationship, I'm usually the one who suggests we go out, make plans, or try something new together.", inputType: 'likert', subscale: 'extraversion' },
  { id: 23, text: "After spending a lot of time together, I need space to recharge — being alone isn't rejection, it's how I restore my energy.", inputType: 'likert', subscale: 'extraversion', reverseScored: true },
  { id: 24, text: "I find it easy to express enthusiasm and excitement with my partner, even about small things.", inputType: 'likert', subscale: 'extraversion' },

  // ══════════════════════════════════════════════
  // AGREEABLENESS (12 items: ids 25-36, indices 24-35)
  // ══════════════════════════════════════════════
  // Backbone (9 items: 5 forward + 4 reverse)
  { id: 25, text: "I tend to see the best in people — including my partner, especially when they're not at their best.", inputType: 'likert', subscale: 'agreeableness' },
  { id: 26, text: "I go out of my way to help others, even when it's inconvenient.", inputType: 'likert', subscale: 'agreeableness' },
  { id: 27, text: "I believe that most people are basically well-intentioned.", inputType: 'likert', subscale: 'agreeableness' },
  { id: 28, text: "I find it easy to cooperate with others, even when I'd prefer a different approach.", inputType: 'likert', subscale: 'agreeableness' },
  { id: 29, text: "I try not to be rude or dismissive toward other people.", inputType: 'likert', subscale: 'agreeableness' },
  { id: 30, text: "I sometimes find it hard to feel sympathy for others' problems.", inputType: 'likert', subscale: 'agreeableness', reverseScored: true },
  { id: 31, text: "I can be critical and sharp when someone frustrates me.", inputType: 'likert', subscale: 'agreeableness', reverseScored: true },
  { id: 32, text: "I sometimes start disagreements with people.", inputType: 'likert', subscale: 'agreeableness', reverseScored: true },
  { id: 33, text: "I tend to be suspicious of other people's motives.", inputType: 'likert', subscale: 'agreeableness', reverseScored: true },
  // Relational (3 items: 2 forward + 1 reverse)
  { id: 34, text: "When my partner and I disagree, my instinct is to find common ground rather than win the argument.", inputType: 'likert', subscale: 'agreeableness' },
  { id: 35, text: "I tend to give my partner the benefit of the doubt, even when their behavior confuses or hurts me.", inputType: 'likert', subscale: 'agreeableness' },
  { id: 36, text: "When my partner and I disagree, I sometimes catch myself dismissing their perspective before I've really considered it.", inputType: 'likert', subscale: 'agreeableness', reverseScored: true },

  // ══════════════════════════════════════════════
  // CONSCIENTIOUSNESS (12 items: ids 37-48, indices 36-47)
  // ══════════════════════════════════════════════
  // Backbone (9 items: 5 forward + 4 reverse)
  { id: 37, text: "I like to keep things organized and in their proper place.", inputType: 'likert', subscale: 'conscientiousness' },
  { id: 38, text: "I follow through on my commitments — at work, at home, and in the promises I make to my partner.", inputType: 'likert', subscale: 'conscientiousness' },
  { id: 39, text: "I pay attention to details that others might miss.", inputType: 'likert', subscale: 'conscientiousness' },
  { id: 40, text: "I make plans and stick to them.", inputType: 'likert', subscale: 'conscientiousness' },
  { id: 41, text: "I do things efficiently — when something needs to happen in our household or relationship, I get it done.", inputType: 'likert', subscale: 'conscientiousness' },
  { id: 42, text: "I sometimes leave things undone that affect my partner — tasks, commitments, follow-through — and expect them to handle what I didn't.", inputType: 'likert', subscale: 'conscientiousness', reverseScored: true },
  { id: 43, text: "I tend to procrastinate on things that need to be done.", inputType: 'likert', subscale: 'conscientiousness', reverseScored: true },
  { id: 44, text: "I sometimes forget to follow through on obligations.", inputType: 'likert', subscale: 'conscientiousness', reverseScored: true },
  { id: 45, text: "I find it hard to settle down and focus on one task.", inputType: 'likert', subscale: 'conscientiousness', reverseScored: true },
  // Relational (3 items: 2 forward + 1 reverse)
  { id: 46, text: "I follow through on what I promise my partner I'll do — even the small things like picking something up or calling when I said I would.", inputType: 'likert', subscale: 'conscientiousness' },
  { id: 47, text: "I sometimes let things slide in our relationship — chores, conversations, commitments — and hope my partner won't notice or mind.", inputType: 'likert', subscale: 'conscientiousness', reverseScored: true },
  { id: 48, text: "I actively plan for our shared future — finances, goals, trips — rather than just letting things happen.", inputType: 'likert', subscale: 'conscientiousness' },

  // ══════════════════════════════════════════════
  // OPENNESS (12 items: ids 49-60, indices 48-59)
  // ══════════════════════════════════════════════
  // Backbone (8 items: 5 forward + 3 reverse)
  { id: 49, text: "I have a vivid and active imagination.", inputType: 'likert', subscale: 'openness' },
  { id: 50, text: "I am curious about many different things.", inputType: 'likert', subscale: 'openness' },
  { id: 51, text: "I appreciate art, music, or literature in ways that move me deeply.", inputType: 'likert', subscale: 'openness' },
  { id: 52, text: "I enjoy thinking about abstract ideas and concepts.", inputType: 'likert', subscale: 'openness' },
  { id: 53, text: "I like to find new ways of doing things rather than following the usual approach.", inputType: 'likert', subscale: 'openness' },
  { id: 54, text: "I tend to prefer routine and familiarity over change.", inputType: 'likert', subscale: 'openness', reverseScored: true },
  { id: 55, text: "I have limited interest in exploring abstract questions about relationships, identity, or what makes people the way they are.", inputType: 'likert', subscale: 'openness', reverseScored: true },
  { id: 56, text: "I don't see myself as particularly creative or imaginative.", inputType: 'likert', subscale: 'openness', reverseScored: true },
  // Relational (4 items: 3 forward + 1 reverse)
  { id: 57, text: "When my partner and I face a challenge, I tend to see possibilities that others might miss.", inputType: 'likert', subscale: 'openness' },
  { id: 58, text: "I'm genuinely curious about my partner's inner world — their thoughts, dreams, and the things they don't say out loud.", inputType: 'likert', subscale: 'openness' },
  { id: 59, text: "I bring new ideas into our relationship — things to try, conversations to have, ways we haven't connected before.", inputType: 'likert', subscale: 'openness' },
  { id: 60, text: "When my partner suggests trying something new in our relationship — a new way of communicating, a new activity, a new approach to conflict — my first instinct is usually resistance.", inputType: 'likert', subscale: 'openness', reverseScored: true },

  // ══════════════════════════════════════════════
  // VALIDITY ITEMS (2 items: ids 61-62, indices 60-61)
  // NOT scored in any domain
  // ══════════════════════════════════════════════
  { id: 61, text: "I have never felt frustrated with another person.", inputType: 'likert', subscale: 'validity' },
  { id: 62, text: "I sometimes feel annoyed, even with people I love.", inputType: 'likert', subscale: 'validity' },
];

// ─── Domain structure ────────────────────────────────────────

const DOMAINS = ['neuroticism', 'extraversion', 'agreeableness', 'conscientiousness', 'openness'] as const;

const DOMAIN_LABELS: Record<string, string> = {
  neuroticism: 'Neuroticism',
  extraversion: 'Extraversion',
  openness: 'Openness to Experience',
  agreeableness: 'Agreeableness',
  conscientiousness: 'Conscientiousness',
};

// All 12 items per domain (backbone + relational combined)
const DOMAIN_ITEMS: Record<string, number[]> = {
  neuroticism: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  extraversion: [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
  agreeableness: [24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35],
  conscientiousness: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47],
  openness: [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59],
};

// Backbone items per domain (for 75% weight)
const BACKBONE_ITEMS: Record<string, number[]> = {
  neuroticism: [0, 1, 2, 3, 4, 5, 6, 7, 8],         // 9 items
  extraversion: [12, 13, 14, 15, 16, 17, 18, 19, 20], // 9 items
  agreeableness: [24, 25, 26, 27, 28, 29, 30, 31, 32], // 9 items
  conscientiousness: [36, 37, 38, 39, 40, 41, 42, 43, 44], // 9 items
  openness: [48, 49, 50, 51, 52, 53, 54, 55],         // 8 items
};

// Relational items per domain (for 25% weight)
const RELATIONAL_ITEMS: Record<string, number[]> = {
  neuroticism: [9, 10, 11],         // 3 items
  extraversion: [21, 22, 23],       // 3 items (includes E11r at 22)
  agreeableness: [33, 34, 35],      // 3 items (includes A12r at 35)
  conscientiousness: [45, 46, 47],  // 3 items (includes C11r at 46)
  openness: [56, 57, 58, 59],       // 4 items (includes O12r at 59)
};

// A4_Cooperation items: A4 (id:28, idx:27) + A10 (id:34, idx:33)
const A4_COOPERATION_ITEMS = [27, 33];

// Validity items (not scored)
const VALIDITY_ITEMS = [60, 61];

// ─── Sections (breaks every domain) ────────────────────────

const SECTIONS: AssessmentSection[] = [
  { id: 'neuroticism', title: 'Section 1 of 5', description: 'How you experience and process emotions.', questionRange: [0, 11] },
  { id: 'extraversion', title: 'Section 2 of 5', description: 'Your social energy and how you connect with others.', questionRange: [12, 23] },
  { id: 'agreeableness', title: 'Section 3 of 5', description: 'How you navigate relationships and respond to others.', questionRange: [24, 35] },
  { id: 'conscientiousness', title: 'Section 4 of 5', description: 'How you organize your life and follow through on commitments.', questionRange: [36, 47] },
  { id: 'openness', title: 'Section 5 of 5', description: 'Your curiosity, creativity, and openness to new experiences.', questionRange: [48, 61] },
];

// ─── Relative score via logistic CDF ─────────────────────────
// Same transform as original ipip-neo-120 for backward compat
function toRelativeScore(sum: number, min: number, max: number): number {
  const range = max - min;
  const midpoint = min + range / 2;
  const sd = range / 6;
  const z = (sum - midpoint) / sd;
  const score = Math.round((1 / (1 + Math.exp(-1.7 * z))) * 100);
  return Math.max(1, Math.min(99, score));
}

// ─── Scoring ─────────────────────────────────────────────────

function scoreTenderPersonality60(
  responses: (number | string | string[] | null)[],
): TenderPersonality60Scores {
  const nums = responses as number[];
  if (nums.length !== 62) throw new Error('Tender Personality requires 62 responses');

  // Step 1: Reverse score
  const scored = nums.map((r, i) => (REVERSE_ITEMS.has(i) ? 6 - r : r));

  // Step 2: Domain scores with backbone/relational weighting (75/25)
  const domainScores: Record<string, { sum: number; mean: number }> = {};
  const domainPercentiles: Record<string, number> = {};

  for (const domain of DOMAINS) {
    const backboneIndices = BACKBONE_ITEMS[domain];
    const relationalIndices = RELATIONAL_ITEMS[domain];

    const backboneSum = backboneIndices.reduce((s, i) => s + scored[i], 0);
    const relationalSum = relationalIndices.reduce((s, i) => s + scored[i], 0);

    const backboneMean = backboneSum / backboneIndices.length;
    const relationalMean = relationalSum / relationalIndices.length;

    // Weighted mean: 75% backbone + 25% relational
    const weightedMean = backboneMean * 0.75 + relationalMean * 0.25;

    // Total sum across all 12 items (for percentile calculation)
    const allItems = DOMAIN_ITEMS[domain];
    const totalSum = allItems.reduce((s, i) => s + scored[i], 0);

    domainScores[domain] = {
      sum: totalSum,
      mean: Math.round(weightedMean * 100) / 100,
    };

    // Percentile from total sum (12 items, range 12-60)
    domainPercentiles[domain] = toRelativeScore(totalSum, 12, 60);
  }

  // Step 3: Add single-letter domain keys (fixes integration engine bug)
  const LETTER_MAP: Record<string, string> = {
    neuroticism: 'N', extraversion: 'E', openness: 'O',
    agreeableness: 'A', conscientiousness: 'C',
  };
  for (const [full, letter] of Object.entries(LETTER_MAP)) {
    domainPercentiles[letter] = domainPercentiles[full];
  }

  // Step 4: Relational personality subscores
  const relationalPersonality: Record<string, number> = {};
  for (const domain of DOMAINS) {
    const indices = RELATIONAL_ITEMS[domain];
    const sum = indices.reduce((s, i) => s + scored[i], 0);
    const key = `${domain.charAt(0).toUpperCase()}_rel`;
    relationalPersonality[key] = toRelativeScore(sum, indices.length, indices.length * 5);
  }

  // Step 5: A4_Cooperation (backward compat with assessment-synthesis.ts)
  const a4CoopSum = A4_COOPERATION_ITEMS.reduce((s, i) => s + scored[i], 0);
  const facetPercentiles: Record<string, number> = {
    A4_Cooperation: toRelativeScore(a4CoopSum, 2, 10),
  };

  // Step 6: Validity flag
  const v1 = nums[60]; // "I have never felt frustrated with another person"
  const v2 = nums[61]; // "I sometimes feel annoyed, even with people I love"
  const validityFlag: 'VALID' | 'POSSIBLE_BIAS' = (v1 > 1 || v2 < 3) ? 'POSSIBLE_BIAS' : 'VALID';

  return {
    domainScores,
    domainPercentiles,
    facetPercentiles,
    relationalPersonality,
    validityFlag,
    // Backward compat: facetScores not produced (no 30-facet structure)
    // Consumers that read facetScores should handle undefined gracefully
  };
}

// ─── Export config ───────────────────────────────────────────

export const tenderPersonality60Config: AssessmentConfig = {
  type: 'tender-personality-60' as any,
  name: 'Personality',
  shortName: 'Personality',
  description: 'Explore who you are in love — your personality patterns and how they show up in your relationship.',
  instructions:
    'The following statements describe how you see yourself in general and in your relationship. There are no right or wrong answers — just respond honestly based on how you typically are, not how you wish to be.',
  estimatedMinutes: 12,
  totalQuestions: 62,
  questions: QUESTIONS,
  likertScale: LIKERT_SCALE,
  sections: SECTIONS,
  scoringFn: scoreTenderPersonality60,
  progressKey: 'personality_progress',
};

export { DOMAINS, DOMAIN_LABELS, DOMAIN_ITEMS, BACKBONE_ITEMS, RELATIONAL_ITEMS };
