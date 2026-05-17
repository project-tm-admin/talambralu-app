import React from 'react';
import Svg, { Ellipse } from 'react-native-svg';
import { T } from '../theme';

export default function RiceGrain({ color, size = 1 }) {
  return (
    <Svg width={6 * size} height={10 * size} viewBox="0 0 6 10">
      <Ellipse cx="3" cy="5" rx="3" ry="5" fill={color || T.accent} />
    </Svg>
  );
}
