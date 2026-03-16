/**
 * Steps service — Supabase CRUD for Twelve Steps progress tracking.
 *
 * Manages step_progress rows, practice_completions, and provides
 * helpers for determining the user's current step.
 */

import { supabase } from './supabase';
import type { StepProgress, PracticeCompletion, StepStatus } from '@/types/growth';
import { notifyPartner } from './partner-activity-hooks';

// ─── Step Progress ──────────────────────────────────────

/** Fetch all step progress rows for a user. */
export async function getStepProgress(userId: string): Promise<StepProgress[]> {
  const { data, error } = await supabase
    .from('step_progress')
    .select('*')
    .eq('user_id', userId)
    .order('step_number', { ascending: true });

  if (error) throw error;
  return (data ?? []).map(mapStepProgress);
}

/**
 * Ensures step_progress rows exist for the user.
 * If none exist, initializes Step 1 as 'active' and Steps 2-12 as 'locked'.
 * Returns the full set of step progress records.
 */
export async function ensureStepProgress(userId: string): Promise<StepProgress[]> {
  const existing = await getStepProgress(userId);
  if (existing.length > 0) return existing;

  // Seed initial step progress — Step 1 active, rest locked
  const now = new Date().toISOString();
  const rows = Array.from({ length: 12 }, (_, i) => ({
    user_id: userId,
    step_number: i + 1,
    status: i === 0 ? 'active' : 'locked',
    started_at: i === 0 ? now : null,
    created_at: now,
    updated_at: now,
  }));

  const { data, error } = await supabase
    .from('step_progress')
    .upsert(rows, { onConflict: 'user_id,step_number' })
    .select();

  if (error) throw error;
  return (data ?? []).map(mapStepProgress);
}

/** Get the user's current (active) step number. */
export async function getCurrentStepNumber(userId: string): Promise<number> {
  const progress = await ensureStepProgress(userId);
  const activeStep = progress.find((p) => p.status === 'active');
  if (activeStep) return activeStep.stepNumber;
  // No active step — return highest completed, or 1 if none
  const completed = progress.filter((p) => p.status === 'completed');
  return completed.length > 0 ? Math.max(...completed.map((p) => p.stepNumber)) : 1;
}

/** Advance a step to 'completed' and unlock the next step.
 *  SAFE: only unlocks next step if it's currently 'locked'.
 *  This prevents regression (e.g. overwriting a completed step 5 back to active
 *  when the user completes step 4 out of order). */
export async function completeStep(
  userId: string,
  stepNumber: number
): Promise<void> {
  const now = new Date().toISOString();

  // Mark current step as completed
  await supabase
    .from('step_progress')
    .update({ status: 'completed', completed_at: now, updated_at: now })
    .eq('user_id', userId)
    .eq('step_number', stepNumber);

  // Unlock next step ONLY if it's currently locked
  // (prevents overwriting 'completed' or 'active' states)
  if (stepNumber < 12) {
    await supabase
      .from('step_progress')
      .update({ status: 'active', started_at: now, updated_at: now })
      .eq('user_id', userId)
      .eq('step_number', stepNumber + 1)
      .eq('status', 'locked');  // ← only unlock if currently locked
  }

  // Notify partner (non-blocking)
  notifyPartner(userId, 'step_reflection', { stepNumber });
}

/** Update the status of a specific step. */
export async function updateStepStatus(
  userId: string,
  stepNumber: number,
  status: StepStatus
): Promise<void> {
  const now = new Date().toISOString();
  const updates: Record<string, any> = { status, updated_at: now };
  if (status === 'active') updates.started_at = now;
  if (status === 'completed') updates.completed_at = now;

  await supabase
    .from('step_progress')
    .update(updates)
    .eq('user_id', userId)
    .eq('step_number', stepNumber);
}

/** Toggle a completion criteria for a step. Stores in reflection_notes JSONB. */
export async function toggleStepCriteria(
  userId: string,
  stepNumber: number,
  criteriaIndex: number,
  checked: boolean,
): Promise<number[]> {
  // Fetch current reflection_notes
  const { data: row } = await supabase
    .from('step_progress')
    .select('reflection_notes')
    .eq('user_id', userId)
    .eq('step_number', stepNumber)
    .single();

  const notes = (row?.reflection_notes as Record<string, any>) ?? {};
  const completedCriteria: number[] = notes.completedCriteria ?? [];

  let updated: number[];
  if (checked) {
    updated = completedCriteria.includes(criteriaIndex)
      ? completedCriteria
      : [...completedCriteria, criteriaIndex];
  } else {
    updated = completedCriteria.filter((i: number) => i !== criteriaIndex);
  }

  await supabase
    .from('step_progress')
    .update({
      reflection_notes: { ...notes, completedCriteria: updated },
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('step_number', stepNumber);

  return updated;
}

// ─── Practice Completions ───────────────────────────────

/** Record a practice completion with step context. */
export async function recordPracticeCompletion(
  userId: string,
  practiceId: string,
  stepNumber?: number,
  completedBy: PracticeCompletion['completedBy'] = 'individual',
  coupleId?: string
): Promise<PracticeCompletion> {
  const { data, error } = await supabase
    .from('practice_completions')
    .insert({
      user_id: userId,
      practice_id: practiceId,
      step_number: stepNumber ?? null,
      completed_by: completedBy,
      couple_id: coupleId ?? null,
    })
    .select()
    .single();

  if (error) throw error;

  // Notify partner (non-blocking)
  notifyPartner(userId, 'practice_complete', { practiceId, stepNumber, completedBy });

  return mapPracticeCompletion(data);
}

/** Get practice completions for a user, optionally filtered by step. */
export async function getPracticeCompletions(
  userId: string,
  stepNumber?: number,
  limit = 50
): Promise<PracticeCompletion[]> {
  let query = supabase
    .from('practice_completions')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false })
    .limit(limit);

  if (stepNumber !== undefined) {
    query = query.eq('step_number', stepNumber);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(mapPracticeCompletion);
}

/** Count practice completions for a specific step. */
export async function countPracticeCompletionsForStep(
  userId: string,
  stepNumber: number
): Promise<number> {
  const { count, error } = await supabase
    .from('practice_completions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('step_number', stepNumber);

  if (error) throw error;
  return count ?? 0;
}

// ─── Reflections & Partner Round ─────────────────────────

/** Save a reflection response into reflection_notes JSONB. */
export async function saveReflection(
  userId: string,
  stepNumber: number,
  promptIndex: number,
  text: string
): Promise<void> {
  const { data: row } = await supabase
    .from('step_progress')
    .select('reflection_notes')
    .eq('user_id', userId)
    .eq('step_number', stepNumber)
    .single();

  const notes = (row?.reflection_notes as Record<string, any>) ?? {};
  const reflections = notes.reflections ?? {};
  reflections[String(promptIndex)] = text;

  await supabase
    .from('step_progress')
    .update({
      reflection_notes: { ...notes, reflections },
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('step_number', stepNumber);
}

/** Save a partner round response into reflection_notes JSONB. */
export async function savePartnerRoundResponse(
  userId: string,
  stepNumber: number,
  response: string
): Promise<void> {
  const { data: row } = await supabase
    .from('step_progress')
    .select('reflection_notes')
    .eq('user_id', userId)
    .eq('step_number', stepNumber)
    .single();

  const notes = (row?.reflection_notes as Record<string, any>) ?? {};

  await supabase
    .from('step_progress')
    .update({
      reflection_notes: { ...notes, partnerRoundResponse: response },
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('step_number', stepNumber);
}

/**
 * Read partner's step response from their step_progress row.
 * Returns the partnerRoundResponse string or null.
 */
export async function getPartnerStepResponse(
  _coupleId: string,
  partnerUserId: string,
  stepNumber: number
): Promise<string | null> {
  const { data: row, error } = await supabase
    .from('step_progress')
    .select('reflection_notes')
    .eq('user_id', partnerUserId)
    .eq('step_number', stepNumber)
    .single();

  if (error || !row) return null;
  const notes = row.reflection_notes as Record<string, any> | null;
  return notes?.partnerRoundResponse ?? null;
}

/**
 * Save a partner exchange follow-up response into reflection_notes JSONB.
 * This stores the user's reflection after seeing their partner's response.
 */
export async function savePartnerExchangeFollowUp(
  userId: string,
  stepNumber: number,
  followUpResponse: string
): Promise<void> {
  const { data: row } = await supabase
    .from('step_progress')
    .select('reflection_notes')
    .eq('user_id', userId)
    .eq('step_number', stepNumber)
    .single();

  const notes = (row?.reflection_notes as Record<string, any>) ?? {};

  await supabase
    .from('step_progress')
    .update({
      reflection_notes: { ...notes, partnerExchangeFollowUp: followUpResponse },
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('step_number', stepNumber);
}

// ─── Mappers ────────────────────────────────────────────

function mapStepProgress(row: any): StepProgress {
  return {
    id: row.id,
    userId: row.user_id,
    coupleId: row.couple_id ?? undefined,
    stepNumber: row.step_number,
    status: row.status,
    startedAt: row.started_at ?? undefined,
    completedAt: row.completed_at ?? undefined,
    reflectionNotes: row.reflection_notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapPracticeCompletion(row: any): PracticeCompletion {
  return {
    id: row.id,
    userId: row.user_id,
    coupleId: row.couple_id ?? undefined,
    practiceId: row.practice_id,
    stepNumber: row.step_number ?? undefined,
    completedBy: row.completed_by,
    completionData: row.completion_data ?? undefined,
    aiCoachNotes: row.ai_coach_notes ?? undefined,
    completedAt: row.completed_at,
    createdAt: row.created_at,
  };
}
