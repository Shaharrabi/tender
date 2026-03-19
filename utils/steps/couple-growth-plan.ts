/**
 * Couple Growth Plan — Living Growth Plan for the Couple Portal
 *
 * Pulls from BOTH partners' portraits + couple assessments to create
 * a shared growth plan with partner-specific actions.
 */

export interface CoupleGrowthEdge {
  /** Edge title */
  title: string;
  /** What the pattern IS */
  description: string;
  /** Partner A's role in the pattern */
  partnerARole: string;
  /** Partner B's role in the pattern */
  partnerBRole: string;
  /** Practice for Partner A */
  practiceA: string;
  /** Practice for Partner B */
  practiceB: string;
  /** Shared practice */
  practiceShared: string;
  /** Connected couple course */
  connectedCourse: string | null;
  /** Connected steps for Partner A */
  stepsA: number[];
  /** Connected steps for Partner B */
  stepsB: number[];
  /** Priority rank */
  priority: number;
}

export interface CoupleGrowthPlan {
  /** Couple growth edges */
  edges: CoupleGrowthEdge[];
  /** Partner A pathway name */
  pathwayA: string | null;
  /** Partner B pathway name */
  pathwayB: string | null;
  /** Partner A current step */
  currentStepA: number;
  /** Partner B current step */
  currentStepB: number;
  /** Partner action: what A can do while B works on their step */
  partnerActionForA: string | null;
  /** Partner action: what B can do while A works on their step */
  partnerActionForB: string | null;
  /** When generated */
  generatedAt: string;
}

// ─── Pattern Detection ───────────────────────────────────

interface PartnerProfile {
  anxiety: number;
  avoidance: number;
  regulation: number;
  empathicResonance: number;
  perspectiveTaking: number;
  fusion: number;
  dutchPrimary: string;
  valuesTop5: string[];
  pathwayName: string | null;
  currentStep: number;
}

/**
 * Generate a couple growth plan from both partners' profiles.
 */
export function generateCoupleGrowthPlan(
  partnerA: PartnerProfile,
  partnerB: PartnerProfile,
  nameA: string,
  nameB: string,
): CoupleGrowthPlan {
  const edges: CoupleGrowthEdge[] = [];
  let priority = 1;

  // 1. Pursue-Withdraw Detection
  const aAnxious = partnerA.anxiety > 4.0;
  const bAvoidant = partnerB.avoidance > 4.0;
  const bAnxious = partnerB.anxiety > 4.0;
  const aAvoidant = partnerA.avoidance > 4.0;

  if ((aAnxious && bAvoidant) || (bAnxious && aAvoidant)) {
    const pursuer = aAnxious ? nameA : nameB;
    const withdrawer = bAvoidant ? nameB : nameA;
    edges.push({
      title: 'The Pursue-Withdraw Cycle',
      description: `${pursuer} tends to move toward when stressed, while ${withdrawer} tends to pull back. This creates a self-reinforcing loop: the more one pursues, the more the other withdraws.`,
      partnerARole: aAnxious
        ? 'You pursue — moving toward connection with urgency when you sense distance.'
        : 'You withdraw — pulling back to self-regulate when emotions intensify.',
      partnerBRole: bAvoidant
        ? 'You withdraw — pulling back to self-regulate when emotions intensify.'
        : 'You pursue — moving toward connection with urgency when you sense distance.',
      practiceA: aAnxious
        ? 'When you feel the urge to pursue, pause for 60 seconds. Put your hand on your chest. Say: "I notice I want to reach. I\'m going to wait."'
        : 'When you feel the urge to withdraw, name it out loud: "I\'m going to take 10 minutes. I will come back." Then come back.',
      practiceB: bAvoidant
        ? 'When you feel the urge to withdraw, name it out loud: "I\'m going to take 10 minutes. I will come back." Then come back.'
        : 'When you feel the urge to pursue, pause for 60 seconds. Put your hand on your chest. Say: "I notice I want to reach. I\'m going to wait."',
      practiceShared: 'After a cycle episode, do an after-action review together: "What just happened? What did each of us need underneath?" No blame. Just understanding.',
      connectedCourse: 'mc-negative-cycle',
      stepsA: [1, 2, 5, 9],
      stepsB: [1, 2, 5, 9],
      priority: priority++,
    });
  }

  // 2. Empathy Asymmetry
  const erDelta = Math.abs(partnerA.empathicResonance - partnerB.empathicResonance);
  if (erDelta > 25) {
    const highER = partnerA.empathicResonance > partnerB.empathicResonance ? nameA : nameB;
    const lowER = partnerA.empathicResonance > partnerB.empathicResonance ? nameB : nameA;
    edges.push({
      title: 'The Empathy Gap Between You',
      description: `${highER} feels emotions deeply and reads the room with precision. ${lowER} processes emotions more internally and may not register shifts as quickly. This creates moments where one partner feels unseen.`,
      partnerARole: partnerA.empathicResonance > partnerB.empathicResonance
        ? 'You sense everything — sometimes too much. You may feel like you\'re doing all the emotional work.'
        : 'You process emotions more slowly and privately. You care deeply, but your partner may not see it in the moment.',
      partnerBRole: partnerB.empathicResonance > partnerA.empathicResonance
        ? 'You sense everything — sometimes too much. You may feel like you\'re doing all the emotional work.'
        : 'You process emotions more slowly and privately. You care deeply, but your partner may not see it in the moment.',
      practiceA: partnerA.empathicResonance > partnerB.empathicResonance
        ? 'Practice naming what you sense without expecting your partner to match your emotional speed: "I\'m picking up something. Take your time."'
        : 'Practice checking in proactively: "How are you feeling right now?" — even when you don\'t sense anything shifting.',
      practiceB: partnerB.empathicResonance > partnerA.empathicResonance
        ? 'Practice naming what you sense without expecting your partner to match your emotional speed.'
        : 'Practice checking in proactively: "How are you feeling right now?"',
      practiceShared: 'Once a week, do an empathy exchange: each partner shares one feeling from the week while the other listens and reflects it back without adding anything.',
      connectedCourse: 'mc-empathy-boundaries',
      stepsA: [5, 6],
      stepsB: [5, 6],
      priority: priority++,
    });
  }

  // 3. Regulation Mismatch
  const regDelta = Math.abs(partnerA.regulation - partnerB.regulation);
  if (regDelta > 20) {
    const lowerReg = partnerA.regulation < partnerB.regulation ? nameA : nameB;
    const higherReg = partnerA.regulation < partnerB.regulation ? nameB : nameA;
    edges.push({
      title: 'Different Regulation Capacities',
      description: `${higherReg} has a wider window of tolerance — they can hold more emotional intensity before flooding. ${lowerReg} floods more quickly. This mismatch means conversations can feel fine for one partner while the other is already overwhelmed.`,
      partnerARole: partnerA.regulation < partnerB.regulation
        ? 'Your window is narrower. You flood faster. That\'s not weakness — your system just has a lower threshold right now.'
        : 'Your window is wider. You can hold more. That gives you the responsibility to notice when your partner has left theirs.',
      partnerBRole: partnerB.regulation < partnerA.regulation
        ? 'Your window is narrower. You flood faster. That\'s not weakness — your system just has a lower threshold right now.'
        : 'Your window is wider. You can hold more. That gives you the responsibility to notice when your partner has left theirs.',
      practiceA: partnerA.regulation < partnerB.regulation
        ? 'Build your regulation toolkit: box breathing, grounding, cold water on wrists. Practice daily, not just in crisis.'
        : 'Learn your partner\'s flooding signals. When you see them, slow down — don\'t push for resolution.',
      practiceB: partnerB.regulation < partnerA.regulation
        ? 'Build your regulation toolkit: box breathing, grounding, cold water on wrists. Practice daily, not just in crisis.'
        : 'Learn your partner\'s flooding signals. When you see them, slow down — don\'t push for resolution.',
      practiceShared: 'Create a shared signal for "I\'m leaving my window" — a word, a gesture, a hand signal. When either partner uses it, both pause for 10 minutes. No exceptions.',
      connectedCourse: 'mc-window-widening',
      stepsA: [1, 4],
      stepsB: [1, 4],
      priority: priority++,
    });
  }

  // 4. Conflict Style Clash
  if (partnerA.dutchPrimary !== partnerB.dutchPrimary) {
    edges.push({
      title: `${formatConflictStyle(partnerA.dutchPrimary)} Meets ${formatConflictStyle(partnerB.dutchPrimary)}`,
      description: `${nameA} tends toward ${partnerA.dutchPrimary} in conflict while ${nameB} tends toward ${partnerB.dutchPrimary}. Neither style is wrong — but when they meet, they can create friction or gridlock.`,
      partnerARole: `Your default is ${partnerA.dutchPrimary}. This serves you when it matches the situation, but can frustrate your partner when it doesn't.`,
      partnerBRole: `Your default is ${partnerB.dutchPrimary}. This serves you when it matches the situation, but can frustrate your partner when it doesn't.`,
      practiceA: `This week, try your partner's conflict style for one low-stakes disagreement. What does ${partnerB.dutchPrimary} feel like from the inside?`,
      practiceB: `This week, try your partner's conflict style for one low-stakes disagreement. What does ${partnerA.dutchPrimary} feel like from the inside?`,
      practiceShared: 'Before a difficult conversation, each say: "My instinct will be to [style]. I\'m going to try to also [opposite approach]."',
      connectedCourse: 'mc-conflict-as-resource',
      stepsA: [3, 8],
      stepsB: [3, 8],
      priority: priority++,
    });
  }

  // 5. Shared Values Gap
  const sharedValues = partnerA.valuesTop5.filter((v) => partnerB.valuesTop5.includes(v));
  const uniqueA = partnerA.valuesTop5.filter((v) => !partnerB.valuesTop5.includes(v));
  const uniqueB = partnerB.valuesTop5.filter((v) => !partnerA.valuesTop5.includes(v));

  if (uniqueA.length > 0 && uniqueB.length > 0) {
    edges.push({
      title: 'Where Your Values Diverge',
      description: `You share ${sharedValues.length > 0 ? sharedValues.join(', ') : 'some'} values, but ${nameA} uniquely prioritizes ${uniqueA[0] ?? 'different things'} while ${nameB} uniquely prioritizes ${uniqueB[0] ?? 'different things'}. These differences aren't problems — they're creative tension.`,
      partnerARole: `You bring ${uniqueA[0] ?? 'your unique perspective'} to the relationship. This enriches the partnership even when it creates friction.`,
      partnerBRole: `You bring ${uniqueB[0] ?? 'your unique perspective'} to the relationship. This enriches the partnership even when it creates friction.`,
      practiceA: `Ask your partner: "Tell me why ${uniqueB[0] ?? 'that'} matters so much to you. I want to understand."`,
      practiceB: `Ask your partner: "Tell me why ${uniqueA[0] ?? 'that'} matters so much to you. I want to understand."`,
      practiceShared: 'Create a "values calendar": alternate weeks where one partner\'s priority value guides a decision or activity.',
      connectedCourse: 'mc-values-alignment',
      stepsA: [10],
      stepsB: [10],
      priority: priority++,
    });
  }

  // Generate partner actions based on current steps
  const partnerActionForA = generatePartnerAction(partnerB.currentStep, nameB);
  const partnerActionForB = generatePartnerAction(partnerA.currentStep, nameA);

  return {
    edges,
    pathwayA: partnerA.pathwayName,
    pathwayB: partnerB.pathwayName,
    currentStepA: partnerA.currentStep,
    currentStepB: partnerB.currentStep,
    partnerActionForA,
    partnerActionForB,
    generatedAt: new Date().toISOString(),
  };
}

// ─── Helpers ─────────────────────────────────────────────

function formatConflictStyle(style: string): string {
  const map: Record<string, string> = {
    yielding: 'Accommodating',
    forcing: 'Direct',
    avoiding: 'Avoidant',
    problemSolving: 'Problem-Solving',
    compromising: 'Compromising',
  };
  return map[style] ?? style;
}

function generatePartnerAction(partnerStep: number, partnerName: string): string | null {
  const actions: Record<number, string> = {
    1: `${partnerName} is working on Step 1 (Acknowledge the Strain). The most helpful thing you can do: be patient with their increased awareness of patterns. They're learning to see what was invisible before.`,
    2: `${partnerName} is working on Step 2 (Trust the Relational Field). Your role: be consistent. Show up when you say you will. Predictability builds the trust they're learning.`,
    3: `${partnerName} is working on Step 3 (See Your Part). Your role: don't use their self-awareness against them. When they name a pattern, receive it without saying "I told you so."`,
    4: `${partnerName} is working on Step 4 (Feel Without Fixing). Your role: let them feel without rushing to make it better. Sometimes the most loving thing is sitting in the discomfort together.`,
    5: `${partnerName} is working on Step 5 (Listen to Understand). Your role: share something real. They're practicing vulnerability — give them something safe to practice with.`,
    6: `${partnerName} is working on Step 6 (Hold Space for Difference). Your role: be yourself, unapologetically. They're learning that your differences aren't threats.`,
    7: `${partnerName} is working on Step 7 (Create Safety Together). Your role: participate in the rituals they suggest. Consistency is safety.`,
    8: `${partnerName} is working on Step 8 (Speak Your Truth). Your role: listen without defending. They're practicing honesty — make it safe to be honest.`,
    9: `${partnerName} is working on Step 9 (Repair What's Broken). Your role: receive the repair attempt, even if it's imperfect. A clumsy repair is still a repair.`,
    10: `${partnerName} is working on Step 10 (Live Your Values Together). Your role: share YOUR values too. This step works best as a conversation, not a monologue.`,
    11: `${partnerName} is working on Step 11 (Sustain the Practice). Your role: celebrate their consistency. "I notice you've been showing up" means more than you think.`,
    12: `${partnerName} is working on Step 12 (Give It Away). Your role: let them teach you what they've learned. The student-teacher dynamic deepens intimacy.`,
  };
  return actions[partnerStep] ?? null;
}
