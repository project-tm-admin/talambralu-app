/**
 * Matches Screen — new app-ui-main UI + Firebase backend
 */
import React, { useState, useRef, useLayoutEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Dimensions,
  Animated, PanResponder, ScrollView, Image, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { T, FONTS } from '../../theme';
import { useApp } from '../../store/AppContext';
import { getAgeFromDob } from '../../utils/matchScore';
import PhotoPlaceholder from '../../components/PhotoPlaceholder';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.22;
const GOLD   = '#C8920A';
const GOLD_S = '#FEF3D4';

// ─── Icons ────────────────────────────────────────────────────────────────────
function BellIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={T.ink} strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M13.73 21a2 2 0 01-3.46 0" stroke={T.ink} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}
function ShieldIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2L3 7v6c0 5 4 9.5 9 11 5-1.5 9-6 9-11V7l-9-5z"
        stroke={GOLD} strokeWidth={1.6} fill={GOLD_S} />
      <Path d="M9 12l2 2 4-4" stroke={GOLD} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
function VerifiedBadge() {
  return (
    <Svg width={18} height={18} viewBox="0 0 18 18">
      <Circle cx="9" cy="9" r="9" fill="#3D8A5C" />
      <Path d="M5 9l3 3 5-5" stroke="white" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
function LocationIcon() {
  return (
    <Svg width={13} height={13} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke={T.mute} strokeWidth={1.6} />
      <Circle cx="12" cy="9" r="2.5" stroke={T.mute} strokeWidth={1.4} />
    </Svg>
  );
}
function BriefcaseIcon() {
  return (
    <Svg width={13} height={13} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="7" width="20" height="14" rx="2" stroke={T.mute} strokeWidth={1.6} />
      <Path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke={T.mute} strokeWidth={1.6} />
    </Svg>
  );
}
function GradCapIcon() {
  return (
    <Svg width={13} height={13} viewBox="0 0 24 24" fill="none">
      <Path d="M22 10l-10-7L2 10l10 7 10-7z" stroke={T.mute} strokeWidth={1.6} strokeLinejoin="round" />
      <Path d="M6 12v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" stroke={T.mute} strokeWidth={1.6} />
    </Svg>
  );
}
function XIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke="#888" strokeWidth={1.5} />
      <Path d="M15 9l-6 6M9 9l6 6" stroke="#888" strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}
function StarIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        stroke={GOLD} strokeWidth={1.8} strokeLinejoin="round" />
    </Svg>
  );
}
function HeartIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" fill="white" />
    </Svg>
  );
}
function LockIcon() {
  return (
    <Svg width={13} height={13} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="11" width="18" height="11" rx="2" stroke={T.mute} strokeWidth={1.6} />
      <Path d="M7 11V7a5 5 0 0110 0v4" stroke={T.mute} strokeWidth={1.6} />
    </Svg>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function MatchesScreen() {
  const navigation = useNavigation();
  const { matches, matchesLoading, passMatch, shortlist, sendInterest,
          userDoc, isPremium, unreadCount } = useApp();

  const [currentIndex, setCurrentIndex] = useState(0);
  const translateX      = useRef(new Animated.Value(0)).current;
  const indexRef        = useRef(0);
  const pendingEntryDir = useRef(null);

  useLayoutEffect(() => {
    const dir = pendingEntryDir.current;
    if (dir !== null) {
      pendingEntryDir.current = null;
      translateX.setValue(dir * (width + 40));
      Animated.spring(translateX, { toValue: 0, useNativeDriver: true, tension: 220, friction: 20 }).start();
    }
  }, [currentIndex]);

  const commitSwipe = (nextIndex, entryDir) => {
    pendingEntryDir.current = entryDir;
    indexRef.current = nextIndex;
    setCurrentIndex(nextIndex);
  };

  const advanceTo = (next) => {
    if (next < 0 || next >= matches.length) return;
    commitSwipe(next, next > indexRef.current ? 1 : -1);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: (_, gs) =>
        Math.abs(gs.dx) > Math.abs(gs.dy) && Math.abs(gs.dx) > 10,
      onPanResponderMove: (_, gs) => {
        const idx = indexRef.current;
        const edge = (idx === 0 && gs.dx > 0) || (idx === matches.length - 1 && gs.dx < 0);
        translateX.setValue(edge ? gs.dx * 0.12 : gs.dx);
      },
      onPanResponderRelease: (_, gs) => {
        const idx = indexRef.current;
        if (gs.dx < -SWIPE_THRESHOLD && idx < matches.length - 1) {
          commitSwipe(idx + 1, 1);
        } else if (gs.dx > SWIPE_THRESHOLD && idx > 0) {
          commitSwipe(idx - 1, -1);
        } else {
          Animated.spring(translateX, { toValue: 0, useNativeDriver: true, tension: 180, friction: 12 }).start();
        }
      },
      onPanResponderTerminate: () => {
        Animated.spring(translateX, { toValue: 0, useNativeDriver: true, tension: 180, friction: 12 }).start();
      },
    })
  ).current;

  const firstName = (userDoc?.profile?.fullName || 'there').split(' ')[0];

  if (matchesLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={T.accent} />
          <Text style={styles.loadingText}>Finding your matches…</Text>
        </View>
      </SafeAreaView>
    );
  }

  const match = matches[currentIndex];
  const p = match?.profile || {};
  const age = getAgeFromDob(p.dob);
  const displayName = p.fullName?.split(' ')[0] || 'Profile';
  const location = [p.usCity, p.usState].filter(Boolean).join(', ') || p.nativeCity || 'United States';
  const jobLine = [p.jobTitle, p.employer].filter(Boolean).join(' at ') || p.occupation || '';
  const eduLine = p.education || '';
  const photoBg = p.isFaceVerified ? '#D4A5A0' : T.field;

  const stats = [
    { label: 'Religion',  value: p.religion  || '—' },
    { label: 'Community', value: p.community || p.caste || '—' },
    { label: 'Visa',      value: p.visaStatus || '—' },
    { label: 'Diet',      value: p.diet || '—' },
  ];

  function handlePass() {
    passMatch?.(match?.uid);
    advanceTo(currentIndex + 1);
  }
  function handleShortlist() {
    shortlist?.(match?.uid);
    advanceTo(currentIndex + 1);
  }
  function handleInterest() {
    sendInterest?.(match?.uid);
    advanceTo(currentIndex + 1);
  }

  if (!match) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.loadingWrap}>
          <Text style={styles.emptyEmoji}>🌸</Text>
          <Text style={styles.emptyTitle}>You're all caught up!</Text>
          <Text style={styles.emptyText}>Check back tomorrow for new introductions.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.logoScript}>✿ తలంభాలు</Text>
            <Text style={styles.logoSub}>Bringing families together</Text>
          </View>
          <TouchableOpacity style={styles.bellBtn} activeOpacity={0.7}>
            <BellIcon />
            {unreadCount > 0 && <View style={styles.bellDot} />}
          </TouchableOpacity>
        </View>

        {/* Greeting + Trust banner */}
        <View style={styles.greetRow}>
          <View style={styles.greetLeft}>
            <Text style={styles.greetSmall}>Good to see you,</Text>
            <Text style={styles.greetName}>{firstName} 🌿</Text>
          </View>
          <View style={styles.trustBanner}>
            <ShieldIcon />
            <View style={styles.trustText}>
              <Text style={styles.trustTitle}>Safe. Verified. Trusted.</Text>
              <Text style={styles.trustSub}>Genuine Telugu families · safe community.</Text>
            </View>
          </View>
        </View>

        {/* Section header */}
        <View style={styles.sectionRow}>
          <View>
            <Text style={styles.sectionTitle}>🌸  Today's Matches</Text>
            <Text style={styles.sectionSub}>Curated for you</Text>
          </View>
          <TouchableOpacity style={styles.viewAllBtn} onPress={() => navigation.navigate('Search')} activeOpacity={0.7}>
            <Text style={styles.viewAllText}>View all  ›</Text>
          </TouchableOpacity>
        </View>

        {/* Swipeable match card */}
        <Animated.View
          style={[styles.card, { transform: [{ translateX }] }]}
          {...panResponder.panHandlers}
        >
          {/* Photo area */}
          <TouchableOpacity
            style={styles.photoArea}
            onPress={() => navigation.navigate('MatchDetail', { uid: match.uid })}
            activeOpacity={0.92}
          >
            {p.photos?.[0] ? (
              <Image source={{ uri: p.photos[0] }} style={StyleSheet.absoluteFill} resizeMode="cover" />
            ) : (
              <PhotoPlaceholder width={width - 32} height={230} label={displayName} style={{ borderRadius: 0 }} />
            )}
          </TouchableOpacity>

          {/* Card body */}
          <View style={styles.cardBody}>
            <View style={styles.nameRow}>
              <TouchableOpacity onPress={() => navigation.navigate('MatchDetail', { uid: match.uid })} style={styles.nameTap}>
                <Text style={styles.name}>{displayName}, {age}</Text>
              </TouchableOpacity>
              {p.isFaceVerified && <VerifiedBadge />}
            </View>

            {!!location && (
              <View style={styles.infoRow}>
                <LocationIcon />
                <Text style={styles.infoText}>{location}</Text>
              </View>
            )}
            {!!jobLine && (
              <View style={styles.infoRow}>
                <BriefcaseIcon />
                <Text style={styles.infoText}>{jobLine}</Text>
              </View>
            )}
            {!!eduLine && (
              <View style={styles.infoRow}>
                <GradCapIcon />
                <Text style={styles.infoText}>{eduLine}</Text>
              </View>
            )}

            <View style={styles.statsGrid}>
              {stats.map((s, i) => (
                <View key={i} style={styles.statCell}>
                  <Text style={styles.statLabel}>{s.label}</Text>
                  <Text style={styles.statValue}>{s.value}</Text>
                </View>
              ))}
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.skipBtn} onPress={handlePass} activeOpacity={0.75}>
                <XIcon />
                <Text style={styles.skipText}>Skip</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shortlistBtn} onPress={handleShortlist} activeOpacity={0.75}>
                <StarIcon />
                <Text style={styles.shortlistText}>Shortlist</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.expressBtn} onPress={handleInterest} activeOpacity={0.85}>
                <HeartIcon />
                <Text style={styles.expressText}>Send Interest</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.privacyRow}>
              <LockIcon />
              <Text style={styles.privacyText}>Private — shared only if accepted.</Text>
            </View>
          </View>
        </Animated.View>

        {/* Upgrade banner */}
        {!isPremium && (
          <TouchableOpacity
            style={styles.upgradeBanner}
            onPress={() => navigation.navigate('Premium')}
            activeOpacity={0.85}
          >
            <Text style={styles.upgradeIcon}>⭐</Text>
            <View style={styles.upgradeText}>
              <Text style={[styles.upgradeTitle, { color: T.accent }]}>
                {currentIndex + 1} of {matches.length} daily intros viewed
              </Text>
              <Text style={styles.upgradeSub}>Unlock unlimited intros with Premium.</Text>
            </View>
            <View style={styles.upgradeBtn}>
              <Text style={styles.upgradeBtnText}>★ Upgrade</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Footer */}
        <View style={styles.safeFooter}>
          <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
            <Path d="M12 2L3 7v6c0 5 4 9.5 9 11 5-1.5 9-6 9-11V7l-9-5z" stroke={T.mute} strokeWidth={1.5} />
          </Svg>
          <Text style={styles.safeText}>SAFE & VERIFIED COMMUNITY</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  scroll: { paddingBottom: 16 },
  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12, padding: 40 },
  loadingText: { fontSize: 15, color: T.mute },
  emptyEmoji: { fontSize: 48, marginBottom: 8 },
  emptyTitle: { fontFamily: FONTS.display, fontSize: 24, color: T.ink },
  emptyText: { fontSize: 14, color: T.mute, textAlign: 'center' },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 18, paddingTop: 10, paddingBottom: 4,
  },
  headerLeft: { gap: 1 },
  logoScript: { fontFamily: FONTS.display, fontSize: 16, color: T.accent, letterSpacing: 0.3 },
  logoSub: { fontSize: 11, color: T.mute, fontStyle: 'italic' },
  bellBtn: {
    width: 38, height: 38, borderRadius: 19, borderWidth: 1, borderColor: T.hair,
    justifyContent: 'center', alignItems: 'center', position: 'relative',
  },
  bellDot: {
    position: 'absolute', top: 7, right: 7, width: 8, height: 8,
    borderRadius: 4, backgroundColor: '#E53E3E', borderWidth: 1.5, borderColor: '#fff',
  },

  greetRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    paddingHorizontal: 18, paddingVertical: 8, gap: 12,
  },
  greetLeft: { gap: 0 },
  greetSmall: { fontSize: 13, color: T.mute },
  greetName: { fontFamily: FONTS.display, fontSize: 28, color: T.accent, lineHeight: 34 },
  trustBanner: {
    flex: 1, flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: GOLD_S, borderRadius: 12, padding: 10,
  },
  trustText: { flex: 1, gap: 2 },
  trustTitle: { fontSize: 12, fontWeight: '700', color: T.ink },
  trustSub: { fontSize: 11, color: T.mute, lineHeight: 15 },

  sectionRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 18, paddingTop: 4, paddingBottom: 8,
  },
  sectionTitle: { fontFamily: FONTS.display, fontSize: 17, color: T.accent },
  sectionSub: { fontSize: 12, color: T.mute, marginTop: 1 },
  viewAllBtn: { borderWidth: 1, borderColor: T.accent, borderRadius: 100, paddingHorizontal: 14, paddingVertical: 6 },
  viewAllText: { fontSize: 13, color: T.accent, fontWeight: '500' },

  card: {
    marginHorizontal: 16, borderRadius: 18, overflow: 'hidden', backgroundColor: '#fff',
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.09, shadowRadius: 12, elevation: 5,
  },
  photoArea: { height: 230, backgroundColor: '#D4A5A0' },

  cardBody: { backgroundColor: '#fff', paddingHorizontal: 14, paddingTop: 12, paddingBottom: 10 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  nameTap: { flex: 1 },
  name: { fontFamily: FONTS.display, fontSize: 22, color: T.ink },

  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 },
  infoText: { fontSize: 13, color: T.mute, flex: 1 },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12, marginTop: 10 },
  statCell: {
    width: '47%', flexGrow: 1, backgroundColor: '#F5F2EE',
    borderRadius: 10, borderWidth: 1, borderColor: T.hair,
    paddingHorizontal: 12, paddingVertical: 10,
  },
  statLabel: {
    fontFamily: FONTS.mono, fontSize: 9, color: T.mute,
    letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 3,
  },
  statValue: { fontSize: 14, fontWeight: '600', color: T.ink },

  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  skipBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 16, paddingVertical: 11, borderRadius: 100,
    borderWidth: 1.2, borderColor: T.hair2,
  },
  skipText: { fontSize: 14, color: '#666', fontWeight: '500' },
  shortlistBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 16, paddingVertical: 11, borderRadius: 100,
    borderWidth: 1.2, borderColor: GOLD, backgroundColor: GOLD_S,
  },
  shortlistText: { fontSize: 14, color: GOLD, fontWeight: '600' },
  expressBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 11, borderRadius: 100, backgroundColor: T.accent,
  },
  expressText: { fontSize: 14, color: '#fff', fontWeight: '600' },

  privacyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 },
  privacyText: { fontSize: 12, color: T.mute },

  upgradeBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginHorizontal: 16, marginTop: 12, backgroundColor: GOLD_S,
    borderRadius: 14, padding: 14,
  },
  upgradeIcon: { fontSize: 22 },
  upgradeText: { flex: 1, gap: 2 },
  upgradeTitle: { fontSize: 13, fontWeight: '700', color: T.ink },
  upgradeSub: { fontSize: 11, color: T.mute, lineHeight: 15 },
  upgradeBtn: { backgroundColor: T.accent, borderRadius: 100, paddingHorizontal: 14, paddingVertical: 8 },
  upgradeBtnText: { fontSize: 13, fontWeight: '700', color: '#fff' },

  safeFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 14, paddingBottom: 4 },
  safeText: { fontFamily: FONTS.mono, fontSize: 10, color: T.mute, letterSpacing: 1 },
});
