import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import type { IconProps } from './types';

export default function SunIcon({ size = 24, color = '#2D2226' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Sun body - slightly imperfect circle */}
      <Path
        d="M12 7.2c1.3-.1 2.5.4 3.4 1.3.9.9 1.4 2.1 1.4 3.4.0 1.3-.4 2.5-1.3 3.4-.9.9-2.1 1.5-3.4 1.5-1.3.0-2.6-.5-3.5-1.4-.9-.9-1.3-2.1-1.3-3.4.0-1.3.5-2.5 1.4-3.4.9-.9 2-1.4 3.3-1.4z"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Rays - hand-drawn style, slightly varied lengths */}
      <Path d="M12 2.5c.1.5.1 1.2 0 1.8" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
      <Path d="M12 19.8c-.1.5-.1 1.2 0 1.8" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
      <Path d="M4.5 4.8c.4.3.9.8 1.3 1.3" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
      <Path d="M18.2 18c.4.4.9.8 1.3 1.3" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
      <Path d="M2.5 12c.5.1 1.2.1 1.8 0" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
      <Path d="M19.8 12c.5-.1 1.2-.1 1.8 0" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
      <Path d="M4.5 19.2c.4-.3.9-.8 1.3-1.3" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
      <Path d="M18.2 6c.4-.4.9-.8 1.3-1.2" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
    </Svg>
  );
}
