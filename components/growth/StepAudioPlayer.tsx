/**
 * StepAudioPlayer — Warm, Wes-Anderson-styled audio player
 * for step introduction tracks.
 *
 * Shows play/pause, progress bar, elapsed/total time,
 * and an animated breathing visual while playing.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
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
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
  Typography,
} from '@/constants/theme';

interface StepAudioPlayerProps {
  audioSource: any; // require() source
  title?: string;
  autoPlay?: boolean;
  onComplete?: () => void;
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
  onComplete,
  phaseColor = Colors.primary,
}: StepAudioPlayerProps) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasFinished, setHasFinished] = useState(false);

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

  const loadAndPlay = useCallback(async () => {
    if (soundRef.current) {
      // Already loaded — just toggle
      const status = await soundRef.current.getStatusAsync();
      if (status.isLoaded) {
        if (status.isPlaying) {
          await soundRef.current.pauseAsync();
        } else {
          if (status.didJustFinish) {
            await soundRef.current.setPositionAsync(0);
            setHasFinished(false);
          }
          await soundRef.current.playAsync();
        }
        return;
      }
    }

    setIsLoading(true);
    try {
      const { sound } = await Audio.Sound.createAsync(
        audioSource,
        { shouldPlay: true, volume: 1.0 },
        onPlaybackStatusUpdate
      );
      soundRef.current = sound;
      setIsLoaded(true);
    } catch (err) {
      console.warn('[StepAudioPlayer] Failed to load:', err);
    } finally {
      setIsLoading(false);
    }
  }, [audioSource, onPlaybackStatusUpdate]);

  // Auto-play if requested
  useEffect(() => {
    if (autoPlay) {
      loadAndPlay();
    }
    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  const progress = duration > 0 ? position / duration : 0;

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
              <Text style={[styles.playIcon, { color: phaseColor }]}>
                {isPlaying ? '\u23F8' : hasFinished ? '\u21BB' : '\u25B6'}
              </Text>
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
});
