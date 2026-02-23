/**
 * CardFront — Front face of a Building Bridges game card
 *
 * Displays card title with decorative geometric/botanical pattern
 * in the category's color, plus a category badge pill.
 * Wes Anderson aesthetic — warm, analog, unhurried.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Path, Rect, G } from 'react-native-svg';
import { Colors, Spacing, BorderRadius, FontFamilies, FontSizes } from '@/constants/theme';
import type { GameCard } from '@/constants/card-game/cards';
import { getCategoryById, OPEN_HEART_DECK } from '@/constants/card-game/categories';

interface CardFrontProps {
  card: GameCard;
  width?: number;
  height?: number;
}

/** Geometric botanical SVG pattern — unique per category */
function DecoPattern({ color, colorLight, width, height }: { color: string; colorLight: string; width: number; height: number }) {
  const cx = width / 2;
  const cy = height * 0.38;

  return (
    <Svg width={width} height={height * 0.65} style={styles.svgPattern}>
      {/* Background circles */}
      <Circle cx={cx} cy={cy} r={60} fill={colorLight} opacity={0.5} />
      <Circle cx={cx} cy={cy} r={40} fill={colorLight} opacity={0.7} />
      <Circle cx={cx} cy={cy} r={20} fill={color} opacity={0.3} />

      {/* Botanical leaf shapes */}
      <G transform={`translate(${cx}, ${cy})`}>
        {/* Top leaf */}
        <Path
          d="M0,-55 Q15,-35 0,-15 Q-15,-35 0,-55Z"
          fill={color}
          opacity={0.4}
        />
        {/* Right leaf */}
        <Path
          d="M55,0 Q35,15 15,0 Q35,-15 55,0Z"
          fill={color}
          opacity={0.35}
        />
        {/* Bottom leaf */}
        <Path
          d="M0,55 Q-15,35 0,15 Q15,35 0,55Z"
          fill={color}
          opacity={0.4}
        />
        {/* Left leaf */}
        <Path
          d="M-55,0 Q-35,-15 -15,0 Q-35,15 -55,0Z"
          fill={color}
          opacity={0.35}
        />
        {/* Center diamond */}
        <Path
          d="M0,-10 L10,0 L0,10 L-10,0Z"
          fill={color}
          opacity={0.6}
        />
      </G>

      {/* Corner decorations */}
      <Circle cx={20} cy={20} r={6} fill={color} opacity={0.2} />
      <Circle cx={width - 20} cy={20} r={6} fill={color} opacity={0.2} />
      <Circle cx={20} cy={height * 0.6} r={4} fill={color} opacity={0.15} />
      <Circle cx={width - 20} cy={height * 0.6} r={4} fill={color} opacity={0.15} />

      {/* Decorative lines */}
      <Rect x={30} y={height * 0.58} width={width - 60} height={1} fill={color} opacity={0.15} />
    </Svg>
  );
}

export default function CardFront({ card, width = 300, height = 440 }: CardFrontProps) {
  const isOpenHeart = card.deck === 'open-heart';
  const category = card.category ? getCategoryById(card.category) : undefined;

  const color = isOpenHeart ? OPEN_HEART_DECK.color : (category?.color ?? Colors.accent);
  const colorLight = isOpenHeart ? OPEN_HEART_DECK.colorLight : (category?.colorLight ?? Colors.primaryFaded);
  const categoryName = isOpenHeart ? 'Open Heart' : (category?.name ?? '');

  return (
    <View style={[styles.card, { width, height }]}>
      {/* Top accent bar */}
      <View style={[styles.accentBar, { backgroundColor: color }]} />

      {/* Decorative pattern */}
      <DecoPattern color={color} colorLight={colorLight} width={width} height={height} />

      {/* Card title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={3}>
          {card.title}
        </Text>
      </View>

      {/* Category badge */}
      <View style={[styles.badge, { backgroundColor: colorLight }]}>
        <Text style={[styles.badgeText, { color }]}>{categoryName}</Text>
      </View>

      {/* Tap hint */}
      <Text style={styles.tapHint}>Tap to flip</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
  },
  svgPattern: {
    position: 'absolute',
    top: 0,
  },
  titleContainer: {
    position: 'absolute',
    bottom: 80,
    left: Spacing.lg,
    right: Spacing.lg,
    alignItems: 'center',
  },
  title: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.headingM,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 2,
    lineHeight: 28,
  },
  badge: {
    position: 'absolute',
    bottom: 44,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.pill,
  },
  badgeText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  tapHint: {
    position: 'absolute',
    bottom: Spacing.md,
    fontFamily: FontFamilies.body,
    fontSize: 11,
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
});
