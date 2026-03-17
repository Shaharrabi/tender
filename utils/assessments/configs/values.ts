import { AssessmentConfig, GenericQuestion, LikertOption, AssessmentSection, ValuesScores } from '@/types';

// ─── Value Domains (unchanged — consumed by lens-values.ts, growth-edges.ts) ──

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

// ─── Likert Scales (unchanged — 1-10 range preserved for composite-scores.ts) ──

const IMPORTANCE_SCALE: LikertOption[] = [
  { value: 1, label: 'Not at all important' },
  { value: 2, label: 'Slightly important' },
  { value: 3, label: 'Somewhat important' },
  { value: 4, label: 'Moderately important' },
  { value: 5, label: 'Important' },
  { value: 6, label: 'Quite important' },
  { value: 7, label: 'Very important' },
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
  { id: 'text', title: 'Part 2: Reflection', description: 'Share your thoughts in your own words. There are no right answers.', questionRange: [21, 22] },
  { id: 'scenarios', title: 'Part 3: Values in Action', description: 'Choose the response that best describes what you would typically do — not what you think you should do.', questionRange: [23, 27] },
];

// ─── Importance/Accordance question text per domain ─────────

const DOMAIN_QUESTIONS: Record<string, { importance: string; accordance: string }> = {
  intimacy: {
    importance: 'How important is it to you to feel deeply connected to your partner — not just coexisting, but truly knowing and being known by each other?',
    accordance: 'How well does your current relationship reflect that kind of deep connection right now?',
  },
  growth: {
    importance: 'How important is it to you that your relationship is a place where you\'re both still growing — still becoming more of who you are?',
    accordance: 'How much does your relationship currently feel like a place of growth for you?',
  },
  honesty: {
    importance: 'How important is it to you to be able to say what\'s true for you in your relationship — even when it\'s hard?',
    accordance: 'How often do you actually speak your truth in your relationship right now?',
  },
  security: {
    importance: 'How important is it to you to feel safe and stable in your relationship — to know it\'s solid ground?',
    accordance: 'How safe and stable does your relationship actually feel to you right now?',
  },
  adventure: {
    importance: 'How important is it to you that your relationship has a sense of aliveness — new experiences, surprises, things that break the routine?',
    accordance: 'How much aliveness and novelty does your relationship currently have?',
  },
  independence: {
    importance: 'How important is it to you to maintain your own identity within your relationship — your own friendships, interests, and sense of self?',
    accordance: 'How much room does your relationship currently give you to be your own person?',
  },
  family: {
    importance: 'How important is it to you to build something lasting together — whether through family, tradition, or shared legacy?',
    accordance: 'How well does your relationship currently reflect this sense of legacy or family?',
  },
  service: {
    importance: 'How important is it to you that your relationship contributes something to the world beyond just the two of you — through family, community, or shared purpose?',
    accordance: 'How well does your relationship currently serve something larger than yourselves?',
  },
  playfulness: {
    importance: 'How important is it to you that your relationship is genuinely enjoyable — that you laugh together, have fun, and take pleasure in each other\'s company?',
    accordance: 'How much genuine enjoyment and playfulness exists in your relationship right now?',
  },
  spirituality: {
    importance: 'How important is it to you that your relationship has a sense of deeper meaning — something that goes beyond the practical and touches what matters most?',
    accordance: 'How much does your relationship currently feel connected to something meaningful to you?',
  },
};

// ─── Questions ──────────────────────────────────────────────

const QUESTIONS: GenericQuestion[] = [
  // Part A: Importance/Accordance pairs (Q1-20)
  ...VALUE_DOMAINS.flatMap((domain, i) => {
    const dq = DOMAIN_QUESTIONS[domain.id];
    return [
      {
        id: i * 2 + 1,
        text: dq?.importance ?? `How important is ${domain.label} to you in your life and relationships?`,
        inputType: 'likert' as const,
        subscale: `${domain.id}_importance`,
      },
      {
        id: i * 2 + 2,
        text: dq?.accordance ?? `How fully are you currently living this value (${domain.label}) in your relationship?`,
        inputType: 'likert' as const,
        subscale: `${domain.id}_accordance`,
        likertScale: ACCORDANCE_SCALE,
      },
    ];
  }),

  // Part B: Ranking exercise (Q21)
  {
    id: 21,
    text: 'From the list below, choose the 5 values that matter most to you in your relationship right now.',
    inputType: 'ranking',
    rankingItems: VALUE_DOMAINS.map((d) => ({
      id: d.id,
      label: d.label,
      description: d.description,
    })),
    rankCount: 5,
  },

  // Part C: Open text (Q22-23)
  {
    id: 22,
    text: 'When you imagine your partner at their best — the version of them that makes you feel most grateful — what are they doing? What does it look like?',
    inputType: 'text',
    charLimit: 500,
    placeholder: 'Describe your partner at their best...',
    suggestedChips: [
      'Patient', 'Kind', 'Present', 'Attentive', 'Playful',
      'Supportive', 'Honest', 'Vulnerable', 'Affectionate', 'Gentle',
      'Funny', 'Thoughtful', 'Generous', 'Calm', 'Passionate',
      'Reliable', 'Curious', 'Empathetic', 'Encouraging', 'Warm',
      'Adventurous', 'Understanding', 'Creative', 'Protective', 'Spontaneous',
    ],
  },
  {
    id: 23,
    text: 'If your relationship could become anything you wanted over the next year, what would it look and feel like?',
    inputType: 'text',
    charLimit: 750,
    placeholder: 'Describe your ideal future...',
    suggestedChips: [
      'Peaceful', 'Deeply connected', 'Trusting', 'Safe', 'Playful',
      'Growing together', 'Honest', 'Intimate', 'Joyful', 'Balanced',
      'Communicative', 'Affectionate', 'Exciting', 'Stable', 'Meaningful',
      'Tender', 'Free', 'Grounded', 'Collaborative', 'Passionate',
      'Adventurous', 'Supportive', 'Spontaneous', 'Resilient', 'Lighthearted',
    ],
  },

  // Part D: Scenarios (Q24-28) — 5 relational value-conflict situations
  {
    id: 24,
    text: 'Your partner wants to spend the holiday with their family. You had your heart set on a trip together — just the two of you. You:',
    inputType: 'choice',
    subscale: 'holiday_conflict',
    choices: [
      { key: 'A', text: 'Say nothing and go along with their plan, feeling quietly resentful', coding: 'avoidance' },
      { key: 'B', text: 'Suggest splitting the time — part with family, part together — even though neither is exactly what you wanted', coding: 'balanced' },
      { key: 'C', text: 'Tell your partner honestly that the trip matters to you, and ask if you can find a way to honor both', coding: 'aligned' },
    ],
  },
  {
    id: 25,
    text: 'You notice your partner has been distant for a few days. You\'re not sure if something is wrong. You:',
    inputType: 'choice',
    subscale: 'distance_response',
    choices: [
      { key: 'A', text: 'Give them space and wait for them to come to you — bringing it up feels risky', coding: 'avoidance' },
      { key: 'B', text: 'Casually mention that they seem quiet, but don\'t push it', coding: 'balanced' },
      { key: 'C', text: 'Find a calm moment and say, "I\'ve noticed some distance between us. I want to understand what\'s happening."', coding: 'aligned' },
    ],
  },
  {
    id: 26,
    text: 'A close friend tells you something critical about your partner. It bothers you. You:',
    inputType: 'choice',
    subscale: 'outside_criticism',
    choices: [
      { key: 'A', text: 'Keep it to yourself — it would only start a fight', coding: 'avoidance' },
      { key: 'B', text: 'Mention it lightly to your partner, downplaying how much it bothered you', coding: 'balanced' },
      { key: 'C', text: 'Bring it up honestly: "Someone said something about you that stuck with me. I\'d rather talk about it with you than carry it alone."', coding: 'aligned' },
    ],
  },
  {
    id: 27,
    text: 'You and your partner disagree about something important — how to raise your kids, how to spend money, or how much time to spend with extended family. You:',
    inputType: 'choice',
    subscale: 'core_disagreement',
    choices: [
      { key: 'A', text: 'Avoid the topic — it always ends the same way', coding: 'avoidance' },
      { key: 'B', text: 'Revisit it occasionally, but eventually just go with whatever feels easiest', coding: 'balanced' },
      { key: 'C', text: 'Keep the conversation alive, even when it\'s hard, because you believe finding real alignment matters more than avoiding discomfort', coding: 'aligned' },
    ],
  },
  {
    id: 28,
    text: 'Your partner does something that hurts you — not maliciously, but carelessly. It happens more than once. You:',
    inputType: 'choice',
    subscale: 'repeated_hurt',
    choices: [
      { key: 'A', text: 'Tell yourself it\'s not a big deal and try to let it go', coding: 'avoidance' },
      { key: 'B', text: 'Drop hints or bring it up indirectly, hoping they\'ll catch on', coding: 'balanced' },
      { key: 'C', text: 'Name it clearly and specifically: "When you do X, it hurts me. I need you to know that."', coding: 'aligned' },
    ],
  },
];

// ─── Scoring ────────────────────────────────────────────────

function scoreValues(responses: (number | string | string[] | null)[]): ValuesScores {
  // Part A: Domain scores (importance/accordance pairs — indices 0-19)
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

  // Part B: Ranking (index 20)
  const top5Values = (responses[20] as string[]) || [];

  // Part C: Qualitative (indices 21-22)
  // nonNegotiables kept as empty string for type compatibility — derived in portrait from domain scores
  const qualitativeResponses = {
    partnerIdentity: (responses[21] as string) || '',
    nonNegotiables: '',
    aspirationalVision: (responses[22] as string) || '',
  };

  // Part D: Scenario coding (indices 23-27) — 5 scenarios
  const scenarioQuestions = QUESTIONS.slice(23); // Q24-Q28
  const actionResponses: Record<string, string> = {};
  let avoidanceCount = 0;
  let balancedCount = 0;

  scenarioQuestions.forEach((q, i) => {
    const selectedKey = responses[23 + i] as string;
    const choice = q.choices?.find((c) => c.key === selectedKey);
    const coding = choice?.coding || '';
    actionResponses[q.subscale || `scenario_${i}`] = coding;

    if (coding === 'avoidance') avoidanceCount++;
    if (coding === 'balanced') balancedCount++;
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
    avoidanceTendency: Math.round((avoidanceCount / 5) * 100) / 100,
    balancedTendency: Math.round((balancedCount / 5) * 100) / 100,
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
    'The following questions explore what matters most to you in your relationship. There are no right or wrong answers — this is about understanding what you value and how you live it.',
  estimatedMinutes: 10,
  totalQuestions: 28,
  questions: QUESTIONS,
  likertScale: IMPORTANCE_SCALE,
  sections: SECTIONS,
  scoringFn: scoreValues,
  progressKey: 'values_progress',
};

export { VALUE_DOMAINS, IMPORTANCE_SCALE, ACCORDANCE_SCALE };
