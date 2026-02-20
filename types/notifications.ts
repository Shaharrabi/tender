/**
 * Engagement Notification Types
 *
 * Type definitions for the in-app engagement notification system.
 * 50 prompts across 7 categories, with weighted selection, frequency
 * throttling, and WEARE bottleneck targeting.
 */

import type { ComponentType } from 'react';
import type { IconProps } from '@/assets/graphics/icons';

// ─── Notification Categories ────────────────────────────

export type NotificationCategory =
  | 'science_drop'
  | 'micro_insight'
  | 'duolingo_wit'
  | 'practice_nudge'
  | 'growth_mirror'
  | 'couple_bubble'
  | 'milestone_streak';

// ─── Engagement Prompt ──────────────────────────────────

/** A single engagement prompt from the 50-prompt pool. */
export interface EngagementPrompt {
  /** Unique ID, e.g. 'science-01' */
  id: string;
  /** Category for frequency caps and filtering */
  category: NotificationCategory;
  /** Notification title (short, punchy) */
  title: string;
  /** Notification body (1-3 sentences) */
  body: string;
  /** Research source citation (science_drop only) */
  source?: string;
  /** Content tags for filtering */
  tags?: string[];
  /** WEARE variable name for targeted delivery */
  weareTarget?: string;
  /** Earliest day since signup to show this prompt */
  minDay?: number;
  /** How often this can repeat: once, weekly, biweekly */
  maxFrequency?: 'once' | 'weekly' | 'biweekly';
  /** Selection priority 1-10 (higher = more likely to be selected) */
  priority: number;
  /** SVG icon component */
  icon: ComponentType<IconProps>;
  /** Category accent color for left border */
  accentColor: string;
  /** Optional in-app navigation route */
  actionRoute?: string;
}

// ─── Category Config ────────────────────────────────────

export interface CategoryConfig {
  id: NotificationCategory;
  label: string;
  description: string;
  icon: ComponentType<IconProps>;
  accentColor: string;
  maxPerWeek: number;
}

// ─── Notification Instance (log entry) ──────────────────

/** A notification that was shown to the user. */
export interface NotificationInstance {
  id: string;
  promptId: string;
  category: string;
  userId: string;
  shownAt: string;
  dismissedAt?: string;
  tappedAt?: string;
  actionTaken?: boolean;
}

// ─── Selection State (AsyncStorage) ─────────────────────

/** Tracks what has been shown to enforce frequency limits. */
export interface NotificationSelectionState {
  /** Last shown date per category (ISO date strings) */
  lastShownByCategory: Partial<Record<NotificationCategory, string>>;
  /** Prompt IDs shown in the last 14 days */
  seenPromptIds: string[];
  /** Category of the last shown notification */
  lastCategory?: NotificationCategory;
  /** ISO timestamps of all shows today */
  todayShows: string[];
  /** Session flag — true if already shown this session */
  shownThisSession: boolean;
  /** Total lifetime shows */
  totalShown: number;
  /** Last shown ISO timestamp */
  lastShownAt?: string;
}

// ─── User Preferences ───────────────────────────────────

/** Per-category toggle for engagement notifications. */
export interface EngagementNotificationPreferences {
  scienceDrops: boolean;
  microInsights: boolean;
  duolingoWit: boolean;
  practiceNudges: boolean;
  growthMirrors: boolean;
  coupleBubble: boolean;
  milestoneStreak: boolean;
}
