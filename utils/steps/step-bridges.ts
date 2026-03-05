/**
 * Portrait-to-Step Bridges — Personalized "What This Means For You" content.
 *
 * Pure function: getStepBridge(stepNumber, portrait) → StepBridge | null
 *
 * Returns null when:
 * - No portrait exists (user hasn't completed assessments)
 * - The step has no bridge logic defined
 *
 * Language rules: qualitative, never raw numbers, never "WEARE score",
 * "failed", "weakness", "streak broken", or "fix". Use "growth edge",
 * "building", "your pattern", "what wants to shift".
 */

import type { IndividualPortrait } from '@/types/portrait';

// ─── Types ──────────────────────────────────────────────

export interface StepBridge {
  /** Personalized paragraph(s) */
  text: string;
  /** Optional secondary insight label */
  insightLabel?: string;
}

// ─── Main API ───────────────────────────────────────────

export function getStepBridge(
  stepNumber: number,
  portrait: IndividualPortrait | null
): StepBridge | null {
  if (!portrait) return null;

  const builder = BRIDGE_BUILDERS[stepNumber];
  if (!builder) return null;

  return builder(portrait);
}

// ─── Helpers ────────────────────────────────────────────

type BridgeBuilder = (p: IndividualPortrait) => StepBridge;

function positionLabel(position: string): string {
  switch (position) {
    case 'pursuer': return 'move toward connection when stressed';
    case 'withdrawer': return 'pull inward when things get intense';
    case 'mixed': return 'move between reaching and withdrawing';
    case 'flexible': return 'respond flexibly to stress';
    default: return 'have your own way of responding to stress';
  }
}

function isLow(score: number): boolean {
  return score < 40;
}

function isHigh(score: number): boolean {
  return score >= 70;
}

// ─── Bridge Builders ────────────────────────────────────

const BRIDGE_BUILDERS: Record<number, BridgeBuilder> = {
  1: buildStep1Bridge,
  2: buildStep2Bridge,
  3: buildStep3Bridge,
  4: buildStep4Bridge,
  5: buildStep5Bridge,
  6: buildStep6Bridge,
  7: buildStep7Bridge,
  8: buildStep8Bridge,
  9: buildStep9Bridge,
  10: buildStep10Bridge,
  11: buildStep11Bridge,
  12: buildStep12Bridge,
};

// ── Step 1: Acknowledge the Strain ──────────────────────

function buildStep1Bridge(p: IndividualPortrait): StepBridge {
  const pos = p.negativeCycle.position;
  const parts: string[] = [];

  if (pos === 'pursuer') {
    parts.push(
      'Your pattern is to feel the strain intensely \u2014 sometimes so intensely that you reach for reassurance before you\u2019ve let yourself fully see what\u2019s happening. This step is about pausing in the seeing.'
    );
  } else if (pos === 'withdrawer') {
    parts.push(
      'Your pattern is to minimize the strain \u2014 to tell yourself it\u2019s not that bad, or that you can handle it alone. This step is about letting yourself acknowledge what your body already knows.'
    );
  } else if (pos === 'mixed') {
    parts.push(
      'Your pattern shifts depending on the situation \u2014 sometimes you reach, sometimes you pull back. This step helps you see both moves clearly without judging either one.'
    );
  } else {
    parts.push(
      'You have a solid foundation for this work. This step may feel straightforward for you \u2014 use it to notice the subtleties of strain that even secure patterns can overlook.'
    );
  }

  if (p.growthEdges.length > 0) {
    parts.push(
      `Your top growth edge right now is "${p.growthEdges[0].title}" \u2014 keep this in mind as you work through this step.`
    );
  }

  return { text: parts.join(' ') };
}

// ── Step 2: Trust the Relational Field ──────────────────

function buildStep2Bridge(p: IndividualPortrait): StepBridge {
  const parts: string[] = [];
  const engagement = p.compositeScores.engagement;
  const attunement = p.compositeScores.responsiveness;

  if (isLow(attunement)) {
    parts.push(
      'Your relational field may be harder to sense right now. That\u2019s normal when distance has grown. The practices in this step are specifically designed to rebuild your sensitivity to it.'
    );
  } else if (isHigh(engagement)) {
    parts.push(
      'You already invest in the relationship \u2014 that\u2019s a strength. This step helps you invest more skillfully, by tending the field rather than pursuing your partner.'
    );
  } else {
    parts.push(
      `Your portrait shows you ${positionLabel(p.negativeCycle.position)}. Understanding how this shapes the field between you is the key insight of this step.`
    );
  }

  return { text: parts.join(' ') };
}

// ── Step 3: Release Certainty ───────────────────────────

function buildStep3Bridge(p: IndividualPortrait): StepBridge {
  const parts: string[] = [];
  const selfLeadership = p.compositeScores.selfLeadership;
  const valuesGaps = p.fourLens?.values?.significantGaps ?? [];

  if (valuesGaps.length > 0) {
    const topGap = valuesGaps[0];
    parts.push(
      `Your values say one thing but your behavior pattern says another \u2014 especially around "${topGap.value}." This step helps you see the story that drives the gap, often it\u2019s "I shouldn\u2019t have to compromise" or "if I give in, I\u2019ll lose myself."`
    );
  } else if (isHigh(selfLeadership)) {
    parts.push(
      'You\u2019re already good at self-observation. This step challenges you to observe the stories you tell ABOUT the relationship, which is harder than observing yourself.'
    );
  } else {
    parts.push(
      `Your portrait shows you ${positionLabel(p.negativeCycle.position)}. The story you tell about why things are hard probably follows that pattern. This step is about holding that story more lightly.`
    );
  }

  return { text: parts.join(' ') };
}

// ── Step 4: Examine Our Part ────────────────────────────

function buildStep4Bridge(p: IndividualPortrait): StepBridge {
  const pos = p.negativeCycle.position;
  const regulation = p.compositeScores.regulationScore;
  const parts: string[] = [];

  if (pos === 'pursuer') {
    parts.push(
      'Your dance move is to reach \u2014 louder, more urgently, sometimes critically. Underneath is usually fear: "Are you still there? Do I still matter?" This step helps you see the reach without judging it.'
    );
  } else if (pos === 'withdrawer') {
    parts.push(
      'Your dance move is to pull inward \u2014 going quiet, getting logical, creating distance. Underneath is usually overwhelm: "It\u2019s too much. I can\u2019t do this right." This step helps you see the withdrawal as a strategy, not who you are.'
    );
  } else {
    parts.push(
      `Your pattern is ${pos === 'mixed' ? 'complex \u2014 you shift between reaching and withdrawing' : 'flexible'}, which means your dance moves vary by situation. This step helps you map your specific choreography.`
    );
  }

  if (isLow(regulation)) {
    parts.push(
      'Your nervous system runs warm. You feel everything more intensely, which means your dance moves get bigger under stress. This isn\u2019t something to fix \u2014 it\u2019s sensitivity. But it helps to see how it shapes the pattern.'
    );
  }

  return { text: parts.join(' ') };
}

// ── Step 5: Share Our Truths ────────────────────────────

function buildStep5Bridge(p: IndividualPortrait): StepBridge {
  const pos = p.negativeCycle.position;
  const accessibility = p.compositeScores.accessibility;
  const parts: string[] = [];

  if (pos === 'pursuer') {
    parts.push(
      'Your tendency is to share a lot \u2014 but often from the secondary emotion (frustration, criticism) rather than the primary one (fear, longing). This step helps you get underneath to what you\u2019re really saying.'
    );
  } else if (pos === 'withdrawer') {
    parts.push(
      'Sharing feels dangerous for you. Your system says: don\u2019t show need. This step doesn\u2019t ask you to become someone you\u2019re not. It asks you to try 10% more openness and notice what happens.'
    );
  } else {
    parts.push(
      'Your pattern gives you flexibility in how you share. This step is about going deeper \u2014 past the comfortable level of sharing into the tender truths underneath.'
    );
  }

  if (isLow(accessibility)) {
    parts.push(
      'Your portrait shows you tend to keep your inner world private. This step is your growth edge. The practices are specifically designed for people who find sharing hard.'
    );
  }

  return { text: parts.join(' ') };
}

// ── Step 6: Release the Enemy Story ─────────────────────

function buildStep6Bridge(p: IndividualPortrait): StepBridge {
  const pos = p.negativeCycle.position;
  const parts: string[] = [];

  if (pos === 'pursuer') {
    parts.push(
      'Your enemy story probably sounds like: "They don\u2019t care enough. They never prioritize us. I\u2019m always the one trying." The pattern version: "When I feel disconnected, I pursue harder, which triggers their withdrawal, which confirms my fear."'
    );
  } else if (pos === 'withdrawer') {
    parts.push(
      'Your enemy story probably sounds like: "They\u2019re too demanding. Nothing I do is enough. They\u2019re always upset." The pattern version: "When they pursue, I feel overwhelmed and pull back, which triggers more pursuit, which confirms my sense that I can\u2019t do this right."'
    );
  } else {
    parts.push(
      'Your enemy story may shift depending on the moment \u2014 sometimes "they\u2019re too much," sometimes "they don\u2019t care enough." The pattern version always has both of you caught in the same dance.'
    );
  }

  // Check for high forcing conflict style via patterns
  const forcingPattern = p.patterns?.find(
    (pat) => pat.id === 'high-forcing' || pat.description?.toLowerCase().includes('forcing')
  );
  if (forcingPattern) {
    parts.push(
      'Your conflict style leans toward pushing your position. This step is especially important for you \u2014 releasing the enemy story means releasing the need to be right.'
    );
  }

  return { text: parts.join(' ') };
}

// ── Step 7: Invite Your Partner In ──────────────────────

function buildStep7Bridge(p: IndividualPortrait): StepBridge {
  const engagement = p.compositeScores.engagement;
  const valuesCongruence = p.compositeScores.valuesCongruence;
  const parts: string[] = [];

  if (isLow(engagement)) {
    parts.push(
      'Invitation may feel awkward for you. Start small. The practices in this step are calibrated for people who\u2019ve lost the habit of reaching.'
    );
  } else if (isHigh(valuesCongruence)) {
    parts.push(
      'Your values already point toward connection. This step helps you align your daily actions with what you say matters most.'
    );
  } else {
    parts.push(
      `You ${positionLabel(p.negativeCycle.position)}. This step shifts the energy from internal work to outward reaching \u2014 genuine invitation that comes from the self-awareness you\u2019ve built.`
    );
  }

  return { text: parts.join(' ') };
}

// ── Step 8: Create New Patterns ─────────────────────────

function buildStep8Bridge(p: IndividualPortrait): StepBridge {
  const pos = p.negativeCycle?.position;
  const selfLeadership = p.compositeScores?.selfLeadership;

  if (pos === 'pursuer') {
    return {
      text: 'Your protocol here emphasizes regulation BEFORE connection attempts. The new pattern: notice the urge to pursue \u2192 pause \u2192 ground yourself \u2192 THEN reach. The practices in this step train that pause. Imperfect practice is still practice \u2014 every time you catch the urge even a second earlier, something shifts.',
      insightLabel: 'Your growth edge: pausing before reaching',
    };
  }

  if (pos === 'withdrawer') {
    return {
      text: 'Your protocol here emphasizes graded exposure. The new pattern: notice the urge to withdraw \u2192 stay 10% longer \u2192 name what you\u2019re feeling \u2192 THEN take space if needed. Small doses build tolerance. You don\u2019t have to stay forever \u2014 just a little longer than your system says is safe.',
      insightLabel: 'Your growth edge: staying a little longer',
    };
  }

  if (selfLeadership !== undefined && isLow(selfLeadership)) {
    return {
      text: 'Your growth edge here is the I-position \u2014 the ability to hold your own ground while staying connected. The new pattern: notice when you\u2019re about to abandon your own needs \u2192 state what you want \u2192 tolerate the tension of disagreement. This isn\u2019t about winning. It\u2019s about staying whole inside the relationship.',
      insightLabel: 'Your growth edge: holding your own ground',
    };
  }

  return {
    text: 'This step is about trying new relational moves \u2014 and letting them be imperfect. You don\u2019t have to get it right. You just have to try something different than the old pattern, even once. One new move, repeated awkwardly, eventually becomes a new way of being together.',
  };
}

// ── Step 9: Practice Repair ─────────────────────────────

function buildStep9Bridge(p: IndividualPortrait): StepBridge {
  const pos = p.negativeCycle?.position;
  const regulation = p.compositeScores?.regulationScore;

  if (pos === 'pursuer') {
    return {
      text: 'Your repair challenge is over-repairing \u2014 apologizing for things that aren\u2019t yours to own, or pursuing repair before your partner is ready to receive it. The urgency to make things okay can actually delay the healing. The practices here help you repair at the right moment, not the first moment.',
      insightLabel: 'Your edge: timing your repair',
    };
  }

  if (pos === 'withdrawer') {
    return {
      text: 'Your repair challenge is avoiding repair altogether \u2014 hoping it blows over, waiting so long the moment passes, telling yourself it wasn\u2019t that big a deal. But unrepaired ruptures accumulate. The practices here help you initiate repair while it still matters, before distance becomes the default.',
      insightLabel: 'Your edge: initiating repair',
    };
  }

  if (regulation !== undefined && isHigh(regulation)) {
    return {
      text: 'Your grounded self-awareness is a real asset for repair. You can stay regulated enough to take responsibility without losing your center. The challenge may be expecting the same steadiness from your partner \u2014 their repair process might look messier than yours, and that\u2019s okay.',
      insightLabel: 'From regulation to repair',
    };
  }

  return {
    text: 'Repair is a skill, and like any skill it improves with practice. It doesn\u2019t require perfection \u2014 it requires willingness. A clumsy repair offered sincerely lands better than a polished apology that comes too late. Start with what\u2019s true, even if the words aren\u2019t elegant.',
  };
}

// ── Step 10: Build Rituals ──────────────────────────────

function buildStep10Bridge(p: IndividualPortrait): StepBridge {
  const engagement = p.compositeScores?.engagement;
  const accessibility = p.compositeScores?.accessibility;
  const valuesCongruence = p.compositeScores?.valuesCongruence;

  if (engagement !== undefined && isLow(engagement)) {
    return {
      text: 'Your portrait shows that quality time together is your lowest relational variable right now. The rituals you build in this step will shift that directly. Even five minutes of intentional connection each day changes the trajectory. This isn\u2019t about grand gestures \u2014 it\u2019s about consistency.',
      insightLabel: 'Your direct intervention point',
    };
  }

  if (accessibility !== undefined && isLow(accessibility)) {
    return {
      text: 'Your rituals should emphasize presence over activity. A five-minute silent sit together is more powerful than a two-hour date where both of you are distracted. What matters isn\u2019t what you do \u2014 it\u2019s whether you\u2019re actually there. The practices here are designed for building that kind of quiet availability.',
      insightLabel: 'Presence over activity',
    };
  }

  if (valuesCongruence !== undefined && isHigh(valuesCongruence)) {
    return {
      text: 'Your values are clear \u2014 that\u2019s a genuine strength. Rituals are how you make those values visible in daily life. What does your top value look like as a daily practice? This step turns intention into something your partner can actually see and feel.',
      insightLabel: 'Values made visible',
    };
  }

  return {
    text: 'Rituals are the scaffolding that holds new patterns in place. Without them, even the best intentions get swallowed by the pace of daily life. This step is about building consistent connection points \u2014 small, protected moments that tell your partner: this matters to me.',
  };
}

// ── Step 11: Sustain the Patterns ───────────────────────

function buildStep11Bridge(p: IndividualPortrait): StepBridge {
  const selfLeadership = p.compositeScores?.selfLeadership;
  const regulation = p.compositeScores?.regulationScore;

  if (selfLeadership !== undefined && isHigh(selfLeadership)) {
    return {
      text: 'You\u2019re well-equipped for this step. Your self-observation skills mean you\u2019ll catch drift early \u2014 you\u2019ll notice when old patterns start creeping back before they take hold. The challenge is staying compassionate when you notice it, rather than getting rigid or self-critical. Sustainability requires gentleness with yourself.',
      insightLabel: 'Self-awareness as sustaining force',
    };
  }

  if (regulation !== undefined && isLow(regulation)) {
    return {
      text: 'Under stress, the old pattern will reassert itself \u2014 that\u2019s not a sign of going backward, it\u2019s the nature of deep habits. Building regulation capacity is the key to sustainability. When your nervous system is resourced, the new pattern holds. When it\u2019s depleted, the old one returns. The practices here focus on keeping your system resourced.',
      insightLabel: 'Regulation sustains the new pattern',
    };
  }

  return {
    text: 'Growth moves in a spiral, not a straight line. You\u2019ll revisit familiar themes at deeper levels \u2014 that\u2019s not going backward, it\u2019s integration. This step is about trusting the process, noticing what wants to shift next, and using reassessment to see how far you\u2019ve already come.',
  };
}

// ── Step 12: Become a Refuge ────────────────────────────

function buildStep12Bridge(p: IndividualPortrait): StepBridge {
  const scores = p.compositeScores;
  const growthEdge = p.growthEdges?.[0];

  // Check if at least 3 of 5 core composite dimensions are high
  if (scores) {
    const highCount = [
      scores.regulationScore,
      scores.accessibility,
      scores.responsiveness,
      scores.engagement,
      scores.selfLeadership,
    ].filter((s) => s !== undefined && isHigh(s)).length;

    if (highCount >= 3) {
      return {
        text: 'Your portrait shows a strong relational foundation. The capacity for refuge is already present in how you show up \u2014 this step is about living it intentionally. Refuge isn\u2019t something you build from scratch. It\u2019s something you choose, daily, from the strength you\u2019ve cultivated.',
        insightLabel: 'Your foundation is strong',
      };
    }
  }

  if (growthEdge) {
    return {
      text: `Your primary growth edge \u2014 "${growthEdge.title}" \u2014 is your ongoing practice. Even at Step 12, this edge continues to deepen. Becoming a refuge doesn\u2019t mean the work is done. It means you\u2019ve learned to hold the work lightly, with compassion rather than urgency.`,
      insightLabel: 'Your continuing edge',
    };
  }

  return {
    text: 'Becoming a refuge is a daily choice, not a destination. Some days it will feel effortless; other days the old patterns will tug. Both are part of the journey. Celebrate how far you\u2019ve come \u2014 the willingness to look, to feel, to stay. You arrived here not because you were broken, but because you were brave enough to look.',
  };
}
