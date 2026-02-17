import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { IconProps } from './types';

export default function HeartPulseIcon({ size = 24, color = '#2D2226' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Heart shape */}
      <Path
        d="M12 21c-.5-.4-9-6.5-9-12C3 5.5 5.5 3 8.5 3c1.7 0 3.2.8 3.5 2 .3-1.2 1.8-2 3.5-2C18.5 3 21 5.5 21 9c0 5.5-8.5 11.6-9 12z"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Heartbeat / pulse line through the center */}
      <Path
        d="M4.5 11.5c1.2.1 2.2.0 3-.1l1.5-3 1.8 5.5 2-7 1.8 6 1.2-2.5c.8.2 1.8.3 3 .1"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
