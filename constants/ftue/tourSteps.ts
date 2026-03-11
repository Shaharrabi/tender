/**
 * Tour Steps — 5-stop guided walkthrough for first launch.
 *
 * Walks first-time users through the home page structure:
 * Welcome → Partner → Assessment → Daily Rhythm → Ready
 *
 * Uses RefRegistry to spotlight target elements on-screen.
 * The final step includes a CTA button to begin the first assessment.
 */

export interface TourStep {
  /** Unique step ID */
  id: string;
  /** RefRegistry key for the target element ('none' = centered modal) */
  targetRef: string;
  /** Step title */
  title: string;
  /** Step body text */
  body: string;
  /** Card position relative to target */
  position: 'top' | 'bottom' | 'center';
  /** Optional CTA button label (for final step) */
  ctaLabel?: string;
  /** Optional route to navigate on CTA press */
  ctaRoute?: string;
}

export interface Tour {
  /** Unique tour ID tracked in FirstTimeContext */
  id: string;
  /** Display name */
  name: string;
  /** Tour steps */
  steps: TourStep[];
}

export const HOME_TOUR: Tour = {
  id: 'tour_home',
  name: 'Welcome to Tender',
  steps: [
    {
      id: 'tour_welcome',
      targetRef: 'none',
      title: 'Welcome to Tender',
      body: "You just took the bravest step \u2014 showing up. This is your space, and it grows with you. Let\u2019s show you around.",
      position: 'center',
    },
    {
      id: 'tour_partner',
      targetRef: 'home_partnerSection',
      title: 'Connect With Your Partner',
      body: 'Tender is built for two. Invite your partner to join, or practice with an AI partner \u2014 either way, the work deepens when it is shared.',
      position: 'bottom',
    },
    {
      id: 'tour_assessment',
      targetRef: 'home_assessmentCta',
      title: 'The Tender Assessment',
      body: "Seven sections covering how you connect, feel, fight, and what matters to you. Your answers create your unique Portrait \u2014 a map of your relational self.",
      position: 'bottom',
    },
    {
      id: 'tour_daily_rhythm',
      targetRef: 'home_dailyRhythm',
      title: 'Your Daily Rhythm',
      body: "Your daily practice lives here \u2014 a quick check-in, a journal prompt, and a nervous system scan. Small moments, repeated, change everything.",
      position: 'top',
    },
    {
      id: 'tour_ready',
      targetRef: 'none',
      title: "You're Ready",
      body: "Start with your first assessment \u2014 it takes about 10 minutes per section and unlocks your portrait. Everything else builds from there.",
      position: 'center',
      ctaLabel: 'Begin Your First Assessment \u2192',
      ctaRoute: '/(app)/assessment',
    },
  ],
};
