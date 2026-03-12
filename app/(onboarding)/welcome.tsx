/**
 * Welcome Screen — Clean brand introduction.
 *
 * Simple, elegant first impression with the brand name and tagline.
 * No audio, no animated canvas — just a calm entry point.
 */

import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import Animated, {
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

export default function WelcomeScreen() {
  const router = useRouter();

  const handleAdvance = useCallback(() => {
    router.push('/(onboarding)/status' as any);
  }, [router]);

  return (
    <View style={styles.container}>
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

      {/* Bottom CTA */}
      <Animated.View entering={FadeInUp.duration(1200).delay(2500)} style={styles.bottomSection}>
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
