import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { IconProps } from './types';

export default function DoveIcon({ size = 24, color = '#2D2226' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Dove body */}
      <Path
        d="M5.5 15c.8.5 2 .8 3.2.5 1.5-.3 2.8-1.2 3.8-2.5 1-1.2 1.5-2.5 1.8-3.8.2-1 .1-1.8-.3-2.2-.3-.3-.8-.3-1.3 0"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Head and beak */}
      <Path
        d="M12.7 7c.3-.5.3-1.2 0-1.8-.3-.5-.8-.8-1.3-.7-.5.1-.8.5-.8 1 0 .5.3 1 .8 1.2"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10.3 6.2c-.5-.2-1.2-.1-1.5.2"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Wing - upper arc */}
      <Path
        d="M14.5 9.5c1-.5 2.2-.8 3.5-.8 1.5 0 2.8.4 3.5 1.2.5.5.5 1.2.0 1.8-.8.8-2 1-3.2.8-1.5-.3-2.8-1-3.8-2"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Wing feathers detail */}
      <Path
        d="M15 10.5c.8.1 1.5.0 2.2-.3"
        stroke={color}
        strokeWidth={1}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15.5 11.5c.8.1 1.8-.1 2.5-.5"
        stroke={color}
        strokeWidth={1}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Tail feathers */}
      <Path
        d="M5.5 15c-.5.8-.8 1.8-.5 2.5.2.5.7.5 1.2.2.8-.5 1.2-1.5 1.2-2.5"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Olive branch in beak */}
      <Path
        d="M8.8 6.4c-1 .5-2 1.2-2.5 2"
        stroke={color}
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Olive branch leaves */}
      <Path
        d="M7.8 7.2c-.3-.4-.8-.5-1.1-.2-.3.3-.2.7.2 1"
        stroke={color}
        strokeWidth={1}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6.8 8c-.2-.4-.6-.6-1-.4-.3.2-.3.6.0.9"
        stroke={color}
        strokeWidth={1}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
