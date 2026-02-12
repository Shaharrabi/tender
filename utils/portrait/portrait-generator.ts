import { calculateCompositeScores } from './composite-scores';
import { detectPatterns } from './pattern-detection';
import { analyzeAttachmentProtection } from './lens-attachment';
import { analyzePartsPolarities } from './lens-parts';
import { analyzeRegulationWindow } from './lens-regulation';
import { analyzeValuesBecoming } from './lens-values';
import { predictNegativeCycle } from './negative-cycle';
import { identifyGrowthEdges } from './growth-edges';
import { generateAnchorPoints } from './anchor-points';
import { generatePartnerGuide } from './partner-guide';
import type { AllAssessmentScores, IndividualPortrait } from '@/types';

/**
 * Generate a complete Individual Portrait from 6 assessment score objects.
 * Returns everything except `id` and `createdAt` (set by DB).
 */
export function generatePortrait(
  userId: string,
  assessmentIds: string[],
  scores: AllAssessmentScores
): Omit<IndividualPortrait, 'id' | 'createdAt'> {
  const { ecrr, dutch, sseit, dsir, ipip, values } = scores;

  // Step 1: Composite scores
  const compositeScores = calculateCompositeScores(ecrr, ipip, sseit, dsir, values);

  // Step 2: Pattern detection
  const patternResult = detectPatterns(ecrr, dutch, sseit, dsir, ipip, values, compositeScores);

  // Step 3: Four-lens analysis
  const attachment = analyzeAttachmentProtection(ecrr, compositeScores, patternResult.patterns);
  const parts = analyzePartsPolarities(ecrr, dutch, dsir, ipip, values, compositeScores);
  const regulation = analyzeRegulationWindow(ecrr, ipip, sseit, dsir, dutch, compositeScores, patternResult.patterns);
  const valuesLens = analyzeValuesBecoming(values, patternResult.patterns);

  const fourLens = { attachment, parts, regulation, values: valuesLens };

  // Step 4: Negative cycle
  const negativeCycle = predictNegativeCycle(ecrr, dutch);

  // Step 5: Growth edges
  const growthEdges = identifyGrowthEdges(values, dsir, compositeScores, patternResult.patterns);

  // Step 6: Anchor points
  const anchorPoints = generateAnchorPoints(ecrr, compositeScores);

  // Step 7: Partner guide
  const partnerGuide = generatePartnerGuide(ecrr, compositeScores);

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
    version: '1.0.0',
  };
}
