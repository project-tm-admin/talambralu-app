import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { T, FONTS } from '../theme';

export default function Avatar({ uri, name, size = 48, style }) {
  const initials = name
    ? name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';
  return (
    <View style={[styles.wrap, { width: size, height: size, borderRadius: size / 2 }, style]}>
      {uri
        ? <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} />
        : <Text style={[styles.initials, { fontSize: size * 0.36 }]}>{initials}</Text>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  wrap:     { backgroundColor: T.accentSoft, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  initials: { color: T.accent, fontWeight: '700', fontFamily: FONTS.display },
});
