/**
 * Relationship Mission Statement
 *
 * Step 12 capstone exercise. The couple co-creates a living document
 * that captures their shared vision, values, and commitments.
 * This is the final integrative practice of the Twelve Steps journey.
 */

import type { Intervention } from '@/types/intervention';

export const relationshipMissionStatement: Intervention = {
  id: 'relationship-mission-statement',
  title: 'Relationship Mission Statement',
  description:
    'Co-create a living document that captures your shared vision, values, and commitments as a couple. The capstone practice of your healing journey.',
  fieldInsight: 'Naming what you are building together gives the field a direction.',
  category: 'values',
  duration: 25,
  difficulty: 'advanced',
  mode: 'together',
  forStates: ['IN_WINDOW'],
  forPatterns: [
    'values_alignment',
    'meaning_making',
    'future_orientation',
    'relational_identity',
  ],
  steps: [
    {
      type: 'instruction',
      title: 'Welcome to Your Capstone',
      content:
        'This is a special exercise — a culmination of the journey you\'ve been on together. You\'re going to co-create a Relationship Mission Statement: a living document that captures what you\'ve learned, what you value, and how you want to move forward.\n\nThere are no right answers. This is about honoring what\'s real between you.',
    },
    {
      type: 'reflection',
      title: 'What We\'ve Been Through',
      content:
        'Take a moment to reflect on your journey together — not just the exercises, but the real moments of change. What stands out? What felt like a turning point?',
      promptPlaceholder: 'The moment I felt something shift was...',
    },
    {
      type: 'prompt',
      title: 'Our Core Values',
      content:
        'Together, name 3-5 values that feel essential to who you are as a couple. These might have emerged from your earlier values work, or they might be new. Think about what you want to protect and prioritize.',
      promptPlaceholder: 'Our core values as a couple are...',
    },
    {
      type: 'prompt',
      title: 'How We Want to Show Up',
      content:
        'Describe how you want to treat each other during everyday moments and during hard ones. What does it look like when you\'re at your best together?',
      promptPlaceholder: 'When we\'re at our best, we...',
    },
    {
      type: 'prompt',
      title: 'What We\'re Committed To',
      content:
        'Name specific commitments you\'re making to each other and to the relationship. These can be daily habits, repair practices, or ways of staying connected.',
      promptPlaceholder: 'We commit to...',
    },
    {
      type: 'prompt',
      title: 'Our Shared Vision',
      content:
        'Imagine your relationship a year from now, living out these values and commitments. What does it look like? What does it feel like? Paint a picture together.',
      promptPlaceholder: 'A year from now, we see ourselves...',
    },
    {
      type: 'reflection',
      title: 'Your Mission Statement',
      content:
        'Now bring it all together. Write your Relationship Mission Statement — a few sentences or a short paragraph that captures the essence of who you are as a couple and where you\'re going. This is yours to return to whenever you need grounding.',
      promptPlaceholder: 'Our Relationship Mission Statement:\n\nWe are a couple who...',
    },
    {
      type: 'instruction',
      title: 'A Living Document',
      content:
        'Your mission statement isn\'t carved in stone — it\'s a living document. Return to it when things feel hard, when you need to remember why you do this work, or when you want to celebrate how far you\'ve come.\n\nYou\'ve done something remarkable by arriving here. Not because you\'ve "fixed" anything, but because you chose — and keep choosing — to show up.',
    },
  ],
};
