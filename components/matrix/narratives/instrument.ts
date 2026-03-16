/**
 * Instrument Narrative — "Who you are in love"
 * Instruments: IPIP Big Five x ECR-R x DSI-R
 */

import type { DomainNarrative } from '../MatrixDomain';

interface InstrumentInput {
  N: number;  // Neuroticism percentile 0-100
  E: number;  // Extraversion percentile
  O: number;  // Openness percentile
  A: number;  // Agreeableness percentile
  C: number;  // Conscientiousness percentile
  anxietyScore: number;     // ECR-R 1-7
  avoidanceScore: number;   // ECR-R 1-7
  fusionNormalized?: number; // DSI-R fusionWithOthers 0-100
}

export function generateInstrumentNarrative(input: InstrumentInput): DomainNarrative {
  const { N, E, O, A, C, anxietyScore, avoidanceScore, fusionNormalized } = input;
  const isAnxious = anxietyScore >= 4.0;
  const isAvoidant = avoidanceScore >= 4.0;
  const highFusion = (fusionNormalized ?? 0) < 40; // Low score = high fusion (due to double-reverse)

  let body: string;
  let insight: string;

  if (N > 70 && isAnxious) {
    body = `Your emotional sensitivity (${Math.round(N)}th percentile) amplifies your attachment anxiety. You feel every shift in the relational field, and your attachment system interprets those shifts as danger. You're often right that something changed \u2014 but the story your anxiety tells about WHY is usually the old wound talking.`;
    insight = `Sensitivity + anxiety = hypervigilance. The sensitivity is accurate. The interpretation is where the work lives.`;
  } else if (O < 30 && isAvoidant) {
    body = `You value the known, the stable, the reliable (${Math.round(O)}th percentile openness). In relationships, this translates to deep loyalty and consistency. The growing edge: the relational field is always moving. It isn't static because two living people aren't static.`;
    insight = `Stability is your offering. Flexibility is your invitation.`;
  } else if (A > 70 && highFusion) {
    body = `Your warmth is genuine and deep (${Math.round(A)}th percentile). But in relationship, high warmth plus high fusion can become a pattern of losing yourself \u2014 sensing what your partner wants and providing it at the expense of your own truth.`;
    insight = `The warmth is real. The question is whether you can be warm AND honest at the same time.`;
  } else if (N > 70 && E < 30) {
    body = `You feel deeply (${Math.round(N)}th percentile sensitivity) but process internally (${Math.round(E)}th percentile social energy). In love, this means a rich inner world that your partner may never fully see. The depth is there \u2014 but the bridge between inner experience and shared experience needs building.`;
    insight = `Your partner isn't ignoring your depth. They may simply not know it's there.`;
  } else if (E > 70 && isAvoidant) {
    body = `An interesting paradox: you're socially energized (${Math.round(E)}th percentile) but relationally avoidant. You connect easily at the surface but pull back when intimacy deepens. The social fluency can mask the avoidance \u2014 even from yourself.`;
    insight = `Connection and intimacy aren't the same thing. You have the first. The growth edge is the second.`;
  } else if (C > 70 && A < 40) {
    body = `You bring structure and reliability (${Math.round(C)}th percentile conscientiousness) with a direct, no-nonsense approach (${Math.round(A)}th percentile agreeableness). In love, this means your partner always knows where they stand. The edge: sometimes softness matters more than clarity.`;
    insight = `Being right and being kind aren't opposites. But in the heat of a moment, you may default to one.`;
  } else {
    body = `Your personality creates a unique relational signature. Sensitivity at the ${Math.round(N)}th percentile, social energy at the ${Math.round(E)}th, openness at the ${Math.round(O)}th, warmth at the ${Math.round(A)}th. Together, these shape how you show up when love gets real.`;
    insight = `No single trait defines you in love. It's the combination \u2014 and how it interacts with your partner's profile \u2014 that creates the dance.`;
  }

  return {
    title: 'Your relational personality',
    body,
    insight,
    instruments: ['IPIP Big Five', 'ECR-R', 'DSI-R'],
  };
}
