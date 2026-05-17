import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { T, FONTS } from '../../theme';
import TopBar from '../../components/TopBar';
import Stepper from '../../components/Stepper';
import Field from '../../components/Field';
import Primary from '../../components/Primary';

const RASI_GRID = [
  { label: 'Nakshatra', value: 'Rohini', telugu: 'రోహిణి' },
  { label: 'Rasi', value: 'Vrishabha', telugu: 'వృషభ' },
  { label: 'Pada', value: '2', telugu: '' },
  { label: 'Lagna', value: 'Mesha', telugu: '' },
];

export default function HoroscopeScreen() {
  const navigation = useNavigation();
  const [birthTime, setBirthTime] = useState('04:32 AM');
  const [birthPlace, setBirthPlace] = useState('Vijayawada, AP');

  return (
    <SafeAreaView style={styles.safe}>
      <TopBar onSkip={() => navigation.navigate('Diet')} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Stepper current={9} total={14} />
        <Text style={styles.title}>Birth details for horoscope</Text>
        <Text style={styles.sub}>Optional. We'll generate a Jathakam you can share with family.</Text>

        <Field label="Birth time" value={birthTime} onChangeText={setBirthTime} placeholder="04:32 AM" suffix="IST" mono />
        <Field label="Birth place" value={birthPlace} onChangeText={setBirthPlace} placeholder="Vijayawada, AP" />

        <View style={styles.gridCard}>
          <Text style={styles.gridHeader}>CALCULATED</Text>
          <View style={styles.grid}>
            {RASI_GRID.map((item, i) => (
              <View key={i} style={styles.gridItem}>
                <Text style={styles.gridLabel}>{item.label.toUpperCase()}</Text>
                <Text style={styles.gridValue}>{item.value}</Text>
                {item.telugu ? <Text style={styles.gridTelugu}>{item.telugu}</Text> : null}
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.note}>• You can share or hide your horoscope per match.</Text>

        <Primary label="Continue" onPress={() => navigation.navigate('Diet')} style={{ marginTop: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  content: { paddingHorizontal: 24, paddingBottom: 40 },
  title: { fontFamily: FONTS.display, fontSize: 34, color: T.ink, marginBottom: 6 },
  sub: { fontSize: 14, color: T.mute, marginBottom: 24, lineHeight: 20 },
  gridCard: {
    borderWidth: 1, borderColor: T.hair, borderRadius: 16,
    padding: 16, marginBottom: 16,
  },
  gridHeader: {
    fontFamily: FONTS.mono, fontSize: 10, letterSpacing: 1.2,
    color: T.mute, marginBottom: 14,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  gridItem: {
    width: '47%', backgroundColor: T.field,
    borderRadius: 12, padding: 12,
  },
  gridLabel: {
    fontFamily: FONTS.mono, fontSize: 9, letterSpacing: 1,
    color: T.mute, marginBottom: 4,
  },
  gridValue: {
    fontFamily: FONTS.display, fontSize: 20, color: T.ink,
  },
  gridTelugu: { fontSize: 13, color: T.mute, marginTop: 2 },
  note: { fontSize: 13, color: T.mute, lineHeight: 20 },
});
