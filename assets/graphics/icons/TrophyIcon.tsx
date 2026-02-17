import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { IconProps } from './types';

export default function TrophyIcon({ size = 24, color = '#2D2226' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7 4h10v6c0 2.8-2.2 5-5 5s-5-2.2-5-5V4z"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7 6H4.5c-.3 0-.5.2-.5.5v1c0 2 1.3 3.5 3 3.5"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M17 6h2.5c.3 0 .5.2.5.5v1c0 2-1.3 3.5-3 3.5"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 15v2.5"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
      />
      <Path
        d="M8 20.5h8c.3 0 .5-.2.5-.5v-1c0-.8-.7-1.5-1.5-1.5h-5c-.8 0-1.5.7-1.5 1.5v1c0 .3.2.5.5.5z"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
