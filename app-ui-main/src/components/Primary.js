import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { T } from '../theme';

export default function Primary({ label, onPress, disabled, icon, style }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.btn, disabled && styles.disabled, style]}
      activeOpacity={0.8}
    >
      {icon ? <View style={styles.iconWrap}>{icon}</View> : null}
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 56,
    backgroundColor: T.accent,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  disabled: {
    opacity: 0.4,
  },
  iconWrap: {
    marginRight: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
});
