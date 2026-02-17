import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import type { IconProps } from './types';

export default function ChatBubbleIcon({ size = 24, color = '#2D2226' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Rounded speech bubble with tail */}
      <Path
        d="M4.5 5.5c-.5.5-.8 1.3-.8 2.2v6.5c0 1 .3 1.8.8 2.3.5.5 1.3.8 2.2.8h2.5l2.8 3.2 2.8-3.2h2.5c.9 0 1.7-.3 2.2-.8.5-.5.8-1.3.8-2.3V7.7c0-.9-.3-1.7-.8-2.2-.5-.5-1.3-.8-2.2-.8H6.7c-.9 0-1.7.3-2.2.8z"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Three dots inside */}
      <Circle
        cx={8.5}
        cy={11}
        r={0.8}
        stroke={color}
        strokeWidth={1.4}
      />
      <Circle
        cx={12}
        cy={11}
        r={0.8}
        stroke={color}
        strokeWidth={1.4}
      />
      <Circle
        cx={15.5}
        cy={11}
        r={0.8}
        stroke={color}
        strokeWidth={1.4}
      />
    </Svg>
  );
}
