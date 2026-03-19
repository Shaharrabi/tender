/**
 * Glossary — Relationship Psychology Terms
 *
 * Plain-language definitions for clinical/technical terms used
 * throughout the app. Consumed by <TappableWord /> to show
 * tap-to-define popups inline.
 *
 * Keep definitions warm, accessible, and jargon-free (≤ 2 sentences).
 * The `source` field is optional — shown as small citation text.
 */

export interface GlossaryEntry {
  term: string;           // Display form (title-cased)
  definition: string;     // Plain-language explanation
  source?: string;        // Optional citation (e.g. "Bowlby, 1969")
}

const GLOSSARY: Record<string, GlossaryEntry> = {
  // ─── Attachment ────────────────────────────────────────
  'attachment style': {
    term: 'Attachment Style',
    definition:
      'The way you learned to seek closeness and safety in relationships, shaped by your earliest bonds. It influences how you reach out — or pull away — when things feel uncertain.',
    source: 'Bowlby (1969)',
  },
  'secure attachment': {
    term: 'Secure Attachment',
    definition:
      'A relational pattern where you feel comfortable with closeness and can trust that your partner will be there. You can ask for what you need without fear of rejection.',
  },
  'anxious attachment': {
    term: 'Anxious Attachment',
    definition:
      'A pattern of craving closeness while worrying it might disappear. You may seek reassurance often and feel uneasy when your partner seems distant.',
  },
  'avoidant attachment': {
    term: 'Avoidant Attachment',
    definition:
      'A pattern of valuing independence so strongly that closeness can feel uncomfortable. You may pull away when things get too intimate or emotionally intense.',
  },
  'fearful avoidant': {
    term: 'Fearful-Avoidant',
    definition:
      'A pattern of wanting closeness but fearing it at the same time. You may swing between reaching out and pulling away, feeling torn between connection and self-protection.',
  },
  'attachment anxiety': {
    term: 'Attachment Anxiety',
    definition:
      'The degree to which you worry about being abandoned or not being loved enough. Higher anxiety means more preoccupation with your partner\'s availability.',
    source: 'Attachment research (Fraley et al.)',
  },
  'attachment avoidance': {
    term: 'Attachment Avoidance',
    definition:
      'The degree to which you feel uncomfortable with emotional closeness and prefer self-reliance. Higher avoidance means more discomfort with vulnerability.',
    source: 'Attachment research (Fraley et al.)',
  },

  // ─── Differentiation ──────────────────────────────────
  'differentiation': {
    term: 'Differentiation',
    definition:
      'Your ability to stay true to yourself while remaining emotionally connected to your partner. It\'s the balance between "I" and "we."',
    source: 'Bowen (1978)',
  },
  'emotional reactivity': {
    term: 'Emotional Reactivity',
    definition:
      'How quickly and intensely you respond to emotional triggers. Lower reactivity means you can pause before reacting, even when feelings run high.',
  },
  'emotional cutoff': {
    term: 'Emotional Cutoff',
    definition:
      'A pattern of managing anxiety by distancing yourself from important relationships. It can feel like protection, but it often creates more isolation.',
  },
  'i-position': {
    term: 'I-Position',
    definition:
      'The ability to say what you think, feel, and believe clearly — even when others disagree. It\'s standing in your own truth while staying open to your partner\'s.',
  },
  'fusion': {
    term: 'Fusion',
    definition:
      'When your sense of self becomes so blended with your partner\'s that it\'s hard to tell where you end and they begin. It can feel like love, but it often leads to reactivity.',
  },

  // ─── Nervous System / Regulation ──────────────────────
  'window of tolerance': {
    term: 'Window of Tolerance',
    definition:
      'The zone where you can feel your emotions without being overwhelmed by them. Inside this window, you can think clearly, stay present, and respond rather than react.',
    source: 'Siegel (1999)',
  },
  'hyperarousal': {
    term: 'Hyperarousal',
    definition:
      'A state of being "revved up" — your nervous system is on high alert. You might feel anxious, angry, restless, or unable to calm down.',
  },
  'hypoarousal': {
    term: 'Hypoarousal',
    definition:
      'A state of shutting down — your nervous system has gone into low power mode. You might feel numb, foggy, disconnected, or unable to engage.',
  },
  'regulation': {
    term: 'Regulation',
    definition:
      'Your nervous system\'s ability to return to a calm, present state after being activated. Good regulation means you can recover from stress without getting stuck.',
  },
  'co-regulation': {
    term: 'Co-Regulation',
    definition:
      'The way two nervous systems calm each other through presence, tone, and touch. When your partner\'s calm helps settle your storm, that\'s co-regulation.',
  },

  // ─── Conflict ─────────────────────────────────────────
  'conflict style': {
    term: 'Conflict Style',
    definition:
      'Your default approach when disagreements arise. It\'s not about being right or wrong — it\'s about the pattern you fall into under pressure.',
    source: 'Conflict research (De Dreu et al.)',
  },
  'yielding': {
    term: 'Yielding',
    definition:
      'A conflict approach where you prioritize your partner\'s needs and preferences, sometimes at the expense of your own. It can preserve peace but may build resentment over time.',
  },
  'compromising': {
    term: 'Compromising',
    definition:
      'A conflict approach where both partners give up something to find middle ground. It\'s practical, but sometimes important needs get lost in the negotiation.',
  },
  'forcing': {
    term: 'Forcing',
    definition:
      'A conflict approach where you push strongly for your position. It can feel protective, but it may shut down your partner\'s voice in the process.',
  },
  'problem solving': {
    term: 'Problem Solving',
    definition:
      'A conflict approach where you work together to find a solution that honors both partners\' needs. It requires patience and genuine curiosity about the other\'s perspective.',
  },
  'avoiding': {
    term: 'Avoiding',
    definition:
      'A conflict approach where you sidestep or delay addressing the issue. It can provide temporary relief, but unresolved concerns tend to resurface later.',
  },

  // ─── Emotional Intelligence ───────────────────────────
  'emotional intelligence': {
    term: 'Emotional Intelligence',
    definition:
      'Your ability to notice, understand, and work with emotions — both your own and your partner\'s. It\'s the skill of reading the emotional weather in a room.',
    source: 'Emotional intelligence research (Schutte et al.)',
  },

  // ─── Personality (Big Five) ───────────────────────────
  'big five': {
    term: 'Big Five',
    definition:
      'Five broad dimensions that describe your personality: Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism. Together they paint a picture of how you move through the world.',
    source: 'Goldberg (1993)',
  },
  'openness': {
    term: 'Openness',
    definition:
      'How much you seek out new experiences, ideas, and perspectives. High openness means curiosity and imagination; lower openness means preferring the familiar.',
  },
  'conscientiousness': {
    term: 'Conscientiousness',
    definition:
      'How organized, disciplined, and goal-oriented you tend to be. High conscientiousness means reliability and follow-through; lower means more spontaneity.',
  },
  'extraversion': {
    term: 'Extraversion',
    definition:
      'How much energy you draw from social interaction. High extraversion means you recharge around people; lower means you recharge in solitude.',
  },
  'agreeableness': {
    term: 'Agreeableness',
    definition:
      'How much you prioritize harmony and cooperation with others. High agreeableness means warmth and empathy; lower means more directness and skepticism.',
  },
  'neuroticism': {
    term: 'Neuroticism',
    definition:
      'How strongly you experience negative emotions like anxiety, sadness, and frustration. Higher neuroticism means more emotional intensity; lower means more emotional steadiness.',
  },

  // ─── Relationship Concepts ────────────────────────────
  'negative cycle': {
    term: 'Negative Cycle',
    definition:
      'The repetitive pattern a couple falls into during conflict — like a dance neither person chose but both keep doing. Recognizing the cycle is the first step to changing it.',
    source: 'EFT (Johnson, 2004)',
  },
  'pursue-withdraw': {
    term: 'Pursue-Withdraw',
    definition:
      'A common couple pattern where one partner seeks more connection (pursues) while the other creates distance (withdraws). The more one pursues, the more the other withdraws.',
  },
  'repair attempt': {
    term: 'Repair Attempt',
    definition:
      'Any effort to de-escalate tension during or after conflict — a touch, a joke, an apology, a softened voice. Successful couples make and receive these often.',
    source: 'Gottman (1999)',
  },
  'bid for connection': {
    term: 'Bid for Connection',
    definition:
      'A small moment where one partner reaches out for attention, affection, or engagement. Turning toward these bids — instead of away — is what builds trust over time.',
    source: 'Gottman (1999)',
  },
  'dyadic coping': {
    term: 'Dyadic Coping',
    definition:
      'How you and your partner manage stress together. When one person is struggling, the other helps carry the load — through listening, problem-solving, or simply being present.',
    source: 'Coping research (Bodenmann)',
  },
  'relational field': {
    term: 'Relational Field',
    definition:
      'The invisible emotional space between two people. It\'s shaped by your histories, nervous systems, and the patterns you create together — and it can be cultivated intentionally.',
  },
  'couple satisfaction': {
    term: 'Couple Satisfaction',
    definition:
      'How happy and fulfilled each partner feels in the relationship overall. It\'s not about perfection — it\'s about whether the relationship feels like a good place to be.',
    source: 'Satisfaction research (Funk & Rogge)',
  },
  'values alignment': {
    term: 'Values Alignment',
    definition:
      'The degree to which you and your partner share core priorities — like family, growth, adventure, or security. Alignment doesn\'t mean identical values; it means they can coexist.',
  },
  'growth edge': {
    term: 'Growth Edge',
    definition:
      'The place where you\'re being invited to stretch beyond your comfort zone. It\'s not a flaw — it\'s the frontier of your development, where the most meaningful change happens.',
  },
  'anchor point': {
    term: 'Anchor Point',
    definition:
      'A core strength or resource you can return to when things feel unstable. It\'s the ground beneath your feet — the part of you that stays steady even in the storm.',
  },
};

export default GLOSSARY;

/**
 * Look up a term in the glossary (case-insensitive).
 * Returns undefined if not found.
 */
export function lookupTerm(term: string): GlossaryEntry | undefined {
  return GLOSSARY[term.toLowerCase()];
}

/**
 * Get all glossary terms as a sorted array.
 */
export function getAllTerms(): GlossaryEntry[] {
  return Object.values(GLOSSARY).sort((a, b) =>
    a.term.localeCompare(b.term),
  );
}
