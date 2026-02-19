/**
 * DEAR MAN (DBT Interpersonal Effectiveness)
 *
 * The DEAR MAN skill from DBT helps individuals ask for what
 * they need — or say no to what they do not want — while
 * maintaining the relationship and their self-respect. Each
 * letter is a step in effective communication.
 */

import type { Intervention } from '@/types/intervention';

export const dearMan: Intervention = {
  id: 'dear-man',
  title: 'DEAR MAN',
  description:
    'A structured DBT skill for asking for what you need or setting a boundary — clearly, kindly, and effectively. DEAR MAN walks you through each step of assertive communication so you can be heard without damaging the relationship.',
  fieldInsight: 'Asking clearly for what you need is an act of trust in the space between you.',
  category: 'communication',
  duration: 10,
  difficulty: 'intermediate',
  mode: 'either',
  forStates: ['IN_WINDOW', 'MIXED'],
  forPatterns: [
    'conflict_avoidance',
    'boundary_difficulty',
    'people_pleasing',
  ],
  steps: [
    {
      type: 'instruction',
      title: 'The DEAR MAN Framework',
      content:
        'DEAR MAN is one of the most practical communication skills in DBT. It gives you a step-by-step way to express a need or set a boundary while keeping the relationship intact.\n\nHere is what each letter stands for:\n\nD — Describe the situation (facts only)\nE — Express how you feel about it\nA — Assert what you need\nR — Reinforce why it matters\n\nM — stay Mindful (stay on topic)\nA — Appear confident (even if you are nervous)\nN — Negotiate (be willing to find a middle ground)\n\nWe will walk through each step together. Think of a specific situation where you need to express something to your partner.',
    },
    {
      type: 'sentence_transform',
      title: 'Build Your DEAR Statement',
      content: 'Walk through each letter to construct your message:',
      interactiveConfig: {
        kind: 'sentence_transform',
        stages: [
          {
            prefix: 'D \u2014 Describe (facts only):',
            placeholder: '"When I came home, you were on your phone for 20 minutes..."',
            explanation: 'What a camera would record \u2014 no judgment, no mind-reading',
          },
          {
            prefix: 'E \u2014 Express (your feelings):',
            placeholder: '"I felt invisible and unimportant..."',
            explanation: 'Own your emotion with "I feel\u2026" \u2014 no blame',
          },
          {
            prefix: 'A \u2014 Assert (what you need):',
            placeholder: '"I would like a moment of connection when I get home..."',
            explanation: 'Specific and doable \u2014 don\'t hint, ask clearly',
          },
          {
            prefix: 'R \u2014 Reinforce (why it matters):',
            placeholder: '"When we greet each other warmly, I feel like we\'re a team..."',
            explanation: 'Connect your request to the relationship\'s health',
          },
        ],
      },
    },
    {
      type: 'prompt',
      title: 'M — Stay Mindful',
      content:
        'When you actually deliver this message, it will be important to stay focused. Your partner may get defensive, change the subject, or bring up something else. Your job is to gently return to your point without getting sidetracked.\n\nWhat distractions or deflections might come up, and how will you stay on topic?',
      promptPlaceholder: 'To stay mindful, I will...',
    },
    {
      type: 'prompt',
      title: 'A — Appear Confident',
      content:
        'Even if you feel nervous, you can choose to appear confident. This means making eye contact, speaking in a steady voice, and avoiding excessive apologizing.\n\nConfidence is not aggression — it is the quiet belief that your needs are valid. What will help you show up with confidence?',
      promptPlaceholder: 'To appear confident, I will...',
    },
    {
      type: 'prompt',
      title: 'N — Negotiate',
      content:
        'Be willing to find a middle ground. Effective communication is not about winning — it is about being heard and finding a solution that honors both people.\n\nWhat alternatives or compromises would you be open to?',
      promptPlaceholder: 'I would be willing to...',
    },
    {
      type: 'reflection',
      title: 'Reflection',
      content:
        'You have just walked through a complete DEAR MAN script. How does it feel to have your request laid out clearly? Is there a part of this that feels challenging? When might you use this with your partner?',
      promptPlaceholder: 'What I notice about this process is...',
    },
  ],
};
