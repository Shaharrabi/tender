/**
 * Demo Data Seeder — Generates realistic assessment scores for demo mode.
 *
 * Seeds all 6 individual assessments into Supabase so the full app
 * experience (results, portrait, growth plan, unlock states) is visible.
 *
 * Profile: Anxious-preoccupied attachment, moderate regulation,
 * high engagement, values-behavior gaps. Typical "pursuer" profile.
 */

import { supabase } from '@/services/supabase';
import type {
  ECRRScores,
  DUTCHScores,
  SSEITScores,
  DSIRScores,
  IPIPScores,
  ValuesScores,
} from '@/types';
import type { SupplementScores } from '@/types/portrait';
import type { WEAREProfile, WeeklyCheckIn } from '@/types/weare';

// ─── Assessment Scores ──────────────────────────────────

export const DEMO_ECRR: ECRRScores = {
  anxietyScore: 4.8,
  avoidanceScore: 2.9,
  attachmentStyle: 'anxious-preoccupied',
};

export const DEMO_DUTCH: DUTCHScores = {
  subscaleScores: {
    yielding: { sum: 18, mean: 3.6 },
    compromising: { sum: 19, mean: 3.8 },
    forcing: { sum: 12, mean: 2.4 },
    avoiding: { sum: 17, mean: 3.4 },
    problemSolving: { sum: 20, mean: 4.0 },
  },
  primaryStyle: 'problemSolving',
  secondaryStyle: 'compromising',
};

export const DEMO_SSEIT: SSEITScores = {
  totalScore: 118,
  totalMean: 3.6,
  totalNormalized: 64,
  subscaleScores: {
    perception: { sum: 38, mean: 3.8, itemCount: 10 },
    managingOwn: { sum: 28, mean: 3.5, itemCount: 8 },
    managingOthers: { sum: 30, mean: 3.75, itemCount: 8 },
    utilization: { sum: 22, mean: 3.67, itemCount: 6 },
  },
  subscaleNormalized: {
    perception: 70,
    managingOwn: 52,
    managingOthers: 62,
    utilization: 58,
  },
};

export const DEMO_DSIR: DSIRScores = {
  totalMean: 3.4,
  totalNormalized: 48,
  subscaleScores: {
    emotionalReactivity: {
      sum: 55, rawMean: 3.1, reversedMean: 3.1, normalized: 42, itemCount: 11,
    },
    iPosition: {
      sum: 42, rawMean: 3.5, reversedMean: 3.5, normalized: 50, itemCount: 11,
    },
    emotionalCutoff: {
      sum: 48, rawMean: 3.2, reversedMean: 3.2, normalized: 44, itemCount: 11,
    },
    fusionWithOthers: {
      sum: 40, rawMean: 2.9, reversedMean: 2.9, normalized: 38, itemCount: 11,
    },
  },
};

export const DEMO_IPIP: IPIPScores = {
  domainScores: {
    neuroticism: { sum: 80, mean: 3.3 },
    extraversion: { sum: 78, mean: 3.25 },
    openness: { sum: 85, mean: 3.54 },
    agreeableness: { sum: 90, mean: 3.75 },
    conscientiousness: { sum: 82, mean: 3.42 },
  },
  domainPercentiles: {
    neuroticism: 65,
    extraversion: 55,
    openness: 60,
    agreeableness: 70,
    conscientiousness: 58,
  },
  facetScores: {},
  facetPercentiles: {},
};

export const DEMO_VALUES: ValuesScores = {
  domainScores: {
    honesty: { importance: 8.5, accordance: 6.0, gap: 2.5 },
    intimacy: { importance: 9.5, accordance: 6.5, gap: 3.0 },
    growth: { importance: 8.0, accordance: 6.5, gap: 1.5 },
    security: { importance: 7.0, accordance: 7.0, gap: 0 },
    adventure: { importance: 6.0, accordance: 5.0, gap: 1.0 },
    independence: { importance: 6.5, accordance: 5.5, gap: 1.0 },
    family: { importance: 7.5, accordance: 7.0, gap: 0.5 },
    service: { importance: 5.0, accordance: 4.5, gap: 0.5 },
    playfulness: { importance: 7.0, accordance: 5.0, gap: 2.0 },
    spirituality: { importance: 5.5, accordance: 5.0, gap: 0.5 },
  },
  top5Values: ['Intimacy', 'Honesty', 'Growth', 'Family', 'Security'],
  qualitativeResponses: {
    partnerIdentity: 'Someone who makes me feel safe enough to be myself.',
    nonNegotiables: 'Emotional honesty and willingness to grow together.',
    aspirationalVision: 'A relationship where we can be fully honest and still feel loved.',
  },
  actionResponses: {},
  avoidanceTendency: 0.3,
  balancedTendency: 0.5,
  highGapDomains: ['intimacy', 'honesty', 'playfulness'],
};

// ─── Phase 3: Demo Supplement Scores ────────────────────

/**
 * Demo supplement data for the anxious-preoccupied pursuer profile.
 * High somatic awareness, moderate cycle awareness, low fixed story (reverse-scored),
 * strong field sensitivity, low boundary clarity, values divergence as threat.
 */
export const DEMO_SUPPLEMENTS: SupplementScores = {
  ecrr: {
    somaticAwareness: 6,        // High — feels disconnection in body first
    fixedStory: 3,              // Reverse-scored: low = has a fixed narrative about partner
    cycleAwareness: 5,          // Can sometimes step back and see the pattern
    certaintyVsCuriosity: 3,    // Reverse-scored: low = more certainty than curiosity
    needsAsInformation: 5,      // Sees needs as valid information
    patternAwarenessMean: 4.4,
  },
  sseit: {
    roomSensing: 6,             // Strong room-reading ability
    relationalShiftAwareness: 6, // Picks up on relational shifts quickly
    emotionDifferentiation: 3,  // Struggles to distinguish own vs partner's emotions
    fieldSensitivityMean: 5.0,
  },
  dsir: {
    closenessWithIdentity: 4,
    disagreementWithConnection: 3,
    emotionalBoundaryClarity: 3,
    boundaryWithoutGuilt: 3,
    boundaryAwarenessMean: 3.25,
  },
  values: {
    valuesDivergenceResponse: 'threat',
    differenceAsResource: 'I know our differences could help us, but in the moment they feel scary.',
    rightVsPresent: 3,          // Leans toward being right about values
    sharedValue: 'Growth — we both want to become better versions of ourselves.',
    willingnessToChange: 5,
  },
};

// ─── Demo WEARE Profile (Phase 4) ───────────────────────

export const DEMO_WEARE_PROFILE: WEAREProfile = {
  variables: {
    attunement: { raw: 7.0, confidence: 0.8, sources: ['rfas-fieldRecognition', 'rfas-presenceAttunement', 'ecr-r-supp-somatic', 'sseit-supp-roomSensing'] },
    coCreation: { raw: 5.0, confidence: 0.7, sources: ['rfas-creativeTension', 'values-supp-divergence', 'cfa-learningFromPartner'] },
    transmission: { raw: 3.0, confidence: 0.5, sources: ['behavioral-completion', 'behavioral-repetition', 'cfa-willingnessToBeChanged'] },
    space: { raw: 5.0, confidence: 0.6, sources: ['dsir-total', 'dsir-supp-boundaryAwareness'] },
    time: { raw: 5.0, confidence: 0.4, sources: ['behavioral-streak', 'behavioral-sessionConsistency'] },
    individual: { raw: 7.0, confidence: 0.9, sources: ['sseit-totalNormalized', 'composite-windowWidth', 'dsir-reactivity-inv', 'ipip-composite'] },
    context: { raw: 4.0, confidence: 0.8, sources: ['checkin-stress-inv', 'checkin-support'] },
    change: { raw: 5.0, confidence: 0.5, sources: ['rfas-emergentOrientation', 'behavioral-stepProgression', 'values-supp-willingnessToChange'] },
    resistance: { raw: 6.0, confidence: 0.7, sources: ['ecr-r-supp-fixedStory-inv', 'ecr-r-supp-certainty-inv', 'ipip-openness-inv', 'dutch-ipip-rigidity'] },
  },
  layers: {
    resonancePulse: 50,         // (7+5+3)/30 * 100 = 50
    emergenceDirection: -1,     // 5-6 = -1
    overall: 42,
  },
  bottleneck: {
    variable: 'resistance',
    label: 'Letting Go',
    value: 6.0,
    description: 'Some resistance to change is present. This is normal \u2014 the protective system needs to feel safe before it can let go. Small experiments with flexibility help.',
    recommendedPractices: ['defusion-from-stories', 'radical-acceptance', 'unified-detachment', 'accessing-primary-emotions'],
  },
  movementPhase: 'release',
  movementNarrative: 'You are beginning to let go of old protective patterns. This takes courage \u2014 the nervous system sometimes resists even when the mind is ready. Be patient with the process. The place where growth is most available right now is letting go.',
  warmSummary: 'Finding its way',
  dataMode: 'preliminary',
  calculatedAt: new Date().toISOString(),
};

export const DEMO_WEEKLY_CHECKIN: Omit<WeeklyCheckIn, 'id' | 'createdAt'> = {
  userId: '',          // filled at runtime
  coupleId: '',        // filled at runtime
  weekOf: new Date().toISOString().split('T')[0],
  externalStressLevel: 6,
  supportSystemRating: 4,
  relationshipSatisfaction: 5,
  practiceHighlight: 'The grounding exercise helped me stay present during a difficult conversation.',
};

// ─── Seeder Function ────────────────────────────────────

/**
 * Seeds all 6 demo assessment records into Supabase for the given user.
 * Returns the IDs of the created records.
 */
export async function seedDemoAssessments(userId: string): Promise<string[]> {
  const assessments = [
    { type: 'ecr-r', scores: DEMO_ECRR },
    { type: 'dutch', scores: DEMO_DUTCH },
    { type: 'sseit', scores: DEMO_SSEIT },
    { type: 'dsi-r', scores: DEMO_DSIR },
    { type: 'ipip-neo-120', scores: DEMO_IPIP },
    { type: 'values', scores: DEMO_VALUES },
  ];

  const ids: string[] = [];

  for (const assessment of assessments) {
    const { data, error } = await supabase
      .from('assessments')
      .insert({
        user_id: userId,
        type: assessment.type,
        responses: [],  // Demo mode — no raw responses
        scores: assessment.scores,
        completed_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (error) {
      console.error(`Failed to seed ${assessment.type}:`, error);
      continue;
    }
    if (data) ids.push(data.id);
  }

  return ids;
}

/**
 * Removes all demo assessment records for the given user.
 */
export async function clearDemoAssessments(userId: string): Promise<void> {
  await supabase
    .from('assessments')
    .delete()
    .eq('user_id', userId)
    .in('type', ['ecr-r', 'dutch', 'sseit', 'dsi-r', 'ipip-neo-120', 'values']);
}
