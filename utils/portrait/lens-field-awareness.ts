/**
 * Lens 5: Field Awareness — Phase 3
 *
 * "How You Show Up in the Relational Field"
 *
 * Generated from cross-instrument synthesis of the Phase 2 supplement items:
 * - ECR-R supplement (5 items): somatic awareness, fixed story, cycle awareness, certainty, needs-as-info
 * - SSEIT supplement (3 items): room sensing, relational shift awareness, emotion differentiation
 * - DSI-R supplement (4 items): closeness with identity, disagreement with connection, boundary clarity, boundary without guilt
 * - Values supplement (5 items): divergence response, difference-as-resource, right-vs-present, shared value, willingness-to-change
 *
 * Attachment-tailored narrative templates from V2 Part 10.
 */

import type { ECRRScores, IPIPScores, DSIRScores, CompositeScores } from '@/types';
import type { FieldAwarenessLens, SupplementScores } from '@/types/portrait';
import type { TailoringContext } from './attachment-tailoring';

// ─── Main Analysis Function ───────────────────────────────

export function analyzeFieldAwareness(
  supplements: SupplementScores,
  ecrr: ECRRScores,
  ipip: IPIPScores,
  dsir: DSIRScores,
  composite: CompositeScores,
  tailoring: TailoringContext
): FieldAwarenessLens {
  // Extract scores with defaults for missing supplements
  const fieldSensitivity = supplements.sseit?.fieldSensitivityMean ?? 3;   // midpoint of 5-point scale
  const boundaryClarity = supplements.dsir?.boundaryAwarenessMean ?? 3.5; // midpoint of 6-point scale
  const patternAwareness = supplements.ecrr?.patternAwarenessMean ?? 4;
  const cycleAwareness = supplements.ecrr?.cycleAwareness ?? 4;
  const metacognitiveCapacity = cycleAwareness >= 5;

  // Build cross-pattern insights
  const crossPatterns = buildCrossPatterns(supplements, ecrr, ipip, dsir, composite);

  // Build attachment-tailored narrative
  const narrative = buildFieldNarrative(
    fieldSensitivity,
    boundaryClarity,
    patternAwareness,
    metacognitiveCapacity,
    supplements,
    ecrr,
    ipip,
    composite,
    tailoring
  );

  return {
    narrative,
    fieldSensitivity,
    boundaryClarity,
    patternAwareness,
    metacognitiveCapacity,
    crossPatterns,
  };
}

// ─── Cross-Pattern Builder ────────────────────────────────

function buildCrossPatterns(
  sup: SupplementScores,
  ecrr: ECRRScores,
  ipip: IPIPScores,
  dsir: DSIRScores,
  composite: CompositeScores
): string[] {
  const patterns: string[] = [];

  // ECR-R somatic awareness × window width
  if (sup.ecrr && sup.ecrr.somaticAwareness >= 5 && composite.windowWidth < 50) {
    patterns.push(
      'You detect relational shifts in your body quickly — but your narrow regulation window means the signal floods you before you can use it as information. The body knows; the nervous system panics.'
    );
  }

  // ECR-R fixed story × attachment anxiety
  if (sup.ecrr && sup.ecrr.fixedStory < 4 && ecrr.anxietyScore > 4.0) {
    // Low fixedStory = high original score (reverse-scored) = more fixed story
    patterns.push(
      'Your anxiety creates a confirming story about your partner — "they always..." or "they never..." — that makes it harder to see the moments they ARE available. The story is the anxiety talking, not the full truth.'
    );
  }

  // ECR-R certainty × Big Five openness
  if (sup.ecrr && sup.ecrr.certaintyVsCuriosity < 4 && ipip.domainPercentiles.openness < 40) {
    // Low certaintyVsCuriosity = high original score (reverse-scored) = more certainty
    patterns.push(
      'Your system craves predictability in relationships. Curiosity about your partner feels risky because it introduces unknowns. The practice: small experiments in not-knowing.'
    );
  }

  // ECR-R needs-as-information × differentiation
  if (sup.ecrr && sup.ecrr.needsAsInformation >= 5 && dsir.totalMean > 4.0) {
    patterns.push(
      'You see your relational needs as information, not flaws — and you have the differentiation to hold that perspective under pressure. This is a secure relational stance.'
    );
  } else if (sup.ecrr && sup.ecrr.needsAsInformation >= 5 && dsir.totalMean < 3.0) {
    patterns.push(
      'You understand your needs are valid information — but low differentiation means you may over-accommodate rather than advocate for them. The insight is there; the action needs support.'
    );
  }

  // SSEIT E1+E2 high but E3 low — absorb everything
  // (SSEIT supplement uses 5-point scale: 1–5)
  if (
    sup.sseit &&
    sup.sseit.roomSensing >= 4 &&
    sup.sseit.relationalShiftAwareness >= 4 &&
    sup.sseit.emotionDifferentiation < 3
  ) {
    patterns.push(
      'You are a strong emotional reader — you sense the atmosphere and relational shifts accurately. But you absorb everything without distinguishing what is yours, what is your partner\'s, and what belongs to the space between you. This leads to emotional flooding and reactivity.'
    );
  }

  // SSEIT low field sensitivity (5-point scale: below midpoint)
  if (sup.sseit && sup.sseit.fieldSensitivityMean < 2.5) {
    patterns.push(
      'The relational field is not strongly on your radar yet. You tend to focus on content — what was said — rather than process — what is happening between you. Building field sensitivity opens a new channel of relational information.'
    );
  }

  // DSI-R boundary clarity × avoidance — over-differentiation (6-point scale)
  if (sup.dsir && sup.dsir.boundaryAwarenessMean >= 5.0 && ecrr.avoidanceScore > 4.0) {
    patterns.push(
      'Your boundary clarity is high — you know where you end and your partner begins. Combined with avoidant tendencies, these boundaries may serve double duty: protecting your identity AND preventing closeness. The question: which boundaries are for you, and which are against connection?'
    );
  }

  // DSI-R boundary clarity × anxiety — fusion risk (6-point scale: below midpoint)
  if (sup.dsir && sup.dsir.boundaryAwarenessMean < 3.0 && ecrr.anxietyScore > 4.0) {
    patterns.push(
      'Low boundary clarity combined with attachment anxiety creates fusion risk — the couple bubble swallows your individual identity. Your partner\'s emotions become your emotions. Their mood becomes your forecast. Differentiation work is foundational here.'
    );
  }

  // Values divergence × attachment
  if (sup.values) {
    const div = sup.values.valuesDivergenceResponse;
    if (div === 'threat' && ecrr.anxietyScore > 3.5) {
      patterns.push(
        'When your values and your partner\'s values diverge, you experience it as a threat — which aligns with your anxious attachment pattern. Differences feel like distance, and distance feels dangerous.'
      );
    } else if (div === 'tolerance' && ecrr.avoidanceScore > 3.5) {
      patterns.push(
        'You tolerate value differences without engaging them — which aligns with your avoidant pattern. The risk: unexamined differences become invisible walls.'
      );
    }
  }

  // Values right-vs-present × differentiation
  if (sup.values && sup.values.rightVsPresent <= 3 && dsir.totalMean < 3.0) {
    // Low score = being right is more important
    patterns.push(
      'You prioritize being right about your values over being present with your partner — and with low differentiation, this may be identity defense rather than healthy boundary-holding. The values become a wall rather than a compass.'
    );
  }

  return patterns.slice(0, 5); // Cap at 5 insights
}

// ─── Narrative Builder ────────────────────────────────────

function buildFieldNarrative(
  fieldSensitivity: number,
  boundaryClarity: number,
  patternAwareness: number,
  metacognitiveCapacity: boolean,
  sup: SupplementScores,
  ecrr: ECRRScores,
  ipip: IPIPScores,
  composite: CompositeScores,
  ctx: TailoringContext
): string {
  const neuroPct = ipip.domainPercentiles.neuroticism;
  const openPct = ipip.domainPercentiles.openness;

  // ── Select primary narrative template ──

  // Anxious + High Neuroticism + High Field Sensitivity (5-point scale)
  if (
    ctx.style === 'anxious-preoccupied' &&
    neuroPct > 60 &&
    fieldSensitivity > 3.5
  ) {
    const para1 = 'You are deeply attuned to the relational field between you and your partner — you sense shifts in connection quickly and accurately. This sensitivity is a gift: you know when something changes between you before most people would notice.';
    const para2 = 'But your nervous system translates these shifts into alarm rather than information: "something changed" becomes "something is wrong" becomes "I am about to be left." When differences arise, your system reads them as threats rather than the natural creative tension that all relationships need to grow.';
    const para3 = metacognitiveCapacity
      ? 'Your growth edge: you already have the ability to step back and see your patterns. The next step is using that awareness in real-time — sensing the field without being flooded by it. Turning detection into discernment.'
      : 'Your growth edge: learning to sense the field without being flooded by it. Building the capacity to notice a shift and pause before your attachment system writes the story.';

    return `${para1}\n\n${para2}\n\n${para3}`;
  }

  // Avoidant + Low Openness + Low Field Sensitivity + High Differentiation (5-point scale)
  if (
    ctx.style === 'dismissive-avoidant' &&
    openPct < 40 &&
    fieldSensitivity < 3.0 &&
    composite.selfLeadership > 50
  ) {
    const para1 = 'You have a strong sense of self — you know who you are, what you want, and you do not lose yourself in relationships. That is a genuine strength.';
    const para2 = 'Where the growing edge lives: you have achieved differentiation partly through distance. The relational field between you and your partner is not strongly on your radar — not because you do not care, but because attending to it feels like it could pull you into something you cannot control. Your system equates emotional closeness with loss of autonomy.';
    const para3 = 'The invitation is to build field awareness while keeping your groundedness — to discover that you can sense the "we" without losing the "I." This happens at your pace, in structured ways that respect your need for predictability.';

    return `${para1}\n\n${para2}\n\n${para3}`;
  }

  // Secure + High Openness + High Field Sensitivity (5-point scale)
  if (
    ctx.style === 'secure' &&
    openPct > 60 &&
    fieldSensitivity > 3.5
  ) {
    const para1 = 'You have a natural capacity for relational depth. You sense the field between you and your partner, you welcome differences, and you do not need certainty to feel safe in the relationship.';
    const para2 = 'This is the foundation for everything your growth plan will build on. Your growing edge may be less about learning new capacities and more about deepening existing ones — and about helping your partner meet you in the depth you are already capable of.';
    const para3 = 'The question for you: how do you hold space for a partner who may not yet have the same field awareness? Can you stay present without growing frustrated by the gap?';

    return `${para1}\n\n${para2}\n\n${para3}`;
  }

  // Fearful-avoidant template
  if (ctx.style === 'fearful-avoidant') {
    const para1 = 'Your relationship with the relational field is complex — sometimes you sense it intensely, sometimes you lose track of it entirely. This oscillation mirrors your approach-avoidance pattern: when the field feels safe, you are attuned; when it feels threatening, you disconnect.';
    const para2 = boundaryClarity > 3.5  // 6-point scale midpoint
      ? 'You have some boundary clarity — you know where you end and your partner begins, at least when things are calm. Under stress, those boundaries can blur or harden unpredictably.'
      : 'Boundary clarity is an area for growth. Under stress, you may either merge with your partner\'s emotional state or cut off entirely. Neither extreme reflects your full capacity.';
    const para3 = 'Your growth edge: building enough internal safety that you can stay present with the relational field — sensing it, learning from it — without needing to flee when it becomes intense. Both the reach and the retreat are asking for the same thing: safety with connection.';

    return `${para1}\n\n${para2}\n\n${para3}`;
  }

  // ── Default/general template ──
  // fieldSensitivity: 5-point scale (1–5)
  const sensitivityDesc =
    fieldSensitivity > 4
      ? 'strongly attuned to the relational field — you sense shifts in connection and emotional atmosphere quickly'
      : fieldSensitivity > 2.5
        ? 'developing awareness of the relational field — you notice some shifts but may miss subtler signals'
        : 'building awareness of the relational field — the emotional atmosphere between you and your partner is not yet a primary channel of information';

  // boundaryClarity: 6-point scale (1–6)
  const boundaryDesc =
    boundaryClarity > 4.5
      ? 'clear about where you end and your partner begins'
      : boundaryClarity > 3.0
        ? 'developing clearer boundaries — sometimes clear, sometimes blurred under stress'
        : 'working on boundary clarity — it is hard to tell which emotions are yours and which belong to the space between you';

  const awarenessDesc = metacognitiveCapacity
    ? 'You have the ability to step back and observe your own patterns — this metacognitive capacity is a real resource for growth.'
    : 'Building pattern awareness — the ability to see the cycle while you are in it — is a key developmental step ahead.';

  return `You are ${sensitivityDesc}. You are ${boundaryDesc}.\n\n${awarenessDesc}\n\nYour pattern awareness score suggests ${patternAwareness > 4.5 ? 'a strong capacity to notice relational dynamics — both yours and the field between you' : 'room to grow in noticing the patterns that shape your relational life. This awareness develops with practice and is one of the most powerful levers for change'}.`;
}
