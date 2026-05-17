import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function PhotoPlaceholder({ width, height, label, style }) {
  return (
    <View style={[{ width, height, overflow: 'hidden', borderRadius: 16 }, style]}>
      <LinearGradient
        colors={['#F7E8D4', '#E8C9A8', '#D4A574', '#C4946A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {/* Diagonal stripe overlay */}
      <View style={[StyleSheet.absoluteFill, styles.stripeContainer]}>
        {Array.from({ length: 20 }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.stripe,
              {
                top: -height + i * (height + width) / 10,
                left: -width,
              },
            ]}
          />
        ))}
      </View>
      {label ? (
        <View style={styles.labelWrap}>
          <Text style={styles.label}>{label}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  stripeContainer: {
    overflow: 'hidden',
  },
  stripe: {
    position: 'absolute',
    width: 2000,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    transform: [{ rotate: '45deg' }],
  },
  labelWrap: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 16,
  },
  label: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    fontWeight: '600',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
});
