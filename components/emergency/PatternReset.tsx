/**
 * PatternReset — Emergency pattern-interrupt component.
 *
 * Two-phase interaction:
 *   1. Compact trigger bar with two buttons: "I'm activated" / "I'm shut down"
 *   2. Tapping either opens a full-screen guided reset player with:
 *      - Matched audio (based on cyclePosition + activation state)
 *      - Grounding text + breathing cue
 *      - Progress bar + close button
 *
 * Uses portrait.negativeCycle.position for personalized reset selection.
 * Falls back to generic resets if no portrait exists.
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
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
  FadeOut,
} from 'react-native-reanimated';
import { Audio, AVPlaybackStatus } from 'expo-av';
import {
  Colors,
  Spacing,
  FontFamilies,
  FontSizes,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import {
  HeartPulseIcon,
  CloseIcon,
  SnowflakeIcon,
  FireIcon,
} from '@/assets/graphics/icons';
import type { IndividualPortrait } from '@/types/portrait';
import {
  selectResetScript,
  resolveResetAudio,
  type ActivationState,
  type ResetScript,
} from '@/utils/emergency/resetScripts';

interface PatternResetProps {
  portrait: IndividualPortrait | null;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

function formatTime(millis: number): string {
  const totalSec = Math.floor(millis / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

export default function PatternReset({ portrait }: PatternResetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeScript, setActiveScript] = useState<ResetScript | null>(null);
  const [activationState, setActivationState] = useState<ActivationState | null>(null);

  const handleActivated = useCallback(() => {
    const script = selectResetScript('activated', portrait);
    setActiveScript(script);
    setActivationState('activated');
    setIsOpen(true);
  }, [portrait]);

  const handleShutdown = useCallback(() => {
    const script = selectResetScript('shutdown', portrait);
    setActiveScript(script);
    setActivationState('shutdown');
    setIsOpen(true);
  }, [portrait]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setActiveScript(null);
    setActivationState(null);
  }, []);

  return (
    <>
      {/* ── Compact Trigger Bar ── */}
      <Animated.View entering={FadeIn.duration(400)} style={styles.triggerBar}>
        <View style={styles.triggerHeader}>
          <HeartPulseIcon size={14} color={Colors.accent} />
          <Text style={styles.triggerLabel}>PATTERN RESET</Text>
        </View>

        <View style={styles.triggerButtons}>
          <TouchableOpacity
            style={[styles.triggerButton, styles.activatedButton]}
            onPress={handleActivated}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="I'm activated — start calming reset"
          >
            <FireIcon size={14} color={'#B85C38'} />
            <Text style={[styles.triggerButtonText, styles.activatedText]}>
              I'm activated
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.triggerButton, styles.shutdownButton]}
            onPress={handleShutdown}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="I'm shut down — start warming reset"
          >
            <SnowflakeIcon size={14} color={Colors.calm} />
            <Text style={[styles.triggerButtonText, styles.shutdownText]}>
              I'm shut down
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* ── Full-Screen Reset Player ── */}
      {isOpen && activeScript && (
        <Modal
          visible={isOpen}
          animationType="slide"
          presentationStyle="fullScreen"
          onRequestClose={handleClose}
        >
          <ResetPlayer
            script={activeScript}
            activationState={activationState!}
            onClose={handleClose}
          />
        </Modal>
      )}
    </>
  );
}

// ─── Full-Screen Reset Player ───────────────────────────

interface ResetPlayerProps {
  script: ResetScript;
  activationState: ActivationState;
  onClose: () => void;
}

function ResetPlayer({ script, activationState, onClose }: ResetPlayerProps) {
  const soundRef = useRef<Audio.Sound | null>(null);
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
        } else {
          sound.unloadAsync();
        }
      } catch (err) {
        console.warn('[PatternReset] Failed to load:', script.id, err);
        if (isMounted) setIsLoading(false);
      }
    })();

    return () => {
      isMounted = false;
      soundRef.current?.unloadAsync();
    };
  }, [script]);

  const handlePlayPause = useCallback(async () => {
    if (!soundRef.current) return;
    const status = await soundRef.current.getStatusAsync();
    if (!status.isLoaded) return;

    if (status.isPlaying) {
      await soundRef.current.pauseAsync();
    } else {
      if (status.didJustFinish) {
        await soundRef.current.setPositionAsync(0);
        setHasFinished(false);
      }
      await soundRef.current.playAsync();
    }
  }, []);

  const handleCloseAndStop = useCallback(async () => {
    await soundRef.current?.stopAsync();
    await soundRef.current?.unloadAsync();
    onClose();
  }, [onClose]);

  const progress = duration > 0 ? position / duration : 0;
  const playIcon = isPlaying ? '\u23F8' : hasFinished ? '\u21BB' : '\u25B6';

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
        {/* Title */}
        <Text style={[styles.playerTitle, { color: accentColor }]}>
          {script.title}
        </Text>
        <Text style={styles.playerTagline}>{script.tagline}</Text>

        {/* Grounding text */}
        <Text style={styles.bodyText}>{script.bodyText}</Text>

        {/* Breathing cue */}
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
          {/* Play/Pause */}
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
                <Text style={[styles.playIcon, { color: accentColor }]}>
                  {playIcon}
                </Text>
              )}
            </View>
          </TouchableOpacity>

          {/* Progress bar */}
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

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  // ── Trigger bar (home screen) ──
  triggerBar: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
    ...Shadows.card,
  },
  triggerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  triggerLabel: {
    fontFamily: FontFamilies.body,
    fontSize: 10,
    color: Colors.textMuted,
    letterSpacing: 1.5,
  },
  triggerButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  triggerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  activatedButton: {
    backgroundColor: '#FFF0E6',
    borderColor: '#E8A87C40',
  },
  shutdownButton: {
    backgroundColor: '#E8F0F8',
    borderColor: '#89B0D040',
  },
  triggerButtonText: {
    fontFamily: FontFamilies.heading,
    fontSize: 13,
    fontWeight: '600',
  },
  activatedText: {
    color: '#B85C38',
  },
  shutdownText: {
    color: '#4A6FA5',
  },

  // ── Full-screen player ──
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

  // ── Player controls ──
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
  playIcon: {
    fontSize: 20,
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

  // ── Finished state ──
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
