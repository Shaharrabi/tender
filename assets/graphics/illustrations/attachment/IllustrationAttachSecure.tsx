/*
 * ═══════════════════════════════════════════════════════════════
 * TENDER ILLUSTRATION
 * ───────────────────────────────────────────────────────────────
 * ID:          attach-secure
 * Component:   IllustrationAttachSecure
 * Screen:      app/(app)/portrait.tsx  AND  microcourse (secure style)
 * Description: Secure — sage body, rings radiating outward, settled and present
 * ViewBox:     0 0 200 240
 *
 * USAGE:
 *   import { IllustrationAttachSecure } from '@/assets/graphics/illustrations/index';
 *   <IllustrationAttachSecure width={screenWidth} />
 *
 * ANIMATIONS (per-element):
 *   - Body path: CSS breathe 5.5s (scale) on web, useBreathe on native
 *   - Ripple ring 1 (rx=46): CSS expand 5.5s on web, useExpandProps on native
 *   - Ripple ring 2 (rx=60): CSS expand 5.5s -1.5s on web, useExpandProps on native
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

export function IllustrationAttachSecure({ width = 200, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (240 / 200));
  const breatheStyle = useBreathe(5500);
  const ring1Props = useExpandProps(0.15, 0.4, 5500);
  const ring2Props = useExpandProps(0.08, 0.22, 5500, 1500);

  // Web: apply CSS animations directly to SVG DOM elements
  const containerId = useWebSvgAnim([
    { selector: 'path[fill="#7A9E8E"]', animation: 'tender-breathe 5.5s ease-in-out infinite', origin: '90px 140px' },
    { selector: 'ellipse[rx="46"]', animation: 'tender-expand 5.5s ease-in-out infinite', origin: '90px 140px' },
    { selector: 'ellipse[rx="60"]', animation: 'tender-expand 5.5s ease-in-out infinite -1.5s', origin: '90px 140px' },
  ], animated);

  const svgContent = (
    <Svg viewBox="0 0 200 240" width={width} height={resolvedHeight} style={style}>
      {/* SECURE body: sage, upright, wide — radiating rings outward */}
      <Path d="M68 200 Q50 176 48 150 Q46 126 58 104 Q70 82 88 76 Q106 70 118 84 Q130 98 132 124 Q134 150 120 176 Q108 198 88 206Z" fill="#7A9E8E" opacity={0.85}/>
      <G opacity={0.2} stroke="#F2EDE4" strokeWidth="2.5" strokeLinecap="round">
        <Path d="M50 112 Q86 106 130 110"/>
        <Path d="M48 126 Q85 121 131 124"/>
        <Path d="M48 140 Q85 135 130 138"/>
        <Path d="M50 154 Q85 149 128 152"/>
      </G>
      <Ellipse cx="90" cy="68" rx="20" ry="24" fill="none" stroke="#2C2C2A" strokeWidth="1"/>
      <Path d="M76 56 Q86 46 92 44 Q98 42 102 50" fill="none" stroke="#2C2C2A" strokeWidth=".9" strokeLinecap="round" opacity={0.6}/>
      {/* ripple rings: presence radiating */}
      {animated ? (
        <AnimatedEllipse animatedProps={ring1Props} cx="90" cy="140" rx="46" ry="56" fill="none" stroke="#7A9E8E" strokeWidth=".6"/>
      ) : (
        <Ellipse cx="90" cy="140" rx="46" ry="56" fill="none" stroke="#7A9E8E" strokeWidth=".6" opacity={0.3}/>
      )}
      {animated ? (
        <AnimatedEllipse animatedProps={ring2Props} cx="90" cy="140" rx="60" ry="72" fill="none" stroke="#7A9E8E" strokeWidth=".4"/>
      ) : (
        <Ellipse cx="90" cy="140" rx="60" ry="72" fill="none" stroke="#7A9E8E" strokeWidth=".4" opacity={0.15}/>
      )}
      {/* behavioral annotation */}
      <SvgText x="100" y="232" textAnchor="middle" fontSize="12" fill="#2A5040" opacity={0.8} fontFamily="Georgia,serif" fontStyle="italic">{"\u00B7 settled \u00B7 present \u00B7 radiating \u00B7"}</SvgText>
      <SvgText x="100" y="216" textAnchor="middle" fontSize="14" fill="#7A9E8E" opacity={0.9} fontFamily="Georgia,serif" fontWeight="500">secure</SvgText>
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
