import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { T, FONTS } from '../../theme';

const FAMILY_TYPES = ['Nuclear', 'Joint', 'Extended'];
const FAMILY_VALUES = ['Traditional', 'Moderate', 'Liberal'];

function SectionLabel({ title }) {
  return <Text style={styles.sectionLabel}>{title}</Text>;
}

function FieldBox({ label, value, onChangeText, keyboardType }) {
  return (
    <View style={styles.fieldBox}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.fieldValue}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType || 'default'}
        placeholderTextColor={T.mute}
      />
    </View>
  );
}

function PillRow({ options, selected, onSelect }) {
  return (
    <View style={styles.pillRow}>
      {options.map(opt => {
        const isSelected = selected === opt;
        return (
          <TouchableOpacity
            key={opt}
            style={[styles.pill, isSelected ? styles.pillSelected : styles.pillUnselected]}
            onPress={() => onSelect(opt)}
            activeOpacity={0.7}
          >
            <Text style={[styles.pillText, isSelected ? styles.pillTextSelected : styles.pillTextUnselected]}>
              {opt}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function EditFamilyScreen() {
  const navigation = useNavigation();
  const [familyType, setFamilyType] = useState('Nuclear');
  const [familyValues, setFamilyValues] = useState('Moderate');
  const [fatherOccupation, setFatherOccupation] = useState('Retired · Civil engineer');
  const [motherOccupation, setMotherOccupation] = useState('Homemaker');
  const [brothers, setBrothers] = useState('1');
  const [sisters, setSisters] = useState('0');
  const [familyLocation, setFamilyLocation] = useState('Vijayawada, India');

  return (
    <SafeAreaView style={styles.safe}>
      {/* TopBar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.topBarBack}>
          <Text style={styles.topBarBackText}>{'< Back'}</Text>
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>EDIT FAMILY</Text>
        <View style={styles.topBarSave} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Family Type */}
        <View style={styles.section}>
          <SectionLabel title="FAMILY TYPE" />
          <PillRow options={FAMILY_TYPES} selected={familyType} onSelect={setFamilyType} />
        </View>

        {/* Parents */}
        <View style={styles.section}>
          <SectionLabel title="PARENTS" />
          <FieldBox
            label="FATHER'S OCCUPATION"
            value={fatherOccupation}
            onChangeText={setFatherOccupation}
          />
          <FieldBox
            label="MOTHER'S OCCUPATION"
            value={motherOccupation}
            onChangeText={setMotherOccupation}
          />
        </View>

        {/* Siblings */}
        <View style={styles.section}>
          <SectionLabel title="SIBLINGS" />
          <View style={styles.siblingRow}>
            <View style={{ flex: 1 }}>
              <FieldBox
                label="BROTHERS"
                value={brothers}
                onChangeText={setBrothers}
                keyboardType="number-pad"
              />
            </View>
            <View style={{ flex: 1 }}>
              <FieldBox
                label="SISTERS"
                value={sisters}
                onChangeText={setSisters}
                keyboardType="number-pad"
              />
            </View>
          </View>
        </View>

        {/* Roots */}
        <View style={styles.section}>
          <SectionLabel title="ROOTS" />
          <FieldBox
            label="FAMILY CURRENTLY LIVES IN"
            value={familyLocation}
            onChangeText={setFamilyLocation}
          />
        </View>

        {/* Family Values */}
        <View style={styles.section}>
          <SectionLabel title="FAMILY VALUES" />
          <PillRow options={FAMILY_VALUES} selected={familyValues} onSelect={setFamilyValues} />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky Save Button */}
      <View style={styles.stickyBottom}>
        <TouchableOpacity style={styles.saveButton} onPress={() => navigation.goBack()} activeOpacity={0.85}>
          <Text style={styles.saveButtonText}>Save family</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
  },
  topBarBack: {
    minWidth: 60,
  },
  topBarBackText: {
    fontSize: 15,
    color: T.ink,
  },
  topBarTitle: {
    fontFamily: FONTS.mono,
    fontSize: 13,
    letterSpacing: 1.5,
    color: T.ink,
  },
  topBarSave: {
    minWidth: 60,
    alignItems: 'flex-end',
  },
  topBarSaveText: {
    fontSize: 15,
    color: T.accent,
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 28,
  },
  sectionLabel: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    letterSpacing: 1,
    color: T.mute,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 100,
  },
  pillSelected: {
    backgroundColor: T.accent,
  },
  pillUnselected: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: T.hair2,
  },
  pillText: {
    fontSize: 14,
    fontWeight: '600',
  },
  pillTextSelected: {
    color: '#FFFFFF',
  },
  pillTextUnselected: {
    color: T.ink,
  },
  fieldBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: T.hair2,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
  },
  fieldLabel: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    letterSpacing: 1,
    color: T.mute,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 15,
    color: T.ink,
    padding: 0,
  },
  siblingRow: {
    flexDirection: 'row',
    gap: 10,
  },
  stickyBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: T.accent,
    borderRadius: 100,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
