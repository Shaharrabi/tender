/*
 * ═══════════════════════════════════════════════════════════════
 * TENDER ILLUSTRATION
 * ───────────────────────────────────────────────────────────────
 * ID:          wot-hypo
 * Component:   IllustrationWoTHypo
 * Screen:      microcourse (WoT below window)  AND  support-groups.tsx reset
 * Description: Hypoarousal — navy body collapsed/tilted, barely-there ripple, shutdown labels
 * ViewBox:     0 0 280 220
 *
 * USAGE:
 *   import { IllustrationWoTHypo } from '@/assets/graphics/illustrations/index';
 *   <IllustrationWoTHypo width={screenWidth} />
 *
 * ANIMATIONS (per-element):
 *   - Navy body: CSS breathe 9s on web, useBreathe on native
 *   - Barely-there ripple (rx=30): CSS expand 9s on web, useExpandProps on native
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

export function IllustrationWoTHypo({ width = 270, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (222 / 270));
  const breatheStyle = useBreathe(9000);
  const rippleProps = useExpandProps(0.1, 0.35, 9000);

  // Web: apply CSS animations directly to SVG DOM elements
  const containerId = useWebSvgAnim([
    { selector: 'path[fill="#1E3A52"]', animation: 'tender-breathe 9s ease-in-out infinite', origin: '100px 152px' },
    { selector: 'ellipse[rx="30"]', animation: 'tender-expand 9s ease-in-out infinite', origin: '100px 158px' },
  ], animated);

  const svgContent = (
    <Svg viewBox="-4 -4 270 222" width={width} height={resolvedHeight} style={style}>
      {/* window line at top */}
      <Line x1="20" y1="30" x2="260" y2="30" stroke="#7A9E8E" strokeWidth="1.2" opacity={0.5} strokeDasharray="4 3"/>
      <SvgText x="264" y="34" fontSize="6.5" fill="#7A9E8E" opacity={0.55} fontFamily="Georgia,serif">window</SvgText>
      {/* HYPO body: navy, sinking/collapsed, heavy */}
      <Path d="M82 200 Q62 180 60 158 Q58 138 68 120 Q78 102 94 98 Q110 94 124 104 Q138 114 140 136 Q142 158 130 178 Q120 196 102 206Z" fill="#1E3A52" opacity={0.85} rotation={12} origin="100, 152"/>
      <G opacity={0.22} stroke="#F2EDE4" strokeWidth="2.5" strokeLinecap="round">
        <Path d="M62 130 Q96 124 138 128"/>
        <Path d="M60 144 Q95 139 139 142"/>
        <Path d="M61 158 Q95 153 137 156"/>
      </G>
      <Ellipse cx="96" cy="94" rx="18" ry="22" fill="none" stroke="#2C2C2A" strokeWidth="1" rotation={12} origin="96, 94"/>
      {/* barely-there ripple: almost no pulse */}
      {animated ? (
        <AnimatedEllipse cx="100" cy="158" rx="30" ry="36" fill="none" stroke="#D6CEBF" strokeWidth=".5" animatedProps={rippleProps}/>
      ) : (
        <Ellipse cx="100" cy="158" rx="30" ry="36" fill="none" stroke="#D6CEBF" strokeWidth=".5" opacity={0.3}/>
      )}
      {/* shutdown markers */}
      <SvgText x="192" y="130" fontSize="7" fill="#1E3A52" opacity={0.55} fontFamily="Georgia,serif">numb</SvgText>
      <SvgText x="192" y="144" fontSize="7" fill="#1E3A52" opacity={0.5} fontFamily="Georgia,serif">freeze</SvgText>
      <SvgText x="192" y="158" fontSize="7" fill="#1E3A52" opacity={0.45} fontFamily="Georgia,serif">collapse</SvgText>
      <SvgText x="192" y="172" fontSize="7" fill="#1E3A52" opacity={0.38} fontFamily="Georgia,serif">dissociate</SvgText>
      <SvgText x="192" y="186" fontSize="7" fill="#1E3A52" opacity={0.32} fontFamily="Georgia,serif">gone</SvgText>
      <SvgText x="140" y="208" textAnchor="middle" fontFamily="Georgia,serif" fontSize="8" letterSpacing="3" fill="#1E3A52" opacity={0.55}>BELOW THE WINDOW</SvgText>
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
