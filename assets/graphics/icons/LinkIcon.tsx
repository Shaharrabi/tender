import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { IconProps } from './types';

export default function LinkIcon({ size = 24, color = '#2D2226' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Left chain loop — organic oval */}
      <Path
        d="M9.5 7.5c-2-.2-3.8.5-4.8 1.8C3.5 10.8 3.2 12.8 4 14.5c.8 1.5 2.5 2.5 4.5 2.5 1.2 0 2.3-.3 3-1"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right chain loop — organic oval */}
      <Path
        d="M14.5 16.5c2 .2 3.8-.5 4.8-1.8 1.2-1.5 1.5-3.5.7-5.2-.8-1.5-2.5-2.5-4.5-2.5-1.2 0-2.3.3-3 1"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Overlap connector — top */}
      <Path
        d="M9.5 7.5c.8-.3 1.8-.5 3-.5 1.2 0 2.2.2 3 .5"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Overlap connector — bottom */}
      <Path
        d="M14.5 16.5c-.8.3-1.8.5-3 .5-1.2 0-2.2-.2-3-.5"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
