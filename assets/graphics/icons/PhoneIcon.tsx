import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { IconProps } from './types';

export default function PhoneIcon({ size = 24, color = '#2D2226' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M22 16.9v2.8c0 .7-.5 1.2-1.1 1.3-.5 0-1 0-1.5-.1C13.7 19.8 8.7 16.5 5 12c-2.5-3-4-6.5-4.9-10.2C.1 1.3.5.5 1.2.5h3c.5 0 1 .4 1.1.9.1.8.4 1.6.6 2.4.2.5 0 1.1-.4 1.4L4 6.4c2.2 4 5.5 7.3 9.5 9.5l1.2-1.5c.3-.4.9-.6 1.4-.4.8.2 1.6.5 2.4.6.5.1.9.6.9 1.1v1.2z"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
