import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { T, FONTS } from '../theme';

export default function Primary({ label, onPress, disabled, loading, style, children }) {
  return (
    <TouchableOpacity
      style={[styles.btn, disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading
        ? <ActivityIndicator color="#fff" />
        : children || <Text style={styles.label}>{label}</Text>
      }
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn:      { backgroundColor: T.accent, borderRadius: 14, paddingVertical: 16, alignItems: 'center', justifyContent: 'center' },
  disabled: { opacity: 0.45 },
  label:    { color: '#fff', fontSize: 16, fontWeight: '700', fontFamily: FONTS.display },
});
