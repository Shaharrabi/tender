import type {
  ECRRScores,
  DUTCHScores,
  NegativeCycle,
  CyclePosition,
} from '@/types';

/**
 * Predict the user's position in the pursue/withdraw negative cycle.
 */
export function predictNegativeCycle(
  ecrr: ECRRScores,
  dutch: DUTCHScores
): NegativeCycle {
  const position = predictPosition(ecrr);
  const description = DESCRIPTIONS[position];
  const primaryTriggers = TRIGGERS[position];
  const typicalMoves = MOVES[position];
  const deEscalators = getDeEscalators(position, dutch);

  return { position, description, primaryTriggers, typicalMoves, deEscalators };
}

// ─── Position Prediction ─────────────────────────────────

function predictPosition(ecrr: ECRRScores): CyclePosition {
  const { anxietyScore, avoidanceScore } = ecrr;

  if (anxietyScore > 4.5 && avoidanceScore < 3.5) return 'pursuer';
  if (avoidanceScore > 4.5 && anxietyScore < 3.5) return 'withdrawer';
  if (anxietyScore > 4.0 && avoidanceScore > 4.0) return 'mixed';
  return 'flexible';
}

// ─── Templates ───────────────────────────────────────────

const DESCRIPTIONS: Record<CyclePosition, string> = {
  pursuer:
    'In your negative cycle, you tend to pursue — moving toward your partner ' +
    'when distance appears, seeking connection and resolution. The harder you ' +
    'push, the more your partner may retreat, which makes you push harder. ' +
    'Underneath the pursuit is a longing to know you matter.',
  withdrawer:
    'In your negative cycle, you tend to withdraw — creating space when ' +
    'emotions rise, seeking calm through distance. The more you pull back, ' +
    'the more your partner may pursue, which makes you withdraw further. ' +
    'Underneath the withdrawal is a need to feel safe enough to open up.',
  mixed:
    'In your negative cycle, you oscillate — sometimes pursuing connection, ' +
    "sometimes withdrawing for safety, depending on what feels most threatening " +
    'in the moment. This can be confusing for both you and your partner.',
  flexible:
    'Your position in the negative cycle varies with context. You can both ' +
    'pursue and create space depending on what the situation requires. ' +
    "This flexibility is a strength — you're not locked into one position.",
};

const TRIGGERS: Record<CyclePosition, string[]> = {
  pursuer: [
    'Partner becoming quiet or distant',
    'Feeling disconnected after conflict',
    'Sensing emotional withdrawal',
    'Not knowing where you stand',
  ],
  withdrawer: [
    "Partner's emotional intensity",
    'Feeling criticized or blamed',
    'Pressure to talk before ready',
    'Conflict that seems to go in circles',
  ],
  mixed: [
    'Closeness feeling overwhelming',
    'Distance feeling abandoning',
    'Not knowing what you need in the moment',
    'Conflict that escalates unpredictably',
  ],
  flexible: [
    'Sustained disconnection',
    'Repeated misattunement',
    'Feeling unheard despite trying',
  ],
};

const MOVES: Record<CyclePosition, string[]> = {
  pursuer: [
    'Ask questions to understand what went wrong',
    'Initiate conversations about the relationship',
    'Seek reassurance or connection',
    'Follow partner when they need space',
  ],
  withdrawer: [
    'Go quiet or change the subject',
    'Focus on tasks or distractions',
    'Need time alone to process',
    'Minimize the issue ("it\'s not a big deal")',
  ],
  mixed: [
    'Reach out, then pull back',
    'Want closeness, then feel smothered',
    'Start conversations, then shut down',
    'Send mixed signals about what you need',
  ],
  flexible: [
    'Adapt approach based on reading the situation',
    'Sometimes pursue, sometimes create space',
    'Try multiple strategies before finding what works',
  ],
};

// ─── De-escalators ───────────────────────────────────────

function getDeEscalators(
  position: CyclePosition,
  dutch: DUTCHScores
): string[] {
  const shared = [
    'Name what\'s happening: "I notice we\'re in our cycle right now."',
    'Share the feeling underneath (fear, hurt) rather than the strategy.',
  ];

  const positionSpecific: string[] = [];

  if (position === 'pursuer') {
    positionSpecific.push(
      'Slow down. Give yourself (and your partner) space before re-engaging.'
    );
    positionSpecific.push(
      "Try saying: \"I need to know we're okay. Can you tell me that?\""
    );
  } else if (position === 'withdrawer') {
    positionSpecific.push(
      "Name your need for space: \"I need a break, but I'm not leaving.\""
    );
    positionSpecific.push(
      'Set a time to return to the conversation so your partner feels safe.'
    );
  } else if (position === 'mixed') {
    positionSpecific.push(
      "Name the confusion: \"I'm feeling pulled in both directions right now.\""
    );
    positionSpecific.push(
      'Ask for a brief pause to check in with yourself before responding.'
    );
  } else {
    positionSpecific.push(
      'Check which position you are currently in and name it out loud.'
    );
  }

  // Add conflict style-specific de-escalator
  const problemSolving = dutch.subscaleScores.problemSolving?.mean ?? 0;
  if (problemSolving > 3.0) {
    positionSpecific.push(
      'Lean on your problem-solving strength — but remember to validate feelings first.'
    );
  }

  return [...shared, ...positionSpecific];
}
