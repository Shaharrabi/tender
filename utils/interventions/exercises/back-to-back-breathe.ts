/**
 * Back-to-Back Breathe (Somatic Co-Regulation)
 *
 * A couples breathing exercise using physical contact and
 * synchronized breathing to co-regulate nervous systems.
 * Based on polyvagal theory — shared rhythmic breathing
 * through physical contact activates the social engagement system.
 */

import type { Intervention } from '@/types/intervention';

export const backToBackBreathe: Intervention = {
  id: 'back-to-back-breathe',
  title: 'Back-to-Back Breathe',
  description:
    'Sit back to back with your partner and synchronize your breathing. Feel each other\'s rhythm through physical contact. When two nervous systems co-regulate, both settle faster than either could alone.',
  fieldInsight:
    'Two nervous systems breathing together settle faster than either one alone.',
  category: 'regulation',
  duration: 10,
  difficulty: 'beginner',
  mode: 'together',
  forStates: ['ACTIVATED', 'IN_WINDOW', 'MIXED'],
  forPatterns: [
    'co_regulation',
    'emotional_flooding',
    'disconnection',
    'nervous_system_activation',
  ],
  steps: [
    // ─── Step 1: Setup instruction ──────────────────────
    {
      type: 'instruction',
      title: 'Setting Up',
      content:
        'Sit on the floor or a firm surface, back to back with your partner. Let your spines touch. Adjust until you can feel each other\'s ribcage expand with each breath.\n\nThis exercise uses physical contact to synchronize your nervous systems. Polyvagal theory shows that co-regulation — settling together — is the most natural way humans calm down.\n\nNo words needed for the next few minutes. Just breathe.',
    },

    // ─── Step 2: Notice your state (scenario_choice) ────
    {
      type: 'scenario_choice',
      title: 'Where\'s Your Nervous System?',
      content:
        'Before you begin, check in with yourself:',
      interactiveConfig: {
        kind: 'scenario_choice',
        scenario: 'Right now, my body feels:',
        choices: [
          {
            id: 'activated',
            text: 'Activated — racing, tight, buzzing',
            feedback:
              'Your sympathetic nervous system is running hot. The longer exhale in this exercise will directly activate your vagus nerve and begin to settle you.',
          },
          {
            id: 'window',
            text: 'In my window — present and calm enough',
            feedback:
              'You\'re starting from a good place. This exercise will deepen your calm and build your capacity for co-regulation.',
          },
          {
            id: 'shutdown',
            text: 'Shut down — flat, numb, disconnected',
            feedback:
              'Your dorsal vagal system may be dominant. The warmth of physical contact and rhythmic breathing can gently bring you back online.',
          },
        ],
        revealAll: false,
      },
    },

    // ─── Step 3: Guided breathing (breathing_guide) ─────
    {
      type: 'breathing_guide',
      title: 'Breathe Together',
      content:
        'Follow the circle. Breathe in sync with your partner.\nFeel their back expand as they inhale. Match their rhythm.\n\nThe longer exhale tells your nervous system: "You are safe."',
      interactiveConfig: {
        kind: 'breathing_guide',
        pattern: { inhale: 4, exhale: 6 },
        cycles: 12,
        colorShift: { start: '#E07A5F', end: '#8F9E8B' },
      },
    },

    // ─── Step 4: Post-breathing check ───────────────────
    {
      type: 'prompt',
      title: 'What Shifted?',
      content:
        'Open your eyes slowly. Stay seated back to back for a moment.\n\nWhat changed in your body during the breathing? Did you feel your partner\'s rhythm? Was there a moment where your breathing synced?',
      promptPlaceholder: 'I noticed that...',
    },

    // ─── Step 5: Reflection ─────────────────────────────
    {
      type: 'reflection',
      title: 'Reflection',
      content:
        'How was it to settle your nervous system together rather than alone? Is this something you could use before difficult conversations — a two-minute reset before you talk?',
      promptPlaceholder: 'Breathing together felt...',
    },
  ],
};
