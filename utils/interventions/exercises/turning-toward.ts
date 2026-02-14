/**
 * Turning Toward Bids for Connection
 *
 * Based on Gottman's research showing that the master predictor of
 * relationship success is how partners respond to each other's
 * "bids" — small everyday moments of reaching out for connection.
 * Happy couples turn toward bids 86% of the time; unhappy couples
 * only 33%.
 */

import type { Intervention } from '@/types/intervention';

export const turningToward: Intervention = {
  id: 'turning-toward',
  title: 'Turning Toward Bids for Connection',
  description:
    'Learn to recognize and respond to the small but crucial moments when your partner reaches out for connection. Gottman\'s research shows that how you handle these everyday "bids" is the strongest predictor of relationship success.',
  fieldInsight: 'Each small turn toward each other warms the space between you.',
  category: 'communication',
  duration: 15,
  difficulty: 'beginner',
  mode: 'together',
  forStates: ['IN_WINDOW'],
  forPatterns: [
    'missed_bids',
    'emotional_distance',
    'low_cohesion',
  ],
  steps: [
    {
      type: 'instruction',
      title: 'What Are Bids for Connection?',
      content:
        'A bid is any attempt one partner makes to get attention, affirmation, affection, or any other positive connection. Bids can be verbal ("Look at this sunset") or nonverbal (a touch, a sigh, a glance). You can respond in three ways:\n\n- Turning toward: engaging with the bid ("Wow, that is beautiful!")\n- Turning away: ignoring or missing it (staying on your phone)\n- Turning against: responding with hostility ("Can you stop interrupting me?")\n\nSmall moments of turning toward accumulate into trust and intimacy.',
    },
    {
      type: 'prompt',
      title: 'Identify Recent Bids',
      content:
        'Think about the last 24 to 48 hours. Can you identify three bids that your partner made — moments where they were reaching out for connection? They might have been easy to miss: a comment about their day, showing you something on their phone, asking for a hug, or even a sigh.\n\nAlso reflect: can you think of three bids you made?',
      promptPlaceholder: 'Three bids my partner made recently were...',
    },
    {
      type: 'prompt',
      title: 'Practice Turning Toward',
      content:
        'Take turns making a simple bid right now. One partner says or does something to connect, and the other practices turning toward it — with eye contact, verbal acknowledgment, and genuine interest. Try this three times each.\n\nHow did it feel to have your bid fully received?',
      promptPlaceholder: 'When my partner turned toward my bid, I felt...',
    },
    {
      type: 'reflection',
      title: 'Notice Your Patterns',
      content:
        'Without blame, reflect honestly: do you tend to turn toward, away, or against your partner\'s bids? What gets in the way — distraction, exhaustion, resentment? What would help you turn toward more often?',
      promptPlaceholder: 'I notice that I tend to...',
    },
    {
      type: 'instruction',
      title: 'Track Bids for a Day',
      content:
        'Over the next 24 hours, pay close attention to bids — both your own and your partner\'s. You do not need to keep a written record; just notice. At the end of the day, share with each other what you observed. The goal is not perfection but awareness. When you notice a bid, you are already more likely to turn toward it.',
    },
  ],
};
