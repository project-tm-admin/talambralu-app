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

const INCOME_LABELS = ['<$50K', '$50–100K', '$100–150K', '$150–200K', '$200–250K', '$250–300K', '$300K+'];

export default function EducationScreen() {
  const navigation = useNavigation();
  const { save, saving } = useOnboardingStep();

  const [degree,      setDegree]      = useState('');
  const [university,  setUniversity]  = useState('');
  const [jobTitle,    setJobTitle]    = useState('');
  const [company,     setCompany]     = useState('');
  const [incomeRange, setIncomeRange] = useState('$150–200K');

  const handleContinue = async () => {
    await save({
      education: degree,
      university,
      jobTitle,
      employer: company,
      income:   incomeRange,
    });
    navigation.navigate('Visa');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <TopBar />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Stepper current={6} total={14} />
        <Text style={styles.title}>Education &amp; work</Text>
        <Text style={styles.sub}>What you do matters here. Income range is private — we use it for matching only.</Text>

        <Field label="Highest degree"   value={degree}     onChangeText={setDegree}     placeholder="e.g. MS · Computer Science" />
        <Field label="University"       value={university} onChangeText={setUniversity} placeholder="e.g. UT Austin" />
        <Field label="Job title"        value={jobTitle}   onChangeText={setJobTitle}   placeholder="e.g. Senior Product Manager" />
        <Field label="Company"          value={company}    onChangeText={setCompany}    placeholder="e.g. Stripe" />

        <View style={styles.incomeCard}>
          <View style={styles.incomeHeader}>
            <Text style={styles.incomeLabel}>ANNUAL INCOME · USD</Text>
            <Text style={styles.incomeValue}>{incomeRange}</Text>
          </View>
          <View style={styles.chips}>
            {INCOME_LABELS.map(l => (
              <View
                key={l}
                style={[styles.incomeChip, incomeRange === l && styles.incomeChipSelected]}
              >
                <Text
                  style={[styles.incomeChipText, incomeRange === l && styles.incomeChipTextSelected]}
                  onPress={() => setIncomeRange(l)}
                >
                  {l}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <Primary label="Continue" loading={saving} onPress={handleContinue} style={{ marginTop: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  content: { paddingHorizontal: 24, paddingBottom: 40 },
  title: { fontFamily: FONTS.display, fontSize: 36, color: T.ink, marginBottom: 6 },
  sub: { fontSize: 14, color: T.mute, marginBottom: 24, lineHeight: 20 },
  incomeCard: {
    backgroundColor: T.field, borderWidth: 1, borderColor: T.hair,
    borderRadius: 16, padding: 16, marginBottom: 12,
  },
  incomeHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 14,
  },
  incomeLabel: { fontFamily: FONTS.mono, fontSize: 10, letterSpacing: 1, color: T.mute },
  incomeValue: { fontSize: 13, fontWeight: '600', color: T.ink },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  incomeChip: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 100,
    borderWidth: 1.5, borderColor: T.hair2, backgroundColor: T.bg,
  },
  incomeChipSelected: { borderColor: T.accent, backgroundColor: T.accent },
  incomeChipText: { fontSize: 12, color: T.ink, fontWeight: '500' },
  incomeChipTextSelected: { color: '#fff' },
});
