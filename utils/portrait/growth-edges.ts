import type {
  ValuesScores,
  DSIRScores,
  IPIPScores,
  CompositeScores,
  DetectedPattern,
  GrowthEdge,
} from '@/types';
import { VALUE_DOMAINS } from '@/utils/assessments/configs/values';

// Modality routing engine — enhances growth edges with multi-lens content
import '@/utils/modalities/seed-content'; // auto-registers seed content on import
import { routePatternToModalities, scoreSeverity } from '@/utils/modalities/routing-engine';
import { getPatternsWithContent } from '@/utils/modalities/modality-content';

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
  patterns: DetectedPattern[],
  ipip?: IPIPScores,
): GrowthEdge[] {
  const candidates: GrowthEdge[] = [];

  // ── 1. Regulation (foundational) ──
  if (composite.regulationScore < 40) {
    candidates.push({
      id: 'regulation_capacity',
      category: 'regulation',
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
      category: 'values',
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
      category: 'differentiation',
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

  // ── 5. Empathy capacity (from EQ expansion) ──
  const hasEmpathyEdge = candidates.some((c) => c.id.includes('empathic') || c.id.includes('perspective'));
  if (!hasEmpathyEdge && composite.perspectiveTaking != null && composite.perspectiveTaking < 40) {
    candidates.push({
      id: 'build_perspective_taking',
      category: 'empathy',
      title: 'Seeing Through Their Eyes',
      description:
        `Your perspective-taking capacity is developing (${composite.perspectiveTaking}/100). ` +
        'When conflict arises, it is hard to step into your partner\'s position — ' +
        'which means repairs stall before they start.',
      rationale:
        'Perspective-taking is the single strongest predictor of repair success. ' +
        'You do not have to agree with your partner — you just have to be able to see what they see.',
      practices: [
        'Before responding in a disagreement, ask: "What does this look like from where you are standing?"',
        'Practice the 2-chair exercise: sit in your partner\'s seat and speak as them for 2 minutes',
        'After a conflict, write 3 sentences describing the situation from your partner\'s perspective',
      ],
    });
  }
  if (!hasEmpathyEdge && composite.empathicResonance != null && composite.empathicResonance < 30) {
    candidates.push({
      id: 'open_empathic_channel',
      category: 'empathy',
      title: 'Opening the Empathic Channel',
      description:
        `Your empathic resonance is low (${composite.empathicResonance}/100). ` +
        'You may not easily feel what your partner feels — their joy, their pain, ' +
        'their fear. This can create a sense of emotional distance.',
      rationale:
        'Empathic resonance is not about fixing or understanding — it is about feeling WITH. ' +
        'Your partner needs to know their experience lands in you.',
      practices: [
        'Sit with your partner for 2 minutes in silence. Notice what you feel in your body — not what you think',
        'When your partner shares something emotional, pause before responding and notice your body\'s reaction',
        'Practice the sentence: "When you feel that, something in me feels..."',
      ],
    });
  }

  // Return top 5, de-duped (raised from 3 to ensure richer portrait)
  const seen = new Set<string>();
  const result: GrowthEdge[] = [];
  for (const edge of candidates) {
    if (!seen.has(edge.id)) {
      seen.add(edge.id);
      result.push(edge);
    }
    if (result.length >= 5) break;
  }
  // ── 6. Enrich with modality-routed content (V2.1) ──
  const patternsWithContent = getPatternsWithContent();
  if (patternsWithContent.length > 0) {
    const profile = {
      compositeScores: composite,
      values,
      openness: ipip?.domainPercentiles?.openness ?? 50,
      spiritualityValue: values?.domainScores?.spirituality?.importance ?? 5,
      growthValue: values?.domainScores?.growth?.importance ?? 5,
    };

    for (const edge of result) {
      // Only enrich edges that match patterns with modality content
      if (!patternsWithContent.includes(edge.id)) continue;

      const severity = scoreSeverity(composite.regulationScore ?? 50);
      const routed = routePatternToModalities(edge.id, severity, profile);
      if (routed.length === 0) continue;

      // Append modality insights and practices to the edge
      const modalityInsights = routed.map(
        (r) => `[${r.modalityName}] ${r.content.insight}`,
      );
      const modalityPractices = routed.map(
        (r) => r.content.practice,
      );

      // Store routed content as additional data on the edge
      (edge as any).modalityContent = routed.map((r) => ({
        modality: r.modalityName,
        role: r.role,
        insight: r.content.insight,
        bodyCheck: r.content.bodyCheck,
        practice: r.content.practice,
        quote: r.content.quote,
        quoteAttribution: r.content.quoteAttribution,
      }));

      // Enrich practices with modality-specific ones (append, don't replace)
      for (const mp of modalityPractices) {
        if (!edge.practices.includes(mp)) {
          edge.practices.push(mp);
        }
      }
    }
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

/**
 * Maps each growth edge ID to recommended exercises from the registry.
 * These are the actionable practices that users can actually DO.
 * The text practices on each GrowthEdge remain as narrative guidance;
 * these exercise IDs link to the real interactive exercises.
 */
export const EDGE_EXERCISE_MAP: Record<string, string[]> = {
  // Regulation capacity → regulation + grounding exercises
  regulation_capacity: [
    'window-check',
    'grounding-5-4-3-2-1',
    'self-compassion-break',
    'distress-tolerance-together',
  ],
  // Speaking your truth → communication exercises
  speak_truth: [
    'soft-startup',
    'dear-man',
    'four-horsemen-antidotes',
    'unified-detachment',
  ],
  // Approaching closeness → attachment exercises
  approach_closeness: [
    'emotional-bid',
    'hold-me-tight',
    'bonding-through-vulnerability',
    'turning-toward',
  ],
  // Differentiation work → differentiation + values exercises
  differentiation_work: [
    'parts-check-in',
    'defusion-from-stories',
    'protector-dialogue',
    'values-compass',
  ],
  // Empathy × differentiation growth edges
  empathic_enmeshment: [
    'parts-check-in',
    'grounding-5-4-3-2-1',
    'defusion-from-stories',
    'window-check',
  ],
  empathic_disconnection: [
    'emotional-bid',
    'hold-me-tight',
    'bonding-through-vulnerability',
    'self-compassion-break',
  ],
  avoidant_low_perspective: [
    'repair-attempt',
    'soft-startup',
    'emotional-bid',
    'turning-toward',
  ],
  anxious_high_perspective: [
    'window-check',
    'grounding-5-4-3-2-1',
    'self-compassion-break',
    'distress-tolerance-together',
  ],
  build_perspective_taking: [
    'repair-attempt',
    'soft-startup',
    'unified-detachment',
    'emotional-bid',
  ],
  open_empathic_channel: [
    'emotional-bid',
    'bonding-through-vulnerability',
    'hold-me-tight',
    'turning-toward',
  ],
  // Reclaiming self → differentiation + acceptance exercises
  reclaim_self: [
    'protector-dialogue',
    'defusion-from-stories',
    'parts-check-in',
    'radical-acceptance',
  ],
};

/**
 * Get exercises for a growth edge, falling back to values exercises
 * for dynamic values_gap_* edges.
 */
export function getExercisesForEdge(edgeId: string): string[] {
  if (EDGE_EXERCISE_MAP[edgeId]) return EDGE_EXERCISE_MAP[edgeId];
  // Values gap edges (values_gap_honesty, values_gap_intimacy, etc.)
  if (edgeId.startsWith('values_gap_')) {
    return [
      'values-compass',
      'relationship-values-compass',
      'willingness-stance',
      'relationship-mission-statement',
    ];
  }
  return [];
}

/**
 * Reverse lookup: given an array of practice IDs (e.g. from a step),
 * return which growth edges they support.
 */
export function getEdgesForPractices(
  practiceIds: string[],
): Array<{ edgeId: string; matchingPractices: string[] }> {
  const results: Array<{ edgeId: string; matchingPractices: string[] }> = [];
  const practiceSet = new Set(practiceIds);

  for (const [edgeId, exerciseIds] of Object.entries(EDGE_EXERCISE_MAP)) {
    const matching = exerciseIds.filter((id) => practiceSet.has(id));
    if (matching.length > 0) {
      results.push({ edgeId, matchingPractices: matching });
    }
  }

  // Also check values exercises for any values_gap_* edges
  const valuesExercises = [
    'values-compass',
    'relationship-values-compass',
    'willingness-stance',
    'relationship-mission-statement',
  ];
  const valuesMatch = valuesExercises.filter((id) => practiceSet.has(id));
  if (valuesMatch.length > 0 && !results.some((r) => r.edgeId.startsWith('values_gap'))) {
    // Return a generic values_gap marker — caller should cross-ref with portrait edges
    results.push({ edgeId: 'values_gap', matchingPractices: valuesMatch });
  }

  return results;
}

const PATTERN_EDGES: Record<string, GrowthEdge> = {
  // ── Empathy × Differentiation patterns (from Enhancement 3) ──
  empathic_enmeshment: {
    id: 'empathic_enmeshment',
    category: 'empathy',
    title: 'Feeling Deeply Without Losing Yourself',
    description:
      'You feel everything your partner feels — and your sense of self blurs in the process. ' +
      'This is deep attunement without a container. The work is not to feel less, ' +
      'but to build a stronger sense of where you end and they begin.',
    rationale:
      'Empathic enmeshment exhausts both partners. Your partner cannot be fully themselves ' +
      'if their emotions are always yours to carry. Differentiation is the gift you give each other.',
    practices: [
      'When you feel your partner\'s emotion, pause and ask: "Is this mine or theirs?"',
      'Practice the hand-on-heart exercise: one hand on your heart, notice YOUR heartbeat, YOUR breath',
      'After absorbing your partner\'s mood, do one thing that is just yours — walk, journal, listen to music',
    ],
  },
  empathic_disconnection: {
    id: 'empathic_disconnection',
    category: 'empathy',
    title: 'Opening to Your Partner\'s Experience',
    description:
      'Your system has learned to shut down incoming emotional signals. ' +
      'This protects you from overwhelm but leaves your partner feeling unseen. ' +
      'The work is cracking the door open — not flooding it.',
    rationale:
      'Your partner needs to know their experience lands in you. Not that you fix it, ' +
      'not that you understand it — that you FEEL it, even slightly.',
    practices: [
      'Sit with your partner for 2 minutes in silence. Just notice what arises in your body',
      'When they share something hard, resist the urge to problem-solve. Just say: "I hear you"',
      'Practice noticing your partner\'s face before their words — what emotion do you see?',
    ],
  },
  avoidant_low_perspective: {
    id: 'avoidant_low_perspective',
    category: 'empathy',
    title: 'Breaking the Repair Bottleneck',
    description:
      'You struggle to see your partner\'s perspective AND your instinct is to withdraw. ' +
      'This creates a double block: repairs cannot happen because neither reaching nor ' +
      'understanding is available.',
    rationale:
      'Your partner is not asking you to agree — they are asking you to SEE them. ' +
      'One question before withdrawing can change the entire pattern.',
    practices: [
      'Before withdrawing, ask one question: "Help me understand what this feels like for you"',
      'Practice the 5-minute rule: stay present for 5 more minutes before taking space',
      'After a conflict, write your partner\'s perspective in 3 sentences — even imperfectly',
    ],
  },
  anxious_high_perspective: {
    id: 'anxious_high_perspective',
    category: 'empathy',
    title: 'Using What You Know',
    description:
      'You understand your partner clearly — you can see exactly where they are and why. ' +
      'But your anxiety overrides that understanding. The insight is there; ' +
      'the regulation is the growth edge.',
    rationale:
      'You have a rare gift: deep perspective-taking. The work is not more understanding — ' +
      'it is learning to trust the understanding you already have and act from it, not from fear.',
    practices: [
      'When anxiety spikes, pause and write down what you KNOW about your partner\'s position',
      'Practice the mantra: "I understand them. My anxiety is not information right now"',
      'Do a body scan before initiating a repair — check if you are in your window first',
    ],
  },
  values_honesty_avoids_conflict: {
    id: 'speak_truth',
    category: 'communication',
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
    category: 'attachment',
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
    category: 'differentiation',
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
