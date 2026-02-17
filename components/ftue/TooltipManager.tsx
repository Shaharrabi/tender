/**
 * TooltipManager — Per-screen tooltip sequencer.
 *
 * Filters tooltips for a given screen, removes already-seen ones,
 * and shows them one at a time in order. When one is dismissed,
 * the next one appears.
 *
 * Usage (add to any screen):
 *   <TooltipManager screen="home" />
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useFirstTime } from '@/context/FirstTimeContext';
import { getTooltipsForScreen, TooltipConfig } from '@/constants/ftue/tooltips';
import { Tooltip } from '@/components/ui/Tooltip';

interface TooltipManagerProps {
  /** Screen name (must match tooltip configs) */
  screen: string;
  /** Optional delay before starting tooltips (ms) */
  delay?: number;
  /** Whether tooltips are enabled (e.g. disable during tour) */
  enabled?: boolean;
}

export const TooltipManager: React.FC<TooltipManagerProps> = ({
  screen,
  delay = 4000,  // Wait for highlight animations to finish (300ms delay + 3000ms animation + buffer)
  enabled = true,
}) => {
  const { state, loading, markTooltipSeen } = useFirstTime();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ready, setReady] = useState(false);

  // Get unseen tooltips for this screen
  const unseenTooltips = useMemo(() => {
    if (loading) return [];
    const all = getTooltipsForScreen(screen);
    return all.filter((t) => !state.seenTooltips.includes(t.id));
  }, [screen, state.seenTooltips, loading]);

  // Delay before showing first tooltip (let screen render & settle)
  useEffect(() => {
    if (!enabled || loading || unseenTooltips.length === 0) return;

    const timer = setTimeout(() => {
      setReady(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [enabled, loading, unseenTooltips.length, delay]);

  // Don't show tooltips during first launch tour
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
