/**
 * Exercise Library Screen
 *
 * Redesigned with:
 * - Animated stats header (total exercises, categories, completed)
 * - Search bar with text filter
 * - Horizontal category filter pills (color-coded)
 * - Beautiful exercise cards with staggered entrance animations
 */

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import { getAllExercises, CATEGORIES } from '@/utils/interventions/registry';
import ExerciseCard, {
  CATEGORY_ACCENT_COLORS,
} from '@/components/intervention/ExerciseCard';
import { CATEGORY_ICONS, DIFFICULTY_ICONS } from '@/constants/icons';
import { useAuth } from '@/context/AuthContext';
import { getCompletions } from '@/services/intervention';
import type { InterventionCategory } from '@/types/intervention';

// ─── Category pill colors ────────────────────────────────
const FILTER_COLORS: Record<InterventionCategory, string> = {
  ...CATEGORY_ACCENT_COLORS,
};

export default function ExercisesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState<
    InterventionCategory | 'all'
  >('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Track which exercises have been completed (exerciseId → count)
  const [completionMap, setCompletionMap] = useState<Record<string, number>>({});

  // Fetch completions on focus (so returning from exercise shows updated state)
  useFocusEffect(
    useCallback(() => {
      if (!user) return;
      getCompletions(user.id, 500)
        .then((completions) => {
          const map: Record<string, number> = {};
          for (const c of completions) {
            map[c.exerciseId] = (map[c.exerciseId] ?? 0) + 1;
          }
          setCompletionMap(map);
        })
        .catch(() => {});
    }, [user])
  );

  const completedCount = useMemo(
    () => Object.keys(completionMap).length,
    [completionMap]
  );

  // Stats animation
  const statsAnim = useRef(new Animated.Value(0)).current;
  const searchAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(120, [
      Animated.timing(statsAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(searchAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [statsAnim, searchAnim]);

  const allExercises = useMemo(() => getAllExercises(), []);

  // Unique categories count
  const categoriesCount = useMemo(() => {
    const cats = new Set(allExercises.map((ex) => ex.category));
    return cats.size;
  }, [allExercises]);

  // Filter by category + search
  const filteredExercises = useMemo(() => {
    let result = allExercises;

    if (activeFilter !== 'all') {
      result = result.filter((ex) => ex.category === activeFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (ex) =>
          ex.title.toLowerCase().includes(q) ||
          ex.description.toLowerCase().includes(q) ||
          ex.category.toLowerCase().includes(q)
      );
    }

    return result;
  }, [allExercises, activeFilter, searchQuery]);

  const handleExercisePress = (exerciseId: string) => {
    router.push({
      pathname: '/(app)/exercise' as any,
      params: { id: exerciseId },
    });
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(app)/home' as any);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ─── Header ─────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
          <Text style={styles.backText}>{'\u2039'} Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Exercises</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ─── Stats Row ──────────────────────────────────── */}
        <Animated.View
          style={[
            styles.statsRow,
            {
              opacity: statsAnim,
              transform: [
                {
                  translateY: statsAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [16, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <StatCard
            value={allExercises.length.toString()}
            label="Practices"
            icon="🏋️"
            accentColor={Colors.primary}
          />
          <StatCard
            value={categoriesCount.toString()}
            label="Categories"
            icon="🎯"
            accentColor={Colors.accent}
          />
          <StatCard
            value={completedCount.toString()}
            label="Completed"
            icon="✅"
            accentColor={Colors.calm}
            subtitle={completedCount > 0 ? `${Object.values(completionMap).reduce((a, b) => a + b, 0)} total sessions` : 'Start your journey'}
          />
        </Animated.View>

        {/* ─── Category Breakdown Infographic ───────────────── */}
        <Animated.View
          style={[
            styles.breakdownCard,
            {
              opacity: statsAnim,
              transform: [
                {
                  translateY: statsAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [16, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.breakdownTitle}>Practice Categories</Text>
          <View style={styles.breakdownRow}>
            {(['regulation', 'communication', 'attachment', 'values', 'differentiation'] as InterventionCategory[]).map((cat) => {
              const count = allExercises.filter((ex) => ex.category === cat).length;
              const total = allExercises.length;
              const pct = Math.round((count / total) * 100);
              const color = CATEGORY_ACCENT_COLORS[cat] || Colors.primary;
              const icon = CATEGORY_ICONS[cat] || '📋';
              return (
                <TouchableOpacity
                  key={cat}
                  style={styles.breakdownItem}
                  onPress={() => setActiveFilter(activeFilter === cat ? 'all' : cat)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.breakdownCircle, { borderColor: color }]}>
                    <Text style={styles.breakdownIcon}>{icon}</Text>
                  </View>
                  <Text style={styles.breakdownCount}>{count}</Text>
                  <Text style={[styles.breakdownLabel, { color }]}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1, 5)}
                  </Text>
                  <View style={styles.breakdownBarTrack}>
                    <View
                      style={[
                        styles.breakdownBarFill,
                        { width: `${pct}%`, backgroundColor: color },
                      ]}
                    />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>

        {/* ─── Search Bar ─────────────────────────────────── */}
        <Animated.View
          style={[
            styles.searchWrapper,
            {
              opacity: searchAnim,
              transform: [
                {
                  translateY: searchAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [12, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>{'\u{1F50D}'}</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search exercises..."
              placeholderTextColor={Colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                activeOpacity={0.6}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.clearIcon}>{'\u2715'}</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>

        {/* ─── Category Filter Pills ──────────────────────── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
          style={styles.filterScroll}
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeFilter === cat.key;
            const accentColor =
              cat.key === 'all'
                ? Colors.primary
                : FILTER_COLORS[cat.key as InterventionCategory] ??
                  Colors.primary;

            return (
              <TouchableOpacity
                key={cat.key}
                style={[
                  styles.filterPill,
                  isActive && { backgroundColor: accentColor, borderColor: accentColor },
                ]}
                onPress={() => setActiveFilter(cat.key)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    isActive && styles.filterPillTextActive,
                  ]}
                >
                  {cat.label}
                </Text>
                {isActive && activeFilter !== 'all' && (
                  <View style={styles.filterCount}>
                    <Text style={styles.filterCountText}>
                      {allExercises.filter((e) => e.category === cat.key).length}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ─── Results Count ──────────────────────────────── */}
        <Text style={styles.resultsCount}>
          {filteredExercises.length} exercise
          {filteredExercises.length !== 1 ? 's' : ''}
          {activeFilter !== 'all'
            ? ` in ${activeFilter}`
            : searchQuery
              ? ' found'
              : ''}
        </Text>

        {/* ─── Exercise Cards ─────────────────────────────── */}
        <View style={styles.cards}>
          {filteredExercises.map((exercise, index) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onPress={() => handleExercisePress(exercise.id)}
              delay={index * 60}
              completionCount={completionMap[exercise.id] ?? 0}
            />
          ))}
        </View>

        {/* ─── Empty State ────────────────────────────────── */}
        {filteredExercises.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>{'\u{1F50E}'}</Text>
            <Text style={styles.emptyTitle}>No exercises found</Text>
            <Text style={styles.emptyText}>
              {searchQuery
                ? 'Try a different search term or clear the filter.'
                : 'No exercises in this category yet.'}
            </Text>
            {(searchQuery || activeFilter !== 'all') && (
              <TouchableOpacity
                style={styles.resetButton}
                onPress={() => {
                  setSearchQuery('');
                  setActiveFilter('all');
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.resetButtonText}>Show all exercises</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Bottom padding */}
        <View style={{ height: Spacing.xxxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Stat Card Sub-component ─────────────────────────────

function StatCard({
  value,
  label,
  icon,
  accentColor,
  subtitle,
}: {
  value: string;
  label: string;
  icon: string;
  accentColor: string;
  subtitle?: string;
}) {
  return (
    <View style={statStyles.card}>
      <View style={[statStyles.iconCircle, { backgroundColor: accentColor + '18' }]}>
        <Text style={statStyles.icon}>{icon}</Text>
      </View>
      <Text style={[statStyles.value, { color: accentColor }]}>{value}</Text>
      <Text style={statStyles.label}>{label}</Text>
      {subtitle && <Text style={statStyles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

// ─── Stat Card Styles ────────────────────────────────────

const statStyles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 4,
    ...Shadows.subtle,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  icon: {
    fontSize: 16,
  },
  value: {
    fontSize: FontSizes.headingL,
    fontWeight: '700',
    fontFamily: FontFamilies.heading,
  },
  label: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 10,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 1,
  },
});

// ─── Main Styles ─────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // Category Breakdown Infographic
  breakdownCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.card,
  },
  breakdownTitle: {
    fontSize: FontSizes.caption,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  breakdownItem: {
    alignItems: 'center',
    flex: 1,
    gap: 3,
  },
  breakdownCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceElevated,
  },
  breakdownIcon: {
    fontSize: 18,
  },
  breakdownCount: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '700',
    color: Colors.text,
  },
  breakdownLabel: {
    fontSize: 9,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  breakdownBarTrack: {
    width: '80%',
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.borderLight,
    marginTop: 2,
  },
  breakdownBarFill: {
    height: 3,
    borderRadius: 1.5,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backText: {
    fontSize: FontSizes.body,
    color: Colors.primary,
    fontWeight: '600',
  },
  headerTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.headingM,
    color: Colors.text,
    fontWeight: '600',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 48,
  },

  // Scroll content
  scrollContent: {
    paddingBottom: Spacing.xl,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
    gap: Spacing.sm,
  },

  // Search
  searchWrapper: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    paddingHorizontal: Spacing.md,
    height: 44,
    gap: Spacing.sm,
  },
  searchIcon: {
    fontSize: 15,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSizes.body,
    color: Colors.text,
    paddingVertical: 0,
  },
  clearIcon: {
    fontSize: 14,
    color: Colors.textMuted,
    padding: 4,
  },

  // Category filters
  filterScroll: {
    flexGrow: 0,
    marginBottom: Spacing.sm,
  },
  filterContainer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    gap: Spacing.sm,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.pill,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: 6,
  },
  filterPillText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  filterPillTextActive: {
    color: Colors.textOnPrimary,
  },
  filterCount: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  filterCountText: {
    fontSize: 11,
    color: Colors.textOnPrimary,
    fontWeight: '700',
  },

  // Results
  resultsCount: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },

  // Cards
  cards: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: Spacing.sm,
  },
  emptyTitle: {
    fontSize: FontSizes.headingM,
    fontFamily: FontFamilies.heading,
    fontWeight: '600',
    color: Colors.text,
  },
  emptyText: {
    fontSize: FontSizes.body,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  resetButton: {
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.pill,
  },
  resetButtonText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textOnPrimary,
    fontWeight: '600',
  },
});
