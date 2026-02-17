/**
 * TooltipManager — Per-screen tooltip sequencer.
 *
 * Filters tooltips for a given screen, removes already-seen ones,
 * and shows them one at a time in order. When one is dismissed,
 * the next one appears.
 *
 * Flow order: Tour completes → isFirstLaunch becomes false →
 *             Highlights run (~3.5s) → Tooltips appear
 *
 * Usage (add to any screen):
 *   <TooltipManager screen="home" />
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useFirstTime } from '@/context/FirstTimeContext';
import { getTooltipsForScreen, TooltipConfig } from '@/constants/ftue/tooltips';
import { Tooltip } from '@/components/ui/Tooltip';

interface TooltipManagerProps {
  /** Screen name (must match tooltip configs) */
  screen: string;
  /** Whether tooltips are enabled (e.g. disable during tour) */
  enabled?: boolean;
}

export const TooltipManager: React.FC<TooltipManagerProps> = ({
  screen,
  enabled = true,
}) => {
  const { state, loading, markTooltipSeen } = useFirstTime();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const wasFirstLaunch = useRef(state.isFirstLaunch);

  // Get unseen tooltips for this screen
  const unseenTooltips = useMemo(() => {
    if (loading) return [];
    const all = getTooltipsForScreen(screen);
    return all.filter((t) => !state.seenTooltips.includes(t.id));
  }, [screen, state.seenTooltips, loading]);

  // Wait for the right moment to show tooltips:
  // - If first launch: wait for isFirstLaunch to become false (tour done),
  //   then wait 4.5s for highlights to finish
  // - If returning user: wait 4s from when ready for highlights to finish
  useEffect(() => {
    if (!enabled || loading || unseenTooltips.length === 0) {
      setReady(false);
      return;
    }

    // Still in first launch tour — don't start timer yet
    if (state.isFirstLaunch) {
      setReady(false);
      return;
    }

    // Tour just completed OR returning user — wait for highlights to finish
    const delay = wasFirstLaunch.current ? 4500 : 4000;
    wasFirstLaunch.current = false;

    const timer = setTimeout(() => {
      setReady(true);
    }, delay);

    return () => {
      clearTimeout(timer);
      setReady(false);
    };
  }, [enabled, loading, unseenTooltips.length, state.isFirstLaunch]);

  // Don't show while loading, disabled, not ready, or during first launch tour
  if (!enabled || !ready || loading || state.isFirstLaunch) return null;

  // All tooltips seen for this screen
  if (currentIndex >= unseenTooltips.length) return null;

  const currentTooltip = unseenTooltips[currentIndex];

  const handleDismiss = () => {
    markTooltipSeen(currentTooltip.id);
    setCurrentIndex((prev) => prev + 1);
  };

  return <Tooltip config={currentTooltip} onDismiss={handleDismiss} />;
};
