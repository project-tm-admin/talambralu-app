import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Svg, { Path, Circle } from 'react-native-svg';
import { T, FONTS } from '../../theme';
import TopBar from '../../components/TopBar';
import Stepper from '../../components/Stepper';
import Chip from '../../components/Chip';
import Primary from '../../components/Primary';
import useOnboardingStep from '../../hooks/useOnboardingStep';

const COUNTRIES = [
  { code: '🇺🇸', label: 'USA',       id: 'USA' },
  { code: '🇬🇧', label: 'UK',        id: 'UK' },
  { code: '🇨🇦', label: 'Canada',    id: 'CA' },
  { code: '🇦🇺', label: 'Australia', id: 'AU' },
  { code: '🇸🇬', label: 'Singapore', id: 'SG' },
  { code: '🇦🇪', label: 'UAE',       id: 'AE' },
  { code: '🇩🇪', label: 'Germany',   id: 'DE' },
  { code: '🇮🇳', label: 'India',     id: 'IN' },
  { code: '🌍',  label: 'Other',     id: 'OTHER' },
];

const HUBS_GLOBAL = [
  'Dallas–Fort Worth', 'NYC / NJ', 'Bay Area',
  'London', 'Toronto', 'Sydney',
  'Singapore', 'Dubai', 'Frankfurt', 'Hyderabad',
];

const HUBS_USA = [
  'Bay Area', 'Dallas', 'New Jersey', 'Houston',
  'Chicago', 'Atlanta', 'Seattle', 'NYC',
];

function SearchIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="8" stroke={T.mute} strokeWidth={1.8} />
      <Path d="M21 21l-4.35-4.35" stroke={T.mute} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

function NavArrowIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2L19 21L12 17L5 21L12 2Z" stroke={T.accent} strokeWidth={1.8} strokeLinejoin="round" fill="none" />
    </Svg>
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
      <Text style={[styles.countryLabel, selected && styles.countryLabelSelected]}>
        {country.label}
      </Text>
    </TouchableOpacity>
  );
}

export default function USLocationScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { save, saving } = useOnboardingStep();
  const gender = route.params?.gender ?? 'Woman';
  const isWoman = gender === 'Woman';

  const [search,          setSearch]          = useState('');
  const [selectedCountry, setSelectedCountry] = useState('USA');
  const [selectedCity,    setSelectedCity]    = useState('');
  const [selectedHub,     setSelectedHub]     = useState('');

  const hubs = isWoman ? HUBS_GLOBAL : HUBS_USA;

  const handleContinue = async () => {
    await save({
      country: selectedCountry,
      city:    selectedCity || selectedHub || '',
      locationHub: selectedHub,
    });
    navigation.navigate('IndiaOrigin');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <TopBar onSkip={handleContinue} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Stepper current={3} total={15} />

        <Text style={styles.title}>
          {isWoman ? 'Where are you based?' : 'Where in the U.S.?'}
        </Text>
        <Text style={styles.subtitle}>
          {isWoman
            ? "We'll prioritize matches near you, but you can search across countries."
            : "We'll find you the best matches across the U.S."}
        </Text>

        {isWoman && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>COUNTRY</Text>
            <View style={styles.countryGrid}>
              {COUNTRIES.map(c => (
                <CountryChip
                  key={c.id}
                  country={c}
                  selected={selectedCountry === c.id}
                  onPress={() => setSelectedCountry(c.id)}
                />
              ))}
            </View>
          </View>
        )}

        <View style={styles.searchBar}>
          <SearchIcon />
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Search city or postcode"
            placeholderTextColor={T.mute}
          />
        </View>

        <Text style={[styles.sectionLabel, { marginTop: 24 }]}>POPULAR TELUGU HUBS</Text>
        <View style={styles.chipsWrap}>
          {hubs.map(hub => (
            <Chip
              key={hub}
              label={hub}
              selected={selectedHub === hub}
              onPress={() => setSelectedHub(hub)}
            />
          ))}
        </View>

        <Primary
          label="Continue"
          loading={saving}
          onPress={handleContinue}
          style={{ marginTop: 24 }}
        />
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
  subtitle: { fontSize: 14, color: T.mute, lineHeight: 20, marginBottom: 24 },
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
  countryFlag: { fontSize: 14 },
  countryLabel: { fontSize: 14, fontWeight: '500', color: T.ink },
  countryLabelSelected: { color: '#fff' },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: T.field,
    borderWidth: 1, borderColor: T.hair, borderRadius: 14,
    paddingHorizontal: 14, paddingVertical: 12, gap: 10, marginBottom: 20,
  },
  searchInput: { flex: 1, fontSize: 15, color: T.ink },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap' },
});
