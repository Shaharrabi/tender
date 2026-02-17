import React from 'react';
import Svg, { Path, Line } from 'react-native-svg';
import type { IconProps } from './types';

export default function ScaleIcon({ size = 24, color = '#2D2226' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Center post */}
      <Line
        x1={12}
        y1={3.5}
        x2={12}
        y2={20}
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
      />
      {/* Base */}
      <Path
        d="M8.5 20c0-.3 1.5-.8 3.5-.8s3.5.5 3.5.8"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Beam — slightly organic, not perfectly straight */}
      <Path
        d="M4.5 8.2c2.3-.6 5-1 7.5-1s5.2.4 7.5 1"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Left pan chain */}
      <Path
        d="M4.5 8.2v1.8"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
      />
      {/* Left pan */}
      <Path
        d="M2.5 10c.5 2.5 1.5 3.5 2 3.5s1.5-1 2-3.5"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right pan chain */}
      <Path
        d="M19.5 8.2v1.8"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
      />
      {/* Right pan */}
      <Path
        d="M17.5 10c.5 2.5 1.5 3.5 2 3.5s1.5-1 2-3.5"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Top finial / decorative knob */}
      <Path
        d="M11.2 3.5c.3-.4.8-.5 .8-.5s.5.1.8.5"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
