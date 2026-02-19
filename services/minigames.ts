/**
 * Mini-games service — Supabase CRUD for step mini-game outputs.
 *
 * Persists mini-game results (title, insights, free-form data) to the
 * `step_minigame_outputs` table and exposes helpers for the journal screen.
 */

import { supabase } from './supabase';
import type { MiniGameOutput } from '@/types/growth';

// ─── Save / Retrieve ─────────────────────────────────────

/** Persist a mini-game output and return the mapped record. */
export async function saveMiniGameOutput(
  userId: string,
  stepNumber: number,
  gameId: string,
  output: { title: string; insights: string[]; data: Record<string, any> }
): Promise<MiniGameOutput> {
  const { data, error } = await supabase
    .from('step_minigame_outputs')
    .insert({
      user_id: userId,
      step_number: stepNumber,
      game_id: gameId,
      output: {
        title: output.title,
        insights: output.insights,
        data: output.data,
      },
      completed_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return mapMiniGameOutput(data);
}

/** Get the latest mini-game output for a specific step, or null if none. */
export async function getMiniGameOutput(
  userId: string,
  stepNumber: number
): Promise<MiniGameOutput | null> {
  const { data, error } = await supabase
    .from('step_minigame_outputs')
    .select('*')
    .eq('user_id', userId)
    .eq('step_number', stepNumber)
    .order('completed_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return mapMiniGameOutput(data);
}

/** Get all mini-game outputs for a user (for journal display). */
export async function getAllMiniGameOutputs(
  userId: string
): Promise<MiniGameOutput[]> {
  const { data, error } = await supabase
    .from('step_minigame_outputs')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapMiniGameOutput);
}

/** Check whether the user has completed the mini-game for a given step. */
export async function hasMiniGameCompleted(
  userId: string,
  stepNumber: number
): Promise<boolean> {
  const { count, error } = await supabase
    .from('step_minigame_outputs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('step_number', stepNumber);

  if (error) throw error;
  return (count ?? 0) > 0;
}

// ─── Mapper ──────────────────────────────────────────────

function mapMiniGameOutput(row: any): MiniGameOutput {
  const output = row.output ?? {};
  return {
    id: row.id,
    userId: row.user_id,
    stepNumber: row.step_number,
    gameId: row.game_id,
    title: output.title ?? '',
    insights: output.insights ?? [],
    data: output.data ?? {},
    completedAt: row.completed_at,
    createdAt: row.created_at,
  };
}
