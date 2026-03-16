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
  const resolvedHeight = height ?? Math.round(width * (260 / 260));
  const breatheStyle = useBreathe(5500);
  const ring1Props = useExpandProps(0.15, 0.4, 5500);
  const ring2Props = useExpandProps(0.08, 0.22, 5500, 1500);

  // Web: apply CSS animations directly to SVG DOM elements
  const containerId = useWebSvgAnim([
    { selector: 'path[fill="#7A9E8E"]', animation: 'tender-breathe 5.5s ease-in-out infinite', origin: '120px 140px' },
    { selector: 'ellipse[rx="46"]', animation: 'tender-expand 5.5s ease-in-out infinite', origin: '120px 140px' },
    { selector: 'ellipse[rx="60"]', animation: 'tender-expand 5.5s ease-in-out infinite -1.5s', origin: '120px 140px' },
  ], animated);

  const svgContent = (
    <Svg viewBox="0 0 260 260" width={width} height={resolvedHeight} style={style}>
      {/* SECURE body: sage, upright, wide — radiating rings outward */}
      <Path d="M98 200 Q80 176 78 150 Q76 126 88 104 Q100 82 118 76 Q136 70 148 84 Q160 98 162 124 Q164 150 150 176 Q138 198 118 206Z" fill="#7A9E8E" opacity={0.85}/>
      <G opacity={0.2} stroke="#F2EDE4" strokeWidth="2.5" strokeLinecap="round">
        <Path d="M80 112 Q116 106 160 110"/>
        <Path d="M78 126 Q115 121 161 124"/>
        <Path d="M78 140 Q115 135 160 138"/>
        <Path d="M80 154 Q115 149 158 152"/>
      </G>
      <Ellipse cx="120" cy="68" rx="20" ry="24" fill="none" stroke="#2C2C2A" strokeWidth="1"/>
      <Path d="M106 56 Q116 46 122 44 Q128 42 132 50" fill="none" stroke="#2C2C2A" strokeWidth=".9" strokeLinecap="round" opacity={0.6}/>
      {/* ripple rings: presence radiating */}
      {animated ? (
        <AnimatedEllipse animatedProps={ring1Props} cx="120" cy="140" rx="46" ry="56" fill="none" stroke="#7A9E8E" strokeWidth=".6"/>
      ) : (
        <Ellipse cx="120" cy="140" rx="46" ry="56" fill="none" stroke="#7A9E8E" strokeWidth=".6" opacity={0.3}/>
      )}
      {animated ? (
        <AnimatedEllipse animatedProps={ring2Props} cx="120" cy="140" rx="60" ry="72" fill="none" stroke="#7A9E8E" strokeWidth=".4"/>
      ) : (
        <Ellipse cx="120" cy="140" rx="60" ry="72" fill="none" stroke="#7A9E8E" strokeWidth=".4" opacity={0.15}/>
      )}
      {/* behavioral annotation */}
      <SvgText x="130" y="242" textAnchor="middle" fontSize="16" fill="#2A5040" opacity={0.85} fontFamily="Georgia,serif" fontStyle="italic">{"\u00B7 settled \u00B7 present \u00B7 radiating \u00B7"}</SvgText>
      <SvgText x="130" y="222" textAnchor="middle" fontSize="20" fill="#7A9E8E" opacity={0.9} fontFamily="Georgia,serif" fontWeight="500">secure</SvgText>
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
