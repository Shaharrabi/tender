import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { IconProps } from './types';

export default function WindIcon({ size = 24, color = '#2D2226' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Top flowing line - curves up at end */}
      <Path
        d="M3 7.5c2-.3 4.2-.1 6.5.2 2 .3 4 .3 5.8-.2 1.2-.3 2.2-1 2.8-1.8.5-.7.5-1.5 0-2-.5-.4-1.2-.3-1.8.2"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Middle flowing line - longest */}
      <Path
        d="M2 12.5c2.5-.2 5-.1 7.5.2 2.5.3 5 .4 7.5.1 1.5-.2 2.8-.6 3.8-1.2.8-.5 1-1.2.5-1.8-.5-.5-1.3-.4-2 .1"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Bottom flowing line - curves down at end */}
      <Path
        d="M4.5 17.5c1.8-.2 3.5-.1 5.2.1 1.8.2 3.5.2 5-.1 1-.2 1.8-.6 2.3-1.2.4-.5.3-1-.2-1.3-.5-.3-1.1-.1-1.5.4"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
