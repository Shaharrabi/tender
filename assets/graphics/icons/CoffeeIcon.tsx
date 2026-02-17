import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { IconProps } from './types';

export default function CoffeeIcon({ size = 24, color = '#2D2226' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3.5 10h13v6.5c0 2.5-2 4.5-4.5 4.5H8c-2.5 0-4.5-2-4.5-4.5V10z"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16.5 11h1.5c1.4 0 2.5 1.1 2.5 2.5S19.4 16 18 16h-1.5"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7 3c.2.8.2 1.8 0 3M10 3c.2.8.2 1.8 0 3M13 3c.2.8.2 1.8 0 3"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
