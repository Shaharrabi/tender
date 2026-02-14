/**
 * Community service — Supabase CRUD for anonymous stories and reactions.
 */

import { supabase } from './supabase';
import type { CommunityPost } from '@/types/community';

// ─── Get Posts ─────────────────────────────────────────────

export async function getPosts(
  userId: string,
  options: {
    category?: string;
    healingPhase?: string;
    limit?: number;
  } = {}
): Promise<CommunityPost[]> {
  const { category, healingPhase, limit = 50 } = options;

  let query = supabase
    .from('community_posts')
    .select('*')
    .eq('is_approved', true)
    .eq('is_flagged', false)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (category && category !== 'All') {
    query = query.eq('category', category);
  }
  if (healingPhase) {
    query = query.eq('healing_phase', healingPhase);
  }

  const { data, error } = await query;
  if (error) throw error;

  // Fetch user's reactions to determine hasResonated
  const postIds = (data ?? []).map((p: any) => p.id);
  let userReactions: Set<string> = new Set();

  if (postIds.length > 0) {
    const { data: reactions } = await supabase
      .from('community_reactions')
      .select('post_id')
      .eq('user_id', userId)
      .in('post_id', postIds);

    userReactions = new Set((reactions ?? []).map((r: any) => r.post_id));
  }

  return (data ?? []).map((row: any) => mapPost(row, userReactions));
}

// ─── Create Post ───────────────────────────────────────────

export async function createPost(
  userId: string,
  content: string,
  category: string,
  healingPhase?: string,
  attachmentStyle?: string
): Promise<CommunityPost> {
  const { data, error } = await supabase
    .from('community_posts')
    .insert({
      author_id: userId,
      content,
      category,
      healing_phase: healingPhase ?? null,
      attachment_style: attachmentStyle ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return mapPost(data);
}

// ─── Toggle Resonated ──────────────────────────────────────

export async function toggleResonated(
  postId: string,
  userId: string
): Promise<boolean> {
  // Check if reaction exists
  const { data: existing } = await supabase
    .from('community_reactions')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .eq('reaction_type', 'resonated')
    .maybeSingle();

  if (existing) {
    // Remove reaction
    const { error } = await supabase
      .from('community_reactions')
      .delete()
      .eq('id', existing.id);
    if (error) throw error;
    return false; // no longer resonated
  } else {
    // Add reaction
    const { error } = await supabase
      .from('community_reactions')
      .insert({
        post_id: postId,
        user_id: userId,
        reaction_type: 'resonated',
      });
    if (error) throw error;
    return true; // now resonated
  }
}

// ─── Report Post ───────────────────────────────────────────

export async function reportPost(postId: string): Promise<void> {
  const { error } = await supabase
    .from('community_posts')
    .update({ is_flagged: true })
    .eq('id', postId);

  if (error) throw error;
}

// ─── Helpers ───────────────────────────────────────────────

function mapPost(row: any, userReactions?: Set<string>): CommunityPost {
  return {
    id: row.id,
    authorId: row.author_id,
    content: row.content,
    category: row.category,
    healingPhase: row.healing_phase ?? undefined,
    attachmentStyle: row.attachment_style ?? undefined,
    isApproved: row.is_approved,
    isFlagged: row.is_flagged,
    resonatedCount: row.resonated_count,
    createdAt: row.created_at,
    hasResonated: userReactions ? userReactions.has(row.id) : false,
  };
}
