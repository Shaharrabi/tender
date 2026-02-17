import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import type { IconProps } from './types';

export default function CompassIcon({ size = 24, color = '#2D2226' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Outer ring — slightly organic circle */}
      <Circle
        cx={12}
        cy={12}
        r={9.2}
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Inner ring */}
      <Circle
        cx={12}
        cy={12}
        r={2}
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Needle — north (pointed) */}
      <Path
        d="M12 10l-1.2-5.5L12 5.8l1.2-1.3L12 10z"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Needle — south */}
      <Path
        d="M12 14l-1.2 5.5 1.2-1.3 1.2 1.3L12 14z"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Cardinal marks — E */}
      <Path
        d="M14 12l5.5-1.2-1.3 1.2 1.3 1.2L14 12z"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Cardinal marks — W */}
      <Path
        d="M10 12l-5.5-1.2 1.3 1.2-1.3 1.2L10 12z"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
