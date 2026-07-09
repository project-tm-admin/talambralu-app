/**
 * Forgot Password — email reset link via Firebase
 */
import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Rect } from 'react-native-svg';
import { T, FONTS } from '../../theme';
import TopBar from '../../components/TopBar';
import Primary from '../../components/Primary';
import { forgotPassword } from '../../firebase/auth';

function EmailIcon() {
  return (
    <Svg width={64} height={64} viewBox="0 0 64 64" fill="none">
      <Rect width={64} height={64} rx={16} fill={T.accentSoft} />
      <Rect x="12" y="20" width="40" height="26" rx="4" stroke={T.accent} strokeWidth={2} fill="none" />
      <Path d="M12 24l20 14 20-14" stroke={T.accent} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export default function ForgotPasswordScreen() {
  const navigation = useNavigation();
  const [email,   setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);

  const isValid = /\S+@\S+\.\S+/.test(email);

  async function handleSubmit() {
    if (!isValid) return;
    setLoading(true);
    try {
      await forgotPassword(email.trim().toLowerCase());
      setSent(true);
    } catch (err) {
      Alert.alert('Error', err.message || 'Could not send reset email. Check the address and try again.');
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <SafeAreaView style={styles.safe}>
        <TopBar showBack />
        <View style={styles.successContent}>
          <EmailIcon />
          <Text style={styles.successTitle}>Check your inbox</Text>
          <Text style={styles.successBody}>
            We sent a password reset link to{'\n'}
            <Text style={{ fontWeight: '700', color: T.ink }}>{email}</Text>
          </Text>
          <Primary
            label="Back to sign in"
            onPress={() => navigation.navigate('SignIn')}
            style={{ marginTop: 32 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <TopBar showBack />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.content}>
          <View style={styles.iconWrap}><EmailIcon /></View>
          <Text style={styles.heading}>Forgot{'\n'}password?</Text>
          <Text style={styles.sub}>Enter your email and we'll send you a reset link.</Text>

          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="your@email.com"
            placeholderTextColor={T.mute}
            keyboardType="email-address"
            autoCapitalize="none"
            autoFocus
          />

          <Primary
            label={loading ? '' : 'Send reset link'}
            onPress={handleSubmit}
            disabled={!isValid || loading}
            style={{ marginTop: 16 }}
          >
            {loading && <ActivityIndicator color="#fff" />}
          </Primary>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 8 },
  iconWrap: { marginTop: 8, marginBottom: 24 },
  heading: {
    fontFamily: FONTS.display,
    fontSize: 38,
    color: T.ink,
    lineHeight: 46,
    marginBottom: 10,
  },
  sub: { fontSize: 14, color: T.mute, lineHeight: 20, marginBottom: 28 },
  input: {
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: T.hair2,
    borderRadius: 14,
    fontSize: 16,
    color: T.ink,
    backgroundColor: T.bg,
  },
  successContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    alignItems: 'center',
    gap: 16,
  },
  successTitle: {
    fontFamily: FONTS.display,
    fontSize: 32,
    color: T.ink,
    marginTop: 8,
  },
  successBody: {
    fontSize: 15,
    color: T.mute,
    textAlign: 'center',
    lineHeight: 24,
  },
});
