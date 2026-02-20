import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { IconProps } from './types';

export default function BellIcon({ size = 24, color = '#2D2226' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3c-3.3 0-6 2.7-6 6v4l-1.5 2.5c-.3.5 0 1.1.6 1.1h13.8c.6 0 .9-.6.6-1.1L18 13V9c0-3.3-2.7-6-6-6z"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10 17.5c0 1.1.9 2 2 2s2-.9 2-2"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
