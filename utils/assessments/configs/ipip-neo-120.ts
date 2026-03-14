import {
  AssessmentConfig,
  GenericQuestion,
  LikertOption,
  AssessmentSection,
  IPIPScores,
} from '@/types';

const LIKERT_SCALE: LikertOption[] = [
  { value: 1, label: 'Very Inaccurate' },
  { value: 2, label: 'Moderately Inaccurate' },
  { value: 3, label: 'Neither Accurate Nor Inaccurate' },
  { value: 4, label: 'Moderately Accurate' },
  { value: 5, label: 'Very Accurate' },
];

// 0-based indices of reverse-scored items in the trimmed 60-item version
const REVERSE_ITEMS = new Set([
  3, 5, 7, 9, 11,             // Neuroticism: N2(R), N3(R), N4(R), N5(R), N6(R)
  13, 15, 17, 19,              // Extraversion: E1(R), E2(R), E3(R), E4(R)
  27, 29, 31, 33, 35,          // Openness: O2(R), O3(R), O4(R), O5(R), O6(R)
  37, 38, 39, 41, 42, 43, 44, 45, 47, // Agreeableness: A1(R), A2(2R), A3(R), A4(2R), A5(2R), A6(R)
  51, 53, 55, 57, 58, 59,      // Conscientiousness: C2(R), C3(R), C4(R), C5(R), C6(2R)
]);

// ─── Domain / Facet structure ──────────────────────────────────

interface FacetDef {
  key: string;
  label: string;
  domain: string;
  items: number[]; // 0-based indices in the 60-item array
}

const DOMAINS = ['neuroticism', 'extraversion', 'openness', 'agreeableness', 'conscientiousness'];

const DOMAIN_LABELS: Record<string, string> = {
  neuroticism: 'Neuroticism',
  extraversion: 'Extraversion',
  openness: 'Openness to Experience',
  agreeableness: 'Agreeableness',
  conscientiousness: 'Conscientiousness',
};

const DOMAIN_ITEMS: Record<string, number[]> = {
  neuroticism: Array.from({ length: 12 }, (_, i) => i),
  extraversion: Array.from({ length: 12 }, (_, i) => i + 12),
  openness: Array.from({ length: 12 }, (_, i) => i + 24),
  agreeableness: Array.from({ length: 12 }, (_, i) => i + 36),
  conscientiousness: Array.from({ length: 12 }, (_, i) => i + 48),
};

const FACETS: FacetDef[] = [
  // Neuroticism (2 items each)
  { key: 'N1_anxiety', label: 'Anxiety', domain: 'neuroticism', items: [0, 1] },
  { key: 'N2_anger', label: 'Anger', domain: 'neuroticism', items: [2, 3] },
  { key: 'N3_depression', label: 'Depression', domain: 'neuroticism', items: [4, 5] },
  { key: 'N4_selfConsciousness', label: 'Self-Consciousness', domain: 'neuroticism', items: [6, 7] },
  { key: 'N5_immoderation', label: 'Immoderation', domain: 'neuroticism', items: [8, 9] },
  { key: 'N6_vulnerability', label: 'Vulnerability', domain: 'neuroticism', items: [10, 11] },
  // Extraversion (2 items each)
  { key: 'E1_friendliness', label: 'Friendliness', domain: 'extraversion', items: [12, 13] },
  { key: 'E2_gregariousness', label: 'Gregariousness', domain: 'extraversion', items: [14, 15] },
  { key: 'E3_assertiveness', label: 'Assertiveness', domain: 'extraversion', items: [16, 17] },
  { key: 'E4_activityLevel', label: 'Activity Level', domain: 'extraversion', items: [18, 19] },
  { key: 'E5_excitementSeeking', label: 'Excitement-Seeking', domain: 'extraversion', items: [20, 21] },
  { key: 'E6_cheerfulness', label: 'Cheerfulness', domain: 'extraversion', items: [22, 23] },
  // Openness (2 items each)
  { key: 'O1_imagination', label: 'Imagination', domain: 'openness', items: [24, 25] },
  { key: 'O2_artisticInterests', label: 'Artistic Interests', domain: 'openness', items: [26, 27] },
  { key: 'O3_emotionality', label: 'Emotionality', domain: 'openness', items: [28, 29] },
  { key: 'O4_adventurousness', label: 'Adventurousness', domain: 'openness', items: [30, 31] },
  { key: 'O5_intellect', label: 'Intellect', domain: 'openness', items: [32, 33] },
  { key: 'O6_liberalism', label: 'Liberalism', domain: 'openness', items: [34, 35] },
  // Agreeableness (2 items each)
  { key: 'A1_trust', label: 'Trust', domain: 'agreeableness', items: [36, 37] },
  { key: 'A2_morality', label: 'Morality', domain: 'agreeableness', items: [38, 39] },
  { key: 'A3_altruism', label: 'Altruism', domain: 'agreeableness', items: [40, 41] },
  { key: 'A4_cooperation', label: 'Cooperation', domain: 'agreeableness', items: [42, 43] },
  { key: 'A5_modesty', label: 'Modesty', domain: 'agreeableness', items: [44, 45] },
  { key: 'A6_sympathy', label: 'Sympathy', domain: 'agreeableness', items: [46, 47] },
  // Conscientiousness (2 items each)
  { key: 'C1_selfEfficacy', label: 'Self-Efficacy', domain: 'conscientiousness', items: [48, 49] },
  { key: 'C2_orderliness', label: 'Orderliness', domain: 'conscientiousness', items: [50, 51] },
  { key: 'C3_dutifulness', label: 'Dutifulness', domain: 'conscientiousness', items: [52, 53] },
  { key: 'C4_achievementStriving', label: 'Achievement-Striving', domain: 'conscientiousness', items: [54, 55] },
  { key: 'C5_selfDiscipline', label: 'Self-Discipline', domain: 'conscientiousness', items: [56, 57] },
  { key: 'C6_cautiousness', label: 'Cautiousness', domain: 'conscientiousness', items: [58, 59] },
];

// ─── Sections (breaks every 12 items) ────────────────────────

const SECTIONS: AssessmentSection[] = [
  { id: 'neuroticism', title: 'Section 1 of 5', description: 'Questions about emotional reactions and feelings.', questionRange: [0, 11] },
  { id: 'extraversion', title: 'Section 2 of 5', description: 'Questions about social interactions and energy.', questionRange: [12, 23] },
  { id: 'openness', title: 'Section 3 of 5', description: 'Questions about creativity, curiosity, and values.', questionRange: [24, 35] },
  { id: 'agreeableness', title: 'Section 4 of 5', description: 'Questions about how you relate to others.', questionRange: [36, 47] },
  { id: 'conscientiousness', title: 'Section 5 of 5', description: 'Questions about organization, discipline, and goals.', questionRange: [48, 59] },
];

// ─── 60 selected items (2 per facet from original 120) ──────────
// Selection: best-loading items per facet, balancing forward/reverse scoring.
// Original item numbers noted in comments for traceability.

const QUESTIONS: GenericQuestion[] = [
  // ── NEUROTICISM ──────────────────────────
  // N1: Anxiety (orig items 1, 4)
  { id: 1, text: 'Worry about things.', inputType: 'likert', subscale: 'N1_anxiety' },
  { id: 2, text: 'Get stressed out easily.', inputType: 'likert', subscale: 'N1_anxiety' },
  // N2: Anger (orig items 5, 8R)
  { id: 3, text: 'Get angry easily.', inputType: 'likert', subscale: 'N2_anger' },
  { id: 4, text: 'Am not easily annoyed.', inputType: 'likert', subscale: 'N2_anger', reverseScored: true },
  // N3: Depression (orig items 9, 12R)
  { id: 5, text: 'Often feel blue.', inputType: 'likert', subscale: 'N3_depression' },
  { id: 6, text: 'Feel comfortable with myself.', inputType: 'likert', subscale: 'N3_depression', reverseScored: true },
  // N4: Self-Consciousness (orig items 13, 16R)
  { id: 7, text: 'Find it difficult to approach others.', inputType: 'likert', subscale: 'N4_selfConsciousness' },
  { id: 8, text: 'Am not bothered by difficult social situations.', inputType: 'likert', subscale: 'N4_selfConsciousness', reverseScored: true },
  // N5: Immoderation (orig items 17, 18R)
  { id: 9, text: 'Go on binges.', inputType: 'likert', subscale: 'N5_immoderation' },
  { id: 10, text: 'Rarely overindulge.', inputType: 'likert', subscale: 'N5_immoderation', reverseScored: true },
  // N6: Vulnerability (orig items 21, 24R)
  { id: 11, text: 'Panic easily.', inputType: 'likert', subscale: 'N6_vulnerability' },
  { id: 12, text: 'Remain calm under pressure.', inputType: 'likert', subscale: 'N6_vulnerability', reverseScored: true },

  // ── EXTRAVERSION ─────────────────────────
  // E1: Friendliness (orig items 25, 27R)
  { id: 13, text: 'Make friends easily.', inputType: 'likert', subscale: 'E1_friendliness' },
  { id: 14, text: 'Avoid contacts with others.', inputType: 'likert', subscale: 'E1_friendliness', reverseScored: true },
  // E2: Gregariousness (orig items 29, 31R)
  { id: 15, text: 'Love large parties.', inputType: 'likert', subscale: 'E2_gregariousness' },
  { id: 16, text: 'Prefer to be alone.', inputType: 'likert', subscale: 'E2_gregariousness', reverseScored: true },
  // E3: Assertiveness (orig items 33, 36R)
  { id: 17, text: 'Take charge.', inputType: 'likert', subscale: 'E3_assertiveness' },
  { id: 18, text: 'Wait for others to lead the way.', inputType: 'likert', subscale: 'E3_assertiveness', reverseScored: true },
  // E4: Activity Level (orig items 37, 40R)
  { id: 19, text: 'Am always busy.', inputType: 'likert', subscale: 'E4_activityLevel' },
  { id: 20, text: 'Like to take it easy.', inputType: 'likert', subscale: 'E4_activityLevel', reverseScored: true },
  // E5: Excitement-Seeking (orig items 41, 42)
  { id: 21, text: 'Love excitement.', inputType: 'likert', subscale: 'E5_excitementSeeking' },
  { id: 22, text: 'Seek adventure.', inputType: 'likert', subscale: 'E5_excitementSeeking' },
  // E6: Cheerfulness (orig items 45, 46)
  { id: 23, text: 'Radiate joy.', inputType: 'likert', subscale: 'E6_cheerfulness' },
  { id: 24, text: 'Have a lot of fun.', inputType: 'likert', subscale: 'E6_cheerfulness' },

  // ── OPENNESS TO EXPERIENCE ────────────────
  // O1: Imagination (orig items 49, 50)
  { id: 25, text: 'Have a vivid imagination.', inputType: 'likert', subscale: 'O1_imagination' },
  { id: 26, text: 'Enjoy wild flights of fantasy.', inputType: 'likert', subscale: 'O1_imagination' },
  // O2: Artistic Interests (orig items 53, 55R)
  { id: 27, text: 'Believe in the importance of art.', inputType: 'likert', subscale: 'O2_artisticInterests' },
  { id: 28, text: 'Do not like poetry.', inputType: 'likert', subscale: 'O2_artisticInterests', reverseScored: true },
  // O3: Emotionality (orig items 57, 59R)
  { id: 29, text: 'Experience my emotions intensely.', inputType: 'likert', subscale: 'O3_emotionality' },
  { id: 30, text: 'Rarely notice my emotional reactions.', inputType: 'likert', subscale: 'O3_emotionality', reverseScored: true },
  // O4: Adventurousness (orig items 61, 63R)
  { id: 31, text: 'Prefer variety to routine.', inputType: 'likert', subscale: 'O4_adventurousness' },
  { id: 32, text: 'Dislike changes.', inputType: 'likert', subscale: 'O4_adventurousness', reverseScored: true },
  // O5: Intellect (orig items 65, 67R)
  { id: 33, text: 'Love to read challenging material.', inputType: 'likert', subscale: 'O5_intellect' },
  { id: 34, text: 'Have difficulty understanding abstract ideas.', inputType: 'likert', subscale: 'O5_intellect', reverseScored: true },
  // O6: Liberalism (orig items 69, 71R)
  { id: 35, text: 'Tend to vote for liberal political candidates.', inputType: 'likert', subscale: 'O6_liberalism' },
  { id: 36, text: 'Tend to vote for conservative political candidates.', inputType: 'likert', subscale: 'O6_liberalism', reverseScored: true },

  // ── AGREEABLENESS ─────────────────────────
  // A1: Trust (orig items 73, 76R)
  { id: 37, text: 'Trust others.', inputType: 'likert', subscale: 'A1_trust' },
  { id: 38, text: 'Distrust people.', inputType: 'likert', subscale: 'A1_trust', reverseScored: true },
  // A2: Morality (orig items 77R, 78R)
  { id: 39, text: 'Use others for my own ends.', inputType: 'likert', subscale: 'A2_morality', reverseScored: true },
  { id: 40, text: 'Cheat to get ahead.', inputType: 'likert', subscale: 'A2_morality', reverseScored: true },
  // A3: Altruism (orig items 81, 83R)
  { id: 41, text: 'Am concerned about others.', inputType: 'likert', subscale: 'A3_altruism' },
  { id: 42, text: 'Am indifferent to the feelings of others.', inputType: 'likert', subscale: 'A3_altruism', reverseScored: true },
  // A4: Cooperation (orig items 85R, 86R) — MUST have 2+ items (used in synthesis)
  { id: 43, text: 'Love a good fight.', inputType: 'likert', subscale: 'A4_cooperation', reverseScored: true },
  { id: 44, text: 'Yell at people.', inputType: 'likert', subscale: 'A4_cooperation', reverseScored: true },
  // A5: Modesty (orig items 89R, 90R)
  { id: 45, text: 'Believe that I am better than others.', inputType: 'likert', subscale: 'A5_modesty', reverseScored: true },
  { id: 46, text: 'Think highly of myself.', inputType: 'likert', subscale: 'A5_modesty', reverseScored: true },
  // A6: Sympathy (orig items 93, 95R)
  { id: 47, text: 'Sympathize with the homeless.', inputType: 'likert', subscale: 'A6_sympathy' },
  { id: 48, text: 'Am not interested in other people\'s problems.', inputType: 'likert', subscale: 'A6_sympathy', reverseScored: true },

  // ── CONSCIENTIOUSNESS ─────────────────────
  // C1: Self-Efficacy (orig items 97, 98)
  { id: 49, text: 'Complete tasks successfully.', inputType: 'likert', subscale: 'C1_selfEfficacy' },
  { id: 50, text: 'Excel in what I do.', inputType: 'likert', subscale: 'C1_selfEfficacy' },
  // C2: Orderliness (orig items 101, 102R)
  { id: 51, text: 'Like to tidy up.', inputType: 'likert', subscale: 'C2_orderliness' },
  { id: 52, text: 'Often forget to put things back in their proper place.', inputType: 'likert', subscale: 'C2_orderliness', reverseScored: true },
  // C3: Dutifulness (orig items 105, 107R)
  { id: 53, text: 'Keep my promises.', inputType: 'likert', subscale: 'C3_dutifulness' },
  { id: 54, text: 'Break rules.', inputType: 'likert', subscale: 'C3_dutifulness', reverseScored: true },
  // C4: Achievement-Striving (orig items 109, 111R)
  { id: 55, text: 'Do more than what\'s expected of me.', inputType: 'likert', subscale: 'C4_achievementStriving' },
  { id: 56, text: 'Put little time and effort into my work.', inputType: 'likert', subscale: 'C4_achievementStriving', reverseScored: true },
  // C5: Self-Discipline (orig items 113, 115R)
  { id: 57, text: 'Am always prepared.', inputType: 'likert', subscale: 'C5_selfDiscipline' },
  { id: 58, text: 'Waste my time.', inputType: 'likert', subscale: 'C5_selfDiscipline', reverseScored: true },
  // C6: Cautiousness (orig items 117R, 118R)
  { id: 59, text: 'Jump into things without thinking.', inputType: 'likert', subscale: 'C6_cautiousness', reverseScored: true },
  { id: 60, text: 'Make rash decisions.', inputType: 'likert', subscale: 'C6_cautiousness', reverseScored: true },
];

// ─── Percentile via logistic CDF ─────────────────────────────

function toPercentile(sum: number, min: number, max: number): number {
  const range = max - min;
  const midpoint = min + range / 2;
  const sd = range / 6;
  const z = (sum - midpoint) / sd;
  const percentile = Math.round((1 / (1 + Math.exp(-1.7 * z))) * 100);
  return Math.max(1, Math.min(99, percentile));
}

// ─── Scoring ─────────────────────────────────────────────────

function scoreIPIP(responses: (number | string | string[] | null)[]): IPIPScores {
  const nums = responses as number[];
  if (nums.length !== 60) throw new Error('IPIP-NEO-60 requires 60 responses');

  // Reverse score
  const scored = nums.map((r, i) => (REVERSE_ITEMS.has(i) ? 6 - r : r));

  // Facet scores (2 items each)
  const facetScores: Record<string, { sum: number; mean: number }> = {};
  const facetPercentiles: Record<string, number> = {};
  for (const facet of FACETS) {
    const sum = facet.items.reduce((s, i) => s + scored[i], 0);
    facetScores[facet.key] = {
      sum,
      mean: Math.round((sum / 2) * 100) / 100,
    };
    facetPercentiles[facet.key] = toPercentile(sum, 2, 10);
  }

  // Domain scores (12 items each)
  const domainScores: Record<string, { sum: number; mean: number }> = {};
  const domainPercentiles: Record<string, number> = {};
  for (const domain of DOMAINS) {
    const items = DOMAIN_ITEMS[domain];
    const sum = items.reduce((s, i) => s + scored[i], 0);
    domainScores[domain] = {
      sum,
      mean: Math.round((sum / 12) * 100) / 100,
    };
    domainPercentiles[domain] = toPercentile(sum, 12, 60);
  }

  return { domainScores, domainPercentiles, facetScores, facetPercentiles };
}

// ─── Export config ───────────────────────────────────────────

export const ipipConfig: AssessmentConfig = {
  type: 'ipip-neo-120',
  name: 'Personality',
  shortName: 'IPIP-NEO-120',
  description: 'Explore your Big Five personality traits across 30 facets.',
  instructions:
    'Describe yourself as you generally are now, not as you wish to be in the future. Describe yourself as you honestly see yourself, in relation to other people you know of the same sex as you are, and roughly your same age. Indicate how accurately each statement describes you.',
  estimatedMinutes: 12,
  totalQuestions: 60,
  questions: QUESTIONS,
  likertScale: LIKERT_SCALE,
  sections: SECTIONS,
  scoringFn: scoreIPIP,
  progressKey: 'ipip_progress',
};

export { FACETS, DOMAINS, DOMAIN_LABELS, DOMAIN_ITEMS };
