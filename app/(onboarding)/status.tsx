/**
 * Onboarding — Relationship Status
 * Placeholder screen (will be built out in next step).
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useOnboarding } from '@/context/OnboardingContext';
import { SoundHaptics } from '@/services/SoundHapticsService';
import { Colors, Spacing, FontSizes, FontFamilies, ButtonSizes, BorderRadius } from '@/constants/theme';
import { ArrowLeftIcon, HeartDoubleIcon, SeedlingIcon, WaveIcon, WhiteHeartIcon } from '@/assets/graphics/icons';
import type { IconProps } from '@/assets/graphics/icons';

const OPTIONS: { id: string; label: string; Icon: React.ComponentType<IconProps> }[] = [
  { id: 'in-relationship', label: 'In a relationship', Icon: HeartDoubleIcon },
  { id: 'single', label: 'Single', Icon: SeedlingIcon },
  { id: 'complicated', label: 'It\'s complicated', Icon: WaveIcon },
  { id: 'prefer-not-to-say', label: 'Prefer not to say', Icon: WhiteHeartIcon },
];

export default function StatusScreen() {
  const router = useRouter();
  const { data, setStatus } = useOnboarding();
  const [selected, setSelected] = useState(data.relationshipStatus);

  const handleSelect = (id: string) => {
    SoundHaptics.tap();
    setSelected(id);
    setStatus(id);
    // Let the selection highlight settle before navigating
    setTimeout(() => {
      if (id === 'single') {
        // Singles skip duration, go straight to mode selection
        router.push('/(onboarding)/mode-select' as any);
      } else {
        // In-relationship / complicated / prefer-not-to-say → duration
        router.push('/(onboarding)/duration' as any);
      }
    }, 500);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View entering={FadeIn.duration(1000)} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <ArrowLeftIcon size={16} color={Colors.primary} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.stepIndicator}>1 of 5</Text>
          <View style={styles.headerSpacer} />
        </View>
      </Animated.View>

      <View style={styles.content}>
        <Animated.View entering={FadeInDown.duration(800)}>
          <Text style={styles.title}>What's your relationship status?</Text>
          <Text style={styles.subtitle}>This helps us personalize your journey</Text>
        </Animated.View>

        <View style={styles.options}>
          {OPTIONS.map((option, index) => {
            const isSelected = selected === option.id;
            return (
              <Animated.View
                key={option.id}
                entering={FadeInDown.duration(600).delay(200 + index * 80)}
              >
                <TouchableOpacity
                  style={[styles.optionButton, isSelected && styles.optionSelected]}
                  onPress={() => handleSelect(option.id)}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel={option.label}
                  accessibilityState={{ selected: isSelected }}
                >
                  <View style={styles.optionIconWrapper}>
                    <option.Icon size={24} color={isSelected ? Colors.primaryDark : Colors.primary} />
                  </View>
                  <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </View>

      {/* Skip */}
      <Animated.View entering={FadeIn.duration(800).delay(600)}>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => router.push('/(onboarding)/duration' as any)}
          activeOpacity={0.6}
          accessibilityRole="button"
          accessibilityLabel="Skip for now"
        >
          <Text style={styles.skipText}>Skip for now</Text>
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
  header: {
    paddingTop: Platform.OS === 'ios' ? 70 : 50,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  backText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.primary,
    fontWeight: '600',
    fontFamily: 'JosefinSans_600SemiBold',
  },
  headerSpacer: {
    width: 52,
  },
  stepIndicator: {
    fontSize: FontSizes.caption,
    fontFamily: 'JosefinSans_500Medium',
    color: Colors.primary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  title: {
    fontSize: FontSizes.headingL,
    fontFamily: FontFamilies.heading,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSizes.body,
    fontFamily: 'JosefinSans_400Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
  },
  options: {
    gap: Spacing.sm,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
  },
  optionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryFaded,
  },
  optionIconWrapper: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLabel: {
    fontSize: FontSizes.body,
    fontFamily: 'JosefinSans_500Medium',
    color: Colors.text,
  },
  optionLabelSelected: {
    color: Colors.primaryDark,
    fontFamily: 'JosefinSans_600SemiBold',
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 50 : 30,
  },
  skipText: {
    fontSize: FontSizes.bodySmall,
    fontFamily: 'JosefinSans_400Regular',
    color: Colors.textMuted,
  },
});
