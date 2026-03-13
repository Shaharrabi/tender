/**
 * PatternResetPlayer — Full-screen guided reset audio player.
 *
 * Extracted from PatternReset so it can be reused by ResetLibrary.
 * Shows grounding text, breathing cue, breathing animation, and audio controls.
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  FadeIn,
  FadeInDown,
} from 'react-native-reanimated';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import {
  Colors,
  Spacing,
  FontFamilies,
  FontSizes,
  BorderRadius,
} from '@/constants/theme';
import { CloseIcon } from '@/assets/graphics/icons';
import {
  resolveResetAudio,
  type ActivationState,
  type ResetScript,
} from '@/utils/emergency/resetScripts';
import { audioManager } from '@/services/AudioManager';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

function formatTime(millis: number): string {
  const totalSec = Math.floor(millis / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

interface PatternResetPlayerProps {
  script: ResetScript;
  activationState: ActivationState;
  onClose: () => void;
}

export default function PatternResetPlayer({ script, activationState, onClose }: PatternResetPlayerProps) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const ownerId = useRef(`pattern-reset-${script.id}`).current;
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasFinished, setHasFinished] = useState(false);

  const bgColor = activationState === 'activated' ? '#1A1520' : '#151A22';
  const accentColor = activationState === 'activated' ? '#E8A87C' : '#89B0D0';

  // Breathing animation
  const breathe = useSharedValue(1);

  useEffect(() => {
    if (isPlaying) {
      breathe.value = withRepeat(
        withSequence(
          withTiming(1.25, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
          withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      );
    } else {
      breathe.value = withTiming(1, { duration: 500 });
    }
  }, [isPlaying]);

  const breatheStyle = useAnimatedStyle(() => ({
    transform: [{ scale: breathe.value }],
    opacity: 0.15 + (breathe.value - 1) * 0.6,
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

  // Auto-load and play on mount
  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        await audioManager.stopCurrent(ownerId);

        const source = resolveResetAudio(script.filePath);
        if (!source) {
          setIsLoading(false);
          return;
        }

        const { sound } = await Audio.Sound.createAsync(
          source,
          { shouldPlay: true, volume: 1.0 },
          onPlaybackStatusUpdate
        );

        if (isMounted) {
          soundRef.current = sound;
          setIsLoading(false);
          await audioManager.register(sound, ownerId);
        } else {
          sound.unloadAsync();
        }
      } catch (err) {
        console.warn('[PatternResetPlayer] Failed to load:', script.id, err);
        if (isMounted) setIsLoading(false);
      }
    })();

    return () => {
      isMounted = false;
      soundRef.current?.unloadAsync();
      audioManager.unregister(ownerId);
    };
  }, [script]);

  const handlePlayPause = useCallback(async () => {
    if (!soundRef.current) return;
    const status = await soundRef.current.getStatusAsync();
    if (!status.isLoaded) return;

    if (status.isPlaying) {
      await soundRef.current.pauseAsync();
    } else {
      await audioManager.stopCurrent(ownerId);
      if (status.didJustFinish) {
        await soundRef.current.setPositionAsync(0);
        setHasFinished(false);
      }
      await soundRef.current.playAsync();
      await audioManager.register(soundRef.current, ownerId);
    }
  }, [ownerId]);

  const handleCloseAndStop = useCallback(async () => {
    await soundRef.current?.stopAsync();
    await soundRef.current?.unloadAsync();
    onClose();
  }, [onClose]);

  const progress = duration > 0 ? position / duration : 0;
  const playIconName: keyof typeof Ionicons.glyphMap = isPlaying ? 'pause' : hasFinished ? 'refresh' : 'play';

  return (
    <View style={[styles.playerContainer, { backgroundColor: bgColor }]}>
      {/* Breathing background circle */}
      <Animated.View
        style={[
          styles.breathCircle,
          { backgroundColor: accentColor },
          breatheStyle,
        ]}
      />

      {/* Close button */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={handleCloseAndStop}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Close reset"
      >
        <CloseIcon size={20} color="#FFFFFF80" />
      </TouchableOpacity>

      {/* Content */}
      <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.playerContent}>
        <Text style={[styles.playerTitle, { color: accentColor }]}>
          {script.title}
        </Text>
        <Text style={styles.playerTagline}>{script.tagline}</Text>

        <Text style={styles.bodyText}>{script.bodyText}</Text>

        <Animated.View
          entering={FadeInDown.duration(400).delay(600)}
          style={[styles.breathingCard, { borderColor: accentColor + '40' }]}
        >
          <Text style={[styles.breathingCue, { color: accentColor }]}>
            {script.breathingCue}
          </Text>
        </Animated.View>

        {/* Player controls */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity
            onPress={handlePlayPause}
            activeOpacity={0.7}
            disabled={isLoading}
            accessibilityRole="button"
            accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
          >
            <View style={[styles.playButton, { borderColor: accentColor }]}>
              {isLoading ? (
                <ActivityIndicator size="small" color={accentColor} />
              ) : (
                <Ionicons name={playIconName} size={22} color={accentColor} />
              )}
            </View>
          </TouchableOpacity>

          <View style={styles.progressSection}>
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
                {duration > 0 ? formatTime(duration) : script.duration}
              </Text>
            </View>
          </View>
        </View>

        {/* Finished message */}
        {hasFinished && (
          <Animated.View entering={FadeIn.duration(400)}>
            <Text style={styles.finishedText}>
              Take a moment. When you're ready, you can return.
            </Text>
            <TouchableOpacity
              style={[styles.doneButton, { backgroundColor: accentColor + '25', borderColor: accentColor + '50' }]}
              onPress={handleCloseAndStop}
              activeOpacity={0.7}
            >
              <Text style={[styles.doneButtonText, { color: accentColor }]}>
                I'm ready to return
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  playerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    position: 'relative',
    overflow: 'hidden',
  },
  breathCircle: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_WIDTH * 0.8,
    borderRadius: SCREEN_WIDTH * 0.4,
    alignSelf: 'center',
    top: SCREEN_HEIGHT * 0.15,
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 24,
    zIndex: 10,
    padding: 8,
  },
  playerContent: {
    gap: Spacing.lg,
    alignItems: 'center',
    maxWidth: 400,
    zIndex: 1,
  },
  playerTitle: {
    fontFamily: FontFamilies.accent,
    fontSize: 28,
    textAlign: 'center',
  },
  playerTagline: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: '#FFFFFF80',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: -Spacing.sm,
  },
  bodyText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.body,
    color: '#FFFFFFCC',
    lineHeight: 26,
    textAlign: 'center',
  },
  breathingCard: {
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  breathingCue: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.body,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 24,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    width: '100%',
    marginTop: Spacing.md,
  },
  playButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressSection: {
    flex: 1,
    gap: 4,
  },
  progressTrack: {
    height: 4,
    backgroundColor: '#FFFFFF20',
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
    color: '#FFFFFF60',
    fontFamily: FontFamilies.body,
  },
  finishedText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: '#FFFFFF80',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  doneButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginTop: Spacing.md,
    alignSelf: 'center',
  },
  doneButtonText: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.body,
    fontWeight: '600',
    textAlign: 'center',
  },
});
