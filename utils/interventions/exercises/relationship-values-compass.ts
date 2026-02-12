/**
 * Relationship Values Compass
 *
 * Based on Acceptance and Commitment Therapy (ACT) principles
 * applied to couples work. ACT emphasizes values-driven action
 * over symptom reduction. This exercise helps partners clarify
 * what kind of relationship they want to build and align their
 * daily behavior with those values.
 */

import type { Intervention } from '@/types/intervention';

export const relationshipValuesCompass: Intervention = {
  id: 'relationship-values-compass',
  title: 'Relationship Values Compass',
  description:
    'Clarify what matters most to you as a couple using ACT\'s values framework. When partners know their shared values, they can navigate disagreements with a compass rather than a scoreboard — choosing direction over victory.',
  category: 'values',
  duration: 30,
  difficulty: 'intermediate',
  mode: 'together',
  forStates: ['IN_WINDOW'],
  forPatterns: [
    'values_misalignment',
    'directionless',
    'low_consensus',
  ],
  steps: [
    {
      type: 'instruction',
      title: 'Values Are a Direction, Not a Destination',
      content:
        'In ACT, values are not goals you achieve — they are directions you move toward, like compass points. You never "arrive" at honesty or intimacy; you keep walking toward them. When couples share a sense of direction, they can tolerate the bumps along the way because they know where they are headed. This exercise helps you find your shared compass.',
    },
    {
      type: 'prompt',
      title: 'Rank Your Relationship Values',
      content:
        'Individually — without showing your partner — rank these relationship values from 1 (most important) to 8 (least important). There are no wrong answers; this is about what matters most to you.\n\n- Intimacy (emotional and physical closeness)\n- Honesty (transparency and truth-telling)\n- Growth (learning, evolving, challenging each other)\n- Adventure (novelty, exploration, shared experiences)\n- Security (stability, reliability, predictability)\n- Fun (playfulness, humor, lightness)\n- Independence (space, autonomy, separate identities)\n- Family (shared commitment to children, relatives, home)',
      promptPlaceholder: 'My ranking: 1. ... 2. ... 3. ... (continue to 8)',
    },
    {
      type: 'prompt',
      title: 'Share and Compare',
      content:
        'Now share your rankings with each other. Where do you overlap? Where do you differ? Explore the differences with curiosity rather than judgment — your partner\'s values reflect their needs and history, just as yours do.\n\nNote: differences are not threats. A couple where one values adventure and the other values security can be wonderfully complementary — if they approach the difference with respect.',
      promptPlaceholder: 'We overlap on... and we differ on...',
    },
    {
      type: 'prompt',
      title: 'Create a Shared Values Statement',
      content:
        'Based on your conversation, write one shared values statement — a sentence or two that captures what kind of relationship you both want to build. It should feel true to both of you. Examples:\n\n"We are building a relationship grounded in honesty and growth, where we give each other room to be individuals while staying deeply connected."\n\n"We value intimacy and adventure — we want a relationship that feels like both a safe harbor and an open sea."',
      promptPlaceholder: 'Our shared values statement is...',
    },
    {
      type: 'reflection',
      title: 'One Values-Aligned Action This Week',
      content:
        'Values only matter if they show up in behavior. Based on your shared values statement, identify one specific, concrete action each of you will take this week that moves in the direction of your values. Make it small enough to actually do — a daily practice, a single conversation, a specific gesture.',
      promptPlaceholder: 'This week, my values-aligned action will be...',
    },
  ],
};
