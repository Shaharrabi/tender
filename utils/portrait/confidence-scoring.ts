/**
 * confidence-scoring.ts — Cross-assessment pattern confidence scoring.
 *
 * Every detected pattern gets a confidence level based on how many
 * independent assessments corroborate it.
 *
 * Convergence levels:
 *   1 (Emerging)  — single source
 *   2 (Supported) — two independent sources
 *   3 (Strong)    — three or more sources
 */

import type {
  ECRRScores,
  DUTCHScores,
  SSEITScores,
  DSIRScores,
  IPIPScores,
  ValuesScores,
  DetectedPattern,
} from '@/types';

// ─── Types ────────────────────────────────────────────

export interface PatternConfidence {
  pattern: DetectedPattern;
  supportingAssessments: string[];
  convergenceScore: 1 | 2 | 3;
  confidenceLabel: 'Emerging' | 'Supported' | 'Strong';
  evidenceSummary: string;
}

interface AssessmentBundle {
  ecrr: ECRRScores;
  dutch: DUTCHScores;
  sseit: SSEITScores;
  dsir: DSIRScores;
  ipip: IPIPScores;
  values: ValuesScores;
}

// ─── Evidence Checks ──────────────────────────────────

type EvidenceCheck = (bundle: AssessmentBundle) => string | null;

/**
 * Map of flag → array of evidence check functions.
 * Each function returns an assessment name if the flag is corroborated, null otherwise.
 */
const FLAG_EVIDENCE: Record<string, EvidenceCheck[]> = {
  // Self-abandonment risk
  self_abandonment_risk: [
    (b) => b.ecrr.anxietyScore > 4.0 ? 'ECR-R (Attachment)' : null,
    (b) => b.dutch.primaryStyle === 'yielding' ? 'DUTCH (Conflict)' : null,
    (b) => (b.dsir.subscaleScores.fusionWithOthers?.normalized ?? 50) < 40 ? 'DSI-R (Differentiation)' : null,
    (b) => (b.sseit.subscaleNormalized.managingOwn ?? 50) < 50 ? 'SSEIT (EQ)' : null,
    (b) => (b.ipip.facetPercentiles?.['A4_Cooperation'] ?? 50) > 75 ? 'IPIP-NEO (Personality)' : null,
  ],

  // Pursue-withdraw risk
  pursue_withdraw_risk: [
    (b) => b.ecrr.anxietyScore > 4.0 ? 'ECR-R (Anxiety)' : null,
    (b) => b.ecrr.avoidanceScore > 3.5 ? 'ECR-R (Avoidance)' : null,
    (b) => b.dutch.primaryStyle === 'avoiding' || b.dutch.primaryStyle === 'yielding' ? 'DUTCH (Conflict)' : null,
    (b) => (b.dsir.subscaleScores.emotionalCutoff?.normalized ?? 50) < 40 ? 'DSI-R (Cutoff)' : null,
  ],

  // Regulation priority
  regulation_priority: [
    (b) => b.ipip.domainPercentiles.neuroticism > 70 ? 'IPIP-NEO (Neuroticism)' : null,
    (b) => (b.sseit.subscaleNormalized.managingOwn ?? 50) < 45 ? 'SSEIT (Self-Regulation)' : null,
    (b) => (b.dsir.subscaleScores.emotionalReactivity?.normalized ?? 50) < 40 ? 'DSI-R (Reactivity)' : null,
    (b) => b.ecrr.anxietyScore > 4.5 ? 'ECR-R (High Anxiety)' : null,
  ],

  // Values-behavior gap
  growth_edge_candidate: [
    (b) => {
      const gaps = Object.values(b.values.domainScores).map(d => d.gap);
      return gaps.some(g => g > 2.5) ? 'Values Assessment (Gaps)' : null;
    },
    (b) => b.dutch.primaryStyle === 'yielding' || b.dutch.primaryStyle === 'avoiding' ? 'DUTCH (Avoidant Conflict)' : null,
    (b) => (b.dsir.subscaleScores.iPosition?.normalized ?? 50) < 45 ? 'DSI-R (I-Position)' : null,
  ],

  // Emotional flooding
  flooding_risk: [
    (b) => b.ipip.domainPercentiles.neuroticism > 75 ? 'IPIP-NEO (Neuroticism)' : null,
    (b) => (b.sseit.subscaleNormalized.managingOwn ?? 50) < 40 ? 'SSEIT (Self-Regulation)' : null,
    (b) => b.ecrr.anxietyScore > 5.0 ? 'ECR-R (High Anxiety)' : null,
    (b) => (b.dsir.subscaleScores.emotionalReactivity?.normalized ?? 50) < 35 ? 'DSI-R (Reactivity)' : null,
  ],

  // Emotional cutoff / avoidance
  emotional_cutoff_risk: [
    (b) => b.ecrr.avoidanceScore > 4.0 ? 'ECR-R (Avoidance)' : null,
    (b) => (b.dsir.subscaleScores.emotionalCutoff?.normalized ?? 50) < 35 ? 'DSI-R (Cutoff)' : null,
    (b) => b.dutch.primaryStyle === 'avoiding' ? 'DUTCH (Avoiding)' : null,
    (b) => b.ipip.domainPercentiles.extraversion < 30 ? 'IPIP-NEO (Low Extraversion)' : null,
  ],

  // Differentiation challenge
  differentiation_challenge: [
    (b) => (b.dsir.subscaleScores.fusionWithOthers?.normalized ?? 50) < 40 ? 'DSI-R (Fusion)' : null,
    (b) => (b.dsir.subscaleScores.iPosition?.normalized ?? 50) < 40 ? 'DSI-R (I-Position)' : null,
    (b) => b.ecrr.anxietyScore > 4.0 ? 'ECR-R (Anxiety)' : null,
    (b) => (b.ipip.facetPercentiles?.['A4_Cooperation'] ?? 50) > 80 ? 'IPIP-NEO (High Cooperation)' : null,
  ],
};

// ─── Assessment Name Map ──────────────────────────────

const ASSESSMENT_DISPLAY: Record<string, string> = {
  'ECR-R': 'attachment data',
  'DUTCH': 'conflict style',
  'SSEIT': 'emotional intelligence',
  'DSI-R': 'differentiation',
  'IPIP-NEO': 'personality profile',
  'Values': 'values assessment',
};

function generateEvidenceSummary(sources: string[], _pattern: DetectedPattern): string {
  if (sources.length === 0) return 'This pattern was detected from your assessment profile.';

  // Extract assessment names
  const assessmentKeys = sources.map(s => {
    const match = s.match(/^([A-Z-]+)/);
    return match ? ASSESSMENT_DISPLAY[match[1]] ?? s : s;
  });

  const unique = [...new Set(assessmentKeys)];

  if (unique.length >= 3) {
    const last = unique.pop();
    return `Your ${unique.join(', ')}, AND ${last} all point to this pattern.`;
  }
  if (unique.length === 2) {
    return `Two areas of your profile reflect this dynamic: your ${unique[0]} and ${unique[1]}.`;
  }
  return `This pattern appeared in your ${unique[0]} — worth noticing, but less certain.`;
}

// ─── Main Function ────────────────────────────────────

/**
 * Calculate confidence for a single detected pattern.
 */
export function calculatePatternConfidence(
  pattern: DetectedPattern,
  bundle: AssessmentBundle
): PatternConfidence {
  const sources: string[] = [];

  // Check all flags on this pattern against evidence map
  for (const flag of pattern.flags) {
    const checks = FLAG_EVIDENCE[flag];
    if (!checks) continue;

    for (const check of checks) {
      const source = check(bundle);
      if (source && !sources.includes(source)) {
        sources.push(source);
      }
    }
  }

  // Also count category-based evidence (the pattern category itself implies at least one source)
  if (sources.length === 0) {
    sources.push(getCategorySource(pattern.category));
  }

  const convergence = Math.min(sources.length, 3) as 1 | 2 | 3;

  return {
    pattern,
    supportingAssessments: sources,
    convergenceScore: convergence,
    confidenceLabel: convergence >= 3 ? 'Strong' : convergence >= 2 ? 'Supported' : 'Emerging',
    evidenceSummary: generateEvidenceSummary(sources, pattern),
  };
}

/**
 * Score confidence for all detected patterns at once.
 */
export function scoreAllPatternConfidence(
  patterns: DetectedPattern[],
  bundle: AssessmentBundle
): PatternConfidence[] {
  return patterns.map((p) => calculatePatternConfidence(p, bundle));
}

// ─── Helpers ──────────────────────────────────────────

function getCategorySource(category: string): string {
  switch (category) {
    case 'attachment-conflict': return 'ECR-R + DUTCH';
    case 'regulation': return 'SSEIT + IPIP';
    case 'values-behavior': return 'Values Assessment';
    case 'differentiation': return 'DSI-R';
    case 'field-awareness': return 'Supplement data';
    default: return 'Assessment profile';
  }
}
