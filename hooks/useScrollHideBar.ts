/**
 * useScrollHideBar — Reusable hook for hiding a bottom bar on scroll down
 * and showing it on scroll up.
 *
 * Returns:
 * - handleScroll: pass to ScrollView's onScroll
 * - animatedStyle: pass to Animated.View wrapping the bar
 * - BAR_HEIGHT: use for bottom padding calculation
 */

import { useCallback } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

const BAR_HEIGHT = 100;

export function useScrollHideBar(barHeight = BAR_HEIGHT) {
  const lastScrollY = useSharedValue(0);
  const barTranslateY = useSharedValue(0);

  const handleScroll = useCallback((event: any) => {
    const currentY = event.nativeEvent.contentOffset.y;
    const delta = currentY - lastScrollY.value;

    if (delta > 5 && currentY > 50) {
      // Scrolling down — hide bar
      barTranslateY.value = withTiming(barHeight, { duration: 200 });
    } else if (delta < -5) {
      // Scrolling up — show bar
      barTranslateY.value = withTiming(0, { duration: 200 });
    }

    lastScrollY.value = currentY;
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: barTranslateY.value }],
  }));

  return { handleScroll, animatedStyle, BAR_HEIGHT: barHeight };
}
