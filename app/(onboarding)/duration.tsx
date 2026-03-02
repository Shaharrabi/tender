/**
 * Onboarding — Relationship Duration
 * Placeholder screen.
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useOnboarding } from '@/context/OnboardingContext';
import { SoundHaptics } from '@/services/SoundHapticsService';
import { Colors, Spacing, FontSizes, FontFamilies, BorderRadius } from '@/constants/theme';
import { ArrowLeftIcon, SeedlingIcon, LeafIcon, TreeIcon, HomeIcon, StarIcon, WhiteHeartIcon } from '@/assets/graphics/icons';
import type { IconProps } from '@/assets/graphics/icons';

const OPTIONS: { id: string; label: string; Icon: React.ComponentType<IconProps> }[] = [
  { id: 'less-than-1', label: 'Less than 1 year', Icon: SeedlingIcon },
  { id: '1-3', label: '1–3 years', Icon: LeafIcon },
  { id: '3-7', label: '3–7 years', Icon: TreeIcon },
  { id: '7-15', label: '7–15 years', Icon: HomeIcon },
  { id: '15-plus', label: '15+ years', Icon: StarIcon },
  { id: 'not-applicable', label: 'Not applicable', Icon: WhiteHeartIcon },
];

export default function DurationScreen() {
  const router = useRouter();
  const { data, setDuration } = useOnboarding();
  const [selected, setSelected] = useState(data.relationshipDuration);

  const handleSelect = (id: string) => {
    SoundHaptics.tap();
    setSelected(id);
    setDuration(id);
    setTimeout(() => {
      router.push('/(onboarding)/mode-select' as any);
    }, 200);
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
          <Text style={styles.stepIndicator}>2 of 6</Text>
          <View style={styles.headerSpacer} />
        </View>
      </Animated.View>

      <View style={styles.content}>
        <Animated.View entering={FadeInDown.duration(800)}>
          <Text style={styles.title}>How long have you been together?</Text>
          <Text style={styles.subtitle}>Or how long was your last relationship</Text>
        </Animated.View>

        <View style={styles.options}>
          {OPTIONS.map((option, index) => {
            const isSelected = selected === option.id;
            return (
              <Animated.View
                key={option.id}
                entering={FadeInDown.duration(600).delay(200 + index * 70)}
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
                    <option.Icon size={22} color={isSelected ? Colors.primaryDark : Colors.primary} />
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

      <Animated.View entering={FadeIn.duration(800).delay(600)}>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => router.push('/(onboarding)/mode-select' as any)}
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
