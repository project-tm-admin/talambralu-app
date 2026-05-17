import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle } from 'react-native-svg';
import { T, FONTS } from '../../theme';
import TopBar from '../../components/TopBar';
import Stepper from '../../components/Stepper';
import Chip from '../../components/Chip';
import Primary from '../../components/Primary';

const HUBS = ['Bay Area', 'New Jersey', 'Houston', 'Dallas', 'Chicago', 'Atlanta', 'Seattle', 'NYC'];

function SearchIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="8" stroke={T.mute} strokeWidth={1.8} />
      <Path d="M21 21l-4.35-4.35" stroke={T.mute} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

function LocationIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke={T.accent} strokeWidth={1.8} fill="none" />
      <Circle cx="12" cy="9" r="2.5" stroke={T.accent} strokeWidth={1.8} />
    </Svg>
  );
}

export default function USLocationScreen() {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('Sunnyvale, CA');
  const [selectedHub, setSelectedHub] = useState('Bay Area');

  return (
    <SafeAreaView style={styles.safe}>
      <TopBar onSkip={() => navigation.navigate('IndiaOrigin')} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Stepper current={3} total={14} />
        <Text style={styles.title}>Where in{'\n'}the U.S.?</Text>

        <View style={styles.searchBar}>
          <SearchIcon />
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Search city or ZIP..."
            placeholderTextColor={T.mute}
          />
        </View>

        <Text style={styles.sectionLabel}>DETECTED LOCATION</Text>
        <TouchableOpacity
          style={[styles.detectedCard, selectedCity === 'Sunnyvale, CA' && styles.detectedSelected]}
          onPress={() => setSelectedCity('Sunnyvale, CA')}
          activeOpacity={0.7}
        >
          <View style={styles.locationIconWrap}>
            <LocationIcon />
          </View>
          <View style={styles.detectedText}>
            <Text style={styles.cityName}>Sunnyvale, CA</Text>
            <Text style={styles.cityMeta}>Santa Clara County · Bay Area</Text>
          </View>
          <View style={[styles.checkCircle, selectedCity === 'Sunnyvale, CA' && styles.checkSelected]}>
            {selectedCity === 'Sunnyvale, CA' && (
              <Svg width={10} height={10} viewBox="0 0 10 10">
                <Path d="M2 5L4 7L8 3" stroke="white" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            )}
          </View>
        </TouchableOpacity>

        <Text style={[styles.sectionLabel, { marginTop: 20 }]}>POPULAR TELUGU HUBS</Text>
        <View style={styles.chipsWrap}>
          {HUBS.map(hub => (
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
          onPress={() => navigation.navigate('IndiaOrigin')}
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
    fontFamily: FONTS.display,
    fontSize: 36,
    color: T.ink,
    lineHeight: 44,
    marginBottom: 24,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.field,
    borderWidth: 1,
    borderColor: T.hair,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: T.ink,
  },
  sectionLabel: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    letterSpacing: 1.2,
    color: T.mute,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  detectedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: T.hair,
    borderRadius: 16,
    padding: 14,
    gap: 12,
  },
  detectedSelected: {
    borderColor: T.accent,
    backgroundColor: '#FFFFFF',
  },
  locationIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: T.field,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detectedText: { flex: 1 },
  cityName: {
    fontSize: 15,
    fontWeight: '600',
    color: T.ink2,
  },
  cityMeta: {
    fontSize: 12,
    color: T.mute,
    marginTop: 2,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: T.hair2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkSelected: {
    backgroundColor: T.accent,
    borderColor: T.accent,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
