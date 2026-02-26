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
    opening: buildOpening(partnerAName, partnerBName, combinedCycle.dynamic),
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

function buildOpening(nameA: string, nameB: string, dynamic: CycleDynamic): string {
  const dynamicDescriptions: Record<CycleDynamic, string> = {
    'pursue-withdraw': 'One of you reaches while the other retreats — not because you do not care, but because you both care deeply and protect differently.',
    'mutual-pursuit': 'You both move toward each other with intensity — two people who refuse to let disconnection go unnamed.',
    'mutual-withdrawal': 'You both tend to give each other space — two people who value autonomy and have built a quiet, steady partnership.',
    'mixed-switching': 'Your dance changes depending on the moment — you have more flexibility than most couples, even when it feels confusing.',
  };

  return `What you are about to read is not a diagnosis. It is a map — a way of seeing the invisible architecture of your relationship. Everything here comes from what ${nameA} and ${nameB} shared about themselves and each other, processed through frameworks used by the world's leading couples researchers. ${dynamicDescriptions[dynamic]} This portrait holds the whole picture: your strengths, your struggles, and the growth edges where your relationship is asking to evolve.`;
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
  return `This portrait is a snapshot, not a sentence. What you see here will shift as you grow, as you practice, as you repair. The fact that ${nameA} and ${nameB} are reading this together says something important: you are both willing to look. That willingness — the courage to see yourselves and each other clearly — is the single strongest predictor of relationship growth. Not perfection. Not compatibility scores. Willingness. You have it. Now use it.`;
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
  const regScore = portrait.compositeScores.regulationScore ?? 50;
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
