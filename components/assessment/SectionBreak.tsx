import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Animated } from 'react-native';
import { AssessmentSection } from '@/types';
import { Colors, Spacing, FontSizes, FontFamilies, ButtonSizes, BorderRadius } from '@/constants/theme';
import {
  CheckmarkIcon,
  HeartIcon,
  MasksIcon,
  SparkleIcon,
  AnchorIcon,
  ShieldIcon,
  CompassIcon,
} from '@/assets/graphics/icons';
import type { MiniTeaser, TeaserIconName } from '@/utils/assessments/mini-teaser';

interface SectionBreakProps {
  section: AssessmentSection;
  totalQuestions: number;
  questionsCompleted: number;
  onContinue: () => void;
  onSaveAndExit: () => void;
  /** Name of the just-completed section (e.g., "How You Connect") */
  sectionName?: string;
  /** Encouraging message shown after section completion */
  encouragingMessage?: string;
  /** Section-level progress (e.g., 2 of 6 sections) */
  sectionProgress?: { completed: number; total: number };
  /** Optional mini-result teaser shown between header and "Up Next" */
  miniResult?: MiniTeaser | null;
}

/** Render the correct SVG icon component for a teaser icon name. */
function TeaserIcon({ name }: { name: TeaserIconName }) {
  const size = 28;
  const color = Colors.secondary;
  switch (name) {
    case 'heart': return <HeartIcon size={size} color={color} />;
    case 'masks': return <MasksIcon size={size} color={color} />;
    case 'sparkle': return <SparkleIcon size={size} color={color} />;
    case 'anchor': return <AnchorIcon size={size} color={color} />;
    case 'shield': return <ShieldIcon size={size} color={color} />;
    case 'compass': return <CompassIcon size={size} color={color} />;
    default: return <SparkleIcon size={size} color={color} />;
  }
}

function SectionBreak({
  section,
  totalQuestions,
  questionsCompleted,
  onContinue,
  onSaveAndExit,
  sectionName,
  encouragingMessage,
  sectionProgress,
  miniResult,
}: SectionBreakProps) {
  const percent = Math.round((questionsCompleted / totalQuestions) * 100);
  const AUTO_ADVANCE_DELAY = 3500; // ms before auto-continuing
  const [countdown, setCountdown] = useState(Math.ceil(AUTO_ADVANCE_DELAY / 1000));
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate progress bar filling over AUTO_ADVANCE_DELAY
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: AUTO_ADVANCE_DELAY,
      useNativeDriver: false,
    }).start();

    // Countdown display
    const interval = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);

    // Auto-advance
    const timer = setTimeout(() => {
      onContinue();
    }, AUTO_ADVANCE_DELAY);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.header}>
          <CheckmarkIcon size={48} color={Colors.success} />
          {sectionName ? (
            <Text style={styles.completedLabel}>{sectionName} complete</Text>
          ) : null}
          {sectionProgress ? (
            <Text style={styles.progressLabel}>
              {sectionProgress.completed} of {sectionProgress.total} sections {'\u00B7'}{' '}
              {questionsCompleted} of {totalQuestions} questions ({percent}%)
            </Text>
          ) : (
            <Text style={styles.progressLabel}>
              {questionsCompleted} of {totalQuestions} questions completed ({percent}%)
            </Text>
          )}
          {encouragingMessage ? (
            <Text style={styles.encouragingMessage}>{encouragingMessage}</Text>
          ) : null}
        </View>

        {miniResult && (
          <View style={styles.teaserCard}>
            <View style={styles.teaserIconWrap}>
              <TeaserIcon name={miniResult.iconName} />
            </View>
            <Text style={styles.teaserLabel}>{miniResult.label}</Text>
            <Text style={styles.teaserDetail}>{miniResult.detail}</Text>
          </View>
        )}

        <View style={styles.sectionInfo}>
          <Text style={styles.upNext}>Up Next</Text>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.description ? (
            <Text style={styles.sectionDescription}>{section.description}</Text>
          ) : null}
        </View>

        {/* Auto-advance progress bar */}
        <View style={styles.autoProgressTrack}>
          <Animated.View
            style={[
              styles.autoProgressFill,
              { width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) },
            ]}
          />
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={onContinue}
            accessibilityRole="button"
            accessibilityLabel={`Continue to ${section.title}`}
          >
            <Text style={styles.continueButtonText}>
              Continue {countdown > 0 ? `(${countdown})` : ''}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.exitButton}
            onPress={onSaveAndExit}
            accessibilityRole="button"
            accessibilityLabel="Save progress and exit assessment"
          >
            <Text style={styles.exitButtonText}>Save & Exit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default React.memo(SectionBreak);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flexGrow: 1,
    padding: Spacing.xl,
    justifyContent: 'center',
    gap: Spacing.xl,
  },
  header: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  checkmark: {
    fontSize: 48,
    color: Colors.success,
  },
  completedLabel: {
    fontSize: FontSizes.headingM,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
  progressLabel: {
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  encouragingMessage: {
    fontSize: FontSizes.body,
    color: Colors.text,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 22,
    marginTop: Spacing.sm,
  },
  teaserCard: {
    backgroundColor: Colors.secondary + '0D',
    borderWidth: 1,
    borderColor: Colors.secondary + '30',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  teaserIconWrap: {
    marginBottom: Spacing.xs,
  },
  teaserLabel: {
    fontSize: FontSizes.headingS,
    fontWeight: '700',
    fontFamily: FontFamilies.heading,
    color: Colors.secondary,
    textAlign: 'center',
  },
  teaserDetail: {
    fontSize: FontSizes.body,
    fontFamily: FontFamilies.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  sectionInfo: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: 12,
    gap: Spacing.sm,
  },
  upNext: {
    fontSize: FontSizes.caption,
    color: Colors.primary,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: FontSizes.headingM,
    fontWeight: 'bold',
    color: Colors.text,
  },
  sectionDescription: {
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  actions: {
    gap: Spacing.md,
  },
  continueButton: {
    backgroundColor: Colors.primary,
    height: ButtonSizes.large,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonText: {
    color: Colors.white,
    fontSize: FontSizes.body,
    fontWeight: '600',
  },
  exitButton: {
    borderWidth: 1,
    borderColor: Colors.border,
    height: ButtonSizes.large,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exitButtonText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.body,
    fontWeight: '600',
  },
  autoProgressTrack: {
    height: 3,
    backgroundColor: Colors.borderLight,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  autoProgressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
});
