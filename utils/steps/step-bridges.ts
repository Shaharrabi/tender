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
  const pos = p.negativeCycle.position;
  const regulation = p.compositeScores.regulationScore;
  const parts: string[] = [];

  if (pos === 'pursuer' && isLow(regulation)) {
    parts.push(
      'Your portrait suggests you may need regulation-first patterns \u2014 learning to soothe your own activation before trying new moves with your partner. The practices here are sequenced with that in mind.'
    );
  } else if (pos === 'withdrawer') {
    parts.push(
      'Your portrait suggests graded-exposure patterns will serve you best \u2014 small, safe steps toward staying present rather than retreating. Each new move builds on the last.'
    );
  } else {
    parts.push(
      'Your portrait shows flexibility in your pattern. This step is about choosing which new moves feel most aligned with the growth edge you\u2019re working.'
    );
  }

  return { text: parts.join(' ') };
}

// ── Step 9: Practice Repair ─────────────────────────────

function buildStep9Bridge(p: IndividualPortrait): StepBridge {
  const pos = p.negativeCycle.position;
  const parts: string[] = [];

  if (pos === 'pursuer') {
    parts.push(
      'Your repair challenge is often about softening the approach \u2014 reaching without criticism, expressing need without blame. The repair scripts in this step are tailored for that pattern.'
    );
  } else if (pos === 'withdrawer') {
    parts.push(
      'Your repair challenge is often about showing up at all \u2014 initiating repair rather than waiting for it to blow over. The practices here help you take the first step back toward connection.'
    );
  } else {
    parts.push(
      'Repair looks different depending on the moment. This step helps you build a flexible repair toolkit that matches your unique relational pattern.'
    );
  }

  return { text: parts.join(' ') };
}

// ── Step 10: Build Rituals ──────────────────────────────

function buildStep10Bridge(p: IndividualPortrait): StepBridge {
  const engagement = p.compositeScores.engagement;
  const responsiveness = p.compositeScores.responsiveness;
  const parts: string[] = [];

  if (isLow(engagement)) {
    parts.push(
      'Rituals are the direct path to rebuilding engagement. When the habit of turning toward has faded, rituals create the structure that makes it happen consistently.'
    );
  } else if (isLow(responsiveness)) {
    parts.push(
      'Your portrait suggests rituals that focus on presence rather than talking \u2014 shared silence, physical proximity, parallel activities \u2014 may feel more natural for you.'
    );
  } else {
    parts.push(
      'You already have building blocks of connection. This step is about making them intentional \u2014 choosing the moments that matter and protecting them from the busyness of life.'
    );
  }

  return { text: parts.join(' ') };
}

// ── Step 11: Sustain the Patterns ───────────────────────

function buildStep11Bridge(p: IndividualPortrait): StepBridge {
  const parts: string[] = [];

  parts.push(
    'This is a good time to notice how far you\u2019ve come. Take a moment to sense what\u2019s different in the field between you compared to when you started.'
  );

  if (p.growthEdges.length > 0) {
    parts.push(
      `Your growth edge "${p.growthEdges[0].title}" is the area to watch most closely as you sustain \u2014 it\u2019s where old patterns are most likely to reassert themselves.`
    );
  }

  return {
    text: parts.join(' '),
    insightLabel: 'Reassessing your attachment pattern now can show you how much has shifted.',
  };
}

// ── Step 12: Become a Refuge ────────────────────────────

function buildStep12Bridge(p: IndividualPortrait): StepBridge {
  const parts: string[] = [];

  parts.push(
    'You\u2019ve traveled the full journey. Your portrait \u2014 who you are in relationship \u2014 is deeper and richer than when you began.'
  );

  const pos = p.negativeCycle.position;
  if (pos === 'pursuer') {
    parts.push(
      'The reaching that once felt desperate can now feel generous. You\u2019ve learned that connection doesn\u2019t require urgency.'
    );
  } else if (pos === 'withdrawer') {
    parts.push(
      'The space you once needed to survive can now be offered as a gift \u2014 a calm, steady presence that your partner can lean into.'
    );
  }

  return {
    text: parts.join(' '),
    insightLabel: 'The journey never ends \u2014 it becomes how you live.',
  };
}
