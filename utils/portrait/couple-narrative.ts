/**
 * Couple Narrative Generator
 *
 * Produces warm, theory-grounded, anti-shame narrative sections
 * for the Deep Couple Portrait.
 *
 * Voice: "A wise therapist who has worked with thousands of couples
 * and sees the beauty in every pattern."
 *
 * Language rules:
 * - Never say "score" or "assessment" — say "what we see," "the data suggests"
 * - No pathologizing — every pattern served a purpose
 * - Name the protection before the cost
 * - End with invitation, never prescription
 */

import type { IndividualPortrait } from '@/types/portrait';
import type {
  CoupleNarrative,
  CombinedCycle,
  CycleDynamic,
  AttachmentDynamic,
  ConvergencePoint,
  FrictionZone,
  CoupleGrowthEdge,
  CoupleAnchor,
  CoupleAnchorSet,
  RelationalFieldLayer,
} from '@/types/couples';
import type { WEAREProfile } from '@/types/weare';

// ─── Narrative Generation ────────────────────────────────

export function generateCoupleNarrative(
  portraitA: IndividualPortrait,
  portraitB: IndividualPortrait,
  partnerAName: string,
  partnerBName: string,
  combinedCycle: CombinedCycle,
  attachmentDynamic: AttachmentDynamic,
  sharedStrengths: ConvergencePoint[],
  frictionZones: FrictionZone[],
  growthEdges: CoupleGrowthEdge[],
  relationalField?: RelationalFieldLayer | null,
): CoupleNarrative {
  return {
    opening: buildOpening(partnerAName, partnerBName, combinedCycle.dynamic, sharedStrengths, frictionZones, growthEdges, relationalField),
    theField: buildFieldNarrative(partnerAName, partnerBName, relationalField),
    theDance: buildDanceNarrative(combinedCycle, partnerAName, partnerBName),
    whatYouBring: buildWhatYouBringNarrative(portraitA, portraitB, partnerAName, partnerBName),
    whereYouMeet: buildWhereYouMeetNarrative(sharedStrengths, partnerAName, partnerBName),
    whereYouDiverge: buildWhereYouDivergeNarrative(frictionZones, partnerAName, partnerBName),
    theEdge: buildEdgeNarrative(growthEdges),
    closing: buildClosing(partnerAName, partnerBName, attachmentDynamic),
  };
}

// ─── Opening ──────────────────────────────────────────────

function buildOpening(
  nameA: string,
  nameB: string,
  dynamic: CycleDynamic,
  sharedStrengths: ConvergencePoint[],
  frictionZones: FrictionZone[],
  growthEdges: CoupleGrowthEdge[],
  relationalField?: RelationalFieldLayer | null,
): string {
  const dynamicDescriptions: Record<CycleDynamic, string> = {
    'pursue-withdraw': 'When things get hard, one of you reaches while the other pulls back — not because anyone cares less, but because you each protect your heart in different ways. This is one of the most common patterns in love, and understanding it changes everything.',
    'mutual-pursuit': 'When stress shows up, you both move toward each other with real intensity — two people who refuse to let disconnection sit unnamed. That fire is a gift. Learning to channel it together is the work.',
    'mutual-withdrawal': 'When things get hard, you both tend to give each other space — two people who value calm and have built a quiet, steady partnership. The invitation is to break the silence sometimes, because closeness lives in the reaching.',
    'mixed-switching': 'Your pattern shifts depending on the moment — sometimes one of you reaches, sometimes the other. You have more flexibility than most couples, and that is a real strength, even when it feels confusing.',
  };

  // Build personalized snapshot from actual data
  let snapshot = '';

  if (sharedStrengths.length > 0) {
    const top = sharedStrengths.slice(0, 2).map(s => s.dimensionLabel.toLowerCase());
    snapshot += `What stands out right away: you share real strength in ${top.join(' and ')}. That is not luck — it is something you have built together, and it gives you a foundation most couples would envy.`;
  }

  if (frictionZones.length > 0 && sharedStrengths.length > 0) {
    snapshot += ` At the same time, there are places where you pull in different directions — ${frictionZones.length === 1 ? 'one area' : `${frictionZones.length} areas`} where your nervous systems are calibrated differently. These are not flaws. They are the places where growth is waiting.`;
  }

  if (growthEdges.length > 0) {
    snapshot += ` Your most important growth edge right now is "${growthEdges[0].title}" — this is where your relationship is asking to evolve.`;
  }

  if (relationalField && relationalField.vitality > 0) {
    const vLabel = relationalField.qualitativeLabel?.toLowerCase() || '';
    if (vLabel) {
      snapshot += ` The overall energy between you is ${vLabel}.`;
    }
  }

  return `${nameA} and ${nameB} — welcome to your couple portrait.\n\nThis is not a test result or a grade. It is a living picture of your relationship — built from everything you both shared about yourselves and each other. Think of it as a map: it shows where you are strong, where you get stuck, and where your relationship is ready to grow.\n\nEvery couple has patterns. The way you handle conflict, the way you reach for each other, the way you pull back when things feel too much — none of it is random. It all makes sense when you see the full picture. And that is what this portrait gives you: the full picture.\n\n${dynamicDescriptions[dynamic]}${snapshot ? `\n\n${snapshot}` : ''}\n\nThe most important thing to know is this: whatever you find here, it is workable. Couples who see their patterns clearly — who can say "there it is, that is our thing" — are the couples who grow the most. You are already doing that by being here.`;
}

// ─── Field Narrative ──────────────────────────────────────

function buildFieldNarrative(
  nameA: string,
  nameB: string,
  field?: RelationalFieldLayer | null,
): string {
  if (!field) {
    return `The space between ${nameA} and ${nameB} is real — it is the invisible third entity that exists wherever two people share their lives. Even without the full relational field data, what we can see from your individual portraits and dyadic assessments gives us a rich picture of what this space holds.`;
  }

  const vitalityDescription =
    field.vitality > 70 ? 'The relational field between you is vibrant and alive. There is energy here — the kind that comes from two people who are genuinely invested in each other.'
    : field.vitality > 45 ? 'The relational field between you is steady and present. There is warmth here, and the foundation is solid, even if the vitality ebbs and flows.'
    : 'The relational field between you is asking for attention. This does not mean the relationship is failing — it means the space between you needs tending, the way a garden needs water.';

  const directionDescription =
    field.direction > 3 ? 'The momentum is forward — you are both growing, even if the path is not always clear.'
    : field.direction > -3 ? 'The direction is steady — neither strongly growing nor contracting. This is a moment for intentional investment.'
    : 'The field is contracting — which may feel like distance or stuckness. This is not permanent. It is information about what the relationship needs right now.';

  return `${vitalityDescription} ${directionDescription} ${field.fieldNarrative || ''}`.trim();
}

// ─── Dance Narrative ──────────────────────────────────────

function buildDanceNarrative(
  cycle: CombinedCycle,
  nameA: string,
  nameB: string,
): string {
  const posALabel = cycle.partnerAPosition;
  const posBLabel = cycle.partnerBPosition;

  return `Every couple has a dance — a pattern that shows up when stress enters the room. Yours is the ${cycle.dynamic.replace(/-/g, ' ')} pattern. ${nameA} tends toward the ${posALabel} position, while ${nameB} tends toward the ${posBLabel} position. ${cycle.interlockDescription} The thing about your dance is this: it is not your enemy. It is your teacher. Every time the pattern shows up, it is showing you where the unmet needs live. The invitation is not to eliminate the dance — it is to see it happening in real time and choose a different step.`;
}

// ─── What You Bring ──────────────────────────────────────

function buildWhatYouBringNarrative(
  portraitA: IndividualPortrait,
  portraitB: IndividualPortrait,
  nameA: string,
  nameB: string,
): string {
  const aStrengths: string[] = [];
  const bStrengths: string[] = [];

  const scA = portraitA.compositeScores;
  const scB = portraitB.compositeScores;

  if (!scA || !scB) {
    return `${nameA} and ${nameB} each bring unique gifts to this relationship. As your individual portraits develop, the specific strengths will become clearer.`;
  }

  // Find top 2 strengths for each partner (above 65)
  const dims: [string, keyof typeof scA][] = [
    ['emotional awareness', 'emotionalIntelligence'],
    ['regulation capacity', 'regulationScore'],
    ['differentiation', 'differentiation'],
    ['attachment security', 'attachmentSecurity'],
    ['conflict flexibility', 'conflictFlexibility'],
    ['values alignment', 'valuesCongruence'],
    ['relational awareness', 'relationalAwareness'],
  ];

  for (const [label, key] of dims) {
    const aVal = (scA as any)[key] ?? 50;
    const bVal = (scB as any)[key] ?? 50;
    if (aVal > 65) aStrengths.push(label);
    if (bVal > 65) bStrengths.push(label);
  }

  const aTop = aStrengths.slice(0, 2);
  const bTop = bStrengths.slice(0, 2);

  const aDesc = aTop.length > 0
    ? `${nameA} brings ${aTop.join(' and ')} to the relationship`
    : `${nameA} brings a developing but genuine commitment to growth`;

  const bDesc = bTop.length > 0
    ? `${nameB} brings ${bTop.join(' and ')}`
    : `${nameB} brings a developing but genuine commitment to growth`;

  return `${aDesc}. ${bDesc}. Together, these gifts create a relational resource pool that neither of you has alone. The art is in learning to draw from each other's strengths without making the stronger partner the "default" in that area. Both of you have something to teach. Both of you have something to learn.`;
}

// ─── Where You Meet ──────────────────────────────────────

function buildWhereYouMeetNarrative(
  strengths: ConvergencePoint[],
  nameA: string,
  nameB: string,
): string {
  if (strengths.length === 0) {
    return `${nameA} and ${nameB}, your profiles are quite different — which means your convergence is not about shared scores but about something deeper: the choice to build a life together despite those differences. That choice, renewed daily, is its own kind of strength.`;
  }

  const strengthNames = strengths.map(s => s.dimensionLabel.toLowerCase());
  const joined = strengthNames.length === 1
    ? strengthNames[0]
    : `${strengthNames.slice(0, -1).join(', ')} and ${strengthNames[strengthNames.length - 1]}`;

  return `You share genuine strength in ${joined}. This is not coincidence — it is a resource the relationship has built or attracted. When other areas feel difficult, you can lean on this common ground. These shared capacities are your anchor points — the places where you both feel solid. Use them intentionally: when conflict arises, return to the areas where you both feel strong.`;
}

// ─── Where You Diverge ──────────────────────────────────

function buildWhereYouDivergeNarrative(
  frictionZones: FrictionZone[],
  nameA: string,
  nameB: string,
): string {
  if (frictionZones.length === 0) {
    return `There are no significant friction zones between you — which means your differences are manageable and likely even enriching. The invitation is to stay curious about the small differences, because those are where growth hides.`;
  }

  const zoneNames = frictionZones.map(z => z.area.toLowerCase());
  const joined = zoneNames.length === 1
    ? zoneNames[0]
    : `${zoneNames.slice(0, -1).join(', ')} and ${zoneNames[zoneNames.length - 1]}`;

  return `Your friction zones — ${joined} — are not problems to solve. They are dynamics to understand. In each of these areas, ${nameA} and ${nameB} pull in different directions, not because you disagree but because your nervous systems are calibrated differently. What feels like "too much" to one feels like "not enough" to the other. The practice is not compromise — it is mutual understanding. When both partners can say "I see why you need that, even though my system does not," the friction transforms from irritation into intimacy.`;
}

// ─── The Edge ──────────────────────────────────────────

function buildEdgeNarrative(growthEdges: CoupleGrowthEdge[]): string {
  if (growthEdges.length === 0) {
    return 'Your relationship is in a healthy place. The growth edge is to keep going deeper — not because something is wrong, but because the connection you have built can hold more.';
  }

  const topEdge = growthEdges[0];
  return `Your primary growth edge right now is "${topEdge.title}." ${topEdge.whatItIs} This is not a problem — it is where the relationship is asking to evolve. Every couple has a leading edge. Yours is clear, which means you can work with it intentionally rather than stumbling over it repeatedly. The ${growthEdges.length > 1 ? `other ${growthEdges.length - 1} edges` : 'work'} will naturally follow — growth in one area creates momentum in others.`;
}

// ─── Closing ──────────────────────────────────────────────

function buildClosing(nameA: string, nameB: string, dynamic: AttachmentDynamic): string {
  return `${nameA} and ${nameB} — this portrait is a snapshot, not a sentence. What you see here will shift as you grow, as you practice, as you come back to each other after the hard moments.\n\nThe fact that you are both here, looking at this together, says something important: you are willing to see yourselves and each other honestly. That willingness is not a small thing. Research shows it is the single strongest predictor of relationship growth — not perfection, not how alike you are, not how few arguments you have. Just the willingness to look and keep showing up.\n\nYou have it. Now use it. Come back to this portrait when you need a reminder of what you are building together.`;
}

// ─── Couple Anchors ──────────────────────────────────────

export function generateCoupleAnchors(
  portraitA: IndividualPortrait,
  portraitB: IndividualPortrait,
  partnerAName: string,
  partnerBName: string,
  combinedCycle: CombinedCycle,
  attachmentDynamic: AttachmentDynamic,
): CoupleAnchorSet {
  return {
    whenInTheCycle: buildCycleAnchors(combinedCycle),
    forPartnerA: buildPartnerAnchors(portraitA, partnerAName, combinedCycle.partnerAPosition),
    forPartnerB: buildPartnerAnchors(portraitB, partnerBName, combinedCycle.partnerBPosition),
    sharedTruths: buildSharedTruths(attachmentDynamic),
    repairStarters: buildRepairStarters(combinedCycle),
  };
}

function buildCycleAnchors(cycle: CombinedCycle): CoupleAnchor[] {
  const anchors: CoupleAnchor[] = [
    { text: 'This is our dance, not us. The cycle is happening, and we can see it.', context: 'When you notice the pattern activating' },
    { text: 'Underneath the cycle, we both want the same thing: to feel close and safe.', context: 'When conflict feels personal' },
    { text: 'We are not opponents. We are two nervous systems trying to find safety in the same room.', context: 'When the escalation feels out of control' },
  ];

  switch (cycle.dynamic) {
    case 'pursue-withdraw':
      anchors.push({ text: 'The reaching and the retreating are both expressions of caring — just in different languages.', context: 'When the dynamic feels unfair' });
      break;
    case 'mutual-pursuit':
      anchors.push({ text: 'We are both on fire right now. Somebody has to be the water first.', context: 'When both partners are escalated' });
      break;
    case 'mutual-withdrawal':
      anchors.push({ text: 'The silence between us is not peace. One of us needs to reach.', context: 'When distance has lasted too long' });
      break;
    case 'mixed-switching':
      anchors.push({ text: 'We are in different positions right now. Let me name mine.', context: 'When the dynamic feels confusing' });
      break;
  }

  return anchors;
}

function buildPartnerAnchors(portrait: IndividualPortrait, name: string, position: string): CoupleAnchor[] {
  const anchors: CoupleAnchor[] = [];

  if (position === 'pursuer') {
    anchors.push(
      { text: `${name}, your reaching is not too much. It is love in action. AND you can soften the approach.`, context: 'When you feel rejected for caring' },
      { text: 'What you need is valid. The urgency is your attachment system, not the truth of the moment.', context: 'When the need feels overwhelming' },
    );
  } else if (position === 'withdrawer') {
    anchors.push(
      { text: `${name}, your need for space is not abandonment. It is self-preservation. AND you can say "I am coming back."`, context: 'When you feel pressured' },
      { text: 'Staying present for one more minute is not weakness. It is courage.', context: 'When you want to leave the room' },
    );
  } else {
    anchors.push(
      { text: `${name}, you have range in how you show up. Use it. Name what position you are in right now.`, context: 'When the pattern feels confusing' },
      { text: 'Your flexibility is a strength. Trust it.', context: 'When you feel lost in the dynamic' },
    );
  }

  // Add anchor from their regulation capacity
  const regScore = portrait.compositeScores?.regulationScore ?? 50;
  if (regScore > 65) {
    anchors.push({ text: 'You have wide capacity for emotional intensity. Use it to hold space, not to avoid.', context: 'When your calm might seem like not caring' });
  } else {
    anchors.push({ text: 'Your window is narrower right now — that is okay. Take the pause you need and come back.', context: 'When you feel flooded' });
  }

  return anchors;
}

function buildSharedTruths(dynamic: AttachmentDynamic): CoupleAnchor[] {
  return [
    { text: 'We are both doing our best with the nervous systems we have.' },
    { text: 'Every pattern we have was built for a reason. We can honor the reason while outgrowing the pattern.' },
    { text: 'Repair is not about being perfect. It is about returning.' },
    { text: 'The fact that we are looking at this together means we have already begun.' },
    { text: 'We are not our worst moments. We are our willingness to try again.' },
  ];
}

function buildRepairStarters(cycle: CombinedCycle): string[] {
  const starters = [
    'I think our dance just happened. I do not want to stay stuck here. Can we talk about it?',
    'What I said came from the surface. What I really feel underneath is...',
    'I am sorry my part of the pattern showed up. Here is what I was really trying to say...',
    'Can we try a do-over? I want to turn toward you, not away.',
    'I am back in my window now. I want to hear what you were trying to tell me.',
  ];

  switch (cycle.dynamic) {
    case 'pursue-withdraw':
      starters.push('I reached too hard. Can I try again, more softly?');
      starters.push('I pulled away, and I am sorry. I am here now.');
      break;
    case 'mutual-pursuit':
      starters.push('We were both on fire. I am going to speak softly now.');
      break;
    case 'mutual-withdrawal':
      starters.push('We have been quiet for too long. I am breaking the silence because I miss you.');
      break;
    case 'mixed-switching':
      starters.push('I am not sure what position I was in. Can we sort it out together?');
      break;
  }

  return starters;
}

// ─── Portrait Intelligence Upgrade: Attachment-Based Couple Narratives ────────
//
// These are NEW functions added for the Portrait Intelligence Upgrade.
// They provide a richer, more personal couple narrative by weaving attachment
// patterns together — separate from the existing detailed CoupleNarrative above.

export type AttachmentCategory = 'anxious' | 'avoidant' | 'secure';

/** Classify a portrait's attachment category for narrative purposes */
export function classifyAttachmentCategory(portrait: IndividualPortrait): AttachmentCategory {
  const cs = portrait.compositeScores;
  if (typeof cs.anxietyNorm === 'number' && typeof cs.avoidanceNorm === 'number') {
    const anxiety = cs.anxietyNorm;
    const avoidance = cs.avoidanceNorm;
    if (anxiety > 55 && avoidance <= 55) return 'anxious';
    if (avoidance > 55 && anxiety <= 55) return 'avoidant';
    if (anxiety > 55 && avoidance > 55) return 'anxious'; // fearful — treat as anxious
    return 'secure';
  }
  // Fallback: use protective strategy text
  const strategy = portrait.fourLens?.attachment?.protectiveStrategy ?? '';
  if (/pursue|reach|anxious/i.test(strategy)) return 'anxious';
  if (/withdraw|distance|avoidant/i.test(strategy)) return 'avoidant';
  return 'secure';
}

/** Generate an opening paragraph based on the attachment pairing of both partners */
export function generateCoupleOpeningParagraph(
  p1Portrait: IndividualPortrait,
  p2Portrait: IndividualPortrait,
): string {
  const p1Style = classifyAttachmentCategory(p1Portrait);
  const p2Style = classifyAttachmentCategory(p2Portrait);
  const pair = `${p1Style}×${p2Style}`;

  switch (pair) {
    case 'anxious×anxious':
      return "Two hearts that reach for each other with the same urgency — you understand each other's longing, and that understanding is both your gift and your challenge.";
    case 'anxious×avoidant':
    case 'avoidant×anxious':
      return "One of you reaches, the other retreats — not because of different amounts of caring, but because of different nervous system strategies for the same fear.";
    case 'avoidant×avoidant':
      return "You've both built walls that work — until they don't. The space between you is quiet, but quiet isn't the same as peaceful.";
    case 'secure×anxious':
    case 'anxious×secure':
      return "One of you provides the ground, the other provides the urgency. When it works, it's beautiful — steady presence meeting passionate care.";
    case 'secure×avoidant':
    case 'avoidant×secure':
      return "One of you stays open, the other stays protected. Your work is in the quality of the invitations — and the patience to wait for the door to open from the inside.";
    case 'secure×secure':
      return "You have a foundation most couples build toward. Your edge is in depth — can you go from good to profound?";
    default:
      return "You bring different relational histories to this partnership. Understanding how your patterns interact is the beginning of something profound.";
  }
}

/** Generate a specific shared strength narrative (replaces generic "X is a shared strength") */
export function generateSharedStrengthNarrative(strengthType: string): string {
  const narratives: Record<string, string> = {
    'Emotional Intelligence': "You both carry strong emotional awareness — you can sense what the other is feeling, often before words arrive. The gift: deep understanding. The risk: you may both feel so much that regulation becomes the bottleneck.",
    'Conflict Flexibility': "Neither of you is locked into one conflict posture. You can yield, push, collaborate, or step back depending on what the moment requires. This range means you don't get trapped in the same fight over and over — you have options.",
    'Values Alignment': "You agree on what matters. This might sound simple, but it's the most underrated resource in a relationship — when values align, disagreements are about HOW, not WHY.",
    'Differentiation': "You can both be close without losing yourselves. This means conflict doesn't threaten your identity — you can disagree and still feel connected.",
    'Attachment Security': "The foundation is solid. You both operate from a place of basic trust — not perfection, but the belief that the other person is reliably there.",
  };
  return narratives[strengthType] ?? `You share real strength in ${strengthType.toLowerCase()} — this is a resource the relationship has built together.`;
}

/** Generate a couple "one thing" sentence based on attachment pairing */
export function generateCoupleOneThingSentence(p1Style: AttachmentCategory, p2Style: AttachmentCategory): string {
  const pair = `${p1Style}×${p2Style}`;
  switch (pair) {
    case 'anxious×avoidant':
    case 'avoidant×anxious':
      return "Your one invitation as a couple: the pursuer practices stillness. The withdrawer practices one step forward. Meet in the middle — literally.";
    case 'anxious×anxious':
      return "Your one invitation: take turns being the steady one. You can't both reach at the same time.";
    case 'avoidant×avoidant':
      return "Your one invitation: one of you has to go first. Vulnerability can't wait for the other person to be vulnerable first.";
    case 'secure×anxious':
    case 'anxious×secure':
      return "Your one invitation: the secure partner models stillness without withdrawing. The anxious partner practices trusting what's actually there.";
    default:
      return "Your one invitation: say the thing that's hardest to say. That's where the growth is.";
  }
}

// ─── Conflict Interaction Generator ────────────────────────────────────────────

export interface ConflictInteractionResult {
  type: string;
  narrative: string;
  practice: string;
}

/**
 * Generate conflict interaction analysis from each partner's primary DUTCH style.
 * p1Dutch and p2Dutch are the primaryStyle strings from DUTCHScores (e.g. "forcing", "avoiding").
 */
export function generateConflictInteraction(
  p1Dutch: string,
  p2Dutch: string,
): ConflictInteractionResult {
  const pair = `${p1Dutch}×${p2Dutch}`;

  switch (pair) {
    case 'forcing×avoiding':
    case 'avoiding×forcing':
      return {
        type: 'Escalation-Withdrawal',
        narrative: "When conflict arises, one of you pushes harder while the other pulls away. The pusher feels ignored, the withdrawer feels overwhelmed. Both are trying to regulate — just in opposite directions.",
        practice: "The pursuer practices softening the approach. The withdrawer practices staying in the room for 60 more seconds than feels comfortable.",
      };
    case 'forcing×forcing':
      return {
        type: 'Escalation-Escalation',
        narrative: "You both hold your ground fiercely. Conflicts are intense but rarely avoided. The risk isn't distance — it's damage. Things get said that are hard to un-say.",
        practice: "Agree on a pause signal. When either partner uses it, both stop for 20 minutes. No exceptions.",
      };
    case 'avoiding×avoiding':
      return {
        type: 'Mutual Withdrawal',
        narrative: "You both sidestep conflict. The surface stays calm but nothing gets resolved. Issues accumulate silently until something breaks through — usually at the worst possible moment.",
        practice: "Schedule a weekly 15-minute 'temperature check.' Not to solve anything — just to name what's been unsaid.",
      };
    case 'problemSolving×yielding':
    case 'yielding×problemSolving':
      return {
        type: 'Leader-Accommodator',
        narrative: "One of you drives toward solutions while the other goes along. The risk: the accommodator's real feelings go underground, and the problem-solver doesn't realize they're solving for one person, not two.",
        practice: "Before solving, the problem-solver asks: 'What do YOU need here?' The yielder practices answering honestly, even when it's uncomfortable.",
      };
    case 'compromising×compromising':
      return {
        type: 'Natural Negotiators',
        narrative: "You both instinctively look for middle ground. This is efficient and respectful — but watch for chronic 'good enough.' Sometimes the relationship needs one of you to say 'this matters too much to split the difference.'",
        practice: "Once a month, pick one issue where you DON'T compromise — where one person fully wins and the other fully supports.",
      };
    default:
      return {
        type: 'Mixed Strategies',
        narrative: "You bring different approaches to conflict. Neither is wrong — but they need translation. Your differences can become a resource if you understand what each style is protecting.",
        practice: "Before your next difficult conversation, each of you names your default: 'When things get hard, I tend to...' That naming alone shifts the dynamic.",
      };
  }
}
