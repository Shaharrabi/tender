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
      title: 'Welcome',
      content:
        'This is a quick sensory grounding exercise. It works by gently shifting your attention from internal distress to the world around you. Find a comfortable position and take one slow breath before we begin.',
    },
    {
      type: 'prompt',
      title: '5 Things You See',
      content:
        'Look around you slowly. Name five things you can see right now. They can be anything — a color on the wall, the texture of your sleeve, the light coming through a window.',
      promptPlaceholder: 'I can see...',
    },
    {
      type: 'prompt',
      title: '4 Things You Hear',
      content:
        'Close your eyes if you like, and listen carefully. Name four things you can hear. Include subtle sounds — the hum of a fan, distant traffic, your own breathing.',
      promptPlaceholder: 'I can hear...',
    },
    {
      type: 'prompt',
      title: '3 Things You Can Touch',
      content:
        'Reach out and notice three things you can physically touch. Feel the texture, temperature, and weight. The fabric of your clothing, the surface beneath you, the air on your skin.',
      promptPlaceholder: 'I can touch...',
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
      title: 'Closing Reflection',
      content:
        'Take another slow breath. Notice if anything has shifted in your body or mind since you started. You have just moved through all five senses — a small but powerful act of presence.',
      promptPlaceholder: 'What do you notice now?',
    },
  ],
};
