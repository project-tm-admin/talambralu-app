import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';
import { T, FONTS } from '../../theme';
import TopBar from '../../components/TopBar';
import Stepper from '../../components/Stepper';
import Field from '../../components/Field';
import Primary from '../../components/Primary';

function InfoNote({ text }) {
  return (
    <View style={styles.note}>
      <Svg width={15} height={15} viewBox="0 0 24 24" fill="none">
        <Path d="M12 22C17.5 22 22 17.5 22 12S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10z"
          stroke={T.mute} strokeWidth={1.5} />
        <Path d="M12 11v5M12 8h.01" stroke={T.mute} strokeWidth={1.5} strokeLinecap="round" />
      </Svg>
      <Text style={styles.noteText}>{text}</Text>
    </View>
  );
}

export default function NameDOBScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  
  const [firstName, setFirstName] = useState(route.params?.firstName || '');
  const [lastName, setLastName] = useState(route.params?.lastName || '');
  const [month, setMonth] = useState('March');
  const [day, setDay] = useState('14');
  const [year, setYear] = useState('1996');

  return (
    <SafeAreaView style={styles.safe}>
      <TopBar />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Stepper current={1} total={14} />
        <Text style={styles.title}>Your name &amp; birthday</Text>
        <Text style={styles.sub}>This is how matches will see you. You can't change your birthday later.</Text>

        <Field label="First name" value={firstName} onChangeText={setFirstName} placeholder="Anika" />
        <Field label="Last name" value={lastName} onChangeText={setLastName} placeholder="Talluri" />

        <View style={styles.dateRow}>
          <View style={styles.monthCol}>
            <Field label="Month" value={month} onChangeText={setMonth} placeholder="Month" />
          </View>
          <View style={styles.dayCol}>
            <Field label="Day" value={day} onChangeText={setDay} placeholder="DD" keyboardType="number-pad" mono />
          </View>
          <View style={styles.yearCol}>
            <Field label="Year" value={year} onChangeText={setYear} placeholder="YYYY" keyboardType="number-pad" mono />
          </View>
        </View>

        <InfoNote text="Age (29) is shown to matches, not your birthday." />

        <Primary 
          label="Continue" 
          onPress={() => {
            const dob = `${year}-${String(['January','February','March','April','May','June','July','August','September','October','November','December'].indexOf(month) + 1).padStart(2, '0')}-${day.padStart(2, '0')}`;
            navigation.navigate('Gender', { 
              fullName: `${firstName} ${lastName}`,
              dob: dob
            });
          }} 
          style={{ marginTop: 24 }} 
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  content: { paddingHorizontal: 24, paddingBottom: 40 },
  title: { fontFamily: FONTS.display, fontSize: 36, color: T.ink, marginBottom: 6 },
  sub: { fontSize: 14, color: T.mute, marginBottom: 24, lineHeight: 20 },
  dateRow: { flexDirection: 'row', gap: 10 },
  monthCol: { flex: 2 },
  dayCol: { flex: 1 },
  yearCol: { flex: 1.5 },
  note: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: T.field, borderRadius: 12, padding: 14,
  },
  noteText: { flex: 1, fontSize: 13, color: T.mute, lineHeight: 19 },
});
