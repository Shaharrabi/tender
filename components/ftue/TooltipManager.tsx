/**
 * TooltipManager — Per-screen tooltip sequencer with auto-scroll.
 *
 * Filters tooltips for a given screen, removes already-seen ones,
 * and shows them one at a time in order. When one is dismissed,
 * the next one appears.
 *
 * IMPORTANT: The tooltip queue is captured once on initialization.
 * As tooltips are marked seen, the queue does NOT shrink — only the
 * currentIndex advances. This prevents the off-by-one bug where
 * marking a tooltip seen would shrink the array and skip the next one.
 *
 * Auto-scroll: If a scrollRef + scrollOffset are provided, the manager
 * scrolls the target element into view before showing each tooltip.
 * The app "moves to" each feature naturally.
 *
 * Flow order: Tour completes → isFirstLaunch becomes false →
 *             Highlights run (~0.5s) → Tooltips appear with scroll
 *
 * Usage (add to any screen):
 *   const scrollOffset = useRef(0);
 *   <ScrollView onScroll={(e) => { scrollOffset.current = e.nativeEvent.contentOffset.y; }}>
 *   <TooltipManager screen="home" scrollRef={scrollViewRef} scrollOffset={scrollOffset} />
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  scrollRef?: React.RefObject<ScrollView | null>;
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

  // Capture the tooltip queue ONCE when we first become ready.
  // This prevents the list from shrinking as we mark tooltips seen,
  // which would cause index misalignment and skip tooltips.
  const [tooltipQueue, setTooltipQueue] = useState<TooltipConfig[]>([]);
  const queueInitialized = useRef(false);

  // Initialize the queue once loading is done
  useEffect(() => {
    if (loading || queueInitialized.current) return;

    const all = getTooltipsForScreen(screen);
    const unseen = all.filter((t) => !state.seenTooltips.includes(t.id));

    if (unseen.length > 0) {
      setTooltipQueue(unseen);
      queueInitialized.current = true;
    }
  }, [screen, loading, state.seenTooltips]);

  // Wait for the right moment to show tooltips
  useEffect(() => {
    if (!enabled || loading || tooltipQueue.length === 0) {
      setReady(false);
      return;
    }

    if (state.isFirstLaunch) {
      setReady(false);
      return;
    }

    // After tour: short wait for highlights to finish (~0.5s animation)
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
  }, [enabled, loading, tooltipQueue.length, state.isFirstLaunch]);

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
    const layoutMeasurement = await RefRegistry.measureLayout(tooltip.targetRef);

    if (layoutMeasurement) {
      // ref.measure() pageY gives position relative to root view.
      // For scrolled content: pageY = contentY - scrollOffset
      // ContentY = pageY + scrollOffset
      // To show at desiredScreenY: scrollTo = contentY - desiredScreenY
      const contentY = layoutMeasurement.y + currentOffset;
      const newOffset = Math.max(0, contentY - desiredScreenY);

      try {
        scrollRef.current.scrollTo({ y: newOffset, animated: true });
        setTimeout(() => setScrolledAndReady(true), 450);
      } catch {
        setScrolledAndReady(true);
      }
      return;
    }

    // Neither measurement worked — show tooltip anyway (Tooltip will retry)
    setScrolledAndReady(true);
  }, [scrollRef, scrollOffset]);

  // Trigger scroll when ready and index changes
  useEffect(() => {
    if (!ready || currentIndex >= tooltipQueue.length) return;

    scrollToTarget(tooltipQueue[currentIndex]);
  }, [ready, currentIndex, tooltipQueue, scrollToTarget]);

  // Don't show while loading, disabled, not ready, or during first launch tour
  if (!enabled || !ready || !scrolledAndReady || loading || state.isFirstLaunch) return null;

  // All tooltips done
  if (currentIndex >= tooltipQueue.length) return null;

  const currentTooltip = tooltipQueue[currentIndex];

  const handleDismiss = () => {
    markTooltipSeen(currentTooltip.id);
    setScrolledAndReady(false); // Reset so next tooltip triggers scroll
    setCurrentIndex((prev) => prev + 1);
  };

  return <Tooltip config={currentTooltip} onDismiss={handleDismiss} />;
};
