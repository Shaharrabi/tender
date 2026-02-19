/**
 * Defusion from Relationship Stories — ACT
 */
import type { Intervention } from '@/types/intervention';

export const defusionFromStories: Intervention = {
  id: 'defusion-from-stories',
  title: 'Defusion from Relationship Stories',
  description:
    'Use ACT cognitive defusion techniques to create distance from the rigid stories you tell about your relationship, creating space for new possibilities.',
  fieldInsight: 'The story you tell about your partner is not your partner.',
  category: 'differentiation',
  duration: 8,
  difficulty: 'intermediate',
  mode: 'solo',
  forStates: ['IN_WINDOW', 'MIXED'],
  forPatterns: ['rumination', 'catastrophizing', 'stuck_patterns', 'negative_narratives'],
  steps: [
    {
      type: 'instruction',
      title: 'Stories vs. Reality',
      content:
        'Our minds are expert storytellers. They create narratives about our relationships — "They never listen," "We always fight about this," "Nothing will change." These stories feel true, but they are constructions. Defusion means stepping back and seeing the story as a story, not as reality itself.',
    },
    {
      type: 'prompt',
      title: 'Your Relationship Story',
      content: 'Write the dominant story your mind tells about your relationship or partner. Don\'t filter — let it all come out.',
      promptPlaceholder: 'The story my mind tells is...',
    },
    {
      type: 'sentence_transform',
      title: 'Defusion Practice',
      content: 'Transform the story by adding distance. Notice how the weight shifts with each version:',
      interactiveConfig: {
        kind: 'sentence_transform',
        stages: [
          {
            prefix: 'The raw story:',
            placeholder: 'the thought as it appears...',
            explanation: 'Just write it straight \u2014 how your mind tells it',
          },
          {
            prefix: 'I\'m having the thought that',
            placeholder: 'the same thought with this prefix...',
            explanation: 'Notice the subtle shift when you add distance',
          },
          {
            prefix: 'I notice my mind is telling me a story about',
            placeholder: 'rewrite it one more time...',
            explanation: 'Even more distance \u2014 you are the observer, not the thought',
          },
        ],
      },
    },
    {
      type: 'prompt',
      title: 'Without the Story',
      content: 'If this story had zero power over you — if it was just words — what would you do differently today in your relationship?',
      promptPlaceholder: 'Without this story, I would...',
    },
    {
      type: 'timer',
      title: 'Mindful Defusion',
      content: 'Close your eyes. Picture the story written on a leaf floating down a stream. Watch it drift away. You are the stream, not the leaf.',
      duration: 60,
    },
    {
      type: 'reflection',
      title: 'Closing',
      content: 'What feels different when you hold the story lightly instead of tightly?',
      promptPlaceholder: 'When I hold this story lightly...',
    },
  ],
};
