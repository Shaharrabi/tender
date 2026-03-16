/**
 * Compass Narrative — "What matters most"
 * Instruments: Values x DUTCH
 */

import type { DomainNarrative } from '../MatrixDomain';

interface CompassInput {
  top5Values: string[];
  domainScores: Record<string, { importance: number; accordance: number; gap: number }>;
  avoidanceTendency: number;
  balancedTendency: number;
  totalScenarios: number;
  avoidingMean?: number;  // DUTCH avoiding 1-5
}

export function generateCompassNarrative(input: CompassInput): DomainNarrative {
  const { top5Values, domainScores, avoidanceTendency, totalScenarios, avoidingMean } = input;

  // Find largest gap
  let largestGapDomain = '';
  let largestGap = 0;
  for (const [domain, scores] of Object.entries(domainScores)) {
    if (scores.gap > largestGap) {
      largestGap = scores.gap;
      largestGapDomain = domain;
    }
  }

  // Check intimacy gap
  const intimacyGap = domainScores.intimacy?.gap ?? 0;
  const intimacyImp = domainScores.intimacy?.importance ?? 0;

  // Action score ratio
  const actionRatio = totalScenarios > 0 ? avoidanceTendency / totalScenarios : 0;
  const avoidingConflict = (avoidingMean ?? 0) >= 3.5;

  let body: string;
  let insight: string;

  if (intimacyGap >= 2.5) {
    body = `Intimacy matters deeply to you (${intimacyImp}/10) but there's a ${intimacyGap.toFixed(1)}-point gap between what you want and what you're living. Your values are clear. Your behavior hasn't caught up.`;
    insight = `The gap isn't about not caring. It's about not risking. Closing it requires one specific act of courage \u2014 not a personality overhaul.`;
  } else if (actionRatio >= 0.6 && avoidingConflict) {
    body = `In your values scenarios, you chose avoidance ${avoidanceTendency} out of ${totalScenarios} times. Combined with your conflict avoidance style, this is a consistent pattern: you know what matters, but when the moment arrives, you step back.`;
    insight = `The work is closing the gap between knowing and doing. One small brave action at a time.`;
  } else if (largestGap >= 3.0) {
    body = `Your biggest values gap is in ${largestGapDomain} \u2014 ${largestGap.toFixed(1)} points between importance and how you're living it. This isn't failure. It's awareness. Most people don't even know where their gaps are.`;
    insight = `The gap tells you exactly where the next conversation needs to happen. Not someday. This week.`;
  } else if (largestGap <= 1.0) {
    body = `Your values and your behavior are remarkably aligned. Your top values \u2014 ${top5Values.slice(0, 3).join(', ')} \u2014 aren't just ideals. You're living them. This is rare and worth protecting.`;
    insight = `Alignment doesn't mean arrival. The invitation is to go deeper into what these values mean at the next level of intimacy.`;
  } else {
    body = `Your compass points toward ${top5Values.slice(0, 3).join(', ')}. These aren't just preferences \u2014 they're the architecture of what love means to you. Your biggest growth gap is ${largestGapDomain} (${largestGap.toFixed(1)} points).`;
    insight = `Values without action are wishes. The matrix between what you say matters and how you actually show up \u2014 that's where the real work lives.`;
  }

  return {
    title: 'Your values compass',
    body,
    insight,
    instruments: ['Values', 'DUTCH'],
  };
}
