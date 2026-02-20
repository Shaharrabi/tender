/**
 * Soft Startup Practice
 *
 * Based on Gottman's research on how the first three minutes
 * of a conversation predict its outcome. Practices reframing
 * complaints into gentle, non-blaming requests.
 *
 * Enhanced with scenario choices and card flips for a richer,
 * more gamified experience — "texting practice" style.
 */

import type { Intervention } from '@/types/intervention';

export const softStartup: Intervention = {
  id: 'soft-startup',
  title: 'Soft Startup',
  description:
    'Practice the Gottman method of raising concerns gently. Transform complaints into connection by leading with feelings and needs instead of blame.',
  fieldInsight: 'How you begin shapes everything that follows in the space between you.',
  category: 'communication',
  duration: 8,
  difficulty: 'intermediate',
  mode: 'together',
  forStates: ['IN_WINDOW', 'ACTIVATED'],
  forPatterns: [
    'harsh_startup',
    'criticism',
    'blame_pattern',
    'demand_withdraw',
    'conflict_avoidance',
  ],
  steps: [
    // 1. Instruction
    {
      type: 'instruction',
      title: 'What Is a Soft Startup?',
      content:
        'Research shows that conversations end the way they begin 96% of the time. A soft startup means raising a concern without criticism or blame. Instead of "You never..." or "You always...", you lead with your own feelings and a specific, positive need.\n\nThis practice will walk you through recognizing the difference, then building your own soft startup.',
    },

    // 2. Card Flip: Harsh vs. Soft — learn the contrast
    {
      type: 'card_flip',
      title: 'Harsh vs. Soft',
      content:
        'Flip each card to see a harsh startup transformed into a soft one. Notice what changes \u2014 and how it feels different to read.',
      interactiveConfig: {
        kind: 'card_flip',
        mode: 'flip',
        cards: [
          {
            id: 'pair-1',
            front: '"You never listen to me. You are always on your phone."',
            back: '"I feel lonely when we are together but not really connecting. I need some phone-free time with you."',
          },
          {
            id: 'pair-2',
            front: '"You are so lazy. The house is always a mess."',
            back: '"I feel overwhelmed when the house is cluttered. Could we tackle the dishes together after dinner?"',
          },
          {
            id: 'pair-3',
            front: '"You do not care about my feelings at all."',
            back: '"I feel hurt when I share something important and do not get a response. I need to know you heard me."',
          },
          {
            id: 'pair-4',
            front: '"Why do you always have to start a fight?"',
            back: '"I feel anxious when our conversations escalate. Can we agree to pause if things get heated?"',
          },
        ],
      },
    },

    // 3. Scenario Choice: Practice recognizing soft startups
    {
      type: 'scenario_choice',
      title: 'Spot the Soft Startup',
      content:
        'Your partner forgot to call you during their lunch break like they said they would. Which response is a soft startup?',
      interactiveConfig: {
        kind: 'scenario_choice',
        scenario: 'Your partner forgot to call during lunch. You feel hurt. How do you bring it up?',
        choices: [
          {
            id: 'harsh-1',
            text: '"You always break your promises. I cannot count on you for anything."',
            feedback: 'This is a harsh startup \u2014 it uses "always" and attacks character ("I cannot count on you"). This will trigger defensiveness, not connection.',
          },
          {
            id: 'soft-1',
            text: '"I felt disappointed when I did not hear from you at lunch. Those calls matter to me."',
            feedback: 'This is a soft startup. It names a specific feeling ("disappointed"), describes the situation without blame, and states why it matters. Well done.',
            isRecommended: true,
          },
          {
            id: 'passive',
            text: '"It is fine. I did not really expect you to call anyway."',
            feedback: 'This is passive withdrawal \u2014 it hides the real feeling behind sarcasm. Your partner cannot respond to a need they do not know exists.',
          },
        ],
      },
    },

    // 4. Prompt: Identify your complaint
    {
      type: 'prompt',
      title: 'Identify Your Complaint',
      content:
        'Think of something that has been bothering you in your relationship. Write it down as it naturally comes out \u2014 raw, unfiltered. We will reshape it in the next step.\n\nBe honest. No one is reading this but you.',
      promptPlaceholder: 'What has been bothering me is...',
    },

    // 5. Sentence Transform: Reframe
    {
      type: 'sentence_transform',
      title: 'Reframe with "I Feel\u2026When\u2026I Need\u2026"',
      content: 'Now transform your complaint into a soft startup:',
      interactiveConfig: {
        kind: 'sentence_transform',
        stages: [
          {
            prefix: 'I feel',
            placeholder: 'name one emotion (lonely, frustrated, hurt...)',
            explanation: 'Lead with YOUR feeling, not their behavior',
          },
          {
            prefix: 'when',
            placeholder: 'describe the specific situation...',
            explanation: 'Observable behavior, not character judgment',
          },
          {
            prefix: 'I need',
            placeholder: 'a positive, specific request...',
            explanation: 'What you want TO happen, not what you want to stop',
          },
        ],
      },
    },

    // 6. Scenario Choice: Practice delivery
    {
      type: 'scenario_choice',
      title: 'Choose Your Moment',
      content:
        'Timing matters as much as words. When is the best time to share your soft startup?',
      interactiveConfig: {
        kind: 'scenario_choice',
        scenario: 'You have your soft startup ready. When do you deliver it?',
        choices: [
          {
            id: 'right-away',
            text: 'Right after the thing happens, while I am still upset',
            feedback: 'Speaking in the heat of the moment often means your alarm system is driving. Wait until you have processed the first wave of emotion.',
          },
          {
            id: 'calm-moment',
            text: 'During a calm moment when we are both regulated',
            feedback: 'This is ideal. Gottman calls this the "softened startup window" \u2014 when both nervous systems are calm enough to hear each other.',
            isRecommended: true,
          },
          {
            id: 'never',
            text: 'I probably will not bring it up at all',
            feedback: 'Avoiding the conversation feels safer, but unspoken needs build resentment over time. A soft startup is your bridge between silence and conflict.',
          },
        ],
      },
    },

    // 7. Instruction: Practice saying it
    {
      type: 'instruction',
      title: 'Practice Saying It',
      content:
        'Read your reframed statement aloud \u2014 even quietly to yourself. Notice how it feels in your body compared to the original complaint.\n\nSaying it out loud activates different neural pathways than just thinking it. Pay attention to your tone: aim for warmth, not accusation.\n\nIf your partner is with you, try saying it to them now. If you are alone, say it to the mirror or into your phone.',
    },

    // 8. Reflection
    {
      type: 'reflection',
      title: 'Reflection',
      content:
        'What shifted when you moved from complaint to request? Did the emotional charge change? Could you imagine saying this to your partner? What might make it easier to start soft next time?',
      promptPlaceholder: 'I noticed that...',
    },
  ],
};
