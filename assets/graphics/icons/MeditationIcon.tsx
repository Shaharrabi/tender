import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import type { IconProps } from './types';

export default function MeditationIcon({ size = 24, color = '#2D2226' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Head */}
      <Circle
        cx={12}
        cy={5.5}
        r={2.2}
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Body — torso sitting upright */}
      <Path
        d="M12 7.7v5.5"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Crossed legs */}
      <Path
        d="M7.5 19.5c.8-1.5 2.2-3 4.5-3s3.7 1.5 4.5 3"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8.2 17.8c1-.8 2.3-1.3 3.8-1.3s2.8.5 3.8 1.3"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Arms resting on knees — left */}
      <Path
        d="M12 10.5c-1.5.8-3.2 2.5-4.2 4.5"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Arms resting on knees — right */}
      <Path
        d="M12 10.5c1.5.8 3.2 2.5 4.2 4.5"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
