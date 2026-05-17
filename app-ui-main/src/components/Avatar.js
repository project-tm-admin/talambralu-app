import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { T } from '../theme';

export default function Avatar({ name, size = 48, style }) {
  const initials = name
    ? name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }, style]}>
      <Text style={[styles.initials, { fontSize: size * 0.36 }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: T.accentSoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: T.accentInk,
    fontWeight: '700',
  },
});
