/**
 * Stance Narrative — "How you hold your ground"
 * Instruments: DSI-R x ECR-R x Values
 */

import type { DomainNarrative } from '../MatrixDomain';

interface StanceInput {
  totalNormalized: number;       // DSI-R total 0-100
  emotionalReactivity: number;   // DSI-R subscale 0-100
  iPosition: number;             // DSI-R subscale 0-100
  emotionalCutoff: number;       // DSI-R subscale 0-100
  fusionWithOthers: number;      // DSI-R subscale 0-100
  anxietyScore: number;          // ECR-R 1-7
  avoidanceScore: number;        // ECR-R 1-7
  honestyGap?: number;           // Values honesty domain gap
}

export function generateStanceNarrative(input: StanceInput): DomainNarrative {
  const {
    totalNormalized, emotionalReactivity, iPosition,
    emotionalCutoff, fusionWithOthers, anxietyScore,
    avoidanceScore, honestyGap,
  } = input;
  const isAnxious = anxietyScore >= 4.0;
  const isAvoidant = avoidanceScore >= 4.0;
  const highFusion = fusionWithOthers < 40; // Low = high fusion
  const highCutoff = emotionalCutoff < 40;  // Low = high cutoff
  const hasHonestyGap = (honestyGap ?? 0) >= 2.0;

  let body: string;
  let insight: string;

  if (highFusion && isAnxious) {
    body = `When you're close to someone, the line between your feelings and theirs disappears. Your anxiety (${anxietyScore.toFixed(1)}) drives you toward closeness, and low differentiation (fusion area: ${Math.round(fusionWithOthers)}) means closeness becomes merging. The invitation: discover where you end and your partner begins \u2014 not as a wall, but as a meeting point.`;
    insight = `Merging feels like love. But two people can only meet if there are two distinct people to begin with.`;
  } else if (highCutoff && isAvoidant) {
    body = `Your boundaries are strong \u2014 maybe too strong. Emotional cutoff (${Math.round(emotionalCutoff)}) combined with avoidance (${avoidanceScore.toFixed(1)}) means you've built a system that protects you completely. The cost: protection from everything, including intimacy.`;
    insight = `The wall keeps you safe AND alone. Real boundaries let the right things in while keeping the wrong things out.`;
  } else if (iPosition >= 70 && hasHonestyGap) {
    body = `You have a clear sense of self (I-position: ${Math.round(iPosition)}) \u2014 you know what you think. But there's a gap between knowing your truth and speaking it (honesty gap: ${honestyGap?.toFixed(1)}). The differentiation is there internally. The work is making it relational.`;
    insight = `Knowing yourself and showing yourself are different skills. You have the first. The second is where growth lives.`;
  } else if (emotionalReactivity < 40 && isAnxious) {
    body = `Your attachment system is anxious, but your reactivity runs high (${Math.round(emotionalReactivity)}). When triggered, your nervous system fires fast \u2014 the response comes before the thought. The anxiety provides the fuel, the reactivity provides the spark.`;
    insight = `Slowing the reaction by even two seconds changes everything. The feeling is valid. The first impulse rarely is.`;
  } else if (totalNormalized >= 70) {
    body = `Your differentiation is strong (${Math.round(totalNormalized)}). You can stay connected without losing yourself, hold your position without needing to win. This is the bedrock of healthy relating \u2014 being WITH someone without becoming them.`;
    insight = `High differentiation is a relational superpower. The growth edge is making sure it doesn't become emotional independence disguised as strength.`;
  } else {
    body = `Your differentiation profile \u2014 how well you maintain a sense of self while staying connected \u2014 is at ${Math.round(totalNormalized)}. Reactivity at ${Math.round(emotionalReactivity)}, I-position at ${Math.round(iPosition)}, and fusion at ${Math.round(fusionWithOthers)} reveal where your boundaries hold and where they blur.`;
    insight = `Differentiation isn't about distance. It's about being fully yourself while being fully present with someone else.`;
  }

  return {
    title: 'Your differentiation profile',
    body,
    insight,
    instruments: ['DSI-R', 'ECR-R', 'Values'],
  };
}
