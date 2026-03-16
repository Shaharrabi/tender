/**
 * Integration Engine — Main Router
 * ────────────────────────────────────────────
 * Accepts 2-4 selected domain IDs + assessment scores,
 * routes to the appropriate integration function,
 * and returns the integration result.
 *
 * Usage:
 *   const result = generateIntegration(['foundation', 'navigation'], allScores);
 */

import type { IntegrationScores, IntegrationResult, DomainId } from './types';
export type { IntegrationScores, IntegrationResult, DomainId, DevelopmentalArc, IntegrationDepth } from './types';
export { DOMAIN_NAMES, DOMAIN_SCORE_KEY } from './types';
import { hasDomain, allDomainsAvailable } from './helpers';
import { getPairwiseIntegration } from './pairwise';
import { getTripleIntegration } from './triple';
import { getQuadIntegration } from './quad';

/**
 * Main entry point: generate an integration for the selected domains.
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
