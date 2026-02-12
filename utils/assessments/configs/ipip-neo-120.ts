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

// 0-based indices of reverse-scored items
const REVERSE_ITEMS = new Set([
  7, 11, 15, 17, 18, 19, 23,           // Neuroticism: items 8,12,16,18,19,20,24
  26, 27, 30, 31, 35, 39,              // Extraversion: items 27,28,31,32,36,40
  54, 55, 58, 59, 61, 62, 63, 65, 66, 67, 70, 71, // Openness: items 55,56,59,60,62,63,64,66,67,68,71,72
  75, 76, 77, 78, 79, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 94, 95, // Agreeableness
  101, 102, 103, 106, 107, 110, 111, 114, 115, 116, 117, 118, 119, // Conscientiousness
]);

// ─── Domain / Facet structure ──────────────────────────────────

interface FacetDef {
  key: string;
  label: string;
  domain: string;
  items: number[]; // 0-based indices
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
  neuroticism: Array.from({ length: 24 }, (_, i) => i),
  extraversion: Array.from({ length: 24 }, (_, i) => i + 24),
  openness: Array.from({ length: 24 }, (_, i) => i + 48),
  agreeableness: Array.from({ length: 24 }, (_, i) => i + 72),
  conscientiousness: Array.from({ length: 24 }, (_, i) => i + 96),
};

const FACETS: FacetDef[] = [
  // Neuroticism
  { key: 'N1_anxiety', label: 'Anxiety', domain: 'neuroticism', items: [0, 1, 2, 3] },
  { key: 'N2_anger', label: 'Anger', domain: 'neuroticism', items: [4, 5, 6, 7] },
  { key: 'N3_depression', label: 'Depression', domain: 'neuroticism', items: [8, 9, 10, 11] },
  { key: 'N4_selfConsciousness', label: 'Self-Consciousness', domain: 'neuroticism', items: [12, 13, 14, 15] },
  { key: 'N5_immoderation', label: 'Immoderation', domain: 'neuroticism', items: [16, 17, 18, 19] },
  { key: 'N6_vulnerability', label: 'Vulnerability', domain: 'neuroticism', items: [20, 21, 22, 23] },
  // Extraversion
  { key: 'E1_friendliness', label: 'Friendliness', domain: 'extraversion', items: [24, 25, 26, 27] },
  { key: 'E2_gregariousness', label: 'Gregariousness', domain: 'extraversion', items: [28, 29, 30, 31] },
  { key: 'E3_assertiveness', label: 'Assertiveness', domain: 'extraversion', items: [32, 33, 34, 35] },
  { key: 'E4_activityLevel', label: 'Activity Level', domain: 'extraversion', items: [36, 37, 38, 39] },
  { key: 'E5_excitementSeeking', label: 'Excitement-Seeking', domain: 'extraversion', items: [40, 41, 42, 43] },
  { key: 'E6_cheerfulness', label: 'Cheerfulness', domain: 'extraversion', items: [44, 45, 46, 47] },
  // Openness
  { key: 'O1_imagination', label: 'Imagination', domain: 'openness', items: [48, 49, 50, 51] },
  { key: 'O2_artisticInterests', label: 'Artistic Interests', domain: 'openness', items: [52, 53, 54, 55] },
  { key: 'O3_emotionality', label: 'Emotionality', domain: 'openness', items: [56, 57, 58, 59] },
  { key: 'O4_adventurousness', label: 'Adventurousness', domain: 'openness', items: [60, 61, 62, 63] },
  { key: 'O5_intellect', label: 'Intellect', domain: 'openness', items: [64, 65, 66, 67] },
  { key: 'O6_liberalism', label: 'Liberalism', domain: 'openness', items: [68, 69, 70, 71] },
  // Agreeableness
  { key: 'A1_trust', label: 'Trust', domain: 'agreeableness', items: [72, 73, 74, 75] },
  { key: 'A2_morality', label: 'Morality', domain: 'agreeableness', items: [76, 77, 78, 79] },
  { key: 'A3_altruism', label: 'Altruism', domain: 'agreeableness', items: [80, 81, 82, 83] },
  { key: 'A4_cooperation', label: 'Cooperation', domain: 'agreeableness', items: [84, 85, 86, 87] },
  { key: 'A5_modesty', label: 'Modesty', domain: 'agreeableness', items: [88, 89, 90, 91] },
  { key: 'A6_sympathy', label: 'Sympathy', domain: 'agreeableness', items: [92, 93, 94, 95] },
  // Conscientiousness
  { key: 'C1_selfEfficacy', label: 'Self-Efficacy', domain: 'conscientiousness', items: [96, 97, 98, 99] },
  { key: 'C2_orderliness', label: 'Orderliness', domain: 'conscientiousness', items: [100, 101, 102, 103] },
  { key: 'C3_dutifulness', label: 'Dutifulness', domain: 'conscientiousness', items: [104, 105, 106, 107] },
  { key: 'C4_achievementStriving', label: 'Achievement-Striving', domain: 'conscientiousness', items: [108, 109, 110, 111] },
  { key: 'C5_selfDiscipline', label: 'Self-Discipline', domain: 'conscientiousness', items: [112, 113, 114, 115] },
  { key: 'C6_cautiousness', label: 'Cautiousness', domain: 'conscientiousness', items: [116, 117, 118, 119] },
];

// ─── Sections (breaks every 24 items) ────────────────────────

const SECTIONS: AssessmentSection[] = [
  { id: 'neuroticism', title: 'Section 1 of 5', description: 'Questions about emotional reactions and feelings.', questionRange: [0, 23] },
  { id: 'extraversion', title: 'Section 2 of 5', description: 'Questions about social interactions and energy.', questionRange: [24, 47] },
  { id: 'openness', title: 'Section 3 of 5', description: 'Questions about creativity, curiosity, and values.', questionRange: [48, 71] },
  { id: 'agreeableness', title: 'Section 4 of 5', description: 'Questions about how you relate to others.', questionRange: [72, 95] },
  { id: 'conscientiousness', title: 'Section 5 of 5', description: 'Questions about organization, discipline, and goals.', questionRange: [96, 119] },
];

// ─── All 120 questions ───────────────────────────────────────

const QUESTIONS: GenericQuestion[] = [
  // ── NEUROTICISM ──────────────────────────
  // N1: Anxiety
  { id: 1, text: 'Worry about things.', inputType: 'likert', subscale: 'N1_anxiety' },
  { id: 2, text: 'Fear for the worst.', inputType: 'likert', subscale: 'N1_anxiety' },
  { id: 3, text: 'Am afraid of many things.', inputType: 'likert', subscale: 'N1_anxiety' },
  { id: 4, text: 'Get stressed out easily.', inputType: 'likert', subscale: 'N1_anxiety' },
  // N2: Anger
  { id: 5, text: 'Get angry easily.', inputType: 'likert', subscale: 'N2_anger' },
  { id: 6, text: 'Get irritated easily.', inputType: 'likert', subscale: 'N2_anger' },
  { id: 7, text: 'Lose my temper.', inputType: 'likert', subscale: 'N2_anger' },
  { id: 8, text: 'Am not easily annoyed.', inputType: 'likert', subscale: 'N2_anger', reverseScored: true },
  // N3: Depression
  { id: 9, text: 'Often feel blue.', inputType: 'likert', subscale: 'N3_depression' },
  { id: 10, text: 'Dislike myself.', inputType: 'likert', subscale: 'N3_depression' },
  { id: 11, text: 'Am often down in the dumps.', inputType: 'likert', subscale: 'N3_depression' },
  { id: 12, text: 'Feel comfortable with myself.', inputType: 'likert', subscale: 'N3_depression', reverseScored: true },
  // N4: Self-Consciousness
  { id: 13, text: 'Find it difficult to approach others.', inputType: 'likert', subscale: 'N4_selfConsciousness' },
  { id: 14, text: 'Am afraid to draw attention to myself.', inputType: 'likert', subscale: 'N4_selfConsciousness' },
  { id: 15, text: 'Only feel comfortable with friends.', inputType: 'likert', subscale: 'N4_selfConsciousness' },
  { id: 16, text: 'Am not bothered by difficult social situations.', inputType: 'likert', subscale: 'N4_selfConsciousness', reverseScored: true },
  // N5: Immoderation
  { id: 17, text: 'Go on binges.', inputType: 'likert', subscale: 'N5_immoderation' },
  { id: 18, text: 'Rarely overindulge.', inputType: 'likert', subscale: 'N5_immoderation', reverseScored: true },
  { id: 19, text: 'Easily resist temptations.', inputType: 'likert', subscale: 'N5_immoderation', reverseScored: true },
  { id: 20, text: 'Am able to control my cravings.', inputType: 'likert', subscale: 'N5_immoderation', reverseScored: true },
  // N6: Vulnerability
  { id: 21, text: 'Panic easily.', inputType: 'likert', subscale: 'N6_vulnerability' },
  { id: 22, text: 'Become overwhelmed by events.', inputType: 'likert', subscale: 'N6_vulnerability' },
  { id: 23, text: 'Feel that I\'m unable to deal with things.', inputType: 'likert', subscale: 'N6_vulnerability' },
  { id: 24, text: 'Remain calm under pressure.', inputType: 'likert', subscale: 'N6_vulnerability', reverseScored: true },

  // ── EXTRAVERSION ─────────────────────────
  // E1: Friendliness
  { id: 25, text: 'Make friends easily.', inputType: 'likert', subscale: 'E1_friendliness' },
  { id: 26, text: 'Feel comfortable around people.', inputType: 'likert', subscale: 'E1_friendliness' },
  { id: 27, text: 'Avoid contacts with others.', inputType: 'likert', subscale: 'E1_friendliness', reverseScored: true },
  { id: 28, text: 'Keep others at a distance.', inputType: 'likert', subscale: 'E1_friendliness', reverseScored: true },
  // E2: Gregariousness
  { id: 29, text: 'Love large parties.', inputType: 'likert', subscale: 'E2_gregariousness' },
  { id: 30, text: 'Talk to a lot of different people at parties.', inputType: 'likert', subscale: 'E2_gregariousness' },
  { id: 31, text: 'Prefer to be alone.', inputType: 'likert', subscale: 'E2_gregariousness', reverseScored: true },
  { id: 32, text: 'Avoid crowds.', inputType: 'likert', subscale: 'E2_gregariousness', reverseScored: true },
  // E3: Assertiveness
  { id: 33, text: 'Take charge.', inputType: 'likert', subscale: 'E3_assertiveness' },
  { id: 34, text: 'Try to lead others.', inputType: 'likert', subscale: 'E3_assertiveness' },
  { id: 35, text: 'Take control of things.', inputType: 'likert', subscale: 'E3_assertiveness' },
  { id: 36, text: 'Wait for others to lead the way.', inputType: 'likert', subscale: 'E3_assertiveness', reverseScored: true },
  // E4: Activity Level
  { id: 37, text: 'Am always busy.', inputType: 'likert', subscale: 'E4_activityLevel' },
  { id: 38, text: 'Am always on the go.', inputType: 'likert', subscale: 'E4_activityLevel' },
  { id: 39, text: 'Do a lot in my spare time.', inputType: 'likert', subscale: 'E4_activityLevel' },
  { id: 40, text: 'Like to take it easy.', inputType: 'likert', subscale: 'E4_activityLevel', reverseScored: true },
  // E5: Excitement-Seeking
  { id: 41, text: 'Love excitement.', inputType: 'likert', subscale: 'E5_excitementSeeking' },
  { id: 42, text: 'Seek adventure.', inputType: 'likert', subscale: 'E5_excitementSeeking' },
  { id: 43, text: 'Enjoy being reckless.', inputType: 'likert', subscale: 'E5_excitementSeeking' },
  { id: 44, text: 'Act wild and crazy.', inputType: 'likert', subscale: 'E5_excitementSeeking' },
  // E6: Cheerfulness
  { id: 45, text: 'Radiate joy.', inputType: 'likert', subscale: 'E6_cheerfulness' },
  { id: 46, text: 'Have a lot of fun.', inputType: 'likert', subscale: 'E6_cheerfulness' },
  { id: 47, text: 'Love life.', inputType: 'likert', subscale: 'E6_cheerfulness' },
  { id: 48, text: 'Look at the bright side of life.', inputType: 'likert', subscale: 'E6_cheerfulness' },

  // ── OPENNESS TO EXPERIENCE ────────────────
  // O1: Imagination
  { id: 49, text: 'Have a vivid imagination.', inputType: 'likert', subscale: 'O1_imagination' },
  { id: 50, text: 'Enjoy wild flights of fantasy.', inputType: 'likert', subscale: 'O1_imagination' },
  { id: 51, text: 'Love to daydream.', inputType: 'likert', subscale: 'O1_imagination' },
  { id: 52, text: 'Like to get lost in thought.', inputType: 'likert', subscale: 'O1_imagination' },
  // O2: Artistic Interests
  { id: 53, text: 'Believe in the importance of art.', inputType: 'likert', subscale: 'O2_artisticInterests' },
  { id: 54, text: 'See beauty in things that others might not notice.', inputType: 'likert', subscale: 'O2_artisticInterests' },
  { id: 55, text: 'Do not like poetry.', inputType: 'likert', subscale: 'O2_artisticInterests', reverseScored: true },
  { id: 56, text: 'Do not enjoy going to art museums.', inputType: 'likert', subscale: 'O2_artisticInterests', reverseScored: true },
  // O3: Emotionality
  { id: 57, text: 'Experience my emotions intensely.', inputType: 'likert', subscale: 'O3_emotionality' },
  { id: 58, text: 'Feel others\' emotions.', inputType: 'likert', subscale: 'O3_emotionality' },
  { id: 59, text: 'Rarely notice my emotional reactions.', inputType: 'likert', subscale: 'O3_emotionality', reverseScored: true },
  { id: 60, text: 'Don\'t understand people who get emotional.', inputType: 'likert', subscale: 'O3_emotionality', reverseScored: true },
  // O4: Adventurousness
  { id: 61, text: 'Prefer variety to routine.', inputType: 'likert', subscale: 'O4_adventurousness' },
  { id: 62, text: 'Prefer to stick with things that I know.', inputType: 'likert', subscale: 'O4_adventurousness', reverseScored: true },
  { id: 63, text: 'Dislike changes.', inputType: 'likert', subscale: 'O4_adventurousness', reverseScored: true },
  { id: 64, text: 'Am attached to conventional ways.', inputType: 'likert', subscale: 'O4_adventurousness', reverseScored: true },
  // O5: Intellect
  { id: 65, text: 'Love to read challenging material.', inputType: 'likert', subscale: 'O5_intellect' },
  { id: 66, text: 'Avoid philosophical discussions.', inputType: 'likert', subscale: 'O5_intellect', reverseScored: true },
  { id: 67, text: 'Have difficulty understanding abstract ideas.', inputType: 'likert', subscale: 'O5_intellect', reverseScored: true },
  { id: 68, text: 'Am not interested in theoretical discussions.', inputType: 'likert', subscale: 'O5_intellect', reverseScored: true },
  // O6: Liberalism
  { id: 69, text: 'Tend to vote for liberal political candidates.', inputType: 'likert', subscale: 'O6_liberalism' },
  { id: 70, text: 'Believe that there is no absolute right and wrong.', inputType: 'likert', subscale: 'O6_liberalism' },
  { id: 71, text: 'Tend to vote for conservative political candidates.', inputType: 'likert', subscale: 'O6_liberalism', reverseScored: true },
  { id: 72, text: 'Believe that we should be tough on crime.', inputType: 'likert', subscale: 'O6_liberalism', reverseScored: true },

  // ── AGREEABLENESS ─────────────────────────
  // A1: Trust
  { id: 73, text: 'Trust others.', inputType: 'likert', subscale: 'A1_trust' },
  { id: 74, text: 'Believe that others have good intentions.', inputType: 'likert', subscale: 'A1_trust' },
  { id: 75, text: 'Trust what people say.', inputType: 'likert', subscale: 'A1_trust' },
  { id: 76, text: 'Distrust people.', inputType: 'likert', subscale: 'A1_trust', reverseScored: true },
  // A2: Morality
  { id: 77, text: 'Use others for my own ends.', inputType: 'likert', subscale: 'A2_morality', reverseScored: true },
  { id: 78, text: 'Cheat to get ahead.', inputType: 'likert', subscale: 'A2_morality', reverseScored: true },
  { id: 79, text: 'Take advantage of others.', inputType: 'likert', subscale: 'A2_morality', reverseScored: true },
  { id: 80, text: 'Obstruct others\' plans.', inputType: 'likert', subscale: 'A2_morality', reverseScored: true },
  // A3: Altruism
  { id: 81, text: 'Am concerned about others.', inputType: 'likert', subscale: 'A3_altruism' },
  { id: 82, text: 'Love to help others.', inputType: 'likert', subscale: 'A3_altruism' },
  { id: 83, text: 'Am indifferent to the feelings of others.', inputType: 'likert', subscale: 'A3_altruism', reverseScored: true },
  { id: 84, text: 'Take no time for others.', inputType: 'likert', subscale: 'A3_altruism', reverseScored: true },
  // A4: Cooperation
  { id: 85, text: 'Love a good fight.', inputType: 'likert', subscale: 'A4_cooperation', reverseScored: true },
  { id: 86, text: 'Yell at people.', inputType: 'likert', subscale: 'A4_cooperation', reverseScored: true },
  { id: 87, text: 'Insult people.', inputType: 'likert', subscale: 'A4_cooperation', reverseScored: true },
  { id: 88, text: 'Get back at others.', inputType: 'likert', subscale: 'A4_cooperation', reverseScored: true },
  // A5: Modesty
  { id: 89, text: 'Believe that I am better than others.', inputType: 'likert', subscale: 'A5_modesty', reverseScored: true },
  { id: 90, text: 'Think highly of myself.', inputType: 'likert', subscale: 'A5_modesty', reverseScored: true },
  { id: 91, text: 'Have a high opinion of myself.', inputType: 'likert', subscale: 'A5_modesty', reverseScored: true },
  { id: 92, text: 'Boast about my virtues.', inputType: 'likert', subscale: 'A5_modesty', reverseScored: true },
  // A6: Sympathy
  { id: 93, text: 'Sympathize with the homeless.', inputType: 'likert', subscale: 'A6_sympathy' },
  { id: 94, text: 'Feel sympathy for those who are worse off than myself.', inputType: 'likert', subscale: 'A6_sympathy' },
  { id: 95, text: 'Am not interested in other people\'s problems.', inputType: 'likert', subscale: 'A6_sympathy', reverseScored: true },
  { id: 96, text: 'Try not to think about the needy.', inputType: 'likert', subscale: 'A6_sympathy', reverseScored: true },

  // ── CONSCIENTIOUSNESS ─────────────────────
  // C1: Self-Efficacy
  { id: 97, text: 'Complete tasks successfully.', inputType: 'likert', subscale: 'C1_selfEfficacy' },
  { id: 98, text: 'Excel in what I do.', inputType: 'likert', subscale: 'C1_selfEfficacy' },
  { id: 99, text: 'Handle tasks smoothly.', inputType: 'likert', subscale: 'C1_selfEfficacy' },
  { id: 100, text: 'Know how to get things done.', inputType: 'likert', subscale: 'C1_selfEfficacy' },
  // C2: Orderliness
  { id: 101, text: 'Like to tidy up.', inputType: 'likert', subscale: 'C2_orderliness' },
  { id: 102, text: 'Often forget to put things back in their proper place.', inputType: 'likert', subscale: 'C2_orderliness', reverseScored: true },
  { id: 103, text: 'Leave a mess in my room.', inputType: 'likert', subscale: 'C2_orderliness', reverseScored: true },
  { id: 104, text: 'Leave my belongings around.', inputType: 'likert', subscale: 'C2_orderliness', reverseScored: true },
  // C3: Dutifulness
  { id: 105, text: 'Keep my promises.', inputType: 'likert', subscale: 'C3_dutifulness' },
  { id: 106, text: 'Tell the truth.', inputType: 'likert', subscale: 'C3_dutifulness' },
  { id: 107, text: 'Break rules.', inputType: 'likert', subscale: 'C3_dutifulness', reverseScored: true },
  { id: 108, text: 'Break my promises.', inputType: 'likert', subscale: 'C3_dutifulness', reverseScored: true },
  // C4: Achievement-Striving
  { id: 109, text: 'Do more than what\'s expected of me.', inputType: 'likert', subscale: 'C4_achievementStriving' },
  { id: 110, text: 'Work hard.', inputType: 'likert', subscale: 'C4_achievementStriving' },
  { id: 111, text: 'Put little time and effort into my work.', inputType: 'likert', subscale: 'C4_achievementStriving', reverseScored: true },
  { id: 112, text: 'Do just enough work to get by.', inputType: 'likert', subscale: 'C4_achievementStriving', reverseScored: true },
  // C5: Self-Discipline
  { id: 113, text: 'Am always prepared.', inputType: 'likert', subscale: 'C5_selfDiscipline' },
  { id: 114, text: 'Carry out my plans.', inputType: 'likert', subscale: 'C5_selfDiscipline' },
  { id: 115, text: 'Waste my time.', inputType: 'likert', subscale: 'C5_selfDiscipline', reverseScored: true },
  { id: 116, text: 'Have difficulty starting tasks.', inputType: 'likert', subscale: 'C5_selfDiscipline', reverseScored: true },
  // C6: Cautiousness
  { id: 117, text: 'Jump into things without thinking.', inputType: 'likert', subscale: 'C6_cautiousness', reverseScored: true },
  { id: 118, text: 'Make rash decisions.', inputType: 'likert', subscale: 'C6_cautiousness', reverseScored: true },
  { id: 119, text: 'Rush into things.', inputType: 'likert', subscale: 'C6_cautiousness', reverseScored: true },
  { id: 120, text: 'Act without thinking.', inputType: 'likert', subscale: 'C6_cautiousness', reverseScored: true },
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
  if (nums.length !== 120) throw new Error('IPIP-NEO-120 requires 120 responses');

  // Reverse score
  const scored = nums.map((r, i) => (REVERSE_ITEMS.has(i) ? 6 - r : r));

  // Facet scores
  const facetScores: Record<string, { sum: number; mean: number }> = {};
  const facetPercentiles: Record<string, number> = {};
  for (const facet of FACETS) {
    const sum = facet.items.reduce((s, i) => s + scored[i], 0);
    facetScores[facet.key] = {
      sum,
      mean: Math.round((sum / 4) * 100) / 100,
    };
    facetPercentiles[facet.key] = toPercentile(sum, 4, 20);
  }

  // Domain scores
  const domainScores: Record<string, { sum: number; mean: number }> = {};
  const domainPercentiles: Record<string, number> = {};
  for (const domain of DOMAINS) {
    const items = DOMAIN_ITEMS[domain];
    const sum = items.reduce((s, i) => s + scored[i], 0);
    domainScores[domain] = {
      sum,
      mean: Math.round((sum / 24) * 100) / 100,
    };
    domainPercentiles[domain] = toPercentile(sum, 24, 120);
  }

  return { domainScores, domainPercentiles, facetScores, facetPercentiles };
}

// ─── Export config ───────────────────────────────────────────

export const ipipConfig: AssessmentConfig = {
  type: 'ipip-neo-120',
  name: 'Personality (IPIP-NEO-120)',
  shortName: 'IPIP-NEO-120',
  description: 'Explore your Big Five personality traits across 30 facets.',
  instructions:
    'Describe yourself as you generally are now, not as you wish to be in the future. Describe yourself as you honestly see yourself, in relation to other people you know of the same sex as you are, and roughly your same age. Indicate how accurately each statement describes you.',
  estimatedMinutes: 22,
  totalQuestions: 120,
  questions: QUESTIONS,
  likertScale: LIKERT_SCALE,
  sections: SECTIONS,
  scoringFn: scoreIPIP,
  progressKey: 'ipip_progress',
};

export { FACETS, DOMAINS, DOMAIN_LABELS, DOMAIN_ITEMS };
