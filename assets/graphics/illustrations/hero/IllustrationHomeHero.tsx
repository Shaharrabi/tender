/*
 * ═══════════════════════════════════════════════════════════════
 * TENDER ILLUSTRATION
 * ───────────────────────────────────────────────────────────────
 * ID:          hero-home
 * Component:   IllustrationHomeHero
 * Screen:      app/(app)/home.tsx
 * Description: Home screen header — two abstract bodies, vine, field
 * ViewBox:     0 0 520 380
 *
 * ANIMATIONS (per-element, matching original HTML):
 *   - Left body (terracotta): breathe 5s
 *   - Right body (navy): breathe 5s, delay -2.5s
 *   - Leaf group: float 4s
 *   - Breath threads: pulse 3s
 *
 * WEB: CSS animations applied via useWebSvgAnim + #id selectors
 * NATIVE: Reanimated AnimatedG per-element
 *
 * DO NOT add arm or hand paths.
 * DO NOT show official assessment names (ECR-R, DUTCH, etc.)
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

export function IllustrationHomeHero({ width = 400, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (290 / 440));

  // Native: per-element Reanimated animations
  const leftBodyProps = useNativeBreathe(5000);
  const rightBodyProps = useNativeBreathe(5000, 2500);
  const leafFloatProps = useNativeFloat(4000, 5);
  const threadPulseProps = useNativePulse(0.2, 0.55, 3000);

  // Web: apply CSS animations directly to SVG DOM elements via #id selectors
  // (react-native-svg on web renders attributes as inline styles, so
  //  attribute selectors like path[fill="..."] don't work — use ids instead)
  const containerId = useWebSvgAnim([
    { selector: '#home-left-body',   animation: 'tender-breathe 5s ease-in-out infinite',       origin: '110px 255px' },
    { selector: '#home-right-body',  animation: 'tender-breathe 5s ease-in-out infinite -2.5s', origin: '418px 252px' },
    { selector: '#home-leaf-group',  animation: 'tender-float 4s ease-in-out infinite',         origin: '260px 82px' },
    { selector: '#home-thread-left', animation: 'tender-pulse 3s ease-in-out infinite' },
    { selector: '#home-thread-right',animation: 'tender-pulse 3s ease-in-out infinite -1.5s' },
  ], animated);

  // Shared content pieces for animated/static rendering
  const leftBodyContent = (
    <>
      <Path d="M82 340 Q55 310 52 275 Q50 240 62 208 Q74 176 96 162 Q118 148 138 158 Q158 168 162 196 Q166 224 154 260 Q142 296 128 324 Q114 352 98 350 Z" fill="#B5593A" opacity={0.88}/>
      <G opacity={0.18} stroke="#F2EDE4" strokeWidth="2.5" strokeLinecap="round">
        <Path d="M68 220 Q100 212 148 218"/>
        <Path d="M64 242 Q98 234 152 240"/>
        <Path d="M62 262 Q96 255 152 260"/>
        <Path d="M64 282 Q98 276 150 280"/>
      </G>
      <Ellipse cx="118" cy="138" rx="28" ry="34" fill="none" stroke="#2C2C2A" strokeWidth="1.2" rotation={8} origin="118, 138"/>
      <Path d="M95 118 Q105 104 120 100 Q134 96 144 108" fill="none" stroke="#2C2C2A" strokeWidth="1.1" strokeLinecap="round" opacity={0.7}/>
      <Path d="M97 124 Q90 114 93 106" fill="none" stroke="#2C2C2A" strokeWidth="0.9" strokeLinecap="round" opacity={0.5}/>
      <Circle cx="128" cy="140" r="2" fill="#2C2C2A" opacity={0.4}/>
    </>
  );

  const rightBodyContent = (
    <>
      <Path d="M390 338 Q368 308 365 272 Q362 236 374 202 Q386 168 408 155 Q430 142 450 152 Q470 162 472 192 Q474 222 460 258 Q446 294 430 322 Q414 350 400 348 Z" fill="#1E3A52" opacity={0.88}/>
      <G opacity={0.22} stroke="#F2EDE4" strokeWidth="2" strokeLinecap="round">
        <Path d="M370 196 Q400 188 468 194"/>
        <Path d="M368 214 Q398 207 470 212"/>
        <Path d="M366 232 Q396 225 470 230"/>
        <Path d="M366 250 Q396 244 470 248"/>
        <Path d="M367 268 Q396 262 468 266"/>
        <Path d="M369 286 Q398 280 464 284"/>
      </G>
      <Ellipse cx="432" cy="132" rx="28" ry="34" fill="none" stroke="#2C2C2A" strokeWidth="1.2" rotation={-8} origin="432, 132"/>
      <Path d="M415 112 Q422 100 434 96 Q446 93 454 104" fill="none" stroke="#2C2C2A" strokeWidth="1.1" strokeLinecap="round" opacity={0.7}/>
      <Path d="M414 116 Q408 108 412 100" fill="none" stroke="#2C2C2A" strokeWidth="0.9" strokeLinecap="round" opacity={0.5}/>
      <Circle cx="422" cy="134" r="2" fill="#2C2C2A" opacity={0.4}/>
    </>
  );

  const leafContent = (
    <>
      <Path d="M260 110 Q264 92 268 82 Q270 96 266 110 Z" fill="#1E3A52" opacity={0.82}/>
      <Path d="M260 110 Q256 94 252 84 Q254 98 258 110 Z" fill="#1E3A52" opacity={0.58}/>
      <Line x1="260" y1="82" x2="260" y2="110" stroke="#2C2C2A" strokeWidth="0.9" opacity={0.5}/>
      <Path d="M258 94 Q250 90 248 96 Q254 98 258 94Z" fill="#1E3A52" opacity={0.4}/>
      <Path d="M263 90 Q270 86 272 92 Q267 93 263 90Z" fill="#1E3A52" opacity={0.35}/>
    </>
  );

  const isNativeAnimated = animated && Platform.OS !== 'web';

  const svgContent = (
    <Svg viewBox="40 70 440 290" width={width} height={resolvedHeight} style={style}>
      {/* Background texture lines */}
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
      {/* Water ripple lines */}
      <G opacity={0.28}>
      <Path d="M60 268 Q120 248 190 258 Q260 268 330 252 Q390 238 450 244 Q490 248 520 242" fill="none" stroke="#7CA4B8" strokeWidth="2" strokeLinecap="round"/>
      <Path d="M40 286 Q105 268 178 276 Q252 284 322 268 Q388 254 448 260 Q490 264 520 258" fill="none" stroke="#7CA4B8" strokeWidth="1.5" strokeLinecap="round" opacity={0.75}/>
      <Path d="M50 302 Q115 286 186 292 Q258 298 328 284 Q392 270 450 275 Q490 278 520 273" fill="none" stroke="#7CA4B8" strokeWidth="1.1" strokeLinecap="round" opacity={0.55}/>
      <Path d="M55 316 Q120 302 190 307 Q262 312 332 300 Q395 288 452 292 Q490 295 520 290" fill="none" stroke="#7CA4B8" strokeWidth="0.7" strokeLinecap="round" opacity={0.35}/>
      </G>
      {/* LEFT BODY — terracotta (breathe individually, origin at body center) */}
      {isNativeAnimated ? (
        <AnimatedG animatedProps={leftBodyProps} origin="110, 255">
          {leftBodyContent}
        </AnimatedG>
      ) : (
        <G id="home-left-body">{leftBodyContent}</G>
      )}
      {/* RIGHT BODY — navy (breathe with delay, origin at body center) */}
      {isNativeAnimated ? (
        <AnimatedG animatedProps={rightBodyProps} origin="418, 252">
          {rightBodyContent}
        </AnimatedG>
      ) : (
        <G id="home-right-body">{rightBodyContent}</G>
      )}
      {/* VINE between them */}
      <Path d="M148 170 Q200 128 260 112 Q316 96 374 126 Q400 140 412 162"
      fill="none" stroke="#2C2C2A" strokeWidth="1.5" strokeLinecap="round"
      strokeDasharray="400" opacity={0.68}/>
      {/* LEAF at crown of vine (float on native) */}
      {isNativeAnimated ? (
        <AnimatedG animatedProps={leafFloatProps}>
          {leafContent}
        </AnimatedG>
      ) : (
        <G id="home-leaf-group">{leafContent}</G>
      )}
      {/* BREATH THREADS (pulse on native, each gets its own id for individual delay) */}
      {isNativeAnimated ? (
        <AnimatedG animatedProps={threadPulseProps}>
          <Line x1="144" y1="148" x2="200" y2="122" stroke="#2C2C2A" strokeWidth="0.8" strokeDasharray="4 5" opacity={0.38}/>
          <Line x1="408" y1="144" x2="352" y2="120" stroke="#2C2C2A" strokeWidth="0.8" strokeDasharray="4 5" opacity={0.38}/>
        </AnimatedG>
      ) : (
        <>
          <Line id="home-thread-left" x1="144" y1="148" x2="200" y2="122" stroke="#2C2C2A" strokeWidth="0.8" strokeDasharray="4 5" opacity={0.38}/>
          <Line id="home-thread-right" x1="408" y1="144" x2="352" y2="120" stroke="#2C2C2A" strokeWidth="0.8" strokeDasharray="4 5" opacity={0.38}/>
        </>
      )}
      <SvgText x="260" y="360" textAnchor="middle" fontFamily="Georgia,serif" fontSize="11" letterSpacing="5" fill="#2C2C2A" opacity={0.55}>{"HOME \u00B7 TOGETHER"}</SvgText>
    </Svg>
  );

  return (
    <View nativeID={containerId}>
      {svgContent}
    </View>
  );
}
