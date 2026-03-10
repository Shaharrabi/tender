/**
 * Daily Pattern Cards — Content Library
 *
 * 70 cards across 7 portrait dimensions (10 per dimension).
 * Each card has a brief therapeutic insight and a micro-action
 * the user can try that day.
 *
 * Dimensions map to CompositeScores:
 *   Security        → attachmentSecurity
 *   Regulation      → regulationScore
 *   Differentiation → differentiation
 *   EQ              → emotionalIntelligence
 *   Values          → valuesCongruence
 *   Conflict        → conflictFlexibility
 *   Awareness       → relationalAwareness
 */

// ─── Types ──────────────────────────────────────────────

export type PatternDimension =
  | 'security'
  | 'regulation'
  | 'differentiation'
  | 'eq'
  | 'values'
  | 'conflict'
  | 'awareness';

export interface PatternCard {
  id: string;
  dimension: PatternDimension;
  /** Short therapeutic insight (1-2 sentences) */
  insight: string;
  /** One concrete micro-action for today */
  microAction: string;
  /** Optional portrait audio track ID that relates */
  relatedTrackId?: string;
}

/** Human-readable label + color for each dimension */
export const DIMENSION_META: Record<
  PatternDimension,
  { label: string; compositeKey: string; emoji: string }
> = {
  security: {
    label: 'Attachment Security',
    compositeKey: 'attachmentSecurity',
    emoji: '🛡️',
  },
  regulation: {
    label: 'Emotional Regulation',
    compositeKey: 'regulationScore',
    emoji: '🌊',
  },
  differentiation: {
    label: 'Differentiation',
    compositeKey: 'differentiation',
    emoji: '🌱',
  },
  eq: {
    label: 'Emotional Intelligence',
    compositeKey: 'emotionalIntelligence',
    emoji: '💡',
  },
  values: {
    label: 'Values Alignment',
    compositeKey: 'valuesCongruence',
    emoji: '🧭',
  },
  conflict: {
    label: 'Conflict Flexibility',
    compositeKey: 'conflictFlexibility',
    emoji: '🤝',
  },
  awareness: {
    label: 'Relational Awareness',
    compositeKey: 'relationalAwareness',
    emoji: '👁️',
  },
};

// ─── Security Cards (10) ────────────────────────────────

const SECURITY_CARDS: PatternCard[] = [
  {
    id: 'SEC-01',
    dimension: 'security',
    insight:
      'Security is not the absence of anxiety — it is the presence of a safe base to return to.',
    microAction:
      'Text your partner one sentence: "I am glad you are in my life." No strings attached.',
    relatedTrackId: 'O-3',
  },
  {
    id: 'SEC-02',
    dimension: 'security',
    insight:
      'When you reach for your partner and they respond, your nervous system learns: "I matter here."',
    microAction:
      'The next time you feel a small need today, voice it instead of dismissing it.',
  },
  {
    id: 'SEC-03',
    dimension: 'security',
    insight:
      'Attachment protest behaviors — the clinging, the withdrawal — are not flaws. They are distress signals from an earlier self.',
    microAction:
      'Notice one moment today when your body tightens around connection. Name it silently: "There is the old alarm."',
  },
  {
    id: 'SEC-04',
    dimension: 'security',
    insight:
      'You do not have to earn love. You may, however, need to practice receiving it.',
    microAction:
      'When your partner says something kind today, pause for three seconds before responding. Let it land.',
  },
  {
    id: 'SEC-05',
    dimension: 'security',
    insight:
      'Secure attachment is built in micro-moments — a glance returned, a question asked, a hand offered.',
    microAction:
      'Offer one small gesture of physical presence today: a touch on the shoulder, sitting closer, holding a door.',
  },
  {
    id: 'SEC-06',
    dimension: 'security',
    insight:
      'The fear of abandonment and the fear of engulfment are two sides of the same coin. Both are asking: "Am I safe here?"',
    microAction:
      'Ask yourself: "What would I do right now if I knew this relationship was safe?" Then do that.',
  },
  {
    id: 'SEC-07',
    dimension: 'security',
    insight:
      'Your attachment style is not your destiny. It is your starting point. The map can be redrawn.',
    microAction:
      'Write one sentence about a moment this week when you felt genuinely secure with your partner.',
  },
  {
    id: 'SEC-08',
    dimension: 'security',
    insight:
      'Proximity-seeking is hardwired. When you feel the pull toward your partner under stress, honor it as biology, not weakness.',
    microAction:
      'If stress arises today, move toward your partner physically before trying to problem-solve.',
  },
  {
    id: 'SEC-09',
    dimension: 'security',
    insight:
      'The repair is more important than the rupture. What matters is not whether you stumble, but whether you reach back.',
    microAction:
      'If there is an unresolved tension from yesterday, initiate a 30-second repair: "I want you to know I care about how that landed."',
  },
  {
    id: 'SEC-10',
    dimension: 'security',
    insight:
      'A securely attached person is not someone who never worries. It is someone who trusts that worry can be shared.',
    microAction:
      'Share one small worry with your partner today — not for them to fix, just to witness.',
  },
];

// ─── Regulation Cards (10) ──────────────────────────────

const REGULATION_CARDS: PatternCard[] = [
  {
    id: 'REG-01',
    dimension: 'regulation',
    insight:
      'Your window of tolerance is not fixed. It can be widened with practice, one breath at a time.',
    microAction:
      'When you notice activation rising, try the 5-4-3-2-1 grounding: five things you see, four you hear, three you touch.',
    relatedTrackId: 'O-4',
  },
  {
    id: 'REG-02',
    dimension: 'regulation',
    insight:
      'Co-regulation is not a luxury — it is how mammals are built. You are designed to borrow calm from another nervous system.',
    microAction:
      'Sit next to your partner for two minutes in silence. No agenda. Let your breathing align.',
  },
  {
    id: 'REG-03',
    dimension: 'regulation',
    insight:
      'The space between trigger and response is where your freedom lives. It can be as brief as a single breath.',
    microAction:
      'Before responding to the next emotionally charged moment, take one slow exhale through your mouth.',
  },
  {
    id: 'REG-04',
    dimension: 'regulation',
    insight:
      'Hyper-arousal (flooded, racing heart) and hypo-arousal (numb, checked out) are both your body protecting you. Neither is wrong.',
    microAction:
      'Check in with your body right now: Are you activated, shut down, or in the middle? Just notice.',
  },
  {
    id: 'REG-05',
    dimension: 'regulation',
    insight:
      'You cannot think your way out of a dysregulated nervous system. The body must settle before the mind can reason.',
    microAction:
      'Place both feet flat on the floor. Press down gently. Feel the ground holding you. Stay for 30 seconds.',
  },
  {
    id: 'REG-06',
    dimension: 'regulation',
    insight:
      'What you call "overreacting" may actually be an appropriate response from an earlier time. The feeling is real; the threat may be historical.',
    microAction:
      'If you notice a disproportionate reaction today, ask: "How old does this feeling seem?" Just notice.',
  },
  {
    id: 'REG-07',
    dimension: 'regulation',
    insight:
      'Regulation is not suppression. It is the capacity to feel without being hijacked by feeling.',
    microAction:
      'Name your current emotional state aloud in one word. Naming alone activates the prefrontal cortex.',
  },
  {
    id: 'REG-08',
    dimension: 'regulation',
    insight:
      'A narrower window of tolerance does not mean you are broken — it means your system learned to be vigilant. That vigilance once kept you safe.',
    microAction:
      'Give yourself permission to take a 5-minute break today before you feel you "need" one.',
  },
  {
    id: 'REG-09',
    dimension: 'regulation',
    insight:
      'Cold water on the face, humming, slow exhales — these are not tricks. They are direct communications with your vagus nerve.',
    microAction:
      'Hum for 30 seconds. Any tune. Feel the vibration in your chest and throat.',
  },
  {
    id: 'REG-10',
    dimension: 'regulation',
    insight:
      'Your partner cannot regulate for you, but their calm presence can make your own regulation possible.',
    microAction:
      'Tell your partner: "I do not need you to fix anything right now. Your presence is enough."',
  },
];

// ─── Differentiation Cards (10) ─────────────────────────

const DIFFERENTIATION_CARDS: PatternCard[] = [
  {
    id: 'DIF-01',
    dimension: 'differentiation',
    insight:
      'Differentiation is holding on to yourself while staying close. It is the art of being two people in one relationship.',
    microAction:
      'Notice one moment today where you adjusted your opinion to avoid tension. Just notice — no judgment.',
  },
  {
    id: 'DIF-02',
    dimension: 'differentiation',
    insight:
      'Losing yourself in a relationship feels like love. Finding yourself within it is love.',
    microAction:
      'Do one small thing today that is entirely yours — a walk, a song, a paragraph of reading — without explaining or justifying it.',
  },
  {
    id: 'DIF-03',
    dimension: 'differentiation',
    insight:
      'You can validate your partner without agreeing. "I see why that matters to you" does not require "and I feel the same."',
    microAction:
      'In the next disagreement, try: "That makes sense from where you stand" before sharing your own view.',
  },
  {
    id: 'DIF-04',
    dimension: 'differentiation',
    insight:
      'Enmeshment often masquerades as closeness. The test: can you tolerate your partner having a different emotional experience than yours?',
    microAction:
      'If your partner is in a different mood than you today, resist the urge to match or fix it. Let two realities coexist.',
  },
  {
    id: 'DIF-05',
    dimension: 'differentiation',
    insight:
      'Your partner is not responsible for your self-worth. When you outsource that, both of you lose.',
    microAction:
      'Complete this sentence in your journal or mind: "One thing I like about who I am, apart from this relationship, is…"',
  },
  {
    id: 'DIF-06',
    dimension: 'differentiation',
    insight:
      'Saying "no" to your partner is not a rejection of the relationship — it is an affirmation of your own integrity.',
    microAction:
      'Practice one small "no" today. It can be tiny: "I would rather not watch that." Notice what happens.',
  },
  {
    id: 'DIF-07',
    dimension: 'differentiation',
    insight:
      'Self-soothing is not selfishness — it is taking responsibility for your own nervous system so your partner does not have to carry it.',
    microAction:
      'When you feel distressed, try soothing yourself for 60 seconds before turning to your partner for support.',
  },
  {
    id: 'DIF-08',
    dimension: 'differentiation',
    insight:
      'Fusion under stress feels urgent: "We have to agree right now." Differentiation says: "We can disagree and still be us."',
    microAction:
      'Name one topic where you and your partner simply see things differently. Practice being okay with that gap.',
  },
  {
    id: 'DIF-09',
    dimension: 'differentiation',
    insight:
      'The most intimate thing you can offer is not merging — it is showing up fully as yourself and letting your partner do the same.',
    microAction:
      'Share one genuine preference today, even if it differs from your partner\u2019s: "I actually prefer\u2026"',
  },
  {
    id: 'DIF-10',
    dimension: 'differentiation',
    insight:
      'Healthy boundaries are not walls — they are the skin of the relationship. They define where you end and your partner begins.',
    microAction:
      'Notice one boundary you hold well. Acknowledge it: "I am clear about this, and that clarity protects us both."',
  },
];

// ─── EQ Cards (10) ──────────────────────────────────────

const EQ_CARDS: PatternCard[] = [
  {
    id: 'EQ-01',
    dimension: 'eq',
    insight:
      'Emotional intelligence is not about controlling emotions — it is about understanding them well enough that they inform rather than drive.',
    microAction:
      'Before bed, name three emotions you felt today. Not "good" or "bad" — precise words: tender, irritated, wistful.',
  },
  {
    id: 'EQ-02',
    dimension: 'eq',
    insight:
      'Your partner\u2019s emotions are information, not instructions. You can receive them without being directed by them.',
    microAction:
      'The next time your partner expresses frustration, listen for 30 seconds before formulating your response.',
  },
  {
    id: 'EQ-03',
    dimension: 'eq',
    insight:
      'Empathy fatigue is real. You cannot pour from an empty vessel. Replenishing yourself is an act of relational generosity.',
    microAction:
      'Do one thing today that fills your emotional reserves — something that asks nothing of you in return.',
  },
  {
    id: 'EQ-04',
    dimension: 'eq',
    insight:
      'Reading a room is a skill you may have learned out of necessity. Now you can use it as a gift rather than a survival tool.',
    microAction:
      'In one conversation today, check your read: "I sense you might be feeling ___. Am I close?"',
  },
  {
    id: 'EQ-05',
    dimension: 'eq',
    insight:
      'The gap between feeling an emotion and expressing it is where emotional intelligence lives. That gap can be learned.',
    microAction:
      'When a strong feeling arises, try labeling it silently before acting on it: "This is disappointment, not anger."',
  },
  {
    id: 'EQ-06',
    dimension: 'eq',
    insight:
      'Your body often knows your emotions before your mind. Tightness, heat, heaviness — these are dispatches from your emotional self.',
    microAction:
      'Three times today, scan your body and ask: "What is my body telling me right now?" Just listen.',
  },
  {
    id: 'EQ-07',
    dimension: 'eq',
    insight:
      'Emotion coaching your partner means naming what you see without judging it: "You seem tense" rather than "Why are you so tense?"',
    microAction:
      'Reflect one emotion back to your partner today using gentle language: "It looks like that stirred something in you."',
  },
  {
    id: 'EQ-08',
    dimension: 'eq',
    insight:
      'Mixed emotions are the most honest ones. You can love someone and be frustrated with them. Both are true.',
    microAction:
      'Notice one moment of emotional complexity today. Instead of choosing one feeling, hold both: "I feel proud and scared."',
  },
  {
    id: 'EQ-09',
    dimension: 'eq',
    insight:
      'Emotional granularity — the ability to make fine distinctions between feelings — is one of the strongest predictors of well-being.',
    microAction:
      'Replace one vague emotion word today with a more precise one: not "stressed" but "overwhelmed" or "pressured" or "restless."',
  },
  {
    id: 'EQ-10',
    dimension: 'eq',
    insight:
      'The emotions you judge most harshly in yourself are often the ones most needing compassion. Anger, neediness, jealousy — all carry messages.',
    microAction:
      'If an uncomfortable emotion visits today, greet it: "I see you. What do you need me to know?"',
  },
];

// ─── Values Cards (10) ──────────────────────────────────

const VALUES_CARDS: PatternCard[] = [
  {
    id: 'VAL-01',
    dimension: 'values',
    insight:
      'A values gap — the distance between what you believe and how you live — is not hypocrisy. It is an invitation to realign.',
    microAction:
      'Name your top relational value. Now ask: "Did I live that value yesterday?" No shame — just honest noticing.',
    relatedTrackId: 'D-4',
  },
  {
    id: 'VAL-02',
    dimension: 'values',
    insight:
      'Values are not what you say matters — they are what your calendar and your energy reveal. Actions are the truest confessions.',
    microAction:
      'Look at how you spent the last 24 hours. What value is your time actually serving? Is it the one you want?',
  },
  {
    id: 'VAL-03',
    dimension: 'values',
    insight:
      'Couples rarely fight about what they think they are fighting about. Underneath most fights is a values collision: freedom vs. security, growth vs. stability.',
    microAction:
      'Beneath your last disagreement, name the value each of you was protecting. Neither is wrong.',
  },
  {
    id: 'VAL-04',
    dimension: 'values',
    insight:
      'Shared values are not about agreeing on everything. They are about pointing in roughly the same direction.',
    microAction:
      'Ask your partner: "What is one thing that matters to you that you feel we honor well together?"',
  },
  {
    id: 'VAL-05',
    dimension: 'values',
    insight:
      'When values feel in conflict — say, honesty and kindness — the tension is the teacher. Both are true; the art is in the ordering.',
    microAction:
      'Identify two values that sometimes pull you in opposite directions. Sit with the tension for a moment. Name it.',
  },
  {
    id: 'VAL-06',
    dimension: 'values',
    insight:
      'Living your values is not a destination — it is a daily practice. You do not arrive; you keep showing up.',
    microAction:
      'Choose one value and take one tiny action today that embodies it. "I value presence" → put down the phone for 10 minutes.',
  },
  {
    id: 'VAL-07',
    dimension: 'values',
    insight:
      'Some of the values you carry are inherited — from family, from culture, from pain. Not all of them are still yours.',
    microAction:
      'Ask yourself: "Is there a value I hold that I chose, versus one I absorbed without questioning?" Just wonder.',
  },
  {
    id: 'VAL-08',
    dimension: 'values',
    insight:
      'Your partner\u2019s values are not a critique of yours. When they prioritize differently, it is their compass speaking \u2014 not a verdict on yours.',
    microAction:
      'Notice one area where your partner prioritizes differently. Try curiosity instead of correction: "Tell me more about why that matters to you."',
  },
  {
    id: 'VAL-09',
    dimension: 'values',
    insight:
      'Values-based living creates internal coherence — the feeling that your outsides match your insides. It is the antidote to chronic unease.',
    microAction:
      'At the end of today, ask: "Was there one moment where I felt aligned — where what I did matched what I believe?"',
  },
  {
    id: 'VAL-10',
    dimension: 'values',
    insight:
      'The most powerful relational act is not grand gestures. It is consistently living your values in the small moments — when nobody is watching.',
    microAction:
      'Do one values-aligned thing today that your partner will never know about. Let it be enough that you know.',
  },
];

// ─── Conflict Cards (10) ────────────────────────────────

const CONFLICT_CARDS: PatternCard[] = [
  {
    id: 'CON-01',
    dimension: 'conflict',
    insight:
      'Conflict is not the enemy of connection — contempt is. Disagreement handled with respect can deepen a bond.',
    microAction:
      'In the next disagreement, make one statement that starts with "I feel" rather than "You always."',
  },
  {
    id: 'CON-02',
    dimension: 'conflict',
    insight:
      'You do not have to choose between accommodating and dominating. The middle ground — collaborative compromise — is where relationships grow.',
    microAction:
      'In one small decision today, ask: "What would a solution look like that honors both of us?"',
  },
  {
    id: 'CON-03',
    dimension: 'conflict',
    insight:
      'Withdrawing from conflict is not peace — it is postponement. What is not addressed does not disappear; it compounds.',
    microAction:
      'If you notice yourself withdrawing from a topic, say: "I need a pause, but I want to come back to this."',
  },
  {
    id: 'CON-04',
    dimension: 'conflict',
    insight:
      'The strongest predictor of relationship success is not whether you fight — it is how you repair afterward.',
    microAction:
      'If yesterday had a rough moment, initiate a micro-repair: "Can we try that conversation again, more gently?"',
  },
  {
    id: 'CON-05',
    dimension: 'conflict',
    insight:
      'Stonewalling — the silent shutdown — is usually not aggression. It is a flooded nervous system that has hit its limit.',
    microAction:
      'If you feel the urge to shut down, try: "I am not leaving — I need 20 minutes to come back to my window." Then come back.',
  },
  {
    id: 'CON-06',
    dimension: 'conflict',
    insight:
      'Flexibility in conflict style — knowing when to assert, when to yield, when to collaborate — is a sign of relational maturity.',
    microAction:
      'In today\u2019s first disagreement (even a small one), pause and choose your approach rather than defaulting.',
  },
  {
    id: 'CON-07',
    dimension: 'conflict',
    insight:
      'Bids for connection often look like complaints. "You never help with dishes" might really mean "I feel alone in this."',
    microAction:
      'Translate one complaint (yours or your partner\u2019s) into the underlying bid: what is the need beneath the words?',
  },
  {
    id: 'CON-08',
    dimension: 'conflict',
    insight:
      'Couples who can name their negative cycle — "There goes our thing again" — are already halfway to interrupting it.',
    microAction:
      'If you and your partner have a recurring pattern, give it a gentle name: "The spiral," "The standoff." Naming disarms.',
  },
  {
    id: 'CON-09',
    dimension: 'conflict',
    insight:
      'Softened start-ups change everything. It is not what you say — it is the first 30 seconds. Criticism invites defense; vulnerability invites listening.',
    microAction:
      'Before raising a concern today, start with appreciation: "I value us, and I want to talk about something that matters to me."',
  },
  {
    id: 'CON-10',
    dimension: 'conflict',
    insight:
      'Some conflicts are solvable. Some are perpetual. The key is knowing which is which — and making peace with the perpetual ones.',
    microAction:
      'Name one ongoing disagreement that may never fully resolve. Practice acceptance: "This is part of our texture as a couple."',
  },
];

// ─── Awareness Cards (10) ───────────────────────────────

const AWARENESS_CARDS: PatternCard[] = [
  {
    id: 'AWA-01',
    dimension: 'awareness',
    insight:
      'Relational awareness is not about watching your partner — it is about watching the space between you.',
    microAction:
      'Three times today, check the relational temperature: "How does the space between us feel right now? Warm? Cool? Charged?"',
    relatedTrackId: 'D-5',
  },
  {
    id: 'AWA-02',
    dimension: 'awareness',
    insight:
      'You sense more than you think you do. The tension before words are spoken, the shift after a sigh — these are data your body collects.',
    microAction:
      'Notice one nonverbal cue from your partner today. Acknowledge it gently: "I noticed you went quiet after that. What came up?"',
  },
  {
    id: 'AWA-03',
    dimension: 'awareness',
    insight:
      'Metacognition — thinking about your thinking — is the superpower of relational health. It lets you observe the dance while dancing.',
    microAction:
      'Catch yourself in one automatic relational response today. Pause and ask: "Is this my choice, or my autopilot?"',
  },
  {
    id: 'AWA-04',
    dimension: 'awareness',
    insight:
      'Projection is seeing your own feelings on your partner\u2019s face. When you are certain about their inner world, you might be looking in a mirror.',
    microAction:
      'When you think you know what your partner is feeling, ask instead of assuming: "What is going on for you right now?"',
  },
  {
    id: 'AWA-05',
    dimension: 'awareness',
    insight:
      'Attention is the most basic form of love. Where your attention goes, connection grows.',
    microAction:
      'For five minutes today, give your partner your full, undivided attention. No phone, no multitasking. Just presence.',
  },
  {
    id: 'AWA-06',
    dimension: 'awareness',
    insight:
      'Somatic awareness — knowing what your body is doing in a relational moment — is the foundation of emotional intelligence.',
    microAction:
      'During one conversation today, notice your body: shoulders, jaw, belly. What are they doing? Clenching? Softening?',
  },
  {
    id: 'AWA-07',
    dimension: 'awareness',
    insight:
      'The stories you tell yourself about your partner\u2019s intentions are just that \u2014 stories. Checking the story is an act of love.',
    microAction:
      'Catch one assumption today and replace it with a question. Instead of "They do not care," try "Help me understand."',
  },
  {
    id: 'AWA-08',
    dimension: 'awareness',
    insight:
      'Mindful presence in relationship means noticing what is actually happening rather than what you fear or expect to happen.',
    microAction:
      'In your next interaction, set a silent intention: "I will notice what is here, not what I am bracing for."',
  },
  {
    id: 'AWA-09',
    dimension: 'awareness',
    insight:
      'High relational awareness can be a burden when it is paired with low boundaries. You see everything — and absorb it all.',
    microAction:
      'If you tend to absorb, practice this: "I can notice their feeling without carrying it. Their emotion is information, not an assignment."',
    relatedTrackId: 'D-3',
  },
  {
    id: 'AWA-10',
    dimension: 'awareness',
    insight:
      'Awareness without action is observation. Awareness with action is transformation. The micro-step matters more than the grand insight.',
    microAction:
      'Choose one thing you noticed this week about your dynamic. Take one small action on it today — even imperfectly.',
  },
];

// ─── Export ─────────────────────────────────────────────

export const ALL_PATTERN_CARDS: PatternCard[] = [
  ...SECURITY_CARDS,
  ...REGULATION_CARDS,
  ...DIFFERENTIATION_CARDS,
  ...EQ_CARDS,
  ...VALUES_CARDS,
  ...CONFLICT_CARDS,
  ...AWARENESS_CARDS,
];

/** Get all cards for a specific dimension */
export function getCardsByDimension(dimension: PatternDimension): PatternCard[] {
  return ALL_PATTERN_CARDS.filter((c) => c.dimension === dimension);
}
