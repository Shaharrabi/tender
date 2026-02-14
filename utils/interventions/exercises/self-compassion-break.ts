/**
 * Self-Compassion Break
 *
 * Based on Kristin Neff's three components of self-compassion:
 * mindfulness, common humanity, and self-kindness.
 */

import type { Intervention } from '@/types/intervention';

export const selfCompassionBreak: Intervention = {
  id: 'self-compassion-break',
  title: 'Self-Compassion Break',
  description:
    'A gentle practice based on Kristin Neff\'s three pillars of self-compassion: mindfulness, common humanity, and self-kindness. A way to meet your suffering with care.',
  fieldInsight: 'Tenderness toward yourself softens the field between you and everyone.',
  category: 'regulation',
  duration: 5,
  difficulty: 'beginner',
  mode: 'solo',
  forStates: ['ACTIVATED', 'SHUTDOWN', 'MIXED'],
  forPatterns: [
    'self_blame',
    'inner_critic',
    'shame',
    'emotional_flooding',
    'perfectionism',
  ],
  steps: [
    {
      type: 'instruction',
      title: 'The Self-Compassion Break',
      content:
        'When we are in pain — whether from conflict, shame, or self-judgment — our instinct is often to push through, distract, or criticize ourselves further. This practice offers a different path. It has three simple steps: acknowledging the suffering, remembering you are not alone, and offering yourself kindness. Find a quiet moment and take a slow breath.',
    },
    {
      type: 'instruction',
      title: 'Mindfulness: "This Is a Moment of Suffering"',
      content:
        'Silently say to yourself: "This is a moment of suffering." Or use words that feel natural: "This hurts." "This is hard." "I am struggling right now."\n\nThis step is about honest acknowledgment — not exaggerating and not minimizing. Just naming what is true.',
    },
    {
      type: 'instruction',
      title: 'Common Humanity: "Suffering Is Part of Being Human"',
      content:
        'Now silently say: "Suffering is a part of life." Or: "Other people feel this way too." "I am not alone in this."\n\nThis step counters the isolating voice that says your pain makes you uniquely broken. Every human being knows this kind of pain.',
    },
    {
      type: 'instruction',
      title: 'Self-Kindness: "May I Be Kind to Myself"',
      content:
        'Finally, silently say: "May I be kind to myself." Or: "May I give myself the compassion I need." "May I accept myself as I am."\n\nLet the words land. You might also try: "May I be patient with myself" or "May I be strong enough to be gentle."',
    },
    {
      type: 'timer',
      title: 'Place Your Hand on Your Heart',
      content:
        'Place one or both hands on your heart or another soothing spot on your body. Feel the warmth of your own touch. Breathe slowly. Stay here for a moment and let the three phrases settle into your body.',
      duration: 30,
    },
    {
      type: 'reflection',
      title: 'Reflection',
      content:
        'How did it feel to offer yourself compassion? Was it easy or uncomfortable? Did any resistance come up? What would it be like to practice this when you notice self-criticism or shame?',
      promptPlaceholder: 'What I noticed during this practice was...',
    },
  ],
};
