/**
 * Growth Pulse — Visible portrait evolution at milestone steps.
 *
 * Shows ONE meaningful change in the user's portrait data or
 * practice completion patterns at milestone steps (4, 7, 10, 12).
 *
 * If no reassessment data exists, uses practice completions as
 * a proxy for growth awareness.
 */

import type { IndividualPortrait } from '@/types/portrait';

// ─── Types ──────────────────────────────────────────────

export interface GrowthPulse {
  /** Human-readable growth observation */
  message: string;
  /** Label for the card header */
  label: string;
  /** Milestone step where this appears */
  atStep: number;
}

// ─── Milestone Steps ────────────────────────────────────

const MILESTONE_STEPS = [4, 7, 10, 12];

// ─── Growth Edge Labels ─────────────────────────────────
// Maps portrait growth edges to human-readable domains

const GROWTH_EDGE_LABELS: Record<string, string> = {
  regulation: 'emotional regulation',
  vulnerability: 'vulnerability',
  conflict_repair: 'conflict repair',
  bid_response: 'responding to bids',
  attachment_security: 'attachment security',
  boundaries: 'boundaries',
  emotional_intelligence: 'emotional awareness',
  values_alignment: 'values clarity',
};

// ─── Main API ───────────────────────────────────────────

/**
 * Generate a growth pulse message for a milestone step.
 * Returns null if not a milestone step or insufficient data.
 */
export function getGrowthPulse(
  stepNumber: number,
  portrait: IndividualPortrait | null,
  practiceCount: number,
): GrowthPulse | null {
  if (!MILESTONE_STEPS.includes(stepNumber)) return null;

  // If we have a portrait, use growth edges for richer messaging
  if (portrait) {
    return buildPortraitPulse(stepNumber, portrait, practiceCount);
  }

  // Fallback: practice-based pulse (no portrait)
  if (practiceCount > 0) {
    return buildPracticePulse(stepNumber, practiceCount);
  }

  return null;
}

// ─── Builders ───────────────────────────────────────────

function buildPortraitPulse(
  stepNumber: number,
  portrait: IndividualPortrait,
  practiceCount: number,
): GrowthPulse {
  // Try to find the primary growth edge from portrait
  const growthEdges = (portrait as any)?.growthEdges ?? (portrait as any)?.growth_edges ?? [];
  const primaryEdge = growthEdges[0] ?? null;
  const edgeLabel = primaryEdge ? (GROWTH_EDGE_LABELS[primaryEdge] ?? primaryEdge) : null;

  if (stepNumber === 4) {
    return {
      atStep: 4,
      label: 'GROWTH PULSE',
      message: edgeLabel
        ? `You\'ve completed ${practiceCount} practice${practiceCount !== 1 ? 's' : ''} so far. Your portrait shows ${edgeLabel} as your growth edge — the very thing these first four steps have been building.`
        : `You\'ve completed ${practiceCount} practice${practiceCount !== 1 ? 's' : ''} in your first four steps. The self-awareness you\'re building here is the foundation for everything that follows.`,
    };
  }

  if (stepNumber === 7) {
    return {
      atStep: 7,
      label: 'GROWTH PULSE',
      message: edgeLabel
        ? `Seven steps in. You\'ve moved from naming the strain to inviting your partner closer. Your growth edge — ${edgeLabel} — is being strengthened with every practice you complete.`
        : `Seven steps in. You\'ve moved from naming the strain to inviting your partner closer. That shift didn\'t happen by accident — it\'s the work showing up.`,
    };
  }

  if (stepNumber === 10) {
    return {
      atStep: 10,
      label: 'GROWTH PULSE',
      message: edgeLabel
        ? `${practiceCount} practices completed. You\'ve built repair skills and now you\'re creating rituals. Your ${edgeLabel} has been deepening throughout this journey — keep going.`
        : `${practiceCount} practices completed. You\'ve built repair skills and now you\'re creating rituals. The consistency itself is the growth.`,
    };
  }

  // Step 12
  return {
    atStep: 12,
    label: 'YOUR JOURNEY',
    message: edgeLabel
      ? `You\'ve completed ${practiceCount} practices across all 12 steps. Your portrait\'s growth edge — ${edgeLabel} — was where you started. Look how far you\'ve come. This isn\'t an ending. It\'s how you live now.`
      : `You\'ve completed ${practiceCount} practices across all 12 steps. Every single one was a choice to show up for your relationship. This isn\'t an ending. It\'s how you live now.`,
  };
}

function buildPracticePulse(
  stepNumber: number,
  practiceCount: number,
): GrowthPulse {
  const practices = `${practiceCount} practice${practiceCount !== 1 ? 's' : ''}`;

  if (stepNumber === 4) {
    return {
      atStep: 4,
      label: 'GROWTH PULSE',
      message: `You\'ve completed ${practices} in your first four steps. That\'s not a number — it\'s evidence of your commitment to showing up differently.`,
    };
  }

  if (stepNumber === 7) {
    return {
      atStep: 7,
      label: 'GROWTH PULSE',
      message: `${practices} completed so far. You\'ve moved from seeing the pattern to inviting your partner in. That\'s real progress.`,
    };
  }

  if (stepNumber === 10) {
    return {
      atStep: 10,
      label: 'GROWTH PULSE',
      message: `${practices} completed. You\'re building rituals now — the structures that make growth sustainable. Keep going.`,
    };
  }

  return {
    atStep: 12,
    label: 'YOUR JOURNEY',
    message: `${practices} across all 12 steps. Every one was a choice. This isn\'t an ending — it\'s how you live now.`,
  };
}
