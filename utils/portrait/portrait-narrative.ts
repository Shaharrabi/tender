/**
 * Individual Portrait Narrative Generator
 *
 * Produces warm, theory-grounded, anti-shame narrative sections
 * for the Individual Portrait screen.
 *
 * Voice: "A wise therapist who has known you for years and sees your
 * patterns with compassion — not as flaws, but as adaptations."
 *
 * Language rules (matches couple-narrative.ts):
 * - Never say "score" or "assessment" — say "what we see," "the data suggests"
 * - No pathologizing — every pattern served a purpose
 * - Name the protection before the cost
 * - End with invitation, never prescription
 */

import type {
  IndividualPortrait,
  CompositeScores,
  AttachmentLens,
  PartsLens,
  RegulationLens,
  ValuesLens,
  NegativeCycle,
  GrowthEdge,
  AnchorPoints,
  FieldAwarenessLens,
} from '@/types/portrait';

// ─── Public Types ────────────────────────────────────────

export interface PortraitNarrative {
  /** Warm opening — who you are in relationships (2-3 sentences) */
  opening: string;
  /** Attachment + parts: your inner world */
  innerWorld: string;
  /** Regulation: your emotional landscape */
  emotionalLandscape: string;
  /** Values: what drives you */
  valuesPath: string;
  /** Negative cycle: your protective dance */
  protectiveDance: string;
  /** Growth edges: where you're growing */
  growthInvitation: string;
  /** Closing: warm send-off */
  closing: string;
}

// ─── Main Generator ──────────────────────────────────────

export function generatePortraitNarrative(
  portrait: IndividualPortrait,
): PortraitNarrative {
  const { fourLens, negativeCycle, growthEdges, compositeScores, anchorPoints } = portrait;

  return {
    opening: buildOpening(fourLens.attachment, compositeScores, negativeCycle),
    innerWorld: buildInnerWorld(fourLens.attachment, fourLens.parts),
    emotionalLandscape: buildEmotionalLandscape(fourLens.regulation, compositeScores, fourLens.fieldAwareness),
    valuesPath: buildValuesPath(fourLens.values),
    protectiveDance: buildProtectiveDance(negativeCycle),
    growthInvitation: buildGrowthInvitation(growthEdges),
    closing: buildClosing(anchorPoints, compositeScores),
  };
}

// ─── Opening ─────────────────────────────────────────────

function buildOpening(
  attachment: AttachmentLens,
  scores: CompositeScores,
  cycle: NegativeCycle,
): string {
  const securityLevel = scores.attachmentSecurity;
  const position = cycle.position;

  // Core orientation
  let orientation: string;
  if (securityLevel >= 70) {
    orientation = 'You come to relationships with a steady foundation — ' +
      'a capacity for closeness that didn\'t happen by accident. Somewhere along the way, ' +
      'you learned that connection is safe enough to lean into.';
  } else if (position === 'pursuer') {
    orientation = 'You come to relationships with deep feeling. ' +
      'Connection isn\'t something you take lightly — it matters to you, ' +
      'and when it feels at risk, you reach for it. That reaching ' +
      'is not a flaw; it\'s your heart saying "this matters."';
  } else if (position === 'withdrawer') {
    orientation = 'You come to relationships with a quiet depth that ' +
      'isn\'t always visible on the surface. You\'ve learned that ' +
      'some things are safer held close — and that instinct to protect ' +
      'your inner world has served you well.';
  } else {
    orientation = 'You come to relationships as someone who is still ' +
      'learning the dance between closeness and space. ' +
      'That flexibility — even when it feels uncertain — is actually ' +
      'a sign that you haven\'t settled for a rigid pattern.';
  }

  return orientation + ' Here\'s what we see in your relational portrait.';
}

// ─── Inner World (Attachment + Parts) ────────────────────

function buildInnerWorld(
  attachment: AttachmentLens,
  parts: PartsLens,
): string {
  const lines: string[] = [];

  // Protective strategy
  lines.push(
    attachment.protectiveStrategy
      ? `Your go-to protective strategy is ${attachment.protectiveStrategy.toLowerCase()}. ` +
        'This isn\'t something to fix — it\'s something your system learned for good reason.'
      : 'Your system has developed its own way of staying safe in relationships.'
  );

  // Emotional structure (EFT primary/secondary/longing)
  if (attachment.emotionalStructure) {
    const { primary, secondary, longing } = attachment.emotionalStructure;
    lines.push(
      `Underneath it all, what drives your reactions is often ${primary.toLowerCase()}. ` +
      `What shows on the surface tends to look more like ${secondary.toLowerCase()}. ` +
      `But what you\'re really reaching for? ${capitalize(longing)}.`
    );
  }

  // Parts
  if (parts.managerParts.length > 0) {
    const managers = parts.managerParts.slice(0, 2).join(' and ');
    lines.push(
      `Part of you works hard to keep things together — the part that shows up as ${managers.toLowerCase()}. ` +
      'These inner managers are doing their best to keep you safe.'
    );
  }

  if (parts.firefighterParts.length > 0) {
    const firefighters = parts.firefighterParts.slice(0, 2).join(' and ');
    lines.push(
      `When things get overwhelming, you might notice ${firefighters.toLowerCase()} kicking in. ` +
      'These are emergency responses — not character flaws.'
    );
  }

  return lines.join(' ');
}

// ─── Emotional Landscape (Regulation) ────────────────────

function buildEmotionalLandscape(
  regulation: RegulationLens,
  scores: CompositeScores,
  fieldAwareness?: FieldAwarenessLens,
): string {
  const lines: string[] = [];
  const windowWidth = scores.windowWidth;

  // Window of tolerance
  if (windowWidth >= 70) {
    lines.push(
      'Your emotional window is relatively wide — you can hold quite a bit ' +
      'of intensity before your system goes into overdrive or shutdown. ' +
      'That\'s a real strength.'
    );
  } else if (windowWidth >= 40) {
    lines.push(
      'Your emotional window has some range, though there are moments ' +
      'when things get too intense too fast. That\'s not a weakness — ' +
      'it just means your nervous system is still calibrating.'
    );
  } else {
    lines.push(
      'Your emotional window is narrower than average, which means ' +
      'your system gets activated quickly. This often comes from ' +
      'early experiences where you needed to be vigilant. ' +
      'The good news: windows can widen with practice.'
    );
  }

  // Regulation toolkit
  if (regulation.regulationToolkit) {
    const strengths = regulation.regulationToolkit.strengths;
    if (strengths.length > 0) {
      lines.push(
        `What\'s already working for you: ${strengths.slice(0, 2).join(' and ').toLowerCase()}. ` +
        'These are your built-in resources.'
      );
    }
  }

  // Co-regulation pattern
  if (regulation.coRegulationPattern) {
    const coReg = regulation.coRegulationPattern;
    if (coReg.style === 'co-regulator') {
      lines.push(
        'You tend to be the one helping others calm down. ' +
        'That\'s a gift — but make sure you\'re not doing it at the expense of your own needs.'
      );
    } else if (coReg.style === 'needs-co-regulation') {
      lines.push(
        'You tend to regulate best in the presence of someone safe. ' +
        'There\'s nothing wrong with that — we\'re wired for co-regulation.'
      );
    }
  }

  // Field awareness
  if (fieldAwareness && fieldAwareness.fieldSensitivity >= 4) {
    lines.push(
      'You have a notable sensitivity to the emotional field between people — ' +
      'you pick up on the unspoken currents in a room. This awareness ' +
      'is a relational superpower when you learn to trust it without being overwhelmed by it.'
    );
  }

  return lines.join(' ');
}

// ─── Values Path ─────────────────────────────────────────

function buildValuesPath(values: ValuesLens): string {
  const lines: string[] = [];

  // Core values
  if (values.coreValues.length > 0) {
    const topValues = values.coreValues.slice(0, 3).join(', ');
    lines.push(
      `At your core, you\'re guided by ${topValues.toLowerCase()}. ` +
      'These aren\'t just abstract ideals — they shape how you show up, ' +
      'what you fight for, and what hurts when it\'s missing.'
    );
  }

  // Values-behavior gaps
  if (values.significantGaps.length > 0) {
    const biggestGap = values.significantGaps[0];
    lines.push(
      `One place where there\'s a gap between who you want to be and ` +
      `how you\'re currently living is around ${biggestGap.value.toLowerCase()}. ` +
      'That gap isn\'t failure — it\'s awareness. And awareness is the first step.'
    );
  }

  // Qualitative insights
  if (values.qualitativeInsights) {
    if (values.qualitativeInsights.partnerIdentity) {
      lines.push(`As a partner, you see yourself as ${values.qualitativeInsights.partnerIdentity.toLowerCase()}.`);
    }
    if (values.qualitativeInsights.aspirationalVision) {
      lines.push(
        `And the version of yourself you\'re growing toward? ` +
        `${capitalize(values.qualitativeInsights.aspirationalVision)}.`
      );
    }
  }

  return lines.join(' ');
}

// ─── Protective Dance (Negative Cycle) ──────────────────

function buildProtectiveDance(cycle: NegativeCycle): string {
  const lines: string[] = [];

  // Position description
  const positionMap: Record<string, string> = {
    pursuer: 'When things get tense, you tend to move toward — asking questions, ' +
      'seeking reassurance, sometimes pushing harder when you feel your partner pulling away. ' +
      'This isn\'t "too much." It\'s your way of fighting for the connection.',
    withdrawer: 'When things get tense, your instinct is to pull back — to go quiet, ' +
      'to need space, to process internally before engaging. ' +
      'This isn\'t avoidance. It\'s your system\'s way of preventing things from escalating.',
    mixed: 'Your dance shifts depending on the situation — sometimes you reach for connection, ' +
      'other times you pull back to protect yourself. This flexibility means you\'re ' +
      'reading each moment, not running a script.',
    flexible: 'You don\'t have a locked-in position in conflict. You can approach or step back ' +
      'depending on what the situation calls for. That adaptability is rare.',
  };

  lines.push(positionMap[cycle.position] || cycle.description);

  // Triggers
  if (cycle.primaryTriggers.length > 0) {
    const triggers = cycle.primaryTriggers.slice(0, 2).join(' or ');
    lines.push(
      `The moments that tend to activate this pattern for you involve ${triggers.toLowerCase()}.`
    );
  }

  // De-escalators
  if (cycle.deEscalators.length > 0) {
    const deesc = cycle.deEscalators[0];
    lines.push(
      `What helps you come back to center: ${deesc.toLowerCase()}.`
    );
  }

  // Repair readiness
  if (cycle.repairReadiness) {
    const { canMakeRepair, canReceiveRepair } = cycle.repairReadiness;
    if (canMakeRepair >= 70 && canReceiveRepair >= 70) {
      lines.push('You have a strong capacity for both offering and receiving repair — that\'s relational gold.');
    } else if (canMakeRepair >= 60) {
      lines.push('You\'re naturally inclined to initiate repair after ruptures. That courage matters.');
    } else if (canReceiveRepair >= 60) {
      lines.push('You\'re open to receiving repair attempts, even when you\'re hurt. That takes real trust.');
    }
  }

  return lines.join(' ');
}

// ─── Growth Invitation ──────────────────────────────────

function buildGrowthInvitation(edges: GrowthEdge[]): string {
  if (edges.length === 0) {
    return 'Growth isn\'t about fixing what\'s broken — it\'s about expanding what\'s possible.';
  }

  const lines: string[] = [];
  const topEdges = edges.slice(0, 3);

  lines.push(
    'Here\'s where the most meaningful growth might happen for you:'
  );

  for (const edge of topEdges) {
    lines.push(
      `${edge.title}: ${edge.description}`
    );
  }

  lines.push(
    'None of these are urgent — they\'re invitations. ' +
    'Pick the one that resonates most and start there.'
  );

  return lines.join('\n\n');
}

// ─── Closing ─────────────────────────────────────────────

function buildClosing(
  anchors: AnchorPoints,
  scores: CompositeScores,
): string {
  const lines: string[] = [];

  // Self-compassion message
  if (anchors.selfCompassion?.personalizedMessage) {
    lines.push(anchors.selfCompassion.personalizedMessage);
  }

  // Warm closing
  const regulationScore = scores.regulationScore;
  if (regulationScore >= 70) {
    lines.push(
      'You have more resources than you think. The patterns in this portrait ' +
      'aren\'t a diagnosis — they\'re a map. And you already know much of the territory.'
    );
  } else {
    lines.push(
      'This portrait isn\'t the whole story of who you are — it\'s a snapshot ' +
      'of where you are right now. And where you are right now is a perfectly ' +
      'valid place to start.'
    );
  }

  lines.push(
    'The fact that you\'re here, looking honestly at your patterns, ' +
    'already says something important about the kind of partner you\'re becoming.'
  );

  return lines.join(' ');
}

// ─── Helpers ─────────────────────────────────────────────

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
