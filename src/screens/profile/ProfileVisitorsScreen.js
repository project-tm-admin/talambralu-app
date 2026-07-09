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
import Svg, { Path, Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { T, FONTS } from '../../theme';

// ─── Icons ────────────────────────────────────────────────────────────────────

function BackArrow() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
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

function StarIcon({ size = 12, color = '#C8920A' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z"
        fill={color}
      />
    </Svg>
  );
}

// ─── Visitor data ─────────────────────────────────────────────────────────────

const VISITORS = [
  {
    id: 1,
    name: 'Rohan K.',
    time: '2h ago',
    meta: '32 · NJ · H-1B · Software',
    premium: true,
    hidden: false,
    online: true,
    avatarType: 'gradient',
    gradientColors: ['#D4A090', '#A06858'],
  },
  {
    id: 2,
    name: 'Karthik R.',
    time: '4h ago',
    meta: '30 · CA · GC · Product',
    premium: false,
    hidden: false,
    online: true,
    avatarType: 'initial',
    initialBg: '#8BA8C4',
  },
  {
    id: 3,
    name: 'Aditya P.',
    time: 'Yesterday',
    meta: '34 · TX · GC · Doctor',
    premium: true,
    hidden: false,
    online: false,
    avatarType: 'initial',
    initialBg: '#C4A870',
  },
  {
    id: 4,
    name: 'Sai V.',
    time: 'Yesterday',
    meta: '29 · WA · H-1B · ML Engineer',
    premium: false,
    hidden: false,
    online: false,
    avatarType: 'initial',
    initialBg: '#8AC4A0',
  },
  {
    id: 5,
    name: 'Vikram S.',
    time: '2 days ago',
    meta: '33 · IL · Citizen · Finance',
    premium: false,
    hidden: false,
    online: false,
    avatarType: 'initial',
    initialBg: '#A8A0C4',
  },
  {
    id: 6,
    name: 'Premium member',
    time: '3 days ago',
    meta: 'Profile hidden',
    premium: false,
    hidden: true,
    online: false,
    avatarType: 'hidden',
  },
  {
    id: 7,
    name: 'Akhil M.',
    time: '4 days ago',
    meta: '28 · NY · OPT · Designer',
    premium: false,
    hidden: false,
    online: false,
    avatarType: 'initial',
    initialBg: '#C4B08A',
  },
];

const TABS = ['Today', 'This week', 'All time'];

// ─── Avatar ───────────────────────────────────────────────────────────────────

function VisitorAvatar({ visitor }) {
  const size = 48;
  const radius = size / 2;

  if (visitor.hidden) {
    return (
      <View style={[styles.avatarBase, { opacity: 0.35, backgroundColor: '#AAAAAA' }]}>
        <Text style={styles.avatarInitial}>?</Text>
      </View>
    );
  }

  if (visitor.avatarType === 'gradient') {
    return (
      <View style={[styles.avatarBase, { backgroundColor: '#C4856A' }]}>
        <Text style={styles.avatarInitial}>{visitor.name.charAt(0)}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.avatarBase, { backgroundColor: visitor.initialBg }]}>
      <Text style={styles.avatarInitial}>{visitor.name.charAt(0)}</Text>
    </View>
  );
}

// ─── Visitor row ──────────────────────────────────────────────────────────────

function VisitorRow({ visitor, onPress }) {
  return (
    <View style={styles.row}>
      {/* Avatar + online dot */}
      <View style={styles.avatarWrap}>
        <VisitorAvatar visitor={visitor} />
        {visitor.online && (
          <View style={styles.onlineDot} />
        )}
      </View>

      {/* Info */}
      <View style={styles.rowInfo}>
        <View style={styles.nameRow}>
          <Text
            style={[styles.nameText, visitor.hidden && styles.nameTextMuted]}
            numberOfLines={1}
          >
            {visitor.name}
          </Text>
          {visitor.premium && (
            <View style={styles.starWrap}>
              <StarIcon size={12} color="#C8920A" />
            </View>
          )}
        </View>
        <Text style={styles.metaText} numberOfLines={1}>
          {visitor.meta}
        </Text>
      </View>

      {/* Time + action */}
      <View style={styles.rowRight}>
        <Text style={styles.timeText}>{visitor.time}</Text>
        {!visitor.hidden && (
          <TouchableOpacity style={styles.viewBtn} onPress={onPress} activeOpacity={0.8}>
            <Text style={styles.viewBtnText}>View</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function ProfileVisitorsScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('This week');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>

      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.topBackBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <BackArrow />
          <Text style={styles.topBackText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.topTitle}>PROFILE VISITORS</Text>

        <View style={styles.topSpacer} />
      </View>

      {/* Scrollable content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Filter tabs */}
        <View style={styles.tabsContainer}>
          {TABS.map(tab => (
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
            <Text style={styles.countBig}>128</Text>
            <Text style={styles.countLabel}> visited your profile</Text>
          </View>
          <Text style={styles.mostRecent}>MOST RECENT</Text>
        </View>

        {/* Visitor list */}
        <View style={styles.list}>
          {VISITORS.map((v, i) => (
            <VisitorRow
              key={v.id}
              visitor={v}
              onPress={() => navigation.navigate('MatchDetail')}
            />
          ))}
        </View>
      </ScrollView>

      {/* Sticky upgrade banner */}
      <View style={styles.bannerWrap}>
        <View style={styles.banner}>
          {/* Star circle */}
          <View style={styles.bannerIconCircle}>
            <StarIcon size={20} color="#C8920A" />
          </View>

          {/* Text */}
          <View style={styles.bannerTextWrap}>
            <Text style={styles.bannerTitle}>See everyone who viewed you</Text>
            <Text style={styles.bannerSub}>
              Premium unlocks identities of hidden visitors and shortlisters.
            </Text>
          </View>

          {/* CTA */}
          <TouchableOpacity style={styles.unlockBtn} activeOpacity={0.8}>
            <Text style={styles.unlockBtnText}>Unlock ›</Text>
          </TouchableOpacity>
        </View>
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: T.hair,
  },
  topBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    width: 72,
  },
  topBackText: {
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
  topSpacer: {
    width: 72,
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
    marginBottom: 4,
    borderWidth: 1,
    borderColor: T.hair2,
    borderRadius: 100,
    padding: 4,
    backgroundColor: 'transparent',
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
    shadowOpacity: 0.1,
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
    fontWeight: '600',
  },

  // Section header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 8,
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
    fontSize: 14,
    color: T.mute,
    fontWeight: '400',
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
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: T.hair,
    gap: 12,
  },

  // Avatar
  avatarWrap: {
    position: 'relative',
    width: 48,
    height: 48,
  },
  avatarBase: {
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

  // Row info
  rowInfo: {
    flex: 1,
    gap: 3,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  nameText: {
    fontSize: 15,
    fontWeight: '700',
    color: T.ink,
  },
  nameTextMuted: {
    color: T.mute,
    fontWeight: '400',
  },
  starWrap: {
    marginTop: 1,
  },
  metaText: {
    fontSize: 12,
    color: T.mute,
  },

  // Row right
  rowRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  timeText: {
    fontSize: 11,
    color: T.mute,
  },
  viewBtn: {
    backgroundColor: T.accent,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 100,
  },
  viewBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Sticky banner
  bannerWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 8,
    backgroundColor: '#F7F3EE',
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5ED',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8D8B8',
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 10,
  },
  bannerIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  bannerTextWrap: {
    flex: 1,
    gap: 2,
  },
  bannerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: T.accent,
  },
  bannerSub: {
    fontSize: 12,
    color: T.mute,
    lineHeight: 16,
  },
  unlockBtn: {
    backgroundColor: T.accent,
    borderRadius: 100,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexShrink: 0,
  },
  unlockBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
