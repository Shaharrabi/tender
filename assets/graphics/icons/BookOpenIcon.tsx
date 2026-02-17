import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { IconProps } from './types';

export default function BookOpenIcon({ size = 24, color = '#2D2226' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M2 4.5c2-.8 4.5-1 6.5-.5 1.2.3 2.5.8 3.5 1.5V19c-1-.6-2.2-1-3.5-1.3-2-.5-4.5-.3-6.5.5V4.5z"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M22 4.5c-2-.8-4.5-1-6.5-.5-1.2.3-2.5.8-3.5 1.5V19c1-.6 2.2-1 3.5-1.3 2-.5 4.5-.3 6.5.5V4.5z"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
