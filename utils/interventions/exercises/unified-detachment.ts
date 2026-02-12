/**
 * Unified Detachment: It's Not You vs. Me
 *
 * Based on Integrative Behavioral Couple Therapy (IBCT) by
 * Andrew Christensen and Neil Jacobson. Unified detachment helps
 * couples step back from a conflict and describe it objectively —
 * as a pattern that happens to both of them rather than something
 * one partner does to the other.
 */

import type { Intervention } from '@/types/intervention';

export const unifiedDetachment: Intervention = {
  id: 'unified-detachment',
  title: 'Unified Detachment: It\'s Not You vs. Me',
  description:
    'Learn to step back from recurring conflicts and see them as shared patterns rather than personal attacks. IBCT\'s unified detachment technique helps couples become curious observers of their dynamics instead of adversaries trapped in them.',
  category: 'communication',
  duration: 30,
  difficulty: 'intermediate',
  mode: 'together',
  forStates: ['IN_WINDOW'],
  forPatterns: [
    'blame_cycles',
    'defensiveness',
    'low_consensus',
    'gridlocked_conflict',
  ],
  steps: [
    {
      type: 'instruction',
      title: 'From Blame to Curiosity',
      content:
        'When we are stuck in a conflict, it feels personal: "You always..." or "You never..." Unified detachment asks you to zoom out and look at the conflict as if you were researchers studying a pattern. The problem is not your partner. The problem is the pattern — and patterns can be understood, named, and managed without anyone being the villain.',
    },
    {
      type: 'prompt',
      title: 'Choose a Recurring Conflict',
      content:
        'Together, pick one conflict that keeps coming back. It could be about chores, money, time together, parenting, or anything else that tends to repeat. Describe it briefly, as if you were explaining it to a neutral third party.',
      promptPlaceholder: 'The recurring conflict we chose is...',
    },
    {
      type: 'prompt',
      title: 'Describe It as "The Problem"',
      content:
        'Now, describe this conflict as something external — "the problem" — rather than something one of you causes. Instead of "You leave your stuff everywhere," try "There is a tension between different standards of tidiness in our home."\n\nEach partner: describe your experience of the problem without using blame. Use "When the problem shows up, I feel..." rather than "When you do X, I..."',
      promptPlaceholder: 'When the problem shows up, my experience is...',
    },
    {
      type: 'prompt',
      title: 'Identify the Pattern, Not the Person',
      content:
        'Look at the sequence together: what triggers the pattern? What does each partner typically do? How does it escalate? How does it end? Try to describe this like a weather pattern — "First the pressure builds, then there is a storm, then cold silence, then it slowly warms up again." No one is to blame for the weather.',
      promptPlaceholder: 'The pattern usually goes like this...',
    },
    {
      type: 'prompt',
      title: 'Give the Pattern a Name',
      content:
        'Naming the pattern gives you power over it. Choose a name together — it can be descriptive ("The Clean-Up Standoff"), metaphorical ("The Tug of War"), or even humorous ("The Great Sock Debate"). The name should feel accurate to both of you and slightly lighter than the conflict itself.',
      promptPlaceholder: 'We are naming our pattern...',
    },
    {
      type: 'reflection',
      title: 'Brainstorm Ways to Manage It',
      content:
        'Now that you can see the pattern from the outside, brainstorm together: how might you manage it differently? You do not need to eliminate it — just handle it with more awareness and less damage. What could each of you do when you notice the pattern starting? What would help you both stay on the same team?',
      promptPlaceholder: 'Next time the pattern shows up, we could try...',
    },
  ],
};
