/**
 * Profile Preference Sections
 *
 * "Not dealbreakers — just the shape of your days."
 * Three sections: The Practical Things, The Life Shape, The Deeper Stuff
 */

import { CompassIcon, SeedlingIcon, SparkleIcon } from '@/assets/graphics/icons';
import type { PreferenceSection } from '@/types/dating';

export const PREFERENCE_SECTIONS: PreferenceSection[] = [
  {
    id: 'basics',
    title: 'The Practical Things',
    subtitle: 'Because bodies exist in the real world',
    icon: 'compass',
    Icon: CompassIcon,
    fields: [
      {
        id: 'gender_identity',
        label: 'I am',
        type: 'multi',
        options: [
          'Woman', 'Man', 'Non-binary', 'Genderqueer',
          'Trans woman', 'Trans man', 'Two-spirit',
          'Rather not say', 'Something else',
        ],
      },
      {
        id: 'looking_for',
        label: "I'm drawn to",
        type: 'multi',
        options: [
          'Women', 'Men', 'Non-binary people',
          'All genders', 'Still figuring this out',
        ],
      },
      {
        id: 'age_range',
        label: 'Age feels right between',
        type: 'range',
        min: 18,
        max: 80,
      },
      {
        id: 'location_radius',
        label: 'How far is close enough?',
        type: 'single',
        options: [
          'Same neighborhood', 'Same city',
          'Within an hour', 'Anywhere — connection matters more',
        ],
      },
    ],
  },
  {
    id: 'lifestyle',
    title: 'The Life Shape',
    subtitle: 'Not dealbreakers — just the shape of your days',
    icon: 'seedling',
    Icon: SeedlingIcon,
    fields: [
      {
        id: 'kids',
        label: 'Kids',
        type: 'single',
        options: [
          'Have them, love them', 'Want them someday',
          "Don't want them", 'Open to it', "It's complicated",
        ],
      },
      {
        id: 'smoking',
        label: 'Smoking',
        type: 'single',
        options: [
          'Never', 'Socially', 'Trying to quit',
          'Yes', 'Just cannabis', 'Not a factor for me',
        ],
      },
      {
        id: 'drinking',
        label: 'Drinking',
        type: 'single',
        options: [
          'Not at all', 'Rarely', 'Socially',
          'Regularly', 'Sober / in recovery',
        ],
      },
      {
        id: 'relationship_style',
        label: 'Relationship shape',
        type: 'single',
        options: [
          'Monogamous', 'Ethically non-monogamous',
          'Polyamorous', 'Exploring what works', 'Relationship anarchist',
        ],
      },
    ],
  },
  {
    id: 'depth',
    title: 'The Deeper Stuff',
    subtitle: 'What your nervous system cares about',
    icon: 'sparkle',
    Icon: SparkleIcon,
    fields: [
      {
        id: 'therapy',
        label: 'Therapy / inner work',
        type: 'single',
        options: [
          'Currently in therapy', 'Have been, value it',
          'Curious about it', 'Not for me', 'Prefer not to say',
        ],
      },
      {
        id: 'spirituality',
        label: 'Spiritual life',
        type: 'single',
        options: [
          'Religious and practicing', 'Spiritual but not religious',
          'Meditation / mindfulness', 'Agnostic / atheist',
          "It's private", 'Still exploring',
        ],
      },
      {
        id: 'conflict_style',
        label: 'When we disagree, I tend to...',
        type: 'single',
        options: [
          'Want to talk it out immediately',
          'Need space first, then talk',
          'Avoid it and hope it passes',
          'Get loud, then regret it',
          'Shut down — working on it',
        ],
      },
      {
        id: 'love_language',
        label: 'I feel most loved through',
        type: 'multi',
        options: [
          'Words — tell me', 'Touch — hold me',
          'Time — be with me', 'Acts — show me',
          'Gifts — think of me',
        ],
      },
    ],
  },
];
