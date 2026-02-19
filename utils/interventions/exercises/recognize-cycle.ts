/**
 * Recognizing Your Negative Cycle
 *
 * Based on Emotionally Focused Therapy (EFT) by Sue Johnson.
 * The core insight of EFT is that couples get trapped in
 * self-reinforcing negative cycles — patterns of interaction
 * that are the real enemy, not either partner. Naming the cycle
 * is the first step to de-escalating it.
 */

import type { Intervention } from '@/types/intervention';

export const recognizeCycle: Intervention = {
  id: 'recognize-cycle',
  title: 'Recognizing Your Negative Cycle',
  description:
    'Map the repeating pattern that traps you both during conflict. EFT research shows that when couples can see the cycle as the enemy — rather than each other — they break free from blame and begin to reconnect.',
  fieldInsight: 'The pattern between you is not either person\'s fault \u2014 it is the dance itself.',
  category: 'attachment',
  duration: 30,
  difficulty: 'intermediate',
  mode: 'together',
  forStates: ['IN_WINDOW'],
  forPatterns: [
    'pursue_withdraw',
    'demand_distance',
    'negative_cycle',
    'reactive_patterns',
  ],
  steps: [
    {
      type: 'instruction',
      title: 'The Cycle Is the Enemy',
      content:
        'In Emotionally Focused Therapy, the most important shift couples make is seeing their negative pattern — not their partner — as the problem. Most couples get stuck in a cycle: one partner does something, the other reacts, which triggers the first to react further, and around it goes. Common patterns include pursue-withdraw, attack-attack, or freeze-freeze. The cycle feeds itself, and both partners end up feeling alone and misunderstood. Today, you will map your cycle together.',
    },
    {
      type: 'prompt',
      title: 'Map a Recent Argument',
      content:
        'Think of a recent argument or tense moment. Together, try to trace the sequence of moves. Who did what first? How did the other respond? Then what happened? Try to be descriptive, not blaming — like a play-by-play announcer describing a game, not a judge assigning fault.',
      promptPlaceholder: 'The sequence went something like this...',
    },
    {
      type: 'scenario_choice',
      title: 'Identify Your Move',
      content: 'When the cycle starts, which move do you tend to make?',
      interactiveConfig: {
        kind: 'scenario_choice',
        scenario: 'When tension rises between us, my go-to move is:',
        choices: [
          { id: 'pursue', text: 'Pursue \u2014 reaching, criticizing, demanding a response', feedback: 'Pursuers are protesting disconnection. Underneath is usually fear: "Do I matter to you? Please respond to me."' },
          { id: 'withdraw', text: 'Withdraw \u2014 going quiet, shutting down, leaving', feedback: 'Withdrawers are managing overwhelm. Underneath is usually fear: "I\'m afraid of failing you. I shut down to protect us."' },
          { id: 'attack', text: 'Attack \u2014 defending sharply, counter-criticizing', feedback: 'Attackers are protecting against vulnerability. Underneath is usually pain that feels too raw to show.' },
          { id: 'freeze', text: 'Freeze \u2014 going numb, feeling paralyzed', feedback: 'Freezing is the nervous system\'s "shutdown" response. It\'s not a choice \u2014 it\'s your body saying the threat is too much.' },
        ],
        revealAll: false,
      },
    },
    {
      type: 'prompt',
      title: 'What Are You Really Feeling Underneath?',
      content:
        'The moves we make in a cycle are surface behaviors driven by deeper emotions. The pursuer often feels scared of losing connection. The withdrawer often feels overwhelmed or inadequate. What is the feeling underneath your move?\n\nTry completing: "When I [your move], I am really feeling ___. What I really need is ___."\n\nShare this with your partner.',
      promptPlaceholder: 'Underneath my move, I am really feeling...',
    },
    {
      type: 'prompt',
      title: 'Name the Cycle Together',
      content:
        'Now put it together into one sentence that captures the whole cycle as something that happens to both of you:\n\n"When I ___, you feel ___, so you ___, which makes me feel ___, so I ___, and around we go."\n\nGive the cycle a name — something slightly humorous or descriptive that you both agree on. Naming it externalizes it: it becomes "the thing that happens to us" rather than "what you do to me."',
      promptPlaceholder: 'Our cycle is: When I... you... so you... and I... We are calling it...',
    },
    {
      type: 'reflection',
      title: 'See the Cycle as External',
      content:
        'Imagine the cycle as something outside both of you — like a storm that sweeps you both up. You are both caught in it; neither of you created it on purpose. How does it feel to see the pattern this way instead of blaming each other? What might change if, next time you notice the cycle starting, one of you said: "I think our [cycle name] is happening again"?',
      promptPlaceholder: 'Seeing the cycle as external makes me feel...',
    },
  ],
};
