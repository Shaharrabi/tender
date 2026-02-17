import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { IconProps } from './types';

export default function HeartDoubleIcon({ size = 24, color = '#2D2226' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Back heart (slightly offset left and up) */}
      <Path
        d="M10 19.5c-.4-.3-7-5-7-9.5 0-2.8 2-5 4.5-5 1.3 0 2.5.6 2.8 1.5.2-.9 1.4-1.5 2.7-1.5 2.5 0 4.5 2.2 4.5 5 0 4.5-6.6 9.2-7 9.5z"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.4}
      />
      {/* Front heart (slightly offset right and down) */}
      <Path
        d="M14 21.5c-.4-.3-7.5-5.5-7.5-10 0-2.8 2-5 4.5-5 1.4 0 2.6.7 3 1.6.3-1 1.5-1.6 3-1.6 2.5 0 4.5 2.2 4.5 5 0 4.5-7.1 9.7-7.5 10z"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
