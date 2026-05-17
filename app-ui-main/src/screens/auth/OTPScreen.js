import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { T, FONTS } from '../../theme';
import TopBar from '../../components/TopBar';
import Primary from '../../components/Primary';

function EmailIcon() {
  return (
    <Svg width={40} height={40} viewBox="0 0 40 40" fill="none">
      <Rect width={40} height={40} rx={12} fill={T.accentSoft} />
      <Path d="M8 13h24v16H8V13z" stroke={T.accentInk} strokeWidth={1.5} rx={2} fill="none" />
      <Path d="M8 13l12 10L32 13" stroke={T.accentInk} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

const MOCK_OTP = ['8', '4', '2', '1', '', ''];

export default function OTPScreen() {
  const navigation = useNavigation();
  const [otp, setOtp] = useState(MOCK_OTP);
  const inputs = useRef([]);

  const allFilled = otp.every(d => d !== '');

  return (
    <SafeAreaView style={styles.safe}>
      <TopBar />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.iconWrap}>
          <EmailIcon />
        </View>

        <Text style={styles.title}>Check your{'\n'}email</Text>
        <Text style={styles.subtitle}>
          We sent a 6-digit code to{'\n'}
          <Text style={styles.emailHint}>anika@example.com</Text>
        </Text>

        <View style={styles.otpRow}>
          {otp.map((digit, i) => (
            <View
              key={i}
              style={[
                styles.otpBox,
                digit ? styles.otpFilled : styles.otpEmpty,
                i === 4 && styles.otpCursor,
              ]}
            >
              <TextInput
                ref={r => (inputs.current[i] = r)}
                style={styles.otpInput}
                value={digit}
                onChangeText={v => {
                  const next = [...otp];
                  next[i] = v.slice(-1);
                  setOtp(next);
                  if (v && i < 5) inputs.current[i + 1]?.focus();
                }}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
              />
              {i === 4 && !digit && <View style={styles.cursor} />}
            </View>
          ))}
        </View>

        <View style={styles.resendRow}>
          <Text style={styles.resendText}>Didn't get it? Resend in </Text>
          <Text style={styles.countdown}>00:42</Text>
        </View>

        <TouchableOpacity style={styles.altLink}>
          <Text style={styles.altText}>Use a different email address</Text>
        </TouchableOpacity>

        <Primary
          label="Verify & continue"
          onPress={() => navigation.navigate('NameDOB')}
          disabled={!allFilled}
          style={{ marginTop: 24 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  content: { paddingHorizontal: 24, paddingBottom: 40 },
  iconWrap: { marginTop: 8, marginBottom: 24 },
  title: {
    fontFamily: FONTS.display,
    fontSize: 38,
    color: T.ink,
    lineHeight: 46,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: T.mute,
    lineHeight: 24,
    marginBottom: 36,
  },
  emailHint: {
    color: T.ink,
    fontWeight: '600',
  },
  otpRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  otpBox: {
    flex: 1,
    height: 60,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    position: 'relative',
  },
  otpFilled: {
    backgroundColor: T.field,
    borderColor: T.hair2,
  },
  otpEmpty: {
    backgroundColor: T.surface,
    borderColor: T.hair2,
  },
  otpCursor: {
    borderColor: T.accent,
  },
  otpInput: {
    fontSize: 22,
    fontWeight: '700',
    color: T.ink,
    textAlign: 'center',
    width: '100%',
    height: '100%',
  },
  cursor: {
    position: 'absolute',
    bottom: 12,
    width: 2,
    height: 24,
    backgroundColor: T.accent,
    borderRadius: 1,
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  resendText: { fontSize: 14, color: T.mute },
  countdown: {
    fontFamily: FONTS.mono,
    fontSize: 14,
    color: T.ink,
    fontWeight: '600',
  },
  altLink: { alignItems: 'center', paddingVertical: 8 },
  altText: {
    fontSize: 14,
    color: T.accent,
    textDecorationLine: 'underline',
  },
});
