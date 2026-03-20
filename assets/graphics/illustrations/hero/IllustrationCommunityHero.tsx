/*
 * ═══════════════════════════════════════════════════════════════
 * TENDER ILLUSTRATION
 * ───────────────────────────────────────────────────────────────
 * ID:          hero-community
 * Component:   IllustrationCommunityHero
 * Screen:      app/(app)/community.tsx
 * Description: Community header — 7 bodies, attachment room bubbles, connecting threads
 *
 * ANIMATIONS:
 *   WEB:    Per-element CSS via useWebSvgAnim + #id selectors
 *   NATIVE: Whole-SVG breathing via Animated.View (Reanimated)
 *           (AnimatedG + useAnimatedProps on SVG G is broken on native)
 *
 * DO NOT add arm or hand paths.
 * ═══════════════════════════════════════════════════════════════
 */

import React, { useEffect } from 'react';
import { View, ViewStyle, Platform } from 'react-native';
import Svg, {
  Path, Ellipse, Circle, Rect, Line, Polygon, G, Text as SvgText
} from 'react-native-svg';
import ReAnimated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming, Easing } from 'react-native-reanimated';
import { useWebSvgAnim } from '../hooks/useIllustrationAnimation';

interface Props {
  width?: number;
  height?: number;
  animated?: boolean;
  style?: ViewStyle;
}

/** Gentle breathing scale for the whole SVG on native */
function useNativeBreatheView(duration = 6000) {
  const scale = useSharedValue(1);
  useEffect(() => {
    if (Platform.OS === 'web') return;
    scale.value = withRepeat(
      withSequence(
        withTiming(1.035, { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
        withTiming(1.0,   { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
      ), -1, false
    );
  }, []);
  return useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
}

export function IllustrationCommunityHero({ width = 520, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (380 / 520));

  // Native: whole-SVG breathing via Animated.View
  const breatheStyle = useNativeBreatheView(6000);
  const isNativeAnimated = animated && Platform.OS !== 'web';

  // Web: apply CSS animations directly to SVG DOM elements via #id selectors
  const containerId = useWebSvgAnim([
    { selector: '#community-figure1', animation: 'tender-breathe 5s ease-in-out infinite',       origin: 'center' },
    { selector: '#community-figure2', animation: 'tender-breathe 4.5s ease-in-out infinite -1s', origin: 'center' },
    { selector: '#community-figure3', animation: 'tender-breathe 5.5s ease-in-out infinite -2s', origin: 'center' },
    { selector: '#community-figure4', animation: 'tender-breathe 6s ease-in-out infinite -0.5s', origin: 'center' },
    { selector: '#community-figure5', animation: 'tender-breathe 5s ease-in-out infinite -3s',   origin: 'center' },
    { selector: '#community-figure6', animation: 'tender-breathe 4s ease-in-out infinite -1.5s', origin: 'center' },
    { selector: '#community-figure7', animation: 'tender-breathe 5s ease-in-out infinite',       origin: 'center' },
    { selector: '#community-bubble1', animation: 'tender-float 4s ease-in-out infinite' },
    { selector: '#community-bubble2', animation: 'tender-float 4s ease-in-out infinite -0.5s' },
    { selector: '#community-bubble3', animation: 'tender-float 4s ease-in-out infinite -1s' },
    { selector: '#community-bubble4', animation: 'tender-float 4s ease-in-out infinite -1.5s' },
  ], animated);

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
      {/* Field lines */}
      <G opacity={0.22}>
      <Path d="M0 310 Q80 296 160 306 Q240 316 320 302 Q400 288 480 296 Q504 300 520 298" fill="none" stroke="#7CA4B8" strokeWidth="1.8" strokeLinecap="round"/>
      <Path d="M0 326 Q80 314 162 322 Q244 330 322 318 Q402 306 480 312 Q504 316 520 314" fill="none" stroke="#7CA4B8" strokeWidth="1.2" strokeLinecap="round" opacity={0.7}/>
      <Path d="M0 340 Q80 330 162 336 Q244 342 324 332 Q404 322 480 327 Q504 330 520 328" fill="none" stroke="#7CA4B8" strokeWidth="0.8" strokeLinecap="round" opacity={0.45}/>
      </G>
      {/* Figure 1: terracotta left */}
      <G id="community-figure1">
        <Path d="M52 312 Q44 290 47 264 Q50 240 62 232 Q74 224 80 236 Q86 248 82 274 Q78 300 68 316Z" fill="#B5593A" opacity={0.82}/>
        <Line x1="48" y1="254" x2="82" y2="252" stroke="#F2EDE4" strokeWidth="2" opacity={0.2}/>
        <Ellipse cx="64" cy="222" rx="16" ry="20" fill="none" stroke="#2C2C2A" strokeWidth="0.9"/>
      </G>
      {/* Figure 2: sage */}
      <G id="community-figure2">
        <Path d="M118 318 Q113 300 115 282 Q117 264 127 258 Q137 252 141 264 Q145 276 141 296 Q137 314 128 320Z" fill="#7A9E8E" opacity={0.78}/>
        <Ellipse cx="128" cy="248" rx="13" ry="16" fill="none" stroke="#2C2C2A" strokeWidth="0.9"/>
      </G>
      {/* Figure 3: navy */}
      <G id="community-figure3">
        <Path d="M182 314 Q174 292 177 264 Q180 238 192 230 Q204 222 210 236 Q216 250 210 278 Q204 306 194 318Z" fill="#1E3A52" opacity={0.85}/>
        <Line x1="178" y1="252" x2="210" y2="250" stroke="#F2EDE4" strokeWidth="1.5" opacity={0.2}/>
        <Line x1="177" y1="266" x2="211" y2="264" stroke="#F2EDE4" strokeWidth="1.5" opacity={0.15}/>
        <Ellipse cx="192" cy="220" rx="14" ry="18" fill="none" stroke="#2C2C2A" strokeWidth="0.9"/>
      </G>
      {/* Figure 4: mustard center */}
      <G id="community-figure4">
        <Path d="M256 308 Q246 282 249 252 Q252 224 266 214 Q280 204 286 220 Q292 236 286 266 Q280 296 268 312Z" fill="#C8923A" opacity={0.75}/>
        <Ellipse cx="266" cy="202" rx="18" ry="22" fill="none" stroke="#2C2C2A" strokeWidth="1"/>
        <Path d="M250 190 Q260 176 268 172 Q276 168 284 178" fill="none" stroke="#2C2C2A" strokeWidth="1" strokeLinecap="round" opacity={0.6}/>
      </G>
      {/* Figure 5: blush/pink */}
      <G id="community-figure5">
        <Path d="M330 316 Q322 294 325 268 Q328 244 342 236 Q356 228 360 244 Q364 260 358 286 Q352 312 340 320Z" fill="#D4909A" opacity={0.72}/>
        <Ellipse cx="340" cy="226" rx="16" ry="20" fill="none" stroke="#2C2C2A" strokeWidth="0.9"/>
      </G>
      {/* Figure 6: plum */}
      <G id="community-figure6">
        <Path d="M394 318 Q388 300 390 280 Q392 262 402 256 Q412 250 416 262 Q420 274 416 294 Q412 314 404 320Z" fill="#6E4E6E" opacity={0.7}/>
        <Ellipse cx="402" cy="246" rx="12" ry="16" fill="none" stroke="#2C2C2A" strokeWidth="0.8"/>
      </G>
      {/* Figure 7: terracotta right */}
      <G id="community-figure7">
        <Path d="M452 312 Q444 290 447 262 Q450 236 462 228 Q474 220 480 234 Q486 248 480 276 Q474 304 464 316Z" fill="#B5593A" opacity={0.8}/>
        <Line x1="446" y1="248" x2="480" y2="246" stroke="#F2EDE4" strokeWidth="1.5" opacity={0.2}/>
        <Ellipse cx="462" cy="218" rx="15" ry="18" fill="none" stroke="#2C2C2A" strokeWidth="0.9"/>
      </G>
      {/* Connecting threads */}
      <G opacity={0.35}>
        <Line x1="80" y1="268" x2="118" y2="268" stroke="#C8923A" strokeWidth="0.7" strokeDasharray="3 4"/>
        <Line x1="141" y1="264" x2="178" y2="264" stroke="#C8923A" strokeWidth="0.7" strokeDasharray="3 4"/>
        <Line x1="210" y1="260" x2="252" y2="258" stroke="#C8923A" strokeWidth="0.7" strokeDasharray="3 4"/>
        <Line x1="286" y1="256" x2="328" y2="258" stroke="#C8923A" strokeWidth="0.7" strokeDasharray="3 4"/>
        <Line x1="360" y1="260" x2="392" y2="262" stroke="#C8923A" strokeWidth="0.7" strokeDasharray="3 4"/>
        <Line x1="416" y1="262" x2="450" y2="262" stroke="#C8923A" strokeWidth="0.7" strokeDasharray="3 4"/>
      </G>
      {/* Attachment bubbles */}
      <G id="community-bubble1">
        <Circle cx="130" cy="100" r="28" fill="none" stroke="#B5593A" strokeWidth="0.8" opacity={0.4}/>
        <SvgText x="130" y="104" textAnchor="middle" fontSize="8" fill="#B5593A" opacity={0.6} fontFamily="Georgia,serif">anxious</SvgText>
      </G>
      <G id="community-bubble2">
        <Circle cx="230" cy="80" r="28" fill="none" stroke="#1E3A52" strokeWidth="0.8" opacity={0.4}/>
        <SvgText x="230" y="84" textAnchor="middle" fontSize="8" fill="#1E3A52" opacity={0.6} fontFamily="Georgia,serif">avoidant</SvgText>
      </G>
      <G id="community-bubble3">
        <Circle cx="330" cy="95" r="28" fill="none" stroke="#7A9E8E" strokeWidth="0.8" opacity={0.4}/>
        <SvgText x="330" y="99" textAnchor="middle" fontSize="8" fill="#7A9E8E" opacity={0.6} fontFamily="Georgia,serif">secure</SvgText>
      </G>
      <G id="community-bubble4">
        <Circle cx="430" cy="85" r="28" fill="none" stroke="#C8923A" strokeWidth="0.8" opacity={0.4}/>
        <SvgText x="430" y="89" textAnchor="middle" fontSize="8" fill="#C8923A" opacity={0.6} fontFamily="Georgia,serif">disorganized</SvgText>
      </G>
      <SvgText x="260" y="368" textAnchor="middle" fontFamily="Georgia,serif" fontSize="11" letterSpacing="5" fill="#2C2C2A" opacity={0.55}>{"COMMUNITY \u00B7 TOGETHER"}</SvgText>
    </Svg>
  );

  return (
    <View nativeID={containerId}>
      {isNativeAnimated ? (
        <ReAnimated.View style={breatheStyle}>
          {svgContent}
        </ReAnimated.View>
      ) : (
        svgContent
      )}
    </View>
  );
}
