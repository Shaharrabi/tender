/**
 * Letter Desk service — Supabase CRUD for anonymous letter exchange.
 *
 * Core flow:
 * 1. User writes a letter → goes into pool
 * 2. System matches undelivered letters by attachment pattern
 * 3. User receives matched letters on their Letters tab
 * 4. One-way only — no replies
 */

import { supabase } from './supabase';
import type { CommunityLetter, WeeklyPrompt } from '@/types/community';

// ─── Weekly Prompts ───────────────────────────────────────────

/**
 * Get the currently active weekly prompt.
 * Falls back to null if no prompt is active this week.
 */
export async function getActivePrompt(): Promise<WeeklyPrompt | null> {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  const { data, error } = await supabase
    .from('weekly_prompts')
    .select('*')
    .lte('active_from', today)
    .gte('active_until', today)
    .order('active_from', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('[Letters] Failed to fetch active prompt:', error);
    return null;
  }

  return data ? mapPrompt(data) : null;
}

// ─── Create Letter ────────────────────────────────────────────

/**
 * Create a new letter. The letter is auto-approved (safety check done client-side).
 * It enters the matching pool with recipient_id = null.
 */
export async function createLetter(
  userId: string,
  content: string,
  promptId: string | null,
  authorPattern: string | null,
  aliasName: string,
  aliasColor: string
): Promise<CommunityLetter> {
  const { data, error } = await supabase
    .from('community_letters')
    .insert({
      author_id: userId,
      content,
      prompt_id: promptId,
      author_pattern: authorPattern,
      author_alias_name: aliasName,
      author_alias_color: aliasColor,
      is_approved: true,
    })
    .select()
    .single();

  if (error) throw error;
  return mapLetter(data);
}

// ─── Get Letters ──────────────────────────────────────────────

/**
 * Get letters the user has sent.
 */
export async function getSentLetters(userId: string): Promise<CommunityLetter[]> {
  const { data, error } = await supabase
    .from('community_letters')
    .select('*')
    .eq('author_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map((row: any) => mapLetter(row));
}

/**
 * Get letters the user has received (delivered to them).
 */
export async function getReceivedLetters(userId: string): Promise<CommunityLetter[]> {
  const { data, error } = await supabase
    .from('community_letters')
    .select('*')
    .eq('recipient_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map((row: any) => mapLetter(row));
}

/**
 * Get letter stats for the user.
 */
export async function getLetterStats(userId: string): Promise<{
  sentCount: number;
  receivedCount: number;
  unreadCount: number;
}> {
  // Run all counts in parallel; use error field so one failure doesn't block the rest
  const [sentRes, receivedRes, unreadRes] = await Promise.all([
    supabase
      .from('community_letters')
      .select('id', { count: 'exact', head: true })
      .eq('author_id', userId),
    supabase
      .from('community_letters')
      .select('id', { count: 'exact', head: true })
      .eq('recipient_id', userId),
    supabase
      .from('community_letters')
      .select('id', { count: 'exact', head: true })
      .eq('recipient_id', userId)
      .eq('is_read', false),
  ]);

  return {
    sentCount: sentRes.error ? 0 : (sentRes.count ?? 0),
    receivedCount: receivedRes.error ? 0 : (receivedRes.count ?? 0),
    unreadCount: unreadRes.error ? 0 : (unreadRes.count ?? 0),
  };
}

// ─── Mark Read ────────────────────────────────────────────────

/**
 * Mark a received letter as read.
 */
export async function markLetterRead(letterId: string): Promise<void> {
  const { error } = await supabase
    .from('community_letters')
    .update({
      is_read: true,
      read_at: new Date().toISOString(),
    })
    .eq('id', letterId);

  if (error) throw error;
}

// ─── Match & Deliver ──────────────────────────────────────────

/**
 * Try to match undelivered letters to the given user.
 *
 * Matching logic (simplified MVP):
 * 1. Find oldest undelivered, approved letter NOT authored by this user
 * 2. Prefer same attachment pattern (they understand each other)
 * 3. Fallback to any pattern if no same-pattern match
 * 4. Set recipient_id + delivered_at
 *
 * Returns the matched letter or null if none available.
 */
export async function matchLetterForUser(
  userId: string,
  userPattern: string | null
): Promise<CommunityLetter | null> {
  // First: try to find a letter from someone with the same pattern
  if (userPattern) {
    const samePattern = await findAndDeliverLetter(userId, userPattern);
    if (samePattern) return samePattern;
  }

  // Fallback: any undelivered letter (cross-pattern)
  const anyPattern = await findAndDeliverLetter(userId, null);
  return anyPattern;
}

/**
 * Internal: find oldest undelivered letter matching criteria and deliver it.
 */
async function findAndDeliverLetter(
  recipientId: string,
  authorPattern: string | null
): Promise<CommunityLetter | null> {
  let query = supabase
    .from('community_letters')
    .select('*')
    .is('recipient_id', null)
    .eq('is_approved', true)
    .neq('author_id', recipientId) // never receive your own letter
    .order('created_at', { ascending: true })
    .limit(1);

  if (authorPattern) {
    query = query.eq('author_pattern', authorPattern);
  }

  const { data, error } = await query;
  if (error || !data || data.length === 0) return null;

  const letter = data[0];

  // Deliver the letter
  const { data: updated, error: updateError } = await supabase
    .from('community_letters')
    .update({
      recipient_id: recipientId,
      delivered_at: new Date().toISOString(),
    })
    .eq('id', letter.id)
    .is('recipient_id', null) // race condition guard
    .select()
    .single();

  if (updateError || !updated) return null;
  return mapLetter(updated);
}

// ─── Helpers ──────────────────────────────────────────────────

function mapLetter(row: any): CommunityLetter {
  return {
    id: row.id,
    authorId: row.author_id,
    recipientId: row.recipient_id ?? undefined,
    promptId: row.prompt_id ?? undefined,
    content: row.content,
    authorAliasName: row.author_alias_name ?? undefined,
    authorAliasColor: row.author_alias_color ?? undefined,
    authorPattern: row.author_pattern ?? undefined,
    recipientPattern: row.recipient_pattern ?? undefined,
    isApproved: row.is_approved,
    isRead: row.is_read,
    createdAt: row.created_at,
    deliveredAt: row.delivered_at ?? undefined,
    readAt: row.read_at ?? undefined,
  };
}

function mapPrompt(row: any): WeeklyPrompt {
  return {
    id: row.id,
    promptText: row.prompt_text,
    category: row.category,
    activeFrom: row.active_from,
    activeUntil: row.active_until,
    createdAt: row.created_at,
  };
}
