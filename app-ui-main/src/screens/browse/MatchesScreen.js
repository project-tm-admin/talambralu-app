import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Dimensions,
  Animated, PanResponder, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { T, FONTS } from '../../theme';
import { api } from '../../api/client';

const { width } = Dimensions.get('window');
const CARD_W = width - 32;
const SWIPE_THRESHOLD = Math.min(50, CARD_W * 0.2);

function BellIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={T.ink} strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M13.73 21a2 2 0 01-3.46 0" stroke={T.ink} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

function GridIcon() {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="3" width="7" height="7" rx="1" stroke="white" strokeWidth={1.8} />
      <Rect x="14" y="3" width="7" height="7" rx="1" stroke="white" strokeWidth={1.8} />
      <Rect x="3" y="14" width="7" height="7" rx="1" stroke="white" strokeWidth={1.8} />
      <Rect x="14" y="14" width="7" height="7" rx="1" stroke="white" strokeWidth={1.8} />
    </Svg>
  );
}

function ChevronDown() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path d="M6 9l6 6 6-6" stroke={T.mute} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ChevronUp() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path d="M18 15l-6-6-6 6" stroke={T.mute} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

const GRADIENTS = [
  ['#C4956A', '#A87050', '#8A5A3C'],
  ['#9B7FA8', '#7A5F8A', '#5A4070'],
  ['#6A8BA8', '#4A6A8A', '#2A4A6A'],
  ['#7A9A70', '#5A7A50', '#3A5A30'],
  ['#A88B6A', '#8A6A4A', '#6A4A2A'],
];

const calculateAge = (dobString) => {
  const dob = new Date(dobString);
  const diff = Date.now() - dob.getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

export default function MatchesScreen() {
  const navigation = useNavigation();
  const [showWhy, setShowWhy] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Anika');

  const translateX = useRef(new Animated.Value(0)).current;
  const indexRef = useRef(0);
  const pendingEntryDir = useRef(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [profileData, discoveryData] = await Promise.all([
        api.get('/v1/profiles/me'),
        api.get('/v1/discovery'),
      ]);
      
      if (profileData && profileData.fullName) {
        setUserName(profileData.fullName.split(' ')[0]);
      }

      const formattedMatches = discoveryData.data.map((p, i) => ({
        id: p.id,
        name: p.fullName,
        age: calculateAge(p.dob),
        location: 'US · Local Area', // Backend doesn't have location yet
        photos: 1,
        gradient: GRADIENTS[i % GRADIENTS.length],
        isFaceVerified: p.isFaceVerified,
        stats: [
          { label: 'GENDER', value: p.gender },
          { label: 'VERIFIED', value: p.isFaceVerified ? 'YES' : 'NO' },
          { label: 'INCOME', value: p.incomeBracket || 'Not shared' },
          { label: 'JOINED', value: new Date(p.createdAt).toLocaleDateString() },
        ],
        whyReasons: [
          { icon: '✨', text: 'New profile in your area' },
          { icon: '📍', text: 'Lives in the United States' },
          p.isFaceVerified ? { icon: '✅', text: 'Face verified profile' } : null,
        ].filter(Boolean),
      }));

      setMatches(formattedMatches);
    } catch (err) {
      console.error('Fetch Matches Error', err);
      // Alert.alert('Error', 'Failed to load matches.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    indexRef.current = currentIndex;
    setShowWhy(false);
  }, [currentIndex]);

  useLayoutEffect(() => {
    const dir = pendingEntryDir.current;
    if (dir !== null) {
      pendingEntryDir.current = null;
      translateX.setValue(dir * (CARD_W + 48));
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
        tension: 220,
        friction: 20,
      }).start();
    }
  }, [currentIndex]);

  const commitSwipe = (nextIndex, entryDir) => {
    pendingEntryDir.current = entryDir;
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
        Math.abs(gs.dx) > Math.abs(gs.dy) && Math.abs(gs.dx) > 8,
      onPanResponderMove: (_, gs) => {
        const idx = indexRef.current;
        const atStart = idx === 0 && gs.dx > 0;
        const atEnd = idx === matches.length - 1 && gs.dx < 0;
        translateX.setValue(atStart || atEnd ? gs.dx * 0.15 : gs.dx);
      },
      onPanResponderRelease: (_, gs) => {
        const idx = indexRef.current;
        if (gs.dx < -SWIPE_THRESHOLD && idx < matches.length - 1) {
          commitSwipe(idx + 1, 1);
        } else if (gs.dx > SWIPE_THRESHOLD && idx > 0) {
          commitSwipe(idx - 1, -1);
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            tension: 180,
            friction: 12,
          }).start();
        }
      },
      onPanResponderTerminate: () => {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
          tension: 180,
          friction: 12,
        }).start();
      },
    })
  ).current;

  if (loading) {
    return (
      <View style={[styles.safe, styles.center]}>
        <ActivityIndicator size="large" color={T.accent} />
      </View>
    );
  }

  if (matches.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.namaste}>Namaste, {userName}</Text>
            </View>
        </View>
        <View style={styles.center}>
          <Text style={styles.emptyText}>No matches found for you today.</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchInitialData}>
             <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const match = matches[currentIndex];
  const firstName = match.name.split(' ')[0];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.dateLabel}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase()}</Text>
          <Text style={styles.namaste}>Namaste, {userName}</Text>
          <Text style={styles.tagline}>{matches.length} new matches handpicked for you today</Text>
        </View>
        <TouchableOpacity style={styles.bellBtn} activeOpacity={0.7}>
          <BellIcon />
          <View style={styles.bellDot} />
        </TouchableOpacity>
      </View>

      {/* ── Intro row ── */}
      <View style={styles.introRow}>
        <Text style={styles.introLabel}>Today's introductions</Text>
        <Text style={styles.introCount}>{currentIndex + 1} OF {matches.length}</Text>
      </View>

      {/* ── Match card ── */}
      <Animated.View
        style={[styles.matchCard, { transform: [{ translateX }] }]}
        {...panResponder.panHandlers}
      >
        <View style={styles.photoArea}>
          <LinearGradient
            colors={match.gradient}
            start={{ x: 0.3, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.stripeOverlay} pointerEvents="none">
            {Array.from({ length: 20 }).map((_, i) => (
              <View
                key={i}
                style={[styles.stripe, { top: i * 22 - 40, transform: [{ rotate: '-45deg' }] }]}
              />
            ))}
          </View>
          <View style={styles.photosCount}>
            <GridIcon />
            <Text style={styles.photosCountText}>{match.photos} photos</Text>
          </View>
          {match.isFaceVerified && (
             <View style={styles.verifyBadge}>
                <Text style={styles.verifyText}>VERIFIED</Text>
             </View>
          )}
        </View>

        <View style={styles.cardInfo}>
          <TouchableOpacity
            onPress={() => navigation.navigate('MatchDetail', { profileId: match.id })}
            activeOpacity={0.7}
            style={styles.nameHitArea}
          >
            <Text style={styles.matchName}>{match.name}, {match.age}</Text>
          </TouchableOpacity>

          <Text style={styles.matchLocation}>{match.location}</Text>

          <View style={styles.statsGrid}>
            {match.stats.map((s, i) => (
              <View key={i} style={styles.statItem}>
                <Text style={styles.statLabel}>{s.label}</Text>
                <Text style={styles.statValue}>{s.value}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.moreAboutRow}
            onPress={() => setShowWhy(v => !v)}
            activeOpacity={0.7}
          >
            <Text style={styles.moreAboutText}>MORE ABOUT {firstName.toUpperCase()}</Text>
            {showWhy ? <ChevronUp /> : <ChevronDown />}
          </TouchableOpacity>

          {showWhy && (
            <View style={styles.whyPanel}>
              {match.whyReasons.map((r, i) => (
                <View key={i} style={styles.whyRow}>
                  <Text style={styles.whyIcon}>{r.icon}</Text>
                  <Text style={styles.whyText}>{r.text}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </Animated.View>

      {/* ── Page dots ── */}
      <View style={styles.dotsRow}>
        {matches.map((_, i) => (
          <View key={i} style={[styles.dot, i === currentIndex && styles.dotActive]} />
        ))}
      </View>

      {/* ── Action buttons ── */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => advanceTo(currentIndex + 1)}
          activeOpacity={0.8}
        >
          <View style={[styles.actionCircle, styles.passCircle]}>
            <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
              <Path d="M18 6L6 18M6 6l12 12" stroke="#E53E3E" strokeWidth={2.5} strokeLinecap="round" />
            </Svg>
          </View>
          <Text style={[styles.actionLabel, { color: '#E53E3E' }]}>Pass</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => advanceTo(currentIndex + 1)}
          activeOpacity={0.8}
        >
          <View style={[styles.actionCircle, styles.saveCircle]}>
            <Svg width={26} height={26} viewBox="0 0 24 24">
              <Path
                d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z"
                fill="#D4A017" stroke="#D4A017" strokeWidth={0.5}
              />
            </Svg>
          </View>
          <Text style={[styles.actionLabel, { color: '#B8860B' }]}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => advanceTo(currentIndex + 1)}
          activeOpacity={0.8}
        >
          <View style={[styles.actionCircle, styles.heartCircle]}>
            <Svg width={26} height={26} viewBox="0 0 24 24">
              <Path
                d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
                fill={T.accentSoft} stroke={T.accent} strokeWidth={1.5}
              />
            </Svg>
          </View>
          <Text style={[styles.actionLabel, { color: T.accent }]}>Interested</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: T.mute, marginBottom: 16 },
  retryBtn: { padding: 12, backgroundColor: T.accent, borderRadius: 8 },
  retryText: { color: '#fff', fontWeight: '600' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 6,
  },
  headerLeft: { flex: 1, marginRight: 12 },
  dateLabel: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    color: T.mute,
    letterSpacing: 1,
    marginBottom: 2,
  },
  namaste: {
    fontFamily: FONTS.display,
    fontSize: 28,
    color: T.ink,
    marginBottom: 2,
  },
  tagline: {
    fontSize: 13,
    color: T.mute,
    lineHeight: 18,
  },
  bellBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: T.hair,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  bellDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E53E3E',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  introRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  introLabel: {
    fontFamily: FONTS.display,
    fontSize: 18,
    color: T.ink,
  },
  introCount: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    color: T.mute,
    letterSpacing: 0.8,
  },
  matchCard: {
    marginHorizontal: 16,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 14,
    elevation: 6,
  },
  photoArea: {
    height: 196,
    position: 'relative',
    overflow: 'hidden',
  },
  stripeOverlay: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '30%',
    overflow: 'hidden',
  },
  stripe: {
    position: 'absolute',
    left: -60,
    right: -60,
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  photosCount: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  photosCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  verifyBadge: {
      position: 'absolute',
      top: 12,
      right: 12,
      backgroundColor: T.verify,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 100,
  },
  verifyText: {
      fontSize: 10,
      fontWeight: '700',
      color: '#fff',
      letterSpacing: 0.5,
  },
  cardInfo: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
  },
  nameHitArea: {
    minHeight: 44,
    justifyContent: 'center',
    marginBottom: 0,
  },
  matchName: {
    fontFamily: FONTS.display,
    fontSize: 24,
    color: T.ink,
  },
  matchLocation: {
    fontSize: 13,
    color: T.mute,
    marginBottom: 12,
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  statItem: {
    width: '47%',
    backgroundColor: T.field,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  statLabel: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    letterSpacing: 1,
    color: T.mute,
    marginBottom: 3,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '500',
    color: T.ink,
  },
  moreAboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: T.hair,
    marginTop: 2,
  },
  moreAboutText: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    letterSpacing: 1.2,
    color: T.mute,
  },
  whyPanel: {
    paddingTop: 8,
    gap: 8,
  },
  whyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  whyIcon: { fontSize: 14 },
  whyText: { fontSize: 13, color: T.ink2, flex: 1 },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: T.hair2,
  },
  dotActive: {
    width: 20,
    backgroundColor: T.ink,
    borderRadius: 3,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 28,
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingBottom: 16,
  },
  actionBtn: {
    alignItems: 'center',
    gap: 6,
  },
  actionCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  passCircle: { backgroundColor: '#FFF0F0' },
  saveCircle: { backgroundColor: '#FFFAED' },
  heartCircle: { backgroundColor: '#FFF0F3' },
  actionLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
