import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';
import { T } from '../theme';

function BackArrow() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M20 12H4M4 12L10 6M4 12L10 18" stroke={T.ink} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export default function TopBar({ label, onBack, skipLabel, onSkip, showBack = true }) {
  const navigation = useNavigation();

  const handleBack = () => {
    if (onBack) onBack();
    else navigation.goBack();
  };

  return (
    <View style={styles.bar}>
      {showBack ? (
        <TouchableOpacity onPress={handleBack} style={styles.btn} hitSlop={8}>
          <BackArrow />
        </TouchableOpacity>
      ) : (
        <View style={styles.btn} />
      )}
      {label ? <Text style={styles.label}>{label}</Text> : <View style={styles.flex} />}
      {onSkip ? (
        <TouchableOpacity onPress={onSkip} style={styles.skipBtn}>
          <Text style={styles.skip}>{skipLabel || 'Skip'}</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.btn} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: T.bg,
  },
  btn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: T.ink,
  },
  flex: {
    flex: 1,
  },
  skipBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  skip: {
    fontSize: 14,
    color: T.mute,
    fontWeight: '500',
  },
});
