/**
 * Community types — anonymous story sharing, aliases, and curated resources.
 */

export type ReactionType = 'resonated' | 'felt_seen' | 'been_there';

export interface CommunityPost {
  id: string;
  authorId: string;
  content: string;
  category: string;
  healingPhase?: string;
  attachmentStyle?: string;
  isApproved: boolean;
  isFlagged: boolean;
  resonatedCount: number;
  feltSeenCount: number;
  beenThereCount: number;
  createdAt: string;
  /** Whether the current user has each reaction type on this post */
  hasResonated?: boolean;
  hasFeltSeen?: boolean;
  hasBeenThere?: boolean;
  /** Alias name snapshotted at post time */
  aliasName?: string;
  /** Alias color snapshotted at post time */
  aliasColor?: string;
}

// ─── Alias System ───────────────────────────────────────────

export interface CommunityMembership {
  id: string;
  userId: string;
  aliasAdjective: string;
  aliasNoun: string;
  aliasColor: string;
  aliasRotatedAt: string;
  joinedAt: string;
}

export interface CommunityAlias {
  name: string;       // e.g. "Gentle River"
  color: string;      // e.g. "#6BA3A0"
  adjective: string;
  noun: string;
}

export type CommunityTab = 'forYou' | 'allStories' | 'letters' | 'articles' | 'circle';

export type PostCategory =
  | 'Attachment'
  | 'Communication'
  | 'Conflict'
  | 'Emotions'
  | 'Growth'
  | 'Values'
  | 'Intimacy';

export type HealingPhase =
  | 'seeing'
  | 'feeling'
  | 'shifting'
  | 'integrating'
  | 'sustaining';

export interface ContentItem {
  id: string;
  title: string;
  category: string;
  description: string;
  readTime: string;
  icon: string;
  source: string;
}

// ─── Letter Desk ────────────────────────────────────────────

export interface WeeklyPrompt {
  id: string;
  promptText: string;
  category: string;
  activeFrom: string;
  activeUntil: string;
  createdAt: string;
}

export interface CommunityLetter {
  id: string;
  authorId: string;
  recipientId?: string;
  promptId?: string;
  content: string;
  authorAliasName?: string;
  authorAliasColor?: string;
  authorPattern?: string;
  recipientPattern?: string;
  isApproved: boolean;
  isRead: boolean;
  createdAt: string;
  deliveredAt?: string;
  readAt?: string;
  /** The prompt text — joined from weekly_prompts or passed inline */
  promptText?: string;
}
