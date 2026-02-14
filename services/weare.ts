/**
 * WEARE Service — Supabase CRUD for WEARE scores + weekly check-ins.
 * Follows the services/growth.ts pattern.
 */

import { supabase } from './supabase';
import type {
  WEAREProfile,
  WEAREScoreRow,
  WeeklyCheckIn,
  WeeklyCheckInRow,
  WEAREDataMode,
} from '@/types/weare';

// ─── Date Helpers ───────────────────────────────────────

/** Return YYYY-MM-DD in local timezone */
function localDateString(d: Date = new Date()): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/** Get the Monday of the current week */
function weekOfDate(d: Date = new Date()): string {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Monday
  date.setDate(diff);
  return localDateString(date);
}

// ─── WEARE Scores ───────────────────────────────────────

export async function saveWEAREProfile(
  coupleId: string,
  userId: string,
  profile: WEAREProfile,
): Promise<void> {
  const { error } = await supabase
    .from('weare_scores')
    .insert({
      couple_id: coupleId,
      calculated_by: userId,
      data_mode: profile.dataMode,
      variables: profile.variables,
      layers: profile.layers,
      bottleneck: profile.bottleneck,
      movement_phase: profile.movementPhase,
      movement_narrative: profile.movementNarrative,
      warm_summary: profile.warmSummary,
      calculated_at: profile.calculatedAt,
    });

  if (error) throw error;
}

export async function getLatestWEAREProfile(
  coupleId: string,
): Promise<WEAREProfile | null> {
  const { data, error } = await supabase
    .from('weare_scores')
    .select('*')
    .eq('couple_id', coupleId)
    .order('calculated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data ? mapWEARERow(data) : null;
}

export async function getWEAREHistory(
  coupleId: string,
  limit = 10,
): Promise<WEAREProfile[]> {
  const { data, error } = await supabase
    .from('weare_scores')
    .select('*')
    .eq('couple_id', coupleId)
    .order('calculated_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []).map(mapWEARERow);
}

// ─── Weekly Check-Ins ───────────────────────────────────

export async function saveWeeklyCheckIn(
  userId: string,
  coupleId: string,
  externalStress: number,
  supportSystem: number,
  satisfaction: number,
  practiceHighlight?: string,
): Promise<WeeklyCheckIn> {
  const weekOf = weekOfDate();

  const { data, error } = await supabase
    .from('weekly_check_ins')
    .upsert(
      {
        user_id: userId,
        couple_id: coupleId,
        week_of: weekOf,
        external_stress_level: externalStress,
        support_system_rating: supportSystem,
        relationship_satisfaction: satisfaction,
        practice_highlight: practiceHighlight ?? null,
      },
      { onConflict: 'user_id,couple_id,week_of' }
    )
    .select()
    .single();

  if (error) throw error;
  return mapCheckIn(data);
}

export async function getLatestWeeklyCheckIn(
  coupleId: string,
  userId: string,
): Promise<WeeklyCheckIn | null> {
  const { data, error } = await supabase
    .from('weekly_check_ins')
    .select('*')
    .eq('couple_id', coupleId)
    .eq('user_id', userId)
    .order('week_of', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data ? mapCheckIn(data) : null;
}

export async function getThisWeeksCheckIn(
  coupleId: string,
  userId: string,
): Promise<WeeklyCheckIn | null> {
  const weekOf = weekOfDate();

  const { data, error } = await supabase
    .from('weekly_check_ins')
    .select('*')
    .eq('couple_id', coupleId)
    .eq('user_id', userId)
    .eq('week_of', weekOf)
    .maybeSingle();

  if (error) throw error;
  return data ? mapCheckIn(data) : null;
}

export async function getWeeklyCheckInHistory(
  coupleId: string,
  userId: string,
  weeks = 12,
): Promise<WeeklyCheckIn[]> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - weeks * 7);
  const cutoffDate = localDateString(cutoff);

  const { data, error } = await supabase
    .from('weekly_check_ins')
    .select('*')
    .eq('couple_id', coupleId)
    .eq('user_id', userId)
    .gte('week_of', cutoffDate)
    .order('week_of', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapCheckIn);
}

/** Get the latest weekly check-ins for both partners (for WEARE engine input) */
export async function getCoupleWeeklyCheckIns(
  coupleId: string,
  partnerAId: string,
  partnerBId: string,
): Promise<{ partnerA: WeeklyCheckIn | null; partnerB: WeeklyCheckIn | null }> {
  const { data, error } = await supabase
    .from('weekly_check_ins')
    .select('*')
    .eq('couple_id', coupleId)
    .in('user_id', [partnerAId, partnerBId])
    .order('week_of', { ascending: false })
    .limit(4); // at most 2 users × 2 recent weeks

  if (error) throw error;

  const rows = data ?? [];
  const partnerARow = rows.find((r: any) => r.user_id === partnerAId);
  const partnerBRow = rows.find((r: any) => r.user_id === partnerBId);

  return {
    partnerA: partnerARow ? mapCheckIn(partnerARow) : null,
    partnerB: partnerBRow ? mapCheckIn(partnerBRow) : null,
  };
}

// ─── Mappers ────────────────────────────────────────────

function mapWEARERow(row: any): WEAREProfile {
  return {
    variables: row.variables,
    layers: row.layers,
    bottleneck: row.bottleneck,
    movementPhase: row.movement_phase,
    movementNarrative: row.movement_narrative,
    warmSummary: row.warm_summary,
    dataMode: row.data_mode as WEAREDataMode,
    calculatedAt: row.calculated_at,
    // trend is computed at calculation time, not stored
  };
}

function mapCheckIn(row: any): WeeklyCheckIn {
  return {
    id: row.id,
    userId: row.user_id,
    coupleId: row.couple_id,
    weekOf: row.week_of,
    externalStressLevel: row.external_stress_level,
    supportSystemRating: row.support_system_rating,
    relationshipSatisfaction: row.relationship_satisfaction,
    practiceHighlight: row.practice_highlight ?? undefined,
    createdAt: row.created_at,
  };
}
