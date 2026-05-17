import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { T } from '../theme';

function CheckCircle({ selected }) {
  if (selected) {
    return (
      <Svg width={24} height={24} viewBox="0 0 24 24">
        <Circle cx="12" cy="12" r="12" fill={T.accent} />
        <Path d="M7 12L10 15L17 8" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    );
  }
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24">
      <Circle cx="12" cy="12" r="11" fill="none" stroke={T.hair2} strokeWidth={1.5} />
    </Svg>
  );
}

export default function CardRow({ icon, title, subtitle, selected, onPress, rightEl, style, compact }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.row, compact && styles.compactRow, selected && styles.selectedRow, style]}
      activeOpacity={0.7}
    >
      {icon ? <View style={[styles.iconWrap, compact && styles.compactIconWrap]}>{icon}</View> : null}
      <View style={styles.textWrap}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {rightEl || <CheckCircle selected={selected} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.surface,
    borderWidth: 1.5,
    borderColor: T.hair,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
  },
  selectedRow: {
    borderColor: T.accent,
    backgroundColor: '#FFFFFF',
  },
  iconWrap: {
    marginRight: 14,
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: T.field,
    justifyContent: 'center',
    alignItems: 'center',
  },
  compactRow: {
    padding: 10,
    marginBottom: 8,
  },
  compactIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    marginRight: 12,
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: T.ink2,
  },
  subtitle: {
    fontSize: 13,
    color: T.mute,
    marginTop: 2,
  },
});
