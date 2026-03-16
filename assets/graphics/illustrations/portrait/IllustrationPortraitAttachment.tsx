/*
 * TENDER ILLUSTRATION — portrait-attachment
 * Portrait — large attachment style body + score bars + growth edge strip
 * ViewBox: 0 0 460 280
 */
import React from 'react';
import { View, ViewStyle } from 'react-native';
import Svg, { Path, Ellipse, Circle, Rect, Line, G, Text as SvgText } from 'react-native-svg';
import ReAnimated from 'react-native-reanimated';
import { useBreathe, useWebSvgAnim } from '../hooks/useIllustrationAnimation';

interface Props { width?: number; height?: number; animated?: boolean; style?: ViewStyle; }

export function IllustrationPortraitAttachment({ width = 460, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (280 / 460));
  const animStyle = useBreathe(5500);
  const containerId = useWebSvgAnim([
    { selector: 'path[fill="#D4909A"]', animation: 'tender-breathe 5.5s ease-in-out infinite', origin: '102px 175px' },
    { selector: 'path[fill="#D4909A"][opacity="0.8"]', animation: 'tender-pulse 2s ease-in-out infinite', origin: '192px 144px', parent: true },
  ], animated);

  const svgContent = (
    <Svg viewBox="0 0 460 280" width={width} height={resolvedHeight} style={style}>
      <Path d="M72 256 Q50 226 48 192 Q46 160 60 130 Q74 100 96 90 Q118 80 136 94 Q154 108 156 140 Q158 172 142 208 Q126 242 102 260Z" fill="#D4909A" opacity={0.82}/>
      <G opacity={0.2} stroke="#F2EDE4" strokeWidth="3" strokeLinecap="round">
        <Path d="M50 140 Q98 132 154 138"/><Path d="M48 156 Q97 149 155 154"/><Path d="M48 172 Q97 166 154 170"/><Path d="M49 188 Q97 182 152 186"/><Path d="M51 204 Q97 198 150 202"/>
      </G>
      <Ellipse cx="100" cy="78" rx="26" ry="30" fill="none" stroke="#2C2C2A" strokeWidth="1.1" rotation={5} origin="100, 78"/>
      <Path d="M82 64 Q92 52 102 50 Q112 48 118 58" fill="none" stroke="#2C2C2A" strokeWidth="1" strokeLinecap="round" opacity={0.65}/>
      <G><Path d="M189 144 Q193 137 198 144 Q193 152 189 144Z" fill="#D4909A" opacity={0.8}/></G>
      <Rect x="210" y="30" width="230" height="28" rx="8" fill="#D4909A" opacity={0.18}/>
      <SvgText x="225" y="48" fontSize="13" fill="#B5593A" opacity={0.85} fontFamily="Georgia,serif" fontStyle="italic">Anxious-Preoccupied</SvgText>
      <SvgText x="210" y="76" fontSize="8" fill="#8B7355" opacity={0.55} fontFamily="Georgia,serif">you tend to move toward</SvgText>
      <SvgText x="210" y="88" fontSize="8" fill="#8B7355" opacity={0.55} fontFamily="Georgia,serif">connection under stress</SvgText>
      <G opacity={0.75}>
        <SvgText x="210" y="112" fontSize="7.5" fill="#8B7355" fontFamily="Georgia,serif" letterSpacing=".8">regulation</SvgText>
        <Rect x="210" y="118" width="220" height="4" rx="2" fill="#D6CEBF"/><Rect x="210" y="118" width="142" height="4" rx="2" fill="#D4909A" opacity={0.7}/>
        <SvgText x="210" y="136" fontSize="7.5" fill="#8B7355" fontFamily="Georgia,serif" letterSpacing=".8">emotional intelligence</SvgText>
        <Rect x="210" y="142" width="220" height="4" rx="2" fill="#D6CEBF"/><Rect x="210" y="142" width="178" height="4" rx="2" fill="#C8923A" opacity={0.65}/>
        <SvgText x="210" y="160" fontSize="7.5" fill="#8B7355" fontFamily="Georgia,serif" letterSpacing=".8">conflict flexibility</SvgText>
        <Rect x="210" y="166" width="220" height="4" rx="2" fill="#D6CEBF"/><Rect x="210" y="166" width="110" height="4" rx="2" fill="#7A9E8E" opacity={0.7}/>
        <SvgText x="210" y="184" fontSize="7.5" fill="#8B7355" fontFamily="Georgia,serif" letterSpacing=".8">differentiation</SvgText>
        <Rect x="210" y="190" width="220" height="4" rx="2" fill="#D6CEBF"/><Rect x="210" y="190" width="88" height="4" rx="2" fill="#7CA4B8" opacity={0.65}/>
        <SvgText x="210" y="208" fontSize="7.5" fill="#8B7355" fontFamily="Georgia,serif" letterSpacing=".8">values congruence</SvgText>
        <Rect x="210" y="214" width="220" height="4" rx="2" fill="#D6CEBF"/><Rect x="210" y="214" width="160" height="4" rx="2" fill="#6E4E6E" opacity={0.6}/>
        <SvgText x="210" y="232" fontSize="7.5" fill="#8B7355" fontFamily="Georgia,serif" letterSpacing=".8">window width</SvgText>
        <Rect x="210" y="238" width="220" height="4" rx="2" fill="#D6CEBF"/><Rect x="210" y="238" width="124" height="4" rx="2" fill="#B5593A" opacity={0.6}/>
      </G>
      <Rect x="210" y="252" width="230" height="16" rx="5" fill="#C8923A" opacity={0.12}/>
      <SvgText x="218" y="263" fontSize="7" fill="#C8923A" opacity={0.7} fontFamily="Georgia,serif">growing edge: learning to wait before reaching</SvgText>
      <SvgText x="230" y="274" textAnchor="middle" fontFamily="Georgia,serif" fontSize="8.5" letterSpacing="3" fill="#2C2C2A" opacity={0.4}>YOUR PORTRAIT</SvgText>
    </Svg>
  );

  return (
    <View nativeID={containerId}>
      {animated ? <ReAnimated.View style={animStyle}>{svgContent}</ReAnimated.View> : svgContent}
    </View>
  );
}
