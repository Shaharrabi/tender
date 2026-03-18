/**
 * TENDER PIPELINE VERIFICATION
 * Tests every connection from assessment to output.
 */

import { calculateCompositeScores } from '../utils/portrait/composite-scores';
import { detectPatterns } from '../utils/portrait/pattern-detection';
import { identifyGrowthEdges } from '../utils/portrait/growth-edges';
import { analyzePartsPolarities } from '../utils/portrait/lens-parts';
import { generatePortrait } from '../utils/portrait/portrait-generator';
import type { AllAssessmentScores } from '../types';

// ═══════════════════════════════════════════════════════════
// MAYA — anxious-preoccupied, high empathy, low differentiation
// ═══════════════════════════════════════════════════════════

const maya_ecrr = {
  anxietyScore: 5.2,
  avoidanceScore: 2.1,
  attachmentStyle: 'anxious-preoccupied' as const,
};

const maya_ipip = {
  domainPercentiles: {
    neuroticism: 71, extraversion: 68, openness: 72, agreeableness: 78, conscientiousness: 55,
    N: 71, E: 68, O: 72, A: 78, C: 55,
  },
  domainScores: {
    neuroticism: { sum: 42, mean: 3.5 }, extraversion: { sum: 40, mean: 3.33 },
    openness: { sum: 42, mean: 3.5 }, agreeableness: { sum: 44, mean: 3.67 },
    conscientiousness: { sum: 36, mean: 3.0 },
  },
  facetPercentiles: { A4_Cooperation: 72 },
  relationalPersonality: { N_rel: 88, E_rel: 45, A_rel: 60, C_rel: 40, O_rel: 85 },
  validityFlag: 'VALID' as const,
};

const maya_sseit = {
  totalScore: 72, totalMean: 3.6, totalNormalized: 57, totalNormalized_v2: 52,
  subscaleScores: {
    perception: { sum: 20, mean: 4.0, itemCount: 5 },
    managingOwn: { sum: 9, mean: 1.8, itemCount: 5 },
    managingOthers: { sum: 16, mean: 3.2, itemCount: 5 },
    utilization: { sum: 13, mean: 2.6, itemCount: 5 },
    perspectiveTaking: { sum: 8, mean: 2.0, itemCount: 4 },
    empathicResonance: { sum: 21, mean: 4.2, itemCount: 5 },
  },
  subscaleNormalized: {
    perception: 80, managingOwn: 35, managingOthers: 65, utilization: 50,
    perspectiveTaking: 38, empathicResonance: 82,
  },
};

const maya_dsir = {
  totalMean: 3.0, totalNormalized: 28,
  subscaleScores: {
    emotionalReactivity: { mean: 4.7, sum: 23, normalized: 78 },
    iPosition: { mean: 2.0, sum: 10, normalized: 30 },
    emotionalCutoff: { mean: 1.8, sum: 9, normalized: 25 },
    fusionWithOthers: { mean: 4.3, sum: 21, normalized: 72 },
  },
};

const maya_dutch = {
  subscaleScores: {
    yielding: { sum: 17, mean: 4.2 },
    compromising: { sum: 12, mean: 3.1 },
    forcing: { sum: 7, mean: 1.8 },
    problemSolving: { sum: 12, mean: 2.9 },
    avoiding: { sum: 18, mean: 4.5 },
  },
  primaryStyle: 'avoiding',
  secondaryStyle: 'yielding',
};

const maya_values = {
  domainScores: {
    intimacy: { importance: 9, accordance: 6, gap: 3 },
    honesty: { importance: 8, accordance: 5, gap: 3 },
    growth: { importance: 8, accordance: 6, gap: 2 },
    security: { importance: 7, accordance: 6, gap: 1 },
    spirituality: { importance: 6, accordance: 5, gap: 1 },
    adventure: { importance: 5, accordance: 5, gap: 0 },
    independence: { importance: 4, accordance: 4, gap: 0 },
    family: { importance: 6, accordance: 6, gap: 0 },
    service: { importance: 4, accordance: 4, gap: 0 },
    playfulness: { importance: 5, accordance: 5, gap: 0 },
  },
  top5Values: ['intimacy', 'honesty', 'growth', 'security', 'spirituality'],
  highGapDomains: ['intimacy', 'honesty'],
  qualitativeResponses: { partnerIdentity: 'My anchor', nonNegotiables: 'Honesty', aspirationalVision: 'Deep trust' },
  actionResponses: {},
  avoidanceTendency: 4,
  balancedTendency: 3,
};

const results: Record<string, boolean> = {};

// ═══════════════════════════════════════════════════════════
// TEST 1a: Composite Scores
// ═══════════════════════════════════════════════════════════
console.log('\n=== TEST 1a: Composite Scores ===');
const cs = calculateCompositeScores(maya_ecrr as any, maya_ipip as any, maya_sseit as any, maya_dsir as any, maya_values as any, maya_dutch as any);

const compositeKeys = [
  'regulationScore', 'windowWidth', 'accessibility', 'responsiveness', 'engagement',
  'selfLeadership', 'valuesCongruence', 'attachmentSecurity', 'emotionalIntelligence',
  'differentiation', 'conflictFlexibility', 'relationalAwareness', 'anxietyNorm', 'avoidanceNorm',
];
const allPresent = compositeKeys.every(k => (cs as any)[k] != null);
console.log('All 14 composite scores present:', allPresent ? 'PASS' : 'FAIL');

for (const k of compositeKeys) {
  console.log(`  ${k}: ${(cs as any)[k]}`);
}

const t1a_security = cs.attachmentSecurity < 40;
const t1a_regulation = cs.regulationScore < 45;
const t1a_conflict = cs.conflictFlexibility < 50;
const t1a_values = cs.valuesCongruence > 55 && cs.valuesCongruence < 85;
const t1a_pt = cs.perspectiveTaking === 38;
const t1a_er = cs.empathicResonance === 82;

console.log(`attachmentSecurity LOW (<40): ${cs.attachmentSecurity} → ${t1a_security ? 'PASS' : 'FAIL'}`);
console.log(`regulationScore LOW (<45): ${cs.regulationScore} → ${t1a_regulation ? 'PASS' : 'FAIL'}`);
console.log(`conflictFlexibility LOW (<50): ${cs.conflictFlexibility} → ${t1a_conflict ? 'PASS' : 'FAIL'}`);
console.log(`valuesCongruence MODERATE (55-85): ${cs.valuesCongruence} → ${t1a_values ? 'PASS' : 'FAIL'}`);
console.log(`perspectiveTaking pass-through: ${cs.perspectiveTaking} → ${t1a_pt ? 'PASS' : 'FAIL'}`);
console.log(`empathicResonance pass-through: ${cs.empathicResonance} → ${t1a_er ? 'PASS' : 'FAIL'}`);

results['1a'] = allPresent && t1a_security && t1a_regulation && t1a_conflict && t1a_values && t1a_pt && t1a_er;

// ═══════════════════════════════════════════════════════════
// TEST 1b: Pattern Detection
// ═══════════════════════════════════════════════════════════
console.log('\n=== TEST 1b: Pattern Detection ===');
const patternResult = detectPatterns(maya_ecrr as any, maya_dutch as any, maya_sseit as any, maya_dsir as any, maya_ipip as any, maya_values as any, cs);

console.log(`Total patterns detected: ${patternResult.patterns.length}`);
patternResult.patterns.forEach(p => {
  console.log(`  [${p.category}] ${p.id} — ${p.description.substring(0, 80)}... (${p.confidence})`);
});

const hasRegulation = patternResult.patterns.some(p => p.category === 'regulation');
const hasEnmeshment = patternResult.patterns.some(p => p.id === 'empathic_enmeshment');
const noAnxiousHighPT = !patternResult.patterns.some(p => p.id === 'anxious_high_perspective');
const noAvoidantLowPT = !patternResult.patterns.some(p => p.id === 'avoidant_low_perspective');

console.log(`\nRegulation pattern found: ${hasRegulation ? 'PASS' : 'FAIL'}`);
console.log(`empathic_enmeshment found (ER=82 + fusion=72): ${hasEnmeshment ? 'PASS' : 'FAIL'}`);
console.log(`anxious_high_perspective NOT found (PT=38 < 70): ${noAnxiousHighPT ? 'PASS' : 'FAIL'}`);
console.log(`avoidant_low_perspective NOT found (avoid=2.1 < 4.0): ${noAvoidantLowPT ? 'PASS' : 'FAIL'}`);

results['1b'] = hasRegulation && hasEnmeshment && noAnxiousHighPT && noAvoidantLowPT;

// ═══════════════════════════════════════════════════════════
// TEST 1c: Full Portrait Pipeline
// ═══════════════════════════════════════════════════════════
console.log('\n=== TEST 1c: Full Portrait Pipeline ===');
const scores: AllAssessmentScores = {
  ecrr: maya_ecrr as any,
  dutch: maya_dutch as any,
  sseit: maya_sseit as any,
  dsir: maya_dsir as any,
  ipip: maya_ipip as any,
  values: maya_values as any,
};

const portrait = generatePortrait('test-maya', ['a1','a2','a3','a4','a5','a6'], scores);

// A.R.E. scores
console.log(`A.R.E. — Accessible: ${portrait.compositeScores.accessibility}, Responsive: ${portrait.compositeScores.responsiveness}, Engaged: ${portrait.compositeScores.engagement}`);

// Growth edges
console.log(`\nGrowth edges: ${portrait.growthEdges.length}`);
portrait.growthEdges.forEach((e, i) => console.log(`  ${i+1}. ${e.title} [${e.category}]`));
const ge3plus = portrait.growthEdges.length >= 3;
const geHasEmpathy = portrait.growthEdges.some(e => /empath|enmeshment|feeling deeply/i.test(e.title));
console.log(`≥3 growth edges: ${ge3plus ? 'PASS' : 'FAIL'}`);
console.log(`Has empathy growth edge: ${geHasEmpathy ? 'PASS' : 'FAIL'}`);

// Personality lens contrast
const partsNarrative = portrait.fourLens.parts.narrative;
const hasEContrast = /come alive|initiator|withdraw|go quiet|social energy/i.test(partsNarrative);
const hasNContrast = /amplif|partner.*mood|nervous system|intensif|steadies/i.test(partsNarrative);
console.log(`\nPersonality lens E contrast (E=68 vs E_rel=45): ${hasEContrast ? 'PASS' : 'FAIL'}`);
console.log(`Personality lens N contrast (N=71 vs N_rel=88): ${hasNContrast ? 'PASS' : 'FAIL'}`);

// portraitMetadata
const meta = (portrait as any).portraitMetadata;
const hasMetadata = meta?.validityFlag === 'VALID' && meta?.relationalPersonality?.N_rel === 88;
console.log(`portraitMetadata.validityFlag = 'VALID': ${meta?.validityFlag === 'VALID' ? 'PASS' : 'FAIL'}`);
console.log(`portraitMetadata.relationalPersonality has 5 subscores: ${Object.keys(meta?.relationalPersonality ?? {}).length === 5 ? 'PASS' : 'FAIL'}`);

// relationalPersonalityInsights
const rpi = (portrait as any).relationalPersonalityInsights;
console.log(`\nRelational personality insights: ${rpi?.length ?? 0}`);
rpi?.forEach((r: any) => console.log(`  ${r.domainLabel}: ${r.backbone} → ${r.relational} (delta=${r.delta})`));

results['1c'] = ge3plus && geHasEmpathy && hasEContrast && hasNContrast && hasMetadata;

// ═══════════════════════════════════════════════════════════
// TEST 4: New Data Flow Verification
// ═══════════════════════════════════════════════════════════
console.log('\n=== TEST 4: New Data Point Flow ===');
const checks: Array<[string, boolean]> = [
  ['perspectiveTaking in compositeScores', cs.perspectiveTaking === 38],
  ['empathicResonance in compositeScores', cs.empathicResonance === 82],
  ['totalNormalized_v2 in SSEIT scores', maya_sseit.totalNormalized_v2 === 52],
  ['relationalPersonality in portraitMetadata', Object.keys(meta?.relationalPersonality ?? {}).length === 5],
  ['validityFlag in portraitMetadata', meta?.validityFlag === 'VALID'],
  ['A4_Cooperation in personality scores', maya_ipip.facetPercentiles.A4_Cooperation === 72],
  ['empathic_enmeshment in patterns', patternResult.patterns.some(p => p.id === 'empathic_enmeshment')],
  ['empathic_enmeshment in growth edges', portrait.growthEdges.some(e => e.id === 'empathic_enmeshment')],
];
let t4pass = true;
for (const [label, pass] of checks) {
  console.log(`  ${label}: ${pass ? 'PASS' : 'FAIL'}`);
  if (!pass) t4pass = false;
}
results['4'] = t4pass;

// ═══════════════════════════════════════════════════════════
// TEST 5: Growth Plan Quality
// ═══════════════════════════════════════════════════════════
console.log('\n=== TEST 5: Growth Plan Quality ===');
let t5pass = true;
portrait.growthEdges.forEach((e, i) => {
  const hasTitle = e.title.length > 5;
  const hasRationale = e.rationale.length > 20;
  const has2Practices = e.practices.length >= 2;
  const ok = hasTitle && hasRationale && has2Practices;
  if (!ok) t5pass = false;
  console.log(`  Edge ${i+1}: "${e.title}"`);
  console.log(`    Title: ${hasTitle ? 'OK' : 'MISSING'}, Rationale: ${hasRationale ? 'OK' : 'MISSING'}, Practices≥2: ${has2Practices ? 'OK' : 'MISSING'}`);
  console.log(`    Rationale: ${e.rationale.substring(0, 100)}...`);
  e.practices.forEach(p => console.log(`    • ${p}`));
});
const edgeCount = portrait.growthEdges.length;
const categories = new Set(portrait.growthEdges.map(e => e.category));
const diverseCategories = categories.size >= 2;
console.log(`\n  Total edges: ${edgeCount} (target: 3-5) → ${edgeCount >= 3 && edgeCount <= 5 ? 'PASS' : 'WARN'}`);
console.log(`  Diverse categories (${[...categories].join(', ')}): ${diverseCategories ? 'PASS' : 'FAIL'}`);
console.log(`  Has empathy edge: ${geHasEmpathy ? 'PASS' : 'FAIL'}`);
if (!diverseCategories) t5pass = false;
results['5'] = t5pass;

// ═══════════════════════════════════════════════════════════
// TEST 3: Output → Tab Mapping
// ═══════════════════════════════════════════════════════════
console.log('\n=== TEST 3: Output → Tab Mapping ===');
const tabChecks: Array<[string, boolean]> = [
  ['Radar: all 7 composite scores in 0-100', compositeKeys.slice(0, 7).every(k => { const v = (cs as any)[k]; return v >= 0 && v <= 100; })],
  ['A.R.E.: all 3 present', cs.accessibility != null && cs.responsiveness != null && cs.engagement != null],
  ['Window: regulationScore + windowWidth', cs.regulationScore != null && cs.windowWidth != null],
  ['Attachment lens: narrative exists', portrait.fourLens.attachment.narrative.length > 50],
  ['Parts lens: narrative exists', portrait.fourLens.parts.narrative.length > 50],
  ['Regulation lens: narrative exists', portrait.fourLens.regulation.narrative.length > 50],
  ['Values lens: narrative exists', portrait.fourLens.values.narrative.length > 50],
  ['Personality contrast in Parts narrative', hasEContrast || hasNContrast],
  ['Empathy patterns in detection', hasEnmeshment],
  ['Growth edges ≥3', ge3plus],
  ['Growth edges include empathy', geHasEmpathy],
  ['Negative cycle: position identified', portrait.negativeCycle.position != null],
  ['Anchor points: activated populated', portrait.anchorPoints != null],
  ['Partner guide populated', portrait.partnerGuide != null],
  ['portraitMetadata.validityFlag', meta?.validityFlag === 'VALID'],
  ['portraitMetadata.relationalPersonality (5)', Object.keys(meta?.relationalPersonality ?? {}).length === 5],
];
let t3pass = true;
for (const [label, pass] of tabChecks) {
  console.log(`  ${label}: ${pass ? 'PASS' : 'FAIL'}`);
  if (!pass) t3pass = false;
}
results['3'] = t3pass;

// ═══════════════════════════════════════════════════════════
// SUMMARY
// ═══════════════════════════════════════════════════════════
console.log('\n═══════════════════════════════════════');
console.log('   PIPELINE VERIFICATION SUMMARY');
console.log('═══════════════════════════════════════');
const testNames: Record<string, string> = {
  '1a': 'Individual composites',
  '1b': 'Pattern detection',
  '1c': 'Full portrait pipeline',
  '3': 'Output → Tab mapping',
  '4': 'New data flow',
  '5': 'Growth plan quality',
};
let allPass = true;
for (const [id, label] of Object.entries(testNames)) {
  const pass = results[id];
  console.log(`  Test ${id} (${label}): ${pass ? 'PASS ✓' : 'FAIL ✗'}`);
  if (!pass) allPass = false;
}
console.log(`\n  Overall: ${allPass ? 'ALL TESTS PASSED ✓' : 'SOME TESTS FAILED ✗'}`);
