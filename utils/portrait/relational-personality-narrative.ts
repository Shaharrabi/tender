/**
 * Relational Personality Narrative Generator
 *
 * Compares backbone personality (general) with relational personality (in-relationship).
 * When they differ by >15 percentile points, generates a narrative about how
 * the relationship activates a different version of the person.
 *
 * This is Tender's unique insight: "Your partner brings out a different you."
 */

import type { IPIPScores } from '@/types';

interface RelationalShift {
  domain: string;
  domainLabel: string;
  backbone: number;
  relational: number;
  delta: number;        // positive = higher in relationship
  narrative: string;
}

// ─── Domain metadata ─────────────────────────────────────

const DOMAIN_META: Record<string, { label: string; letterKey: string }> = {
  neuroticism:       { label: 'Emotional Sensitivity', letterKey: 'N_rel' },
  extraversion:      { label: 'Social Energy',         letterKey: 'E_rel' },
  agreeableness:     { label: 'Cooperativeness',       letterKey: 'A_rel' },
  conscientiousness: { label: 'Follow-Through',        letterKey: 'C_rel' },
  openness:          { label: 'Openness',              letterKey: 'O_rel' },
};

// ─── Narrative templates (high/low × domain) ─────────────

function getNarrative(domain: string, backbone: number, relational: number): string {
  const higher = relational > backbone;

  switch (domain) {
    case 'extraversion':
      return higher
        ? "You're generally reserved, but in your relationship you come alive as the initiator — your partner draws out a social energy the world rarely sees."
        : "You're socially energetic in most of life, but in your relationship you pull back — the intimacy zone is where you go quiet. This isn't withdrawal; it may be where you finally rest.";

    case 'agreeableness':
      return higher
        ? "You hold firmer boundaries with most people, but with your partner you soften — the relationship feels safe enough to let your guard down and give more freely."
        : "You're generous and accommodating with most people, but with your partner you hold a firmer line — the intimacy gives you permission to have edges.";

    case 'neuroticism':
      return higher
        ? "Your emotional sensitivity runs high in general, but in your relationship it amplifies — your partner's mood has more power over your nervous system than anyone else's."
        : "You carry a lot of emotional intensity in the world, but your relationship steadies you — your partner's presence calms something that otherwise stays activated.";

    case 'conscientiousness':
      return higher
        ? "You're more relaxed about follow-through in most of life, but in your relationship you step up — the commitment matters enough to organize around."
        : "You're organized and disciplined in most of life, but let things slide in your relationship — the intimacy zone may be where your control relaxes, for better or worse.";

    case 'openness':
      return higher
        ? "You tend toward the conventional in most of life, but your relationship opens you to new experiences — your partner expands your world in ways you wouldn't seek alone."
        : "You're curious and open in most of life, but in your relationship you resist novelty — the familiar patterns feel safer when the stakes are this high.";

    default:
      return '';
  }
}

// ─── Main generator ──────────────────────────────────────

const THRESHOLD = 15; // minimum percentile-point difference to generate narrative

export function generateRelationalPersonalityNarrative(
  personalityScores: IPIPScores,
): RelationalShift[] {
  const relPers = (personalityScores as any)?.relationalPersonality as Record<string, number> | undefined;
  const domainPcts = personalityScores?.domainPercentiles;

  // No relational personality data — return empty (pre-expansion assessments)
  if (!relPers || !domainPcts) return [];

  const shifts: RelationalShift[] = [];

  for (const [domain, meta] of Object.entries(DOMAIN_META)) {
    const backbone = domainPcts[domain];
    const relational = relPers[meta.letterKey];

    if (backbone == null || relational == null) continue;

    const delta = relational - backbone;
    if (Math.abs(delta) <= THRESHOLD) continue;

    const narrative = getNarrative(domain, backbone, relational);
    if (!narrative) continue;

    shifts.push({
      domain,
      domainLabel: meta.label,
      backbone,
      relational,
      delta,
      narrative,
    });
  }

  // Sort by absolute delta descending — biggest shifts first
  shifts.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));

  return shifts;
}
