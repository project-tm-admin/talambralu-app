import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';
import { T, FONTS } from '../../theme';

const BG = '#FFFFFF';

function BackIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M20 12H4M4 12l6-6M4 12l6 6" stroke={T.ink} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function PillSelector({ options, selected, onSelect, wrap = false }) {
  return (
    <View style={[styles.pillRow, wrap && styles.pillWrap]}>
      {options.map(opt => {
        const active = selected === opt;
        return (
          <TouchableOpacity
            key={opt}
            style={[styles.pill, active && styles.pillActive]}
            onPress={() => onSelect(opt)}
            activeOpacity={0.7}
          >
            <Text style={[styles.pillText, active && styles.pillTextActive]}>{opt}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function EditBasicsScreen() {
  const navigation = useNavigation();

  const [firstName, setFirstName]       = useState('Anika');
  const [lastName, setLastName]         = useState('Talluri');
  const [height, setHeight]             = useState("5'5\"");
  const [complexion, setComplexion]     = useState('Wheatish');
  const [gender, setGender]             = useState('Woman');
  const [location, setLocation]         = useState('San Francisco, CA');
  const [religion, setReligion]         = useState('Hindu');
  const [community, setCommunity]       = useState('Kamma');
  const [diet, setDiet]                 = useState('Vegetarian');
  const [managedBy, setManagedBy]       = useState('Self');
  const [firstFocused, setFirstFocused] = useState(true);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.topBtn} hitSlop={8}>
          <BackIcon />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>EDIT BASICS</Text>
        <View style={styles.topSaveBtn} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── NAME ─────────────────────────────────────────────────────── */}
        <Text style={styles.sectionLabel}>NAME</Text>
        <View style={styles.row2}>
          <View style={[styles.inputCard, styles.halfCard, firstFocused && styles.inputCardActive]}>
            <Text style={[styles.fieldLabel, firstFocused && styles.fieldLabelActive]}>FIRST NAME</Text>
            <TextInput
              style={styles.fieldInput}
              value={firstName}
              onChangeText={setFirstName}
              onFocus={() => setFirstFocused(true)}
              onBlur={() => setFirstFocused(false)}
            />
          </View>
          <View style={[styles.inputCard, styles.halfCard]}>
            <Text style={styles.fieldLabel}>LAST NAME</Text>
            <TextInput
              style={styles.fieldInput}
              value={lastName}
              onChangeText={setLastName}
              onFocus={() => setFirstFocused(false)}
            />
          </View>
        </View>

        {/* ── PHYSICAL ─────────────────────────────────────────────────── */}
        <Text style={styles.sectionLabel}>PHYSICAL</Text>
        <View style={styles.row2}>
          <View style={[styles.inputCard, styles.halfCard]}>
            <Text style={styles.fieldLabel}>HEIGHT</Text>
            <View style={styles.heightRow}>
              <TextInput
                style={[styles.fieldInput, { flex: 1 }]}
                value={height}
                onChangeText={setHeight}
                onFocus={() => setFirstFocused(false)}
              />
              <Text style={styles.heightUnit}>165 CM</Text>
            </View>
          </View>
          <View style={[styles.inputCard, styles.halfCard]}>
            <Text style={styles.fieldLabel}>COMPLEXION</Text>
            <TextInput
              style={styles.fieldInput}
              value={complexion}
              onChangeText={setComplexion}
              onFocus={() => setFirstFocused(false)}
            />
          </View>
        </View>

        {/* ── GENDER ───────────────────────────────────────────────────── */}
        <Text style={styles.sectionLabel}>GENDER</Text>
        <PillSelector
          options={['Woman', 'Man']}
          selected={gender}
          onSelect={setGender}
        />

        {/* ── LOCATION & FAITH ─────────────────────────────────────────── */}
        <Text style={styles.sectionLabel}>LOCATION & FAITH</Text>
        <View style={[styles.inputCard, styles.fullCard]}>
          <Text style={styles.fieldLabel}>CURRENT LOCATION</Text>
          <TextInput
            style={styles.fieldInput}
            value={location}
            onChangeText={setLocation}
            onFocus={() => setFirstFocused(false)}
          />
        </View>
        <View style={[styles.row2, { marginTop: 8 }]}>
          <View style={[styles.inputCard, styles.halfCard]}>
            <Text style={styles.fieldLabel}>RELIGION</Text>
            <TextInput
              style={styles.fieldInput}
              value={religion}
              onChangeText={setReligion}
              onFocus={() => setFirstFocused(false)}
            />
          </View>
          <View style={[styles.inputCard, styles.halfCard]}>
            <Text style={styles.fieldLabel}>COMMUNITY</Text>
            <View style={styles.communityRow}>
              <TextInput
                style={[styles.fieldInput, { flex: 1 }]}
                value={community}
                onChangeText={setCommunity}
                onFocus={() => setFirstFocused(false)}
              />
              <View style={styles.privateChip}>
                <Text style={styles.privateText}>PRIVATE</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── LIFESTYLE · DIET ─────────────────────────────────────────── */}
        <Text style={styles.sectionLabel}>LIFESTYLE · DIET</Text>
        <PillSelector
          options={['Vegetarian', 'Eggetarian', 'Non-veg', 'Vegan']}
          selected={diet}
          onSelect={setDiet}
          wrap
        />

        {/* ── WHO MANAGES THIS PROFILE ──────────────────────────────────── */}
        <Text style={styles.sectionLabel}>WHO MANAGES THIS PROFILE</Text>
        <PillSelector
          options={['Self', 'Parents', 'Sibling', 'Relative']}
          selected={managedBy}
          onSelect={setManagedBy}
        />

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky save button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveBtn} activeOpacity={0.85} onPress={() => navigation.goBack()}>
          <Text style={styles.saveBtnText}>Save basics</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },

  // ── Top bar ──────────────────────────────────────────────────────────────────
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  topBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    width: 70,
  },
  backText: {
    fontSize: 15,
    color: T.ink,
  },
  topTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: FONTS.mono,
    fontSize: 11,
    letterSpacing: 1.5,
    color: T.ink,
  },
  topSaveBtn: {
    width: 70,
    alignItems: 'flex-end',
  },
  saveText: {
    fontSize: 15,
    fontWeight: '600',
    color: T.accent,
  },

  scroll: { paddingHorizontal: 18, paddingTop: 8 },

  // ── Section labels ────────────────────────────────────────────────────────
  sectionLabel: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    letterSpacing: 1.2,
    color: T.mute,
    marginTop: 20,
    marginBottom: 10,
  },

  // ── Input cards ───────────────────────────────────────────────────────────
  row2: {
    flexDirection: 'row',
    gap: 10,
  },
  halfCard: {
    flex: 1,
  },
  fullCard: {
    width: '100%',
  },
  inputCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: T.hair,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 4,
  },
  inputCardActive: {
    borderColor: T.accent,
    borderWidth: 1.5,
  },
  fieldLabel: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    letterSpacing: 1,
    color: T.mute,
  },
  fieldLabelActive: {
    color: T.accent,
  },
  fieldInput: {
    fontSize: 15,
    color: T.ink,
    padding: 0,
  },

  // ── Height row ────────────────────────────────────────────────────────────
  heightRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heightUnit: {
    fontSize: 11,
    color: T.mute,
    marginLeft: 4,
  },

  // ── Community row ─────────────────────────────────────────────────────────
  communityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  privateChip: {
    backgroundColor: T.field,
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  privateText: {
    fontFamily: FONTS.mono,
    fontSize: 8,
    letterSpacing: 0.5,
    color: T.mute,
  },

  // ── Pill selectors ────────────────────────────────────────────────────────
  pillRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pillWrap: {
    flexWrap: 'wrap',
  },
  pill: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 100,
    borderWidth: 1.2,
    borderColor: T.hair,
    backgroundColor: '#fff',
  },
  pillActive: {
    backgroundColor: T.accent,
    borderColor: T.accent,
  },
  pillText: {
    fontSize: 14,
    color: T.ink,
    fontWeight: '500',
  },
  pillTextActive: {
    color: '#fff',
    fontWeight: '600',
  },

  // ── Footer ────────────────────────────────────────────────────────────────
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: BG,
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 32,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: T.hair,
  },
  saveBtn: {
    backgroundColor: T.accent,
    borderRadius: 100,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: T.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
