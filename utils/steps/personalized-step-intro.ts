/**
 * Personalized Step Intro Generator
 *
 * Generates a dynamic paragraph at the top of each step that references
 * the user's specific assessment scores. This makes the 12-step journey
 * feel designed for THEM, not a generic self-help program.
 *
 * Each step gets a 1-2 sentence intro that connects the step's theme
 * to the user's actual profile data.
 */

import type { IndividualPortrait } from '@/types/portrait';

interface StepIntroContext {
  /** The user's primary DUTCH conflict style */
  dutchPrimary?: string;
  /** ECR-R anxiety on 0-100 scale */
  anxietyNorm: number;
  /** ECR-R avoidance on 0-100 scale */
  avoidanceNorm: number;
  /** DSI-R fusion with others (0-100, higher = more fused) */
  fusion: number;
  /** DSI-R emotional cutoff (0-100, higher = more cutoff) */
  cutoff: number;
  /** DSI-R I-position (0-100) */
  iPosition: number;
  /** DSI-R emotional reactivity (0-100) */
  reactivity: number;
  /** IPIP neuroticism percentile */
  neuroticism: number;
  /** Regulation composite score */
  regulation: number;
  /** Window width composite score */
  windowWidth: number;
  /** Values biggest gap domain and size */
  biggestGapDomain: string;
  biggestGap: number;
  /** Attachment label */
  attachmentLabel: string;
}

function extractContext(portrait: IndividualPortrait): StepIntroContext {
  const cs = portrait.compositeScores;
  const raw = portrait.allAssessmentScores;

  // DUTCH primary style
  const dutchPrimary = raw?.dutch?.primaryStyle;

  // Values biggest gap
  const valDomains = raw?.values?.domainScores ?? {};
  const gaps = Object.entries(valDomains)
    .map(([k, v]: [string, any]) => ({ domain: k, gap: v?.gap ?? 0 }))
    .sort((a, b) => b.gap - a.gap);
  const biggestGap = gaps[0] ?? { domain: 'connection', gap: 0 };

  // Attachment label
  const anxiety = cs.anxietyNorm ?? 50;
  const avoidance = cs.avoidanceNorm ?? 50;
  let attachmentLabel = 'secure';
  if (anxiety > 55 && avoidance > 55) attachmentLabel = 'fearful';
  else if (anxiety > 55) attachmentLabel = 'anxious';
  else if (avoidance > 55) attachmentLabel = 'avoidant';

  return {
    dutchPrimary,
    anxietyNorm: anxiety,
    avoidanceNorm: avoidance,
    fusion: raw?.dsir?.subscaleScores?.fusionWithOthers?.normalized ?? 50,
    cutoff: raw?.dsir?.subscaleScores?.emotionalCutoff?.normalized ?? 50,
    iPosition: raw?.dsir?.subscaleScores?.iPosition?.normalized ?? 50,
    reactivity: raw?.dsir?.subscaleScores?.emotionalReactivity?.normalized ?? 50,
    neuroticism: raw?.ipip?.domainPercentiles?.neuroticism ?? 50,
    regulation: cs.regulationScore ?? 50,
    windowWidth: cs.windowWidth ?? 50,
    biggestGapDomain: biggestGap.domain,
    biggestGap: biggestGap.gap,
    attachmentLabel,
  };
}

/**
 * Generate a personalized intro paragraph for a specific step.
 * Returns null if the portrait doesn't have enough data for personalization.
 */
export function getPersonalizedStepIntro(
  stepNumber: number,
  portrait: IndividualPortrait | null,
): string | null {
  if (!portrait?.compositeScores) return null;

  const ctx = extractContext(portrait);

  switch (stepNumber) {
    case 1: // Acknowledge the Strain
      if (ctx.attachmentLabel === 'anxious')
        return "Your attachment profile shows you notice distance quickly — you sense the strain before others do. This step asks you to name what you're sensing without letting your alarm system write the story.";
      if (ctx.attachmentLabel === 'avoidant')
        return "Your system is built to minimize strain — to smooth things over or step away. This step asks you to stay with the discomfort long enough to name it, even when your instinct says 'it's fine.'";
      return "You have the relational awareness to see patterns as they happen. This step builds on that — naming the dance without blaming either dancer.";

    case 2: // Trust the Relational Field
      if (ctx.fusion > 65)
        return "Your boundaries tend to blur in closeness — you feel what your partner feels. Trusting the field for you means learning to sense it without merging with it. The field is real. You don't have to become it to trust it.";
      if (ctx.cutoff > 65)
        return "Your system's default is to keep emotional distance. Trusting the relational field means believing that the space between you can hold more than your nervous system currently allows. It's safe to soften.";
      return null;

    case 3: // See Your Part
      if (ctx.neuroticism > 70)
        return "Your emotional landscape runs hot — signals arrive fast and loud. Seeing your part means distinguishing between 'something is wrong' and 'my system is activated.' Both are real. Only one is current.";
      if (ctx.dutchPrimary === 'yielding')
        return "Your default is to accommodate — which can look like 'I don't have a part.' But yielding IS a part. This step helps you see how your accommodation shapes the dynamic, even when it feels like you're just keeping the peace.";
      if (ctx.dutchPrimary === 'forcing')
        return "Your energy in conflict is strong — you hold your ground. This step isn't about softening. It's about seeing how your intensity lands on the other side, and what need is driving it underneath.";
      return null;

    case 4: // Feel Without Fixing
      if (ctx.regulation < 40)
        return `Your regulation capacity is still developing — your window of tolerance is narrower than average. This step is especially important for you: learning to feel without immediately needing to fix or flee. Start with 30 seconds of staying with the feeling. That's enough.`;
      if (ctx.windowWidth > 60)
        return "You have a wide window — you can hold emotional intensity without flooding. Your version of this step is about using that capacity for your partner's benefit, not just your own. Can you hold space without fixing?";
      return null;

    case 5: // Listen to Understand
      if (ctx.attachmentLabel === 'anxious')
        return "When your partner speaks, your anxiety may already be writing the next line — 'are they leaving? am I enough?' This step asks you to pause the internal narrative and actually hear what's being said, not what your fear says is being said.";
      if (ctx.cutoff > 65)
        return "Listening deeply requires staying in the room — emotionally, not just physically. Your system defaults to cutting off when feelings intensify. This step practices keeping the channel open for 60 seconds longer than feels comfortable.";
      return null;

    case 6: // Hold Space for Difference
      if (ctx.fusion > 65)
        return "Your boundaries tend to dissolve in closeness. That's not weakness — it's love without a container. This step builds the container. You'll practice distinguishing 'what I feel' from 'what my partner feels' — which, for you, is harder than it sounds.";
      if (ctx.cutoff > 65)
        return "Your boundaries are strong — maybe too strong. This step isn't about building walls higher. It's about adding doors. Difference doesn't have to mean distance.";
      if (ctx.iPosition > 65)
        return "You hold your ground well — you know who you are in relationship. This step asks you to use that clarity to make room for someone who sees things completely differently, without losing yourself in the process.";
      return null;

    case 7: // Create Safety Together
      if (ctx.attachmentLabel === 'avoidant')
        return "Safety for you has always meant space — the ability to step back when things feel like too much. This step redefines safety: not as distance, but as the knowledge that closeness won't cost you yourself.";
      if (ctx.attachmentLabel === 'anxious')
        return "Safety for you means knowing your partner is there — reliably, consistently. This step helps you build that safety from the inside, so you're not dependent on constant reassurance to feel okay.";
      return null;

    case 8: // Speak Your Truth
      if (ctx.dutchPrimary === 'avoiding')
        return `Your default in conflict is avoidance. This step asks you to say the thing you've been steering around — not aggressively, but honestly. Your truth doesn't have to be loud to be heard. It just has to be real.`;
      if (ctx.dutchPrimary === 'forcing')
        return "You already speak your truth — loudly and clearly. This step refines the delivery. Softened startup, not softened truth. The goal: your partner hears what you mean, not just what you said.";
      if (ctx.dutchPrimary === 'yielding')
        return "You've been editing yourself to keep the peace. This step invites you to say what's actually true — the thing you swallow to avoid conflict. Your partner can't meet someone who isn't fully there.";
      return null;

    case 9: // Repair What's Broken
      if (ctx.attachmentLabel === 'anxious' && ctx.dutchPrimary === 'forcing')
        return "Your repair instinct is to pursue harder — more words, more intensity, more reaching. This step teaches you to repair by stepping back, which feels wrong to your system but creates the space for your partner to come toward you.";
      if (ctx.attachmentLabel === 'avoidant')
        return "Repair requires returning — and returning is the hardest thing for an avoidant system. This step isn't about perfect words. It's about showing up after the rupture, even imperfectly.";
      return null;

    case 10: // Live Your Values Together
      if (ctx.biggestGap > 2.5)
        return `Your biggest values gap is in ${ctx.biggestGapDomain} — a ${ctx.biggestGap.toFixed(1)}-point spread between how much it matters and how consistently you live it. This step helps you close that gap, one daily choice at a time.`;
      return "Your values are relatively aligned with your behavior — which means this step is about deepening, not fixing. How do you move from 'good enough' to 'fully expressed'?";

    case 11: // Sustain the Practice
      if (ctx.regulation > 55)
        return "You have the regulation capacity to sustain practice — your window is wide enough to hold the repetition. The challenge for you isn't capability. It's consistency. This step builds the rhythm.";
      return null;

    case 12: // Give It Away
      if (ctx.attachmentLabel === 'secure')
        return "You have a foundation that others are still building. This step asks you to share what you've learned — not as advice, but as presence. Your security is contagious. Use it.";
      return "Everything you've learned in these steps becomes real when you offer it to someone else — a friend, a family member, a stranger. Teaching is the deepest form of learning.";

    default:
      return null;
  }
}
