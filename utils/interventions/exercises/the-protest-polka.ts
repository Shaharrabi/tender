/**
 * The Protest Polka (EFT — Sue Johnson)
 *
 * Based on Sue Johnson's "demon dialogue" concept, this exercise
 * helps couples identify the pursue-withdraw cycle that plays out
 * beneath their conflicts. By mapping the dance together, partners
 * can begin to see the pattern as the enemy — not each other.
 */

import type { Intervention } from '@/types/intervention';

export const protestPolka: Intervention = {
  id: 'protest-polka',
  title: 'The Protest Polka',
  description:
    'Map the "demon dialogue" that shows up in your conflicts — the pursue-withdraw dance where one partner reaches and the other retreats. When you can see the cycle together, you stop blaming each other and start fighting the pattern instead.',
  fieldInsight: 'The reach and the retreat are both asking for the same thing \u2014 connection.',
  category: 'attachment',
  duration: 15,
  difficulty: 'intermediate',
  mode: 'together',
  forStates: ['IN_WINDOW', 'MIXED'],
  forPatterns: [
    'pursue_withdraw',
    'demand_distance',
    'negative_cycle',
  ],
  steps: [
    {
      type: 'instruction',
      title: 'The Demon Dialogue',
      content:
        'Sue Johnson calls the pursue-withdraw cycle a "demon dialogue" — a pattern that takes over when couples feel disconnected. It looks like this:\n\nOne partner protests the disconnection by pursuing — reaching, criticizing, pushing for a response. The other partner manages the overwhelm by withdrawing — shutting down, going quiet, pulling away.\n\nThe pursuer is really saying: "Do I matter to you? Please respond to me."\nThe withdrawer is really saying: "I am afraid of failing you. I shut down to protect us both."\n\nNeither partner is the problem. The cycle is the problem. In this exercise, you will map your cycle together — not to blame, but to understand.',
    },
    {
      type: 'prompt',
      title: 'Identify a Recent Conflict',
      content:
        'Think of a recent argument or moment of disconnection. It does not have to be a big fight — even a small moment of tension will do. Briefly describe what happened.',
      promptPlaceholder: 'A recent conflict was...',
    },
    {
      type: 'scenario_choice',
      title: 'Your Move in the Dance',
      content: 'Which move do you tend to make when the polka starts?',
      interactiveConfig: {
        kind: 'scenario_choice',
        scenario: 'When tension rises, I typically:',
        choices: [
          { id: 'pursue', text: 'Pursue \u2014 I reach harder, push for conversation, criticize', feedback: 'The pursuer\'s protest: "Please see me. Please respond. I\'m scared of losing you."' },
          { id: 'withdraw', text: 'Withdraw \u2014 I go quiet, shut down, leave the room', feedback: 'The withdrawer\'s protection: "I\'m overwhelmed. I shut down to stop making it worse."' },
        ],
        revealAll: false,
      },
    },
    {
      type: 'prompt',
      title: 'Name What You Were Feeling Underneath',
      content:
        'Now go beneath your surface behavior. What were you actually feeling? The pursuer might have felt scared, lonely, or desperate. The withdrawer might have felt overwhelmed, inadequate, or frozen.\n\nTry: "Underneath my [behavior], I was really feeling..."',
      promptPlaceholder: 'Underneath, I was really feeling...',
    },
    {
      type: 'prompt',
      title: 'Name What Your Partner Did',
      content:
        'Now gently describe what your partner did on the surface during this conflict. Try to describe it without blame — as if you are narrating a scene in a movie.\n\nRemember: their behavior was also driven by deeper feelings.',
      promptPlaceholder: 'On the surface, my partner...',
    },
    {
      type: 'prompt',
      title: 'Guess What They Were Feeling',
      content:
        'With compassion, try to imagine what your partner might have been feeling underneath their surface behavior. You do not have to get it exactly right — the attempt to understand matters.\n\nTry: "I wonder if underneath, my partner was feeling..."',
      promptPlaceholder: 'I wonder if my partner was feeling...',
    },
    {
      type: 'sentence_transform',
      title: 'Write Your Cycle Together',
      content: 'Put the whole dance into one loop:',
      interactiveConfig: {
        kind: 'sentence_transform',
        stages: [
          {
            prefix: 'When I',
            placeholder: 'your surface move (pursue, withdraw...)',
            explanation: 'Your automatic protective behavior',
          },
          {
            prefix: 'you feel',
            placeholder: 'your partner\'s deeper emotion...',
            explanation: 'What your move triggers in them underneath',
          },
          {
            prefix: 'so you',
            placeholder: 'their surface move...',
            explanation: 'Their automatic protective response',
          },
          {
            prefix: 'which makes me feel',
            placeholder: 'YOUR deeper emotion...',
            explanation: 'The vulnerable feeling that restarts the loop',
          },
        ],
      },
    },
    {
      type: 'reflection',
      title: 'Reflection',
      content:
        'What is it like to see the cycle laid out this way? Does it change how you feel about the last conflict? What would it look like to catch this pattern the next time it starts?',
      promptPlaceholder: 'Seeing our cycle, I notice...',
    },
  ],
};
