import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { T, FONTS } from '../theme';

// Label lives INSIDE the cement box — matches the HTML prototype Field design
export default function Field({
  label, value, placeholder, onChangeText,
  secureTextEntry, keyboardType, style, suffix, mono,
}) {
  return (
    <View style={[styles.box, style]}>
      {label ? <Text style={styles.label}>{label.toUpperCase()}</Text> : null}
      <View style={styles.row}>
        <TextInput
          style={[styles.input, mono && styles.mono]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={T.mute}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize="none"
          underlineColorAndroid="transparent"
        />
        {suffix ? <Text style={styles.suffix}>{suffix}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: T.hair,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    marginBottom: 12,
  },
  label: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    letterSpacing: 1,
    color: T.mute,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: T.ink,
    padding: 0,
    margin: 0,
    fontFamily: FONTS.ui,
  },
  mono: {
    fontFamily: FONTS.mono,
  },
  suffix: {
    fontSize: 13,
    color: T.mute,
    marginLeft: 8,
  },
});
