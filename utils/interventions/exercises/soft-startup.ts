/**
 * Soft Startup Practice
 *
 * Based on Gottman's research on how the first three minutes
 * of a conversation predict its outcome. Practices reframing
 * complaints into gentle, non-blaming requests.
 */

import type { Intervention } from '@/types/intervention';

export const softStartup: Intervention = {
  id: 'soft-startup',
  title: 'Soft Startup',
  description:
    'Practice the Gottman method of raising concerns gently. Transform complaints into connection by leading with feelings and needs instead of blame.',
  fieldInsight: 'How you begin shapes everything that follows in the space between you.',
  category: 'communication',
  duration: 5,
  difficulty: 'intermediate',
  mode: 'together',
  forStates: ['IN_WINDOW', 'ACTIVATED'],
  forPatterns: [
    'harsh_startup',
    'criticism',
    'blame_pattern',
    'demand_withdraw',
    'conflict_avoidance',
  ],
  steps: [
    {
      type: 'instruction',
      title: 'What Is a Soft Startup?',
      content:
        'Research shows that conversations end the way they begin 96% of the time. A soft startup means raising a concern without criticism or blame. Instead of "You never..." or "You always...", you lead with your own feelings and a specific, positive need. This practice will walk you through the formula.',
    },
    {
      type: 'prompt',
      title: 'Identify Your Complaint',
      content:
        'Think of something that has been bothering you in your relationship. Write it down as it naturally comes out — we will reshape it in the next step. Be honest; no one is reading this but you.',
      promptPlaceholder: 'What has been bothering me is...',
    },
    {
      type: 'sentence_transform',
      title: 'Reframe with "I Feel\u2026When\u2026I Need\u2026"',
      content: 'Transform your complaint into a soft startup:',
      interactiveConfig: {
        kind: 'sentence_transform',
        stages: [
          {
            prefix: 'I feel',
            placeholder: 'name one emotion (lonely, frustrated, hurt...)',
            explanation: 'Lead with YOUR feeling, not their behavior',
          },
          {
            prefix: 'when',
            placeholder: 'describe the specific situation...',
            explanation: 'Observable behavior, not character judgment',
          },
          {
            prefix: 'I need',
            placeholder: 'a positive, specific request...',
            explanation: 'What you want TO happen, not what you want to stop',
          },
        ],
      },
    },
    {
      type: 'instruction',
      title: 'Practice Saying It',
      content:
        'Read your reframed statement aloud — even quietly to yourself. Notice how it feels in your body compared to the original complaint. Saying it out loud activates different neural pathways than just thinking it. Pay attention to your tone: aim for warmth, not accusation.',
    },
    {
      type: 'reflection',
      title: 'Reflection',
      content:
        'What shifted when you moved from complaint to request? Did the emotional charge change? Could you imagine saying this to your partner? What might make it easier to start soft next time?',
      promptPlaceholder: 'I noticed that...',
    },
  ],
};
