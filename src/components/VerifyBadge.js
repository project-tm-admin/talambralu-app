import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { T } from '../theme';

function CheckIcon({ size = 10 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 10 10">
      <Circle cx="5" cy="5" r="5" fill={T.verify} />
      <Path d="M3 5L4.5 6.5L7 4" stroke="white" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export default function VerifyBadge({ label, style }) {
  return (
    <View style={[styles.badge, style]}>
      <CheckIcon />
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </View>
  );
}

export function VerifyDot({ size = 12, style }) {
  return (
    <View style={[styles.dot, { width: size, height: size, borderRadius: size / 2 }, style]}>
      <Svg width={size} height={size} viewBox="0 0 12 12">
        <Circle cx="6" cy="6" r="6" fill={T.verify} />
        <Path d="M3.5 6L5 7.5L8.5 4" stroke="white" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.verifySoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 100,
    gap: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: T.verify,
  },
  dot: {
    overflow: 'hidden',
  },
});
