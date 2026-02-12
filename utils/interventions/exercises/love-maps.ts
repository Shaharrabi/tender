/**
 * Love Maps: Know Your Partner's World
 *
 * Based on Gottman's Love Maps concept — the cognitive room couples
 * keep for each other's inner psychological world. Research shows
 * that couples who maintain detailed love maps are better equipped
 * to handle conflict and life transitions.
 */

import type { Intervention } from '@/types/intervention';

export const loveMaps: Intervention = {
  id: 'love-maps',
  title: 'Love Maps: Know Your Partner\'s World',
  description:
    'Deepen your knowledge of each other\'s inner world — dreams, worries, joys, and preferences. Gottman\'s research shows that couples who keep updated "love maps" build a foundation of friendship that buffers against conflict.',
  category: 'attachment',
  duration: 20,
  difficulty: 'beginner',
  mode: 'together',
  forStates: ['IN_WINDOW'],
  forPatterns: [
    'low_cohesion',
    'emotional_distance',
    'parallel_lives',
  ],
  steps: [
    {
      type: 'instruction',
      title: 'What Are Love Maps?',
      content:
        'A love map is the part of your brain where you store everything you know about your partner — their fears, hopes, favorite things, stressors, and dreams. Couples with detailed love maps navigate rough patches more easily because they truly know each other. Today, you will update your maps by asking questions you might not usually ask.',
    },
    {
      type: 'prompt',
      title: 'Ask: What\'s on Your Mind Lately?',
      content:
        'Take turns asking each other one question from each category below. Listen fully before responding.\n\n1. "What has been your biggest worry this week?"\n2. "What is something you are looking forward to right now?"\n3. "Is there a dream or goal you have not told me about recently?""\n\nWrite down one thing your partner shared that surprised you.',
      promptPlaceholder: 'Something that surprised me was...',
    },
    {
      type: 'prompt',
      title: 'Go Deeper: Inner World Questions',
      content:
        'Now try these deeper questions. Take your time — there are no wrong answers.\n\n1. "What is your biggest source of stress right now, outside of us?"\n2. "If you could change one thing about your daily life, what would it be?"\n3. "Who has been influencing your thinking lately, and how?"\n\nWrite down what you learned.',
      promptPlaceholder: 'I learned that my partner...',
    },
    {
      type: 'reflection',
      title: 'Reflect on What You Discovered',
      content:
        'How much of what your partner shared did you already know? Were there any answers that caught you off guard? What does this tell you about how connected — or disconnected — you have been feeling lately?',
      promptPlaceholder: 'I realized that...',
    },
    {
      type: 'instruction',
      title: 'Commit to Daily Curiosity',
      content:
        'Love maps fade when we stop asking. Research shows that small daily check-ins — even just "How was your day, really?" with genuine curiosity — keep love maps current. Commit to asking your partner one open-ended question every day this week. Not to fix anything, just to know them a little better today than you did yesterday.',
    },
  ],
};
