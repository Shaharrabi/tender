import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { IconProps } from './types';

export default function LeafIcon({ size = 24, color = '#2D2226' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Leaf body */}
      <Path
        d="M6.5 20.5c1.2-2.5 2.8-5.2 5.2-7.5 2.4-2.3 5-3.8 7.8-4.5 1.2-.3 1.5-.8 1.2-1.5-.4-.8-1.2-1.5-2.5-2.2-2-.9-4.5-1.2-7-.5-2.6.7-4.8 2.3-6.2 4.5-1.5 2.2-2 4.8-1.5 7.2.3 1.5.8 2.6 1.5 3.2.5.4 1 .5 1.5.3z"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Central vein */}
      <Path
        d="M6.5 20.5c1.5-3 4-6.2 7-8.5 2.2-1.7 4.5-3 7-3.5"
        stroke={color}
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Side veins */}
      <Path
        d="M9 15.5c1.5-.5 3-1.5 4.2-2.8"
        stroke={color}
        strokeWidth={1}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8 12.5c1.2-.2 2.8-1 4-2.2"
        stroke={color}
        strokeWidth={1}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Stem */}
      <Path
        d="M6.5 20.5c-1 .8-2.2 1.2-3.2 1"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
