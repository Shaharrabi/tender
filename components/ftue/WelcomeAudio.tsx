/**
 * WelcomeAudio — Floating audio player for first-time screen entry.
 *
 * Plays a welcome audio clip once per screen. Shows a compact player bar
 * with play/pause, progress, and skip controls. Auto-plays on mount,
 * fades out on completion or skip.
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
} from 'react-native';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
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
  BorderRadius,
  Shadows,
} from '@/constants/theme';

interface WelcomeAudioProps {
  /** Key into WELCOME_AUDIO_CONFIGS */
  screenKey: string;
}

export const WelcomeAudio: React.FC<WelcomeAudioProps> = ({ screenKey }) => {
  const { state, loading, markAudioHeard } = useFirstTime();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const mountedRef = useRef(true);

  const config = WELCOME_AUDIO_CONFIGS[screenKey];
  const alreadyHeard = state.heardAudios.includes(screenKey);

  // No config, no source, or already heard — don't render
  const shouldShow = config && config.source && !alreadyHeard && !loading;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Cleanup sound on unmount
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync().catch(() => {});
      }
    };
  }, [sound]);

  // Auto-play on first render
  useEffect(() => {
    if (!shouldShow) return;

    const timer = setTimeout(() => {
      if (mountedRef.current) {
        setIsVisible(true);
        // Fade in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: FTUETiming.audioFadeIn,
          useNativeDriver: true,
        }).start(() => {
          playAudio();
        });
      }
    }, FTUETiming.audioAutoPlayDelay);

    return () => clearTimeout(timer);
  }, [shouldShow]);

  const onPlaybackStatusUpdate = useCallback(
    (status: AVPlaybackStatus) => {
      if (!status.isLoaded) return;

      if (status.durationMillis && status.durationMillis > 0) {
        setProgress(status.positionMillis / status.durationMillis);
      }

      if (status.didJustFinish) {
        handleComplete();
      }
    },
    []
  );

  const playAudio = async () => {
    if (!config?.source) return;

    try {
      // Set audio mode for web compatibility
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      }).catch(() => {});

      const { sound: newSound } = await Audio.Sound.createAsync(
        config.source,
        { shouldPlay: true, volume: 1.0 },
        onPlaybackStatusUpdate
      );
      if (mountedRef.current) {
        setSound(newSound);
        setIsPlaying(true);
      } else {
        newSound.unloadAsync();
      }
    } catch (error) {
      console.warn('[WelcomeAudio] Playback error:', error);
      // Don't mark as complete on error — just hide silently so user can retry later
      setIsVisible(false);
    }
  };

  const handleComplete = useCallback(() => {
    setIsPlaying(false);
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

  const togglePlayback = async () => {
    if (!sound) {
      playAudio();
      return;
    }

    if (isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  const handleSkip = async () => {
    if (sound) {
      await sound.stopAsync().catch(() => {});
    }
    handleComplete();
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
    bottom: 100,
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
    ...Typography.bodyMedium,
    color: FTUEColors.audioText,
    fontSize: 15,
  },
  subtitle: {
    ...Typography.caption,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 2,
  },
  skipButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  skipText: {
    ...Typography.bodySmall,
    color: 'rgba(255, 255, 255, 0.5)',
  },
});
