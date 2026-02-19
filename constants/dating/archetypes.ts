/**
 * Constellation Archetypes
 *
 * Each archetype represents a pattern of how someone shows up
 * for new connection. Derived from game answers in The Field.
 */

import type { ArchetypeDefinition } from '@/types/dating';

export const ARCHETYPES: ArchetypeDefinition[] = [
  {
    key: 'secure',
    name: 'The Steady Flame',
    description: 'You show up with quiet confidence. Your presence is the gift — regulated, curious, and open to what unfolds.',
  },
  {
    key: 'anxious',
    name: 'The Bright Seeker',
    description: 'You move toward connection with extraordinary attunement. Your sensitivity is a superpower — you just need to trust the pace.',
  },
  {
    key: 'avoidant',
    name: 'The Lone Star',
    description: 'Your independence is genuine. You don\'t need someone to complete you. The growth edge is letting someone matter.',
  },
  {
    key: 'fearful',
    name: 'The Tender Storm',
    description: 'You understand complexity. You know love isn\'t simple, and that makes you wise. Staying present with contradictions is your practice.',
  },
  {
    key: 'openness',
    name: 'The Open Window',
    description: 'You bring receptivity and curiosity. Every interaction is an invitation to learn something new about yourself and others.',
  },
  {
    key: 'vulnerability',
    name: 'The Brave Heart',
    description: 'You lead with authenticity. Your willingness to be seen — imperfections and all — creates the deepest connections.',
  },
  {
    key: 'courage',
    name: 'The First Step',
    description: 'You take risks with grace. Whether it\'s saying hello first or asking the real question, you bring momentum to connection.',
  },
  {
    key: 'patience',
    name: 'The Long Game',
    description: 'You trust the process. In a world of instant everything, your willingness to wait is a radical act of faith.',
  },
  {
    key: 'growth',
    name: 'The Spiral',
    description: 'You\'re oriented toward becoming. Every relationship — even brief ones — teaches you something about who you\'re growing into.',
  },
  {
    key: 'intimacy',
    name: 'The Deep Diver',
    description: 'Surface-level doesn\'t interest you. You seek the conversation beneath the conversation, the feeling beneath the words.',
  },
  {
    key: 'independence',
    name: 'The Free Range',
    description: 'You need space to be fully yourself. The right connection enhances your freedom rather than constraining it.',
  },
  {
    key: 'depth',
    name: 'The Still Water',
    description: 'You carry a quiet intensity. People underestimate your emotional landscape, but those who know you find oceans.',
  },
  {
    key: 'presence',
    name: 'The Here & Now',
    description: 'You have the rare gift of actually being in the moment. You don\'t fast-forward to the future or replay the past.',
  },
  {
    key: 'caution',
    name: 'The Careful Keeper',
    description: 'Your protectiveness isn\'t weakness — it\'s wisdom. You guard your heart not because it\'s fragile, but because it\'s precious.',
  },
];

/** Quick lookup from trait key to archetype */
export const ARCHETYPE_MAP: Record<string, ArchetypeDefinition> = Object.fromEntries(
  ARCHETYPES.map((a) => [a.key, a]),
);
