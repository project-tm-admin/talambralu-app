import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { T, FONTS } from '../../theme';
import TopBar from '../../components/TopBar';
import Stepper from '../../components/Stepper';
import Field from '../../components/Field';
import Primary from '../../components/Primary';

function IncomeSlider() {
  return (
    <View style={styles.sliderCard}>
      <View style={styles.sliderHeaderRow}>
        <Text style={styles.sliderLabel}>ANNUAL INCOME · USD</Text>
        <Text style={styles.sliderValue}>$180K – $220K</Text>
      </View>
      <View style={styles.sliderTrack}>
        <View style={styles.sliderFill} />
        <View style={[styles.thumb, { left: '40%' }]} />
        <View style={[styles.thumb, { left: '75%' }]} />
      </View>
      <View style={styles.sliderTicks}>
        <Text style={styles.tick}>$50K</Text>
        <Text style={styles.tick}>$150K</Text>
        <Text style={styles.tick}>$300K+</Text>
      </View>
    </View>
  );
}

export default function EducationScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safe}>
      <TopBar />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Stepper current={6} total={14} />
        <Text style={styles.title}>Education &amp; work</Text>
        <Text style={styles.sub}>What you do matters here. Income range is private — we use it for matching only.</Text>

        <Field label="Highest degree" value="MS · Computer Science" />
        <Field label="University" value="UT Austin" />
        <Field label="Job title" value="Senior Product Manager" />
        <Field label="Company" value="Stripe" />

        <IncomeSlider />

        <Primary label="Continue" onPress={() => navigation.navigate('Visa')} style={{ marginTop: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  content: { paddingHorizontal: 24, paddingBottom: 40 },
  title: { fontFamily: FONTS.display, fontSize: 36, color: T.ink, marginBottom: 6 },
  sub: { fontSize: 14, color: T.mute, marginBottom: 24, lineHeight: 20 },
  sliderCard: {
    backgroundColor: T.field, borderWidth: 1, borderColor: T.hair,
    borderRadius: 16, padding: 16, marginBottom: 12,
  },
  sliderHeaderRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16,
  },
  sliderLabel: {
    fontFamily: FONTS.mono, fontSize: 10, letterSpacing: 1, color: T.mute,
  },
  sliderValue: { fontSize: 13, fontWeight: '600', color: T.ink },
  sliderTrack: {
    height: 4, backgroundColor: T.hair2, borderRadius: 2, position: 'relative', marginBottom: 10,
  },
  sliderFill: {
    position: 'absolute', left: '40%', right: '25%',
    top: 0, bottom: 0, backgroundColor: T.accent, borderRadius: 2,
  },
  thumb: {
    position: 'absolute', top: -8, width: 20, height: 20, borderRadius: 10,
    backgroundColor: T.accent, borderWidth: 3, borderColor: '#fff',
    marginLeft: -10, elevation: 3,
  },
  sliderTicks: { flexDirection: 'row', justifyContent: 'space-between' },
  tick: { fontSize: 11, color: T.mute, fontFamily: FONTS.mono },
});
