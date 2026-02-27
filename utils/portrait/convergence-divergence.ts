/**
 * Convergence-Divergence Analysis
 *
 * Cross-partner comparison: where both partners' radar charts overlap,
 * complement, clash, or leave blind spots.
 */

import type { IndividualPortrait, CompositeScores, CyclePosition } from '@/types/portrait';
import type {
  RadarOverlap,
  GapInterpretation,
  ConvergencePoint,
  ComplementaryPair,
  FrictionZone,
  ValuesTension,
  AttachmentDynamic,
} from '@/types/couples';

// ─── Dimension Labels ────────────────────────────────────

const DIMENSION_LABELS: Record<string, string> = {
  attachmentSecurity: 'Attachment Security',
  emotionalIntelligence: 'Emotional Intelligence',
  differentiation: 'Differentiation',
  conflictFlexibility: 'Conflict Flexibility',
  valuesAlignment: 'Values Alignment',
  regulationCapacity: 'Regulation Capacity',
  relationalAwareness: 'Relational Awareness',
};

const RADAR_DIMENSIONS = [
  'attachmentSecurity',
  'emotionalIntelligence',
  'differentiation',
  'conflictFlexibility',
  'relationalAwareness',
] as const;

// We map from the CompositeScores fields to the 7 dimensions
// Note: CompositeScores has regulationScore and valuesCongruence
// which we map to regulationCapacity and valuesAlignment
function getRadarScore(scores: CompositeScores, dim: string): number {
  switch (dim) {
    case 'attachmentSecurity': return scores.attachmentSecurity ?? 50;
    case 'emotionalIntelligence': return scores.emotionalIntelligence ?? 50;
    case 'differentiation': return scores.differentiation ?? 50;
    case 'conflictFlexibility': return scores.conflictFlexibility ?? 50;
    case 'valuesAlignment': return scores.valuesCongruence ?? 50;
    case 'regulationCapacity': return scores.regulationScore ?? 50;
    case 'relationalAwareness': return scores.relationalAwareness ?? 50;
    default: return 50;
  }
}

const ALL_DIMENSIONS = [
  'attachmentSecurity',
  'emotionalIntelligence',
  'differentiation',
  'conflictFlexibility',
  'valuesAlignment',
  'regulationCapacity',
  'relationalAwareness',
];

// ─── Radar Overlap Analysis ──────────────────────────────

function classifyGap(gap: number, dim: string, scoreA: number, scoreB: number): GapInterpretation {
  if (gap <= 10) return 'aligned';
  if (gap <= 20) return 'complementary';
  if (gap <= 25) return 'tension';
  return 'significant_gap';
}

function generateInsight(dim: string, interp: GapInterpretation, scoreA: number, scoreB: number): string {
  const label = DIMENSION_LABELS[dim] || dim;

  switch (interp) {
    case 'aligned':
      if (scoreA > 65 && scoreB > 65)
        return `You are both strong in ${label.toLowerCase()}. This is your shared ground — a resource you can lean on when other areas feel challenging.`;
      if (scoreA < 40 && scoreB < 40)
        return `${label} is a developing area for both of you. The good news: you are on the same page. You can grow in this together without one partner feeling left behind.`;
      return `You are closely matched in ${label.toLowerCase()}. This alignment means you likely "get" each other in this area intuitively.`;

    case 'complementary':
      return `You bring different ${label.toLowerCase()} gifts to the table. One of you is stronger here, and the difference is workable — it means you each have something to teach and something to learn.`;

    case 'tension':
      return `Your ${label.toLowerCase()} scores show a meaningful gap. This is not a problem to solve — it is a dynamic to understand. The partner with more capacity here may become the "default" in this area, which can feel like a burden. The invitation: share the load.`;

    case 'significant_gap':
      return `There is a significant difference in your ${label.toLowerCase()} levels. One of you carries considerably more capacity here than the other. This creates a pull — the stronger partner may over-function while the developing partner feels inadequate. Neither experience is the truth. The practice is meeting in the middle.`;
  }
}

export function analyzeRadarOverlap(
  scoresA: CompositeScores,
  scoresB: CompositeScores,
): RadarOverlap[] {
  return ALL_DIMENSIONS.map(dim => {
    const scoreA = getRadarScore(scoresA, dim);
    const scoreB = getRadarScore(scoresB, dim);
    const gap = Math.abs(scoreA - scoreB);
    const interp = classifyGap(gap, dim, scoreA, scoreB);

    return {
      dimension: dim,
      dimensionLabel: DIMENSION_LABELS[dim] || dim,
      partnerAScore: scoreA,
      partnerBScore: scoreB,
      gap,
      gapInterpretation: interp,
      insight: generateInsight(dim, interp, scoreA, scoreB),
    };
  });
}

// ─── Shared Strengths ────────────────────────────────────

export function findSharedStrengths(
  scoresA: CompositeScores,
  scoresB: CompositeScores,
): ConvergencePoint[] {
  const strengths: ConvergencePoint[] = [];

  for (const dim of ALL_DIMENSIONS) {
    const a = getRadarScore(scoresA, dim);
    const b = getRadarScore(scoresB, dim);

    if (a > 65 && b > 65) {
      const label = DIMENSION_LABELS[dim];
      let narrative = '';
      let practice = '';

      switch (dim) {
        case 'emotionalIntelligence':
          narrative = 'You both carry strong emotional awareness. The quality of empathy in your relationship is unusually high — you can both sense what the other is feeling, often before words arrive. The gift: deep understanding. The risk: you may both feel so much that regulation becomes the bottleneck.';
          practice = 'Take turns being the steady one. When both of you are feeling deeply, consciously designate one partner as the anchor.';
          break;
        case 'attachmentSecurity':
          narrative = 'You both carry a sense of relational safety. This is rare and powerful — it means your baseline is connection, not threat. Conflict is about the issue, not about whether you are safe with each other.';
          practice = 'Use your shared security to go deeper into vulnerable topics you might otherwise avoid.';
          break;
        case 'differentiation':
          narrative = 'You can both hold your positions AND stay connected. This means you can disagree without it threatening the relationship. The invitation: use this capacity to explore your deepest differences.';
          practice = 'Have a "sacred difference" conversation — explore one area where you fundamentally disagree, with curiosity instead of persuasion.';
          break;
        case 'regulationCapacity':
          narrative = 'You both have wide windows of tolerance. This means you can weather emotional storms together without either partner flooding. This is a profound relational resource.';
          practice = 'When you notice your shared regulation capacity, name it: "We are both calm enough to handle this." Let it be a conscious anchor.';
          break;
        default:
          narrative = `${label} is a shared strength between you. Both of you bring strong capacity here, which means this is solid ground you can stand on together.`;
          practice = `Consciously lean on your shared ${label.toLowerCase()} when other areas feel challenging.`;
      }

      strengths.push({
        dimension: dim,
        dimensionLabel: label,
        scoreA: a,
        scoreB: b,
        narrative,
        practiceToDeepen: practice,
      });
    }
  }

  return strengths;
}

// ─── Complementary Gifts ──────────────────────────────────

export function findComplementaryGifts(
  scoresA: CompositeScores,
  scoresB: CompositeScores,
): ComplementaryPair[] {
  const pairs: ComplementaryPair[] = [];

  for (const dim of ALL_DIMENSIONS) {
    const a = getRadarScore(scoresA, dim);
    const b = getRadarScore(scoresB, dim);
    const gap = a - b;

    if (Math.abs(gap) >= 15 && Math.abs(gap) <= 30) {
      const label = DIMENSION_LABELS[dim];
      const stronger = gap > 0 ? 'A' : 'B';
      let giftNarrative = '';
      let riskNarrative = '';

      switch (dim) {
        case 'differentiation':
          giftNarrative = 'One of you holds their ground more easily — knows what they think, stays with it under pressure. The other tends to merge, accommodate, lose their position in the heat of connection. This is a natural pairing. The differentiated partner can model holding-self-while-staying-connected, and the fused partner teaches what it means to fully show up.';
          riskNarrative = 'The differentiated partner may seem "cold" or "stubborn," while the fused partner may seem "lost" or "dependent." Neither is true.';
          break;
        case 'regulationCapacity':
          giftNarrative = 'Your windows of tolerance are different widths. One gets flooded faster; the other has more room to stay steady. The wider-window partner can offer grounding; the narrower-window partner brings sensitivity and attunement.';
          riskNarrative = 'The steady partner may become the "always calm one" by default — which can feel like a burden and can make the other feel broken.';
          break;
        case 'emotionalIntelligence':
          giftNarrative = 'You bring different emotional intelligence gifts. One of you notices what is happening emotionally with remarkable precision; the other is better at steadying and managing those emotions once noticed. Together, you have the full picture.';
          riskNarrative = 'The more emotionally attuned partner may feel burdened by always being the "feeler." The less attuned partner may feel inadequate or "emotionally dumb."';
          break;
        default:
          giftNarrative = `One of you carries more ${label.toLowerCase()} capacity than the other. This difference is not a deficit — it is a resource. Together, you have a wider range than either alone.`;
          riskNarrative = `The stronger partner may over-function in this area while the developing partner defers. Watch for imbalance.`;
      }

      pairs.push({
        dimension: dim,
        dimensionLabel: label,
        strongerPartner: stronger,
        gap: Math.abs(gap),
        giftNarrative,
        riskNarrative,
        growthOpportunity: `The stronger partner can model ${label.toLowerCase()}; the developing partner brings fresh perspective and wholehearted effort.`,
      });
    }
  }

  return pairs;
}

// ─── Friction Zones ──────────────────────────────────────

export function findFrictionZones(
  portraitA: IndividualPortrait,
  portraitB: IndividualPortrait,
): FrictionZone[] {
  const zones: FrictionZone[] = [];
  const scoresA = portraitA.compositeScores;
  const scoresB = portraitB.compositeScores;

  if (!scoresA || !scoresB) return zones;

  // Regulation mismatch > 25 points
  const regA = scoresA.regulationScore ?? 50;
  const regB = scoresB.regulationScore ?? 50;
  if (Math.abs(regA - regB) > 25) {
    zones.push({
      area: 'Regulation Speed',
      partnerAPull: regA < regB ? 'Floods faster, needs more time to recover' : 'Stays regulated longer, may not see the urgency',
      partnerBPull: regB < regA ? 'Floods faster, needs more time to recover' : 'Stays regulated longer, may not see the urgency',
      whatHappens: 'One partner gets overwhelmed while the other wonders "what is the big deal?" This creates invalidation spirals where the flooded partner feels dismissed and the regulated partner feels blamed.',
      underneathIt: 'Both want the same thing: to feel safe in the conversation. One feels safe through calm; the other needs space before calm is possible.',
      practiceForBoth: 'Build a shared pause signal — a word or gesture that means "I need 20 minutes, and I am coming back." Practice it when you are NOT activated so it is familiar when you are.',
    });
  }

  // Differentiation mismatch > 25 points
  const diffA = scoresA.differentiation ?? 50;
  const diffB = scoresB.differentiation ?? 50;
  if (Math.abs(diffA - diffB) > 25) {
    zones.push({
      area: 'Boundary Styles',
      partnerAPull: diffA > diffB ? 'Holds firm boundaries, maintains self in conflict' : 'Tends to merge, accommodate, lose position under pressure',
      partnerBPull: diffB > diffA ? 'Holds firm boundaries, maintains self in conflict' : 'Tends to merge, accommodate, lose position under pressure',
      whatHappens: 'The differentiated partner holds their ground while the fused partner accommodates until resentment builds. Then the fused partner erupts, and the differentiated partner feels blindsided.',
      underneathIt: 'The accommodating partner is not weak — they are prioritizing connection over self. The differentiated partner is not cold — they are protecting their integrity. Both are valid.',
      practiceForBoth: 'The fused partner practices stating one need clearly per day. The differentiated partner practices asking "What do you need?" before assuming everything is fine.',
    });
  }

  // Attachment security mismatch > 25
  const attA = scoresA.attachmentSecurity ?? 50;
  const attB = scoresB.attachmentSecurity ?? 50;
  if (Math.abs(attA - attB) > 25) {
    zones.push({
      area: 'Attachment Security',
      partnerAPull: attA > attB ? 'Carries a sense of relational safety' : 'System still scanning for threat in the relationship',
      partnerBPull: attB > attA ? 'Carries a sense of relational safety' : 'System still scanning for threat in the relationship',
      whatHappens: 'The more secure partner may not understand why the less secure partner needs so much reassurance — or why they react so strongly to small disconnections.',
      underneathIt: 'The less secure partner is not "too needy." They are managing a nervous system calibrated for environments where connection was not guaranteed. The secure partner can be a steady presence, not a fix.',
      practiceForBoth: 'Let security be contagious rather than dismissive. The secure partner offers steady presence; the less secure partner practices trusting that presence is real.',
    });
  }

  return zones;
}

// ─── Values Tensions ─────────────────────────────────────

export function findValuesTensions(
  portraitA: IndividualPortrait,
  portraitB: IndividualPortrait,
): ValuesTension[] {
  const tensions: ValuesTension[] = [];

  const aValues = portraitA.fourLens?.values?.coreValues || [];
  const bValues = portraitB.fourLens?.values?.coreValues || [];

  // Look for classic tension pairs
  const tensionPairs: [string[], string[], string, string][] = [
    [['honesty', 'truth', 'authenticity'], ['stability', 'harmony', 'peace'], 'Honesty vs. Harmony', 'Weekly truth temperature check: "Is there anything unsaid between us this week?" No fixing — just hearing.'],
    [['independence', 'autonomy', 'freedom'], ['connection', 'togetherness', 'intimacy'], 'Independence vs. Togetherness', 'Create a ritual that honors both: separate time that is protected AND shared time that is sacred.'],
    [['adventure', 'novelty', 'growth'], ['security', 'tradition', 'routine'], 'Adventure vs. Security', 'Alternate: one week the adventurer chooses something new, the next week the tradition-keeper chooses something familiar.'],
    [['achievement', 'ambition', 'success'], ['presence', 'balance', 'rest'], 'Achievement vs. Presence', 'Define "enough" together. What does a well-lived day look like — not just a productive one?'],
  ];

  for (const [setA, setB, desc, practice] of tensionPairs) {
    const aHasSetA = aValues.some(v => setA.some(s => v.toLowerCase().includes(s)));
    const bHasSetB = bValues.some(v => setB.some(s => v.toLowerCase().includes(s)));
    const aHasSetB = aValues.some(v => setB.some(s => v.toLowerCase().includes(s)));
    const bHasSetA = bValues.some(v => setA.some(s => v.toLowerCase().includes(s)));

    let valueA: string | null = null;
    let valueB: string | null = null;

    if (aHasSetA && bHasSetB) {
      // Standard: Partner A aligns with side A, Partner B aligns with side B
      valueA = setA[0];
      valueB = setB[0];
    } else if (aHasSetB && bHasSetA) {
      // Reversed: Partner A aligns with side B, Partner B aligns with side A
      valueA = setB[0];
      valueB = setA[0];
    }

    if (valueA && valueB && valueA !== valueB) {
      tensions.push({
        valueA,
        valueB,
        description: `One of you craves ${valueA}; the other values ${valueB}. Neither is wrong. The relationship needs both — the tension between them is the engine of your evolution as a couple.`,
        integrationPractice: practice,
      });
    }
  }

  return tensions;
}

// ─── Attachment Dynamic ──────────────────────────────────

/**
 * Map the individual portrait's negativeCycle.position to attachment quadrant.
 *
 * The individual portrait determines position from the ACTUAL ECR-R scores.
 * We must use this — not the composite `attachmentSecurity` (which blends
 * anxiety + avoidance into one number, losing the distinction).
 */
/**
 * Derive quadrant label from actual ECR-R normalized scores (0-100 scale).
 * Uses the same boundary logic as getStyleFromScores (QUADRANT_BOUNDARY = 4.0
 * on a 1-7 scale, which maps to 50 on the 0-100 normalized scale).
 *
 * Falls back to cycle-position mapping only for older portraits that lack
 * anxietyNorm/avoidanceNorm in their compositeScores.
 */
function quadrantFromScores(
  portrait: IndividualPortrait,
  posFallback: CyclePosition | undefined,
): string {
  const sc = portrait.compositeScores;
  if (sc?.anxietyNorm != null && sc?.avoidanceNorm != null) {
    // Normalized 0-100 scale: 50 corresponds to raw score 4.0 (the QUADRANT_BOUNDARY)
    const highAnxiety = sc.anxietyNorm >= 50;
    const highAvoidance = sc.avoidanceNorm >= 50;
    if (highAnxiety && highAvoidance) return 'Fearful-Avoidant';
    if (highAnxiety) return 'Anxious-Preoccupied';
    if (highAvoidance) return 'Dismissive-Avoidant';
    return 'Secure';
  }
  // Legacy fallback: position-based (less accurate)
  switch (posFallback) {
    case 'pursuer': return 'Anxious-Preoccupied';
    case 'withdrawer': return 'Dismissive-Avoidant';
    case 'mixed': return 'Fearful-Avoidant';
    case 'flexible':
    default:
      return 'Secure';
  }
}

/**
 * Get anxiety and avoidance values for the attachment matrix plot.
 *
 * Uses the ACTUAL ECR-R normalized subscale scores (anxietyNorm, avoidanceNorm)
 * stored in compositeScores. Falls back to position-based estimation only
 * for older portraits that predate the field addition.
 */
function getAnxietyAvoidance(
  portrait: IndividualPortrait,
  pos: CyclePosition | undefined,
): { anxiety: number; avoidance: number } {
  const sc = portrait.compositeScores;

  // Use actual ECR-R scores when available (new portraits have these)
  if (sc?.anxietyNorm != null && sc?.avoidanceNorm != null) {
    return { anxiety: sc.anxietyNorm, avoidance: sc.avoidanceNorm };
  }

  // Fallback for older portraits without the raw subscales
  const insecurity = 100 - (sc?.attachmentSecurity ?? 50);
  switch (pos) {
    case 'pursuer':
      return {
        anxiety: Math.min(100, insecurity * 1.5),
        avoidance: Math.max(5, insecurity * 0.5),
      };
    case 'withdrawer':
      return {
        anxiety: Math.max(5, insecurity * 0.5),
        avoidance: Math.min(100, insecurity * 1.5),
      };
    case 'mixed':
      return {
        anxiety: Math.min(100, insecurity * 1.2),
        avoidance: Math.min(100, insecurity * 1.2),
      };
    case 'flexible':
    default:
      return {
        anxiety: Math.max(0, insecurity * 0.7),
        avoidance: Math.max(0, insecurity * 0.7),
      };
  }
}

export function analyzeAttachmentDynamic(
  portraitA: IndividualPortrait,
  portraitB: IndividualPortrait,
): AttachmentDynamic {
  // Use the negativeCycle.position from the individual portrait.
  // This was determined from ACTUAL ECR-R scores and is accurate.
  const posA: CyclePosition = portraitA.negativeCycle?.position || 'flexible';
  const posB: CyclePosition = portraitB.negativeCycle?.position || 'flexible';

  const aQuadrant = quadrantFromScores(portraitA, posA);
  const bQuadrant = quadrantFromScores(portraitB, posB);

  // Use actual ECR-R anxiety/avoidance for matrix plotting
  const a = getAnxietyAvoidance(portraitA, posA);
  const b = getAnxietyAvoidance(portraitB, posB);

  const distance = Math.sqrt(
    Math.pow(a.anxiety - b.anxiety, 2) + Math.pow(a.avoidance - b.avoidance, 2)
  );

  const aSecureDist = Math.sqrt(Math.pow(a.anxiety, 2) + Math.pow(a.avoidance, 2));
  const bSecureDist = Math.sqrt(Math.pow(b.anxiety, 2) + Math.pow(b.avoidance, 2));

  let dynamicLabel: string;
  let narrative: string;
  let repairGuidance: string;

  // Determine dynamic from position, not from derived numbers
  const aIsAnxious = posA === 'pursuer' || posA === 'mixed';
  const bIsAvoidant = posB === 'withdrawer' || posB === 'mixed';
  const aIsAvoidant = posA === 'withdrawer' || posA === 'mixed';
  const bIsAnxious = posB === 'pursuer' || posB === 'mixed';

  if ((aIsAnxious && bIsAvoidant) || (aIsAvoidant && bIsAnxious)) {
    dynamicLabel = 'The Classic Dance';
    narrative = 'This is the most common couple pattern in attachment research: one partner moves toward when stressed, the other moves away. The pursuer is not "too needy" and the withdrawer is not "too cold." Both are managing the same underlying fear — the fear that connection is not safe — using opposite strategies. The breakthrough comes when both see the OTHER person\'s strategy as an expression of the same fear, not a rejection of self.';
    repairGuidance = 'The pursuer softens the approach (expressing need, not urgency). The withdrawer stays present (saying "I need a moment" instead of disappearing). Both practice: pause, name the pattern, then return.';
  } else if (posA === posB && distance < 30) {
    dynamicLabel = 'Shared Ground';
    narrative = 'You both sit in a similar zone on the attachment landscape. This means you likely "get" each other\'s relational logic intuitively. The risk of similarity is that your shared blind spots go unnoticed — you may both avoid the same conversations, or both react the same way without anyone to balance the response.';
    repairGuidance = 'Because you share similar attachment patterns, repair comes naturally when you both feel safe. The growth edge is expanding into the zones that feel less natural for both of you.';
  } else if (distance < 20) {
    dynamicLabel = 'Close Neighbors';
    narrative = 'Your attachment positions are remarkably similar. You understand each other\'s relational logic deeply. The invitation is to use this understanding as a springboard into new territory together.';
    repairGuidance = 'Start repair by acknowledging shared experience: "We both felt that one." Then gently explore what each of you needed differently.';
  } else {
    dynamicLabel = 'Complementary Positions';
    narrative = 'Your attachment positions are different but not opposite. This creates a natural complementarity — you each bring something the other does not have. The distance between your positions is the terrain your relationship navigates.';
    repairGuidance = 'Acknowledge the difference: "We handle this differently, and that is information, not a problem." Then ask: "What did you need that I could not see because I handle it differently?"';
  }

  return {
    distance,
    dynamicLabel,
    narrative,
    partnerASecureDistance: aSecureDist,
    partnerBSecureDistance: bSecureDist,
    partnerAQuadrant: aQuadrant,
    partnerBQuadrant: bQuadrant,
    partnerAAnxiety: a.anxiety,
    partnerAAvoidance: a.avoidance,
    partnerBAnxiety: b.anxiety,
    partnerBAvoidance: b.avoidance,
    growthDirection: 'Both moving toward lower anxiety and lower avoidance — toward secure base',
    whatThisMeansForRepair: repairGuidance,
  };
}
