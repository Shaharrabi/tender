import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import type { IconProps } from './types';

export default function CoupleIcon({ size = 24, color = '#2D2226' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Left person — head */}
      <Circle
        cx={8.5}
        cy={5.5}
        r={2.3}
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Left person — body */}
      <Path
        d="M4 20.5c.2-3 .8-5.5 1.8-7.2C6.8 11.5 7.8 10.5 8.5 10c.7.5 1.7 1.5 2.7 3.3.5.9.9 2 1.2 3.2"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right person — head */}
      <Circle
        cx={15.5}
        cy={5.5}
        r={2.3}
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right person — body */}
      <Path
        d="M20 20.5c-.2-3-.8-5.5-1.8-7.2-1-1.8-2-2.8-2.7-3.3-.7.5-1.7 1.5-2.7 3.3-.5.9-.9 2-1.2 3.2"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
