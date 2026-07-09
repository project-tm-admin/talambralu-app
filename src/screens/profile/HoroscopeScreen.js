import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { T, FONTS } from '../../theme';
import TopBar from '../../components/TopBar';
import Stepper from '../../components/Stepper';
import Field from '../../components/Field';
import Primary from '../../components/Primary';
import useOnboardingStep from '../../hooks/useOnboardingStep';

export default function HoroscopeScreen() {
  const navigation = useNavigation();
  const { save, saving } = useOnboardingStep();

  const [birthTime,  setBirthTime]  = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [nakshatra,  setNakshatra]  = useState('');
  const [rasi,       setRasi]       = useState('');
  const [lagna,      setLagna]      = useState('');

  const handleContinue = async () => {
    await save({
      horoscope: {
        birthTime,
        birthPlace,
        nakshatra,
        rasi,
        lagna,
      },
    });
    navigation.navigate('Diet');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <TopBar onSkip={handleContinue} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Stepper current={9} total={14} />
        <Text style={styles.title}>Birth details for horoscope</Text>
        <Text style={styles.sub}>Optional. We'll generate a Jathakam you can share with family.</Text>

        <Field label="Birth time" value={birthTime}  onChangeText={setBirthTime}  placeholder="e.g. 04:32 AM" suffix="IST" mono />
        <Field label="Birth place" value={birthPlace} onChangeText={setBirthPlace} placeholder="e.g. Vijayawada, AP" />

        <View style={styles.gridCard}>
          <Text style={styles.gridHeader}>JATHAKAM DETAILS (OPTIONAL)</Text>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Field label="Nakshatra" value={nakshatra} onChangeText={setNakshatra} placeholder="e.g. Rohini" />
            </View>
            <View style={{ flex: 1 }}>
              <Field label="Rasi" value={rasi} onChangeText={setRasi} placeholder="e.g. Vrishabha" />
            </View>
          </View>
          <Field label="Lagna" value={lagna} onChangeText={setLagna} placeholder="e.g. Mesha" />
        </View>

        <Text style={styles.note}>• You can share or hide your horoscope per match.</Text>

        <Primary label="Continue" loading={saving} onPress={handleContinue} style={{ marginTop: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  content: { paddingHorizontal: 24, paddingBottom: 40 },
  title: { fontFamily: FONTS.display, fontSize: 34, color: T.ink, marginBottom: 6 },
  sub: { fontSize: 14, color: T.mute, marginBottom: 24, lineHeight: 20 },
  gridCard: { borderWidth: 1, borderColor: T.hair, borderRadius: 16, padding: 16, marginBottom: 16 },
  gridHeader: {
    fontFamily: FONTS.mono, fontSize: 10, letterSpacing: 1.2,
    color: T.mute, marginBottom: 14,
  },
  row: { flexDirection: 'row', gap: 12 },
  note: { fontSize: 13, color: T.mute, lineHeight: 20 },
});
