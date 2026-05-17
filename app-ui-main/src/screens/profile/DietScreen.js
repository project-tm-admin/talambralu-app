import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { T, FONTS } from '../../theme';
import TopBar from '../../components/TopBar';
import Stepper from '../../components/Stepper';
import Chip from '../../components/Chip';
import Primary from '../../components/Primary';

const DIET_OPTIONS = ['Vegetarian', 'Jain Vegetarian', 'Eggetarian', 'Non-vegetarian', 'Vegan'];
const DRINKS_OPTIONS = ['Never', 'Socially', 'Regularly'];
const SMOKES_OPTIONS = ['Never', 'Occasionally', 'Regularly'];
const EXERCISE_OPTIONS = ['Daily', 'A few times a week', 'Occasionally', 'Rarely'];

function Section({ title, options, selected, onSelect }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{title}</Text>
      <View style={styles.chipsWrap}>
        {options.map(o => (
          <Chip
            key={o}
            label={o}
            selected={selected === o}
            onPress={() => onSelect(o)}
          />
        ))}
      </View>
    </View>
  );
}

export default function DietScreen() {
  const navigation = useNavigation();
  const [diet, setDiet] = useState('Vegetarian');
  const [drinks, setDrinks] = useState('Socially');
  const [smokes, setSmokes] = useState('Never');
  const [exercise, setExercise] = useState('A few times a week');

  return (
    <SafeAreaView style={styles.safe}>
      <TopBar onSkip={() => navigation.navigate('Photos')} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Stepper current={10} total={14} />
        <Text style={styles.title}>Lifestyle</Text>
        <Text style={styles.subtitle}>Help your match understand your daily habits</Text>

        <Section title="DIET" options={DIET_OPTIONS} selected={diet} onSelect={setDiet} />
        <Section title="DRINKS" options={DRINKS_OPTIONS} selected={drinks} onSelect={setDrinks} />
        <Section title="SMOKES" options={SMOKES_OPTIONS} selected={smokes} onSelect={setSmokes} />
        <Section title="EXERCISE" options={EXERCISE_OPTIONS} selected={exercise} onSelect={setExercise} />

        <Primary
          label="Continue"
          onPress={() => navigation.navigate('Photos')}
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
    fontSize: 14,
    color: T.mute,
    marginBottom: 28,
  },
  section: { marginBottom: 24 },
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
  },
});
