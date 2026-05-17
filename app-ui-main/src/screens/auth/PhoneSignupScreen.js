import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Rect } from 'react-native-svg';
import { T, FONTS } from '../../theme';
import TopBar from '../../components/TopBar';
import Primary from '../../components/Primary';
import Ghost from '../../components/Ghost';

function USFlag() {
  return (
    <Svg width={24} height={16} viewBox="0 0 24 16">
      <Rect width={24} height={16} rx={2} fill="#B22234" />
      {[0, 2, 4, 6, 8, 10, 12].map(y => (
        <Rect key={y} x={0} y={y} width={24} height={1.23} fill="white" />
      ))}
      <Rect x={0} y={0} width={10} height={8.6} fill="#3C3B6E" />
      {/* Stars (simplified) */}
      {[0,1,2].map(row => (
        [0,1,2,3].map(col => (
          <Rect key={`${row}-${col}`} x={1.2 + col * 2.5} y={1 + row * 2.5} width={1} height={1} fill="white" rx={0.3} />
        ))
      ))}
    </Svg>
  );
}

function LockIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Rect x="5" y="11" width="14" height="11" rx="2" stroke={T.accentInk} strokeWidth={1.8} />
      <Path d="M8 11V7a4 4 0 018 0v4" stroke={T.accentInk} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

export default function PhoneSignupScreen() {
  const navigation = useNavigation();
  const [phone, setPhone] = useState('');

  return (
    <SafeAreaView style={styles.safe}>
      <TopBar />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>What's your{'\n'}number?</Text>
        <Text style={styles.subtitle}>We'll send you a verification code</Text>

        <View style={styles.phoneBox}>
          <Text style={styles.phoneLabel}>PHONE NUMBER</Text>
          <View style={styles.phoneRow}>
            <View style={styles.flagBox}>
              <USFlag />
              <Text style={styles.prefix}>+1</Text>
            </View>
            <TextInput
              style={styles.phoneInput}
              value={phone}
              onChangeText={setPhone}
              placeholder="(555) 000-0000"
              placeholderTextColor={T.mute}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={styles.privacyBox}>
          <LockIcon />
          <Text style={styles.privacyText}>
            Your number is private and never shown on your profile. We only use it for verification.
          </Text>
        </View>

        <Primary
          label="Send code"
          onPress={() => navigation.navigate('OTP')}
          style={{ marginTop: 24 }}
        />

        <Ghost
          label="Continue with email instead"
          onPress={() => navigation.navigate('EmailSignup')}
          style={{ marginTop: 8 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  content: { paddingHorizontal: 24, paddingBottom: 40 },
  title: {
    fontFamily: FONTS.display,
    fontSize: 38,
    color: T.ink,
    lineHeight: 46,
    marginBottom: 8,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 15,
    color: T.mute,
    marginBottom: 32,
  },
  phoneBox: {
    backgroundColor: T.field,
    borderWidth: 1,
    borderColor: T.hair,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 4,
    marginBottom: 16,
  },
  phoneLabel: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    letterSpacing: 1,
    color: T.mute,
    marginBottom: 4,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingRight: 12,
    paddingVertical: 8,
    borderRightWidth: 1,
    borderRightColor: T.hair2,
  },
  prefix: {
    fontSize: 15,
    fontWeight: '600',
    color: T.ink,
  },
  phoneInput: {
    flex: 1,
    paddingLeft: 12,
    paddingVertical: 8,
    fontSize: 15,
    color: T.ink,
  },
  privacyBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: T.accentSoft,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
  },
  privacyText: {
    flex: 1,
    fontSize: 13,
    color: T.accentInk,
    lineHeight: 20,
  },
});
