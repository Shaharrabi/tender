/**
 * L5: Reframe Gallery — Fear-to-reframe flip cards
 *
 * 8 boundary fears shown as flip cards. Tap to reveal the reframe,
 * star your favorites, then write a boundary commitment.
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Animated,
} from 'react-native';
import {
  Colors, Spacing, FontSizes, FontFamilies, BorderRadius, Shadows,
} from '@/constants/theme';
import { MC4_PALETTE } from '@/constants/mc4Theme';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

type Phase = 'intro' | 'cards' | 'commitment';

interface ReframeCard {
  id: number;
  fear: string;
  reframe: string;
}

const REFRAME_CARDS: ReframeCard[] = [
  { id: 1, fear: "If I set boundaries, they'll think I don't care.", reframe: "Boundaries show that I care enough about us to protect what we have." },
  { id: 2, fear: "Saying no makes me selfish.", reframe: "Saying no to what drains me lets me say yes to what matters." },
  { id: 3, fear: "If I need space, something is wrong with me.", reframe: "Needing space is a sign of healthy self-awareness, not a defect." },
  { id: 4, fear: "My partner should just know what I need.", reframe: "Clear communication is a gift, not a burden. Mind-reading isn\u2019t love." },
  { id: 5, fear: "Boundaries will push us apart.", reframe: "Boundaries create the safety that allows true closeness." },
  { id: 6, fear: "If I speak up, I'll start a fight.", reframe: "Speaking up with care prevents the resentment that really starts fights." },
  { id: 7, fear: "Good partners sacrifice everything.", reframe: "Good partners know that self-care isn\u2019t selfish \u2014 it\u2019s sustainable." },
  { id: 8, fear: "I should be able to handle anything.", reframe: "Acknowledging limits is strength, not weakness." },
];

interface L5ReframeGalleryProps {
  content: ResolvedLessonContent;
  attachmentStyle?: AttachmentStyle;
  onComplete: (responses: StepResponseEntry[]) => void;
}

export function L5ReframeGallery({ content, attachmentStyle, onComplete }: L5ReframeGalleryProps) {
  const haptics = useSoundHaptics();

  const [phase, setPhase] = useState<Phase>('intro');
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [starred, setStarred] = useState<number[]>([]);
  const [commitmentText, setCommitmentText] = useState('');
  const [stamped, setStamped] = useState(false);

  // Animations
  const introFade = useRef(new Animated.Value(1)).current;
  const cardsFade = useRef(new Animated.Value(0)).current;
  const flipAnim = useRef(new Animated.Value(0)).current;
  const stampScale = useRef(new Animated.Value(0)).current;

  const frontOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0, 0],
  });
  const backOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  const currentCard = REFRAME_CARDS[cardIndex];
  const isLastCard = cardIndex === REFRAME_CARDS.length - 1;

  // ─── Phase Transitions ────────────────────────

  const handleBegin = useCallback(() => {
    haptics.tap();
    Animated.timing(introFade, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setPhase('cards');
      Animated.timing(cardsFade, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    });
  }, [haptics, introFade, cardsFade]);

  // ─── Card Actions ─────────────────────────────

  const handleFlip = useCallback(() => {
    if (flipped) return;
    haptics.tap();
    setFlipped(true);
    Animated.timing(flipAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [flipped, haptics, flipAnim]);

  const handleStar = useCallback(() => {
    haptics.tapSoft();
    setStarred((prev) =>
      prev.includes(currentCard.id)
        ? prev.filter((id) => id !== currentCard.id)
        : [...prev, currentCard.id],
    );
  }, [haptics, currentCard]);

  const handleNextCard = useCallback(() => {
    haptics.tap();
    if (isLastCard) {
      setPhase('commitment');
      return;
    }
    // Reset flip state for next card
    flipAnim.setValue(0);
    setFlipped(false);
    setCardIndex((prev) => prev + 1);
  }, [haptics, isLastCard, flipAnim]);

  // ─── Commitment ───────────────────────────────

  const handleStamp = useCallback(() => {
    if (!commitmentText.trim()) return;
    haptics.success();
    setStamped(true);
    Animated.spring(stampScale, {
      toValue: 1,
      friction: 4,
      tension: 60,
      useNativeDriver: true,
    }).start();
  }, [commitmentText, haptics, stampScale]);

  const handleComplete = useCallback(() => {
    haptics.playConfetti();
    const responses: StepResponseEntry[] = [
      {
        step: 1,
        prompt: 'Reframe Gallery',
        response: JSON.stringify({
          starredReframes: starred,
          allViewed: true,
        }),
        type: 'interactive',
      },
      {
        step: 2,
        prompt: 'Boundary Commitment',
        response: commitmentText,
        type: 'commitment',
      },
    ];
    onComplete(responses);
  }, [haptics, starred, commitmentText, onComplete]);

  const starredReframes = REFRAME_CARDS.filter((c) => starred.includes(c.id));

  // ─── Intro Phase ──────────────────────────────

  if (phase === 'intro') {
    return (
      <Animated.View style={[styles.container, { opacity: introFade }]}>
        <View style={styles.introContent}>
          <Text style={styles.title}>REFRAME YOUR FEARS</Text>
          <Text style={styles.description}>
            Boundary fears feel real {'\u2014'} but they{'\u2019'}re often stories we{'\u2019'}ve
            been told, not truths we{'\u2019'}ve tested. Flip each card to discover a
            healthier way to hold the fear.
          </Text>
          <TouchableOpacity
            style={styles.beginButton}
            onPress={handleBegin}
            activeOpacity={0.7}
          >
            <Text style={styles.beginButtonText}>BEGIN</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }

  // ─── Cards Phase ──────────────────────────────

  if (phase === 'cards') {
    const isStarred = starred.includes(currentCard.id);
    return (
      <Animated.View style={[styles.container, { opacity: cardsFade }]}>
        <ScrollView
          contentContainerStyle={styles.cardsContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.progress}>
            Card {cardIndex + 1} of {REFRAME_CARDS.length}
          </Text>

          {/* Flip Card */}
          <TouchableOpacity
            style={styles.cardWrapper}
            onPress={handleFlip}
            activeOpacity={0.85}
          >
            {/* Front — Fear */}
            <Animated.View style={[styles.cardFront, { opacity: frontOpacity }]}>
              <Text style={styles.cardLabel}>FEAR</Text>
              <Text style={styles.fearText}>{'\u201C'}{currentCard.fear}{'\u201D'}</Text>
              {!flipped && (
                <Text style={styles.tapHint}>Tap to flip</Text>
              )}
            </Animated.View>

            {/* Back — Reframe */}
            <Animated.View style={[styles.cardBack, { opacity: backOpacity }]}>
              <Text style={styles.cardLabelBack}>REFRAME</Text>
              <Text style={styles.reframeText}>{'\u201C'}{currentCard.reframe}{'\u201D'}</Text>
            </Animated.View>
          </TouchableOpacity>

          {/* Star + Next */}
          {flipped && (
            <View style={styles.cardActions}>
              <TouchableOpacity
                style={styles.starButton}
                onPress={handleStar}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.starIcon,
                  isStarred && styles.starIconActive,
                ]}>
                  {isStarred ? '\u2605' : '\u2606'}
                </Text>
                <Text style={[
                  styles.starLabel,
                  isStarred && styles.starLabelActive,
                ]}>
                  {isStarred ? 'Saved' : 'Save this'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.nextCardButton}
                onPress={handleNextCard}
                activeOpacity={0.7}
              >
                <Text style={styles.nextCardButtonText}>
                  {isLastCard ? 'FINISH CARDS' : 'NEXT CARD'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </Animated.View>
    );
  }

  // ─── Commitment Phase ─────────────────────────

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.commitmentContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>YOUR STARRED REFRAMES</Text>

        {starredReframes.length > 0 ? (
          starredReframes.map((card) => (
            <View key={card.id} style={styles.starredCard}>
              <Text style={styles.starredStar}>{'\u2605'}</Text>
              <Text style={styles.starredText}>{card.reframe}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noStarsText}>
            You didn{'\u2019'}t star any reframes {'\u2014'} that{'\u2019'}s okay.
            Each one is still with you.
          </Text>
        )}

        <View style={styles.commitmentSection}>
          <Text style={styles.commitmentPrompt}>
            What{'\u2019'}s one boundary you{'\u2019'}ll set this week?
          </Text>
          <TextInput
            style={styles.commitmentInput}
            value={commitmentText}
            onChangeText={setCommitmentText}
            placeholder="I will..."
            placeholderTextColor={Colors.textMuted}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />

          {!stamped && commitmentText.trim().length > 0 && (
            <TouchableOpacity
              style={styles.stampButton}
              onPress={handleStamp}
              activeOpacity={0.7}
            >
              <Text style={styles.stampButtonText}>SEAL MY COMMITMENT</Text>
            </TouchableOpacity>
          )}

          {stamped && (
            <Animated.View style={[
              styles.stampBadge,
              { transform: [{ scale: stampScale }] },
            ]}>
              <Text style={styles.stampBadgeText}>COMMITTED</Text>
            </Animated.View>
          )}
        </View>

        {stamped && (
          <TouchableOpacity
            style={styles.completeButton}
            onPress={handleComplete}
            activeOpacity={0.7}
          >
            <Text style={styles.completeButtonText}>COMPLETE</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // ─── Intro ──────────────────────────
  introContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  title: {
    fontSize: FontSizes.headingL,
    fontFamily: FontFamilies.heading,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: 3,
    textAlign: 'center',
  },
  description: {
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  beginButton: {
    backgroundColor: MC4_PALETTE.deepTeal,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: BorderRadius.pill,
    marginTop: Spacing.xl,
  },
  beginButtonText: {
    color: '#FFF',
    fontSize: FontSizes.body,
    fontWeight: '600',
    letterSpacing: 2,
  },

  // ─── Cards ──────────────────────────
  cardsContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxxl,
    alignItems: 'center',
  },
  progress: {
    fontSize: FontSizes.caption,
    fontWeight: '600',
    letterSpacing: 2,
    color: Colors.textMuted,
    marginBottom: Spacing.lg,
    textTransform: 'uppercase',
  },
  cardWrapper: {
    width: '100%',
    minHeight: 220,
    position: 'relative',
    marginBottom: Spacing.lg,
  },
  cardFront: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    minHeight: 220,
    backgroundColor: `${MC4_PALETTE.porousRose}18`,
    borderWidth: 1.5,
    borderColor: `${MC4_PALETTE.porousRose}50`,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.card,
  },
  cardBack: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    minHeight: 220,
    backgroundColor: MC4_PALETTE.softMint,
    borderWidth: 1.5,
    borderColor: MC4_PALETTE.teal,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.card,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: MC4_PALETTE.porousRose,
    marginBottom: Spacing.sm,
  },
  cardLabelBack: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: MC4_PALETTE.deepTeal,
    marginBottom: Spacing.sm,
  },
  fearText: {
    fontSize: FontSizes.headingM,
    fontFamily: FontFamilies.accent,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 28,
    fontStyle: 'italic',
  },
  reframeText: {
    fontSize: FontSizes.headingM,
    fontFamily: FontFamilies.accent,
    color: MC4_PALETTE.deepTeal,
    textAlign: 'center',
    lineHeight: 28,
  },
  tapHint: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    marginTop: Spacing.md,
    letterSpacing: 1,
  },

  // ─── Card Actions ─────────────────
  cardActions: {
    width: '100%',
    alignItems: 'center',
    gap: Spacing.md,
  },
  starButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  starIcon: {
    fontSize: 28,
    color: Colors.textMuted,
  },
  starIconActive: {
    color: MC4_PALETTE.warmAmber,
  },
  starLabel: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '500',
    color: Colors.textMuted,
  },
  starLabelActive: {
    color: MC4_PALETTE.warmAmber,
  },
  nextCardButton: {
    backgroundColor: MC4_PALETTE.teal,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: BorderRadius.pill,
  },
  nextCardButtonText: {
    color: '#FFF',
    fontSize: FontSizes.bodySmall,
    fontWeight: '600',
    letterSpacing: 1.5,
  },

  // ─── Commitment ───────────────────
  commitmentContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxxl,
  },
  sectionTitle: {
    fontSize: FontSizes.headingM,
    fontFamily: FontFamilies.heading,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  starredCard: {
    flexDirection: 'row',
    backgroundColor: MC4_PALETTE.softMint,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    alignItems: 'flex-start',
    gap: Spacing.sm,
    ...Shadows.subtle,
  },
  starredStar: {
    fontSize: 18,
    color: MC4_PALETTE.warmAmber,
    marginTop: 2,
  },
  starredText: {
    flex: 1,
    fontSize: FontSizes.body,
    color: MC4_PALETTE.deepTeal,
    lineHeight: 22,
  },
  noStarsText: {
    fontSize: FontSizes.body,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    fontStyle: 'italic',
    marginBottom: Spacing.lg,
  },
  commitmentSection: {
    backgroundColor: MC4_PALETTE.cream,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.lg,
    alignItems: 'center',
  },
  commitmentPrompt: {
    fontSize: FontSizes.headingM,
    fontFamily: FontFamilies.heading,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  commitmentInput: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: MC4_PALETTE.teal,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSizes.body,
    color: Colors.text,
    backgroundColor: Colors.surface,
    minHeight: 80,
    lineHeight: 22,
  },
  stampButton: {
    backgroundColor: MC4_PALETTE.deepTeal,
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: BorderRadius.pill,
    marginTop: Spacing.lg,
  },
  stampButtonText: {
    color: '#FFF',
    fontSize: FontSizes.bodySmall,
    fontWeight: '600',
    letterSpacing: 1.5,
  },
  stampBadge: {
    backgroundColor: MC4_PALETTE.deepTeal,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.lg,
    ...Shadows.elevated,
  },
  stampBadgeText: {
    color: '#FFF',
    fontSize: FontSizes.headingM,
    fontFamily: FontFamilies.heading,
    fontWeight: '800',
    letterSpacing: 3,
    textAlign: 'center',
  },
  completeButton: {
    backgroundColor: Colors.text,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: BorderRadius.pill,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: Spacing.xl,
  },
  completeButtonText: {
    color: '#FFF',
    fontSize: FontSizes.body,
    fontWeight: '600',
    letterSpacing: 2,
  },
});
