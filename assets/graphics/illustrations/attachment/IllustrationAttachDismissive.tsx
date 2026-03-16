/*
 * ═══════════════════════════════════════════════════════════════
 * TENDER ILLUSTRATION
 * ───────────────────────────────────────────────────────────────
 * ID:          attach-dismissive
 * Component:   IllustrationAttachDismissive
 * Screen:      app/(app)/portrait.tsx  AND  microcourse (dismissive style)
 * Description: Dismissive-Avoidant — navy body tilted away, dense stripes, rings inward
 * ViewBox:     0 0 200 240
 *
 * ANIMATIONS (per-element):
 *   - Body path: CSS breathe 7s on web, useBreathe on native
 *   - Ring 1 (rx=18 at cx=94): CSS breathe 7s on web, useExpandProps on native
 *   - Ring 2 (rx=10 at cx=94): CSS breathe 7s -2s on web, useExpandProps on native
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

export function IllustrationAttachDismissive({ width = 200, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (240 / 200));
  const breatheStyle = useBreathe(7000);
  const ring1Props = useExpandProps(0.2, 0.45, 7000);
  const ring2Props = useExpandProps(0.3, 0.55, 7000, 2000);

  // Web: apply CSS animations directly to SVG DOM elements
  const containerId = useWebSvgAnim([
    { selector: 'path[fill="#1E3A52"]', animation: 'tender-breathe 7s ease-in-out infinite', origin: '94px 143px' },
    { selector: 'ellipse[cx="94"][rx="18"]', animation: 'tender-breathe 7s ease-in-out infinite', origin: '94px 145px' },
    { selector: 'ellipse[cx="94"][rx="10"]', animation: 'tender-breathe 7s ease-in-out infinite -2s', origin: '94px 145px' },
  ], animated);

  const svgContent = (
    <Svg viewBox="0 0 200 240" width={width} height={resolvedHeight} style={style}>
      {/* DISMISSIVE body: navy, very upright, contained — tilted AWAY */}
      <Path d="M74 202 Q56 178 54 152 Q52 128 64 106 Q76 84 94 78 Q112 72 124 86 Q136 100 138 128 Q140 156 126 180 Q114 200 94 208Z" fill="#1E3A52" opacity={0.85} rotation={-8} origin="94, 143"/>
      <G opacity={0.25} stroke="#F2EDE4" strokeWidth="2.5" strokeLinecap="round">
        <Path d="M56 114 Q92 108 136 112"/>
        <Path d="M54 128 Q91 123 137 126"/>
        <Path d="M54 142 Q91 137 136 140"/>
        <Path d="M55 156 Q91 151 134 154"/>
        <Path d="M57 170 Q91 165 132 168"/>
      </G>
      <Ellipse cx="96" cy="70" rx="18" ry="22" fill="none" stroke="#2C2C2A" strokeWidth="1" rotation={-8} origin="96, 70"/>
      <Path d="M83 59 Q91 50 97 48 Q103 46 107 54" fill="none" stroke="#2C2C2A" strokeWidth=".9" strokeLinecap="round" opacity={0.6}/>
      {/* self-contained rings: pulled inward */}
      {animated ? (
        <AnimatedEllipse animatedProps={ring1Props} cx="94" cy="145" rx="18" ry="22" fill="none" stroke="#1E3A52" strokeWidth=".8"/>
      ) : (
        <Ellipse cx="94" cy="145" rx="18" ry="22" fill="none" stroke="#1E3A52" strokeWidth=".8" opacity={0.35}/>
      )}
      {animated ? (
        <AnimatedEllipse animatedProps={ring2Props} cx="94" cy="145" rx="10" ry="14" fill="none" stroke="#1E3A52" strokeWidth=".6"/>
      ) : (
        <Ellipse cx="94" cy="145" rx="10" ry="14" fill="none" stroke="#1E3A52" strokeWidth=".6" opacity={0.45}/>
      )}
      {/* small wall lines: the contained boundary */}
      <Line x1="36" y1="120" x2="50" y2="120" stroke="#1E3A52" strokeWidth="1.5" opacity={0.35} strokeLinecap="round"/>
      <Line x1="36" y1="132" x2="50" y2="132" stroke="#1E3A52" strokeWidth="1.5" opacity={0.25} strokeLinecap="round"/>
      <Line x1="36" y1="144" x2="50" y2="144" stroke="#1E3A52" strokeWidth="1.5" opacity={0.18} strokeLinecap="round"/>
      <SvgText x="100" y="228" textAnchor="middle" fontSize="9" fill="#1E3A52" opacity={0.9} fontFamily="Georgia,serif" fontWeight="500">dismissive-avoidant</SvgText>
      <SvgText x="100" y="215" textAnchor="middle" fontSize="7.5" fill="#1E3A52" opacity={0.55} fontFamily="Georgia,serif" fontStyle="italic">{"\u00B7 contained \u00B7 tilted away \u00B7 self-sufficient \u00B7"}</SvgText>
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
