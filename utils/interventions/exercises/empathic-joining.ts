/**
 * Empathic Joining Around Differences
 *
 * Based on IBCT (Integrative Behavioral Couple Therapy) by
 * Christensen, Jacobson, and colleagues. Empathic joining involves
 * helping partners move from accusation to understanding by
 * focusing on the emotional experience beneath the content of
 * disagreements.
 */

import type { Intervention } from '@/types/intervention';

export const empathicJoining: Intervention = {
  id: 'empathic-joining',
  title: 'Empathic Joining Around Differences',
  description:
    'Practice hearing the emotion beneath your partner\'s words rather than reacting to the content. IBCT research shows that when partners feel genuinely understood — even without agreement — defensive patterns dissolve and intimacy deepens.',
  fieldInsight: 'Stepping into your partner\'s world changes the temperature of the field.',
  category: 'communication',
  duration: 35,
  difficulty: 'advanced',
  mode: 'together',
  forStates: ['IN_WINDOW'],
  forPatterns: [
    'blame_cycles',
    'defensiveness',
    'low_supportive_coping',
  ],
  steps: [
    {
      type: 'instruction',
      title: 'Listening for Emotion, Not Content',
      content:
        'When your partner raises a complaint, your natural instinct is to respond to the content — to argue the facts, defend yourself, or offer a solution. Empathic joining asks you to do something different: listen for the feeling underneath the words. If your partner says "You are never home," the content is about time — but the emotion might be loneliness, fear, or feeling unimportant. When you respond to the emotion, everything changes.',
    },
    {
      type: 'prompt',
      title: 'Share a Pain Point',
      content:
        'One partner begins by sharing something that has been painful or frustrating in the relationship. Keep it to two or three minutes. Speak from your own experience: what has been hard for you, and how it has made you feel.',
      promptPlaceholder: 'Something that has been painful for me is...',
    },
    {
      type: 'prompt',
      title: 'Listen for the Emotion Beneath',
      content:
        'Listening partner: set aside your own perspective for a moment. What emotion do you hear underneath what your partner said? Not the topic, not the accusation — the feeling. Is it sadness? Fear? Loneliness? Feeling unseen?\n\nReflect back the emotion: "It sounds like you are feeling ___ about this. Is that right?"',
      promptPlaceholder: 'The emotion I heard underneath was...',
    },
    {
      type: 'prompt',
      title: 'Validate Without Agreeing',
      content:
        'Validation is not agreement. You can validate your partner\'s emotional experience without conceding your own position. Try:\n\n"I can see why you would feel that way, given how you experienced it."\n"It makes sense that you feel ___ — that sounds really hard."\n\nThe goal is to make your partner feel understood, not to settle who is right.',
      promptPlaceholder: 'My validation was...',
    },
    {
      type: 'prompt',
      title: 'Switch Roles',
      content:
        'Now switch. The other partner shares a pain point, and the first partner practices listening for the emotion, reflecting it back, and validating without agreeing. Take your time with this — empathic joining is a skill, and it gets easier with practice.',
      promptPlaceholder: 'When I was the listener, I noticed...',
    },
    {
      type: 'reflection',
      title: 'Reflect on Being Truly Heard',
      content:
        'How did it feel to have your emotion reflected back accurately? How did it feel to be the one offering that reflection? What was hardest about this exercise? What would change in your relationship if you could do this during real conflicts?',
      promptPlaceholder: 'Being truly heard felt like...',
    },
  ],
};
