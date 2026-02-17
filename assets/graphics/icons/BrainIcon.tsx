import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { IconProps } from './types';

export default function BrainIcon({ size = 24, color = '#2D2226' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Brain outline — left hemisphere */}
      <Path
        d="M12 4.5c-1.2-.9-2.8-1.4-4.2-1 C6.3 3.8 5 5 4.6 6.5c-.5 1.8 0 3.4.6 4.8 .4 1 .2 2.2-.3 3.1-.6 1.1-.4 2.5.5 3.3 .9.8 2.1 1.1 3.2.8 1-.3 1.8-1 2.6-1.7.4-.3.6-.7.8-1.2"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Brain outline — right hemisphere */}
      <Path
        d="M12 4.5c1.2-.9 2.8-1.4 4.2-1 1.5.3 2.8 1.5 3.2 3 .5 1.8 0 3.4-.6 4.8-.4 1-.2 2.2.3 3.1.6 1.1.4 2.5-.5 3.3-.9.8-2.1 1.1-3.2.8-1-.3-1.8-1-2.6-1.7-.4-.3-.6-.7-.8-1.2"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Central fissure */}
      <Path
        d="M12 4.5v11.1"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Left sulci folds */}
      <Path
        d="M12 7.5c-1.5.2-3.2.8-4 2.2"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 11c-1.8.3-3.5 1.2-4.2 2.8"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right sulci folds */}
      <Path
        d="M12 7.5c1.5.2 3.2.8 4 2.2"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 11c1.8.3 3.5 1.2 4.2 2.8"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
