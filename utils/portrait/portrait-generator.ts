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
import { generateIntegratedNarratives } from './assessment-synthesis';
import { generateRelationalPersonalityNarrative } from './relational-personality-narrative';
import type { AllAssessmentScores, IndividualPortrait } from '@/types';
import type { SupplementScores, ScoreProvenance } from '@/types/portrait';

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
 *  '1.3.0' / '2.3.0' — Sprint 3: EQ gap patterns, regulation toolkit, co-regulation pattern
 *  '1.4.0' / '2.4.0' — Sprint 4: repair readiness, conflict flexibility fix, values willingness + insights
 *  '1.5.0' / '2.5.0' — Sprint 5: added anxietyNorm/avoidanceNorm to compositeScores for accurate couple attachment plotting
 */
export const PORTRAIT_CODE_VERSION_BASE = '1.5.0';
export const PORTRAIT_CODE_VERSION_SUPPLEMENTS = '2.5.0';

/**
 * Check if a portrait version is outdated.
 * Any portrait with minor version < 5 needs regeneration for Sprint 5 features.
 */
export function isPortraitStale(version?: string): boolean {
  if (!version) return true;
  // Parse version: major.minor.patch
  const parts = version.split('.').map(Number);
  const minor = parts[1] ?? 0;
  // Sprint 5: anxietyNorm/avoidanceNorm in compositeScores
  return minor < 5;
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

  // Step 4: Negative cycle — now with repair readiness and position confidence
  const negativeCycle = predictNegativeCycle(ecrr, dutch, sseit, compositeScores);

  // Step 5: Growth edges
  const growthEdges = identifyGrowthEdges(values, dsir, compositeScores, patternResult.patterns, ipip);

  // Step 6: Anchor points — now uses emotionalStructure for deep personalization
  const anchorPoints = generateAnchorPoints(ecrr, compositeScores, attachment.emotionalStructure);

  // Step 7: Partner guide — now uses emotionalStructure for whatToSay and deepestLonging
  const partnerGuide = generatePartnerGuide(ecrr, compositeScores, attachment.emotionalStructure);

  // Step 8: Cross-instrument integrated narratives
  const integrated = generateIntegratedNarratives(scores);

  // Step 9: Relational personality shifts (backbone vs. in-relationship)
  const relationalShifts = generateRelationalPersonalityNarrative(ipip);

  // Build provenance map — tells the UI what kind of data each output is
  const provenanceMap: Record<string, ScoreProvenance> = {
    // Composite scores are derived from multiple instruments
    regulationScore: { type: 'derived_composite', label: 'Derived from IPIP, SSEIT, and DSI-R scores' },
    windowWidth: { type: 'derived_composite', label: 'Derived from IPIP, DSI-R, and SSEIT scores' },
    accessibility: { type: 'derived_composite', label: 'Derived from ECR-R and DSI-R scores' },
    responsiveness: { type: 'derived_composite', label: 'Derived from SSEIT and IPIP scores' },
    engagement: { type: 'derived_composite', label: 'Derived from ECR-R, IPIP, Values, and SSEIT scores' },
    selfLeadership: { type: 'derived_composite', label: 'Derived from DSI-R and IPIP scores' },
    valuesCongruence: { type: 'derived_composite', label: 'Derived from Values assessment gap scores' },
    attachmentSecurity: { type: 'derived_composite', label: 'Derived from ECR-R anxiety and avoidance' },
    emotionalIntelligence: { type: 'derived_composite', label: 'Derived from SSEIT total score' },
    differentiation: { type: 'derived_composite', label: 'Derived from DSI-R subscale scores' },
    conflictFlexibility: { type: 'derived_composite', label: 'Derived from DUTCH conflict mode balance' },
    relationalAwareness: { type: 'derived_composite', label: 'Derived from SSEIT and IPIP scores' },
    // Raw subscales
    anxietyNorm: { type: 'raw_assessment', label: 'ECR-R anxiety subscale (normalized)' },
    avoidanceNorm: { type: 'raw_assessment', label: 'ECR-R avoidance subscale (normalized)' },
    // Narratives
    integratedNarratives: { type: 'interpretive', label: 'Cross-instrument narrative synthesis' },
    oneThingSentence: { type: 'interpretive', label: 'Pattern-based interpretive summary' },
    fourLens: { type: 'interpretive', label: 'Assessment-driven interpretive analysis' },
    growthEdges: { type: 'interpretive', label: 'Identified from score patterns and gaps' },
  };

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
    // Portrait Intelligence Upgrade
    integratedNarratives: integrated.narratives.length > 0 ? integrated.narratives : undefined,
    oneThingSentence: integrated.oneThingSentence,
    // Provenance — tells UI what kind of data each output is
    provenanceMap,
    // Non-numeric metadata from personality assessment (not in compositeScores to avoid type issues)
    portraitMetadata: {
      validityFlag: (ipip as any)?.validityFlag ?? undefined,
      relationalPersonality: (ipip as any)?.relationalPersonality ?? undefined,
    },
    // Relational personality shifts — backbone vs. in-relationship comparison
    relationalPersonalityInsights: relationalShifts.length > 0 ? relationalShifts : undefined,
  };
}
