import type {
  ValuesScores,
  DSIRScores,
  CompositeScores,
  DetectedPattern,
  GrowthEdge,
} from '@/types';
import { VALUE_DOMAINS } from '@/utils/assessments/configs/values';

/**
 * Identify 2-3 key growth edges based on patterns, gaps, and scores.
 * Priority order:
 *   1. Regulation deficits (foundational)
 *   2. High-gap values
 *   3. Values-behavior pattern conflicts
 *   4. Differentiation needs
 */
export function identifyGrowthEdges(
  values: ValuesScores,
  dsir: DSIRScores,
  composite: CompositeScores,
  patterns: DetectedPattern[]
): GrowthEdge[] {
  const candidates: GrowthEdge[] = [];

  // ── 1. Regulation (foundational) ──
  if (composite.regulationScore < 40) {
    candidates.push({
      id: 'regulation_capacity',
      title: 'Widening Your Window',
      description:
        `Your window of tolerance is narrow (regulation score: ` +
        `${composite.regulationScore}/100). You flood quickly when emotions ` +
        'rise, which makes staying connected during conflict very difficult.',
      rationale:
        'Everything else gets easier when you can stay regulated longer. ' +
        'This is foundational work.',
      practices: [
        'Daily grounding practice (box breathing, body scan) — even 3 minutes',
        'Notice early signs of activation before you flood',
        'Practice taking breaks before you are overwhelmed',
        'Co-regulate with your partner in calm moments to build capacity',
      ],
    });
  }

  // ── 2. Values gaps ──
  for (const domainId of values.highGapDomains.slice(0, 2)) {
    const scores = values.domainScores[domainId];
    if (!scores) continue;
    const domain = VALUE_DOMAINS.find((d) => d.id === domainId);
    const label = domain?.label ?? domainId;

    candidates.push({
      id: `values_gap_${domainId}`,
      title: `Living Your Value: ${label}`,
      description:
        `${label} matters deeply to you (${scores.importance}/10 importance), ` +
        `but there is a ${scores.gap.toFixed(1)}-point gap between what you ` +
        'want and how you are currently living it.',
      rationale:
        'This gap creates internal tension and may be contributing to ' +
        'relationship dissatisfaction. Closing it is about aligning your ' +
        'actions with your heart.',
      practices: VALUES_PRACTICES[domainId] ?? [
        'Identify one concrete behavior that would close the gap',
        'Practice that behavior weekly',
        'Reflect on what makes it difficult',
      ],
    });
  }

  // ── 3. Pattern-based edges ──
  const growthCandidates = patterns.filter((p) =>
    p.flags.includes('growth_edge_candidate')
  );
  for (const pattern of growthCandidates) {
    const edge = PATTERN_EDGES[pattern.id];
    if (edge) candidates.push(edge);
  }

  // ── 4. Differentiation needs ──
  const iPosition = dsir.subscaleScores.iPosition.normalized;
  const fusion = dsir.subscaleScores.fusionWithOthers.normalized;
  if (iPosition < 40 && fusion < 40 && !candidates.some((c) => c.id.includes('differentiation'))) {
    candidates.push({
      id: 'differentiation_work',
      title: 'Knowing Who You Are',
      description:
        'Your sense of self in relationships is still forming. You may ' +
        "lose track of your own needs, beliefs, or boundaries when you're " +
        'close to someone.',
      rationale:
        "Healthy connection requires two people who know where they end " +
        'and the other begins. Differentiation is the foundation.',
      practices: [
        'Practice stating your opinion even when it differs from your partner',
        "Notice when you're editing yourself to match them",
        'Spend time on activities that are just yours',
        "Ask yourself: \"What do I actually think about this?\" before responding",
      ],
    });
  }

  // Return top 3, de-duped
  const seen = new Set<string>();
  const result: GrowthEdge[] = [];
  for (const edge of candidates) {
    if (!seen.has(edge.id)) {
      seen.add(edge.id);
      result.push(edge);
    }
    if (result.length >= 3) break;
  }
  return result;
}

// ─── Practice Templates ──────────────────────────────────

const VALUES_PRACTICES: Record<string, string[]> = {
  honesty: [
    'Share one small truth per week that you would normally keep to yourself',
    "Notice when you are editing yourself and pause to ask why",
    'Practice saying "That doesn\'t feel right to me" without over-explaining',
  ],
  intimacy: [
    'Initiate one vulnerable share per week',
    "Ask deeper questions about your partner's inner world",
    'Practice receiving care without deflecting',
  ],
  growth: [
    'Choose one area of personal development and take a small step this week',
    'Read or listen to something that stretches your perspective',
    'Ask your partner: "What is one way I could grow?"',
  ],
  security: [
    'Follow through on one small promise you make this week',
    'Be consistent in your routines and check-ins',
    'Name when you feel insecure rather than acting it out',
  ],
  adventure: [
    'Suggest one new experience this month — even something small',
    'Say yes to something that feels slightly outside your comfort zone',
    'Break a routine you have outgrown',
  ],
  independence: [
    'Schedule time for an activity that is just yours — no guilt',
    'Practice making a decision without consulting your partner first',
    'Notice when you are merging and consciously reclaim your space',
  ],
  family: [
    'Have one honest conversation about your vision for family',
    'Connect with extended family in a way that feels meaningful',
    'Discuss what legacy means to each of you',
  ],
  service: [
    'Find one way to contribute together — volunteer, help a neighbor',
    'Discuss what causes matter to each of you',
    'Practice generosity in small, daily ways',
  ],
  playfulness: [
    'Protect time for fun — schedule it if you must',
    'Laugh together at least once a day',
    'Let something imperfect slide and find the humor in it',
  ],
  spirituality: [
    'Share what gives your life meaning beyond the day-to-day',
    'Explore a spiritual or contemplative practice together',
    'Discuss what purpose your relationship serves',
  ],
};

const PATTERN_EDGES: Record<string, GrowthEdge> = {
  values_honesty_avoids_conflict: {
    id: 'speak_truth',
    title: 'Speaking Your Truth',
    description:
      'You value honesty but avoid difficult conversations. This creates ' +
      'a split between who you want to be and what you actually do.',
    rationale:
      'The cost of silence is higher than you think — resentment builds, ' +
      "authenticity erodes, and your partner can't know or meet you fully.",
    practices: [
      'Start with low-stakes truth-telling',
      "Name what you are afraid of before sharing the truth",
      'Use "I" statements: "I feel..." not "You always..."',
      'Practice tolerating the discomfort of being seen',
    ],
  },
  values_intimacy_avoids_closeness: {
    id: 'approach_closeness',
    title: 'Approaching Closeness',
    description:
      'You long for deep connection but your system pulls you away from it. ' +
      'Learning to tolerate closeness in increasing doses is your edge.',
    rationale:
      'Your longing for intimacy is real, even when your nervous system ' +
      "says \"retreat.\" The closeness you want is on the other side of the fear.",
    practices: [
      'Stay present 10 seconds longer than your instinct says to',
      'Practice receiving affection without deflecting',
      'Share one feeling per week that makes you feel exposed',
      'Tell your partner when you are pulling away and why',
    ],
  },
  values_autonomy_but_fused: {
    id: 'reclaim_self',
    title: 'Reclaiming Your Self',
    description:
      'You value independence but tend to merge with your partner. ' +
      'Knowing where you end and they begin is key.',
    rationale:
      "Losing yourself in relationship feels like love, but it is actually " +
      'fusion. Real intimacy requires two distinct people choosing closeness.',
    practices: [
      'Practice stating your opinion before hearing your partner\'s',
      'Spend regular time alone doing something meaningful to you',
      "Notice when you are agreeing just to keep the peace",
      "Ask yourself: \"Is this what I want, or what they want?\"",
    ],
  },
};
