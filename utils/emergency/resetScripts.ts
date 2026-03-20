/**
 * Pattern Reset Scripts
 *
 * 6 guided audio-reset scripts keyed to cycle position + activation state.
 * Each script has grounding text that accompanies the audio reset.
 *
 * Selection logic:
 *   With portrait:
 *     Activated pursuer  → R-1  (slow your reach)
 *     Shutdown pursuer   → R-2  (thaw the freeze)
 *     Activated withdrawer → R-3  (anchor before you leave)
 *     Shutdown withdrawer  → R-4  (gentle re-entry)
 *     Activated mixed     → R-5  (steady the swing)
 *     Shutdown mixed      → R-6  (find your center)
 *
 *   Without portrait (generic):
 *     Activated → R-4  (gentle re-entry — calming)
 *     Shutdown  → R-5  (steady the swing — warming)
 *
 * Audio files live at assets/audio/resets/R-{1-6}.mp3
 */

import type { IndividualPortrait } from '@/types/portrait';

// ─── Types ──────────────────────────────────────────────

export type ActivationState = 'activated' | 'shutdown';

export interface ResetScript {
  id: string;
  title: string;
  /** Short tagline shown on the button/card */
  tagline: string;
  /** Grounding text displayed during audio playback */
  bodyText: string;
  /** Breathing cue displayed during playback */
  breathingCue: string;
  /** Audio file path relative to assets/audio/resets/ */
  filePath: string;
  /** Duration string */
  duration: string;
  /** Duration in seconds */
  durationSeconds: number;
}

// ─── Scripts ────────────────────────────────────────────

const RESET_SCRIPTS: Record<string, ResetScript> = {
  'R-1': {
    id: 'R-1',
    title: 'Slow Your Reach',
    tagline: 'For when you\u2019re chasing connection',
    bodyText:
      'Your body is reaching because it needs reassurance \u2014 that impulse comes from a beautiful place. But right now, pursuing harder will push them further away. Let\u2019s pause the reach and find your ground first. The connection is still there. You don\u2019t need to chase it.',
    breathingCue: 'Breathe in for 4 \u2026 hold for 4 \u2026 out for 6. Slow the rhythm down.',
    filePath: 'R-2.mp3',
    duration: '2:00',
    durationSeconds: 120,
  },
  'R-2': {
    id: 'R-2',
    title: 'Thaw the Freeze',
    tagline: 'For when you\u2019ve gone numb',
    bodyText:
      'You\u2019ve shut down to protect yourself \u2014 that\u2019s your system doing its job. But underneath the numbness, you still care. This isn\u2019t indifference; it\u2019s overwhelm wearing a mask. Let\u2019s gently bring some warmth back. You don\u2019t have to feel everything at once.',
    breathingCue: 'Place a hand on your chest. Breathe warmth into that hand. In for 4 \u2026 out for 6.',
    filePath: 'R-1.mp3',
    duration: '2:00',
    durationSeconds: 120,
  },
  'R-3': {
    id: 'R-3',
    title: 'Anchor Before You Leave',
    tagline: 'For when you\u2019re about to walk away',
    bodyText:
      'Every part of you wants to leave the room \u2014 that\u2019s withdrawal doing what it knows. But leaving now will extend this cycle by hours. You don\u2019t need to engage yet. Just stay in the room. Let your body find one point of stillness.',
    breathingCue: 'Feel your feet on the ground. Press down gently. Breathe into the contact. You are here.',
    filePath: 'R-4.mp3',
    duration: '2:15',
    durationSeconds: 135,
  },
  'R-4': {
    id: 'R-4',
    title: 'Gentle Re-Entry',
    tagline: 'For when the world feels far away',
    bodyText:
      'You\u2019ve drifted somewhere else \u2014 that\u2019s okay. Your system pulled you out because staying present felt like too much. Let\u2019s come back slowly. Not to the conflict, not to the conversation \u2014 just to your body in this room, right now.',
    breathingCue: 'Name 5 things you can see. 4 you can touch. 3 you can hear. Slowly. No rush.',
    filePath: 'R-3.mp3',
    duration: '1:45',
    durationSeconds: 105,
  },
  'R-5': {
    id: 'R-5',
    title: 'Steady the Swing',
    tagline: 'For when you\u2019re oscillating',
    bodyText:
      'You\u2019re swinging between wanting to reach out and wanting to disappear. That pendulum is exhausting. You don\u2019t have to choose a side right now. The goal isn\u2019t to pick a response \u2014 it\u2019s to slow the oscillation until you can feel what\u2019s underneath.',
    breathingCue: 'Exhale longer than you inhale. In for 3 \u2026 out for 6. Let the swing slow.',
    filePath: 'R-6.mp3',
    duration: '2:15',
    durationSeconds: 135,
  },
  'R-6': {
    id: 'R-6',
    title: 'Find Your Center',
    tagline: 'For when everything feels chaotic',
    bodyText:
      'The noise is loud right now \u2014 inside and out. But there\u2019s a still point somewhere in you that hasn\u2019t moved. It\u2019s not calm exactly, but it\u2019s steady. Let\u2019s find it. Not to fix anything, just to stand on firmer ground for a moment.',
    breathingCue: 'Hands on your belly. Breathe so your hands move. In \u2026 and out. You are the center.',
    filePath: 'R-5.mp3',
    duration: '2:30',
    durationSeconds: 150,
  },
};

// ─── Selection Logic ────────────────────────────────────

/**
 * Select the appropriate reset script based on portrait data and activation state.
 *
 * With portrait:
 *   pursuer   + activated → R-1, shutdown → R-2
 *   withdrawer + activated → R-3, shutdown → R-4
 *   mixed/flexible + activated → R-5, shutdown → R-6
 *
 * Without portrait (generic):
 *   activated → R-4 (calming)
 *   shutdown  → R-5 (warming)
 */
export function selectResetScript(
  activationState: ActivationState,
  portrait: IndividualPortrait | null
): ResetScript {
  if (!portrait) {
    // Generic fallback when no portrait data
    return activationState === 'activated'
      ? RESET_SCRIPTS['R-4']
      : RESET_SCRIPTS['R-5'];
  }

  const position = portrait.negativeCycle?.position?.toLowerCase() ?? 'mixed';

  if (position === 'pursuer') {
    return activationState === 'activated'
      ? RESET_SCRIPTS['R-1']
      : RESET_SCRIPTS['R-2'];
  }

  if (position === 'withdrawer') {
    return activationState === 'activated'
      ? RESET_SCRIPTS['R-3']
      : RESET_SCRIPTS['R-4'];
  }

  // mixed / flexible / anything else
  return activationState === 'activated'
    ? RESET_SCRIPTS['R-5']
    : RESET_SCRIPTS['R-6'];
}

/**
 * Get a reset script by ID.
 */
export function getResetScript(id: string): ResetScript | undefined {
  return RESET_SCRIPTS[id];
}

/**
 * Get all reset scripts (for testing/debug).
 */
export function getAllResetScripts(): ResetScript[] {
  return Object.values(RESET_SCRIPTS);
}

/**
 * Static require map for reset audio files.
 * Metro bundler needs literal strings.
 */
export const RESET_AUDIO_SOURCES: Record<string, any> = {
  'R-1.mp3': require('@/assets/audio/resets/R-1.mp3'),
  'R-2.mp3': require('@/assets/audio/resets/R-2.mp3'),
  'R-3.mp3': require('@/assets/audio/resets/R-3.mp3'),
  'R-4.mp3': require('@/assets/audio/resets/R-4.mp3'),
  'R-5.mp3': require('@/assets/audio/resets/R-5.mp3'),
  'R-6.mp3': require('@/assets/audio/resets/R-6.mp3'),
};

export function resolveResetAudio(filePath: string): any | undefined {
  return RESET_AUDIO_SOURCES[filePath];
}
