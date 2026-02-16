/**
 * Sound Registration
 * ─────────────────────────────────────────────────────────────
 * Maps all sound names to their audio files.
 * Called once on app start to register sounds with SoundHapticsService.
 *
 * Usage:
 *   import { registerAllAppSounds } from '@/services/sounds';
 *   registerAllAppSounds();
 */

import { SoundHaptics } from './SoundHapticsService';

/**
 * Register all sound files with the SoundHapticsService.
 * Must be called after SoundHaptics.init().
 */
export function registerAllAppSounds(): void {
  SoundHaptics.registerAllSounds({
    // UI interactions
    tap: require('@/assets/sounds/tap.mp3'),
    tap_soft: require('@/assets/sounds/tap_soft.mp3'),
    swipe: require('@/assets/sounds/swipe.mp3'),
    toggle: require('@/assets/sounds/toggle.mp3'),
    page_turn: require('@/assets/sounds/page_turn.mp3'),

    // Success / completion
    success: require('@/assets/sounds/success.mp3'),
    lesson_complete: require('@/assets/sounds/lesson_complete.mp3'),

    // Gamification
    xp_gain: require('@/assets/sounds/xp_gain.mp3'),
    level_up: require('@/assets/sounds/level_up.mp3'),
    badge_unlock: require('@/assets/sounds/badge_unlock.mp3'),
    confetti: require('@/assets/sounds/confetti.mp3'),
    streak_milestone: require('@/assets/sounds/streak_milestone.mp3'),

    // Reflective
    reflection_ding: require('@/assets/sounds/reflection_ding.mp3'),
    mood_select: require('@/assets/sounds/mood_select.mp3'),

    // Lessons
    lesson_start: require('@/assets/sounds/lesson_start.mp3'),
    exercise_reveal: require('@/assets/sounds/exercise_reveal.mp3'),

    // System
    error: require('@/assets/sounds/error.mp3'),
    notification: require('@/assets/sounds/notification.mp3'),
  });
}
