/**
 * Turning Toward Exercise
 *
 * Based on Gottman's research on emotional bids — the small
 * moments of reaching out that build or erode connection
 * over time.
 */

import type { Intervention } from '@/types/intervention';

export const emotionalBid: Intervention = {
  id: 'emotional-bid',
  title: 'Turning Toward',
  description:
    'Explore the small moments that build connection. Learn to recognize emotional bids — yours and your partner\'s — and practice turning toward them.',
  fieldInsight: 'Every bid \u2014 even the clumsy ones \u2014 is a hand reaching across the space between you.',
  category: 'attachment',
  duration: 5,
  difficulty: 'beginner',
  mode: 'together',
  forStates: ['IN_WINDOW', 'MIXED'],
  forPatterns: [
    'emotional_distance',
    'turning_away',
    'turning_against',
    'bid_rejection',
    'relationship_drift',
  ],
  steps: [
    {
      type: 'instruction',
      title: 'About Emotional Bids',
      content:
        'An emotional bid is any attempt to connect — a look, a question, a sigh, a touch, a joke, a complaint. Research shows that couples who stay together turn toward each other\'s bids about 86% of the time. Couples who separate turn toward only about 33% of the time. It is not the grand gestures that build love. It is these small, everyday moments.',
    },
    {
      type: 'scenario_choice',
      title: 'Recognize the Response',
      content: 'Your partner sighs loudly while reading an email. What do you do?',
      interactiveConfig: {
        kind: 'scenario_choice',
        scenario: 'Your partner sighs loudly while reading an email on the couch.',
        choices: [
          { id: 'toward', text: '"Everything okay? That was a big sigh."', feedback: 'Turning toward. You noticed the bid and engaged. Your partner feels seen.', isRecommended: true },
          { id: 'away', text: 'You don\'t look up from your phone.', feedback: 'Turning away. The bid was missed. Over time, missed bids accumulate into emotional distance.' },
          { id: 'against', text: '"Can you be quieter? I\'m trying to focus."', feedback: 'Turning against. The bid was met with irritation. This erodes trust quickly.' },
        ],
        revealAll: true,
      },
    },
    {
      type: 'prompt',
      title: 'Recall a Recent Bid',
      content:
        'Think of a recent emotional bid — either one you made to your partner or one your partner made to you. It could be as simple as "Look at this" or "How was your day?" or a sigh across the room. Describe what happened.',
      promptPlaceholder: 'A recent bid I remember is...',
    },
    {
      type: 'prompt',
      title: 'How Was It Received?',
      content:
        'How was the bid received? There are three possible responses:\n\n- Turning toward: engaging, responding warmly\n- Turning away: ignoring, not noticing\n- Turning against: responding with irritation or dismissal\n\nWhich one happened? How did it feel?',
      promptPlaceholder: 'The response was...',
    },
    {
      type: 'prompt',
      title: 'Plan to Turn Toward',
      content:
        'Think about the next 24 hours. What is one emotional bid you can watch for from your partner? Or what is one small bid you could make? Plan a specific moment where you will consciously turn toward connection.',
      promptPlaceholder: 'My plan to turn toward is...',
    },
    {
      type: 'reflection',
      title: 'Reflection',
      content:
        'What did this exercise bring up for you? Are there patterns in how bids are made and received in your relationship? What would it look like to increase the moments of turning toward?',
      promptPlaceholder: 'What I am noticing about our bids is...',
    },
  ],
};
