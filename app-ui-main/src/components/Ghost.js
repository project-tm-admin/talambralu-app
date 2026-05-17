import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { T } from '../theme';

export default function Ghost({ label, onPress, style }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.btn, style]}
      activeOpacity={0.7}
    >
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 52,
    backgroundColor: 'transparent',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: T.hair2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: T.ink,
  },
});
