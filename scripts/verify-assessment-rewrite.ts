/**
 * Assessment Rewrite Verification Script
 * Validates all scoring functions produce correct output shapes after the rewrite.
 * Run with: npx tsx scripts/verify-assessment-rewrite.ts
 */

// ─── Imports ────────────────────────────────────────────────
import { ecrRConfig } from '../utils/assessments/configs/ecr-r';
import { tenderPersonality60Config } from '../utils/assessments/configs/tender-personality-60';
import { sseitConfig } from '../utils/assessments/configs/sseit';
import { dsirConfig } from '../utils/assessments/configs/dsi-r';
import { dutchConfig } from '../utils/assessments/configs/dutch';
import { valuesConfig } from '../utils/assessments/configs/values';
import { relationalFieldConfig } from '../utils/assessments/configs/relational-field';
import { calculateCompositeScores } from '../utils/portrait/composite-scores';

let passed = 0;
let failed = 0;

function check(label: string, condition: boolean, detail?: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${label}`);
    passed++;
  } else {
    console.log(`  ❌ FAIL: ${label}${detail ? ' — ' + detail : ''}`);
    failed++;
  }
}

function inRange(val: number, min: number, max: number): boolean {
  return typeof val === 'number' && !isNaN(val) && val >= min && val <= max;
}

// ═══════════════════════════════════════════════════════════
// 1. ECR-R (36 items, 7-point Likert)
// ═══════════════════════════════════════════════════════════
console.log('\n═══ ECR-R (Attachment) ═══');
const ecrMid = Array(36).fill(4); // midpoint = 4 on 1-7 scale
const ecrScores = ecrRConfig.scoringFn(ecrMid);

check('anxietyScore exists and in range [1,7]', inRange(ecrScores.anxietyScore, 1, 7), `got ${ecrScores.anxietyScore}`);
check('avoidanceScore exists and in range [1,7]', inRange(ecrScores.avoidanceScore, 1, 7), `got ${ecrScores.avoidanceScore}`);
check('attachmentStyle is valid enum', ['secure', 'anxious-preoccupied', 'dismissive-avoidant', 'fearful-avoidant'].includes(ecrScores.attachmentStyle), `got ${ecrScores.attachmentStyle}`);

// Verify midpoint produces moderate scores (not pegged to extremes)
check('anxietyScore is moderate at midpoint', ecrScores.anxietyScore > 2 && ecrScores.anxietyScore < 6, `got ${ecrScores.anxietyScore}`);
check('avoidanceScore is moderate at midpoint', ecrScores.avoidanceScore > 2 && ecrScores.avoidanceScore < 6, `got ${ecrScores.avoidanceScore}`);

// ═══════════════════════════════════════════════════════════
// 2. Tender Personality-60 (62 items, 5-point Likert)
// ═══════════════════════════════════════════════════════════
console.log('\n═══ Tender Personality-60 ═══');
const persMid = Array(62).fill(3); // midpoint = 3 on 1-5 scale
const persScores = tenderPersonality60Config.scoringFn(persMid);

// Full-name domain keys
const fullDomains = ['neuroticism', 'extraversion', 'openness', 'agreeableness', 'conscientiousness'];
for (const d of fullDomains) {
  check(`domainPercentiles.${d} exists`, persScores.domainPercentiles?.[d] !== undefined, `got ${persScores.domainPercentiles?.[d]}`);
  check(`domainPercentiles.${d} in range [1,99]`, inRange(persScores.domainPercentiles?.[d], 1, 99));
}

// Single-letter domain keys (integration engine bug fix)
const letterKeys = ['N', 'E', 'O', 'A', 'C'];
for (const k of letterKeys) {
  check(`domainPercentiles.${k} exists`, persScores.domainPercentiles?.[k] !== undefined);
}
check('N matches neuroticism', persScores.domainPercentiles?.N === persScores.domainPercentiles?.neuroticism);
check('E matches extraversion', persScores.domainPercentiles?.E === persScores.domainPercentiles?.extraversion);

// A4_Cooperation
check('facetPercentiles.A4_Cooperation exists', persScores.facetPercentiles?.A4_Cooperation !== undefined, `got ${persScores.facetPercentiles?.A4_Cooperation}`);
check('A4_Cooperation in range [1,99]', inRange(persScores.facetPercentiles?.A4_Cooperation, 1, 99));

// Relational personality
const relKeys = ['N_rel', 'E_rel', 'A_rel', 'C_rel', 'O_rel'];
for (const k of relKeys) {
  check(`relationalPersonality.${k} exists`, persScores.relationalPersonality?.[k] !== undefined);
  check(`relationalPersonality.${k} in range [1,99]`, inRange(persScores.relationalPersonality?.[k], 1, 99));
}

// Validity flag
check('validityFlag exists', persScores.validityFlag !== undefined);
check('validityFlag is VALID or POSSIBLE_BIAS', ['VALID', 'POSSIBLE_BIAS'].includes(persScores.validityFlag));

// Validity trigger test: V1=4 (agree with "never frustrated") should flag
const persFlag = Array(62).fill(3);
persFlag[60] = 4; // V1 high → should flag
const flagScores = tenderPersonality60Config.scoringFn(persFlag);
check('V1=4 triggers POSSIBLE_BIAS', flagScores.validityFlag === 'POSSIBLE_BIAS');

// Validity clean test: V1=1, V2=4
const persClean = Array(62).fill(3);
persClean[60] = 1; // V1=1 (ok)
persClean[61] = 4; // V2=4 (ok)
const cleanScores = tenderPersonality60Config.scoringFn(persClean);
check('V1=1, V2=4 → VALID', cleanScores.validityFlag === 'VALID');

// ═══════════════════════════════════════════════════════════
// 3. SSEIT (25 items, 5-point Likert) — totalNormalized backward compat
// ═══════════════════════════════════════════════════════════
console.log('\n═══ SSEIT (Emotional Intelligence) ═══');
const sseitMid = Array(25).fill(3);
const sseitScores = sseitConfig.scoringFn(sseitMid);

check('totalNormalized exists', sseitScores.totalNormalized !== undefined, `got ${sseitScores.totalNormalized}`);
check('totalNormalized in range [0,100]', inRange(sseitScores.totalNormalized, 0, 100));
check('totalNormalized_v2 exists', sseitScores.totalNormalized_v2 !== undefined, `got ${sseitScores.totalNormalized_v2}`);

// Key check: perspectiveTaking and empathicResonance subscales
check('perspectiveTaking subscale exists', sseitScores.subscaleNormalized?.perspectiveTaking !== undefined);
check('empathicResonance subscale exists', sseitScores.subscaleNormalized?.empathicResonance !== undefined);

// CRITICAL: totalNormalized must NOT change when PT/ER scores change
// Set PT/ER items to extreme values while keeping original 4 subscales at midpoint
const sseitControl = Array(25).fill(3); // all midpoint
const sseitPTHigh = Array(25).fill(3);
// PT items are indices 16-19, ER items are 20-24
for (let i = 16; i <= 24; i++) sseitPTHigh[i] = 5; // max out PT + ER

const controlScores = sseitConfig.scoringFn(sseitControl);
const ptHighScores = sseitConfig.scoringFn(sseitPTHigh);

check(
  'totalNormalized is SAME when PT/ER change (backward compat)',
  controlScores.totalNormalized === ptHighScores.totalNormalized,
  `control=${controlScores.totalNormalized}, ptHigh=${ptHighScores.totalNormalized}`
);
check(
  'totalNormalized_v2 DIFFERS when PT/ER change',
  controlScores.totalNormalized_v2 !== ptHighScores.totalNormalized_v2,
  `control=${controlScores.totalNormalized_v2}, ptHigh=${ptHighScores.totalNormalized_v2}`
);

// Original 4 subscales present
for (const sub of ['perception', 'managingOwn', 'managingOthers', 'utilization']) {
  check(`subscaleNormalized.${sub} exists`, sseitScores.subscaleNormalized?.[sub] !== undefined);
}

// ═══════════════════════════════════════════════════════════
// 4. DSI-R (20 items, 6-point Likert) — double-reversal
// ═══════════════════════════════════════════════════════════
console.log('\n═══ DSI-R (Differentiation of Self) ═══');
const dsirMid = Array(20).fill(3); // midpoint on 1-6
const dsirScores = dsirConfig.scoringFn(dsirMid);

check('totalNormalized exists', dsirScores.totalNormalized !== undefined, `got ${dsirScores.totalNormalized}`);
check('totalNormalized in range [0,100]', inRange(dsirScores.totalNormalized, 0, 100));

// Subscales
for (const sub of ['emotionalReactivity', 'iPosition', 'emotionalCutoff', 'fusionWithOthers']) {
  check(`subscaleScores.${sub} exists`, dsirScores.subscaleScores?.[sub] !== undefined);
}

// High differentiation test: max agree (6) on all items
// Person who answers 6 to everything should get high-ish total (due to double reversal)
const dsirMax = Array(20).fill(6);
const dsirMaxScores = dsirConfig.scoringFn(dsirMax);
check('max-agree totalNormalized is valid', inRange(dsirMaxScores.totalNormalized, 0, 100), `got ${dsirMaxScores.totalNormalized}`);

// Low differentiation test: min agree (1) on all items
const dsirMin = Array(20).fill(1);
const dsirMinScores = dsirConfig.scoringFn(dsirMin);
check('min-agree totalNormalized is valid', inRange(dsirMinScores.totalNormalized, 0, 100), `got ${dsirMinScores.totalNormalized}`);

// ═══════════════════════════════════════════════════════════
// 5. DUTCH (20 items, 5-point Likert)
// ═══════════════════════════════════════════════════════════
console.log('\n═══ DUTCH (Conflict Style) ═══');
const dutchMid = Array(20).fill(3);
const dutchScores = dutchConfig.scoringFn(dutchMid);

const dutchSubs = ['yielding', 'compromising', 'forcing', 'problemSolving', 'avoiding'];
for (const sub of dutchSubs) {
  check(`subscaleScores.${sub} exists`, dutchScores.subscaleScores?.[sub] !== undefined);
  check(`${sub}.mean in range [1,5]`, inRange(dutchScores.subscaleScores?.[sub]?.mean, 1, 5));
}
check('primaryStyle exists', typeof dutchScores.primaryStyle === 'string' && dutchScores.primaryStyle.length > 0);
check('secondaryStyle exists', typeof dutchScores.secondaryStyle === 'string' && dutchScores.secondaryStyle.length > 0);

// 4-item denominator check: with all 3s, mean should be exactly 3.0 (sum=12, /4=3.0)
check('subscale means are 3.0 at midpoint (4-item denominator)',
  dutchSubs.every(s => dutchScores.subscaleScores?.[s]?.mean === 3),
  `got: ${dutchSubs.map(s => `${s}=${dutchScores.subscaleScores?.[s]?.mean}`).join(', ')}`
);

// ═══════════════════════════════════════════════════════════
// 6. VALUES (28 items, mixed types)
// ═══════════════════════════════════════════════════════════
console.log('\n═══ VALUES ═══');
// Build a realistic mock: 20 numeric + 1 ranking + 2 text + 5 choices
const valuesMock: (number | string | string[] | null)[] = [
  // Q1-20: importance/accordance pairs (1-10 scale), 2 per domain × 10 domains
  7, 6, 8, 5, 6, 7, 9, 4, 5, 8, 7, 6, 8, 7, 6, 5, 7, 8, 6, 7,
  // Q21: ranking (top 5 domain IDs)
  ['intimacy', 'honesty', 'growth', 'security', 'adventure'],
  // Q22-23: open text
  'My partner and I value honesty above all',
  'We never compromise on respect',
  // Q24-28: scenario choices
  'B', 'A', 'C', 'B', 'A',
];
const valuesScores = valuesConfig.scoringFn(valuesMock);

check('domainScores exists', valuesScores.domainScores !== undefined);
check('top5Values has 5 items', Array.isArray(valuesScores.top5Values) && valuesScores.top5Values.length === 5);
check('qualitativeResponses.partnerIdentity exists', typeof valuesScores.qualitativeResponses?.partnerIdentity === 'string');
check('avoidanceTendency in range [0,1]', inRange(valuesScores.avoidanceTendency, 0, 1));

// ═══════════════════════════════════════════════════════════
// 7. Relational Field (20 items, 7-point Likert)
// ═══════════════════════════════════════════════════════════
console.log('\n═══ Relational Field ═══');
const rfMid = Array(20).fill(4);
const rfScores = relationalFieldConfig.scoringFn(rfMid);

check('totalScore exists', rfScores.totalScore !== undefined);
check('totalMean in range [1,7]', inRange(rfScores.totalMean, 1, 7));
for (const sub of ['fieldRecognition', 'creativeTension', 'presenceAttunement', 'emergentOrientation']) {
  check(`${sub} exists`, rfScores[sub] !== undefined);
  check(`${sub}.mean in range [1,7]`, inRange(rfScores[sub]?.mean, 1, 7));
}

// ═══════════════════════════════════════════════════════════
// 8. Composite Scores — feed all scoring outputs through
// ═══════════════════════════════════════════════════════════
console.log('\n═══ Composite Scores (Integration) ═══');
try {
  const composites = calculateCompositeScores(
    ecrScores,
    persScores as any, // TenderPersonality60Scores → IPIPScores shape (backward compat)
    sseitScores,
    dsirScores,
    valuesScores,
    dutchScores,
  );
  check('calculateCompositeScores did not throw', true);

  const compositeKeys = [
    'regulationScore', 'windowWidth', 'accessibility', 'responsiveness',
    'engagement', 'selfLeadership', 'valuesCongruence',
    'attachmentSecurity', 'emotionalIntelligence', 'differentiation',
    'conflictFlexibility', 'relationalAwareness',
    'anxietyNorm', 'avoidanceNorm',
  ];

  for (const key of compositeKeys) {
    check(`composites.${key} exists and in [0,100]`, inRange((composites as any)[key], 0, 100), `got ${(composites as any)[key]}`);
  }
} catch (err: any) {
  check('calculateCompositeScores did not throw', false, err.message);
}

// ═══════════════════════════════════════════════════════════
// SUMMARY
// ═══════════════════════════════════════════════════════════
console.log('\n' + '═'.repeat(50));
console.log(`  RESULTS: ${passed} passed, ${failed} failed`);
console.log('═'.repeat(50));

if (failed > 0) {
  process.exit(1);
} else {
  console.log('  🎉 All checks passed!\n');
  process.exit(0);
}
