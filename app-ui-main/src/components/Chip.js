import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { T } from '../theme';

export default function Chip({ label, selected, onPress, style }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.chip, selected ? styles.selected : styles.unselected, style]}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, selected ? styles.textSelected : styles.textUnselected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 100,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1.5,
  },
  selected: {
    backgroundColor: T.accent,
    borderColor: T.accent,
  },
  unselected: {
    backgroundColor: T.surface,
    borderColor: T.hair2,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
  textSelected: {
    color: '#FFFFFF',
  },
  textUnselected: {
    color: T.ink2,
  },
});
