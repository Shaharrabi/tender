/**
 * Tooltip Configs — Contextual tooltips across the app.
 *
 * Each tooltip shows once, then is tracked as "seen" in FirstTimeContext.
 * Tooltips are managed per-screen by the TooltipManager component.
 *
 * Home screen: 8 tooltips — assessment, 12 steps, portal, couple portal,
 * then tabs (journal, nuance AI, courses, community). The app auto-scrolls to each target.
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
  // HOME SCREEN — strict visual top-to-bottom layout order
  // Partner → Assessment → Field/Journey → Explore → Quick Links
  // ═══════════════════════════════════════════════════════════
  {
    id: 'tooltip_home_couple_portal',
    screen: 'home',
    targetRef: 'home_partnerSection',
    title: 'Couple Portal',
    body: 'Invite your partner to join. When you\u2019re both here, couple exercises, shared reflections, and your relationship portrait unlock automatically.',
    ctaText: 'Got it',
    position: 'bottom',
    order: 1,
  },
  {
    id: 'tooltip_home_assessment',
    screen: 'home',
    targetRef: 'home_assessmentCta',
    title: 'Start here',
    body: 'The Tender Assessment takes about 30 minutes \u2014 but you can pause anytime and pick up where you left off.',
    ctaText: 'Got it',
    position: 'bottom',
    order: 2,
  },
  {
    id: 'tooltip_home_12steps',
    screen: 'home',
    targetRef: 'home_journeyCard',
    title: 'The 12 Steps',
    body: 'Your growth is mapped across twelve steps \u2014 each one builds on the last. Practices, reflections, and exercises guide you through attachment, intimacy, and real change.',
    ctaText: 'Got it',
    position: 'bottom',
    order: 3,
  },
  {
    id: 'tooltip_home_portal',
    screen: 'home',
    targetRef: 'home_portraitCard',
    title: 'Your Portrait',
    body: 'Complete the assessment to unlock your personal portrait \u2014 a map of how you attach, feel, and connect. Everything else builds from here.',
    ctaText: 'Got it',
    position: 'bottom',
    order: 4,
  },
  {
    id: 'tooltip_home_nuance',
    screen: 'home',
    targetRef: 'home_nuanceCard',
    title: 'Meet Nuance AI',
    body: 'Your relationship coach \u2014 here to help you make sense of patterns and practice something new.',
    ctaText: 'Got it',
    position: 'top',
    order: 5,
  },
  {
    id: 'tooltip_home_journal',
    screen: 'home',
    targetRef: 'home_journalCard',
    title: 'Your memory bank',
    body: "Every practice and check-in lives here. Come back anytime to see how far you've come.",
    ctaText: 'Got it',
    position: 'top',
    order: 6,
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

  // ═══════════════════════════════════════════════════════════
  // NUANCE CHAT
  // ═══════════════════════════════════════════════════════════
  {
    id: 'tooltip_nuance_chat',
    screen: 'chat',
    targetRef: 'chat_entry',
    title: 'Meet Nuance',
    body: 'Your AI coach \u2014 here to help you make sense of your patterns and practice something new.',
    ctaText: 'Say hi',
    position: 'top',
    order: 1,
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
