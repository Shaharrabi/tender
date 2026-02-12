import { supabase } from './supabase';
import type { IndividualPortrait, AssessmentType } from '@/types';

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

/** Save (upsert) a portrait. */
export async function savePortrait(
  portrait: Omit<IndividualPortrait, 'id' | 'createdAt'>
): Promise<IndividualPortrait> {
  const { data, error } = await supabase
    .from('portraits')
    .upsert(
      {
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
      },
      { onConflict: 'user_id' }
    )
    .select()
    .single();

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
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // not found
    throw error;
  }

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
  };
}
