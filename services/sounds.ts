/**
 * Sound Registration
 * ─────────────────────────────────────────────────────────────
 * Maps all sound names to their audio files.
 * Called once on app start to register sounds with SoundHapticsService.
 *
 * Sound palette (ElevenLabs custom mix):
 *   UIMvmt    — soft, subtle movement         → taps, page turns, navigation (primary UI sound)
 *   UIClick   — short, friendly click        → toggles, selections
 *   UIBeep    — very short tonal beep         → lesson start, exercise reveal
 *   UIAlert-Short — bright, tonal alert       → notifications, reflection ding
 *   UIAlert-Bubble — cute bubble pop          → confetti, mood select
 *   UIAlert-SMS — smartphone notification     → XP gain, achievements
 *   UIAlert-HappyWin — happy win beep         → level up, success, badge unlock
 *   UIAlert-Win — sound of the win            → streak milestone, confetti burst
 *
 * Kept originals: badge_unlock.mp3, complete.mp3
 *
 * Usage:
 *   import { registerAllAppSounds } from '@/services/sounds';
 *   registerAllAppSounds();
 */

import { SoundHaptics } from './SoundHapticsService';

// ─── New ElevenLabs sound references ────────────────────────
const CLICK   = require('@/assets/sounds/UIClick-Create_a_short,_frie-Elevenlabs.mp3');
const MVMT    = require('@/assets/sounds/UIMvmt-Soft,_subtle_UI_text-Elevenlabs.mp3');
const BEEP    = require('@/assets/sounds/UIBeep-Create_a_very_short_-Elevenlabs.mp3');
const ALERT   = require('@/assets/sounds/UIAlert-Short,_bright,_tonal-Elevenlabs.mp3');
const BUBBLE  = require('@/assets/sounds/UIAlert-Cute_bubble_pop,_cry-Elevenlabs.mp3');
const SMS     = require('@/assets/sounds/UIAlert-Smartphone_SMS_notif-Elevenlabs.mp3');
const WIN     = require('@/assets/sounds/UIAlert-happy_win_alert_beep-Elevenlabs.mp3');
const BIG_WIN = require('@/assets/sounds/UIAlert-sound_of_the_win_or_-Elevenlabs.mp3');

/**
 * Register all sound files with the SoundHapticsService.
 * Must be called after SoundHaptics.init().
 */
export function registerAllAppSounds(): void {
  SoundHaptics.registerAllSounds({
    // ─── UI interactions ─────────────────────────────────
    tap:            MVMT,     // Soft subtle movement for button taps / next page
    tap_soft:       MVMT,     // Same soft sound, played at lower volume via config
    swipe:          MVMT,     // Soft subtle movement for swipe gestures
    toggle:         CLICK,    // Short click for toggles (distinct tactile action)
    page_turn:      MVMT,     // Soft movement for page turns
    mood_select:    BUBBLE,   // Cute pop for mood dot selection

    // ─── Success / completion ────────────────────────────
    success:          WIN,    // Happy win beep — generic success
    lesson_complete:  WIN,    // Happy win beep for lesson completion

    // ─── Gamification ────────────────────────────────────
    xp_gain:          SMS,            // SMS notification chime for XP gain
    level_up:         WIN,            // Happy win beep for level up
    badge_unlock:     require('@/assets/sounds/badge_unlock.mp3'), // ← KEPT
    confetti:         BIG_WIN,        // Big win sound for confetti burst
    streak_milestone: BIG_WIN,        // Big win for streak milestones

    // ─── Reflective ──────────────────────────────────────
    reflection_ding:  ALERT,  // Bright tonal alert for reflection submit

    // ─── Lessons ─────────────────────────────────────────
    lesson_start:     BEEP,   // Short beep to begin a lesson
    exercise_reveal:  BEEP,   // Short beep when exercise card appears

    // ─── System ──────────────────────────────────────────
    error:          ALERT,    // Bright alert for errors
    notification:   SMS,      // Smartphone-style notification
  });
}
