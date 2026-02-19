/**
 * Window of Tolerance Check
 *
 * A quick nervous system check-in to assess whether you are
 * within your window of tolerance and take regulatory action
 * if needed.
 */

import type { Intervention } from '@/types/intervention';

export const windowCheck: Intervention = {
  id: 'window-check',
  title: 'Window of Tolerance Check',
  description:
    'A quick check-in with your nervous system. Scan your body, rate where you are, and get guidance on returning to your window of tolerance if needed.',
  fieldInsight: 'A pause gives the relational field room to breathe.',
  category: 'regulation',
  duration: 3,
  difficulty: 'beginner',
  mode: 'solo',
  forStates: ['IN_WINDOW', 'ACTIVATED', 'SHUTDOWN', 'MIXED'],
  forPatterns: [
    'dysregulation',
    'emotional_flooding',
    'shutdown',
    'numbness',
    'hyperactivation',
  ],
  steps: [
    {
      type: 'instruction',
      title: 'About Your Window',
      content:
        'Your "window of tolerance" is the zone where you can think clearly, feel your emotions without being overwhelmed, and respond rather than react. Above the window, you feel activated — anxious, reactive, flooded. Below the window, you feel shut down — numb, disconnected, frozen. This quick check helps you locate yourself.',
    },
    {
      type: 'timer',
      title: 'Body Scan',
      content:
        'Take 30 seconds to scan your body from head to toe. Notice your breathing, your heart rate, the tension in your shoulders, your jaw, your belly. Are you holding anything? Is your breathing shallow or deep? Simply notice without trying to change anything.',
      duration: 30,
    },
    {
      type: 'scale_slider',
      title: 'Where Are You Right Now?',
      content: 'Drag the marker to where your nervous system feels right now:',
      interactiveConfig: {
        kind: 'scale_slider',
        labels: {
          low: 'Shutdown / Frozen',
          mid: 'In My Window',
          high: 'Activated / Flooded',
        },
        zones: [
          { range: [0, 25] as [number, number], label: 'Hypoarousal', content: 'You might feel numb, flat, disconnected, foggy. Gentle movement or warmth can help.' },
          { range: [26, 75] as [number, number], label: 'Window of Tolerance', content: 'You can think clearly, feel your feelings, and make choices. This is where growth happens.' },
          { range: [76, 100] as [number, number], label: 'Hyperarousal', content: 'You might feel racing thoughts, tight chest, hot face. Grounding or breathing can help.' },
        ],
        initialValue: 50,
      },
    },
    {
      type: 'instruction',
      title: 'Guidance',
      content:
        'If you are inside your window (4-7): You are in a good place to engage, reflect, and connect. Well done noticing.\n\nIf you are above the window (8-10): Try the 5-4-3-2-1 Grounding exercise or slow your breathing to a 4-count in, 6-count out pattern.\n\nIf you are below the window (1-3): Try gentle movement — stretch, press your feet into the floor, splash cold water on your face, or hold something warm.',
    },
    {
      type: 'reflection',
      title: 'Reflection',
      content:
        'What did you notice in your body scan? Is there anything that surprised you? What might have contributed to where you are right now?',
      promptPlaceholder: 'I noticed that...',
    },
  ],
};
