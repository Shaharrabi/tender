import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { IconProps } from './types';

export default function SwirlyIcon({ size = 24, color = '#2D2226' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 12c0-1.5 1.2-2.8 2.8-2.8 1.5 0 2.8 1.3 2.8 2.8 0 3-2.5 5.5-5.6 5.5C8.2 17.5 5 14.2 5 10.5 5 6 8.8 2.5 13.2 2.5c5.2 0 9.3 4.3 8.8 9.5"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
