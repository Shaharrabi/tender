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
      type: 'prompt',
      title: 'Name What You Did on the Surface',
      content:
        'Each of you, think about your own behavior during that conflict. What did you do on the surface? Did you push for a conversation? Go quiet? Get critical? Walk away? Bring it up again later?\n\nBe honest about your own moves — not your partner\'s.',
      promptPlaceholder: 'On the surface, I...',
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
      type: 'prompt',
      title: 'Write the Cycle Together',
      content:
        'Now put it all together. Try writing out your cycle as a loop:\n\n"When I [your surface behavior], you [their surface behavior]. But really, when I feel [your deeper feeling], I [your move], and when you feel [their deeper feeling], you [their move]. And round and round we go."\n\nThis is your protest polka. Name it. Own it together.',
      promptPlaceholder: 'Our cycle is...',
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
