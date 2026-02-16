/**
 * SoundHapticsService.ts
 * ─────────────────────────────────────────────────────────────────
 * Audio + Haptic feedback system for Tender's gamified experience.
 *
 * Manages all sounds and haptic patterns across the app:
 * - Ambient background (soft piano/nature for lessons)
 * - UI sounds (tap, swipe, toggle)
 * - Celebration sounds (XP gain, level up, badge unlock, confetti)
 * - Reflective sounds (bell ding for reflection submit)
 * - Streak sounds (streak milestone celebration)
 *
 * Usage:
 *   import { SoundHaptics, useSoundHaptics } from '@/services/SoundHapticsService';
 *
 *   // Initialize once on app start (done in root layout)
 *   await SoundHaptics.init();
 *
 *   // Or use the hook in components:
 *   const haptics = useSoundHaptics();
 *   haptics.tap();
 *   haptics.success();
 */

import React from 'react';
import * as Haptics from 'expo-haptics';
import { Audio, AVPlaybackSource } from 'expo-av';
import { Platform } from 'react-native';

// ─── Types ──────────────────────────────────────────────────────────────────

type SoundName =
  | 'tap'
  | 'tap_soft'
  | 'swipe'
  | 'toggle'
  | 'page_turn'
  | 'success'
  | 'xp_gain'
  | 'level_up'
  | 'badge_unlock'
  | 'confetti'
  | 'streak_milestone'
  | 'reflection_ding'
  | 'lesson_start'
  | 'lesson_complete'
  | 'mood_select'
  | 'exercise_reveal'
  | 'error'
  | 'notification';

type AmbientType = 'lesson' | 'reflection' | 'assessment' | 'home';

interface SoundConfig {
  volume: number;
  allowOverlap: boolean;
}

// ─── Sound Configuration ────────────────────────────────────────────────────

const SOUND_CONFIG: Record<SoundName, SoundConfig> = {
  tap:              { volume: 0.3,  allowOverlap: true },
  tap_soft:         { volume: 0.15, allowOverlap: true },
  swipe:            { volume: 0.2,  allowOverlap: true },
  toggle:           { volume: 0.25, allowOverlap: true },
  page_turn:        { volume: 0.25, allowOverlap: false },
  success:          { volume: 0.5,  allowOverlap: false },
  xp_gain:          { volume: 0.45, allowOverlap: false },
  level_up:         { volume: 0.7,  allowOverlap: false },
  badge_unlock:     { volume: 0.6,  allowOverlap: false },
  confetti:         { volume: 0.5,  allowOverlap: false },
  streak_milestone: { volume: 0.55, allowOverlap: false },
  reflection_ding:  { volume: 0.35, allowOverlap: false },
  lesson_start:     { volume: 0.3,  allowOverlap: false },
  lesson_complete:  { volume: 0.6,  allowOverlap: false },
  mood_select:      { volume: 0.3,  allowOverlap: true },
  exercise_reveal:  { volume: 0.4,  allowOverlap: false },
  error:            { volume: 0.3,  allowOverlap: false },
  notification:     { volume: 0.4,  allowOverlap: false },
};

// ─── Haptic Patterns ────────────────────────────────────────────────────────

const HapticPatterns = {
  /** Light tap — buttons, selections */
  tap: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),

  /** Medium tap — page turns, card flips */
  medium: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),

  /** Heavy tap — confetti, major celebrations */
  heavy: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),

  /** Success notification — completed items */
  success: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),

  /** Warning — approaching streak loss, etc. */
  warning: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),

  /** Error — validation fails, etc. */
  error: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),

  /** Selection changed — mood selector, radio buttons */
  selection: () => Haptics.selectionAsync(),

  /** XP gain — double pulse */
  xpGain: async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await new Promise(r => setTimeout(r, 100));
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  },

  /** Level up — escalating triple pulse */
  levelUp: async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await new Promise(r => setTimeout(r, 80));
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await new Promise(r => setTimeout(r, 80));
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  },

  /** Badge unlock — success + heavy */
  badgeUnlock: async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await new Promise(r => setTimeout(r, 200));
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  },

  /** Confetti — rapid burst */
  confetti: async () => {
    for (let i = 0; i < 4; i++) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await new Promise(r => setTimeout(r, 50));
    }
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  },

  /** Streak — rhythmic pulse (like a heartbeat) */
  streak: async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await new Promise(r => setTimeout(r, 150));
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    await new Promise(r => setTimeout(r, 400));
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await new Promise(r => setTimeout(r, 150));
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  },
};

// ─── Main Service ───────────────────────────────────────────────────────────

class SoundHapticsServiceClass {
  private initialized = false;
  private soundsEnabled = true;
  private hapticsEnabled = true;
  private ambientSound: Audio.Sound | null = null;
  private loadedSounds: Map<SoundName, Audio.Sound> = new Map();
  private soundSources: Map<SoundName, AVPlaybackSource> = new Map();

  /**
   * Initialize the audio system.
   * Call once on app startup.
   */
  async init(): Promise<void> {
    if (this.initialized) return;

    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: false,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });
      this.initialized = true;
    } catch (error) {
      console.warn('[SoundHaptics] Audio init failed:', error);
    }
  }

  /**
   * Register a sound source.
   * Example: SoundHaptics.registerSound('tap', require('@/assets/sounds/tap.mp3'));
   */
  registerSound(name: SoundName, source: AVPlaybackSource): void {
    this.soundSources.set(name, source);
  }

  /**
   * Register all sounds at once.
   */
  registerAllSounds(sounds: Partial<Record<SoundName, AVPlaybackSource>>): void {
    for (const [name, source] of Object.entries(sounds)) {
      if (source) this.soundSources.set(name as SoundName, source);
    }
  }

  // ─── Settings ─────────────────────────────────────────────────────────

  setSoundsEnabled(enabled: boolean): void {
    this.soundsEnabled = enabled;
    if (!enabled) this.stopAmbient();
  }

  setHapticsEnabled(enabled: boolean): void {
    this.hapticsEnabled = enabled;
  }

  // ─── Core Sound Player ────────────────────────────────────────────────

  private async playSound(name: SoundName): Promise<void> {
    if (!this.soundsEnabled || !this.initialized) return;

    const source = this.soundSources.get(name);
    if (!source) {
      // No sound file registered — silently skip (haptics-only mode)
      return;
    }

    const config = SOUND_CONFIG[name];

    try {
      if (!config.allowOverlap) {
        let sound = this.loadedSounds.get(name);
        if (sound) {
          await sound.stopAsync();
          await sound.setPositionAsync(0);
          await sound.setVolumeAsync(config.volume);
          await sound.playAsync();
          return;
        }
      }

      const { sound } = await Audio.Sound.createAsync(source, {
        volume: config.volume,
        shouldPlay: true,
      });

      if (!config.allowOverlap) {
        this.loadedSounds.set(name, sound);
      } else {
        sound.setOnPlaybackStatusUpdate((status) => {
          if ('didJustFinish' in status && status.didJustFinish) {
            sound.unloadAsync();
          }
        });
      }
    } catch (error) {
      console.warn(`[SoundHaptics] Error playing sound "${name}":`, error);
    }
  }

  // ─── Ambient Background ───────────────────────────────────────────────

  async startAmbient(type: AmbientType): Promise<void> {
    if (!this.soundsEnabled) return;

    await this.stopAmbient();

    const ambientMap: Record<AmbientType, string> = {
      lesson: 'ambient_lesson',
      reflection: 'ambient_reflection',
      assessment: 'ambient_assessment',
      home: 'ambient_home',
    };

    const sourceName = ambientMap[type];
    const source = this.soundSources.get(sourceName as SoundName);
    if (!source) return;

    try {
      const { sound } = await Audio.Sound.createAsync(source, {
        volume: 0.12,
        isLooping: true,
        shouldPlay: true,
      });
      this.ambientSound = sound;

      // Fade in
      let vol = 0;
      const fadeInterval = setInterval(() => {
        vol += 0.01;
        if (vol >= 0.12) {
          clearInterval(fadeInterval);
          return;
        }
        sound.setVolumeAsync(vol).catch(() => {});
      }, 50);
    } catch (error) {
      console.warn('[SoundHaptics] Ambient start failed:', error);
    }
  }

  async stopAmbient(): Promise<void> {
    if (!this.ambientSound) return;

    try {
      const sound = this.ambientSound;
      let vol = 0.12;
      await new Promise<void>((resolve) => {
        const fadeInterval = setInterval(() => {
          vol -= 0.01;
          if (vol <= 0) {
            clearInterval(fadeInterval);
            resolve();
            return;
          }
          sound.setVolumeAsync(vol).catch(() => {});
        }, 40);
      });

      await sound.stopAsync();
      await sound.unloadAsync();
    } catch {
      // Ignore cleanup errors
    }
    this.ambientSound = null;
  }

  // ─── Convenience Methods (Sound + Haptic combined) ────────────────────

  /** Button tap */
  tap(): void {
    this.playSound('tap');
    if (this.hapticsEnabled) HapticPatterns.tap();
  }

  /** Soft tap (secondary buttons) */
  tapSoft(): void {
    this.playSound('tap_soft');
    if (this.hapticsEnabled) HapticPatterns.selection();
  }

  /** Swipe gesture */
  swipe(): void {
    this.playSound('swipe');
    if (this.hapticsEnabled) HapticPatterns.tap();
  }

  /** Toggle switch */
  toggle(): void {
    this.playSound('toggle');
    if (this.hapticsEnabled) HapticPatterns.selection();
  }

  /** Page turn in lesson */
  pageTurn(): void {
    this.playSound('page_turn');
    if (this.hapticsEnabled) HapticPatterns.medium();
  }

  /** Generic success */
  success(): void {
    this.playSound('success');
    if (this.hapticsEnabled) HapticPatterns.success();
  }

  /** XP gain (+50 XP animation) */
  playXPGain(): void {
    this.playSound('xp_gain');
    if (this.hapticsEnabled) HapticPatterns.xpGain();
  }

  /** Level up! */
  playLevelUp(): void {
    this.playSound('level_up');
    if (this.hapticsEnabled) HapticPatterns.levelUp();
  }

  /** Badge unlocked */
  playBadgeUnlock(): void {
    this.playSound('badge_unlock');
    if (this.hapticsEnabled) HapticPatterns.badgeUnlock();
  }

  /** Confetti burst */
  playConfetti(): void {
    this.playSound('confetti');
    if (this.hapticsEnabled) HapticPatterns.confetti();
  }

  /** Streak milestone (7 days, 30 days, etc.) */
  playStreakMilestone(): void {
    this.playSound('streak_milestone');
    if (this.hapticsEnabled) HapticPatterns.streak();
  }

  /** Reflection submitted */
  playReflectionDing(): void {
    this.playSound('reflection_ding');
    if (this.hapticsEnabled) HapticPatterns.success();
  }

  /** Lesson begins */
  playLessonStart(): void {
    this.playSound('lesson_start');
    if (this.hapticsEnabled) HapticPatterns.medium();
  }

  /** Lesson complete */
  playLessonComplete(): void {
    this.playSound('lesson_complete');
    if (this.hapticsEnabled) HapticPatterns.confetti();
  }

  /** Mood selected */
  playMoodSelect(): void {
    this.playSound('mood_select');
    if (this.hapticsEnabled) HapticPatterns.selection();
  }

  /** Exercise card revealed */
  playExerciseReveal(): void {
    this.playSound('exercise_reveal');
    if (this.hapticsEnabled) HapticPatterns.medium();
  }

  /** Error feedback */
  playError(): void {
    this.playSound('error');
    if (this.hapticsEnabled) HapticPatterns.error();
  }

  /** Notification */
  playNotification(): void {
    this.playSound('notification');
    if (this.hapticsEnabled) HapticPatterns.tap();
  }

  // ─── Cleanup ──────────────────────────────────────────────────────────

  async cleanup(): Promise<void> {
    await this.stopAmbient();
    for (const sound of this.loadedSounds.values()) {
      try { await sound.unloadAsync(); } catch {}
    }
    this.loadedSounds.clear();
  }
}

// ─── Singleton Export ───────────────────────────────────────────────────────

export const SoundHaptics = new SoundHapticsServiceClass();

// ─── React Hook ─────────────────────────────────────────────────────────────

/**
 * Hook for components that need sound/haptic feedback.
 * Initializes on first use and provides the service.
 *
 * Usage:
 *   const haptics = useSoundHaptics();
 *   <Pressable onPress={() => { haptics.tap(); doSomething(); }}>
 */
export function useSoundHaptics() {
  React.useEffect(() => {
    SoundHaptics.init();
  }, []);

  return SoundHaptics;
}
