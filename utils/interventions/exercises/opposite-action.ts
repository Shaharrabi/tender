/**
 * Opposite Action (DBT Emotion Regulation)
 *
 * A core DBT skill that helps individuals act opposite to
 * an unhelpful emotion-driven urge. When an emotion does not
 * fit the facts or when acting on it would be harmful, doing
 * the opposite weakens the emotion's hold over time.
 */

import type { Intervention } from '@/types/intervention';

export const oppositeAction: Intervention = {
  id: 'opposite-action',
  title: 'Opposite Action',
  description:
    'When an emotion is pushing you toward a reaction that will not serve you, this DBT skill helps you identify the urge and choose the opposite. A powerful way to interrupt reactive patterns and build emotional flexibility.',
  fieldInsight: 'When you move against the pull of the pattern, the whole field shifts.',
  category: 'regulation',
  duration: 5,
  difficulty: 'intermediate',
  mode: 'solo',
  forStates: ['ACTIVATED', 'MIXED'],
  forPatterns: [
    'emotional_reactivity',
    'anger_flooding',
    'avoidance',
  ],
  steps: [
    {
      type: 'instruction',
      title: 'What Is Opposite Action?',
      content:
        'Opposite Action is one of the most powerful skills in DBT. The idea is simple: when an emotion is pushing you to do something that will make things worse, you deliberately do the opposite.\n\nAnger says "attack" — you gently step back.\nFear says "avoid" — you approach.\nShame says "hide" — you share.\n\nThis is not about suppressing what you feel. It is about choosing a different response when the urge does not match your values or the situation. Over time, the emotion itself begins to shift.',
    },
    {
      type: 'sentence_transform',
      title: 'The Opposite Action Formula',
      content: 'Build your opposite action step by step:',
      interactiveConfig: {
        kind: 'sentence_transform',
        stages: [
          {
            prefix: 'The emotion I\'m feeling is:',
            placeholder: 'name it specifically (resentful, anxious, ashamed...)',
            explanation: 'Be precise \u2014 "bad" becomes "abandoned" or "furious"',
          },
          {
            prefix: 'It\'s urging me to:',
            placeholder: 'what does this emotion want you to do?',
            explanation: 'The action urge \u2014 withdraw, yell, scroll, shut down',
          },
          {
            prefix: 'The opposite action is:',
            placeholder: 'what would the opposite look like?',
            explanation: 'The deliberate, values-aligned choice',
          },
        ],
      },
    },
    {
      type: 'timer',
      title: 'Practice the Opposite',
      content:
        'For the next 60 seconds, practice your opposite action — even if only in your mind. If it involves reaching out, draft the message. If it involves staying present, sit with the discomfort without acting on the urge. Notice what happens in your body as you do the opposite of what the emotion wants.',
      duration: 60,
    },
    {
      type: 'reflection',
      title: 'Reflection',
      content:
        'What did it feel like to practice opposite action? Did the intensity of the emotion shift at all? What did you learn about the relationship between your emotions and your choices?',
      promptPlaceholder: 'What I noticed was...',
    },
  ],
};
