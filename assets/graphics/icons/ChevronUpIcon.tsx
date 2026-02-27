import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { IconProps } from './types';

export default function ChevronUpIcon({ size = 24, color = '#2D2226' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 15.5L12 8l7 7.5"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
