import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { T, FONTS } from '../../theme';
import Stepper from '../../components/Stepper';

const TEAL      = '#3D7A6A';
const TEAL_SOFT = '#D6EDE8';
const GREEN_DOT = '#3D8A5C';

// ─── Icons ───────────────────────────────────────────────────────────────────

function CameraIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"
        stroke={TEAL} strokeWidth={1.6} />
      <Circle cx="12" cy="13" r="4" stroke={TEAL} strokeWidth={1.6} />
    </Svg>
  );
}

function CardIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="5" width="20" height="14" rx="2" stroke={TEAL} strokeWidth={1.6} />
      <Path d="M2 10h20" stroke={TEAL} strokeWidth={1.6} />
      <Path d="M6 15h4" stroke={TEAL} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

function BriefcaseIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="7" width="20" height="14" rx="2" stroke={TEAL} strokeWidth={1.6} />
      <Path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke={TEAL} strokeWidth={1.6} />
      <Path d="M12 12v2M2 12h20" stroke={TEAL} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

function LinkedInIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="2" width="20" height="20" rx="4" stroke={TEAL} strokeWidth={1.6} />
      <Path d="M7 10v7M7 7.5v.01" stroke={TEAL} strokeWidth={2.2} strokeLinecap="round" />
      <Path d="M11 17v-3.5a2.5 2.5 0 015 0V17M11 10v7" stroke={TEAL} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}

function IdIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="5" width="20" height="14" rx="2" stroke={TEAL} strokeWidth={1.6} />
      <Circle cx="8" cy="12" r="2.5" stroke={TEAL} strokeWidth={1.4} />
      <Path d="M13 10h5M13 14h3" stroke={TEAL} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

function ChevronRight() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M9 18l6-6-6-6" stroke={T.hair2} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ─── Inline verified badge ────────────────────────────────────────────────────

function VerifyBadge({ label }) {
  return (
    <View style={styles.badge}>
      <Svg width={14} height={14} viewBox="0 0 14 14">
        <Circle cx="7" cy="7" r="7" fill={GREEN_DOT} />
        <Path d="M4 7l2 2 4-4" stroke="#fff" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
      <Text style={styles.badgeText}>{label}</Text>
    </View>
  );
}

// ─── Verify row ───────────────────────────────────────────────────────────────

function VerifyRow({ icon, title, badge, subtitle }) {
  return (
    <TouchableOpacity style={styles.row} activeOpacity={0.7}>
      <View style={styles.iconWrap}>{icon}</View>
      <View style={styles.rowBody}>
        <View style={styles.titleRow}>
          <Text style={styles.rowTitle}>{title}</Text>
          {badge && <VerifyBadge label={badge} />}
        </View>
        <Text style={styles.rowSub}>{subtitle}</Text>
      </View>
      <ChevronRight />
    </TouchableOpacity>
  );
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function VerifyScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Stepper current={15} total={15} />

        {/* Avatar */}
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>AT</Text>
          </View>
          <View style={styles.greenDot}>
            <Svg width={20} height={20} viewBox="0 0 20 20">
              <Circle cx="10" cy="10" r="10" fill={GREEN_DOT} />
              <Path d="M6 10l3 3 5-5" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </View>
        </View>

        <Text style={styles.title}>You're almost in, Anika</Text>
        <Text style={styles.subtitle}>A few quick steps to unlock matches.</Text>

        <Text style={styles.sectionLabel}>VERIFIED PROFILES CREATE TRUSTED CONNECTIONS</Text>

        <VerifyRow
          icon={<CameraIcon />}
          title="Verify your photo"
          subtitle="Selfie pose · 20 seconds"
        />
        <VerifyRow
          icon={<CardIcon />}
          title="Verify your visa"
          badge="GC"
          subtitle="Optional · adds H-1B / GC badge"
        />
        <VerifyRow
          icon={<BriefcaseIcon />}
          title="Verify your job"
          badge="JOB"
          subtitle="Work email · adds verified employer badge"
        />
        <VerifyRow
          icon={<LinkedInIcon />}
          title="Verify LinkedIn"
          badge="IN"
          subtitle="Connect to import your career history"
        />
        <VerifyRow
          icon={<IdIcon />}
          title="Verify your ID"
          badge="ID"
          subtitle="Government ID · matches see a verified badge"
        />

        <View style={{ height: 16 }} />
      </ScrollView>

      {/* Sticky CTA */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={() => navigation.navigate('MainTabs')}
          activeOpacity={0.86}
        >
          <Text style={styles.ctaText}>See your matches  &gt;</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  content: { paddingHorizontal: 24, paddingBottom: 8 },

  // ── Avatar ────────────────────────────────────────────────────────────────
  avatarWrap: {
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 20,
    position: 'relative',
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#F5EFE6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontFamily: FONTS.display,
    fontSize: 32,
    fontWeight: '600',
    color: T.ink2,
  },
  greenDot: {
    position: 'absolute',
    bottom: 0,
    right: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: T.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ── Text ──────────────────────────────────────────────────────────────────
  title: {
    fontFamily: FONTS.display,
    fontSize: 34,
    color: T.ink,
    lineHeight: 42,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: T.mute,
    lineHeight: 20,
    marginBottom: 20,
  },
  sectionLabel: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    letterSpacing: 1.0,
    textTransform: 'uppercase',
    color: T.mute,
    textAlign: 'center',
    marginBottom: 14,
  },

  // ── Verify row card ───────────────────────────────────────────────────────
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: T.hair2,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    backgroundColor: T.bg,
    gap: 12,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: TEAL_SOFT,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  rowBody: { flex: 1 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
    flexWrap: 'wrap',
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: T.ink,
  },
  rowSub: {
    fontSize: 13,
    color: T.mute,
    lineHeight: 18,
  },

  // ── Badge ─────────────────────────────────────────────────────────────────
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#DCEFE2',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: GREEN_DOT,
    letterSpacing: 0.3,
  },

  // ── Sticky footer ─────────────────────────────────────────────────────────
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 28,
    backgroundColor: T.bg,
  },
  ctaBtn: {
    height: 52,
    borderRadius: 100,
    backgroundColor: T.accent,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: T.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 0.2,
  },
});
