import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { IconProps } from './types';

export default function MasksIcon({ size = 24, color = '#2D2226' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Comedy mask (happy) — front, slightly left */}
      <Path
        d="M4 6.5c-.2 1.8.2 4 1 5.5 1 1.8 2.8 3.2 5 3.2s4-1.4 5-3.2c.8-1.5 1.2-3.7 1-5.5-.1-.8-.5-1.5-1.2-1.8C13 4 11.2 3.5 10 3.5S7 4 5.2 4.7c-.7.3-1.1 1-1.2 1.8z"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Comedy — left eye */}
      <Path
        d="M7.5 8c.2-.5.8-.8 1.2-.5.3.2.4.6.2 1"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Comedy — right eye */}
      <Path
        d="M11.2 8c.2-.5.8-.8 1.2-.5.3.2.4.6.2 1"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Comedy — smiling mouth */}
      <Path
        d="M7.8 11.5c.5.8 1.3 1.2 2.2 1.2s1.7-.4 2.2-1.2"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Tragedy mask (sad) — behind, slightly right */}
      <Path
        d="M14.5 9c.2-1.2.8-2.2 1.5-2.8.8-.7 1.8-1 2.8-.8 1 .2 1.8.8 2.2 1.8.5 1.2.5 2.8.2 4.2-.4 1.5-1.5 3-3.2 3.5-1.2.4-2.5 0-3.5-.8"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Tragedy — eye */}
      <Path
        d="M17.5 10c.3-.3.7-.3 1 0"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Tragedy — frowning mouth */}
      <Path
        d="M16.8 13c.4-.6 1-.8 1.7-.8.6 0 1.2.3 1.5.8"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
