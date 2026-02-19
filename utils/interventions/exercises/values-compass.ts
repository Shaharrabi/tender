/**
 * Values Compass Check-In
 *
 * An ACT-informed exercise to reconnect with personal values,
 * assess alignment, and identify one committed action.
 */

import type { Intervention } from '@/types/intervention';

export const valuesCompass: Intervention = {
  id: 'values-compass',
  title: 'Values Compass',
  description:
    'An ACT-inspired check-in to reconnect with your core values, assess how aligned your recent actions have been, and choose one small step for tomorrow.',
  fieldInsight: 'Your values are the compass for the space between you.',
  category: 'values',
  duration: 5,
  difficulty: 'beginner',
  mode: 'solo',
  forStates: ['IN_WINDOW', 'SHUTDOWN', 'MIXED'],
  forPatterns: [
    'values_disconnect',
    'avoidance',
    'lack_of_direction',
    'burnout',
    'relationship_drift',
  ],
  steps: [
    {
      type: 'instruction',
      title: 'Your Values Compass',
      content:
        'Values are not goals to achieve — they are directions to move toward. Like a compass, they help you orient even when the path is unclear. This exercise invites you to check in with which value feels most alive for you today and how well your actions have been aligned with it.',
    },
    {
      type: 'prompt',
      title: 'Which Value Feels Most Alive?',
      content:
        'Consider the different areas of your life — your relationship, family, work, health, growth, community. Which value feels most important or most calling for your attention right now? Examples: connection, honesty, courage, presence, kindness, growth, playfulness.',
      promptPlaceholder: 'The value that feels most alive for me right now is...',
    },
    {
      type: 'scale_slider',
      title: 'Rate Your Alignment',
      content: 'How well have your actions this week reflected the value you named?',
      interactiveConfig: {
        kind: 'scale_slider',
        labels: {
          low: '1 \u2014 Way off course',
          mid: '5 \u2014 Somewhat aligned',
          high: '10 \u2014 Living it fully',
        },
        zones: [
          { range: [0, 30] as [number, number], label: 'Off course', content: 'No judgment. This awareness IS the first step back.' },
          { range: [31, 60] as [number, number], label: 'Some alignment', content: 'You\'ve been moving in the direction, even if imperfectly.' },
          { range: [61, 100] as [number, number], label: 'Strong alignment', content: 'Your actions are reflecting your values. Worth celebrating.' },
        ],
        initialValue: 50,
      },
    },
    {
      type: 'prompt',
      title: 'One Small Action for Tomorrow',
      content:
        'Identify one small, specific action you can take tomorrow that would move you even slightly closer to this value. Make it concrete and doable — something you could actually do, not something aspirational. The smaller the better.',
      promptPlaceholder: 'Tomorrow I will...',
    },
    {
      type: 'reflection',
      title: 'Reflection',
      content:
        'What came up for you during this check-in? Was it easy to identify your value, or did you feel pulled in multiple directions? What would it be like to do this check-in regularly?',
      promptPlaceholder: 'What I noticed is...',
    },
  ],
};
