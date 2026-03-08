/**
 * Tour Steps — 8-stop guided walkthrough for first launch.
 *
 * Walks first-time users through the home page structure:
 * Welcome → The Field → Journey → Partner → Assessment → Daily Rhythm → Explore → Ready
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
      body: 'This is your home \u2014 a living space that grows with you. Let us show you around.',
      position: 'center',
    },
    {
      id: 'tour_the_field',
      targetRef: 'home_journeyCard',
      title: 'The Field',
      body: 'This is The Field \u2014 your healing map. Each glowing dot is one of 12 steps in your relational growth journey. As you complete steps, the field comes alive.',
      position: 'bottom',
    },
    {
      id: 'tour_journey',
      targetRef: 'home_journeyCard',
      title: 'Tap to Explore',
      body: 'Tap any step on The Field to dive in. Each step has teachings, practices, reflections, and a mini-game designed to help you grow.',
      position: 'bottom',
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
      body: 'Seven sections covering how you connect, feel, fight, and what matters to you. Your answers create your unique Portrait \u2014 a map of your relational self.',
      position: 'bottom',
    },
    {
      id: 'tour_daily_rhythm',
      targetRef: 'home_dailyRhythm',
      title: 'Your Daily Rhythm',
      body: 'Your daily practice lives here \u2014 a quick check-in, a journal prompt, and a nervous system scan. Small moments, repeated, change everything.',
      position: 'top',
    },
    {
      id: 'tour_explore',
      targetRef: 'home_exploreSection',
      title: 'Explore',
      body: 'Go deeper \u2014 your full portrait, your relationship portal, courses, practices, and community. Everything connects back to your journey.',
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
