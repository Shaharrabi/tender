/**
 * Four Horsemen Antidotes — Gottman Method
 */
import type { Intervention } from '@/types/intervention';

export const fourHorsemenAntidotes: Intervention = {
  id: 'four-horsemen-antidotes',
  title: 'Four Horsemen Antidotes',
  description:
    'Identify destructive communication patterns and replace them with their research-backed antidotes: gentle startup, appreciation, responsibility, and self-soothing.',
  fieldInsight: 'The antidotes are not techniques \u2014 they are new ways of being in the space between you.',
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
      type: 'card_flip',
      title: 'Match Horseman to Antidote',
      content: 'Each destructive pattern has a powerful antidote. Tap each card to reveal the match.',
      interactiveConfig: {
        kind: 'card_flip',
        mode: 'flip',
        cards: [
          {
            id: 'criticism',
            front: 'CRITICISM\n"You always forget everything."',
            back: 'ANTIDOTE: Gentle Startup\n"I noticed the dishes. Could we figure out a system?"',
          },
          {
            id: 'contempt',
            front: 'CONTEMPT\n"You\'re so pathetic."',
            back: 'ANTIDOTE: Build Culture of Appreciation\n"I appreciate that you tried, even if it didn\'t work."',
          },
          {
            id: 'defensiveness',
            front: 'DEFENSIVENESS\n"That\'s not my fault!"',
            back: 'ANTIDOTE: Accept Responsibility\n"You\'re right, I did forget. I\'m sorry."',
          },
          {
            id: 'stonewalling',
            front: 'STONEWALLING\n*shuts down, leaves room*',
            back: 'ANTIDOTE: Physiological Self-Soothing\n"I need 20 minutes. I\'ll come back."',
          },
        ],
      },
    },
    {
      type: 'sentence_transform',
      title: 'Rewrite a Recent Moment',
      content: 'Think of a recent moment when a Horseman showed up. Transform it using the antidote:',
      interactiveConfig: {
        kind: 'sentence_transform',
        stages: [
          {
            prefix: 'What I said/did (the Horseman):',
            placeholder: 'the destructive version...',
            explanation: 'Name the pattern honestly',
          },
          {
            prefix: 'What I could say instead (the Antidote):',
            placeholder: 'the constructive version...',
            explanation: 'Apply the matching antidote',
          },
        ],
      },
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
