/**
 * Overview Snapshot Generator
 *
 * Produces a concise, warm narrative for the couple portal Overview tab
 * — grounded in relational field vitality and shared strengths.
 *
 * Voice: Warm, honest, grounded. Not clinical, not saccharine.
 *
 * Rules:
 * - Never say "score," "assessment," or "data"
 * - Never pathologize — every pattern served a purpose
 * - Name what is beautiful before what is hard
 * - 2–4 sentences, personalized with names
 * - Should feel like an honest check-in from someone who truly sees the relationship
 */

import type { DeepCouplePortrait } from '@/types/couples';

// ─── Vitality-Based Opening ──────────────────────────────

function vitalityOpening(vitality: number, nameA: string, nameB: string): string {
  if (vitality > 75) {
    return `The relational field between ${nameA} and ${nameB} is in a strong, vibrant range — there is genuine warmth, investment, and aliveness here.`;
  }
  if (vitality > 55) {
    return `The relational field between ${nameA} and ${nameB} is in a positive range — there is genuine warmth and investment here, a steady foundation to build on.`;
  }
  if (vitality > 35) {
    return `The relational field between ${nameA} and ${nameB} is in a tender range — there is care here, and also an invitation to tend to what needs attention.`;
  }
  return `The relational field between ${nameA} and ${nameB} is asking for attention — not because something is broken, but because something is ready to grow.`;
}

// ─── Strength Weaving ──────────────────────────────────────

function strengthSentence(strengths: { dimensionLabel: string }[]): string {
  if (strengths.length === 0) return '';
  const labels = strengths.slice(0, 2).map(s => s.dimensionLabel.toLowerCase());
  if (labels.length === 1) {
    return `A shared strength in ${labels[0]} anchors your connection — something you have built together, even when things were hard.`;
  }
  return `Shared strengths in ${labels[0]} and ${labels[1]} form a real foundation — one that didn't happen by accident.`;
}

// ─── Growth Edge ─────────────────────────────────────────

function edgeSentence(edges: { title: string }[]): string {
  if (edges.length === 0) return '';
  return `The growing edge? ${edges[0].title} — not a problem to solve, but an invitation to keep becoming.`;
}

// ─── Main Generator ────────────────────────────────────────

export function generateOverviewSnapshot(dp: DeepCouplePortrait): string {
  try {
    const nameA = dp?.partnerAName || 'Partner A';
    const nameB = dp?.partnerBName || 'Partner B';

    const parts: string[] = [];

    // 1. Vitality-based opening — the centerpiece
    const vitality = dp?.relationalField?.vitality ?? 50;
    parts.push(vitalityOpening(vitality, nameA, nameB));

    // 2. Shared strengths
    const strengths = dp?.convergenceDivergence?.sharedStrengths;
    if (strengths) {
      const strength = strengthSentence(strengths);
      if (strength) parts.push(strength);
    }

    // 3. Growth edge
    const edges = dp?.coupleGrowthEdges;
    if (edges) {
      const edge = edgeSentence(edges);
      if (edge) parts.push(edge);
    }

    return parts.join(' ');
  } catch (e) {
    console.warn('[overviewSnapshot] Error generating snapshot:', e);
    return 'Your couple portrait is being woven together...';
  }
}
