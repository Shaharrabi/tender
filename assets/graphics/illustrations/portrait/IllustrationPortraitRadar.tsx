/*
 * TENDER ILLUSTRATION — portrait-radar
 * Portrait — pentagon radar chart + cross-assessment synthesis card
 * ViewBox: 0 0 460 280
 */
import React from 'react';
import { View, ViewStyle } from 'react-native';
import Svg, { Path, Ellipse, Circle, Rect, Line, Polygon, G, Text as SvgText } from 'react-native-svg';
import { useWebSvgAnim } from '../hooks/useIllustrationAnimation';

interface Props { width?: number; height?: number; animated?: boolean; style?: ViewStyle; }

export function IllustrationPortraitRadar({ width = 460, height, animated = true, style }: Props) {
  const resolvedHeight = height ?? Math.round(width * (280 / 460));
  const containerId = useWebSvgAnim([
    { selector: 'polygon[fill="#C8923A"]', animation: 'tender-breathe 6s ease-in-out infinite', origin: '140px 86px' },
    { selector: 'polygon[stroke="#C8923A"]', animation: 'tender-pulse 4s ease-in-out infinite' },
  ], animated);

  return (
    <View nativeID={containerId}>
      <Svg viewBox="0 0 460 280" width={width} height={resolvedHeight} style={style}>
        <Polygon points="140,30 196,70 176,136 104,136 84,70" fill="none" stroke="#D6CEBF" strokeWidth=".8" opacity={0.6}/>
        <Polygon points="140,52 174,80 162,122 118,122 106,80" fill="none" stroke="#D6CEBF" strokeWidth=".5" opacity={0.35}/>
        <Polygon points="140,44 182,78 168,128 112,128 98,78" fill="#C8923A" opacity={0.14}/>
        <Polygon points="140,44 182,78 168,128 112,128 98,78" fill="none" stroke="#C8923A" strokeWidth="1.1" opacity={0.55}/>
        <Circle cx="140" cy="44" r="3" fill="#C8923A" opacity={0.75}/>
        <Circle cx="182" cy="78" r="3" fill="#D4909A" opacity={0.7}/>
        <Circle cx="168" cy="128" r="3" fill="#7CA4B8" opacity={0.7}/>
        <Circle cx="112" cy="128" r="3" fill="#7A9E8E" opacity={0.7}/>
        <Circle cx="98" cy="78" r="3" fill="#6E4E6E" opacity={0.7}/>
        <SvgText x="140" y="26" textAnchor="middle" fontSize="7.5" fill="#C8923A" opacity={0.75} fontFamily="Georgia,serif">EI</SvgText>
        <SvgText x="206" y="74" fontSize="7.5" fill="#D4909A" opacity={0.7} fontFamily="Georgia,serif">attachment</SvgText>
        <SvgText x="176" y="148" fontSize="7.5" fill="#7CA4B8" opacity={0.7} fontFamily="Georgia,serif">conflict</SvgText>
        <SvgText x="74" y="148" textAnchor="end" fontSize="7.5" fill="#7A9E8E" opacity={0.7} fontFamily="Georgia,serif">values</SvgText>
        <SvgText x="84" y="74" textAnchor="end" fontSize="7.5" fill="#6E4E6E" opacity={0.7} fontFamily="Georgia,serif">differentiation</SvgText>
        <SvgText x="140" y="85" textAnchor="middle" fontSize="7" fill="#8B7355" opacity={0.4} fontFamily="Georgia,serif">your</SvgText>
        <SvgText x="140" y="96" textAnchor="middle" fontSize="7" fill="#8B7355" opacity={0.4} fontFamily="Georgia,serif">landscape</SvgText>
        <Rect x="220" y="20" width="228" height="248" rx="10" fill="#F2EDE4" stroke="#D6CEBF" strokeWidth=".7"/>
        <SvgText x="234" y="40" fontSize="7.5" letterSpacing="2" fill="#8B7355" opacity={0.5} fontFamily="-apple-system,sans-serif">SYNTHESIS CARD</SvgText>
        <Rect x="230" y="48" width="206" height="26" rx="5" fill="#D4909A" opacity={0.15}/>
        <SvgText x="238" y="62" fontSize="7.5" fill="#B5593A" opacity={0.7} fontFamily="Georgia,serif" fontWeight="500">primary dynamic</SvgText>
        <SvgText x="238" y="72" fontSize="7" fill="#8B7355" opacity={0.6} fontFamily="Georgia,serif">depth of feeling meets independence need</SvgText>
        <SvgText x="234" y="92" fontSize="7.5" fill="#8B7355" opacity={0.55} fontFamily="Georgia,serif" letterSpacing=".5">converging patterns</SvgText>
        <SvgText x="234" y="104" fontSize="7" fill="#2C2C2A" opacity={0.5} fontFamily="Georgia,serif">{"→ high O + anxious attach = rich inner world"}</SvgText>
        <SvgText x="234" y="116" fontSize="7" fill="#2C2C2A" opacity={0.5} fontFamily="Georgia,serif">{"→ values: connection + growth (aligned)"}</SvgText>
        <SvgText x="234" y="134" fontSize="7.5" fill="#8B7355" opacity={0.55} fontFamily="Georgia,serif" letterSpacing=".5">productive tensions</SvgText>
        <SvgText x="234" y="146" fontSize="7" fill="#2C2C2A" opacity={0.5} fontFamily="Georgia,serif">{"→ high EI + low differentiation: you"}</SvgText>
        <SvgText x="234" y="156" fontSize="7" fill="#2C2C2A" opacity={0.5} fontFamily="Georgia,serif">{"   feel everything and lose the ground"}</SvgText>
        <Rect x="230" y="166" width="206" height="22" rx="5" fill="#7A9E8E" opacity={0.13}/>
        <SvgText x="238" y="180" fontSize="7.5" fill="#2A5040" opacity={0.7} fontFamily="Georgia,serif">{"strengths: empathy \u00B7 emotional range \u00B7 insight"}</SvgText>
        <SvgText x="234" y="202" fontSize="7" fill="#8B7355" opacity={0.45} fontFamily="Georgia,serif" letterSpacing=".5">growth ceiling factor</SvgText>
        <Rect x="234" y="208" width="180" height="4" rx="2" fill="#D6CEBF"/><Rect x="234" y="208" width="144" height="4" rx="2" fill="#C8923A" opacity={0.55}/>
        <SvgText x="234" y="224" fontSize="7" fill="#8B7355" opacity={0.4} fontFamily="Georgia,serif">{"0.8\u00D7 scaling applied \u2014 real growth room here"}</SvgText>
        <Rect x="230" y="234" width="206" height="24" rx="5" fill="#1E3A52" opacity={0.07}/>
        <SvgText x="238" y="248" fontSize="7" fill="#1E3A52" opacity={0.65} fontFamily="Georgia,serif">Nuance sees this pattern and coaches toward</SvgText>
        <SvgText x="238" y="258" fontSize="7" fill="#1E3A52" opacity={0.5} fontFamily="Georgia,serif">self-soothing before reaching</SvgText>
        <SvgText x="230" y="274" textAnchor="middle" fontFamily="Georgia,serif" fontSize="8.5" letterSpacing="3" fill="#2C2C2A" opacity={0.4}>RADAR + SYNTHESIS CARD</SvgText>
      </Svg>
    </View>
  );
}
