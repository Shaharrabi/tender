/*
 * ═══════════════════════════════════════════════════════════════
 * TENDER ILLUSTRATION
 * ───────────────────────────────────────────────────────────────
 * ID:          wot-regulated
 * Component:   IllustrationWoTRegulated
 * Screen:      microcourse (WoT inside window)  AND  support-groups.tsx reset
 * Description: Regulated — sage body breathing, slow rings expanding, can think+feel
 * ViewBox:     0 0 280 220
 *
 * USAGE:
 *   import { IllustrationWoTRegulated } from '@/assets/graphics/illustrations/index';
 *   <IllustrationWoTRegulated width={screenWidth} />
 *
 * ANIMATIONS (per-element):
 *   - Sage body: CSS breathe 5.5s on web, useBreathe on native
 *   - Ripple ring 1 (rx=50): CSS expand 5s on web, useExpandProps on native
 *   - Ripple ring 2 (rx=65): CSS expand 5s -2s on web, useExpandProps on native
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
import { useBreathe, useExpandProps, useWebSvgAnim } from '../hooks/useIllustrationAnimation';

const AnimatedEllipse = ReAnimated.createAnimatedComponent(Ellipse);

interface Props {
  width?: number;
  height?: number;
  animated?: boolean;
  style?: ViewStyle;
}

export function IllustrationWoTRegulated({ width = 270, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (222 / 270));
  const breatheStyle = useBreathe(5500);
  const ring1Props = useExpandProps(0.15, 0.4, 5000);
  const ring2Props = useExpandProps(0.08, 0.22, 5000, 2000);

  // Web: apply CSS animations directly to SVG DOM elements
  const containerId = useWebSvgAnim([
    { selector: 'path[fill="#7A9E8E"]', animation: 'tender-breathe 5.5s ease-in-out infinite', origin: '110px 131px' },
    { selector: 'ellipse[rx="50"]', animation: 'tender-expand 5s ease-in-out infinite', origin: '110px 130px' },
    { selector: 'ellipse[rx="65"]', animation: 'tender-expand 5s ease-in-out infinite -2s', origin: '110px 130px' },
  ], animated);

  const svgContent = (
    <Svg viewBox="-4 -4 270 222" width={width} height={resolvedHeight} style={style}>
      {/* window zone fill: green-tinted band */}
      <Rect x="0" y="50" width="280" height="140" fill="#7A9E8E" opacity={0.05}/>
      <Line x1="20" y1="50" x2="260" y2="50" stroke="#7A9E8E" strokeWidth="1" opacity={0.4} strokeDasharray="4 3"/>
      <Line x1="20" y1="190" x2="260" y2="190" stroke="#7A9E8E" strokeWidth="1" opacity={0.4} strokeDasharray="4 3"/>
      <SvgText x="264" y="54" fontSize="6" fill="#7A9E8E" opacity={0.5} fontFamily="Georgia,serif">{"\u2191 above"}</SvgText>
      <SvgText x="264" y="194" fontSize="6" fill="#7A9E8E" opacity={0.5} fontFamily="Georgia,serif">{"\u2193 below"}</SvgText>
      {/* REGULATED body: sage, calm, steady breathing rings */}
      <Path d="M88 188 Q68 164 66 138 Q64 114 76 92 Q88 70 106 64 Q124 58 138 72 Q152 86 154 114 Q156 142 140 168 Q128 190 108 198Z" fill="#7A9E8E" opacity={0.85}/>
      <G opacity={0.2} stroke="#F2EDE4" strokeWidth="2.5" strokeLinecap="round">
        <Path d="M68 100 Q106 94 152 98"/>
        <Path d="M66 114 Q105 109 153 112"/>
        <Path d="M66 128 Q105 123 152 126"/>
        <Path d="M67 142 Q105 137 150 140"/>
        <Path d="M69 156 Q105 151 148 154"/>
      </G>
      <Ellipse cx="110" cy="56" rx="20" ry="24" fill="none" stroke="#2C2C2A" strokeWidth="1"/>
      <Path d="M97 44 Q107 34 112 32 Q117 30 121 38" fill="none" stroke="#2C2C2A" strokeWidth=".9" strokeLinecap="round" opacity={0.6}/>
      {/* breath ripple rings: slow, even */}
      {animated ? (
        <AnimatedEllipse cx="110" cy="130" rx="50" ry="62" fill="none" stroke="#7CA4B8" strokeWidth=".6" animatedProps={ring1Props}/>
      ) : (
        <Ellipse cx="110" cy="130" rx="50" ry="62" fill="none" stroke="#7CA4B8" strokeWidth=".6" opacity={0.3}/>
      )}
      {animated ? (
        <AnimatedEllipse cx="110" cy="130" rx="65" ry="78" fill="none" stroke="#7CA4B8" strokeWidth=".4" animatedProps={ring2Props}/>
      ) : (
        <Ellipse cx="110" cy="130" rx="65" ry="78" fill="none" stroke="#7CA4B8" strokeWidth=".4" opacity={0.15}/>
      )}
      {/* in-window annotation */}
      <SvgText x="198" y="100" fontSize="7" fill="#2A5040" opacity={0.65} fontFamily="Georgia,serif">can think</SvgText>
      <SvgText x="198" y="112" fontSize="7" fill="#2A5040" opacity={0.6} fontFamily="Georgia,serif">and feel</SvgText>
      <SvgText x="198" y="126" fontSize="7" fill="#2A5040" opacity={0.5} fontFamily="Georgia,serif">at the same</SvgText>
      <SvgText x="198" y="138" fontSize="7" fill="#2A5040" opacity={0.5} fontFamily="Georgia,serif">time</SvgText>
      <SvgText x="140" y="208" textAnchor="middle" fontFamily="Georgia,serif" fontSize="8" letterSpacing="3" fill="#2A5040" opacity={0.55}>INSIDE THE WINDOW</SvgText>
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
