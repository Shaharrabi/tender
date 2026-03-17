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
      title: 'Find Your Window',
      content:
        'Your nervous system has a sweet spot \u2014 where you can think clearly and feel without flooding. Above it: anxious, reactive. Below it: numb, frozen. Let\u2019s find where you are right now.',
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
      title: 'Quick Guidance',
      content:
        'In your window? Great \u2014 you\u2019re ready to engage.\n\nAbove it? Slow breath: 4 counts in, 6 out. Or try 5-4-3-2-1 grounding.\n\nBelow it? Move gently. Stretch, press feet into floor, splash cold water.',
    },
    {
      type: 'reflection',
      title: 'One Thing',
      content:
        'What\u2019s one thing you noticed?',
      promptPlaceholder: 'I noticed...',
    },
  ],
};
