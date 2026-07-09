/**
 * OTP verification screen
 * Handles: Phone OTP (Firebase) with verificationId from PhoneSignupScreen
 * Also used for email sign-up flow (navigated from EmailSignupScreen)
 */
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Svg, { Path, Rect } from 'react-native-svg';
import { T, FONTS } from '../../theme';
import TopBar from '../../components/TopBar';
import Primary from '../../components/Primary';
import { verifyPhoneOTP, sendPhoneOTP, getPendingConfirmation, clearPendingConfirmation } from '../../firebase/auth';

function PhoneIcon() {
  return (
    <Svg width={64} height={64} viewBox="0 0 64 64" fill="none">
      <Rect width={64} height={64} rx={16} fill={T.accentSoft} />
      <Rect x="18" y="10" width="28" height="44" rx="5" stroke={T.accent} strokeWidth={2} fill="none" />
      <Path d="M26 14h12" stroke={T.accent} strokeWidth={2} strokeLinecap="round" />
      <Rect x="28" y="46" width="8" height="3" rx="1.5" fill={T.accent} />
    </Svg>
  );
}

const RESEND_SECONDS = 60;

export default function OTPScreen() {
  const navigation = useNavigation();
  const route      = useRoute();
  const { phone, mode = 'signup' } = route.params || {};
  // confirmation is stored in-memory to avoid non-serializable nav params warning
  const confirmation = getPendingConfirmation();

  const [otp,      setOtp]      = useState(['', '', '', '', '', '']);
  const [loading,  setLoading]  = useState(false);
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [resending, setResending] = useState(false);
  const inputs = useRef([]);

  const allFilled = otp.every(d => d !== '');

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown(c => c - 1), 1000);
    return () => clearInterval(t);
  }, []);

  function handleDigit(value, index) {
    const next = [...otp];
    const digit = value.slice(-1);
    next[index] = digit;
    setOtp(next);
    if (digit && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  }

  function handleBackspace(index) {
    if (!otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
      const next = [...otp];
      next[index - 1] = '';
      setOtp(next);
    }
  }

  // Handle pasting a full 6-digit code
  function handlePaste(value) {
    const digits = value.replace(/\D/g, '').slice(0, 6).split('');
    if (digits.length === 6) {
      setOtp(digits);
      inputs.current[5]?.focus();
    }
  }

  async function handleVerify() {
    if (!allFilled) return;
    setLoading(true);
    const code = otp.join('');

    try {
      await verifyPhoneOTP(confirmation, code);
      clearPendingConfirmation();
      // Auth state observer in AppContext will handle navigation
    } catch (err) {
      Alert.alert('Invalid code', 'The code entered is incorrect or expired. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (countdown > 0 || resending) return;
    setResending(true);
    try {
      // Re-use last recaptcha — user must navigate back to get a new one
      Alert.alert(
        'Resend OTP',
        'Go back and re-enter your phone number to receive a new code.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } finally {
      setResending(false);
    }
  }

  const maskedPhone = phone
    ? phone.slice(0, -4).replace(/\d/g, '•') + phone.slice(-4)
    : '';

  return (
    <SafeAreaView style={styles.safe}>
      <TopBar />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.iconWrap}>
          <PhoneIcon />
        </View>

        <Text style={styles.title}>Verify your{'\n'}number</Text>
        <Text style={styles.subtitle}>
          We sent a 6-digit code to{'\n'}
          <Text style={styles.phoneHint}>{maskedPhone || 'your phone'}</Text>
        </Text>

        <View style={styles.otpRow}>
          {otp.map((digit, i) => (
            <View key={i} style={[styles.otpBox, digit ? styles.otpFilled : styles.otpEmpty, i === otp.findIndex(d => !d) && styles.otpActive]}>
              <TextInput
                ref={r => (inputs.current[i] = r)}
                style={styles.otpInput}
                value={digit}
                onChangeText={v => {
                  if (v.length > 1) { handlePaste(v); return; }
                  handleDigit(v, i);
                }}
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === 'Backspace') handleBackspace(i);
                }}
                keyboardType="number-pad"
                maxLength={6}
                selectTextOnFocus
                caretHidden
              />
            </View>
          ))}
        </View>

        <View style={styles.resendRow}>
          {countdown > 0 ? (
            <>
              <Text style={styles.resendText}>Resend code in </Text>
              <Text style={styles.countdown}>
                {String(Math.floor(countdown / 60)).padStart(2, '0')}:
                {String(countdown % 60).padStart(2, '0')}
              </Text>
            </>
          ) : (
            <TouchableOpacity onPress={handleResend}>
              <Text style={styles.resendLink}>Resend code</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.altLink} onPress={() => navigation.goBack()}>
          <Text style={styles.altText}>Use a different number</Text>
        </TouchableOpacity>

        <Primary
          label={loading ? '' : 'Verify & continue'}
          onPress={handleVerify}
          disabled={!allFilled || loading}
          style={{ marginTop: 24 }}
        >
          {loading && <ActivityIndicator color="#fff" />}
        </Primary>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: T.bg },
  content: { paddingHorizontal: 24, paddingBottom: 40 },
  iconWrap:{ marginTop: 8, marginBottom: 24 },
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
  phoneHint: { color: T.ink, fontWeight: '600' },
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
  },
  otpFilled:  { backgroundColor: T.field, borderColor: T.hair2 },
  otpEmpty:   { backgroundColor: T.surface, borderColor: T.hair2 },
  otpActive:  { borderColor: T.accent },
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
  resendLink: {
    fontSize: 14,
    color: T.accent,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  altLink:  { alignItems: 'center', paddingVertical: 8 },
  altText:  { fontSize: 14, color: T.accent, textDecorationLine: 'underline' },
});
