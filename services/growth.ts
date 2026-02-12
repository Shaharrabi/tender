/**
 * Growth service — Supabase CRUD for growth tracking and daily check-ins.
 */

import { supabase } from './supabase';
import { getPortrait } from './portrait';
import type { GrowthEdgeProgress, GrowthStage, DailyCheckIn } from '@/types/growth';

// ─── Growth Edge Progress ───────────────────────────────

export async function getGrowthEdgeProgress(
  userId: string
): Promise<GrowthEdgeProgress[]> {
  const { data, error } = await supabase
    .from('growth_edge_progress')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapGrowthEdge);
}

/**
 * Ensures growth_edge_progress rows exist for the user by seeding them
 * from portrait.growthEdges when the tracking table is empty.
 *
 * Returns the current set of growth edge progress records (either
 * pre-existing or freshly seeded).
 */
export async function ensureGrowthEdgesFromPortrait(
  userId: string
): Promise<GrowthEdgeProgress[]> {
  // 1. Check for existing progress rows
  const existing = await getGrowthEdgeProgress(userId);
  if (existing.length > 0) {
    return existing;
  }

  // 2. No rows yet — try to seed from portrait
  const portrait = await getPortrait(userId);
  if (!portrait || portrait.growthEdges.length === 0) {
    return [];
  }

  // 3. Seed a progress row for each portrait growth edge
  const now = new Date().toISOString();
  const rows = portrait.growthEdges.map((edge) => ({
    user_id: userId,
    edge_id: edge.id,
    stage: 'emerging' as const,
    practice_count: 0,
    insights: [],
    milestones: [],
    updated_at: now,
  }));

  const { data, error } = await supabase
    .from('growth_edge_progress')
    .upsert(rows, { onConflict: 'user_id,edge_id' })
    .select();

  if (error) throw error;
  return (data ?? []).map(mapGrowthEdge);
}

export async function upsertGrowthEdge(
  userId: string,
  edgeId: string,
  updates: Partial<Pick<GrowthEdgeProgress, 'stage' | 'insights' | 'milestones'>>
): Promise<GrowthEdgeProgress> {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('growth_edge_progress')
    .upsert(
      {
        user_id: userId,
        edge_id: edgeId,
        stage: updates.stage ?? 'emerging',
        insights: updates.insights ?? [],
        milestones: updates.milestones ?? [],
        updated_at: now,
      },
      { onConflict: 'user_id,edge_id' }
    )
    .select()
    .single();

  if (error) throw error;
  return mapGrowthEdge(data);
}

export async function incrementPracticeCount(
  userId: string,
  edgeId: string
): Promise<void> {
  const now = new Date().toISOString();

  // Fetch current count first
  const { data: existing, error: fetchError } = await supabase
    .from('growth_edge_progress')
    .select('practice_count')
    .eq('user_id', userId)
    .eq('edge_id', edgeId)
    .single();

  if (fetchError) throw fetchError;

  const newCount = (existing?.practice_count ?? 0) + 1;

  const { error } = await supabase
    .from('growth_edge_progress')
    .update({
      practice_count: newCount,
      last_practiced: now,
      updated_at: now,
    })
    .eq('user_id', userId)
    .eq('edge_id', edgeId);

  if (error) throw error;
}

export async function addInsight(
  userId: string,
  edgeId: string,
  insight: string
): Promise<void> {
  // Fetch current insights
  const { data: existing, error: fetchError } = await supabase
    .from('growth_edge_progress')
    .select('insights')
    .eq('user_id', userId)
    .eq('edge_id', edgeId)
    .single();

  if (fetchError) throw fetchError;

  const currentInsights: string[] = existing?.insights ?? [];
  const updatedInsights = [...currentInsights, insight];

  const { error } = await supabase
    .from('growth_edge_progress')
    .update({
      insights: updatedInsights,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('edge_id', edgeId);

  if (error) throw error;
}

export async function updateStage(
  userId: string,
  edgeId: string,
  stage: GrowthStage
): Promise<void> {
  const { error } = await supabase
    .from('growth_edge_progress')
    .update({
      stage,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('edge_id', edgeId);

  if (error) throw error;
}

// ─── Daily Check-Ins ────────────────────────────────────

/** Return YYYY-MM-DD in the device's local timezone (avoids UTC off-by-one). */
function localDateString(d: Date = new Date()): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export async function saveDailyCheckIn(
  userId: string,
  mood: number,
  relationship: number,
  practiced: boolean,
  note?: string
): Promise<DailyCheckIn> {
  const today = localDateString();

  try {
    // Delete any existing check-in for today first, then insert fresh.
    // This avoids needing an UPDATE RLS policy (the original migration
    // only had SELECT + INSERT). A separate migration (006) adds the
    // UPDATE policy, but this delete-then-insert approach is more robust.
    const { error: deleteError } = await supabase
      .from('daily_check_ins')
      .delete()
      .eq('user_id', userId)
      .eq('checkin_date', today);

    // If delete fails due to missing DELETE policy, try upsert as fallback
    if (deleteError) {
      if (__DEV__) {
        console.warn('[saveDailyCheckIn] Delete failed, trying upsert:', deleteError.message);
      }
    }

    const { data, error } = await supabase
      .from('daily_check_ins')
      .upsert(
        {
          user_id: userId,
          checkin_date: today,
          mood_rating: mood,
          relationship_rating: relationship,
          practiced_growth_edge: practiced,
          note: note ?? null,
        },
        { onConflict: 'user_id,checkin_date' }
      )
      .select()
      .single();

    if (error) {
      if (__DEV__) {
        console.error('[saveDailyCheckIn] Supabase error:', error.message, error.details);
      }
      throw error;
    }

    return mapCheckIn(data);
  } catch (err) {
    if (__DEV__) {
      console.error('[saveDailyCheckIn] Unexpected error:', err);
    }
    throw err;
  }
}

export async function getTodaysCheckIn(
  userId: string
): Promise<DailyCheckIn | null> {
  const today = localDateString();

  const { data, error } = await supabase
    .from('daily_check_ins')
    .select('*')
    .eq('user_id', userId)
    .eq('checkin_date', today)
    .maybeSingle();

  if (error) throw error;
  return data ? mapCheckIn(data) : null;
}

export async function getRecentCheckIns(
  userId: string,
  days: number
): Promise<DailyCheckIn[]> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffDate = localDateString(cutoff);

  const { data, error } = await supabase
    .from('daily_check_ins')
    .select('*')
    .eq('user_id', userId)
    .gte('checkin_date', cutoffDate)
    .order('checkin_date', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapCheckIn);
}

// ─── Helpers ────────────────────────────────────────────

function mapGrowthEdge(row: any): GrowthEdgeProgress {
  return {
    id: row.id,
    userId: row.user_id,
    edgeId: row.edge_id,
    stage: row.stage,
    practiceCount: row.practice_count ?? 0,
    lastPracticed: row.last_practiced ?? undefined,
    insights: row.insights ?? [],
    milestones: row.milestones ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapCheckIn(row: any): DailyCheckIn {
  return {
    id: row.id,
    userId: row.user_id,
    checkinDate: row.checkin_date,
    moodRating: row.mood_rating,
    relationshipRating: row.relationship_rating,
    practicedGrowthEdge: row.practiced_growth_edge,
    note: row.note ?? undefined,
    createdAt: row.created_at,
  };
}
