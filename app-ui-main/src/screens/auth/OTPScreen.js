import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Svg, { Path, Rect } from 'react-native-svg';
import { T, FONTS } from '../../theme';
import TopBar from '../../components/TopBar';
import Primary from '../../components/Primary';
import { auth } from '../../config/firebase';
import { PhoneAuthProvider, signInWithCredential } from 'firebase/auth';

function EmailIcon() {
  return (
    <Svg width={64} height={64} viewBox="0 0 64 64" fill="none">
      <Rect width={64} height={64} rx={16} fill="#C2EDE7" />
      <Path d="M14 22h36v22H14V22z" stroke="#2E8B7A" strokeWidth={2} fill="none" strokeLinejoin="round" />
      <Path d="M14 22l18 14 18-14" stroke="#2E8B7A" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export default function OTPScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputs = useRef([]);
  const [activeInput, setActiveInput] = useState(0);

  const verificationId = route.params?.verificationId;
  const phoneNumber = route.params?.phoneNumber;

  const allFilled = otp.every(d => d !== '');

  const verifyCode = async () => {
    if (!allFilled || !verificationId) return;

    setLoading(true);
    const code = otp.join('');
    try {
      const credential = PhoneAuthProvider.credential(verificationId, code);
      await signInWithCredential(auth, credential);
      navigation.navigate('NameDOB');
    } catch (err) {
      console.error('OTP Verification Error', err);
      Alert.alert('Verification Failed', err.message || 'Invalid code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <TopBar />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.iconWrap}>
          <EmailIcon />
        </View>

        <Text style={styles.title}>Enter{'\n'}Code</Text>
        <Text style={styles.subtitle}>
          We sent a 6-digit code to{'\n'}
          <Text style={styles.emailHint}>{phoneNumber || 'your phone'}</Text>
        </Text>

        <View style={styles.otpRow}>
          {otp.map((digit, i) => (
            <View
              key={i}
              style={[
                styles.otpBox,
                digit ? styles.otpFilled : styles.otpEmpty,
                activeInput === i && styles.otpCursor,
              ]}
            >
              <TextInput
                ref={r => (inputs.current[i] = r)}
                style={styles.otpInput}
                value={digit}
                onFocus={() => setActiveInput(i)}
                onChangeText={v => {
                  const next = [...otp];
                  next[i] = v.slice(-1);
                  setOtp(next);
                  if (v && i < 5) {
                    inputs.current[i + 1]?.focus();
                    setActiveInput(i+1);
                  }
                }}
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === 'Backspace' && !otp[i] && i > 0) {
                     inputs.current[i - 1]?.focus();
                     setActiveInput(i-1);
                  }
                }}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
              />
            </View>
          ))}
        </View>

        <View style={styles.resendRow}>
          <Text style={styles.resendText}>Didn't get it? Resend in </Text>
          <Text style={styles.countdown}>00:42</Text>
        </View>

        <TouchableOpacity style={styles.altLink} onPress={() => navigation.goBack()}>
          <Text style={styles.altText}>Use a different phone number</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.primaryBtn, !allFilled && styles.primaryBtnDisabled]}
          onPress={verifyCode}
          disabled={!allFilled || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
             <Text style={styles.primaryLabel}>Verify & continue</Text>
          )}
        </TouchableOpacity>
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
  primaryBtn: {
      height: 52,
      borderRadius: 100,
      backgroundColor: T.ink,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 24,
  },
  primaryBtnDisabled: {
      opacity: 0.5,
  },
  primaryLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: '#fff',
  }
});
