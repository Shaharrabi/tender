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
      <Rect x="10" y="78" width="54" height="12" rx="4" fill="#D4909A" opacity={.2}/>
      <SvgText x="37" y="87" textAnchor="middle" fontSize="6.5" fill="#B5593A" opacity={.7} fontFamily="Georgia,serif">criticism</SvgText>
      <Rect x="10" y="96" width="54" height="12" rx="4" fill="#D4909A" opacity={.15}/>
      <SvgText x="37" y="105" textAnchor="middle" fontSize="6.5" fill="#B5593A" opacity={.6} fontFamily="Georgia,serif">contempt</SvgText>
      <Path d="M320 200 Q338 178 340 152 Q342 128 330 106 Q318 84 300 78 Q282 72 270 86 Q258 100 256 126 Q254 152 270 178 Q282 198 302 206Z" fill="#1E3A52" opacity={.82}/>
      <G opacity={.2} stroke="#F2EDE4" strokeWidth="2.2" strokeLinecap="round"><Path d="M258 122 Q284 117 338 120"/><Path d="M256 136 Q283 131 339 134"/></G>
      <Ellipse cx="298" cy="70" rx="20" ry="24" fill="none" stroke="#2C2C2A" strokeWidth="1" rotation={-5} origin="298, 70"/>
      <Rect x="350" y="78" width="86" height="12" rx="4" fill="#7CA4B8" opacity={.2}/>
      <SvgText x="393" y="87" textAnchor="middle" fontSize="6.5" fill="#1E3A52" opacity={.7} fontFamily="Georgia,serif">stonewalling</SvgText>
      <Rect x="350" y="96" width="86" height="12" rx="4" fill="#7CA4B8" opacity={.15}/>
      <SvgText x="393" y="105" textAnchor="middle" fontSize="6.5" fill="#1E3A52" opacity={.6} fontFamily="Georgia,serif">defensiveness</SvgText>
      <Path d="M134 130 Q180 116 224 124" fill="none" stroke="#D4909A" strokeWidth="1" strokeDasharray="3 3" opacity={.5}/>
      <Path d="M220 121 L224 124 L220 127" fill="none" stroke="#D4909A" strokeWidth=".8" opacity={.5}/>
      <Path d="M256 144 Q210 158 166 150" fill="none" stroke="#1E3A52" strokeWidth="1" strokeDasharray="3 3" opacity={.5}/>
      <Path d="M170 153 L166 150 L170 147" fill="none" stroke="#1E3A52" strokeWidth=".8" opacity={.5}/>
      <SvgText x="195" y="122" textAnchor="middle" fontSize="7" fill="#8B7355" opacity={.4} fontFamily="Georgia,serif">{"pursue →"}</SvgText>
      <SvgText x="195" y="158" textAnchor="middle" fontSize="7" fill="#8B7355" opacity={.4} fontFamily="Georgia,serif">{"← withdraw"}</SvgText>
      <G opacity={.65}>
        <SvgText x="30" y="186" fontSize="7" fill="#8B7355" fontFamily="Georgia,serif" letterSpacing=".5">{"partner A · conflict flexibility"}</SvgText>
        <Rect x="30" y="192" width="180" height="3.5" rx="1.5" fill="#D6CEBF"/><Rect x="30" y="192" width="110" height="3.5" rx="1.5" fill="#D4909A" opacity={.65}/>
        <SvgText x="30" y="208" fontSize="7" fill="#8B7355" fontFamily="Georgia,serif" letterSpacing=".5">{"partner B · conflict flexibility"}</SvgText>
        <Rect x="30" y="214" width="180" height="3.5" rx="1.5" fill="#D6CEBF"/><Rect x="30" y="214" width="84" height="3.5" rx="1.5" fill="#7CA4B8" opacity={.65}/>
      </G>
      <SvgText x="240" y="208" fontSize="7" fill="#8B7355" opacity={.42} fontFamily="Georgia,serif">{"→ different styles, shared pattern"}</SvgText>
      <SvgText x="240" y="222" fontSize="7" fill="#8B7355" opacity={.35} fontFamily="Georgia,serif">{"→ pursuer and distancer reinforce each other"}</SvgText>
      <SvgText x="230" y="232" textAnchor="middle" fontFamily="Georgia,serif" fontSize="7.5" letterSpacing="2" fill="#2C2C2A" opacity={.4}>{"HOW YOU NAVIGATE CONFLICT · DUTCH INTERACTION"}</SvgText>
    </Svg>
  );

  return (
    <View nativeID={containerId}>
      {animated ? <ReAnimated.View style={animStyle}>{svgContent}</ReAnimated.View> : svgContent}
    </View>
  );
}
