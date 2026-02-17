import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { IconProps } from './types';

export default function FireIcon({ size = 24, color = '#2D2226' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2c.6 2.8 2.2 4.6 3.8 6.5C17.5 10.6 19 13.2 19 16c0 3.9-3.1 6-7 6s-7-2.1-7-6c0-2.2.8-4.1 2.1-5.7.4-.5 1-.3 1 .3 0 .8.2 1.8.7 2.4.2-2.5 1.4-5 3.2-7.5L12 2z"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 22c-1.7 0-3-1.3-3-3.2 0-1.5.8-2.8 1.8-3.8.3-.3.7-.1.7.3 0 .5.2 1.1.5 1.4.1-1.4.8-2.6 1.5-3.5.3 1.2 1.2 2.2 1.5 3.5C15 18.6 14 22 12 22z"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
