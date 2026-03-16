/*
 * TENDER ILLUSTRATION — portal-snapshot
 * Portal snapshot — 3 orbs: vitality/resonance/coping + shared strengths
 * ViewBox: 0 0 340 280
 */
import React from 'react';
import { View, ViewStyle } from 'react-native';
import Svg, { Path, Ellipse, Circle, Rect, Line, G, Text as SvgText } from 'react-native-svg';
import { useWebSvgAnim } from '../hooks/useIllustrationAnimation';

interface Props { width?: number; height?: number; animated?: boolean; style?: ViewStyle; }

export function IllustrationPortalSnapshot({ width = 340, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (280 / 340));
  const containerId = useWebSvgAnim([
    { selector: 'circle[cx="120"]', animation: 'tender-breathe 5s ease-in-out infinite', origin: '120px 100px', all: true },
    { selector: 'circle[cx="220"]', animation: 'tender-breathe 5s ease-in-out infinite -2.5s', origin: '220px 100px', all: true },
    { selector: 'path[fill="#C8923A"]', animation: 'tender-glow 4s ease-in-out infinite' },
    { selector: 'path[stroke="#C8923A"]', animation: 'tender-pulse 3s ease-in-out infinite' },
    { selector: 'circle[cx="110"]', animation: 'tender-pulse 2.5s ease-in-out infinite' },
    { selector: 'circle[cx="170"]', animation: 'tender-pulse 2.5s ease-in-out infinite -0.8s' },
    { selector: 'circle[cx="230"]', animation: 'tender-pulse 2.5s ease-in-out infinite -1.5s' },
  ], animated);

  return (
    <View nativeID={containerId}>
      <Svg viewBox="0 0 340 280" width={width} height={resolvedHeight} style={style}>
        {/* Two overlapping circles */}
        <Circle cx="120" cy="100" r="56" fill="none" stroke="#D4909A" strokeWidth=".6" opacity={.2}/>
        <Circle cx="120" cy="100" r="42" fill="#D4909A" opacity={.07}/>
        <Circle cx="220" cy="100" r="56" fill="none" stroke="#1E3A52" strokeWidth=".6" opacity={.2}/>
        <Circle cx="220" cy="100" r="42" fill="#1E3A52" opacity={.06}/>
        {/* Vesica */}
        <Path d="M170 48 Q190 70 190 100 Q190 130 170 152 Q150 130 150 100 Q150 70 170 48Z" fill="#C8923A" opacity={.1}/>
        <Path d="M170 48 Q190 70 190 100 Q190 130 170 152 Q150 130 150 100 Q150 70 170 48Z" fill="none" stroke="#C8923A" strokeWidth=".8" opacity={.45}/>
        {/* 3 orbs — spread apart */}
        <Circle cx="110" cy="176" r="10" fill="#C8923A" opacity={.6}/>
        <SvgText x="110" y="200" textAnchor="middle" fontSize="14" fill="#C8923A" opacity={.85} fontFamily="Georgia,serif">vitality</SvgText>
        <Circle cx="170" cy="172" r="14" fill="#7A9E8E" opacity={.55}/>
        <SvgText x="170" y="200" textAnchor="middle" fontSize="14" fill="#2A5040" opacity={.85} fontFamily="Georgia,serif">resonance</SvgText>
        <Circle cx="230" cy="176" r="10" fill="#7CA4B8" opacity={.5}/>
        <SvgText x="230" y="200" textAnchor="middle" fontSize="14" fill="#1E3A52" opacity={.85} fontFamily="Georgia,serif">coping</SvgText>
        {/* Shared strengths banner */}
        <Rect x="20" y="14" width="300" height="22" rx="5" fill="#7A9E8E" opacity={.15}/>
        <SvgText x="170" y="31" textAnchor="middle" fontSize="14" fill="#2A5040" opacity={.85} fontFamily="Georgia,serif">{"shared strengths: depth \u00B7 loyalty \u00B7 intensity"}</SvgText>
        {/* Story text */}
        <SvgText x="170" y="224" textAnchor="middle" fontSize="13" fill="#8B7355" opacity={.65} fontFamily="Georgia,serif">your story: two people who feel deeply, whose</SvgText>
        <SvgText x="170" y="242" textAnchor="middle" fontSize="13" fill="#8B7355" opacity={.65} fontFamily="Georgia,serif">longing for closeness keeps teaching them how.</SvgText>
        <SvgText x="170" y="268" textAnchor="middle" fontFamily="Georgia,serif" fontSize="13" letterSpacing="2" fill="#2C2C2A" opacity={.5}>YOUR RELATIONSHIP IN 60 SECONDS</SvgText>
      </Svg>
    </View>
  );
}
