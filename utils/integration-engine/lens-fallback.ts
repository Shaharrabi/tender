/**
 * Lens Fallback Generator
 * ────────────────────────────────────────────
 * When a legacy integration result has no `lenses`, this generates
 * 6 lens reframings from the existing body, arc, practice, and oneThing.
 *
 * This ensures the LensPicker always appears in the IntegrationPanel,
 * even for combinations that don't match Tier 1 or Tier 2 patterns.
 */

import type { IntegrationResult, LensedNarrative } from './types';

/**
 * Generate 6 lens narratives from a legacy IntegrationResult.
 * Uses the existing fields (body, arc, practice, oneThing) to
 * reframe the same insight through each lens perspective.
 */
export function generateFallbackLenses(result: IntegrationResult): LensedNarrative {
  const { body, arc, practice, oneThing } = result;

  // Soulful = the original body (Tender's default voice)
  const soulful = body;

  // Therapeutic = clinical framing with arc emphasis
  const therapeutic = [
    body,
    arc.wound ? `\nFrom a clinical perspective, the wound here is rooted in ${arc.wound.charAt(0).toLowerCase()}${arc.wound.slice(1)}` : '',
    `\nThe protective strategy — ${arc.protection.charAt(0).toLowerCase()}${arc.protection.slice(1)} — made developmental sense. But the cost in your current relationship is real: ${arc.cost.charAt(0).toLowerCase()}${arc.cost.slice(1)}`,
  ].filter(Boolean).join('');

  // Practical = action-focused, stripped to "do this"
  const practical = [
    `Here's what matters most: ${oneThing || arc.emergence}`,
    `\n\n${practice}`,
    `\n\nThe growth edge: ${arc.emergence}`,
  ].join('');

  // Developmental = where you are on the journey
  const developmental = [
    `Where you've been: ${arc.protection}`,
    `\n\nWhere you are: ${arc.cost}`,
    `\n\nWhere you're heading: ${arc.emergence}`,
    oneThing ? `\n\nThe invitation: ${oneThing}` : '',
  ].filter(Boolean).join('');

  // Relational = what your partner experiences
  const relational = [
    `When this pattern is active, your partner likely experiences: ${arc.cost}`,
    `\n\n${body.split('\n\n').slice(-1)[0] || body}`,
    `\n\nWhat your partner needs to know: this isn't about them. ${arc.protection}`,
    `\n\nWhat would help: ${practice}`,
  ].join('');

  // Simple = distilled essence, 2-4 lines
  const simple = [
    oneThing || arc.emergence,
    `\n\nThe pattern: ${result.title.toLowerCase()}.`,
    `The cost: ${arc.cost.split('.')[0].toLowerCase()}.`,
    `The invitation: ${arc.emergence.split('.')[0].toLowerCase()}.`,
  ].join(' ');

  return {
    therapeutic,
    soulful,
    practical,
    developmental,
    relational,
    simple,
  };
}
