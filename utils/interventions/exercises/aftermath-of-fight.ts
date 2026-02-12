/**
 * Processing a Regrettable Incident
 *
 * Based on Gottman's "Aftermath of a Fight" processing method.
 * Research shows that couples who process fights after they happen —
 * without trying to resolve the original issue — develop stronger
 * repair skills and reduce lingering resentment.
 */

import type { Intervention } from '@/types/intervention';

export const aftermathOfFight: Intervention = {
  id: 'aftermath-of-fight',
  title: 'Processing a Regrettable Incident',
  description:
    'Process a recent argument or painful interaction using Gottman\'s structured approach. This is not about resolving the issue — it is about understanding each other\'s subjective experience so resentment does not build.',
  category: 'communication',
  duration: 35,
  difficulty: 'intermediate',
  mode: 'together',
  forStates: ['IN_WINDOW'],
  forPatterns: [
    'unprocessed_conflict',
    'lingering_resentment',
    'poor_repair',
  ],
  steps: [
    {
      type: 'instruction',
      title: 'How to Process — Not Re-Fight',
      content:
        'This exercise is about understanding, not winning. You are going to revisit a recent regrettable incident — an argument, a hurtful moment, a misunderstanding — but with a critical difference: each person describes only their own subjective experience. There is no objective truth about what happened; there are two valid realities. The rules: no blaming, no telling your partner what they did wrong, no interrupting. Only "I felt..." and "My experience was..."',
    },
    {
      type: 'prompt',
      title: 'Describe Your Subjective Reality',
      content:
        'One partner goes first. Describe what happened from your perspective using "I" statements only. What did you feel during the incident? What were you reacting to? What story were you telling yourself in the moment? Stick to your own experience.\n\nPartner: listen without correcting. You will have your turn next.',
      promptPlaceholder: 'During that incident, my experience was...',
    },
    {
      type: 'prompt',
      title: 'Validate Each Other\'s Experience',
      content:
        'After both partners have shared, take turns validating. Validation does not mean agreement — it means acknowledging that your partner\'s experience makes sense given their perspective. Try: "It makes sense that you felt ___ because from your point of view, ___."\n\nWrite down what it felt like to be validated (or what was hard about validating).',
      promptPlaceholder: 'When my partner validated me, I felt...',
    },
    {
      type: 'prompt',
      title: 'Identify Triggers',
      content:
        'Often our reactions in a fight are amplified by past experiences — from childhood, past relationships, or earlier moments in this relationship. What got triggered in you during this incident? Is there an older wound or sensitivity that made this feel bigger than the surface issue?',
      promptPlaceholder: 'I think I was triggered because...',
    },
    {
      type: 'prompt',
      title: 'Acknowledge Responsibility',
      content:
        'Without being forced or performative, each partner identifies one thing — however small — that they can take responsibility for. Maybe you raised your voice, checked out, used a harsh word, or failed to listen. Owning even a small piece lowers defensiveness and opens the door to repair.',
      promptPlaceholder: 'One thing I can take responsibility for is...',
    },
    {
      type: 'reflection',
      title: 'Plan One Repair Action',
      content:
        'What is one concrete thing you can each do to repair the connection after this incident? It could be a gesture, a conversation, a change in behavior, or simply a commitment to check in more often. The goal is not a grand gesture but a real step toward reconnection.',
      promptPlaceholder: 'One repair action I will take is...',
    },
  ],
};
