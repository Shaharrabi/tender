/*
 * TENDER ILLUSTRATION — portal-conflict
 * Conflict interaction — DUTCH cycle arrows, live score bars
 * ViewBox: 0 0 460 240
 */
import React from 'react';
import { View, ViewStyle } from 'react-native';
import Svg, { Path, Ellipse, Circle, Rect, Line, G, Text as SvgText } from 'react-native-svg';
import ReAnimated from 'react-native-reanimated';
import { useBreathe, useWebSvgAnim } from '../hooks/useIllustrationAnimation';

interface Props { width?: number; height?: number; animated?: boolean; style?: ViewStyle; }

export function IllustrationPortalConflict({ width = 460, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (240 / 460));
  const animStyle = useBreathe(4000);
  const containerId = useWebSvgAnim([
    { selector: 'path[fill="#D4909A"]', animation: 'tender-breathe 4s ease-in-out infinite', origin: '92px 140px' },
    { selector: 'path[fill="#1E3A52"]', animation: 'tender-breathe 5s ease-in-out infinite -2s', origin: '300px 140px' },
    { selector: 'path[stroke="#D4909A"]', animation: 'tender-pulse 2.5s ease-in-out infinite', all: true },
    { selector: 'path[stroke="#1E3A52"][stroke-dasharray]', animation: 'tender-pulse 2.5s ease-in-out infinite -1.2s' },
  ], animated);

  const svgContent = (
    <Svg viewBox="0 0 460 240" width={width} height={resolvedHeight} style={style}>
      <Path d="M70 200 Q52 178 50 152 Q48 128 60 106 Q72 84 90 78 Q108 72 120 86 Q132 100 134 126 Q136 152 120 178 Q108 198 88 206Z" fill="#D4909A" opacity={.82}/>
      <Ellipse cx="90" cy="70" rx="20" ry="24" fill="none" stroke="#2C2C2A" strokeWidth="1" rotation={5} origin="90, 70"/>
      <Rect x="2" y="74" width="70" height="18" rx="4" fill="#D4909A" opacity={.2}/>
      <SvgText x="37" y="89" textAnchor="middle" fontSize="14" fill="#B5593A" opacity={.8} fontFamily="Georgia,serif">criticism</SvgText>
      <Rect x="2" y="96" width="70" height="18" rx="4" fill="#D4909A" opacity={.15}/>
      <SvgText x="37" y="111" textAnchor="middle" fontSize="14" fill="#B5593A" opacity={.7} fontFamily="Georgia,serif">contempt</SvgText>
      <Path d="M320 200 Q338 178 340 152 Q342 128 330 106 Q318 84 300 78 Q282 72 270 86 Q258 100 256 126 Q254 152 270 178 Q282 198 302 206Z" fill="#1E3A52" opacity={.82}/>
      <G opacity={.2} stroke="#F2EDE4" strokeWidth="2.2" strokeLinecap="round"><Path d="M258 122 Q284 117 338 120"/><Path d="M256 136 Q283 131 339 134"/></G>
      <Ellipse cx="298" cy="70" rx="20" ry="24" fill="none" stroke="#2C2C2A" strokeWidth="1" rotation={-5} origin="298, 70"/>
      <Rect x="346" y="74" width="100" height="18" rx="4" fill="#7CA4B8" opacity={.2}/>
      <SvgText x="396" y="89" textAnchor="middle" fontSize="14" fill="#1E3A52" opacity={.8} fontFamily="Georgia,serif">stonewalling</SvgText>
      <Rect x="346" y="96" width="100" height="18" rx="4" fill="#7CA4B8" opacity={.15}/>
      <SvgText x="396" y="111" textAnchor="middle" fontSize="14" fill="#1E3A52" opacity={.7} fontFamily="Georgia,serif">defensiveness</SvgText>
      <Path d="M134 130 Q180 116 224 124" fill="none" stroke="#D4909A" strokeWidth="1" strokeDasharray="3 3" opacity={.5}/>
      <Path d="M220 121 L224 124 L220 127" fill="none" stroke="#D4909A" strokeWidth=".8" opacity={.5}/>
      <Path d="M256 144 Q210 158 166 150" fill="none" stroke="#1E3A52" strokeWidth="1" strokeDasharray="3 3" opacity={.5}/>
      <Path d="M170 153 L166 150 L170 147" fill="none" stroke="#1E3A52" strokeWidth=".8" opacity={.5}/>
      <SvgText x="195" y="122" textAnchor="middle" fontSize="14" fill="#8B7355" opacity={.5} fontFamily="Georgia,serif">{"pursue →"}</SvgText>
      <SvgText x="195" y="160" textAnchor="middle" fontSize="14" fill="#8B7355" opacity={.5} fontFamily="Georgia,serif">{"← withdraw"}</SvgText>
      <G opacity={.7}>
        <SvgText x="30" y="184" fontSize="13" fill="#8B7355" fontFamily="Georgia,serif" letterSpacing=".5">{"partner A · conflict flexibility"}</SvgText>
        <Rect x="30" y="190" width="180" height="5" rx="2" fill="#D6CEBF"/><Rect x="30" y="190" width="110" height="5" rx="2" fill="#D4909A" opacity={.65}/>
        <SvgText x="30" y="210" fontSize="13" fill="#8B7355" fontFamily="Georgia,serif" letterSpacing=".5">{"partner B · conflict flexibility"}</SvgText>
        <Rect x="30" y="216" width="180" height="5" rx="2" fill="#D6CEBF"/><Rect x="30" y="216" width="84" height="5" rx="2" fill="#7CA4B8" opacity={.65}/>
      </G>
      <SvgText x="240" y="206" fontSize="13" fill="#8B7355" opacity={.5} fontFamily="Georgia,serif">{"→ different styles, shared pattern"}</SvgText>
      <SvgText x="240" y="222" fontSize="13" fill="#8B7355" opacity={.45} fontFamily="Georgia,serif">{"→ pursuer and distancer reinforce"}</SvgText>
      <SvgText x="230" y="236" textAnchor="middle" fontFamily="Georgia,serif" fontSize="15" letterSpacing="2" fill="#2C2C2A" opacity={.5}>{"HOW YOU NAVIGATE CONFLICT"}</SvgText>
    </Svg>
  );

  return (
    <View nativeID={containerId}>
      {animated ? <ReAnimated.View style={animStyle}>{svgContent}</ReAnimated.View> : svgContent}
    </View>
  );
}
