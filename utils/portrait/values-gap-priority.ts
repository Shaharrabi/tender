/**
 * values-gap-priority.ts — Growth edge prioritization engine.
 *
 * Ranks growth edges based on a multi-factor priority score:
 *   Factor 1: Values-behavior gap size (0-10 → weighted)
 *   Factor 2: Cross-assessment convergence (1-3 → weighted)
 *   Factor 3: Regulation readiness (can they work on this NOW?)
 *   Factor 4: Impact on negative cycle
 *   Factor 5: Values importance (higher importance = higher urgency)
 */

import type {
  DetectedPattern,
  CompositeScores,
  ValuesScores,
} from '@/types';
import { calculatePatternConfidence, type PatternConfidence } from './confidence-scoring';
import type { ECRRScores, DUTCHScores, SSEITScores, DSIRScores, IPIPScores } from '@/types';

// ─── Types ────────────────────────────────────────────

export interface PrioritizedGrowthEdge {
  pattern: DetectedPattern;
  priorityScore: number;
  confidence: PatternConfidence;
  relatedValueGap: ValueGapInfo | null;
  readiness: ReadinessAssessment;
  practiceRecommendation: string;
}

export interface ValueGapInfo {
  domain: string;
  importance: number;
  accordance: number;
  gap: number;
}

export interface ReadinessAssessment {
  level: 'ready' | 'needs_support' | 'regulation_first';
  explanation: string;
}

interface AssessmentBundle {
  ecrr: ECRRScores;
  dutch: DUTCHScores;
  sseit: SSEITScores;
  dsir: DSIRScores;
  ipip: IPIPScores;
  values: ValuesScores;
}

// ─── Value-Pattern Mapping ────────────────────────────

const FLAG_TO_VALUE_DOMAINS: Record<string, string[]> = {
  self_abandonment_risk: ['honesty', 'autonomy'],
  pursue_withdraw_risk: ['intimacy', 'security'],
  flooding_risk: ['security', 'honesty'],
  emotional_cutoff_risk: ['intimacy', 'growth'],
  differentiation_challenge: ['autonomy', 'honesty', 'growth'],
  growth_edge_candidate: [], // check all domains
};

// ─── Priority Calculation ─────────────────────────────

function findRelatedValueGap(
  pattern: DetectedPattern,
  values: ValuesScores
): ValueGapInfo | null {
  // Find the value domain most related to this pattern's flags
  const relatedDomains = new Set<string>();
  for (const flag of pattern.flags) {
    const domains = FLAG_TO_VALUE_DOMAINS[flag];
    if (domains) {
      if (domains.length === 0) {
        // Check all domains
        Object.keys(values.domainScores).forEach(d => relatedDomains.add(d));
      } else {
        domains.forEach(d => relatedDomains.add(d));
      }
    }
  }

  let biggest: ValueGapInfo | null = null;

  for (const domain of relatedDomains) {
    const data = values.domainScores[domain];
    if (!data) continue;
    if (!biggest || data.gap > biggest.gap) {
      biggest = {
        domain,
        importance: data.importance,
        accordance: data.accordance,
        gap: data.gap,
      };
    }
  }

  return biggest;
}

function assessReadiness(
  composite: CompositeScores,
  pattern: DetectedPattern
): ReadinessAssessment {
  const reg = composite.regulationScore;

  // If regulation is low and the pattern touches regulation, must do regulation first
  if (reg < 40 && pattern.flags.includes('regulation_priority')) {
    return {
      level: 'regulation_first',
      explanation: 'Regulation capacity needs strengthening before this pattern can be addressed directly. Start with body-based practices.',
    };
  }

  if (reg < 50) {
    return {
      level: 'needs_support',
      explanation: 'Working on this is possible but benefits from professional support. A therapist can help hold the process.',
    };
  }

  return {
    level: 'ready',
    explanation: 'Your regulation capacity supports working on this growth edge. Self-directed practice with reflective journaling is a good starting point.',
  };
}

function getPracticeRecommendation(
  pattern: DetectedPattern,
  readiness: ReadinessAssessment,
  valueGap: ValueGapInfo | null
): string {
  if (readiness.level === 'regulation_first') {
    return 'Start with 90-second body scans, 3x daily. Build your regulation foundation before addressing relational patterns.';
  }

  if (pattern.flags.includes('self_abandonment_risk')) {
    return 'Practice one "I-position" statement daily: "I feel ___ and I need ___." Start in low-stakes situations.';
  }

  if (pattern.flags.includes('pursue_withdraw_risk')) {
    return 'Create a pre-agreed pause signal with your partner. Use it when you notice the cycle starting. Always include a return time.';
  }

  if (pattern.flags.includes('flooding_risk')) {
    return 'Build a personal grounding toolkit: cold water on wrists, 4-7-8 breathing, naming 5 things you can see. Practice BEFORE you need it.';
  }

  if (pattern.flags.includes('emotional_cutoff_risk')) {
    return 'Stretch your window by staying 10% longer in emotional conversations than feels comfortable. Track the expansion over weeks.';
  }

  if (valueGap && valueGap.gap > 2) {
    return `Explore why ${valueGap.domain} matters to you but feels hard to live. What protective pattern kicks in? What would it cost to live it more fully?`;
  }

  return 'Start with reflective journaling: what patterns do you notice, and what small shift might you try?';
}

// ─── Main Function ────────────────────────────────────

/**
 * Prioritize growth edges based on multi-factor scoring.
 * Returns sorted list with highest priority first.
 */
export function prioritizeGrowthEdges(
  patterns: DetectedPattern[],
  composite: CompositeScores,
  bundle: AssessmentBundle
): PrioritizedGrowthEdge[] {
  const growthPatterns = patterns.filter(
    (p) => p.flags.includes('growth_edge_candidate') || p.confidence !== 'low'
  );

  const edges: PrioritizedGrowthEdge[] = growthPatterns.map((pattern) => {
    let priority = 0;

    // Factor 1: Values-behavior gap size (0-15)
    const valueGap = findRelatedValueGap(pattern, bundle.values);
    if (valueGap) {
      priority += valueGap.gap * 1.5;
      // Bonus for high-importance values with gaps
      if (valueGap.importance >= 8 && valueGap.gap > 2) {
        priority += 3;
      }
    }

    // Factor 2: Cross-assessment convergence (0-6)
    const confidence = calculatePatternConfidence(pattern, bundle);
    priority += confidence.convergenceScore * 2;

    // Factor 3: Regulation readiness (-2 to +3)
    const readiness = assessReadiness(composite, pattern);
    if (readiness.level === 'ready') priority += 3;
    else if (readiness.level === 'needs_support') priority += 1;
    else priority -= 2; // regulation first — deprioritize other work

    // Factor 4: Impact on negative cycle (0-5)
    if (pattern.flags.includes('pursue_withdraw_risk')) priority += 4;
    if (pattern.flags.includes('self_abandonment_risk')) priority += 3;
    if (pattern.flags.includes('flooding_risk')) priority += 3;
    if (pattern.flags.includes('emotional_cutoff_risk')) priority += 2;

    // Factor 5: Confidence level bonus (high confidence = more actionable)
    if (pattern.confidence === 'high') priority += 2;
    else if (pattern.confidence === 'medium') priority += 1;

    const practiceRecommendation = getPracticeRecommendation(pattern, readiness, valueGap);

    return {
      pattern,
      priorityScore: priority,
      confidence,
      relatedValueGap: valueGap,
      readiness,
      practiceRecommendation,
    };
  });

  return edges.sort((a, b) => b.priorityScore - a.priorityScore);
}
