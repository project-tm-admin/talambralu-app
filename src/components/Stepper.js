import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { T, FONTS } from '../theme';

export default function Stepper({ current, total = 16 }) {
  const progress = current / total;
  const label = String(current).padStart(2, '0') + '/' + String(total).padStart(2, '0');

  return (
    <View style={styles.container}>
      <View style={styles.trackWrap}>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${progress * 100}%` }]} />
        </View>
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
    marginTop: 8,
    gap: 12,
  },
  trackWrap: {
    flex: 1,
  },
  track: {
    height: 3,
    backgroundColor: T.hair2,
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: T.accent,
    borderRadius: 2,
  },
  label: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    color: T.mute,
    letterSpacing: 0.5,
  },
});
