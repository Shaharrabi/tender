/**
 * Tour Steps — 7-stop guided walkthrough for first launch.
 *
 * Walks first-time users through the new home page structure:
 * Welcome → Portrait → Journey → Daily Rhythm → Nuance → Explore → Ready
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
      id: 'tour_portrait',
      targetRef: 'home_portraitSummary',
      title: 'Your Portrait',
      body: 'This is your portrait \u2014 built from your assessments. It shows how you connect, what you protect, and where you are growing. It deepens as you complete more assessments.',
      position: 'bottom',
    },
    {
      id: 'tour_journey',
      targetRef: 'home_journeyCard',
      title: 'Your Journey',
      body: 'Your Relational Journey \u2014 twelve steps of growth, personalized to your pattern. Each step has teachings, practices, and reflections designed for you.',
      position: 'bottom',
    },
    {
      id: 'tour_daily_rhythm',
      targetRef: 'home_dailyRhythm',
      title: 'Daily Rhythm',
      body: 'Your daily practice lives here \u2014 a quick check-in, a journal prompt, and a nervous system scan. Small moments, repeated, change everything.',
      position: 'top',
    },
    {
      id: 'tour_nuance',
      targetRef: 'home_quickLinks',
      title: 'Nuance',
      body: 'Nuance is your AI companion. It knows your portrait and your journey. Talk to it when you need support, guidance, or just someone to think with.',
      position: 'top',
    },
    {
      id: 'tour_explore',
      targetRef: 'home_exploreSection',
      title: 'Explore',
      body: 'Explore takes you deeper \u2014 your full portrait, your relationship portal, courses, practices, and community.',
      position: 'top',
    },
    {
      id: 'tour_ready',
      targetRef: 'none',
      title: "You're Ready",
      body: "That's it. Start with your first assessment \u2014 it takes about 10 minutes and unlocks your portrait. Everything else builds from there.",
      position: 'center',
      ctaLabel: 'Begin Your First Assessment \u2192',
      ctaRoute: '/(app)/assessment',
    },
  ],
};
