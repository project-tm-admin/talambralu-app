import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop, Circle, Rect } from 'react-native-svg';
import { T, FONTS } from '../../theme';

// ─── Icons ────────────────────────────────────────────────────────────────────

function BackArrow() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 12H4M4 12l6-6M4 12l6 6"
        stroke={T.ink}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ChevronRight() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 18l6-6-6-6"
        stroke={T.mute}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function GradientAvatar({ colors }) {
  return (
    <View style={[styles.avatar, { backgroundColor: '#C4856A' }]} />
  );
}

function InitialAvatar({ initial, bg }) {
  return (
    <View style={[styles.avatar, { backgroundColor: bg, justifyContent: 'center', alignItems: 'center' }]}>
      <Text style={styles.avatarInitial}>{initial}</Text>
    </View>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({ label, right }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionLabel}>{label}</Text>
      {right}
    </View>
  );
}

// ─── Visibility row ───────────────────────────────────────────────────────────

function VisibilityRow({ label, value, borderBottom }) {
  return (
    <TouchableOpacity style={[styles.row, borderBottom && styles.rowBorder]} activeOpacity={0.7}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.rowRight}>
        <Text style={styles.rowValue}>{value}</Text>
        <ChevronRight />
      </View>
    </TouchableOpacity>
  );
}

// ─── Toggle row ───────────────────────────────────────────────────────────────

function ToggleRow({ label, subtitle, value, onValueChange, borderBottom }) {
  return (
    <View style={[styles.row, borderBottom && styles.rowBorder]}>
      <View style={styles.toggleLabelWrap}>
        <Text style={styles.rowLabel}>{label}</Text>
        {subtitle ? <Text style={styles.toggleSubtitle}>{subtitle}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: T.hair, true: T.accent }}
        thumbColor="#FFFFFF"
        ios_backgroundColor={T.hair}
      />
    </View>
  );
}

// ─── Blocked user row ─────────────────────────────────────────────────────────

function BlockedRow({ avatar, name, meta, borderBottom }) {
  return (
    <View style={[styles.row, styles.blockedRow, borderBottom && styles.rowBorder]}>
      {avatar}
      <View style={styles.blockedInfo}>
        <Text style={styles.blockedName}>{name}</Text>
        <Text style={styles.blockedMeta}>{meta}</Text>
      </View>
      <TouchableOpacity style={styles.unblockBtn} activeOpacity={0.7}>
        <Text style={styles.unblockText}>Unblock</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function PrivacyScreen() {
  const navigation = useNavigation();

  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [showLastSeen, setShowLastSeen]         = useState(false);
  const [readReceipts, setReadReceipts]         = useState(true);
  const [incognito, setIncognito]               = useState(false);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* ── Top bar ── */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <BackArrow />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.topTitle}>PRIVACY &amp; BLOCKED</Text>

        <View style={styles.topSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── PROFILE VISIBILITY ── */}
        <SectionHeader label="PROFILE VISIBILITY" />
        <View style={styles.card}>
          <VisibilityRow
            label="Who can see my profile"
            value="Verified only"
            borderBottom
          />
          <VisibilityRow
            label="Photo visibility"
            value="Blur until accepted"
          />
        </View>

        {/* ── PRIVACY ── */}
        <SectionHeader label="PRIVACY" />
        <View style={styles.card}>
          <ToggleRow
            label="Show online status"
            value={showOnlineStatus}
            onValueChange={setShowOnlineStatus}
            borderBottom
          />
          <ToggleRow
            label="Show last seen"
            value={showLastSeen}
            onValueChange={setShowLastSeen}
            borderBottom
          />
          <ToggleRow
            label="Read receipts"
            value={readReceipts}
            onValueChange={setReadReceipts}
            borderBottom
          />
          <ToggleRow
            label="Incognito browsing"
            subtitle="Visit profiles without being seen · Premium"
            value={incognito}
            onValueChange={setIncognito}
          />
        </View>

        {/* ── BLOCKED ── */}
        <SectionHeader
          label="BLOCKED · 4"
          right={
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          }
        />
        <View style={styles.card}>
          <BlockedRow
            avatar={<GradientAvatar colors={['#C4856A', '#A06050']} />}
            name="Rahul M."
            meta="34 · NJ · blocked 2 days ago"
            borderBottom
          />
          <BlockedRow
            avatar={<InitialAvatar initial="K" bg="#8BA8C4" />}
            name="Kiran T."
            meta="31 · TX · blocked last week"
            borderBottom
          />
          <BlockedRow
            avatar={<InitialAvatar initial="S" bg="#8AC4A0" />}
            name="Suresh B."
            meta="36 · CA · blocked last week"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // ── Top bar ──────────────────────────────────────────────────────────────────
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: T.hair,
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minWidth: 72,
  },
  backText: {
    fontSize: 15,
    color: T.ink,
    marginLeft: 4,
  },
  topTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: FONTS.mono,
    fontSize: 12,
    letterSpacing: 1.2,
    color: T.ink,
  },
  topSpacer: {
    minWidth: 72,
  },

  // ── Scroll ───────────────────────────────────────────────────────────────────
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },

  // ── Section header ───────────────────────────────────────────────────────────
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  sectionLabel: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    letterSpacing: 1.1,
    color: T.mute,
  },
  seeAll: {
    fontSize: 13,
    color: T.accent,
    fontWeight: '500',
  },

  // ── Card ─────────────────────────────────────────────────────────────────────
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.hair,
    overflow: 'hidden',
  },

  // ── Generic row ──────────────────────────────────────────────────────────────
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 52,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: T.hair,
  },
  rowLabel: {
    flex: 1,
    fontSize: 15,
    color: T.ink,
    fontWeight: '400',
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rowValue: {
    fontSize: 14,
    color: T.mute,
    marginRight: 2,
  },

  // ── Toggle row extras ─────────────────────────────────────────────────────────
  toggleLabelWrap: {
    flex: 1,
    marginRight: 12,
  },
  toggleSubtitle: {
    fontSize: 12,
    color: T.mute,
    marginTop: 2,
    lineHeight: 16,
  },

  // ── Blocked row ───────────────────────────────────────────────────────────────
  blockedRow: {
    paddingVertical: 12,
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    flexShrink: 0,
  },
  avatarInitial: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  blockedInfo: {
    flex: 1,
  },
  blockedName: {
    fontSize: 15,
    fontWeight: '600',
    color: T.ink,
    marginBottom: 2,
  },
  blockedMeta: {
    fontSize: 12,
    color: T.mute,
    lineHeight: 16,
  },
  unblockBtn: {
    borderWidth: 1,
    borderColor: T.hair,
    borderRadius: 100,
    paddingHorizontal: 14,
    paddingVertical: 7,
    flexShrink: 0,
  },
  unblockText: {
    fontSize: 13,
    color: T.ink,
    fontWeight: '500',
  },
});
