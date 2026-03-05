/**
 * L3: Play Style Match — Card sorting into "My Style" / "Their Style" / "Both"
 *
 * 12 playfulness cards. User categorizes each. Creates a Venn-style
 * overlap visualization. Highlights shared play styles and new ones to try.
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
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
import { MC9_PALETTE } from '@/constants/mc9Theme';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

type Phase = 'intro' | 'sorting' | 'venn' | 'insight';
type Category = 'mine' | 'theirs' | 'both';

interface PlayCard {
  id: string;
  text: string;
  description: string;
}

interface L3PlayStyleMatchProps {
  content: ResolvedLessonContent;
  attachmentStyle?: AttachmentStyle;
  onComplete: (responses: StepResponseEntry[]) => void;
}

const PLAY_CARDS: PlayCard[] = [
  { id: 'silly', text: 'Silly voices & accents', description: 'Being goofy, using funny voices, making each other laugh with absurdity' },
  { id: 'adventure', text: 'Spontaneous adventures', description: 'Unplanned trips, trying new restaurants, saying yes to the unexpected' },
  { id: 'jokes', text: 'Inside jokes', description: 'References only you two understand, shared humor that builds over time' },
  { id: 'physical', text: 'Physical play', description: 'Playful wrestling, tickling, chasing, dancing in the kitchen' },
  { id: 'intellectual', text: 'Intellectual sparring', description: 'Debates, puzzles, learning together, challenging each other\u2019s ideas' },
  { id: 'creative', text: 'Creative projects', description: 'Cooking experiments, home projects, making art, building something together' },
  { id: 'games', text: 'Games & competition', description: 'Board games, video games, card games, playful bets' },
  { id: 'nature', text: 'Outdoor exploration', description: 'Hiking, beach walks, stargazing, finding new trails' },
  { id: 'music', text: 'Music & dancing', description: 'Singing together, playlists, spontaneous dancing, concerts' },
  { id: 'stories', text: 'Storytelling & memories', description: 'Reminiscing, creating stories together, imagining the future' },
  { id: 'surprise', text: 'Surprise gestures', description: 'Unexpected notes, small gifts, planning something just for them' },
  { id: 'quiet', text: 'Quiet togetherness', description: 'Reading side by side, peaceful walks, comfortable silence' },
];

const CATEGORY_COLORS: Record<Category, string> = {
  mine: MC9_PALETTE.sky,
  theirs: MC9_PALETTE.playPink,
  both: MC9_PALETTE.sunshine,
};

const CATEGORY_LABELS: Record<Category, string> = {
  mine: 'My Style',
  theirs: 'Their Style',
  both: 'Both of Us',
};

export function L3PlayStyleMatch({ content, attachmentStyle, onComplete }: L3PlayStyleMatchProps) {
  const haptics = useSoundHaptics();

  const [phase, setPhase] = useState<Phase>('intro');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [sorted, setSorted] = useState<Record<string, Category>>({});

  const vennFade = useRef(new Animated.Value(0)).current;

  const paragraphs = content.readContent.split('\n\n').filter(Boolean);
  const unsortedCards = PLAY_CARDS.filter(c => !sorted[c.id]);
  const currentCard = PLAY_CARDS[currentCardIndex];
  const allSorted = Object.keys(sorted).length === PLAY_CARDS.length;

  const mineCards = PLAY_CARDS.filter(c => sorted[c.id] === 'mine');
  const theirsCards = PLAY_CARDS.filter(c => sorted[c.id] === 'theirs');
  const bothCards = PLAY_CARDS.filter(c => sorted[c.id] === 'both');

  const handleStartSorting = useCallback(() => {
    haptics.tap();
    setPhase('sorting');
  }, [haptics]);

  const handleSort = useCallback((category: Category) => {
    haptics.tap();
    const card = PLAY_CARDS[currentCardIndex];
    if (!card) return;

    setSorted(prev => ({ ...prev, [card.id]: category }));

    if (currentCardIndex < PLAY_CARDS.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      // All sorted — show Venn
      setPhase('venn');
      Animated.timing(vennFade, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }
  }, [haptics, currentCardIndex, vennFade]);

  const handleShowInsight = useCallback(() => {
    haptics.playExerciseReveal();
    setPhase('insight');
  }, [haptics]);

  const handleContinue = useCallback(() => {
    haptics.tap();
    const responses: StepResponseEntry[] = [
      {
        step: 1,
        prompt: 'Play style sorting',
        response: JSON.stringify({
          mine: mineCards.map(c => c.text),
          theirs: theirsCards.map(c => c.text),
          both: bothCards.map(c => c.text),
          overlapCount: bothCards.length,
        }),
        type: 'interactive',
      },
    ];
    onComplete(responses);
  }, [haptics, mineCards, theirsCards, bothCards, onComplete]);

  // ─── Intro ───────────────────────────────────

  if (phase === 'intro') {
    return (
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>PLAY STYLE MATCH</Text>
        <Text style={styles.subtitle}>
          Discover how you and your partner play differently — and where you overlap.
        </Text>

        {paragraphs.slice(0, 3).map((p, i) => (
          <View key={i} style={styles.textCard}>
            <Text style={styles.textContent}>{p}</Text>
          </View>
        ))}

        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartSorting}
          activeOpacity={0.7}
        >
          <Text style={styles.startButtonText}>Start Sorting</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // ─── Sorting Phase ───────────────────────────

  if (phase === 'sorting' && currentCard) {
    const sortedCount = Object.keys(sorted).length;
    const progress = sortedCount / PLAY_CARDS.length;

    return (
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {sortedCount} of {PLAY_CARDS.length}
          </Text>
        </View>

        {/* Current card */}
        <View style={styles.cardContainer}>
          <View style={styles.playCard}>
            <Text style={styles.cardTitle}>{currentCard.text}</Text>
            <Text style={styles.cardDescription}>{currentCard.description}</Text>
          </View>
        </View>

        <Text style={styles.sortPrompt}>Who enjoys this?</Text>

        {/* Sort buttons */}
        <View style={styles.sortButtons}>
          {(['mine', 'theirs', 'both'] as Category[]).map(cat => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.sortButton,
                { backgroundColor: CATEGORY_COLORS[cat] },
              ]}
              onPress={() => handleSort(cat)}
              activeOpacity={0.7}
            >
              <Text style={styles.sortButtonText}>{CATEGORY_LABELS[cat]}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Sorted counts */}
        <View style={styles.countsRow}>
          {(['mine', 'theirs', 'both'] as Category[]).map(cat => {
            const count = PLAY_CARDS.filter(c => sorted[c.id] === cat).length;
            return (
              <View key={cat} style={styles.countBadge}>
                <View
                  style={[
                    styles.countDot,
                    { backgroundColor: CATEGORY_COLORS[cat] },
                  ]}
                />
                <Text style={styles.countText}>
                  {CATEGORY_LABELS[cat]}: {count}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    );
  }

  // ─── Venn Phase ──────────────────────────────

  if (phase === 'venn') {
    return (
      <Animated.View style={[styles.fullContainer, { opacity: vennFade }]}>
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>YOUR PLAY MAP</Text>

          {/* Venn-style columns */}
          <View style={styles.vennContainer}>
            {/* My style */}
            <View style={styles.vennColumn}>
              <View style={[styles.vennHeader, { backgroundColor: MC9_PALETTE.sky + '30' }]}>
                <Text style={[styles.vennTitle, { color: MC9_PALETTE.sky }]}>My Style</Text>
                <Text style={styles.vennCount}>{mineCards.length}</Text>
              </View>
              {mineCards.map(c => (
                <View key={c.id} style={[styles.vennItem, { borderLeftColor: MC9_PALETTE.sky }]}>
                  <Text style={styles.vennItemText}>{c.text}</Text>
                </View>
              ))}
            </View>

            {/* Both */}
            <View style={styles.vennColumn}>
              <View style={[styles.vennHeader, { backgroundColor: MC9_PALETTE.sunshine + '30' }]}>
                <Text style={[styles.vennTitle, { color: MC9_PALETTE.deepSunshine }]}>Both</Text>
                <Text style={styles.vennCount}>{bothCards.length}</Text>
              </View>
              {bothCards.map(c => (
                <View key={c.id} style={[styles.vennItem, { borderLeftColor: MC9_PALETTE.sunshine }]}>
                  <Text style={styles.vennItemText}>{c.text}</Text>
                </View>
              ))}
            </View>

            {/* Their style */}
            <View style={styles.vennColumn}>
              <View style={[styles.vennHeader, { backgroundColor: MC9_PALETTE.playPink + '30' }]}>
                <Text style={[styles.vennTitle, { color: MC9_PALETTE.playPink }]}>Their Style</Text>
                <Text style={styles.vennCount}>{theirsCards.length}</Text>
              </View>
              {theirsCards.map(c => (
                <View key={c.id} style={[styles.vennItem, { borderLeftColor: MC9_PALETTE.playPink }]}>
                  <Text style={styles.vennItemText}>{c.text}</Text>
                </View>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={styles.insightButton}
            onPress={handleShowInsight}
            activeOpacity={0.7}
          >
            <Text style={styles.insightButtonText}>What does this mean?</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    );
  }

  // ─── Insight Phase ───────────────────────────

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>YOUR PLAY INSIGHTS</Text>

      {bothCards.length > 0 && (
        <View style={styles.insightCard}>
          <Text style={styles.insightTitle}>
            Your shared playground ({bothCards.length} styles)
          </Text>
          <Text style={styles.insightText}>
            {bothCards.map(c => c.text).join(', ')} — these are your natural connection points.
            When life gets busy, these are the easiest doors back to each other.
          </Text>
        </View>
      )}

      {mineCards.length > 0 && theirsCards.length > 0 && (
        <View style={styles.insightCard}>
          <Text style={styles.insightTitle}>The invitation</Text>
          <Text style={styles.insightText}>
            You enjoy {mineCards[0]?.text.toLowerCase()} and they enjoy{' '}
            {theirsCards[0]?.text.toLowerCase()}. Different play styles are not
            incompatibility. They are invitations. "Come play in my world" is
            one of the most vulnerable bids a partner can make.
          </Text>
        </View>
      )}

      <View style={[styles.insightCard, styles.insightCardHighlight]}>
        <Text style={styles.insightTitle}>Try something new together</Text>
        <Text style={styles.insightText}>
          Pick one play style from your partner's column that you have never
          tried together. This week, try it. Not to be good at it. Just to be
          in their world for a few minutes.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.continueButton}
        onPress={handleContinue}
        activeOpacity={0.7}
      >
        <Text style={styles.continueButtonText}>Continue to Reflection</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  fullContainer: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.scrollPadBottom,
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
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },

  // Intro
  textCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.subtle,
  },
  textContent: {
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    lineHeight: 22,
  },
  startButton: {
    marginTop: Spacing.lg,
    backgroundColor: MC9_PALETTE.sunshine,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 24,
    alignSelf: 'center',
    ...Shadows.subtle,
  },
  startButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: FontSizes.body,
  },

  // Progress
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.borderLight,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: MC9_PALETTE.sunshine,
    borderRadius: 3,
  },
  progressText: {
    fontSize: FontSizes.caption,
    fontWeight: '600',
    color: Colors.textSecondary,
  },

  // Card
  cardContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  playCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    borderWidth: 2,
    borderColor: MC9_PALETTE.sunshine + '40',
    ...Shadows.subtle,
    width: '100%',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  cardTitle: {
    fontSize: FontSizes.headingM,
    fontFamily: FontFamilies.heading,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },

  sortPrompt: {
    fontSize: FontSizes.body,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },

  // Sort buttons
  sortButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  sortButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
  },
  sortButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: FontSizes.bodySmall,
  },

  // Counts
  countsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
    flexWrap: 'wrap',
  },
  countBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  countDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  countText: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    fontWeight: '500',
  },

  // Venn
  vennContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  vennColumn: {
    flex: 1,
    gap: 4,
  },
  vennHeader: {
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    alignItems: 'center',
    gap: 2,
    marginBottom: 4,
  },
  vennTitle: {
    fontSize: FontSizes.caption,
    fontWeight: '700',
    fontFamily: FontFamilies.heading,
  },
  vennCount: {
    fontSize: FontSizes.headingM,
    fontWeight: '700',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
  },
  vennItem: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.sm,
    padding: 6,
    borderLeftWidth: 3,
  },
  vennItemText: {
    fontSize: FontSizes.caption - 1,
    color: Colors.text,
    lineHeight: 14,
  },

  // Insight
  insightButton: {
    backgroundColor: MC9_PALETTE.sunshine,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 24,
    alignSelf: 'center',
    ...Shadows.subtle,
  },
  insightButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: FontSizes.body,
  },
  insightCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.subtle,
    gap: Spacing.sm,
  },
  insightCardHighlight: {
    borderLeftWidth: 3,
    borderLeftColor: MC9_PALETTE.sunshine,
  },
  insightTitle: {
    fontSize: FontSizes.body,
    fontWeight: '600',
    fontFamily: FontFamilies.heading,
    color: MC9_PALETTE.deepSunshine,
  },
  insightText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    lineHeight: 22,
  },

  // Continue
  continueButton: {
    marginTop: Spacing.xl,
    backgroundColor: MC9_PALETTE.sunshine,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 24,
    alignSelf: 'center',
    ...Shadows.subtle,
  },
  continueButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: FontSizes.body,
  },
});
