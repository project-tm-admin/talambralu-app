import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle } from 'react-native-svg';
import { T, FONTS } from '../../theme';
import PhotoPlaceholder from '../../components/PhotoPlaceholder';
import { VerifyDot } from '../../components/VerifyBadge';

const { width } = Dimensions.get('window');

const BASICS = [
  { label: 'PROFESSION', value: 'Senior SWE at Salesforce' },
  { label: 'EDUCATION', value: "MS Computer Science" },
  { label: 'VISA', value: 'H-1B ✓ Verified' },
  { label: 'INCOME', value: '$185K / year' },
  { label: 'RELIGION', value: 'Hindu' },
  { label: 'SUB-CASTE', value: 'Kamma' },
  { label: 'GOTHRAM', value: 'Kashyapa' },
  { label: 'BIRTH STAR', value: 'Mrigashira · Mithuna' },
];

const WAVEFORM = [20, 32, 44, 28, 40, 24, 36, 48, 30, 22, 42, 34, 26, 38, 18, 44, 28, 36, 24, 40];

function BackIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M20 12H4M4 12L10 6M4 12L10 18" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ShareIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" stroke="white" strokeWidth={2} strokeLinecap="round" />
      <Path d="M16 6L12 2 8 6M12 2v13" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function MoreIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="1.5" fill="white" />
      <Circle cx="19" cy="12" r="1.5" fill="white" />
      <Circle cx="5" cy="12" r="1.5" fill="white" />
    </Svg>
  );
}

function XIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M18 6L6 18M6 6l12 12" stroke="#E53E3E" strokeWidth={2.5} strokeLinecap="round" />
    </Svg>
  );
}

function BookmarkIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" stroke={T.ink} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function MicIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path d="M9 2h6v11a3 3 0 01-6 0V2z" stroke={T.accent} strokeWidth={1.6} fill="none" />
      <Path d="M5 10a7 7 0 0014 0M12 19v3M8 22h8" stroke={T.accent} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}

export default function MatchDetailScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero photo */}
        <View style={styles.heroWrap}>
          <PhotoPlaceholder width={width} height={380} label="Anjali R." style={{ borderRadius: 0 }} />

          {/* Overlay buttons */}
          <SafeAreaView style={styles.overlaySafe} edges={['top']}>
            <View style={styles.overlayRow}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.overlayBtn}>
                <BackIcon />
              </TouchableOpacity>
              <View style={styles.overlayRight}>
                <TouchableOpacity style={styles.overlayBtn}>
                  <ShareIcon />
                </TouchableOpacity>
                <TouchableOpacity style={styles.overlayBtn}>
                  <MoreIcon />
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>

          {/* Photo dots */}
          <View style={styles.photoDots}>
            {[0, 1, 2, 3].map(i => (
              <View key={i} style={[styles.photoDot, i === 0 && styles.photoDotActive]} />
            ))}
          </View>
        </View>

        <View style={styles.content}>
          {/* Name + verify */}
          <View style={styles.nameRow}>
            <Text style={styles.name}>Anjali Reddy, 28</Text>
            <VerifyDot size={16} />
          </View>

          {/* Quote prompt */}
          <View style={styles.promptCard}>
            <Text style={styles.promptQ}>What does "home" mean to you?</Text>
            <Text style={styles.promptA}>
              "Home is Vizag sunsets, chai on the porch with Amma, and a Sunday morning run along the Bay Trail. I've learned to carry home with me wherever I go."
            </Text>
          </View>

          {/* Voice intro */}
          <View style={styles.voiceCard}>
            <View style={styles.voiceHeader}>
              <MicIcon />
              <Text style={styles.voiceTitle}>Voice intro · 0:35</Text>
            </View>
            <View style={styles.waveRow}>
              {WAVEFORM.map((h, i) => (
                <View key={i} style={[styles.waveBar, { height: h, backgroundColor: i < 10 ? T.accent : T.hair2 }]} />
              ))}
            </View>
          </View>

          {/* The basics */}
          <Text style={styles.sectionTitle}>The basics</Text>
          <View style={styles.basicsGrid}>
            {BASICS.map((b, i) => (
              <View key={i} style={styles.basicItem}>
                <Text style={styles.basicLabel}>{b.label}</Text>
                <Text style={styles.basicValue}>{b.value}</Text>
              </View>
            ))}
          </View>

          {/* Family */}
          <Text style={styles.sectionTitle}>Family</Text>
          <View style={styles.familyCard}>
            <Text style={styles.familyText}>
              Father is a retired civil engineer; mother runs a boutique in Vizag. One younger sister, Preethi, who is doing her MBA in Austin. Family is based in Visakhapatnam and visits the US every summer.
            </Text>
          </View>

          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {/* Sticky action bar */}
      <SafeAreaView style={styles.stickyBar} edges={['bottom']}>
        <TouchableOpacity style={styles.stickyPass}>
          <XIcon />
          <Text style={styles.stickyPassText}>Pass</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.stickyBookmark}>
          <BookmarkIcon />
          <Text style={styles.stickyBookmarkText}>Shortlist</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.stickyInterest}>
          <Text style={styles.stickyInterestText}>Send interest</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.bg },
  heroWrap: { position: 'relative' },
  overlaySafe: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  overlayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  overlayRight: {
    flexDirection: 'row',
    gap: 8,
  },
  overlayBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoDots: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
  },
  photoDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  photoDotActive: {
    width: 20,
    backgroundColor: '#fff',
  },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  name: {
    fontFamily: FONTS.display,
    fontSize: 26,
    color: T.ink,
  },
  promptCard: {
    backgroundColor: T.field,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
  },
  promptQ: {
    fontFamily: FONTS.display,
    fontSize: 13,
    fontStyle: 'italic',
    color: T.accent,
    marginBottom: 8,
  },
  promptA: {
    fontFamily: FONTS.display,
    fontSize: 16,
    fontStyle: 'italic',
    color: T.ink2,
    lineHeight: 26,
  },
  voiceCard: {
    borderWidth: 1,
    borderColor: T.hair2,
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
  },
  voiceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  voiceTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: T.ink,
  },
  waveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    height: 48,
  },
  waveBar: {
    flex: 1,
    borderRadius: 2,
    minHeight: 3,
  },
  sectionTitle: {
    fontFamily: FONTS.display,
    fontSize: 20,
    color: T.ink,
    marginBottom: 12,
    marginTop: 4,
  },
  basicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  basicItem: {
    width: '47%',
    backgroundColor: T.field,
    borderRadius: 12,
    padding: 12,
  },
  basicLabel: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    letterSpacing: 1,
    color: T.mute,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  basicValue: {
    fontSize: 13,
    fontWeight: '600',
    color: T.ink2,
  },
  familyCard: {
    backgroundColor: T.field,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  familyText: {
    fontSize: 14,
    color: T.ink2,
    lineHeight: 22,
  },
  stickyBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: T.bg,
    borderTopWidth: 1,
    borderTopColor: T.hair,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 10,
  },
  stickyPass: {
    width: 56,
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: T.hair2,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2,
  },
  stickyPassText: {
    fontSize: 10,
    color: '#E53E3E',
    fontWeight: '600',
  },
  stickyBookmark: {
    width: 56,
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: T.hair2,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2,
  },
  stickyBookmarkText: {
    fontSize: 10,
    color: T.ink,
    fontWeight: '600',
  },
  stickyInterest: {
    flex: 1,
    height: 52,
    backgroundColor: T.accent,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stickyInterestText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
