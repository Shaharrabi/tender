import type {
  ECRRScores,
  IPIPScores,
  SSEITScores,
  DSIRScores,
  DUTCHScores,
  ValuesScores,
  CompositeScores,
} from '@/types';

/**
 * Calculate composite scores that integrate data across all 6 assessments.
 * Original 7 scores (0-100) plus 5 radar chart dimensions added in Sprint 1.
 * Formulas come from the integration-algorithm spec + portrait enhancement spec.
 */
export function calculateCompositeScores(
  ecrr: ECRRScores,
  ipip: IPIPScores,
  sseit: SSEITScores,
  dsir: DSIRScores,
  values: ValuesScores,
  dutch?: DUTCHScores
): CompositeScores {
  // ── Normalize ECR-R (1-7 → 0-100) ──
  const avoidanceNorm = ((ecrr.avoidanceScore - 1) / 6) * 100;

  // ── IPIP relative scores (0-100, logistic transform — NOT true population percentiles) ──
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
  // Apply a growth-ceiling factor (0.8) so baseline scores leave room for the
  // growth boost (up to +20) to feel meaningful. Without this, many users
  // start at 80-90 and immediately hit the 100 cap with no visible progress.
  const GF = 0.8;

  const regulationScore = clamp(
    ((100 - neuroPct) * 0.4 + eqManagingOwn * 0.3 + dsiReactivity * 0.3) * GF
  );

  const windowWidth = clamp(
    ((100 - neuroPct) * 0.3 +
      dsiCutoff * 0.2 +
      dsiReactivity * 0.3 +
      eqManagingOwn * 0.2) * GF
  );

  // High cutoff normalized = high differentiation on cutoff = *low* actual cutoff behavior
  // So for accessibility we want low avoidance + low cutoff behavior → use dsiCutoff directly
  const accessibility = clamp(
    ((100 - avoidanceNorm) * 0.6 + dsiCutoff * 0.4) * GF
  );

  const responsiveness = clamp(
    (eqPerception * 0.3 +
      eqManagingOthers * 0.3 +
      agreePct * 0.2 +
      openPct * 0.2) * GF
  );

  const engagement = clamp(
    ((100 - avoidanceNorm) * 0.3 +
      extraPct * 0.2 +
      Math.min(intimacyImp * 10, 100) * 0.2 +
      eqUtilization * 0.3) * GF
  );

  const selfLeadership = clamp(
    (dsiReactivity * 0.3 +
      dsiIPosition * 0.3 +
      regulationScore / GF * 0.2 +  // use unscaled regulation for self-leadership input
      (100 - neuroPct) * 0.2) * GF
  );

  // Mean of (10 - gap) for all 10 value domains, scaled to 0-100
  const gapValues = Object.values(values.domainScores).map((d) => d.gap);
  const meanInverseGap =
    gapValues.reduce((sum, gap) => sum + (10 - gap), 0) / (gapValues.length || 1);
  const valuesCongruence = clamp(meanInverseGap * 10 * GF);

  // ═══════════ RADAR CHART DIMENSIONS (Sprint 1) ═══════════

  // 1. Attachment Security: inverse of anxiety + avoidance (ECR-R 1-7 scale)
  const anxietyNorm = ((ecrr.anxietyScore - 1) / 6) * 100;
  const attachmentSecurity = clamp(
    ((100 - anxietyNorm) * 0.5 + (100 - avoidanceNorm) * 0.5) * GF
  );

  // 2. Emotional Intelligence: SSEIT total (already 0-100)
  const emotionalIntelligence = clamp(sseit.totalNormalized * GF);

  // 3. Differentiation: DSI-R total normalized (already 0-100)
  const dsiTotal = (dsiReactivity + dsiIPosition + dsiCutoff +
    dsir.subscaleScores.fusionWithOthers.normalized) / 4;
  const differentiation = clamp(dsiTotal * GF);

  // 4. Conflict Flexibility: balance × quality of DUTCH conflict modes
  //    Balance (entropy): how evenly the 5 styles are used (0-100)
  //    Quality: overall engagement level across styles (mean of means / max)
  //    Blend: 60% balance + 40% quality — so balanced low-engagement ≠ 99
  let conflictFlexibility = 50; // fallback when no dutch data
  if (dutch) {
    const modes = ['yielding', 'compromising', 'forcing', 'problemSolving', 'avoiding'];
    const means = modes.map(m => dutch.subscaleScores[m]?.mean ?? 0);
    const total = means.reduce((s, v) => s + v, 0) || 1;
    const probs = means.map(m => m / total);
    const maxEntropy = Math.log(5); // ln(5)
    const entropy = -probs.reduce((s, p) => s + (p > 0 ? p * Math.log(p) : 0), 0);
    const balanceScore = (entropy / maxEntropy) * 100;

    // Quality: average engagement across styles (DUTCH uses 1-5 scale, normalize to 0-100)
    const avgMean = means.reduce((s, v) => s + v, 0) / means.length;
    const qualityScore = ((avgMean - 1) / 4) * 100; // 1→0, 5→100

    conflictFlexibility = clamp((balanceScore * 0.6 + qualityScore * 0.4) * GF);
  }

  // 5. Relational Awareness: EQ social awareness + perception + agreeableness
  const eqSocialAwareness = sseit.subscaleNormalized.managingOthers ?? 50;
  const relationalAwareness = clamp(
    (eqSocialAwareness * 0.35 + eqPerception * 0.35 + agreePct * 0.30) * GF
  );

  return {
    regulationScore,
    windowWidth,
    accessibility,
    responsiveness,
    engagement,
    selfLeadership,
    valuesCongruence,
    // Radar dimensions
    attachmentSecurity,
    emotionalIntelligence,
    differentiation,
    conflictFlexibility,
    relationalAwareness,
    // Raw ECR-R subscales for couple portrait attachment plotting
    anxietyNorm: clamp(anxietyNorm),
    avoidanceNorm: clamp(avoidanceNorm),
    // EQ expansion: perspective-taking and empathic resonance (pass-through from SSEIT)
    perspectiveTaking: sseit.subscaleNormalized?.perspectiveTaking ?? undefined,
    empathicResonance: sseit.subscaleNormalized?.empathicResonance ?? undefined,
  };
}

function clamp(n: number): number {
  return Math.round(Math.max(0, Math.min(100, n)));
}
