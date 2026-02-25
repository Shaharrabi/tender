import type {
  ECRRScores,
  AttachmentStyle,
  CompositeScores,
  AnchorPoints,
  AnchorCategory,
  EmotionalStructure,
} from '@/types';

/**
 * Generate richly personalized anchor points for difficult moments.
 *
 * These are the "in the moment" tools users reach for during actual conflict.
 * Each category includes:
 *   - primary: the one-liner they can hold onto
 *   - whatToRemember: reframes for their emotional state
 *   - whatToDo: concrete actions
 *   - whatNotToDo: protective guardrails
 *
 * Personalized using attachment style, emotional structure, and regulation capacity.
 */
export function generateAnchorPoints(
  ecrr: ECRRScores,
  composite: CompositeScores,
  emotionalStructure?: EmotionalStructure
): AnchorPoints {
  const style = ecrr.attachmentStyle;
  const regScore = composite.regulationScore;

  return {
    whenActivated: buildActivatedAnchors(style, regScore, emotionalStructure),
    whenShutdown: buildShutdownAnchors(style, regScore, emotionalStructure),
    patternInterrupt: buildPatternInterrupts(style, emotionalStructure),
    repair: buildRepairAnchors(style, emotionalStructure),
    selfCompassion: buildSelfCompassion(style, emotionalStructure),
  };
}

// ─── When Activated ──────────────────────────────────────

function buildActivatedAnchors(
  style: AttachmentStyle,
  regScore: number,
  es?: EmotionalStructure
): AnchorCategory {
  const longing = es?.longing ?? 'connection and safety';

  switch (style) {
    case 'anxious-preoccupied':
      return {
        primary: 'This feeling is familiar, not factual. Breathe. My partner is not leaving.',
        whatToRemember: [
          `What you are actually seeking right now: ${longing.toLowerCase()}`,
          'Your anxiety is not evidence that something is wrong',
          'Intensity right now will push away the closeness you want',
        ],
        whatToDo: [
          'Name the feeling out loud: "I notice I am getting activated"',
          'Put your hand on your chest and take three slow breaths',
          'Ask for what you need directly instead of testing your partner',
        ],
        whatNotToDo: [
          'Do not demand resolution right now — it will escalate',
          'Do not interpret silence as rejection',
        ],
      };

    case 'dismissive-avoidant':
      return {
        primary: 'I can stay present even when it is uncomfortable. This matters.',
        whatToRemember: [
          'Your instinct to leave is protection, not truth',
          `Underneath the discomfort: ${longing.toLowerCase()}`,
          'Staying 30 seconds longer builds the trust you both need',
        ],
        whatToDo: [
          'Say "I need a moment, but I am not leaving this conversation"',
          'Name one feeling, even if it is just "I feel overwhelmed"',
          'Stay physically present even if you cannot find words yet',
        ],
        whatNotToDo: [
          'Do not walk away without saying when you will come back',
          'Do not dismiss your partner\'s feelings as "too much"',
        ],
      };

    case 'fearful-avoidant':
      return {
        primary: 'I want to run, and I want to stay. Both are true. Breathe through it.',
        whatToRemember: [
          'The push-pull is your nervous system, not reality',
          `What you really need: ${longing.toLowerCase()}`,
          'You do not have to choose fight or flight — you can pause',
        ],
        whatToDo: [
          'Ground yourself: feet on floor, name three things you can see',
          'Say "I am feeling torn right now and I need a moment"',
          'Choose one small step toward connection, not a big leap',
        ],
        whatNotToDo: [
          'Do not make permanent decisions in a temporary emotional state',
          'Do not alternate between clinging and pushing away',
        ],
      };

    case 'secure':
    default:
      return {
        primary: 'Notice the activation. Slow down. I can respond instead of react.',
        whatToRemember: [
          'Even secure systems get activated under enough stress',
          'You have the tools to navigate this',
          regScore < 50
            ? 'Your window is narrower right now — be gentle with yourself'
            : 'Trust your ability to hold space for both of you',
        ],
        whatToDo: [
          'Pause before responding — a few seconds changes the trajectory',
          'Name what you need clearly and directly',
          'Check: "Am I responding to what is happening, or to a story about it?"',
        ],
        whatNotToDo: [
          'Do not assume your partner\'s intent — ask',
          'Do not over-function by trying to fix everything immediately',
        ],
      };
  }
}

// ─── When Shutdown ───────────────────────────────────────

function buildShutdownAnchors(
  style: AttachmentStyle,
  regScore: number,
  es?: EmotionalStructure
): AnchorCategory {
  const isNarrowWindow = regScore < 40;

  switch (style) {
    case 'anxious-preoccupied':
      return {
        primary: isNarrowWindow
          ? 'I am flooded, not broken. I need a break, not forever. I will come back.'
          : 'The numbness is temporary. I can find my way back to feeling.',
        whatToRemember: [
          'Shutdown after activation is your nervous system protecting you',
          'Going numb does not mean you stopped caring',
          'Your partner is still there — this is a pause, not an ending',
        ],
        whatToDo: [
          'Splash cold water on your face or hold an ice cube',
          'Tell your partner: "I shut down. I need 20 minutes. I will come back."',
          'Move your body — walk, stretch, shake your hands',
        ],
        whatNotToDo: [
          'Do not force yourself to talk when you are numb',
          'Do not spiral into "something is wrong with me" stories',
        ],
      };

    case 'dismissive-avoidant':
      return {
        primary: 'This is my familiar retreat. It kept me safe once. I can choose differently now.',
        whatToRemember: [
          'Withdrawal feels like self-care but it costs connection',
          'You are allowed to come back slowly — you do not need a grand gesture',
          'Your partner needs to know you are still in this, even from a distance',
        ],
        whatToDo: [
          'Send a simple signal: "I need space but I am still here"',
          'Set a concrete return time: "I will check in by tonight"',
          'Do one grounding thing before re-engaging: walk, journal, breathe',
        ],
        whatNotToDo: [
          'Do not disappear without a word — it activates your partner\'s worst fears',
          'Do not wait until you feel "ready" — take one small step back',
        ],
      };

    case 'fearful-avoidant':
      return {
        primary: 'I froze because it felt like too much. That is okay. I can thaw slowly.',
        whatToRemember: [
          'Freeze is a survival response — you are not broken',
          'You do not have to figure out how you feel before reconnecting',
          'One tiny step counts — a text, a touch, a look',
        ],
        whatToDo: [
          'Start with body: wiggle toes, squeeze fists, look around the room',
          'Choose the smallest possible re-engagement: a hand on their arm, a brief text',
          'Say: "I went far away. I am coming back. Bear with me."',
        ],
        whatNotToDo: [
          'Do not assume your partner is angry because you shut down',
          'Do not try to "fix" the shutdown — just gently exit it',
        ],
      };

    case 'secure':
    default:
      return {
        primary: 'This is temporary. I can find my way back to myself and to us.',
        whatToRemember: [
          'Even well-regulated people hit their limit sometimes',
          'Shutdown is information — something overwhelmed your system',
          'You will feel like yourself again soon',
        ],
        whatToDo: [
          'Name it: "I notice I have gone flat. I need a few minutes."',
          'Gently re-engage through physical grounding',
          'Return to the conversation when you can feel again',
        ],
        whatNotToDo: [
          'Do not push through shutdown — it lengthens recovery',
          'Do not pretend you are fine when you are numb',
        ],
      };
  }
}

// ─── Pattern Interrupts ──────────────────────────────────

function buildPatternInterrupts(
  style: AttachmentStyle,
  es?: EmotionalStructure
): string[] {
  const universal = [
    'I notice I am in my pattern. Can we pause and try differently?',
  ];

  switch (style) {
    case 'anxious-preoccupied':
      return [
        ...universal,
        'Is this fear talking, or is there a real problem right now?',
        'What would I do if I trusted that we are okay?',
        'I am reaching for reassurance. Can I sit with this feeling for 60 seconds first?',
      ];
    case 'dismissive-avoidant':
      return [
        ...universal,
        'I am pulling away. What am I protecting myself from right now?',
        'What if staying feels uncomfortable but is actually safe?',
        'My partner is not the threat. The vulnerability is.',
      ];
    case 'fearful-avoidant':
      return [
        ...universal,
        'I do not have to pick approach or avoid. I can just be here.',
        'Both parts of me are trying to protect me. Neither is wrong.',
        'What would the calm version of me choose right now?',
      ];
    case 'secure':
    default:
      return [
        ...universal,
        'Am I responding to this moment, or to accumulated stress?',
        'What does my partner actually need from me right now?',
        'I can hold space for both our experiences.',
      ];
  }
}

// ─── Repair ──────────────────────────────────────────────

function buildRepairAnchors(
  style: AttachmentStyle,
  es?: EmotionalStructure
): { signsYoureReady: string[]; repairStarters: string[] } {
  const commonSigns = [
    'You can think about what happened without your body going into alarm',
    'You can hold your partner\'s perspective alongside your own',
  ];

  switch (style) {
    case 'anxious-preoccupied':
      return {
        signsYoureReady: [
          ...commonSigns,
          'You can approach without needing an immediate answer',
        ],
        repairStarters: [
          'I got activated and lost my way. What I was really trying to say is...',
          'I know I came on strong. Can I try again more softly?',
          'I was scared we were disconnected. Can we reconnect?',
        ],
      };
    case 'dismissive-avoidant':
      return {
        signsYoureReady: [
          ...commonSigns,
          'You are willing to stay in the conversation even if it is uncomfortable',
        ],
        repairStarters: [
          'I pulled away, and I know that hurt. I am here now.',
          'I could not stay present earlier. That was about me, not you.',
          'I want to try again. Can you tell me what you needed?',
        ],
      };
    case 'fearful-avoidant':
      return {
        signsYoureReady: [
          ...commonSigns,
          'The push-pull feeling has settled into something more grounded',
        ],
        repairStarters: [
          'I sent mixed signals and I know that is confusing. Here is what was happening...',
          'I went back and forth. I am sorry. What I actually need is...',
          'I froze, and I want you to know it was not about you.',
        ],
      };
    case 'secure':
    default:
      return {
        signsYoureReady: [
          ...commonSigns,
          'You feel genuine curiosity about their experience, not just your own',
        ],
        repairStarters: [
          'I got activated and could not stay present. I am sorry. Can we try again?',
          'I want to understand what that was like for you.',
          'I think we got off track. Can we start over?',
        ],
      };
  }
}

// ─── Self-Compassion ─────────────────────────────────────

function buildSelfCompassion(
  style: AttachmentStyle,
  es?: EmotionalStructure
): { reminders: string[]; personalizedMessage: string } {
  const longing = es?.longing ?? 'to be loved as you are';

  switch (style) {
    case 'anxious-preoccupied':
      return {
        reminders: [
          'Your deep capacity for love is a strength, not a weakness',
          'The intensity of your caring is beautiful — learning to channel it is the work',
          'You are not "too much." You are someone who loves deeply.',
        ],
        personalizedMessage:
          `The part of you that reaches for connection learned to do that because ${longing.toLowerCase()} ` +
          'mattered so much. That longing is not a flaw. It is the proof that your heart works.',
      };
    case 'dismissive-avoidant':
      return {
        reminders: [
          'Your independence kept you safe. Now you get to choose what to do with it.',
          'Needing space is valid. You are learning to balance it with closeness.',
          'You are not cold. You feel deeply — you just learned to feel alone.',
        ],
        personalizedMessage:
          `You learned early that ${longing.toLowerCase()} was safest to want quietly. ` +
          'The walls you built were wise then. You are learning to put in doors.',
      };
    case 'fearful-avoidant':
      return {
        reminders: [
          'Your contradictions make sense given what you have been through',
          'Wanting closeness and fearing it at the same time is not broken — it is complex',
          'Every time you stay instead of run, you are rewriting your story.',
        ],
        personalizedMessage:
          `You want ${longing.toLowerCase()}, and that want comes with real fear. ` +
          'Both are true. Both are valid. You are learning that love does not have to be dangerous.',
      };
    case 'secure':
    default:
      return {
        reminders: [
          'Your stability is a gift to your relationships',
          'Even secure people have hard days. This is one of those days.',
          'Progress, not perfection. This pattern developed for a reason.',
        ],
        personalizedMessage:
          'Your ability to be present, honest, and steady is rare and valuable. ' +
          'When you stumble, it is not a failure — it is proof that you are human.',
      };
  }
}
