import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';
import { T, FONTS } from '../../theme';
import Chip from '../../components/Chip';

function XIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M18 6L6 18M6 6l12 12" stroke={T.ink} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

const RELIGION_OPTS = ['Hindu', 'Muslim', 'Christian', 'Jain', 'Sikh', 'Any'];
const COMMUNITY_OPTS = ['Kamma', 'Reddy', 'Brahmin', 'Kapu', 'Velama', 'Open to all'];
const VISA_OPTS = ['H-1B', 'L-1', 'Green Card', 'Citizen', 'Any'];
const EDU_OPTS = ["Bachelor's", "Master's", 'PhD', 'Any'];
const DIET_OPTS = ['Vegetarian', 'Non-veg', 'Jain', 'Any'];

function SectionHeader({ title }) {
  return <Text style={styles.sectionHeader}>{title}</Text>;
}

function ToggleRow({ label, active, onToggle }) {
  return (
    <TouchableOpacity style={styles.toggleRow} onPress={onToggle} activeOpacity={0.7}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <View style={[styles.toggleTrack, active && styles.toggleTrackOn]}>
        <View style={[styles.toggleThumb, active && styles.toggleThumbOn]} />
      </View>
    </TouchableOpacity>
  );
}

function AgeSlider() {
  return (
    <View style={styles.sliderWrap}>
      <View style={styles.sliderTrack}>
        <View style={styles.sliderFill} />
        <View style={[styles.sliderThumb, { left: '10%' }]} />
        <View style={[styles.sliderThumb, { left: '70%' }]} />
      </View>
      <View style={styles.sliderLabels}>
        <Text style={styles.sliderLabelText}>22</Text>
        <Text style={styles.sliderRange}>22 – 36 years old</Text>
        <Text style={styles.sliderLabelText}>36</Text>
      </View>
    </View>
  );
}

export default function FiltersScreen() {
  const navigation = useNavigation();
  const [verified, setVerified] = useState(true);
  const [active, setActive] = useState(false);
  const [premium, setPremium] = useState(false);
  const [religion, setReligion] = useState('Hindu');
  const [community, setCommunity] = useState('Open to all');
  const [visa, setVisa] = useState('Any');
  const [edu, setEdu] = useState("Master's");
  const [diet, setDiet] = useState('Any');

  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView edges={['top']}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.topBtn}>
            <XIcon />
          </TouchableOpacity>
          <Text style={styles.topTitle}>Filters</Text>
          <TouchableOpacity
            style={styles.topBtn}
            onPress={() => {
              setVerified(false);
              setActive(false);
              setPremium(false);
              setReligion('Hindu');
              setCommunity('Open to all');
              setVisa('Any');
              setEdu("Master's");
              setDiet('Any');
            }}
          >
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quality */}
        <SectionHeader title="QUALITY" />
        <View style={styles.card}>
          <ToggleRow label="Verified profiles only" active={verified} onToggle={() => setVerified(v => !v)} />
          <ToggleRow label="Active in last 7 days" active={active} onToggle={() => setActive(v => !v)} />
          <ToggleRow label="Premium members" active={premium} onToggle={() => setPremium(v => !v)} />
        </View>

        {/* Age */}
        <SectionHeader title="AGE RANGE" />
        <View style={styles.card}>
          <AgeSlider />
        </View>

        {/* Religion */}
        <SectionHeader title="RELIGION & COMMUNITY" />
        <View style={styles.card}>
          <Text style={styles.chipGroupLabel}>Religion</Text>
          <View style={styles.chipsRow}>
            {RELIGION_OPTS.map(r => (
              <Chip key={r} label={r} selected={religion === r} onPress={() => setReligion(r)} />
            ))}
          </View>
          <Text style={[styles.chipGroupLabel, { marginTop: 8 }]}>Community</Text>
          <View style={styles.chipsRow}>
            {COMMUNITY_OPTS.map(c => (
              <Chip key={c} label={c} selected={community === c} onPress={() => setCommunity(c)} />
            ))}
          </View>
        </View>

        {/* Location & Visa */}
        <SectionHeader title="LOCATION & VISA" />
        <View style={styles.card}>
          <Text style={styles.chipGroupLabel}>Visa status</Text>
          <View style={styles.chipsRow}>
            {VISA_OPTS.map(v => (
              <Chip key={v} label={v} selected={visa === v} onPress={() => setVisa(v)} />
            ))}
          </View>
        </View>

        {/* Education */}
        <SectionHeader title="EDUCATION" />
        <View style={styles.card}>
          <View style={styles.chipsRow}>
            {EDU_OPTS.map(e => (
              <Chip key={e} label={e} selected={edu === e} onPress={() => setEdu(e)} />
            ))}
          </View>
        </View>

        {/* Lifestyle */}
        <SectionHeader title="LIFESTYLE" />
        <View style={styles.card}>
          <Text style={styles.chipGroupLabel}>Diet</Text>
          <View style={styles.chipsRow}>
            {DIET_OPTS.map(d => (
              <Chip key={d} label={d} selected={diet === d} onPress={() => setDiet(d)} />
            ))}
          </View>
        </View>

        {/* Save search CTA */}
        <TouchableOpacity style={styles.saveSearch} activeOpacity={0.7}>
          <Text style={styles.saveSearchText}>+ Save this search</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky footer */}
      <SafeAreaView style={styles.stickyFooter} edges={['bottom']}>
        <Text style={styles.resultCount}>142 results</Text>
        <TouchableOpacity
          style={styles.showBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.showBtnText}>Show matches</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.bg },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: T.hair,
  },
  topBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: T.ink,
  },
  resetText: {
    fontSize: 15,
    color: T.accent,
    fontWeight: '500',
    textAlign: 'right',
  },
  content: { paddingHorizontal: 16, paddingBottom: 20 },
  sectionHeader: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    letterSpacing: 1.2,
    color: T.mute,
    textTransform: 'uppercase',
    marginTop: 20,
    marginBottom: 10,
  },
  card: {
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.hair,
    borderRadius: 16,
    padding: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: T.hair,
  },
  toggleLabel: {
    fontSize: 15,
    color: T.ink,
  },
  toggleTrack: {
    width: 44,
    height: 26,
    borderRadius: 13,
    backgroundColor: T.hair2,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleTrackOn: {
    backgroundColor: T.accent,
  },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    alignSelf: 'flex-start',
  },
  toggleThumbOn: {
    alignSelf: 'flex-end',
  },
  sliderWrap: { paddingVertical: 8 },
  sliderTrack: {
    height: 4,
    backgroundColor: T.hair2,
    borderRadius: 2,
    position: 'relative',
    marginBottom: 12,
  },
  sliderFill: {
    position: 'absolute',
    left: '10%',
    right: '30%',
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
  sliderLabelText: { fontFamily: FONTS.mono, fontSize: 12, color: T.mute },
  sliderRange: { fontSize: 13, fontWeight: '600', color: T.ink },
  chipGroupLabel: {
    fontSize: 12,
    color: T.mute,
    fontWeight: '500',
    marginBottom: 8,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  saveSearch: {
    marginTop: 16,
    borderWidth: 1.5,
    borderColor: T.accent,
    borderStyle: 'dashed',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  saveSearchText: {
    fontSize: 15,
    color: T.accent,
    fontWeight: '600',
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: T.bg,
    borderTopWidth: 1,
    borderTopColor: T.hair,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 12,
  },
  resultCount: {
    fontSize: 15,
    color: T.mute,
    flex: 1,
  },
  showBtn: {
    flex: 2,
    height: 52,
    backgroundColor: T.accent,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  showBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
