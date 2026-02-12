/**
 * Intervention service — Supabase CRUD for exercise completions.
 */

import { supabase } from './supabase';
import type { ExerciseCompletion } from '@/types/intervention';

// ─── Save Completion ────────────────────────────────────

export async function saveCompletion(
  userId: string,
  exerciseId: string,
  reflection?: string,
  rating?: number
): Promise<ExerciseCompletion> {
  const { data, error } = await supabase
    .from('exercise_completions')
    .insert({
      user_id: userId,
      exercise_id: exerciseId,
      reflection: reflection ?? null,
      rating: rating ?? null,
      completed_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return mapCompletion(data);
}

// ─── Get Completions ────────────────────────────────────

export async function getCompletions(
  userId: string,
  limit = 50
): Promise<ExerciseCompletion[]> {
  const { data, error } = await supabase
    .from('exercise_completions')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []).map(mapCompletion);
}

// ─── Get Completion Count ───────────────────────────────

export async function getCompletionCount(
  userId: string,
  exerciseId: string
): Promise<number> {
  const { count, error } = await supabase
    .from('exercise_completions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('exercise_id', exerciseId);

  if (error) throw error;
  return count ?? 0;
}

// ─── Helpers ────────────────────────────────────────────

function mapCompletion(row: any): ExerciseCompletion {
  return {
    id: row.id,
    userId: row.user_id,
    exerciseId: row.exercise_id,
    completedAt: row.completed_at,
    reflection: row.reflection ?? undefined,
    rating: row.rating ?? undefined,
  };
}
