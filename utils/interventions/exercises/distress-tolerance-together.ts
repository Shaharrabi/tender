/**
 * TIPP Skills for Couples
 *
 * Adapted from Dialectical Behavior Therapy (DBT) distress
 * tolerance skills for use in couple relationships. TIPP
 * (Temperature, Intense exercise, Paced breathing, Progressive
 * relaxation) activates the body's dive reflex and parasympathetic
 * nervous system to rapidly reduce physiological arousal — the
 * flooding that makes productive conversation impossible.
 */

import type { Intervention } from '@/types/intervention';

export const distressToleranceTogether: Intervention = {
  id: 'distress-tolerance-together',
  title: 'TIPP Skills for Couples',
  description:
    'Learn and practice DBT\'s TIPP technique together — a body-based approach to rapidly reducing emotional flooding. When your nervous system is activated beyond its window of tolerance, no amount of talking helps. TIPP brings you back to a state where connection is possible.',
  category: 'regulation',
  duration: 20,
  difficulty: 'beginner',
  mode: 'together',
  forStates: ['ACTIVATED'],
  forPatterns: [
    'flooding',
    'emotional_reactivity',
    'escalation',
  ],
  steps: [
    {
      type: 'instruction',
      title: 'What Is TIPP and Why It Works',
      content:
        'When you are emotionally flooded — heart racing, muscles tense, thoughts spinning — your prefrontal cortex goes offline. You literally cannot think clearly or listen well. TIPP uses your body\'s built-in calming mechanisms to bring your nervous system back online:\n\n- Temperature: Cold activates the dive reflex, slowing your heart rate.\n- Intense exercise: Brief intense movement burns off stress hormones.\n- Paced breathing: Slow exhales activate the parasympathetic system.\n- Progressive relaxation: Tensing and releasing muscles signals safety.\n\nYou are going to learn and practice these together so you can use them before or during difficult conversations.',
    },
    {
      type: 'instruction',
      title: 'Temperature: Cold Water Reset',
      content:
        'Get a bowl of cold water or hold ice cubes. Together, splash cold water on your face or hold ice against your wrists or the back of your neck for 30 seconds. This triggers the mammalian dive reflex — an automatic response that slows your heart rate and redirects blood flow to your core organs. It sounds simple, but it is one of the fastest ways to interrupt an emotional hijack.\n\nNotice how your body responds. You may feel a slight shock, then a wave of calm.',
    },
    {
      type: 'timer',
      title: 'Paced Breathing Together',
      content:
        'Sit facing each other. You are going to breathe together for two minutes.\n\nInhale through your nose for 4 counts.\nHold for 2 counts.\nExhale through your mouth for 6 counts.\n\nThe longer exhale is key — it activates the vagus nerve and tells your body that you are safe. Try to synchronize your breathing with your partner. Breathing together co-regulates both nervous systems.',
      duration: 120,
    },
    {
      type: 'prompt',
      title: 'Create a Time-Out Signal',
      content:
        'Agree on a time-out signal that either partner can use when they feel flooding coming on. It should be:\n\n- A specific word, phrase, or gesture (e.g., "I need a pause," a hand signal, a code word)\n- Non-blaming — it means "my nervous system needs a break," not "you are too much"\n- Paired with a commitment to return — always agree on when you will come back to the conversation (e.g., 20 minutes, after a walk)\n\nWhat is your time-out signal and return plan?',
      promptPlaceholder: 'Our time-out signal is... and we will return to the conversation by...',
    },
    {
      type: 'reflection',
      title: 'Commit to TIPP Before Hard Conversations',
      content:
        'The most important TIPP skill is using it preventively — before you are fully flooded. Commit to each other: when you notice your body activating (clenched jaw, racing heart, tight chest), you will use at least one TIPP technique before continuing a difficult conversation. Which technique felt most effective for each of you? How will you remind each other to use it?',
      promptPlaceholder: 'The technique that worked best for me was... I will use it when...',
    },
  ],
};
