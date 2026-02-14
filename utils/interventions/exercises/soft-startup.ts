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
      type: 'prompt',
      title: 'Reframe with "I Feel...When...I Need..."',
      content:
        'Now rewrite your complaint using this structure:\n\n"I feel [emotion] when [specific situation]. I need [positive request]."\n\nFor example: "I feel lonely when we eat dinner in silence. I need us to have at least a few minutes of real conversation."',
      promptPlaceholder: 'I feel...when...I need...',
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
