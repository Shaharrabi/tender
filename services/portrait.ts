import { supabase } from './supabase';
import type { IndividualPortrait, AssessmentType } from '@/types';
import type { SupplementScores } from '@/types/portrait';

const REQUIRED_ASSESSMENTS: AssessmentType[] = [
  'ecr-r', 'dutch', 'sseit', 'dsi-r', 'ipip-neo-120', 'values',
];

/** Check whether user has completed all 6 assessments. */
export async function checkCanGeneratePortrait(
  userId: string
): Promise<{ canGenerate: boolean; missingAssessments: string[] }> {
  const { data } = await supabase
    .from('assessments')
    .select('type')
    .eq('user_id', userId);

  const completed = new Set((data ?? []).map((a: { type: string }) => a.type));
  const missing = REQUIRED_ASSESSMENTS.filter((t) => !completed.has(t));

  return { canGenerate: missing.length === 0, missingAssessments: missing };
}

/** Fetch the most recent scores for each of the 6 assessments. */
export async function fetchAllScores(userId: string) {
  const { data, error } = await supabase
    .from('assessments')
    .select('id, type, scores')
    .eq('user_id', userId)
    .in('type', REQUIRED_ASSESSMENTS)
    .order('completed_at', { ascending: false });

  if (error) throw error;

  // Take the most recent per type
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

/** Save (upsert) a portrait. */
export async function savePortrait(
  portrait: Omit<IndividualPortrait, 'id' | 'createdAt'>
): Promise<IndividualPortrait> {
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
  };

  // Try with Phase 3 columns first, fall back without them
  row.big_five_reframes = portrait.bigFiveReframes ?? null;
  row.supplement_data = portrait.supplementData ?? null;

  let { data, error } = await supabase
    .from('portraits')
    .upsert(row, { onConflict: 'user_id' })
    .select()
    .single();

  // If Phase 3 columns don't exist, retry without them
  if (error && (
    error.message?.includes('big_five_reframes') ||
    error.message?.includes('supplement_data') ||
    error.code === '42703' // undefined_column
  )) {
    console.warn('[savePortrait] Phase 3 columns missing, retrying without them');
    delete row.big_five_reframes;
    delete row.supplement_data;

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
  };
}
