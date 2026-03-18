/**
 * FoundationOverlay — Cinematic first-time audio experience.
 *
 * Plays "THE FOUNDATION.mp3" on first visit to the growth page.
 * Warm parchment backdrop, breathing circles, skip option.
 * Sets AsyncStorage flag so it only plays once.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
  FadeIn,
  FadeOut,
  interpolate,
} from 'react-native-reanimated';
import { Audio, AVPlaybackStatus } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Colors,
  Spacing,
  FontFamilies,
  FontSizes,
  Typography,
} from '@/constants/theme';
import { getCaptionAtTime } from '@/constants/foundation-transcript';

const { width: W, height: H } = Dimensions.get('window');
const STORAGE_KEY = 'has_heard_foundation';

interface FoundationOverlayProps {
  onDismiss: () => void;
}

// Breathing circle decoration
function BreathingOrb({
  x, y, size, color, delay: startDelay, duration,
}: {
  x: number; y: number; size: number; color: string; delay: number; duration: number;
}) {
  const scale = useSharedValue(0.6);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(
      startDelay,
      withTiming(0.3, { duration: 2000, easing: Easing.out(Easing.quad) })
    );
    scale.value = withDelay(
      startDelay,
      withRepeat(
        withSequence(
          withTiming(1, { duration, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.6, { duration, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      )
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    position: 'absolute',
    left: x - size / 2,
    top: y - size / 2,
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: color,
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return <Animated.View style={style} />;
}

export default function FoundationOverlay({ onDismiss }: FoundationOverlayProps) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [showSkip, setShowSkip] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [currentCaption, setCurrentCaption] = useState<string | null>(null);

  // Caption-only fallback when audio can't play (autoplay blocked, web errors)
  const captionTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startCaptionOnlyMode = useCallback(() => {
    let elapsed = 0;
    captionTimerRef.current = setInterval(() => {
      elapsed += 0.2;
      setCurrentCaption(getCaptionAtTime(elapsed));
      // Auto-complete after transcript ends (~110 seconds)
      if (elapsed > 112) {
        if (captionTimerRef.current) clearInterval(captionTimerRef.current);
        handleComplete();
      }
    }, 200);
  }, [handleComplete]);

  // Show skip after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowSkip(true), 5000);
    return () => {
      clearTimeout(timer);
      if (captionTimerRef.current) clearInterval(captionTimerRef.current);
    };
  }, []);

  const handleComplete = useCallback(async () => {
    if (isFinishing) return;
    setIsFinishing(true);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, 'true');
      await soundRef.current?.stopAsync();
      await soundRef.current?.unloadAsync();
    } catch {}
    // Brief delay for fade animation
    setTimeout(onDismiss, 400);
  }, [isFinishing, onDismiss]);

  // Web audio ref for HTML5 Audio fallback
  const webAudioRef = useRef<HTMLAudioElement | null>(null);
  const webTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Start audio — platform-aware
  useEffect(() => {
    let mounted = true;

    if (Platform.OS === 'web') {
      // Web: Use HTML5 Audio + polling for caption sync
      try {
        const audioPath = require('@/assets/audio/THE FOUNDATION.mp3');
        const audioUrl = typeof audioPath === 'string' ? audioPath : audioPath?.uri ?? audioPath?.default ?? audioPath;
        const audio = new window.Audio(audioUrl);
        webAudioRef.current = audio;
        audio.volume = 1.0;

        audio.addEventListener('ended', () => {
          if (mounted) handleComplete();
        });

        audio.addEventListener('error', () => {
          console.warn('[FoundationOverlay] Web audio failed');
          // Fallback: auto-advance captions without audio
          if (mounted) startCaptionOnlyMode();
        });

        audio.play().catch(() => {
          // Autoplay blocked — fall back to caption-only mode
          if (mounted) startCaptionOnlyMode();
        });

        // Poll for position to sync captions
        webTimerRef.current = setInterval(() => {
          if (!mounted || !audio) return;
          setCurrentCaption(getCaptionAtTime(audio.currentTime));
        }, 200);
      } catch (err) {
        console.warn('[FoundationOverlay] Web audio setup failed:', err);
        if (mounted) startCaptionOnlyMode();
      }
    } else {
      // Native: Use expo-av
      const play = async () => {
        try {
          const { sound } = await Audio.Sound.createAsync(
            require('@/assets/audio/THE FOUNDATION.mp3'),
            { shouldPlay: true, volume: 1.0 },
            (status: AVPlaybackStatus) => {
              if (!status.isLoaded) return;
              if (status.didJustFinish && mounted) {
                handleComplete();
                return;
              }
              if (status.positionMillis != null && mounted) {
                const posSeconds = status.positionMillis / 1000;
                setCurrentCaption(getCaptionAtTime(posSeconds));
              }
            }
          );
          if (mounted) {
            soundRef.current = sound;
          }
        } catch (err) {
          console.warn('[FoundationOverlay] Audio failed:', err);
          if (mounted) handleComplete();
        }
      };
      play();
    }

    return () => {
      mounted = false;
      // Cleanup native
      soundRef.current?.unloadAsync();
      // Cleanup web
      if (webAudioRef.current) {
        webAudioRef.current.pause();
        webAudioRef.current = null;
      }
      if (webTimerRef.current) {
        clearInterval(webTimerRef.current);
      }
    };
  }, []);

  // Progress pulsing ring
  const pulse = useSharedValue(0.8);
  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.8, { duration: 3000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: interpolate(pulse.value, [0.8, 1], [0.4, 0.7]),
  }));

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.backdrop}>
        {/* Decorative breathing orbs */}
        <BreathingOrb x={W * 0.2} y={H * 0.15} size={120} color={Colors.primaryLight} delay={0} duration={5000} />
        <BreathingOrb x={W * 0.75} y={H * 0.25} size={80} color={Colors.secondaryLight} delay={800} duration={6000} />
        <BreathingOrb x={W * 0.5} y={H * 0.7} size={100} color={Colors.primaryFaded} delay={1200} duration={4500} />
        <BreathingOrb x={W * 0.15} y={H * 0.6} size={60} color={Colors.accentCream} delay={600} duration={5500} />

        {/* Center content */}
        <Animated.View entering={FadeIn.delay(500).duration(1500)} style={styles.center}>
          {/* Pulsing ring */}
          <Animated.View style={[styles.pulseRing, pulseStyle]} />

          <Text style={styles.label}>THE FOUNDATION</Text>
          <Text style={styles.subtitle}>
            Understanding the Relational Field
          </Text>

          <View style={styles.listeningIndicator}>
            <View style={[styles.bar, { height: 12 }]} />
            <View style={[styles.bar, { height: 20 }]} />
            <View style={[styles.bar, { height: 16 }]} />
            <View style={[styles.bar, { height: 24 }]} />
            <View style={[styles.bar, { height: 14 }]} />
          </View>

          <Text style={styles.listenText}>
            {Platform.OS === 'web' ? 'Reading...' : 'Listening...'}
          </Text>
        </Animated.View>

        {/* Synced captions */}
        {currentCaption && (
          <Animated.View entering={FadeIn.duration(400)} exiting={FadeOut.duration(300)} style={styles.captionContainer}>
            <Text style={styles.captionText}>{currentCaption}</Text>
          </Animated.View>
        )}

        {/* Skip button */}
        {showSkip && (
          <Animated.View entering={FadeIn.duration(600)} style={styles.skipContainer}>
            <TouchableOpacity
              onPress={handleComplete}
              activeOpacity={0.7}
              style={styles.skipButton}
              accessibilityRole="button"
              accessibilityLabel="Skip foundation audio"
            >
              <Text style={styles.skipText}>Skip for now</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </Modal>
  );
}

/**
 * Check if Foundation has been heard before.
 * Uses AsyncStorage as a fast local cache, but also accepts a
 * server-side hint (e.g. user already has step progress) so the
 * audio doesn't replay on new devices or after cache clears.
 */
export async function hasHeardFoundation(serverHint?: boolean): Promise<boolean> {
  // If server says user has been here before, trust it
  if (serverHint === true) return true;
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEY);
    return value === 'true';
  } catch {
    return false;
  }
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    alignItems: 'center',
    gap: Spacing.md,
    zIndex: 10,
  },
  pulseRing: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: Colors.primary,
    position: 'absolute',
    top: -40,
  },
  label: {
    ...Typography.displayMedium,
    color: Colors.text,
    letterSpacing: 4,
    marginTop: 80,
  },
  subtitle: {
    ...Typography.serifItalic,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
    fontSize: 16,
  },
  listeningIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.lg,
  },
  bar: {
    width: 3,
    backgroundColor: Colors.primary,
    borderRadius: 2,
    opacity: 0.5,
  },
  listenText: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  captionContainer: {
    position: 'absolute',
    bottom: 130,
    left: Spacing.xl,
    right: Spacing.xl,
    alignItems: 'center',
    zIndex: 10,
  },
  captionText: {
    ...Typography.serifItalic,
    fontSize: FontSizes.body,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 26,
    opacity: 0.85,
  },
  skipContainer: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
  },
  skipButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  skipText: {
    ...Typography.buttonSmall,
    color: Colors.textMuted,
    letterSpacing: 1,
  },
});
