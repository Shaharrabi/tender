/**
 * News Reporter Stance (CBT / Gottman)
 *
 * Teaches the skill of describing events factually — like a news
 * reporter on camera — stripping out interpretation, judgment,
 * and emotional coloring. The foundation of non-violent communication
 * and soft startup.
 */

import type { Intervention } from '@/types/intervention';

export const newsReporterStance: Intervention = {
  id: 'news-reporter-stance',
  title: 'The News Reporter Stance',
  description:
    'Learn to describe events the way a news reporter would — facts, timestamps, observable behavior. When you strip interpretation from your complaints, your partner can actually hear you.',
  fieldInsight:
    'When you describe what happened like a reporter, your partner hears facts instead of accusations.',
  category: 'communication',
  duration: 7,
  difficulty: 'beginner',
  mode: 'either',
  forStates: ['IN_WINDOW', 'ACTIVATED'],
  forPatterns: [
    'criticism',
    'mind_reading',
    'emotional_reactivity',
    'harsh_startup',
    'character_attacks',
  ],
  steps: [
    // ─── Step 1: Psychoeducation ────────────────────────
    {
      type: 'instruction',
      title: 'Report, Don\'t Editorialize',
      content:
        'A news reporter describes what happened: who, what, when, where. They don\'t say "The mayor was being selfish today." They say "The mayor voted against the funding bill at 3pm."\n\nIn relationships, most complaints are editorials disguised as reports. "You never listen" is an editorial. "When I was telling you about my day at dinner, you picked up your phone after about a minute" is a report.\n\nReports are disprovable, specific, and non-attacking. Editorials trigger defensiveness. This exercise teaches you to report first, interpret later.',
    },

    // ─── Step 2: Spot the reporter (scenario_choice) ────
    {
      type: 'scenario_choice',
      title: 'Reporter or Editorial?',
      content: 'Which statement is a factual report?',
      interactiveConfig: {
        kind: 'scenario_choice',
        scenario: 'A couple is discussing household tasks:',
        choices: [
          {
            id: 'editorial',
            text: '"You\'re lazy and you don\'t care about this house."',
            feedback:
              'Editorial. "Lazy" is a character judgment. "Don\'t care" is mind-reading. Neither is observable.',
          },
          {
            id: 'report',
            text: '"The dishes from Tuesday and Wednesday are still in the sink."',
            feedback:
              'Report. Specific, time-stamped, observable. Your partner can respond to facts; they can only defend against judgments.',
            isRecommended: true,
          },
        ],
        revealAll: true,
      },
    },

    // ─── Step 3: Recall a complaint (prompt) ────────────
    {
      type: 'prompt',
      title: 'Your Recent Complaint',
      content:
        'Think of a recent complaint you had about your partner. Write it exactly as it came out of your mouth — or as you said it in your head. Don\'t filter it.',
      promptPlaceholder: 'My complaint was...',
    },

    // ─── Step 4: Rewrite as reporter (sentence_transform)
    {
      type: 'sentence_transform',
      title: 'Rewrite Like a Reporter',
      content: 'Now transform that complaint into a factual report:',
      interactiveConfig: {
        kind: 'sentence_transform',
        stages: [
          {
            prefix: 'WHAT happened (observable behavior):',
            placeholder: 'Only what a camera would see or record...',
            explanation: 'No adjectives about character. Just behavior.',
          },
          {
            prefix: 'WHEN it happened:',
            placeholder: '"Tuesday evening" or "during dinner" or "this morning at 8"...',
            explanation: 'Timestamps ground the complaint in reality',
          },
          {
            prefix: 'HOW it affected me (I-statement):',
            placeholder: '"I felt..." — your emotional reaction, owned as yours',
            explanation: 'The feeling is yours; the behavior is theirs. Keep them separate.',
          },
        ],
      },
    },

    // ─── Step 5: Reflection ─────────────────────────────
    {
      type: 'reflection',
      title: 'The Difference',
      content:
        'Read your original complaint and then your reporter version. What changed? Which one would you be more willing to hear if it were directed at you?',
      promptPlaceholder: 'The difference I notice is...',
    },
  ],
};
