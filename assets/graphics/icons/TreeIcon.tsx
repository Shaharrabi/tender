import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { IconProps } from './types';

export default function TreeIcon({ size = 24, color = '#2D2226' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Trunk */}
      <Path
        d="M11.8 21.5c.1-1.5.2-3 .3-4.5.1-1 .0-2-.1-2.8"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Canopy - organic round shape */}
      <Path
        d="M12 14.2c-1.5.2-3.2-.2-4.5-1.2-1.5-1.1-2.5-2.8-2.8-4.5-.2-1.5.2-3 1.2-4 .8-.8 1.8-1.3 3-1.5 1-.2 2.2-.1 3.2.2 1-.3 2.2-.4 3.2-.2 1.2.2 2.2.7 3 1.5 1 1 1.4 2.5 1.2 4-.3 1.7-1.3 3.4-2.8 4.5-1.3 1-3 1.4-4.5 1.2z"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Branch hints */}
      <Path
        d="M10.5 14c-.5-1.2-.3-2.5.2-3.5"
        stroke={color}
        strokeWidth={1}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M13.5 14c.5-1.2.3-2.5-.2-3.5"
        stroke={color}
        strokeWidth={1}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Ground line */}
      <Path
        d="M7 21.5c1.5-.2 3.2-.4 5-.4 1.8 0 3.5.2 5 .4"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
