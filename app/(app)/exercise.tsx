/**
 * Individual Exercise Runner Screen
 *
 * Receives an exercise ID via route params, loads the exercise
 * from the registry, and uses ExerciseFlow. On completion,
 * saves to Supabase and auto-updates growth tracking.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Spacing, FontSizes, FontFamilies } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useGamification } from '@/context/GamificationContext';
import { getExerciseById } from '@/utils/interventions/registry';
import { saveCompletion } from '@/services/intervention';
import { incrementPracticeCount, addInsight, upsertGrowthEdge } from '@/services/growth';
import HomeButton from '@/components/HomeButton';
import ExerciseFlow from '@/components/intervention/ExerciseFlow';
import type { StepResponse } from '@/components/intervention/ExerciseFlow';

/**
 * Maps exercise categories to possible growth edge IDs.
 * When an exercise is completed, the matching growth edge gets
 * its practice count incremented.
 */
const CATEGORY_TO_EDGE: Record<string, string[]> = {
  regulation: ['regulation_capacity'],
  communication: ['speak_truth'],
  attachment: ['approach_closeness'],
  values: ['values_gap'],
  differentiation: ['differentiation_work', 'reclaim_self'],
};

export default function ExerciseScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { awardXP } = useGamification();

  const exercise = id ? getExerciseById(id) : undefined;

  const handleComplete = async (reflection?: string, rating?: number, stepResponses?: StepResponse[]) => {
    if (user && exercise) {
      try {
        // 1. Save exercise completion (with step responses for journal)
        await saveCompletion(
          user.id,
          exercise.id,
          reflection,
          rating,
          stepResponses,
          exercise.title
        );

        // 1b. Award XP for exercise completion (non-blocking)
        awardXP('lesson_complete', exercise.id, `Completed: ${exercise.title}`).catch(() => {});

        // 2. Update growth tracking for matching edges
        const edgeIds = CATEGORY_TO_EDGE[exercise.category] ?? [];
        for (const edgeId of edgeIds) {
          try {
            // Ensure the growth edge record exists
            await upsertGrowthEdge(user.id, edgeId, {});
            // Increment practice count
            await incrementPracticeCount(user.id, edgeId);
            // Add reflection as insight if provided
            if (reflection && reflection.trim().length > 0) {
              await addInsight(user.id, edgeId, reflection.trim());
            }
          } catch {
            // Growth tracking update is best-effort — don't block completion
          }
        }
      } catch (err) {
        console.error('Failed to save exercise completion:', err);
      }
    }
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(app)/home' as any);
    }
  };

  const handleExit = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(app)/home' as any);
    }
  };

  if (!exercise) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          {!id ? (
            <ActivityIndicator color={Colors.primary} accessibilityLabel="Loading" />
          ) : (
            <>
              <Text style={styles.errorTitle}>Exercise Not Found</Text>
              <Text style={styles.errorText}>
                The exercise "{id}" could not be loaded.
              </Text>
            </>
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ExerciseFlow
        exercise={exercise}
        onComplete={handleComplete}
        onExit={handleExit}
      />
      <HomeButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  errorTitle: {
    fontSize: FontSizes.headingM,
    fontFamily: FontFamilies.heading,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  errorText: {
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
