/**
 * Repair Attempt Guide
 *
 * A guided exercise for crafting and practicing a repair
 * conversation after conflict or disconnection.
 * Based on Gottman's repair attempt research.
 */

import type { Intervention } from '@/types/intervention';

export const repairAttempt: Intervention = {
  id: 'repair-attempt',
  title: 'Repair Conversation Guide',
  description:
    'A step-by-step guide for repairing after conflict or disconnection. Identify what happened, own your part, and craft a genuine repair statement.',
  fieldInsight: 'Every repair resets the field. Every bid is a fresh start.',
  category: 'communication',
  duration: 10,
  difficulty: 'intermediate',
  mode: 'together',
  forStates: ['IN_WINDOW'],
  forPatterns: [
    'unresolved_conflict',
    'stonewalling',
    'contempt',
    'emotional_distance',
    'rupture_without_repair',
  ],
  steps: [
    {
      type: 'instruction',
      title: 'About Repair',
      content:
        'Every couple has conflict. What distinguishes healthy relationships is not the absence of rupture but the presence of repair. A repair attempt is any statement or action — silly or serious — that prevents negativity from spiraling. This exercise will help you craft a thoughtful, genuine repair. It works best when you are calm and within your window of tolerance.',
    },
    {
      type: 'prompt',
      title: 'Identify What Happened',
      content:
        'Think of a recent moment of conflict or disconnection with your partner. Describe what happened as factually as you can — what was said, what you observed, the sequence of events. Try to stick to observable behavior rather than interpretations.',
      promptPlaceholder: 'What happened was...',
    },
    {
      type: 'prompt',
      title: 'Identify Your Part',
      content:
        'What was your contribution to the rupture? This is not about blame — it is about honest ownership. Maybe you were defensive, dismissive, distracted, or critical. Maybe you withdrew or escalated. What did you do or fail to do?',
      promptPlaceholder: 'My part in this was...',
    },
    {
      type: 'sentence_transform',
      title: 'Craft Your Repair Statement',
      content: 'Build your repair statement piece by piece:',
      interactiveConfig: {
        kind: 'sentence_transform',
        stages: [
          {
            prefix: 'I know that',
            placeholder: 'acknowledge what happened...',
            explanation: 'Show your partner you see what occurred',
          },
          {
            prefix: 'My part was',
            placeholder: 'own your contribution honestly...',
            explanation: 'Even a small piece of ownership opens the door',
          },
          {
            prefix: 'I wish I had',
            placeholder: 'what you\'d do differently...',
            explanation: 'Shows growth intention, not just regret',
          },
          {
            prefix: 'What matters to me is',
            placeholder: 'your care or commitment...',
            explanation: 'End with connection, not obligation',
          },
        ],
      },
    },
    {
      type: 'instruction',
      title: 'Practice Saying It Aloud',
      content:
        'Read your repair statement out loud. Notice how it feels. Adjust the words until they feel authentic — not scripted, not performative, but genuinely yours. Pay attention to your tone: the goal is vulnerability, not obligation. If possible, practice it twice.',
    },
    {
      type: 'reflection',
      title: 'Reflection',
      content:
        'How did it feel to go through this process? What was the hardest part — identifying what happened, owning your part, or crafting the repair? Do you feel ready to offer this repair to your partner?',
      promptPlaceholder: 'Going through this, I feel...',
    },
  ],
};
