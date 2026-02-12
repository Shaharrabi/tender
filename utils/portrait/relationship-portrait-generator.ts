/**
 * Relationship Portrait Generator
 *
 * Combines two individual portraits + three dyadic assessment scores
 * into a comprehensive Relationship Portrait for the couple.
 *
 * Architecture:
 * - Individual portraits provide: attachment styles, personality, regulation, values
 * - Dyadic scores provide: RDAS (adjustment), DCI (coping), CSI-16 (satisfaction)
 * - Generator creates: patterns, combined cycle, discrepancy analysis,
 *   relationship growth edges, couple anchors, intervention priorities
 */

import type { IndividualPortrait } from '@/types/portrait';
import type {
  RDASScores,
  DCIScores,
  CSI16Scores,
  RelationshipPattern,
  RelationshipPatternType,
  DiscrepancyItem,
  DiscrepancyAnalysis,
  RelationshipGrowthEdge,
  RelationshipPortrait,
} from '@/types/couples';

interface DyadicScoreSet {
  rdas?: { partnerA: RDASScores; partnerB: RDASScores };
  dci?: { partnerA: DCIScores; partnerB: DCIScores };
  csi16?: { partnerA: CSI16Scores; partnerB: CSI16Scores };
}

// ─── Main Generator ────────────────────────────────────

export function generateRelationshipPortrait(
  coupleId: string,
  portraitA: IndividualPortrait,
  portraitB: IndividualPortrait,
  dyadicScores: DyadicScoreSet,
): Omit<RelationshipPortrait, 'id' | 'created_at' | 'updated_at'> {

  // Step 1: Detect relationship patterns
  const patterns = detectRelationshipPatterns(portraitA, portraitB, dyadicScores);

  // Step 2: Build combined negative cycle
  const combinedCycle = buildCombinedCycle(portraitA, portraitB, patterns);

  // Step 3: Discrepancy analysis
  const discrepancyAnalysis = analyzeDiscrepancies(dyadicScores);

  // Step 4: Relationship growth edges
  const growthEdges = identifyRelationshipGrowthEdges(
    portraitA, portraitB, dyadicScores, patterns, discrepancyAnalysis
  );

  // Step 5: Couple anchor points
  const coupleAnchors = generateCoupleAnchors(portraitA, portraitB, patterns);

  // Step 6: Intervention priorities
  const priorities = prioritizeInterventions(dyadicScores, patterns, discrepancyAnalysis);

  // Build dyadic scores summary (averaged)
  const dyadicScoresSummary: RelationshipPortrait['dyadic_scores'] = {};
  if (dyadicScores.rdas) {
    dyadicScoresSummary.rdas = {
      total: Math.round((dyadicScores.rdas.partnerA.total + dyadicScores.rdas.partnerB.total) / 2),
      consensus: Math.round((dyadicScores.rdas.partnerA.consensus + dyadicScores.rdas.partnerB.consensus) / 2),
      satisfaction: Math.round((dyadicScores.rdas.partnerA.satisfaction + dyadicScores.rdas.partnerB.satisfaction) / 2),
      cohesion: Math.round((dyadicScores.rdas.partnerA.cohesion + dyadicScores.rdas.partnerB.cohesion) / 2),
      distressLevel: getWorseDistress(dyadicScores.rdas.partnerA.distressLevel, dyadicScores.rdas.partnerB.distressLevel),
    };
  }
  if (dyadicScores.dci) {
    dyadicScoresSummary.dci = {
      totalPositive: Math.round((dyadicScores.dci.partnerA.totalPositive + dyadicScores.dci.partnerB.totalPositive) / 2),
      stressCommunicationBySelf: Math.round((dyadicScores.dci.partnerA.stressCommunicationBySelf + dyadicScores.dci.partnerB.stressCommunicationBySelf) / 2),
      stressCommunicationByPartner: Math.round((dyadicScores.dci.partnerA.stressCommunicationByPartner + dyadicScores.dci.partnerB.stressCommunicationByPartner) / 2),
      supportiveBySelf: Math.round((dyadicScores.dci.partnerA.supportiveBySelf + dyadicScores.dci.partnerB.supportiveBySelf) / 2),
      supportiveByPartner: Math.round((dyadicScores.dci.partnerA.supportiveByPartner + dyadicScores.dci.partnerB.supportiveByPartner) / 2),
      delegatedBySelf: Math.round((dyadicScores.dci.partnerA.delegatedBySelf + dyadicScores.dci.partnerB.delegatedBySelf) / 2),
      delegatedByPartner: Math.round((dyadicScores.dci.partnerA.delegatedByPartner + dyadicScores.dci.partnerB.delegatedByPartner) / 2),
      negativeBySelf: Math.round((dyadicScores.dci.partnerA.negativeBySelf + dyadicScores.dci.partnerB.negativeBySelf) / 2),
      negativeByPartner: Math.round((dyadicScores.dci.partnerA.negativeByPartner + dyadicScores.dci.partnerB.negativeByPartner) / 2),
      commonCoping: Math.round((dyadicScores.dci.partnerA.commonCoping + dyadicScores.dci.partnerB.commonCoping) / 2),
      evaluationBySelf: Math.round((dyadicScores.dci.partnerA.evaluationBySelf + dyadicScores.dci.partnerB.evaluationBySelf) / 2),
      evaluationByPartner: Math.round((dyadicScores.dci.partnerA.evaluationByPartner + dyadicScores.dci.partnerB.evaluationByPartner) / 2),
      copingQuality: getWorseCoping(dyadicScores.dci.partnerA.copingQuality, dyadicScores.dci.partnerB.copingQuality),
    };
  }
  if (dyadicScores.csi16) {
    const avgTotal = Math.round((dyadicScores.csi16.partnerA.total + dyadicScores.csi16.partnerB.total) / 2);
    dyadicScoresSummary.csi16 = {
      total: avgTotal,
      satisfactionLevel: avgTotal >= 67 ? 'high' : avgTotal >= 52 ? 'moderate' : avgTotal >= 34 ? 'low' : 'crisis',
      distressed: avgTotal < 51.5,
    };
  }

  return {
    couple_id: coupleId,
    partner_a_portrait_id: (portraitA as any).id,
    partner_b_portrait_id: (portraitB as any).id,
    dyadic_scores: dyadicScoresSummary,
    relationship_patterns: patterns,
    combined_cycle: combinedCycle,
    discrepancy_analysis: discrepancyAnalysis,
    relationship_growth_edges: growthEdges,
    couple_anchor_points: coupleAnchors,
    intervention_priorities: priorities,
    version: '1.0',
  };
}

// ─── Helpers ──────────────────────────────────────────

/** Infer attachment style from the protectiveStrategy text. */
function inferAttachmentStyle(protectiveStrategy: string): string {
  const lower = protectiveStrategy.toLowerCase();
  if (lower.includes('pursue') || lower.includes('protest') || lower.includes('reassurance'))
    return 'anxious-preoccupied';
  if (lower.includes('withdraw') || lower.includes('self-relian') || lower.includes('minimize'))
    return 'dismissive-avoidant';
  if (lower.includes('oscillat') || lower.includes('push-pull') || lower.includes('fearful'))
    return 'fearful-avoidant';
  return 'secure';
}

// ─── Pattern Detection ─────────────────────────────────

function detectRelationshipPatterns(
  portraitA: IndividualPortrait,
  portraitB: IndividualPortrait,
  dyadicScores: DyadicScoreSet,
): RelationshipPattern[] {
  const patterns: RelationshipPattern[] = [];
  const aAttachment = portraitA.fourLens?.attachment;
  const bAttachment = portraitB.fourLens?.attachment;
  // Infer attachment style from protectiveStrategy since AttachmentLens doesn't have a 'style' field
  const aStyle = inferAttachmentStyle(aAttachment?.protectiveStrategy || '');
  const bStyle = inferAttachmentStyle(bAttachment?.protectiveStrategy || '');

  // Pattern 1: Pursue-Withdraw
  const aAnxious = aStyle === 'anxious-preoccupied' || aStyle === 'fearful-avoidant';
  const bAvoidant = bStyle === 'dismissive-avoidant' || bStyle === 'fearful-avoidant';
  const bAnxious = bStyle === 'anxious-preoccupied' || bStyle === 'fearful-avoidant';
  const aAvoidant = aStyle === 'dismissive-avoidant' || aStyle === 'fearful-avoidant';

  if ((aAnxious && bAvoidant) || (bAnxious && aAvoidant)) {
    const pursuer = aAnxious ? 'Partner A' : 'Partner B';
    const withdrawer = aAnxious ? 'Partner B' : 'Partner A';
    patterns.push({
      type: 'pursue-withdraw',
      confidence: 80,
      description: `When ${pursuer} feels disconnected, they reach harder for contact. ${withdrawer} feels overwhelmed and pulls back. The more one reaches, the more the other retreats — creating a painful cycle neither wants.`,
      partnerARoleLabel: aAnxious ? 'Pursuer' : 'Withdrawer',
      partnerBRoleLabel: bAvoidant ? 'Withdrawer' : 'Pursuer',
      interventionFocus: ['EFT cycle de-escalation', 'Attachment psychoeducation', 'Recognizing the negative cycle'],
    });
  }

  // Pattern 2: High-Conflict High-Passion (both anxious or both reactive)
  if (aAnxious && bAnxious) {
    patterns.push({
      type: 'anxious-anxious',
      confidence: 70,
      description: 'Both partners are highly attuned to threat in the relationship. When one becomes activated, the other mirrors it — creating rapid escalation but also deep emotional connection.',
      partnerARoleLabel: 'Sensitive Responder',
      partnerBRoleLabel: 'Sensitive Responder',
      interventionFocus: ['Emotion regulation', 'TIPP skills', 'Repair attempts', 'Appreciation practices'],
    });
  }

  // Pattern 3: Parallel Lives (both avoidant or low cohesion)
  if ((aAvoidant && bAvoidant) || (dyadicScores.rdas &&
      (dyadicScores.rdas.partnerA.cohesion + dyadicScores.rdas.partnerB.cohesion) / 2 < 8)) {
    patterns.push({
      type: 'parallel-lives',
      confidence: aAvoidant && bAvoidant ? 75 : 60,
      description: 'Both partners value independence and may have built lives that run alongside each other rather than intertwining. The relationship functions smoothly but may lack deep emotional engagement.',
      partnerARoleLabel: 'Independent',
      partnerBRoleLabel: 'Independent',
      interventionFocus: ['Love Maps', 'Shared activities', 'Intimacy building', 'Couple bubble'],
    });
  }

  // Pattern 4: Low dyadic coping → Demand-Distance
  if (dyadicScores.dci) {
    const avgNegA = dyadicScores.dci.partnerA.negativeByPartner;
    const avgNegB = dyadicScores.dci.partnerB.negativeByPartner;
    if (avgNegA > 12 || avgNegB > 12) {
      patterns.push({
        type: 'demand-distance',
        confidence: 70,
        description: 'When stress enters the system, one partner demands resolution while the other distances. Negative coping patterns (criticism, dismissiveness) have become habitual responses.',
        partnerARoleLabel: avgNegA > avgNegB ? 'Distancer' : 'Demander',
        partnerBRoleLabel: avgNegB > avgNegA ? 'Distancer' : 'Demander',
        interventionFocus: ['Four Horsemen antidotes', 'Soft startup', 'Emotion regulation', 'Stress-reducing conversation'],
      });
    }
  }

  // Pattern 5: Caretaker-Dependent
  if (dyadicScores.dci) {
    const aSupportive = dyadicScores.dci.partnerA.supportiveBySelf;
    const bSupportive = dyadicScores.dci.partnerB.supportiveBySelf;
    const diff = Math.abs(aSupportive - bSupportive);
    if (diff > 6) {
      const caretaker = aSupportive > bSupportive ? 'Partner A' : 'Partner B';
      patterns.push({
        type: 'caretaker-dependent',
        confidence: 60,
        description: `${caretaker} provides significantly more support than they receive. This imbalance can lead to burnout and resentment over time.`,
        partnerARoleLabel: aSupportive > bSupportive ? 'Over-Functioner' : 'Under-Functioner',
        partnerBRoleLabel: bSupportive > aSupportive ? 'Over-Functioner' : 'Under-Functioner',
        interventionFocus: ['Balanced reciprocity', 'Assertiveness (caretaker)', 'Self-regulation (dependent)', 'Empathic joining'],
      });
    }
  }

  // If no patterns detected, note secure functioning
  if (patterns.length === 0) {
    patterns.push({
      type: 'pursue-withdraw', // placeholder type
      confidence: 0,
      description: 'No strong negative patterns detected. Your relationship shows signs of secure functioning with room for continued growth.',
      partnerARoleLabel: 'Partner',
      partnerBRoleLabel: 'Partner',
      interventionFocus: ['Maintenance practices', 'Fondness and admiration', 'Continued growth'],
    });
  }

  return patterns.sort((a, b) => b.confidence - a.confidence);
}

// ─── Combined Cycle ────────────────────────────────────

function buildCombinedCycle(
  portraitA: IndividualPortrait,
  portraitB: IndividualPortrait,
  patterns: RelationshipPattern[],
) {
  const aCycle = portraitA.negativeCycle;
  const bCycle = portraitB.negativeCycle;
  const mainPattern = patterns[0];

  return {
    partnerAPosition: aCycle?.position || mainPattern?.partnerARoleLabel || 'Partner A',
    partnerBPosition: bCycle?.position || mainPattern?.partnerBRoleLabel || 'Partner B',
    cycleDescription: mainPattern?.description || 'Your relationship dynamic is still being mapped.',
    triggers: [
      ...(aCycle?.primaryTriggers || ['Feeling unheard or dismissed']),
      ...(bCycle?.primaryTriggers || ['Feeling overwhelmed or criticized']),
    ].slice(0, 6),
    deEscalationSteps: [
      'Pause and take three breaths together',
      'Name the cycle: "Our pattern is showing up right now"',
      'Turn toward each other instead of against',
      'Share the feeling underneath the reaction',
      'Make a repair attempt',
      'Return to the conversation when both are regulated',
    ],
  };
}

// ─── Discrepancy Analysis ──────────────────────────────

function analyzeDiscrepancies(dyadicScores: DyadicScoreSet): DiscrepancyAnalysis {
  const items: DiscrepancyItem[] = [];

  if (dyadicScores.csi16) {
    const diff = Math.abs(dyadicScores.csi16.partnerA.total - dyadicScores.csi16.partnerB.total);
    items.push({
      domain: 'Overall Satisfaction',
      partnerAScore: dyadicScores.csi16.partnerA.total,
      partnerBScore: dyadicScores.csi16.partnerB.total,
      difference: diff,
      isSignificant: diff > 15,
      insight: diff > 15
        ? 'There\'s a significant gap in how satisfied each partner feels. This perception gap is itself an important area to explore.'
        : 'Both partners report similar levels of satisfaction — a sign of shared experience.',
    });
  }

  if (dyadicScores.rdas) {
    const domains = [
      { name: 'Consensus', key: 'consensus' as const, threshold: 6 },
      { name: 'Satisfaction', key: 'satisfaction' as const, threshold: 5 },
      { name: 'Cohesion', key: 'cohesion' as const, threshold: 5 },
    ];
    for (const d of domains) {
      const a = dyadicScores.rdas.partnerA[d.key];
      const b = dyadicScores.rdas.partnerB[d.key];
      const diff = Math.abs(a - b);
      items.push({
        domain: `Dyadic ${d.name}`,
        partnerAScore: a,
        partnerBScore: b,
        difference: diff,
        isSignificant: diff > d.threshold,
        insight: diff > d.threshold
          ? `Partners experience ${d.name.toLowerCase()} quite differently — one feels it's stronger than the other does.`
          : `Both partners have a similar sense of ${d.name.toLowerCase()} in the relationship.`,
      });
    }
  }

  if (dyadicScores.dci) {
    // Supportive coping perception gap
    const aGivesSupportSelf = dyadicScores.dci.partnerA.supportiveBySelf;
    const bReceivesFromA = dyadicScores.dci.partnerB.supportiveByPartner;
    const supportGap = Math.abs(aGivesSupportSelf - bReceivesFromA);
    items.push({
      domain: 'Support Perception Gap',
      partnerAScore: aGivesSupportSelf,
      partnerBScore: bReceivesFromA,
      difference: supportGap,
      isSignificant: supportGap > 5,
      insight: supportGap > 5
        ? 'One partner believes they\'re providing more support than the other experiences receiving. Understanding each other\'s support needs is key.'
        : 'There\'s good alignment between support given and support received.',
    });
  }

  const significantCount = items.filter((i) => i.isSignificant).length;
  const overallAlignment: DiscrepancyAnalysis['overallAlignment'] =
    significantCount === 0 ? 'aligned' :
    significantCount <= 2 ? 'some-gaps' : 'significant-gaps';

  return {
    items,
    overallAlignment,
    summary: overallAlignment === 'aligned'
      ? 'You both see your relationship similarly — a strong foundation for growth together.'
      : overallAlignment === 'some-gaps'
      ? 'You agree on many things but see some areas differently. These perception gaps are valuable — they show where curious conversation can deepen understanding.'
      : 'You see your relationship quite differently in several areas. This isn\'t bad — it\'s information. Understanding these gaps is the first step toward bridging them.',
  };
}

// ─── Relationship Growth Edges ─────────────────────────

function identifyRelationshipGrowthEdges(
  portraitA: IndividualPortrait,
  portraitB: IndividualPortrait,
  dyadicScores: DyadicScoreSet,
  patterns: RelationshipPattern[],
  discrepancy: DiscrepancyAnalysis,
): RelationshipGrowthEdge[] {
  const edges: RelationshipGrowthEdge[] = [];

  // Edge from low satisfaction
  if (dyadicScores.csi16 &&
    ((dyadicScores.csi16.partnerA.total + dyadicScores.csi16.partnerB.total) / 2) < 52) {
    edges.push({
      id: 'reconnection',
      title: 'Rebuilding Connection',
      pattern: 'Satisfaction has eroded over time, creating a sense of emotional distance.',
      protection: 'Distance protects from further hurt, but prevents repair.',
      cost: 'Without reconnection, the relationship may drift further apart.',
      invitation: 'Take small, consistent steps toward each other. Fondness and admiration are the antidote.',
      practice: 'Daily appreciation ritual: share one thing you value about your partner each day.',
      anchor: 'We chose each other for a reason. That reason is still here, waiting to be remembered.',
      relatedAssessments: ['csi-16'],
      priority: 'high',
    });
  }

  // Edge from low cohesion
  if (dyadicScores.rdas &&
    ((dyadicScores.rdas.partnerA.cohesion + dyadicScores.rdas.partnerB.cohesion) / 2) < 10) {
    edges.push({
      id: 'shared-world',
      title: 'Building a Shared World',
      pattern: 'You live alongside each other but may not be living together in the deepest sense.',
      protection: 'Independence feels safe and efficient.',
      cost: 'Parallel lives gradually become separate lives.',
      invitation: 'Create rituals of connection — small moments that are just for the two of you.',
      practice: 'Weekly Love Maps: spend 20 minutes asking each other open-ended questions about dreams, worries, and joys.',
      anchor: 'Connection isn\'t about being together all the time — it\'s about knowing each other\'s inner world.',
      relatedAssessments: ['rdas'],
      priority: 'high',
    });
  }

  // Edge from negative coping
  if (dyadicScores.dci) {
    const avgNeg = ((dyadicScores.dci.partnerA.negativeByPartner || 0) + (dyadicScores.dci.partnerB.negativeByPartner || 0)) / 2;
    if (avgNeg > 10) {
      edges.push({
        id: 'coping-transformation',
        title: 'Transforming How You Handle Stress Together',
        pattern: 'When stress enters your system, negative responses (criticism, dismissiveness, withdrawal) have become default.',
        protection: 'These responses are attempts to manage overwhelm.',
        cost: 'Negative coping erodes trust and safety over time.',
        invitation: 'Learn to recognize stress responses as cries for help, not attacks.',
        practice: 'When stressed, use the formula: "I\'m stressed about X. What I need from you is Y."',
        anchor: 'We are on the same team, even when it doesn\'t feel like it.',
        relatedAssessments: ['dci'],
        priority: 'high',
      });
    }
  }

  // Edge from pursue-withdraw pattern
  if (patterns.some((p) => p.type === 'pursue-withdraw')) {
    edges.push({
      id: 'cycle-awareness',
      title: 'Seeing Your Dance Together',
      pattern: 'One partner reaches for connection while the other needs space — both are trying to stay safe.',
      protection: 'Pursuing keeps the connection alive; withdrawing prevents overwhelm.',
      cost: 'The cycle creates the very disconnection both partners fear.',
      invitation: 'Name the cycle together. It\'s not you vs. me — it\'s us vs. the cycle.',
      practice: 'When you notice the cycle, say: "I think our pattern is showing up. Can we pause and come back to this?"',
      anchor: 'Underneath the cycle, we both want the same thing — to feel close and safe.',
      relatedAssessments: ['ecr-r', 'dci'],
      priority: 'high',
    });
  }

  // Edge from low consensus
  if (dyadicScores.rdas &&
    ((dyadicScores.rdas.partnerA.consensus + dyadicScores.rdas.partnerB.consensus) / 2) < 18) {
    edges.push({
      id: 'navigating-differences',
      title: 'Navigating Core Differences',
      pattern: 'You see important things differently — values, decisions, lifestyle preferences.',
      protection: 'Avoiding these topics prevents conflict.',
      cost: 'Unaddressed differences become gridlocked conflicts.',
      invitation: 'Not all differences need to be resolved. Many need to be understood and managed with grace.',
      practice: 'Choose one "perpetual problem" and explore the dream behind each position — not to solve, but to understand.',
      anchor: 'Our differences don\'t mean we\'re wrong for each other. They mean we have the opportunity to grow.',
      relatedAssessments: ['rdas'],
      priority: 'medium',
    });
  }

  // Edge from perception gaps
  if (discrepancy.overallAlignment === 'significant-gaps') {
    edges.push({
      id: 'bridging-perceptions',
      title: 'Bridging Perception Gaps',
      pattern: 'You experience your relationship quite differently from each other.',
      protection: 'Assuming your partner sees things the same way you do feels simpler.',
      cost: 'Unspoken perception gaps create invisible walls.',
      invitation: 'Get curious about your partner\'s experience. Ask: "What is this like for you?"',
      practice: 'Empathic joining: take turns sharing how you experience one aspect of the relationship, with the other simply listening and reflecting back.',
      anchor: 'Understanding doesn\'t require agreement. We can hold two truths at once.',
      relatedAssessments: ['csi-16', 'rdas', 'dci'],
      priority: 'medium',
    });
  }

  // Default growth edge for healthy couples
  if (edges.length === 0) {
    edges.push({
      id: 'deepening',
      title: 'Deepening Your Connection',
      pattern: 'Your relationship has a solid foundation. The growth edge is going deeper.',
      protection: 'Comfort can become complacency.',
      cost: 'Without intentional growth, even good relationships plateau.',
      invitation: 'Keep choosing each other. Keep getting curious.',
      practice: 'Create shared meaning: discuss what rituals, dreams, and values define your partnership.',
      anchor: 'A great relationship isn\'t one without problems — it\'s one that grows through them.',
      relatedAssessments: [],
      priority: 'low',
    });
  }

  return edges.slice(0, 5);
}

// ─── Couple Anchors ────────────────────────────────────

function generateCoupleAnchors(
  portraitA: IndividualPortrait,
  portraitB: IndividualPortrait,
  patterns: RelationshipPattern[],
) {
  const hasPursueWithdraw = patterns.some((p) => p.type === 'pursue-withdraw');

  return {
    whenActivated: [
      'We are both doing our best with the nervous systems we have.',
      hasPursueWithdraw
        ? 'My reaching (or retreating) is about my need for safety, not about your worth.'
        : 'When I feel reactive, it\'s my attachment system trying to keep us safe.',
      'I can feel this intensity AND still choose to respond with care.',
      'This feeling will pass. Our connection can hold it.',
    ],
    whenDisconnected: [
      'Distance is not the same as not caring.',
      'My partner has their own inner world right now. I can wait with patience.',
      'Disconnection is temporary. We have repair skills.',
      'Even in silence, we are still a team.',
    ],
    forRepair: [
      'I\'m sorry my part of the pattern showed up. Can we try again?',
      'I think our cycle just happened. I don\'t want to be stuck here with you.',
      'What I was really trying to say underneath was...',
      'Can I have a do-over? I want to turn toward you, not away.',
    ],
    forConnection: [
      'Tell me something about your day that I wouldn\'t know unless I asked.',
      'What\'s one thing I do that makes you feel loved?',
      'Is there something you need from me right now?',
      'I chose you today. And I\'ll choose you tomorrow.',
    ],
  };
}

// ─── Intervention Priorities ───────────────────────────

function prioritizeInterventions(
  dyadicScores: DyadicScoreSet,
  patterns: RelationshipPattern[],
  discrepancy: DiscrepancyAnalysis,
) {
  const immediate: string[] = [];
  const shortTerm: string[] = [];
  const mediumTerm: string[] = [];
  const maintenance: string[] = [];

  // Crisis-level interventions
  if (dyadicScores.csi16) {
    const avg = ((dyadicScores.csi16.partnerA.total + dyadicScores.csi16.partnerB.total) / 2);
    if (avg < 34) {
      immediate.push('hold-me-tight', 'repair-attempt');
    } else if (avg < 52) {
      shortTerm.push('fondness-admiration', 'recognize-cycle');
    }
  }

  // High negative coping
  if (dyadicScores.dci) {
    const avgNeg = ((dyadicScores.dci.partnerA.negativeByPartner || 0) + (dyadicScores.dci.partnerB.negativeByPartner || 0)) / 2;
    if (avgNeg > 12) {
      immediate.push('distress-tolerance-together', 'soft-startup');
    }
  }

  // Pattern-based
  for (const pattern of patterns) {
    if (pattern.type === 'pursue-withdraw') {
      shortTerm.push('recognize-cycle', 'empathic-joining');
    }
    if (pattern.type === 'parallel-lives') {
      shortTerm.push('love-maps', 'couple-bubble');
    }
    if (pattern.type === 'demand-distance') {
      shortTerm.push('unified-detachment', 'aftermath-of-fight');
    }
  }

  // Low cohesion
  if (dyadicScores.rdas && ((dyadicScores.rdas.partnerA.cohesion + dyadicScores.rdas.partnerB.cohesion) / 2) < 10) {
    mediumTerm.push('love-maps', 'turning-toward');
  }

  // Low consensus
  if (dyadicScores.rdas && ((dyadicScores.rdas.partnerA.consensus + dyadicScores.rdas.partnerB.consensus) / 2) < 18) {
    mediumTerm.push('dreams-within-conflict', 'relationship-values-compass');
  }

  // Always maintenance
  maintenance.push('fondness-admiration', 'turning-toward', 'couple-bubble');

  // Deduplicate
  const dedup = (arr: string[]) => [...new Set(arr)];

  return {
    immediate: dedup(immediate),
    shortTerm: dedup(shortTerm),
    mediumTerm: dedup(mediumTerm),
    maintenance: dedup(maintenance),
  };
}

// ─── Helpers ───────────────────────────────────────────

function getWorseDistress(a: RDASScores['distressLevel'], b: RDASScores['distressLevel']): RDASScores['distressLevel'] {
  const order = ['severe', 'moderate', 'mild', 'non-distressed'] as const;
  const aIdx = order.indexOf(a);
  const bIdx = order.indexOf(b);
  return order[Math.min(aIdx, bIdx)];
}

function getWorseCoping(a: DCIScores['copingQuality'], b: DCIScores['copingQuality']): DCIScores['copingQuality'] {
  const order = ['weak', 'adequate', 'strong'] as const;
  const aIdx = order.indexOf(a);
  const bIdx = order.indexOf(b);
  return order[Math.min(aIdx, bIdx)];
}
