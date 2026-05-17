import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { T, FONTS } from '../../theme';
import TopBar from '../../components/TopBar';
import Stepper from '../../components/Stepper';
import CardRow from '../../components/CardRow';
import Primary from '../../components/Primary';
import VerifyBadge from '../../components/VerifyBadge';

const VISA_TYPES = [
  { id: 'H1B', label: 'H-1B', subtitle: 'Specialty occupation worker', verified: true },
  { id: 'L1', label: 'L-1', subtitle: 'Intracompany transferee' },
  { id: 'O1', label: 'O-1', subtitle: 'Extraordinary ability' },
  { id: 'GC', label: 'Green Card', subtitle: 'Permanent resident' },
  { id: 'USC', label: 'U.S. Citizen', subtitle: 'Born or naturalized' },
  { id: 'F1', label: 'F-1 / OPT / STEM', subtitle: 'Student visa' },
  { id: 'EAD', label: 'EAD (H-4 / L-2)', subtitle: 'Employment authorization' },
];

function ShieldIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2L4 6v6c0 5 3.5 9.7 8 11 4.5-1.3 8-6 8-11V6L12 2z" stroke={T.verify} strokeWidth={1.8} fill={T.verifySoft} />
      <Path d="M8 12l3 3 5-5" stroke={T.verify} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export default function VisaScreen() {
  const navigation = useNavigation();
  const [selected, setSelected] = useState('H1B');

  return (
    <SafeAreaView style={styles.safe}>
      <TopBar onSkip={() => navigation.navigate('Family')} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Stepper current={7} total={14} />
        <Text style={styles.title}>Your status{'\n'}in the U.S.</Text>

        {VISA_TYPES.map(v => (
          <CardRow
            key={v.id}
            title={v.label}
            subtitle={v.subtitle}
            selected={selected === v.id}
            onPress={() => setSelected(v.id)}
            rightEl={
              selected === v.id && v.verified ? (
                <VerifyBadge label="VERIFIED" />
              ) : undefined
            }
          />
        ))}

        <View style={styles.verifyCard}>
          <View style={styles.verifyIconWrap}>
            <ShieldIcon />
          </View>
          <View style={styles.verifyText}>
            <Text style={styles.verifyTitle}>Verify your visa status</Text>
            <Text style={styles.verifySubtitle}>Upload your visa document for a verified badge — 3× more matches</Text>
          </View>
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Path d="M9 18l6-6-6-6" stroke={T.verify} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </View>

        <Primary
          label="Continue"
          onPress={() => navigation.navigate('Family')}
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
    marginBottom: 24,
  },
  verifyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.verifySoft,
    borderWidth: 1,
    borderColor: T.verify,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    marginTop: 8,
  },
  verifyIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(61,138,92,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifyText: { flex: 1 },
  verifyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: T.verify,
  },
  verifySubtitle: {
    fontSize: 12,
    color: '#2D6B48',
    marginTop: 2,
    lineHeight: 18,
  },
});
