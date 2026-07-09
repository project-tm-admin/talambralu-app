import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle } from 'react-native-svg';
import { T, FONTS } from '../../theme';
import TopBar from '../../components/TopBar';
import Stepper from '../../components/Stepper';
import Primary from '../../components/Primary';
import { getGender } from '../../store/profile';
import useOnboardingStep from '../../hooks/useOnboardingStep';

const VISA_BY_COUNTRY = {
  USA: [
    { id: 'citizen',   label: 'Citizen',               subtitle: 'USA · UK · Canada · Australia · etc.' },
    { id: 'pr',        label: 'Permanent resident',     subtitle: 'Green Card · ILR · PR · etc.' },
    { id: 'h1b',       label: 'H-1B / Skilled worker',  subtitle: 'With or without I-140 / pending PR', verified: true },
    { id: 'dependent', label: 'Dependent visa',         subtitle: 'H-4 · spouse · partner visa' },
    { id: 'student',   label: 'Student / post-grad',    subtitle: 'F-1 / OPT · Tier 4 · PGWP · 485' },
    { id: 'work',      label: 'Work permit · other',    subtitle: 'L-1 · O-1 · Blue Card · 482 · etc.' },
  ],
  UK: [
    { id: 'citizen',   label: 'British Citizen',        subtitle: 'Born or naturalised' },
    { id: 'ilr',       label: 'Indefinite Leave to Remain', subtitle: 'Settled status · ILR' },
    { id: 'skilled',   label: 'Skilled Worker visa',    subtitle: 'Tier 2 · sponsorship required', verified: true },
    { id: 'dependent', label: 'Dependent / partner',    subtitle: 'Spouse visa · partner visa' },
    { id: 'student',   label: 'Student visa',           subtitle: 'Tier 4 · Graduate route' },
    { id: 'work',      label: 'Other work visa',        subtitle: 'ICT · Global Talent · etc.' },
  ],
  CA: [
    { id: 'citizen',   label: 'Canadian Citizen',       subtitle: 'Born or naturalised' },
    { id: 'pr',        label: 'Permanent Resident',     subtitle: 'PR card holder' },
    { id: 'express',   label: 'Express Entry / LMIA',   subtitle: 'Skilled worker pathway', verified: true },
    { id: 'student',   label: 'Study permit',           subtitle: 'PGWP eligible' },
    { id: 'dependent', label: 'Spousal / dependent',    subtitle: 'Open work permit' },
    { id: 'work',      label: 'Other work permit',      subtitle: 'IEC · TWP · etc.' },
  ],
  AU: [
    { id: 'citizen',   label: 'Australian Citizen',     subtitle: 'Born or naturalised' },
    { id: 'pr',        label: 'Permanent Resident',     subtitle: '189 · 190 · 801 visa' },
    { id: 'skilled',   label: 'Skilled visa',           subtitle: '482 TSS · 186 · 494', verified: true },
    { id: 'student',   label: 'Student visa',           subtitle: '500 · 485 Graduate' },
    { id: 'dependent', label: 'Partner / dependent',    subtitle: '820 · 309 · 100 visa' },
    { id: 'work',      label: 'Other work visa',        subtitle: 'Working holiday · etc.' },
  ],
};

const COUNTRIES = [
  { id: 'USA', code: '🇺🇸', label: 'USA' },
  { id: 'UK',  code: '🇬🇧', label: 'UK' },
  { id: 'CA',  code: '🇨🇦', label: 'Canada' },
  { id: 'AU',  code: '🇦🇺', label: 'Australia' },
];

function VerifiedBadge() {
  return (
    <View style={styles.verifiedBadge}>
      <Svg width={12} height={12} viewBox="0 0 12 12">
        <Circle cx="6" cy="6" r="6" fill={T.verify} />
        <Path d="M3.5 6l1.8 1.8L8.5 4" stroke="white" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
      <Text style={styles.verifiedText}>VERIFIED</Text>
    </View>
  );
}

function StatusRow({ item, selected, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.statusRow, selected && styles.statusRowSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.statusText}>
        <View style={styles.statusTitleRow}>
          <Text style={styles.statusLabel}>{item.label}</Text>
          {item.verified && <VerifiedBadge />}
        </View>
        <Text style={styles.statusSub}>{item.subtitle}</Text>
      </View>
      <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
        {selected && <View style={styles.radioInner} />}
      </View>
    </TouchableOpacity>
  );
}

function CountryChip({ country, selected, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.countryChip, selected && styles.countryChipSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.countryFlag}>{country.code}</Text>
      <Text style={[styles.countryChipLabel, selected && styles.countryChipLabelSelected]}>
        {country.label}
      </Text>
    </TouchableOpacity>
  );
}

export default function VisaScreen() {
  const navigation = useNavigation();
  const { save, saving } = useOnboardingStep();
  const isWoman = getGender() === 'Woman';

  const [selectedCountry, setSelectedCountry] = useState('USA');
  const [selectedStatus,  setSelectedStatus]  = useState('');

  const visaList    = VISA_BY_COUNTRY[selectedCountry] ?? VISA_BY_COUNTRY.USA;
  const countryName = COUNTRIES.find(c => c.id === selectedCountry)?.label ?? 'USA';

  const handleContinue = async () => {
    await save({
      visaCountry: selectedCountry,
      visaStatus:  selectedStatus,
    });
    navigation.navigate('Family');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <TopBar onSkip={handleContinue} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Stepper current={7} total={15} />
        <Text style={styles.title}>Status & immigration</Text>
        <Text style={styles.subtitle}>
          Verified by document. A green check shows up on your profile so matches know it's real.
        </Text>

        {isWoman && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>SETTLED IN</Text>
            <View style={styles.countryGrid}>
              {COUNTRIES.map(c => (
                <CountryChip
                  key={c.id}
                  country={c}
                  selected={selectedCountry === c.id}
                  onPress={() => { setSelectedCountry(c.id); setSelectedStatus(''); }}
                />
              ))}
            </View>
          </View>
        )}

        <Text style={styles.sectionLabel}>
          STATUS – {countryName.toUpperCase()}
        </Text>
        {visaList.map(item => (
          <StatusRow
            key={item.id}
            item={item}
            selected={selectedStatus === item.id}
            onPress={() => setSelectedStatus(item.id)}
          />
        ))}

        <Primary label="Continue" loading={saving} onPress={handleContinue} style={{ marginTop: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  content: { paddingHorizontal: 24, paddingBottom: 40 },
  title: {
    fontFamily: FONTS.display, fontSize: 34, color: T.ink,
    lineHeight: 42, marginBottom: 8,
  },
  subtitle: { fontSize: 14, color: T.mute, lineHeight: 21, marginBottom: 24 },
  section: { marginBottom: 20 },
  sectionLabel: {
    fontFamily: FONTS.mono, fontSize: 10, letterSpacing: 1.2,
    color: T.mute, textTransform: 'uppercase', marginBottom: 10,
  },
  countryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  countryChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 100,
    borderWidth: 1.5, borderColor: T.hair2, backgroundColor: T.bg,
  },
  countryChipSelected: { backgroundColor: T.accent, borderColor: T.accent },
  countryFlag: { fontSize: 13 },
  countryChipLabel: { fontSize: 14, fontWeight: '500', color: T.ink },
  countryChipLabelSelected: { color: '#fff' },
  statusRow: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1.5,
    borderColor: T.hair, borderRadius: 14, paddingHorizontal: 16,
    paddingVertical: 14, marginBottom: 10, backgroundColor: T.bg,
  },
  statusRowSelected: { borderColor: T.accent },
  statusText: { flex: 1 },
  statusTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 },
  statusLabel: { fontSize: 15, fontWeight: '600', color: T.ink },
  statusSub: { fontSize: 13, color: T.mute },
  verifiedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: T.verifySoft, paddingHorizontal: 7,
    paddingVertical: 3, borderRadius: 100,
  },
  verifiedText: { fontSize: 10, fontWeight: '700', color: T.verify, letterSpacing: 0.3 },
  radioOuter: {
    width: 22, height: 22, borderRadius: 11, borderWidth: 1.5,
    borderColor: T.hair2, justifyContent: 'center', alignItems: 'center',
  },
  radioOuterSelected: { borderColor: T.accent, backgroundColor: T.accent },
  radioInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' },
});
