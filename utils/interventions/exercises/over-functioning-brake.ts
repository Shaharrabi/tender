/**
 * The Over-Functioning Brake (Bowen Theory)
 *
 * Identifies the areas where one partner does too much — managing,
 * fixing, reminding, anticipating — and creates a 24-hour experiment
 * to step back. Over-functioning erodes differentiation and trains
 * the other partner to under-function.
 */

import type { Intervention } from '@/types/intervention';

export const overFunctioningBrake: Intervention = {
  id: 'over-functioning-brake',
  title: 'The Over-Functioning Brake',
  description:
    'Identify where you\'re doing too much — managing, fixing, reminding — and design a 24-hour experiment to step back. When one partner over-functions, the other under-functions. Breaking the pattern frees both.',
  fieldInsight:
    'Doing less for your partner is sometimes the most loving thing you can do.',
  category: 'differentiation',
  duration: 8,
  difficulty: 'intermediate',
  mode: 'solo',
  forStates: ['IN_WINDOW', 'MIXED'],
  forPatterns: [
    'over_functioning',
    'control',
    'resentment',
    'caretaking',
    'under_functioning',
  ],
  steps: [
    // ─── Step 1: Psychoeducation ────────────────────────
    {
      type: 'instruction',
      title: 'The Over-Functioning Trap',
      content:
        'In Bowen Theory, over-functioning and under-functioning are a paired pattern. One partner takes on too much — reminding, managing, fixing, anticipating — while the other steps back and does less. The over-functioner builds resentment. The under-functioner loses competence and agency.\n\nThe trap: the more you do, the less they do. The less they do, the more you do. Both partners lose.\n\nBreaking this cycle requires the over-functioner to deliberately step back — not as punishment, but as trust.',
    },

    // ─── Step 2: Spot the pattern (scenario_choice) ─────
    {
      type: 'scenario_choice',
      title: 'Over or Under?',
      content:
        'Quick self-check — which pattern sounds more like you?',
      interactiveConfig: {
        kind: 'scenario_choice',
        scenario:
          'When something needs to be handled in your relationship, you typically:',
        choices: [
          {
            id: 'over',
            text: 'Jump in before being asked — remind, organize, manage',
            feedback:
              'You\'re likely the over-functioner. Your intentions are good, but taking over can erode your partner\'s agency and build your resentment.',
            isRecommended: false,
          },
          {
            id: 'under',
            text: 'Wait to be told, step back, let them handle it',
            feedback:
              'You may be the under-functioner. This isn\'t laziness — it\'s often a learned response to a partner who takes over. Your competence may be higher than either of you realize.',
          },
          {
            id: 'depends',
            text: 'It depends on the area — I over-function in some, not others',
            feedback:
              'Most people over-function selectively. You might manage the household but under-function emotionally, or vice versa. The next step will help you pinpoint where.',
            isRecommended: true,
          },
        ],
        revealAll: false,
      },
    },

    // ─── Step 3: Checklist of areas ─────────────────────
    {
      type: 'checklist',
      title: 'Where Do You Over-Function?',
      content:
        'Check all the areas where you tend to take on more than your share:',
      interactiveConfig: {
        kind: 'checklist',
        items: [
          { id: 'household', text: 'Household management', subtext: 'Cleaning, organizing, groceries, cooking' },
          { id: 'finances', text: 'Finances', subtext: 'Budgeting, bills, financial planning' },
          { id: 'social', text: 'Social calendar', subtext: 'Planning events, maintaining friendships' },
          { id: 'kids', text: 'Children / pets', subtext: 'Scheduling, homework, appointments' },
          { id: 'emotional', text: 'Emotional labor', subtext: 'Checking in, managing moods, keeping the peace' },
          { id: 'decisions', text: 'Decision-making', subtext: 'Researching, choosing, planning ahead' },
          { id: 'repair', text: 'Relationship repair', subtext: 'Always being the one who initiates after conflict' },
          { id: 'family', text: 'Extended family', subtext: 'Managing in-law relationships, holidays' },
        ],
        minRequired: 1,
      },
    },

    // ─── Step 4: Design experiment (prompt) ─────────────
    {
      type: 'prompt',
      title: 'The 24-Hour Experiment',
      content:
        'Choose ONE area from your checklist above. For the next 24 hours, you will deliberately NOT do that thing — without announcing it, without testing your partner, without keeping score.\n\nThis is not passive-aggression. This is trust: trusting that your partner is capable, and trusting that the relationship can handle you doing less.\n\nWhat will you step back from?',
      promptPlaceholder: 'For 24 hours, I will stop...',
    },

    // ─── Step 5: Anticipate discomfort (prompt) ─────────
    {
      type: 'prompt',
      title: 'What Will Be Hard?',
      content:
        'Stepping back will feel uncomfortable. What anxiety do you expect? What\'s the fear underneath your over-functioning?',
      promptPlaceholder: 'Stepping back scares me because...',
    },

    // ─── Step 6: Reflection ─────────────────────────────
    {
      type: 'reflection',
      title: 'Reflection',
      content:
        'What would it mean for your relationship if you could trust your partner to handle this area? What would it free you to be instead of the manager?',
      promptPlaceholder: 'If I let go of this, I could be...',
    },
  ],
};
