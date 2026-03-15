/**
 * Onboarding — Time Commitment
 *
 * Single-select with emoji, Wes Anderson aesthetic.
 * Saves selection to OnboardingContext.
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useOnboarding } from '@/context/OnboardingContext';
import { SoundHaptics } from '@/services/SoundHapticsService';
import { Colors, Spacing, FontSizes, FontFamilies, BorderRadius } from '@/constants/theme';
import { ArrowLeftIcon, CoffeeIcon, MeditationIcon, BookOpenIcon, WaveIcon } from '@/assets/graphics/icons';
import type { IconProps } from '@/assets/graphics/icons';

const OPTIONS: { id: string; label: string; desc: string; Icon: React.ComponentType<IconProps> }[] = [
  { id: '5-min', label: '5 minutes a day', desc: 'Quick daily check-ins', Icon: CoffeeIcon },
  { id: '10-15-min', label: '10–15 minutes a day', desc: 'Practices + reflection', Icon: MeditationIcon },
  { id: '20-plus-min', label: '20+ minutes a day', desc: 'Deep exploration', Icon: BookOpenIcon },
  { id: 'whenever', label: 'When I feel like it', desc: 'No pressure, your pace', Icon: WaveIcon },
];

export default function TimeScreen() {
  const router = useRouter();
  const { data, setTimeCommitment } = useOnboarding();
  const [selected, setSelected] = useState(data.timeCommitment);

  const handleSelect = (id: string) => {
    SoundHaptics.tap();
    setSelected(id);
    setTimeCommitment(id);
    setTimeout(() => {
      router.push('/(onboarding)/ready' as any);
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
          <Text style={styles.stepIndicator}>5 of 6</Text>
          <View style={styles.headerSpacer} />
        </View>
      </Animated.View>

      <View style={styles.content}>
        <Animated.View entering={FadeInDown.duration(800)}>
          <Text style={styles.title}>How much time can you invest?</Text>
          <Text style={styles.subtitle}>There's no wrong answer. We'll adapt.</Text>
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
                  accessibilityLabel={`${option.label}: ${option.desc}`}
                  accessibilityState={{ selected: isSelected }}
                >
                  <View style={styles.optionIconWrapper}>
                    <option.Icon size={22} color={isSelected ? Colors.primaryDark : Colors.primary} />
                  </View>
                  <View style={styles.optionTextContainer}>
                    <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                      {option.label}
                    </Text>
                    <Text style={[styles.optionDesc, isSelected && styles.optionDescSelected]}>
                      {option.desc}
                    </Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </View>

      <Animated.View entering={FadeIn.duration(800).delay(600)}>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => router.push('/(onboarding)/ready' as any)}
          activeOpacity={0.6}
          accessibilityRole="button"
          accessibilityLabel="Skip"
        >
          <Text style={styles.skipText}>Skip</Text>
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
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
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
  optionTextContainer: {
    flex: 1,
    gap: 2,
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
  optionDesc: {
    fontSize: FontSizes.caption,
    fontFamily: 'JosefinSans_400Regular',
    color: Colors.textMuted,
  },
  optionDescSelected: {
    color: Colors.textSecondary,
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
