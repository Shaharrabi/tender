/**
 * Fondness & Admiration: Building Positive Sentiment
 *
 * Based on Gottman's finding that the Fondness & Admiration System
 * is the antidote to contempt. Couples who maintain a habit of
 * expressing appreciation have a fundamentally different emotional
 * climate in their relationship.
 */

import type { Intervention } from '@/types/intervention';

export const fondnessAdmiration: Intervention = {
  id: 'fondness-admiration',
  title: 'Fondness & Admiration',
  description:
    'Nurture what\u2019s good between you. Admiration, gratitude, and positive memories \u2014 the antidote to taking each other for granted.',
  fieldInsight: 'What you notice and name grows. Admiration feeds the field between you.',
  category: 'attachment',
  duration: 15,
  difficulty: 'beginner',
  mode: 'together',
  forStates: ['IN_WINDOW'],
  forPatterns: [
    'low_satisfaction',
    'contempt',
    'negativity_override',
  ],
  steps: [
    {
      type: 'instruction',
      title: 'The Antidote',
      content:
        'When we stop noticing what we love about our partner, distance creeps in. This exercise reverses that \u2014 deliberately. It\u2019s simple but powerful.',
    },
    {
      type: 'prompt',
      title: 'Recall a Positive Memory',
      content:
        'Close your eyes for a moment and think back to a happy time in your relationship — a moment when you felt genuinely lucky to be with your partner. It can be big or small: a trip, a quiet evening, a moment when they made you laugh. Share the memory with each other.',
      promptPlaceholder: 'A happy memory that stands out is...',
    },
    {
      type: 'prompt',
      title: 'Three Things I Admire About You',
      content:
        'Take turns. Each partner shares three specific things they genuinely admire about the other. Be specific: not just "you are kind," but "I admire how you always check in on your sister when she is having a hard time." Specificity signals that you are truly paying attention.',
      promptPlaceholder: 'Three things I admire about my partner: 1) ... 2) ... 3) ...',
    },
    {
      type: 'prompt',
      title: 'Gratitude for a Recent Moment',
      content:
        'Think of something your partner did in the last few days that you appreciated — even if it was small. Maybe they made coffee, listened to you vent, or simply smiled at you. Tell them now, and explain why it mattered.',
      promptPlaceholder: 'Recently, I was grateful when you...',
    },
    {
      type: 'reflection',
      title: 'Make It Stick',
      content:
        'One small way to keep this going \u2014 a text, a word at dinner, a look?',
      promptPlaceholder: 'We could...',
    },
  ],
};
