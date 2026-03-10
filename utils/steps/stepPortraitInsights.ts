/**
 * Step Portrait Insights — Maps each step to the most relevant
 * portrait dimension, providing a brief insight sentence and
 * identifying which audio track categories to surface.
 *
 * Used by the StepPortraitInsight component to show relevant
 * portrait data inline in each step's READ tab.
 */

import type { IndividualPortrait, GrowthEdge } from '@/types/portrait';
import type { TrackCategory } from '@/utils/audio/trackMetadata';

// ─── Types ──────────────────────────────────────────────

export interface StepInsightResult {
  /** Brief 1-2 sentence insight derived from portrait scores */
  text: string;
  /** Audio track category to filter for this step (null = no tracks) */
  audioCategory: TrackCategory | null;
  /** Matching growth edge IDs to highlight (max 1) */
  relevantEdge: GrowthEdge | null;
  /** Label for the eyebrow text */
  eyebrow: string;
}

// ─── Score Descriptors ──────────────────────────────────

function scoreTier(score: number): 'low' | 'moderate' | 'high' {
  if (score < 40) return 'low';
  if (score <= 65) return 'moderate';
  return 'high';
}

function describeScore(score: number, lowDesc: string, modDesc: string, highDesc: string): string {
  const tier = scoreTier(score);
  if (tier === 'low') return lowDesc;
  if (tier === 'moderate') return modDesc;
  return highDesc;
}

// ─── Per-Step Insight Generators ────────────────────────

type InsightGenerator = (p: IndividualPortrait) => StepInsightResult | null;

const STEP_INSIGHTS: Record<number, InsightGenerator> = {
  // Step 1 — See the Dance: Attachment
  1: (p) => {
    const anxiety = p.compositeScores.anxietyNorm ?? 50;
    const avoidance = p.compositeScores.avoidanceNorm ?? 50;
    const position = p.negativeCycle?.position ?? 'mixed';
    const positionLabel = position === 'pursuer' ? 'reach toward connection'
      : position === 'withdrawer' ? 'move toward space'
      : 'shift between reaching and retreating';

    return {
      text: `Your attachment anxiety is ${Math.round(anxiety)}/100 and avoidance is ${Math.round(avoidance)}/100. Under stress, you tend to ${positionLabel}.`,
      audioCategory: 'attachment',
      relevantEdge: findEdgeByCategory(p, 'attachment'),
      eyebrow: 'YOUR ATTACHMENT PATTERN',
    };
  },

  // Step 2 — Build Safety: Differentiation / Parts
  2: (p) => {
    const diff = p.compositeScores.differentiation;
    const desc = describeScore(diff,
      'holding your own position in the presence of strong emotion is challenging',
      'you can hold your ground, though it takes effort under pressure',
      'you stay grounded even when emotions run high around you'
    );
    return {
      text: `Your differentiation score is ${Math.round(diff)}/100 \u2014 ${desc}.`,
      audioCategory: 'parts',
      relevantEdge: findEdgeByCategory(p, 'differentiation'),
      eyebrow: 'YOUR BOUNDARIES & PARTS',
    };
  },

  // Step 3 — Surrender Certainty: Window / Personality
  3: (p) => {
    const ww = p.compositeScores.windowWidth;
    const desc = describeScore(ww,
      'big emotions can overwhelm your thinking before you catch up',
      'you can hold a lot, but the edge is closer than you think under stress',
      'you stay regulated when others might not'
    );
    return {
      text: `Your window of tolerance is ${Math.round(ww)}/100 \u2014 ${desc}.`,
      audioCategory: 'window',
      relevantEdge: findEdgeByCategory(p, 'regulation'),
      eyebrow: 'YOUR WINDOW OF TOLERANCE',
    };
  },

  // Step 4 — Examine Our Part: EQ + Regulation
  4: (p) => {
    const eq = p.compositeScores.emotionalIntelligence;
    const reg = p.compositeScores.regulationScore;
    const gap = eq > 60 && reg < 50;
    const text = gap
      ? `You feel deeply (EQ: ${Math.round(eq)}/100) but your regulation (${Math.round(reg)}/100) hasn\u2019t caught up to your awareness yet.`
      : `Your emotional intelligence is ${Math.round(eq)}/100 and regulation is ${Math.round(reg)}/100.`;
    return {
      text,
      audioCategory: 'detection',
      relevantEdge: findEdgeByCategory(p, 'regulation') || findEdgeByCategory(p, 'personality'),
      eyebrow: 'YOUR EMOTIONAL LANDSCAPE',
    };
  },

  // Step 5 — See Together: Couple dynamics (skip if no couple data)
  5: (_p) => {
    // Couple data is handled separately; individual portrait alone
    // doesn't have couple dance data. Return a light insight.
    return null;
  },

  // Step 6 — Release the Enemy Story: Conflict style
  6: (p) => {
    const cf = p.compositeScores.conflictFlexibility;
    const position = p.negativeCycle?.position ?? 'mixed';
    const desc = describeScore(cf,
      'you tend to rely on one conflict strategy',
      'you have some flexibility in how you handle disagreement',
      'you draw from multiple conflict approaches'
    );
    return {
      text: `Your conflict flexibility is ${Math.round(cf)}/100 \u2014 ${desc}. As a ${position}, your typical moves in conflict shape the story you tell about your partner.`,
      audioCategory: 'cycle-position',
      relevantEdge: findEdgeByCategory(p, 'conflict'),
      eyebrow: 'YOUR CONFLICT PATTERN',
    };
  },

  // Step 7 — Reach: Regulation + Window
  7: (p) => {
    const reg = p.compositeScores.regulationScore;
    const ww = p.compositeScores.windowWidth;
    return {
      text: `Your regulation score is ${Math.round(reg)}/100 with a window width of ${Math.round(ww)}/100. This shapes how you reach for connection when it feels risky.`,
      audioCategory: 'window',
      relevantEdge: findEdgeByCategory(p, 'regulation') || findEdgeByCategory(p, 'communication'),
      eyebrow: 'YOUR REGULATION CAPACITY',
    };
  },

  // Step 8 — Build New Patterns: Values
  8: (p) => {
    const vc = p.compositeScores.valuesCongruence;
    const coreValues = p.fourLens.values?.coreValues ?? [];
    const valuesStr = coreValues.length > 0
      ? coreValues.slice(0, 3).join(', ')
      : 'your core values';
    return {
      text: `Your values congruence is ${Math.round(vc)}/100. Your top values are ${valuesStr}. The new patterns you build here should align with what matters most.`,
      audioCategory: null,
      relevantEdge: findEdgeByCategory(p, 'values'),
      eyebrow: 'YOUR VALUES COMPASS',
    };
  },

  // Step 9 — Repair: Conflict + Differentiation
  9: (p) => {
    const cf = p.compositeScores.conflictFlexibility;
    const diff = p.compositeScores.differentiation;
    const rr = p.negativeCycle?.repairReadiness;
    const repairText = rr
      ? ` Your repair readiness: ${Math.round(rr.canMakeRepair)}/100 to initiate, ${Math.round(rr.canReceiveRepair)}/100 to receive.`
      : '';
    return {
      text: `Conflict flexibility (${Math.round(cf)}/100) and differentiation (${Math.round(diff)}/100) are the raw materials of repair.${repairText}`,
      audioCategory: 'parts',
      relevantEdge: findEdgeByCategory(p, 'conflict') || findEdgeByCategory(p, 'differentiation'),
      eyebrow: 'YOUR REPAIR LANDSCAPE',
    };
  },

  // Step 10 — Build Rituals: Values + Growth edges
  10: (p) => {
    const vc = p.compositeScores.valuesCongruence;
    const edgeCount = p.growthEdges?.length ?? 0;
    return {
      text: `Your values congruence is ${Math.round(vc)}/100 with ${edgeCount} growth edge${edgeCount !== 1 ? 's' : ''} identified. Rituals last when they align with what matters most.`,
      audioCategory: null,
      relevantEdge: p.growthEdges?.[0] ?? null,
      eyebrow: 'YOUR GROWTH LANDSCAPE',
    };
  },

  // Steps 11-12: Growth arc (retake comparison would go here)
  11: (p) => {
    const as = p.compositeScores.attachmentSecurity;
    return {
      text: `Your attachment security is ${Math.round(as)}/100. Retaking assessments now reveals growth you can\u2019t see from inside the journey.`,
      audioCategory: 'orientation',
      relevantEdge: null,
      eyebrow: 'YOUR GROWTH ARC',
    };
  },

  12: (p) => {
    const as = p.compositeScores.attachmentSecurity;
    const eq = p.compositeScores.emotionalIntelligence;
    const reg = p.compositeScores.regulationScore;
    return {
      text: `Security: ${Math.round(as)}/100, EQ: ${Math.round(eq)}/100, Regulation: ${Math.round(reg)}/100. The delta between then and now is your evidence of growth.`,
      audioCategory: 'orientation',
      relevantEdge: null,
      eyebrow: 'YOUR FULL PORTRAIT',
    };
  },
};

// ─── Helpers ────────────────────────────────────────────

function findEdgeByCategory(p: IndividualPortrait, category: string): GrowthEdge | null {
  return p.growthEdges?.find((e) => e.category === category) ?? null;
}

// ─── Public API ─────────────────────────────────────────

/**
 * Get the portrait insight for a specific step.
 * Returns null if no portrait or no insight for this step.
 */
export function getStepPortraitInsight(
  stepNumber: number,
  portrait: IndividualPortrait | null,
): StepInsightResult | null {
  if (!portrait) return null;
  const generator = STEP_INSIGHTS[stepNumber];
  if (!generator) return null;

  try {
    return generator(portrait);
  } catch {
    // Gracefully handle missing portrait data
    return null;
  }
}
