/*
 * ═══════════════════════════════════════════════════════════════
 * TENDER ILLUSTRATION
 * ───────────────────────────────────────────────────────────────
 * ID:          wot-hyper
 * Component:   IllustrationWoTHyper
 * Screen:      microcourse (WoT above window)  AND  support-groups.tsx reset
 * Description: Hyperarousal — body rising, heat lines erupting upward, alarm labels
 * ViewBox:     0 0 280 220
 *
 * USAGE:
 *   import { IllustrationWoTHyper } from '@/assets/graphics/illustrations/index';
 *   <IllustrationWoTHyper width={screenWidth} />
 *
 * ANIMATIONS (per-element):
 *   - Main terracotta body: CSS rise 2s on web, useFloat on native
 *   - Heat flames (gold): CSS flicker 1.4s on web, parent=true
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
import { useFloat, useFlickerProps, useWebSvgAnim } from '../hooks/useIllustrationAnimation';

const AnimatedG = ReAnimated.createAnimatedComponent(G);

interface Props {
  width?: number;
  height?: number;
  animated?: boolean;
  style?: ViewStyle;
}

export function IllustrationWoTHyper({ width = 270, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (222 / 270));
  const floatStyle = useFloat(2000, 6);
  const flameProps = useFlickerProps();

  // Web: apply CSS animations directly to SVG DOM elements
  const containerId = useWebSvgAnim([
    { selector: 'path[fill="#B5593A"]', animation: 'tender-rise 2s ease-in-out infinite', origin: '110px 117px' },
    { selector: 'path[fill="#C8923A"]', animation: 'tender-flicker 1.4s ease-in-out infinite', parent: true, all: true },
  ], animated);

  const svgContent = (
    <Svg viewBox="-4 -4 270 222" width={width} height={resolvedHeight} style={style}>
      {/* window line at bottom */}
      <Line x1="20" y1="186" x2="260" y2="186" stroke="#7A9E8E" strokeWidth="1.2" opacity={0.5} strokeDasharray="4 3"/>
      <SvgText x="268" y="190" fontSize="6.5" fill="#7A9E8E" opacity={0.55} fontFamily="Georgia,serif">window</SvgText>
      {/* HYPERAROUSAL body: blush-red, rigid, rising */}
      <Path d="M86 182 Q64 156 60 126 Q56 98 70 72 Q84 46 104 38 Q124 30 140 46 Q156 62 158 96 Q160 130 144 162 Q130 188 108 196Z" fill="#B5593A" opacity={0.88}/>
      <G opacity={0.28} stroke="#F2EDE4" strokeWidth="3" strokeLinecap="round">
        <Path d="M62 82 Q106 74 156 80"/>
        <Path d="M60 98 Q105 91 157 96"/>
        <Path d="M60 114 Q105 108 157 112"/>
        <Path d="M61 130 Q105 124 155 128"/>
      </G>
      <Ellipse cx="110" cy="30" rx="22" ry="26" fill="none" stroke="#2C2C2A" strokeWidth="1.1" rotation={-4} origin="110, 30"/>
      {/* heat energy erupting upward: jagged lines */}
      {animated ? (
        <AnimatedG animatedProps={flameProps}>
          <Path d="M100 16 Q97 8 100 2 Q103 8 101 16Z" fill="#C8923A" opacity={0.7}/>
          <Path d="M112 14 Q109 6 112 0 Q115 6 113 14Z" fill="#C8923A" opacity={0.55}/>
          <Path d="M124 18 Q121 10 124 4 Q127 10 125 18Z" fill="#C8923A" opacity={0.45}/>
        </AnimatedG>
      ) : (
        <G>
          <Path d="M100 16 Q97 8 100 2 Q103 8 101 16Z" fill="#C8923A" opacity={0.7}/>
          <Path d="M112 14 Q109 6 112 0 Q115 6 113 14Z" fill="#C8923A" opacity={0.55}/>
          <Path d="M124 18 Q121 10 124 4 Q127 10 125 18Z" fill="#C8923A" opacity={0.45}/>
        </G>
      )}
      {/* body annotation labels */}
      <SvgText x="192" y="60" fontSize="7" fill="#B5593A" opacity={0.65} fontFamily="Georgia,serif">fight</SvgText>
      <SvgText x="192" y="74" fontSize="7" fill="#B5593A" opacity={0.6} fontFamily="Georgia,serif">flight</SvgText>
      <SvgText x="192" y="88" fontSize="7" fill="#B5593A" opacity={0.5} fontFamily="Georgia,serif">panic</SvgText>
      <SvgText x="192" y="102" fontSize="7" fill="#B5593A" opacity={0.45} fontFamily="Georgia,serif">rage</SvgText>
      <SvgText x="192" y="116" fontSize="7" fill="#B5593A" opacity={0.4} fontFamily="Georgia,serif">flooding</SvgText>
      <SvgText x="140" y="208" textAnchor="middle" fontFamily="Georgia,serif" fontSize="8" letterSpacing="3" fill="#B5593A" opacity={0.55}>ABOVE THE WINDOW</SvgText>
    </Svg>
  );

  return (
    <View nativeID={containerId}>
      {animated ? (
        <ReAnimated.View style={floatStyle}>
          {svgContent}
        </ReAnimated.View>
      ) : svgContent}
    </View>
  );
}
