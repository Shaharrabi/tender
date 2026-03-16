/**
 * Foundation Narrative — "How you seek closeness"
 * Instruments: ECR-R + Composite (Window of Tolerance)
 */

import type { DomainNarrative } from '../MatrixDomain';

interface FoundationInput {
  anxietyScore: number;      // 1-7
  avoidanceScore: number;    // 1-7
  attachmentStyle: string;
  windowWidth: number;       // 0-100 composite
}

export function generateFoundationNarrative(input: FoundationInput): DomainNarrative {
  const { anxietyScore, avoidanceScore, attachmentStyle, windowWidth } = input;
  const isAnxious = anxietyScore >= 4.0;
  const isAvoidant = avoidanceScore >= 4.0;
  const narrowWindow = windowWidth < 40;
  const wideWindow = windowWidth >= 60;

  let body: string;
  let insight: string;

  if (isAnxious && narrowWindow) {
    body = `Your heart is oriented toward connection \u2014 you notice distance quickly and move toward it. Your window of tolerance is narrow (${Math.round(windowWidth)}), which means your nervous system floods before you can use what you're sensing. The pattern: detect (accurate) \u2192 flood (fast) \u2192 react (from the flood, not from clarity).`;
    insight = `The sensitivity is a gift. The narrow window turns it into urgency. Widening the window means your perception can become discernment instead of alarm.`;
  } else if (isAvoidant && wideWindow) {
    body = `You create distance to regulate. Your window is actually wider than you might think (${Math.round(windowWidth)}) \u2014 the issue isn't capacity, it's willingness. You CAN hold more emotional intensity than you typically allow yourself to experience.`;
    insight = `Your nervous system has range. The avoidance isn't about what you can handle \u2014 it's about what you've decided not to risk.`;
  } else if (isAvoidant && narrowWindow) {
    body = `You withdraw when intensity rises, and your window of tolerance (${Math.round(windowWidth)}) confirms why: the nervous system genuinely floods faster than most. The distance you create isn't just preference \u2014 it's self-preservation.`;
    insight = `Building a wider window will naturally reduce the need for distance. The avoidance becomes optional when you can actually tolerate what closeness brings.`;
  } else if (isAnxious && wideWindow) {
    body = `You reach for connection intensely, but here's the surprising thing: your window of tolerance (${Math.round(windowWidth)}) is actually wide. You have the capacity to stay present through emotional storms. The anxiety is more about pattern than physiology.`;
    insight = `You have the nervous system for secure relating \u2014 it's the attachment story that keeps running the old program.`;
  } else if (!isAnxious && !isAvoidant) {
    body = `Your attachment foundation is solid. You can tolerate distance without panic and closeness without merging. Your window (${Math.round(windowWidth)}) gives you enough range to stay present through most relational challenges.`;
    insight = `The gift of security is stability. The growth edge is depth \u2014 using this grounded foundation to go further than comfortable.`;
  } else {
    body = `Your attachment pattern reflects a mix of reaching and retreating \u2014 wanting closeness but wary of what it costs. Your window of tolerance (${Math.round(windowWidth)}) shapes how much intensity you can hold before the protective moves kick in.`;
    insight = `The push-pull isn't indecision \u2014 it's two needs competing. Both are valid. The work is learning which one to listen to in each moment.`;
  }

  return {
    title: 'Your attachment pattern',
    body,
    insight,
    instruments: ['ECR-R', 'Window of Tolerance'],
  };
}
