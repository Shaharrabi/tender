import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { IconProps } from './types';

export default function SnowflakeIcon({ size = 24, color = '#2D2226' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Vertical axis */}
      <Path
        d="M12 2.5c-.1 1.5.0 3.5.1 5.5.1 2 .0 4-.1 6-.1 2 .0 4 .1 5.5"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Upper-right to lower-left axis */}
      <Path
        d="M20.2 7.2c-1.3.8-2.8 1.8-4.3 2.8-1.5 1-3 2-4.2 3-1.2 1-2.5 2-3.8 2.8-1.2.8-2.3 1.3-3.5 1.7"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Upper-left to lower-right axis */}
      <Path
        d="M3.8 7.2c1.3.8 2.8 1.8 4.3 2.8 1.5 1 3 2 4.2 3 1.2 1 2.5 2 3.8 2.8 1.2.8 2.3 1.3 3.5 1.7"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Top branches */}
      <Path d="M12.1 5.5c-.8-.5-1.5-.5-1.8.0" stroke={color} strokeWidth={1.2} strokeLinecap="round" />
      <Path d="M12.1 5.5c.8-.5 1.5-.5 1.8.0" stroke={color} strokeWidth={1.2} strokeLinecap="round" />
      {/* Bottom branches */}
      <Path d="M12 18.5c-.8.5-1.5.5-1.8.0" stroke={color} strokeWidth={1.2} strokeLinecap="round" />
      <Path d="M12 18.5c.8.5 1.5.5 1.8.0" stroke={color} strokeWidth={1.2} strokeLinecap="round" />
      {/* Upper-right branches */}
      <Path d="M17.2 9c.2.8.0 1.5-.5 1.7" stroke={color} strokeWidth={1.2} strokeLinecap="round" />
      <Path d="M17.2 9c.8.2 1.2.8 1 1.3" stroke={color} strokeWidth={1.2} strokeLinecap="round" />
      {/* Lower-left branches */}
      <Path d="M6.8 15c-.2-.8.0-1.5.5-1.7" stroke={color} strokeWidth={1.2} strokeLinecap="round" />
      <Path d="M6.8 15c-.8-.2-1.2-.8-1-1.3" stroke={color} strokeWidth={1.2} strokeLinecap="round" />
      {/* Upper-left branches */}
      <Path d="M6.8 9c-.2.8.0 1.5.5 1.7" stroke={color} strokeWidth={1.2} strokeLinecap="round" />
      <Path d="M6.8 9c-.8.2-1.2.8-1 1.3" stroke={color} strokeWidth={1.2} strokeLinecap="round" />
      {/* Lower-right branches */}
      <Path d="M17.2 15c.2-.8.0-1.5-.5-1.7" stroke={color} strokeWidth={1.2} strokeLinecap="round" />
      <Path d="M17.2 15c.8-.2 1.2-.8 1-1.3" stroke={color} strokeWidth={1.2} strokeLinecap="round" />
    </Svg>
  );
}
