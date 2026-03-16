/*
 * ═══════════════════════════════════════════════════════════════
 * TENDER ILLUSTRATION
 * ───────────────────────────────────────────────────────────────
 * ID:          ifs-self
 * Component:   IllustrationIFSSelf
 * Screen:      microcourse (IFS Self lesson)  AND  exercise.tsx IFS tag
 * Description: IFS Self — terracotta+navy body, golden core, 8 C quality rays radiating
 * ViewBox:     0 0 280 220
 *
 * USAGE:
 *   import { IllustrationIFSSelf } from '@/assets/graphics/illustrations/index';
 *   <IllustrationIFSSelf width={screenWidth} />
 *
 * ANIMATIONS (per-element):
 *   - Body path: CSS breathe 5.5s on web, useBreathe on native
 *   - Golden core circle: CSS pulse 2.5s on web, usePulseProps on native
 *   - 8 C-quality ray lines: static
 *   - 8 C text labels: static
 *
 * DO NOT add arm or hand paths.
 * DO NOT show official assessment names (ECR-R, DUTCH, etc.)
 * ═══════════════════════════════════════════════════════════════
 */

import React from 'react';
import { View, ViewStyle } from 'react-native';
import Svg, {
  Path, Ellipse, Circle, G, Line, Text as SvgText
} from 'react-native-svg';
import ReAnimated from 'react-native-reanimated';
import { useBreathe, usePulseProps, useWebSvgAnim } from '../hooks/useIllustrationAnimation';

const AnimatedCircle = ReAnimated.createAnimatedComponent(Circle);

interface Props {
  width?: number;
  height?: number;
  animated?: boolean;
  style?: ViewStyle;
}

export function IllustrationIFSSelf({ width = 224, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (188 / 224));
  const breatheStyle = useBreathe(5500);
  const goldCoreProps = usePulseProps(0.4, 0.95, 2500);

  // Web: apply CSS animations directly to SVG DOM elements
  const containerId = useWebSvgAnim([
    { selector: 'path[fill="#B5593A"]', animation: 'tender-breathe 5.5s ease-in-out infinite', origin: '120px 136px' },
    { selector: 'circle[r="8"]', animation: 'tender-pulse 2.5s ease-in-out infinite' },
  ], animated);

  const svgContent = (
    <Svg viewBox="44 30 224 188" width={width} height={resolvedHeight} style={style}>
      {/* SELF: terracotta + navy merged, golden center */}
      <Path d="M98 196 Q78 172 76 146 Q74 122 86 100 Q98 78 116 72 Q134 66 148 80 Q162 94 164 120 Q166 146 152 172 Q140 194 120 202Z" fill="#B5593A" opacity={0.78}/>
      <G opacity={0.18} stroke="#1E3A52" strokeWidth="3" strokeLinecap="round">
        <Path d="M78 108 Q114 102 162 106"/>
        <Path d="M76 122 Q113 117 163 120"/>
        <Path d="M76 136 Q113 131 162 134"/>
        <Path d="M77 150 Q113 145 160 148"/>
      </G>
      <Ellipse cx="120" cy="64" rx="20" ry="24" fill="none" stroke="#2C2C2A" strokeWidth="1"/>
      <Path d="M106 52 Q116 42 122 40 Q128 38 132 46" fill="none" stroke="#2C2C2A" strokeWidth=".9" strokeLinecap="round" opacity={0.6}/>
      {/* golden SELF center: the calm core — animated pulse */}
      {animated ? (
        <AnimatedCircle animatedProps={goldCoreProps} cx={120} cy={136} r={8} fill="#C8923A"/>
      ) : (
        <Circle cx="120" cy="136" r="8" fill="#C8923A" opacity={0.8} />
      )}
      {/* 8 C-quality rays radiating outward */}
      <G opacity={0.55} stroke="#C8923A" strokeWidth=".8">
        <Line x1="120" y1="128" x2="120" y2="112"/><Line x1="120" y1="144" x2="120" y2="160"/>
        <Line x1="112" y1="136" x2="96" y2="136"/><Line x1="128" y1="136" x2="144" y2="136"/>
        <Line x1="114" y1="130" x2="103" y2="119"/><Line x1="126" y1="130" x2="137" y2="119"/>
        <Line x1="114" y1="142" x2="103" y2="153"/><Line x1="126" y1="142" x2="137" y2="153"/>
      </G>
      {/* 8 C labels at ray tips */}
      <SvgText x="120" y="108" textAnchor="middle" fontSize="6" fill="#C8923A" opacity={0.7} fontFamily="Georgia,serif">calm</SvgText>
      <SvgText x="120" y="168" textAnchor="middle" fontSize="6" fill="#C8923A" opacity={0.65} fontFamily="Georgia,serif">connected</SvgText>
      <SvgText x="90" y="138" textAnchor="end" fontSize="6" fill="#C8923A" opacity={0.65} fontFamily="Georgia,serif">curious</SvgText>
      <SvgText x="150" y="138" fontSize="6" fill="#C8923A" opacity={0.65} fontFamily="Georgia,serif">confident</SvgText>
      <SvgText x="98" y="116" textAnchor="end" fontSize="6" fill="#C8923A" opacity={0.6} fontFamily="Georgia,serif">clear</SvgText>
      <SvgText x="142" y="116" fontSize="6" fill="#C8923A" opacity={0.6} fontFamily="Georgia,serif">creative</SvgText>
      <SvgText x="98" y="158" textAnchor="end" fontSize="6" fill="#C8923A" opacity={0.6} fontFamily="Georgia,serif">compassion</SvgText>
      <SvgText x="142" y="158" fontSize="6" fill="#C8923A" opacity={0.6} fontFamily="Georgia,serif">courageous</SvgText>
      {/* right annotation */}
      <SvgText x="196" y="104" fontSize="7.5" fill="#8B7355" opacity={0.45} fontFamily="Georgia,serif">Self is not</SvgText>
      <SvgText x="196" y="116" fontSize="7.5" fill="#8B7355" opacity={0.45} fontFamily="Georgia,serif">a part.</SvgText>
      <SvgText x="196" y="132" fontSize="7.5" fill="#8B7355" opacity={0.45} fontFamily="Georgia,serif">It is the one</SvgText>
      <SvgText x="196" y="144" fontSize="7.5" fill="#8B7355" opacity={0.45} fontFamily="Georgia,serif">who can be</SvgText>
      <SvgText x="196" y="156" fontSize="7.5" fill="#8B7355" opacity={0.45} fontFamily="Georgia,serif">curious about</SvgText>
      <SvgText x="196" y="168" fontSize="7.5" fill="#8B7355" opacity={0.45} fontFamily="Georgia,serif">all of them.</SvgText>
      <SvgText x="140" y="210" textAnchor="middle" fontFamily="Georgia,serif" fontSize="8" letterSpacing="3" fill="#2C2C2A" opacity={0.4}>{"SELF ENERGY \u00B7 THE 8 C\u2019S"}</SvgText>
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
