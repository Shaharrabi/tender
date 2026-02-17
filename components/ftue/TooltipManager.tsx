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
 * For off-screen elements, uses measureLayout (which works regardless
 * of viewport position) combined with scroll offset to calculate
 * where to scroll.
 *
 * Flow order: Tour completes → isFirstLaunch becomes false →
 *             Highlights run (~1.2s) → Tooltips appear with scroll
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

    // After tour: short wait for highlights to finish (~1.2s animation)
    // Then tooltips start. 500ms feels snappy after the welcome modal.
    const delay = wasFirstLaunch.current ? 500 : 400;
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

    const { height: screenHeight } = Dimensions.get('window');
    const currentOffset = scrollOffset?.current ?? 0;
    const desiredScreenY = screenHeight * 0.25; // Place element at ~25% from top

    // First try measureInWindow (works for on-screen elements)
    const windowMeasurement = await RefRegistry.measure(tooltip.targetRef);

    if (windowMeasurement) {
      const targetBottom = windowMeasurement.y + windowMeasurement.height;
      const comfortTop = screenHeight * 0.1;
      const comfortBottom = screenHeight * 0.55;

      if (windowMeasurement.y >= comfortTop && targetBottom <= comfortBottom) {
        // Already visible and well-positioned — show tooltip immediately
        setScrolledAndReady(true);
        return;
      }

      // On screen but not well-positioned — scroll to better position
      const scrollDelta = windowMeasurement.y - desiredScreenY;
      const newOffset = Math.max(0, currentOffset + scrollDelta);

      try {
        scrollRef.current.scrollTo({ y: newOffset, animated: true });
        setTimeout(() => setScrolledAndReady(true), 400);
      } catch {
        setScrolledAndReady(true);
      }
      return;
    }

    // Element is off-screen (measureInWindow returned null).
    // Use measureLayout which works for off-screen elements in ScrollViews.
    // measureLayout gives the position relative to the root view, which for
    // elements inside a ScrollView means the absolute content position.
    const layoutMeasurement = await RefRegistry.measureLayout(tooltip.targetRef);

    if (layoutMeasurement) {
      // layoutMeasurement.y is the element's Y position in the scroll content
      // (actually it's pageY which accounts for scroll offset already,
      // but for off-screen elements it gives the content-absolute position)
      // We want to scroll so the element ends up at desiredScreenY on screen.
      // The element's content Y = currentOffset + layoutMeasurement.y (since it's off-screen,
      // pageY may be negative or very large).
      // Better approach: element's Y in content = currentOffset + screenY
      // But if it's off-screen, we can estimate: the element is below the viewport
      // so its content position ~ currentOffset + screenHeight + some amount.
      // Actually, ref.measure() pageY gives position relative to root *including scroll*,
      // so for a scrolled view, pageY = contentY - scrollOffset.
      // If element is below viewport, pageY could be > screenHeight.
      // ContentY = pageY + scrollOffset = layoutMeasurement.y + currentOffset
      // To show it at desiredScreenY: scrollTo = contentY - desiredScreenY
      const contentY = layoutMeasurement.y + currentOffset;
      const newOffset = Math.max(0, contentY - desiredScreenY);

      try {
        scrollRef.current.scrollTo({ y: newOffset, animated: true });
        // Wait for scroll to complete, then show tooltip
        setTimeout(() => setScrolledAndReady(true), 450);
      } catch {
        setScrolledAndReady(true);
      }
      return;
    }

    // Neither measurement worked — element not registered or truly not renderable.
    // Skip this tooltip.
    setScrolledAndReady(true);
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
