/**
 * Stress-Reducing Conversation (Gottman)
 *
 * One of the simplest and most powerful Gottman interventions:
 * a daily ritual where partners take turns sharing about their
 * day while the other listens without trying to fix anything.
 * Research shows this ritual builds the friendship foundation
 * that keeps couples resilient during conflict.
 */

import type { Intervention } from '@/types/intervention';

export const stressReducingConversation: Intervention = {
  id: 'stress-reducing-conversation',
  title: 'Stress-Reducing Conversation',
  description:
    'A daily debrief ritual from Gottman research. Take turns sharing about your day — not about the relationship — while your partner simply listens. This small practice builds the friendship that keeps couples strong through hard times.',
  fieldInsight: 'Turning toward your partner\'s world outside the relationship strengthens the world inside it.',
  category: 'communication',
  duration: 20,
  difficulty: 'beginner',
  mode: 'together',
  forStates: ['IN_WINDOW'],
  forPatterns: [
    'disconnection',
    'emotional_neglect',
    'low_engagement',
  ],
  steps: [
    {
      type: 'instruction',
      title: 'The Daily Debrief',
      content:
        'The Gottman Institute found that couples who spend just 20 minutes a day talking about their lives outside the relationship — work, friends, worries, small victories — build a stronger friendship foundation than couples who skip this ritual.\n\nThe rules are simple:\n\n1. Take turns. Each person gets uninterrupted time to share.\n2. Talk about your day, your stresses, your world — not about the relationship.\n3. The listener\'s job is to be interested, ask questions, and show empathy. No fixing, no advice, no "you should have..."\n4. Show genuine interest. Your partner\'s inner world is a landscape worth exploring.\n\nThis is not a problem-solving session. It is a ritual of showing up for each other.',
    },
    {
      type: 'timer',
      title: 'Share and Listen',
      content:
        'Set a timer and take turns sharing. Each partner gets about 5 minutes, but do not worry about being exact. The sharing partner talks about their day — what happened, how they felt, what is on their mind. The listening partner is present, curious, and warm.\n\nSwitch when it feels natural. Use the full 10 minutes to practice being in each other\'s world.',
      duration: 600,
    },
    {
      type: 'prompt',
      title: 'What Did You Hear?',
      content:
        'Listening partner, what stood out to you from what your partner shared? What did you learn about their day that you did not know before? Try to name a specific detail that surprised you or moved you.',
      promptPlaceholder: 'What stood out to me was...',
    },
    {
      type: 'prompt',
      title: 'What Emotions Did You Notice?',
      content:
        'What emotions did you notice in your partner as they shared? Were they stressed, excited, sad, frustrated, proud? Sometimes we are so focused on the content of what someone says that we miss the feeling behind it.\n\nWhat emotion was your partner carrying today?',
      promptPlaceholder: 'The emotion I noticed in my partner was...',
    },
    {
      type: 'reflection',
      title: 'Reflection',
      content:
        'How did it feel to have this time together? Was it easy or hard to just listen without fixing? What would it be like to make this a daily ritual — 20 minutes of being in each other\'s world?',
      promptPlaceholder: 'What I want to remember from this is...',
    },
  ],
};
