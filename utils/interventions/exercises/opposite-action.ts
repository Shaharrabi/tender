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
      type: 'prompt',
      title: 'Name the Emotion',
      content:
        'Start by naming the emotion you are experiencing right now, or the one that has been most intense recently. Try to be specific — instead of "bad," try "resentful," "anxious," "ashamed," or "furious." There is no wrong answer here.',
      promptPlaceholder: 'The emotion I am feeling is...',
    },
    {
      type: 'prompt',
      title: 'Identify the Action Urge',
      content:
        'Every strong emotion comes with an action urge — something it pushes you to do. Anger might urge you to yell or criticize. Fear might urge you to cancel plans or withdraw. Sadness might urge you to isolate.\n\nWhat is this emotion urging you to do right now? Be honest — no one is judging you.',
      promptPlaceholder: 'This emotion is urging me to...',
    },
    {
      type: 'prompt',
      title: 'Plan the Opposite Action',
      content:
        'Now think about what the opposite of that urge would look like. If the urge is to withdraw, the opposite might be reaching out. If the urge is to lash out, the opposite might be speaking softly or taking space with kindness.\n\nWhat would the opposite action be for you right now? Make it specific and doable.',
      promptPlaceholder: 'The opposite action I can take is...',
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
