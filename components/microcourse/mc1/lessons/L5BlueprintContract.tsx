/**
 * L5: Blueprint Contract — Commitment + Stamp Animation
 *
 * Shows a parchment-style commitment contract with variant-specific
 * template, inline number input, and a satisfying stamp animation on sign.
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
} from 'react-native';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import {
  FlagIcon,
  LightbulbIcon,
  HeartPulseIcon,
  BrainIcon,
  SeedlingIcon,
} from '@/assets/graphics/icons';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

type Phase = 'recap' | 'contract' | 'signed';

interface L5BlueprintContractProps {
  content: ResolvedLessonContent;
  attachmentStyle?: AttachmentStyle;
  onComplete: (responses: StepResponseEntry[]) => void;
}

const RECAP_ITEMS = [
  {
    icon: SeedlingIcon,
    title: 'Where it came from',
    desc: 'Your pattern is a survival strategy, not a flaw.',
  },
  {
    icon: HeartPulseIcon,
    title: 'How it shows up',
    desc: 'You can name the alarm in your body.',
  },
  {
    icon: BrainIcon,
    title: 'The cycle between you',
    desc: 'Your move triggers theirs. Theirs confirms your fear.',
  },
];

export function L5BlueprintContract({ content, attachmentStyle, onComplete }: L5BlueprintContractProps) {
  const haptics = useSoundHaptics();
  const isAnxious = attachmentStyle === 'anxious-preoccupied';

  const [phase, setPhase] = useState<Phase>('recap');
  const [commitCount, setCommitCount] = useState('');
  const [signed, setSigned] = useState(false);

  // Stamp animation
  const stampScale = useRef(new Animated.Value(5)).current;
  const stampOpacity = useRef(new Animated.Value(0)).current;
  const stampRotate = useRef(new Animated.Value(-15)).current;
  const borderGlow = useRef(new Animated.Value(0)).current;

  const handleSign = useCallback(() => {
    haptics.playConfetti();
    setSigned(true);

    // Stamp animation
    stampOpacity.setValue(1);
    Animated.parallel([
      Animated.spring(stampScale, {
        toValue: 1,
        friction: 4,
        tension: 60,
        useNativeDriver: true,
      }),
      Animated.spring(stampRotate, {
        toValue: 0,
        friction: 6,
        tension: 60,
        useNativeDriver: true,
      }),
      // Gold border flash
      Animated.sequence([
        Animated.timing(borderGlow, { toValue: 1, duration: 300, useNativeDriver: false }),
        Animated.timing(borderGlow, { toValue: 0, duration: 600, useNativeDriver: false }),
      ]),
    ]).start();

    setTimeout(() => {
      const responses: StepResponseEntry[] = [
        {
          step: 1,
          prompt: 'Commitment contract',
          response: JSON.stringify({
            commitmentCount: parseInt(commitCount) || 3,
            signed: true,
            variant: isAnxious ? 'anxious' : 'avoidant',
          }),
          type: 'commitment',
        },
      ];
      onComplete(responses);
    }, 1500);
  }, [haptics, commitCount, isAnxious, onComplete, stampScale, stampRotate, borderGlow, stampOpacity]);

  const stampTransform = {
    opacity: stampOpacity,
    transform: [
      { scale: stampScale },
      {
        rotate: stampRotate.interpolate({
          inputRange: [-15, 0],
          outputRange: ['-15deg', '0deg'],
        }),
      },
    ],
  };

  const borderColor = borderGlow.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.borderLight, '#D4B483'],
  });

  // ─── Recap Phase ──────────────────────────────

  if (phase === 'recap') {
    return (
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.recapContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconCircle}>
          <FlagIcon size={28} color={Colors.primary} />
        </View>

        <Text style={styles.title}>YOUR BLUEPRINT</Text>
        <Text style={styles.subtitle}>Here is what you now know:</Text>

        {RECAP_ITEMS.map((item, i) => (
          <View key={i} style={styles.recapCard}>
            <View style={styles.recapNumber}>
              <Text style={styles.recapNumberText}>{i + 1}</Text>
            </View>
            <View style={styles.recapTextWrap}>
              <Text style={styles.recapTitle}>{item.title}</Text>
              <Text style={styles.recapDesc}>{item.desc}</Text>
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => {
            haptics.tap();
            setPhase('contract');
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.continueButtonText}>See Your Commitment</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // ─── Contract Phase ───────────────────────────

  const template = content.commitmentTemplate || (isAnxious
    ? 'This week, I commit to practicing the 90-second pause at least ___ times when I feel the pull to seek reassurance.'
    : 'This week, I commit to the one-sentence share at least ___ times.');

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.contractContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Animated.View style={[styles.contractPaper, { borderColor }]}>
        {/* Header */}
        <View style={styles.contractHeader}>
          <Text style={styles.contractDocTitle}>RELATIONSHIP BLUEPRINT</Text>
          <Text style={styles.contractDocId}>MC1 {'\u2022'} {new Date().getFullYear()}</Text>
        </View>

        {/* Body */}
        <View style={styles.contractBody}>
          <Text style={styles.contractParagraph}>
            I understand that my nervous system learned to{' '}
            <Text style={styles.highlight}>monitor connection</Text>{' '}
            as a survival strategy.
          </Text>

          <Text style={styles.contractParagraph}>
            When I feel the{' '}
            <Text style={styles.highlight}>alarm in my body</Text>,{' '}
            I will recognize it as an old signal, not a present danger.
          </Text>

          {/* Commitment template with inline input */}
          <View style={styles.templateSection}>
            <Text style={styles.contractParagraph}>
              {template.split('___')[0]}
              <Text style={styles.highlight}> </Text>
            </Text>
            <View style={styles.inlineInputWrap}>
              <TextInput
                style={styles.inlineInput}
                value={commitCount}
                onChangeText={setCommitCount}
                keyboardType="number-pad"
                placeholder="3"
                placeholderTextColor={Colors.textMuted}
                maxLength={2}
                editable={!signed}
              />
            </View>
            <Text style={styles.contractParagraph}>
              {template.split('___')[1] || ' times.'}
            </Text>
          </View>
        </View>

        {/* Date */}
        <Text style={styles.contractDate}>
          {new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>

        {/* Sign Button */}
        {!signed && (
          <TouchableOpacity
            style={styles.signButton}
            onPress={handleSign}
            activeOpacity={0.7}
          >
            <Text style={styles.signButtonText}>SIGN MY COMMITMENT</Text>
          </TouchableOpacity>
        )}

        {/* The Stamp — pointerEvents='none' until signed so it doesn't block the sign button */}
        <Animated.View
          style={[styles.stampContainer, stampTransform]}
          pointerEvents={signed ? 'auto' : 'none'}
        >
          <View style={styles.stampBorder}>
            <Text style={styles.stampText}>COMMITTED</Text>
          </View>
        </Animated.View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  recapContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.scrollPadBottom,
    alignItems: 'center',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSizes.headingM,
    fontFamily: FontFamilies.heading,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: 1.5,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: Spacing.lg,
  },

  // ─── Recap cards ─────────────────────
  recapCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.subtle,
    gap: Spacing.md,
    alignItems: 'center',
  },
  recapNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.success + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recapNumberText: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '700',
    color: Colors.success,
  },
  recapTextWrap: {
    flex: 1,
  },
  recapTitle: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  recapDesc: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  continueButton: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: BorderRadius.pill,
    ...Shadows.subtle,
  },
  continueButtonText: {
    color: Colors.textOnPrimary,
    fontWeight: '600',
    fontSize: FontSizes.body,
  },

  // ─── Contract ────────────────────────
  contractContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.scrollPadBottom,
    alignItems: 'center',
  },
  contractPaper: {
    width: '100%',
    backgroundColor: '#FFFDF5',
    padding: Spacing.lg,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.borderLight,
    ...Shadows.elevated,
    position: 'relative',
  },
  contractHeader: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.text,
    paddingBottom: Spacing.sm,
    marginBottom: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  contractDocTitle: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '900',
    letterSpacing: 2,
    color: Colors.text,
  },
  contractDocId: {
    fontSize: FontSizes.caption - 2,
    color: Colors.textMuted,
  },
  contractBody: {
    gap: Spacing.md,
  },
  contractParagraph: {
    fontSize: FontSizes.body,
    lineHeight: 26,
    color: '#444',
  },
  highlight: {
    fontWeight: 'bold',
    color: Colors.primary,
  },
  templateSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 2,
  },
  inlineInputWrap: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
    minWidth: 36,
    marginHorizontal: 4,
  },
  inlineInput: {
    fontSize: FontSizes.body,
    fontWeight: '700',
    color: Colors.primary,
    textAlign: 'center',
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  contractDate: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    marginTop: Spacing.lg,
  },
  signButton: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.text,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: BorderRadius.pill,
    alignSelf: 'center',
  },
  signButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: FontSizes.bodySmall,
    letterSpacing: 1.5,
  },

  // ─── Stamp ───────────────────────────
  stampContainer: {
    position: 'absolute',
    bottom: 80,
    right: 20,
  },
  stampBorder: {
    borderWidth: 4,
    borderColor: Colors.primary,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: Colors.primary + '10',
  },
  stampText: {
    color: Colors.primary,
    fontWeight: '900',
    fontSize: 18,
    letterSpacing: 3,
  },
});
