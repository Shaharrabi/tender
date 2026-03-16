/*
 * ═══════════════════════════════════════════════════════════════
 * TENDER ILLUSTRATION
 * ───────────────────────────────────────────────────────────────
 * ID:          ifs-manager
 * Component:   IllustrationIFSManager
 * Screen:      microcourse (IFS Manager lesson)  AND  exercise.tsx IFS tag
 * Description: IFS Manager/Protector — large mustard body standing in front of tiny exile
 * ViewBox:     0 0 280 220
 *
 * USAGE:
 *   import { IllustrationIFSManager } from '@/assets/graphics/illustrations/index';
 *   <IllustrationIFSManager width={screenWidth} />
 *
 * ANIMATIONS (per-element):
 *   - Manager body: CSS breathe 6s on web, useBreathe on native
 *   - Tiny exile body: CSS breathe 4s on web, usePulseProps on native
 *
 * DO NOT add arm or hand paths.
 * DO NOT show official assessment names (ECR-R, DUTCH, etc.)
 * ═══════════════════════════════════════════════════════════════
 */

import React from 'react';
import { View, ViewStyle } from 'react-native';
import Svg, {
  Path, Ellipse, G, Text as SvgText
} from 'react-native-svg';
import ReAnimated from 'react-native-reanimated';
import { useBreathe, usePulseProps, useWebSvgAnim } from '../hooks/useIllustrationAnimation';

const AnimatedPath = ReAnimated.createAnimatedComponent(Path);

interface Props {
  width?: number;
  height?: number;
  animated?: boolean;
  style?: ViewStyle;
}

export function IllustrationIFSManager({ width = 230, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (208 / 230));
  const breatheStyle = useBreathe(6000);
  const exileProps = usePulseProps(0.5, 0.85, 4000);

  // Web: apply CSS animations directly to SVG DOM elements
  const containerId = useWebSvgAnim([
    { selector: 'path[fill="#C8923A"]', animation: 'tender-breathe 6s ease-in-out infinite', origin: '104px 128px' },
    { selector: 'path[fill="#D4909A"]', animation: 'tender-breathe 4s ease-in-out infinite', origin: '170px 171px' },
  ], animated);

  const svgContent = (
    <Svg viewBox="38 10 230 208" width={width} height={resolvedHeight} style={style}>
      {/* MANAGER: large mustard body, shielding */}
      <Path d="M72 200 Q50 172 48 142 Q46 114 60 88 Q74 62 96 54 Q118 46 136 62 Q154 78 156 108 Q158 138 142 168 Q128 194 104 204Z" fill="#C8923A" opacity={0.85}/>
      <G opacity={0.2} stroke="#F2EDE4" strokeWidth="3" strokeLinecap="round">
        <Path d="M50 98 Q98 90 154 96"/>
        <Path d="M48 114 Q97 107 155 112"/>
        <Path d="M48 130 Q97 124 154 128"/>
        <Path d="M49 146 Q97 140 152 144"/>
        <Path d="M52 162 Q97 157 149 160"/>
      </G>
      <Ellipse cx="104" cy="46" rx="22" ry="26" fill="none" stroke="#2C2C2A" strokeWidth="1"/>
      <Path d="M90 34 Q100 24 106 22 Q112 20 116 28" fill="none" stroke="#2C2C2A" strokeWidth=".9" strokeLinecap="round" opacity={0.6}/>
      {/* armor lines across body */}
      <Path d="M52 120 Q104 112 154 118" fill="none" stroke="#2C2C2A" strokeWidth=".6" opacity={0.15}/>
      {/* tiny exile hiding behind/below — animated pulse */}
      {animated ? (
        <AnimatedPath
          animatedProps={exileProps}
          d="M162 188 Q156 176 158 164 Q160 152 168 148 Q176 144 180 154 Q184 164 180 178 Q176 190 170 194Z"
          fill="#D4909A"
        />
      ) : (
        <Path d="M162 188 Q156 176 158 164 Q160 152 168 148 Q176 144 180 154 Q184 164 180 178 Q176 190 170 194Z" fill="#D4909A" opacity={0.75}/>
      )}
      <Ellipse cx="170" cy="144" rx="10" ry="12" fill="none" stroke="#2C2C2A" strokeWidth=".75"/>
      {/* protective label annotation */}
      <SvgText x="210" y="84" fontSize="7" fill="#8B7355" opacity={0.45} fontFamily="Georgia,serif">{'"I protect'}</SvgText>
      <SvgText x="210" y="96" fontSize="7" fill="#8B7355" opacity={0.45} fontFamily="Georgia,serif">what I love</SvgText>
      <SvgText x="210" y="108" fontSize="7" fill="#8B7355" opacity={0.45} fontFamily="Georgia,serif">by keeping</SvgText>
      <SvgText x="210" y="120" fontSize="7" fill="#8B7355" opacity={0.45} fontFamily="Georgia,serif">{'it hidden."'}</SvgText>
      <SvgText x="140" y="210" textAnchor="middle" fontFamily="Georgia,serif" fontSize="8" letterSpacing="3" fill="#2C2C2A" opacity={0.4}>{"MANAGER \u00B7 PROTECTOR"}</SvgText>
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
