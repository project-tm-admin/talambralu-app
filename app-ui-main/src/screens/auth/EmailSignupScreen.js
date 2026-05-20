import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle } from 'react-native-svg';
import { T, FONTS } from '../../theme';
import TopBar from '../../components/TopBar';
import Field from '../../components/Field';
import Primary from '../../components/Primary';
import { auth } from '../../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

function EyeIcon({ visible }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z"
        stroke={T.mute} strokeWidth={1.8} strokeLinecap="round" />
      <Circle cx="12" cy="12" r="3" stroke={T.mute} strokeWidth={1.8} />
      {!visible && <Path d="M2 2L22 22" stroke={T.mute} strokeWidth={1.8} strokeLinecap="round" />}
    </Svg>
  );
}

function CheckMark({ done }) {
  return (
    <View style={[styles.checkCircle, done && styles.checkDone]}>
      {done && (
        <Svg width={10} height={10} viewBox="0 0 10 10">
          <Path d="M2 5L4 7L8 3" stroke="white" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      )}
    </View>
  );
}

function getStrength(pw) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/\W/.test(pw)) s++;
  return s;
}

const STRENGTH_COLORS = ['#E53E3E', '#E57732', '#D4AC0D', '#3D8A5C'];
const STRENGTH_LABELS = ['', 'WEAK', 'FAIR', 'GOOD', 'STRONG'];

export default function EmailSignupScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [marketing, setMarketing] = useState(true);
  const [loading, setLoading] = useState(false);

  const strength = getStrength(password);
  const reqs = [
    { label: '8+ characters', done: password.length >= 8 },
    { label: 'One number', done: /\d/.test(password) },
    { label: 'Upper & lowercase', done: /[A-Z]/.test(password) && /[a-z]/.test(password) },
    { label: 'Symbol (!@#$)', done: /\W/.test(password) },
  ];

  const handleCreateAccount = async () => {
    if (!email || !password || !name) {
      Alert.alert('Missing Info', 'Please fill in all fields.');
      return;
    }

    if (strength < 2) {
      Alert.alert('Weak Password', 'Please choose a stronger password.');
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const parts = name.trim().split(' ');
      const firstName = parts[0];
      const lastName = parts.length > 1 ? parts.slice(1).join(' ') : '';
      
      navigation.navigate('NameDOB', { firstName, lastName });
    } catch (err) {
      console.error('Email Signup Error', err);
      Alert.alert('Signup Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <TopBar />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.sub}>Use the email your family checks too — important match updates land here.</Text>

        <Field label="Full name" value={name} onChangeText={setName} placeholder="Anika Talluri" />
        <Field label="Email" value={email} onChangeText={setEmail} placeholder="anika@example.com" keyboardType="email-address" />

        {/* Password — custom cement box to keep eye toggle + strength meter */}
        <View style={styles.passBox}>
          <View style={styles.passHeader}>
            <Text style={styles.passLabel}>PASSWORD</Text>
            {strength === 4 && <Text style={styles.strongLabel}>STRONG</Text>}
          </View>
          <View style={styles.passRow}>
            <TextInput
              style={styles.passInput}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPass}
              autoCapitalize="none"
              underlineColorAndroid="transparent"
            />
            <TouchableOpacity onPress={() => setShowPass(v => !v)} style={styles.eyeBtn}>
              <EyeIcon visible={showPass} />
            </TouchableOpacity>
          </View>
          <View style={styles.strengthRow}>
            {[1, 2, 3, 4].map(i => (
              <View key={i} style={[styles.bar, { backgroundColor: i <= strength ? STRENGTH_COLORS[Math.min(strength - 1, 3)] : T.hair2 }]} />
            ))}
            {strength > 0 && (
              <Text style={[styles.strengthLabel, { color: STRENGTH_COLORS[Math.min(strength - 1, 3)] }]}>
                {STRENGTH_LABELS[strength]}
              </Text>
            )}
          </View>
        </View>

        {/* Requirements grid */}
        <View style={styles.reqGrid}>
          {reqs.map((r, i) => (
            <View key={i} style={styles.reqItem}>
              <CheckMark done={r.done} />
              <Text style={[styles.reqText, r.done && styles.reqDone]}>{r.label}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.checkRow} onPress={() => setMarketing(v => !v)} activeOpacity={0.7}>
          <View style={[styles.checkbox, marketing && styles.checkboxOn]}>
            {marketing && (
              <Svg width={10} height={10} viewBox="0 0 10 10">
                <Path d="M2 5L4 7L8 3" stroke="white" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            )}
          </View>
          <Text style={styles.checkLabel}>Email me weekly handpicked matches and success stories.</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.primaryBtn, (!email || !password || !name || loading) && styles.primaryBtnDisabled]} 
          onPress={handleCreateAccount}
          disabled={!email || !password || !name || loading}
        >
            {loading ? <ActivityIndicator color="#fff"/> : <Text style={styles.primaryLabel}>Create account</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('PhoneSignup')} style={styles.signInLink}>
          <Text style={styles.signInText}>Have an account? <Text style={styles.signInBold}>Sign in</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  content: { paddingHorizontal: 24, paddingBottom: 40 },
  title: { fontFamily: FONTS.display, fontSize: 36, color: T.ink, marginBottom: 6, marginTop: 4 },
  sub: { fontSize: 14, color: T.mute, marginBottom: 24, lineHeight: 20 },
  passBox: {
    backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: T.hair,
    borderRadius: 16, paddingHorizontal: 16, paddingTop: 10, paddingBottom: 12, marginBottom: 12,
  },
  passHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  passLabel: { fontFamily: FONTS.mono, fontSize: 10, letterSpacing: 1, color: T.mute },
  strongLabel: { fontFamily: FONTS.mono, fontSize: 10, letterSpacing: 1, color: T.verify, fontWeight: '700' },
  passRow: { flexDirection: 'row', alignItems: 'center' },
  passInput: { flex: 1, fontSize: 16, color: T.ink, padding: 0, margin: 0 },
  eyeBtn: { padding: 4 },
  strengthRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 10 },
  bar: { flex: 1, height: 3, borderRadius: 2 },
  strengthLabel: { fontFamily: FONTS.mono, fontSize: 10, letterSpacing: 1, marginLeft: 4 },
  reqGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  reqItem: { flexDirection: 'row', alignItems: 'center', gap: 6, width: '47%' },
  checkCircle: {
    width: 16, height: 16, borderRadius: 8, borderWidth: 1.5,
    borderColor: T.hair2, justifyContent: 'center', alignItems: 'center',
  },
  checkDone: { backgroundColor: T.verify, borderColor: T.verify },
  reqText: { fontSize: 12, color: T.mute, flex: 1 },
  reqDone: { color: T.verify },
  checkRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 8 },
  checkbox: {
    width: 20, height: 20, borderRadius: 5, borderWidth: 1.5,
    borderColor: T.hair2, justifyContent: 'center', alignItems: 'center', marginTop: 1,
  },
  checkboxOn: { backgroundColor: T.accent, borderColor: T.accent },
  checkLabel: { flex: 1, fontSize: 13, color: T.mute, lineHeight: 20 },
  signInLink: { alignItems: 'center', marginTop: 20 },
  signInText: { fontSize: 14, color: T.mute },
  signInBold: { color: T.accent, fontWeight: '600' },
  primaryBtn: {
      height: 52,
      borderRadius: 100,
      backgroundColor: T.ink,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
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