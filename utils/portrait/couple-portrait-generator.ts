/**
 * Deep Couple Portrait Generator
 *
 * Master function that orchestrates all sub-algorithms to produce
 * the complete DeepCouplePortrait.
 *
 * Input:
 * - Two individual portraits
 * - Dyadic assessment scores (RDAS, DCI, CSI-16)
 * - WEARE profile (optional)
 * - Partner names
 * - Couple ID
 *
 * Output: DeepCouplePortrait
 */

import type { IndividualPortrait } from '@/types/portrait';
import type {
  DeepCouplePortrait,
  RelationalFieldLayer,
  RDASScores,
  DCIScores,
  CSI16Scores,
} from '@/types/couples';
import type { WEAREProfile } from '@/types/weare';

import { buildCombinedCycle } from './combined-cycle';
import {
  analyzeRadarOverlap,
  findSharedStrengths,
  findComplementaryGifts,
  findFrictionZones,
  findValuesTensions,
  analyzeAttachmentDynamic,
} from './convergence-divergence';
import { buildCoupleGrowthEdges } from './couple-growth-edges';
import { detectDyadicDiscrepancies } from './dyadic-discrepancies';
import { generateCoupleNarrative, generateCoupleAnchors } from './couple-narrative';

interface DyadicScoreSet {
  rdas?: { partnerA: RDASScores; partnerB: RDASScores };
  dci?: { partnerA: DCIScores; partnerB: DCIScores };
  csi16?: { partnerA: CSI16Scores; partnerB: CSI16Scores };
}

// ─── Relational Field Layer Builder ──────────────────────

function buildRelationalFieldLayer(
  weareProfile?: WEAREProfile | null,
  dyadicScores?: DyadicScoreSet,
): RelationalFieldLayer {
  if (weareProfile) {
    return {
      resonance: weareProfile.layers.resonancePulse,
      direction: weareProfile.layers.emergenceDirection,
      vitality: weareProfile.layers.overall,
      qualitativeLabel: weareProfile.warmSummary,
      bottleneck: weareProfile.bottleneck?.variable || '',
      bottleneckLabel: weareProfile.bottleneck?.label || '',
      movement: weareProfile.movementPhase,
      fieldNarrative: weareProfile.movementNarrative || buildDefaultFieldNarrative(weareProfile),
    };
  }

  // Fallback: build from dyadic scores
  const hasData = dyadicScores && (dyadicScores.rdas || dyadicScores.dci || dyadicScores.csi16);
  if (!hasData) {
    return {
      resonance: 50,
      direction: 0,
      vitality: 50,
      qualitativeLabel: 'Finding its way',
      bottleneck: '',
      bottleneckLabel: '',
      movement: 'recognition',
      fieldNarrative: 'The relational field data is still being collected. What we have so far gives us a starting picture — the full picture will emerge as you continue.',
    };
  }

  // Estimate from dyadic scores
  let vitality = 50;
  let narrative = '';

  if (dyadicScores!.csi16) {
    const avg = (dyadicScores!.csi16.partnerA.total + dyadicScores!.csi16.partnerB.total) / 2;
    vitality = Math.round((avg / 81) * 100);
    narrative = avg >= 52
      ? 'Based on your satisfaction data, the relational field is in a positive range — there is genuine warmth and investment here.'
      : 'Based on your satisfaction data, the relational field is asking for attention. This is not a failure — it is a signal.';
  }

  if (dyadicScores!.rdas) {
    const avg = (dyadicScores!.rdas.partnerA.total + dyadicScores!.rdas.partnerB.total) / 2;
    const rdasVitality = Math.round((avg / 69) * 100);
    vitality = Math.round((vitality + rdasVitality) / 2);
  }

  const label: RelationalFieldLayer['qualitativeLabel'] =
    vitality > 70 ? 'Deeply alive'
    : vitality > 50 ? 'Growing stronger'
    : vitality > 30 ? 'Finding its way'
    : 'Needs tending';

  return {
    resonance: vitality,
    direction: 0, // Cannot determine direction without WEARE history
    vitality,
    qualitativeLabel: label,
    bottleneck: '',
    bottleneckLabel: '',
    movement: 'recognition',
    fieldNarrative: narrative || 'The relational field is present and measurable. As more data comes in, the picture will sharpen.',
  };
}

function buildDefaultFieldNarrative(weareProfile: WEAREProfile): string {
  const { warmSummary, movementPhase } = weareProfile;

  const phaseNarratives: Record<string, string> = {
    recognition: 'You are in the recognition phase — seeing your patterns for the first time. This is where all growth begins.',
    release: 'You are in the release phase — letting go of protective patterns that no longer serve you. This takes courage.',
    resonance: 'You are in the resonance phase — finding a new rhythm together. The old patterns are loosening their grip.',
    embodiment: 'You are in the embodiment phase — living the changes, not just understanding them. This is where theory becomes lived experience.',
  };

  return phaseNarratives[movementPhase] || `The space between you is ${warmSummary.toLowerCase()}.`;
}

// ─── Dyadic Synthesis Builders ───────────────────────────

function buildRDASSynthesis(rdas: { partnerA: RDASScores; partnerB: RDASScores }) {
  const total = Math.round((rdas.partnerA.total + rdas.partnerB.total) / 2);
  const consensusAvg = Math.round((rdas.partnerA.consensus + rdas.partnerB.consensus) / 2);
  const satisfactionAvg = Math.round((rdas.partnerA.satisfaction + rdas.partnerB.satisfaction) / 2);
  const cohesionAvg = Math.round((rdas.partnerA.cohesion + rdas.partnerB.cohesion) / 2);
  const aboveThreshold = total >= 48;

  let narrative: string;
  if (total >= 55) {
    narrative = 'Your dyadic adjustment is in the healthy range. You agree on the big things, find satisfaction in the relationship, and feel connected to each other. This is a strong foundation.';
  } else if (total >= 48) {
    narrative = 'Your dyadic adjustment is in the moderate range — functioning but with areas that could benefit from attention. There are places where you see things differently, and those are worth exploring together.';
  } else {
    narrative = 'Your dyadic adjustment suggests the relationship is under strain. This is information, not a verdict. Many couples in this range find their way to deeper connection with intentional work.';
  }

  return { total, consensusAvg, satisfactionAvg, cohesionAvg, aboveThreshold, narrative };
}

function buildCSI16Synthesis(csi16: { partnerA: CSI16Scores; partnerB: CSI16Scores }) {
  const total = Math.round((csi16.partnerA.total + csi16.partnerB.total) / 2);
  const aboveThreshold = total >= 52;
  const satisfactionLabel =
    total >= 67 ? 'high' : total >= 52 ? 'moderate' : total >= 34 ? 'low' : 'crisis';

  let narrative: string;
  if (total >= 67) {
    narrative = 'Satisfaction in your relationship is high. Both of you feel good about what you have built together. The invitation is to not take this for granted — high satisfaction is maintained, not automatic.';
  } else if (total >= 52) {
    narrative = 'Satisfaction is in the moderate range. There are things that work well and things that need attention. This is where most couples live — and it is a workable place.';
  } else {
    narrative = 'Satisfaction is lower than either of you likely wants it to be. Something is eroding the felt value of the relationship. Identifying what that is — and addressing it — is the most important work you can do right now.';
  }

  return { total, aboveThreshold, satisfactionLabel, narrative };
}

function buildDCISynthesis(dci: { partnerA: DCIScores; partnerB: DCIScores }) {
  const avgSupportive = (dci.partnerA.supportiveBySelf + dci.partnerB.supportiveBySelf) / 2;
  const avgCommon = (dci.partnerA.commonCoping + dci.partnerB.commonCoping) / 2;
  const avgNeg = ((dci.partnerA.negativeByPartner ?? 0) + (dci.partnerB.negativeByPartner ?? 0)) / 2;

  const supportiveStrength = avgSupportive >= 18;
  const commonCopingStrength = avgCommon >= 18;
  const negativeCopingConcern = avgNeg > 10;

  let narrative: string;
  if (supportiveStrength && commonCopingStrength && !negativeCopingConcern) {
    narrative = 'Your coping partnership is strong. You support each other well, handle stress as a team, and have relatively low negative coping. This is a genuine relational resource.';
  } else if (negativeCopingConcern) {
    narrative = 'Negative coping patterns are present in your stress responses. This means that when stress enters the system, criticism, dismissiveness, or withdrawal become habitual responses. The good news: these are learned patterns, and they can be unlearned.';
  } else {
    narrative = 'Your coping partnership has areas of strength and areas for growth. The key is building on what works while gently addressing what does not.';
  }

  return { supportiveStrength, commonCopingStrength, negativeCopingConcern, narrative };
}

// ─── Main Generator ──────────────────────────────────────

export function generateDeepCouplePortrait(
  coupleId: string,
  portraitA: IndividualPortrait,
  portraitB: IndividualPortrait,
  partnerAName: string,
  partnerBName: string,
  dyadicScores: DyadicScoreSet,
  weareProfile?: WEAREProfile | null,
): DeepCouplePortrait {

  // 1. Relational Field Layer
  const relationalField = buildRelationalFieldLayer(weareProfile, dyadicScores);

  // 2. Combined Cycle
  const combinedCycle = buildCombinedCycle(portraitA, portraitB, dyadicScores);

  // 3. Attachment Dynamic
  const attachmentDynamic = analyzeAttachmentDynamic(portraitA, portraitB);

  // 4. Convergence-Divergence
  const radarOverlap = analyzeRadarOverlap(portraitA.compositeScores, portraitB.compositeScores);
  const sharedStrengths = findSharedStrengths(portraitA.compositeScores, portraitB.compositeScores);
  const complementaryGifts = findComplementaryGifts(portraitA.compositeScores, portraitB.compositeScores);
  const frictionZones = findFrictionZones(portraitA, portraitB);
  const valuesTensions = findValuesTensions(portraitA, portraitB);

  // 5. Couple Growth Edges
  const coupleGrowthEdges = buildCoupleGrowthEdges(
    portraitA,
    portraitB,
    dyadicScores,
    combinedCycle,
    frictionZones,
    attachmentDynamic,
    radarOverlap,
    weareProfile,
  );

  // 6. Dyadic Discrepancies
  const discrepancies = detectDyadicDiscrepancies(portraitA, portraitB, dyadicScores);

  // 7. Dyadic Insights
  const dyadicInsights: DeepCouplePortrait['dyadicInsights'] = {
    discrepancies,
  };
  if (dyadicScores.rdas) dyadicInsights.satisfaction = buildRDASSynthesis(dyadicScores.rdas);
  if (dyadicScores.csi16) dyadicInsights.closeness = buildCSI16Synthesis(dyadicScores.csi16);
  if (dyadicScores.dci) dyadicInsights.coping = buildDCISynthesis(dyadicScores.dci);

  // 8. Narrative
  const narrative = generateCoupleNarrative(
    portraitA,
    portraitB,
    partnerAName,
    partnerBName,
    combinedCycle,
    attachmentDynamic,
    sharedStrengths,
    frictionZones,
    coupleGrowthEdges,
    relationalField,
  );

  // 9. Couple Anchors
  const coupleAnchors = generateCoupleAnchors(
    portraitA,
    portraitB,
    partnerAName,
    partnerBName,
    combinedCycle,
    attachmentDynamic,
  );

  return {
    coupleId,
    partnerAName,
    partnerBName,
    generatedAt: new Date().toISOString(),
    relationalField,
    patternInterlock: {
      combinedCycle,
      attachmentDynamic,
    },
    convergenceDivergence: {
      radarOverlap,
      sharedStrengths,
      complementaryGifts,
      frictionZones,
      valuesTensions,
    },
    coupleGrowthEdges,
    dyadicInsights,
    narrative,
    coupleAnchors,
  };
}
