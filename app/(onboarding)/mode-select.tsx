/**
 * Onboarding -- How would you like to use Tender?
 *
 * Mode selection screen inserted after relationship status.
 * Available options depend on the user's relationship status.
 * Step 3 of 6 (or 2 of 6 for singles who skip duration).
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useOnboarding } from '@/context/OnboardingContext';
import { SoundHaptics } from '@/services/SoundHapticsService';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
} from '@/constants/theme';
import {
  SeedlingIcon,
  CoupleIcon,
  HeartDoubleIcon,
  SparkleIcon,
} from '@/assets/graphics/icons';
import type { IconProps } from '@/assets/graphics/icons';
import { getAvailableModes, type RelationshipMode } from '@/constants/demoPartners';

const MODE_ICONS: Record<RelationshipMode, React.ComponentType<IconProps>> = {
  solo: SeedlingIcon,
  demo_partner: CoupleIcon,
  real_partner: HeartDoubleIcon,
  random_partner: SparkleIcon,
};

export default function ModeSelectScreen() {
  const router = useRouter();
  const { data, setRelationshipMode } = useOnboarding();
  const [selected, setSelected] = useState<RelationshipMode | null>(data.relationshipMode);

  const availableModes = getAvailableModes(data.relationshipStatus);

  const handleSelect = (mode: RelationshipMode) => {
    SoundHaptics.tap();
    setSelected(mode);
    setRelationshipMode(mode);

    setTimeout(() => {
      if (mode === 'demo_partner') {
        // Go to partner selection screen
        router.push('/(onboarding)/partner-select' as any);
      } else if (mode === 'random_partner') {
        // Auto-assign random partner, skip selection
        router.push('/(onboarding)/goals' as any);
      } else if (mode === 'real_partner') {
        // Show info about what happens next for real partner mode
        Alert.alert(
          'Partner Connection',
          'After completing your assessments, you\'ll find a "Connect With Your Partner" option on your home screen. Create an invite code there to share with your partner.\n\nFor now, let\'s set your goals.',
          [
            {
              text: 'Got it',
              onPress: () => router.push('/(onboarding)/goals' as any),
            },
          ],
        );
        return; // Skip the timeout since Alert handles navigation
      } else {
        // Solo -- continue to goals
        router.push('/(onboarding)/goals' as any);
      }
    }, 200);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View entering={FadeIn.duration(1000)} style={styles.header}>
        <Text style={styles.stepIndicator}>3 of 6</Text>
      </Animated.View>

      <View style={styles.content}>
        <Animated.View entering={FadeInDown.duration(800)}>
          <Text style={styles.title}>How would you like to use Tender?</Text>
          <Text style={styles.subtitle}>
            Choose what feels right for now.{'\n'}You can always change this later.
          </Text>
        </Animated.View>

        <View style={styles.options}>
          {availableModes.map((option, index) => {
            const isSelected = selected === option.mode;
            const Icon = MODE_ICONS[option.mode];

            return (
              <Animated.View
                key={option.mode}
                entering={FadeInDown.duration(600).delay(200 + index * 80)}
              >
                <TouchableOpacity
                  style={[styles.optionButton, isSelected && styles.optionSelected]}
                  onPress={() => handleSelect(option.mode)}
                  activeOpacity={0.7}
                >
                  <View style={styles.optionIconWrapper}>
                    <Icon size={24} color={isSelected ? Colors.primaryDark : Colors.primary} />
                  </View>
                  <View style={styles.optionTextWrapper}>
                    <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                      {option.label}
                    </Text>
                    <Text style={[styles.optionDesc, isSelected && styles.optionDescSelected]}>
                      {option.description}
                    </Text>
                  </View>
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
          onPress={() => {
            setRelationshipMode('solo');
            router.push('/(onboarding)/goals' as any);
          }}
          activeOpacity={0.6}
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
  optionTextWrapper: {
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
