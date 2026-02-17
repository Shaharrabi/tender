/**
 * Onboarding — What brings you here?
 *
 * Multi-select goals with expanded options.
 * Warm, inviting, Wes Anderson aesthetic.
 * Scrollable for the full list.
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
} from 'react-native';
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
  ButtonSizes,
} from '@/constants/theme';
import {
  MirrorIcon,
  ChatBubbleIcon,
  LeafIcon,
  HeartDoubleIcon,
  DoveIcon,
  LinkIcon,
  SeedlingIcon,
  BrainIcon,
  FireIcon,
  HandshakeIcon,
  SparkleIcon,
} from '@/assets/graphics/icons';
import type { IconProps } from '@/assets/graphics/icons';

const GOALS: { id: string; label: string; Icon: React.ComponentType<IconProps>; desc: string }[] = [
  { id: 'understand-self', label: 'Understand myself better', Icon: MirrorIcon, desc: 'How I love, fight, and connect' },
  { id: 'communication', label: 'Improve communication', Icon: ChatBubbleIcon, desc: 'Fewer misunderstandings, more clarity' },
  { id: 'heal', label: 'Heal from past relationships', Icon: LeafIcon, desc: 'Process old wounds, find closure' },
  { id: 'deepen', label: 'Deepen my current relationship', Icon: HeartDoubleIcon, desc: 'More intimacy, trust, and safety' },
  { id: 'conflict', label: 'Handle conflict better', Icon: DoveIcon, desc: 'Fight fair, repair faster' },
  { id: 'attachment', label: 'Understand my attachment style', Icon: LinkIcon, desc: 'Why I pull close or push away' },
  { id: 'prepare', label: 'Prepare for a relationship', Icon: SeedlingIcon, desc: 'Build a strong foundation first' },
  { id: 'emotional-intel', label: 'Build emotional intelligence', Icon: BrainIcon, desc: 'Read emotions — mine and others' },
  { id: 'intimacy', label: 'Reconnect with intimacy', Icon: FireIcon, desc: 'Physical and emotional closeness' },
  { id: 'trust', label: 'Rebuild trust', Icon: HandshakeIcon, desc: 'After betrayal or distance' },
  { id: 'curious', label: 'Just curious', Icon: SparkleIcon, desc: 'Exploring what this is about' },
];

export default function GoalsScreen() {
  const router = useRouter();
  const { data, toggleGoal } = useOnboarding();
  const selected = data.goals;

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View entering={FadeIn.duration(1000)} style={styles.header}>
        <Text style={styles.stepIndicator}>3 of 5</Text>
        <Text style={styles.title}>What brings you here?</Text>
        <Text style={styles.subtitle}>Select everything that resonates. No wrong answers.</Text>
      </Animated.View>

      {/* Scrollable options */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {GOALS.map((goal, index) => {
          const isSelected = selected.includes(goal.id);
          return (
            <Animated.View
              key={goal.id}
              entering={FadeInDown.duration(600).delay(100 + index * 60)}
            >
              <TouchableOpacity
                style={[styles.optionButton, isSelected && styles.optionSelected]}
                onPress={() => { SoundHaptics.tapSoft(); toggleGoal(goal.id); }}
                activeOpacity={0.7}
              >
                <View style={styles.optionIconWrapper}>
                  <goal.Icon size={22} color={isSelected ? Colors.primaryDark : Colors.primary} />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                    {goal.label}
                  </Text>
                  <Text style={[styles.optionDesc, isSelected && styles.optionDescSelected]}>
                    {goal.desc}
                  </Text>
                </View>
                {isSelected && (
                  <View style={styles.checkCircle}>
                    <Text style={styles.checkmark}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomSection}>
        {selected.length > 0 && (
          <Text style={styles.selectionCount}>
            {selected.length} selected
          </Text>
        )}
        <TouchableOpacity
          style={[styles.continueButton, selected.length === 0 && styles.continueOutline]}
          onPress={() => router.push('/(onboarding)/time' as any)}
          activeOpacity={0.8}
        >
          <Text style={[styles.continueText, selected.length === 0 && styles.continueTextOutline]}>
            {selected.length > 0 ? 'Continue' : 'Skip for now'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // Header
  header: {
    paddingTop: Platform.OS === 'ios' ? 70 : 50,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  stepIndicator: {
    fontSize: FontSizes.caption,
    fontFamily: 'JosefinSans_500Medium',
    color: Colors.primary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSizes.headingL,
    fontFamily: FontFamilies.heading,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.bodySmall,
    fontFamily: 'JosefinSans_400Regular',
    color: Colors.textSecondary,
    lineHeight: 20,
  },

  // Scrollable area
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },

  // Options
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
    fontSize: FontSizes.bodySmall,
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
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    fontSize: 14,
    color: Colors.white,
    fontWeight: '700',
  },

  // Bottom
  bottomSection: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? 50 : 30,
    alignItems: 'center',
    gap: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    backgroundColor: Colors.background,
  },
  selectionCount: {
    fontSize: FontSizes.caption,
    fontFamily: 'JosefinSans_500Medium',
    color: Colors.primary,
  },
  continueButton: {
    backgroundColor: Colors.primary,
    height: ButtonSizes.large,
    borderRadius: BorderRadius.pill,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  continueOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.textMuted,
  },
  continueText: {
    color: Colors.white,
    fontSize: FontSizes.body,
    fontFamily: 'Jost_600SemiBold',
    letterSpacing: 0.5,
  },
  continueTextOutline: {
    color: Colors.textMuted,
  },
});
