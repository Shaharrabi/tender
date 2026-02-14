/**
 * WEARE Calculation Engine — "The Space Between You"
 *
 * Pure function module that takes assembled input data and produces
 * a WEAREProfile with 9 variables, 3 layers, bottleneck, movement phase,
 * and warm summary. Follows the composite-scores.ts weighted-blend pattern.
 *
 * Graceful degradation: each variable calculator checks what data is
 * available, skips missing sub-components, re-normalizes weights, and
 * tracks confidence.
 */

import type {
  WEAREInput,
  WEAREVariables,
  WEAREVariableScore,
  WEARELayers,
  WEAREProfile,
  WEAREDataMode,
  WEAREWarmSummary,
  WEARETrend,
  WEARETrendDirection,
  WEAREPartnerData,
  WEAREBehavioralData,
  RelationalFieldScores,
  CoupleFieldScores,
  WeeklyCheckIn,
} from '@/types';

import { detectBottleneck, identifyMovementPhase, getMovementNarrative } from './bottleneck-detection';

// ─── Public API ─────────────────────────────────────────

export function calculateWEARE(input: WEAREInput): WEAREProfile {
  const dataMode = determineDataMode(input);
  const variables = calculateVariables(input);
  const layers = calculateLayers(variables);
  const bottleneck = detectBottleneck(variables);
  const movementPhase = identifyMovementPhase(variables, layers);
  const movementNarrative = getMovementNarrative(movementPhase, bottleneck, layers);
  const warmSummary = getWarmSummary(layers.overall);
  const trend = calculateTrend(layers, input.previousProfile);

  return {
    variables,
    layers,
    bottleneck,
    movementPhase,
    movementNarrative,
    warmSummary,
    dataMode,
    trend,
    calculatedAt: new Date().toISOString(),
  };
}

// ─── Data Mode ──────────────────────────────────────────

function determineDataMode(input: WEAREInput): WEAREDataMode {
  if (input.partnerB && input.relationalField && input.coupleField) return 'full';
  if (input.partnerB) return 'single-partner';
  return 'preliminary';
}

// ─── Variable Calculations ──────────────────────────────

function calculateVariables(input: WEAREInput): WEAREVariables {
  const a = input.partnerA;
  const b = input.partnerB;
  const rf = input.relationalField;
  const cf = input.coupleField;
  const wci = input.weeklyCheckIn;
  const beh = input.behavioral;

  return {
    attunement: calcAttunement(a, b, rf),
    coCreation: calcCoCreation(a, b, rf, cf),
    transmission: calcTransmission(beh, cf),
    space: calcSpace(a, b),
    time: calcTime(beh),
    individual: calcIndividual(a, b),
    context: calcContext(wci),
    change: calcChange(a, b, rf, cf, beh),
    resistance: calcResistance(a, b, cf),
  };
}

// ─── Attunement (A) ─────────────────────────────────────

function calcAttunement(
  a: WEAREPartnerData,
  b: WEAREPartnerData | undefined,
  rf: RelationalFieldScores | undefined,
): WEAREVariableScore {
  const components: WeightedComponent[] = [];

  // RFAS subscales (couple instrument)
  if (rf) {
    components.push({ value: normalize7to10(rf.fieldRecognition.mean), weight: 0.3, source: 'rfas-fieldRecognition' });
    components.push({ value: normalize7to10(rf.presenceAttunement.mean), weight: 0.3, source: 'rfas-presenceAttunement' });
  }

  // ECR-R supplement: somatic awareness (item 37)
  const ecrrSuppA = a.supplements?.ecrr;
  if (ecrrSuppA) {
    components.push({ value: normalize7to10(ecrrSuppA.somaticAwareness), weight: 0.15, source: 'ecr-r-supp-somatic' });
  }

  // SSEIT supplement: room sensing (E1), relational shift awareness (E2)
  const sseitSuppA = a.supplements?.sseit;
  if (sseitSuppA) {
    components.push({ value: normalize7to10(sseitSuppA.roomSensing), weight: 0.15, source: 'sseit-supp-roomSensing' });
    components.push({ value: normalize7to10(sseitSuppA.relationalShiftAwareness), weight: 0.1, source: 'sseit-supp-shiftAwareness' });
  }

  // Fallback: use composite scores if no couple data
  if (components.length === 0) {
    const resp = a.compositeScores.responsiveness;
    components.push({ value: normalize100to10(resp), weight: 0.6, source: 'composite-responsiveness' });
    const acc = a.compositeScores.accessibility;
    components.push({ value: normalize100to10(acc), weight: 0.4, source: 'composite-accessibility' });
  }

  // Average partner B's data if available
  if (b) {
    const bResp = normalize100to10(b.compositeScores.responsiveness);
    components.push({ value: bResp, weight: 0.1, source: 'partnerB-responsiveness' });
  }

  return resolveVariable(components);
}

// ─── Co-Creation (C) ────────────────────────────────────

function calcCoCreation(
  a: WEAREPartnerData,
  b: WEAREPartnerData | undefined,
  rf: RelationalFieldScores | undefined,
  cf: CoupleFieldScores | undefined,
): WEAREVariableScore {
  const components: WeightedComponent[] = [];

  // RFAS creative tension
  if (rf) {
    components.push({ value: normalize7to10(rf.creativeTension.mean), weight: 0.35, source: 'rfas-creativeTension' });
  }

  // Values supplement: V1 (values divergence response) — coded as growth-oriented = high
  const valSuppA = a.supplements?.values;
  if (valSuppA) {
    const v1Score = codeDivergenceResponse(valSuppA.valuesDivergenceResponse);
    components.push({ value: v1Score, weight: 0.15, source: 'values-supp-divergence' });
    // V2 gets a qualitative bonus if present
    if (valSuppA.differenceAsResource && valSuppA.differenceAsResource.length > 20) {
      components.push({ value: 7, weight: 0.05, source: 'values-supp-differenceAsResource' });
    }
  }

  // CFA items 11 (enriching difference, text = qualitative), 12 (learning from partner, likert)
  if (cf) {
    const item12 = numericCFA(cf.growingEdgeSection?.learningFromPartner);
    components.push({ value: normalize7to10(item12), weight: 0.15, source: 'cfa-learningFromPartner' });
    // Item 11 is text — bonus for substantive response
    const item11 = cf.growingEdgeSection?.enrichingDifference;
    if (typeof item11 === 'string' && item11.length > 20) {
      components.push({ value: 7, weight: 0.1, source: 'cfa-enrichingDifference' });
    }
  }

  // Fallback
  if (components.length === 0) {
    const eng = a.compositeScores.engagement;
    components.push({ value: normalize100to10(eng), weight: 0.5, source: 'composite-engagement' });
    const resp = a.compositeScores.responsiveness;
    components.push({ value: normalize100to10(resp), weight: 0.5, source: 'composite-responsiveness' });
  }

  return resolveVariable(components);
}

// ─── Transmission (Tr) ──────────────────────────────────

function calcTransmission(
  beh: WEAREBehavioralData | undefined,
  cf: CoupleFieldScores | undefined,
): WEAREVariableScore {
  const components: WeightedComponent[] = [];

  if (beh) {
    // Practice completion rate (0-1 → 1-10)
    components.push({ value: 1 + beh.practiceCompletionRate * 9, weight: 0.25, source: 'behavioral-completion' });
    // Repetition rate
    components.push({ value: 1 + beh.practiceRepetitionRate * 9, weight: 0.15, source: 'behavioral-repetition' });
    // Session consistency
    components.push({ value: 1 + beh.sessionConsistency * 9, weight: 0.15, source: 'behavioral-consistency' });
  }

  // CFA item 14: willingness to be changed (likert 1-7)
  if (cf) {
    const item14 = numericCFA(cf.growingEdgeSection?.willingnessToBeChanged);
    components.push({ value: normalize7to10(item14), weight: 0.15, source: 'cfa-willingnessToBeChanged' });
  }

  // Fallback: default to moderate
  if (components.length === 0) {
    components.push({ value: 5, weight: 1.0, source: 'default' });
  }

  return resolveVariable(components);
}

// ─── Space (S) ──────────────────────────────────────────

function calcSpace(
  a: WEAREPartnerData,
  b: WEAREPartnerData | undefined,
): WEAREVariableScore {
  const components: WeightedComponent[] = [];

  // DSI-R total normalized (0-100 → 1-10)
  const dsiTotal = a.dsir.totalNormalized;
  components.push({ value: normalize100to10(dsiTotal), weight: 0.5, source: 'dsir-total' });

  // DSI-R supplement: boundary awareness mean (1-7)
  const dsirSuppA = a.supplements?.dsir;
  if (dsirSuppA) {
    components.push({ value: normalize7to10(dsirSuppA.boundaryAwarenessMean), weight: 0.3, source: 'dsir-supp-boundaryAwareness' });
  }

  // Partner B's differentiation if available
  if (b) {
    const bDsi = b.dsir.totalNormalized;
    components.push({ value: normalize100to10(bDsi), weight: 0.2, source: 'partnerB-dsir' });
  }

  return resolveVariable(components);
}

// ─── Time (T) ───────────────────────────────────────────

function calcTime(
  beh: WEAREBehavioralData | undefined,
): WEAREVariableScore {
  const components: WeightedComponent[] = [];

  if (beh) {
    // Streak contribution: capped at 30 days → 10
    const streakScore = Math.min(beh.currentStreak / 30, 1) * 9 + 1;
    components.push({ value: streakScore, weight: 0.4, source: 'behavioral-streak' });
    // Session consistency (0-1 → 1-10)
    components.push({ value: 1 + beh.sessionConsistency * 9, weight: 0.3, source: 'behavioral-sessionConsistency' });
    // Total practices capped at 50
    const practiceScore = Math.min(beh.totalPracticesCompleted / 50, 1) * 9 + 1;
    components.push({ value: practiceScore, weight: 0.3, source: 'behavioral-totalPractices' });
  }

  // Fallback: default to moderate
  if (components.length === 0) {
    components.push({ value: 5, weight: 1.0, source: 'default' });
  }

  return resolveVariable(components);
}

// ─── Individual (I) ─────────────────────────────────────

function calcIndividual(
  a: WEAREPartnerData,
  b: WEAREPartnerData | undefined,
): WEAREVariableScore {
  const components: WeightedComponent[] = [];

  // EQ normalized (0-100 → 1-10)
  const eqNorm = a.sseit.totalNormalized;
  components.push({ value: normalize100to10(eqNorm), weight: 0.3, source: 'sseit-totalNormalized' });

  // Window width (0-100 → 1-10)
  const ww = a.compositeScores.windowWidth;
  components.push({ value: normalize100to10(ww), weight: 0.3, source: 'composite-windowWidth' });

  // DSI-R reactivity inverted (high differentiation = high reactivity score = LESS reactive)
  const reactivity = a.dsir.subscaleScores.emotionalReactivity?.normalized ?? 50;
  components.push({ value: normalize100to10(reactivity), weight: 0.2, source: 'dsir-reactivity-inv' });

  // Big Five composite: agreeableness + conscientiousness + (100 - neuroticism) / 3
  const agree = a.ipip.domainPercentiles.agreeableness ?? 50;
  const consc = a.ipip.domainPercentiles.conscientiousness ?? 50;
  const neuro = a.ipip.domainPercentiles.neuroticism ?? 50;
  const bigFiveComposite = (agree + consc + (100 - neuro)) / 3;
  components.push({ value: normalize100to10(bigFiveComposite), weight: 0.2, source: 'ipip-composite' });

  // Partner B average if available
  if (b) {
    const bEq = normalize100to10(b.sseit.totalNormalized);
    const bWw = normalize100to10(b.compositeScores.windowWidth);
    const bAvg = (bEq + bWw) / 2;
    components.push({ value: bAvg, weight: 0.15, source: 'partnerB-individual' });
  }

  return resolveVariable(components);
}

// ─── Context (CE) ───────────────────────────────────────

function calcContext(
  wci: { partnerA?: WeeklyCheckIn; partnerB?: WeeklyCheckIn } | undefined,
): WEAREVariableScore {
  const components: WeightedComponent[] = [];

  if (wci?.partnerA) {
    // External stress inverted: high stress = low context score
    const stressInv = 11 - wci.partnerA.externalStressLevel; // 1-10
    components.push({ value: stressInv, weight: 0.5, source: 'checkin-stress-inv' });
    // Support system
    components.push({ value: wci.partnerA.supportSystemRating, weight: 0.5, source: 'checkin-support' });
  }

  if (wci?.partnerB) {
    const stressInv = 11 - wci.partnerB.externalStressLevel;
    components.push({ value: stressInv, weight: 0.3, source: 'partnerB-stress-inv' });
    components.push({ value: wci.partnerB.supportSystemRating, weight: 0.2, source: 'partnerB-support' });
  }

  // Fallback: default to moderate
  if (components.length === 0) {
    components.push({ value: 5, weight: 1.0, source: 'default' });
  }

  return resolveVariable(components);
}

// ─── Change (Delta) ─────────────────────────────────────

function calcChange(
  a: WEAREPartnerData,
  b: WEAREPartnerData | undefined,
  rf: RelationalFieldScores | undefined,
  cf: CoupleFieldScores | undefined,
  beh: WEAREBehavioralData | undefined,
): WEAREVariableScore {
  const components: WeightedComponent[] = [];

  // RFAS emergent orientation
  if (rf) {
    components.push({ value: normalize7to10(rf.emergentOrientation.mean), weight: 0.25, source: 'rfas-emergentOrientation' });
  }

  // Step progression (0-12 → 1-10)
  if (beh) {
    const stepScore = 1 + (beh.stepProgression / 12) * 9;
    components.push({ value: stepScore, weight: 0.25, source: 'behavioral-stepProgression' });
  }

  // CFA item 14: willingness to be changed
  if (cf) {
    const item14 = numericCFA(cf.growingEdgeSection?.willingnessToBeChanged);
    components.push({ value: normalize7to10(item14), weight: 0.15, source: 'cfa-willingnessToBeChanged' });
  }

  // Values supplement V5: willingness to change (1-7)
  const valSuppA = a.supplements?.values;
  if (valSuppA) {
    components.push({ value: normalize7to10(valSuppA.willingnessToChange), weight: 0.15, source: 'values-supp-willingnessToChange' });
  }

  // Fallback: use openness as a proxy
  if (components.length === 0) {
    const open = a.ipip.domainPercentiles.openness ?? 50;
    components.push({ value: normalize100to10(open), weight: 0.5, source: 'ipip-openness' });
    const valCong = a.compositeScores.valuesCongruence;
    components.push({ value: normalize100to10(valCong), weight: 0.5, source: 'composite-valuesCongruence' });
  }

  return resolveVariable(components);
}

// ─── Resistance (R) ─────────────────────────────────────

function calcResistance(
  a: WEAREPartnerData,
  b: WEAREPartnerData | undefined,
  cf: CoupleFieldScores | undefined,
): WEAREVariableScore {
  const components: WeightedComponent[] = [];

  // ECR-R supplement: fixed story (item 38, already reverse-scored → low = MORE fixed)
  // So we invert it: high fixedStory (reverse-scored) = low resistance
  // fixedStory reverse-scored: 1 (very fixed) to 7 (not fixed)
  // Resistance = 8 - fixedStory → 1 (not resistant) to 7 (very resistant)
  const ecrrSuppA = a.supplements?.ecrr;
  if (ecrrSuppA) {
    // fixedStory is already reverse-scored in the supplement scorer (8 - raw)
    // So high = flexible = LOW resistance. We need to invert for resistance.
    const fixedResistance = 8 - ecrrSuppA.fixedStory;
    components.push({ value: normalize7to10(fixedResistance), weight: 0.2, source: 'ecr-r-supp-fixedStory-inv' });

    // certaintyVsCuriosity: also reverse-scored, high = curious = low resistance
    const certaintyResistance = 8 - ecrrSuppA.certaintyVsCuriosity;
    components.push({ value: normalize7to10(certaintyResistance), weight: 0.2, source: 'ecr-r-supp-certainty-inv' });
  }

  // CFA item 4: cycle awareness (likert) — inverted (high awareness = low resistance)
  if (cf) {
    const item4 = numericCFA(cf.patternSection?.cycleAwareness);
    const item4Inv = 8 - item4;
    components.push({ value: normalize7to10(item4Inv), weight: 0.15, source: 'cfa-cycleAwareness-inv' });

    // CFA item 15: uncertain certainty — text field, having a response = less rigid
    const item15 = cf.growingEdgeSection?.uncertainCertainty;
    if (typeof item15 === 'string' && item15.length > 10) {
      // Engaged response suggests less resistance
      components.push({ value: 3, weight: 0.1, source: 'cfa-uncertainCertainty-engaged' });
    } else {
      components.push({ value: 7, weight: 0.1, source: 'cfa-uncertainCertainty-avoidant' });
    }
  }

  // Low openness = high resistance
  const openness = a.ipip.domainPercentiles.openness ?? 50;
  const openResistance = 100 - openness;
  components.push({ value: normalize100to10(openResistance), weight: 0.15, source: 'ipip-openness-inv' });

  // Conflict rigidity: high avoiding + high neuroticism combo
  const avoiding = a.dutch.subscaleScores.avoiding?.mean ?? 2.5;
  const neuro = a.ipip.domainPercentiles.neuroticism ?? 50;
  const rigidity = (normalize5to10(avoiding) + normalize100to10(neuro)) / 2;
  components.push({ value: rigidity, weight: 0.15, source: 'dutch-ipip-rigidity' });

  // Fallback if no supplements or CFA
  if (components.length <= 2) {
    // Add avoidance as resistance signal
    const avoidance = ((a.ecrr.avoidanceScore - 1) / 6) * 100;
    components.push({ value: normalize100to10(avoidance), weight: 0.2, source: 'ecrr-avoidance' });
  }

  return resolveVariable(components);
}

// ─── Layer Calculations ─────────────────────────────────

function calculateLayers(vars: WEAREVariables): WEARELayers {
  const a = vars.attunement.raw;
  const c = vars.coCreation.raw;
  const tr = vars.transmission.raw;
  const s = vars.space.raw;
  const t = vars.time.raw;
  const i = vars.individual.raw;
  const ce = vars.context.raw;
  const delta = vars.change.raw;
  const r = vars.resistance.raw;

  // Resonance Pulse: core connection (A + C + Tr) / 30 × 100
  const resonancePulse = clamp100(((a + c + tr) / 30) * 100);

  // Emergence Direction: growth momentum minus rigidity
  const emergenceDirection = Math.max(-9, Math.min(9, delta - r));

  // Overall: log-normalized product
  // Numerator: (A+C+Tr) × S × T × (I_avg + CE)
  // Denominator: 1 + e^(-(Δ-R))
  const numerator = (a + c + tr) * s * t * (i + ce);
  const denominator = 1 + Math.exp(-(delta - r));
  const rawOverall = numerator / denominator;

  // Log-normalize to 0-100
  // Theoretical range:
  //   Min: (3) × 1 × 1 × 2 / (1 + e^9) ≈ 0.0007
  //   Max: (30) × 10 × 10 × 20 / (1 + e^(-9)) ≈ 60000
  // We use log scaling with empirically chosen bounds
  const overall = logNormalize(rawOverall, 1, 50000);

  return { resonancePulse, emergenceDirection, overall };
}

// ─── Warm Summary ───────────────────────────────────────

function getWarmSummary(overall: number): WEAREWarmSummary {
  if (overall >= 70) return 'Deeply alive';
  if (overall >= 50) return 'Growing stronger';
  if (overall >= 30) return 'Finding its way';
  return 'Needs tending';
}

// ─── Trend Calculation ──────────────────────────────────

function calculateTrend(
  layers: WEARELayers,
  previous: WEAREProfile | undefined,
): WEARETrend | undefined {
  if (!previous) return undefined;

  const overallDelta = layers.overall - previous.layers.overall;
  const resonanceDelta = layers.resonancePulse - previous.layers.resonancePulse;

  let direction: WEARETrendDirection;
  if (overallDelta > 3) direction = 'growing';
  else if (overallDelta < -3) direction = 'contracting';
  else direction = 'steady';

  // Determine period label from timestamps
  const prevDate = new Date(previous.calculatedAt);
  const now = new Date();
  const daysDiff = Math.round((now.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
  let periodLabel: string;
  if (daysDiff <= 10) periodLabel = 'Since last week';
  else if (daysDiff <= 20) periodLabel = 'Since 2 weeks ago';
  else periodLabel = `Since ${daysDiff} days ago`;

  return { direction, overallDelta, resonanceDelta, periodLabel };
}

// ─── Weighted Component Resolution ─────────────────────

interface WeightedComponent {
  value: number;   // 1-10
  weight: number;  // original weight (will be re-normalized)
  source: string;
}

/**
 * Resolves a list of weighted components into a single variable score.
 * Handles re-normalization when some components are missing.
 */
function resolveVariable(components: WeightedComponent[]): WEAREVariableScore {
  if (components.length === 0) {
    return { raw: 5, confidence: 0, sources: ['default'] };
  }

  const totalWeight = components.reduce((sum, c) => sum + c.weight, 0);
  const weighted = components.reduce((sum, c) => sum + c.value * (c.weight / totalWeight), 0);

  // Confidence based on:
  // 1. How many components we have (more = higher)
  // 2. Whether defaults are present (lower)
  const defaultComponents = components.filter((c) => c.source === 'default');
  const realComponents = components.filter((c) => c.source !== 'default');
  const confidence = realComponents.length === 0
    ? 0
    : Math.min(1, realComponents.length / 4); // cap at 1 with 4+ real sources

  return {
    raw: clamp10(weighted),
    confidence: Math.round(confidence * 100) / 100,
    sources: components.map((c) => c.source),
  };
}

// ─── Normalization Helpers ──────────────────────────────

/** Clamp to 0-100 range */
function clamp100(n: number): number {
  return Math.round(Math.max(0, Math.min(100, n)));
}

/** Clamp to 1-10 range */
function clamp10(n: number): number {
  return Math.round(Math.max(1, Math.min(10, n)) * 10) / 10;
}

/** 1-7 Likert scale → 1-10 */
function normalize7to10(val: number): number {
  return 1 + ((val - 1) / 6) * 9;
}

/** 0-100 composite → 1-10 */
function normalize100to10(val: number): number {
  return 1 + (val / 100) * 9;
}

/** 1-5 DUTCH scale → 1-10 */
function normalize5to10(val: number): number {
  return 1 + ((val - 1) / 4) * 9;
}

/** Log-normalize a value to 0-100 given min/max bounds */
function logNormalize(val: number, min: number, max: number): number {
  if (val <= min) return 0;
  if (val >= max) return 100;
  const logMin = Math.log(min);
  const logMax = Math.log(max);
  const logVal = Math.log(val);
  return clamp100(((logVal - logMin) / (logMax - logMin)) * 100);
}

/** Extract numeric value from CFA score field, default to 4 */
function numericCFA(val: any): number {
  return typeof val === 'number' ? val : 4;
}

/** Code values divergence response to a numeric score (1-10) */
function codeDivergenceResponse(response: string): number {
  switch (response) {
    case 'growth-oriented': return 9;
    case 'problem-solving': return 7;
    case 'tolerance': return 5;
    case 'threat': return 2;
    default: return 5;
  }
}
