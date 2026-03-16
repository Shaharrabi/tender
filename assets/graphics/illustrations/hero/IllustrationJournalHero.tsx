/*
 * ═══════════════════════════════════════════════════════════════
 * TENDER ILLUSTRATION
 * ───────────────────────────────────────────────────────────────
 * ID:          hero-journal
 * Component:   IllustrationJournalHero
 * Screen:      app/(app)/journal.tsx
 * Description: Journal header — bowed body, inner rings, day arc, floating symbols
 *
 * ANIMATIONS (per-element, matching original HTML):
 *   - Body (terracotta): breathe 5.5s
 *   - Inner rings (gold ellipses): pulse 2.5s staggered
 *   - SELF dot (gold circle): pulse 2s
 *   - Sun dot: drift 6s
 *   - Leaf: float 4s
 *   - Flame: sway 3s
 *   - Heart: float 3.5s
 *
 * DO NOT add arm or hand paths.
 * ═══════════════════════════════════════════════════════════════
 */

import React from 'react';
import { View, ViewStyle, Platform } from 'react-native';
import Svg, {
  Path, Ellipse, Circle, Rect, Line, Polygon, G, Text as SvgText
} from 'react-native-svg';
import ReAnimated, { useSharedValue, useAnimatedProps, withRepeat, withSequence, withTiming, withDelay, Easing } from 'react-native-reanimated';
import { useWebSvgAnim } from '../hooks/useIllustrationAnimation';
import { useEffect } from 'react';

const AnimatedG = ReAnimated.createAnimatedComponent(G);

interface Props {
  width?: number;
  height?: number;
  animated?: boolean;
  style?: ViewStyle;
}

// Per-element native animation hooks (only run on native, CSS handles web)
function useNativeBreathe(duration = 5000, delay = 0) {
  const scale = useSharedValue(1);
  useEffect(() => {
    if (Platform.OS === 'web') return;
    scale.value = withDelay(delay,
      withRepeat(withSequence(
        withTiming(1.04, { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
        withTiming(1.0,  { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
      ), -1, false)
    );
  }, []);
  return useAnimatedProps(() => ({ scale: scale.value }));
}

function useNativeFloat(duration = 4000, distance = 5, delay = 0) {
  const ty = useSharedValue(0);
  useEffect(() => {
    if (Platform.OS === 'web') return;
    ty.value = withDelay(delay,
      withRepeat(withSequence(
        withTiming(-distance, { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
        withTiming(0,         { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
      ), -1, false)
    );
  }, []);
  return useAnimatedProps(() => ({ translateY: ty.value }));
}

function useNativePulse(min = 0.2, max = 0.6, duration = 3000, delay = 0) {
  const op = useSharedValue(min);
  useEffect(() => {
    if (Platform.OS === 'web') return;
    op.value = withDelay(delay,
      withRepeat(withSequence(
        withTiming(max, { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
        withTiming(min, { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
      ), -1, false)
    );
  }, []);
  return useAnimatedProps(() => ({ opacity: op.value }));
}

function useNativeDrift(duration = 6000, distance = 4, delay = 0) {
  const tx = useSharedValue(0);
  useEffect(() => {
    if (Platform.OS === 'web') return;
    tx.value = withDelay(delay,
      withRepeat(withSequence(
        withTiming(distance, { duration: duration / 4, easing: Easing.inOut(Easing.ease) }),
        withTiming(-distance, { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: duration / 4, easing: Easing.inOut(Easing.ease) }),
      ), -1, false)
    );
  }, []);
  return useAnimatedProps(() => ({ translateX: tx.value }));
}

function useNativeSway(duration = 3000, angle = 5, delay = 0) {
  const rot = useSharedValue(0);
  useEffect(() => {
    if (Platform.OS === 'web') return;
    rot.value = withDelay(delay,
      withRepeat(withSequence(
        withTiming(angle, { duration: duration / 4, easing: Easing.inOut(Easing.ease) }),
        withTiming(-angle, { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: duration / 4, easing: Easing.inOut(Easing.ease) }),
      ), -1, false)
    );
  }, []);
  return useAnimatedProps(() => ({ rotation: rot.value }));
}

export function IllustrationJournalHero({ width = 520, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (380 / 520));

  // Native: per-element Reanimated animations
  const bodyBreatheProps = useNativeBreathe(5500);
  const ringsProps1 = useNativePulse(0.6, 1.0, 2500);
  const ringsProps2 = useNativePulse(0.6, 1.0, 2500, 400);
  const selfDotProps = useNativePulse(0.55, 0.85, 2000);
  const sunDriftProps = useNativeDrift(6000, 4);
  const leafFloatProps = useNativeFloat(4000, 5);
  const flameSwayProps = useNativeSway(3000, 5);
  const heartFloatProps = useNativeFloat(3500, 4, 1500);

  // Web: apply CSS animations directly to SVG DOM elements
  const containerId = useWebSvgAnim([
    { selector: 'path[fill="#B5593A"]', animation: 'tender-breathe 5.5s ease-in-out infinite', origin: '220px 275px' },
    { selector: 'ellipse[stroke="#C8923A"]', animation: 'tender-pulse 2.5s ease-in-out infinite', all: true },
    { selector: 'circle[r="3.5"]', animation: 'tender-pulse 2s ease-in-out infinite' },
    { selector: 'circle[r="5"]', animation: 'tender-drift 6s ease-in-out infinite', origin: '260px 100px', parent: true },
    { selector: 'path[fill="#7A9E8E"]', animation: 'tender-float 4s ease-in-out infinite', origin: '340px 220px', parent: true },
    { selector: 'path[fill="#D4909A"]', animation: 'tender-float 3.5s ease-in-out infinite -1.5s', origin: '345px 175px', parent: true },
  ], animated);

  // Shared content pieces for animated/static rendering
  const bodyContent = (
    <>
      <Path d="M190 350
      Q168 320 165 285
      Q162 252 175 224
      Q188 196 212 186
      Q236 176 254 188
      Q272 200 275 228
      Q278 256 265 286
      Q252 318 234 344
      Q218 366 204 360 Z"
      fill="#B5593A" opacity={0.85}/>
      <G opacity={0.2} stroke="#F2EDE4" strokeWidth="2.5" strokeLinecap="round">
      <Path d="M172 230 Q210 222 268 228"/>
      <Path d="M170 250 Q208 243 270 248"/>
      <Path d="M169 270 Q207 264 270 268"/>
      <Path d="M170 290 Q208 284 268 288"/>
      <Path d="M172 308 Q208 303 264 307"/>
      </G>
      {/* Head */}
      <Ellipse cx="228" cy="165" rx="34" ry="40" fill="none" stroke="#2C2C2A" strokeWidth="1.2" rotation={-5} origin="228, 165"/>
      <Path d="M200 148 Q212 132 230 128 Q248 124 258 138" fill="none" stroke="#2C2C2A" strokeWidth="1.2" strokeLinecap="round" opacity={0.65}/>
      <Path d="M200 152 Q192 140 196 130" fill="none" stroke="#2C2C2A" strokeWidth="1" strokeLinecap="round" opacity={0.45}/>
      <Circle cx="238" cy="168" r="2.5" fill="#2C2C2A" opacity={0.38}/>
      <Path d="M218 192 Q228 196 238 192" fill="none" stroke="#2C2C2A" strokeWidth="0.9" strokeLinecap="round" opacity={0.4}/>
    </>
  );

  const ringsContent = (
    <>
      <Ellipse cx="222" cy="278" rx="12" ry="16" fill="none" stroke="#C8923A" strokeWidth="1"/>
      <Ellipse cx="222" cy="278" rx="24" ry="30" fill="none" stroke="#C8923A" strokeWidth="0.7" opacity={0.6}/>
      <Ellipse cx="222" cy="278" rx="36" ry="44" fill="none" stroke="#8B7355" strokeWidth="0.5" opacity={0.35}/>
      <Ellipse cx="222" cy="278" rx="48" ry="58" fill="none" stroke="#8B7355" strokeWidth="0.4" opacity={0.18}/>
    </>
  );

  const sunDotContent = (
    <>
      <Circle cx="260" cy="100" r="5" fill="#C8923A" opacity={0.6}/>
      <Circle cx="260" cy="100" r="10" fill="none" stroke="#C8923A" strokeWidth="0.5" opacity={0.3}/>
    </>
  );

  const leafContent = (
    <>
      <Path d="M338 220 Q342 210 346 220 Q342 230 338 220Z" fill="#7A9E8E" opacity={0.75}/>
      <Line x1="342" y1="210" x2="342" y2="220" stroke="#2C2C2A" strokeWidth="0.7" opacity={0.4}/>
    </>
  );

  const flameContent = (
    <>
      <Path d="M350 322 Q346 312 350 302 Q354 312 352 322Z" fill="#C8923A" opacity={0.7}/>
      <Path d="M350 322 Q348 315 350 308 Q352 315 350 322Z" fill="#F2EDE4" opacity={0.5}/>
    </>
  );

  const heartContent = (
    <>
      <Path d="M342 175 Q346 169 350 175 Q346 181 342 175Z" fill="#D4909A" opacity={0.7}/>
    </>
  );

  const isNativeAnimated = animated && Platform.OS !== 'web';

  const svgContent = (
    <Svg viewBox="0 0 520 380" width={width} height={resolvedHeight} style={style}>
      <G opacity={0.06} stroke="#8B7355" strokeWidth="0.5">
      <Line x1="0" y1="30" x2="520" y2="30"/><Line x1="0" y1="50" x2="520" y2="50"/>
      <Line x1="0" y1="70" x2="520" y2="70"/><Line x1="0" y1="90" x2="520" y2="90"/>
      <Line x1="0" y1="110" x2="520" y2="110"/><Line x1="0" y1="130" x2="520" y2="130"/>
      <Line x1="0" y1="150" x2="520" y2="150"/><Line x1="0" y1="170" x2="520" y2="170"/>
      <Line x1="0" y1="190" x2="520" y2="190"/><Line x1="0" y1="210" x2="520" y2="210"/>
      <Line x1="0" y1="230" x2="520" y2="230"/><Line x1="0" y1="250" x2="520" y2="250"/>
      <Line x1="0" y1="270" x2="520" y2="270"/><Line x1="0" y1="290" x2="520" y2="290"/>
      <Line x1="0" y1="310" x2="520" y2="310"/><Line x1="0" y1="330" x2="520" y2="330"/>
      <Line x1="0" y1="350" x2="520" y2="350"/>
      </G>
      {/* Arc of a day */}
      <Path d="M60 220 Q260 60 460 220" fill="none" stroke="#C8923A" strokeWidth="1" strokeDasharray="6 5" opacity={0.35}/>
      {/* Sun dot (drift on native) */}
      {isNativeAnimated ? (
        <AnimatedG animatedProps={sunDriftProps}>
          {sunDotContent}
        </AnimatedG>
      ) : (
        <G>{sunDotContent}</G>
      )}
      {/* BODY — terracotta (breathe on native) */}
      {isNativeAnimated ? (
        <AnimatedG animatedProps={bodyBreatheProps} origin="220, 275">
          {bodyContent}
        </AnimatedG>
      ) : (
        <G>{bodyContent}</G>
      )}
      {/* Inner architecture — concentric rings (pulse on native) */}
      {isNativeAnimated ? (
        <AnimatedG animatedProps={ringsProps1} origin="222, 278">
          {ringsContent}
        </AnimatedG>
      ) : (
        <G>{ringsContent}</G>
      )}
      {/* SELF dot — golden center (pulse on native) */}
      {isNativeAnimated ? (
        <AnimatedG animatedProps={selfDotProps}>
          <Circle cx="222" cy="278" r="3.5" fill="#C8923A" opacity={0.85}/>
        </AnimatedG>
      ) : (
        <Circle cx="222" cy="278" r="3.5" fill="#C8923A" opacity={0.85}/>
      )}
      {/* Floating journal symbols */}
      {/* Leaf (float on native) */}
      {isNativeAnimated ? (
        <AnimatedG animatedProps={leafFloatProps}>
          {leafContent}
        </AnimatedG>
      ) : (
        <G>{leafContent}</G>
      )}
      {/* Wave (static) */}
      <G>
      <Path d="M348 265 Q355 260 362 265 Q368 270 375 265" fill="none" stroke="#7CA4B8" strokeWidth="1.2" strokeLinecap="round" opacity={0.65}/>
      </G>
      {/* Flame (sway on native) */}
      {isNativeAnimated ? (
        <AnimatedG animatedProps={flameSwayProps} origin="350, 312">
          {flameContent}
        </AnimatedG>
      ) : (
        <G>{flameContent}</G>
      )}
      {/* Heart (float on native) */}
      {isNativeAnimated ? (
        <AnimatedG animatedProps={heartFloatProps}>
          {heartContent}
        </AnimatedG>
      ) : (
        <G>{heartContent}</G>
      )}
      {/* Timeline */}
      <Line x1="430" y1="50" x2="430" y2="340" stroke="#D6CEBF" strokeWidth="0.8" opacity={0.6}/>
      <G opacity={0.5}>
      <Circle cx="430" cy="90" r="3" fill="#C8923A"/>
      <Circle cx="430" cy="150" r="3" fill="#7CA4B8"/>
      <Circle cx="430" cy="210" r="3" fill="#7A9E8E"/>
      <Circle cx="430" cy="270" r="3" fill="#B5593A"/>
      <Circle cx="430" cy="320" r="2" fill="#D6CEBF"/>
      </G>
      <SvgText x="445" y="93" fontSize="8" fill="#8B7355" opacity={0.55} fontFamily="Georgia,serif">today</SvgText>
      <SvgText x="445" y="153" fontSize="8" fill="#8B7355" opacity={0.4} fontFamily="Georgia,serif">yesterday</SvgText>
      <SvgText x="445" y="213" fontSize="8" fill="#8B7355" opacity={0.3} fontFamily="Georgia,serif">3 days ago</SvgText>
      <SvgText x="260" y="368" textAnchor="middle" fontFamily="Georgia,serif" fontSize="11" letterSpacing="5" fill="#2C2C2A" opacity={0.55}>{"JOURNAL \u00B7 WITHIN"}</SvgText>
    </Svg>
  );

  return (
    <View nativeID={containerId}>
      {svgContent}
    </View>
  );
}
