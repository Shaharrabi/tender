/**
 * Tour Steps — Defines the guided walkthrough tour for first launch.
 *
 * The main app tour runs on the home screen the first time a user logs in.
 * It highlights key sections and explains what they do.
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
      body: "Let me show you around. This will only take a minute.",
      position: 'center',
    },
    {
      id: 'tour_assessment',
      targetRef: 'home_assessmentCta',
      title: 'Start with the Assessment',
      body: 'This is where your journey begins. Seven chapters that reveal how you show up in love.',
      position: 'bottom',
    },
    {
      id: 'tour_portrait',
      targetRef: 'home_portraitCard',
      title: 'Your Portrait',
      body: "Once you complete the assessment, you'll unlock a personalized map of your patterns.",
      position: 'bottom',
    },
    {
      id: 'tour_courses',
      targetRef: 'home_coursesCard',
      title: 'Courses',
      body: 'Short lessons to help you understand and shift your patterns. Start anytime.',
      position: 'bottom',
    },
    {
      id: 'tour_journal',
      targetRef: 'home_journalCard',
      title: 'Your Journal',
      body: 'Everything you do in Tender lives here. Your memory bank of growth.',
      position: 'bottom',
    },
    {
      id: 'tour_community',
      targetRef: 'home_communityCard',
      title: 'Community',
      body: "You're not alone. Anonymous stories from people on a similar path.",
      position: 'bottom',
    },
    {
      id: 'tour_complete',
      targetRef: 'none',
      title: "You're ready",
      body: "Whenever you're ready, start with the assessment. Take your time.",
      position: 'center',
    },
  ],
};
