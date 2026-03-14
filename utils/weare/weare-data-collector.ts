/**
 * WEARE Data Collector — Orchestration layer
 *
 * Gathers all data sources in parallel from existing services
 * and assembles a WEAREInput ready for calculateWEARE().
 * Gracefully handles missing data (partner, couple instruments, etc).
 */

import type {
  WEAREInput,
  WEAREPartnerData,
  WEAREBehavioralData,
  WEAREProfile,
} from '@/types/weare';
import type {
  ECRRScores,
  IPIPScores,
  SSEITScores,
  DSIRScores,
  DUTCHScores,
  ValuesScores,
  RelationalFieldScores,
  CoupleFieldScores,
} from '@/types';
import type { CompositeScores, SupplementScores } from '@/types/portrait';
import type { Couple } from '@/types/couples';

import { getPortrait } from '@/services/portrait';
import { fetchAllScores, fetchSharedScores, extractSupplementScores } from '@/services/portrait';
import { getPartnerSharedAssessments } from '@/services/consent';
import { getMyCouple, getLatestDyadicScores } from '@/services/couples';
import { getStreakData } from '@/services/streaks';
import { getCurrentStepNumber } from '@/services/steps';
import { getCompletions } from '@/services/intervention';
import { getCoupleWeeklyCheckIns, getLatestWEAREProfile } from '@/services/weare';

// ─── Public API ─────────────────────────────────────────

/**
 * Collect all data needed for WEARE calculation.
 * Runs data fetches in parallel where possible.
 */
export async function collectWEAREData(
  userId: string,
): Promise<WEAREInput | null> {
  // Phase 1: Get couple and partner info
  const couple = await getMyCouple(userId);
  if (!couple) return null; // No couple = can't calculate WEARE

  const partnerId = couple.partner_a_id === userId
    ? couple.partner_b_id
    : couple.partner_a_id;

  // Phase 2: Fetch partner's sharing preferences so we only access shared data
  const partnerSharedTypes = await getPartnerSharedAssessments(partnerId, couple.id);

  // Phase 3: Parallel fetch all data sources
  const [
    partnerAData,
    partnerBData,
    rfScores,
    cfScores,
    weeklyCheckins,
    behavioral,
    previousProfile,
  ] = await Promise.all([
    collectPartnerData(userId),                                     // own data — full access
    collectPartnerData(partnerId, partnerSharedTypes).catch(() => null), // partner — shared only
    fetchRelationalFieldScores(couple.id),
    fetchCoupleFieldScores(couple.id),
    getCoupleWeeklyCheckIns(couple.id, couple.partner_a_id, couple.partner_b_id),
    collectBehavioralData(userId),
    getLatestWEAREProfile(couple.id),
  ]);

  if (!partnerAData) return null; // Can't calculate without current user's data

  // Determine correct partner A/B mapping
  const isPartnerA = couple.partner_a_id === userId;

  return {
    partnerA: partnerAData,
    partnerB: partnerBData ?? undefined,
    relationalField: rfScores ?? undefined,
    coupleField: cfScores ?? undefined,
    weeklyCheckIn: {
      partnerA: isPartnerA ? weeklyCheckins.partnerA ?? undefined : weeklyCheckins.partnerB ?? undefined,
      partnerB: isPartnerA ? weeklyCheckins.partnerB ?? undefined : weeklyCheckins.partnerA ?? undefined,
    },
    behavioral: behavioral ?? undefined,
    previousProfile: previousProfile ?? undefined,
  };
}

// ─── Partner Data Collection ────────────────────────────

async function collectPartnerData(
  userId: string,
  sharedTypes?: string[],
): Promise<WEAREPartnerData | null> {
  try {
    // If sharedTypes is provided, only fetch those assessment types (partner access)
    // If not provided, fetch all (own data)
    const scoresFetcher = sharedTypes !== undefined
      ? fetchSharedScores(userId, sharedTypes)
      : fetchAllScores(userId);

    const [portrait, allScoresMap] = await Promise.all([
      getPortrait(userId),
      scoresFetcher,
    ]);

    if (!portrait) return null;

    const scores = allScoresMap;
    const supplements = extractSupplementScores(scores);

    return {
      compositeScores: portrait.compositeScores,
      ecrr: scores['ecr-r']?.scores as ECRRScores,
      ipip: scores['ipip-neo-120']?.scores as IPIPScores,
      sseit: scores['sseit']?.scores as SSEITScores,
      dsir: scores['dsi-r']?.scores as DSIRScores,
      dutch: scores['dutch']?.scores as DUTCHScores,
      values: scores['values']?.scores as ValuesScores,
      supplements: supplements ?? undefined,
    };
  } catch {
    return null;
  }
}

// ─── Couple Instrument Scores ───────────────────────────

async function fetchRelationalFieldScores(
  coupleId: string,
): Promise<RelationalFieldScores | null> {
  try {
    const result = await getLatestDyadicScores(coupleId, 'relational-field' as any);
    // Average both partners' scores if both exist
    if (result.partnerA && result.partnerB) {
      return averageRelationalFieldScores(result.partnerA, result.partnerB);
    }
    return result.partnerA || result.partnerB || null;
  } catch {
    return null;
  }
}

async function fetchCoupleFieldScores(
  coupleId: string,
): Promise<CoupleFieldScores | null> {
  try {
    const result = await getLatestDyadicScores(coupleId, 'couple-field' as any);
    // CFA scores are per-partner, use partner A's or whichever exists
    return result.partnerA || result.partnerB || null;
  } catch {
    return null;
  }
}

function averageRelationalFieldScores(
  a: RelationalFieldScores,
  b: RelationalFieldScores,
): RelationalFieldScores {
  const avgSubscale = (
    sa: { sum: number; mean: number },
    sb: { sum: number; mean: number }
  ) => ({
    sum: (sa.sum + sb.sum) / 2,
    mean: (sa.mean + sb.mean) / 2,
  });

  return {
    totalScore: (a.totalScore + b.totalScore) / 2,
    totalMean: (a.totalMean + b.totalMean) / 2,
    fieldRecognition: avgSubscale(a.fieldRecognition, b.fieldRecognition),
    creativeTension: avgSubscale(a.creativeTension, b.creativeTension),
    presenceAttunement: avgSubscale(a.presenceAttunement, b.presenceAttunement),
    emergentOrientation: avgSubscale(a.emergentOrientation, b.emergentOrientation),
  };
}

// ─── Behavioral Data Collection ─────────────────────────

async function collectBehavioralData(
  userId: string,
): Promise<WEAREBehavioralData | null> {
  try {
    const [streakData, stepNumber, completions] = await Promise.all([
      getStreakData(userId),
      getCurrentStepNumber(userId),
      getCompletions(userId, 200),
    ]);

    const completionCount = completions.length;

    // Practice completion rate: capped heuristic based on total vs expected
    // Expected: roughly 1 practice per day for the number of days active
    const expectedPractices = Math.max(streakData.totalDays, 7);
    const practiceCompletionRate = Math.min(completionCount / expectedPractices, 1);

    // Session consistency: days active in last 7 / 7
    const recentDates = streakData.streakDates.filter((d) => {
      const dateObj = new Date(d);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return dateObj >= sevenDaysAgo;
    });
    const sessionConsistency = recentDates.length / 7;

    return {
      practiceCompletionRate,
      practiceRepetitionRate: Math.min(completionCount / Math.max(completionCount, 1), 1),
      currentStreak: streakData.currentStreak,
      sessionConsistency,
      stepProgression: stepNumber,
      totalPracticesCompleted: completionCount,
    };
  } catch {
    return null;
  }
}
