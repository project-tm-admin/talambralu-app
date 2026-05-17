import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { T, FONTS } from '../../theme';

function BackArrow() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M20 12H4M4 12L10 6M4 12L10 18" stroke={T.ink} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function FaceIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="8" r="4" stroke={T.mute} strokeWidth={1.6} />
      <Path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={T.mute} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}

function CardIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="5" width="20" height="14" rx="2" stroke={T.mute} strokeWidth={1.6} />
      <Path d="M2 10h20" stroke={T.mute} strokeWidth={1.6} />
      <Path d="M6 15h4" stroke={T.mute} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}

function DollarIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke={T.mute} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}

function GradCapIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M22 10L12 4 2 10l10 6 10-6z" stroke={T.mute} strokeWidth={1.6} strokeLinejoin="round" />
      <Path d="M6 12v5c2 2 8 2 12 0v-5" stroke={T.mute} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}

function PhoneIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M22 16.92v3a2 2 0 01-2.18 2A19.79 19.79 0 012 2.18 2 2 0 014 0h3a2 2 0 012 1.72c.127.96.361 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 7.91A16 16 0 0016.1 15.9l1.27-1.27a2 2 0 012.11-.45c.91.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke={T.mute} strokeWidth={1.6} />
    </Svg>
  );
}

function VerifiedBadge() {
  return (
    <View style={styles.verifiedBadge}>
      <Svg width={11} height={11} viewBox="0 0 11 11">
        <Circle cx="5.5" cy="5.5" r="5.5" fill={T.verify} />
        <Path d="M3 5.5l2 2 3-3" stroke="white" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
      <Text style={styles.verifiedText}>VERIFIED</Text>
    </View>
  );
}

function InReviewBadge() {
  return (
    <View style={styles.inReviewBadge}>
      <Text style={styles.inReviewText}>⏱ IN REVIEW</Text>
    </View>
  );
}

function VerifyButton({ onPress }) {
  return (
    <TouchableOpacity style={styles.verifyBtn} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.verifyBtnText}>VERIFY</Text>
    </TouchableOpacity>
  );
}

const ITEMS = [
  {
    icon: FaceIcon,
    title: 'Face verification',
    badge: 'verified',
    sub1: 'Verified 14 Mar 2026',
    sub2: 'A live selfie was matched against your main profile photo.',
  },
  {
    icon: CardIcon,
    title: 'Visa status',
    badge: 'verified',
    sub1: 'H-1B · valid until 09/2028',
    sub2: 'I-797 approval notice on file. Shown to matches who care about visa.',
  },
  {
    icon: DollarIcon,
    title: 'Income range',
    badge: 'review',
    sub1: '$150K–$200K · reviewing',
    sub2: 'Paystub uploaded 2 days ago. Usually verified within 24 hours.',
  },
  {
    icon: GradCapIcon,
    title: 'Education',
    badge: 'action',
    sub1: 'MS — Carnegie Mellon',
    sub2: 'Upload a transcript or diploma to get a green check on your profile.',
    cta: 'Upload document →',
  },
  {
    icon: PhoneIcon,
    title: 'Phone number',
    badge: 'verified',
    sub1: '+1 (415) ··· ·24',
    sub2: 'Verified via SMS during signup. Not shown to matches.',
  },
];

export default function VerificationsScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.topBtn}>
          <BackArrow />
        </TouchableOpacity>
        <Text style={styles.topTitle}>VERIFICATIONS</Text>
        <View style={styles.topBtn} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Progress banner */}
        <View style={styles.progressBanner}>
          <View style={styles.progressIconWrap}>
            <Svg width={20} height={20} viewBox="0 0 20 20">
              <Circle cx="10" cy="10" r="10" fill={T.accent} />
              <Path d="M6 10l2.5 2.5L14 7" stroke="white" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </View>
          <View style={styles.progressText}>
            <Text style={styles.progressTitle}>3 of 5 verifications complete</Text>
            <Text style={styles.progressSub}>Verified profiles get 3× more interest from matches.</Text>
          </View>
        </View>

        {/* Verification items */}
        {ITEMS.map((item, i) => {
          const IconComp = item.icon;
          return (
            <View key={i} style={styles.verifCard}>
              <View style={styles.verifTop}>
                <View style={styles.verifIconWrap}>
                  <IconComp />
                </View>
                <View style={styles.verifMeta}>
                  <Text style={styles.verifTitle}>{item.title}</Text>
                  <Text style={styles.verifSub1}>{item.sub1}</Text>
                </View>
                {item.badge === 'verified' && <VerifiedBadge />}
                {item.badge === 'review' && <InReviewBadge />}
                {item.badge === 'action' && <VerifyButton />}
              </View>
              <Text style={styles.verifSub2}>{item.sub2}</Text>
              {item.cta && (
                <TouchableOpacity style={styles.ctaBtn} activeOpacity={0.8}>
                  <Text style={styles.ctaBtnText}>{item.cta}</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: T.hair,
  },
  topBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  topTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: FONTS.mono,
    fontSize: 12,
    letterSpacing: 1.5,
    color: T.ink,
  },
  scroll: { padding: 20 },
  progressBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    backgroundColor: T.accentSoft,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  progressIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: T.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: { flex: 1 },
  progressTitle: { fontSize: 15, fontWeight: '700', color: T.accentInk, marginBottom: 4 },
  progressSub: { fontSize: 13, color: T.accentInk, lineHeight: 18, opacity: 0.8 },
  verifCard: {
    borderWidth: 1,
    borderColor: T.hair,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  verifTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 10,
  },
  verifIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: T.field,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifMeta: { flex: 1 },
  verifTitle: { fontSize: 15, fontWeight: '600', color: T.ink, marginBottom: 2 },
  verifSub1: { fontSize: 13, color: T.mute },
  verifSub2: { fontSize: 13, color: T.mute, lineHeight: 20 },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: T.verifySoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 100,
  },
  verifiedText: { fontSize: 10, fontWeight: '700', color: T.verify, letterSpacing: 0.3 },
  inReviewBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 100,
  },
  inReviewText: { fontSize: 10, fontWeight: '700', color: '#92400E' },
  verifyBtn: {
    backgroundColor: T.accent,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 100,
  },
  verifyBtnText: { fontSize: 11, fontWeight: '700', color: '#fff', letterSpacing: 0.5 },
  ctaBtn: {
    backgroundColor: T.accent,
    borderRadius: 100,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  ctaBtnText: { fontSize: 14, fontWeight: '600', color: '#fff' },
});
