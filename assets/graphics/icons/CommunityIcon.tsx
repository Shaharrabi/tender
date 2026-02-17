import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import type { IconProps } from './types';

export default function CommunityIcon({ size = 24, color = '#2D2226' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Center person — head */}
      <Circle
        cx={12}
        cy={5}
        r={2.2}
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Center person — body */}
      <Path
        d="M7.5 20c.2-2.8.8-5 1.8-6.5C10.2 12 11 11 12 10.5c1 .5 1.8 1.5 2.7 3 1 1.5 1.6 3.7 1.8 6.5"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Left person — head */}
      <Circle
        cx={5.5}
        cy={8}
        r={1.8}
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Left person — body */}
      <Path
        d="M2 20c.2-2.2.6-4 1.3-5.2.7-1.2 1.4-2 2.2-2.5.6.3 1.2 1 1.8 2"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right person — head */}
      <Circle
        cx={18.5}
        cy={8}
        r={1.8}
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right person — body */}
      <Path
        d="M22 20c-.2-2.2-.6-4-1.3-5.2-.7-1.2-1.4-2-2.2-2.5-.6.3-1.2 1-1.8 2"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
