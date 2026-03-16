/**
 * Onboarding — Ready Screen
 *
 * Final screen with personalized audio welcome and cinematic background.
 * Plays welcome.mp3 or single.mp3 based on relationship status.
 * Shows personalized message, then "Let's begin" button
 * that marks onboarding complete and routes to the main app.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  interpolate,
  FadeIn,
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/context/AuthContext';
import { useOnboarding } from '@/context/OnboardingContext';
import { SoundHaptics } from '@/services/SoundHapticsService';
import { supabase } from '@/services/supabase';
import { setupDemoPartnerCouple } from '@/services/couples';
import { seedDyadicAssessments } from '@/utils/demo-data';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  ButtonSizes,
  BorderRadius,
} from '@/constants/theme';
import { LeafIcon } from '@/assets/graphics/icons';

const { width: W, height: H } = Dimensions.get('window');

// ─── Breathing Circle ───────────────────────────────────

function BreathingCircle({
  x, y, size, color, duration, delay,
}: {
  x: number; y: number; size: number; color: string; duration: number; delay: number;
}) {
  const scale = useSharedValue(0.6);
  const fadeIn = useSharedValue(0);

  useEffect(() => {
    fadeIn.value = withDelay(delay, withTiming(1, { duration: 3000, easing: Easing.out(Easing.quad) }));
    scale.value = withDelay(delay, withRepeat(
      withSequence(
        withTiming(1, { duration, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.6, { duration, easing: Easing.inOut(Easing.sin) })
      ), -1, false
    ));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: fadeIn.value * 0.5,
  }));

  return (
    <Animated.View
      style={[{
        position: 'absolute', left: x - size / 2, top: y - size / 2,
        width: size, height: size, borderRadius: size / 2, backgroundColor: color,
      }, animatedStyle]}
    />
  );
}

// ─── Sweeping Line ──────────────────────────────────────

function SweepingLine({
  y, color, thickness, duration, delay, direction,
}: {
  y: number; color: string; thickness: number; duration: number; delay: number; direction: 'left' | 'right';
}) {
  const progress = useSharedValue(0);
  const fadeIn = useSharedValue(0);

  useEffect(() => {
    fadeIn.value = withDelay(delay, withTiming(1, { duration: 2000, easing: Easing.out(Easing.quad) }));
    progress.value = withDelay(delay, withRepeat(
      withTiming(1, { duration, easing: Easing.inOut(Easing.quad) }), -1, true
    ));
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      progress.value, [0, 1],
      direction === 'right' ? [-W * 0.3, W * 0.3] : [W * 0.3, -W * 0.3]
    );
    return { transform: [{ translateX }], opacity: fadeIn.value * 0.7 };
  });

  return (
    <Animated.View
      style={[{
        position: 'absolute', top: y, left: -W * 0.15,
        width: W * 1.3, height: thickness, backgroundColor: color, borderRadius: thickness / 2,
      }, animatedStyle]}
    />
  );
}

// ─── Floating Dot ───────────────────────────────────────

function FloatingDot({
  x, y, size, color, duration, delay,
}: {
  x: number; y: number; size: number; color: string; duration: number; delay: number;
}) {
  const progress = useSharedValue(0);
  const fadeIn = useSharedValue(0);

  useEffect(() => {
    fadeIn.value = withDelay(delay, withTiming(1, { duration: 2500, easing: Easing.out(Easing.quad) }));
    progress.value = withDelay(delay, withRepeat(
      withTiming(1, { duration, easing: Easing.inOut(Easing.sin) }), -1, true
    ));
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(progress.value, [0, 1], [-12, 12]);
    const translateX = interpolate(progress.value, [0, 1], [-6, 6]);
    return { transform: [{ translateY }, { translateX }], opacity: fadeIn.value * 0.8 };
  });

  return (
    <Animated.View
      style={[{
        position: 'absolute', left: x, top: y,
        width: size, height: size, borderRadius: size / 2, backgroundColor: color,
      }, animatedStyle]}
    />
  );
}

// ─── Ready Screen ───────────────────────────────────────

export default function ReadyScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { data: onboardingData } = useOnboarding();
  const soundRef = useRef<Audio.Sound | null>(null);
  const mountedRef = useRef(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const isSingle = onboardingData.relationshipStatus === 'single';

  // Choose audio based on relationship status
  const audioSource = isSingle
    ? require('@/assets/audio/single.mp3')
    : require('@/assets/audio/welcome.mp3');

  // Stop and fully unload audio
  const stopAudio = useCallback(async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync().catch(() => {});
        await soundRef.current.unloadAsync().catch(() => {});
      } catch {}
      soundRef.current = null;
    }
    setIsPlaying(false);
    // Reset audio mode back to normal (native only)
    if (Platform.OS !== 'web') {
      Audio.setAudioModeAsync({
        playsInSilentModeIOS: false,
        staysActiveInBackground: false,
      }).catch(() => {});
    }
  }, []);

  // Load and play audio
  useEffect(() => {
    let isMounted = true;

    const loadAudio = async () => {
      try {
        if (Platform.OS !== 'web') {
          await Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            staysActiveInBackground: false,
          });
        }

        const { sound } = await Audio.Sound.createAsync(
          audioSource,
          { shouldPlay: false }
        );

        if (!isMounted) {
          await sound.unloadAsync();
          return;
        }

        soundRef.current = sound;

        sound.setOnPlaybackStatusUpdate((status) => {
          if (!mountedRef.current) return;
          if (status.isLoaded) {
            setIsPlaying(status.isPlaying);
            // Auto-clear when playback finishes
            if (status.didJustFinish) {
              setIsPlaying(false);
            }
          }
        });

        // Play after visuals settle
        setTimeout(async () => {
          if (isMounted && soundRef.current) {
            try {
              await soundRef.current.playAsync();
            } catch {
              // Sound may have been unloaded
            }
          }
        }, 1500);
      } catch (err) {
        console.warn('[Ready] Audio load failed:', err);
      }
    };

    loadAudio();

    return () => {
      isMounted = false;
      mountedRef.current = false;
      if (soundRef.current) {
        soundRef.current.stopAsync().catch(() => {});
        soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }
    };
  }, []);

  const handleLetsGo = async () => {
    // Stop audio and prevent further state updates
    mountedRef.current = false;
    await stopAudio();

    SoundHaptics.success();

    // Save all onboarding data + mark complete
    if (user) {
      try {
        // Pick up the name stashed during registration
        let displayName: string | null = null;
        try {
          displayName = await AsyncStorage.getItem('pending_display_name');
        } catch (e) {
          console.warn('[Ready] Failed to read pending_display_name:', e);
        }

        console.log('[Ready] Saving onboarding data for user:', user.id, 'displayName:', displayName);

        const upsertPayload: Record<string, any> = {
          user_id: user.id,
          onboarding_completed_at: new Date().toISOString(),
          relationship_status: onboardingData.relationshipStatus || null,
          relationship_duration: onboardingData.relationshipDuration || null,
          goals: onboardingData.goals.length > 0 ? onboardingData.goals : null,
          time_commitment: onboardingData.timeCommitment || null,
          relationship_mode: onboardingData.relationshipMode || 'solo',
          demo_partner_id: onboardingData.demoPartnerId || null,
        };

        // Only include display_name if we have one
        if (displayName) {
          upsertPayload.display_name = displayName;
        }

        const { error: upsertError } = await supabase
          .from('user_profiles')
          .upsert(upsertPayload, { onConflict: 'user_id' });

        if (upsertError) {
          console.error('[Ready] Upsert error:', upsertError);
        } else {
          console.log('[Ready] Onboarding data saved successfully');
        }

        // Clean up the stashed name
        if (displayName) {
          await AsyncStorage.removeItem('pending_display_name').catch(() => {});
        }

        // Demo partner mode: auto-create a virtual partner
        const mode = onboardingData.relationshipMode || 'solo';
        if (mode === 'demo_partner') {
          try {
            const partnerId = onboardingData.demoPartnerId || 'secure_explorer';
            await supabase
              .from('user_profiles')
              .update({ demo_partner_id: partnerId })
              .eq('user_id', user.id);

            const couple = await setupDemoPartnerCouple(user.id);
            if (couple) {
              await seedDyadicAssessments(couple.id, user.id, user.id);
              console.log('[Ready] Demo mode: virtual partner connected');
            }
          } catch (demoErr) {
            console.warn('[Ready] Demo partner setup failed (non-critical):', demoErr);
          }
        }
      } catch (err) {
        console.error('[Ready] Failed to save onboarding data:', err);
      }
    } else {
      console.warn('[Ready] No user available — onboarding data not saved!');
    }
    router.replace('/(app)/home');
  };

  return (
    <View style={styles.container}>
      {/* ═══ Animated Background Canvas ═══ */}
      <View style={styles.canvas}>
        <BreathingCircle x={W * 0.15} y={H * 0.2} size={220} color={Colors.primaryFaded} duration={6000} delay={0} />
        <BreathingCircle x={W * 0.85} y={H * 0.35} size={180} color={Colors.secondaryLight} duration={7000} delay={1000} />
        <BreathingCircle x={W * 0.5} y={H * 0.75} size={260} color={Colors.primaryLight} duration={8000} delay={500} />
        <BreathingCircle x={W * 0.2} y={H * 0.65} size={140} color={Colors.accentCream} duration={5500} delay={1500} />
        <BreathingCircle x={W * 0.8} y={H * 0.85} size={160} color={Colors.secondaryLight} duration={6500} delay={800} />

        <SweepingLine y={H * 0.18} color={Colors.primaryLight} thickness={2.5} duration={14000} delay={200} direction="right" />
        <SweepingLine y={H * 0.38} color={Colors.secondary} thickness={1.5} duration={18000} delay={600} direction="left" />
        <SweepingLine y={H * 0.55} color={Colors.accentGold} thickness={2} duration={16000} delay={1000} direction="right" />
        <SweepingLine y={H * 0.72} color={Colors.primary} thickness={1.5} duration={20000} delay={400} direction="left" />
        <SweepingLine y={H * 0.88} color={Colors.primaryFaded} thickness={3} duration={12000} delay={1200} direction="right" />

        <FloatingDot x={W * 0.1} y={H * 0.12} size={8} color={Colors.accentGold} duration={4000} delay={300} />
        <FloatingDot x={W * 0.7} y={H * 0.15} size={6} color={Colors.primary} duration={5000} delay={700} />
        <FloatingDot x={W * 0.3} y={H * 0.42} size={7} color={Colors.secondary} duration={4500} delay={1100} />
        <FloatingDot x={W * 0.85} y={H * 0.52} size={5} color={Colors.accentGold} duration={3800} delay={500} />
        <FloatingDot x={W * 0.55} y={H * 0.68} size={9} color={Colors.primaryLight} duration={5500} delay={900} />
        <FloatingDot x={W * 0.15} y={H * 0.82} size={6} color={Colors.secondary} duration={4200} delay={1300} />
        <FloatingDot x={W * 0.65} y={H * 0.92} size={7} color={Colors.accentCream} duration={4800} delay={600} />
        <FloatingDot x={W * 0.45} y={H * 0.28} size={5} color={Colors.primary} duration={3500} delay={1500} />
      </View>

      {/* ═══ Content ═══ */}
      <View style={styles.content}>
        {/* Icon */}
        <Animated.View entering={FadeIn.duration(1500)} style={styles.iconSection}>
          <LeafIcon size={56} color={Colors.primary} />
        </Animated.View>

        {/* Personalized welcome */}
        <Animated.View entering={FadeInDown.duration(1200).delay(500)}>
          {isSingle ? (
            <Text style={styles.welcomeText}>
              Welcome to a space{'\n'}built for you.
            </Text>
          ) : (
            <Text style={styles.welcomeText}>
              Welcome to a space{'\n'}built for your relationship.
            </Text>
          )}
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(1200).delay(1000)}>
          <Text style={styles.title}>You're ready.</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(1200).delay(1500)}>
          <Text style={styles.submessage}>
            We'll start with a gentle assessment{'\n'}
            to understand how you connect.
          </Text>
        </Animated.View>

        {/* Audio indicator — always rendered to prevent layout bounce */}
        <View style={[styles.audioIndicator, { opacity: isPlaying ? 1 : 0 }]}>
          <View style={styles.audioPulse} />
          <Text style={styles.audioText}>Listening...</Text>
        </View>
      </View>

      {/* Bottom section */}
      <Animated.View entering={FadeIn.duration(1000).delay(2500)} style={styles.bottomSection}>
        <Text style={styles.disclaimerNote}>
          Tender is a wellness tool, not therapy. If you need clinical
          support, please reach out to a licensed professional.
        </Text>
        <TouchableOpacity
          style={styles.letsGoButton}
          onPress={handleLetsGo}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Let's begin"
        >
          <Text style={styles.letsGoText}>Let's begin →</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  canvas: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  iconSection: {
    marginBottom: Spacing.lg,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 22,
    fontFamily: FontFamilies.heading,
    fontWeight: '500',
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 36,
    fontFamily: FontFamilies.heading,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  submessage: {
    fontSize: FontSizes.body,
    fontFamily: 'JosefinSans_400Regular',
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
  },
  audioIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xl,
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.pill,
  },
  audioPulse: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  audioText: {
    fontSize: FontSizes.caption,
    fontFamily: 'JosefinSans_400Regular',
    color: Colors.textSecondary,
    letterSpacing: 0.5,
  },
  bottomSection: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? 50 : 30,
  },
  disclaimerNote: {
    fontSize: FontSizes.caption,
    fontFamily: 'JosefinSans_300Light',
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 17,
    marginBottom: Spacing.md,
  },
  letsGoButton: {
    backgroundColor: Colors.primary,
    height: ButtonSizes.large + 8,
    borderRadius: BorderRadius.pill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  letsGoText: {
    color: Colors.white,
    fontSize: FontSizes.headingM,
    fontFamily: FontFamilies.heading,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
