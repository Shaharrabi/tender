/**
 * Rituals of Connection — Gottman Method
 */
import type { Intervention } from '@/types/intervention';

export const ritualsOfConnection: Intervention = {
  id: 'rituals-of-connection',
  title: 'Rituals of Connection',
  description:
    'Build intentional daily and weekly rituals that strengthen your bond. Small consistent moments of connection are the foundation of lasting relationships.',
  category: 'attachment',
  duration: 15,
  difficulty: 'beginner',
  mode: 'together',
  forStates: ['IN_WINDOW'],
  forPatterns: ['disconnection', 'low_engagement', 'emotional_neglect'],
  steps: [
    {
      type: 'instruction',
      title: 'The Power of Rituals',
      content:
        'Research shows that couples who maintain intentional rituals of connection — small, predictable moments of togetherness — have significantly stronger relationships. These are not grand gestures. They are the quiet, reliable rhythms of everyday love.',
    },
    {
      type: 'prompt',
      title: 'Your Current Goodbye',
      content: 'How do you currently say goodbye in the morning? Is there a kiss, a hug, words? Or does it happen on autopilot?',
      promptPlaceholder: 'Our current goodbye looks like...',
    },
    {
      type: 'prompt',
      title: 'Your Current Reunion',
      content: 'How do you reconnect at the end of the day? Do you have a ritual — or does it just happen?',
      promptPlaceholder: 'When we reunite, we usually...',
    },
    {
      type: 'prompt',
      title: 'A New Daily Ritual',
      content: 'Brainstorm one new daily ritual you could start. A 6-second kiss? A 2-minute check-in? A nightly gratitude share?',
      promptPlaceholder: 'We could start doing...',
    },
    {
      type: 'prompt',
      title: 'A Weekly Ritual',
      content: 'Now think bigger — what weekly ritual would nourish your connection? A date night? A walk? A shared hobby?',
      promptPlaceholder: 'Each week, we could...',
    },
    {
      type: 'reflection',
      title: 'Commitment',
      content: 'Choose one ritual — daily or weekly — and commit to trying it for the next 7 days. Write your commitment here.',
      promptPlaceholder: 'This week, we commit to...',
    },
  ],
};
