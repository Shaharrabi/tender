/**
 * Building Bridges Card Game — Category Definitions
 *
 * 5 Connection Builder categories + Open Heart vulnerability deck.
 * Colors from the Wes Anderson theme. Each category maps to a WEARE variable.
 */

import { Colors } from '@/constants/theme';

export type CardCategory =
  | 'emotional-connection'
  | 'communication'
  | 'personal-growth'
  | 'appreciation'
  | 'relationship-dynamics';

export type CardDeck = 'connection-builder' | 'open-heart';

export interface CategoryConfig {
  id: CardCategory;
  name: string;
  color: string;
  colorLight: string;
  weareVariable: string;
  description: string;
  cardCount: number;
}

export interface DeckConfig {
  id: CardDeck;
  name: string;
  color: string;
  colorLight: string;
  description: string;
  cardCount: number;
}

export const CATEGORIES: CategoryConfig[] = [
  {
    id: 'emotional-connection',
    name: 'Emotional Connection',
    color: Colors.accent,          // Terracotta #D8A499
    colorLight: Colors.primaryFaded, // #F4D5D0
    weareVariable: 'attunement',
    description: 'Emotional openness, vulnerability, and trust-building',
    cardCount: 9,
  },
  {
    id: 'communication',
    name: 'Communication',
    color: Colors.secondary,       // Lobby Blue #7294D4
    colorLight: Colors.secondaryLight, // #C6CDF7
    weareVariable: 'co-creation',
    description: 'Conflict resolution, active listening, and perspective-taking',
    cardCount: 9,
  },
  {
    id: 'personal-growth',
    name: 'Personal Growth',
    color: Colors.calm,            // Soft Teal #6BA3A0
    colorLight: '#D4ECEB',
    weareVariable: 'individual',
    description: 'Self-awareness, past patterns, and emotional regulation',
    cardCount: 11,
  },
  {
    id: 'appreciation',
    name: 'Appreciation',
    color: Colors.accentGold,      // Concierge Gold #D4A843
    colorLight: Colors.accentCream, // #F1BB7B
    weareVariable: 'transmission',
    description: 'Gratitude, recognition, and celebrating what works',
    cardCount: 6,
  },
  {
    id: 'relationship-dynamics',
    name: 'Relationship Dynamics',
    color: Colors.primary,         // Dusty Rose #C4616E
    colorLight: Colors.primaryLight, // #E6A0C4
    weareVariable: 'space',
    description: 'Future vision, security, reconnection, and shared growth',
    cardCount: 10,
  },
];

export const OPEN_HEART_DECK: DeckConfig = {
  id: 'open-heart',
  name: 'Open Heart',
  color: Colors.primaryDark,       // Deep Rose #8B3A4A
  colorLight: Colors.primaryFaded, // #F4D5D0
  description: 'Deeper emotional sharing and vulnerability',
  cardCount: 20,
};

/** Get a category config by ID */
export function getCategoryById(id: CardCategory): CategoryConfig | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

/** Get all category IDs */
export function getAllCategoryIds(): CardCategory[] {
  return CATEGORIES.map((c) => c.id);
}
