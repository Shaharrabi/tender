import { supabase } from './supabase';
import type { IndividualPortrait, AssessmentType } from '@/types';
import type { SupplementScores, CompositeScores } from '@/types/portrait';

// ─── Portrait History ────────────────────────────────────

export interface PortraitHistoryEntry {
  archivedAt: string;
  version: number;
  compositeScores: CompositeScores;
  reason: string;
}

export async function getPortraitHistory(userId: string): Promise<PortraitHistoryEntry[]> {
  try {
    const { data, error } = await supabase
      .from('portraits_history')
      .select('archived_at, version, portrait_snapshot, reason')
      .eq('user_id', userId)
      .order('archived_at', { ascending: true })
      .limit(10);

    if (error) {
      // Gracefully handle missing table or other errors
      console.warn('[getPortraitHistory] Non-blocking error:', error.message);
      return [];
    }

    return (data ?? []).map((row: any) => ({
      archivedAt: row.archived_at,
      version: row.version ?? 1,
      compositeScores: row.portrait_snapshot?.composite_scores ?? row.portrait_snapshot?.compositeScores ?? {} as CompositeScores,
      reason: row.reason ?? 'retake',
    }));
  } catch (err) {
    console.warn('[getPortraitHistory] Unexpected error:', err);
    return [];
  }
}

const REQUIRED_ASSESSMENTS: AssessmentType[] = [
  'ecr-r', 'dutch', 'sseit', 'dsi-r', 'tender-personality-60', 'values',
];

/** Check whether user has completed all 6 assessments. */
export async function checkCanGeneratePortrait(
  userId: string
): Promise<{ canGenerate: boolean; missingAssessments: string[] }> {
  const { data } = await supabase
    .from('assessments')
    .select('type')
    .eq('user_id', userId)
    .in('type', REQUIRED_ASSESSMENTS)
    .order('completed_at', { ascending: false });

  const completed = new Set((data ?? []).map((a: { type: string }) => a.type));
  const missing = REQUIRED_ASSESSMENTS.filter((t) => !completed.has(t));

  return { canGenerate: missing.length === 0, missingAssessments: missing };
}

/**
 * Fetch only scores for assessment types the partner has shared.
 * Used when loading partner data — respects sharing_preferences.
 */
export async function fetchSharedScores(
  userId: string,
  sharedTypes: string[],
) {
  if (sharedTypes.length === 0) return {};
  const validTypes = sharedTypes.filter((t) =>
    REQUIRED_ASSESSMENTS.includes(t as AssessmentType),
  );
  if (validTypes.length === 0) return {};
  return fetchAllScores(userId, validTypes);
}

/** Fetch the current scores for each of the 6 assessments (or a filtered subset). */
export async function fetchAllScores(userId: string, typeFilter?: string[]) {
  const types = typeFilter ?? REQUIRED_ASSESSMENTS;
  const { data, error } = await supabase
    .from('assessments')
    .select('id, type, scores')
    .eq('user_id', userId)
    .in('type', types)
    .order('completed_at', { ascending: false });

  if (error) throw error;

  // Take the most recent per type (is_current filter should give us one per type,
  // but belt-and-suspenders in case of race conditions)
  const latest: Record<string, { id: string; scores: any }> = {};
  for (const row of data ?? []) {
    if (!latest[row.type]) {
      latest[row.type] = { id: row.id, scores: row.scores };
    }
  }

  return latest;
}

/**
 * Extract aggregated supplement scores from the latest assessment scores.
 * Returns undefined if no supplement data exists (pre-Phase-2 assessments).
 */
export function extractSupplementScores(
  latest: Record<string, { id: string; scores: any }>
): SupplementScores | undefined {
  const supplements: SupplementScores = {};
  let hasAny = false;

  if (latest['ecr-r']?.scores?.supplementScores) {
    supplements.ecrr = latest['ecr-r'].scores.supplementScores;
    hasAny = true;
  }
  if (latest['sseit']?.scores?.supplementScores) {
    supplements.sseit = latest['sseit'].scores.supplementScores;
    hasAny = true;
  }
  if (latest['dsi-r']?.scores?.supplementScores) {
    supplements.dsir = latest['dsi-r'].scores.supplementScores;
    hasAny = true;
  }
  if (latest['values']?.scores?.supplementScores) {
    supplements.values = latest['values'].scores.supplementScores;
    hasAny = true;
  }

  return hasAny ? supplements : undefined;
}

/**
 * Fetch the most recent non-current (archived) scores for each of the 6 assessments.
 * Returns null if the user hasn't taken any assessment more than once.
 * Used by ReassessmentDelta to show before/after comparison.
 *
 * With the is_current flag, archived rows are is_current=false.
 * We fetch ALL rows ordered by completed_at desc and pick the first
 * non-current row per type.
 */
export async function fetchPreviousScores(userId: string): Promise<Record<string, { id: string; scores: any }> | null> {
  const { data, error } = await supabase
    .from('assessments')
    .select('id, type, scores, completed_at')
    .eq('user_id', userId)
    .in('type', REQUIRED_ASSESSMENTS)
    .order('completed_at', { ascending: false });

  if (error || !data) return null;

  // Find the second-most-recent row per type (the previous attempt)
  const seen: Record<string, number> = {};
  const previous: Record<string, { id: string; scores: any }> = {};
  for (const row of data) {
    seen[row.type] = (seen[row.type] ?? 0) + 1;
    // Second occurrence per type = previous score
    if (seen[row.type] === 2 && !previous[row.type]) {
      previous[row.type] = { id: row.id, scores: row.scores };
    }
  }

  return Object.keys(previous).length > 0 ? previous : null;
}

/** Save (upsert) a portrait. Archives the previous portrait to portraits_history first. */
export async function savePortrait(
  portrait: Omit<IndividualPortrait, 'id' | 'createdAt'>
): Promise<IndividualPortrait> {
  // Before upsert: archive the current portrait if one exists
  try {
    const { data: existing } = await supabase
      .from('portraits')
      .select('*')
      .eq('user_id', portrait.userId)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('portraits_history')
        .insert({
          user_id: portrait.userId,
          portrait_snapshot: existing,
          version: existing.version ?? 1,
          reason: 'retake',
        })
        .throwOnError();
    }
  } catch (archiveErr) {
    console.warn('[savePortrait] Could not archive portrait history (non-blocking):', archiveErr);
  }

  // Build the row data — Phase 3 columns may not exist on older DBs
  const row: Record<string, any> = {
    user_id: portrait.userId,
    assessment_ids: portrait.assessmentIds,
    composite_scores: portrait.compositeScores,
    patterns: portrait.patterns,
    four_lens: portrait.fourLens,
    negative_cycle: portrait.negativeCycle,
    growth_edges: portrait.growthEdges,
    anchor_points: portrait.anchorPoints,
    partner_guide: portrait.partnerGuide,
    version: portrait.version,
    updated_at: new Date().toISOString(),
  };

  // Try with Phase 3 + Intelligence Upgrade columns first, fall back without them
  row.big_five_reframes = portrait.bigFiveReframes ?? null;
  row.supplement_data = portrait.supplementData ?? null;
  row.integrated_narratives = portrait.integratedNarratives ?? null;
  row.one_thing_sentence = portrait.oneThingSentence ?? null;

  let { data, error } = await supabase
    .from('portraits')
    .upsert(row, { onConflict: 'user_id' })
    .select()
    .single();

  // If Phase 3 or Intelligence Upgrade columns don't exist, retry without them
  if (error && (
    error.message?.includes('big_five_reframes') ||
    error.message?.includes('supplement_data') ||
    error.message?.includes('integrated_narratives') ||
    error.message?.includes('one_thing_sentence') ||
    error.code === '42703' // undefined_column
  )) {
    console.warn('[savePortrait] Optional columns missing, retrying without them');
    delete row.big_five_reframes;
    delete row.supplement_data;
    delete row.integrated_narratives;
    delete row.one_thing_sentence;

    const retry = await supabase
      .from('portraits')
      .upsert(row, { onConflict: 'user_id' })
      .select()
      .single();

    data = retry.data;
    error = retry.error;
  }

  if (error) throw error;

  return mapRow(data);
}

/** Get a user's portrait (or null). */
export async function getPortrait(
  userId: string
): Promise<IndividualPortrait | null> {
  const { data, error } = await supabase
    .from('portraits')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    if (error.code === 'PGRST116') return null; // not found
    throw error;
  }

  if (!data) return null; // No portrait found

  return mapRow(data);
}

// ─── helpers ──────────────────────────────────────────────

function mapRow(row: any): IndividualPortrait {
  return {
    id: row.id,
    userId: row.user_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    assessmentIds: row.assessment_ids,
    compositeScores: row.composite_scores,
    patterns: row.patterns,
    fourLens: row.four_lens,
    negativeCycle: row.negative_cycle,
    growthEdges: row.growth_edges,
    anchorPoints: row.anchor_points,
    partnerGuide: row.partner_guide,
    version: row.version,
    // Phase 3 additions (may be undefined for v1.0.0 portraits)
    bigFiveReframes: row.big_five_reframes ?? undefined,
    supplementData: row.supplement_data ?? undefined,
    // Portrait Intelligence Upgrade (may be undefined for older portraits)
    integratedNarratives: row.integrated_narratives ?? undefined,
    oneThingSentence: row.one_thing_sentence ?? undefined,
  };
}
