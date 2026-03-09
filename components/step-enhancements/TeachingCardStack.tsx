/**
 * TeachingCardStack — Swipeable bite-sized teaching cards.
 *
 * Uses app SVG icons instead of Unicode emojis for consistent rendering.
 *
 * Verified: FadeIn from react-native-reanimated (same import as step-detail.tsx)
 *   Shadows.elevated = { shadowOffset: {0,4}, shadowOpacity: 0.10 }
 *   Colors.borderLight = '#F0E6E0', Colors.border = '#E0D3CE'
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  type ViewToken,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import TenderText from '@/components/ui/TenderText';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import type { TeachingCard } from '@/utils/steps/step-teaching-cards';
import type { IconProps } from '@/assets/graphics/icons/types';

// App SVG icons
import {
  LeafIcon, SwirlyIcon, EyeIcon, SparkleIcon, WaveIcon,
  SeedlingIcon, HandshakeIcon, BookOpenIcon, UnlockIcon, MirrorIcon,
  ShieldIcon, HeartIcon, HeartFireIcon, LightbulbIcon, LightningIcon,
  TreeIcon, SunIcon, BrainIcon, MeditationIcon, CompassIcon,
  FireIcon, StarIcon, PenIcon, NotepadIcon, RefreshIcon, HomeIcon,
  ScaleIcon, PlantIcon, TargetIcon, CalendarIcon,
} from '@/assets/graphics/icons';

/** Map emoji accent strings to app SVG icon components */
const ACCENT_ICON_MAP: Record<string, React.ComponentType<IconProps>> = {
  '\uD83C\uDF3F': LeafIcon,       // 🌿
  '\uD83C\uDF00': SwirlyIcon,     // 🌀
  '\uD83D\uDC41\uFE0F': EyeIcon,  // 👁️
  '\uD83D\uDEAA': CompassIcon,    // 🚪 → Compass
  '\u2728': SparkleIcon,           // ✨
  '\uD83C\uDF0A': WaveIcon,       // 🌊
  '\uD83C\uDF31': SeedlingIcon,   // 🌱
  '\uD83E\uDD1D': HandshakeIcon,  // 🤝
  '\uD83D\uDCD6': BookOpenIcon,   // 📖
  '\uD83D\uDDFA\uFE0F': CompassIcon, // 🗺️ → Compass
  '\uD83E\uDEB6': LeafIcon,       // 🪶 → Leaf
  '\uD83D\uDD13': UnlockIcon,     // 🔓
  '\uD83E\uDE9E': MirrorIcon,     // 🪞
  '\uD83E\uDDD2': SeedlingIcon,   // 🧒 → Seedling
  '\uD83D\uDCA1': LightbulbIcon,  // 💡
  '\uD83E\uDEC6': HeartIcon,      // 🫶 → Heart
  '\uD83D\uDEE1\uFE0F': ShieldIcon, // 🛡️
  '\uD83D\uDC9C': HeartIcon,      // 💜 → Heart
  '\u26A1': LightningIcon,        // ⚡
  '\uD83D\uDD25': FireIcon,       // 🔥
  '\uD83C\uDF05': SunIcon,        // 🌅 → Sun
  '\uD83C\uDFCB\uFE0F': TargetIcon, // 🏋️ → Target
  '\uD83E\uDDE0': BrainIcon,      // 🧠
  '\uD83C\uDF32': TreeIcon,       // 🌲
  '\uD83D\uDCC5': CalendarIcon,   // 📅
  '\uD83D\uDCAC': CompassIcon,    // 💬 → Compass
  '\uD83E\uDE79': HeartIcon,      // 🩹 → Heart
  '\uD83D\uDD01': RefreshIcon,    // 🔁
  '\uD83C\uDFE1': HomeIcon,       // 🏡
  '\u2696\uFE0F': ScaleIcon,      // ⚖️
  '\uD83E\uDEB7': PlantIcon,      // 🪷 → Plant
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - Spacing.xl * 2;

interface TeachingCardStackProps {
  cards: TeachingCard[];
  phaseColor: string;
  onComplete: () => void;
  onCardChange?: (index: number) => void;
}

export default function TeachingCardStack({
  cards,
  phaseColor,
  onComplete,
  onCardChange,
}: TeachingCardStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setCurrentIndex(viewableItems[0].index);
        onCardChange?.(viewableItems[0].index);
      }
    },
    [onCardChange]
  );

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;
  const isLast = currentIndex === cards.length - 1;
  const isFirst = currentIndex === 0;

  const goNext = () => {
    if (!isLast) flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
  };
  const goPrev = () => {
    if (!isFirst) flatListRef.current?.scrollToIndex({ index: currentIndex - 1, animated: true });
  };

  const renderCard = ({ item, index }: { item: TeachingCard; index: number }) => {
    const IconComp = item.accent ? ACCENT_ICON_MAP[item.accent] : null;

    return (
      <View style={[styles.cardOuter, { width: CARD_WIDTH }]}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <TenderText variant="label" color={phaseColor} style={styles.counter}>
              {index + 1} OF {cards.length}
            </TenderText>
            <View style={styles.dotsRow}>
              {cards.map((_, i) => (
                <View key={i} style={[styles.dot, { backgroundColor: i === currentIndex ? phaseColor : Colors.borderLight }]} />
              ))}
            </View>
          </View>
          {IconComp && (
            <View style={[styles.accentBox, { backgroundColor: phaseColor + '12' }]}>
              <IconComp size={24} color={phaseColor} />
            </View>
          )}
          <TenderText variant="headingS" color={Colors.text}>{item.title}</TenderText>
          <TenderText variant="body" color={Colors.textSecondary} style={styles.body}>{item.body}</TenderText>
        </View>
      </View>
    );
  };

  return (
    <Animated.View entering={FadeIn.delay(300).duration(500)} style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={cards}
        renderItem={renderCard}
        keyExtractor={(_, i) => String(i)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH}
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfig}
        getItemLayout={(_, index) => ({ length: CARD_WIDTH, offset: CARD_WIDTH * index, index })}
      />
      <View style={styles.navRow}>
        <TouchableOpacity onPress={goPrev} disabled={isFirst}
          style={[styles.navBtn, isFirst && { opacity: 0.4 }]} activeOpacity={0.7}>
          <TenderText variant="bodySmall" color={isFirst ? Colors.textMuted : Colors.text}>{'\u2190'} Back</TenderText>
        </TouchableOpacity>
        {isLast ? (
          <TouchableOpacity onPress={onComplete}
            style={[styles.navBtnPrimary, { backgroundColor: phaseColor }]} activeOpacity={0.8}>
            <TenderText variant="buttonSmall" color={Colors.white}>{'\u2713'} Done Reading</TenderText>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={goNext}
            style={[styles.navBtnPrimary, { backgroundColor: phaseColor }]} activeOpacity={0.8}>
            <TenderText variant="buttonSmall" color={Colors.white}>Next {'\u2192'}</TenderText>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.md },
  cardOuter: { paddingHorizontal: 2 },
  card: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: Spacing.lg,
    minHeight: 200,
    gap: Spacing.sm,
    ...Shadows.elevated,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  counter: { fontSize: 10, letterSpacing: 2 },
  dotsRow: { flexDirection: 'row', gap: 4 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  accentBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xs,
  },
  body: { lineHeight: 26 },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.sm, paddingHorizontal: 2 },
  navBtn: { borderWidth: 1, borderColor: Colors.border, borderRadius: BorderRadius.pill, paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg },
  navBtnPrimary: { borderRadius: BorderRadius.pill, paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg },
});
