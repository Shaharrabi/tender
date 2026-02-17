import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import type { IconProps } from './types';

export default function PersonIcon({ size = 24, color = '#2D2226' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Head */}
      <Circle
        cx={12}
        cy={6}
        r={3}
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Body — torso widening to shoulders */}
      <Path
        d="M5.5 21c.3-3.5 1-6.5 2.2-8.5C8.8 10.8 10.2 9.8 12 9.8s3.2 1 4.3 2.7c1.2 2 1.9 5 2.2 8.5"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
