import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { IconProps } from './types';

export default function MegaphoneIcon({ size = 24, color = '#2D2226' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Main horn body — flared from left to right */}
      <Path
        d="M4 9.5c-.3 0-.8.3-1 .8-.2.5-.2 1.2-.1 1.8.1.8.5 1.5 1.1 1.7"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Horn barrel */}
      <Path
        d="M4 9.5h4.5v4.3H4"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Flared bell */}
      <Path
        d="M8.5 9.5c2-2 5-3.8 8.5-4.5v13.8c-3.5-.7-6.5-2.5-8.5-4.5"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Sound waves */}
      <Path
        d="M19 9c.8.8 1.2 1.8 1.2 3s-.4 2.2-1.2 3"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M20.5 7.5c1.2 1.2 1.8 2.8 1.8 4.5s-.6 3.3-1.8 4.5"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Handle at bottom */}
      <Path
        d="M5.5 13.8l-.5 3.5c-.1.5.2 1 .7 1.1l1.5.2c.5.1 1-.2 1.1-.7l.5-3.5"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
