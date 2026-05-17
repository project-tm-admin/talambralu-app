import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { T, FONTS } from '../../theme';
import TopBar from '../../components/TopBar';
import Stepper from '../../components/Stepper';
import Chip from '../../components/Chip';
import Field from '../../components/Field';
import Primary from '../../components/Primary';

const RELIGIONS = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain', 'Buddhist', 'No religion', 'Other'];

const IMPORTANCE = ['Very important', 'Somewhat important', 'Open to all faiths'];

function SliderBar({ value, onValueChange }) {
  const pct = value / 2;
  return (
    <View style={styles.sliderWrap}>
      <View style={styles.sliderTrack}>
        <View style={[styles.sliderFill, { width: `${pct * 100}%` }]} />
        <View style={[styles.sliderThumb, { left: `${pct * 100}%` }]} />
      </View>
      <View style={styles.sliderLabels}>
        {IMPORTANCE.map((label, i) => (
          <Text key={i} style={[styles.sliderLabel, value === i && styles.sliderLabelActive]}>
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
}

export default function ReligionScreen() {
  const navigation = useNavigation();
  const [religion, setReligion] = useState('Hindu');
  const [importance, setImportance] = useState(0);
  const [gothram, setGothram] = useState('Kashyapa');
  const [star, setStar] = useState('Rohini');

  return (
    <SafeAreaView style={styles.safe}>
      <TopBar onSkip={() => navigation.navigate('Education')} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Stepper current={5} total={14} />
        <Text style={styles.title}>Faith &{'\n'}family lineage</Text>

        <Text style={styles.sectionLabel}>RELIGION</Text>
        <View style={styles.chipsWrap}>
          {RELIGIONS.map(r => (
            <Chip
              key={r}
              label={r}
              selected={religion === r}
              onPress={() => setReligion(r)}
            />
          ))}
        </View>

        <Text style={styles.sectionLabel}>IMPORTANCE TO YOU</Text>
        <SliderBar value={importance} onValueChange={setImportance} />

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Field label="Gothram · optional" value={gothram} onChangeText={setGothram} placeholder="e.g. Kashyapa" />
          </View>
          <View style={{ flex: 1 }}>
            <Field label="Star" value={star} onChangeText={setStar} placeholder="e.g. Rohini" mono />
          </View>
        </View>

        <Primary
          label="Continue"
          onPress={() => navigation.navigate('Education')}
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
  sectionLabel: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    letterSpacing: 1.2,
    color: T.mute,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  sliderWrap: { marginBottom: 24 },
  sliderTrack: {
    height: 4,
    backgroundColor: T.hair2,
    borderRadius: 2,
    position: 'relative',
    marginBottom: 12,
  },
  sliderFill: {
    position: 'absolute',
    left: 0,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderLabel: {
    fontSize: 11,
    color: T.mute,
    textAlign: 'center',
    maxWidth: 80,
  },
  sliderLabelActive: {
    color: T.accent,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfField: { flex: 1 },
  fieldLabel: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    letterSpacing: 1.2,
    color: T.mute,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  input: {
    backgroundColor: T.field,
    borderWidth: 1,
    borderColor: T.hair,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: T.ink,
  },
});
