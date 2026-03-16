/*
 * ═══════════════════════════════════════════════════════════════
 * TENDER ILLUSTRATION
 * ───────────────────────────────────────────────────────────────
 * ID:          hero-portal
 * Component:   IllustrationPortalHero
 * Screen:      app/(app)/couple-portal.tsx
 * Description: Couple portal header — twin orbs, vesica, vine between two bodies
 *
 * ANIMATIONS (per-element, matching original HTML):
 *   - Left orbs (terracotta circles): breathe 5s
 *   - Right orbs (navy circles): breathe 5s, delay -2.5s
 *   - Vesica (gold): glow 4s + pulse 3s
 *   - Center vine group: float 4s
 *   - Left body (terracotta): breathe 5s
 *   - Right body (navy): breathe 5s, delay -2.5s
 *
 * DO NOT add arm or hand paths.
 * ═══════════════════════════════════════════════════════════════
 */

import React, { useEffect } from 'react';
import { View, ViewStyle, Platform } from 'react-native';
import Svg, {
  Path, Ellipse, Circle, Rect, Line, Polygon, G, Text as SvgText
} from 'react-native-svg';
import ReAnimated, { useSharedValue, useAnimatedProps, withRepeat, withSequence, withTiming, withDelay, Easing } from 'react-native-reanimated';
import { useWebSvgAnim } from '../hooks/useIllustrationAnimation';

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

export function IllustrationPortalHero({ width = 520, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (380 / 520));

  // Native: per-element Reanimated animations
  const leftOrbsProps = useNativeBreathe(5000);
  const rightOrbsProps = useNativeBreathe(5000, 2500);
  const vesicaGlowProps = useNativePulse(0.05, 0.15, 4000);
  const vesicaStrokePulseProps = useNativePulse(0.3, 0.7, 3000);
  const leftBodyProps = useNativeBreathe(5000);
  const rightBodyProps = useNativeBreathe(5000, 2500);
  const vineFloatProps = useNativeFloat(4000, 5);

  // Web: apply CSS animations directly to SVG DOM elements
  const containerId = useWebSvgAnim([
    { selector: 'circle[cx="186"]', animation: 'tender-breathe 5s ease-in-out infinite', origin: '186px 160px', all: true },
    { selector: 'circle[cx="334"]', animation: 'tender-breathe 5s ease-in-out infinite -2.5s', origin: '334px 160px', all: true },
    { selector: 'path[fill="#C8923A"][opacity]', animation: 'tender-glow 4s ease-in-out infinite' },
    { selector: 'path[stroke="#C8923A"]', animation: 'tender-pulse 3s ease-in-out infinite' },
    { selector: 'path[fill="#B5593A"]', animation: 'tender-breathe 5s ease-in-out infinite', origin: '116px 260px' },
    { selector: 'path[fill="#1E3A52"]', animation: 'tender-breathe 5s ease-in-out infinite -2.5s', origin: '402px 260px' },
    { selector: 'line[x1="260"]', animation: 'tender-float 4s ease-in-out infinite', origin: '260px 140px', parent: true },
  ], animated);

  const isNativeAnimated = animated && Platform.OS !== 'web';

  // Content groups for per-element animation
  const leftOrbsContent = (
    <>
      <Circle cx="186" cy="160" r="68" fill="none" stroke="#B5593A" strokeWidth="0.6" opacity={0.25}/>
      <Circle cx="186" cy="160" r="52" fill="none" stroke="#B5593A" strokeWidth="0.5" opacity={0.18}/>
      <Circle cx="186" cy="160" r="36" fill="#B5593A" opacity={0.12}/>
    </>
  );

  const rightOrbsContent = (
    <>
      <Circle cx="334" cy="160" r="68" fill="none" stroke="#1E3A52" strokeWidth="0.6" opacity={0.25}/>
      <Circle cx="334" cy="160" r="52" fill="none" stroke="#1E3A52" strokeWidth="0.5" opacity={0.18}/>
      <Circle cx="334" cy="160" r="36" fill="#1E3A52" opacity={0.1}/>
    </>
  );

  const vesicaFillContent = (
    <Path d="M260 100 Q290 130 290 160 Q290 190 260 220 Q230 190 230 160 Q230 130 260 100Z"
    fill="#C8923A" opacity={0.1}/>
  );

  const vesicaStrokeContent = (
    <Path d="M260 100 Q290 130 290 160 Q290 190 260 220 Q230 190 230 160 Q230 130 260 100Z"
    fill="none" stroke="#C8923A" strokeWidth="0.8" opacity={0.5}/>
  );

  const vineContent = (
    <>
      <Line x1="260" y1="180" x2="260" y2="132" stroke="#2C2C2A" strokeWidth="1" opacity={0.5}/>
      <Path d="M260 132 Q263 122 266 132 Q263 142 260 132Z" fill="#1E3A52" opacity={0.75}/>
      <Path d="M260 132 Q257 124 254 132 Q257 140 260 132Z" fill="#1E3A52" opacity={0.5}/>
    </>
  );

  const leftBodyContent = (
    <>
      <Path d="M90 348
      Q66 316 63 278
      Q60 242 74 210
      Q88 178 112 166
      Q136 154 152 166
      Q168 178 170 208
      Q172 238 158 274
      Q144 310 124 338
      Q108 360 96 354 Z"
      fill="#B5593A" opacity={0.88}/>
      <G opacity={0.22} stroke="#F2EDE4" strokeWidth="2.5" strokeLinecap="round">
      <Path d="M68 218 Q98 210 162 216"/>
      <Path d="M66 234 Q96 227 164 232"/>
      <Path d="M64 250 Q95 244 164 248"/>
      <Path d="M64 266 Q95 260 163 264"/>
      <Path d="M65 282 Q95 276 161 280"/>
      <Path d="M67 298 Q96 293 158 296"/>
      <Path d="M70 312 Q97 308 155 311"/>
      </G>
      <Ellipse cx="128" cy="148" rx="30" ry="36" fill="none" stroke="#2C2C2A" strokeWidth="1.2" rotation={6} origin="128, 148"/>
      <Path d="M104 130 Q116 114 130 110 Q144 106 152 120" fill="none" stroke="#2C2C2A" strokeWidth="1.1" strokeLinecap="round" opacity={0.65}/>
      <Path d="M105 136 Q98 124 102 114" fill="none" stroke="#2C2C2A" strokeWidth="0.9" strokeLinecap="round" opacity={0.45}/>
      <Circle cx="136" cy="150" r="2.5" fill="#2C2C2A" opacity={0.38}/>
    </>
  );

  const rightBodyContent = (
    <>
      <Path d="M430 348
      Q452 316 455 278
      Q458 242 444 210
      Q430 178 406 166
      Q382 154 366 166
      Q350 178 348 208
      Q346 238 360 274
      Q374 310 394 338
      Q410 360 424 354 Z"
      fill="#1E3A52" opacity={0.88}/>
      <G opacity={0.22} stroke="#F2EDE4" strokeWidth="2" strokeLinecap="round">
      <Path d="M350 210 Q378 202 454 208"/>
      <Path d="M348 226 Q376 219 456 224"/>
      <Path d="M348 242 Q376 236 456 240"/>
      <Path d="M348 258 Q376 252 455 256"/>
      <Path d="M349 274 Q376 268 453 272"/>
      <Path d="M350 290 Q377 284 450 288"/>
      <Path d="M352 306 Q377 301 447 304"/>
      <Path d="M355 320" strokeDasharray=""/>
      </G>
      <Ellipse cx="392" cy="148" rx="30" ry="36" fill="none" stroke="#2C2C2A" strokeWidth="1.2" rotation={-6} origin="392, 148"/>
      <Path d="M370 128 Q380 114 394 110 Q408 108 416 120" fill="none" stroke="#2C2C2A" strokeWidth="1.1" strokeLinecap="round" opacity={0.65}/>
      <Path d="M368 132 Q362 122 364 112" fill="none" stroke="#2C2C2A" strokeWidth="0.9" strokeLinecap="round" opacity={0.45}/>
      <Circle cx="382" cy="150" r="2.5" fill="#2C2C2A" opacity={0.38}/>
    </>
  );

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
      {/* Left orbs — breathe */}
      {isNativeAnimated ? (
        <AnimatedG animatedProps={leftOrbsProps} origin="186, 160">
          {leftOrbsContent}
        </AnimatedG>
      ) : (
        <G>{leftOrbsContent}</G>
      )}
      {/* Right orbs — breathe with delay */}
      {isNativeAnimated ? (
        <AnimatedG animatedProps={rightOrbsProps} origin="334, 160">
          {rightOrbsContent}
        </AnimatedG>
      ) : (
        <G>{rightOrbsContent}</G>
      )}
      {/* Vesica fill — glow (opacity pulse) */}
      {isNativeAnimated ? (
        <AnimatedG animatedProps={vesicaGlowProps}>
          {vesicaFillContent}
        </AnimatedG>
      ) : (
        <G>{vesicaFillContent}</G>
      )}
      {/* Vesica stroke — pulse (opacity pulse) */}
      {isNativeAnimated ? (
        <AnimatedG animatedProps={vesicaStrokePulseProps}>
          {vesicaStrokeContent}
        </AnimatedG>
      ) : (
        <G>{vesicaStrokeContent}</G>
      )}
      {/* Center vine — float */}
      {isNativeAnimated ? (
        <AnimatedG animatedProps={vineFloatProps}>
          {vineContent}
        </AnimatedG>
      ) : (
        <G>{vineContent}</G>
      )}
      {/* LEFT BODY — terracotta, breathe */}
      {isNativeAnimated ? (
        <AnimatedG animatedProps={leftBodyProps} origin="116, 260">
          {leftBodyContent}
        </AnimatedG>
      ) : (
        <G>{leftBodyContent}</G>
      )}
      {/* RIGHT BODY — navy, breathe with delay */}
      {isNativeAnimated ? (
        <AnimatedG animatedProps={rightBodyProps} origin="402, 260">
          {rightBodyContent}
        </AnimatedG>
      ) : (
        <G>{rightBodyContent}</G>
      )}
      {/* Report score zones */}
      <G opacity={0.55}>
      <SvgText x="350" y="300" fontSize="13" fill="#8B7355" opacity={0.85} fontFamily="Georgia,serif" letterSpacing="1">BOND</SvgText>
      <Rect x="350" y="305" width="60" height="3" rx="1.5" fill="#D6CEBF"/>
      <Rect x="350" y="305" width="48" height="3" rx="1.5" fill="#B5593A" opacity={0.7}/>
      <SvgText x="350" y="320" fontSize="13" fill="#8B7355" opacity={0.85} fontFamily="Georgia,serif" letterSpacing="1">SAFETY</SvgText>
      <Rect x="350" y="323" width="60" height="3" rx="1.5" fill="#D6CEBF"/>
      <Rect x="350" y="323" width="38" height="3" rx="1.5" fill="#1E3A52" opacity={0.7}/>
      <SvgText x="350" y="340" fontSize="13" fill="#8B7355" opacity={0.85} fontFamily="Georgia,serif" letterSpacing="1">REPAIR</SvgText>
      <Rect x="350" y="341" width="60" height="3" rx="1.5" fill="#D6CEBF"/>
      <Rect x="350" y="341" width="52" height="3" rx="1.5" fill="#7A9E8E" opacity={0.7}/>
      </G>
      <SvgText x="260" y="368" textAnchor="middle" fontFamily="Georgia,serif" fontSize="15" letterSpacing="5" fill="#2C2C2A" opacity={0.6}>{"PORTAL \u00B7 THE FIELD BETWEEN"}</SvgText>
    </Svg>
  );

  return (
    <View nativeID={containerId}>
      {svgContent}
    </View>
  );
}
