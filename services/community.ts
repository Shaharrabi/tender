/**
 * Community service — Supabase CRUD for anonymous stories, reactions, and alias system.
 */

import { supabase } from './supabase';
import type { CommunityPost, CommunityMembership, CommunityAlias, ReactionType } from '@/types/community';
import { generateAlias, shouldRotateAlias } from '@/constants/community';

// ─── Membership / Alias ───────────────────────────────────────

/**
 * Get or create a community membership for the user.
 * Auto-rotates alias if 30+ days since last rotation.
 */
export async function getOrCreateMembership(userId: string): Promise<CommunityMembership> {
  // Check for existing membership
  const { data: existing, error: fetchError } = await supabase
    .from('community_memberships')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (fetchError) throw fetchError;

  if (existing) {
    const membership = mapMembership(existing);

    // Auto-rotate if 30+ days old
    if (shouldRotateAlias(membership.aliasRotatedAt)) {
      return rotateAlias(userId);
    }

    return membership;
  }

  // Create new membership
  const alias = generateAlias();
  const { data, error } = await supabase
    .from('community_memberships')
    .insert({
      user_id: userId,
      alias_adjective: alias.adjective,
      alias_noun: alias.noun,
      alias_color: alias.color,
    })
    .select()
    .single();

  if (error) throw error;
  return mapMembership(data);
}

/**
 * Rotate a user's alias to a new random one.
 */
export async function rotateAlias(userId: string): Promise<CommunityMembership> {
  const alias = generateAlias();
  const { data, error } = await supabase
    .from('community_memberships')
    .update({
      alias_adjective: alias.adjective,
      alias_noun: alias.noun,
      alias_color: alias.color,
      alias_rotated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return mapMembership(data);
}

/**
 * Get a display alias from a membership.
 */
export function getAlias(membership: CommunityMembership): CommunityAlias {
  return {
    name: `${membership.aliasAdjective} ${membership.aliasNoun}`,
    color: membership.aliasColor,
    adjective: membership.aliasAdjective,
    noun: membership.aliasNoun,
  };
}

// ─── Get Posts ─────────────────────────────────────────────────

/** Reaction lookup: maps postId → Set of reaction types the user has made. */
type UserReactionMap = Map<string, Set<ReactionType>>;

export async function getPosts(
  userId: string | null,
  options: {
    category?: string;
    healingPhase?: string;
    attachmentStyle?: string;
    limit?: number;
  } = {}
): Promise<CommunityPost[]> {
  const { category, healingPhase, attachmentStyle, limit = 50 } = options;

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
  if (attachmentStyle) {
    query = query.eq('attachment_style', attachmentStyle);
  }

  const { data, error } = await query;
  if (error) throw error;

  // Fetch user's reactions (all types) to determine active states
  // Skip for guests (no userId)
  const postIds = (data ?? []).map((p: any) => p.id);
  const userReactions: UserReactionMap = new Map();

  if (userId && postIds.length > 0) {
    const { data: reactions } = await supabase
      .from('community_reactions')
      .select('post_id, reaction_type')
      .eq('user_id', userId)
      .in('post_id', postIds);

    for (const r of reactions ?? []) {
      if (!userReactions.has(r.post_id)) {
        userReactions.set(r.post_id, new Set());
      }
      userReactions.get(r.post_id)!.add(r.reaction_type as ReactionType);
    }
  }

  return (data ?? []).map((row: any) => mapPost(row, userReactions));
}

// ─── Create Post ───────────────────────────────────────────────

export async function createPost(
  userId: string,
  content: string,
  category: string,
  healingPhase?: string,
  attachmentStyle?: string,
  aliasName?: string,
  aliasColor?: string
): Promise<CommunityPost> {
  const { data, error } = await supabase
    .from('community_posts')
    .insert({
      author_id: userId,
      content,
      category,
      healing_phase: healingPhase ?? null,
      attachment_style: attachmentStyle ?? null,
      alias_name: aliasName ?? null,
      alias_color: aliasColor ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return mapPost(data);
}

// ─── Toggle Reaction ──────────────────────────────────────────

/**
 * Toggle a reaction on a post. Supports resonated, felt_seen, and been_there.
 * A user can have multiple reaction types on the same post.
 */
export async function toggleReaction(
  postId: string,
  userId: string,
  reactionType: ReactionType
): Promise<boolean> {
  // Check if this reaction already exists
  const { data: existing } = await supabase
    .from('community_reactions')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .eq('reaction_type', reactionType)
    .maybeSingle();

  if (existing) {
    // Remove reaction
    const { error } = await supabase
      .from('community_reactions')
      .delete()
      .eq('id', existing.id);
    if (error) throw error;
    return false; // removed
  } else {
    // Add reaction
    const { error } = await supabase
      .from('community_reactions')
      .insert({
        post_id: postId,
        user_id: userId,
        reaction_type: reactionType,
      });
    if (error) throw error;
    return true; // added
  }
}

/** @deprecated Use toggleReaction() instead. Kept for backward compatibility. */
export async function toggleResonated(postId: string, userId: string): Promise<boolean> {
  return toggleReaction(postId, userId, 'resonated');
}

// ─── Report Post ───────────────────────────────────────────────

export async function reportPost(postId: string): Promise<void> {
  const { error } = await supabase
    .from('community_posts')
    .update({ is_flagged: true })
    .eq('id', postId);

  if (error) throw error;
}

// ─── Helpers ───────────────────────────────────────────────────

function mapPost(row: any, userReactions?: UserReactionMap): CommunityPost {
  const reactions = userReactions?.get(row.id);
  return {
    id: row.id,
    authorId: row.author_id,
    content: row.content,
    category: row.category,
    healingPhase: row.healing_phase ?? undefined,
    attachmentStyle: row.attachment_style ?? undefined,
    isApproved: row.is_approved,
    isFlagged: row.is_flagged,
    resonatedCount: row.resonated_count ?? 0,
    feltSeenCount: row.felt_seen_count ?? 0,
    beenThereCount: row.been_there_count ?? 0,
    createdAt: row.created_at,
    hasResonated: reactions ? reactions.has('resonated') : false,
    hasFeltSeen: reactions ? reactions.has('felt_seen') : false,
    hasBeenThere: reactions ? reactions.has('been_there') : false,
    aliasName: row.alias_name ?? undefined,
    aliasColor: row.alias_color ?? undefined,
  };
}

function mapMembership(row: any): CommunityMembership {
  return {
    id: row.id,
    userId: row.user_id,
    aliasAdjective: row.alias_adjective,
    aliasNoun: row.alias_noun,
    aliasColor: row.alias_color,
    aliasRotatedAt: row.alias_rotated_at,
    joinedAt: row.joined_at,
  };
}
