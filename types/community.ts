/**
 * Community types — anonymous story sharing and curated resources.
 */

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
  createdAt: string;
  /** Whether the current user has resonated with this post */
  hasResonated?: boolean;
}

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
