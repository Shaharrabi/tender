/**
 * 5-4-3-2-1 Grounding Exercise
 *
 * A sensory grounding technique that uses all five senses
 * to bring awareness back to the present moment.
 * Effective for dysregulation, anxiety, and activation.
 */

import type { Intervention } from '@/types/intervention';

export const grounding54321: Intervention = {
  id: 'grounding-5-4-3-2-1',
  title: '5-4-3-2-1 Grounding',
  description:
    'Use your five senses to ground yourself in the present moment. A quick and effective way to move back into your window of tolerance.',
  fieldInsight: 'When your body finds ground, the space between you can breathe again.',
  category: 'regulation',
  duration: 3,
  difficulty: 'beginner',
  mode: 'solo',
  forStates: ['ACTIVATED', 'MIXED'],
  forPatterns: [
    'anxiety_flooding',
    'emotional_reactivity',
    'hyperactivation',
    'rumination',
  ],
  steps: [
    {
      type: 'instruction',
      title: 'Land Here',
      content:
        'A quick sensory reset. We\u2019ll walk through your five senses to bring you back to right now. One slow breath first.',
    },
    {
      type: 'checklist',
      title: '5 Things You See',
      content: 'Look around you slowly. Tap each thing you notice:',
      interactiveConfig: {
        kind: 'checklist',
        items: [
          { id: 'see1', text: 'A color on the wall or floor' },
          { id: 'see2', text: 'Something with texture' },
          { id: 'see3', text: 'Light coming through a window or from a screen' },
          { id: 'see4', text: 'Something you hadn\'t noticed before' },
          { id: 'see5', text: 'Your own hands or body' },
        ],
        minRequired: 3,
      },
    },
    {
      type: 'checklist',
      title: '4 Things You Hear',
      content: 'Close your eyes if you like. Tap each sound you notice:',
      interactiveConfig: {
        kind: 'checklist',
        items: [
          { id: 'hear1', text: 'A mechanical hum (fan, fridge, AC)' },
          { id: 'hear2', text: 'Something distant (traffic, wind, voices)' },
          { id: 'hear3', text: 'Your own breathing' },
          { id: 'hear4', text: 'Something unexpected or subtle' },
        ],
        minRequired: 2,
      },
    },
    {
      type: 'checklist',
      title: '3 Things You Can Touch',
      content: 'Reach out and feel. Tap as you notice each:',
      interactiveConfig: {
        kind: 'checklist',
        items: [
          { id: 'touch1', text: 'The surface beneath you (chair, floor, bed)' },
          { id: 'touch2', text: 'The fabric of your clothing' },
          { id: 'touch3', text: 'The temperature of the air on your skin' },
        ],
        minRequired: 2,
      },
    },
    {
      type: 'prompt',
      title: '2 Things You Smell',
      content:
        'Bring your awareness to your sense of smell. Name two things you can smell right now. If nothing is obvious, bring something close — your sleeve, a nearby object.',
      promptPlaceholder: 'I can smell...',
    },
    {
      type: 'prompt',
      title: '1 Thing You Taste',
      content:
        'Finally, notice one thing you can taste. It might be the lingering flavor of something you ate, or simply the taste of your own mouth.',
      promptPlaceholder: 'I can taste...',
    },
    {
      type: 'reflection',
      title: 'Check In',
      content:
        'One more breath. Anything different now?',
      promptPlaceholder: 'I feel...',
    },
  ],
};
