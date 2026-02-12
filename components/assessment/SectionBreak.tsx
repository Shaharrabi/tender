import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { AssessmentSection } from '@/types';
import { Colors, Spacing, FontSizes, ButtonSizes } from '@/constants/theme';

interface SectionBreakProps {
  section: AssessmentSection;
  totalQuestions: number;
  questionsCompleted: number;
  onContinue: () => void;
  onSaveAndExit: () => void;
}

export default function SectionBreak({
  section,
  totalQuestions,
  questionsCompleted,
  onContinue,
  onSaveAndExit,
}: SectionBreakProps) {
  const percent = Math.round((questionsCompleted / totalQuestions) * 100);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.checkmark}>&#10003;</Text>
          <Text style={styles.progressLabel}>
            {questionsCompleted} of {totalQuestions} questions completed ({percent}%)
          </Text>
        </View>

        <View style={styles.sectionInfo}>
          <Text style={styles.upNext}>Up Next</Text>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.description ? (
            <Text style={styles.sectionDescription}>{section.description}</Text>
          ) : null}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.continueButton} onPress={onContinue}>
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.exitButton} onPress={onSaveAndExit}>
            <Text style={styles.exitButtonText}>Save & Exit</Text>
          </TouchableOpacity>
        </View>
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
  progressLabel: {
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    textAlign: 'center',
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
});
