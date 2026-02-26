import type {
  ECRRScores,
  DUTCHScores,
  SSEITScores,
  CompositeScores,
  NegativeCycle,
  CyclePosition,
  RepairReadiness,
} from '@/types';

/**
 * Predict the user's position in the pursue/withdraw negative cycle.
 *
 * Enhanced in Sprint 4:
 *   - positionConfidence: how distinct the cycle position is
 *   - repairReadiness: ability to initiate and receive repair attempts
 */
export function predictNegativeCycle(
  ecrr: ECRRScores,
  dutch: DUTCHScores,
  sseit?: SSEITScores,
  composite?: CompositeScores
): NegativeCycle {
  const position = predictPosition(ecrr);
  const positionConfidence = calculatePositionConfidence(ecrr, position);
  const description = DESCRIPTIONS[position];
  const primaryTriggers = TRIGGERS[position];
  const typicalMoves = MOVES[position];
  const deEscalators = getDeEscalators(position, dutch);
  const repairReadiness = sseit && composite
    ? buildRepairReadiness(ecrr, sseit, composite, position)
    : undefined;

  return {
    position,
    positionConfidence,
    description,
    primaryTriggers,
    typicalMoves,
    deEscalators,
    repairReadiness,
  };
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

// ─── Position Confidence ────────────────────────────────

function calculatePositionConfidence(
  ecrr: ECRRScores,
  position: CyclePosition
): 'high' | 'medium' {
  const { anxietyScore, avoidanceScore } = ecrr;
  const gap = Math.abs(anxietyScore - avoidanceScore);

  // High confidence: clear separation between anxiety and avoidance
  if (position === 'pursuer' && anxietyScore > 5.0 && gap > 2.0) return 'high';
  if (position === 'withdrawer' && avoidanceScore > 5.0 && gap > 2.0) return 'high';
  if (position === 'mixed' && anxietyScore > 4.5 && avoidanceScore > 4.5) return 'high';
  if (position === 'flexible' && anxietyScore < 3.0 && avoidanceScore < 3.0) return 'high';

  return 'medium';
}

// ─── Repair Readiness ───────────────────────────────────

function buildRepairReadiness(
  ecrr: ECRRScores,
  sseit: SSEITScores,
  composite: CompositeScores,
  position: CyclePosition
): RepairReadiness {
  const eqManagingOwn = sseit.subscaleNormalized.managingOwn;
  const eqManagingOthers = sseit.subscaleNormalized.managingOthers;
  const eqPerception = sseit.subscaleNormalized.perception;
  const regScore = composite.regulationScore;

  // canMakeRepair: ability to initiate repair attempts
  // Higher EQ managing own + regulation = can calm down enough to reach out
  // Higher perception = can sense when repair is needed
  let canMakeRepair = Math.round(
    eqManagingOwn * 0.3 + eqPerception * 0.25 + regScore * 0.25 +
    (eqManagingOthers > 50 ? 20 : 10)
  );
  canMakeRepair = Math.min(100, Math.max(0, canMakeRepair));

  // Avoidance penalizes repair initiation (harder to approach after conflict)
  if (ecrr.avoidanceScore > 4.0) {
    canMakeRepair = Math.max(0, canMakeRepair - 15);
  }

  // canReceiveRepair: ability to accept repair from partner
  // Higher managing others + lower anxiety = can receive without reactivating
  let canReceiveRepair = Math.round(
    eqManagingOthers * 0.3 + eqManagingOwn * 0.2 + regScore * 0.25 +
    (eqPerception > 50 ? 15 : 5)
  );
  canReceiveRepair = Math.min(100, Math.max(0, canReceiveRepair));

  // High anxiety penalizes receiving repair (hard to trust it is genuine)
  if (ecrr.anxietyScore > 4.5) {
    canReceiveRepair = Math.max(0, canReceiveRepair - 10);
  }

  // Repair style description
  const repairStyle = getRepairStyle(position, eqManagingOwn, ecrr);

  // Barriers to repair
  const barriers = getRepairBarriers(ecrr, sseit, composite, position);

  return { canMakeRepair, canReceiveRepair, repairStyle, barriers };
}

function getRepairStyle(
  position: CyclePosition,
  eqManagingOwn: number,
  ecrr: ECRRScores
): string {
  if (position === 'pursuer') {
    if (eqManagingOwn > 60) {
      return 'You repair by reaching out — often quickly, with words and emotional bids. ' +
        'Your strength is willingness to initiate. Your growth edge is timing — waiting ' +
        'until both of you are ready rather than repairing to soothe your own anxiety.';
    }
    return 'You want to repair right away — the distance after conflict feels unbearable. ' +
      'Sometimes your repair attempts come before you have fully processed, which can ' +
      'restart the cycle rather than end it. Waiting even 20 minutes can change everything.';
  }

  if (position === 'withdrawer') {
    if (eqManagingOwn > 60) {
      return 'You repair through actions more than words — showing up, doing something kind, ' +
        'being present. Your strength is thoughtfulness. Your growth edge is verbalizing — ' +
        'your partner needs to hear the repair, not just see it.';
    }
    return 'Repair is hard for you because it requires approaching after you have retreated. ' +
      'You often wait for things to "blow over" rather than actively repairing. ' +
      'Learning to initiate even a simple "I am sorry about earlier" changes the dynamic.';
  }

  if (position === 'mixed') {
    return 'Your repair style depends on which position you were in during the conflict. ' +
      'Sometimes you reach out quickly; sometimes you need significant space first. ' +
      'Naming which mode you are in helps your partner know what to expect.';
  }

  return 'You can repair through both words and actions. Your flexibility lets you ' +
    'match your repair approach to the situation, which is a genuine strength.';
}

function getRepairBarriers(
  ecrr: ECRRScores,
  sseit: SSEITScores,
  composite: CompositeScores,
  position: CyclePosition
): string[] {
  const barriers: string[] = [];

  if (ecrr.anxietyScore > 4.0) {
    barriers.push('Fear that repair will be rejected — so you either rush it or avoid it');
  }

  if (ecrr.avoidanceScore > 4.0) {
    barriers.push('Difficulty approaching after retreat — the vulnerability of going first');
  }

  if (composite.regulationScore < 40) {
    barriers.push('Still activated when you try to repair — body says "not safe yet"');
  }

  if (sseit.subscaleNormalized.managingOwn < 45) {
    barriers.push('Hard to find the right words when emotions are still running high');
  }

  if (sseit.subscaleNormalized.perception < 45) {
    barriers.push('Difficulty reading when your partner is ready to receive repair');
  }

  if (position === 'mixed') {
    barriers.push('Uncertainty about what you need makes it hard to offer what your partner needs');
  }

  if (barriers.length === 0) {
    barriers.push('Pride or habit — even strong repairers sometimes wait longer than needed');
  }

  return barriers.slice(0, 3); // max 3 barriers
}
