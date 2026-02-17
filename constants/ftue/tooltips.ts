/**
 * Tooltip Configs — All 27 contextual tooltips across the app.
 *
 * Each tooltip shows once, then is tracked as "seen" in FirstTimeContext.
 * Tooltips are managed per-screen by the TooltipManager component.
 */

export type TooltipPosition = 'top' | 'bottom';

export interface TooltipConfig {
  /** Unique ID tracked in FirstTimeContext.seenTooltips */
  id: string;
  /** Screen where this tooltip appears */
  screen: string;
  /** RefRegistry key for the target element */
  targetRef: string;
  /** Bold title line */
  title: string;
  /** Body text */
  body: string;
  /** CTA button text */
  ctaText: string;
  /** Position relative to target */
  position: TooltipPosition;
  /** Display order within a screen (lower = first) */
  order: number;
}

export const TOOLTIP_CONFIGS: TooltipConfig[] = [
  // ═══════════════════════════════════════════════════════════
  // HOME SCREEN
  // ═══════════════════════════════════════════════════════════
  {
    id: 'tooltip_home_assessment',
    screen: 'home',
    targetRef: 'home_assessmentCta',
    title: 'Start here ✨',
    body: 'The Tender Assessment takes about an hour — but you can pause anytime and pick up where you left off.',
    ctaText: 'Got it',
    position: 'bottom',
    order: 1,
  },
  {
    id: 'tooltip_home_portrait',
    screen: 'home',
    targetRef: 'home_portraitCard',
    title: 'Your Portrait awaits',
    body: 'Complete the assessment to unlock a personalized map of how you love.',
    ctaText: 'Got it',
    position: 'bottom',
    order: 2,
  },
  {
    id: 'tooltip_home_courses',
    screen: 'home',
    targetRef: 'home_coursesCard',
    title: 'Bite-sized growth',
    body: 'Each course is 5 short lessons. Start with whatever calls to you.',
    ctaText: 'Got it',
    position: 'bottom',
    order: 3,
  },
  {
    id: 'tooltip_home_journal',
    screen: 'home',
    targetRef: 'home_journalCard',
    title: 'Your memory bank',
    body: "Every practice and check-in lives here. Come back anytime to see how far you've come.",
    ctaText: 'Got it',
    position: 'bottom',
    order: 4,
  },
  {
    id: 'tooltip_home_community',
    screen: 'home',
    targetRef: 'home_communityCard',
    title: "You're not alone",
    body: 'Anonymous stories from people on a similar path — filtered just for you.',
    ctaText: 'Got it',
    position: 'bottom',
    order: 5,
  },
  {
    id: 'tooltip_home_xp',
    screen: 'home',
    targetRef: 'home_xpBar',
    title: 'Rhythm, not perfection',
    body: "This tracks your engagement — not to pressure you, just to celebrate showing up.",
    ctaText: 'Got it',
    position: 'bottom',
    order: 6,
  },
  {
    id: 'tooltip_home_streak',
    screen: 'home',
    targetRef: 'home_streakBanner',
    title: 'Streaks are gentle here',
    body: "Miss a day? No shame. Life happens. Just come back when you can.",
    ctaText: 'Got it',
    position: 'bottom',
    order: 7,
  },

  // ═══════════════════════════════════════════════════════════
  // ASSESSMENT SCREEN
  // ═══════════════════════════════════════════════════════════
  {
    id: 'tooltip_assessment_progress',
    screen: 'assessment',
    targetRef: 'assessment_progressBar',
    title: 'Your progress saves automatically',
    body: 'You can leave anytime and pick up exactly where you stopped.',
    ctaText: 'Got it',
    position: 'bottom',
    order: 1,
  },
  {
    id: 'tooltip_assessment_chapters',
    screen: 'assessment',
    targetRef: 'assessment_chapterList',
    title: '7 chapters, your pace',
    body: 'Each one explores a different part of how you show up in relationships.',
    ctaText: 'Begin',
    position: 'bottom',
    order: 2,
  },
  {
    id: 'tooltip_assessment_scale',
    screen: 'assessment',
    targetRef: 'assessment_likertScale',
    title: 'No right answers',
    body: 'Just pick what feels most true for you right now.',
    ctaText: 'Got it',
    position: 'top',
    order: 3,
  },

  // ═══════════════════════════════════════════════════════════
  // PORTRAIT SCREEN
  // ═══════════════════════════════════════════════════════════
  {
    id: 'tooltip_portrait_snapshot',
    screen: 'portrait',
    targetRef: 'portrait_snapshot',
    title: 'The overview',
    body: 'This is your Portrait at a glance. Tap any section to go deeper.',
    ctaText: 'Got it',
    position: 'bottom',
    order: 1,
  },
  {
    id: 'tooltip_portrait_lenses',
    screen: 'portrait',
    targetRef: 'portrait_lenses',
    title: 'Four ways of seeing you',
    body: 'Each lens reveals something different about how you connect, feel, and grow.',
    ctaText: 'Explore',
    position: 'top',
    order: 2,
  },
  {
    id: 'tooltip_portrait_growth',
    screen: 'portrait',
    targetRef: 'portrait_growthEdges',
    title: 'Your edges',
    body: 'These are the places where small shifts can make the biggest difference.',
    ctaText: 'Got it',
    position: 'top',
    order: 3,
  },
  {
    id: 'tooltip_portrait_share',
    screen: 'portrait',
    targetRef: 'portrait_share',
    title: "Only when you're ready",
    body: 'You control what your partner sees. Nothing is shared without your say.',
    ctaText: 'Got it',
    position: 'top',
    order: 4,
  },

  // ═══════════════════════════════════════════════════════════
  // COURSES SCREEN
  // ═══════════════════════════════════════════════════════════
  {
    id: 'tooltip_courses_lessons',
    screen: 'courses',
    targetRef: 'courses_lessonList',
    title: '5 lessons, ~25 minutes total',
    body: 'Each one has something to read, something to try, and a moment to reflect.',
    ctaText: 'Start',
    position: 'bottom',
    order: 1,
  },
  {
    id: 'tooltip_courses_reflection',
    screen: 'courses',
    targetRef: 'courses_reflectionInput',
    title: 'Just for you',
    body: 'What you write here helps Nuance understand your journey better.',
    ctaText: 'Got it',
    position: 'top',
    order: 2,
  },

  // ═══════════════════════════════════════════════════════════
  // JOURNAL SCREEN
  // ═══════════════════════════════════════════════════════════
  {
    id: 'tooltip_journal_history',
    screen: 'journal',
    targetRef: 'journal_practiceHistory',
    title: "Everything you've done",
    body: 'Tap any practice to revisit what you learned or tried.',
    ctaText: 'Got it',
    position: 'bottom',
    order: 1,
  },
  {
    id: 'tooltip_journal_mood',
    screen: 'journal',
    targetRef: 'journal_moodCheckin',
    title: 'Quick pulse check',
    body: 'How are you feeling in your relationship right now? Track it over time.',
    ctaText: 'Check in',
    position: 'bottom',
    order: 2,
  },

  // ═══════════════════════════════════════════════════════════
  // COMMUNITY SCREEN
  // ═══════════════════════════════════════════════════════════
  {
    id: 'tooltip_community_story',
    screen: 'community',
    targetRef: 'community_storyCard',
    title: 'Real stories, no names',
    body: 'If something resonates, tap "Resonated" to let them know they\'re not alone.',
    ctaText: 'Got it',
    position: 'bottom',
    order: 1,
  },
  {
    id: 'tooltip_community_theme',
    screen: 'community',
    targetRef: 'community_weeklyTheme',
    title: "This week's focus",
    body: 'A shared theme the whole community is exploring. Join in if it speaks to you.',
    ctaText: 'Got it',
    position: 'bottom',
    order: 2,
  },

  // ═══════════════════════════════════════════════════════════
  // NUANCE CHAT
  // ═══════════════════════════════════════════════════════════
  {
    id: 'tooltip_nuance_chat',
    screen: 'chat',
    targetRef: 'chat_entry',
    title: 'Meet Nuance',
    body: 'Your AI coach — here to help you make sense of your patterns and practice something new.',
    ctaText: 'Say hi',
    position: 'top',
    order: 1,
  },
  {
    id: 'tooltip_nuance_nudge',
    screen: 'chat',
    targetRef: 'chat_nudge',
    title: 'A gentle nudge',
    body: 'Nuance learns what you need. These suggestions are tailored just for you.',
    ctaText: 'Got it',
    position: 'top',
    order: 2,
  },

  // ═══════════════════════════════════════════════════════════
  // SETTINGS
  // ═══════════════════════════════════════════════════════════
  {
    id: 'tooltip_settings_privacy',
    screen: 'settings',
    targetRef: 'settings_privacy',
    title: "You're in control",
    body: "Decide what's shared, what's private, and who sees what. Always.",
    ctaText: 'Got it',
    position: 'bottom',
    order: 1,
  },
  {
    id: 'tooltip_settings_notifications',
    screen: 'settings',
    targetRef: 'settings_notifications',
    title: 'Your pace, your terms',
    body: "Turn nudges on or off. We'll never spam you.",
    ctaText: 'Got it',
    position: 'bottom',
    order: 2,
  },
];

/**
 * Get tooltips for a specific screen, sorted by display order.
 */
export function getTooltipsForScreen(screen: string): TooltipConfig[] {
  return TOOLTIP_CONFIGS
    .filter((t) => t.screen === screen)
    .sort((a, b) => a.order - b.order);
}
