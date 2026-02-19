/**
 * Dreams Within Conflict
 *
 * Based on Gottman's discovery that 69% of couple conflicts are
 * perpetual — rooted not in solvable logistics but in deeply held
 * dreams, values, and life narratives. This exercise helps partners
 * understand the dream or meaning behind each other's position in
 * a gridlocked conflict.
 */

import type { Intervention } from '@/types/intervention';

export const dreamsWithinConflict: Intervention = {
  id: 'dreams-within-conflict',
  title: 'Dreams Within Conflict',
  description:
    'Explore the hidden dreams and deeper meanings behind your gridlocked conflicts. When couples understand why a position matters so deeply, they move from opposition to understanding — even when they cannot fully agree.',
  fieldInsight: 'Underneath every gridlocked issue lives a dream that has not been heard.',
  category: 'communication',
  duration: 40,
  difficulty: 'advanced',
  mode: 'together',
  forStates: ['IN_WINDOW'],
  forPatterns: [
    'gridlocked_conflict',
    'low_consensus',
    'perpetual_problems',
  ],
  steps: [
    {
      type: 'instruction',
      title: 'Why Conflicts Get Gridlocked',
      content:
        'Most recurring arguments are not about the surface issue. They are about underlying dreams — a vision for your life, a core need for identity, or a story from your past that shaped who you are. When we argue about money, chores, or parenting, we are often arguing about freedom, respect, security, or belonging. This exercise will help you uncover the dream hidden inside a stuck conflict.',
    },
    {
      type: 'scale_slider',
      title: 'How Gridlocked Does This Feel?',
      content: 'Before we explore the dream underneath, rate how stuck this issue feels:',
      interactiveConfig: {
        kind: 'scale_slider',
        labels: {
          low: 'Slightly stuck',
          mid: 'Moderately gridlocked',
          high: 'Completely unmovable',
        },
        zones: [
          { range: [0, 33] as [number, number], label: 'Some flexibility', content: 'There may still be room for compromise on the surface issue.' },
          { range: [34, 66] as [number, number], label: 'Feels stuck', content: 'The positions have hardened. Time to look underneath for the dream.' },
          { range: [67, 100] as [number, number], label: 'Deep gridlock', content: 'This issue carries a lot of meaning. The dream underneath is probably very important to both of you.' },
        ],
        initialValue: 60,
      },
    },
    {
      type: 'prompt',
      title: 'Identify a Gridlocked Issue',
      content:
        'Together, choose one recurring conflict that you keep coming back to without resolution. It should be something that feels stuck — where you each have a position you cannot seem to budge from. Name the issue briefly, without rehashing the argument.',
      promptPlaceholder: 'The recurring issue we chose is...',
    },
    {
      type: 'prompt',
      title: 'Explore the Dream Behind Your Position',
      content:
        'One partner at a time: look underneath your position in this conflict. Ask yourself:\n\n- What does this issue mean to me? Why does it matter so much?\n- Is there a dream, hope, or wish connected to my position?\n- Does this connect to my history, my identity, or my vision for the future?\n\nShare your dream with your partner. Partner: your only job is to listen and understand, not to argue or rebut.',
      promptPlaceholder: 'The dream or deeper meaning behind my position is...',
    },
    {
      type: 'timer',
      title: 'Listen Without Judgment',
      content:
        'Switch roles. The other partner now shares the dream behind their position. The listener practices pure reception — no interrupting, no correcting, no defending. Simply listen to understand what this means to the person you love. You will have time to respond after.',
      duration: 300,
    },
    {
      type: 'prompt',
      title: 'Find the Overlap or Honor the Difference',
      content:
        'Now that you have each heard the other\'s dream, look for common ground. Are there parts of both dreams you can honor? If the dreams truly conflict, can you find a way to respect the difference rather than defeat it?\n\nRemember: the goal is not to solve the problem today but to move from gridlock to dialogue.',
      promptPlaceholder: 'What we found in common or can honor is...',
    },
    {
      type: 'reflection',
      title: 'Create a Temporary Compromise',
      content:
        'Based on what you learned about each other\'s dreams, can you create a temporary, two-month compromise that honors some of both positions? It does not have to be perfect. A good-enough compromise that respects both partners is better than a stalemate that respects neither.',
      promptPlaceholder: 'Our temporary compromise could be...',
    },
  ],
};
