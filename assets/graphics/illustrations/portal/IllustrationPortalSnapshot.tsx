/*
 * TENDER ILLUSTRATION — portal-snapshot
 * Portal snapshot — 3 orbs: vitality/resonance/coping + shared strengths
 * ViewBox: 0 0 300 240
 */
import React from 'react';
import { View, ViewStyle } from 'react-native';
import Svg, { Path, Ellipse, Circle, Rect, Line, G, Text as SvgText } from 'react-native-svg';
import { useWebSvgAnim } from '../hooks/useIllustrationAnimation';

interface Props { width?: number; height?: number; animated?: boolean; style?: ViewStyle; }

export function IllustrationPortalSnapshot({ width = 300, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (240 / 300));
  const containerId = useWebSvgAnim([
    { selector: 'circle[cx="104"]', animation: 'tender-breathe 5s ease-in-out infinite', origin: '104px 110px', all: true },
    { selector: 'circle[cx="196"]', animation: 'tender-breathe 5s ease-in-out infinite -2.5s', origin: '196px 110px', all: true },
    { selector: 'path[fill="#C8923A"]', animation: 'tender-glow 4s ease-in-out infinite' },
    { selector: 'path[stroke="#C8923A"]', animation: 'tender-pulse 3s ease-in-out infinite' },
    { selector: 'circle[cx="126"]', animation: 'tender-pulse 2.5s ease-in-out infinite' },
    { selector: 'circle[cx="150"]', animation: 'tender-pulse 2.5s ease-in-out infinite -0.8s' },
    { selector: 'circle[cx="174"]', animation: 'tender-pulse 2.5s ease-in-out infinite -1.5s' },
  ], animated);

  return (
    <View nativeID={containerId}>
      <Svg viewBox="0 0 300 240" width={width} height={resolvedHeight} style={style}>
        <Circle cx="104" cy="110" r="56" fill="none" stroke="#D4909A" strokeWidth=".6" opacity={.2}/>
        <Circle cx="104" cy="110" r="42" fill="#D4909A" opacity={.07}/>
        <Circle cx="196" cy="110" r="56" fill="none" stroke="#1E3A52" strokeWidth=".6" opacity={.2}/>
        <Circle cx="196" cy="110" r="42" fill="#1E3A52" opacity={.06}/>
        <Path d="M150 58 Q170 80 170 110 Q170 140 150 162 Q130 140 130 110 Q130 80 150 58Z" fill="#C8923A" opacity={.1}/>
        <Path d="M150 58 Q170 80 170 110 Q170 140 150 162 Q130 140 130 110 Q130 80 150 58Z" fill="none" stroke="#C8923A" strokeWidth=".8" opacity={.45}/>
        <Circle cx="126" cy="182" r="10" fill="#C8923A" opacity={.6}/>
        <SvgText x="126" y="200" textAnchor="middle" fontSize="6.5" fill="#C8923A" opacity={.65} fontFamily="Georgia,serif">vitality</SvgText>
        <Circle cx="150" cy="178" r="14" fill="#7A9E8E" opacity={.55}/>
        <SvgText x="150" y="200" textAnchor="middle" fontSize="6.5" fill="#2A5040" opacity={.65} fontFamily="Georgia,serif">resonance</SvgText>
        <Circle cx="174" cy="182" r="10" fill="#7CA4B8" opacity={.5}/>
        <SvgText x="174" y="200" textAnchor="middle" fontSize="6.5" fill="#1E3A52" opacity={.65} fontFamily="Georgia,serif">coping</SvgText>
        <Rect x="20" y="20" width="260" height="16" rx="5" fill="#7A9E8E" opacity={.15}/>
        <SvgText x="150" y="31" textAnchor="middle" fontSize="7.5" fill="#2A5040" opacity={.65} fontFamily="Georgia,serif">{"shared strengths: depth · loyalty · intensity"}</SvgText>
        <SvgText x="20" y="220" fontSize="7" fill="#8B7355" opacity={.45} fontFamily="Georgia,serif">your story: two people who feel deeply, whose</SvgText>
        <SvgText x="20" y="230" fontSize="7" fill="#8B7355" opacity={.45} fontFamily="Georgia,serif">longing for closeness keeps teaching them how.</SvgText>
        <SvgText x="150" y="244" textAnchor="middle" fontFamily="Georgia,serif" fontSize="7.5" letterSpacing="2" fill="#2C2C2A" opacity={.4}>YOUR RELATIONSHIP IN 60 SECONDS</SvgText>
      </Svg>
    </View>
  );
}
