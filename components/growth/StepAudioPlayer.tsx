/**
 * StepAudioPlayer — Warm, Wes-Anderson-styled audio player
 * for step introduction tracks.
 *
 * Shows play/pause, progress bar, elapsed/total time,
 * and an animated breathing visual while playing.
 *
 * When `alreadyHeard` is true, renders a compact single-line
 * "✓ Heard · Tap to replay" that expands to the full player on tap.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  LayoutAnimation,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  FadeIn,
} from 'react-native-reanimated';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
  Typography,
} from '@/constants/theme';
import { audioManager } from '@/services/AudioManager';

interface StepAudioPlayerProps {
  audioSource: any; // require() source
  title?: string;
  autoPlay?: boolean;
  alreadyHeard?: boolean;
  onComplete?: () => void;
  onFirstPlay?: () => void;
  phaseColor?: string;
}

function formatTime(millis: number): string {
  const totalSec = Math.floor(millis / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

export default function StepAudioPlayer({
  audioSource,
  title,
  autoPlay = false,
  alreadyHeard = false,
  onComplete,
  onFirstPlay,
  phaseColor = Colors.primary,
}: StepAudioPlayerProps) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasFinished, setHasFinished] = useState(false);
  const [collapsed, setCollapsed] = useState(alreadyHeard);
  const firstPlayFiredRef = useRef(false);

  // Breathing animation for the play button
  const breathe = useSharedValue(1);

  useEffect(() => {
    if (isPlaying) {
      breathe.value = withRepeat(
        withSequence(
          withTiming(1.15, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
          withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      );
    } else {
      breathe.value = withTiming(1, { duration: 300 });
    }
  }, [isPlaying]);

  const breatheStyle = useAnimatedStyle(() => ({
    transform: [{ scale: breathe.value }],
  }));

  const onPlaybackStatusUpdate = useCallback(
    (status: AVPlaybackStatus) => {
      if (!status.isLoaded) return;
      setPosition(status.positionMillis);
      setDuration(status.durationMillis ?? 0);
      setIsPlaying(status.isPlaying);

      if (status.didJustFinish && !hasFinished) {
        setHasFinished(true);
        onComplete?.();
      }
    },
    [hasFinished, onComplete]
  );

  const ownerId = useRef(`step-audio-${Date.now()}`).current;

  const loadAndPlay = useCallback(async () => {
    // Fire onFirstPlay callback the first time play is tapped
    if (!firstPlayFiredRef.current) {
      firstPlayFiredRef.current = true;
      onFirstPlay?.();
    }

    if (soundRef.current) {
      // Already loaded — just toggle
      const status = await soundRef.current.getStatusAsync();
      if (status.isLoaded) {
        if (status.isPlaying) {
          await soundRef.current.pauseAsync();
        } else {
          // Stop any other audio playing in the app
          await audioManager.stopCurrent(ownerId);
          if (status.didJustFinish) {
            await soundRef.current.setPositionAsync(0);
            setHasFinished(false);
          }
          await soundRef.current.playAsync();
          await audioManager.register(soundRef.current, ownerId);
        }
        return;
      }
    }

    // Stop any other audio playing in the app
    await audioManager.stopCurrent(ownerId);

    setIsLoading(true);
    try {
      const { sound } = await Audio.Sound.createAsync(
        audioSource,
        { shouldPlay: true, volume: 1.0 },
        onPlaybackStatusUpdate
      );
      soundRef.current = sound;
      setIsLoaded(true);
      await audioManager.register(sound, ownerId);
    } catch (err) {
      console.warn('[StepAudioPlayer] Failed to load:', err);
    } finally {
      setIsLoading(false);
    }
  }, [audioSource, onPlaybackStatusUpdate, ownerId, onFirstPlay]);

  // Auto-play if requested
  useEffect(() => {
    if (autoPlay) {
      loadAndPlay();
    }
    return () => {
      soundRef.current?.stopAsync().then(() => soundRef.current?.unloadAsync()).catch(() => {});
      audioManager.unregister(ownerId);
    };
  }, []);

  // Pause audio when screen loses focus (navigating back, switching tabs)
  useFocusEffect(
    useCallback(() => {
      return () => {
        // Screen blurred — pause and unload audio
        if (soundRef.current) {
          soundRef.current.pauseAsync().catch(() => {});
        }
      };
    }, [])
  );

  const progress = duration > 0 ? position / duration : 0;

  // ── Collapsed "already heard" state ──
  if (collapsed && !isPlaying && !isLoaded) {
    return (
      <TouchableOpacity
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setCollapsed(false);
        }}
        activeOpacity={0.7}
        style={styles.collapsedContainer}
        accessibilityRole="button"
        accessibilityLabel="Introduction already heard. Tap to replay."
      >
        <Text style={[styles.collapsedCheck, { color: phaseColor }]}>✓</Text>
        <Text style={styles.collapsedText}>Introduction heard</Text>
        <Text style={styles.collapsedReplay}>Tap to replay</Text>
      </TouchableOpacity>
    );
  }

  return (
    <Animated.View entering={FadeIn.duration(400)} style={styles.container}>
      {title && (
        <Text style={styles.title}>{title}</Text>
      )}

      <View style={styles.playerRow}>
        {/* Play/Pause Button */}
        <TouchableOpacity
          onPress={loadAndPlay}
          activeOpacity={0.7}
          disabled={isLoading}
          accessibilityRole="button"
          accessibilityLabel={isPlaying ? 'Pause audio' : hasFinished ? 'Replay audio' : 'Play audio'}
          accessibilityState={{ disabled: isLoading }}
        >
          <Animated.View
            style={[
              styles.playButton,
              { backgroundColor: phaseColor + '18', borderColor: phaseColor },
              breatheStyle,
            ]}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={phaseColor} />
            ) : (
              <Ionicons
                name={isPlaying ? 'pause' : hasFinished ? 'refresh' : 'play'}
                size={20}
                color={phaseColor}
              />
            )}
          </Animated.View>
        </TouchableOpacity>

        {/* Progress + Time */}
        <View style={styles.progressSection}>
          {/* Progress bar */}
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progress * 100}%`,
                  backgroundColor: phaseColor,
                },
              ]}
            />
          </View>

          {/* Time labels */}
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>{formatTime(position)}</Text>
            <Text style={styles.timeText}>
              {duration > 0 ? formatTime(duration) : '--:--'}
            </Text>
          </View>
        </View>
      </View>

      {!isLoaded && !isLoading && (
        <Text style={styles.hint}>Tap to listen to the introduction</Text>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
    ...Shadows.subtle,
  },
  title: {
    ...Typography.label,
    color: Colors.textMuted,
    letterSpacing: 1.5,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    fontSize: 18,
  },
  progressSection: {
    flex: 1,
    gap: 4,
  },
  progressTrack: {
    height: 4,
    backgroundColor: Colors.borderLight,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontFamily: FontFamilies.body,
  },
  hint: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  // ── Collapsed state ──
  collapsedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    gap: Spacing.xs,
    ...Shadows.subtle,
  },
  collapsedCheck: {
    fontSize: 14,
    fontWeight: '600',
  },
  collapsedText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    fontFamily: FontFamilies.body,
    flex: 1,
  },
  collapsedReplay: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
});
