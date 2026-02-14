/**
 * Big Five Relational Reframes — Phase 3
 *
 * Generates personality-specific narrative paragraphs that reframe
 * Big Five traits through a relational lens. Based on V2 Part 2C templates.
 *
 * These are NOT additional scored items — they are triggered narrative
 * paragraphs in the Portrait based on Big Five profile × attachment × differentiation.
 *
 * Returns up to 3 most relevant reframe paragraphs.
 */

import type { ECRRScores, IPIPScores, DSIRScores, CompositeScores } from '@/types';

// ─── Template Definitions ─────────────────────────────────

interface ReframeTemplate {
  id: string;
  condition: (ipip: IPIPScores, ecrr: ECRRScores, dsir: DSIRScores, composite: CompositeScores) => boolean;
  priority: number;  // higher = more important to show
  generate: (ipip: IPIPScores, ecrr: ECRRScores, dsir: DSIRScores) => string;
}

const REFRAME_TEMPLATES: ReframeTemplate[] = [
  {
    id: 'high-neuroticism-high-anxiety',
    condition: (ipip, ecrr) =>
      ipip.domainPercentiles.neuroticism > 70 && ecrr.anxietyScore > 4.0,
    priority: 10,
    generate: () =>
      'You feel everything in the relational field — every shift, every distance, every change in your partner\'s tone. And your attachment system interprets these shifts as danger. This combination means you are often right that something shifted, but the story your anxiety tells about WHY it shifted is usually the attachment wound talking, not the current reality. The pattern: detect (accurate) → interpret (biased by old pain) → react (to the old story, not the current partner). Your growth edge is widening the gap between detection and interpretation.',
  },
  {
    id: 'high-neuroticism',
    condition: (ipip) =>
      ipip.domainPercentiles.neuroticism > 70,
    priority: 8,
    generate: () =>
      'Your emotional sensitivity is a relational instrument. You pick up on shifts in the space between you before most people would notice anything has changed. The challenge is not your sensitivity — it is that your nervous system often reads "something is changing" as "something is wrong." In Tender, we work on the distinction: turning alarm into attunement, turning reactivity into recognition.',
  },
  {
    id: 'low-openness-high-avoidance',
    condition: (ipip, ecrr) =>
      ipip.domainPercentiles.openness < 30 && ecrr.avoidanceScore > 4.0,
    priority: 9,
    generate: () =>
      'You protect yourself through structure and distance. New experiences and emotional closeness both register as threats to your system. Your partner may experience this as a wall — not because you don\'t care, but because caring feels like losing control. The invitation is not to demolish the wall but to build a window: a structured, predictable way to let your partner in that does not overwhelm your system.',
  },
  {
    id: 'low-openness',
    condition: (ipip) =>
      ipip.domainPercentiles.openness < 30,
    priority: 6,
    generate: () =>
      'You value the known, the stable, the reliable. In relationships, this translates to deep loyalty and consistency — you show up in predictable, trustworthy ways. The growing edge: the relational field between you and your partner is always moving. It is not static because two living people are not static. We will practice becoming comfortable with that aliveness without needing to control it or retreat from it.',
  },
  {
    id: 'high-conscientiousness-high-neuroticism',
    condition: (ipip) =>
      ipip.domainPercentiles.conscientiousness > 70 && ipip.domainPercentiles.neuroticism > 60,
    priority: 7,
    generate: () =>
      'You want to do relationships right — and you feel anxious when things are not going according to plan. This combination creates a particular relational pattern: planning for connection (conscientious) but then becoming rigid when the plan does not work (anxious). Your partner may feel managed rather than met. The practice: trusting what emerges between you rather than executing what you planned.',
  },
  {
    id: 'high-agreeableness-low-differentiation',
    condition: (ipip, _ecrr, dsir) =>
      ipip.domainPercentiles.agreeableness > 70 && dsir.totalMean < 3.5,
    priority: 9,
    generate: () =>
      'You are skilled at harmony and deeply attuned to what others need. But in your relationship, this can become a pattern of losing yourself — sensing what your partner wants and providing it at the expense of your own truth. The relational field between you needs BOTH of you to be present, not one person accommodating and the other leading. Agreement without authenticity is not peace — it is a slow leak.',
  },
  {
    id: 'low-agreeableness-high-differentiation',
    condition: (ipip, _ecrr, dsir) =>
      ipip.domainPercentiles.agreeableness < 35 && dsir.totalMean > 4.0,
    priority: 6,
    generate: () =>
      'You hold your ground well. You know what you think, what you want, and you do not fold easily. In relationships, this is a strength — your partner always knows where they stand. The growing edge: holding your ground AND remaining curious about what emerges in the space between you. Strength does not require walls. Can you be firm AND permeable?',
  },
  {
    id: 'high-extraversion-contrast',
    condition: (ipip) =>
      ipip.domainPercentiles.extraversion > 75 || ipip.domainPercentiles.extraversion < 25,
    priority: 5,
    generate: (ipip) => {
      if (ipip.domainPercentiles.extraversion > 75) {
        return 'Your social energy is high — you draw vitality from connection, conversation, and shared activity. If your partner is more introverted, this creates a natural tension in the relational field: one of you charges through connection with others, the other recharges through quiet withdrawal. This is not a problem to solve. This is creative tension. The field between you can hold both rhythms if you can name them without judgment: "I need more" and "I need less" are both valid signals.';
      }
      return 'You recharge through solitude and quiet. Social demands can drain your energy, including relational ones. If your partner is more extraverted, this creates a natural tension — they may interpret your need for space as disconnection, when it is actually how you maintain the energy to be present. Naming this rhythm openly — "I need less right now so I can give more later" — changes how your partner receives it.';
    },
  },
];

// ─── Generator ────────────────────────────────────────────

/**
 * Generate Big Five relational reframe paragraphs based on personality profile.
 * Returns up to 3 most relevant paragraphs, sorted by priority.
 */
export function generateBigFiveReframes(
  ipip: IPIPScores,
  ecrr: ECRRScores,
  dsir: DSIRScores,
  composite: CompositeScores
): string[] {
  const matched = REFRAME_TEMPLATES
    .filter((t) => t.condition(ipip, ecrr, dsir, composite))
    .sort((a, b) => b.priority - a.priority);

  // Deduplicate — if both "high-neuroticism" and "high-neuroticism-high-anxiety" match,
  // keep only the more specific one
  const seen = new Set<string>();
  const deduped: ReframeTemplate[] = [];

  for (const t of matched) {
    // More specific templates override less specific ones
    if (t.id === 'high-neuroticism' && seen.has('high-neuroticism-high-anxiety')) continue;
    if (t.id === 'low-openness' && seen.has('low-openness-high-avoidance')) continue;

    seen.add(t.id);
    deduped.push(t);
  }

  return deduped
    .slice(0, 3)
    .map((t) => t.generate(ipip, ecrr, dsir));
}
