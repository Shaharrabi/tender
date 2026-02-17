import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { IconProps } from './types';

export default function HandshakeIcon({ size = 24, color = '#2D2226' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Left arm coming in */}
      <Path
        d="M2.5 11.5c1-.2 2.5-.5 4-.5"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Left hand — fingers wrapping */}
      <Path
        d="M6.5 11c.8-.5 1.8-.8 2.8-.5 1 .3 1.5 1 2 1.8.3.5.5 1 .2 1.5-.3.5-.8.8-1.5.8"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right arm coming in */}
      <Path
        d="M21.5 11.5c-1-.2-2.5-.5-4-.5"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right hand — fingers wrapping */}
      <Path
        d="M17.5 11c-.8-.5-1.8-.8-2.8-.5-1 .3-1.5 1-2 1.8-.3.5-.5 1-.2 1.5.3.5.8.8 1.5.8"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Clasp area — interlock */}
      <Path
        d="M10 14.6c.5.5 1.2.8 2 .8s1.5-.3 2-.8"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Left cuff */}
      <Path
        d="M2.5 9.5c.8-.8 2.2-1.5 4-1.8"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right cuff */}
      <Path
        d="M21.5 9.5c-.8-.8-2.2-1.5-4-1.8"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
