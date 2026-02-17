import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import type { IconProps } from './types';

export default function MirrorIcon({ size = 24, color = '#2D2226' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Mirror glass — oval */}
      <Path
        d="M12 3c-3.5 0-6.5 2.8-6.5 6.5 0 3.7 3 6.5 6.5 6.5s6.5-2.8 6.5-6.5C18.5 5.8 15.5 3 12 3z"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Handle */}
      <Path
        d="M12 16v5.5"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Handle grip — organic oval */}
      <Path
        d="M10 21c0-.3.8-.8 2-.8s2 .5 2 .8"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Reflection lines — gentle arcs */}
      <Path
        d="M9 7c.5-.8 1.2-1.3 2-1.5"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8.5 9.5c.2-.5.5-.8.8-1"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
