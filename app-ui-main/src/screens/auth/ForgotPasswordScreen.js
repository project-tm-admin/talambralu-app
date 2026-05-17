import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { T, FONTS } from '../../theme';
import TopBar from '../../components/TopBar';
import Field from '../../components/Field';
import Primary from '../../components/Primary';

function LockIcon() {
  return (
    <Svg width={48} height={48} viewBox="0 0 48 48" fill="none">
      <Rect width={48} height={48} rx={14} fill={T.field} />
      <Rect x="13" y="23" width="22" height="16" rx="3" stroke={T.accent} strokeWidth={2} fill="none" />
      <Path d="M17 23v-6a7 7 0 0114 0v6" stroke={T.accent} strokeWidth={2} strokeLinecap="round" />
      <Circle cx="24" cy="31" r="2" fill={T.accent} />
    </Svg>
  );
}

function ClockIcon() {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={T.mute} strokeWidth={1.5} />
      <Path d="M12 6v6l4 2" stroke={T.mute} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export default function ForgotPasswordScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');

  return (
    <SafeAreaView style={styles.safe}>
      <TopBar />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.iconWrap}>
          <LockIcon />
        </View>

        <Text style={styles.title}>Forgot your{'\n'}password?</Text>
        <Text style={styles.subtitle}>
          Enter your email and we'll send you a reset link. It's valid for 10 minutes.
        </Text>

        <Field label="Email" value={email} onChangeText={setEmail} placeholder="anika@example.com" keyboardType="email-address" />

        <View style={styles.noteBox}>
          <ClockIcon />
          <Text style={styles.noteText}>
            The reset link expires in <Text style={styles.noteBold}>10 minutes</Text>. Check your spam folder if you don't see it.
          </Text>
        </View>

        <Primary
          label="Send reset code"
          onPress={() => navigation.navigate('OTP')}
          style={{ marginTop: 24 }}
        />

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backLink}>
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
            <Path d="M19 12H5M5 12L11 6M5 12L11 18" stroke={T.accent} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
          <Text style={styles.backText}>Back to sign in</Text>
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
    marginBottom: 32,
  },
  fieldWrap: { marginBottom: 16 },
  fieldLabel: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    letterSpacing: 1.2,
    color: T.mute,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  input: {
    backgroundColor: T.field,
    borderWidth: 1,
    borderColor: T.hair,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: T.ink,
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: T.field,
    borderRadius: 12,
    padding: 14,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    color: T.mute,
    lineHeight: 20,
  },
  noteBold: {
    fontWeight: '700',
    color: T.ink,
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 20,
    paddingVertical: 8,
  },
  backText: {
    fontSize: 14,
    color: T.accent,
    fontWeight: '500',
  },
});
