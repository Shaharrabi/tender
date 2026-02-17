/**
 * Highlight Configs — Defines which elements get the pulse animation.
 *
 * Each highlight runs once on first view, then is tracked as "seen"
 * in FirstTimeContext and never replays.
 */

export interface HighlightConfig {
  /** Unique ID tracked in FirstTimeContext.seenHighlights */
  id: string;
  /** Screen where this highlight appears */
  screen: string;
  /** Developer description */
  description: string;
}

export const HIGHLIGHT_CONFIGS: HighlightConfig[] = [
  // ─── Home Screen ─────────────────────────────────────────
  {
    id: 'home_assessment_cta',
    screen: 'home',
    description: 'The main Tender Assessment CTA card',
  },
  {
    id: 'home_practice_card',
    screen: 'home',
    description: "Today's recommended practice card",
  },
  {
    id: 'home_journal',
    screen: 'home',
    description: 'Journal feature card in explore grid',
  },
  {
    id: 'home_nuance',
    screen: 'home',
    description: 'Nuance AI coach feature card',
  },
  {
    id: 'home_xp_bar',
    screen: 'home',
    description: 'XP progress bar at top',
  },
  {
    id: 'home_streak',
    screen: 'home',
    description: 'Streak banner',
  },

  // ─── Assessment Screen ───────────────────────────────────
  {
    id: 'assessment_progress',
    screen: 'assessment',
    description: 'Progress bar at top of assessment',
  },

  // ─── Portrait Screen ─────────────────────────────────────
  {
    id: 'portrait_snapshot',
    screen: 'portrait',
    description: 'Overview snapshot section',
  },
  {
    id: 'portrait_share',
    screen: 'portrait',
    description: 'Share/export button',
  },

  // ─── Courses Screen ──────────────────────────────────────
  {
    id: 'courses_first',
    screen: 'courses',
    description: 'First course card in the list',
  },

  // ─── Community Screen ────────────────────────────────────
  {
    id: 'community_stories',
    screen: 'community',
    description: 'First story card in the feed',
  },
  {
    id: 'community_resources',
    screen: 'community',
    description: 'Resources tab content',
  },

  // ─── Journal Screen ──────────────────────────────────────
  {
    id: 'journal_calendar',
    screen: 'journal',
    description: 'Calendar section',
  },
  {
    id: 'journal_checkin',
    screen: 'journal',
    description: 'Daily check-in section',
  },
];
