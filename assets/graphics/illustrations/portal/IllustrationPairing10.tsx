/*
 * TENDER ILLUSTRATION — portal-pairing10
 * Pairing 10 — Fearful+Fearful — shared volatility, want/fear arrows
 * ViewBox: 0 0 460 240
 */
import React from 'react';
import { View, ViewStyle } from 'react-native';
import Svg, { Path, Ellipse, Circle, Rect, Line, G, Text as SvgText } from 'react-native-svg';
import { useWebSvgAnim } from '../hooks/useIllustrationAnimation';

interface Props { width?: number; height?: number; animated?: boolean; style?: ViewStyle; }

export function IllustrationPairing10({ width = 460, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (240 / 460));
  const containerId = useWebSvgAnim([
    { selector: 'path[fill="#6E4E6E"]', animation: 'tender-breathe 4.5s ease-in-out infinite', origin: '98px 138px' },
    { selector: 'path[fill="#C8923A"]', animation: 'tender-breathe 4.5s ease-in-out infinite -2s', origin: '288px 138px' },
    { selector: 'path[stroke="#6E4E6E"]', animation: 'tender-float 2.5s ease-in-out infinite', all: true },
    { selector: 'ellipse[cx="193"]', animation: 'tender-pulse 3s ease-in-out infinite' },
  ], animated);

  return (
    <View nativeID={containerId}>
      <Svg viewBox="0 0 460 240" width={width} height={resolvedHeight} style={style}>
        <G opacity={.18}><Path d="M0 200 Q60 188 120 196 Q180 204 240 190 Q320 174 400 186 Q430 192 460 188" fill="none" stroke="#7CA4B8" strokeWidth="1.4" strokeLinecap="round"/><Path d="M0 214 Q60 204 122 210 Q182 216 240 204 Q320 190 400 200 Q432 206 460 202" fill="none" stroke="#7CA4B8" strokeWidth=".9" strokeLinecap="round" opacity={.6}/></G>
        <Path d="M76 198 Q56 174 54 148 Q52 124 64 102 Q76 80 94 74 Q112 68 126 82 Q140 96 142 122 Q144 148 128 174 Q114 196 94 204Z" fill="#6E4E6E" opacity={.82}/>
        <Ellipse cx="96" cy="66" rx="20" ry="24" fill="none" stroke="#2C2C2A" strokeWidth="1"/>
        <Path d="M82 54 Q92 44 98 42 Q104 40 108 48" fill="none" stroke="#2C2C2A" strokeWidth=".9" strokeLinecap="round" opacity={.6}/>
        <Path d="M118 130 Q126 124 132 128" fill="none" stroke="#6E4E6E" strokeWidth="3" strokeLinecap="round" opacity={.5}/>
        <Path d="M126 142 Q118 148 114 144" fill="none" stroke="#6E4E6E" strokeWidth="3" strokeLinecap="round" opacity={.4}/>
        <Path d="M310 198 Q330 174 332 148 Q334 124 322 102 Q310 80 292 74 Q274 68 260 82 Q246 96 244 122 Q242 148 258 174 Q272 196 292 204Z" fill="#C8923A" opacity={.78}/>
        <Ellipse cx="290" cy="66" rx="20" ry="24" fill="none" stroke="#2C2C2A" strokeWidth="1"/>
        <Path d="M278 54 Q286 44 292 42 Q298 40 302 48" fill="none" stroke="#2C2C2A" strokeWidth=".9" strokeLinecap="round" opacity={.6}/>
        <Ellipse cx="193" cy="138" rx="28" ry="34" fill="none" stroke="#C8923A" strokeWidth=".6" strokeDasharray="3 5" opacity={.4}/>
        <SvgText x="193" y="134" textAnchor="middle" fontSize="7" fill="#8B7355" opacity={.45} fontFamily="Georgia,serif">want closeness</SvgText>
        <SvgText x="193" y="146" textAnchor="middle" fontSize="7" fill="#8B7355" opacity={.4} fontFamily="Georgia,serif">fear closeness</SvgText>
        <SvgText x="370" y="26" fontSize="7.5" fill="#8B7355" opacity={.4} fontFamily="Georgia,serif">{"14 of 16 pairings available →"}</SvgText>
        <Rect x="370" y="32" width="68" height="4" rx="2" fill="#D6CEBF"/><Rect x="370" y="32" width="60" height="4" rx="2" fill="#6E4E6E" opacity={.5}/>
        <Rect x="130" y="18" width="126" height="15" rx="5" fill="#6E4E6E" opacity={.15}/>
        <SvgText x="193" y="28" textAnchor="middle" fontSize="7.5" fill="#6E4E6E" opacity={.7} fontFamily="Georgia,serif">fearful-avoidant + fearful-avoidant</SvgText>
        <SvgText x="230" y="230" textAnchor="middle" fontFamily="Georgia,serif" fontSize="7.5" letterSpacing="2" fill="#2C2C2A" opacity={.4}>{"PAIRING 10 · SHARED VOLATILITY"}</SvgText>
      </Svg>
    </View>
  );
}
