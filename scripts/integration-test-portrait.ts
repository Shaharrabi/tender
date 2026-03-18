/**
 * End-to-End Integration Test: Portrait Generation Pipeline
 *
 * Tests the COMPLETE pipeline from raw scores → composite → patterns → portrait → lenses
 * with clinically meaningful profiles and specific behavioral expectations.
 *
 * Run: npx tsx scripts/integration-test-portrait.ts
 */

import { generatePortrait } from '../utils/portrait/portrait-generator';
import { calculateCompositeScores } from '../utils/portrait/composite-scores';
import { detectPatterns } from '../utils/portrait/pattern-detection';
import { generateDeepCouplePortrait } from '../utils/portrait/couple-portrait-generator';

// ═══════════════════════════════════════════════════════════
// Test harness
// ═══════════════════════════════════════════════════════════
let passed = 0;
let failed = 0;

function check(label: string, condition: boolean, detail?: string) {
  if (condition) {
    console.log(`  ✅ ${label}`);
    passed++;
  } else {
    console.log(`  ❌ ${label}${detail ? ' — ' + detail : ''}`);
    failed++;
  }
}

// ═══════════════════════════════════════════════════════════
// PARTNER A: "The Anxious Pursuer"
// High anxiety (6.5/7), Low avoidance (2.0/7)
// High neuroticism (80th pctl), High empathic resonance (85)
// Low perspective-taking (30), High fusion (75)
// Forcing primary conflict style, High values congruence
// ═══════════════════════════════════════════════════════════

const partnerA_ecrr = {
  anxietyScore: 6.5,       // HIGH anxiety
  avoidanceScore: 2.0,     // LOW avoidance → pursuer pattern
  attachmentStyle: 'anxious-preoccupied' as const,
};

const partnerA_ipip = {
  domainScores: {
    neuroticism: { sum: 48, mean: 4.0 },
    extraversion: { sum: 36, mean: 3.0 },
    openness: { sum: 36, mean: 3.0 },
    agreeableness: { sum: 30, mean: 2.5 },
    conscientiousness: { sum: 36, mean: 3.0 },
  },
  domainPercentiles: {
    neuroticism: 80,        // HIGH — emotional reactivity
    extraversion: 55,
    openness: 50,
    agreeableness: 35,      // Lower — forcing style makes sense
    conscientiousness: 50,
    N: 80, E: 55, O: 50, A: 35, C: 50,  // single-letter keys
  },
  facetScores: {} as Record<string, { sum: number; mean: number }>,
  facetPercentiles: {
    A4_Cooperation: 30,     // LOW cooperation → forcing
  },
};

const partnerA_sseit = {
  totalScore: 60,
  totalMean: 3.75,
  totalNormalized: 62,      // 4-subscale total only
  totalNormalized_v2: 58,
  subscaleScores: {
    perception: { sum: 16, mean: 4.0, itemCount: 4 },
    managingOwn: { sum: 9, mean: 3.0, itemCount: 3 },
    managingOthers: { sum: 14, mean: 3.5, itemCount: 4 },
    utilization: { sum: 18, mean: 3.6, itemCount: 5 },
    perspectiveTaking: { sum: 6, mean: 1.5, itemCount: 4 },
    empathicResonance: { sum: 21, mean: 4.2, itemCount: 5 },
  },
  subscaleNormalized: {
    perception: 75,
    managingOwn: 50,
    managingOthers: 62,
    utilization: 65,
    perspectiveTaking: 30,   // LOW — can't take partner's view
    empathicResonance: 85,   // HIGH — feels everything deeply
  },
};

const partnerA_dsir = {
  totalMean: 3.2,
  totalNormalized: 40,       // Moderate-low differentiation
  subscaleScores: {
    emotionalReactivity: { sum: 25, rawMean: 5.0, reversedMean: 2.0, normalized: 25, itemCount: 5 },
    iPosition: { sum: 15, rawMean: 3.0, reversedMean: 3.0, normalized: 45, itemCount: 5 },
    emotionalCutoff: { sum: 10, rawMean: 2.0, reversedMean: 5.0, normalized: 70, itemCount: 5 },
    fusionWithOthers: { sum: 22, rawMean: 4.4, reversedMean: 2.6, normalized: 25, itemCount: 5 },
  },
};

const partnerA_dutch = {
  subscaleScores: {
    yielding: { sum: 8, mean: 2.0 },
    compromising: { sum: 10, mean: 2.5 },
    forcing: { sum: 18, mean: 4.5 },       // DOMINANT — forcing style
    problemSolving: { sum: 10, mean: 2.5 },
    avoiding: { sum: 8, mean: 2.0 },
  },
  primaryStyle: 'forcing',
  secondaryStyle: 'compromising',
};

const partnerA_values = {
  domainScores: {
    intimacy: { importance: 9, accordance: 8, gap: 1 },
    honesty: { importance: 9, accordance: 8, gap: 1 },
    growth: { importance: 8, accordance: 7, gap: 1 },
    security: { importance: 7, accordance: 6, gap: 1 },
    adventure: { importance: 5, accordance: 5, gap: 0 },
    independence: { importance: 4, accordance: 4, gap: 0 },
    family: { importance: 8, accordance: 7, gap: 1 },
    service: { importance: 5, accordance: 5, gap: 0 },
    playfulness: { importance: 6, accordance: 6, gap: 0 },
    spirituality: { importance: 3, accordance: 3, gap: 0 },
  },
  top5Values: ['intimacy', 'honesty', 'growth', 'family', 'security'],
  qualitativeResponses: {
    partnerIdentity: 'I want someone who is fully present and emotionally available',
    nonNegotiables: 'Emotional honesty and willingness to work on things',
    aspirationalVision: 'A deeply connected partnership where we grow together',
  },
  actionResponses: { s1: 'aligned', s2: 'aligned', s3: 'balanced', s4: 'aligned', s5: 'balanced' },
  avoidanceTendency: 0.0,
  balancedTendency: 0.4,
  highGapDomains: [],        // HIGH congruence — no big gaps
};

// ═══════════════════════════════════════════════════════════
// PARTNER B: "The Avoidant Withdrawer" (OPPOSITE profile)
// Low anxiety (2.0/7), High avoidance (5.5/7)
// Low neuroticism (25th pctl), Low empathic resonance (20)
// High perspective-taking (80), Low fusion (90 = high differentiation)
// Avoiding primary conflict style
// ═══════════════════════════════════════════════════════════

const partnerB_ecrr = {
  anxietyScore: 2.0,
  avoidanceScore: 5.5,
  attachmentStyle: 'dismissive-avoidant' as const,
};

const partnerB_ipip = {
  domainScores: {
    neuroticism: { sum: 18, mean: 1.5 },
    extraversion: { sum: 24, mean: 2.0 },
    openness: { sum: 36, mean: 3.0 },
    agreeableness: { sum: 42, mean: 3.5 },
    conscientiousness: { sum: 42, mean: 3.5 },
  },
  domainPercentiles: {
    neuroticism: 25,
    extraversion: 35,
    openness: 50,
    agreeableness: 65,
    conscientiousness: 60,
    N: 25, E: 35, O: 50, A: 65, C: 60,
  },
  facetScores: {} as Record<string, { sum: number; mean: number }>,
  facetPercentiles: { A4_Cooperation: 70 },
};

const partnerB_sseit = {
  totalScore: 55,
  totalMean: 3.44,
  totalNormalized: 55,
  totalNormalized_v2: 50,
  subscaleScores: {
    perception: { sum: 12, mean: 3.0, itemCount: 4 },
    managingOwn: { sum: 10, mean: 3.33, itemCount: 3 },
    managingOthers: { sum: 12, mean: 3.0, itemCount: 4 },
    utilization: { sum: 16, mean: 3.2, itemCount: 5 },
    perspectiveTaking: { sum: 16, mean: 4.0, itemCount: 4 },
    empathicResonance: { sum: 6, mean: 1.2, itemCount: 5 },
  },
  subscaleNormalized: {
    perception: 50,
    managingOwn: 55,
    managingOthers: 50,
    utilization: 55,
    perspectiveTaking: 80,   // HIGH — cognitive empathy
    empathicResonance: 20,   // LOW — doesn't feel partner's feelings
  },
};

const partnerB_dsir = {
  totalMean: 5.0,
  totalNormalized: 78,       // HIGH differentiation
  subscaleScores: {
    emotionalReactivity: { sum: 10, rawMean: 2.0, reversedMean: 5.0, normalized: 80, itemCount: 5 },
    iPosition: { sum: 22, rawMean: 4.4, reversedMean: 4.4, normalized: 75, itemCount: 5 },
    emotionalCutoff: { sum: 20, rawMean: 4.0, reversedMean: 3.0, normalized: 45, itemCount: 5 },
    fusionWithOthers: { sum: 8, rawMean: 1.6, reversedMean: 5.4, normalized: 90, itemCount: 5 },
  },
};

const partnerB_dutch = {
  subscaleScores: {
    yielding: { sum: 10, mean: 2.5 },
    compromising: { sum: 12, mean: 3.0 },
    forcing: { sum: 6, mean: 1.5 },
    problemSolving: { sum: 10, mean: 2.5 },
    avoiding: { sum: 18, mean: 4.5 },     // DOMINANT — avoiding style
  },
  primaryStyle: 'avoiding',
  secondaryStyle: 'compromising',
};

const partnerB_values = {
  domainScores: {
    intimacy: { importance: 5, accordance: 5, gap: 0 },
    honesty: { importance: 7, accordance: 6, gap: 1 },
    growth: { importance: 6, accordance: 5, gap: 1 },
    security: { importance: 8, accordance: 7, gap: 1 },
    adventure: { importance: 4, accordance: 4, gap: 0 },
    independence: { importance: 9, accordance: 8, gap: 1 },
    family: { importance: 6, accordance: 6, gap: 0 },
    service: { importance: 4, accordance: 4, gap: 0 },
    playfulness: { importance: 5, accordance: 5, gap: 0 },
    spirituality: { importance: 3, accordance: 3, gap: 0 },
  },
  top5Values: ['independence', 'security', 'honesty', 'family', 'growth'],
  qualitativeResponses: {
    partnerIdentity: 'I need someone who respects my space and independence',
    nonNegotiables: 'Personal autonomy and not being smothered',
    aspirationalVision: 'A calm, stable partnership with room for individual growth',
  },
  actionResponses: { s1: 'avoidance', s2: 'balanced', s3: 'avoidance', s4: 'balanced', s5: 'avoidance' },
  avoidanceTendency: 0.6,
  balancedTendency: 0.4,
  highGapDomains: [],
};


// ═══════════════════════════════════════════════════════════
// TEST 1: Individual Portrait — Partner A (Anxious Pursuer)
// ═══════════════════════════════════════════════════════════
console.log('\n═══════════════════════════════════════════════════');
console.log('  TEST 1: Individual Portrait — Anxious Pursuer');
console.log('═══════════════════════════════════════════════════\n');

const scoresA = {
  ecrr: partnerA_ecrr,
  dutch: partnerA_dutch,
  sseit: partnerA_sseit,
  dsir: partnerA_dsir,
  ipip: partnerA_ipip,
  values: partnerA_values,
};

// Step 1: Composite scores
console.log('── Composite Scores ──');
let compositesA: any;
try {
  compositesA = calculateCompositeScores(
    partnerA_ecrr, partnerA_ipip as any, partnerA_sseit, partnerA_dsir, partnerA_values, partnerA_dutch,
  );
  check('calculateCompositeScores succeeds', true);
} catch (err: any) {
  check('calculateCompositeScores succeeds', false, err.message);
  process.exit(1);
}

// Print all composites
const compositeKeys = [
  'regulationScore', 'windowWidth', 'accessibility', 'responsiveness',
  'engagement', 'selfLeadership', 'valuesCongruence',
  'attachmentSecurity', 'emotionalIntelligence', 'differentiation',
  'conflictFlexibility', 'relationalAwareness', 'anxietyNorm', 'avoidanceNorm',
];
console.log('\n  Composite values:');
for (const k of compositeKeys) {
  console.log(`    ${k}: ${compositesA[k]}`);
}

// Clinical expectations
check('attachmentSecurity is LOW (<40)', compositesA.attachmentSecurity < 40,
  `got ${compositesA.attachmentSecurity}`);
check('windowWidth is NARROW (<45)', compositesA.windowWidth < 45,
  `got ${compositesA.windowWidth}`);
check('conflictFlexibility is below average (<65)', compositesA.conflictFlexibility < 65,
  `got ${compositesA.conflictFlexibility}`);
check('anxietyNorm is HIGH (>70)', compositesA.anxietyNorm > 70,
  `got ${compositesA.anxietyNorm}`);
check('avoidanceNorm is LOW (<30)', compositesA.avoidanceNorm < 30,
  `got ${compositesA.avoidanceNorm}`);

// Step 2: Pattern detection
console.log('\n── Pattern Detection ──');
let patternsA: any;
try {
  patternsA = detectPatterns(
    partnerA_ecrr, partnerA_dutch, partnerA_sseit, partnerA_dsir,
    partnerA_ipip as any, partnerA_values, compositesA,
  );
  check('detectPatterns succeeds', true);
} catch (err: any) {
  check('detectPatterns succeeds', false, err.message);
  process.exit(1);
}

console.log('\n  Detected patterns:');
for (const p of patternsA.patterns) {
  console.log(`    [${p.category}] ${p.id}: ${p.label} (severity: ${p.severity})`);
}
console.log(`  Priority flags: ${patternsA.priorityFlags.join(', ') || '(none)'}`);
console.log(`  Has regulation priority: ${patternsA.hasRegulationPriority}`);

// Check for anxious attachment pattern
const patternIds = patternsA.patterns.map((p: any) => p.id);
const patternLabels = patternsA.patterns.map((p: any) => p.label?.toLowerCase() || '');
const allPatternText = [...patternIds, ...patternLabels, ...patternsA.priorityFlags].join(' ').toLowerCase();

check('Pattern detector flags regulation or anxious-related pattern',
  allPatternText.includes('anxious') || allPatternText.includes('pursue') ||
  allPatternText.includes('flooding') || allPatternText.includes('regulation') ||
  allPatternText.includes('reactive'),
  `patterns: ${patternIds.join(', ')}`);

// Step 3: Full portrait generation
console.log('\n── Full Portrait Generation ──');
let portraitA: any;
try {
  portraitA = generatePortrait('test-user-a', ['mock-1', 'mock-2', 'mock-3', 'mock-4', 'mock-5', 'mock-6'], scoresA);
  check('generatePortrait succeeds', true);
} catch (err: any) {
  check('generatePortrait succeeds', false, err.message);
  process.exit(1);
}

// Verify all lenses generated content
check('fourLens.attachment exists', !!portraitA.fourLens?.attachment);
check('fourLens.parts exists', !!portraitA.fourLens?.parts);
check('fourLens.regulation exists', !!portraitA.fourLens?.regulation);
check('fourLens.values exists', !!portraitA.fourLens?.values);

// Verify negativeCycle
check('negativeCycle.position exists', !!portraitA.negativeCycle?.position);
check('negativeCycle indicates pursuer-like',
  ['pursuer', 'mixed'].includes(portraitA.negativeCycle?.position),
  `got position: ${portraitA.negativeCycle?.position}`);

// Verify growthEdges
check('growthEdges has at least 1 edge', Array.isArray(portraitA.growthEdges) && portraitA.growthEdges.length > 0,
  `got ${portraitA.growthEdges?.length}`);

// Verify version
check('version exists', typeof portraitA.version === 'string' && portraitA.version.length > 0);

// CRITICAL: No assessment acronyms in portrait text
console.log('\n── Copyright/Branding Check ──');
const portraitJSON = JSON.stringify(portraitA).toLowerCase();
check('Portrait does NOT contain "ipip"', !portraitJSON.includes('"ipip"'));
check('Portrait does NOT contain "sseit"', !portraitJSON.includes('"sseit"'));
check('Portrait does NOT contain "dutch"', !portraitJSON.includes('"dutch"'));
check('Portrait does NOT contain "dsi-r"', !portraitJSON.includes('"dsi-r"'));
check('Portrait does NOT contain "ipip-neo"', !portraitJSON.includes('ipip-neo'));


// ═══════════════════════════════════════════════════════════
// TEST 2: Individual Portrait — Partner B (Avoidant Withdrawer)
// ═══════════════════════════════════════════════════════════
console.log('\n═══════════════════════════════════════════════════');
console.log('  TEST 2: Individual Portrait — Avoidant Withdrawer');
console.log('═══════════════════════════════════════════════════\n');

const scoresB = {
  ecrr: partnerB_ecrr,
  dutch: partnerB_dutch,
  sseit: partnerB_sseit,
  dsir: partnerB_dsir,
  ipip: partnerB_ipip,
  values: partnerB_values,
};

let compositesB: any;
let portraitB: any;

try {
  compositesB = calculateCompositeScores(
    partnerB_ecrr, partnerB_ipip as any, partnerB_sseit, partnerB_dsir, partnerB_values, partnerB_dutch,
  );
  check('Partner B composites succeed', true);

  check('Partner B attachmentSecurity is higher than A',
    compositesB.attachmentSecurity > compositesA.attachmentSecurity,
    `B=${compositesB.attachmentSecurity} vs A=${compositesA.attachmentSecurity}`);

  portraitB = generatePortrait('test-user-b', ['mock-7', 'mock-8', 'mock-9', 'mock-10', 'mock-11', 'mock-12'], scoresB);
  check('Partner B portrait succeeds', true);

  check('Partner B negativeCycle indicates withdrawer-like',
    ['withdrawer', 'mixed'].includes(portraitB.negativeCycle?.position),
    `got position: ${portraitB.negativeCycle?.position}`);
} catch (err: any) {
  check('Partner B pipeline succeeds', false, err.message);
}


// ═══════════════════════════════════════════════════════════
// TEST 3: Couple Portrait — Pursue-Withdraw Detection
// ═══════════════════════════════════════════════════════════
console.log('\n═══════════════════════════════════════════════════');
console.log('  TEST 3: Couple Portrait — Pursue-Withdraw');
console.log('═══════════════════════════════════════════════════\n');

// Minimal dyadic scores (no actual couple assessments taken)
const emptyDyadic = {};

try {
  const couplePortrait = generateDeepCouplePortrait(
    'test-couple-1',
    portraitA,
    portraitB,
    'Alex',
    'Jordan',
    emptyDyadic,
  );
  check('generateDeepCouplePortrait succeeds', true);

  // Check the combined cycle
  const dynamic = couplePortrait.patternInterlock?.combinedCycle?.dynamic;
  console.log(`\n  Combined cycle dynamic: ${dynamic}`);
  console.log(`  Partner A position: ${couplePortrait.patternInterlock?.combinedCycle?.partnerAPosition}`);
  console.log(`  Partner B position: ${couplePortrait.patternInterlock?.combinedCycle?.partnerBPosition}`);

  check('Couple dynamic is pursue-withdraw',
    dynamic === 'pursue-withdraw',
    `got: ${dynamic}`);

  check('Alex (A) is pursuer',
    couplePortrait.patternInterlock?.combinedCycle?.partnerAPosition === 'pursuer',
    `got: ${couplePortrait.patternInterlock?.combinedCycle?.partnerAPosition}`);

  check('Jordan (B) is withdrawer',
    couplePortrait.patternInterlock?.combinedCycle?.partnerBPosition === 'withdrawer',
    `got: ${couplePortrait.patternInterlock?.combinedCycle?.partnerBPosition}`);

  // Verify couple portrait has key sections
  check('relationalField exists', !!couplePortrait.relationalField);
  check('convergenceDivergence exists', !!couplePortrait.convergenceDivergence);
  check('coupleGrowthEdges has items', Array.isArray(couplePortrait.coupleGrowthEdges) && couplePortrait.coupleGrowthEdges.length > 0);

  // Print interlock description
  if (couplePortrait.patternInterlock?.combinedCycle?.interlockDescription) {
    console.log(`\n  Interlock: ${couplePortrait.patternInterlock.combinedCycle.interlockDescription.slice(0, 200)}...`);
  }

  // Print narrative snippet (may be string or object)
  const narrativeText = typeof couplePortrait.narrative === 'string'
    ? couplePortrait.narrative
    : JSON.stringify(couplePortrait.narrative);
  if (narrativeText) {
    console.log(`\n  Narrative: ${narrativeText.slice(0, 200)}...`);
  }
} catch (err: any) {
  check('generateDeepCouplePortrait succeeds', false, err.message);
  console.error('  Error:', err.stack?.split('\n').slice(0, 5).join('\n'));
}


// ═══════════════════════════════════════════════════════════
// SUMMARY
// ═══════════════════════════════════════════════════════════
console.log('\n' + '═'.repeat(50));
console.log(`  RESULTS: ${passed} passed, ${failed} failed`);
console.log('═'.repeat(50));

if (failed > 0) {
  console.log('  ⚠️  Some checks failed. Review output above.\n');
  process.exit(1);
} else {
  console.log('  🎉 All integration checks passed!\n');
  process.exit(0);
}
