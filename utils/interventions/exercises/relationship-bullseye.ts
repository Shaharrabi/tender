/**
 * Relationship Bullseye (ACT Values Assessment)
 *
 * Partners rate how close their daily behavior is to their
 * relationship values using slider scales. Based on the ACT
 * Bull's Eye Values Survey adapted for couples.
 */

import type { Intervention } from '@/types/intervention';

export const relationshipBullseye: Intervention = {
  id: 'relationship-bullseye',
  title: 'The Relationship Bullseye',
  description:
    'Rate how close your daily behavior is to what matters most in your relationship. Are you hitting the bullseye on playfulness, support, and intimacy — or are you far from the mark? No judgment, just honest calibration.',
  fieldInsight:
    'Knowing the gap between your values and your actions is where all growth starts.',
  category: 'values',
  duration: 10,
  difficulty: 'intermediate',
  mode: 'together',
  forStates: ['IN_WINDOW'],
  forPatterns: [
    'values_gap',
    'relationship_drift',
    'low_engagement',
    'meaning_making',
  ],
  steps: [
    // ─── Step 1: Context ────────────────────────────────
    {
      type: 'instruction',
      title: 'The Bullseye',
      content:
        'Imagine a target. The center — the bullseye — represents living fully in alignment with your relationship values. The outer rings represent being further from what matters.\n\nYou\'re about to rate three core relationship dimensions. There are no "right" answers. The point is honest self-assessment so you know where to aim your energy.\n\nDo this separately first, then share with each other.',
    },

    // ─── Step 2: Playfulness slider ─────────────────────
    {
      type: 'scale_slider',
      title: 'Playfulness & Joy',
      content:
        'How close are your daily actions to the playfulness and joy you want in this relationship?',
      interactiveConfig: {
        kind: 'scale_slider',
        labels: {
          low: 'Far from it',
          mid: 'Getting there',
          high: 'Living it',
        },
        zones: [
          {
            range: [0, 33],
            label: 'Far from the mark',
            content: 'Play, laughter, and lightness have faded. This is often the first thing to go under stress — and the first thing to restore.',
          },
          {
            range: [34, 66],
            label: 'On the way',
            content: 'There are moments of joy, but they\'re not consistent. What would bring more play into your week?',
          },
          {
            range: [67, 100],
            label: 'Hitting the bullseye',
            content: 'You\'re making room for fun and lightness. This is the foundation — protect it.',
          },
        ],
        initialValue: 50,
      },
    },

    // ─── Step 3: Support slider ─────────────────────────
    {
      type: 'scale_slider',
      title: 'Support & Reliability',
      content:
        'How close are your daily actions to being the supportive, reliable partner you want to be?',
      interactiveConfig: {
        kind: 'scale_slider',
        labels: {
          low: 'Far from it',
          mid: 'Getting there',
          high: 'Living it',
        },
        zones: [
          {
            range: [0, 33],
            label: 'Far from the mark',
            content: 'Your partner may not feel they can count on you — or you may not feel counted on. This erodes trust slowly.',
          },
          {
            range: [34, 66],
            label: 'On the way',
            content: 'Support is present but inconsistent. What would make your partner say "I know I can count on them"?',
          },
          {
            range: [67, 100],
            label: 'Hitting the bullseye',
            content: 'You show up reliably. This builds the secure base that allows both partners to grow.',
          },
        ],
        initialValue: 50,
      },
    },

    // ─── Step 4: Intimacy slider ────────────────────────
    {
      type: 'scale_slider',
      title: 'Intimacy & Closeness',
      content:
        'How close are your daily actions to the emotional and physical intimacy you value?',
      interactiveConfig: {
        kind: 'scale_slider',
        labels: {
          low: 'Far from it',
          mid: 'Getting there',
          high: 'Living it',
        },
        zones: [
          {
            range: [0, 33],
            label: 'Far from the mark',
            content: 'Emotional or physical distance has grown. Intimacy requires vulnerability — is something blocking that?',
          },
          {
            range: [34, 66],
            label: 'On the way',
            content: 'Connection happens but you want more depth. Small increases in vulnerability create large increases in closeness.',
          },
          {
            range: [67, 100],
            label: 'Hitting the bullseye',
            content: 'You\'re creating the closeness you want. This is where relationships thrive — keep nurturing it.',
          },
        ],
        initialValue: 50,
      },
    },

    // ─── Step 5: Share and discuss ──────────────────────
    {
      type: 'prompt',
      title: 'Share Your Scores',
      content:
        'Show your partner your three ratings. Where did you land? Where are the biggest gaps between your values and your actions?\n\nDiscuss: do you agree with each other\'s self-assessments? Are there areas where your partner is being too hard on themselves — or too generous?',
      promptPlaceholder: 'The biggest gap for me is in...',
    },

    // ─── Step 6: Reflection ─────────────────────────────
    {
      type: 'reflection',
      title: 'One Step Closer',
      content:
        'Pick the dimension with the biggest gap. What is ONE specific action you could take this week to move 10 points closer to the bullseye?',
      promptPlaceholder: 'To move closer, this week I will...',
    },
  ],
};
