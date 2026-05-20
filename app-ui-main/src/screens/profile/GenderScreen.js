import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Svg, { Path, Circle } from 'react-native-svg';
import { T, FONTS } from '../../theme';
import TopBar from '../../components/TopBar';
import Stepper from '../../components/Stepper';
import CardRow from '../../components/CardRow';
import { api } from '../../api/client';

function WomanIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="8" r="4" stroke={T.accent} strokeWidth={1.8} />
      <Path d="M12 12v8M9 17h6" stroke={T.accent} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

function ManIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Circle cx="10" cy="10" r="5" stroke={T.accent} strokeWidth={1.8} />
      <Path d="M20 4l-5 5M15 4h5v5" stroke={T.accent} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export default function GenderScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [iAm, setIAm] = useState('Woman');
  const [lookingFor, setLookingFor] = useState('Men');
  const [loading, setLoading] = useState(false);

  const fullName = route.params?.fullName;
  const dob = route.params?.dob;

  const handleContinue = async () => {
    setLoading(true);
    try {
      await api.post('/v1/profiles', {
        fullName,
        dob,
        gender: iAm.toUpperCase() === 'WOMAN' ? 'FEMALE' : 'MALE'
      });
      navigation.navigate('USLocation');
    } catch (err) {
      console.error('Profile Creation Error', err);
      Alert.alert('Error', 'Failed to create profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <TopBar onSkip={() => navigation.navigate('USLocation')} />
      <View style={styles.outer}>
        <Stepper current={2} total={14} />
        <View style={styles.body}>
          <Text style={styles.title}>Tell us about you</Text>
          <Text style={styles.subtitle}>You can update your preferences any time.</Text>

          <Text style={styles.sectionLabel}>I AM</Text>
          <CardRow compact icon={<WomanIcon />} title="Woman" selected={iAm === 'Woman'} onPress={() => setIAm('Woman')} />
          <CardRow compact icon={<ManIcon />} title="Man" selected={iAm === 'Man'} onPress={() => setIAm('Man')} />
          <Text style={[styles.sectionLabel, { marginTop: 12 }]}>LOOKING FOR</Text>
          <CardRow compact title="Men" selected={lookingFor === 'Men'} onPress={() => setLookingFor('Men')} />
          <CardRow compact title="Women" selected={lookingFor === 'Women'} onPress={() => setLookingFor('Women')} />
        </View>
        <TouchableOpacity 
          style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]} 
          onPress={handleContinue}
          disabled={loading}
        >
            {loading ? <ActivityIndicator color="#fff"/> : <Text style={styles.primaryLabel}>Continue</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  outer: { flex: 1, paddingHorizontal: 24, paddingBottom: 24 },
  body: { flex: 1 },
  title: {
    fontFamily: FONTS.display,
    fontSize: 26,
    color: T.ink,
    lineHeight: 32,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: T.mute,
    marginBottom: 16,
    lineHeight: 18,
  },
  sectionLabel: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    letterSpacing: 1.2,
    color: T.mute,
    textTransform: 'uppercase',
    marginBottom: 8,
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