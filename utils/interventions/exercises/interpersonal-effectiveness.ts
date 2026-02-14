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
      type: 'prompt',
      title: 'D — Describe the Situation',
      content:
        'Start with the facts. Describe the situation you want to address without adding judgment, interpretation, or emotion. Stick to what actually happened — what a video camera would have recorded.\n\nFor example: "When I came home last night, you were on your phone and did not look up for several minutes."',
      promptPlaceholder: 'The situation is...',
    },
    {
      type: 'prompt',
      title: 'E — Express Your Feelings',
      content:
        'Now share how you feel about this situation using "I" statements. Own your feelings without blaming your partner.\n\nFor example: "I felt invisible and unimportant in that moment."',
      promptPlaceholder: 'I feel...',
    },
    {
      type: 'prompt',
      title: 'A — Assert What You Need',
      content:
        'Clearly state what you are asking for. Be specific. Do not hint or hope they figure it out. A good assertion is concrete and doable.\n\nFor example: "I would like us to have a moment of connection when one of us comes home — even just a hug or eye contact."',
      promptPlaceholder: 'What I need is...',
    },
    {
      type: 'prompt',
      title: 'R — Reinforce Why It Matters',
      content:
        'Help your partner understand why this matters to you and what the positive outcome would be. Reinforcement connects your request to the health of the relationship.\n\nFor example: "When we greet each other warmly, I feel like we are a team. It sets the tone for the whole evening."',
      promptPlaceholder: 'This matters because...',
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
