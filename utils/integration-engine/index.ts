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

/**
 * Main entry point: generate an integration for the selected domains.
 *
 * Routing priority:
 * 1. Check Tier 1 named patterns (requires enough assessment data)
 * 2. For pairwise selections, check Tier 2 combos
 * 3. Fall back to legacy integration functions
 *
 * @param domains - 2-4 selected domain IDs
 * @param scores - All available assessment scores
 * @returns IntegrationResult or null if the combination isn't supported
 */
export function generateIntegration(
  domains: DomainId[],
  scores: IntegrationScores,
): IntegrationResult | null {
  if (domains.length < 2 || domains.length > 4) return null;

  // Check all selected domains have data
  if (!allDomainsAvailable(scores, domains)) return null;

  // ── Layer 1: Check Tier 1 Named Patterns ──
  // These are cross-domain archetypes that fire based on score thresholds
  // regardless of which specific domains the user selected.
  const tier1 = matchTier1Pattern(scores);
  if (tier1) return tier1;

  // ── Layer 2: Check Tier 2 Pairwise Combos ──
  // When exactly 2 domains are selected, check for enhanced pairwise narratives
  // with 6-lens treatment before falling back to legacy.
  if (domains.length === 2) {
    const tier2 = matchTier2Combo(domains[0], domains[1], scores);
    if (tier2) return tier2;
  }

  // ── Layer 3: Legacy Integration Functions ──
  switch (domains.length) {
    case 2:
      return getPairwiseIntegration(domains[0], domains[1], scores);

    case 3:
      return getTripleIntegration(
        domains as [DomainId, DomainId, DomainId],
        scores,
      );

    case 4:
      return getQuadIntegration(
        domains as [DomainId, DomainId, DomainId, DomainId],
        scores,
      );

    default:
      return null;
  }
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
