import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';
import { T, FONTS } from '../../theme';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = (screenWidth - 20 * 2 - 10) / 2;

// ─── Icons ──────────────────────────────────────────────────────────────────

function BackArrow() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 12H4M4 12L10 6M4 12L10 18"
        stroke={T.ink}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function FilterIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Line x1="4" y1="6" x2="20" y2="6" stroke={T.ink} strokeWidth={2} strokeLinecap="round" />
      <Line x1="7" y1="12" x2="17" y2="12" stroke={T.ink} strokeWidth={2} strokeLinecap="round" />
      <Line x1="10" y1="18" x2="14" y2="18" stroke={T.ink} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function BookmarkIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-7-3.5L5 20V4z"
        stroke="#fff"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="rgba(255,255,255,0.15)"
      />
    </Svg>
  );
}

function VerifiedIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16">
      <Circle cx={8} cy={8} r={8} fill="#3D8A5C" />
      <Path
        d="M4.5 8l2.5 2.5L11.5 5.5"
        stroke="#fff"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

function HeartIcon() {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        stroke={T.accent}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// ─── Profile data ────────────────────────────────────────────────────────────

const PROFILES = [
  {
    id: 1,
    name: 'Priya S.',
    type: 'gradient',
    gradient: ['#D4A090', '#A06858'],
    savedYou: true,
    match: 94,
    meta: '26 · Austin, TX',
    job: 'SWE · Amazon',
  },
  {
    id: 2,
    name: 'Divya M.',
    type: 'initial',
    initial: 'D',
    initialBg: '#C0BDB8',
    savedYou: false,
    match: 90,
    meta: '28 · Seattle, WA',
    job: 'PM · Microsoft',
  },
  {
    id: 3,
    name: 'Riya K.',
    type: 'gradient',
    gradient: ['#C4956A', '#8A5A40'],
    savedYou: true,
    match: 88,
    meta: '27 · Atlanta, GA',
    job: 'Doctor · Emory',
  },
  {
    id: 4,
    name: 'Sneha R.',
    type: 'initial',
    initial: 'S',
    initialBg: '#B8B8C0',
    savedYou: false,
    match: 85,
    meta: '29 · Jersey City',
    job: 'Designer · Meta',
  },
];

// ─── Card component ───────────────────────────────────────────────────────────

function ProfileCard({ profile }) {
  return (
    <View style={styles.card}>
      {/* Photo area */}
      <View style={styles.photoArea}>
        {profile.type === 'gradient' ? (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: '#C4856A' }]} />
        ) : (
          <View style={[styles.initialBg, { backgroundColor: profile.initialBg }]}>
            <Text style={styles.initialText}>{profile.initial}</Text>
          </View>
        )}

        {/* Saved You badge — top left */}
        {profile.savedYou && (
          <View style={styles.savedYouBadge}>
            <Text style={styles.savedYouText}>SAVED YOU</Text>
          </View>
        )}

        {/* Bookmark — top right */}
        <TouchableOpacity style={styles.bookmarkBtn} activeOpacity={0.8}>
          <BookmarkIcon />
        </TouchableOpacity>
      </View>

      {/* Card body */}
      <View style={styles.cardBody}>
        {/* Name + verified */}
        <View style={styles.nameRow}>
          <Text style={styles.nameText} numberOfLines={1}>{profile.name}</Text>
          <VerifiedIcon />
        </View>

        {/* Age · City */}
        <Text style={styles.metaText} numberOfLines={1}>{profile.meta}</Text>

        {/* Job · Company */}
        <Text style={styles.metaText} numberOfLines={1}>{profile.job}</Text>

        {/* Send Interest button */}
        <TouchableOpacity style={styles.interestBtn} activeOpacity={0.8}>
          <HeartIcon />
          <Text style={styles.interestText}>Send Interest</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Main screen ─────────────────────────────────────────────────────────────

export default function YourShortlistScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.topBtn}
          activeOpacity={0.7}
        >
          <View style={styles.backRow}>
            <BackArrow />
            <Text style={styles.backText}>Back</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.topTitle}>YOUR SHORTLIST</Text>

        <TouchableOpacity style={styles.topBtn} activeOpacity={0.7}>
          <FilterIcon />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header row */}
        <View style={styles.headerRow}>
          <Text style={styles.savedCount}>
            <Text style={styles.savedCountBold}>12</Text>
            {' '}profiles saved
          </Text>
          <Text style={styles.savedYouBack}>2 SAVED YOU BACK</Text>
        </View>

        {/* 2-column grid */}
        <View style={styles.grid}>
          {PROFILES.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F7F3EE',
  },

  // Top bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(42,39,35,0.08)',
  },
  topBtn: {
    width: 72,
    justifyContent: 'center',
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backText: {
    fontSize: 14,
    color: T.ink,
    fontWeight: '500',
  },
  topTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: FONTS.mono,
    fontSize: 12,
    letterSpacing: 1.5,
    color: T.ink,
    fontWeight: '700',
  },

  // Scroll & header
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  savedCount: {
    fontSize: 15,
    color: T.ink,
    fontWeight: '400',
  },
  savedCountBold: {
    fontSize: 22,
    fontWeight: '700',
    color: T.ink,
  },
  savedYouBack: {
    fontFamily: FONTS.mono,
    fontSize: 12,
    fontWeight: '700',
    color: T.accent,
    letterSpacing: 0.5,
  },

  // Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  // Card
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  // Photo area
  photoArea: {
    height: 160,
    backgroundColor: '#E0D8D0',
    overflow: 'hidden',
  },
  initialBg: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialText: {
    fontSize: 56,
    fontWeight: '300',
    color: 'rgba(255,255,255,0.85)',
    fontFamily: FONTS.display,
  },

  // Photo overlays
  savedYouBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: T.accent,
    borderRadius: 100,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  savedYouText: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    color: '#fff',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  matchPill: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 100,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  matchText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  bookmarkBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Card body
  cardBody: {
    padding: 10,
    gap: 3,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 1,
  },
  nameText: {
    fontSize: 14,
    fontWeight: '700',
    color: T.ink,
    flex: 1,
  },
  metaText: {
    fontSize: 12,
    color: T.mute,
    lineHeight: 17,
  },

  // Send Interest button
  interestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E8C8C8',
    backgroundColor: '#FDF0F0',
    borderRadius: 100,
    paddingVertical: 8,
  },
  interestText: {
    fontSize: 13,
    fontWeight: '600',
    color: T.accent,
  },
});
