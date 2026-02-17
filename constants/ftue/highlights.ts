/**
 * Highlight Configs — Defines which elements get the pulse animation.
 *
 * Each highlight runs once on first view, then is tracked as "seen"
 * in FirstTimeContext and never replays.
 *
 * Post-tour, only 4 key home features get highlighted:
 * Assessment, Courses, Journal, Community.
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
  // ─── Home Screen (4 key features) ─────────────────────
  {
    id: 'home_assessment_cta',
    screen: 'home',
    description: 'The main Tender Assessment CTA card',
  },
  {
    id: 'home_courses_card',
    screen: 'home',
    description: 'Courses feature card in explore grid',
  },
  {
    id: 'home_journal_card',
    screen: 'home',
    description: 'Journal feature card in explore grid',
  },
  {
    id: 'home_community_card',
    screen: 'home',
    description: 'Community feature card in explore grid',
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

  // ─── Journal Screen ──────────────────────────────────────
  {
    id: 'journal_calendar',
    screen: 'journal',
    description: 'Calendar section',
  },
];
