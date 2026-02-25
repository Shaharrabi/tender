import type {
  ECRRScores,
  AttachmentStyle,
  CompositeScores,
  PartnerGuide,
  PartnerGuideState,
  EmotionalStructure,
} from '@/types';

/**
 * Generate a shareable partner guide — what your partner needs to know.
 *
 * Now includes:
 *   - State-specific guidance (whenActivated vs whenShutdown)
 *   - "What to say" phrases partners can actually use
 *   - Deepest longing — the one sentence that changes everything
 *
 * These are personalized using attachment style, regulation capacity,
 * and the emotional structure from the attachment lens.
 */
export function generatePartnerGuide(
  ecrr: ECRRScores,
  composite: CompositeScores,
  emotionalStructure?: EmotionalStructure
): PartnerGuide {
  const style = ecrr.attachmentStyle;
  const es = emotionalStructure;

  return {
    whatToKnow: WHAT_TO_KNOW[style],
    whenStrugglingINeed: NEEDS[style],
    whatHelps: HELPS[style],
    whatDoesntHelp: DOESNT_HELP[style],
    // Enhanced fields
    whenActivated: buildActivatedGuide(style, es),
    whenShutdown: buildShutdownGuide(style, es),
    whatToSay: buildWhatToSay(style, es),
    deepestLonging: es?.longing ?? FALLBACK_LONGING[style],
  };
}

// ─── State-Specific Guides ───────────────────────────────

function buildActivatedGuide(
  style: AttachmentStyle,
  es?: EmotionalStructure
): PartnerGuideState {
  switch (style) {
    case 'anxious-preoccupied':
      return {
        whatHelps: [
          'Move toward me — even briefly. A touch, a look, a word.',
          'Say "I am here" or "We are okay" — even if we have not resolved it',
          'Stay calm. Your steadiness helps me regulate.',
        ],
        whatDoesntHelp: [
          'Walking away without saying when you will return',
          'Telling me I am overreacting or being too much',
          'Going silent — silence is the loudest thing you can do',
        ],
        whatToSay: [
          'I am here. I am not going anywhere.',
          'Your feelings make sense. Let me hear you.',
          'We are going to figure this out together.',
        ],
      };
    case 'dismissive-avoidant':
      return {
        whatHelps: [
          'Give me a moment before expecting a response',
          'Keep your voice soft and steady — intensity makes me shut down faster',
          'Ask me one question at a time, not a rapid-fire series',
        ],
        whatDoesntHelp: [
          'Following me when I need a moment',
          'Interpreting my quiet as not caring',
          'Demanding I open up right now',
        ],
        whatToSay: [
          'Take the time you need. I will be here.',
          'You do not have to have the perfect words right now.',
          'I know this is hard for you. I appreciate you staying.',
        ],
      };
    case 'fearful-avoidant':
      return {
        whatHelps: [
          'Stay steady — do not match my intensity or withdrawal',
          'Offer connection without pressure: "I am here if you need me"',
          'Be patient with my back-and-forth — I know it is confusing',
        ],
        whatDoesntHelp: [
          'Asking me to pick: "Do you want space or closeness?"',
          'Getting frustrated with my inconsistency',
          'Pulling away because I am pulling away',
        ],
        whatToSay: [
          'I see you are struggling. I am not going anywhere.',
          'You can take your time. There is no rush.',
          'Both feelings are okay. You do not have to choose.',
        ],
      };
    case 'secure':
    default:
      return {
        whatHelps: [
          'Engage directly — I can handle honest conversation',
          'Meet me with your own openness',
          'Trust that I mean what I say',
        ],
        whatDoesntHelp: [
          'Avoiding the real conversation',
          'Assuming I do not have needs because I seem stable',
          'Taking my calm as a sign I do not care',
        ],
        whatToSay: [
          'I appreciate how steady you are. How are you really feeling?',
          'I want to hear what is underneath the calm.',
          'Let me be here for you the way you are always here for me.',
        ],
      };
  }
}

function buildShutdownGuide(
  style: AttachmentStyle,
  es?: EmotionalStructure
): PartnerGuideState {
  switch (style) {
    case 'anxious-preoccupied':
      return {
        whatHelps: [
          'Gentle physical contact — a hand on my back, sitting near me',
          'Quiet presence — just be there without needing me to talk',
          'A soft "I am here when you are ready" and then wait',
        ],
        whatDoesntHelp: [
          'Asking me to explain what I am feeling when I cannot feel anything',
          'Leaving me alone in the shutdown — it deepens it',
          'Taking my numbness as a sign that I do not care',
        ],
        whatToSay: [
          'I know you are in there. Take your time.',
          'You do not have to talk. I will just sit with you.',
          'When you are ready, I want to hear you.',
        ],
      };
    case 'dismissive-avoidant':
      return {
        whatHelps: [
          'Give space without withdrawing your warmth entirely',
          'Leave the door open: "I will be in the next room"',
          'Let me come back at my own pace without judgment',
        ],
        whatDoesntHelp: [
          'Hovering or checking in every five minutes',
          'Making me feel guilty for needing to retreat',
          'Demanding a specific return time',
        ],
        whatToSay: [
          'I am giving you space, and I am still right here.',
          'No rush. Come back when you are ready.',
          'I trust you to come back. Take what you need.',
        ],
      };
    case 'fearful-avoidant':
      return {
        whatHelps: [
          'Be a quiet, non-demanding presence nearby',
          'Offer small anchors: a cup of tea, a blanket, a familiar routine',
          'Remind me that this is a pause, not an ending',
        ],
        whatDoesntHelp: [
          'Asking me to pick between staying close and having space',
          'Showing frustration with my freeze response',
          'Matching my shutdown with your own withdrawal',
        ],
        whatToSay: [
          'You are safe. This is not an emergency.',
          'I am not going anywhere. You can come back slowly.',
          'I know this is overwhelming. One breath at a time.',
        ],
      };
    case 'secure':
    default:
      return {
        whatHelps: [
          'Acknowledge that I hit my limit — it is not typical and I need a moment',
          'Give me 10-15 minutes of genuine quiet',
          'Re-engage gently when I signal I am back',
        ],
        whatDoesntHelp: [
          'Pretending the shutdown did not happen',
          'Immediately jumping back into the difficult topic',
          'Assuming I am fine because I usually am',
        ],
        whatToSay: [
          'I noticed you went quiet. Are you okay?',
          'Take the time you need. I will be ready when you are.',
          'That was a lot. Let us come back to it when we are both ready.',
        ],
      };
  }
}

// ─── What To Say (key phrases for the partner) ───────────

function buildWhatToSay(
  style: AttachmentStyle,
  es?: EmotionalStructure
): string[] {
  const longing = es?.longing ?? FALLBACK_LONGING[style];

  switch (style) {
    case 'anxious-preoccupied':
      return [
        'I am here. I am not going anywhere.',
        'You are not too much. I choose you.',
        'We are okay. Let me hold your hand while we figure this out.',
        `What you really need to hear: "${longing}"`,
      ];
    case 'dismissive-avoidant':
      return [
        'Take the time you need. I will be here when you are ready.',
        'You do not have to have all the answers right now.',
        'I see how hard you are trying. It matters.',
        `What you really need to hear: "${longing}"`,
      ];
    case 'fearful-avoidant':
      return [
        'You are safe with me. I can handle all of you.',
        'You do not have to choose. We will figure it out together.',
        'I am not going anywhere, even when it gets messy.',
        `What you really need to hear: "${longing}"`,
      ];
    case 'secure':
    default:
      return [
        'Thank you for being so steady. I see you.',
        'How are you really feeling underneath the calm?',
        'You get to have needs too. What do you need right now?',
        `What you really need to hear: "${longing}"`,
      ];
  }
}

// ─── Templates (backward-compatible) ─────────────────────

const WHAT_TO_KNOW: Record<AttachmentStyle, string> = {
  secure:
    'I generally feel secure in our relationship, but I still have moments ' +
    "where I need reassurance or space. I will try to name what I need clearly.",

  'anxious-preoccupied':
    'I sometimes worry about us even when things are fine. My anxiety is not ' +
    "about you failing — it is about how much you matter to me. When I seek " +
    'reassurance, I am not doubting you; I am trying to regulate my nervous system.',

  'dismissive-avoidant':
    "I need space to process, and it does not mean I do not care. When I go " +
    'quiet, I am not punishing you — I am trying to manage overwhelm. ' +
    'My independence is not rejection; it is how I stay regulated.',

  'fearful-avoidant':
    'I sometimes send mixed signals because I feel torn between wanting ' +
    "closeness and needing safety. It is confusing for me too. When I pull " +
    'away after getting close, it is not about you — it is my nervous system ' +
    'hitting its limit.',
};

const NEEDS: Record<AttachmentStyle, string[]> = {
  secure: [
    'To talk through what is happening',
    'Your presence, not necessarily solutions',
    'To be reminded we can figure this out together',
  ],
  'anxious-preoccupied': [
    'Reassurance that we are okay, even briefly',
    "To know when you will be available if you are busy",
    'Physical closeness or a kind word',
  ],
  'dismissive-avoidant': [
    'Time to process before talking',
    'Space without it meaning we are broken',
    'Gentleness, not pressure',
  ],
  'fearful-avoidant': [
    'Patience with my contradictions',
    'Permission to go slow',
    'Safety to say "I need a break" without you leaving',
  ],
};

const HELPS: Record<AttachmentStyle, string[]> = {
  secure: [
    'Direct communication about what you need',
    'Working through things together',
    'Assuming good intent',
  ],
  'anxious-preoccupied': [
    'Proactive check-ins when you will be unavailable',
    'Reminders that you are choosing me',
    'Staying engaged even when I am anxious',
  ],
  'dismissive-avoidant': [
    'Giving me time before expecting a response',
    'Asking questions, not demanding answers',
    'Trusting that I will come back',
  ],
  'fearful-avoidant': [
    'Not taking my withdrawal personally',
    'Staying steady when I am not',
    'Gentle invitations, not demands',
  ],
};

const DOESNT_HELP: Record<AttachmentStyle, string[]> = {
  secure: [
    "Assuming I do not have needs because I do not always voice them",
    'Taking my stability for granted',
  ],
  'anxious-preoccupied': [
    'Dismissing my feelings as "overreacting"',
    'Going silent when I am worried',
    'Making me feel needy for wanting connection',
  ],
  'dismissive-avoidant': [
    'Pursuing me when I have asked for space',
    'Labeling my withdrawal as "stonewalling"',
    'Interpreting my need for space as not caring',
  ],
  'fearful-avoidant': [
    'Asking me to "pick a side" — close or distant',
    'Getting frustrated with my inconsistency',
    'Rushing me to decide how I feel',
  ],
};

const FALLBACK_LONGING: Record<AttachmentStyle, string> = {
  secure: 'To be met with the same honesty and presence I offer',
  'anxious-preoccupied': 'Reassurance that I matter to you — that you choose me',
  'dismissive-avoidant': 'To be accepted without having to perform closeness on demand',
  'fearful-avoidant': 'Safety to be close without it being used against me',
};
