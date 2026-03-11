/**
 * AudioManager — Global singleton that ensures only one audio track
 * plays at a time across the entire app.
 *
 * Usage:
 *   import { audioManager } from '@/services/AudioManager';
 *
 *   // Before playing a new sound:
 *   await audioManager.stopCurrent();
 *
 *   // After creating a new sound:
 *   audioManager.register(sound, 'my-component-id');
 *
 *   // When your component unmounts or stops:
 *   audioManager.unregister('my-component-id');
 */

import { Audio } from 'expo-av';

class AudioManager {
  private currentSound: Audio.Sound | null = null;
  private currentOwner: string | null = null;

  /**
   * Stop whatever is currently playing and unload it.
   * Safe to call even if nothing is playing.
   */
  async stopCurrent(exceptOwner?: string): Promise<void> {
    if (!this.currentSound) return;
    if (exceptOwner && this.currentOwner === exceptOwner) return;

    try {
      const status = await this.currentSound.getStatusAsync();
      if (status.isLoaded) {
        if (status.isPlaying) {
          await this.currentSound.pauseAsync();
        }
      }
    } catch {
      // Sound may already be unloaded — that's fine
    }

    this.currentSound = null;
    this.currentOwner = null;
  }

  /**
   * Register a sound as the currently active track.
   * Automatically stops any previously playing track first.
   */
  async register(sound: Audio.Sound, owner: string): Promise<void> {
    // Stop previous if it's a different owner
    if (this.currentSound && this.currentOwner !== owner) {
      await this.stopCurrent();
    }

    this.currentSound = sound;
    this.currentOwner = owner;
  }

  /**
   * Unregister a sound (e.g. on component unmount).
   * Only clears if the caller is the current owner.
   */
  unregister(owner: string): void {
    if (this.currentOwner === owner) {
      this.currentSound = null;
      this.currentOwner = null;
    }
  }

  /**
   * Check if a specific owner is the current active player.
   */
  isOwner(owner: string): boolean {
    return this.currentOwner === owner;
  }
}

// Export a single global instance
export const audioManager = new AudioManager();
