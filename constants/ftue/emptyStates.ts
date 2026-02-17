/**
 * Empty State Configs — Defines messages for all empty/locked sections.
 *
 * Each config provides copy and action info for the EmptyState component.
 * Icon components are referenced by name and resolved at render time.
 */

export interface EmptyStateConfig {
  /** Unique ID */
  id: string;
  /** Screen where this empty state appears */
  screen: string;
  /** Section within the screen */
  section: string;
  /** Main heading */
  title: string;
  /** Descriptive body text */
  message: string;
  /** Primary CTA button text */
  ctaText?: string;
  /** Navigation route for the CTA (if applicable) */
  ctaRoute?: string;
  /** Action key for non-navigation CTAs */
  ctaAction?: string;
  /** Secondary CTA text */
  secondaryCtaText?: string;
  /** Secondary CTA action/route */
  secondaryCtaAction?: string;
}

export const EMPTY_STATES: Record<string, EmptyStateConfig> = {
  // ─── Home / Dashboard ────────────────────────────────────
  home_no_assessment: {
    id: 'home_no_assessment',
    screen: 'home',
    section: 'assessment',
    title: 'Your journey starts here',
    message:
      'Take the Tender Assessment to discover your patterns in love. It takes about an hour, and you can pause anytime.',
    ctaText: 'Begin Assessment',
    ctaRoute: '/(app)/tender-assessment',
  },

  // ─── Portrait ────────────────────────────────────────────
  portrait_locked: {
    id: 'portrait_locked',
    screen: 'portrait',
    section: 'main',
    title: 'Your Portrait is waiting',
    message:
      'Complete the Tender Assessment to unlock your personalized Portrait — a deep look at how you connect, feel, and grow.',
    ctaText: 'Continue Assessment',
    ctaRoute: '/(app)/tender-assessment',
  },
  portrait_generating: {
    id: 'portrait_generating',
    screen: 'portrait',
    section: 'generating',
    title: 'Creating your Portrait...',
    message:
      "We're weaving together everything you shared. This usually takes about a minute.",
  },

  // ─── Courses ─────────────────────────────────────────────
  courses_none_started: {
    id: 'courses_none_started',
    screen: 'courses',
    section: 'main',
    title: 'Small lessons, real shifts',
    message:
      'Each course is a short deep-dive into a pattern that matters. Pick one that calls to you.',
    ctaText: 'Browse Courses',
    ctaAction: 'scroll:course-list',
  },
  courses_all_complete: {
    id: 'courses_all_complete',
    screen: 'courses',
    section: 'complete',
    title: "You've completed all courses",
    message:
      "Amazing work. New courses are added regularly — we'll let you know when something new arrives.",
    ctaText: 'Revisit a Course',
    ctaAction: 'scroll:course-list',
  },

  // ─── Journal ─────────────────────────────────────────────
  journal_empty: {
    id: 'journal_empty',
    screen: 'journal',
    section: 'main',
    title: 'Your journal is ready',
    message:
      "As you complete practices, check-ins, and reflections, they'll appear here — a quiet record of your growth.",
    ctaText: 'Start a Practice',
    ctaRoute: '/(app)/exercises',
    secondaryCtaText: 'Check in now',
    secondaryCtaAction: 'action:mood-checkin',
  },
  journal_no_entries_today: {
    id: 'journal_no_entries_today',
    screen: 'journal',
    section: 'today',
    title: 'Nothing yet today',
    message:
      "That's okay. When you're ready, there's always something small to try.",
    ctaText: 'Quick Check-in',
    ctaAction: 'action:mood-checkin',
  },

  // ─── Community ───────────────────────────────────────────
  community_locked: {
    id: 'community_locked',
    screen: 'community',
    section: 'locked',
    title: 'Community unlocks soon',
    message:
      "Complete at least one chapter of the assessment to join the community — where you'll find stories from people like you.",
    ctaText: 'Continue Assessment',
    ctaRoute: '/(app)/tender-assessment',
  },
  community_no_stories: {
    id: 'community_no_stories',
    screen: 'community',
    section: 'stories',
    title: "It's quiet here",
    message:
      'No stories match your filters right now. Check back soon, or be the first to share.',
    ctaText: 'Share Your Story',
    ctaAction: 'action:share-story',
    secondaryCtaText: 'Clear Filters',
    secondaryCtaAction: 'action:clear-filters',
  },
  community_no_resources: {
    id: 'community_no_resources',
    screen: 'community',
    section: 'resources',
    title: 'Coming soon',
    message: 'No articles in this category yet. Check back soon!',
  },

  // ─── Relationship Portal ─────────────────────────────────
  portal_no_partner: {
    id: 'portal_no_partner',
    screen: 'portal',
    section: 'invite',
    title: 'Invite your partner',
    message:
      "When your partner joins Tender, you'll be able to share parts of your Portrait and see theirs — when you're both ready.",
    ctaText: 'Send Invite',
    ctaAction: 'action:invite-partner',
  },
  portal_partner_pending: {
    id: 'portal_partner_pending',
    screen: 'portal',
    section: 'pending',
    title: 'Waiting for your partner',
    message:
      "Your invitation has been sent. Once they join and complete their assessment, you'll both be able to share.",
    ctaText: 'Resend Invite',
    ctaAction: 'action:resend-invite',
  },
  portal_no_shares: {
    id: 'portal_no_shares',
    screen: 'portal',
    section: 'shares',
    title: 'Nothing shared yet',
    message:
      "Your partner hasn't shared anything with you yet. When they're ready, it will appear here.",
    ctaText: 'Share Something First',
    ctaRoute: '/(app)/sharing-settings',
  },

  // ─── Exercises ───────────────────────────────────────────
  exercises_no_results: {
    id: 'exercises_no_results',
    screen: 'exercises',
    section: 'search',
    title: 'No exercises found',
    message: 'Try a different search term or clear the filter.',
    ctaText: 'Show all exercises',
    ctaAction: 'action:clear-filters',
  },
  exercises_locked: {
    id: 'exercises_locked',
    screen: 'exercises',
    section: 'locked',
    title: 'Practices unlock with your Portrait',
    message:
      'Complete the assessment to get practices tailored to your specific patterns and growth edges.',
    ctaText: 'Continue Assessment',
    ctaRoute: '/(app)/tender-assessment',
  },

  // ─── Nuance Chat ─────────────────────────────────────────
  chat_welcome: {
    id: 'chat_welcome',
    screen: 'chat',
    section: 'history',
    title: "Hi, I'm Nuance",
    message:
      "I'm here to help you make sense of your patterns and try new things. Ask me anything, or let's start with what's on your mind.",
    ctaText: 'Start a Conversation',
    ctaAction: 'action:focus-input',
  },

  // ─── Progress / Milestones ───────────────────────────────
  milestones_empty: {
    id: 'milestones_empty',
    screen: 'progress',
    section: 'milestones',
    title: 'Milestones are waiting',
    message:
      "As you engage with Tender — taking assessments, completing practices, showing up — you'll earn milestones along the way.",
    ctaText: 'Start Your Journey',
    ctaRoute: '/(app)/tender-assessment',
  },

  // ─── Search ──────────────────────────────────────────────
  search_no_results: {
    id: 'search_no_results',
    screen: 'search',
    section: 'results',
    title: 'No results found',
    message: 'Try different keywords or browse by category instead.',
    ctaText: 'Browse All',
    ctaAction: 'action:clear-search',
  },

  // ─── Notifications ───────────────────────────────────────
  notifications_empty: {
    id: 'notifications_empty',
    screen: 'notifications',
    section: 'main',
    title: 'All caught up',
    message:
      "No new notifications. We'll let you know when something needs your attention.",
  },
};
