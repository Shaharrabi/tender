/**
 * Conflict Narrative — "How you navigate conflict"
 * Instruments: DUTCH x ECR-R x IPIP x Values
 */

import type { DomainNarrative } from '../MatrixDomain';

interface ConflictInput {
  primaryStyle: string;
  secondaryStyle: string;
  yieldingMean: number;      // 1-5
  avoidingMean: number;      // 1-5
  forcingMean: number;       // 1-5
  problemSolvingMean: number; // 1-5
  compromisingMean: number;  // 1-5
  anxietyScore: number;      // ECR-R 1-7
  avoidanceScore: number;    // ECR-R 1-7
  N?: number;                // IPIP Neuroticism percentile
  honestyImportance?: number; // Values honesty importance 1-10
}

export function generateConflictNarrative(input: ConflictInput): DomainNarrative {
  const {
    primaryStyle, yieldingMean, avoidingMean, forcingMean,
    problemSolvingMean, anxietyScore, avoidanceScore, N, honestyImportance,
  } = input;
  const isAnxious = anxietyScore >= 4.0;
  const isAvoidant = avoidanceScore >= 4.0;
  const highN = (N ?? 0) >= 70;
  const valuesHonesty = (honestyImportance ?? 0) >= 8.0;

  let body: string;
  let insight: string;

  if (yieldingMean >= 3.5 && isAnxious) {
    body = `You yield in conflict not because you don't have a position, but because your anxiety says "if I push back, they'll leave." Over time, your partner is in a relationship with someone who's editing themselves \u2014 and they don't even know it.`;
    insight = `The yielding protects the bond. But it slowly erases the person inside the bond. Your partner fell in love with you \u2014 not with your agreeable version.`;
  } else if (avoidingMean >= 3.5 && valuesHonesty) {
    body = `You value honesty deeply but your default in conflict is avoidance. This creates a specific kind of suffering: you know what's true, but you can't bring yourself to say it when it matters. The gap between your values and your behavior is where the growth edge lives.`;
    insight = `Honesty without conflict avoidance would change everything. Not brutal honesty \u2014 brave honesty. There's a difference.`;
  } else if (forcingMean >= 3.5 && highN) {
    body = `When your sensitivity (${Math.round(N!)}th percentile) detects a threat, you don't retreat \u2014 you escalate. Your intensity is real caring, but it lands as pressure. Your partner can't hear the love underneath the force.`;
    insight = `Soften the approach without softening the truth. The message matters. So does the delivery.`;
  } else if (avoidingMean >= 3.5 && isAvoidant) {
    body = `Double avoidance: you avoid conflict AND you avoid emotional closeness. When things get tense, you disappear \u2014 sometimes literally, sometimes behind a wall of calm. The surface stays still. Nothing underneath gets addressed.`;
    insight = `Staying in the room is the first practice. Not to fix anything. Just to be present while it's uncomfortable.`;
  } else if (problemSolvingMean >= 3.5 && yieldingMean >= 3.0) {
    body = `You alternate between problem-solving and yielding \u2014 sometimes driving toward resolution, sometimes giving in to keep the peace. The pattern depends on how safe you feel. When secure, you problem-solve. When threatened, you yield.`;
    insight = `Notice which mode you're in. If you're yielding, ask: is this peace, or is this surrender?`;
  } else {
    body = `Your primary conflict style is ${primaryStyle}. In tense moments, this is your default move \u2014 not because it's always the best response, but because it's the one your nervous system reaches for first.`;
    insight = `Conflict style isn't character. It's habit. And habits can evolve when you see them clearly.`;
  }

  return {
    title: 'Your conflict pattern',
    body,
    insight,
    instruments: ['DUTCH', 'ECR-R', 'IPIP'],
  };
}
