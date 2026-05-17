import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle } from 'react-native-svg';
import { T, FONTS } from '../../theme';
import TopBar from '../../components/TopBar';
import Stepper from '../../components/Stepper';
import Field from '../../components/Field';
import Primary from '../../components/Primary';

function ParentIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Circle cx="9" cy="7" r="3" stroke={T.accent} strokeWidth={1.8} />
      <Circle cx="16" cy="7" r="3" stroke={T.accent} strokeWidth={1.8} />
      <Path d="M3 20c0-3.3 2.7-6 6-6h1M11 20c0-3.3 2.7-6 6-6s6 2.7 6 6"
        stroke={T.accent} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

export default function FamilyScreen() {
  const navigation = useNavigation();
  const [fatherProf, setFatherProf] = useState('Retired · Civil engineer');
  const [motherProf, setMotherProf] = useState('Homemaker');
  const [brothers, setBrothers] = useState('1');
  const [sisters, setSisters] = useState('0');
  const [familyLoc, setFamilyLoc] = useState('Vijayawada, India');

  return (
    <SafeAreaView style={styles.safe}>
      <TopBar onSkip={() => navigation.navigate('Horoscope')} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Stepper current={8} total={14} />
        <Text style={styles.title}>Your family</Text>
        <Text style={styles.sub}>Family matters in matchmaking. Add what you're comfortable sharing.</Text>

        <Field label="Father's profession" value={fatherProf} onChangeText={setFatherProf} placeholder="e.g. Engineer, Business…" />
        <Field label="Mother's profession" value={motherProf} onChangeText={setMotherProf} placeholder="e.g. Teacher, Homemaker…" />

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Field label="Brothers" value={brothers} onChangeText={setBrothers} keyboardType="number-pad" mono />
          </View>
          <View style={{ flex: 1 }}>
            <Field label="Sisters" value={sisters} onChangeText={setSisters} keyboardType="number-pad" mono />
          </View>
        </View>

        <Field label="Family currently lives in" value={familyLoc} onChangeText={setFamilyLoc} placeholder="City, Country" />

        <TouchableOpacity style={styles.copilotCard} activeOpacity={0.7}>
          <View style={styles.copilotIcon}>
            <ParentIcon />
          </View>
          <View style={styles.copilotText}>
            <Text style={styles.copilotTitle}>Add a parent co-pilot</Text>
            <Text style={styles.copilotSub}>Let them help review matches</Text>
          </View>
          <View style={styles.laterChip}>
            <Text style={styles.laterText}>Later</Text>
          </View>
        </TouchableOpacity>

        <Primary label="Continue" onPress={() => navigation.navigate('Horoscope')} style={{ marginTop: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  content: { paddingHorizontal: 24, paddingBottom: 40 },
  title: { fontFamily: FONTS.display, fontSize: 36, color: T.ink, marginBottom: 6 },
  sub: { fontSize: 14, color: T.mute, marginBottom: 24, lineHeight: 20 },
  row: { flexDirection: 'row', gap: 12 },
  copilotCard: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: T.hair, borderRadius: 16,
    padding: 16, gap: 12, marginTop: 8,
  },
  copilotIcon: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: T.field, justifyContent: 'center', alignItems: 'center',
  },
  copilotText: { flex: 1 },
  copilotTitle: { fontSize: 14, fontWeight: '600', color: T.ink2 },
  copilotSub: { fontSize: 12, color: T.mute, marginTop: 2 },
  laterChip: {
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 100, borderWidth: 1, borderColor: T.hair2,
  },
  laterText: { fontSize: 12, color: T.mute },
});
