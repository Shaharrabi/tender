/**
 * Tour Steps — 6-stop guided walkthrough for first launch.
 *
 * Walks first-time users through the home page structure:
 * Welcome → 12 Steps → Couple Portal → Your Portal → Daily Rhythm → Ready
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
      id: 'tour_12steps',
      targetRef: 'home_journeyCard',
      title: 'The 12 Steps',
      body: 'Your healing journey is mapped across twelve steps \u2014 each one builds on the last. Practices, games, and reflections guide you through attachment, intimacy, and growth.',
      position: 'bottom',
    },
    {
      id: 'tour_couple_portal',
      targetRef: 'home_partnerSection',
      title: 'Couple Portal',
      body: 'Invite your partner to join Tender. When you\u2019re both here, couple exercises, shared reflections, and your relationship portrait unlock automatically.',
      position: 'bottom',
    },
    {
      id: 'tour_your_portal',
      targetRef: 'home_portraitCard',
      title: 'Your Portal',
      body: 'Complete the Tender Assessment to unlock your personal portrait \u2014 a map of how you attach, feel, and connect. Everything else builds from here.',
      position: 'bottom',
    },
    {
      id: 'tour_daily_rhythm',
      targetRef: 'home_dailyRhythm',
      title: 'Your Daily Rhythm',
      body: "Tap here to open your daily practice \u2014 a quick check-in, a journal prompt, and a nervous system scan. Small moments, repeated, change everything.",
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
