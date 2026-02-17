import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { IconProps } from './types';

export default function SparkleIcon({ size = 24, color = '#2D2226' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2c.3 3.5 1.2 6.8 4.8 7.2C13.2 9.8 12.3 13 12 16.5c-.3-3.5-1.2-6.7-4.8-7.3C10.8 8.8 11.7 5.5 12 2z"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M18 14c.2 1.8.7 3.2 2.5 3.5-1.8.2-2.3 1.6-2.5 3.5-.2-1.9-.7-3.3-2.5-3.5 1.8-.3 2.3-1.7 2.5-3.5z"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
