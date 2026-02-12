import type {
  ECRRScores,
  DUTCHScores,
  SSEITScores,
  DSIRScores,
  IPIPScores,
  ValuesScores,
  CompositeScores,
  DetectedPattern,
  PatternResult,
} from '@/types';

/**
 * Detect cross-assessment patterns across 4 categories.
 * Returns patterns + aggregated flag counts + priority flags.
 */
export function detectPatterns(
  ecrr: ECRRScores,
  dutch: DUTCHScores,
  sseit: SSEITScores,
  dsir: DSIRScores,
  ipip: IPIPScores,
  values: ValuesScores,
  composite: CompositeScores
): PatternResult {
  const allPatterns: DetectedPattern[] = [
    ...detectAttachmentConflict(ecrr, dutch),
    ...detectRegulation(sseit, composite),
    ...detectValuesBehavior(values, dutch, ecrr, dsir, ipip),
    ...detectDifferentiation(dsir),
  ];

  // Aggregate flags
  const flagCounts: Record<string, number> = {};
  for (const p of allPatterns) {
    for (const f of p.flags) {
      flagCounts[f] = (flagCounts[f] || 0) + 1;
    }
  }

  const priorityFlags = Object.entries(flagCounts)
    .filter(([, count]) => count >= 2)
    .map(([flag]) => flag);

  return {
    patterns: allPatterns,
    flagCounts,
    priorityFlags,
    hasRegulationPriority: priorityFlags.includes('regulation_priority'),
    hasGrowthEdgeCandidates: allPatterns.some((p) =>
      p.flags.includes('growth_edge_candidate')
    ),
  };
}

// ─── Category 1: Attachment × Conflict ───────────────────

function detectAttachmentConflict(
  ecrr: ECRRScores,
  dutch: DUTCHScores
): DetectedPattern[] {
  const patterns: DetectedPattern[] = [];
  const { anxietyScore, avoidanceScore } = ecrr;
  const avoiding = dutch.subscaleScores.avoiding?.mean ?? 0;
  const yielding = dutch.subscaleScores.yielding?.mean ?? 0;
  const problemSolving = dutch.subscaleScores.problemSolving?.mean ?? 0;

  // 1. Anxious + conflict-avoidant
  if (anxietyScore > 4.0 && avoiding > 3.5) {
    patterns.push({
      id: 'anxious_but_avoiding',
      category: 'attachment-conflict',
      description: 'High attachment anxiety combined with conflict avoidance',
      interpretation:
        'You deeply want connection but fear conflict will destroy it. This creates internal tension — longing to address issues but terrified of the conversation.',
      confidence: 'high',
      flags: ['pursue_withdraw_risk', 'resentment_accumulation'],
    });
  }

  // 2. Anxious + yielding
  if (anxietyScore > 4.0 && yielding > 3.5) {
    patterns.push({
      id: 'anxious_yielding',
      category: 'attachment-conflict',
      description: 'High attachment anxiety with high yielding',
      interpretation:
        'You accommodate to maintain connection. Over time this can mean losing yourself in the relationship.',
      confidence: 'high',
      flags: ['self_abandonment_risk', 'resentment_accumulation'],
    });
  }

  // 3. Avoidant + conflict-avoidant
  if (avoidanceScore > 4.0 && avoiding > 3.5) {
    patterns.push({
      id: 'avoidant_avoiding',
      category: 'attachment-conflict',
      description: 'High attachment avoidance with conflict avoidance',
      interpretation:
        'Double withdrawal pattern. You distance emotionally AND from conflict. Your partner may feel shut out.',
      confidence: 'high',
      flags: ['stonewalling_risk', 'emotional_distance'],
    });
  }

  // 4. Avoidant but collaborative
  if (avoidanceScore > 4.0 && problemSolving > 3.5) {
    patterns.push({
      id: 'avoidant_but_collaborative',
      category: 'attachment-conflict',
      description: 'High attachment avoidance but collaborative in conflict',
      interpretation:
        'You can engage intellectually with problems but may struggle with emotional content. You prefer logical solutions.',
      confidence: 'medium',
      flags: ['intellectual_bypass_risk'],
    });
  }

  return patterns;
}

// ─── Category 2: Regulation ──────────────────────────────

function detectRegulation(
  sseit: SSEITScores,
  composite: CompositeScores
): DetectedPattern[] {
  const patterns: DetectedPattern[] = [];
  const { regulationScore } = composite;

  // 5-7. Regulation capacity levels
  if (regulationScore < 35) {
    patterns.push({
      id: 'low_regulation_capacity',
      category: 'regulation',
      description: 'Limited self-regulation capacity across multiple measures',
      interpretation:
        "You have a narrow window of tolerance. When emotions rise, you flood quickly. This isn't a character flaw — your nervous system needs more support.",
      confidence: 'high',
      flags: ['flooding_risk', 'narrow_window', 'regulation_priority'],
    });
  } else if (regulationScore < 50) {
    patterns.push({
      id: 'moderate_regulation_capacity',
      category: 'regulation',
      description: 'Moderate self-regulation capacity',
      interpretation:
        'You can regulate under normal circumstances but struggle under pressure. Stress narrows your window.',
      confidence: 'high',
      flags: ['stress_vulnerability'],
    });
  } else {
    patterns.push({
      id: 'adequate_regulation_capacity',
      category: 'regulation',
      description: 'Adequate to good self-regulation capacity',
      interpretation:
        'You are generally able to manage emotional responses and can stay in your window longer.',
      confidence: 'high',
      flags: [],
    });
  }

  // 8. Aware but can't regulate
  const eqPerception = sseit.subscaleNormalized.perception;
  const eqManagingOwn = sseit.subscaleNormalized.managingOwn;
  if (eqPerception > 70 && eqManagingOwn < 50) {
    patterns.push({
      id: 'aware_but_cant_regulate',
      category: 'regulation',
      description: 'High emotional awareness but low regulation capacity',
      interpretation:
        "You know exactly what you're feeling, but struggle to manage it. \"I know I'm doing it but can't stop.\" This gap is workable.",
      confidence: 'high',
      flags: ['insight_action_gap'],
    });
  }

  return patterns;
}

// ─── Category 3: Values × Behavior ──────────────────────

function detectValuesBehavior(
  values: ValuesScores,
  dutch: DUTCHScores,
  ecrr: ECRRScores,
  dsir: DSIRScores,
  ipip: IPIPScores
): DetectedPattern[] {
  const patterns: DetectedPattern[] = [];
  const avoiding = dutch.subscaleScores.avoiding?.mean ?? 0;

  // 9. Values honesty but avoids conflict
  const honestyImp = values.domainScores.honesty?.importance ?? 0;
  if (honestyImp >= 8 && (avoiding > 3.0 || values.avoidanceTendency > 0.25)) {
    patterns.push({
      id: 'values_honesty_avoids_conflict',
      category: 'values-behavior',
      description:
        'High value on honesty/authenticity but avoids difficult conversations',
      interpretation:
        'You want to be authentic, but your protective system prioritizes safety over truth. This creates internal conflict and is a key growth edge.',
      confidence: 'high',
      flags: ['core_values_conflict', 'growth_edge_candidate'],
    });
  }

  // 10. Values intimacy but avoidant attachment
  const intimacyImp = values.domainScores.intimacy?.importance ?? 0;
  if (intimacyImp >= 8 && ecrr.avoidanceScore > 4.0) {
    patterns.push({
      id: 'values_intimacy_avoids_closeness',
      category: 'values-behavior',
      description: 'High value on intimacy but avoidant attachment pattern',
      interpretation:
        'You long for deep connection but your nervous system reads closeness as danger. An approach-avoidance dynamic.',
      confidence: 'high',
      flags: ['core_values_conflict', 'growth_edge_candidate'],
    });
  }

  // 11. Values autonomy but fused
  const independenceImp = values.domainScores.independence?.importance ?? 0;
  const fusionNorm = dsir.subscaleScores.fusionWithOthers.normalized;
  if (independenceImp >= 7 && fusionNorm < 40) {
    patterns.push({
      id: 'values_autonomy_but_fused',
      category: 'values-behavior',
      description: 'Values independence but tends to lose self in relationships',
      interpretation:
        'You want to maintain your identity but your pattern is to accommodate and merge. You may resent your partner for "making" you lose yourself.',
      confidence: 'high',
      flags: ['core_values_conflict', 'growth_edge_candidate'],
    });
  }

  // 12. Values growth but resists change
  const growthImp = values.domainScores.growth?.importance ?? 0;
  const openPct = ipip.domainPercentiles.openness;
  if (growthImp >= 8 && openPct < 40) {
    patterns.push({
      id: 'values_growth_resists_change',
      category: 'values-behavior',
      description: 'Values growth but personality shows preference for stability',
      interpretation:
        'You aspire to growth but may resist the actual discomfort of change. You need gentle pacing.',
      confidence: 'medium',
      flags: ['pacing_consideration'],
    });
  }

  return patterns;
}

// ─── Category 4: Differentiation ─────────────────────────

function detectDifferentiation(dsir: DSIRScores): DetectedPattern[] {
  const patterns: DetectedPattern[] = [];
  const iPosition = dsir.subscaleScores.iPosition.normalized;
  const fusion = dsir.subscaleScores.fusionWithOthers.normalized;
  const cutoff = dsir.subscaleScores.emotionalCutoff.normalized;
  const reactivity = dsir.subscaleScores.emotionalReactivity.normalized;

  // 13. Low I-Position + low fusion differentiation = self-abandonment risk
  if (iPosition < 40 && fusion < 40) {
    patterns.push({
      id: 'low_differentiation_fused',
      category: 'differentiation',
      description: 'Weak sense of self combined with fusion tendency',
      interpretation:
        "Difficulty knowing your own beliefs, tendency to merge with your partner. Core differentiation work needed.",
      confidence: 'high',
      flags: ['differentiation_priority', 'self_abandonment_risk'],
    });
  }

  // 14. High cutoff
  if (cutoff < 35) {
    patterns.push({
      id: 'high_cutoff',
      category: 'differentiation',
      description: 'High emotional cutoff pattern',
      interpretation:
        'You manage relationship anxiety through distance rather than true differentiation. You appear independent but are reactive underneath.',
      confidence: 'high',
      flags: ['false_differentiation', 'intimacy_block'],
    });
  }

  // 15. High reactivity + low I-Position
  if (reactivity < 35 && iPosition < 40) {
    patterns.push({
      id: 'reactive_undefined',
      category: 'differentiation',
      description: 'High emotional reactivity with weak self-definition',
      interpretation:
        'You react strongly but without a clear sense of what you actually need or believe. This can create chaotic relationship dynamics.',
      confidence: 'high',
      flags: ['volatility_risk', 'regulation_priority'],
    });
  }

  return patterns;
}
