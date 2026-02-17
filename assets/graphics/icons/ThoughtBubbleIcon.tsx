import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import type { IconProps } from './types';

export default function ThoughtBubbleIcon({ size = 24, color = '#2D2226' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3C7.3 3 3.5 6 3.5 9.8c0 1.8.9 3.5 2.3 4.7-.2 1.2-.8 2.3-1.5 3.1-.1.1 0 .3.1.3 1.8-.1 3.6-.7 4.9-1.6.8.2 1.7.3 2.7.3 4.7 0 8.5-3 8.5-6.8S16.7 3 12 3z"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx={8.5} cy={9.5} r={0.7} fill={color} />
      <Circle cx={12} cy={9.5} r={0.7} fill={color} />
      <Circle cx={15.5} cy={9.5} r={0.7} fill={color} />
    </Svg>
  );
}
