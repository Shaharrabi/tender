/*
 * ═══════════════════════════════════════════════════════════════
 * TENDER ILLUSTRATION ANIMATION HOOKS + WEB CSS ANIMATIONS
 * File: hooks/useIllustrationAnimation.ts
 * ───────────────────────────────────────────────────────────────
 * On WEB: injects CSS @keyframes into <head>, then uses
 * useWebSvgAnim() to apply CSS animations DIRECTLY to SVG DOM
 * elements after mount — bypassing react-native-svg style filtering.
 *
 * On NATIVE (iOS/Android): uses react-native-reanimated hooks.
 *
 * CSS animation names (matching the original HTML design):
 *   breathe, float, pulse, flicker, sway, expand, rise, glow, drift
 * ═══════════════════════════════════════════════════════════════
 */

import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import {
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  useAnimatedStyle,
  useAnimatedProps,
  Easing,
} from 'react-native-reanimated';

// ══════════════════════════════════════════════════════════════
// WEB: Inject CSS @keyframes ONCE into <head>
// These are the EXACT keyframes from the original HTML design
// ══════════════════════════════════════════════════════════════
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  if (!document.getElementById('tender-illustration-keyframes')) {
    const style = document.createElement('style');
    style.id = 'tender-illustration-keyframes';
    style.textContent = `
      @keyframes tender-breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
      @keyframes tender-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
      @keyframes tender-pulse{0%,100%{opacity:.35}50%{opacity:.95}}
      @keyframes tender-flicker{0%,100%{opacity:.6}45%{opacity:1}}
      @keyframes tender-expand{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
      @keyframes tender-sway{0%,100%{transform:rotate(0deg)}50%{transform:rotate(4deg)}}
      @keyframes tender-rise{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
      @keyframes tender-glow{0%,100%{opacity:.07}50%{opacity:.25}}
      @keyframes tender-drift{0%,100%{transform:translate(0,0)}50%{transform:translate(3px,-3px)}}
    `;
    document.head.appendChild(style);
  }
}

const isWeb = Platform.OS === 'web';

// ══════════════════════════════════════════════════════════════
// WEB: Direct DOM animation hook
// Bypasses react-native-svg style filtering by applying CSS
// animations directly to SVG DOM elements after they render.
// ══════════════════════════════════════════════════════════════

export type WebAnimTarget = {
  /** CSS selector to find element(s) within the container */
  selector: string;
  /** Full CSS animation string, e.g. 'tender-breathe 5.5s ease-in-out infinite' */
  animation: string;
  /** CSS transform-origin, e.g. '90px 140px' */
  origin?: string;
  /** If true, apply to ALL matches; if false (default), only first match */
  all?: boolean;
  /** If true, apply animation to the PARENT element of the matched element
   *  (useful for targeting <g> groups wrapping animated SVG elements) */
  parent?: boolean;
};

let _svgAnimCounter = 0;

/**
 * Hook that applies CSS animations directly to SVG DOM elements on web.
 * Returns a unique ID to use as nativeID on the container View.
 *
 * On native (iOS/Android), this is a no-op — returns an empty string.
 * Native animations are handled by Reanimated hooks.
 */
export function useWebSvgAnim(targets: WebAnimTarget[], animated: boolean): string {
  const [id] = useState(() => isWeb ? `tender-anim-${_svgAnimCounter++}` : '');

  useEffect(() => {
    if (!isWeb || !animated || typeof document === 'undefined' || !id) return;

    // Use rAF to wait for SVG elements to render in the DOM
    const raf = requestAnimationFrame(() => {
      const container = document.getElementById(id);
      if (!container) return;

      for (const target of targets) {
        const applyAnim = (matched: Element) => {
          const el = (target.parent ? matched.parentElement : matched) as HTMLElement | null;
          if (!el) return;
          el.style.animation = target.animation;
          if (target.origin) el.style.transformOrigin = target.origin;
        };

        if (target.all) {
          container.querySelectorAll(target.selector).forEach(applyAnim);
        } else {
          const matched = container.querySelector(target.selector);
          if (matched) applyAnim(matched);
        }
      }
    });

    return () => cancelAnimationFrame(raf);
  }, [animated, id]);

  return id;
}

// ══════════════════════════════════════════════════════════════
// DEPRECATED: cssAnim — does NOT work on web because
// react-native-svg strips CSS animation properties from style.
// Kept for backward compat; use useWebSvgAnim instead.
// ══════════════════════════════════════════════════════════════
/** @deprecated Use useWebSvgAnim() instead */
export function cssAnim(
  name: string,
  durationMs: number,
  delayMs = 0,
  origin?: string,
): any {
  if (!isWeb) return {};
  const s = durationMs / 1000;
  const d = delayMs ? `${-delayMs / 1000}s` : '0s';
  return {
    animation: `tender-${name} ${s}s ease-in-out infinite`,
    animationDelay: d,
    transformOrigin: origin || 'center center',
  };
}

// ══════════════════════════════════════════════════════════════
// REANIMATED HOOKS (for native iOS/Android)
// On web, these return no-op styles — CSS handles animations.
// ══════════════════════════════════════════════════════════════

// ── BREATHE ──────────────────────────────────────────────────
export function useBreathe(duration = 5000, delay = 0) {
  const scale = useSharedValue(1);
  useEffect(() => {
    if (isWeb) return;
    scale.value = withDelay(delay,
      withRepeat(
        withSequence(
          withTiming(1.04, { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
          withTiming(1.0,  { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
        ),
        -1, false
      )
    );
  }, []);
  return useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
}

// ── FLOAT / RISE ─────────────────────────────────────────────
export function useFloat(duration = 3500, distance = 4, delay = 0) {
  const translateY = useSharedValue(0);
  useEffect(() => {
    if (isWeb) return;
    translateY.value = withDelay(delay,
      withRepeat(
        withSequence(
          withTiming(-distance, { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
          withTiming(0,         { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
        ),
        -1, false
      )
    );
  }, []);
  return useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }] }));
}

// ── PULSE ────────────────────────────────────────────────────
export function usePulse(min = 0.35, max = 0.95, duration = 2500, delay = 0) {
  const opacity = useSharedValue(min);
  useEffect(() => {
    if (isWeb) return;
    opacity.value = withDelay(delay,
      withRepeat(
        withSequence(
          withTiming(max, { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
          withTiming(min, { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
        ),
        -1, false
      )
    );
  }, []);
  return useAnimatedStyle(() => ({ opacity: opacity.value }));
}

export function usePulseProps(min = 0.35, max = 0.95, duration = 2500, delay = 0) {
  const opacity = useSharedValue(min);
  useEffect(() => {
    if (isWeb) return;
    opacity.value = withDelay(delay,
      withRepeat(
        withSequence(
          withTiming(max, { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
          withTiming(min, { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
        ),
        -1, false
      )
    );
  }, []);
  return useAnimatedProps(() => ({ opacity: opacity.value }));
}

// ── FLICKER ──────────────────────────────────────────────────
export function useFlicker() {
  const opacity = useSharedValue(0.65);
  useEffect(() => {
    if (isWeb) return;
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.75, { duration: 300, easing: Easing.out(Easing.ease) }),
        withTiming(1.0,  { duration: 400, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.8,  { duration: 350, easing: Easing.in(Easing.ease) }),
        withTiming(0.65, { duration: 750, easing: Easing.inOut(Easing.ease) }),
      ),
      -1, false
    );
  }, []);
  return useAnimatedStyle(() => ({ opacity: opacity.value }));
}

export function useFlickerProps() {
  const opacity = useSharedValue(0.65);
  useEffect(() => {
    if (isWeb) return;
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.75, { duration: 300, easing: Easing.out(Easing.ease) }),
        withTiming(1.0,  { duration: 400, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.8,  { duration: 350, easing: Easing.in(Easing.ease) }),
        withTiming(0.65, { duration: 750, easing: Easing.inOut(Easing.ease) }),
      ),
      -1, false
    );
  }, []);
  return useAnimatedProps(() => ({ opacity: opacity.value }));
}

// ── EXPAND ───────────────────────────────────────────────────
export function useExpandProps(min = 0.1, max = 0.35, duration = 5500, delay = 0) {
  const opacity = useSharedValue(min);
  useEffect(() => {
    if (isWeb) return;
    opacity.value = withDelay(delay,
      withRepeat(
        withSequence(
          withTiming(max, { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
          withTiming(min, { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
        ),
        -1, false
      )
    );
  }, []);
  return useAnimatedProps(() => ({ opacity: opacity.value }));
}

// ── SWAY ─────────────────────────────────────────────────────
export function useSway(degrees = 4, duration = 4000, delay = 0) {
  const rotate = useSharedValue(0);
  useEffect(() => {
    if (isWeb) return;
    rotate.value = withDelay(delay,
      withRepeat(
        withSequence(
          withTiming(degrees,  { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
          withTiming(0,         { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
        ),
        -1, false
      )
    );
  }, []);
  return useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }],
  }));
}

// ── UNFURL ───────────────────────────────────────────────────
export function useUnfurl(totalLength: number, duration = 3000, delay = 0) {
  const dashOffset = useSharedValue(totalLength);
  useEffect(() => {
    if (isWeb) return;
    dashOffset.value = withDelay(delay,
      withTiming(0, { duration, easing: Easing.out(Easing.cubic) })
    );
  }, []);
  return useAnimatedProps(() => ({
    strokeDashoffset: dashOffset.value,
    strokeDasharray: [totalLength, totalLength],
  }));
}

// ── GLOW ─────────────────────────────────────────────────────
export function useGlow(min = 0.07, max = 0.22, duration = 4000, delay = 0) {
  const opacity = useSharedValue(min);
  useEffect(() => {
    if (isWeb) return;
    opacity.value = withDelay(delay,
      withRepeat(
        withSequence(
          withTiming(max, { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
          withTiming(min, { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
        ),
        -1, false
      )
    );
  }, []);
  return useAnimatedProps(() => ({ opacity: opacity.value }));
}

// ── DRIFT ────────────────────────────────────────────────────
export function useDrift(x = 2, y = 2, duration = 4000, delay = 0) {
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  useEffect(() => {
    if (isWeb) return;
    tx.value = withDelay(delay, withRepeat(withSequence(
      withTiming(x,  { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
      withTiming(0,  { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
    ), -1, false));
    ty.value = withDelay(delay, withRepeat(withSequence(
      withTiming(-y, { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
      withTiming(0,  { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
    ), -1, false));
  }, []);
  return useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }, { translateY: ty.value }],
  }));
}

// ── BREATH SYNC ──────────────────────────────────────────────
export function useBreathSync(phaseDuration: number) {
  const amplitude = useSharedValue(1);
  useEffect(() => {
    amplitude.value = withRepeat(
      withSequence(
        withTiming(1.4, { duration: phaseDuration, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.7, { duration: phaseDuration, easing: Easing.inOut(Easing.ease) }),
      ),
      -1, false
    );
  }, [phaseDuration]);
  return useAnimatedStyle(() => ({ transform: [{ scaleY: amplitude.value }] }));
}
