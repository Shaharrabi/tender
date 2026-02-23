/**
 * Building Bridges Card Game — Supabase Service
 *
 * CRUD for card_completions table.
 * Tracks which cards have been completed, reflections, and XP.
 */

import { supabase } from './supabase';
import type { CardCategory, CardDeck } from '@/constants/card-game/categories';

// ─── Types ──────────────────────────────────────────────

export interface CardCompletion {
  id: string;
  userId: string;
  cardId: string;
  deck: string;
  category?: string;
  mode: string;
  reflectionText?: string;
  xpEarned: number;
  completedAt: string;
}

export interface CompletionStats {
  totalCompleted: number;
  totalXP: number;
  reflectionCount: number;
  openHeartCompleted: number;
  byCategory: Partial<Record<string, number>>;
}

// ─── Save Completion ────────────────────────────────────

export async function saveCardCompletion(
  userId: string,
  cardId: string,
  deck: CardDeck,
  category?: CardCategory,
  reflectionText?: string,
  xpEarned: number = 25,
  mode: string = 'draw',
): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('card_completions')
      .insert({
        user_id: userId,
        card_id: cardId,
        deck,
        category: category ?? null,
        mode,
        reflection_text: reflectionText || null,
        xp_earned: xpEarned,
      })
      .select('id')
      .single();

    if (error) {
      console.warn('[BuildingBridges] Save completion error:', error);
      return null;
    }
    return data?.id ?? null;
  } catch (e) {
    console.warn('[BuildingBridges] Save completion exception:', e);
    return null;
  }
}

// ─── Get Completions ────────────────────────────────────

export async function getCardCompletions(
  userId: string,
  limit: number = 100,
): Promise<CardCompletion[]> {
  try {
    const { data, error } = await supabase
      .from('card_completions')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.warn('[BuildingBridges] Get completions error:', error);
      return [];
    }
    return (data ?? []).map(mapCompletion);
  } catch {
    return [];
  }
}

// ─── Get Completion Stats ───────────────────────────────

export async function getCompletionStats(userId: string): Promise<CompletionStats> {
  try {
    const { data, error } = await supabase
      .from('card_completions')
      .select('card_id, deck, category, reflection_text, xp_earned')
      .eq('user_id', userId);

    if (error) {
      console.warn('[BuildingBridges] Stats error:', error);
      return emptyStats();
    }

    const rows = data ?? [];
    // Deduplicate by card_id (count each card only once)
    const seen = new Set<string>();
    const unique = rows.filter((r) => {
      if (seen.has(r.card_id)) return false;
      seen.add(r.card_id);
      return true;
    });

    const byCategory: Partial<Record<string, number>> = {};
    let openHeartCompleted = 0;
    let totalXP = 0;
    let reflectionCount = 0;

    for (const row of unique) {
      totalXP += row.xp_earned ?? 0;
      if (row.reflection_text && row.reflection_text.trim().length > 0) {
        reflectionCount++;
      }
      if (row.deck === 'open-heart') {
        openHeartCompleted++;
      } else if (row.category) {
        byCategory[row.category] = (byCategory[row.category] ?? 0) + 1;
      }
    }

    return {
      totalCompleted: unique.length,
      totalXP,
      reflectionCount,
      openHeartCompleted,
      byCategory,
    };
  } catch {
    return emptyStats();
  }
}

// ─── Check if card completed ────────────────────────────

export async function isCardCompleted(userId: string, cardId: string): Promise<boolean> {
  try {
    const { count, error } = await supabase
      .from('card_completions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('card_id', cardId);

    if (error) return false;
    return (count ?? 0) > 0;
  } catch {
    return false;
  }
}

// ─── Get completed card IDs ─────────────────────────────

export async function getCompletedCardIds(userId: string): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('card_completions')
      .select('card_id')
      .eq('user_id', userId);

    if (error) return [];
    return [...new Set((data ?? []).map((r) => r.card_id))];
  } catch {
    return [];
  }
}

// ─── Helpers ────────────────────────────────────────────

function emptyStats(): CompletionStats {
  return {
    totalCompleted: 0,
    totalXP: 0,
    reflectionCount: 0,
    openHeartCompleted: 0,
    byCategory: {},
  };
}

function mapCompletion(row: any): CardCompletion {
  return {
    id: row.id,
    userId: row.user_id,
    cardId: row.card_id,
    deck: row.deck,
    category: row.category ?? undefined,
    mode: row.mode ?? 'draw',
    reflectionText: row.reflection_text ?? undefined,
    xpEarned: row.xp_earned ?? 25,
    completedAt: row.completed_at,
  };
}
