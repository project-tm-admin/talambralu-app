import React, { useState } from 'react';
import {
  SafeAreaView, ScrollView, TouchableOpacity,
  StyleSheet, View, Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';
import { T, FONTS } from '../../theme';
import TopBar from '../../components/TopBar';
import Stepper from '../../components/Stepper';
import Primary from '../../components/Primary';
import useOnboardingStep from '../../hooks/useOnboardingStep';

const MANAGER_OPTIONS = [
  { id: 'self',     emoji: '🧑',     title: "I'm managing my profile",   sub: "You're filling this out for yourself." },
  { id: 'parent',   emoji: '👨‍👩‍👧', title: 'Parent managing profile',   sub: 'Filling this out for your son or daughter.' },
  { id: 'sibling',  emoji: '🧒',     title: 'Sibling managing profile',  sub: 'Filling this out for your brother or sister.' },
  { id: 'relative', emoji: '🤝',     title: 'Relative managing profile', sub: 'Filling this out for a cousin, niece, or nephew.' },
  { id: 'joint',    emoji: '👥',     title: 'Jointly managed',           sub: 'You and family will edit this profile together.' },
];

function RadioCheck({ selected }) {
  if (selected) {
    return (
      <View style={styles.radioSelected}>
        <Svg width={14} height={14} viewBox="0 0 14 14">
          <Path d="M3 7l3 3 5-5" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </View>
    );
  }
  return <View style={styles.radioEmpty} />;
}

function ManagerRow({ item, selected, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.row, selected && styles.rowSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.emojiWrap}>
        <Text style={styles.emoji}>{item.emoji}</Text>
      </View>
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{item.title}</Text>
        <Text style={styles.rowSub}>{item.sub}</Text>
      </View>
      <RadioCheck selected={selected} />
    </TouchableOpacity>
  );
}

export default function ProfileManagerScreen() {
  const navigation = useNavigation();
  const { save, saving } = useOnboardingStep();
  const [selected, setSelected] = useState('self');

  const handleContinue = async () => {
    await save({ managedBy: selected });
    navigation.navigate('Verify');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <TopBar />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Stepper current={14} total={15} />
        <Text style={styles.title}>Who's managing{'\n'}this profile?</Text>
        <Text style={styles.subtitle}>
          In Telugu matrimony, families often guide the journey together. Tell us who's at the wheel.
        </Text>
        {MANAGER_OPTIONS.map(item => (
          <ManagerRow
            key={item.id}
            item={item}
            selected={selected === item.id}
            onPress={() => setSelected(item.id)}
          />
        ))}
        <View style={{ height: 16 }} />
      </ScrollView>

      <View style={styles.footer}>
        <Primary label="Continue" loading={saving} onPress={handleContinue} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  content: { paddingHorizontal: 24, paddingBottom: 8 },
  title: {
    fontFamily: FONTS.display, fontSize: 34, color: T.ink,
    lineHeight: 42, marginBottom: 8,
  },
  subtitle: { fontSize: 14, color: T.mute, lineHeight: 21, marginBottom: 20 },
  row: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1.5,
    borderColor: T.hair2, borderRadius: 14, padding: 14,
    marginBottom: 10, backgroundColor: T.bg,
  },
  rowSelected: { borderColor: T.accent },
  emojiWrap: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: '#F5EFE6',
    justifyContent: 'center', alignItems: 'center', marginRight: 14, flexShrink: 0,
  },
  emoji: { fontSize: 22 },
  rowText: { flex: 1 },
  rowTitle: { fontSize: 15, fontWeight: '600', color: T.ink, marginBottom: 3 },
  rowSub: { fontSize: 13, color: T.mute, lineHeight: 18 },
  radioSelected: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: T.accent,
    justifyContent: 'center', alignItems: 'center', marginLeft: 10, flexShrink: 0,
  },
  radioEmpty: {
    width: 24, height: 24, borderRadius: 12, borderWidth: 1.5,
    borderColor: T.hair2, marginLeft: 10, flexShrink: 0,
  },
  footer: {
    paddingHorizontal: 24, paddingTop: 12, paddingBottom: 24,
    backgroundColor: T.bg, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: T.hair,
  },
});
