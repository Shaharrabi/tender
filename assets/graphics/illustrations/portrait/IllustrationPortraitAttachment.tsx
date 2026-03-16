/*
 * TENDER ILLUSTRATION — portrait-attachment
 * Portrait — large attachment style body + score bars + growth edge strip
 * ViewBox: 0 0 460 340
 */
import React from 'react';
import { View, ViewStyle } from 'react-native';
import Svg, { Path, Ellipse, Circle, Rect, Line, G, Text as SvgText } from 'react-native-svg';
import ReAnimated from 'react-native-reanimated';
import { useBreathe, useWebSvgAnim } from '../hooks/useIllustrationAnimation';

interface Props { width?: number; height?: number; animated?: boolean; style?: ViewStyle; }

export function IllustrationPortraitAttachment({ width = 460, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (340 / 460));
  const animStyle = useBreathe(5500);
  const containerId = useWebSvgAnim([
    { selector: 'path[fill="#D4909A"]', animation: 'tender-breathe 5.5s ease-in-out infinite', origin: '102px 175px' },
    { selector: 'path[fill="#D4909A"][opacity="0.8"]', animation: 'tender-pulse 2s ease-in-out infinite', origin: '192px 144px', parent: true },
  ], animated);

  const svgContent = (
    <Svg viewBox="0 0 460 340" width={width} height={resolvedHeight} style={style}>
      <Path d="M72 256 Q50 226 48 192 Q46 160 60 130 Q74 100 96 90 Q118 80 136 94 Q154 108 156 140 Q158 172 142 208 Q126 242 102 260Z" fill="#D4909A" opacity={0.82}/>
      <G opacity={0.2} stroke="#F2EDE4" strokeWidth="3" strokeLinecap="round">
        <Path d="M50 140 Q98 132 154 138"/><Path d="M48 156 Q97 149 155 154"/><Path d="M48 172 Q97 166 154 170"/><Path d="M49 188 Q97 182 152 186"/><Path d="M51 204 Q97 198 150 202"/>
      </G>
      <Ellipse cx="100" cy="78" rx="26" ry="30" fill="none" stroke="#2C2C2A" strokeWidth="1.1" rotation={5} origin="100, 78"/>
      <Path d="M82 64 Q92 52 102 50 Q112 48 118 58" fill="none" stroke="#2C2C2A" strokeWidth="1" strokeLinecap="round" opacity={0.65}/>
      <G><Path d="M189 144 Q193 137 198 144 Q193 152 189 144Z" fill="#D4909A" opacity={0.8}/></G>
      <Rect x="210" y="28" width="235" height="34" rx="10" fill="#D4909A" opacity={0.18}/>
      <SvgText x="222" y="52" fontSize="18" fill="#B5593A" opacity={0.85} fontFamily="Georgia,serif" fontStyle="italic">Anxious-Preoccupied</SvgText>
      <SvgText x="210" y="78" fontSize="12" fill="#8B7355" opacity={0.55} fontFamily="Georgia,serif">you tend to move toward</SvgText>
      <SvgText x="210" y="93" fontSize="12" fill="#8B7355" opacity={0.55} fontFamily="Georgia,serif">connection under stress</SvgText>
      <G opacity={0.75}>
        <SvgText x="210" y="118" fontSize="11" fill="#8B7355" fontFamily="Georgia,serif" letterSpacing=".5">regulation</SvgText>
        <Rect x="210" y="124" width="220" height="5" rx="2.5" fill="#D6CEBF"/><Rect x="210" y="124" width="142" height="5" rx="2.5" fill="#D4909A" opacity={0.7}/>
        <SvgText x="210" y="146" fontSize="11" fill="#8B7355" fontFamily="Georgia,serif" letterSpacing=".5">emotional intelligence</SvgText>
        <Rect x="210" y="152" width="220" height="5" rx="2.5" fill="#D6CEBF"/><Rect x="210" y="152" width="178" height="5" rx="2.5" fill="#C8923A" opacity={0.65}/>
        <SvgText x="210" y="174" fontSize="11" fill="#8B7355" fontFamily="Georgia,serif" letterSpacing=".5">conflict flexibility</SvgText>
        <Rect x="210" y="180" width="220" height="5" rx="2.5" fill="#D6CEBF"/><Rect x="210" y="180" width="110" height="5" rx="2.5" fill="#7A9E8E" opacity={0.7}/>
        <SvgText x="210" y="202" fontSize="11" fill="#8B7355" fontFamily="Georgia,serif" letterSpacing=".5">differentiation</SvgText>
        <Rect x="210" y="208" width="220" height="5" rx="2.5" fill="#D6CEBF"/><Rect x="210" y="208" width="88" height="5" rx="2.5" fill="#7CA4B8" opacity={0.65}/>
        <SvgText x="210" y="230" fontSize="11" fill="#8B7355" fontFamily="Georgia,serif" letterSpacing=".5">values congruence</SvgText>
        <Rect x="210" y="236" width="220" height="5" rx="2.5" fill="#D6CEBF"/><Rect x="210" y="236" width="160" height="5" rx="2.5" fill="#6E4E6E" opacity={0.6}/>
        <SvgText x="210" y="258" fontSize="11" fill="#8B7355" fontFamily="Georgia,serif" letterSpacing=".5">window width</SvgText>
        <Rect x="210" y="264" width="220" height="5" rx="2.5" fill="#D6CEBF"/><Rect x="210" y="264" width="124" height="5" rx="2.5" fill="#B5593A" opacity={0.6}/>
      </G>
      <Rect x="210" y="280" width="235" height="22" rx="6" fill="#C8923A" opacity={0.12}/>
      <SvgText x="218" y="296" fontSize="10" fill="#C8923A" opacity={0.7} fontFamily="Georgia,serif">growing edge: learning to wait before reaching</SvgText>
      <SvgText x="230" y="325" textAnchor="middle" fontFamily="Georgia,serif" fontSize="11" letterSpacing="3" fill="#2C2C2A" opacity={0.4}>YOUR PORTRAIT</SvgText>
    </Svg>
  );

  return (
    <View nativeID={containerId}>
      {animated ? <ReAnimated.View style={animStyle}>{svgContent}</ReAnimated.View> : svgContent}
    </View>
  );
}
