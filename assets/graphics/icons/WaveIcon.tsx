import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { IconProps } from './types';

export default function WaveIcon({ size = 24, color = '#2D2226' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Main wave crest */}
      <Path
        d="M2.5 13.5c1.2-1.8 2.8-3.5 4.5-4.2 2-.8 3.5.2 4.8 1.5 1.2 1.2 2.5 2 4.2 1.5 1.8-.5 3.2-2 4.5-3.8"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Wave curl / foam */}
      <Path
        d="M3.5 11c.8-.5 1.8-.8 2.8-.5 1 .3 1.5 1 1.8 1.8"
        stroke={color}
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Second wave line */}
      <Path
        d="M2.5 17c1.5-.8 3-1.8 5-2 2.2-.2 3.8.5 5.5 1.2 1.5.6 3 .8 4.5.3 1.2-.4 2.5-1.2 4-2.5"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Subtle third wave hint */}
      <Path
        d="M4 20c2-.5 4.2-.8 6.5-.5 2 .3 3.8.5 5.8.2 1.5-.2 3-.7 4.2-1.2"
        stroke={color}
        strokeWidth={1}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
