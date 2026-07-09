import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { T, FONTS } from '../../theme';

// ─── Icons ───────────────────────────────────────────────────────────────────

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

function StarIcon({ size = 12, color = '#D4A017' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z"
        fill={color}
      />
    </Svg>
  );
}

function LockIcon() {
  return (
    <Svg width={13} height={13} viewBox="0 0 24 24" fill="none">
      <Rect
        x={3}
        y={11}
        width={18}
        height={11}
        rx={2}
        stroke={T.ink}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7 11V7a5 5 0 0110 0v4"
        stroke={T.ink}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const TABS = ['New', 'This week', 'All time'];

const PEOPLE = [
  {
    id: 1,
    name: 'Aakash P.',
    star: true,
    avatarType: 'gradient',
    gradientColors: ['#C4956A', '#8A6040'],
    online: true,
    match: 92,
    subtitle: '31 · CA · GC · Product Manager',
    time: '1h ago',
    hidden: false,
  },
  {
    id: 2,
    name: 'Nikhil T.',
    star: false,
    avatarType: 'initial',
    initial: 'N',
    initialBg: '#8BA8C4',
    online: true,
    match: 88,
    subtitle: '33 · WA · Citizen · Finance',
    time: '5h ago',
    hidden: false,
  },
  {
    id: 3,
    name: 'Rahul D.',
    star: true,
    avatarType: 'initial',
    initial: 'R',
    initialBg: '#A8A070',
    online: false,
    match: 85,
    subtitle: '30 · TX · H-1B · Data Scientist',
    time: 'Yesterday',
    hidden: false,
  },
  {
    id: 4,
    name: 'Premium member',
    star: false,
    avatarType: 'hidden',
    online: false,
    match: null,
    subtitle: 'Identity hidden — upgrade to reveal',
    time: 'Yesterday',
    hidden: true,
  },
  {
    id: 5,
    name: 'Premium member',
    star: false,
    avatarType: 'hidden',
    online: false,
    match: null,
    subtitle: 'Identity hidden — upgrade to reveal',
    time: '2 days ago',
    hidden: true,
  },
  {
    id: 6,
    name: 'Manoj K.',
    star: false,
    avatarType: 'initial',
    initial: 'M',
    initialBg: '#8AC4A0',
    online: false,
    match: 80,
    subtitle: '29 · NY · OPT · UX Designer',
    time: '3 days ago',
    hidden: false,
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function AvatarCell({ person }) {
  if (person.avatarType === 'hidden') {
    return (
      <View style={styles.avatarWrap}>
        <View style={styles.hiddenAvatar} />
      </View>
    );
  }

  return (
    <View style={styles.avatarWrap}>
      {person.avatarType === 'gradient' ? (
        <View style={[styles.avatarCircle, { backgroundColor: '#C4856A' }]} />
      ) : (
        <View style={[styles.avatarCircle, { backgroundColor: person.initialBg }]}>
          <Text style={styles.avatarInitial}>{person.initial}</Text>
        </View>
      )}
      {person.online && <View style={styles.onlineDot} />}
    </View>
  );
}

function PersonRow({ person }) {
  return (
    <View style={styles.row}>
      <AvatarCell person={person} />

      <View style={styles.rowMiddle}>
        <View style={styles.nameRow}>
          <Text style={[styles.personName, person.hidden && styles.personNameMuted]}>
            {person.name}
          </Text>
          {person.star && (
            <View style={styles.starWrap}>
              <StarIcon />
            </View>
          )}
        </View>
        <Text style={styles.subtitle}>{person.subtitle}</Text>
      </View>

      <View style={styles.rowRight}>
        <Text style={styles.timeText}>{person.time}</Text>
        {person.hidden ? (
          <TouchableOpacity style={styles.revealBtn} activeOpacity={0.8}>
            <LockIcon />
            <Text style={styles.revealBtnText}>Reveal</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.shortlistBtn} activeOpacity={0.8}>
            <Text style={styles.shortlistBtnText}>Shortlist back</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ShortlistedYouScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('New');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.topBtn}
          activeOpacity={0.7}
        >
          <BackArrow />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.topTitle}>SHORTLISTED YOU</Text>

        <View style={styles.topBtn} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Filter tabs */}
        <View style={styles.tabsContainer}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabPill, activeTab === tab && styles.tabPillActive]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Section header */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeaderLeft}>
            <Text style={styles.countBig}>34</Text>
            <Text style={styles.countLabel}> saved your profile</Text>
          </View>
          <Text style={styles.mostRecent}>MOST RECENT</Text>
        </View>

        {/* Person list */}
        <View style={styles.list}>
          {PEOPLE.map((person) => (
            <PersonRow key={person.id} person={person} />
          ))}
        </View>
      </ScrollView>

      {/* Sticky bottom upgrade banner */}
      <View style={styles.upgradeBanner}>
        <View style={styles.upgradeStarCircle}>
          <StarIcon size={20} color="#D4A017" />
        </View>

        <View style={styles.upgradeMiddle}>
          <Text style={styles.upgradeTitle}>See everyone who shortlisted you</Text>
          <Text style={styles.upgradeSubtitle}>
            14 admirers are hidden. Premium reveals every identity.
          </Text>
        </View>

        <TouchableOpacity style={styles.unlockBtn} activeOpacity={0.8}>
          <Text style={styles.unlockBtnText}>Unlock ›</Text>
        </TouchableOpacity>
      </View>
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
    borderBottomColor: T.hair,
  },
  topBtn: {
    width: 64,
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
  },

  // Scroll
  scrollContent: {
    paddingBottom: 120,
  },

  // Tabs
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: T.hair,
    borderRadius: 100,
    backgroundColor: 'transparent',
    padding: 4,
    gap: 2,
  },
  tabPill: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 100,
  },
  tabPillActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 13,
    color: T.mute,
    fontWeight: '500',
  },
  tabTextActive: {
    color: T.ink,
    fontWeight: '700',
  },

  // Section header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 12,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  countBig: {
    fontSize: 28,
    fontWeight: '700',
    color: T.ink,
    fontFamily: FONTS.display,
  },
  countLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: T.ink,
  },
  mostRecent: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    letterSpacing: 1,
    color: T.mute,
  },

  // List
  list: {
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: T.hair,
    gap: 10,
  },

  // Avatar
  avatarWrap: {
    width: 48,
    height: 48,
    position: 'relative',
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  hiddenAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#D0CCCA',
    opacity: 0.9,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3D8A5C',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },

  // Row middle
  rowMiddle: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 3,
    flexWrap: 'wrap',
  },
  matchPill: {
    backgroundColor: '#F0EDE8',
    borderRadius: 100,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  matchText: {
    fontSize: 12,
    color: T.ink,
    fontWeight: '600',
  },
  personName: {
    fontSize: 15,
    fontWeight: '700',
    color: T.ink,
  },
  personNameMuted: {
    fontWeight: '600',
    color: T.mute,
  },
  starWrap: {
    marginLeft: 1,
  },
  subtitle: {
    fontSize: 12,
    color: T.mute,
    lineHeight: 17,
  },

  // Row right
  rowRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  timeText: {
    fontSize: 12,
    color: T.mute,
  },
  shortlistBtn: {
    backgroundColor: T.accent,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 100,
  },
  shortlistBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  revealBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: T.hair,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 100,
  },
  revealBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: T.ink,
  },

  // Upgrade banner
  upgradeBanner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5ED',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8D8B8',
    marginHorizontal: 12,
    marginBottom: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  upgradeStarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  upgradeMiddle: {
    flex: 1,
  },
  upgradeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: T.accent,
    marginBottom: 2,
  },
  upgradeSubtitle: {
    fontSize: 12,
    color: T.mute,
    lineHeight: 16,
  },
  unlockBtn: {
    backgroundColor: T.accent,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 100,
    flexShrink: 0,
  },
  unlockBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
