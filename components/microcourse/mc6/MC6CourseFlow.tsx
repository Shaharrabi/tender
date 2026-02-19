/**
 * MC6CourseFlow — Orchestrator for "What Matters Most Together".
 *
 * Follows MC1-MC5 CourseFlow's exact architecture:
 *   interactive → transition → reflection
 *
 * Adds `previousLessonData?` prop for L1→L2/L3 data cascading
 * (L1 DualCardSort values cascade to L2 TensionExplorer and L3 CompassBuilder).
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Animated,
} from 'react-native';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  ButtonSizes,
  Shadows,
} from '@/constants/theme';
import { PenIcon } from '@/assets/graphics/icons';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import { MC6ProgressHeader } from './MC6ProgressHeader';
import { LessonTransition } from '../mc1/LessonTransition';
import { L1DualCardSort } from './lessons/L1DualCardSort';
import { L2TensionExplorer } from './lessons/L2TensionExplorer';
import { L3CompassBuilder } from './lessons/L3CompassBuilder';
import { L4WeeklyActionPlanner } from './lessons/L4WeeklyActionPlanner';
import { L5ValuesCheckIn } from './lessons/L5ValuesCheckIn';
import type { AttachmentStyle } from '@/types';
import type { ResolvedLessonContent, MicroCourseLesson } from '@/utils/microcourses/course-content';
import type { MicroCourse } from '@/utils/microcourses/course-registry';
import type { StepResponseEntry } from '@/types/intervention';

type FlowPhase = 'interactive' | 'transition' | 'reflection';

interface MC6CourseFlowProps {
  lessonNumber: number;
  totalLessons: number;
  attachmentStyle?: AttachmentStyle;
  content: ResolvedLessonContent;
  lesson: MicroCourseLesson;
  course: MicroCourse;
  onComplete: (stepResponses?: StepResponseEntry[]) => Promise<void>;
  onExit: () => void;
  saving: boolean;
  previousLessonData?: string; // JSON string from L1 for L2/L3 cascading
}

export function MC6CourseFlow({
  lessonNumber,
  totalLessons,
  attachmentStyle,
  content,
  lesson,
  course,
  onComplete,
  onExit,
  saving,
  previousLessonData,
}: MC6CourseFlowProps) {
  const haptics = useSoundHaptics();

  const [phase, setPhase] = useState<FlowPhase>('interactive');
  const [interactiveResponses, setInteractiveResponses] = useState<StepResponseEntry[]>([]);
  const [reflectionText, setReflectionText] = useState('');

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    haptics.playLessonStart();
  }, []);

  useEffect(() => {
    if (phase === 'reflection') {
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    }
  }, [phase]);

  const handleInteractiveComplete = useCallback((responses: StepResponseEntry[]) => {
    setInteractiveResponses(responses);
    haptics.pageTurn();
    setPhase('transition');
  }, [haptics]);

  const handleTransitionFinish = useCallback(() => {
    setPhase('reflection');
  }, []);

  const handleFinalComplete = useCallback(async () => {
    haptics.playReflectionDing();

    const allResponses: StepResponseEntry[] = [
      ...interactiveResponses,
      {
        step: interactiveResponses.length + 1,
        prompt: content.reflectionPrompt,
        response: reflectionText.trim(),
        type: 'reflection',
      },
    ];

    await onComplete(allResponses);
  }, [haptics, interactiveResponses, reflectionText, content.reflectionPrompt, onComplete]);

  // ─── Parse previous lesson data for L2/L3 ─────────────

  const l1SortData = (() => {
    if ((lessonNumber !== 2 && lessonNumber !== 3) || !previousLessonData) return undefined;
    return previousLessonData; // Raw JSON string — each lesson parses it
  })();

  // ─── Render Interactive Phase ──────────────────────────

  const renderInteractive = () => {
    const commonProps = {
      content,
      attachmentStyle,
      onComplete: handleInteractiveComplete,
    };

    switch (lessonNumber) {
      case 1:
        return <L1DualCardSort {...commonProps} />;
      case 2:
        return <L2TensionExplorer {...commonProps} l1SortData={l1SortData} />;
      case 3:
        return <L3CompassBuilder {...commonProps} l1SortData={l1SortData} />;
      case 4:
        return <L4WeeklyActionPlanner {...commonProps} />;
      case 5:
        return <L5ValuesCheckIn {...commonProps} />;
      default:
        return null;
    }
  };

  // ─── Render Reflection Phase ──────────────────────────

  const renderReflection = () => (
    <Animated.View style={[styles.reflectionContainer, { opacity: fadeAnim }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.reflectionCard}>
          <View style={styles.reflectionHeader}>
            <PenIcon size={22} color={Colors.secondary} />
            <Text style={styles.reflectionLabel}>Your Reflection</Text>
          </View>

          {content.commitmentTemplate && (
            <View style={styles.templateBox}>
              <Text style={styles.templateText}>{content.commitmentTemplate}</Text>
            </View>
          )}

          <Text style={styles.promptText}>{content.reflectionPrompt}</Text>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Take a moment and write what comes up..."
              placeholderTextColor={Colors.textMuted}
              value={reflectionText}
              onChangeText={setReflectionText}
              multiline
              textAlignVertical="top"
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.navigation}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            haptics.tap();
            setPhase('interactive');
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>{'\u2039'} Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.nextButton, saving && styles.disabledButton]}
          onPress={handleFinalComplete}
          activeOpacity={0.7}
          disabled={saving}
        >
          <Text style={styles.nextButtonText}>
            {saving ? 'Saving...' : 'Complete \u2713'}
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  // ─── Main Render ──────────────────────────────────────

  return (
    <SafeAreaView style={styles.container}>
      <MC6ProgressHeader currentLesson={lessonNumber} totalLessons={totalLessons} onExit={onExit} />

      <View style={styles.content}>
        {phase === 'interactive' && renderInteractive()}

        {phase === 'transition' && (
          <LessonTransition onFinish={handleTransitionFinish} />
        )}

        {phase === 'reflection' && renderReflection()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  reflectionContainer: {
    flex: 1,
  },
  reflectionCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.subtle,
    gap: Spacing.md,
  },
  reflectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  reflectionLabel: {
    fontSize: FontSizes.body,
    fontWeight: '600',
    fontFamily: FontFamilies.heading,
    color: Colors.secondary,
  },
  templateBox: {
    backgroundColor: Colors.accent + '15',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accent,
  },
  templateText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  promptText: {
    fontSize: FontSizes.body,
    fontWeight: '500',
    color: Colors.text,
    lineHeight: 24,
  },
  inputWrapper: {
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.accent + '60',
    backgroundColor: '#FFFCF7',
    overflow: 'hidden',
  },
  input: {
    padding: Spacing.md,
    fontSize: FontSizes.body,
    color: Colors.text,
    minHeight: 140,
    lineHeight: 24,
  },
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    backgroundColor: Colors.surfaceElevated,
    gap: Spacing.sm,
  },
  backButton: {
    height: ButtonSizes.medium,
    paddingHorizontal: Spacing.lg,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  backButtonText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  nextButton: {
    flex: 1,
    height: ButtonSizes.medium,
    backgroundColor: Colors.primary,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: FontSizes.body,
    color: Colors.textOnPrimary,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
});
