import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { IconProps } from './types';

export default function PlantIcon({ size = 24, color = '#2D2226' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Pot */}
      <Path
        d="M7.5 16.5c-.3 2.2.2 4 1.2 4.8.5.3 1.2.5 2 .5h2.6c.8 0 1.5-.2 2-.5 1-.8 1.5-2.6 1.2-4.8"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Pot rim */}
      <Path
        d="M6.8 16.5c.5.2 1.5.3 2.7.3h5c1.2 0 2.2-.1 2.7-.3.3-.1.5-.3.5-.5s-.2-.4-.5-.5c-.5-.2-1.5-.3-2.7-.3h-5c-1.2 0-2.2.1-2.7.3-.3.1-.5.3-.5.5s.2.4.5.5z"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Main stem */}
      <Path
        d="M12 15.5c-.2-2 .1-4 .3-5.5.1-1 .0-1.8-.3-2.5"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Left leaf */}
      <Path
        d="M12 11c-1-.8-2.5-1.2-3.8-.8-1.2.4-1.8 1.3-1.5 2.2.3.8 1.2 1.2 2.3 1 1.2-.2 2.3-1 3-2.4z"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right leaf */}
      <Path
        d="M12 8c1-.7 2.3-1 3.5-.7 1.2.3 1.9 1.2 1.7 2.1-.2.8-1.1 1.3-2.2 1.1-1.2-.2-2.3-.9-3-2.5z"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Top small leaf / bud */}
      <Path
        d="M12 7.5c-.3-1-.2-2.2.3-3 .5-.8 1.2-1 1.8-.6.5.4.6 1.2.2 2-.4.8-1.2 1.4-2.3 1.6z"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
