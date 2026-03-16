/*
 * ═══════════════════════════════════════════════════════════════
 * TENDER ILLUSTRATION
 * ───────────────────────────────────────────────────────────────
 * ID:          ifs-firefighter
 * Component:   IllustrationIFSFirefighter
 * Screen:      microcourse (IFS Firefighter lesson)  AND  exercise.tsx IFS tag
 * Description: IFS Firefighter+Exile — exile in dashed cage, firefighter erupting beside it
 * ViewBox:     0 0 280 220
 *
 * USAGE:
 *   import { IllustrationIFSFirefighter } from '@/assets/graphics/illustrations/index';
 *   <IllustrationIFSFirefighter width={screenWidth} />
 *
 * ANIMATIONS (per-element):
 *   - Exile body (pink): CSS breathe 4s on web
 *   - Firefighter body (terracotta): CSS rise 2.5s on web
 *   - Flame wisps (gold): CSS flicker 1.8s on web, parent=true to target <g>
 *
 * DO NOT add arm or hand paths.
 * DO NOT show official assessment names (ECR-R, DUTCH, etc.)
 * ═══════════════════════════════════════════════════════════════
 */

import React from 'react';
import { View, ViewStyle } from 'react-native';
import Svg, {
  Path, Ellipse, Rect, G, Text as SvgText
} from 'react-native-svg';
import ReAnimated from 'react-native-reanimated';
import { useBreathe, useFlickerProps, useWebSvgAnim } from '../hooks/useIllustrationAnimation';

const AnimatedG = ReAnimated.createAnimatedComponent(G);

interface Props {
  width?: number;
  height?: number;
  animated?: boolean;
  style?: ViewStyle;
}

export function IllustrationIFSFirefighter({ width = 185, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (186 / 185));
  const breatheStyle = useBreathe(4000);
  const flickerProps = useFlickerProps();

  // Web: apply CSS animations directly to SVG DOM elements
  const containerId = useWebSvgAnim([
    { selector: 'path[fill="#D4909A"]', animation: 'tender-breathe 4s ease-in-out infinite', origin: '84px 133px' },
    { selector: 'path[fill="#B5593A"]', animation: 'tender-rise 2.5s ease-in-out infinite', origin: '190px 127px' },
    { selector: 'path[fill="#C8923A"]', animation: 'tender-flicker 1.8s ease-in-out infinite', parent: true, all: true },
  ], animated);

  const svgContent = (
    <Svg viewBox="47 32 185 186" width={width} height={resolvedHeight} style={style}>
      {/* EXILE: small, curled, terracotta — inside a cage of dashes */}
      <Rect x="60" y="70" width="80" height="110" rx="8" fill="none" stroke="#8B7355" strokeWidth=".7" strokeDasharray="4 4" opacity={0.3}/>
      <Path d="M76 174 Q64 158 62 140 Q60 124 68 110 Q76 96 86 92 Q96 88 102 96 Q108 104 108 120 Q108 136 100 152 Q94 164 84 174Z" fill="#D4909A" opacity={0.78}/>
      <Ellipse cx="84" cy="84" rx="14" ry="16" fill="none" stroke="#2C2C2A" strokeWidth=".85"/>
      {/* FIREFIGHTER: blaze of orange, erupting */}
      <Path d="M170 190 Q156 166 158 138 Q160 112 174 90 Q188 68 200 60 Q212 52 218 64 Q224 76 222 104 Q220 132 208 160 Q198 182 186 194Z" fill="#B5593A" opacity={0.82}/>
      <G opacity={0.22} stroke="#F2EDE4" strokeWidth="2.5" strokeLinecap="round">
        <Path d="M160 98 Q188 92 220 96"/>
        <Path d="M158 112 Q187 107 221 110"/>
        <Path d="M158 126 Q187 121 220 124"/>
        <Path d="M159 140 Q187 135 218 138"/>
      </G>
      {/* flame wisps: urgency — animated flicker */}
      {animated ? (
        <AnimatedG animatedProps={flickerProps}>
          <Path d="M190 78 Q185 66 190 56 Q195 66 193 78Z" fill="#C8923A" opacity={0.8}/>
          <Path d="M202 72 Q197 62 202 52 Q207 62 204 72Z" fill="#C8923A" opacity={0.6}/>
        </AnimatedG>
      ) : (
        <G>
          <Path d="M190 78 Q185 66 190 56 Q195 66 193 78Z" fill="#C8923A" opacity={0.8}/>
          <Path d="M202 72 Q197 62 202 52 Q207 62 204 72Z" fill="#C8923A" opacity={0.6}/>
        </G>
      )}
      <Ellipse cx="192" cy="60" rx="16" ry="20" fill="none" stroke="#2C2C2A" strokeWidth=".9"/>
      {/* arrow: firefighter erupts TO PROTECT the exile */}
      <Path d="M162 134 Q144 134 110 134" fill="none" stroke="#B5593A" strokeWidth=".8" strokeDasharray="3 3" opacity={0.4}/>
      <Path d="M114 131 L110 134 L114 137" fill="none" stroke="#B5593A" strokeWidth=".8" opacity={0.4}/>
      <SvgText x="140" y="210" textAnchor="middle" fontFamily="Georgia,serif" fontSize="8" letterSpacing="3" fill="#2C2C2A" opacity={0.4}>{"EXILE \u00B7 FIREFIGHTER"}</SvgText>
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
