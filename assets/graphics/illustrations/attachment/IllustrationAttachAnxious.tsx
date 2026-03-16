/*
 * ═══════════════════════════════════════════════════════════════
 * TENDER ILLUSTRATION
 * ───────────────────────────────────────────────────────────────
 * ID:          attach-anxious
 * Component:   IllustrationAttachAnxious
 * Screen:      app/(app)/portrait.tsx  AND  microcourse (anxious style)
 * Description: Anxious-Preoccupied — blush wide body tilted forward, pulse rings beside it
 * ViewBox:     0 0 200 240
 *
 * ANIMATIONS (per-element):
 *   - Body path: CSS breathe 3.8s on web, useBreathe on native
 *   - Pulse rings (3 circles cx=160): CSS pulse 1.8s on web, usePulseProps on native
 *
 * DO NOT add arm or hand paths.
 * DO NOT show official assessment names (ECR-R, DUTCH, etc.)
 * ═══════════════════════════════════════════════════════════════
 */

import React from 'react';
import { View, ViewStyle } from 'react-native';
import Svg, {
  Path, Ellipse, Circle, Rect, Line, Polygon, G, Text as SvgText
} from 'react-native-svg';
import ReAnimated from 'react-native-reanimated';
import { useBreathe, usePulseProps, useWebSvgAnim } from '../hooks/useIllustrationAnimation';

const AnimatedG = ReAnimated.createAnimatedComponent(G);

interface Props {
  width?: number;
  height?: number;
  animated?: boolean;
  style?: ViewStyle;
}

export function IllustrationAttachAnxious({ width = 200, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (240 / 200));
  const breatheStyle = useBreathe(3800);
  const pulseRingsProps = usePulseProps(0.15, 0.6, 1800);

  // Web: apply CSS animations directly to SVG DOM elements
  const containerId = useWebSvgAnim([
    { selector: 'path[fill="#D4909A"]', animation: 'tender-breathe 3.8s ease-in-out infinite', origin: '80px 138px' },
    { selector: 'circle[cx="160"]', animation: 'tender-pulse 1.8s ease-in-out infinite', all: true },
  ], animated);

  const pulseRings = (
    <>
      <Circle cx="160" cy="130" r="10" fill="#D4909A" opacity={0.35}/>
      <Circle cx="160" cy="130" r="18" fill="none" stroke="#D4909A" strokeWidth=".7" opacity={0.25}/>
      <Circle cx="160" cy="130" r="26" fill="none" stroke="#D4909A" strokeWidth=".5" opacity={0.15}/>
    </>
  );

  const svgContent = (
    <Svg viewBox="0 0 200 240" width={width} height={resolvedHeight} style={style}>
      {/* ANXIOUS body: blush, WIDE and ROUND — leaning forward off-center */}
      <Path d="M56 202 Q34 178 32 150 Q30 124 44 100 Q58 76 78 70 Q98 64 112 78 Q126 92 128 120 Q130 148 116 174 Q102 198 80 208Z" fill="#D4909A" opacity={0.85} rotation={7} origin="80, 138"/>
      <G opacity={0.22} stroke="#F2EDE4" strokeWidth="3" strokeLinecap="round">
        <Path d="M34 108 Q76 100 126 106"/>
        <Path d="M32 124 Q75 117 127 122"/>
        <Path d="M32 140 Q75 133 126 138"/>
        <Path d="M34 156 Q75 149 124 154"/>
      </G>
      <Ellipse cx="82" cy="62" rx="20" ry="22" fill="none" stroke="#2C2C2A" strokeWidth="1" rotation={7} origin="82, 62"/>
      <Path d="M68 52 Q78 42 84 40 Q90 38 94 46" fill="none" stroke="#2C2C2A" strokeWidth=".9" strokeLinecap="round" opacity={0.6}/>
      {/* pulse of need: concentric urgent rings */}
      {animated ? (
        <AnimatedG animatedProps={pulseRingsProps}>
          {pulseRings}
        </AnimatedG>
      ) : (
        <G>
          {pulseRings}
        </G>
      )}
      {/* small heartbeat line */}
      <Path d="M128 132 Q136 124 142 132 Q148 140 154 130" fill="none" stroke="#D4909A" strokeWidth="1" opacity={0.45}/>
      <SvgText x="100" y="228" textAnchor="middle" fontSize="9" fill="#D4909A" opacity={0.9} fontFamily="Georgia,serif" fontWeight="500">anxious-preoccupied</SvgText>
      <SvgText x="100" y="215" textAnchor="middle" fontSize="7.5" fill="#B5593A" opacity={0.65} fontFamily="Georgia,serif" fontStyle="italic">{"\u00B7 leaning \u00B7 scanning \u00B7 pulsing \u00B7"}</SvgText>
    </Svg>
  );

  return (
    <View nativeID={containerId}>
      {animated ? (
        <ReAnimated.View style={breatheStyle}>
          {svgContent}
        </ReAnimated.View>
      ) : svgContent}
    </View>
  );
}
