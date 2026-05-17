import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle, Line, Rect, Defs, Pattern } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { T, FONTS } from '../../theme';
import apiClient from '../../api/client';

const { width } = Dimensions.get('window');
const CARD_W = width - 32;

function BellIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={T.ink} strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M13.73 21a2 2 0 01-3.46 0" stroke={T.ink} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

function TrendUpIcon() {
  return (
    <Svg width={13} height={13} viewBox="0 0 24 24" fill="none">
      <Path d="M23 6l-9.5 9.5-5-5L1 18" stroke="#22863a" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M17 6h6v6" stroke="#22863a" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function CheckIcon() {
  return (
    <Svg width={12} height={12} viewBox="0 0 12 12" fill="none">
      <Circle cx="6" cy="6" r="6" fill={T.verify} />
      <Path d="M3.5 6l1.8 1.8L8.5 4" stroke="white" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
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

const WHY_REASONS = [
  { icon: '🎓', text: "Both have US master's degrees" },
  { icon: '📍', text: 'Dallas — same metro area' },
  { icon: '🙏', text: 'Hindu · Kamma community match' },
  { icon: '⭐', text: 'Compatible birth stars (Rohini–Mrigashira)' },
];

const STATS = [
  { label: 'HEIGHT', value: "5'6\"" },
  { label: 'RELIGION', value: 'Hindu · Kamma' },
  { label: 'INCOME', value: '$185K / yr' },
  { label: 'COMPLEXION', value: 'Wheatish' },
];

export default function MatchesScreen() {
  const navigation = useNavigation();
  const [showWhy, setShowWhy] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await apiClient.get('/discovery');
        setProfiles(response.data);
      } catch (error) {
        console.error('Error fetching discovery profiles:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={[styles.safe, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={T.accent} />
      </SafeAreaView>
    );
  }

  const currentProfile = profiles[currentIndex];

  if (!currentProfile) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.namaste}>No matches yet</Text>
        </View>
        <Text style={{ textAlign: 'center', marginTop: 50, color: T.mute }}>Check back later for handpicked matches!</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.dateLabel}>TUESDAY · MAY 5</Text>
          <Text style={styles.namaste}>Namaste, User</Text>
          <Text style={styles.tagline}>{profiles.length} new matches for you today</Text>
        </View>
        <TouchableOpacity style={styles.bellBtn} activeOpacity={0.7}>
          <BellIcon />
          <View style={styles.bellDot} />
        </TouchableOpacity>
      </View>

      {/* ── Intro row ── */}
      <View style={styles.introRow}>
        <Text style={styles.introLabel}>Today's introductions</Text>
        <Text style={styles.introCount}>{currentIndex + 1} OF {profiles.length}</Text>
      </View>

      {/* ── Match card ── */}
      <TouchableOpacity
        style={styles.matchCard}
        onPress={() => navigation.navigate('MatchDetail', { profileId: currentProfile.id })}
        activeOpacity={0.97}
      >
        {/* Photo area */}
        <View style={styles.photoArea}>
          <LinearGradient
            colors={['#C4956A', '#A87050', '#8A5A3C']}
            start={{ x: 0.3, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          {/* Diagonal stripe overlay on right portion */}
          <View style={styles.stripeOverlay} pointerEvents="none">
            {Array.from({ length: 20 }).map((_, i) => (
              <View
                key={i}
                style={[styles.stripe, { top: i * 22 - 40, transform: [{ rotate: '-45deg' }] }]}
              />
            ))}
          </View>
        </View>

        {/* Card info */}
        <View style={styles.cardInfo}>
          <Text style={styles.matchName}>{currentProfile.fullName}</Text>
          <Text style={styles.matchLocation}>{currentProfile.gender}</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>DOB</Text>
              <Text style={styles.statValue}>{new Date(currentProfile.dob).toLocaleDateString()}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>VERIFIED</Text>
              <Text style={styles.statValue}>{currentProfile.isFaceVerified ? 'YES' : 'NO'}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.moreAboutRow}
            onPress={() => setShowWhy(v => !v)}
            activeOpacity={0.7}
          >
            <Text style={styles.moreAboutText}>MORE ABOUT {currentProfile.fullName.split(' ')[0].toUpperCase()}</Text>
            {showWhy ? <ChevronUp /> : <ChevronDown />}
          </TouchableOpacity>

          {showWhy && (
            <View style={styles.whyPanel}>
              <View style={styles.whyRow}>
                <Text style={styles.whyIcon}>📍</Text>
                <Text style={styles.whyText}>Verified Member</Text>
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>

      {/* ── Page dots ── */}
      <View style={styles.dotsRow}>
        {profiles.map((_, i) => (
          <View key={i} style={[styles.dot, i === currentIndex && styles.dotActive]} />
        ))}
      </View>

      {/* ── Action buttons — always visible ── */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.8} onPress={() => setCurrentIndex((currentIndex + 1) % profiles.length)}>
          <View style={[styles.actionCircle, styles.passCircle]}>
            <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
              <Path d="M18 6L6 18M6 6l12 12" stroke="#E53E3E" strokeWidth={2.5} strokeLinecap="round" />
            </Svg>
          </View>
          <Text style={[styles.actionLabel, { color: '#E53E3E' }]}>Pass</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.8}>
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

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 8,
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
    height: 240,
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

  matchBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#E6F4EA',
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  matchBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A7A30',
  },

  verifiedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#E6F4EA',
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  verifiedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1A7A30',
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

  cardInfo: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
  },
  matchName: {
    fontFamily: FONTS.display,
    fontSize: 24,
    color: T.ink,
    marginBottom: 2,
  },
  matchLocation: {
    fontSize: 13,
    color: T.mute,
    marginBottom: 12,
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
    paddingVertical: 8,
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
    paddingVertical: 12,
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
