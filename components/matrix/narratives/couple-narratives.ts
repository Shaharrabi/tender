/**
 * Couple Narratives — Pairing-specific narratives for "Our Matrix"
 *
 * Each function takes both partners' scores and generates the
 * relational dynamic narrative — how the two profiles interact.
 */

// ─── Attachment Pairing ─────────────────────────────

interface AttachmentPairingInput {
  aStyle: string;
  bStyle: string;
  aAnxiety: number;
  bAnxiety: number;
  aAvoidance: number;
  bAvoidance: number;
}

export function generateAttachmentPairing(input: AttachmentPairingInput): {
  centerLabel: string;
  narrative: string;
  practice: string;
} {
  const { aStyle, bStyle, aAnxiety, bAnxiety, aAvoidance, bAvoidance } = input;
  const aAnxious = aAnxiety >= 4.0;
  const bAnxious = bAnxiety >= 4.0;
  const aAvoid = aAvoidance >= 4.0;
  const bAvoid = bAvoidance >= 4.0;

  if (aAnxious && bAvoid) {
    return {
      centerLabel: 'The Classic Dance',
      narrative: 'One of you reaches while the other retreats. The pursuer feels abandoned, the withdrawer feels overwhelmed. Both are trying to regulate \u2014 just in opposite directions. This is the most common pairing, and the most transformable.',
      practice: 'The pursuer practices stillness. The withdrawer practices one step forward. Meet in the middle \u2014 literally.',
    };
  }
  if (aAvoid && bAnxious) {
    return {
      centerLabel: 'The Classic Dance',
      narrative: 'One of you retreats while the other reaches. The withdrawer feels overwhelmed, the pursuer feels abandoned. Both are trying to regulate \u2014 just in opposite directions. This is the most common pairing, and the most transformable.',
      practice: 'The withdrawer practices one step forward. The pursuer practices stillness. Meet in the middle \u2014 literally.',
    };
  }
  if (aAnxious && bAnxious) {
    return {
      centerLabel: 'Mutual Reach',
      narrative: 'You both reach for connection intensely. When you\'re in sync, it\'s electric. When you\'re both triggered, the system floods \u2014 two alarm systems going off simultaneously with no one to ground the field.',
      practice: 'Take turns being the steady one. You can\'t both reach at the same time.',
    };
  }
  if (aAvoid && bAvoid) {
    return {
      centerLabel: 'Parallel Worlds',
      narrative: 'You both value independence and space. The surface stays calm and respectful. The risk: the space becomes a moat. Without someone reaching, the connection can quietly starve.',
      practice: 'One conversation per week where you don\'t leave the room. Start there.',
    };
  }
  if (aStyle === 'secure' && bAnxious) {
    return {
      centerLabel: 'Anchor & Reach',
      narrative: 'One of you provides the ground, the other provides the intensity. The secure partner can hold space without being consumed by the other\'s anxiety. The gift: stability. The risk: the secure partner becomes a parent, not a partner.',
      practice: 'You have the ground. Use it to hold space, not to fix.',
    };
  }
  if (bStyle === 'secure' && aAnxious) {
    return {
      centerLabel: 'Anchor & Reach',
      narrative: 'One of you provides the ground, the other provides the intensity. The secure partner can hold space without being consumed by the other\'s anxiety.',
      practice: 'You have the ground. Use it to hold space, not to fix.',
    };
  }
  if (aStyle === 'secure' && bStyle === 'secure') {
    return {
      centerLabel: 'Shared Ground',
      narrative: 'You both bring security to the relationship. This is a strong foundation \u2014 you can tolerate distance and closeness without losing yourselves. The invitation: go from good to extraordinary.',
      practice: 'Security is your launchpad. Use it to take emotional risks you wouldn\'t dare take with anyone else.',
    };
  }

  return {
    centerLabel: 'Complementary',
    narrative: 'Your attachment styles create a unique dynamic. Neither of you fits neatly into one quadrant, which means your dance is complex and nuanced.',
    practice: 'Map the moments when you\'re in sync and when you\'re not. The pattern will reveal itself.',
  };
}

// ─── Conflict Interaction ────────────────────────────

interface ConflictPairingInput {
  aPrimary: string;
  bPrimary: string;
  aForcing: number;
  bForcing: number;
  aAvoiding: number;
  bAvoiding: number;
  aYielding: number;
  bYielding: number;
  aProblemSolving: number;
  bProblemSolving: number;
}

export function generateConflictPairing(input: ConflictPairingInput): {
  interactionType: string;
  narrative: string;
  practice: string;
} {
  const { aPrimary, bPrimary, aForcing, bForcing, aAvoiding, bAvoiding, aYielding, bYielding, aProblemSolving, bProblemSolving } = input;

  // Escalation-Withdrawal
  if ((aForcing >= 3.5 && bAvoiding >= 3.5) || (bForcing >= 3.5 && aAvoiding >= 3.5)) {
    return {
      interactionType: 'Escalation-Withdrawal',
      narrative: 'When conflict arises, one of you pushes harder while the other pulls away. The pusher feels ignored, the withdrawer feels overwhelmed. Both are trying to regulate \u2014 just in opposite directions.',
      practice: 'The pursuer practices softening the approach. The withdrawer practices staying in the room for 60 more seconds than feels comfortable.',
    };
  }

  // Mutual Withdrawal
  if (aAvoiding >= 3.5 && bAvoiding >= 3.5) {
    return {
      interactionType: 'Mutual Withdrawal',
      narrative: 'You both sidestep conflict. The surface stays calm but nothing gets resolved. Issues accumulate silently until something breaks through.',
      practice: 'Schedule a weekly 15-minute temperature check. Not to solve anything \u2014 just to name what\'s been unsaid.',
    };
  }

  // Mutual Escalation
  if (aForcing >= 3.5 && bForcing >= 3.5) {
    return {
      interactionType: 'Mutual Escalation',
      narrative: 'When conflict hits, you both push harder. The volume goes up, the listening goes down. The passion is real but it burns the bridge you\'re trying to cross.',
      practice: 'Agree on a pause signal. When either person uses it, both stop for 20 minutes. Return calmer, not quieter.',
    };
  }

  // Leader-Accommodator
  if ((aProblemSolving >= 3.5 && bYielding >= 3.5) || (bProblemSolving >= 3.5 && aYielding >= 3.5)) {
    return {
      interactionType: 'Leader-Accommodator',
      narrative: 'One of you drives toward solutions while the other goes along. The risk: the accommodator\'s real feelings go underground.',
      practice: 'Before solving, the problem-solver asks: "What do YOU need here?" The yielder practices answering honestly.',
    };
  }

  // Collaborative
  if (aProblemSolving >= 3.5 && bProblemSolving >= 3.5) {
    return {
      interactionType: 'Collaborative',
      narrative: 'You both lean toward problem-solving. Conflicts become projects to tackle together. The strength: efficiency. The risk: bypassing emotions to get to solutions too fast.',
      practice: 'Before solving: "How does this feel for you?" Feelings before fixes.',
    };
  }

  return {
    interactionType: `${aPrimary} meets ${bPrimary}`,
    narrative: `Your conflict styles create a unique interaction pattern. Understanding the dance \u2014 how your ${aPrimary} meets their ${bPrimary} \u2014 is the first step toward changing it.`,
    practice: 'Name the pattern out loud when you see it happening. Awareness is the first intervention.',
  };
}

// ─── Couple Invitation ───────────────────────────────

interface CoupleInvitationInput {
  aStyle: string;
  bStyle: string;
  aAnxiety: number;
  bAnxiety: number;
  aAvoidance: number;
  bAvoidance: number;
}

export function generateCoupleInvitation(input: CoupleInvitationInput): string {
  const { aStyle, bStyle, aAnxiety, bAnxiety, aAvoidance, bAvoidance } = input;
  const aAnxious = aAnxiety >= 4.0;
  const bAnxious = bAnxiety >= 4.0;
  const aAvoid = aAvoidance >= 4.0;
  const bAvoid = bAvoidance >= 4.0;

  if (aAnxious && bAnxious) {
    return 'Take turns being the steady one. You can\'t both reach at the same time.';
  }
  if ((aAnxious && bAvoid) || (aAvoid && bAnxious)) {
    return 'The pursuer practices stillness. The withdrawer practices one step forward. Meet in the middle \u2014 literally.';
  }
  if (aStyle === 'secure' && bAnxious) {
    return 'You have the ground. Use it to hold space, not to fix.';
  }
  if (bStyle === 'secure' && aAnxious) {
    return 'You have the ground. Use it to hold space, not to fix.';
  }
  if (aAvoid && bAvoid) {
    return 'One conversation per week where you don\'t leave the room. Start there.';
  }
  if (aStyle === 'secure' && bStyle === 'secure') {
    return 'You have what most couples spend years building. Now risk going deeper.';
  }

  return 'The relationship you both want is in the space between your two stories. Meet there.';
}
