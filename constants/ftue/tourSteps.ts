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
      body: "You just took the bravest step \u2014 showing up. This is your space, and it grows with you. One person told us: \"I finally feel like I have a map for my relationship.\" Let\u2019s show you around.",
      position: 'center',
    },
    {
      id: 'tour_portrait',
      targetRef: 'home_portraitSummary',
      title: 'Your Portrait',
      body: "This is your relational portrait \u2014 a living picture of how you connect, what you protect, and where you\u2019re growing. After one couple completed theirs, they said: \"We finally understood why we kept having the same fight.\" It deepens with every assessment you take.",
      position: 'bottom',
    },
    {
      id: 'tour_journey',
      targetRef: 'home_journeyCard',
      title: 'The 12 Steps',
      body: "Twelve steps of relational growth, personalized to your pattern. Each one has teachings, reflections, and practices designed for you. People often tell us step 3 is where things click \u2014 \"I stopped reacting and started noticing.\" You\u2019ll find your own turning point.",
      position: 'bottom',
    },
    {
      id: 'tour_journal',
      targetRef: 'home_dailyRhythm',
      title: 'Your Journal',
      body: "Your journal captures reflections, check-ins, and moments of insight as you move through each step. It\u2019s private and just for you. One user shared: \"Reading back what I wrote in week 1 made me cry \u2014 I\u2019d changed so much without realizing it.\"",
      position: 'top',
    },
    {
      id: 'tour_daily_rhythm',
      targetRef: 'home_dailyRhythm',
      title: 'Daily Rhythm',
      body: "A quick check-in, a journal prompt, a nervous system scan. Small moments, repeated, change everything. \"I started doing the 2-minute check-in every morning. My partner noticed within a week.\"",
      position: 'top',
    },
    {
      id: 'tour_nuance',
      targetRef: 'home_quickLinks',
      title: 'Nuance',
      body: "Nuance is your AI companion \u2014 it knows your portrait and your journey. Talk to it when you need support, guidance, or just someone to think with. It\u2019s like having a therapist in your pocket who actually remembers what you said last week.",
      position: 'top',
    },
    {
      id: 'tour_explore',
      targetRef: 'home_exploreSection',
      title: 'Explore',
      body: "Go deeper \u2014 your full portrait, your relationship portal, courses, and community. There\u2019s always more to discover when you\u2019re ready.",
      position: 'top',
    },
    {
      id: 'tour_ready',
      targetRef: 'none',
      title: "You're Ready",
      body: "That\u2019s it \u2014 your space is set up. Start with a gentle 10-minute assessment. It unlocks your portrait, and everything else builds from there. As one couple put it: \"We wish we\u2019d done this years ago.\"",
      position: 'center',
      ctaLabel: 'Begin Your First Assessment \u2192',
      ctaRoute: '/(app)/assessment',
    },
  ],
};
