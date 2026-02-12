/**
 * NudgeCarousel — a horizontal scrolling carousel of nudge cards.
 *
 * Displays contextual prompts, reminders, and motivational messages.
 * Each card shows an icon, title, and body text. Tapping a card
 * navigates to the nudge's actionRoute when available.
 * Dot indicators at the bottom reflect the current page.
 */

import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSizes, FontFamilies, BorderRadius, Shadows } from '@/constants/theme';
import type { Nudge } from '@/utils/nudges';

// ─── Constants ──────────────────────────────────────────

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_HORIZONTAL_MARGIN = Spacing.sm;
const CAROUSEL_PADDING = Spacing.md;
const CARD_WIDTH = SCREEN_WIDTH - CAROUSEL_PADDING * 2;

// ─── Props ──────────────────────────────────────────────

interface NudgeCarouselProps {
  nudges: Nudge[];
}

// ─── Component ──────────────────────────────────────────

export default function NudgeCarousel({ nudges }: NudgeCarouselProps) {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / CARD_WIDTH);
      setActiveIndex(index);
    },
    [],
  );

  const handleCardPress = useCallback(
    (nudge: Nudge) => {
      if (nudge.actionRoute) {
        router.push(nudge.actionRoute as any);
      }
    },
    [router],
  );

  if (nudges.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH}
        snapToAlignment="start"
        contentContainerStyle={styles.scrollContent}
      >
        {nudges.map((nudge) => (
          <Pressable
            key={nudge.id}
            style={({ pressed }) => [
              styles.card,
              nudge.actionRoute ? styles.cardTappable : undefined,
              pressed && nudge.actionRoute ? styles.cardPressed : undefined,
            ]}
            onPress={() => handleCardPress(nudge)}
            disabled={!nudge.actionRoute}
          >
            <Text style={styles.icon}>{nudge.icon}</Text>
            <View style={styles.textContainer}>
              <Text style={styles.title} numberOfLines={1}>
                {nudge.title}
              </Text>
              <Text style={styles.body} numberOfLines={2}>
                {nudge.body}
              </Text>
            </View>
            {nudge.actionRoute && (
              <Text style={styles.chevron}>{'›'}</Text>
            )}
          </Pressable>
        ))}
      </ScrollView>

      {/* Dot indicators */}
      {nudges.length > 1 && (
        <View style={styles.dotsContainer}>
          {nudges.map((nudge, index) => (
            <View
              key={nudge.id}
              style={[
                styles.dot,
                index === activeIndex ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.md,
  },
  scrollContent: {
    paddingHorizontal: CAROUSEL_PADDING,
  },
  card: {
    width: CARD_WIDTH - CARD_HORIZONTAL_MARGIN * 2,
    marginHorizontal: CARD_HORIZONTAL_MARGIN,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadows.card,
  },
  cardTappable: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  icon: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.body,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  body: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    lineHeight: FontSizes.bodySmall * 1.4,
  },
  chevron: {
    fontSize: FontSizes.headingL,
    color: Colors.textMuted,
    marginLeft: Spacing.sm,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: Spacing.xs,
  },
  dotActive: {
    backgroundColor: Colors.primary,
  },
  dotInactive: {
    backgroundColor: Colors.borderLight,
  },
});
