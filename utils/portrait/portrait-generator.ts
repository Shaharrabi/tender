import { calculateCompositeScores } from './composite-scores';
import { detectPatterns } from './pattern-detection';
import { analyzeAttachmentProtection } from './lens-attachment';
import { analyzePartsPolarities } from './lens-parts';
import { analyzeRegulationWindow } from './lens-regulation';
import { analyzeValuesBecoming } from './lens-values';
import { analyzeFieldAwareness } from './lens-field-awareness';
import { predictNegativeCycle } from './negative-cycle';
import { identifyGrowthEdges } from './growth-edges';
import { generateAnchorPoints } from './anchor-points';
import { generatePartnerGuide } from './partner-guide';
import { generateBigFiveReframes } from './big-five-reframes';
import { buildTailoringContext } from './attachment-tailoring';
import type { AllAssessmentScores, IndividualPortrait } from '@/types';
import type { SupplementScores } from '@/types/portrait';

/**
 * Current portrait generation code version.
 * Bump this whenever the composite-scores formula or portrait structure changes.
 * Used by home.tsx and portrait.tsx for stale-portrait detection.
 *
 * History:
 *  '1.0.0' — Original 7 composite scores
 *  '2.0.0' — Phase 3 supplements + field awareness lens
 *  '1.1.0' / '2.1.0' — Sprint 1: Added 5 radar chart dimensions to compositeScores
 *  '1.2.0' / '2.2.0' — Sprint 2: emotionalStructure, rich anchor points, state-aware partner guide
 */
export const PORTRAIT_CODE_VERSION_BASE = '1.2.0';
export const PORTRAIT_CODE_VERSION_SUPPLEMENTS = '2.2.0';

/**
 * Check if a portrait version is outdated.
 * Any portrait with minor version < 2 needs regeneration for enriched anchors/guide.
 */
export function isPortraitStale(version?: string): boolean {
  if (!version) return true;
  // Parse version: major.minor.patch
  const parts = version.split('.').map(Number);
  const minor = parts[1] ?? 0;
  // Rich anchors + partner guide added at minor version 2
  return minor < 2;
}

/**
 * Generate a complete Individual Portrait from 6 assessment score objects.
 * Returns everything except `id` and `createdAt` (set by DB).
 *
 * Phase 3: Accepts optional supplement data for enhanced portrait generation.
 * When supplements are provided, adds field awareness lens, Big Five reframes,
 * and supplement-aware patterns. Version bumps to '2.1.0'.
 */
export function generatePortrait(
  userId: string,
  assessmentIds: string[],
  scores: AllAssessmentScores,
  supplements?: SupplementScores
): Omit<IndividualPortrait, 'id' | 'createdAt'> {
  const { ecrr, dutch, sseit, dsir, ipip, values } = scores;

  // Step 1: Composite scores
  const compositeScores = calculateCompositeScores(ecrr, ipip, sseit, dsir, values, dutch);

  // Step 2: Pattern detection (now with optional supplement-aware patterns)
  const patternResult = detectPatterns(ecrr, dutch, sseit, dsir, ipip, values, compositeScores, supplements);

  // Build tailoring context for attachment-adaptive language
  const tailoring = buildTailoringContext(
    ecrr.attachmentStyle,
    ecrr.anxietyScore,
    ecrr.avoidanceScore
  );

  // Step 3: Four-lens analysis
  const attachment = analyzeAttachmentProtection(ecrr, compositeScores, patternResult.patterns);
  const parts = analyzePartsPolarities(ecrr, dutch, dsir, ipip, values, compositeScores);
  const regulation = analyzeRegulationWindow(ecrr, ipip, sseit, dsir, dutch, compositeScores, patternResult.patterns);
  const valuesLens = analyzeValuesBecoming(values, patternResult.patterns, ecrr);

  // Step 3.5 (Phase 3): Field Awareness lens — only if supplement data present
  const fieldAwareness = supplements
    ? analyzeFieldAwareness(supplements, ecrr, ipip, dsir, compositeScores, tailoring)
    : undefined;

  const fourLens = {
    attachment,
    parts,
    regulation,
    values: valuesLens,
    ...(fieldAwareness ? { fieldAwareness } : {}),
  };

  // Step 3.6 (Phase 3): Big Five relational reframes
  const bigFiveReframes = generateBigFiveReframes(ipip, ecrr, dsir, compositeScores);

  // Step 4: Negative cycle
  const negativeCycle = predictNegativeCycle(ecrr, dutch);

  // Step 5: Growth edges
  const growthEdges = identifyGrowthEdges(values, dsir, compositeScores, patternResult.patterns);

  // Step 6: Anchor points — now uses emotionalStructure for deep personalization
  const anchorPoints = generateAnchorPoints(ecrr, compositeScores, attachment.emotionalStructure);

  // Step 7: Partner guide — now uses emotionalStructure for whatToSay and deepestLonging
  const partnerGuide = generatePartnerGuide(ecrr, compositeScores, attachment.emotionalStructure);

  return {
    userId,
    assessmentIds,
    compositeScores,
    patterns: patternResult.patterns,
    fourLens,
    negativeCycle,
    growthEdges,
    anchorPoints,
    partnerGuide,
    version: supplements ? PORTRAIT_CODE_VERSION_SUPPLEMENTS : PORTRAIT_CODE_VERSION_BASE,
    // Phase 3 additions
    bigFiveReframes: bigFiveReframes.length > 0 ? bigFiveReframes : undefined,
    supplementData: supplements,
  };
}
