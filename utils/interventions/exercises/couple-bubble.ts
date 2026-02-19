/**
 * Building Your Couple Bubble
 *
 * Based on Stan Tatkin's PACT (Psychobiological Approach to Couple
 * Therapy). The couple bubble is a mutual agreement to protect the
 * relationship from external threats — creating a secure-functioning
 * alliance where both partners prioritize the relationship as the
 * primary unit, providing mutual safety and regulation.
 */

import type { Intervention } from '@/types/intervention';

export const coupleBubble: Intervention = {
  id: 'couple-bubble',
  title: 'Building Your Couple Bubble',
  description:
    'Create a shared protective space — a "couple bubble" — where both partners agree to prioritize each other\'s security. PACT research shows that couples who form this alliance handle external stressors better because they know they have each other\'s backs.',
  fieldInsight: 'The couple bubble is the living container that holds everything between you.',
  category: 'attachment',
  duration: 25,
  difficulty: 'intermediate',
  mode: 'together',
  forStates: ['IN_WINDOW'],
  forPatterns: [
    'low_common_coping',
    'external_stress',
    'parallel_lives',
    'boundary_issues',
  ],
  steps: [
    {
      type: 'instruction',
      title: 'What Is the Couple Bubble?',
      content:
        'The couple bubble is an implicit agreement between partners: "We come first. We protect each other. We have each other\'s backs — in public, in private, and under stress." It does not mean isolating from the world; it means that the relationship is the secure base from which both partners operate. When the bubble is strong, external stress stays external. When it is weak, outside pressures leak in and corrode the bond.',
    },
    {
      type: 'checklist',
      title: 'Identify Threats to Your Bubble',
      content: 'Which of these are currently pressing on your couple bubble?',
      interactiveConfig: {
        kind: 'checklist',
        items: [
          { id: 'work', text: 'Work demands and overcommitment', subtext: 'One or both of you being consumed by work' },
          { id: 'family', text: 'Extended family expectations', subtext: 'In-laws, family obligations, interference' },
          { id: 'money', text: 'Financial stress', subtext: 'Debt, income gaps, spending disagreements' },
          { id: 'screens', text: 'Social media and screen time', subtext: 'Phones at dinner, scrolling in bed' },
          { id: 'friends', text: 'Friendships that compete with couple time', subtext: 'One partner feeling deprioritized' },
          { id: 'individual', text: 'Individual stress that never gets shared', subtext: 'Parallel suffering instead of co-regulation' },
          { id: 'kids', text: 'Parenting demands', subtext: 'Kids consuming all available energy' },
        ],
        minRequired: 1,
      },
    },
    {
      type: 'prompt',
      title: 'Create Mutual Protection Agreements',
      content:
        'Now create three to five "I will always..." agreements that protect your bubble. These are promises about how you will show up for each other, especially when external pressure mounts. Examples:\n\n"I will always back you up in front of others, even if we disagree privately."\n"I will always tell you first before making a big commitment."\n"I will always make time for us, even on the busiest days."\n\nWrite your agreements together.',
      promptPlaceholder: 'Our mutual protection agreements: 1) I will always... 2) I will always... 3) I will always...',
    },
    {
      type: 'prompt',
      title: 'Design Morning and Evening Rituals',
      content:
        'Rituals of connection anchor the couple bubble in daily life. Design two brief rituals — one for the morning, one for the evening — that help you start and end each day connected. They should take no more than two to five minutes. Examples:\n\n- Morning: a real kiss (not a peck), sharing one intention for the day\n- Evening: a two-minute debrief of highs and lows, a moment of physical contact before sleep\n\nWhat rituals will work for your life?',
      promptPlaceholder: 'Our morning ritual: ... Our evening ritual: ...',
    },
    {
      type: 'timer',
      title: 'Practice a Physical Anchor',
      content:
        'PACT emphasizes the body as a regulator of connection. Choose one physical anchor to practice right now: a 10-second kiss, a 6-second hug (long enough for your bodies to relax into each other), or simply holding hands while making eye contact for one minute. The point is to let your nervous systems register: "We are together. We are safe. We are us."',
      duration: 60,
    },
    {
      type: 'reflection',
      title: 'Strengthening the Bubble This Week',
      content:
        'What is one specific thing you will each do this week to strengthen the couple bubble? It could be implementing your new ritual, honoring one of your protection agreements when it gets tested, or simply pausing when external stress hits and checking in with your partner before reacting. Small, consistent actions build the bubble over time.',
      promptPlaceholder: 'This week, I will strengthen our bubble by...',
    },
  ],
};
