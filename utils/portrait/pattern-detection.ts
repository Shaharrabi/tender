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
import type { SupplementScores } from '@/types/portrait';

/**
 * Detect cross-assessment patterns across 4 categories (+ field-awareness if supplements present).
 * Returns patterns + aggregated flag counts + priority flags.
 */
export function detectPatterns(
  ecrr: ECRRScores,
  dutch: DUTCHScores,
  sseit: SSEITScores,
  dsir: DSIRScores,
  ipip: IPIPScores,
  values: ValuesScores,
  composite: CompositeScores,
  supplements?: SupplementScores
): PatternResult {
  const allPatterns: DetectedPattern[] = [
    ...detectAttachmentConflict(ecrr, dutch),
    ...detectRegulation(sseit, composite),
    ...detectEmotionalIntelligenceGaps(sseit, ecrr, composite),
    ...detectValuesBehavior(values, dutch, ecrr, dsir, ipip),
    ...detectDifferentiation(dsir),
    ...(supplements ? detectFieldAwareness(supplements, ecrr, ipip, composite) : []),
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

// ─── Category 2b: Emotional Intelligence Gaps ──────────

function detectEmotionalIntelligenceGaps(
  sseit: SSEITScores,
  ecrr: ECRRScores,
  composite: CompositeScores
): DetectedPattern[] {
  const patterns: DetectedPattern[] = [];
  const perception = sseit.subscaleNormalized.perception;
  const managingOwn = sseit.subscaleNormalized.managingOwn;
  const managingOthers = sseit.subscaleNormalized.managingOthers;
  const utilization = sseit.subscaleNormalized.utilization;

  // 1. High perception but low self-management → "I see it but can't stop it"
  if (perception > 65 && managingOwn < 45) {
    patterns.push({
      id: 'eq_perception_management_gap',
      category: 'regulation',
      description: 'High emotional perception but low self-management',
      interpretation:
        'You read emotions clearly — yours and others\' — but struggle to regulate once activated. ' +
        'You are the person who knows exactly what is happening and cannot stop it. ' +
        'This gap is workable: the awareness is already there.',
      confidence: 'high',
      flags: ['insight_action_gap', 'regulation_priority'],
    });
  }

  // 2. High managing others but low managing own → "I hold everyone else but not myself"
  if (managingOthers > 65 && managingOwn < 45) {
    patterns.push({
      id: 'eq_other_focused',
      category: 'regulation',
      description: 'Strong at managing others\' emotions, weak at managing own',
      interpretation:
        'You are the emotional caretaker — you attune to others, soothe them, hold space. ' +
        'But when it is your turn to feel, you struggle. You may neglect your own emotional needs ' +
        'or not know how to receive the same care you give.',
      confidence: 'high',
      flags: ['self_neglect_risk', 'caretaker_pattern'],
    });
  }

  // 3. Low emotional utilization → "Feelings don't inform decisions"
  if (utilization < 40 && perception > 55) {
    patterns.push({
      id: 'eq_underutilized_emotions',
      category: 'regulation',
      description: 'Can perceive emotions but does not use them to guide action',
      interpretation:
        'You notice feelings but do not trust them as information. You may override emotional ' +
        'signals with logic or ignore gut feelings. In relationships, this means missing ' +
        'important data about what you need and what your partner is communicating nonverbally.',
      confidence: 'medium',
      flags: ['emotional_bypassing'],
    });
  }

  // 4. Globally low EQ with anxious attachment → "Overwhelmed and unequipped"
  if (composite.emotionalIntelligence < 40 && ecrr.anxietyScore > 4.0) {
    patterns.push({
      id: 'eq_low_anxious',
      category: 'regulation',
      description: 'Low emotional intelligence combined with anxious attachment',
      interpretation:
        'You feel intensely but lack the tools to understand or manage those feelings. ' +
        'This combination means emotions arrive fast, hit hard, and linger. ' +
        'Building emotional vocabulary and regulation skills will make the biggest difference.',
      confidence: 'high',
      flags: ['regulation_priority', 'skill_building_needed'],
    });
  }

  // 5. High EQ across the board → emotional resource
  if (
    perception > 70 &&
    managingOwn > 65 &&
    managingOthers > 65 &&
    utilization > 60
  ) {
    patterns.push({
      id: 'eq_resource',
      category: 'regulation',
      description: 'Strong emotional intelligence across all dimensions',
      interpretation:
        'You have well-developed emotional intelligence — you perceive, manage, and use ' +
        'emotions effectively. This is a genuine relational resource. Your partner benefits ' +
        'from your attunement and you can generally navigate emotional complexity.',
      confidence: 'high',
      flags: ['emotional_resource'],
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

// ─── Category 5: Field Awareness (Phase 3 — supplement data) ──

function detectFieldAwareness(
  sup: SupplementScores,
  ecrr: ECRRScores,
  ipip: IPIPScores,
  composite: CompositeScores
): DetectedPattern[] {
  const patterns: DetectedPattern[] = [];

  // 16. Sensing without grounding — strong field sensitivity + low regulation
  if (
    sup.sseit &&
    sup.sseit.fieldSensitivityMean > 5.0 &&
    composite.regulationScore < 45
  ) {
    patterns.push({
      id: 'sensing_without_grounding',
      category: 'field-awareness',
      description: 'High relational field sensitivity with low regulation capacity',
      interpretation:
        'You have a strong antenna for the relational field — you sense shifts, moods, and emotional atmospheres accurately. But without adequate regulation, these signals overwhelm rather than inform. Strong sensing, weak filter.',
      confidence: 'high',
      flags: ['regulation_priority', 'field_sensitivity', 'growth_edge_candidate'],
    });
  }

  // 17. Fixed narrative blocks field awareness
  if (
    sup.ecrr &&
    sup.ecrr.fixedStory < 4 && // reverse-scored: low = high fixed story
    sup.ecrr.cycleAwareness < 4
  ) {
    patterns.push({
      id: 'fixed_narrative_blocks_field',
      category: 'field-awareness',
      description: 'Strong fixed narrative about partner combined with low cycle awareness',
      interpretation:
        'The story you carry about your partner — "they always..." or "they never..." — prevents you from seeing the pattern you are both caught in. The story blocks field awareness.',
      confidence: 'high',
      flags: ['narrative_rigidity', 'growth_edge_candidate'],
    });
  }

  // 18. Somatic wisdom — body-based relational intelligence
  if (
    sup.ecrr &&
    sup.ecrr.somaticAwareness >= 5 &&
    composite.regulationScore > 50
  ) {
    patterns.push({
      id: 'somatic_wisdom',
      category: 'field-awareness',
      description: 'High somatic awareness with adequate regulation',
      interpretation:
        'You notice relational shifts in your body first — a tightness, a warmth, a pulling away. And you have enough regulation to use this information rather than be flooded by it. This is body-based relational intelligence.',
      confidence: 'high',
      flags: ['somatic_resource'],
    });
  }

  // 19. Boundary as wall — over-differentiation
  if (
    sup.dsir &&
    sup.dsir.boundaryAwarenessMean >= 5.5 &&
    ecrr.avoidanceScore > 4.0
  ) {
    patterns.push({
      id: 'boundary_as_wall',
      category: 'field-awareness',
      description: 'High boundary clarity combined with avoidant attachment',
      interpretation:
        'Your boundaries are clear — perhaps too clear. Combined with avoidance, they may serve as walls that protect identity but also prevent emotional closeness. The question: which boundaries are truly for you, and which are against connection?',
      confidence: 'medium',
      flags: ['over_differentiation', 'intimacy_block'],
    });
  }

  // 20. Porous boundaries — absorbing partner's emotions
  if (
    sup.dsir &&
    sup.dsir.boundaryAwarenessMean < 3.5 &&
    ecrr.anxietyScore > 4.0
  ) {
    patterns.push({
      id: 'porous_boundaries',
      category: 'field-awareness',
      description: 'Low boundary clarity combined with anxious attachment',
      interpretation:
        'Your emotional boundaries are porous — you absorb your partner\'s moods, fears, and needs as if they were your own. This creates a fusion pattern where you lose track of what belongs to you and what belongs to the space between you.',
      confidence: 'high',
      flags: ['fusion_risk', 'differentiation_priority', 'growth_edge_candidate'],
    });
  }

  // 21. Metacognitive capacity — can observe own patterns
  if (
    sup.ecrr &&
    sup.ecrr.cycleAwareness >= 5 &&
    composite.selfLeadership > 50
  ) {
    patterns.push({
      id: 'metacognitive_capacity',
      category: 'field-awareness',
      description: 'Strong cycle awareness combined with self-leadership',
      interpretation:
        'You can step back and observe the pattern between you and your partner while it is happening. This metacognitive capacity is a powerful resource — it means you can choose differently in the moments that matter.',
      confidence: 'high',
      flags: ['metacognitive_resource'],
    });
  }

  return patterns;
}
