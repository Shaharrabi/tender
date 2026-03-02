/**
 * Welcome Screen — Audio welcome + animated background.
 *
 * Cinematic first impression. Slowly breathing circles and
 * drifting lines create a living canvas behind the brand.
 * Audio plays automatically; auto-advances when done.
 *
 * Aesthetic: Wes Anderson — Grand Budapest meets Moonrise Kingdom.
 * Warm parchment, dusty rose orbs, lobby blue sweeps, gold threads.
 */

import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
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
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
} from '@/constants/theme';

const { width: W, height: H } = Dimensions.get('window');

// ─── Breathing Circle ───────────────────────────────────

function BreathingCircle({
  x,
  y,
  size,
  color,
  duration,
  delay,
}: {
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
}) {
  const scale = useSharedValue(0.6);
  const fadeIn = useSharedValue(0);

  useEffect(() => {
    fadeIn.value = withDelay(
      delay,
      withTiming(1, { duration: 3000, easing: Easing.out(Easing.quad) })
    );
    scale.value = withDelay(
      delay,
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

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: fadeIn.value * 0.5,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: x - size / 2,
          top: y - size / 2,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        animatedStyle,
      ]}
    />
  );
}

// ─── Sweeping Line ──────────────────────────────────────

function SweepingLine({
  y,
  color,
  thickness,
  duration,
  delay,
  direction,
}: {
  y: number;
  color: string;
  thickness: number;
  duration: number;
  delay: number;
  direction: 'left' | 'right';
}) {
  const progress = useSharedValue(0);
  const fadeIn = useSharedValue(0);

  useEffect(() => {
    fadeIn.value = withDelay(
      delay,
      withTiming(1, { duration: 2000, easing: Easing.out(Easing.quad) })
    );
    progress.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration, easing: Easing.inOut(Easing.quad) }),
        -1,
        true
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      progress.value,
      [0, 1],
      direction === 'right' ? [-W * 0.3, W * 0.3] : [W * 0.3, -W * 0.3]
    );
    return {
      transform: [{ translateX }],
      opacity: fadeIn.value * 0.7,
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: y,
          left: -W * 0.15,
          width: W * 1.3,
          height: thickness,
          backgroundColor: color,
          borderRadius: thickness / 2,
        },
        animatedStyle,
      ]}
    />
  );
}

// ─── Floating Dot ───────────────────────────────────────

function FloatingDot({
  x,
  y,
  size,
  color,
  duration,
  delay,
}: {
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
}) {
  const progress = useSharedValue(0);
  const fadeIn = useSharedValue(0);

  useEffect(() => {
    fadeIn.value = withDelay(
      delay,
      withTiming(1, { duration: 2500, easing: Easing.out(Easing.quad) })
    );
    progress.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration, easing: Easing.inOut(Easing.sin) }),
        -1,
        true
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(progress.value, [0, 1], [-12, 12]);
    const translateX = interpolate(progress.value, [0, 1], [-6, 6]);
    return {
      transform: [{ translateY }, { translateX }],
      opacity: fadeIn.value * 0.8,
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: x,
          top: y,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        animatedStyle,
      ]}
    />
  );
}

// ─── Welcome Screen ─────────────────────────────────────

export default function WelcomeScreen() {
  const router = useRouter();

  const handleAdvance = useCallback(() => {
    router.push('/(onboarding)/status' as any);
  }, [router]);

  return (
    <View style={styles.container}>
      {/* ═══ Animated Background Canvas ═══ */}
      <View style={styles.canvas}>
        {/* Large breathing orbs — the dominant visual */}
        <BreathingCircle x={W * 0.15} y={H * 0.2} size={220} color={Colors.primaryFaded} duration={6000} delay={0} />
        <BreathingCircle x={W * 0.85} y={H * 0.35} size={180} color={Colors.secondaryLight} duration={7000} delay={1000} />
        <BreathingCircle x={W * 0.5} y={H * 0.75} size={260} color={Colors.primaryLight} duration={8000} delay={500} />
        <BreathingCircle x={W * 0.2} y={H * 0.65} size={140} color={Colors.accentCream} duration={5500} delay={1500} />
        <BreathingCircle x={W * 0.8} y={H * 0.85} size={160} color={Colors.secondaryLight} duration={6500} delay={800} />

        {/* Sweeping horizontal lines — slow, dreamy */}
        <SweepingLine y={H * 0.18} color={Colors.primaryLight} thickness={2.5} duration={14000} delay={200} direction="right" />
        <SweepingLine y={H * 0.38} color={Colors.secondary} thickness={1.5} duration={18000} delay={600} direction="left" />
        <SweepingLine y={H * 0.55} color={Colors.accentGold} thickness={2} duration={16000} delay={1000} direction="right" />
        <SweepingLine y={H * 0.72} color={Colors.primary} thickness={1.5} duration={20000} delay={400} direction="left" />
        <SweepingLine y={H * 0.88} color={Colors.primaryFaded} thickness={3} duration={12000} delay={1200} direction="right" />

        {/* Floating dots — tiny constellation details */}
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
        {/* Brand mark */}
        <Animated.View entering={FadeIn.duration(2500).delay(300)} style={styles.brandSection}>
          <Text style={styles.brandName}>Tender</Text>
          <View style={styles.brandDivider} />
          <Text style={styles.brandTagline}>The Science of Relationships</Text>
        </Animated.View>

        {/* Welcome message */}
        <Animated.View entering={FadeInDown.duration(1800).delay(1800)} style={styles.messageSection}>
          <Text style={styles.welcomeText}>
            A space for you and your{'\n'}relationships to grow.
          </Text>
          <Text style={styles.welcomeSubtext}>
            Let me show you around.
          </Text>
        </Animated.View>

      </View>

      {/* Skip — top right, subtle */}
      <Animated.View entering={FadeIn.duration(1000).delay(3000)}>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleAdvance}
          activeOpacity={0.6}
          accessibilityRole="button"
          accessibilityLabel="Skip welcome"
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Bottom CTA */}
      <Animated.View entering={FadeInUp.duration(1200).delay(3500)} style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleAdvance}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Continue"
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  canvas: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },

  // Content
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },

  // Brand
  brandSection: {
    alignItems: 'center',
    marginBottom: Spacing.xxl + Spacing.md,
  },
  brandName: {
    fontSize: 56,
    fontFamily: 'Jost_700Bold',
    color: Colors.text,
    letterSpacing: 3,
  },
  brandDivider: {
    width: 80,
    height: 2,
    backgroundColor: Colors.primary,
    marginVertical: Spacing.lg,
    borderRadius: 1,
  },
  brandTagline: {
    fontSize: FontSizes.body,
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    color: Colors.textSecondary,
    letterSpacing: 1.5,
  },

  // Welcome message
  messageSection: {
    alignItems: 'center',
    gap: Spacing.lg,
  },
  welcomeText: {
    fontSize: 22,
    fontFamily: FontFamilies.heading,
    fontWeight: '500',
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 32,
  },
  welcomeSubtext: {
    fontSize: FontSizes.body,
    fontFamily: 'JosefinSans_300Light',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
  },

  // Skip button
  skipButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    right: Spacing.xl,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  skipText: {
    fontSize: FontSizes.bodySmall,
    fontFamily: 'JosefinSans_500Medium',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },

  // Bottom CTA
  bottomSection: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 50 : 30,
    left: Spacing.xl,
    right: Spacing.xl,
  },
  continueButton: {
    backgroundColor: Colors.primary,
    height: 52,
    borderRadius: BorderRadius.pill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueText: {
    color: Colors.white,
    fontSize: FontSizes.body,
    fontFamily: 'Jost_600SemiBold',
    letterSpacing: 1,
  },
});
