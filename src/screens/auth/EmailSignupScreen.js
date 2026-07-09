/**
 * Auth entry screen — sign up via Phone, Google, or Apple
 */
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as AppleAuthentication from 'expo-apple-authentication';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { T, FONTS } from '../../theme';
import TopBar from '../../components/TopBar';
import { signInWithApple } from '../../firebase/auth';

const BG = '#FFFFFF';

function PhoneIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Rect x="5" y="2" width="14" height="20" rx="3" stroke={T.ink} strokeWidth={1.7} />
      <Path d="M9 6h6" stroke={T.ink} strokeWidth={1.7} strokeLinecap="round" />
      <Circle cx="12" cy="18" r="1" fill={T.ink} />
    </Svg>
  );
}

function GoogleIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 48 48">
      <Path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.2l6.8-6.8C35.8 2.2 30.2 0 24 0 14.6 0 6.6 5.4 2.6 13.3l7.9 6.1C12.4 13 17.7 9.5 24 9.5z" />
      <Path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8C43.7 37.2 46.5 31.3 46.5 24.5z" />
      <Path fill="#FBBC05" d="M10.5 28.6A14.7 14.7 0 019.5 24c0-1.6.3-3.2.8-4.6l-7.9-6.1A23.9 23.9 0 000 24c0 3.9.9 7.5 2.6 10.7l7.9-6.1z" />
      <Path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8c-2 1.4-4.6 2.2-7.7 2.2-6.3 0-11.6-3.5-13.5-9l-7.9 6.1C6.6 42.6 14.6 48 24 48z" />
    </Svg>
  );
}

function AppleIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.39-1.32 2.76-2.54 3.99z" fill={T.ink} />
      <Path d="M12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" fill={T.ink} />
    </Svg>
  );
}

function ChevronRight() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path d="M9 6l6 6-6 6" stroke={T.mute} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ShieldIcon() {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2L4 6v6c0 5 3.6 9.7 8 11 4.4-1.3 8-6 8-11V6l-8-4z" stroke={T.mute} strokeWidth={1.6} strokeLinejoin="round" />
    </Svg>
  );
}

function AuthRow({ icon, label, onPress, disabled }) {
  return (
    <TouchableOpacity
      style={[styles.authRow, disabled && styles.authRowDisabled]}
      onPress={onPress}
      activeOpacity={disabled ? 1 : 0.7}
      disabled={!!disabled}
    >
      <View style={styles.authIcon}>{icon}</View>
      <Text style={[styles.authLabel, disabled && styles.authLabelDisabled]}>{label}</Text>
      {!disabled && <ChevronRight />}
      {disabled && <Text style={styles.comingSoon}>soon</Text>}
    </TouchableOpacity>
  );
}

export default function EmailSignupScreen() {
  const navigation = useNavigation();
  const [loadingApple, setLoadingApple] = useState(false);

  async function handleApple() {
    setLoadingApple(true);
    try {
      const Crypto = require('expo-crypto');
      const rawNonce = Math.random().toString(36).substring(2, 34);
      const hashedNonce = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256, rawNonce
      );
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce: hashedNonce,
      });
      await signInWithApple(credential.identityToken, rawNonce);
    } catch (e) {
      if (e.code !== 'ERR_CANCELED') {
        Alert.alert('Apple Sign-In failed', e.message);
      }
    } finally {
      setLoadingApple(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <TopBar showBack />
      <View style={styles.content}>
        <View style={styles.headingBlock}>
          <Text style={styles.heading}>Create account</Text>
          <Text style={styles.tagline}>Rooted in Culture. Designed for Today.</Text>
        </View>

        <View style={styles.optionList}>
          <AuthRow
            icon={<PhoneIcon />}
            label="Continue with Phone"
            onPress={() => navigation.navigate('PhoneSignup')}
          />
          <AuthRow
            icon={<GoogleIcon />}
            label="Continue with Google"
            disabled
          />
          <AuthRow
            icon={<AppleIcon />}
            label="Continue with Apple"
            onPress={handleApple}
          />
        </View>

        <View style={styles.footer}>
          <View style={styles.privacyRow}>
            <ShieldIcon />
            <Text style={styles.privacyText}>PRIVACY PROTECTED</Text>
          </View>
          <View style={styles.signInRow}>
            <Text style={styles.signInText}>Have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignIn')} activeOpacity={0.7}>
              <Text style={styles.signInLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 8, paddingBottom: 36 },
  headingBlock: { marginBottom: 32 },
  heading: {
    fontFamily: FONTS.display,
    fontSize: 40,
    color: T.ink,
    lineHeight: 48,
    marginBottom: 6,
  },
  tagline: {
    fontFamily: FONTS.display,
    fontSize: 15,
    color: T.ink,
    fontStyle: 'italic',
  },
  optionList: { gap: 10 },
  authRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: T.hair2,
    borderRadius: 14,
    backgroundColor: BG,
  },
  authRowDisabled: { opacity: 0.45 },
  authIcon: { width: 24, height: 24, justifyContent: 'center', alignItems: 'center' },
  authLabel: { flex: 1, fontSize: 16, color: T.ink, fontWeight: '500' },
  authLabelDisabled: { color: T.mute },
  comingSoon: {
    fontSize: 10,
    color: T.mute,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  footer: { marginTop: 'auto', alignItems: 'center', gap: 10 },
  privacyRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  privacyText: { fontFamily: FONTS.mono, fontSize: 11, color: T.mute, letterSpacing: 1.2 },
  signInRow: { flexDirection: 'row', alignItems: 'center' },
  signInText: { fontSize: 14, color: T.mute },
  signInLink: { fontSize: 14, fontWeight: '700', color: T.ink },
});
