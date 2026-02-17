import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { IconProps } from './types';

export default function PuzzleIcon({ size = 24, color = '#2D2226' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20.5 10.5h-1c-.5 0-1-.5-1-1.2 0-.7.5-1.3 1-1.3h1V4.5c0-.5-.4-1-1-1h-3.8v1c0 .5-.5 1-1.2 1-.7 0-1.3-.5-1.3-1v-1H9.5c-.5 0-1 .4-1 1v3.8h-1c-.5 0-1 .5-1 1.2 0 .7.5 1.3 1 1.3h1v3.7c0 .5.5 1 1 1h3.7v-1c0-.5.5-1 1.2-1 .7 0 1.3.5 1.3 1v1h3.8c.5 0 1-.5 1-1v-3.5z"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8.5 14.5v3.7c0 .5-.5 1-1 1H4.5v-1c0-.5-.5-1-1.2-1-.7 0-1.3.5-1.3 1v1"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
