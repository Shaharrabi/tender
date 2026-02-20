/**
 * DEAR MAN (DBT Interpersonal Effectiveness)
 *
 * The DEAR MAN skill from DBT helps individuals ask for what
 * they need — or say no to what they do not want — while
 * maintaining the relationship and their self-respect.
 *
 * Enhanced with scenario choices, card flips, and scale slider
 * for a richer, more gamified experience.
 */

import type { Intervention } from '@/types/intervention';

export const dearMan: Intervention = {
  id: 'dear-man',
  title: 'DEAR MAN',
  description:
    'A structured DBT skill for asking for what you need or setting a boundary \u2014 clearly, kindly, and effectively. DEAR MAN walks you through each step of assertive communication so you can be heard without damaging the relationship.',
  fieldInsight: 'Asking clearly for what you need is an act of trust in the space between you.',
  category: 'communication',
  duration: 12,
  difficulty: 'intermediate',
  mode: 'either',
  forStates: ['IN_WINDOW', 'MIXED'],
  forPatterns: [
    'conflict_avoidance',
    'boundary_difficulty',
    'people_pleasing',
  ],
  steps: [
    // 1. Instruction: The Framework
    {
      type: 'instruction',
      title: 'The DEAR MAN Framework',
      content:
        'DEAR MAN is one of the most practical communication skills in DBT. It gives you a step-by-step way to express a need or set a boundary while keeping the relationship intact.\n\nD \u2014 Describe the situation (facts only)\nE \u2014 Express how you feel about it\nA \u2014 Assert what you need\nR \u2014 Reinforce why it matters\n\nM \u2014 stay Mindful (stay on topic)\nA \u2014 Appear confident\nN \u2014 Negotiate (be willing to find middle ground)\n\nThink of a specific situation where you need to express something to your partner.',
    },

    // 2. Card Flip: Learn each letter with examples
    {
      type: 'card_flip',
      title: 'DEAR in Action',
      content:
        'Flip each card to see the DEAR letters come alive with real examples. This will warm you up before you write your own.',
      interactiveConfig: {
        kind: 'card_flip',
        mode: 'flip',
        cards: [
          {
            id: 'D',
            front: 'D \u2014 Describe',
            back: '"When I came home yesterday and you were on your phone during dinner..." \u2014 Just the facts. What a camera would record. No interpretation.',
          },
          {
            id: 'E',
            front: 'E \u2014 Express',
            back: '"I felt invisible and hurt..." \u2014 Own the emotion. Say "I feel" not "You make me feel." The emotion is yours.',
          },
          {
            id: 'A',
            front: 'A \u2014 Assert',
            back: '"I would like us to have phone-free dinners..." \u2014 Specific and doable. Do not hint. Ask clearly for what you need.',
          },
          {
            id: 'R',
            front: 'R \u2014 Reinforce',
            back: '"When we connect over dinner, I feel like we are a team and I can handle anything..." \u2014 Connect your request to something that matters to both of you.',
          },
        ],
      },
    },

    // 3. Scenario Choice: Recognizing good vs. bad "D"
    {
      type: 'scenario_choice',
      title: 'Practice: Describe Without Judging',
      content:
        'Your partner has been coming home late from work three nights this week without letting you know. Which "Describe" statement is most effective?',
      interactiveConfig: {
        kind: 'scenario_choice',
        scenario: 'Your partner came home late three times this week without texting.',
        choices: [
          {
            id: 'judgy',
            text: '"You clearly do not care about our time together."',
            feedback: 'This is a judgment, not a description. It tells your partner what they think and feel, which triggers defensiveness. Stick to observable facts.',
          },
          {
            id: 'factual',
            text: '"Three times this week you came home after 8pm without texting me."',
            feedback: 'Clean and factual. This describes what happened without adding interpretation. Your partner can hear this without feeling attacked.',
            isRecommended: true,
          },
          {
            id: 'vague',
            text: '"You are always late and never communicate."',
            feedback: '"Always" and "never" are rarely true and feel like attacks. They trigger the other person to argue about the word rather than hear your point.',
          },
        ],
      },
    },

    // 4. Sentence Transform: Build your DEAR statement
    {
      type: 'sentence_transform',
      title: 'Build Your DEAR Statement',
      content: 'Now walk through each letter with your own situation:',
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

    // 5. Scale Slider: Confidence check
    {
      type: 'scale_slider',
      title: 'A \u2014 Appear Confident',
      content:
        'Even if you feel nervous, you can choose to appear confident. Confidence is not aggression \u2014 it is the quiet belief that your needs are valid.\n\nHow confident do you feel about delivering your DEAR statement?',
      interactiveConfig: {
        kind: 'scale_slider',
        labels: {
          low: 'Very nervous',
          mid: 'Somewhat steady',
          high: 'Grounded and ready',
        },
        zones: [
          {
            range: [0, 33],
            label: 'Nervous',
            content: 'That is completely normal. Asking for what you need can feel terrifying, especially if you learned to stay quiet. Try practicing in front of a mirror first. Your body learns courage through repetition.',
          },
          {
            range: [34, 66],
            label: 'Building',
            content: 'You are getting there. Remember: you do not need to feel confident to act confident. Steady voice, eye contact, and no excessive apologizing. The feeling follows the action.',
          },
          {
            range: [67, 100],
            label: 'Ready',
            content: 'You know your needs are valid. That groundedness will come through in your voice and body language. Trust yourself.',
          },
        ],
      },
    },

    // 6. Prompt: M — Stay Mindful
    {
      type: 'prompt',
      title: 'M \u2014 Stay Mindful',
      content:
        'When you deliver this, your partner may get defensive, change the subject, or bring up something else. Your job is to gently return to your point without getting sidetracked.\n\nWhat distractions or deflections might come up, and how will you stay on topic?',
      promptPlaceholder: 'To stay mindful, I will...',
    },

    // 7. Scenario Choice: Negotiation practice
    {
      type: 'scenario_choice',
      title: 'N \u2014 Negotiate',
      content:
        'Your partner hears your request but says "I cannot do that every night \u2014 sometimes I am just too tired." What is the most effective response?',
      interactiveConfig: {
        kind: 'scenario_choice',
        scenario: 'Your partner pushes back on your request. How do you negotiate?',
        choices: [
          {
            id: 'rigid',
            text: '"This is what I need and that is that."',
            feedback: 'Rigidity kills negotiation. Holding your ground does not mean refusing to flex. Relationships need both people to win.',
          },
          {
            id: 'collapse',
            text: '"Never mind, forget I said anything."',
            feedback: 'Collapsing erases your own needs. You just did the hard work of asking \u2014 do not take it back. Your needs are valid even when inconvenient.',
          },
          {
            id: 'negotiate',
            text: '"I hear that. What if we try three nights a week to start?"',
            feedback: 'This is effective negotiation. You stay connected to your need while making space for your partner\'s reality. A partial win is still a win.',
            isRecommended: true,
          },
        ],
      },
    },

    // 8. Checklist: Ready to deliver
    {
      type: 'checklist',
      title: 'Pre-Flight Checklist',
      content:
        'Before you deliver your DEAR MAN statement, check in on these:',
      interactiveConfig: {
        kind: 'checklist',
        items: [
          { id: 'calm', text: 'I am in my window of tolerance', subtext: 'Not too activated, not shut down' },
          { id: 'clear', text: 'My request is specific and doable', subtext: 'Not vague, not impossible' },
          { id: 'timing', text: 'This is a good time for both of us', subtext: 'Not rushing, not exhausted' },
          { id: 'flexible', text: 'I am open to negotiating', subtext: 'Willing to find middle ground' },
        ],
        minRequired: 3,
      },
    },

    // 9. Reflection
    {
      type: 'reflection',
      title: 'Reflection',
      content:
        'You have just walked through a complete DEAR MAN script. How does it feel to have your request laid out clearly? Is there a part of this that feels challenging? When might you use this with your partner?',
      promptPlaceholder: 'What I notice about this process is...',
    },
  ],
};
