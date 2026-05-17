import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Svg, { Path, Circle } from 'react-native-svg';
import { T, FONTS } from '../../theme';
import TopBar from '../../components/TopBar';
import Stepper from '../../components/Stepper';
import CardRow from '../../components/CardRow';
import Primary from '../../components/Primary';
import apiClient from '../../api/client';

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
  const { fullName, dob } = route.params || {};

  const [iAm, setIAm] = useState('Woman');
  const [lookingFor, setLookingFor] = useState('Men');
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    setLoading(true);
    try {
      // Mapping mock UI values to API enum
      const gender = iAm === 'Woman' ? 'FEMALE' : iAm === 'Man' ? 'MALE' : 'OTHER';
      
      await apiClient.post('/profiles', {
        fullName: fullName || 'Test User',
        dob: dob || '1996-03-14',
        gender: gender,
      });
      
      navigation.navigate('USLocation');
    } catch (error) {
      console.error(error);
      Alert.alert('Profile Error', error.response?.data?.message || error.message);
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
        
        {loading ? (
          <ActivityIndicator size="large" color={T.accent} />
        ) : (
          <Primary label="Continue" onPress={handleContinue} />
        )}
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
});
