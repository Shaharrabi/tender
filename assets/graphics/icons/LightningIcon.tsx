import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { IconProps } from './types';

export default function LightningIcon({ size = 24, color = '#2D2226' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M13.2 2L6.5 13.2c-.1.2.1.5.3.5h4.5l-1.5 8.3c0 .2.3.3.4.1L17.5 11c.1-.2-.1-.5-.3-.5h-4.4l1.5-8.2c0-.2-.3-.4-.4-.2l-.7.9z"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
