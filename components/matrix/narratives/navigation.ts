/**
 * Navigation Narrative — "How you read the room"
 * Instruments: SSEIT x DSI-R x DUTCH
 */

import type { DomainNarrative } from '../MatrixDomain';

interface NavigationInput {
  perception: number;        // SSEIT subscale 0-100
  managingOwn: number;       // SSEIT subscale 0-100
  managingOthers: number;    // SSEIT subscale 0-100
  utilization: number;       // SSEIT subscale 0-100
  fusionNormalized: number;  // DSI-R fusionWithOthers 0-100
  iPosition: number;         // DSI-R iPosition 0-100
  avoidingMean?: number;     // DUTCH avoiding subscale mean 1-5
}

export function generateNavigationNarrative(input: NavigationInput): DomainNarrative {
  const { perception, managingOwn, managingOthers, utilization, fusionNormalized, iPosition, avoidingMean } = input;
  const highPerception = perception >= 70;
  const highFusion = fusionNormalized < 40; // Low = more fused
  const highIPos = iPosition >= 70;
  const avoidingConflict = (avoidingMean ?? 0) >= 3.5;

  let body: string;
  let insight: string;

  if (highPerception && highFusion) {
    body = `You're a powerful emotional reader \u2014 you sense shifts before words arrive (perception: ${Math.round(perception)}). But you absorb everything. You can't always tell if the anxiety is yours, your partner's, or the relationship's. This leads to flooding: you sense the field clearly but merge with it instead of observing it.`;
    insight = `The radar works. The boundary doesn't. Learning to sense without absorbing is your growth edge.`;
  } else if (highPerception && highIPos) {
    body = `You sense the field AND you can hold your own ground within it. This is a powerful combination \u2014 attuned without being consumed. Your challenge is patience: you may see things your partner isn't ready to see yet.`;
    insight = `Seeing clearly is a gift. Waiting for your partner to catch up is the practice.`;
  } else if (!highPerception && avoidingConflict) {
    body = `You avoid conflict partly because the emotional signals are harder to read (perception: ${Math.round(perception)}). When you can't tell what's happening in the field, stepping away feels safer than engaging with something you can't decode.`;
    insight = `The avoidance isn't cowardice. It's a reasonable response to limited emotional data. Building perception reduces the need to avoid.`;
  } else if (managingOwn > 70 && managingOthers < 40) {
    body = `You're skilled at managing your own emotional world (self-regulation: ${Math.round(managingOwn)}) but struggle to support others through theirs (other-support: ${Math.round(managingOthers)}). In love, this can feel like you're fine but your partner is drowning.`;
    insight = `Regulation without co-regulation is solo survival. The relational leap is letting your steadiness serve two people, not just one.`;
  } else if (utilization > 70) {
    body = `You're unusually skilled at channeling emotions into productive action (emotional use: ${Math.round(utilization)}). Feelings don't paralyze you \u2014 they mobilize you. In love, this means conflict can become catalyst instead of crisis.`;
    insight = `Your ability to use emotion as fuel is rare. The risk: bypassing the feeling to get to the action too quickly.`;
  } else {
    body = `Your emotional intelligence profile: perception at ${Math.round(perception)}, self-regulation at ${Math.round(managingOwn)}, supporting others at ${Math.round(managingOthers)}, and emotional use at ${Math.round(utilization)}. Together, these shape how you navigate the invisible emotional currents in your relationship.`;
    insight = `Emotional intelligence isn't fixed. Every dimension here can grow with practice and awareness.`;
  }

  return {
    title: 'Your emotional navigation',
    body,
    insight,
    instruments: ['SSEIT', 'DSI-R', 'DUTCH'],
  };
}
