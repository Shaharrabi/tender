import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { IconProps } from './types';

export default function MoonIcon({ size = 24, color = '#2D2226' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Crescent moon - organic hand-drawn curve */}
      <Path
        d="M18.5 13.5c-.8 2-2.2 3.6-4 4.5-1.8.9-3.8 1.2-5.8.7-2-.5-3.6-1.7-4.7-3.3-1.1-1.7-1.5-3.6-1.2-5.6.3-2 1.3-3.7 2.8-4.8 1.5-1.2 3.3-1.7 5.2-1.5-.8 1.2-1.2 2.7-1 4.2.2 1.8 1 3.3 2.3 4.5 1.3 1.1 2.8 1.7 4.5 1.8.7.0 1.3-.1 1.9-.3z"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Small star accent */}
      <Path
        d="M18 5.5c.0-.5.2-.8.5-.8.3 0 .5.3.5.8.0.5-.2.8-.5.8-.3 0-.5-.3-.5-.8z"
        stroke={color}
        strokeWidth={1}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Tiny star */}
      <Path
        d="M20.5 8.5c0-.3.1-.5.3-.5.2 0 .3.2.3.5 0 .3-.1.5-.3.5-.2 0-.3-.2-.3-.5z"
        stroke={color}
        strokeWidth={1}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
