/**
 * Integration Engine — Main Router
 * ────────────────────────────────────────────
 * Three-layer routing: Tier 1 patterns → Tier 2 combos → Legacy pairwise/triple/quad.
 *
 * Tier 1: Named clinical patterns (8 archetypes with full 6-lens treatment)
 * Tier 2: Priority pairwise combos (12 cross-domain combinations with branches)
 * Legacy: Existing single-voice pairwise/triple/quad integrations
 *
 * Usage:
 *   const result = generateIntegration(['foundation', 'navigation'], allScores);
 */

import type { IntegrationScores, IntegrationResult, DomainId } from './types';
export type { IntegrationScores, IntegrationResult, DomainId, DevelopmentalArc, IntegrationDepth, LensType, LensedNarrative, MatchedPractice } from './types';
export { DOMAIN_NAMES, DOMAIN_SCORE_KEY, LENS_META } from './types';
import { hasDomain, allDomainsAvailable } from './helpers';
import { getPairwiseIntegration } from './pairwise';
import { getTripleIntegration } from './triple';
import { getQuadIntegration } from './quad';
import { matchTier1Pattern } from './narratives/tier1-patterns';
import { matchTier2Combo } from './narratives/tier2-combos';
import { matchBoxCombination } from './narratives/box-combinations';
import { generateFallbackLenses } from './lens-fallback';

/**
 * Main entry point: generate an integration for the selected domains.
 *
 * Routing priority:
 * 1. Check Tier 1 named patterns (requires enough assessment data + domain overlap)
 * 1.5. Check box-level combinations (when individual cells are selected)
 * 2. For pairwise selections, check Tier 2 combos
 * 3. Fall back to legacy integration functions
 *
 * @param domains - 2-4 selected domain IDs
 * @param scores - All available assessment scores
 * @param selectedBoxes - Optional array of selected box keys (format: "domainId:CellLabel")
 * @returns IntegrationResult or null if the combination isn't supported
 */
export function generateIntegration(
  domains: DomainId[],
  scores: IntegrationScores,
  selectedBoxes?: string[],
): IntegrationResult | null {
  if (domains.length < 2 || domains.length > 4) return null;

  // Check all selected domains have data
  if (!allDomainsAvailable(scores, domains)) return null;

  // ── Layer 1: Check Tier 1 Named Patterns ──
  // Now respects selected domains — requires at least 2 domain overlap.
  const tier1 = matchTier1Pattern(scores, domains);
  if (tier1) return tier1;

  // ── Layer 1.5: Check Box-level Combinations ──
  // When individual cells are selected, check for specific subscale×subscale narratives.
  if (selectedBoxes && selectedBoxes.length >= 2) {
    const boxResult = matchBoxCombination(selectedBoxes, scores);
    if (boxResult) return boxResult;
  }

  // ── Layer 2: Check Tier 2 Pairwise Combos ──
  // When exactly 2 domains are selected, check for enhanced pairwise narratives
  // with 6-lens treatment before falling back to legacy.
  if (domains.length === 2) {
    const tier2 = matchTier2Combo(domains[0], domains[1], scores);
    if (tier2) return tier2;
  }

  // ── Layer 3: Legacy Integration Functions ──
  // These return results without lenses — we generate fallback lenses
  // so the LensPicker always appears for every combination.
  let legacyResult: IntegrationResult | null = null;
  switch (domains.length) {
    case 2:
      legacyResult = getPairwiseIntegration(domains[0], domains[1], scores);
      break;

    case 3:
      legacyResult = getTripleIntegration(
        domains as [DomainId, DomainId, DomainId],
        scores,
      );
      break;

    case 4:
      legacyResult = getQuadIntegration(
        domains as [DomainId, DomainId, DomainId, DomainId],
        scores,
      );
      break;

    default:
      return null;
  }

  // Add fallback lenses if the legacy result doesn't have them
  if (legacyResult && !legacyResult.lenses) {
    legacyResult.lenses = generateFallbackLenses(legacyResult);
  }

  return legacyResult;
}

/**
 * Check which domains have data available for integration.
 */
export function getAvailableDomains(scores: IntegrationScores): DomainId[] {
  const all: DomainId[] = [
    'foundation', 'instrument', 'navigation',
    'stance', 'conflict', 'compass', 'field',
  ];
  return all.filter(d => hasDomain(scores, d));
}

/**
 * Convert raw allScores (from fetchAllScores) into IntegrationScores format.
 */
export function toIntegrationScores(
  allScores: Record<string, { id: string; scores: any }>,
): IntegrationScores {
  return {
    ecrr: allScores['ecr-r']?.scores ?? undefined,
    ipip: allScores['ipip-neo-120']?.scores ?? undefined,
    sseit: allScores['sseit']?.scores ?? undefined,
    dsir: allScores['dsi-r']?.scores ?? undefined,
    dutch: allScores['dutch']?.scores ?? undefined,
    values: allScores['values']?.scores ?? undefined,
    rfas: allScores['relational-field']?.scores ?? undefined,
  };
}
