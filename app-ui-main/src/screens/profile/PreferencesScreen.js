import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle } from 'react-native-svg';
import { T, FONTS } from '../../theme';
import TopBar from '../../components/TopBar';
import Stepper from '../../components/Stepper';
import Chip from '../../components/Chip';
import Primary from '../../components/Primary';

function ChevronRight() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path d="M9 18l6-6-6-6" stroke={T.mute} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function PrefCard({ title, value, onPress, children }) {
  return (
    <TouchableOpacity style={styles.prefCard} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.prefHeader}>
        <Text style={styles.prefTitle}>{title}</Text>
        {value ? <Text style={styles.prefValue}>{value}</Text> : <ChevronRight />}
      </View>
      {children}
    </TouchableOpacity>
  );
}

function AgeSlider() {
  return (
    <View style={styles.sliderWrap}>
      <View style={styles.sliderTrack}>
        <View style={styles.sliderFillDual} />
        <View style={[styles.sliderThumb, { left: '15%' }]} />
        <View style={[styles.sliderThumb, { left: '65%' }]} />
      </View>
      <View style={styles.sliderLabels}>
        <Text style={styles.sliderLabel}>24</Text>
        <Text style={styles.sliderCenter}>24 – 35 years</Text>
        <Text style={styles.sliderLabel}>35</Text>
      </View>
    </View>
  );
}

const TONGUE_PREFS = ['Telugu', 'Tamil', 'Kannada', 'Hindi', 'Any'];
const VISA_PREFS = ['H-1B', 'Green Card', 'Citizen', 'Any'];
const DIET_PREFS = ['Vegetarian', 'Any'];
const EDU_PREFS = ["Bachelor's", "Master's", 'PhD', 'Any'];

export default function PreferencesScreen() {
  const navigation = useNavigation();
  const [tongue, setTongue] = useState('Telugu');
  const [visa, setVisa] = useState('Any');
  const [diet, setDiet] = useState('Any');
  const [edu, setEdu] = useState("Master's");

  return (
    <SafeAreaView style={styles.safe}>
      <TopBar onSkip={() => navigation.navigate('Verify')} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Stepper current={13} total={14} />
        <Text style={styles.title}>Who are you{'\n'}looking for?</Text>
        <Text style={styles.subtitle}>These are soft preferences — we'll show great matches even outside them</Text>

        <PrefCard title="Age range">
          <AgeSlider />
        </PrefCard>

        <PrefCard title="Distance" value="Within 100 miles" />

        <PrefCard title="Mother tongue">
          <View style={styles.prefChips}>
            {TONGUE_PREFS.map(t => (
              <Chip key={t} label={t} selected={tongue === t} onPress={() => setTongue(t)} />
            ))}
          </View>
        </PrefCard>

        <PrefCard title="Education">
          <View style={styles.prefChips}>
            {EDU_PREFS.map(e => (
              <Chip key={e} label={e} selected={edu === e} onPress={() => setEdu(e)} />
            ))}
          </View>
        </PrefCard>

        <PrefCard title="Visa status">
          <View style={styles.prefChips}>
            {VISA_PREFS.map(v => (
              <Chip key={v} label={v} selected={visa === v} onPress={() => setVisa(v)} />
            ))}
          </View>
        </PrefCard>

        <PrefCard title="Diet">
          <View style={styles.prefChips}>
            {DIET_PREFS.map(d => (
              <Chip key={d} label={d} selected={diet === d} onPress={() => setDiet(d)} />
            ))}
          </View>
        </PrefCard>

        <Primary
          label="Continue"
          onPress={() => navigation.navigate('Verify')}
          style={{ marginTop: 16 }}
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: T.mute,
    marginBottom: 24,
    lineHeight: 20,
  },
  prefCard: {
    borderWidth: 1,
    borderColor: T.hair2,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  prefHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  prefTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: T.ink,
  },
  prefValue: {
    fontSize: 14,
    color: T.mute,
  },
  prefChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  sliderWrap: { marginTop: 8 },
  sliderTrack: {
    height: 4,
    backgroundColor: T.hair2,
    borderRadius: 2,
    position: 'relative',
    marginBottom: 10,
  },
  sliderFillDual: {
    position: 'absolute',
    left: '15%',
    right: '35%',
    top: 0,
    bottom: 0,
    backgroundColor: T.accent,
    borderRadius: 2,
  },
  sliderThumb: {
    position: 'absolute',
    top: -8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: T.accent,
    borderWidth: 3,
    borderColor: '#fff',
    marginLeft: -10,
    elevation: 3,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sliderLabel: { fontSize: 12, color: T.mute, fontFamily: FONTS.mono },
  sliderCenter: { fontSize: 13, fontWeight: '600', color: T.ink },
});
