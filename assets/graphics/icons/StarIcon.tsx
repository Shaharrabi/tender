import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { IconProps } from './types';

export default function StarIcon({ size = 24, color = '#2D2226' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2.5l2.4 5.2 5.6.7c.2 0 .3.3.1.4l-4.1 3.8 1.1 5.5c0 .2-.2.4-.4.3L12 15.8l-4.7 2.6c-.2.1-.4-.1-.4-.3l1.1-5.5L4 8.8c-.2-.1-.1-.4.1-.4l5.6-.7L12 2.5z"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
