import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { T, FONTS } from '../../theme';
import { api } from '../../api/client';
import { auth } from '../../config/firebase';

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

const calculateAge = (dobString) => {
  if (!dobString) return '';
  const dob = new Date(dobString);
  const diff = Date.now() - dob.getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

export default function MyProfileScreen() {
  const navigation = useNavigation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await api.get('/v1/profiles/me');
      setProfile(data);
    } catch (err) {
      console.error('Fetch Profile Error', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
    } catch (err) {
      Alert.alert('Error', 'Failed to log out.');
    }
  };

  if (loading) {
    return (
      <View style={[styles.safe, styles.center]}>
        <ActivityIndicator size="large" color={T.accent} />
      </View>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.emptyText}>No profile found.</Text>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
             <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const initials = profile.fullName.split(' ').map(n => n[0]).join('').toUpperCase();
  const age = calculateAge(profile.dob);

  const verifications = [
    { label: 'FACE VERIFICATION', title: profile.isFaceVerified ? 'Selfie matched profile photo' : 'Identity check required', badge: profile.isFaceVerified ? 'verified' : 'action' },
    { label: 'WORK VERIFICATION', title: profile.isWorkVerified ? 'Employment confirmed' : 'Verify your workplace', badge: profile.isWorkVerified ? 'verified' : 'action' },
    { label: 'INCOME RANGE', title: profile.isIncomeVerified ? 'Verified income bracket' : 'Submit paystub for verification', badge: profile.isIncomeVerified ? 'verified' : 'action' },
  ];

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
        <TouchableOpacity style={styles.topBtn} onPress={handleLogout}>
          <Text style={{color: T.accent, fontSize: 10, fontWeight: '700'}}>LOGOUT</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Avatar + identity */}
        <View style={styles.identityRow}>
          <View style={styles.avatarWrap}>
            <LinearGradient colors={['#D4A574', '#C4856A', '#A86050']} style={styles.avatar}>
              <Text style={styles.avatarInitials}>{initials}</Text>
            </LinearGradient>
            <TouchableOpacity style={styles.cameraBtn}>
              <CameraEditIcon />
            </TouchableOpacity>
          </View>
          <View style={styles.identityText}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{profile.fullName}</Text>
              {profile.isFaceVerified && (
                <Svg width={18} height={18} viewBox="0 0 18 18">
                  <Circle cx="9" cy="9" r="9" fill={T.verify} />
                  <Path d="M5 9l2.5 2.5L13 6" stroke="white" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              )}
            </View>
            <Text style={styles.identitySub}>{age} · US Resident · {profile.gender}</Text>
            {profile.isAdmin && (
              <View style={[styles.premiumBadge, { backgroundColor: T.ink }]}>
                <Text style={styles.premiumText}>ADMIN</Text>
              </View>
            )}
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
            {verifications.map((v, i) => (
              <TouchableOpacity key={i} style={[styles.verifRow, i < verifications.length - 1 && styles.verifRowBorder]} activeOpacity={0.7}>
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
            { label: 'Gender', value: profile.gender },
            { label: 'Birthday', value: new Date(profile.dob).toLocaleDateString() },
            { label: 'Income', value: profile.incomeBracket || 'Not shared' },
            { label: 'Face Verified', value: profile.isFaceVerified ? 'Yes' : 'No' },
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
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: T.mute, marginBottom: 16 },
  logoutBtn: { padding: 12, backgroundColor: T.accent, borderRadius: 8 },
  logoutText: { color: '#fff', fontWeight: '600' },
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