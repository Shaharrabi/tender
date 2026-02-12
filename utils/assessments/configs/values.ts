import { AssessmentConfig, GenericQuestion, LikertOption, AssessmentSection, ValuesScores } from '@/types';

// ─── Value Domains ──────────────────────────────────────────

const VALUE_DOMAINS = [
  { id: 'intimacy', label: 'Intimacy & Connection', description: 'Emotional closeness, vulnerability, being deeply known and knowing your partner' },
  { id: 'honesty', label: 'Honesty & Authenticity', description: 'Truthfulness, being genuine, transparency, saying what you really think and feel' },
  { id: 'growth', label: 'Growth & Learning', description: 'Personal development, curiosity, evolving together, becoming better people' },
  { id: 'security', label: 'Security & Stability', description: 'Safety, predictability, reliability, commitment, knowing you can count on each other' },
  { id: 'adventure', label: 'Adventure & Novelty', description: 'New experiences, spontaneity, excitement, trying new things together' },
  { id: 'independence', label: 'Independence & Autonomy', description: 'Personal space, self-direction, maintaining your individual identity' },
  { id: 'family', label: 'Family & Legacy', description: 'Children, extended family connections, creating something lasting together' },
  { id: 'service', label: 'Service & Contribution', description: 'Giving back, helping others, making a difference in the world together' },
  { id: 'playfulness', label: 'Playfulness & Humor', description: 'Fun, lightness, laughter, not taking things too seriously' },
  { id: 'spirituality', label: 'Spirituality & Meaning', description: 'Transcendence, purpose, connection to something larger than yourselves' },
];

// ─── Likert Scales ──────────────────────────────────────────

const IMPORTANCE_SCALE: LikertOption[] = [
  { value: 1, label: 'Not at all important' },
  { value: 2, label: 'Slightly important' },
  { value: 3, label: 'Somewhat important' },
  { value: 4, label: 'Moderately important' },
  { value: 5, label: 'Important' },
  { value: 6, label: 'Very important' },
  { value: 7, label: 'Quite important' },
  { value: 8, label: 'Highly important' },
  { value: 9, label: 'Extremely important' },
  { value: 10, label: 'Absolutely central to my life' },
];

const ACCORDANCE_SCALE: LikertOption[] = [
  { value: 1, label: 'Not at all' },
  { value: 2, label: 'Very little' },
  { value: 3, label: 'A little' },
  { value: 4, label: 'Somewhat' },
  { value: 5, label: 'Moderately' },
  { value: 6, label: 'Fairly well' },
  { value: 7, label: 'Well' },
  { value: 8, label: 'Very well' },
  { value: 9, label: 'Extremely well' },
  { value: 10, label: 'Completely/Fully' },
];

// ─── Sections ───────────────────────────────────────────────

const SECTIONS: AssessmentSection[] = [
  { id: 'scaled', title: 'Part 1: Your Values', description: 'Rate how important each value is to you, and how well you\'re currently living it.', questionRange: [0, 20] },
  { id: 'text', title: 'Part 2: Reflection', description: 'Share your thoughts in your own words. There are no right answers.', questionRange: [21, 23] },
  { id: 'scenarios', title: 'Part 3: Values in Action', description: 'Choose the response that best describes what you would typically do — not what you think you should do.', questionRange: [24, 31] },
];

// ─── Questions ──────────────────────────────────────────────

const QUESTIONS: GenericQuestion[] = [
  // Part 1: Importance/Accordance pairs (Q1-20)
  // Each domain has 2 questions: importance then accordance
  ...VALUE_DOMAINS.flatMap((domain, i) => [
    {
      id: i * 2 + 1,
      text: `How important is ${domain.label} to you in your life and relationships?`,
      inputType: 'likert' as const,
      subscale: `${domain.id}_importance`,
    },
    {
      id: i * 2 + 2,
      text: `How fully are you currently living this value (${domain.label}) in your relationship?`,
      inputType: 'likert' as const,
      subscale: `${domain.id}_accordance`,
      likertScale: ACCORDANCE_SCALE,
    },
  ]),

  // Part 1: Ranking exercise (Q21)
  {
    id: 21,
    text: 'Of these 10 value domains, please rank your top 5 in order of importance to who you want to be as a partner.',
    inputType: 'ranking',
    rankingItems: VALUE_DOMAINS.map((d) => ({
      id: d.id,
      label: d.label,
      description: d.description,
    })),
    rankCount: 5,
  },

  // Part 2: Open text (Q22-24)
  {
    id: 22,
    text: 'What kind of partner do you most want to be? Describe the qualities you want to embody in your relationship.',
    inputType: 'text',
    charLimit: 500,
    placeholder: 'Describe the partner you aspire to be...',
  },
  {
    id: 23,
    text: 'What matters so much to you that you wouldn\'t compromise on it in a relationship?',
    inputType: 'text',
    charLimit: 500,
    placeholder: 'Share your non-negotiables...',
  },
  {
    id: 24,
    text: 'Imagine your relationship at its best, five years from now. What does it look like? What are you doing together? How do you treat each other?',
    inputType: 'text',
    charLimit: 750,
    placeholder: 'Describe your ideal future...',
  },

  // Part 3: Scenarios (Q25-32)
  {
    id: 25,
    text: 'When my partner does something that bothers me but mentioning it might cause conflict, I tend to:',
    inputType: 'choice',
    subscale: 'honesty_harmony',
    choices: [
      { key: 'A', text: 'Say something right away, even if it\'s uncomfortable', coding: 'honesty_high' },
      { key: 'B', text: 'Wait for the right moment, then bring it up carefully', coding: 'honesty_moderate' },
      { key: 'C', text: 'Let it go unless it happens repeatedly', coding: 'harmony_moderate' },
      { key: 'D', text: 'Keep it to myself to avoid tension', coding: 'avoidance' },
    ],
  },
  {
    id: 26,
    text: 'When I need alone time but my partner wants to spend time together, I tend to:',
    inputType: 'choice',
    subscale: 'autonomy_connection',
    choices: [
      { key: 'A', text: 'Take the space I need and trust they\'ll understand', coding: 'autonomy_high' },
      { key: 'B', text: 'Negotiate a compromise — some together, some apart', coding: 'balanced' },
      { key: 'C', text: 'Put aside my need and be present with them', coding: 'connection_high' },
      { key: 'D', text: 'Go along with togetherness but feel resentful', coding: 'avoidance' },
    ],
  },
  {
    id: 27,
    text: 'When there\'s an opportunity for something new but it would disrupt our routine, I tend to:',
    inputType: 'choice',
    subscale: 'growth_stability',
    choices: [
      { key: 'A', text: 'Push for the new experience', coding: 'growth_high' },
      { key: 'B', text: 'Discuss it and weigh the trade-offs together', coding: 'balanced' },
      { key: 'C', text: 'Default to keeping things stable unless there\'s a strong reason to change', coding: 'stability_high' },
      { key: 'D', text: 'Avoid the decision as long as possible', coding: 'avoidance' },
    ],
  },
  {
    id: 28,
    text: 'When my partner has a strong opinion that differs from mine, I tend to:',
    inputType: 'choice',
    subscale: 'authenticity_accommodation',
    choices: [
      { key: 'A', text: 'State my view clearly, even if we disagree', coding: 'authenticity_high' },
      { key: 'B', text: 'Share my perspective but remain open to theirs', coding: 'balanced' },
      { key: 'C', text: 'Listen to understand their view before sharing mine', coding: 'connection_high' },
      { key: 'D', text: 'Go along with their opinion to keep peace', coding: 'avoidance' },
    ],
  },
  {
    id: 29,
    text: 'When my partner asks me to share something vulnerable, I tend to:',
    inputType: 'choice',
    subscale: 'intimacy_protection',
    choices: [
      { key: 'A', text: 'Share openly, even if it\'s uncomfortable', coding: 'intimacy_high' },
      { key: 'B', text: 'Share gradually, testing how they respond', coding: 'intimacy_moderate' },
      { key: 'C', text: 'Share only what feels safe', coding: 'protection_moderate' },
      { key: 'D', text: 'Deflect or change the subject', coding: 'avoidance' },
    ],
  },
  {
    id: 30,
    text: 'When something goes wrong in a minor way (small mishap, forgotten task), I tend to:',
    inputType: 'choice',
    subscale: 'playfulness_seriousness',
    choices: [
      { key: 'A', text: 'Laugh it off and find the humor', coding: 'playfulness_high' },
      { key: 'B', text: 'Keep it light while still addressing it', coding: 'balanced' },
      { key: 'C', text: 'Focus on fixing the problem', coding: 'seriousness_high' },
      { key: 'D', text: 'Feel annoyed even if I don\'t show it', coding: 'reactivity' },
    ],
  },
  {
    id: 31,
    text: 'When my partner needs support but I\'m already depleted, I tend to:',
    inputType: 'choice',
    subscale: 'service_selfcare',
    choices: [
      { key: 'A', text: 'Show up for them anyway', coding: 'service_high' },
      { key: 'B', text: 'Offer what I can while naming my limits', coding: 'balanced' },
      { key: 'C', text: 'Ask to help later when I have more capacity', coding: 'selfcare_high' },
      { key: 'D', text: 'Help but feel resentful about it', coding: 'avoidance' },
    ],
  },
  {
    id: 32,
    text: 'When telling the full truth might hurt my partner unnecessarily, I tend to:',
    inputType: 'choice',
    subscale: 'security_honesty',
    choices: [
      { key: 'A', text: 'Tell the truth anyway — they deserve to know', coding: 'honesty_high' },
      { key: 'B', text: 'Tell the truth with care for how I deliver it', coding: 'balanced' },
      { key: 'C', text: 'Soften or omit details to protect their feelings', coding: 'protection_moderate' },
      { key: 'D', text: 'Avoid the conversation entirely', coding: 'avoidance' },
    ],
  },
];

// ─── Scoring ────────────────────────────────────────────────

function scoreValues(responses: (number | string | string[] | null)[]): ValuesScores {
  // Part 1: Domain scores (importance/accordance pairs)
  const domainScores: Record<string, { importance: number; accordance: number; gap: number }> = {};
  VALUE_DOMAINS.forEach((domain, i) => {
    const importance = responses[i * 2] as number;
    const accordance = responses[i * 2 + 1] as number;
    domainScores[domain.id] = {
      importance,
      accordance,
      gap: importance - accordance,
    };
  });

  // Part 1: Ranking (index 20)
  const top5Values = (responses[20] as string[]) || [];

  // Part 2: Qualitative (indices 21-23)
  const qualitativeResponses = {
    partnerIdentity: (responses[21] as string) || '',
    nonNegotiables: (responses[22] as string) || '',
    aspirationalVision: (responses[23] as string) || '',
  };

  // Part 3: Scenario coding (indices 24-31)
  const scenarioQuestions = QUESTIONS.slice(24); // Q25-Q32
  const actionResponses: Record<string, string> = {};
  let avoidanceCount = 0;
  let balancedCount = 0;

  scenarioQuestions.forEach((q, i) => {
    const selectedKey = responses[24 + i] as string;
    const choice = q.choices?.find((c) => c.key === selectedKey);
    const coding = choice?.coding || '';
    actionResponses[q.subscale || `scenario_${i}`] = coding;

    if (coding === 'avoidance' || coding === 'reactivity') avoidanceCount++;
    if (coding === 'balanced' || coding.endsWith('_moderate')) balancedCount++;
  });

  // High-gap domains: importance >= 7 AND gap >= 3
  const highGapDomains = Object.entries(domainScores)
    .filter(([_, v]) => v.importance >= 7 && v.gap >= 3)
    .map(([k]) => k);

  return {
    domainScores,
    top5Values,
    qualitativeResponses,
    actionResponses,
    avoidanceTendency: Math.round((avoidanceCount / 8) * 100) / 100,
    balancedTendency: Math.round((balancedCount / 8) * 100) / 100,
    highGapDomains,
  };
}

// ─── Config Export ──────────────────────────────────────────

export const valuesConfig: AssessmentConfig = {
  type: 'values',
  name: 'Personal Values',
  shortName: 'Values',
  description: 'Explore what matters most to you in your life and relationships.',
  instructions:
    'The following questions ask about what matters most to you in your life and relationships. There are no right or wrong answers — this is about understanding your personal values.',
  estimatedMinutes: 15,
  totalQuestions: 32,
  questions: QUESTIONS,
  likertScale: IMPORTANCE_SCALE, // default; accordance questions will need the other scale
  sections: SECTIONS,
  scoringFn: scoreValues,
  progressKey: 'values_progress',
};

export { VALUE_DOMAINS, IMPORTANCE_SCALE, ACCORDANCE_SCALE };
