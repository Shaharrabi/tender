/*
 * ═══════════════════════════════════════════════════════════════
 * TENDER ILLUSTRATION
 * ───────────────────────────────────────────────────────────────
 * ID:          attach-fearful
 * Component:   IllustrationAttachFearful
 * Screen:      app/(app)/portrait.tsx  AND  microcourse (fearful style)
 * Description: Fearful-Avoidant — plum body swaying, want/fear arrows pulling both ways
 * ViewBox:     0 0 200 240
 *
 * ANIMATIONS (per-element):
 *   - Body path: CSS sway 4s on web, useSway on native
 *   - Want arrow group: CSS pulse 2s on web (via parent <g>), usePulseProps on native
 *   - Fear arrow group: CSS pulse 2s -1s on web (via parent <g>), usePulseProps on native
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
import { useSway, usePulseProps, useWebSvgAnim } from '../hooks/useIllustrationAnimation';

const AnimatedG = ReAnimated.createAnimatedComponent(G);

interface Props {
  width?: number;
  height?: number;
  animated?: boolean;
  style?: ViewStyle;
}

export function IllustrationAttachFearful({ width = 200, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (240 / 200));
  const swayStyle = useSway(4, 4000);
  const pullTowardProps = usePulseProps(0.15, 0.6, 2000);
  const pullAwayProps = usePulseProps(0.15, 0.5, 2000, 1000);

  // Web: apply CSS animations directly to SVG DOM elements
  const containerId = useWebSvgAnim([
    { selector: 'path[fill="#6E4E6E"]', animation: 'tender-sway 4s ease-in-out infinite', origin: '92px 140px' },
    { selector: 'path[stroke="#D4909A"]', animation: 'tender-pulse 2s ease-in-out infinite', parent: true },
    { selector: 'path[stroke="#1E3A52"]', animation: 'tender-pulse 2s ease-in-out infinite -1s', parent: true },
  ], animated);

  const wantArrow = (
    <>
      <Path d="M140 118 Q152 112 160 116" fill="none" stroke="#D4909A" strokeWidth="1.2" strokeDasharray="3 3"/>
      <Path d="M159 116 L162 112 L162 120Z" fill="#D4909A" opacity={0.5}/>
      <SvgText x="168" y="128" textAnchor="middle" fontSize="6" fill="#D4909A" opacity={0.6} fontFamily="Georgia,serif">want</SvgText>
    </>
  );

  const fearArrow = (
    <>
      <Path d="M140 140 Q152 148 158 144" fill="none" stroke="#1E3A52" strokeWidth="1.2" strokeDasharray="3 3"/>
      <Path d="M157 144 L160 148 L160 140Z" fill="#1E3A52" opacity={0.4}/>
      <SvgText x="168" y="148" textAnchor="middle" fontSize="6" fill="#1E3A52" opacity={0.55} fontFamily="Georgia,serif">fear</SvgText>
    </>
  );

  const svgContent = (
    <Svg viewBox="0 0 200 240" width={width} height={resolvedHeight} style={style}>
      {/* FEARFUL body: plum, mid-twist — caught between two pulls */}
      <Path d="M70 200 Q52 176 50 150 Q48 126 60 104 Q72 82 90 76 Q108 70 120 84 Q132 98 134 126 Q136 154 120 178 Q108 198 88 206Z" fill="#6E4E6E" opacity={0.82}/>
      <G opacity={0.2} stroke="#F2EDE4" strokeWidth="2.5" strokeLinecap="round">
        <Path d="M52 112 Q88 106 132 110"/>
        <Path d="M50 126 Q87 121 133 124"/>
        <Path d="M51 140 Q87 135 132 138"/>
        <Path d="M52 154 Q87 149 130 152"/>
      </G>
      <Ellipse cx="90" cy="68" rx="19" ry="22" fill="none" stroke="#2C2C2A" strokeWidth="1" rotation={3} origin="90, 68"/>
      <Path d="M77 57 Q85 48 91 46 Q97 44 101 52" fill="none" stroke="#2C2C2A" strokeWidth=".9" strokeLinecap="round" opacity={0.6}/>
      {/* two opposing pull-arrows: the ambivalence */}
      {animated ? (
        <AnimatedG animatedProps={pullTowardProps}>
          {wantArrow}
        </AnimatedG>
      ) : (
        <G>
          {wantArrow}
        </G>
      )}
      {animated ? (
        <AnimatedG animatedProps={pullAwayProps}>
          {fearArrow}
        </AnimatedG>
      ) : (
        <G>
          {fearArrow}
        </G>
      )}
      <SvgText x="100" y="228" textAnchor="middle" fontSize="9" fill="#6E4E6E" opacity={0.9} fontFamily="Georgia,serif" fontWeight="500">fearful-avoidant</SvgText>
      <SvgText x="100" y="215" textAnchor="middle" fontSize="7.5" fill="#6E4E6E" opacity={0.55} fontFamily="Georgia,serif" fontStyle="italic">{"\u00B7 wanting \u00B7 fearing \u00B7 swaying \u00B7"}</SvgText>
    </Svg>
  );

  return (
    <View nativeID={containerId}>
      {animated ? (
        <ReAnimated.View style={swayStyle}>
          {svgContent}
        </ReAnimated.View>
      ) : svgContent}
    </View>
  );
}
