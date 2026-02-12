/**
 * Four Horsemen Antidotes — Gottman Method
 */
import type { Intervention } from '@/types/intervention';

export const fourHorsemenAntidotes: Intervention = {
  id: 'four-horsemen-antidotes',
  title: 'Four Horsemen Antidotes',
  description:
    'Identify destructive communication patterns and replace them with their research-backed antidotes: gentle startup, appreciation, responsibility, and self-soothing.',
  category: 'communication',
  duration: 15,
  difficulty: 'intermediate',
  mode: 'together',
  forStates: ['IN_WINDOW', 'MIXED'],
  forPatterns: ['criticism', 'contempt', 'defensiveness', 'stonewalling', 'negative_cycle'],
  steps: [
    {
      type: 'instruction',
      title: 'The Four Horsemen',
      content:
        'John Gottman identified four communication patterns that predict relationship breakdown with over 90% accuracy: Criticism (attacking character), Contempt (superiority and disgust), Defensiveness (counter-attacking or playing victim), and Stonewalling (shutting down). Each has a powerful antidote.',
    },
    {
      type: 'prompt',
      title: 'Which Horseman Visits Most?',
      content: 'Which of these four patterns shows up most for YOU? Be honest — we all have a default.',
      promptPlaceholder: 'The one I notice most in myself is...',
    },
    {
      type: 'prompt',
      title: 'Practice the Antidote',
      content:
        'Rewrite a recent moment using the antidote. Criticism → gentle startup. Contempt → appreciation. Defensiveness → take responsibility. Stonewalling → ask for a break.',
      promptPlaceholder: 'Instead, I could say...',
    },
    {
      type: 'timer',
      title: 'Practice Saying It',
      content: 'Practice saying your antidote phrase out loud. Notice how it feels different in your body.',
      duration: 120,
    },
    {
      type: 'reflection',
      title: 'Closing',
      content: 'What did you notice about the difference between the horseman and the antidote?',
      promptPlaceholder: 'I noticed that...',
    },
  ],
};
