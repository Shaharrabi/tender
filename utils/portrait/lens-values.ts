import type {
  ValuesScores,
  DetectedPattern,
  ValuesLens,
} from '@/types';
import { VALUE_DOMAINS } from '@/utils/assessments/configs/values';

/**
 * Lens 4: Values & Becoming
 * What matters most and where the gaps live.
 */
export function analyzeValuesBecoming(
  values: ValuesScores,
  patterns: DetectedPattern[]
): ValuesLens {
  const coreValues = getCoreValues(values);
  const significantGaps = getSignificantGaps(values);
  const developmentalInvitations = getDevelopmentalInvitations(values, patterns);
  const narrative = buildValuesNarrative(values, coreValues, significantGaps);

  return { narrative, coreValues, significantGaps, developmentalInvitations };
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
