/**
 * L1: Dual Card Sort — Sort values twice, see the Venn overlap
 *
 * Users sort 16 relationship values into three piles (Essential, Important, Less Important)
 * first for themselves, then estimating their partner's. A Venn reveal shows
 * shared vs unique "Essential" values. The overlap data cascades into L2/L3.
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated,
} from 'react-native';
import {
  Colors, Spacing, FontSizes, FontFamilies, BorderRadius, Shadows,
} from '@/constants/theme';
import { MC6_PALETTE } from '@/constants/mc6Theme';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

type Phase = 'intro' | 'sortYours' | 'sortPartner' | 'reveal';
type Pile = 'essential' | 'important' | 'less';
type SortMap = Record<string, Pile>;

interface L1DualCardSortProps {
  content: ResolvedLessonContent;
  attachmentStyle?: AttachmentStyle;
  onComplete: (responses: StepResponseEntry[]) => void;
}

const VALUES = [
  'Honesty', 'Trust', 'Adventure', 'Safety',
  'Growth', 'Stability', 'Passion', 'Respect',
  'Freedom', 'Loyalty', 'Humor', 'Spirituality',
  'Family', 'Independence', 'Intimacy', 'Kindness',
];

const PILES: { key: Pile; label: string; color: string }[] = [
  { key: 'essential', label: 'Essential', color: MC6_PALETTE.deepGold },
  { key: 'important', label: 'Important', color: MC6_PALETTE.warmAmber },
  { key: 'less', label: 'Less Important', color: Colors.textMuted },
];

export function L1DualCardSort({ content, attachmentStyle, onComplete }: L1DualCardSortProps) {
  const haptics = useSoundHaptics();

  const [phase, setPhase] = useState<Phase>('intro');
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [yourSort, setYourSort] = useState<SortMap>({});
  const [partnerSort, setPartnerSort] = useState<SortMap>({});

  // Venn reveal animations — one per reveal item (max 16 + 16 + 16 = 48, but we cap at a sane list)
  const revealAnims = useRef<Animated.Value[]>([]);
  const revealStarted = useRef(false);

  const currentSort = phase === 'sortPartner' ? partnerSort : yourSort;
  const setCurrentSort = phase === 'sortPartner' ? setPartnerSort : setYourSort;
  const sortedCount = Object.keys(currentSort).length;

  // ─── Handlers ──────────────────────────────────

  const handleValueTap = useCallback((value: string) => {
    haptics.tap();
    setSelectedValue(prev => (prev === value ? null : value));
  }, [haptics]);

  const handlePileTap = useCallback((pile: Pile) => {
    if (!selectedValue) return;
    haptics.tap();
    setCurrentSort(prev => ({ ...prev, [selectedValue]: pile }));
    setSelectedValue(null);
  }, [selectedValue, haptics, setCurrentSort]);

  const handleAdvanceToPartner = useCallback(() => {
    haptics.tap();
    setSelectedValue(null);
    setPhase('sortPartner');
  }, [haptics]);

  const computeOverlap = useCallback(() => {
    const yourEssential = VALUES.filter(v => yourSort[v] === 'essential');
    const partnerEssential = VALUES.filter(v => partnerSort[v] === 'essential');
    const sharedEssential = yourEssential.filter(v => partnerEssential.includes(v));
    const yoursOnly = yourEssential.filter(v => !partnerEssential.includes(v));
    const theirsOnly = partnerEssential.filter(v => !yourEssential.includes(v));
    return { sharedEssential, yoursOnly, theirsOnly };
  }, [yourSort, partnerSort]);

  const handleReveal = useCallback(() => {
    haptics.tap();
    setPhase('reveal');
  }, [haptics]);

  const startRevealAnimation = useCallback((totalItems: number) => {
    if (revealStarted.current) return;
    revealStarted.current = true;

    revealAnims.current = Array.from({ length: totalItems }, () => new Animated.Value(0));
    Animated.stagger(
      150,
      revealAnims.current.map(a =>
        Animated.timing(a, { toValue: 1, duration: 400, useNativeDriver: true })
      ),
    ).start(() => {
      haptics.playConfetti();
    });
  }, [haptics]);

  const handleFinish = useCallback(() => {
    haptics.playConfetti();
    const overlap = computeOverlap();
    const responses: StepResponseEntry[] = [{
      step: 1,
      prompt: 'Dual Card Sort',
      response: JSON.stringify({
        yourSort,
        partnerSort,
        overlap: {
          sharedEssential: overlap.sharedEssential,
          yoursOnly: overlap.yoursOnly,
          theirsOnly: overlap.theirsOnly,
        },
      }),
      type: 'interactive',
    }];
    onComplete(responses);
  }, [yourSort, partnerSort, computeOverlap, haptics, onComplete]);

  // ─── Phase 0: Intro ────────────────────────────

  if (phase === 'intro') {
    return (
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.introContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>WHAT MATTERS MOST</Text>
        <Text style={styles.subtitle}>
          Every couple shares some values and differs on others.{'\n'}
          Discovering where you overlap — and where you diverge — is the
          first step toward building shared meaning.
        </Text>
        <Text style={styles.body}>
          You'll sort 16 values twice: once for yourself, then once
          estimating how your partner would sort them. Then we'll
          reveal the overlap.
        </Text>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => { haptics.tap(); setPhase('sortYours'); }}
          activeOpacity={0.7}
        >
          <Text style={styles.actionButtonText}>BEGIN</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // ─── Phase 3: Venn Reveal ──────────────────────

  if (phase === 'reveal') {
    const overlap = computeOverlap();
    const yourImportant = VALUES.filter(v => yourSort[v] === 'important');
    const partnerImportant = VALUES.filter(v => partnerSort[v] === 'important');
    const sharedImportant = yourImportant.filter(v => partnerImportant.includes(v));

    const allItems = [
      ...overlap.yoursOnly.map(v => ({ value: v, group: 'yours' as const })),
      ...overlap.sharedEssential.map(v => ({ value: v, group: 'shared' as const })),
      ...overlap.theirsOnly.map(v => ({ value: v, group: 'theirs' as const })),
    ];

    // Start animation on first render of reveal
    if (!revealStarted.current && allItems.length > 0) {
      startRevealAnimation(allItems.length);
    }

    // Build grouped sections with animation indices
    let animIdx = 0;
    const yoursOnlyIdx = overlap.yoursOnly.map(() => animIdx++);
    const sharedIdx = overlap.sharedEssential.map(() => animIdx++);
    const theirsOnlyIdx = overlap.theirsOnly.map(() => animIdx++);

    return (
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.revealContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>YOUR SHARED VALUES</Text>
        <Text style={styles.subtitle}>
          Here's where your values overlap and diverge
        </Text>

        {/* Yours Only */}
        {overlap.yoursOnly.length > 0 && (
          <View style={[styles.vennSection, { borderLeftColor: MC6_PALETTE.deepGold }]}>
            <Text style={[styles.vennSectionTitle, { color: MC6_PALETTE.deepGold }]}>
              Yours Only
            </Text>
            <View style={styles.vennChipRow}>
              {overlap.yoursOnly.map((v, i) => {
                const anim = revealAnims.current[yoursOnlyIdx[i]];
                return (
                  <Animated.View
                    key={v}
                    style={[
                      styles.vennChip,
                      styles.vennChipYours,
                      anim ? { opacity: anim, transform: [{ scale: anim }] } : { opacity: 0 },
                    ]}
                  >
                    <Text style={styles.vennChipText}>{v}</Text>
                  </Animated.View>
                );
              })}
            </View>
          </View>
        )}

        {/* Shared Essential */}
        {overlap.sharedEssential.length > 0 && (
          <View style={[styles.vennSection, styles.vennSectionShared, { borderLeftColor: MC6_PALETTE.overlapGreen }]}>
            <Text style={[styles.vennSectionTitle, { color: MC6_PALETTE.overlapGreen }]}>
              Shared
            </Text>
            <View style={styles.vennChipRow}>
              {overlap.sharedEssential.map((v, i) => {
                const anim = revealAnims.current[sharedIdx[i]];
                return (
                  <Animated.View
                    key={v}
                    style={[
                      styles.vennChip,
                      styles.vennChipShared,
                      anim ? { opacity: anim, transform: [{ scale: anim }] } : { opacity: 0 },
                    ]}
                  >
                    <Text style={styles.vennChipSharedText}>{v}</Text>
                    <Text style={styles.starIcon}>{'\u2605'}</Text>
                  </Animated.View>
                );
              })}
            </View>
          </View>
        )}

        {/* Theirs Only */}
        {overlap.theirsOnly.length > 0 && (
          <View style={[styles.vennSection, { borderLeftColor: MC6_PALETTE.warmAmber }]}>
            <Text style={[styles.vennSectionTitle, { color: MC6_PALETTE.warmAmber }]}>
              Theirs Only
            </Text>
            <View style={styles.vennChipRow}>
              {overlap.theirsOnly.map((v, i) => {
                const anim = revealAnims.current[theirsOnlyIdx[i]];
                return (
                  <Animated.View
                    key={v}
                    style={[
                      styles.vennChip,
                      styles.vennChipTheirs,
                      anim ? { opacity: anim, transform: [{ scale: anim }] } : { opacity: 0 },
                    ]}
                  >
                    <Text style={styles.vennChipText}>{v}</Text>
                  </Animated.View>
                );
              })}
            </View>
          </View>
        )}

        {/* Important overlap — smaller secondary list */}
        {sharedImportant.length > 0 && (
          <View style={styles.importantOverlap}>
            <Text style={styles.importantOverlapLabel}>Also shared as Important</Text>
            <Text style={styles.importantOverlapValues}>
              {sharedImportant.join('  \u00B7  ')}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleFinish}
          activeOpacity={0.7}
        >
          <Text style={styles.actionButtonText}>CONTINUE</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // ─── Phase 1 & 2: Sorting ─────────────────────

  const isPartnerPhase = phase === 'sortPartner';
  const unsortedValues = VALUES.filter(v => !currentSort[v]);
  const sortedValues = VALUES.filter(v => currentSort[v]);

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.sortingContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>
        {isPartnerPhase ? "YOUR PARTNER'S VALUES" : 'YOUR VALUES'}
      </Text>
      <Text style={styles.subtitle}>
        {isPartnerPhase
          ? 'How would your partner sort these?'
          : 'Sort these into three piles by tapping each value, then tapping a pile'}
      </Text>

      <Text style={styles.progress}>{sortedCount} of 16 sorted</Text>

      {/* Value chips grid */}
      <View style={styles.chipGrid}>
        {unsortedValues.map(value => {
          const isSelected = selectedValue === value;
          return (
            <TouchableOpacity
              key={value}
              style={[styles.valueChip, isSelected && styles.valueChipSelected]}
              onPress={() => handleValueTap(value)}
              activeOpacity={0.7}
            >
              <Text style={[styles.valueChipText, isSelected && styles.valueChipTextSelected]}>
                {value}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Pile buttons */}
      <View style={styles.pilesRow}>
        {PILES.map(pile => (
          <TouchableOpacity
            key={pile.key}
            style={[
              styles.pileButton,
              { backgroundColor: pile.color + '20', borderColor: pile.color },
              !selectedValue && styles.pileButtonDisabled,
            ]}
            onPress={() => handlePileTap(pile.key)}
            disabled={!selectedValue}
            activeOpacity={0.7}
          >
            <Text style={[styles.pileButtonText, { color: pile.color }]}>
              {pile.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Sorted values summary */}
      {sortedValues.length > 0 && (
        <View style={styles.sortedSection}>
          {PILES.map(pile => {
            const items = sortedValues.filter(v => currentSort[v] === pile.key);
            if (items.length === 0) return null;
            return (
              <View key={pile.key} style={styles.sortedGroup}>
                <Text style={[styles.sortedGroupLabel, { color: pile.color }]}>
                  {pile.label}
                </Text>
                <View style={styles.sortedChipRow}>
                  {items.map(v => (
                    <View key={v} style={[styles.sortedChip, { borderColor: pile.color }]}>
                      <Text style={styles.sortedChipText}>{v} {'\u2713'}</Text>
                    </View>
                  ))}
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* Advance button */}
      {sortedCount === 16 && (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={isPartnerPhase ? handleReveal : handleAdvanceToPartner}
          activeOpacity={0.7}
        >
          <Text style={styles.actionButtonText}>
            {isPartnerPhase ? 'See the Overlap \u2192' : "Now estimate your partner's values \u2192"}
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // ─── Intro ──────────────────────────
  introContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.scrollPadBottom,
    alignItems: 'center',
  },
  title: {
    fontSize: FontSizes.headingM,
    fontFamily: FontFamilies.heading,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: 3,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
    lineHeight: 20,
  },
  body: {
    fontSize: FontSizes.body,
    color: Colors.text,
    textAlign: 'center',
    marginTop: Spacing.md,
    lineHeight: 22,
  },
  actionButton: {
    backgroundColor: Colors.text,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: BorderRadius.pill,
    marginTop: Spacing.lg,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: FontSizes.body,
    fontWeight: '600',
    letterSpacing: 1,
  },

  // ─── Sorting ────────────────────────
  sortingContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: 100,
  },
  progress: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  valueChip: {
    backgroundColor: MC6_PALETTE.softGold,
    borderColor: MC6_PALETTE.deepGold,
    borderWidth: 1.5,
    borderRadius: BorderRadius.pill,
    paddingHorizontal: 14,
    paddingVertical: 10,
    width: '23%',
    alignItems: 'center',
  },
  valueChipSelected: {
    backgroundColor: MC6_PALETTE.deepGold,
    borderColor: MC6_PALETTE.richGold,
  },
  valueChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: MC6_PALETTE.richGold,
  },
  valueChipTextSelected: {
    color: '#FFF',
  },

  // ─── Piles ──────────────────────────
  pilesRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  pileButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: BorderRadius.pill,
    borderWidth: 2,
    alignItems: 'center',
  },
  pileButtonDisabled: {
    opacity: 0.4,
  },
  pileButtonText: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // ─── Sorted summary ────────────────
  sortedSection: {
    marginTop: Spacing.lg,
    gap: Spacing.md,
  },
  sortedGroup: {
    gap: Spacing.xs,
  },
  sortedGroupLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  sortedChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  sortedChip: {
    borderWidth: 1,
    borderRadius: BorderRadius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: Colors.surfaceElevated,
  },
  sortedChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },

  // ─── Venn Reveal ────────────────────
  revealContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.scrollPadBottom,
    alignItems: 'center',
  },
  vennSection: {
    width: '100%',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    borderLeftWidth: 4,
    padding: Spacing.md,
    marginTop: Spacing.md,
    ...Shadows.card,
  },
  vennSectionShared: {
    backgroundColor: MC6_PALETTE.overlapGreen + '12',
  },
  vennSectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  vennChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  vennChip: {
    borderRadius: BorderRadius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  vennChipYours: {
    backgroundColor: MC6_PALETTE.deepGold + '25',
    borderWidth: 1,
    borderColor: MC6_PALETTE.deepGold,
  },
  vennChipShared: {
    backgroundColor: MC6_PALETTE.overlapGreen + '30',
    borderWidth: 1.5,
    borderColor: MC6_PALETTE.overlapGreen,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  vennChipTheirs: {
    backgroundColor: MC6_PALETTE.warmAmber + '25',
    borderWidth: 1,
    borderColor: MC6_PALETTE.warmAmber,
  },
  vennChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
  },
  vennChipSharedText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  starIcon: {
    fontSize: 12,
    color: MC6_PALETTE.deepGold,
  },
  importantOverlap: {
    marginTop: Spacing.lg,
    alignItems: 'center',
  },
  importantOverlapLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    color: Colors.textMuted,
    textTransform: 'uppercase',
  },
  importantOverlapValues: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    textAlign: 'center',
    lineHeight: 20,
  },
});
