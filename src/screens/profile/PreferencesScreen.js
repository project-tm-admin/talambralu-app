import React, { useState, useRef } from 'react';
import {
  SafeAreaView, ScrollView, StyleSheet, View, Text,
  TouchableOpacity, PanResponder,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { T, FONTS } from '../../theme';
import TopBar from '../../components/TopBar';
import Stepper from '../../components/Stepper';
import Chip from '../../components/Chip';
import Primary from '../../components/Primary';
import useOnboardingStep from '../../hooks/useOnboardingStep';

const AGE_MIN = 18;
const AGE_MAX = 60;
const THUMB_SIZE = 26;
const TRACK_H = 2;

const TONGUE_OPTIONS   = ['Telugu', 'Hindi', 'Tamil', 'Any'];
const EDUCATION_OPTIONS = ["Bachelor's or higher", "Master's or higher", 'Any'];
const VISA_OPTIONS     = ['Citizen / PR', 'H-1B / Skilled', 'Any'];
const DIET_OPTIONS     = ['Vegetarian', 'Any'];
const COUNTRY_OPTIONS  = ['USA', 'UK', 'Canada', 'Australia', 'Any'];

function AgeSlider({ lowAge, highAge, onChangeLow, onChangeHigh }) {
  const trackWidthRef  = useRef(0);
  const lowStartFrac   = useRef(0);
  const highStartFrac  = useRef(0);

  const fractionToAge = frac =>
    Math.round(AGE_MIN + Math.max(0, Math.min(1, frac)) * (AGE_MAX - AGE_MIN));

  const lowFrac  = (lowAge  - AGE_MIN) / (AGE_MAX - AGE_MIN);
  const highFrac = (highAge - AGE_MIN) / (AGE_MAX - AGE_MIN);

  const lowResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder:  () => true,
    onPanResponderGrant: () => { lowStartFrac.current = (lowAge - AGE_MIN) / (AGE_MAX - AGE_MIN); },
    onPanResponderMove: (_e, gs) => {
      if (!trackWidthRef.current) return;
      const age = fractionToAge(lowStartFrac.current + gs.dx / trackWidthRef.current);
      onChangeLow(Math.min(age, highAge - 1));
    },
  })).current;

  const highResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder:  () => true,
    onPanResponderGrant: () => { highStartFrac.current = (highAge - AGE_MIN) / (AGE_MAX - AGE_MIN); },
    onPanResponderMove: (_e, gs) => {
      if (!trackWidthRef.current) return;
      const age = fractionToAge(highStartFrac.current + gs.dx / trackWidthRef.current);
      onChangeHigh(Math.max(age, lowAge + 1));
    },
  })).current;

  return (
    <View
      style={styles.sliderOuter}
      onLayout={e => { trackWidthRef.current = e.nativeEvent.layout.width; }}
    >
      <View style={styles.sliderTrack} pointerEvents="none">
        <View style={[styles.sliderFill, { left: `${lowFrac * 100}%`, right: `${(1 - highFrac) * 100}%` }]} />
      </View>
      <View style={[styles.thumbHit, { left: `${lowFrac * 100}%` }]} {...lowResponder.panHandlers}>
        <View style={styles.thumb} />
      </View>
      <View style={[styles.thumbHit, { left: `${highFrac * 100}%` }]} {...highResponder.panHandlers}>
        <View style={styles.thumb} />
      </View>
    </View>
  );
}

function PrefCard({ label, value, children }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardMain}>
        <Text style={styles.cardLabel}>{label}</Text>
        <Text style={styles.cardValue}>{value}</Text>
      </View>
      {children ? <View style={styles.cardSlot}>{children}</View> : null}
    </View>
  );
}

export default function PreferencesScreen() {
  const navigation = useNavigation();
  const { save, saving } = useOnboardingStep();

  const [lowAge,     setLowAge]     = useState(27);
  const [highAge,    setHighAge]    = useState(33);
  const [countries,  setCountries]  = useState(['USA']);
  const [tongue,     setTongue]     = useState('Telugu');
  const [education,  setEducation]  = useState("Bachelor's or higher");
  const [visa,       setVisa]       = useState('Any');
  const [diet,       setDiet]       = useState('Any');

  const toggleCountry = c =>
    setCountries(prev =>
      prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]
    );

  const handleContinue = async () => {
    await save({
      preferences: {
        ageMin:      lowAge,
        ageMax:      highAge,
        countries,
        motherTongue: tongue,
        education,
        visaStatus:  visa,
        diet,
      },
    });
    navigation.navigate('ProfileManager');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <TopBar onSkip={handleContinue} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Stepper current={13} total={15} />
        <Text style={styles.title}>Who are you looking for?</Text>
        <Text style={styles.subtitle}>
          Soft preferences — we'll show good matches even when they don't tick every box.
        </Text>

        <PrefCard label="AGE" value={`${lowAge} – ${highAge}`}>
          <AgeSlider lowAge={lowAge} highAge={highAge} onChangeLow={setLowAge} onChangeHigh={setHighAge} />
        </PrefCard>

        {/* Countries */}
        <View style={styles.card}>
          <View style={styles.cardMain}>
            <Text style={styles.cardLabel}>COUNTRIES</Text>
          </View>
          <View style={[styles.cardSlot, styles.chipsWrap]}>
            {COUNTRY_OPTIONS.map(c => (
              <Chip key={c} label={c} selected={countries.includes(c)} onPress={() => toggleCountry(c)} />
            ))}
          </View>
        </View>

        {/* Single-select prefs */}
        {[
          { label: 'MOTHER TONGUE', options: TONGUE_OPTIONS,    val: tongue,    set: setTongue },
          { label: 'EDUCATION',     options: EDUCATION_OPTIONS, val: education, set: setEducation },
          { label: 'VISA STATUS',   options: VISA_OPTIONS,      val: visa,      set: setVisa },
          { label: 'DIET',          options: DIET_OPTIONS,      val: diet,      set: setDiet },
        ].map(({ label, options, val, set }) => (
          <View key={label} style={styles.card}>
            <View style={styles.cardMain}>
              <Text style={styles.cardLabel}>{label}</Text>
              <Text style={styles.cardValue}>{val}</Text>
            </View>
            <View style={[styles.cardSlot, styles.chipsWrap]}>
              {options.map(o => (
                <Chip key={o} label={o} selected={val === o} onPress={() => set(o)} />
              ))}
            </View>
          </View>
        ))}

        <Primary label="Continue" loading={saving} onPress={handleContinue} style={styles.cta} />
      </ScrollView>
    </SafeAreaView>
  );
}

const HIT = THUMB_SIZE + 18;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  content: { paddingHorizontal: 24, paddingBottom: 48 },
  title: {
    fontFamily: FONTS.display, fontSize: 34, color: T.ink,
    lineHeight: 42, marginBottom: 8,
  },
  subtitle: { fontSize: 14, color: T.mute, lineHeight: 21, marginBottom: 20 },
  card: {
    borderWidth: 1, borderColor: T.hair2, borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 14, marginBottom: 10, backgroundColor: T.bg,
  },
  cardMain: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 },
  cardLabel: {
    fontFamily: FONTS.mono, fontSize: 10, letterSpacing: 1.1,
    textTransform: 'uppercase', color: T.mute, marginTop: 2, flexShrink: 0,
  },
  cardValue: { flex: 1, fontSize: 14, color: T.ink, fontWeight: '500', textAlign: 'right', lineHeight: 20 },
  cardSlot: { marginTop: 16 },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  sliderOuter: {
    height: THUMB_SIZE, marginHorizontal: THUMB_SIZE / 2,
    position: 'relative', justifyContent: 'center',
  },
  sliderTrack: {
    position: 'absolute', left: 0, right: 0, height: TRACK_H,
    top: (THUMB_SIZE - TRACK_H) / 2, backgroundColor: T.hair2, borderRadius: TRACK_H / 2,
  },
  sliderFill: {
    position: 'absolute', top: 0, bottom: 0,
    backgroundColor: T.ink, borderRadius: TRACK_H / 2,
  },
  thumbHit: {
    position: 'absolute', width: HIT, height: HIT,
    marginLeft: -(HIT / 2), top: -(HIT / 2 - THUMB_SIZE / 2),
    justifyContent: 'center', alignItems: 'center',
  },
  thumb: {
    width: THUMB_SIZE, height: THUMB_SIZE, borderRadius: THUMB_SIZE / 2,
    backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: T.ink,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12, shadowRadius: 3, elevation: 3,
  },
  cta: { marginTop: 24 },
});
