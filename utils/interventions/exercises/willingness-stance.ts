/**
 * The Willingness Stance — ACT
 */
import type { Intervention } from '@/types/intervention';

export const willingnessStance: Intervention = {
  id: 'willingness-stance',
  title: 'The Willingness Stance',
  description:
    'Explore the ACT concept of willingness — the practice of opening to uncomfortable experiences in service of what matters most to you in your relationship.',
  category: 'values',
  duration: 6,
  difficulty: 'beginner',
  mode: 'solo',
  forStates: ['IN_WINDOW', 'SHUTDOWN'],
  forPatterns: ['avoidance', 'emotional_shutdown', 'values_gap'],
  steps: [
    {
      type: 'instruction',
      title: 'Willingness vs. Wanting',
      content:
        'Willingness is not the same as wanting. You don\'t have to want discomfort to be willing to experience it. Willingness means choosing to be open to difficult feelings because they come packaged with the things you care about. If you value closeness, you must be willing to feel vulnerable.',
    },
    {
      type: 'prompt',
      title: 'Something Uncomfortable',
      content: 'Name something uncomfortable that keeps showing up in your relationship. A feeling, a conversation, a pattern.',
      promptPlaceholder: 'Something uncomfortable is...',
    },
    {
      type: 'prompt',
      title: 'What You\'ve Been Avoiding',
      content: 'What have you been doing to avoid this discomfort? Withdrawing? Changing the subject? Getting busy? Numbing?',
      promptPlaceholder: 'To avoid it, I\'ve been...',
    },
    {
      type: 'prompt',
      title: 'What Willingness Looks Like',
      content: 'If you were willing to feel this discomfort — not wanting it, just allowing it — what would you do differently?',
      promptPlaceholder: 'If I were willing, I would...',
    },
    {
      type: 'prompt',
      title: 'The Value It Serves',
      content: 'What value or what matters to you would this willingness serve? Connection? Honesty? Growth?',
      promptPlaceholder: 'This serves my value of...',
    },
    {
      type: 'reflection',
      title: 'Closing',
      content: 'Take a breath. You don\'t have to do everything at once. Just notice: is there one small step of willingness you could take this week?',
      promptPlaceholder: 'One small step I could take...',
    },
  ],
};
