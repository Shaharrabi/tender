/**
 * Tour Steps — Short guided intro for first launch.
 *
 * Stripped down to 2 steps:
 * 1. Welcome — centered modal, warm greeting
 * 2. Assessment CTA — spotlight on the assessment card
 *
 * After these 2 steps, the app unlocks and the user can scroll freely.
 * Highlights and tooltips then guide them to key features naturally.
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
      body: "A space for your relationship to grow. Let me show you where to start.",
      position: 'center',
    },
    {
      id: 'tour_assessment',
      targetRef: 'home_assessmentCta',
      title: 'Start Here',
      body: 'Your journey begins with the Tender Assessment \u2014 seven chapters that reveal how you show up in love. You can pause anytime.',
      position: 'bottom',
    },
  ],
};
