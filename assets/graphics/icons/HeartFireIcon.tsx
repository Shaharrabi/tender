import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { IconProps } from './types';

export default function HeartFireIcon({ size = 24, color = '#2D2226' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22c-.5-.4-8.5-6-8.5-11.5C3.5 7 5.8 5 8.5 5c1.5 0 2.8.7 3.5 1.8C12.7 5.7 14 5 15.5 5c2.7 0 5 2 5 5.5C20.5 16 12.5 21.6 12 22z"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 18c-.8-.8-1.5-2-1.5-3.2 0-1.2.8-2 1.5-2.8.7.8 1.5 1.6 1.5 2.8 0 1.2-.7 2.4-1.5 3.2z"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 10c.3.5.6 1.1.6 1.7"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
      />
    </Svg>
  );
}
