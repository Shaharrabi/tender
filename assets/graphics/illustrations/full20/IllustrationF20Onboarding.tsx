/*
 * ═══════════════════════════════════════════════════════════════
 * TENDER ILLUSTRATION
 * ───────────────────────────────────────────────────────────────
 * ID:          f20-onboarding
 * Component:   IllustrationF20Onboarding
 * Screen:      app/(onboarding)/welcome.tsx  AND  home page hero rotation
 * Description: Onboarding — figure at base of 12-step spiral, step 12 glowing at crown
 * ViewBox:     0 0 480 340
 *
 * ANIMATIONS (per-element, matching original HTML):
 *   - Body (terracotta): breathe 5s
 *   - Foot step: float 3s
 *   - Golden end-goal ring: pulse 2s
 *
 * DO NOT add arm or hand paths.
 * ═══════════════════════════════════════════════════════════════
 */

import React from 'react';
import { View, ViewStyle } from 'react-native';
import Svg, {
  Path, Ellipse, Circle, Rect, Line, Polygon, G, Text as SvgText
} from 'react-native-svg';
import ReAnimated from 'react-native-reanimated';
import { useBreathe, useWebSvgAnim } from '../hooks/useIllustrationAnimation';

interface Props {
  width?: number;
  height?: number;
  animated?: boolean;
  style?: ViewStyle;
}

export function IllustrationF20Onboarding({ width = 480, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (340 / 480));
  const animStyle = useBreathe(5000);

  // Web: apply CSS animations directly to SVG DOM elements
  const containerId = useWebSvgAnim([
    { selector: 'path[fill="#B5593A"]', animation: 'tender-breathe 5s ease-in-out infinite', origin: '212px 268px' },
    { selector: 'path[stroke="#B5593A"]', animation: 'tender-float 3s ease-in-out infinite' },
    { selector: 'circle[r="8"]', animation: 'tender-pulse 2s ease-in-out infinite', origin: '184px 278px', parent: true },
  ], animated);

  const svgContent = (
    <Svg viewBox="0 0 480 340" width={width} height={resolvedHeight} style={style}>
      {/* Spiral path */}
      <Path d="M240 290 Q320 280 350 240 Q380 200 350 160 Q320 120 270 110 Q220 100 180 120 Q140 140 130 180 Q120 220 150 260 Q180 300 240 310" fill="none" stroke="#D6CEBF" strokeWidth="1.2" strokeDasharray="5 4" opacity={0.6}/>
      {/* 12 step dots */}
      <G opacity={0.7}>
      <Circle cx="240" cy="290" r="4" fill="#B5593A"/><Circle cx="308" cy="274" r="3.5" fill="#C8923A"/><Circle cx="352" cy="240" r="3.5" fill="#7A9E8E"/>
      <Circle cx="354" cy="196" r="3.5" fill="#7CA4B8"/><Circle cx="330" cy="152" r="3.5" fill="#1E3A52"/><Circle cx="284" cy="118" r="3.5" fill="#6E4E6E"/>
      <Circle cx="232" cy="106" r="3.5" fill="#D4909A"/><Circle cx="180" cy="114" r="3.5" fill="#C8923A"/><Circle cx="142" cy="148" r="3.5" fill="#B5593A"/>
      <Circle cx="128" cy="190" r="3.5" fill="#7A9E8E"/><Circle cx="142" cy="240" r="3.5" fill="#7CA4B8"/><Circle cx="184" cy="278" r="4.5" fill="#C8923A"/>
      </G>
      {/* Figure at base of spiral */}
      <Path d="M200 316 Q184 292 186 266 Q188 240 200 224 Q212 208 224 212 Q236 216 238 238 Q240 260 230 288 Q220 314 210 320Z" fill="#B5593A" opacity={0.85}/>
      <G opacity={0.2} stroke="#F2EDE4" strokeWidth="2" strokeLinecap="round">
      <Path d="M188 240 Q210 234 236 239"/><Path d="M187 254 Q210 248 237 253"/><Path d="M188 268 Q210 262 236 267"/>
      </G>
      <Ellipse cx="212" cy="208" rx="22" ry="27" fill="none" stroke="#2C2C2A" strokeWidth="1.1" rotation={-4} origin="212, 208"/>
      <Path d="M196 192 Q206 180 214 177 Q222 174 228 183" fill="none" stroke="#2C2C2A" strokeWidth="1" strokeLinecap="round" opacity={0.6}/>
      {/* Foot step */}
      <Path d="M224 314 Q230 310 236 314" fill="none" stroke="#B5593A" strokeWidth="4" strokeLinecap="round"/>
      {/* Golden end-goal ring */}
      <G>
      <Circle cx="184" cy="278" r="8" fill="none" stroke="#C8923A" strokeWidth="1" opacity={0.5}/>
      <Circle cx="184" cy="278" r="4" fill="#C8923A" opacity={0.7}/>
      </G>
      <SvgText x="240" y="326" textAnchor="middle" fontFamily="Georgia,serif" fontSize="10" letterSpacing="4" fill="#2C2C2A" opacity={0.45}>ONBOARDING</SvgText>
    </Svg>
  );

  return (
    <View nativeID={containerId}>
      {animated ? (
        <ReAnimated.View style={animStyle}>
          {svgContent}
        </ReAnimated.View>
      ) : svgContent}
    </View>
  );
}
