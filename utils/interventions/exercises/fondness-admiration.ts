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
  title: 'Fondness & Admiration: Building Positive Sentiment',
  description:
    'Actively nurture the positive feelings between you. This exercise strengthens the friendship system that Gottman identifies as the foundation of lasting relationships — by practicing admiration, gratitude, and positive memories.',
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
      title: 'Why Fondness and Admiration Matter',
      content:
        'Contempt — the most destructive of the "Four Horsemen" — grows when we lose sight of what we value in our partner. The antidote is a culture of appreciation. Couples who regularly express fondness and admiration build a positive sentiment override: a general sense that their partner is a good person, even during disagreements. This exercise helps you intentionally strengthen that override.',
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
      title: 'Create an Appreciation Ritual',
      content:
        'How could you make appreciation a regular habit rather than a one-time exercise? Some couples share one appreciation at dinner, or text one thing they are grateful for each morning. What ritual would work for you?',
      promptPlaceholder: 'Our appreciation ritual could be...',
    },
  ],
};
