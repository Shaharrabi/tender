import type {
  ECRRScores,
  IPIPScores,
  SSEITScores,
  DSIRScores,
  ValuesScores,
  CompositeScores,
} from '@/types';

/**
 * Calculate 7 composite scores that integrate data across all 6 assessments.
 * Each score is 0-100. Formulas come from the integration-algorithm spec.
 */
export function calculateCompositeScores(
  ecrr: ECRRScores,
  ipip: IPIPScores,
  sseit: SSEITScores,
  dsir: DSIRScores,
  values: ValuesScores
): CompositeScores {
  // ── Normalize ECR-R (1-7 → 0-100) ──
  const avoidanceNorm = ((ecrr.avoidanceScore - 1) / 6) * 100;

  // ── IPIP percentiles (already 0-100) ──
  const neuroPct = ipip.domainPercentiles.neuroticism;
  const extraPct = ipip.domainPercentiles.extraversion;
  const openPct = ipip.domainPercentiles.openness;
  const agreePct = ipip.domainPercentiles.agreeableness;

  // ── SSEIT normalized subscales (already 0-100) ──
  const eqPerception = sseit.subscaleNormalized.perception;
  const eqManagingOwn = sseit.subscaleNormalized.managingOwn;
  const eqManagingOthers = sseit.subscaleNormalized.managingOthers;
  const eqUtilization = sseit.subscaleNormalized.utilization;

  // ── DSI-R normalized subscales (already 0-100, higher = more differentiated) ──
  const dsiReactivity = dsir.subscaleScores.emotionalReactivity.normalized;
  const dsiIPosition = dsir.subscaleScores.iPosition.normalized;
  const dsiCutoff = dsir.subscaleScores.emotionalCutoff.normalized;

  // ── Values ──
  const intimacyImp = values.domainScores.intimacy?.importance ?? 5;

  // ═══════════ COMPOSITE CALCULATIONS ═══════════

  const regulationScore = clamp(
    (100 - neuroPct) * 0.4 + eqManagingOwn * 0.3 + dsiReactivity * 0.3
  );

  const windowWidth = clamp(
    (100 - neuroPct) * 0.3 +
      dsiCutoff * 0.2 +
      dsiReactivity * 0.3 +
      eqManagingOwn * 0.2
  );

  // High cutoff normalized = high differentiation on cutoff = *low* actual cutoff behavior
  // So for accessibility we want low avoidance + low cutoff behavior → use dsiCutoff directly
  const accessibility = clamp(
    (100 - avoidanceNorm) * 0.6 + dsiCutoff * 0.4
  );

  const responsiveness = clamp(
    eqPerception * 0.3 +
      eqManagingOthers * 0.3 +
      agreePct * 0.2 +
      openPct * 0.2
  );

  const engagement = clamp(
    (100 - avoidanceNorm) * 0.3 +
      extraPct * 0.2 +
      Math.min(intimacyImp * 10, 100) * 0.2 +
      eqUtilization * 0.3
  );

  const selfLeadership = clamp(
    dsiReactivity * 0.3 +
      dsiIPosition * 0.3 +
      regulationScore * 0.2 +
      (100 - neuroPct) * 0.2
  );

  // Mean of (10 - gap) for all 10 value domains, scaled to 0-100
  const gapValues = Object.values(values.domainScores).map((d) => d.gap);
  const meanInverseGap =
    gapValues.reduce((sum, gap) => sum + (10 - gap), 0) / (gapValues.length || 1);
  const valuesCongruence = clamp(meanInverseGap * 10);

  return {
    regulationScore,
    windowWidth,
    accessibility,
    responsiveness,
    engagement,
    selfLeadership,
    valuesCongruence,
  };
}

function clamp(n: number): number {
  return Math.round(Math.max(0, Math.min(100, n)));
}
