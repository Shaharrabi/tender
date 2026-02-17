import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { IconProps } from './types';

export default function SeedlingIcon({ size = 24, color = '#2D2226' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Ground line */}
      <Path
        d="M4.5 19.5c1.2-.3 3.8-.6 7.5-.5 3.7.1 6.3.4 7.5.5"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Stem */}
      <Path
        d="M12 19.5c-.1-2.2.1-4.5.2-6.8.1-1.3.0-2.5-.2-3.7"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Left leaf */}
      <Path
        d="M12 12.5c-1.2-.8-2.8-1.6-4.5-1.2-1.8.4-2.6 1.8-2.2 3.1.4 1.2 1.8 1.6 3.2 1.2 1.5-.5 2.7-1.7 3.5-3.1z"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right leaf */}
      <Path
        d="M12 9c1.1-.9 2.6-1.8 4.3-1.5 1.8.3 2.7 1.7 2.4 3-.3 1.3-1.7 1.7-3.1 1.4-1.5-.4-2.8-1.5-3.6-2.9z"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Left leaf vein */}
      <Path
        d="M12 12.5c-1.1-.2-2.3.1-3.4.8"
        stroke={color}
        strokeWidth={1}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right leaf vein */}
      <Path
        d="M12 9c1-.3 2.2 0 3.3.6"
        stroke={color}
        strokeWidth={1}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
