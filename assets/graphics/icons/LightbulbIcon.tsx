import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { IconProps } from './types';

export default function LightbulbIcon({ size = 24, color = '#2D2226' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9.5 21h5M10 18h4"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 2C8.1 2 5 5.1 5 9c0 2.4 1.2 4.5 3 5.7.6.5 1 1.3 1 2.1V18h6v-1.2c0-.8.4-1.6 1-2.1 1.8-1.2 3-3.3 3-5.7 0-3.9-3.1-7-7-7z"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10 12.5c.5.8 1.2 1.5 2 2 .8-.5 1.5-1.2 2-2"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
