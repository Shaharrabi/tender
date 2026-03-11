/**
 * PortraitAudioCard — Single-track audio card for the Portrait Audio Library.
 *
 * Displays title, description, duration, and a play/pause button.
 * Uses expo-av for playback, same pattern as StepAudioPlayer.
 * Gracefully handles missing audio files (tracks not yet recorded).
 */

import React, { useRef, useState, useCallback, useEffect } from 'react';
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
import type { PortraitTrack } from '@/utils/audio/trackMetadata';
import { audioManager } from '@/services/AudioManager';

interface PortraitAudioCardProps {
  track: PortraitTrack;
  accentColor?: string;
  /** If true, show a compact inline layout instead of card */
  compact?: boolean;
}

function formatTime(millis: number): string {
  const totalSec = Math.floor(millis / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

/**
 * Attempt to resolve audio source. Returns undefined if file doesn't exist.
 * Audio files live at assets/audio/portrait/{filePath}.
 */
function resolveAudioSource(filePath: string): any | undefined {
  // Static require map — Metro bundler requires static string literals.
  const AUDIO_SOURCES: Record<string, any> = {
    // Tier 1: Orientation (everyone)
    'O-1.mp3': require('@/assets/audio/portrait/O-1.mp3'),
    'O-2.mp3': require('@/assets/audio/portrait/O-2.mp3'),
    'O-3.mp3': require('@/assets/audio/portrait/O-3.mp3'),
    'O-4.mp3': require('@/assets/audio/portrait/O-4.mp3'),
    'O-5.mp3': require('@/assets/audio/portrait/O-5.mp3'),
    // Tier 2: Attachment (1 of 4)
    'A-1.mp3': require('@/assets/audio/portrait/A-1.mp3'),
    'A-2.mp3': require('@/assets/audio/portrait/A-2.mp3'),
    'A-3.mp3': require('@/assets/audio/portrait/A-3.mp3'),
    'A-4.mp3': require('@/assets/audio/portrait/A-4.mp3'),
    // Tier 2: Cycle Position (1 of 3)
    'C-1.mp3': require('@/assets/audio/portrait/C-1.mp3'),
    'C-2.mp3': require('@/assets/audio/portrait/C-2.mp3'),
    'C-3.mp3': require('@/assets/audio/portrait/C-3.mp3'),
    // Tier 2: Window of Tolerance (1 of 3)
    'W-1.mp3': require('@/assets/audio/portrait/W-1.mp3'),
    'W-2.mp3': require('@/assets/audio/portrait/W-2.mp3'),
    'W-3.mp3': require('@/assets/audio/portrait/W-3.mp3'),
    // Tier 2: IFS Parts (1 of 3)
    'P-1.mp3': require('@/assets/audio/portrait/P-1.mp3'),
    'P-2.mp3': require('@/assets/audio/portrait/P-2.mp3'),
    'P-3.mp3': require('@/assets/audio/portrait/P-3.mp3'),
    // Tier 2: Detections (0-3 of 6)
    'D-1.mp3': require('@/assets/audio/portrait/D-1.mp3'),
    'D-2.mp3': require('@/assets/audio/portrait/D-2.mp3'),
    'D-3.mp3': require('@/assets/audio/portrait/D-3.mp3'),
    'D-4.mp3': require('@/assets/audio/portrait/D-4.mp3'),
    'D-5.mp3': require('@/assets/audio/portrait/D-5.mp3'),
    'D-6.mp3': require('@/assets/audio/portrait/D-6.mp3'),
    // Tier 3: Couple Dance (1 of 4)
    'CP-1.mp3': require('@/assets/audio/portrait/CP-1.mp3'),
    'CP-2.mp3': require('@/assets/audio/portrait/CP-2.mp3'),
    'CP-3.mp3': require('@/assets/audio/portrait/CP-3.mp3'),
    'CP-4.mp3': require('@/assets/audio/portrait/CP-4.mp3'),
    // Tier 3: Couple Constellation (1 of 3)
    'CC-1.mp3': require('@/assets/audio/portrait/CC-1.mp3'),
    'CC-2.mp3': require('@/assets/audio/portrait/CC-2.mp3'),
    'CC-3.mp3': require('@/assets/audio/portrait/CC-3.mp3'),
  };
  return AUDIO_SOURCES[filePath];
}

export default function PortraitAudioCard({
  track,
  accentColor = Colors.accent,
  compact = false,
}: PortraitAudioCardProps) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasFinished, setHasFinished] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const audioSource = resolveAudioSource(track.filePath);
  const isAvailable = !!audioSource;
  const ownerId = useRef(`portrait-audio-${track.id}`).current;

  // Breathing animation while playing
  const breathe = useSharedValue(1);

  useEffect(() => {
    if (isPlaying) {
      breathe.value = withRepeat(
        withSequence(
          withTiming(1.12, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
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
      }
    },
    [hasFinished]
  );

  const handlePlayPause = useCallback(async () => {
    if (!isAvailable) return;

    if (soundRef.current) {
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
      console.warn('[PortraitAudioCard] Failed to load:', track.id, err);
      setLoadError(true);
    } finally {
      setIsLoading(false);
    }
  }, [audioSource, isAvailable, onPlaybackStatusUpdate, track.id, ownerId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      soundRef.current?.unloadAsync();
      audioManager.unregister(ownerId);
    };
  }, []);

  const progress = duration > 0 ? position / duration : 0;

  // ── Play Button Icon ──
  const playIcon = isPlaying ? '\u23F8' : hasFinished ? '\u21BB' : '\u25B6';

  return (
    <View style={[styles.card, compact && styles.cardCompact]}>
      {/* Left: Play button */}
      <TouchableOpacity
        onPress={handlePlayPause}
        activeOpacity={0.7}
        disabled={isLoading || !isAvailable}
        accessibilityRole="button"
        accessibilityLabel={
          !isAvailable
            ? `${track.title} — coming soon`
            : isPlaying
              ? `Pause ${track.title}`
              : `Play ${track.title}`
        }
      >
        <Animated.View
          style={[
            styles.playButton,
            {
              backgroundColor: isAvailable ? accentColor + '15' : Colors.borderLight,
              borderColor: isAvailable ? accentColor + '40' : Colors.border,
            },
            isPlaying && breatheStyle,
          ]}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={accentColor} />
          ) : (
            <Text
              style={[
                styles.playIcon,
                { color: isAvailable ? accentColor : Colors.textMuted },
              ]}
            >
              {isAvailable ? playIcon : '\u25B6'}
            </Text>
          )}
        </Animated.View>
      </TouchableOpacity>

      {/* Right: Info */}
      <View style={styles.info}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {track.title}
          </Text>
          <Text style={styles.duration}>{track.duration}</Text>
        </View>

        {/* Description */}
        <Text style={styles.description} numberOfLines={2}>
          {track.description}
        </Text>

        {/* Progress bar (only when loaded) */}
        {isLoaded && (
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${progress * 100}%`, backgroundColor: accentColor },
                ]}
              />
            </View>
            <View style={styles.timeRow}>
              <Text style={styles.timeText}>{formatTime(position)}</Text>
              <Text style={styles.timeText}>
                {duration > 0 ? formatTime(duration) : '--:--'}
              </Text>
            </View>
          </View>
        )}

        {/* Coming soon badge */}
        {!isAvailable && !loadError && (
          <View style={styles.comingSoonBadge}>
            <Text style={styles.comingSoonText}>Coming Soon</Text>
          </View>
        )}

        {loadError && (
          <Text style={[styles.comingSoonText, { color: Colors.textMuted }]}>
            Unable to load audio
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  cardCompact: {
    padding: Spacing.sm,
    gap: Spacing.sm,
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    fontSize: 16,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  title: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.body,
    color: Colors.text,
    flex: 1,
  },
  duration: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
  },
  description: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  progressContainer: {
    marginTop: 4,
    gap: 2,
  },
  progressTrack: {
    height: 3,
    backgroundColor: Colors.borderLight,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: 3,
    borderRadius: 2,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 10,
    color: Colors.textMuted,
    fontFamily: FontFamilies.body,
  },
  comingSoonBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primaryFaded,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginTop: 2,
  },
  comingSoonText: {
    fontFamily: FontFamilies.body,
    fontSize: 11,
    color: Colors.primary,
    letterSpacing: 0.5,
  },
});
