import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { T, FONTS } from '../../theme';

const { width } = Dimensions.get('window');
const THUMB = (width - 48 - 32) / 5;

function DotsIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Circle cx="5" cy="12" r="1.5" fill={T.ink} />
      <Circle cx="12" cy="12" r="1.5" fill={T.ink} />
      <Circle cx="19" cy="12" r="1.5" fill={T.ink} />
    </Svg>
  );
}

function CameraEditIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"
        stroke="#fff" strokeWidth={1.6} fill="none" />
      <Circle cx="12" cy="13" r="4" stroke="#fff" strokeWidth={1.6} />
    </Svg>
  );
}

function ChevronIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path d="M9 18l6-6-6-6" stroke={T.mute} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function PlusIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M12 5v14M5 12h14" stroke={T.mute} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

function StarIcon() {
  return (
    <Svg width={11} height={11} viewBox="0 0 24 24">
      <Path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z"
        fill="#D4A017" />
    </Svg>
  );
}

function VerifiedBadge() {
  return (
    <View style={styles.verifiedBadge}>
      <Svg width={10} height={10} viewBox="0 0 10 10">
        <Circle cx="5" cy="5" r="5" fill={T.verify} />
        <Path d="M3 5l1.5 1.5L7 3.5" stroke="white" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
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

function VerifyAction() {
  return <Text style={styles.verifyAction}>VERIFY</Text>;
}

const VERIFICATIONS = [
  { label: 'FACE VERIFICATION', title: 'Selfie matched profile photo', badge: 'verified' },
  { label: 'VISA STATUS · H-1B', title: 'USCIS document on file', badge: 'verified' },
  { label: 'INCOME RANGE', title: '$150K–$200K · paystub u...', badge: 'review' },
  { label: 'EDUCATION · MS, CARNEGIE MELLON', title: 'Tap to upload transcript', badge: 'action' },
];

export default function MyProfileScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safe}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.topBtn}>
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path d="M20 12H4M4 12L10 6M4 12L10 18" stroke={T.ink} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </TouchableOpacity>
        <Text style={styles.topTitle}>MY PROFILE</Text>
        <TouchableOpacity style={styles.topBtn}>
          <DotsIcon />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Avatar + identity */}
        <View style={styles.identityRow}>
          <View style={styles.avatarWrap}>
            <LinearGradient colors={['#D4A574', '#C4856A', '#A86050']} style={styles.avatar}>
              <Text style={styles.avatarInitials}>AT</Text>
            </LinearGradient>
            <TouchableOpacity style={styles.cameraBtn}>
              <CameraEditIcon />
            </TouchableOpacity>
          </View>
          <View style={styles.identityText}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>Anika Talluri</Text>
              <Svg width={18} height={18} viewBox="0 0 18 18">
                <Circle cx="9" cy="9" r="9" fill={T.verify} />
                <Path d="M5 9l2.5 2.5L13 6" stroke="white" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </View>
            <Text style={styles.identitySub}>29 · San Francisco · Software Engineer</Text>
            <View style={styles.premiumBadge}>
              <StarIcon />
              <Text style={styles.premiumText}>PREMIUM</Text>
            </View>
          </View>
        </View>

        {/* Profile completion */}
        <View style={styles.completionCard}>
          <View style={styles.completionHeader}>
            <Text style={styles.completionLabel}>Profile completion</Text>
            <Text style={styles.completionPct}>84%</Text>
          </View>
          <View style={styles.completionTrack}>
            <View style={styles.completionFill} />
          </View>
          <Text style={styles.completionHint}>Add 2 more photos and a voice note to reach 100%</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { value: '128', label: 'VISITORS' },
            { value: '47', label: 'INTERESTS' },
            { value: '12', label: 'SHORTLISTS' },
          ].map((s, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.statBox, i === 0 && styles.statBoxActive]}
              onPress={i === 0 ? () => navigation.navigate('ProfileVisitors') : undefined}
              activeOpacity={0.7}
            >
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Photos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>PHOTOS</Text>
            <TouchableOpacity><Text style={styles.sectionAction}>Manage</Text></TouchableOpacity>
          </View>
          <View style={styles.photosRow}>
            {/* Main photo */}
            <View style={styles.mainThumb}>
              <LinearGradient colors={['#D4A574', '#A86050']} style={StyleSheet.absoluteFill} />
              <View style={styles.mainBadge}><Text style={styles.mainBadgeText}>MAIN</Text></View>
            </View>
            {/* Empty slots */}
            {[0, 1, 2, 3].map(i => (
              <View key={i} style={styles.emptyThumb} />
            ))}
            {/* Add */}
            <TouchableOpacity style={styles.addThumb}>
              <PlusIcon />
            </TouchableOpacity>
          </View>
        </View>

        {/* Verifications */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>VERIFICATIONS</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Verifications')}>
              <Text style={styles.sectionAction}>View all</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.verificationsList}>
            {VERIFICATIONS.map((v, i) => (
              <TouchableOpacity key={i} style={[styles.verifRow, i < VERIFICATIONS.length - 1 && styles.verifRowBorder]} activeOpacity={0.7}>
                <View style={styles.verifContent}>
                  <Text style={styles.verifLabel}>{v.label}</Text>
                  <Text style={styles.verifTitle}>{v.title}</Text>
                </View>
                {v.badge === 'verified' && <VerifiedBadge />}
                {v.badge === 'review' && <InReviewBadge />}
                {v.badge === 'action' && <VerifyAction />}
                <ChevronIcon />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Profile details */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>PROFILE DETAILS</Text>
            <TouchableOpacity><Text style={styles.sectionAction}>Edit</Text></TouchableOpacity>
          </View>
          {[
            { label: 'Religion', value: 'Hindu · Kamma' },
            { label: 'Education', value: 'MS · Computer Science · UT Austin' },
            { label: 'Visa', value: 'H-1B' },
            { label: 'Location', value: 'Sunnyvale, CA · Bay Area' },
            { label: 'Height', value: "5'6\"" },
            { label: 'Diet', value: 'Vegetarian' },
          ].map((d, i, arr) => (
            <View key={i} style={[styles.detailRow, i < arr.length - 1 && styles.detailRowBorder]}>
              <Text style={styles.detailLabel}>{d.label}</Text>
              <Text style={styles.detailValue}>{d.value}</Text>
            </View>
          ))}
        </View>

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
  scroll: { paddingHorizontal: 20 },
  identityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 20,
    gap: 16,
  },
  avatarWrap: { position: 'relative' },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: { fontSize: 28, fontWeight: '700', color: '#fff' },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: T.accent,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  identityText: { flex: 1, paddingTop: 4 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  name: { fontFamily: FONTS.display, fontSize: 20, color: T.ink, fontWeight: '600' },
  identitySub: { fontSize: 13, color: T.mute, marginBottom: 8, lineHeight: 18 },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: T.accent,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 100,
  },
  premiumText: { fontSize: 10, fontWeight: '700', color: '#fff', letterSpacing: 0.5 },
  completionCard: {
    backgroundColor: T.field,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  completionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  completionLabel: { fontSize: 14, fontWeight: '600', color: T.ink },
  completionPct: { fontSize: 14, fontWeight: '700', color: T.accent },
  completionTrack: {
    height: 4, backgroundColor: T.hair2, borderRadius: 2, marginBottom: 8,
  },
  completionFill: {
    width: '84%', height: '100%', backgroundColor: T.accent, borderRadius: 2,
  },
  completionHint: { fontSize: 12, color: T.mute, lineHeight: 18 },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    backgroundColor: T.field,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    gap: 4,
  },
  statBoxActive: {},
  statValue: { fontFamily: FONTS.display, fontSize: 22, color: T.accent, fontWeight: '700' },
  statLabel: { fontFamily: FONTS.mono, fontSize: 9, letterSpacing: 1, color: T.mute },
  section: { marginBottom: 24 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    letterSpacing: 1.2,
    color: T.mute,
  },
  sectionAction: { fontSize: 13, color: T.accent, fontWeight: '600' },
  photosRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  mainThumb: {
    width: THUMB,
    height: THUMB,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  mainBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: T.accent,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  mainBadgeText: { fontSize: 8, fontWeight: '700', color: '#fff', letterSpacing: 0.3 },
  emptyThumb: {
    width: THUMB,
    height: THUMB,
    borderRadius: 10,
    backgroundColor: T.field,
    borderWidth: 1,
    borderColor: T.hair,
  },
  addThumb: {
    width: THUMB,
    height: THUMB,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: T.hair2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verificationsList: {
    borderWidth: 1,
    borderColor: T.hair,
    borderRadius: 14,
    overflow: 'hidden',
  },
  verifRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: '#fff',
  },
  verifRowBorder: { borderBottomWidth: 1, borderBottomColor: T.hair },
  verifContent: { flex: 1 },
  verifLabel: { fontFamily: FONTS.mono, fontSize: 9, letterSpacing: 0.8, color: T.mute, marginBottom: 2 },
  verifTitle: { fontSize: 13, fontWeight: '500', color: T.ink },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: T.verifySoft,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 100,
  },
  verifiedText: { fontSize: 10, fontWeight: '700', color: T.verify, letterSpacing: 0.3 },
  inReviewBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 100,
  },
  inReviewText: { fontSize: 10, fontWeight: '700', color: '#92400E', letterSpacing: 0.2 },
  verifyAction: { fontSize: 12, fontWeight: '700', color: T.accent, letterSpacing: 0.5 },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  detailRowBorder: { borderBottomWidth: 1, borderBottomColor: T.hair },
  detailLabel: { fontSize: 14, color: T.mute },
  detailValue: { fontSize: 14, fontWeight: '500', color: T.ink, textAlign: 'right', flex: 1, marginLeft: 16 },
});
