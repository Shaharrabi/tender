/**
 * WelcomeAudio — Floating audio player for first-time screen entry.
 *
 * Plays a welcome audio clip once per screen. Shows a compact player bar
 * with play/pause, progress, and skip controls. Auto-plays on mount,
 * fades out on completion or skip.
 *
 * If autoplay fails (e.g. browser policy), the player remains visible
 * with a play button so the user can start it manually.
 *
 * Uses expo-av directly (not SoundHapticsService) because we need
 * progress tracking and pause/resume support.
 *
 * Usage:
 *   <WelcomeAudio screenKey="assessment" />
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
  Platform,
} from 'react-native';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { useFirstTime } from '@/context/FirstTimeContext';
import { WELCOME_AUDIO_CONFIGS } from '@/constants/ftue/welcomeAudios';
import {
  FTUEColors,
  FTUELayout,
  FTUETiming,
} from '@/constants/ftue/theme';
import {
  Colors,
  Spacing,
  Typography,
  FontFamilies,
  FontSizes,
  BorderRadius,
  Shadows,
} from '@/constants/theme';

// In-memory guard — prevents replay within the same page session
// even if AsyncStorage fails on web.
const _heardThisSession = new Set<string>();

interface WelcomeAudioProps {
  /** Key into WELCOME_AUDIO_CONFIGS */
  screenKey: string;
}

export const WelcomeAudio: React.FC<WelcomeAudioProps> = ({ screenKey }) => {
  const { user } = useAuth();
  const { state, loading, markAudioHeard } = useFirstTime();
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const mountedRef = useRef(true);
  const completedRef = useRef(false);
  const loadingRef = useRef(false); // Guard against multiple loads

  const config = WELCOME_AUDIO_CONFIGS[screenKey];
  const alreadyHeard = state.heardAudios.includes(screenKey) || _heardThisSession.has(screenKey);

  // No config, no source, already heard, or auth not resolved — don't render.
  // Wait for `user` so we don't fire during the guest→user transition.
  const shouldShow = config && config.source && !alreadyHeard && !loading && !!user;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Cleanup sound on unmount — also mark as heard so it won't replay
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }
      // If audio was shown but user navigated away before finish/skip,
      // still mark as heard so it doesn't replay on next visit.
      if (isVisible && !completedRef.current) {
        _heardThisSession.add(screenKey);
        markAudioHeard(screenKey);
      }
    };
  }, [isVisible, screenKey, markAudioHeard]);

  const doComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;

    setIsPlaying(false);
    _heardThisSession.add(screenKey);
    markAudioHeard(screenKey);

    // Fade out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: FTUETiming.audioFadeOut,
      useNativeDriver: true,
    }).start(() => {
      if (mountedRef.current) {
        setIsVisible(false);
      }
    });
  }, [screenKey, markAudioHeard, fadeAnim]);

  // Playback status handler
  const onPlaybackStatusUpdate = useCallback(
    (status: AVPlaybackStatus) => {
      if (!status.isLoaded) return;

      if (status.durationMillis && status.durationMillis > 0) {
        setProgress(status.positionMillis / status.durationMillis);
      }

      if (status.didJustFinish) {
        doComplete();
      }
    },
    [doComplete]
  );

  // Load and attempt to play audio
  const loadAndPlayAudio = useCallback(async () => {
    if (!config?.source) return;
    // Guard: only allow one load at a time
    if (loadingRef.current || soundRef.current) return;
    loadingRef.current = true;

    try {
      // Set audio mode for web + iOS compatibility
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      }).catch(() => {});

      // First, create the sound WITHOUT autoplay
      // This ensures the sound loads even if play() is blocked by browser
      const { sound: newSound } = await Audio.Sound.createAsync(
        config.source,
        { shouldPlay: false, volume: 1.0 },
        onPlaybackStatusUpdate
      );

      if (!mountedRef.current) {
        newSound.unloadAsync();
        return;
      }

      soundRef.current = newSound;
      setIsLoaded(true);

      // Now try to play — may fail on web due to autoplay policy
      try {
        await newSound.playAsync();
        if (mountedRef.current) {
          setIsPlaying(true);
        }
      } catch (playError) {
        // Autoplay blocked — sound is loaded but not playing.
        // Player stays visible so user can tap play manually.
        console.log('[WelcomeAudio] Autoplay blocked, showing play button');
      }
    } catch (error) {
      console.warn('[WelcomeAudio] Load error:', error);
      // Sound failed to load entirely — show player anyway with play button
      // User can tap to retry
      if (mountedRef.current) {
        setIsLoaded(false);
      }
    } finally {
      loadingRef.current = false;
    }
  }, [config, onPlaybackStatusUpdate]);

  // Auto-play on first render
  useEffect(() => {
    if (!shouldShow) return;

    const timer = setTimeout(() => {
      if (mountedRef.current) {
        setIsVisible(true);
        // Mark as heard immediately — showing the player is enough.
        // Don't wait for finish/skip (user may navigate away).
        _heardThisSession.add(screenKey);
        markAudioHeard(screenKey);
        // Fade in, then try to play
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: FTUETiming.audioFadeIn,
          useNativeDriver: true,
        }).start(() => {
          loadAndPlayAudio();
        });
      }
    }, FTUETiming.audioAutoPlayDelay);

    return () => clearTimeout(timer);
  }, [shouldShow]);

  const togglePlayback = async () => {
    if (!soundRef.current && !loadingRef.current) {
      // Sound not loaded yet — try loading and playing
      await loadAndPlayAudio();
      return;
    }
    if (!soundRef.current) return;

    try {
      if (isPlaying) {
        await soundRef.current.pauseAsync();
        setIsPlaying(false);
      } else {
        await soundRef.current.playAsync();
        setIsPlaying(true);
      }
    } catch (error) {
      console.warn('[WelcomeAudio] Toggle error:', error);
    }
  };

  const handleSkip = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync().catch(() => {});
    }
    doComplete();
  };

  if (!isVisible || !config) return null;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${Math.min(progress * 100, 100)}%` },
          ]}
        />
      </View>

      <View style={styles.controls}>
        {/* Play / Pause */}
        <Pressable
          style={styles.playButton}
          onPress={togglePlayback}
          accessibilityLabel={isPlaying ? 'Pause audio' : 'Play audio'}
          accessibilityRole="button"
        >
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={22}
            color={FTUEColors.audioText}
          />
        </Pressable>

        {/* Title & subtitle */}
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {config.title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {config.subtitle}
          </Text>
        </View>

        {/* Skip / Close */}
        <Pressable
          style={styles.skipButton}
          onPress={handleSkip}
          accessibilityLabel="Skip audio"
          accessibilityRole="button"
        >
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Platform.OS === 'web' ? 20 : 40,
    left: Spacing.md,
    right: Spacing.md,
    backgroundColor: FTUEColors.audioBg,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.elevated,
    zIndex: 1000,
  },
  progressBar: {
    height: FTUELayout.audioBarHeight,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  progressFill: {
    height: '100%',
    backgroundColor: FTUEColors.progressFill,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  playButton: {
    width: FTUELayout.audioButtonSize,
    height: FTUELayout.audioButtonSize,
    borderRadius: FTUELayout.audioButtonSize / 2,
    backgroundColor: FTUEColors.ctaBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  title: {
    fontFamily: FontFamilies.heading,
    fontSize: 15,
    color: FTUEColors.audioText,
  },
  subtitle: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 2,
  },
  skipButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  skipText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    color: 'rgba(255, 255, 255, 0.5)',
  },
});
