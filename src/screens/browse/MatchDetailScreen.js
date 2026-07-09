/**
 * Match Detail Screen — new app-ui-main UI + Firebase backend
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, ActivityIndicator, Dimensions, SectionList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Svg, { Path, Circle, Rect, Polygon } from 'react-native-svg';
import { T, FONTS } from '../../theme';
import { useApp } from '../../store/AppContext';
import { getUserDoc } from '../../firebase/firestore';
import { getAgeFromDob } from '../../utils/matchScore';

const { width } = Dimensions.get('window');
const GOLD   = '#C8920A';
const GOLD_S = '#FEF3D4';
const GREEN  = '#3D8A5C';
const GREEN_S = '#E8F5EE';

const TABS = ['About', 'Career', 'Family', 'Jaathakam', 'Trust'];

// ─── Icons ────────────────────────────────────────────────────────────────────
function BackIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M19 12H5M12 5l-7 7 7 7" stroke={T.ink} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
function VerifiedBadge({ size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18">
      <Circle cx="9" cy="9" r="9" fill={GREEN} />
      <Path d="M5 9l3 3 5-5" stroke="white" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
function StarIcon({ filled }) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24">
      <Path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill={filled ? GOLD : 'none'} stroke={GOLD} strokeWidth={1.8} strokeLinejoin="round"
      />
    </Svg>
  );
}
function HeartIcon() {
  return (
    <Svg width={15} height={15} viewBox="0 0 24 24" fill="none">
      <Path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" fill="white" />
    </Svg>
  );
}
function XCircleIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke="#888" strokeWidth={1.5} />
      <Path d="M15 9l-6 6M9 9l6 6" stroke="#888" strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}
function LocationIcon() {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke={T.mute} strokeWidth={1.5} />
      <Circle cx="12" cy="9" r="2.5" stroke={T.mute} strokeWidth={1.4} />
    </Svg>
  );
}
function ShieldIcon({ color = GOLD }) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2L3 7v6c0 5 4 9.5 9 11 5-1.5 9-6 9-11V7l-9-5z" stroke={color} strokeWidth={1.6} fill={GOLD_S} />
      <Path d="M9 12l2 2 4-4" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function InfoBlock({ label, value }) {
  if (!value) return null;
  return (
    <View style={bs.infoBlock}>
      <Text style={bs.infoLabel}>{label}</Text>
      <Text style={bs.infoValue}>{value}</Text>
    </View>
  );
}
function InfoGrid({ items }) {
  const pairs = items.filter(i => !!i.value);
  if (!pairs.length) return null;
  return (
    <View style={bs.infoGrid}>
      {pairs.map((item, i) => (
        <View key={i} style={bs.infoGridCell}>
          <Text style={bs.infoLabel}>{item.label}</Text>
          <Text style={bs.infoValue}>{item.value}</Text>
        </View>
      ))}
    </View>
  );
}
function SectionCard({ title, children }) {
  return (
    <View style={bs.sectionCard}>
      <Text style={bs.sectionCardTitle}>{title}</Text>
      {children}
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function MatchDetailScreen() {
  const navigation = useNavigation();
  const route      = useRoute();
  const { uid, profileId } = route.params || {};
  const targetUid = uid || profileId;

  const { passMatch, shortlist, sendInterest } = useApp();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('About');

  const scrollRef = useRef(null);
  const tabOffsets = useRef({});

  useEffect(() => {
    if (!targetUid) { setLoading(false); return; }
    setLoading(true);
    getUserDoc(targetUid)
      .then(doc => setProfile(doc?.profile || doc || null))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [targetUid]);

  if (loading) {
    return (
      <SafeAreaView style={bs.safe} edges={['top']}>
        <View style={bs.loadCenter}>
          <ActivityIndicator size="large" color={T.accent} />
          <Text style={bs.loadText}>Loading profile…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={bs.safe} edges={['top']}>
        <TouchableOpacity style={bs.backBtn} onPress={() => navigation.goBack()}>
          <BackIcon />
        </TouchableOpacity>
        <View style={bs.loadCenter}>
          <Text style={{ fontSize: 40 }}>🌸</Text>
          <Text style={bs.emptyTitle}>Profile not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const p = profile;
  const age = getAgeFromDob(p.dob);
  const firstName = p.fullName?.split(' ')[0] || 'Profile';
  const location = [p.usCity, p.usState].filter(Boolean).join(', ') || p.nativeCity || '';
  const mainPhoto = p.photos?.[0];

  function scrollToSection(tab) {
    setActiveTab(tab);
    const offset = tabOffsets.current[tab];
    if (offset != null && scrollRef.current) {
      scrollRef.current.scrollTo({ y: offset, animated: true });
    }
  }

  function measureSection(tab, e) {
    tabOffsets.current[tab] = e.nativeEvent.layout.y;
  }

  const aboutItems = [
    { label: 'Height',      value: p.height },
    { label: 'Weight',      value: p.weight },
    { label: 'Religion',    value: p.religion },
    { label: 'Community',   value: p.community || p.caste },
    { label: 'Gotra',       value: p.gotra },
    { label: 'Diet',        value: p.diet },
    { label: 'Drinking',    value: p.drinking },
    { label: 'Smoking',     value: p.smoking },
    { label: 'Disability',  value: p.disability || 'None' },
    { label: 'Marital Status', value: p.maritalStatus },
  ];

  const careerItems = [
    { label: 'Occupation',    value: p.occupation || p.jobTitle },
    { label: 'Company',       value: p.employer },
    { label: 'Annual Income', value: p.income },
    { label: 'Education',     value: p.education },
    { label: 'Visa Status',   value: p.visaStatus },
  ];

  const familyItems = [
    { label: 'Father',        value: p.fatherOccupation },
    { label: 'Mother',        value: p.motherOccupation },
    { label: 'Siblings',      value: p.siblings },
    { label: 'Family Type',   value: p.familyType },
    { label: 'Family Values', value: p.familyValues },
    { label: 'Native City',   value: p.nativeCity },
    { label: 'Native State',  value: p.nativeState },
  ];

  const jaathakamItems = [
    { label: 'Rasi',       value: p.rasi },
    { label: 'Nakshatra',  value: p.nakshatra },
    { label: 'Gothram',    value: p.gotra },
    { label: 'Manglik',    value: p.manglik },
    { label: 'Dosham',     value: p.dosham },
  ];

  const trustItems = [
    { label: 'Face Verified',   value: p.isFaceVerified   ? 'Verified ✓' : 'Pending' },
    { label: 'Phone Verified',  value: p.isPhoneVerified  ? 'Verified ✓' : 'Pending' },
    { label: 'ID Verified',     value: p.isIdVerified     ? 'Verified ✓' : 'Pending' },
    { label: 'Income Verified', value: p.isIncomeVerified ? 'Verified ✓' : 'Pending' },
  ];

  return (
    <SafeAreaView style={bs.safe} edges={['top', 'bottom']}>
      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false} contentContainerStyle={bs.scroll}>

        {/* Hero photo */}
        <View style={bs.heroWrap}>
          {mainPhoto ? (
            <Image source={{ uri: mainPhoto }} style={bs.heroPhoto} resizeMode="cover" />
          ) : (
            <View style={[bs.heroPhoto, { backgroundColor: '#D4A5A0', justifyContent: 'center', alignItems: 'center' }]}>
              <Text style={{ fontSize: 60 }}>👤</Text>
            </View>
          )}
          <TouchableOpacity style={bs.backBtn} onPress={() => navigation.goBack()}>
            <BackIcon />
          </TouchableOpacity>
          {/* Photo strip */}
          {p.photos?.length > 1 && (
            <View style={bs.photoStrip}>
              {p.photos.slice(1, 5).map((ph, i) => (
                <Image key={i} source={{ uri: ph }} style={bs.thumbPhoto} resizeMode="cover" />
              ))}
            </View>
          )}
        </View>

        {/* Identity card */}
        <View style={bs.identityCard}>
          <View style={bs.identityRow}>
            <View style={{ flex: 1 }}>
              <View style={bs.nameRow}>
                <Text style={bs.name}>{firstName}, {age}</Text>
                {p.isFaceVerified && <VerifiedBadge />}
              </View>
              {!!location && (
                <View style={bs.infoRow}>
                  <LocationIcon />
                  <Text style={bs.infoRowText}>{location}</Text>
                </View>
              )}
            </View>
            <View style={bs.trustPill}>
              <ShieldIcon />
              <Text style={bs.trustPillText}>Verified</Text>
            </View>
          </View>
          {!!(p.about || p.bio) && (
            <Text style={bs.bio}>{p.about || p.bio}</Text>
          )}
        </View>

        {/* Sticky tab bar */}
        <View style={bs.tabBar}>
          {TABS.map(tab => (
            <TouchableOpacity key={tab} style={[bs.tab, activeTab === tab && bs.tabActive]} onPress={() => scrollToSection(tab)}>
              <Text style={[bs.tabText, activeTab === tab && bs.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Section: About */}
        <View onLayout={e => measureSection('About', e)}>
          <SectionCard title="🌿 About">
            <InfoGrid items={aboutItems} />
          </SectionCard>
        </View>

        {/* Section: Career */}
        <View onLayout={e => measureSection('Career', e)}>
          <SectionCard title="💼 Career & Education">
            <InfoGrid items={careerItems} />
          </SectionCard>
        </View>

        {/* Section: Family */}
        <View onLayout={e => measureSection('Family', e)}>
          <SectionCard title="👨‍👩‍👧 Family">
            <InfoGrid items={familyItems} />
          </SectionCard>
        </View>

        {/* Section: Jaathakam */}
        <View onLayout={e => measureSection('Jaathakam', e)}>
          <SectionCard title="🌟 Jaathakam">
            {jaathakamItems.some(i => !!i.value) ? (
              <InfoGrid items={jaathakamItems} />
            ) : (
              <Text style={bs.emptySection}>No horoscope details shared yet.</Text>
            )}
          </SectionCard>
        </View>

        {/* Section: Trust */}
        <View onLayout={e => measureSection('Trust', e)}>
          <SectionCard title="🔒 Trust & Verification">
            {trustItems.map((ti, i) => {
              const isVerified = ti.value?.startsWith('Verified');
              return (
                <View key={i} style={bs.trustRow}>
                  <View style={[bs.trustDot, { backgroundColor: isVerified ? GREEN : '#CCC' }]} />
                  <Text style={bs.trustRowLabel}>{ti.label}</Text>
                  <Text style={[bs.trustRowVal, { color: isVerified ? GREEN : T.mute }]}>{ti.value}</Text>
                </View>
              );
            })}
          </SectionCard>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom action bar */}
      <View style={bs.bottomBar}>
        <TouchableOpacity style={bs.passBtn} onPress={() => { passMatch?.(targetUid); navigation.goBack(); }}>
          <XCircleIcon />
          <Text style={bs.passBtnText}>Pass</Text>
        </TouchableOpacity>
        <TouchableOpacity style={bs.shortBtn} onPress={() => { shortlist?.(targetUid); navigation.goBack(); }}>
          <StarIcon filled={false} />
          <Text style={bs.shortBtnText}>Shortlist</Text>
        </TouchableOpacity>
        <TouchableOpacity style={bs.interestBtn} onPress={() => { sendInterest?.(targetUid); navigation.goBack(); }}>
          <HeartIcon />
          <Text style={bs.interestBtnText}>Send Interest</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const bs = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  scroll: { paddingBottom: 80 },
  loadCenter: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadText: { fontSize: 15, color: T.mute },
  emptyTitle: { fontFamily: FONTS.display, fontSize: 22, color: T.ink, marginTop: 8 },

  heroWrap: { position: 'relative' },
  heroPhoto: { width, height: 300 },
  backBtn: {
    position: 'absolute', top: 12, left: 14,
    width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.92)',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4,
  },
  photoStrip: {
    position: 'absolute', bottom: 10, right: 12,
    flexDirection: 'row', gap: 6,
  },
  thumbPhoto: { width: 52, height: 52, borderRadius: 8, borderWidth: 2, borderColor: '#fff' },

  identityCard: { backgroundColor: '#fff', margin: 14, borderRadius: 16, padding: 16, gap: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  identityRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  name: { fontFamily: FONTS.display, fontSize: 24, color: T.ink },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  infoRowText: { fontSize: 13, color: T.mute },
  trustPill: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: GOLD_S, borderRadius: 100, paddingHorizontal: 10, paddingVertical: 5 },
  trustPillText: { fontSize: 12, fontWeight: '600', color: GOLD },
  bio: { fontSize: 14, color: T.mute, lineHeight: 20 },

  tabBar: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: T.hair, marginHorizontal: 0 },
  tab: { flex: 1, paddingVertical: 11, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: T.accent },
  tabText: { fontSize: 12, color: T.mute, fontWeight: '500' },
  tabTextActive: { color: T.accent, fontWeight: '700' },

  sectionCard: { backgroundColor: '#fff', margin: 14, marginTop: 10, borderRadius: 14, padding: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  sectionCardTitle: { fontFamily: FONTS.display, fontSize: 16, color: T.accent, marginBottom: 12 },

  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  infoGridCell: { width: '47%', flexGrow: 1, backgroundColor: '#F5F2EE', borderRadius: 10, padding: 10 },
  infoBlock: { marginBottom: 8 },
  infoLabel: { fontFamily: FONTS.mono, fontSize: 9, color: T.mute, letterSpacing: 0.7, textTransform: 'uppercase', marginBottom: 3 },
  infoValue: { fontSize: 14, fontWeight: '600', color: T.ink },

  emptySection: { fontSize: 13, color: T.mute, fontStyle: 'italic' },

  trustRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  trustDot: { width: 8, height: 8, borderRadius: 4 },
  trustRowLabel: { flex: 1, fontSize: 13, color: T.ink },
  trustRowVal: { fontSize: 13, fontWeight: '600' },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: T.hair,
    paddingHorizontal: 14, paddingVertical: 10, paddingBottom: 20,
  },
  passBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 100, borderWidth: 1.2, borderColor: T.hair2 },
  passBtnText: { fontSize: 14, color: '#666', fontWeight: '500' },
  shortBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 100, borderWidth: 1.2, borderColor: GOLD, backgroundColor: GOLD_S },
  shortBtnText: { fontSize: 14, color: GOLD, fontWeight: '600' },
  interestBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, borderRadius: 100, backgroundColor: T.accent },
  interestBtnText: { fontSize: 14, color: '#fff', fontWeight: '700' },
});
