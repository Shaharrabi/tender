/*
 * ═══════════════════════════════════════════════════════════════
 * TENDER ILLUSTRATION
 * ───────────────────────────────────────────────────────────────
 * ID:          hero-portal
 * Component:   IllustrationPortalHero
 * Screen:      app/(app)/couple-portal.tsx
 * Description: Couple portal header — twin orbs, vesica, vine between two bodies
 *
 * ANIMATIONS:
 *   WEB:    Per-element CSS via useWebSvgAnim + #id selectors
 *   NATIVE: Per-element opacity via AnimatedG + useAnimatedProps
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
import { useWebSvgAnim, usePulseProps } from '../hooks/useIllustrationAnimation';

const AnimatedG = ReAnimated.createAnimatedComponent(G);

interface Props {
  width?: number;
  height?: number;
  animated?: boolean;
  style?: ViewStyle;
}

function useBreatheOpacity(base = 0.88, range = 0.12, duration = 5000, delay = 0) {
  const opacity = useSharedValue(base);
  useEffect(() => {
    if (Platform.OS === 'web') return;
    opacity.value = withDelay(delay,
      withRepeat(
        withSequence(
          withTiming(base - range, { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
          withTiming(base, { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
        ),
        -1, false
      )
    );
  }, []);
  return useAnimatedProps(() => ({ opacity: opacity.value }));
}

export function IllustrationPortalHero({ width = 520, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (380 / 520));

  const isNative = Platform.OS !== 'web';
  const shouldAnimate = animated && isNative;

  // Native: per-element opacity animations
  const leftOrbsProps = useBreatheOpacity(0.25, 0.10, 5000, 0);
  const rightOrbsProps = useBreatheOpacity(0.25, 0.10, 5000, 2500);
  const vesicaFillProps = usePulseProps(0.06, 0.18, 4000, 0);
  const vesicaStrokeProps = usePulseProps(0.30, 0.60, 3000, 0);
  const bodyLeftProps = useBreatheOpacity(0.88, 0.12, 5000, 0);
  const bodyRightProps = useBreatheOpacity(0.88, 0.12, 5000, 2500);
  const vineProps = usePulseProps(0.35, 0.70, 4000, 0);

  // Web: apply CSS animations directly to SVG DOM elements via #id selectors
  const containerId = useWebSvgAnim([
    { selector: '#portal-left-orbs',   animation: 'tender-breathe 5s ease-in-out infinite',       origin: '186px 160px' },
    { selector: '#portal-right-orbs',  animation: 'tender-breathe 5s ease-in-out infinite -2.5s', origin: '334px 160px' },
    { selector: '#portal-vesica-fill', animation: 'tender-glow 4s ease-in-out infinite' },
    { selector: '#portal-vesica-stroke', animation: 'tender-pulse 3s ease-in-out infinite' },
    { selector: '#portal-body-left',   animation: 'tender-breathe 5s ease-in-out infinite',       origin: '116px 260px' },
    { selector: '#portal-body-right',  animation: 'tender-breathe 5s ease-in-out infinite -2.5s', origin: '402px 260px' },
    { selector: '#portal-vine',        animation: 'tender-float 4s ease-in-out infinite',         origin: '260px 140px' },
  ], animated);

  const AG = shouldAnimate ? AnimatedG : G;

  return (
    <View nativeID={containerId}>
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
        {/* Left orbs */}
        <AG id="portal-left-orbs" {...(shouldAnimate ? { animatedProps: leftOrbsProps } : {})}>
          <Circle cx="186" cy="160" r="68" fill="none" stroke="#B5593A" strokeWidth="0.6" opacity={0.25}/>
          <Circle cx="186" cy="160" r="52" fill="none" stroke="#B5593A" strokeWidth="0.5" opacity={0.18}/>
          <Circle cx="186" cy="160" r="36" fill="#B5593A" opacity={0.12}/>
        </AG>
        {/* Right orbs */}
        <AG id="portal-right-orbs" {...(shouldAnimate ? { animatedProps: rightOrbsProps } : {})}>
          <Circle cx="334" cy="160" r="68" fill="none" stroke="#1E3A52" strokeWidth="0.6" opacity={0.25}/>
          <Circle cx="334" cy="160" r="52" fill="none" stroke="#1E3A52" strokeWidth="0.5" opacity={0.18}/>
          <Circle cx="334" cy="160" r="36" fill="#1E3A52" opacity={0.1}/>
        </AG>
        {/* Vesica fill */}
        <AG id="portal-vesica-fill" {...(shouldAnimate ? { animatedProps: vesicaFillProps } : {})}>
          <Path d="M260 100 Q290 130 290 160 Q290 190 260 220 Q230 190 230 160 Q230 130 260 100Z"
          fill="#C8923A" opacity={0.1}/>
        </AG>
        {/* Vesica stroke */}
        <AG id="portal-vesica-stroke" {...(shouldAnimate ? { animatedProps: vesicaStrokeProps } : {})}>
          <Path d="M260 100 Q290 130 290 160 Q290 190 260 220 Q230 190 230 160 Q230 130 260 100Z"
          fill="none" stroke="#C8923A" strokeWidth="0.8" opacity={0.5}/>
        </AG>
        {/* Center vine */}
        <AG id="portal-vine" {...(shouldAnimate ? { animatedProps: vineProps } : {})}>
          <Line x1="260" y1="180" x2="260" y2="132" stroke="#2C2C2A" strokeWidth="1" opacity={0.5}/>
          <Path d="M260 132 Q263 122 266 132 Q263 142 260 132Z" fill="#1E3A52" opacity={0.75}/>
          <Path d="M260 132 Q257 124 254 132 Q257 140 260 132Z" fill="#1E3A52" opacity={0.5}/>
        </AG>
        {/* LEFT BODY — terracotta */}
        <AG id="portal-body-left" {...(shouldAnimate ? { animatedProps: bodyLeftProps } : {})}>
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
        </AG>
        {/* RIGHT BODY — navy */}
        <AG id="portal-body-right" {...(shouldAnimate ? { animatedProps: bodyRightProps } : {})}>
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
        </AG>
        {/* Report score zones */}
        <G opacity={0.55}>
        <SvgText x="350" y="296" fontSize="18" fill="#8B7355" opacity={0.85} fontFamily="Georgia,serif" letterSpacing="1">BOND</SvgText>
        <Rect x="350" y="302" width="80" height="5" rx="2" fill="#D6CEBF"/>
        <Rect x="350" y="302" width="64" height="5" rx="2" fill="#B5593A" opacity={0.7}/>
        <SvgText x="350" y="320" fontSize="18" fill="#8B7355" opacity={0.85} fontFamily="Georgia,serif" letterSpacing="1">SAFETY</SvgText>
        <Rect x="350" y="326" width="80" height="5" rx="2" fill="#D6CEBF"/>
        <Rect x="350" y="326" width="50" height="5" rx="2" fill="#1E3A52" opacity={0.7}/>
        <SvgText x="350" y="344" fontSize="18" fill="#8B7355" opacity={0.85} fontFamily="Georgia,serif" letterSpacing="1">REPAIR</SvgText>
        <Rect x="350" y="350" width="80" height="5" rx="2" fill="#D6CEBF"/>
        <Rect x="350" y="350" width="68" height="5" rx="2" fill="#7A9E8E" opacity={0.7}/>
        </G>
        <SvgText x="260" y="374" textAnchor="middle" fontFamily="Georgia,serif" fontSize="20" letterSpacing="4" fill="#2C2C2A" opacity={0.6}>{"PORTAL \u00B7 THE FIELD BETWEEN"}</SvgText>
      </Svg>
    </View>
  );
}
