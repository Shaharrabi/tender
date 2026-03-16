/*
 * TENDER ILLUSTRATION — portal-pairing1
 * Pairing 1 — Secure+Secure — grounded resonance, vine between them
 * ViewBox: 0 0 300 240
 */
import React from 'react';
import { View, ViewStyle } from 'react-native';
import Svg, { Path, Ellipse, Circle, Rect, Line, G, Text as SvgText } from 'react-native-svg';
import { useWebSvgAnim } from '../hooks/useIllustrationAnimation';

interface Props { width?: number; height?: number; animated?: boolean; style?: ViewStyle; }

export function IllustrationPairing01({ width = 300, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (240 / 300));
  const containerId = useWebSvgAnim([
    { selector: 'path[fill="#7A9E8E"]', animation: 'tender-breathe 5.5s ease-in-out infinite', origin: '82px 138px' },
    { selector: 'path[fill="#B5593A"]', animation: 'tender-breathe 5.5s ease-in-out infinite -2.5s', origin: '218px 138px' },
    { selector: 'path[stroke="#C8923A"]', animation: 'tender-pulse 3s ease-in-out infinite' },
    { selector: 'line[x1="150"]', animation: 'tender-float 4s ease-in-out infinite', origin: '150px 88px', parent: true },
  ], animated);

  return (
    <View nativeID={containerId}>
      <Svg viewBox="0 0 300 240" width={width} height={resolvedHeight} style={style}>
        <G opacity={.25}><Path d="M0 204 Q50 194 100 200 Q150 206 200 194 Q250 182 300 188" fill="none" stroke="#7CA4B8" strokeWidth="1.6" strokeLinecap="round"/><Path d="M0 216 Q50 208 102 213 Q152 218 200 208 Q250 198 300 202" fill="none" stroke="#7CA4B8" strokeWidth="1.1" strokeLinecap="round" opacity={.7}/><Path d="M0 226 Q50 220 102 224 Q152 228 200 220 Q250 212 300 215" fill="none" stroke="#7CA4B8" strokeWidth=".7" strokeLinecap="round" opacity={.45}/></G>
        <Path d="M58 198 Q40 174 38 148 Q36 124 48 102 Q60 80 78 74 Q96 68 110 82 Q124 96 126 122 Q128 148 114 174 Q102 196 82 204Z" fill="#7A9E8E" opacity={.85}/>
        <Ellipse cx="80" cy="66" rx="20" ry="24" fill="none" stroke="#2C2C2A" strokeWidth="1"/>
        <Path d="M66 54 Q76 44 82 42 Q88 40 92 48" fill="none" stroke="#2C2C2A" strokeWidth=".9" strokeLinecap="round" opacity={.6}/>
        <Path d="M242 198 Q260 174 262 148 Q264 124 252 102 Q240 80 222 74 Q204 68 190 82 Q176 96 174 122 Q172 148 186 174 Q198 196 218 204Z" fill="#B5593A" opacity={.82}/>
        <G opacity={.2} stroke="#F2EDE4" strokeWidth="2.5" strokeLinecap="round"><Path d="M176 118 Q206 112 260 116"/><Path d="M174 132 Q205 127 261 130"/><Path d="M175 146 Q205 141 260 144"/></G>
        <Ellipse cx="220" cy="66" rx="20" ry="24" fill="none" stroke="#2C2C2A" strokeWidth="1"/>
        <Path d="M208 54 Q216 44 222 42 Q228 40 232 48" fill="none" stroke="#2C2C2A" strokeWidth=".9" strokeLinecap="round" opacity={.6}/>
        <Path d="M126 138 Q150 130 174 138" fill="none" stroke="#C8923A" strokeWidth="1.2" strokeDasharray="4 3"/>
        <G>
          <Line x1="150" y1="122" x2="150" y2="78" stroke="#2C2C2A" strokeWidth="1" opacity={.45}/>
          <Path d="M150 78 Q154 68 158 78 Q154 88 150 78Z" fill="#1E3A52" opacity={.75}/>
          <Path d="M150 78 Q146 70 142 78 Q146 86 150 78Z" fill="#1E3A52" opacity={.55}/>
          <Path d="M146 86 Q138 82 136 88 Q142 90 146 86Z" fill="#7A9E8E" opacity={.4}/>
          <Path d="M154 82 Q162 78 164 84 Q158 86 154 82Z" fill="#7A9E8E" opacity={.38}/>
        </G>
        <Rect x="30" y="14" width="240" height="22" rx="5" fill="#7A9E8E" opacity={.2}/>
        <SvgText x="150" y="31" textAnchor="middle" fontSize="16" fill="#2A5040" opacity={.8} fontFamily="Georgia,serif">{"secure + secure · grounded resonance"}</SvgText>
        <SvgText x="150" y="232" textAnchor="middle" fontFamily="Georgia,serif" fontSize="15" letterSpacing="2" fill="#2C2C2A" opacity={.5}>{"PAIRING 1 · GROUNDED RESONANCE"}</SvgText>
      </Svg>
    </View>
  );
}
