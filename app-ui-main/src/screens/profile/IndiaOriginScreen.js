import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { T, FONTS } from '../../theme';
import TopBar from '../../components/TopBar';
import Stepper from '../../components/Stepper';
import Chip from '../../components/Chip';
import Field from '../../components/Field';
import Primary from '../../components/Primary';

const STATES = ['Andhra Pradesh', 'Telangana', 'Other'];
const TONGUES = ['Telugu', 'Hindi', 'English', 'Tamil'];

export default function IndiaOriginScreen() {
  const navigation = useNavigation();
  const [homeState, setHomeState] = useState('Andhra Pradesh');
  const [district, setDistrict] = useState('Krishna');
  const [tongues, setTongues] = useState(['Telugu', 'English']);
  const [community, setCommunity] = useState('Kamma');

  const toggleTongue = t =>
    setTongues(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  return (
    <SafeAreaView style={styles.safe}>
      <TopBar onSkip={() => navigation.navigate('Religion')} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Stepper current={4} total={14} />
        <Text style={styles.title}>Roots in India</Text>
        <Text style={styles.sub}>Used to find culturally-aligned matches. You control what's shown.</Text>

        <Text style={styles.sectionLabel}>HOME STATE</Text>
        <View style={styles.chipsWrap}>
          {STATES.map(s => (
            <Chip key={s} label={s} selected={homeState === s} onPress={() => setHomeState(s)} />
          ))}
        </View>

        <Field label="District" value={district} onChangeText={setDistrict} placeholder="e.g. Krishna, Guntur…" />

        <Text style={styles.sectionLabel}>MOTHER TONGUE</Text>
        <View style={styles.chipsWrap}>
          {TONGUES.map(t => (
            <Chip key={t} label={t} selected={tongues.includes(t)} onPress={() => toggleTongue(t)} />
          ))}
        </View>
        <Text style={styles.hint}>• Pick all that apply — primary first.</Text>

        <Field label="Sub-caste · optional" value={community} onChangeText={setCommunity} suffix="Private" />

        <Primary label="Continue" onPress={() => navigation.navigate('Religion')} style={{ marginTop: 8 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  content: { paddingHorizontal: 24, paddingBottom: 40 },
  title: { fontFamily: FONTS.display, fontSize: 36, color: T.ink, marginBottom: 6 },
  sub: { fontSize: 14, color: T.mute, marginBottom: 24, lineHeight: 20 },
  sectionLabel: {
    fontFamily: FONTS.mono, fontSize: 10, letterSpacing: 1.2,
    color: T.mute, textTransform: 'uppercase', marginBottom: 10,
  },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  hint: { fontSize: 12, color: T.mute, marginBottom: 20, marginTop: -8 },
});
