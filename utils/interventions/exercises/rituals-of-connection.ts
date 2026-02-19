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
      type: 'checklist',
      title: 'Your Current Rituals',
      content: 'Which of these do you currently do regularly? Be honest:',
      interactiveConfig: {
        kind: 'checklist',
        items: [
          { id: 'goodbye-kiss', text: 'A real kiss (not a peck) when leaving' },
          { id: 'goodbye-words', text: 'Saying "I love you" or something warm' },
          { id: 'reunion-hug', text: 'A hug or embrace when reuniting' },
          { id: 'reunion-ask', text: 'Asking "How was your day?" with genuine interest' },
          { id: 'dinner-talk', text: 'Conversation at dinner (screens away)' },
          { id: 'bedtime', text: 'A moment of connection before sleep' },
          { id: 'weekend', text: 'Intentional couple time on weekends' },
        ],
        minRequired: 0,
      },
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
