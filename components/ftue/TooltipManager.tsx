/**
 * TooltipManager — Per-screen tooltip sequencer with auto-scroll.
 *
 * Filters tooltips for a given screen, removes already-seen ones,
 * and shows them one at a time in order. When one is dismissed,
 * the next one appears.
 *
 * Auto-scroll: If a scrollRef + scrollOffset are provided, the manager
 * scrolls the target element into view before showing each tooltip.
 * The app "moves to" each feature naturally.
 *
 * Flow order: Tour completes → isFirstLaunch becomes false →
 *             Highlights run (~2s) → Tooltips appear with scroll
 *
 * Usage (add to any screen):
 *   const scrollOffset = useRef(0);
 *   <ScrollView onScroll={(e) => { scrollOffset.current = e.nativeEvent.contentOffset.y; }}>
 *   <TooltipManager screen="home" scrollRef={scrollViewRef} scrollOffset={scrollOffset} />
 */

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { ScrollView, Dimensions } from 'react-native';
import { useFirstTime } from '@/context/FirstTimeContext';
import { getTooltipsForScreen, TooltipConfig } from '@/constants/ftue/tooltips';
import { RefRegistry } from '@/utils/ftue/refRegistry';
import { Tooltip } from '@/components/ui/Tooltip';

interface TooltipManagerProps {
  /** Screen name (must match tooltip configs) */
  screen: string;
  /** Whether tooltips are enabled (e.g. disable during tour) */
  enabled?: boolean;
  /** ScrollView ref for auto-scrolling to off-screen targets */
  scrollRef?: React.RefObject<ScrollView>;
  /** Current scroll Y offset (tracked via onScroll) */
  scrollOffset?: React.RefObject<number>;
}

export const TooltipManager: React.FC<TooltipManagerProps> = ({
  screen,
  enabled = true,
  scrollRef,
  scrollOffset,
}) => {
  const { state, loading, markTooltipSeen } = useFirstTime();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const [scrolledAndReady, setScrolledAndReady] = useState(false);
  const wasFirstLaunch = useRef(state.isFirstLaunch);

  // Get unseen tooltips for this screen
  const unseenTooltips = useMemo(() => {
    if (loading) return [];
    const all = getTooltipsForScreen(screen);
    return all.filter((t) => !state.seenTooltips.includes(t.id));
  }, [screen, state.seenTooltips, loading]);

  // Wait for the right moment to show tooltips
  useEffect(() => {
    if (!enabled || loading || unseenTooltips.length === 0) {
      setReady(false);
      return;
    }

    if (state.isFirstLaunch) {
      setReady(false);
      return;
    }

    // After tour: wait for highlights to finish (~1.6s animation)
    const delay = wasFirstLaunch.current ? 1800 : 1500;
    wasFirstLaunch.current = false;

    const timer = setTimeout(() => {
      setReady(true);
    }, delay);

    return () => {
      clearTimeout(timer);
      setReady(false);
    };
  }, [enabled, loading, unseenTooltips.length, state.isFirstLaunch]);

  // Auto-scroll to target when ready or index changes
  const scrollToTarget = useCallback(async (tooltip: TooltipConfig) => {
    setScrolledAndReady(false);

    // If no scroll ref, show immediately (non-scrollable screen)
    if (!scrollRef?.current) {
      setScrolledAndReady(true);
      return;
    }

    // Measure where the target currently is on screen
    const measurement = await RefRegistry.measure(tooltip.targetRef);
    if (!measurement) {
      // Element not registered or not measurable — show anyway
      setScrolledAndReady(true);
      return;
    }

    const { height: screenHeight } = Dimensions.get('window');
    const targetBottom = measurement.y + measurement.height;

    // Check if the element is already nicely visible in the viewport
    // We want it in the top 60% of the screen so the tooltip fits below
    const comfortTop = screenHeight * 0.1;
    const comfortBottom = screenHeight * 0.55;

    if (measurement.y >= comfortTop && targetBottom <= comfortBottom) {
      // Already visible and well-positioned — show tooltip immediately
      setScrolledAndReady(true);
      return;
    }

    // Need to scroll. Calculate the absolute content offset we need.
    // measureInWindow gives screen coordinates.
    // If element is at screen Y=800 and we want it at screen Y=200,
    // we need to scroll down by 600 from current position.
    const currentOffset = scrollOffset?.current ?? 0;
    const desiredScreenY = screenHeight * 0.25; // Place element at ~25% from top
    const scrollDelta = measurement.y - desiredScreenY;
    const newOffset = Math.max(0, currentOffset + scrollDelta);

    try {
      scrollRef.current.scrollTo({
        y: newOffset,
        animated: true,
      });

      // Wait for smooth scroll to finish, then re-measure and show
      setTimeout(() => {
        setScrolledAndReady(true);
      }, 450);
    } catch {
      setScrolledAndReady(true);
    }
  }, [scrollRef, scrollOffset]);

  // Trigger scroll when ready and index changes
  useEffect(() => {
    if (!ready || currentIndex >= unseenTooltips.length) return;

    scrollToTarget(unseenTooltips[currentIndex]);
  }, [ready, currentIndex, unseenTooltips, scrollToTarget]);

  // Don't show while loading, disabled, not ready, or during first launch tour
  if (!enabled || !ready || !scrolledAndReady || loading || state.isFirstLaunch) return null;

  // All tooltips seen for this screen
  if (currentIndex >= unseenTooltips.length) return null;

  const currentTooltip = unseenTooltips[currentIndex];

  const handleDismiss = () => {
    markTooltipSeen(currentTooltip.id);
    setScrolledAndReady(false); // Reset so next tooltip triggers scroll
    setCurrentIndex((prev) => prev + 1);
  };

  return <Tooltip config={currentTooltip} onDismiss={handleDismiss} />;
};
