import type {
  ValuesScores,
  DetectedPattern,
  ValuesLens,
  QualitativeInsights,
  ECRRScores,
} from '@/types';
import { VALUE_DOMAINS } from '@/utils/assessments/configs/values';
import { tailorNarrative, buildTailoringContext } from './attachment-tailoring';

/**
 * Lens 4: Values & Becoming
 * What matters most and where the gaps live.
 *
 * Enhanced in Sprint 4:
 *   - willingnessRequirements: what discomfort you must tolerate for growth
 *   - qualitativeInsights: who you are as a partner + aspirational vision
 */
export function analyzeValuesBecoming(
  values: ValuesScores,
  patterns: DetectedPattern[],
  ecrr?: ECRRScores
): ValuesLens {
  const coreValues = getCoreValues(values);
  const significantGaps = getSignificantGaps(values);
  const developmentalInvitations = getDevelopmentalInvitations(values, patterns);
  const rawNarrative = buildValuesNarrative(values, coreValues, significantGaps);

  // Apply attachment tailoring if ECR-R data available
  const narrative = ecrr
    ? tailorNarrative(
        rawNarrative,
        buildTailoringContext(ecrr.attachmentStyle, ecrr.anxietyScore, ecrr.avoidanceScore),
        'values'
      )
    : rawNarrative;

  const willingnessRequirements = buildWillingnessRequirements(values, significantGaps, ecrr);
  const qualitativeInsights = buildQualitativeInsights(values, coreValues, significantGaps, ecrr);

  return {
    narrative,
    coreValues,
    significantGaps,
    developmentalInvitations,
    willingnessRequirements,
    qualitativeInsights,
  };
}

// ─── Core Values ─────────────────────────────────────────

function getCoreValues(values: ValuesScores): string[] {
  // Use top5 ranking if available, otherwise derive from importance ratings
  if (values.top5Values.length > 0) {
    return values.top5Values.map((id) => {
      const domain = VALUE_DOMAINS.find((d) => d.id === id);
      return domain?.label ?? id;
    });
  }

  // Fallback: top 5 by importance score
  return Object.entries(values.domainScores)
    .sort(([, a], [, b]) => b.importance - a.importance)
    .slice(0, 5)
    .map(([id]) => {
      const domain = VALUE_DOMAINS.find((d) => d.id === id);
      return domain?.label ?? id;
    });
}

// ─── Significant Gaps ────────────────────────────────────

function getSignificantGaps(
  values: ValuesScores
): Array<{ value: string; gap: number; importance: number }> {
  return Object.entries(values.domainScores)
    .filter(([, d]) => d.importance >= 7 && d.gap >= 3)
    .sort(([, a], [, b]) => b.gap - a.gap)
    .map(([id, d]) => {
      const domain = VALUE_DOMAINS.find((dom) => dom.id === id);
      return {
        value: domain?.label ?? id,
        gap: d.gap,
        importance: d.importance,
      };
    });
}

// ─── Developmental Invitations ───────────────────────────

function getDevelopmentalInvitations(
  values: ValuesScores,
  patterns: DetectedPattern[]
): string[] {
  const invitations: string[] = [];

  // From high-gap domains
  for (const domainId of values.highGapDomains.slice(0, 2)) {
    const inv = GAP_INVITATIONS[domainId];
    if (inv) invitations.push(inv);
  }

  // From values-behavior patterns
  for (const p of patterns) {
    if (p.category === 'values-behavior') {
      const inv = PATTERN_INVITATIONS[p.id];
      if (inv) invitations.push(inv);
    }
  }

  // From avoidance tendency
  if (values.avoidanceTendency > 0.3) {
    invitations.push(
      'Practice staying present in difficult moments instead of ' +
      'defaulting to avoidance — even briefly.'
    );
  }

  return invitations.slice(0, 4); // max 4
}

// ─── Narrative ───────────────────────────────────────────

function buildValuesNarrative(
  values: ValuesScores,
  coreValues: string[],
  gaps: Array<{ value: string; gap: number; importance: number }>
): string {
  let narrative =
    `Your most important values are ${formatList(coreValues)}. ` +
    'These represent who you want to be as a partner — your compass ' +
    'for how to show up in your relationship.';

  if (gaps.length > 0) {
    const topGap = gaps[0];
    narrative +=
      ` However, there is a meaningful gap between how much you value ` +
      `${topGap.value} (${topGap.importance}/10) and how fully you are ` +
      `currently living it (gap of ${topGap.gap.toFixed(1)} points). ` +
      'This gap can create internal tension and dissatisfaction.';

    if (gaps.length > 1) {
      narrative +=
        ` You also have gaps in ${gaps.slice(1).map((g) => g.value).join(' and ')}.`;
    }
  } else {
    narrative +=
      ' Encouragingly, you are generally living in alignment with ' +
      'your values — the gap between what matters and what you do is small.';
  }

  if (values.avoidanceTendency > 0.3) {
    narrative +=
      ' In your scenario responses, a pattern of avoidance emerged — ' +
      'you may default to sidestepping difficult situations rather than ' +
      'engaging with them directly.';
  }

  if (values.balancedTendency > 0.5) {
    narrative +=
      ' Your scenario responses show a thoughtful, balanced approach — ' +
      'you tend to seek middle ground rather than defaulting to extremes.';
  }

  return narrative;
}

// ─── Helpers ─────────────────────────────────────────────

function formatList(items: string[]): string {
  if (items.length <= 2) return items.join(' and ');
  return items.slice(0, -1).join(', ') + ', and ' + items[items.length - 1];
}

const GAP_INVITATIONS: Record<string, string> = {
  intimacy:
    'Practice one act of vulnerability per week — share something you normally keep inside.',
  honesty:
    'Start with low-stakes truth-telling. Say one thing you would normally edit out.',
  growth:
    'Choose one area of personal growth and take a small, concrete step this week.',
  security:
    'Build reliability through small, consistent follow-through on commitments.',
  adventure:
    'Introduce one new experience this month — even something small breaks the routine.',
  independence:
    'Carve out dedicated time for something that is just yours — no guilt.',
  family:
    'Have one conversation about your shared vision for family or legacy.',
  service:
    'Find one way to contribute together — shared purpose strengthens bonds.',
  playfulness:
    'Protect time for fun. Laughter and lightness are not luxuries — they are nutrients.',
  spirituality:
    'Explore what gives your relationship meaning beyond the day-to-day.',
};

const PATTERN_INVITATIONS: Record<string, string> = {
  values_honesty_avoids_conflict:
    'Your growth edge is learning to speak difficult truths with care — ' +
    'the cost of silence is higher than you think.',
  values_intimacy_avoids_closeness:
    'Practice tolerating closeness in small doses — your longing for ' +
    'connection is real, even when your system says "retreat."',
  values_autonomy_but_fused:
    'Reclaim small acts of independence — knowing where you end and ' +
    'your partner begins is the foundation of healthy connection.',
  values_growth_resists_change:
    'Start with micro-changes. Your aspiration for growth is genuine; ' +
    'your system just needs the changes to be small enough to feel safe.',
};

// ─── Willingness Requirements ───────────────────────────

function buildWillingnessRequirements(
  values: ValuesScores,
  gaps: Array<{ value: string; gap: number; importance: number }>,
  ecrr?: ECRRScores
): string[] {
  const reqs: string[] = [];

  // From significant gaps — each gap requires tolerating specific discomfort
  for (const gap of gaps.slice(0, 2)) {
    const req = WILLINGNESS_MAP[gap.value.toLowerCase()];
    if (req) reqs.push(req);
  }

  // From avoidance tendency
  if (values.avoidanceTendency > 0.3) {
    reqs.push(
      'Willingness to sit with discomfort instead of solving, fixing, or fleeing — ' +
      'the discomfort IS the growth.'
    );
  }

  // From attachment style
  if (ecrr) {
    if (ecrr.anxietyScore > 4.0) {
      reqs.push(
        'Willingness to tolerate uncertainty without seeking immediate reassurance — ' +
        'your partner cannot always be your emotional regulator.'
      );
    }
    if (ecrr.avoidanceScore > 4.0) {
      reqs.push(
        'Willingness to stay present when emotions rise instead of retreating — ' +
        'connection requires being seen in your vulnerability.'
      );
    }
  }

  // From balanced tendency (high balanced can mean conflict-avoidant middle-groundism)
  if (values.balancedTendency > 0.6) {
    reqs.push(
      'Willingness to take a clear position even when middle ground feels safer — ' +
      'sometimes compromise means nobody gets what they actually need.'
    );
  }

  if (reqs.length === 0) {
    reqs.push(
      'Willingness to keep showing up honestly, even when it costs comfort — ' +
      'growth always happens at the edge of what feels easy.'
    );
  }

  return reqs.slice(0, 3); // max 3
}

const WILLINGNESS_MAP: Record<string, string> = {
  intimacy:
    'Willingness to be seen — fully, imperfectly — without controlling how your partner receives you.',
  honesty:
    'Willingness to speak the difficult truth, even when silence feels safer and the outcome is uncertain.',
  growth:
    'Willingness to be a beginner again — to not know, to stumble, to learn in front of someone who matters.',
  security:
    'Willingness to follow through consistently, even when motivation fades — reliability is built in the boring moments.',
  adventure:
    'Willingness to release control and step into the unknown, even when routine feels like safety.',
  independence:
    'Willingness to assert your separate self, even when it risks temporary disconnection from your partner.',
  family:
    'Willingness to have the conversations you have been avoiding about what you each truly want for your future.',
  service:
    'Willingness to give without keeping score and to receive without feeling indebted.',
  playfulness:
    'Willingness to be silly, unproductive, and light — even when your inner taskmaster says there is work to do.',
  spirituality:
    'Willingness to explore meaning together, even when your worldviews do not perfectly align.',
};

// ─── Qualitative Insights ───────────────────────────────

function buildQualitativeInsights(
  values: ValuesScores,
  coreValues: string[],
  gaps: Array<{ value: string; gap: number; importance: number }>,
  ecrr?: ECRRScores
): QualitativeInsights {
  const partnerIdentity = buildPartnerIdentity(values, coreValues, ecrr);
  const nonNegotiables = buildNonNegotiables(values);
  const aspirationalVision = buildAspirationalVision(values, coreValues, gaps, ecrr);

  return { partnerIdentity, nonNegotiables, aspirationalVision };
}

function buildPartnerIdentity(
  values: ValuesScores,
  coreValues: string[],
  ecrr?: ECRRScores
): string {
  const top2 = coreValues.slice(0, 2);
  let identity = `At your core, you are a partner who values ${formatList(top2)} above all else. `;

  // Add character from values profile
  const hasIntimacy = values.domainScores.intimacy?.importance >= 8;
  const hasHonesty = values.domainScores.honesty?.importance >= 8;
  const hasGrowth = values.domainScores.growth?.importance >= 8;
  const hasIndependence = values.domainScores.independence?.importance >= 7;

  if (hasIntimacy && hasHonesty) {
    identity += 'You want a relationship built on deep connection AND radical honesty — ' +
      'you believe real love requires both.';
  } else if (hasIntimacy) {
    identity += 'You are driven by a deep desire for closeness and emotional connection — ' +
      'surface-level relating will never be enough for you.';
  } else if (hasGrowth && hasIndependence) {
    identity += 'You are a partner who brings both a growth mindset and a strong sense of self — ' +
      'you want to evolve together while maintaining who you each are.';
  } else if (hasGrowth) {
    identity += 'You see your relationship as a place to become your best self — ' +
      'stagnation is more threatening to you than conflict.';
  } else {
    identity += `These values shape how you show up in conflict, intimacy, and everyday moments.`;
  }

  return identity;
}

function buildNonNegotiables(values: ValuesScores): string[] {
  // Non-negotiables = values with importance >= 9
  const nonNegs: string[] = [];
  const entries = Object.entries(values.domainScores)
    .filter(([, d]) => d.importance >= 9)
    .sort(([, a], [, b]) => b.importance - a.importance);

  for (const [id, d] of entries.slice(0, 3)) {
    const domain = VALUE_DOMAINS.find((dom) => dom.id === id);
    const label = domain?.label ?? id;
    nonNegs.push(`${label} (${d.importance}/10) — this is non-negotiable for you`);
  }

  if (nonNegs.length === 0) {
    // No extreme values — note the flexibility
    nonNegs.push('You have no values rated at 9-10, suggesting flexibility in what you prioritize');
  }

  return nonNegs;
}

function buildAspirationalVision(
  values: ValuesScores,
  coreValues: string[],
  gaps: Array<{ value: string; gap: number; importance: number }>,
  ecrr?: ECRRScores
): string {
  if (gaps.length === 0) {
    return `You are becoming the partner you already aspire to be — someone anchored in ` +
      `${formatList(coreValues.slice(0, 3))}. The work now is deepening what you already do well.`;
  }

  const topGap = gaps[0];
  let vision = `You are becoming a partner who lives ${topGap.value.toLowerCase()} more fully. `;

  // Attachment-specific aspirational tone
  if (ecrr) {
    if (ecrr.attachmentStyle === 'anxious-preoccupied') {
      vision += 'For you, this means learning to trust that you are enough — ' +
        'that your love does not need to be earned through vigilance and effort. ' +
        'The version of you that can rest in connection is already emerging.';
    } else if (ecrr.attachmentStyle === 'dismissive-avoidant') {
      vision += 'For you, this means allowing yourself to need and be needed — ' +
        'not as weakness but as courage. The version of you that lets someone in ' +
        'all the way is already there, behind the walls.';
    } else if (ecrr.attachmentStyle === 'fearful-avoidant') {
      vision += 'For you, this means learning that safety and closeness can coexist — ' +
        'that you do not have to choose between protecting yourself and loving fully. ' +
        'Each day you stay present is proof that you are rewriting the story.';
    } else {
      vision += 'Your foundation is strong. The invitation is to go deeper — ' +
        'to close the gap between your aspirations and your daily actions, ' +
        'one small choice at a time.';
    }
  } else {
    vision += 'Each step toward closing this gap brings you closer to the partner ' +
      'you already aspire to be.';
  }

  return vision;
}
